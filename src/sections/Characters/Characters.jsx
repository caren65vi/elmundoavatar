import "./Characters.css";
import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { defaultCharacters } from "../../mockData";
import { X, Zap } from "lucide-react";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const nationColors = { agua: "#1B6CA8", tierra: "#4A7C59", fuego: "#C0392B", aire: "#E8B86D", espiritu: "#9B7EDE" };
  const inferredSpecies = { appa: "animal", momo: "animal", wan_shi_tong: "espiritu", yue: "espiritu", hei_bai: "espiritu" };
  const normalizeCharacter = (character) => ({
    ...character,
    id: character.id,
    name: character.name || character.nombre || "Personaje Avatar",
    nation: character.nation || character.nacion || "espiritu",
    species: character.species || character.especie || inferredSpecies[character.id] || "humano",
    skill: character.skill || character.habilidad || "Habilidad desconocida",
    role: character.role || character.rol || (character.esAvatar ? "Avatar" : "Habitante del Mundo Avatar"),
    image: character.image || character.imagen || "",
    color: character.color || nationColors[character.nation || character.nacion] || "#9B7EDE"
  });

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const snapshot = await getDocs(collection(db, "personajes"));
        const data = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setCharacters((data.length > 0 ? data : defaultCharacters).map(normalizeCharacter));
      } catch (err) {
        console.warn("Firestore characters blocked, using defaults:", err);
        setError("No se pudo conectar a Firestore. Mostrando la galería disponible.");
        setCharacters(defaultCharacters.map(normalizeCharacter));
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const NATION_COLORS = { agua: "#1b6ca8", tierra: "#4a7c59", fuego: "#c0392b", aire: "#e8b86d" };
  const getNationEmoji = (nation) => {
    if (!NATION_COLORS[nation]) return "🌀";
    const color = NATION_COLORS[nation];
    return (
      <div style={{ width: "2.2rem", height: "2.2rem", borderRadius: "50%", border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}60`, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src={`/escudo${nation.charAt(0).toUpperCase() + nation.slice(1)}.png`} alt={nation} style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
      </div>
    );
  };

  const filteredCharacters = characters.filter((character) => {
    if (filter === "todos") return true;
    if (filter === "espiritus") return character.species === "espiritu";
    if (filter === "animales") return character.species === "animal";
    return character.nation === filter;
  });

  if (loading) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando galería de personajes...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
            Galería de Personajes
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
            Conoce a los maestros control, guerreros y espíritus que habitan en los 4 libros.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["todos", "agua", "tierra", "fuego", "aire", "espiritus", "animales"].map((n) => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid var(--border-color)",
                background: filter === n ? "var(--primary-color)" : "rgba(255,255,255,0.03)",
                color: filter === n ? "#000" : "var(--text-muted)",
                fontWeight: "bold",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {n === "todos" ? "Todos" : n === "espiritus" ? "✦ Espíritus" : n === "animales" ? "🐾 Animales" : `${getNationEmoji(n)} ${n}`}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="characters-status-message">{error}</p>}

      <div className="characters-grid">
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className={`character-card ${char.nation}`}
            onClick={() => setSelectedCharacter(char)}
          >
            <div
              className="character-avatar-circle"
              style={{ color: char.color, borderColor: char.color, backgroundColor: `${char.color}15` }}
            >
              {char.image ? <img className="character-avatar-image" src={char.image} alt={char.name} /> : getNationEmoji(char.nation)}
            </div>
            <h3 className="character-card-name" style={{ color: "#fff" }}>{char.name}</h3>
            <span className={`character-card-nation ${char.nation}`}>{char.nation}</span>
            <span className="character-card-species">{char.species}</span>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: selectedCharacter.color, boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${selectedCharacter.color}22` }}
          >
            <button className="modal-close-btn" onClick={() => setSelectedCharacter(null)}>
              <X size={24} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: `${selectedCharacter.color}15`, border: `2px solid ${selectedCharacter.color}`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2rem" }}>
                {getNationEmoji(selectedCharacter.nation)}
              </div>
              <div style={{ textAlign: "left" }}>
                <h2 style={{ fontSize: "1.6rem", color: "#fff", fontFamily: "Cinzel", marginBottom: "4px" }}>{selectedCharacter.name}</h2>
                <span style={{ color: selectedCharacter.color, fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  Nación del {selectedCharacter.nation}
                </span>
              </div>
            </div>

            <div style={{ textAlign: "left", fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-color)" }}>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: selectedCharacter.color, display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "4px" }}>Rol / Título</strong>
                <p style={{ color: "#fff" }}>{selectedCharacter.role}</p>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: selectedCharacter.color, display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "4px" }}>Técnica / Habilidad</strong>
                <p style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Zap size={14} color={selectedCharacter.color} />
                  <span>{selectedCharacter.skill}</span>
                </p>
              </div>
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                <strong style={{ color: selectedCharacter.color, display: "block", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "4px" }}>Historia y Personalidad</strong>
                <p style={{ color: "var(--text-muted)" }}>{selectedCharacter.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
