import "./SeriesInfo.css";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

export default function SeriesInfo() {
  const [seasons, setSeasons] = useState(0);
  const [episodes, setEpisodes] = useState(0);
  const [year, setYear] = useState(0);

  useEffect(() => {
    // Animate seasons up to 3
    let seasonsVal = 0;
    const seasonsInterval = setInterval(() => {
      if (seasonsVal < 3) {
        seasonsVal++;
        setSeasons(seasonsVal);
      } else {
        clearInterval(seasonsInterval);
      }
    }, 150);

    // Animate episodes up to 61
    let episodesVal = 0;
    const episodesInterval = setInterval(() => {
      if (episodesVal < 61) {
        episodesVal += 2;
        if (episodesVal > 61) episodesVal = 61;
        setEpisodes(episodesVal);
      } else {
        clearInterval(episodesInterval);
      }
    }, 40);

    // Animate year up to 2005
    let yearVal = 1900;
    const yearInterval = setInterval(() => {
      if (yearVal < 2005) {
        yearVal += 15;
        if (yearVal > 2005) yearVal = 2005;
        setYear(yearVal);
      } else {
        clearInterval(yearInterval);
      }
    }, 15);

    return () => {
      clearInterval(seasonsInterval);
      clearInterval(episodesInterval);
      clearInterval(yearInterval);
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Datos Generales de la Serie
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Información infográfica de la obra maestra animada que inspiró este regalo mágico.
        </p>
      </div>

      {/* Counters Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "30px", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "3.2rem", height: "3.2rem", borderRadius: "50%", border: "2px solid #1b6ca8", boxShadow: "0 0 12px #1b6ca880", background: "rgba(27,108,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/escudoAgua.png" alt="Agua" style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#fff", fontFamily: "Cinzel", lineHeight: "1.2" }}>{seasons}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px" }}>
            Temporadas (Libros)
          </div>
        </div>

        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "30px", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "3.2rem", height: "3.2rem", borderRadius: "50%", border: "2px solid #4a7c59", boxShadow: "0 0 12px #4a7c5980", background: "rgba(74,124,89,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/escudoTierra.png" alt="Tierra" style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#fff", fontFamily: "Cinzel", lineHeight: "1.2" }}>{episodes}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px" }}>
            Episodios Totales
          </div>
        </div>

        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "30px", textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "3.2rem", height: "3.2rem", borderRadius: "50%", border: "2px solid #c0392b", boxShadow: "0 0 12px #c0392b80", background: "rgba(192,57,43,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/escudoFuego.png" alt="Fuego" style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
            </div>
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#fff", fontFamily: "Cinzel", lineHeight: "1.2" }}>{year}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px" }}>
            Año de Estreno
          </div>
        </div>
      </div>

      {/* Main Info Sheet */}
      <div
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          padding: "30px",
          textAlign: "left",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          backdropFilter: "blur(10px)",
          marginBottom: "40px"
        }}
      >
        <h2 style={{ fontSize: "1.4rem", color: "var(--primary-color)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen size={20} />
          <span>La Leyenda Detrás de la Fantasía</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)" }}>
          <div>
            <strong style={{ color: "#fff" }}>Creadores de la Serie:</strong>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Michael Dante DiMartino y Bryan Konietzko. Quienes idearon un mundo dividido en cuatro naciones, inspirado en culturas asiáticas y filosofías orientales, donde el control de los elementos fluye en armonía.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
            <strong style={{ color: "#fff" }}>Resumen de la Obra:</strong>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
              Durante un siglo, la Nación del Fuego ha sembrado la guerra y el caos. El joven Aang, un maestro aire de 12 años y el Avatar profetizado, despierta de su letargo en el hielo para dominar el Agua, la Tierra y el Fuego, acompañado de Katara, Sokka, Toph y Zuko, restaurando el equilibrio del cosmos.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
            <strong style={{ color: "#fff" }}>Premios y Reconocimientos:</strong>
            <ul style={{ color: "var(--text-muted)", marginTop: "8px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>🏆 <strong>Premio Emmy Primetime:</strong> Por Logro Individual Sobresaliente en Animación.</li>
              <li>🏆 <strong>Premios Annie:</strong> Múltiples galardones a Mejor Producción de Animación de Televisión y Mejor Dirección.</li>
              <li>🏆 <strong>Premio Peabody:</strong> Otorgado por su increíble profundidad narrativa, desarrollo de personajes y mensajes sobre el pacifismo y la diversidad cultural.</li>
              <li>⭐ Aclamada universalmente como una de las mejores series animadas de todos los tiempos.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
