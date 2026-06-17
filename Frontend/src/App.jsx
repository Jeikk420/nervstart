import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// ── Fondo binario animado ────────────────────────────────────
function BinaryRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const cols = Math.floor(canvas.width / 18);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const draw = () => {
      ctx.fillStyle = "rgba(240,235,220,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00aacc22";
      ctx.font = "12px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(char, i * 18, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.3;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }} />;
}

// ── Ornamento SVG estilo gótico/Art Nouveau ──────────────────
function Ornament({ flip = false, side = "left" }) {
  const s = flip ? "scale(-1,1)" : "scale(1,1)";
  return (
    <svg width="90" height="320" viewBox="0 0 90 320" style={{ opacity: 0.35 }}>
      <g transform={s} fill="none" stroke="#00aacc" strokeWidth="1">
        <path d="M45 0 C45 0 20 40 20 80 C20 120 45 140 45 160 C45 180 20 200 20 240 C20 280 45 320 45 320" />
        <path d="M45 0 C45 0 70 40 70 80 C70 120 45 140 45 160 C45 180 70 200 70 240 C70 280 45 320 45 320" />
        <circle cx="45" cy="80"  r="8" stroke="#00aacc" fill="#00aacc11" />
        <circle cx="45" cy="160" r="12" stroke="#00aacc" fill="#00aacc11" />
        <circle cx="45" cy="240" r="8" stroke="#00aacc" fill="#00aacc11" />
        <path d="M25 80 C15 70 5 75 10 85 C15 95 30 88 25 80Z" fill="#00aacc22" />
        <path d="M65 80 C75 70 85 75 80 85 C75 95 60 88 65 80Z" fill="#00aacc22" />
        <path d="M20 160 C5 150 0 160 5 170 C10 180 25 170 20 160Z" fill="#00aacc22" />
        <path d="M70 160 C85 150 90 160 85 170 C80 180 65 170 70 160Z" fill="#00aacc22" />
        <path d="M25 240 C15 230 5 235 10 245 C15 255 30 248 25 240Z" fill="#00aacc22" />
        <path d="M65 240 C75 230 85 235 80 245 C75 255 60 248 65 240Z" fill="#00aacc22" />
        <line x1="10" y1="80" x2="35" y2="80" stroke="#00aacc66" />
        <line x1="55" y1="80" x2="80" y2="80" stroke="#00aacc66" />
        <line x1="5"  y1="160" x2="33" y2="160" stroke="#00aacc66" />
        <line x1="57" y1="160" x2="85" y2="160" stroke="#00aacc66" />
      </g>
    </svg>
  );
}

