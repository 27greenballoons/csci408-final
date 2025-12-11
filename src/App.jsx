import React from 'react';
import './App.css';
import Login from './components/Login';
import FileUpload from './components/FileUpload';
import ColorPicker from './components/ColorPicker';


function App() {
  return (
    // The main wrapper is now just a container for the page flow
    <div className="App">
    
      <header>
        <nav>
          <ul>
            <li><a href="#color">Colors</a></li>
            <li><a href="#file-upload">File Upload</a></li>
            <li><a href="#login">Customer Login</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
      
        <section className="hero">
          <h1>Record Printer</h1>
          <p>Turning your favorite modern classics into a old-timey record!</p>
        </section>
        
        {/* 3. CENTERED CONTENT: The rest of the sections that should be constrained */}
        <div className="Content-Wrapper">
          <section id="color">
            <ColorPicker />
          </section>
          
          <section id="file-upload">
            <FileUpload />
          </section>
          
          <section id="login">
            <Login />
          </section>
          
        </div>
      </main>
      
    </div>
  );
}

export default App;