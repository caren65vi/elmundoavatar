import "./Credits.css";
import { Heart } from "lucide-react";

export default function Credits({ onFindSymbol, foundSymbols }) {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <div
        className="pergamino"
        style={{
          boxShadow: "inset 0 0 40px rgba(139,87,42,0.2), 0 15px 35px rgba(0,0,0,0.3)",
          padding: "45px 35px",
          marginBottom: "40px"
        }}
      >
        {/* Hidden Air Symbol for Easter Eggs */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-20px", marginRight: "-10px" }}>
          {!foundSymbols.aire ? (
            <span
              onClick={() => {
                onFindSymbol("aire");
                alert("¡Felicidades! Encontraste el Símbolo del Aire Control 💨");
              }}
              style={{
                fontSize: "1.2rem",
                cursor: "pointer",
                opacity: 0.15,
                transition: "opacity 0.3s ease",
                userSelect: "none"
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.6"}
              onMouseLeave={(e) => e.target.style.opacity = "0.15"}
              title="¿Qué es esto flotando?"
            >
              💨
            </span>
          ) : (
            <span style={{ fontSize: "1.2rem", opacity: 0.6, color: "var(--primary-color)" }}>💨</span>
          )}
        </div>

        <h1
          className="pergamino-header"
          style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)", fontSize: "1.8rem", color: "#63431d" }}
        >
          Nuestra Leyenda Creada
        </h1>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "#3b2c16",
            fontStyle: "italic",
            marginBottom: "25px"
          }}
        >
          "Esta página fue creada con amor absoluto para ti. Cada elemento, cada animación y cada detalle fue pensado en ti. Eres mi mundo entero y mi gran maestra de vida."
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            color: "#c0392b",
            fontSize: "1.1rem",
            fontWeight: "bold",
            fontFamily: "Outfit",
            marginBottom: "25px"
          }}
        >
          <span>Con amor, Vivi</span>
          <Heart size={16} fill="currentColor" style={{ animation: "heart-beat 1.2s infinite" }} />
          <span>para Natalia</span>
        </div>

        <div style={{ borderTop: "1px dashed rgba(99, 67, 29, 0.2)", paddingTop: "15px", fontSize: "0.8rem", color: "#8b572a" }}>
          Creado con React, Vite y Firebase en el año 2026.
        </div>
      </div>

      {/* Appa Flying Sunset SVG Animation */}
      <div
        style={{
          width: "100%",
          height: "220px",
          background: "linear-gradient(to top, #caa360 0%, #d8ba7c 30%, #e8b86d 70%, #0c1622 100%)",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          border: "2px solid var(--border-color)"
        }}
      >
        {/* Sun */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#fff5cc",
            borderRadius: "50%",
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 0 30px #ffea99",
            opacity: 0.8
          }}
        />

        {/* Flying Appa towards sun */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            width: "110px",
            height: "auto",
            animation: "fly-horizon 15s infinite linear"
          }}
        >
          <img src="/appa.png" alt="Appa" style={{ width: "110px", height: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }} />
        </div>

        {/* Small silhouette of Aang waving */}
        <div style={{ position: "absolute", bottom: "10px", right: "20px", fontSize: "1.5rem", animation: "wave-aang 2s infinite ease" }}>
          🙋‍♂️
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fly-horizon {
          0% { left: -110px; transform: scale(0.6) translateY(20px); }
          50% { transform: scale(0.4) translateY(-10px); }
          100% { left: 100%; transform: scale(0.2) translateY(30px); }
        }

        @keyframes wave-aang {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg) translateY(-5px); }
        }
      `}} />
    </div>
  );
}
