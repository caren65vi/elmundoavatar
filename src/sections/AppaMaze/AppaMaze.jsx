import "./AppaMaze.css";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../Firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, RefreshCw } from "lucide-react";

// Maze definition matrices (12x12)
// 0: path, 1: wall, 2: start, 3: goal
const levelMazes = [
  // Level 1: Tribu Agua (Blue theme)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,1,0,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 2: Reino Tierra (Green theme)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,1,1,0,1,0,1],
    [1,1,1,0,1,0,1,3,0,1,0,1],
    [1,0,0,0,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 3: Nación del Fuego (Red theme)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,1,1,0,1,0,1],
    [1,1,1,1,1,0,1,3,0,1,0,1],
    [1,0,0,0,0,0,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 4: Templos del Aire (Yellow theme)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,3,0,1,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

const levelConfigs = [
  {
    name: "Nivel 1: Tribu Agua del Sur 🌊",
    bgColor: "#0c2340",
    wallColor: "#1b6ca8",
    hazardEmoji: "🧊",
    hazardName: "Soldados del Fuego e Icebergs",
    speed: 1.5
  },
  {
    name: "Nivel 2: Muros de Ba Sing Se 🌱",
    bgColor: "#142516",
    wallColor: "#4a7c59",
    hazardEmoji: "🪨",
    hazardName: "Agentes del Dai Li y Rocas",
    speed: 2.2
  },
  {
    name: "Nivel 3: Caldera del Volcán 🔥",
    bgColor: "#230b0b",
    wallColor: "#c0392b",
    hazardEmoji: "🚀",
    hazardName: "Naves de Guerra y Columnas de Fuego",
    speed: 3.0
  },
  {
    name: "Nivel 4: Templos Celestiales del Aire 💨",
    bgColor: "#0f1c2c",
    wallColor: "#e8b86d",
    hazardEmoji: "🌪️",
    hazardName: "Viento Turbulento y Globos",
    speed: 3.8
  }
];

export const defaultLetter = "Espero que ames cada detalle de esta página hecha con el corazón. Eres mi agua control en días de tormenta y mi cimiento fuerte frente al mundo. ¡Feliz mes mi amor! 💕✨";

export default function AppaMaze({ user }) {
  const [level, setLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [hazards, setHazards] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const canvasRef = useRef(null);
  const appaImgRef = useRef(null);
  const gridCount = 12;
  const cellSize = 30; // pixels per grid cell

  useEffect(() => {
    const img = new Image();
    img.src = "/appa.png";
    appaImgRef.current = img;
  }, []);

  // Define starting coordinates for players based on Level matrix
  const getStartPos = (lvlIdx) => {
    const matrix = levelMazes[lvlIdx];
    for (let r = 0; r < gridCount; r++) {
      for (let c = 0; c < gridCount; c++) {
        if (matrix[r][c] === 2) return { x: c, y: r };
      }
    }
    return { x: 1, y: 1 };
  };

  // Initialize Level Hazards
  useEffect(() => {
    const startPos = getStartPos(level);
    setPlayerPosition(startPos);
    setGameWon(false);

    // Create 3 hazards that slide horizontally/vertically in open paths
    const newHazards = Array.from({ length: 3 }).map((_, i) => {
      // Find open spots
      const positions = [
        { x: 5, y: 1, dirX: 1, dirY: 0 },
        { x: 3, y: 7, dirX: 0, dirY: 1 },
        { x: 8, y: 9, dirX: -1, dirY: 0 }
      ];
      return {
        id: i,
        x: positions[i].x * cellSize + cellSize / 2,
        y: positions[i].y * cellSize + cellSize / 2,
        gridX: positions[i].x,
        gridY: positions[i].y,
        dirX: positions[i].dirX,
        dirY: positions[i].dirY
      };
    });
    setHazards(newHazards);
  }, [level]);

  // Main Canvas Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const matrix = levelMazes[level];
    const config = levelConfigs[level];

    // Clear and fill background
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Maze Walls
    for (let r = 0; r < gridCount; r++) {
      for (let c = 0; c < gridCount; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillStyle = config.wallColor;
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
        } else if (matrix[r][c] === 3) {
          // Draw portal/goal
          ctx.fillStyle = "#ff3366";
          ctx.beginPath();
          ctx.arc(c * cellSize + cellSize/2, r * cellSize + cellSize/2, cellSize/3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "14px Outfit";
          ctx.fillText("💕", c * cellSize + 6, r * cellSize + 20);
        }
      }
    }

    // Draw Hazards
    hazards.forEach((h) => {
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(config.hazardEmoji, h.x, h.y);
    });

    // Draw Player Appa
    const px = playerPosition.x * cellSize;
    const py = playerPosition.y * cellSize;
    if (appaImgRef.current?.complete && appaImgRef.current.naturalWidth > 0) {
      ctx.drawImage(appaImgRef.current, px + 1, py + 1, cellSize - 2, cellSize - 2);
    } else {
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🐮", px + cellSize / 2, py + cellSize / 2);
    }

  }, [level, playerPosition, hazards]);

  // Animation Loop for Moving Hazards
  useEffect(() => {
    if (gameWon || gameCompleted) return;

    const timer = setInterval(() => {
      const config = levelConfigs[level];
      const matrix = levelMazes[level];

      setHazards((prevHazards) =>
        prevHazards.map((h) => {
          let nextX = h.x + h.dirX * config.speed;
          let nextY = h.y + h.dirY * config.speed;

          // Find current cells
          const currentCellX = Math.floor(nextX / cellSize);
          const currentCellY = Math.floor(nextY / cellSize);

          // Check if hitting wall
          let hitsWall = false;
          if (
            currentCellX < 0 || currentCellX >= gridCount ||
            currentCellY < 0 || currentCellY >= gridCount ||
            matrix[currentCellY][currentCellX] === 1
          ) {
            hitsWall = true;
          }

          if (hitsWall) {
            // Reverse direction
            return {
              ...h,
              dirX: -h.dirX,
              dirY: -h.dirY,
              x: h.x + (-h.dirX) * config.speed,
              y: h.y + (-h.dirY) * config.speed
            };
          }

          return { ...h, x: nextX, y: nextY };
        })
      );
    }, 40);

    return () => clearInterval(timer);
  }, [level, gameWon, gameCompleted]);

  // Check Collision with Hazards
  useEffect(() => {
    if (gameWon || gameCompleted) return;

    const playerWorldX = playerPosition.x * cellSize + cellSize / 2;
    const playerWorldY = playerPosition.y * cellSize + cellSize / 2;

    const hit = hazards.some((h) => {
      const dist = Math.hypot(h.x - playerWorldX, h.y - playerWorldY);
      return dist < 20; // Collision threshold radius
    });

    if (hit) {
      // Reset position
      const start = getStartPos(level);
      setPlayerPosition(start);
    }
  }, [playerPosition, hazards, level, gameWon, gameCompleted]);

  // Keyboard Movement Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon || gameCompleted) return;
      let dx = 0;
      let dy = 0;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dy = -1;
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dy = 1;
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dx = -1;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dx = 1;

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        movePlayer(dx, dy);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, level, gameWon, gameCompleted]);

  const movePlayer = (dx, dy) => {
    const matrix = levelMazes[level];
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // Check boundary
    if (newX >= 0 && newX < gridCount && newY >= 0 && newY < gridCount) {
      // Check wall
      if (matrix[newY][newX] !== 1) {
        setPlayerPosition({ x: newX, y: newY });

        // Check goal
        if (matrix[newY][newX] === 3) {
          handleLevelComplete();
        }
      }
    }
  };

  const handleLevelComplete = async () => {
    if (level < 3) {
      setGameWon(true);
    } else {
      setGameCompleted(true);
      // Save game completed in Firestore
      setSavingProgress(true);
      try {
        if (!user?.uid) throw new Error("No hay una sesión válida para guardar el progreso.");
        await setDoc(doc(db, "juego_progreso", user.uid), {
          laberinto: {
            nivelActual: 4,
            nivel1Completado: true,
            nivel2Completado: true,
            nivel3Completado: true,
            nivel4Completado: true,
            cartaDesamorDesbloqueada: true,
            mejorTiempo: 0,
            completado: true
          },
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Error saving maze progress:", err);
      } finally {
        setSavingProgress(false);
      }
    }
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
  };

  const resetGame = () => {
    setLevel(0);
    setGameCompleted(false);
    setGameWon(false);
    setPlayerPosition(getStartPos(0));
  };

  return (
    <div className="maze-canvas-container">
      <div style={{ marginBottom: "25px", textAlign: "left", width: "100%", maxWidth: "480px" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "1.8rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Guía a Appa por el Laberinto
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Controla a Aang montado sobre Appa. Esquiva los obstáculos y llévalo al portal de corazones. Usa teclado (flechas/WASD) o los botones táctiles.
        </p>
      </div>

      {!gameCompleted ? (
        <div style={{ background: "var(--bg-panel)", border: "2px solid var(--primary-color)", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>
            <span>{levelConfigs[level].name}</span>
            <span style={{ color: "#c0392b" }}>Evita: {levelConfigs[level].hazardName}</span>
          </div>

          <canvas
            ref={canvasRef}
            width={cellSize * gridCount}
            height={cellSize * gridCount}
            className="maze-canvas"
          />

          {/* D-Pad controls for Mobile */}
          <div className="maze-controls">
            <button className="maze-ctrl-btn up" onClick={() => movePlayer(0, -1)}><ArrowUp size={20} /></button>
            <button className="maze-ctrl-btn left" onClick={() => movePlayer(-1, 0)}><ArrowLeft size={20} /></button>
            <button className="maze-ctrl-btn right" onClick={() => movePlayer(1, 0)}><ArrowRight size={20} /></button>
            <button className="maze-ctrl-btn down" onClick={() => movePlayer(0, 1)}><ArrowDown size={20} /></button>
          </div>
        </div>
      ) : (
        // Maze Complete Win Screen (Unlock Romantic Letter)
        <div
          className="pergamino"
          style={{
            maxWidth: "480px",
            animation: "pop-in 0.4s ease forwards",
            padding: "40px 30px"
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(255, 51, 102, 0.1)",
              border: "2px solid #ff3366",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.2rem",
              margin: "0 auto 20px"
            }}
          >
            💖
          </div>

          <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)" }}>
            ¡Mensaje Secreto Desbloqueado!
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
            "{defaultLetter}"
          </p>

          <button
            onClick={resetGame}
            className="pergamino-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <RefreshCw size={16} />
            <span>Volver a Jugar</span>
          </button>
        </div>
      )}

      {/* Level Win Modal Overlay */}
      {gameWon && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "380px", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>🎉</span>
            <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: "15px 0 10px", fontFamily: "Cinzel" }}>
              ¡Nivel Completado!
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Appa ha dominado este elemento y está listo para cruzar el siguiente portal.
            </p>
            <button onClick={nextLevel} className="pergamino-btn">
              Avanzar Siguiente Nivel ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
