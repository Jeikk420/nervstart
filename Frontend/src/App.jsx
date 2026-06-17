import { AnimatePresence, motion } from "framer-motion";
import { BinaryRain } from "./components/BinaryRain";
import { Ornament } from "./components/Ornament";
import { Win98Window } from "./components/Win98Window";
import { Win98Button } from "./components/Win98Button";
import { Win98Input } from "./components/Win98Input";
import { Win98Loading } from "./components/Win98Loading";
import { ResultRow } from "./components/ResultRow";
import { useSearch } from "./hooks/useSearch";

export default function App() {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    searched,
    history,
    clearHistory,
    handleSearch,
  } = useSearch();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    handleSearch(query);
  };

  const maxPrecio =
    results.length > 0
      ? Math.max(...results.map((r) => r.precioNumero))
      : 0;

  const SUGERENCIAS = [
    "coca cola 3 litros",
    "ketchup heinz",
    "arroz",
    "leche entera",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0ebe0",
        backgroundImage: `
          radial-gradient(circle at 20% 20%, #e8f4f8 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #e0eef4 0%, transparent 50%)
        `,
        fontFamily: "'W95FA','Courier New',monospace",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Estilos globales */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
        input::placeholder { color:#808080; font-style:italic; }
        ::-webkit-scrollbar { width:16px; }
        ::-webkit-scrollbar-track { background:#d4d0c8; border:1px solid #808080; }
        ::-webkit-scrollbar-thumb { background:#808080; border:1px solid #fff; }
      `}</style>

      {/* Lluvia binaria */}
      <BinaryRain />

      {/* Ornamentos laterales */}
      <div
        style={{
          position: "fixed",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        <Ornament />
      </div>
      <div
        style={{
          position: "fixed",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        <Ornament flip />
      </div>

      {/* Emoji decorativos */}
      <div
        style={{
          position: "fixed",
          bottom: 8,
          left: 8,
          zIndex: 2,
          fontSize: 32,
          opacity: 0.5,
        }}
      >
        🎤
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 8,
          right: 8,
          zIndex: 2,
          fontSize: 32,
          opacity: 0.5,
        }}
      >
        🎵
      </div>

      {/* SYNCING indicator */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 80,
          zIndex: 3,
          background: "#d4d0c8",
          border: "2px solid",
          borderColor: "#fff #808080 #808080 #fff",
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          fontFamily: "monospace",
          boxShadow: "1px 1px 0 #000",
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: 8,
            height: 8,
            background: "#00cc00",
            borderRadius: "50%",
          }}
        />
        SYNCING...
      </div>

      {/* Contenido principal */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 560,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#d4d0c8",
              border: "3px solid",
              borderColor: "#fff #808080 #808080 #fff",
              padding: "8px 16px",
              boxShadow: "3px 3px 0 #000",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 36 }}>🤖</div>
          </div>

          <h1
            style={{
              fontFamily: "'VT323',monospace",
              fontSize: "clamp(32px,6vw,52px)",
              color: "#000080",
              textShadow: "2px 2px 0 #00aacc44",
              letterSpacing: "0.1em",
              margin: "0 0 4px",
            }}
          >
            ESCÁNER DE PRECIOS
          </h1>

          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#000080",
              letterSpacing: "0.2em",
              opacity: 0.7,
            }}
          >
            JUMBO · SANTA ISABEL · TOTTUS · ALVI · ACUENTA
          </div>

          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg,transparent,#000080,#00aacc,#000080,transparent)",
              margin: "12px 0 0",
            }}
          />
        </motion.div>

        {/* ── VENTANA BUSCADOR ── */}
        <Win98Window title="Buscar producto" icon="🔍" style={{ marginBottom: 20 }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ marginBottom: 8 }}>
              <Win98Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ej: leche soprole 1 litro..."
                disabled={loading}
              />
            </div>

            {/* Sugerencias */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  disabled={loading}
                  style={{
                    background: "#d4d0c8",
                    border: "1px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    padding: "2px 8px",
                    fontSize: 10,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    color: "#000080",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Historial */}
            {history.length > 0 && (
              <div style={{ marginBottom: 10, fontSize: 10, color: "#666" }}>
                <div style={{ marginBottom: 4 }}>Historial reciente:</div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                  }}
                >
                  {history.slice(0, 5).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setQuery(h)}
                      disabled={loading}
                      style={{
                        background: "#ffffcc",
                        border: "1px solid #999",
                        padding: "2px 6px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        cursor: "pointer",
                        color: "#333",
                      }}
                    >
                      {h}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearHistory}
                    style={{
                      background: "#ffcccc",
                      border: "1px solid #999",
                      padding: "2px 6px",
                      fontSize: 9,
                      fontFamily: "monospace",
                      cursor: "pointer",
                      color: "#333",
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Win98Button disabled={loading}>
                {loading ? "Buscando..." : "[ BUSCAR ]"}
              </Win98Button>
            </div>
          </form>
        </Win98Window>

        {/* ── LOADING ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: 20 }}
            >
              <Win98Loading query={searched} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: 20 }}
            >
              <Win98Window
                title="Error"
                icon="⚠️"
                style={{ borderColor: "#ff0000 #800000 #800000 #ff0000" }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#cc0000",
                  }}
                >
                  ⚠ {error}
                </div>
              </Win98Window>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTADOS ── */}
        <AnimatePresence>
          {results.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Win98Window title={`Resultados: "${searched}"`} icon="📊">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "#808080",
                  }}
                >
                  <span>TIENDAS ENCONTRADAS: {results.length}</span>
                  <span>ORDENADO: MENOR A MAYOR</span>
                </div>

                {results.map((item, i) => (
                  <ResultRow
                    key={item.tienda}
                    index={i}
                    tienda={item.tienda}
                    precioTexto={item.precioTexto}
                    precioNumero={item.precioNumero}
                    esMejor={i === 0}
                    maxPrecio={maxPrecio}
                  />
                ))}

                {results.length > 1 &&
                  maxPrecio > results[0].precioNumero && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: results.length * 0.1 + 0.2,
                      }}
                      style={{
                        marginTop: 10,
                        background: "#000080",
                        border: "2px solid",
                        borderColor: "#4040ff #000040 #000040 #4040ff",
                        padding: "8px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      >
                        💰 MEJOR PRECIO EN{" "}
                        {results[0].tienda.toUpperCase()}
                      </span>
                      <span
                        style={{
                          color: "#00ffcc",
                          fontFamily: "'VT323',monospace",
                          fontSize: 22,
                          textShadow: "0 0 8px #00ffcc80",
                        }}
                      >
                        AHORRAS $
                        {(maxPrecio - results[0].precioNumero).toLocaleString(
                          "es-CL"
                        )}
                      </span>
                    </motion.div>
                  )}
              </Win98Window>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DATA SHREDDING footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            fontFamily: "monospace",
            fontSize: 10,
            color: "#00008080",
            letterSpacing: "0.15em",
          }}
        >
          DATA SHREDDING &lt;3 · I'M NOT A MONSTER, I'M A PLANT
        </div>
      </div>
    </div>
  );
}
