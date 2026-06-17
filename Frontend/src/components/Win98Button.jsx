import { useState } from "react";

/**
 * 🔘 Windows 98 Button
 */
export function Win98Button({ children, onClick, disabled, style = {} }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: "#d4d0c8",
        border: "2px solid",
        borderColor: pressed
          ? "#808080 #ffffff #ffffff #808080"
          : "#ffffff #808080 #808080 #ffffff",
        padding: "4px 16px",
        fontFamily: "'W95FA','Courier New',monospace",
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#808080" : "#000",
        boxShadow: pressed ? "none" : "1px 1px 0 #000",
        transform: pressed ? "translate(1px,1px)" : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
