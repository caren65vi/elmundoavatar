import "./LockScreenSim.css";
import React, { useState, useEffect } from "react";
import { Heart, Bell, HeartCrack } from "lucide-react";

export default function LockScreenSim({ onOpenPoem, customMessage }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [hearts, setHearts] = useState([]);
  const [showAangBending, setShowAangBending] = useState(false);
  const [aangHeartActive, setAangHeartActive] = useState(false);

  useEffect(() => {
    // Clock tick
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutes}`);

      // Spanish Date
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setDate(now.toLocaleDateString('es-ES', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spawn romantic floating hearts
  useEffect(() => {
    const heartInterval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-15),
        {
          id: Math.random(),
          left: `${10 + Math.random() * 80}%`,
          size: 15 + Math.random() * 20,
          duration: 3 + Math.random() * 3,
        },
      ]);
    }, 800);

    return () => clearInterval(heartInterval);
  }, []);

  const triggerAangEarthbend = () => {
    setShowAangBending(true);
    setAangHeartActive(false);

    // Timeline of earthbending:
    // 1s: Aang gathers rocks.
    // 2s: Launches rock.
    // 3s: Rock breaks into glowing heart.
    setTimeout(() => {
      setAangHeartActive(true);
    }, 1500);

    setTimeout(() => {
      setShowAangBending(false);
      setAangHeartActive(false);
    }, 5000);
  };

  return (
    <div className="lockscreen-mobile-container">
      <div className="lockscreen-notch" />

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
          }}
          fill="#ff3366"
        />
      ))}

      {/* Time & Date */}
      <div className="lockscreen-time">{time}</div>
      <div className="lockscreen-date">{date}</div>

      {/* Notification Center */}
      <div className="lockscreen-notifications" style={{ flex: 1, zIndex: 10 }}>
        <div
          className="lockscreen-notification-box"
          onClick={onOpenPoem}
          style={{ borderLeft: "4px solid #ff3366" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontWeight: "bold", color: "#fff", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 5 }}>
              <Heart size={14} fill="#ff3366" color="#ff3366" />
              <span>Mi Amor 💖</span>
            </span>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>Ahora</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#ddd", textAlign: "left", lineHeight: "1.3" }}>
            {customMessage || "Te he dejado un poema mágico en tu panel. Abre tu sobre de la distancia... ✉️💕"}
          </div>
        </div>

        <div className="lockscreen-notification-box" style={{ borderLeft: "4px solid #caa360", animationDelay: "0.5s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontWeight: "bold", color: "#fff", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 5 }}>
              <Bell size={14} color="#caa360" />
              <span>Mundo Avatar 🍃</span>
            </span>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>Hace 5m</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#ddd", textAlign: "left", lineHeight: "1.3" }}>
            ¡Appa está listo para volar! Supera su laberinto de las 4 naciones para ganar un premio especial de Vivi. 🐮🎒
          </div>
        </div>
      </div>

      {/* Custom Earthbending animation display area */}
      {showAangBending && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid #4a7c59",
            borderRadius: "12px",
            padding: "10px",
            zIndex: 30,
            textAlign: "center",
            boxShadow: "0 0 20px rgba(74, 124, 89, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#a4cfa7", fontSize: "0.75rem", fontWeight: "bold", marginBottom: 5 }}>
            ¡Aang te envía su amor con Tierra Control!
          </div>

          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            {!aangHeartActive ? (
              // Rock gathering
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "#8B6914",
                  borderRadius: "50%",
                  margin: "25px auto",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                  animation: "spin 1.5s infinite linear",
                }}
              />
            ) : (
              // Heart burst
              <Heart
                size={40}
                color="#ff3366"
                fill="#ff3366"
                style={{
                  margin: "20px auto",
                  filter: "drop-shadow(0 0 10px #ff3366)",
                  animation: "pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom Lockscreen controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <button
          onClick={triggerAangEarthbend}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.3s ease",
          }}
          title="Tierra Control"
        >
          🌱
        </button>

        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
          Desliza para desbloquear
        </div>

        <button
          onClick={onOpenPoem}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.3s ease",
          }}
          title="Abrir Poemas"
        >
          💌
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
