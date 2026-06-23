import "./AppaMaze.css";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../Firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, RefreshCw } from "lucide-react";
import aangHead from "../../assets/cabezaAang.png";

// Maze definition matrices
// 0: path, 1: wall, 2: start, 3: goal
const levelMazes = [
  // ── Nivel 1 — Fácil (12×12) ─────────────────────────────────────────────
  [
    [1,1,2,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,1,1,1],
    [1,0,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,1,1,1,1,0,1],
    [1,1,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,1,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,3,1]
  ],
  // ── Nivel 2 — Fácil-Medio (12×12) ───────────────────────────────────────
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
  // ── Nivel 3 — Medio (12×12) ──────────────────────────────────────────────
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

  // ── Nivel 4 — Difícil (21×21) ────────────────────────────────────────────
  [
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1]
  ],

  // ── Nivel 5 — Muy Difícil (31×31) ────────────────────────────────────────
  [
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1]
  ],

  // ── Nivel 6 — Extremo (41×41) ────────────────────────────────────────────
  [
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1],
    [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1]
  ]
];

const levelConfigs = [
  { name: "Nivel 1: Tribu Agua del Sur 🌊", bgColor: "#0c2340", wallColor: "#1b6ca8", hazardEmoji: "🧊", hazardName: "Icebergs", speed: 1.2 },
  { name: "Nivel 2: Pantanos del Espíritu 🌿", bgColor: "#0d1f0e", wallColor: "#2e7d32", hazardEmoji: "🐊", hazardName: "Criaturas del Pantano", speed: 1.7 },
  { name: "Nivel 3: Muros de Ba Sing Se 🌱", bgColor: "#142516", wallColor: "#4a7c59", hazardEmoji: "🪨", hazardName: "Agentes del Dai Li", speed: 2.2 },
  { name: "Nivel 4: Templos Celestiales del Aire 💨", bgColor: "#0f1c2c", wallColor: "#e8b86d", hazardEmoji: "🌪️", hazardName: "Viento Turbulento", speed: 2.4 },
  { name: "Nivel 5: Caldera del Volcán 🔥", bgColor: "#230b0b", wallColor: "#c0392b", hazardEmoji: "🚀", hazardName: "Columnas de Fuego", speed: 2.8 },
  { name: "Nivel 6: Palacio del Rey Ozai ⚡", bgColor: "#1a0a00", wallColor: "#b7410e", hazardEmoji: "⚡", hazardName: "Rayos del Rey Ozai", speed: 3.2 }
];

export const defaultLetter = "Espero que ames cada detalle de esta página hecha con el corazón. Eres mi agua control en días de tormenta y mi cimiento fuerte frente al mundo. ¡Feliz mes mi amor! 💕✨";

