import "./Nations.css";
import { useState } from "react";

export default function Nations({ defaultSubNation }) {
  const [activeNation, setActiveNation] = useState(defaultSubNation || "agua");

  const nationsData = {
    agua: {
      title: "La Tribu del Agua",
      emoji: "🌊",
      color: "#1b6ca8",
      history: "Ubicados en los polos Norte y Sur, y en los pantanos. La Tribu del Agua es pacífica y vive en armonía con la naturaleza. Sus habilidades provienen del Espíritu de la Luna y del Océano, permitiéndoles moldear el agua en hermosas cascadas o letales puntas de hielo.",
      culture: "Su sociedad está profundamente conectada con los ciclos de las mareas. Valoran la vida comunitaria, la curación espiritual y el trabajo en equipo.",
      locations: ["Polo Norte (Gran Capital de Hielo)", "Polo Sur (Pequeña Aldea Guerrera)", "Pantano Místico de la Tierra"],
      mapSvg: (
        <svg viewBox="0 0 200 120" width="100%" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="60" r="50" fill="#1b6ca8" opacity="0.1" />
          <path d="M20 20 C 40 40, 160 40, 180 20" stroke="#1b6ca8" strokeWidth="3" fill="none" />
          <path d="M20 100 C 40 80, 160 80, 180 100" stroke="#1b6ca8" strokeWidth="3" fill="none" />
          <text x="100" y="65" fill="#a8d8ea" fontSize="10" textAnchor="middle" fontFamily="Cinzel">Polo Norte y Sur</text>
        </svg>
      )
    },
    tierra: {
      title: "El Reino de la Tierra",
      emoji: "🌱",
      color: "#4a7c59",
      history: "El continente más grande del mundo Avatar. El Reino de la Tierra es un bastión de resistencia e inmensa diversidad. Sus maestros controlan la piedra, el barro y el metal. Han resistido cien años de guerra gracias a las impenetrables murallas de su capital, Ba Sing Se.",
      culture: "Valoran la persistencia, la lealtad, las tradiciones agrícolas y la estabilidad. Son firmes como las montañas que habitan.",
      locations: ["Ba Sing Se (La Ciudad Impenetrable)", "Omashu (La Ciudad de los Canales)", "Isla de Kyoshi"],
      mapSvg: (
        <svg viewBox="0 0 200 120" width="100%" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="140" height="80" rx="10" fill="#4a7c59" opacity="0.1" stroke="#4a7c59" strokeWidth="2" />
          <circle cx="100" cy="60" r="25" fill="#8b6914" opacity="0.2" />
          <text x="100" y="65" fill="#a4cfa7" fontSize="10" textAnchor="middle" fontFamily="Cinzel">Ba Sing Se</text>
        </svg>
      )
    },
    fuego: {
      title: "La Nación del Fuego",
      emoji: "🔥",
      color: "#c0392b",
      history: "Una nación industrializada y poderosa ubicada en un archipiélago volcánico. Históricamente desató una guerra centenaria buscando expandir su imperio. Su Fuego Control proviene de la energía solar, del calor del núcleo del planeta y de la pasión interna del corazón.",
      culture: "Valoran el honor, el poder militar, el desarrollo industrial y la disciplina. Con el fin de la guerra, reorientan su poder hacia la paz.",
      locations: ["Capital del Fuego (La Gran Caldera)", "Isla Ember (Refugio de Verano)", "Templo del Avatar Roku"],
      mapSvg: (
        <svg viewBox="0 0 200 120" width="100%" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="20" fill="#c0392b" opacity="0.15" />
          <circle cx="150" cy="70" r="25" fill="#c0392b" opacity="0.15" />
          <path d="M30 40 L 70 80 M 130 50 L 170 90" stroke="#c0392b" strokeWidth="2" />
          <text x="100" y="65" fill="#e67e22" fontSize="10" textAnchor="middle" fontFamily="Cinzel">Archipiélago</text>
        </svg>
      )
    },
    aire: {
      title: "Los Nómadas del Aire",
      emoji: "💨",
      color: "#e8b86d",
      history: "Una cultura pacífica de monjes y monjas que habitaba en cuatro templos colosales situados en altas cordilleras inaccesibles. Todos los nómadas eran maestros aire de nacimiento, poseyendo una profunda conexión espiritual con el viento y las criaturas voladoras.",
      culture: "Eran vegetarianos, desapegados de los bienes materiales y buscaban la iluminación espiritual. Viajaban montados en bisontes voladores.",
      locations: ["Templo del Aire del Sur (Hogar de Aang)", "Templo del Aire del Oeste (Invertido en Abismos)", "Templo del Aire del Norte (Montañas Nevadas)"],
      mapSvg: (
        <svg viewBox="0 0 200 120" width="100%" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20 C 120 40, 80 80, 100 100" stroke="#e8b86d" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M30 60 C 70 40, 130 80, 170 60" stroke="#e8b86d" strokeWidth="2" strokeDasharray="4 4" />
          <text x="100" y="65" fill="#e8b86d" fontSize="9" textAnchor="middle" fontFamily="Cinzel">Templos Sagrados</text>
        </svg>
      )
    }
  };

  const currentData = nationsData[activeNation];

  return (
    <div>
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
            Las Cuatro Naciones
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
            Explora la geografía, cultura e historia de las tierras que conforman el mundo Avatar.
          </p>
        </div>

        {/* Nations Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Object.entries(nationsData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveNation(key)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: activeNation === key ? `2px solid ${data.color}` : "1px solid var(--border-color)",
                background: activeNation === key ? `${data.color}15` : "rgba(255,255,255,0.03)",
                color: activeNation === key ? data.color : "var(--text-muted)",
                fontWeight: "bold",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <div style={{ width: "1.8rem", height: "1.8rem", borderRadius: "50%", border: `1.5px solid ${data.color}`, background: `${data.color}18`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={`/escudo${key.charAt(0).toUpperCase() + key.slice(1)}.png`} alt={key} style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
              </div>
              <span>{data.title.split(" ")[2] || "Nación"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginTop: "20px" }}>
        
        {/* History card */}
        <div
          style={{
            background: "var(--bg-panel)",
            border: `2px solid ${currentData.color}`,
            borderRadius: "16px",
            padding: "30px",
            boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 15px ${currentData.color}15`,
            textAlign: "left"
          }}
        >
          <h2 style={{ fontSize: "1.45rem", color: "#fff", marginBottom: "15px", fontFamily: "Cinzel", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", border: `2px solid ${currentData.color}`, boxShadow: `0 0 10px ${currentData.color}60`, background: `${currentData.color}18`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src={`/escudo${activeNation.charAt(0).toUpperCase() + activeNation.slice(1)}.png`} alt={activeNation} style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
            </div>
            <span>{currentData.title}</span>
          </h2>

          <div style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <strong style={{ color: currentData.color, display: "block", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>
                Historia General
              </strong>
              <p style={{ color: "var(--text-muted)" }}>{currentData.history}</p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
              <strong style={{ color: currentData.color, display: "block", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>
                Cultura y Filosofía
              </strong>
              <p style={{ color: "var(--text-muted)" }}>{currentData.culture}</p>
            </div>
          </div>
        </div>

        {/* Map & Locations card */}
        <div
          style={{
            background: "var(--bg-panel)",
            border: `2px solid ${currentData.color}`,
            borderRadius: "16px",
            padding: "30px",
            boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 15px ${currentData.color}15`,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "20px", fontFamily: "Cinzel" }}>
              Mapa de Ubicaciones Sagradas
            </h2>
            <div
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {currentData.mapSvg}
            </div>
          </div>

          <div>
            <strong style={{ color: currentData.color, display: "block", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "8px" }}>
              Lugares Destacados
            </strong>
            <ul style={{ color: "#fff", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem" }}>
              {currentData.locations.map((loc, idx) => (
                <li key={idx} style={{ color: "var(--text-color)" }}>{loc}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
