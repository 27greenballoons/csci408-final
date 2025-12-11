// src/components/ColorPicker.jsx

import React, { useState, useEffect } from 'react';
import './ColorPicker.css';

// 8 Color options (You can adjust these)
const colorOptions = [
    { name: 'Default', hex: '#E0F2F1' }, // Light Teal (matches current UI style)
    { name: 'Blue', hex: '#BBDEFB' },
    { name: 'Red', hex: '#FFCDD2' },
    { name: 'Green', hex: '#C8E6C9' },
    { name: 'Purple', hex: '#E1BEE7' },
    { name: 'Orange', hex: '#FFE0B2' },
    { name: 'Cyan', hex: '#B2EBF2' },
    { name: 'Grey', hex: '#F5F5F5' },
];

// Key for Local Storage
const STORAGE_KEY = 'userFavoriteColor';

function ColorPicker() {
    // State to hold the currently selected color hex code
    const [selectedColor, setSelectedColor] = useState(colorOptions[0].hex);

    // --- EFFECT 1: Load color from Local Storage on initial load ---
    useEffect(() => {
        const storedColorHex = localStorage.getItem(STORAGE_KEY);
        if (storedColorHex) {
            setSelectedColor(storedColorHex);
        }
    }, []);

    // --- EFFECT 2: Apply color to the body/background whenever selectedColor changes ---
    useEffect(() => {
        // Apply the color to the document body background
        document.body.style.backgroundColor = selectedColor;

        // Save the chosen color to Local Storage
        localStorage.setItem(STORAGE_KEY, selectedColor);
    }, [selectedColor]);

    const handleColorChange = (hex) => {
        setSelectedColor(hex);
    };

    return (
        <div className="color-picker-container">
            <h3 className="picker-title">Choose Album Color:</h3>
            <div className="color-options-grid">
                {colorOptions.map((color) => (
                    <div
                        key={color.name}
                        className={`color-option ${selectedColor === color.hex ? 'selected' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => handleColorChange(color.hex)}
                        title={color.name}
                    >
                        {/* Optionally display a checkmark on the selected color */}
                        {selectedColor === color.hex && <span className="checkmark">✓</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ColorPicker;