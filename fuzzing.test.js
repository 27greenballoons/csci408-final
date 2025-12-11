import { fc, test, expect } from 'fast-check';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
// Ensure this path matches the location of your FileUpload.jsx component
import FileUpload from './src/components/FileUpload'; 

// --- MOCKING SETUP ---
global.fetch = vi.fn();
const mockVirusTotalKey = 'A-TEST-KEY-12345';

vi.stubGlobal('import.meta.env', {
    VITE_VIRUS_TOTAL: mockVirusTotalKey,
});

// --- INPUT GENERATORS ---

const arbitraryMimeType = fc.stringOf(fc.char(), { minLength: 0, maxLength: 30 })
    .filter(mime => mime !== 'audio/mpeg');

const arbitraryApiKey = fc.stringOf(fc.ascii(), { minLength: 0, maxLength: 50 });

const arbitraryMalformedJson = fc.oneof(
    fc.string(1, 100),
    fc.record({ bad: fc.string(), nested: fc.integer() }),
    fc.record({ data: fc.record({ attributes: fc.string() }) })
);

// =========================================================================
// FUZZING TESTS
// =========================================================================

// --- A. FUZZING THE FILE INPUT (handleFileChange) ---
test.prop([arbitraryMimeType], 'Fuzz: handleFileChange rejects all non-MP3 MIME types', (fuzzedMime) => {
    
    // Call render() once per test run
    const { rerender } = render(<FileUpload />);
    
    if (!fuzzedMime) return; 

    const mockFile = new Blob(['audio_data'], { type: fuzzedMime });
    mockFile.name = 'fuzzed_file';
    
    const fileInput = screen.getByLabelText(/Choose File/i);
    
    fireEvent.change(fileInput, {
        target: { files: [mockFile] },
    });
    
    expect(screen.getByText(/✕ not an audio file/i)).toBeInTheDocument();

    rerender(<FileUpload />);
});


// --- B. FUZZING THE API KEY CONFIGURATION (handleSubmit) ---
test.prop([arbitraryApiKey], 'Fuzz: handleSubmit handles malformed or missing API key', async (fuzzedKey) => {
    
    vi.stubGlobal('import.meta.env', {
        VITE_VIRUS_TOTAL: fuzzedKey,
    });
    
    const mockFile = new Blob(['valid_data'], { type: 'audio/mpeg' });
    mockFile.name = 'valid.mp3';

    render(<FileUpload />);
    
    const fileInput = screen.getByLabelText(/Choose File/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    const scanButton = screen.getByText('SCAN FILE');
    fireEvent.click(scanButton);

    expect(await screen.findByText(/Error: Could not connect to VirusTotal/i)).toBeInTheDocument();
});


// --- C. FUZZING MALFORMED VIRUSTOTAL RESPONSES (checkAnalysis) ---
test.prop([arbitraryMalformedJson], 'Fuzz: checkAnalysis handles malformed VirusTotal responses', async (fuzzedJson) => {
    
    // Mock initial upload success
    global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: { id: 'analysisId' } }),
    })
    // Mock malformed polling response
    .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => fuzzedJson, 
    });

    const mockFile = new Blob(['valid_data'], { type: 'audio/mpeg' });
    mockFile.name = 'valid.mp3';

    render(<FileUpload />);
    
    const fileInput = screen.getByLabelText(/Choose File/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    const scanButton = screen.getByText('SCAN FILE');
    fireEvent.click(scanButton);

    expect(await screen.findByText(/Connection Error during scan retrieval/i)).toBeInTheDocument();
});