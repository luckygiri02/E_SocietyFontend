import React, { useState } from 'react';
import './SettingDrop.css';
import './media.css'; // Import the new CSS file

function SettingDrop() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select an option');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="setting-drop">
      <button 
        className="dropdown-button"
        onClick={toggleDropdown}
      >
        {selectedOption} &#9660;
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div 
            className="dropdown-item"
            onClick={() => handleSelectOption('Option 1')}
          >
            Option 1
          </div>
          <div 
            className="dropdown-item"
            onClick={() => handleSelectOption('Option 2')}
          >
            Option 2
          </div>
          <div 
            className="dropdown-item"
            onClick={() => handleSelectOption('Option 3')}
          >
            Option 3
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingDrop;
