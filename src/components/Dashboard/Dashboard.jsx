import "./Dashboard.css";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Dashboard({ user, onSelectTab, daysTogether }) {
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };
  const elements = [
    {
      id: "agua",
      name: "Tribu del Agua",
      desc: "Control del cambio, la adaptabilidad y el flujo constante de las emociones.",
      symbol: "🌊",
      color: "#1b6ca8",
      bgClass: "theme-agua",
      tab: "nations",
      subNation: "agua"
    },
    {
      id: "tierra",
      name: "Reino de la Tierra",
      desc: "Fortaleza indestructible, cimientos estables y paciencia infinita.",
      symbol: "🌱",
      color: "#4a7c59",
      bgClass: "theme-tierra",
      tab: "nations",
      subNation: "tierra"
    },
    {
      id: "fuego",
      name: "Nación del Fuego",
      desc: "La chispa de la pasión, el impulso del corazón y la energía vital.",
      symbol: "🔥",
      color: "#c0392b",
      bgClass: "theme-fuego",
      tab: "nations",
      subNation: "fuego"
    },
    {
      id: "aire",
      name: "Nómadas del Aire",
      desc: "Libertad y ligereza del alma, desapego y paz espiritual.",
      symbol: "💨",
      color: "#e8b86d",
      bgClass: "theme-aire",
      tab: "nations",
      subNation: "aire"
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2.2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          ¡Bienvenida al Mundo Avatar, {user.apodo || "Guerrera"}!
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit", maxWidth: "600px" }}>
          Explora los secretos de los 4 elementos, pon a prueba tu sabiduría y recorre los hitos mágicos de nuestro amor.
        </p>
      </div>

      <section className="dashboard-adventure-card">
        <div className="dashboard-adventure-card__glow" aria-hidden="true" />
        <div className="dashboard-adventure-card__content">
          <span className="dashboard-adventure-card__eyebrow">✦ Tu aventura continúa</span>
          <h2>Hola, {user.apodo || "guerrera"}.</h2>
          <p>
            Cada visita deja una huella en este mundo. Hoy puedes seguir descubriendo la historia de Aang,
            ayudar a Appa o dejar que el quiz revele qué energía te acompaña.
          </p>
          <div className="dashboard-adventure-card__actions">
            <button type="button" onClick={() => onSelectTab("quiz")}>Jugar el quiz</button>
            <button type="button" className="dashboard-adventure-card__secondary" onClick={() => onSelectTab("appa-maze")}>Guiar a Appa</button>
          </div>
        </div>
        <div className="dashboard-adventure-card__days" aria-label={`${daysTogether || 0} días juntos`}>
          <strong>{daysTogether || "∞"}</strong>
          <span>días de<br />nuestra leyenda</span>
        </div>
      </section>

      {notificationPermission === "default" && user?.rol !== "admin" && (
        <aside className="dashboard-notification-card">
          <span aria-hidden="true">🐾</span>
          <p><strong>Appa puede avisarte.</strong> Activa las notificaciones para recibir poemas y sorpresas aunque no estés mirando la página.</p>
          <button type="button" onClick={enableNotifications}>Activar avisos</button>
        </aside>
      )}

      {/* Love days banner */}
      {daysTogether !== null && (
        <div
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "35px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(255, 51, 102, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ff3366",
              fontSize: "1.4rem"
            }}
          >
            ❤️
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Nuestra Leyenda Lleva
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#fff", fontFamily: "var(--font-avatar)" }}>
              {daysTogether} Días Juntos de Puro Amor 💕
            </div>
          </div>
        </div>
      )}

      {/* 4 Element Cards */}
      <h2 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "20px", textAlign: "left" }}>
        Domina los Cuatro Elementos
      </h2>
      <div className="naciones-grid">
        {elements.map((el) => (
          <div
            key={el.id}
            className="nacion-card"
            onClick={() => onSelectTab(el.tab, el.subNation)}
            style={{ color: el.color }}
          >
            <div
              className="nacion-card-bg"
              style={{
                backgroundColor: el.color,
                backgroundImage: `radial-gradient(circle, ${el.color}33 0%, #030408 80%)`
              }}
            />
            <div className="nacion-card-content">
              <div className="nacion-card-symbol">
                <img
                  src={`/escudo${el.id.charAt(0).toUpperCase() + el.id.slice(1)}.png`}
                  alt={el.name}
                  style={{ width: "75%", height: "75%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }}
                />
              </div>
              <h3 className="nacion-card-title">{el.name}</h3>
              <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "10px", lineHeight: "1.4" }}>
                {el.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Features Quick Access */}
      <div style={{ marginTop: "45px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div
          onClick={() => onSelectTab("quiz")}
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "25px",
            textAlign: "left",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
          className="dashboard-quick-link"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ fontSize: "1.5rem" }}>🏆</span>
            <Sparkles size={18} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>Quiz de Sabiduría</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
            Responde trivias desafiantes de la serie y descubre con qué personaje de Avatar te identificas hoy.
          </p>
        </div>

        <div
          onClick={() => onSelectTab("appa-maze")}
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "25px",
            textAlign: "left",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
          className="dashboard-quick-link"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ fontSize: "1.5rem" }}>🧭</span>
            <Sparkles size={18} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>Laberinto de Appa</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
            Guía a Appa montado con Aang por 4 niveles temáticos llenos de obstáculos y desbloquea un gran regalo.
          </p>
        </div>

        <div
          onClick={() => onSelectTab("poems")}
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "25px",
            textAlign: "left",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
          className="dashboard-quick-link"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ fontSize: "1.5rem" }}>💌</span>
            <Sparkles size={18} color="var(--primary-color)" />
          </div>
          <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>Poemas a la Distancia</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
            Colección de poemas románticos escritos desde el alma. Abre los sobres interactivos y escucha su música.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-quick-link:hover {
          transform: translateY(-4px);
          border-color: var(--primary-color);
          box-shadow: 0 12px 25px var(--primary-glow);
        }
      `}} />
    </div>
  );
}
