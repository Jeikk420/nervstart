import { motion } from "framer-motion";

/**
 * 📊 Result Row Component
 * Tarjeta de resultado de cada tienda
 */
export function ResultRow({
  tienda,
  precioTexto,
  precioNumero,
  index,
  esMejor,
  maxPrecio,
}) {
  const LOGOS = {
    Jumbo: "🛒",
    Santaisabel: "🏪",
    Tottus: "🦁",
    Alvi: "🏬",
    Acuenta: "💼",
  };
  const barPct = maxPrecio ? Math.round((precioNumero / maxPrecio) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        background: esMejor ? "#000080" : "#d4d0c8",
        border: "2px solid",
        borderColor: esMejor
          ? "#4040ff #000040 #000040 #4040ff"
          : "#ffffff #808080 #808080 #ffffff",
        padding: "6px 10px",
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        boxShadow: esMejor ? "2px 2px 0 #000040" : "1px 1px 0 #000",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{LOGOS[tienda] || "🏷"}</span>
        <div>
          <div
            style={{
              fontFamily: "'W95FA','Courier New',monospace",
              fontSize: 13,
              fontWeight: "bold",
              color: esMejor ? "#ffffff" : "#000080",
            }}
          >
            {tienda.toUpperCase()}
          </div>
          {/* Barra de precio */}
          <div
            style={{
              width: 100,
              height: 4,
              background: "#00000022",
              marginTop: 3,
            }}
          >
            <div
              style={{
                width: `${barPct}%`,
                height: "100%",
                background: esMejor ? "#00ffcc" : "#000080",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: "'W95FA','Courier New',monospace",
          fontSize: esMejor ? 18 : 14,
          fontWeight: "bold",
          color: esMejor ? "#00ffcc" : "#000",
          background: esMejor ? "transparent" : "#ffffff88",
          padding: "2px 8px",
          border: esMejor ? "1px solid #00ffcc44" : "1px solid #80808088",
        }}
      >
        {precioTexto}
      </div>
    </motion.div>
  );
}
