/**
 * 🪟 Windows 98 Window Component
 * Ventana con estilo Windows 98
 */
export function Win98Window({ title, icon, children, style = {} }) {
  return (
    <div
      style={{
        background: "#d4d0c8",
        border: "2px solid",
        borderColor: "#ffffff #808080 #808080 #ffffff",
        boxShadow: "2px 2px 0 #000",
        fontFamily: "'W95FA', 'Courier New', monospace",
        ...style,
      }}
    >
      {/* Barra de título */}
      <div
        style={{
          background: "linear-gradient(90deg, #000080, #1084d0)",
          padding: "3px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          <span>{icon}</span>
          <span style={{ fontFamily: "'W95FA','Courier New',monospace" }}>
            {title}
          </span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {["_", "□", "×"].map((b) => (
            <div
              key={b}
              style={{
                width: 16,
                height: 14,
                background: "#d4d0c8",
                border: "1px solid",
                borderColor: "#fff #808080 #808080 #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                cursor: "pointer",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
      {/* Contenido */}
      <div style={{ padding: "8px" }}>{children}</div>
    </div>
  );
}
