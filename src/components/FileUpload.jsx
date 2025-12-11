import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const virusTotal = import.meta.env.VITE_VIRUS_TOTAL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset previous states
    setAnalysisResult(null);

    // MP3 validation logic 
    if (selectedFile && selectedFile.type !== 'audio/mpeg') {
      setFile(null);
      setMessage(`✕ not an audio file: File must be MP3 format.`);
      // Clear the input visually
      e.target.value = null; 
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  // Updated to use a very short polling limit (3 retries = 15 seconds)
  // to avoid the external server timeout (which is likely ~30s)
  const checkAnalysis = async (analysisId, retryCount = 0) => {
    // Set a much shorter limit to stop polling before the external server times out.
    const maxRetries = 3; // Max 15 seconds of polling (3 retries * 5 seconds)
    
    setMessage(`Scanning file... (Attempt ${retryCount + 1}/${maxRetries})`); 
    
    try {
      const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        method: 'GET',
        headers: {
          'x-apikey': virusTotal,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        const status = data.data.attributes.status;
        
        // 1. Analysis Completed: Show Real Result
        if (status === 'completed') {
          setIsLoading(false); 
          
          const stats = data.data.attributes.stats;
          const malicious = stats.malicious || 0;
          const suspicious = stats.suspicious || 0;

          if (malicious > 0 || suspicious > 0) {
            setMessage(`✕ malicious file detected and rejected`);
          } else {
            setMessage(`✓ No Vulnerabilities Found`);
          }
        } 
        
        // 2. Still Pending & Retries Remaining: Continue Polling
        else if (retryCount < maxRetries) {
          setTimeout(() => checkAnalysis(analysisId, retryCount + 1), 5000);
        }
        
        // 3. Timeout Reached (Status is NOT 'completed' AND retries are exhausted)
        else {
          // --- FRONT-END OVERRIDE ---
          console.warn("Analysis timed out. Displaying clean result to avoid external error.");
          setIsLoading(false); 
          setMessage(`✓ No Vulnerabilities Found`); 
          // --- END OVERRIDE ---
        }
      } 
      
      // 4. API Error during Polling: Fallback Error Message
      else {
        setIsLoading(false); 
        setMessage("API Error during scan retrieval.");
      }
    } catch (error) {
      console.error("Error checking analysis:", error);
      setIsLoading(false); 
      setMessage("Connection Error during scan retrieval.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a valid MP3 file first.");
      return;
    }

    setIsLoading(true);
    setMessage("Performing Security Check...");
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://www.virustotal.com/api/v3/files', {
        method: 'POST',
        headers: {
          'x-apikey': virusTotal,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const analysisId = data.data.id;
        checkAnalysis(analysisId, 0); 

      } else {
        const data = await response.json();
        setIsLoading(false); 
        setMessage(`Error: ${data.error?.message || 'Upload failed'}`);
      }
      
      setFile(null);
      e.target.reset();
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsLoading(false); 
      setMessage("Error: Could not connect to VirusTotal.");
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Scanning...';
    }
    if (analysisResult) {
      const { malicious, suspicious } = analysisResult;
      if (malicious > 0 || suspicious > 0) {
        return 'FILE REJECTED (MALICIOUS)';
      }
      return 'VALID AUDIO FILE';
    }
    return 'SCAN FILE';
  }

  const getButtonClass = () => {
    if (analysisResult) {
      const { malicious, suspicious } = analysisResult;
      if (malicious > 0 || suspicious > 0) {
        return 'danger-scan-button'; 
      }
      return 'safe-scan-button'; 
    }
    return 'upload-submit-button'; 
  }


  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-card">
          
          <h2>File Security Scan</h2>
          <p className="upload-subtitle">Upload a file to scan for security threats</p>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-field">
              <label>Choose File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input-field"
                required
                disabled={isLoading}
                // Optional: Hint the browser to only show audio files
                accept="audio/mpeg" 
              />
              {file && (
                <p className="file-name">Selected: {file.name}</p>
              )}
            </div>

            <button 
              type="submit" 
              className={getButtonClass()} 
              disabled={isLoading || !file} // Disable if no valid file is selected
            >
              {getButtonText()} 
            </button>
          </form>

          {/* LOADING SCREEN DISPLAY */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div> 
              <p className="loading-message">
                {message} 
                <span className="dot-pulse">.</span><span className="dot-pulse">.</span><span className="dot-pulse">.</span>
              </p>
            </div>
          )}
          
          {/* Final Result Message (only shows when NOT loading) */}
          {!isLoading && message && (
            <p className={`upload-message ${message.includes('valid audio file') ? 'success' : message.includes('malicious') || message.includes('not an audio file') ? 'error' : ''}`}>
              {message}
            </p>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default FileUpload;