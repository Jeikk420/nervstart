/**
 * ⌨️ Windows 98 Input
 */
export function Win98Input({ value, onChange, placeholder, disabled }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        background: "#fff",
        border: "2px solid",
        borderColor: "#808080 #ffffff #ffffff #808080",
        padding: "4px 8px",
        fontFamily: "'W95FA','Courier New',monospace",
        fontSize: 13,
        width: "100%",
        boxSizing: "border-box",
        outline: "none",
        color: "#000",
      }}
    />
  );
}
