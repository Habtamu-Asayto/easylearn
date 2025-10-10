import React, { useState } from "react";

const ToggleButton = ({ label, onChange, initialState = false }) => {
  const [enabled, setEnabled] = useState(initialState);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center gap-3 cursor-pointer select-none`}
    >
      <div
        className={`w-12 h-7 flex items-center rounded-full p-1 transition-all duration-300 
        ${enabled ? "bg-blue-600" : "bg-gray-300"}
        `}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          enabled ? "text-blue-700" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default ToggleButton;
