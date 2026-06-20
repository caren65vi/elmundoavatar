import "./MemoryGame.css";
import React, { useState, useEffect } from "react";
import { RefreshCw, Play, Hourglass, HelpCircle } from "lucide-react";
import { db } from "../../Firebase/config";
import { doc, increment, serverTimestamp, setDoc } from "firebase/firestore";

const CARD_DATA = [
  { id: 1, name: "Aang", emoji: "💨" },
  { id: 2, name: "Katara", emoji: "🌊" },
  { id: 3, name: "Toph", emoji: "🌱" },
  { id: 4, name: "Zuko", emoji: "🔥" },
  { id: 5, name: "Iroh", emoji: "🍵" },
  { id: 6, name: "Sokka", emoji: "🪃" },
  { id: 7, name: "Appa", emoji: "🐮" },
  { id: 8, name: "Momo", emoji: "🌸" }
];

export default function MemoryGame({ user }) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [solvedPairs, setSolvedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize and shuffle cards
  const initializeGame = () => {
    // Duplicate and shuffle card array
    const doubleCards = [...CARD_DATA, ...CARD_DATA]
      .map((card, idx) => ({ ...card, uniqueId: idx }))
      .sort(() => Math.random() - 0.5);

    setCards(doubleCards);
    setFlippedIndexes([]);
    setSolvedPairs([]);
    setMoves(0);
    setSeconds(0);
    setIsRunning(true);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer Effect
  useEffect(() => {
    let timer = null;
    if (isRunning && !gameWon) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, gameWon]);

  const saveMemoryProgress = (finalMoves) => {
    if (!user?.uid) return;

    setDoc(doc(db, "juego_progreso", user.uid), {
      memoria: {
        partidasJugadas: increment(1),
        mejorPuntaje: CARD_DATA.length,
        mensajeDesbloqueado: true,
        ultimoTiempo: seconds,
        ultimosMovimientos: finalMoves
      },
      updatedAt: serverTimestamp()
    }, { merge: true }).catch((error) => console.warn("No se pudo guardar el progreso de memoria:", error));
  };

  const handleCardClick = (idx) => {
    if (flippedIndexes.length === 2 || flippedIndexes.includes(idx) || solvedPairs.includes(cards[idx].id)) {
      return;
    }

    const newFlipped = [...flippedIndexes, idx];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        // Solved pair!
        const newSolved = [...solvedPairs, firstCard.id];
        setSolvedPairs(newSolved);
        setFlippedIndexes([]);

        // Check if all pairs solved
        if (newSolved.length === CARD_DATA.length) {
          setGameWon(true);
          setIsRunning(false);
          saveMemoryProgress(moves + 1);
        }
      } else {
        // No match, flip back after 1 second
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto" }}>
      <div style={{ marginBottom: "25px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "1.8rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Memoria Avatar
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Voltea las cartas de dos en dos buscando parejas de personajes. ¡Completa el juego para desbloquear un mensaje de amor!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "15px 20px",
          marginBottom: "25px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          color: "var(--text-color)"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Hourglass size={16} color="var(--primary-color)" />
          <span>Tiempo: {formatTime(seconds)}</span>
        </span>
        <span>Movimientos: {moves}</span>
        <button
          onClick={initializeGame}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--primary-color)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.85rem",
            fontWeight: "bold"
          }}
        >
          <RefreshCw size={14} />
          <span>Reiniciar</span>
        </button>
      </div>

      {!gameWon ? (
        <div className="memory-grid">
          {cards.map((card, idx) => {
            const isFlipped = flippedIndexes.includes(idx);
            const isSolved = solvedPairs.includes(card.id);

            return (
              <div
                key={card.uniqueId}
                className={`memory-card ${isFlipped || isSolved ? "flipped" : ""}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="memory-card-inner">
                  <div className="memory-card-back">
                    <HelpCircle size={28} />
                  </div>
                  <div className="memory-card-front" style={{ fontSize: "2.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {card.id === 7
                      ? <img src="/appa.png" alt="Appa" style={{ width: "2.8rem", height: "2.8rem", objectFit: "contain" }} />
                      : card.id === 2
                        ? <div style={{ width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "2px solid #1b6ca8", boxShadow: "0 0 8px #1b6ca880", background: "rgba(27,108,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/escudoAgua.png" alt="Agua" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
                          </div>
                        : card.id === 4
                          ? <div style={{ width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "2px solid #c0392b", boxShadow: "0 0 8px #c0392b80", background: "rgba(192,57,43,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                              <img src="/escudoFuego.png" alt="Fuego" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
                            </div>
                          : card.id === 3
                            ? <div style={{ width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "2px solid #4a7c59", boxShadow: "0 0 8px #4a7c5980", background: "rgba(74,124,89,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                <img src="/escudoTierra.png" alt="Tierra" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
                              </div>
                            : card.id === 1
                              ? <div style={{ width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "2px solid #e8b86d", boxShadow: "0 0 8px #e8b86d80", background: "rgba(232,184,109,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                  <img src="/escudoAire.png" alt="Aire" style={{ width: "80%", height: "80%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
                                </div>
                              : card.emoji}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Win screen message
        <div
          className="pergamino"
          style={{
            maxWidth: "480px",
            margin: "20px auto 0",
            animation: "pop-in 0.4s ease forwards",
            padding: "40px 30px"
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(74, 124, 89, 0.1)",
              border: "2px solid #4a7c59",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.2rem",
              margin: "0 auto 20px"
            }}
          >
            🍃
          </div>

          <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)" }}>
            ¡Victoria de los Elementos!
          </h2>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              lineHeight: "1.7",
              color: "#3b2c16",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: "30px",
              padding: "10px"
            }}
          >
            "Completar este juego representa cómo nuestras piezas encajan a la perfección. Cada recuerdo y momento juntos crea la combinación más hermosa. ¡Eres mi pareja perfecta en este y en el mundo espiritual! 💕✨"
          </p>

          <button
            onClick={initializeGame}
            className="pergamino-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <RefreshCw size={16} />
            <span>Jugar de Nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
}