export default function AppaMaze({ user }) {
  const [level, setLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 0 });
  const [hazards, setHazards] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const canvasRef = useRef(null);
  const appaImgRef = useRef(null);
  const aangHeadImgRef = useRef(null);
  const [imgsReady, setImgsReady] = useState(false);

  // Dynamic grid size and cell size based on maze dimensions
  const gridCount = levelMazes[level].length;
  const cellSize = gridCount <= 12 ? 30 : gridCount <= 21 ? 22 : gridCount <= 31 ? 15 : 11;

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

  // Finds start cell (value=2) in a given maze
  const getStartPos = (lvlIdx) => {
    const matrix = levelMazes[lvlIdx];
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] === 2) return { x: c, y: r };
      }
    }
    return { x: 1, y: 0 };
  };

  // Hazard positions — all horizontal (dirX:±1, dirY:0)
  const levelHazardPositions = [
    // Nivel 1 (12×12)
    [
      { x: 10, y: 1, dirX: 1, dirY: 0 },
      { x: 6,  y: 2, dirX: 1, dirY: 0 },
      { x: 10, y: 5, dirX: 1, dirY: 0 }
    ],
    // Nivel 2 (12×12)
    [
      { x: 4, y: 2, dirX: 1, dirY: 0 },
      { x: 6, y: 2, dirX: 1, dirY: 0 },
      { x: 8, y: 2, dirX: 1, dirY: 0 }
    ],
    // Nivel 3 (12×12)
    [
      { x: 10, y: 1, dirX: 1, dirY: 0 },
      { x: 7,  y: 2, dirX: 1, dirY: 0 },
      { x: 8,  y: 4, dirX: 1, dirY: 0 }
    ],
    // Nivel 4 (21×21) — corridors en filas 1, 5 y 13
    [
      { x: 5,  y: 1,  dirX:  1, dirY: 0 },
      { x: 11, y: 1,  dirX: -1, dirY: 0 },
      { x: 5,  y: 13, dirX:  1, dirY: 0 }
    ],
    // Nivel 5 (31×31) — corridors en filas 1, 15 y 29
    [
      { x: 2, y: 1,  dirX:  1, dirY: 0 },
      { x: 8, y: 1,  dirX: -1, dirY: 0 },
      { x: 2, y: 15, dirX:  1, dirY: 0 },
      { x: 6, y: 29, dirX:  1, dirY: 0 }
    ],
    // Nivel 6 (41×41) — corridors en filas 1, 19, 29 y 39
    [
      { x: 3,  y: 1,  dirX:  1, dirY: 0 },
      { x: 10, y: 1,  dirX: -1, dirY: 0 },
      { x: 4,  y: 19, dirX:  1, dirY: 0 },
      { x: 7,  y: 29, dirX: -1, dirY: 0 },
      { x: 2,  y: 39, dirX:  1, dirY: 0 }
    ]
  ];

  // Initialize level: set player position and hazards
  useEffect(() => {
    const startPos = getStartPos(level);
    setPlayerPosition(startPos);
    setGameWon(false);
    const cs = levelMazes[level].length <= 12 ? 30 : levelMazes[level].length <= 21 ? 22 : levelMazes[level].length <= 31 ? 15 : 11;
    const positions = levelHazardPositions[level];
    setHazards(positions.map((pos, i) => ({
      id: i,
      x: pos.x * cs + cs / 2,
      y: pos.y * cs + cs / 2,
      gridX: pos.x,
      gridY: pos.y,
      dirX: pos.dirX,
      dirY: pos.dirY
    })));
  }, [level]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const matrix = levelMazes[level];
    const config = levelConfigs[level];
    const cs = cellSize;
    const gc = gridCount;

    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < gc; r++) {
      for (let c = 0; c < gc; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillStyle = config.wallColor;
          ctx.fillRect(c * cs, r * cs, cs, cs);
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.strokeRect(c * cs, r * cs, cs, cs);
        } else if (matrix[r][c] === 3) {
          if (aangHeadImgRef.current?.complete && aangHeadImgRef.current.naturalWidth > 0) {
            ctx.drawImage(aangHeadImgRef.current, c * cs + 2, r * cs + 2, cs - 4, cs - 4);
            continue;
          }
          ctx.fillStyle = "#ff3366";
          ctx.beginPath();
          ctx.arc(c * cs + cs / 2, r * cs + cs / 2, cs / 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = `${Math.max(10, cs - 8)}px Outfit`;
          ctx.fillText("💕", c * cs + 2, r * cs + cs - 4);
        }
      }
    }

    hazards.forEach((h) => {
      ctx.font = `${Math.max(10, cs - 4)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(config.hazardEmoji, h.x, h.y);
    });

    const px = playerPosition.x * cs;
    const py = playerPosition.y * cs;
    if (appaImgRef.current?.complete && appaImgRef.current.naturalWidth > 0) {
      ctx.drawImage(appaImgRef.current, px + 1, py + 1, cs - 2, cs - 2);
    } else {
      ctx.font = `${Math.max(10, cs)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🐮", px + cs / 2, py + cs / 2);
    }
  }, [level, playerPosition, hazards, imgsReady, cellSize, gridCount]);

  // Hazard animation loop
  useEffect(() => {
    if (gameWon || gameCompleted) return;
    const cs = cellSize;
    const gc = gridCount;
    const timer = setInterval(() => {
      const config = levelConfigs[level];
      const matrix = levelMazes[level];
      setHazards((prevHazards) =>
        prevHazards.map((h) => {
          let nextX = h.x + h.dirX * config.speed;
          let nextY = h.y + h.dirY * config.speed;
          const currentCellX = Math.floor(nextX / cs);
          const currentCellY = Math.floor(nextY / cs);
          const hitsWall =
            currentCellX < 0 || currentCellX >= gc ||
            currentCellY < 0 || currentCellY >= gc ||
            matrix[currentCellY]?.[currentCellX] === 1;
          if (hitsWall) {
            return { ...h, dirX: -h.dirX, dirY: -h.dirY, x: h.x + (-h.dirX) * config.speed, y: h.y + (-h.dirY) * config.speed };
          }
          return { ...h, x: nextX, y: nextY };
        })
      );
    }, 40);
    return () => clearInterval(timer);
  }, [level, gameWon, gameCompleted, cellSize, gridCount]);

  // Collision detection
  useEffect(() => {
    if (gameWon || gameCompleted) return;
    const playerWorldX = playerPosition.x * cellSize + cellSize / 2;
    const playerWorldY = playerPosition.y * cellSize + cellSize / 2;
    const hit = hazards.some((h) => Math.hypot(h.x - playerWorldX, h.y - playerWorldY) < 18);
    if (hit) setPlayerPosition(getStartPos(level));
  }, [playerPosition, hazards, level, gameWon, gameCompleted, cellSize]);

  const handleLevelComplete = async () => {
    if (level < 5) {
      setGameWon(true);
      return;
    } else {
      setGameCompleted(true);
      setSavingProgress(true);
      try {
        if (!user?.uid) throw new Error("No hay una sesión válida.");
        await setDoc(doc(db, "juego_progreso", user.uid), {
          laberinto: { nivelActual: 6, completado: true, cartaDesamorDesbloqueada: true },
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Error saving maze progress:", err);
      } finally {
        setSavingProgress(false);
      }
    }
  };

  const movePlayer = (dx, dy) => {
    const matrix = levelMazes[level];
    const gc = matrix.length;
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    if (newX >= 0 && newX < gc && newY >= 0 && newY < gc) {
      if (matrix[newY][newX] !== 1) {
        setPlayerPosition({ x: newX, y: newY });
        if (matrix[newY][newX] === 3) handleLevelComplete();
      }
    }
  };

  // Keyboard controls — declared after movePlayer so the closure is valid
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon || gameCompleted) return;
      let dx = 0, dy = 0;
      if      (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") dy = -1;
      else if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") dy =  1;
      else if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") dx = -1;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dx =  1;
      if (dx !== 0 || dy !== 0) { e.preventDefault(); movePlayer(dx, dy); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, level, gameWon, gameCompleted]);

  const nextLevel = () => { if (level < 5) setLevel((p) => p + 1); };
  const prevLevel = () => { if (level > 0) { setLevel((p) => p - 1); setGameWon(false); } };
  const resetGame = () => { setLevel(0); setGameCompleted(false); setGameWon(false); setPlayerPosition(getStartPos(0)); };

  return (
    <div className="maze-canvas-container">
      <div style={{ marginBottom: "25px", textAlign: "left", width: "100%", maxWidth: "520px" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "1.8rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Guía a Appa por el Laberinto
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Controla a Aang montado sobre Appa. Esquiva los obstáculos y llévalo al portal de corazones. Usa teclado (flechas/WASD) o los botones táctiles.
        </p>
      </div>

      {!gameCompleted ? (
        <div style={{ background: "var(--bg-panel)", border: "2px solid var(--primary-color)", borderRadius: "16px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", display: "inline-block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>
            <span>{levelConfigs[level].name}</span>
            <span style={{ color: "#c0392b" }}>Evita: {levelConfigs[level].hazardName}</span>
          </div>

          <div style={{ overflowX: "auto", overflowY: "auto", maxWidth: "100%", maxHeight: "70vh" }}>
            <canvas
              ref={canvasRef}
              width={cellSize * gridCount}
              height={cellSize * gridCount}
              className="maze-canvas"
              style={{ display: "block" }}
            />
          </div>

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

          {/* D-Pad controles móviles */}
          <div className="maze-controls">
            <button className="maze-ctrl-btn up"    onClick={() => movePlayer(0, -1)}><ArrowUp    size={20} /></button>
            <button className="maze-ctrl-btn left"  onClick={() => movePlayer(-1, 0)}><ArrowLeft  size={20} /></button>
            <button className="maze-ctrl-btn right" onClick={() => movePlayer(1,  0)}><ArrowRight size={20} /></button>
            <button className="maze-ctrl-btn down"  onClick={() => movePlayer(0,  1)}><ArrowDown  size={20} /></button>
          </div>
        </div>
      ) : (
        <div className="pergamino" style={{ maxWidth: "480px", animation: "pop-in 0.4s ease forwards", padding: "40px 30px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,51,102,0.1)", border: "2px solid #ff3366", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2.2rem", margin: "0 auto 20px" }}>
            💖
          </div>
          <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99,67,29,0.2)" }}>
            ¡Mensaje Secreto Desbloqueado!
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", lineHeight: "1.7", color: "#3b2c16", fontStyle: "italic", textAlign: "center", marginBottom: "30px", padding: "10px" }}>
            "{defaultLetter}"
          </p>
          <button onClick={resetGame} className="pergamino-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <RefreshCw size={16} />
            <span>Volver a Jugar</span>
          </button>
        </div>
      )}

      {/* Modal: nivel completado */}
      {gameWon && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "380px", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>🎉</span>
            <h3 style={{ fontSize: "1.3rem", color: "#fff", margin: "15px 0 10px", fontFamily: "Cinzel" }}>¡Nivel Completado!</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Appa ha dominado este elemento y está listo para cruzar el siguiente portal.
            </p>
            <button onClick={nextLevel} className="pergamino-btn">Avanzar Siguiente Nivel ➔</button>
          </div>
        </div>
      )}
    </div>
  );
}
