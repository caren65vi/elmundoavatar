import "./AppaMaze.css";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../Firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, RefreshCw } from "lucide-react";
import aangHead from "../../assets/cabezaAang.png";

// Maze definition matrices (12x12)
// 0: path, 1: wall, 2: start (row0 col2), 3: goal (row11 col10)
// Todos los laberintos tienen ruta verificada de inicio a meta.
const levelMazes = [
  // Nivel 1 — Fácil
  // Ruta: (0,2)↓(1,2)→(1,4)↓(3,4)→(3,0...
  // Ruta verificada: col2↓ → fila1→ col4↓ → fila4→ col8↓ → fila6→ col10↓ → fila11=meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,1,1,1],
    [1,0,0,1,1,1,0,0,0,1,0,1],
    [1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,0,0,0,1,1,0,1],
    [1,0,0,0,1,0,1,1,1,1,0,1],
    [1,1,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,1,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // Nivel 2 — Fácil-Medio
  // Ruta: col2↓fila3 → fila3→col10 ↓fila7 → fila7←col5 ↓fila9 → fila9→col10 ↓meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // Nivel 3 — Medio
  // Ruta: col2↓→col5↓fila4←col2 ↓col2→col7↓fila8←col3 ↓col3→col10 ↓meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1],
    [1,0,1,1,0,0,1,0,1,1,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,0,1,1,1],
    [1,0,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,0,1,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,1,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // Nivel 4 — Medio-Difícil
  // Ruta: col2↓→col6↓fila4←col2 ↓→col9↓fila8←col3 ↓fila9→col10 ↓meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,1,0,1],
    [1,0,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // Nivel 5 — Difícil
  // Ruta: →col8↓fila3←col2 ↓→col10↓fila7←col3 ↓fila9→col10 ↓meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // Nivel 6 — Muy Difícil (serpiente)
  // Ruta: fila1→col10 ↓fila3←col1 ↓fila5→col10 ↓fila7←col1 ↓fila9→col10 ↓meta
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ]
];

const levelConfigs = [
  {
    name: "Nivel 1: Tribu Agua del Sur 🌊",
    bgColor: "#0c2340",
    wallColor: "#1b6ca8",
    hazardEmoji: "🧊",
    hazardName: "Icebergs",
    speed: 1.2
  },
  {
    name: "Nivel 2: Pantanos del Espíritu 🌿",
    bgColor: "#0d1f0e",
    wallColor: "#2e7d32",
    hazardEmoji: "🐊",
    hazardName: "Criaturas del Pantano",
    speed: 1.7
  },
  {
    name: "Nivel 3: Muros de Ba Sing Se 🌱",
    bgColor: "#142516",
    wallColor: "#4a7c59",
    hazardEmoji: "🪨",
    hazardName: "Agentes del Dai Li",
    speed: 2.2
  },
  {
    name: "Nivel 4: Templos Celestiales del Aire 💨",
    bgColor: "#0f1c2c",
    wallColor: "#e8b86d",
    hazardEmoji: "🌪️",
    hazardName: "Viento Turbulento",
    speed: 2.8
  },
  {
    name: "Nivel 5: Caldera del Volcán 🔥",
    bgColor: "#230b0b",
    wallColor: "#c0392b",
    hazardEmoji: "🚀",
    hazardName: "Columnas de Fuego",
    speed: 3.4
  },
  {
    name: "Nivel 6: Palacio del Rey Ozai ⚡",
    bgColor: "#1a0a00",
    wallColor: "#b7410e",
    hazardEmoji: "⚡",
    hazardName: "Rayos del Rey Ozai",
    speed: 4.0
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
  const aangHeadImgRef = useRef(null);
  const [imgsReady, setImgsReady] = useState(false);
  const gridCount = 12;
  const cellSize = 30; // pixels per grid cell

  useEffect(() => {
    let loaded = 0;
    const onLoad = () => { loaded++; if (loaded >= 2) setImgsReady(true); };

    const img = new Image();
    img.onload = onLoad;
    img.src = "/appa.png";
    appaImgRef.current = img;

    const aangImg = new Image();
    aangImg.onload = onLoad;
    aangImg.src = aangHead;
    aangHeadImgRef.current = aangImg;
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

  // Hazards — todos horizontales (izquierda↔derecha), posiciones en celdas abiertas verificadas
  const levelHazardPositions = [
  // Cada peligro queda en un bolsillo lateral: nunca ocupa la ruta necesaria hacia Aang.
  [
      { x: 10, y: 1, dirX:  1, dirY: 0 },
      { x: 6,  y: 2, dirX:  1, dirY: 0 },
      { x: 10, y: 5, dirX:  1, dirY: 0 }
    ],
    // Nivel 2: fila1 open, fila7 toda open, fila9 toda open
    [
      { x: 4, y: 2, dirX:  1, dirY: 0 },
      { x: 6, y: 2, dirX:  1, dirY: 0 },
      { x: 8, y: 2, dirX:  1, dirY: 0 }
    ],
    // Nivel 3: fila1 cols2-5, fila6 cols1-8, fila10 cols3-10
    [
      { x: 10, y: 1, dirX:  1, dirY: 0 },
      { x: 7,  y: 2, dirX:  1, dirY: 0 },
      { x: 8,  y: 4, dirX:  1, dirY: 0 }
    ],
    // Nivel 4: fila1 cols4-5, fila6 toda open, fila8 toda open
    [
      { x: 8, y: 2, dirX:  1, dirY: 0 },
      { x: 4, y: 3, dirX:  1, dirY: 0 },
      { x: 8, y: 5, dirX:  1, dirY: 0 }
    ],
    // Nivel 5: fila1 cols2-8, fila5 toda open, fila9 cols3-10
    [
      { x: 10, y: 1, dirX:  1, dirY: 0 },
      { x: 4,  y: 2, dirX:  1, dirY: 0 },
      { x: 6,  y: 4, dirX:  1, dirY: 0 }
    ],
    // Nivel 6: filas 1,5,7,9 todas abiertas
    [
      { x: 1, y: 2, dirX:  1, dirY: 0 },
      { x: 3, y: 2, dirX:  1, dirY: 0 },
      { x: 5, y: 2, dirX:  1, dirY: 0 },
      { x: 7, y: 2, dirX:  1, dirY: 0 }
    ]
  ];

  // Initialize Level Hazards
  useEffect(() => {
    const startPos = getStartPos(level);
    setPlayerPosition(startPos);
    setGameWon(false);

    const positions = levelHazardPositions[level];
    const newHazards = positions.map((pos, i) => ({
      id: i,
      x: pos.x * cellSize + cellSize / 2,
      y: pos.y * cellSize + cellSize / 2,
      gridX: pos.x,
      gridY: pos.y,
      dirX: pos.dirX,
      dirY: pos.dirY
    }));
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
          // Meta: Appa debe llegar hasta Aang. El margen evita que la imagen toque los muros.
          if (aangHeadImgRef.current?.complete && aangHeadImgRef.current.naturalWidth > 0) {
            ctx.drawImage(aangHeadImgRef.current, c * cellSize + 3, r * cellSize + 3, cellSize - 6, cellSize - 6);
            continue;
          }
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

  }, [level, playerPosition, hazards, imgsReady]);

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
    if (level < 5) {
      setGameWon(true);
    } else {
      setGameCompleted(true);
      setSavingProgress(true);
      try {
        if (!user?.uid) throw new Error("No hay una sesión válida para guardar el progreso.");
        await setDoc(doc(db, "juego_progreso", user.uid), {
          laberinto: {
            nivelActual: 6,
            nivel1Completado: true,
            nivel2Completado: true,
            nivel3Completado: true,
            nivel4Completado: true,
            nivel5Completado: true,
            nivel6Completado: true,
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
    if (level < 5) setLevel((prev) => prev + 1);
  };

  const prevLevel = () => {
    if (level > 0) {
      setLevel((prev) => prev - 1);
      setGameWon(false);
    }
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

          {/* Navegación de niveles */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", marginBottom: "4px", gap: "10px" }}>
            <button
              onClick={prevLevel}
              disabled={level === 0}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px", border: "1.5px solid var(--primary-color)",
                background: level === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,51,102,0.12)",
                color: level === 0 ? "var(--text-muted)" : "var(--primary-color)",
                fontFamily: "Outfit", fontWeight: "600", fontSize: "0.85rem",
                cursor: level === 0 ? "not-allowed" : "pointer", opacity: level === 0 ? 0.4 : 1,
                transition: "all 0.2s"
              }}
            >
              <ArrowLeft size={15} /> Anterior
            </button>

            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
              {level + 1} / 6
            </span>

            <button
              onClick={nextLevel}
              disabled={level === 5}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px", border: "1.5px solid var(--primary-color)",
                background: level === 5 ? "rgba(255,255,255,0.05)" : "rgba(255,51,102,0.12)",
                color: level === 5 ? "var(--text-muted)" : "var(--primary-color)",
                fontFamily: "Outfit", fontWeight: "600", fontSize: "0.85rem",
                cursor: level === 5 ? "not-allowed" : "pointer", opacity: level === 5 ? 0.4 : 1,
                transition: "all 0.2s"
              }}
            >
              Siguiente <ArrowRight size={15} />
            </button>
          </div>

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
