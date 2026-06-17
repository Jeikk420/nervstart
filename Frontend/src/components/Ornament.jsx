/**
 * 🎨 Ornament SVG
 * Decoraciones góticas/Art Nouveau en los lados
 */
export function Ornament({ flip = false }) {
  const s = flip ? "scale(-1,1)" : "scale(1,1)";
  
  return (
    <svg
      width="90"
      height="320"
      viewBox="0 0 90 320"
      style={{ opacity: 0.35 }}
    >
      <g transform={s} fill="none" stroke="#00aacc" strokeWidth="1">
        <path d="M45 0 C45 0 20 40 20 80 C20 120 45 140 45 160 C45 180 20 200 20 240 C20 280 45 320 45 320" />
        <path d="M45 0 C45 0 70 40 70 80 C70 120 45 140 45 160 C45 180 70 200 70 240 C70 280 45 320 45 320" />
        <circle cx="45" cy="80" r="8" stroke="#00aacc" fill="#00aacc11" />
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
        <line x1="5" y1="160" x2="33" y2="160" stroke="#00aacc66" />
        <line x1="57" y1="160" x2="85" y2="160" stroke="#00aacc66" />
      </g>
    </svg>
  );
}
