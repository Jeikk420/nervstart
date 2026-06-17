import { motion, AnimatePresence } from "framer-motion";
import { Win98Window } from "./Win98Window";

/**
 * ⏳ Loading Component
 * Pantalla de carga con progreso
 */
export function Win98Loading({ query }) {
  const msgs = [
    "Iniciando scanner...",
    "Conectando con Jumbo...",
    "Revisando Santa Isabel...",
    "Accediendo a Tottus...",
    "Consultando Alvi...",
    "Verificando Acuenta...",
    "Procesando datos...",
  ];

  const [prog, setProg] = React.useState(0);
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    const iv1 = setInterval(() => setProg((p) => Math.min(p + 2, 95)), 1500);
    const iv2 = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 2500);
    return () => {
      clearInterval(iv1);
      clearInterval(iv2);
    };
  }, [msgs.length]);

  return (
    <Win98Window title="Escaneando precios..." icon="⏳" style={{ width: "100%", maxWidth: 460 }}>
      <div style={{ padding: "8px 4px" }}>
        <div
          style={{
            fontFamily: "'W95FA','Courier New',monospace",
            fontSize: 12,
            marginBottom: 8,
            color: "#000080",
          }}
        >
          Buscando: <strong>"{query}"</strong>
        </div>
        {/* Barra de progreso Win98 */}
        <div
          style={{
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            height: 18,
            background: "#fff",
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <motion.div
            animate={{ width: `${prog}%` }}
            transition={{ duration: 1 }}
            style={{
              height: "100%",
              background: "#000080",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: Math.floor(prog / 5) }).map((_, i) => (
              <div
                key={i}
                style={{
                  minWidth: 8,
                  height: "100%",
                  background: "#0000cc",
                  marginRight: 1,
                }}
              />
            ))}
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#444",
            }}
          >
            {msgs[msgIdx]}
          </motion.div>
        </AnimatePresence>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "#888",
            marginTop: 6,
          }}
        >
          Esto puede tomar 2-4 minutos...
        </div>
      </div>
    </Win98Window>
  );
}

import React from "react";
