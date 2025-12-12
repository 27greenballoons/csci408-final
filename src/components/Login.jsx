import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {

    console.log("FORM SUBMITTED");

    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.message.includes('success')) {
        onLoginSuccess();
      }

      // Optional: reset fields
      setUsername('');
      setPassword('');

    } catch (error) {
      console.error("Error submitting login:", error);
      setMessage("Error: Could not connect to server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Finalize Your Order</h2>
          <p className="login-subtitle">Sign in to your account</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          
          {message && (
            <p className={`login-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