// ── Ventana Windows 98 ───────────────────────────────────────
function Win98Window({ title, icon, children, style = {} }) {
  return (
    <div style={{
      background: "#d4d0c8",
      border: "2px solid",
      borderColor: "#ffffff #808080 #808080 #ffffff",
      boxShadow: "2px 2px 0 #000",
      fontFamily: "'W95FA', 'Courier New', monospace",
      ...style,
    }}>
      {/* Barra de título */}
      <div style={{
        background: "linear-gradient(90deg, #000080, #1084d0)",
        padding: "3px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, color:"#fff", fontSize:12, fontWeight:"bold" }}>
          <span>{icon}</span>
          <span style={{ fontFamily:"'W95FA','Courier New',monospace" }}>{title}</span>
        </div>
        <div style={{ display:"flex", gap:2 }}>
          {["_","□","×"].map(b=>(
            <div key={b} style={{
              width:16,height:14,background:"#d4d0c8",
              border:"1px solid",borderColor:"#fff #808080 #808080 #fff",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:10,cursor:"pointer",color:"#000",fontWeight:"bold",
            }}>{b}</div>
          ))}
        </div>
      </div>
      {/* Contenido */}
      <div style={{ padding:"8px" }}>{children}</div>
    </div>
  );
}

// ── Botón Windows 98 ─────────────────────────────────────────
function Win98Button({ children, onClick, disabled, style={} }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={()=>setPressed(true)}
      onMouseUp={()=>setPressed(false)}
      onMouseLeave={()=>setPressed(false)}
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

// ── Input Windows 98 ─────────────────────────────────────────
function Win98Input({ value, onChange, placeholder, disabled }) {
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

// ── Tarjeta de resultado estilo Win98 ────────────────────────
function ResultRow({ tienda, precioTexto, precioNumero, index, esMejor, maxPrecio }) {
  const LOGOS = { Jumbo:"🛒", Santaisabel:"🏪", Tottus:"🦁", Alvi:"🏬", Acuenta:"💼" };
  const barPct = maxPrecio ? Math.round((precioNumero/maxPrecio)*100) : 100;

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.1 }}
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
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:18 }}>{LOGOS[tienda] || "🏷"}</span>
        <div>
          <div style={{
            fontFamily:"'W95FA','Courier New',monospace",
            fontSize:13, fontWeight:"bold",
            color: esMejor ? "#ffffff" : "#000080",
          }}>
            {tienda.toUpperCase()}
          </div>
          {/* Barra de precio */}
          <div style={{ width:100, height:4, background:"#00000022", marginTop:3 }}>
            <div style={{ width:`${barPct}%`, height:"100%", background: esMejor?"#00ffcc":"#000080" }} />
          </div>
        </div>
      </div>
      <div style={{
        fontFamily:"'W95FA','Courier New',monospace",
        fontSize: esMejor?18:14,
        fontWeight:"bold",
        color: esMejor?"#00ffcc":"#000",
        background: esMejor?"transparent":"#ffffff88",
        padding:"2px 8px",
        border: esMejor?"1px solid #00ffcc44":"1px solid #80808088",
      }}>
        {precioTexto}
      </div>
    </motion.div>
  );
}

// ── Loading Win98 ────────────────────────────────────────────
function Win98Loading({ query }) {
  const [prog, setProg] = useState(0);
  const msgs = ["Iniciando scanner...","Conectando con Jumbo...","Revisando Santa Isabel...","Accediendo a Tottus...","Consultando Alvi...","Verificando Acuenta...","Procesando datos..."];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv1 = setInterval(() => setProg(p => Math.min(p+2, 95)), 1500);
    const iv2 = setInterval(() => setMsgIdx(i=>(i+1)%msgs.length), 2500);
    return () => { clearInterval(iv1); clearInterval(iv2); };
  }, []);

  return (
    <Win98Window title="Escaneando precios..." icon="⏳" style={{ width:"100%", maxWidth:460 }}>
      <div style={{ padding:"8px 4px" }}>
        <div style={{ fontFamily:"'W95FA','Courier New',monospace", fontSize:12, marginBottom:8, color:"#000080" }}>
          Buscando: <strong>"{query}"</strong>
        </div>
        {/* Barra de progreso Win98 */}
        <div style={{
          border:"2px solid", borderColor:"#808080 #fff #fff #808080",
          height:18, background:"#fff", overflow:"hidden", marginBottom:8,
        }}>
          <motion.div
            animate={{ width:`${prog}%` }}
            transition={{ duration:1 }}
            style={{ height:"100%", background:"#000080", display:"flex", alignItems:"center", overflow:"hidden" }}
          >
            {Array.from({length:Math.floor(prog/5)}).map((_,i)=>(
              <div key={i} style={{ minWidth:8, height:"100%", background:"#0000cc", marginRight:1 }} />
            ))}
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            style={{ fontFamily:"monospace", fontSize:11, color:"#444" }}
          >
            {msgs[msgIdx]}
          </motion.div>
        </AnimatePresence>
        <div style={{ fontFamily:"monospace", fontSize:10, color:"#888", marginTop:6 }}>
          Esto puede tomar 2-4 minutos...
        </div>
      </div>
    </Win98Window>
  );
}

