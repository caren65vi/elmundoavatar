import "./EasterEggs.css";
import React from "react";
import { Sparkles, Key, Lock, Unlock, Heart } from "lucide-react";

export default function EasterEggs({ foundSymbols }) {
  const allFound = foundSymbols.agua && foundSymbols.tierra && foundSymbols.fuego && foundSymbols.aire;

  const riddles = [
    {
      id: "agua",
      name: "Símbolo del Agua Control 🌊",
      clue: "Se oculta al final del Libro de las Olas (Episodios de la Temporada 1).",
      unlockedText: "Encontré en tus ojos la calma que detiene cualquier marea de dudas...",
      found: foundSymbols.agua
    },
    {
      id: "tierra",
      name: "Símbolo del Tierra Control 🌱",
      clue: "Descansa firmemente en la sección de los Datos Generales e Infografías de la Serie.",
      unlockedText: "...encontré en tu abrazo la fuerza y estabilidad del Reino de la Tierra...",
      found: foundSymbols.tierra
    },
    {
      id: "fuego",
      name: "Símbolo del Fuego Control 🔥",
      clue: "Brilla con intensidad en el panel del administrador principal, donde se lanzan las sorpresas.",
      unlockedText: "...encontré en tu risa la llama cálida que aviva mi pasión y me da fuerzas...",
      found: foundSymbols.fuego
    },
    {
      id: "aire",
      name: "Símbolo del Aire Control 💨",
      clue: "Vuela libremente cerca de los créditos y nombres de quienes crearon esta página de amor.",
      unlockedText: "...y encontré en tu amor las alas para volar por los cielos. ¡Eres mi leyenda entera!",
      found: foundSymbols.aire
    }
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "1.8rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Símbolos Ocultos del Avatar
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Hay 4 símbolos elementales escondidos por toda la página. Encuéntralos todos para revelar el mensaje secreto final de Vivi.
        </p>
      </div>

      {/* Riddles / Fragments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "35px" }}>
        {riddles.map((r) => (
          <div
            key={r.id}
            style={{
              background: "var(--bg-panel)",
              border: `1px solid ${r.found ? "var(--primary-color)" : "var(--border-color)"}`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              textAlign: "left",
              boxShadow: r.found ? "0 0 15px var(--primary-glow)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: r.found ? "rgba(192, 160, 96, 0.1)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${r.found ? "var(--primary-color)" : "var(--border-color)"}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: r.found ? "var(--primary-color)" : "var(--text-muted)"
              }}
            >
              {r.found ? <Unlock size={18} /> : <Lock size={18} />}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.05rem", color: r.found ? "#fff" : "var(--text-muted)", fontFamily: "Cinzel", marginBottom: "4px" }}>
                {r.name}
              </h3>
              {r.found ? (
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: "var(--primary-color)",
                    lineHeight: "1.4"
                  }}
                >
                  "{r.unlockedText}"
                </p>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                  💡 Pista: {r.clue}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unlocked Complete Letter */}
      {allFound && (
        <div
          className="pergamino"
          style={{
            animation: "pop-in 0.4s ease forwards",
            padding: "40px 30px",
            boxShadow: "inset 0 0 35px rgba(139,87,42,0.2), 0 15px 35px rgba(255, 51, 102, 0.15)"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 51, 102, 0.1)",
              border: "2px solid #ff3366",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
              margin: "0 auto 20px",
              color: "#ff3366"
            }}
          >
            <Heart fill="currentColor" size={24} style={{ animation: "heart-beat 1.2s infinite" }} />
          </div>

          <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)", color: "#ff3366" }}>
            Nuestra Leyenda Completa 💕
          </h2>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "#3b2c16",
              fontStyle: "italic",
              textAlign: "center"
            }}
          >
            "Encontré en tus ojos la calma que detiene cualquier marea de dudas, encontré en tu abrazo la fuerza y estabilidad del Reino de la Tierra, encontré en tu risa la llama cálida que aviva mi pasión y me da fuerzas, y encontré en tu amor las alas para volar por los cielos. ¡Eres mi leyenda entera de amor hoy y siempre!"
          </p>
        </div>
      )}
    </div>
  );
}
