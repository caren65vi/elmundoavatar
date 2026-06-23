import "./Seasons.css";
import { useState, useEffect } from "react";
import { db } from "../../Firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { bookWaterEpisodes, bookEarthEpisodes, bookFireEpisodes } from "../../episodesData";
import { Play } from "lucide-react";

const BOOK_META = {
  1: { title: "Libro Uno: Agua",  subtitle: "El viaje para dominar el Agua Control y viajar al Polo Norte.", symbol: "🌊", theme: "theme-agua",   fallback: bookWaterEpisodes },
  2: { title: "Libro Dos: Tierra", subtitle: "Aang busca una maestra de Tierra Control y defiende Ba Sing Se.", symbol: "🌱", theme: "theme-tierra", fallback: bookEarthEpisodes },
  3: { title: "Libro Tres: Fuego", subtitle: "Infiltrados en el imperio, preparándose para la batalla del cometa.", symbol: "🔥", theme: "theme-fuego",  fallback: bookFireEpisodes },
};

export default function Seasons({ bookNumber, onFindSymbol, foundSymbols }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const meta = BOOK_META[bookNumber] || BOOK_META[1];

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const q = query(
          collection(db, "episodios"),
          where("book", "==", bookNumber),
          orderBy("id", "asc")
        );
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach((doc) => data.push({ ...doc.data() }));
        setEpisodes(data.length > 0 ? data : meta.fallback);
      } catch (err) {
        console.warn("Firestore episodes blocked, using local data:", err);
        setEpisodes(meta.fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [bookNumber]);

  const linkBase = "https://cuevana3.ch/search.html?q=Avatar+La+Leyenda+de+Aang";

  if (loading) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando episodios del {meta.title}...</div>;
  }

  return (
    <div className={`seasons-container ${meta.theme}`} style={{ position: "relative" }}>
      {/* Animated background decorations */}
      <div className="seasons-deco-layer">
        {bookNumber === 1 && (
          <div className="water-waves-deco">
            <div className="wave wave-1" />
            <div className="wave wave-2" />
          </div>
        )}
        {bookNumber === 2 && (
          <div className="earth-rocks-deco">
            <div className="floating-rock rock-1">⛰️</div>
            <div className="floating-rock rock-2">🪨</div>
            <div className="floating-rock rock-3">⛰️</div>
          </div>
        )}
        {bookNumber === 3 && (
          <div className="fire-flames-deco">
            <div className="flame-border left" />
            <div className="flame-border right" />
          </div>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: "35px", textAlign: "left" }}>
          <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
            {bookNumber === 1
              ? <img src="/escudoAgua.png" alt="Agua" style={{ width: "2rem", height: "2rem", objectFit: "contain", verticalAlign: "middle", marginRight: "8px", borderRadius: "50%", mixBlendMode: "multiply" }} />
              : bookNumber === 2
                ? <img src="/escudoTierra.png" alt="Tierra" style={{ width: "2rem", height: "2rem", objectFit: "contain", verticalAlign: "middle", marginRight: "8px", borderRadius: "50%", mixBlendMode: "multiply" }} />
                : <img src="/escudoFuego.png" alt="Fuego" style={{ width: "2rem", height: "2rem", objectFit: "contain", verticalAlign: "middle", marginRight: "8px", borderRadius: "50%", mixBlendMode: "multiply" }} />}
            {meta.title}
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
            {meta.subtitle} — {episodes.length} Episodios Completos
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="episode-item-card"
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                textAlign: "left",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ color: "var(--primary-color)", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>
                  Capítulo {ep.id}
                </span>
                <h3 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "8px" }}>{ep.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>{ep.desc}</p>
              </div>

              <a
                href={`${linkBase}+${ep.title.replace(/\s+/g, "+")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-ep-btn"
                style={{
                  background: "linear-gradient(135deg, #a05a2c 0%, #7b3f15 100%)",
                  color: "#f7edd5",
                  border: "1px solid #63320c",
                  borderRadius: "20px",
                  padding: "8px 20px",
                  fontFamily: "Cinzel",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "none",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease"
                }}
              >
                <Play size={14} fill="currentColor" />
                <span>Ver Episodio</span>
              </a>
            </div>
          ))}
        </div>

        {/* Easter egg symbols at end of list */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", paddingRight: "10px" }}>
          {bookNumber === 1 && onFindSymbol && !foundSymbols?.agua && (
            <span
              onClick={() => { onFindSymbol("agua"); alert("¡Felicidades! Encontraste el Símbolo del Agua Control 🌊"); }}
              style={{ fontSize: "1.2rem", cursor: "pointer", opacity: 0.15, userSelect: "none" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.6"}
              onMouseLeave={(e) => e.target.style.opacity = "0.15"}
              title="¿Un símbolo sumergido?"
            ><img src="/escudoAgua.png" alt="🌊" style={{ width: "1.6rem", height: "1.6rem", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} /></span>
          )}
          {bookNumber === 2 && onFindSymbol && !foundSymbols?.aire && (
            <span
              onClick={() => { onFindSymbol("aire"); alert("¡Felicidades! Encontraste el Símbolo del Aire Control 💨"); }}
              style={{ fontSize: "1.2rem", cursor: "pointer", opacity: 0.15, userSelect: "none" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.6"}
              onMouseLeave={(e) => e.target.style.opacity = "0.15"}
              title="¿Un símbolo en el viento?"
            ><img src="/escudoAire.png" alt="💨" style={{ width: "1.6rem", height: "1.6rem", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} /></span>
          )}
          {bookNumber === 3 && onFindSymbol && !foundSymbols?.fuego && (
            <span
              onClick={() => { onFindSymbol("fuego"); alert("¡Felicidades! Encontraste el Símbolo del Fuego Control 🔥"); }}
              style={{ fontSize: "1.2rem", cursor: "pointer", opacity: 0.15, userSelect: "none" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.6"}
              onMouseLeave={(e) => e.target.style.opacity = "0.15"}
              title="¿Un símbolo ardiente?"
            ><img src="/escudoFuego.png" alt="🔥" style={{ width: "1.6rem", height: "1.6rem", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} /></span>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .episode-item-card:hover {
          border-color: var(--primary-color);
          transform: translateX(4px);
          box-shadow: 0 6px 15px var(--primary-glow);
        }
        .watch-ep-btn:hover { transform: scale(1.05); filter: brightness(1.1); }

        .water-waves-deco { position: absolute; bottom: 0; left: 0; width: 100%; height: 120px; overflow: hidden; opacity: 0.15; pointer-events: none; }
        .wave { position: absolute; bottom: 0; width: 200%; height: 100%; background: linear-gradient(to top, #1b6ca8, transparent); border-radius: 43%; animation: wave-roll 10s infinite linear; }
        .wave-2 { animation-duration: 7s; opacity: 0.5; border-radius: 40%; }
        @keyframes wave-roll { from { transform: translateX(0) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }

        .earth-rocks-deco { position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; opacity: 0.08; }
        .floating-rock { position: absolute; font-size: 2rem; animation: float-rock 6s infinite ease-in-out alternate; }
        .rock-1 { top: 15%; left: 8%; animation-delay: 0s; }
        .rock-2 { top: 45%; right: 6%; animation-delay: 1.5s; animation-duration: 8s; }
        .rock-3 { bottom: 20%; left: 5%; animation-delay: 3s; animation-duration: 7s; }
        @keyframes float-rock { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-20px) rotate(15deg); } }

        .fire-flames-deco { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.08; }
        .flame-border { position: absolute; top: 0; height: 100%; width: 15px; background: linear-gradient(to bottom, #c0392b, #e67e22, transparent); filter: blur(4px); }
        .flame-border.left { left: 0; animation: flicker-left 0.15s infinite; }
        .flame-border.right { right: 0; animation: flicker-right 0.15s infinite; }
        @keyframes flicker-left { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.3); } }
        @keyframes flicker-right { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.3); } }
      `}} />
    </div>
  );
}