// ── App principal ─────────────────────────────────────────────
export default function App() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [searched, setSearched] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true); setError(null); setResults([]); setSearched(query.trim());
    try {
      const res = await axios.post("http://localhost:3000/buscar", { producto: query.trim() }, { timeout:600000 });
      const sorted = Object.entries(res.data)
        .filter(([,v])=>v)
        .map(([tienda,data])=>({ tienda:tienda.charAt(0).toUpperCase()+tienda.slice(1), precioTexto:data.texto, precioNumero:data.numero }))
        .sort((a,b)=>a.precioNumero-b.precioNumero);
      setResults(sorted);
      if (!sorted.length) setError("Producto no encontrado en ninguna tienda. Intenta con un nombre más corto.");
    } catch(err) {
      if (err.code==="ECONNABORTED") setError("La búsqueda tardó demasiado. Intenta de nuevo.");
      else if (err.response) setError(`Error: ${err.response.data?.error||"desconocido"}`);
      else setError("No se pudo conectar con el servidor. ¿Está corriendo node server.js?");
    } finally { setLoading(false); }
  };

  const maxPrecio = results.length ? Math.max(...results.map(r=>r.precioNumero)) : 0;

  return (
    <div style={{
      minHeight:"100vh",
      background:"#f0ebe0",
      backgroundImage:`
        radial-gradient(circle at 20% 20%, #e8f4f8 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, #e0eef4 0%, transparent 50%)
      `,
      fontFamily:"'W95FA','Courier New',monospace",
      position:"relative",
      overflowX:"hidden",
    }}>
      {/* Fuentes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
        input::placeholder { color:#808080; font-style:italic; }
        ::-webkit-scrollbar { width:16px; }
        ::-webkit-scrollbar-track { background:#d4d0c8; border:1px solid #808080; }
        ::-webkit-scrollbar-thumb { background:#808080; border:1px solid #fff; }
      `}</style>

      {/* Lluvia binaria de fondo */}
      <BinaryRain />

      {/* Ornamentos laterales */}
      <div style={{ position:"fixed", left:8, top:"50%", transform:"translateY(-50%)", zIndex:1 }}>
        <Ornament />
      </div>
      <div style={{ position:"fixed", right:8, top:"50%", transform:"translateY(-50%)", zIndex:1 }}>
        <Ornament flip />
      </div>

      {/* Miku esquina inferior izquierda */}
      <div style={{ position:"fixed", bottom:8, left:8, zIndex:2, fontSize:32, opacity:0.5 }}>🎤</div>
      {/* Miku esquina inferior derecha */}
      <div style={{ position:"fixed", bottom:8, right:8, zIndex:2, fontSize:32, opacity:0.5 }}>🎵</div>

      {/* SYNCING indicator */}
      <div style={{
        position:"fixed", top:12, right:80, zIndex:3,
        background:"#d4d0c8", border:"2px solid", borderColor:"#fff #808080 #808080 #fff",
        padding:"4px 10px", display:"flex", alignItems:"center", gap:8,
        fontSize:11, fontFamily:"monospace",
        boxShadow:"1px 1px 0 #000",
      }}>
        <motion.div
          animate={{ opacity:[1,0,1] }}
          transition={{ duration:1.5, repeat:Infinity }}
          style={{ width:8, height:8, background:"#00cc00", borderRadius:"50%" }}
        />
        SYNCING...
      </div>

      {/* Contenido principal */}
      <div style={{ position:"relative", zIndex:2, maxWidth:560, margin:"0 auto", padding:"40px 24px 80px" }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          style={{ textAlign:"center", marginBottom:32 }}
        >
          {/* Logo Win98 */}
          <div style={{
            display:"inline-block",
            background:"#d4d0c8",
            border:"3px solid", borderColor:"#fff #808080 #808080 #fff",
            padding:"8px 16px",
            boxShadow:"3px 3px 0 #000",
            marginBottom:16,
          }}>
            <div style={{ fontSize:36 }}>🤖</div>
          </div>

          <h1 style={{
            fontFamily:"'VT323',monospace",
            fontSize:"clamp(32px,6vw,52px)",
            color:"#000080",
            textShadow:"2px 2px 0 #00aacc44",
            letterSpacing:"0.1em",
            margin:"0 0 4px",
          }}>
            ESCÁNER DE PRECIOS
          </h1>

          <div style={{
            fontFamily:"monospace", fontSize:11,
            color:"#000080", letterSpacing:"0.2em", opacity:0.7,
          }}>
            JUMBO · SANTA ISABEL · TOTTUS · ALVI · ACUENTA
          </div>

          {/* Línea decorativa Win98 */}
          <div style={{
            height:2, background:"linear-gradient(90deg,transparent,#000080,#00aacc,#000080,transparent)",
            margin:"12px 0 0",
          }} />
        </motion.div>

        {/* ── VENTANA BUSCADOR ── */}
        <Win98Window title="Buscar producto" icon="🔍" style={{ marginBottom:20 }}>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom:8 }}>
              <Win98Input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="ej: leche soprole 1 litro..."
                disabled={loading}
              />
            </div>

            {/* Sugerencias */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
              {["coca cola 3 litros","ketchup heinz","arroz","leche entera"].map(s=>(
                <button key={s} type="button" onClick={()=>setQuery(s)} disabled={loading}
                  style={{
                    background:"#d4d0c8", border:"1px solid",
                    borderColor:"#fff #808080 #808080 #fff",
                    padding:"2px 8px", fontSize:10,
                    fontFamily:"monospace", cursor:"pointer",
                    color:"#000080",
                  }}
                >{s}</button>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <Win98Button disabled={loading}>
                {loading ? "Buscando..." : "[ BUSCAR ]"}
              </Win98Button>
            </div>
          </form>
        </Win98Window>

        {/* ── LOADING ── */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{marginBottom:20}}>
              <Win98Loading query={searched} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{marginBottom:20}}>
              <Win98Window title="Error" icon="⚠️" style={{ borderColor:"#ff0000 #800000 #800000 #ff0000" }}>
                <div style={{ fontFamily:"monospace", fontSize:12, color:"#cc0000" }}>
                  ⚠ {error}
                </div>
              </Win98Window>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTADOS ── */}
        <AnimatePresence>
          {results.length > 0 && !loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <Win98Window
                title={`Resultados: "${searched}"`}
                icon="📊"
              >
                <div style={{
                  display:"flex", justifyContent:"space-between",
                  marginBottom:8, fontSize:10, fontFamily:"monospace", color:"#808080",
                }}>
                  <span>TIENDAS ENCONTRADAS: {results.length}</span>
                  <span>ORDENADO: MENOR A MAYOR</span>
                </div>

                {results.map((item,i)=>(
                  <ResultRow
                    key={item.tienda}
                    index={i}
                    tienda={item.tienda}
                    precioTexto={item.precioTexto}
                    precioNumero={item.precioNumero}
                    esMejor={i===0}
                    maxPrecio={maxPrecio}
                  />
                ))}

                {results.length>1 && maxPrecio>results[0].precioNumero && (
                  <motion.div
                    initial={{opacity:0}} animate={{opacity:1}}
                    transition={{delay:results.length*0.1+0.2}}
                    style={{
                      marginTop:10,
                      background:"#000080",
                      border:"2px solid", borderColor:"#4040ff #000040 #000040 #4040ff",
                      padding:"8px 12px",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                    }}
                  >
                    <span style={{ color:"#fff", fontFamily:"monospace", fontSize:12 }}>
                      💰 MEJOR PRECIO EN {results[0].tienda.toUpperCase()}
                    </span>
                    <span style={{
                      color:"#00ffcc", fontFamily:"'VT323',monospace", fontSize:22,
                      textShadow:"0 0 8px #00ffcc80",
                    }}>
                      AHORRAS ${(maxPrecio-results[0].precioNumero).toLocaleString("es-CL")}
                    </span>
                  </motion.div>
                )}
              </Win98Window>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DATA SHREDDING footer */}
        <div style={{
          textAlign:"center", marginTop:32,
          fontFamily:"monospace", fontSize:10, color:"#00008080",
          letterSpacing:"0.15em",
        }}>
          DATA SHREDDING &lt;3 · I'M NOT A MONSTER, I'M A PLANT
        </div>
      </div>
    </div>
  );
}