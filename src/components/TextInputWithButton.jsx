import React from "react";

function TextInputWithButton({value, onChange, onSave, buttonLabel, placeholder}) {
    return (
        <div>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
        <button onClick={onSave}>{buttonLabel}</button>
    </div> 
    )
}
export default TextInputWithButton;