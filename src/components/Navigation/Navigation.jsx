import "./Navigation.css";
import React, { useState } from "react";
import {
  Compass,
  Film,
  Users,
  Award,
  Gamepad2,
  Calendar,
  Heart,
  Settings,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  Map,
  Sparkles,
  Info,
  Layers
} from "lucide-react";
import { auth } from "../../Firebase/config";
import { signOut } from "firebase/auth";

export default function Navigation({
  activeTab,
  setActiveTab,
  user,
  onChangeNation,
  activeNation,
  onLogout
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      onLogout();
    });
  };

  const navItems = [
    { id: "dashboard", label: "Inicio", icon: Compass },
    { id: "info", label: "Datos de la Serie", icon: Info },
    { id: "characters", label: "Galería de Personajes", icon: Users },
    { id: "season1", label: "Libro Agua (T1)", icon: Film, className: "nacion-agua" },
    { id: "season2", label: "Libro Tierra (T2)", icon: Film, className: "nacion-tierra" },
    { id: "season3", label: "Libro Fuego (T3)", icon: Film, className: "nacion-fuego" },
    { id: "nations", label: "Las Cuatro Naciones", icon: Map },
    { id: "quiz", label: "Quiz de Sabiduría", icon: Award },
    { id: "appa-maze", label: "El Laberinto de Appa", icon: Gamepad2 },
    { id: "memory-game", label: "Memoria Avatar", icon: Gamepad2 },
    { id: "timeline", label: "Nuestra Leyenda", icon: Calendar },
    { id: "anniversaries", label: "Nuestros Meses", icon: Heart },
    { id: "special-dates", label: "Fechas Especiales", icon: Calendar },
    { id: "poems", label: "Poemas a la Distancia", icon: FileText },
    { id: "easter-eggs", label: "Símbolos Ocultos", icon: Sparkles },
    { id: "credits", label: "Créditos", icon: HelpCircle },
  ];

  const nationsList = [
    { id: "agua", name: "Tribu del Agua", symbol: "🌊", color: "#1B6CA8" },
    { id: "tierra", name: "Reino de la Tierra", symbol: "🌱", color: "#4A7C59" },
    { id: "fuego", name: "Nación del Fuego", symbol: "🔥", color: "#C0392B" },
    { id: "aire", name: "Nómadas del Aire", symbol: "💨", color: "#E8B86D" }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer"
          }}
        >
          ☰
        </button>
        <span style={{ fontFamily: "Cinzel", color: "var(--primary-color)", fontWeight: "bold" }}>
          MUNDO AVATAR
        </span>
        <div className="user-avatar" style={{ width: 30, height: 30, fontSize: "0.8rem" }}>
          {user.apodo ? user.apodo.substring(0, 2).toUpperCase() : "AV"}
        </div>
      </div>

      {/* Sidebar Panel */}
      <div className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">El Mundo Avatar</div>

        <div className="sidebar-nav">
          <div className="nav-section-title">El Universo</div>
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${item.className || ""} ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} style={{ marginRight: 10 }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="nav-section-title">Juegos y Retos</div>
          {navItems.slice(7, 10).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} style={{ marginRight: 10 }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="nav-section-title">Nuestro Templo</div>
          {navItems.slice(10, 14).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} style={{ marginRight: 10 }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="nav-section-title">Extras</div>
          {navItems.slice(14).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} style={{ marginRight: 10 }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          {user.rol === "admin" && (
            <>
              <div className="nav-section-title">Administración</div>
              <div
                className={`nav-item ${activeTab === "boyfriend-panel" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("boyfriend-panel");
                  setMobileMenuOpen(false);
                }}
                style={{ color: "#caa360", borderLeftColor: "#caa360" }}
              >
                <Shield size={18} style={{ marginRight: 10 }} />
                <span>Panel de Vivi/Caren</span>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div
            className="user-profile"
            onClick={() => setShowSettings(true)}
            style={{ cursor: "pointer", padding: "5px", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="user-avatar">
              {user.apodo ? user.apodo.substring(0, 2).toUpperCase() : "AV"}
            </div>
            <div className="user-info">
              <div className="user-nickname">{user.apodo || "Avatar"}</div>
              <div className="user-role" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span>Nación: {activeNation.toUpperCase()}</span>
                <Settings size={10} />
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "var(--text-muted)",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              fontFamily: "Outfit",
              fontSize: "0.8rem",
              width: "100%"
            }}
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Nation Changer Modal (Settings) */}
      {showSettings && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal-content" style={{ maxWidth: "400px" }}>
            <h3 style={{ marginBottom: "15px", textAlign: "center", color: "var(--primary-color)" }}>
              Alineación de Elemento
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px", textAlign: "center" }}>
              Elige tu nación actual para cambiar instantáneamente la paleta de colores y el fluir de la energía del sitio.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {nationsList.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onChangeNation(n.id);
                    setShowSettings(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    background: activeNation === n.id ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.2)",
                    border: activeNation === n.id ? `2px solid ${n.color}` : "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeNation === n.id ? "bold" : "normal"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "3rem", height: "3rem", borderRadius: "50%",
                      border: `2px solid ${n.color}`,
                      boxShadow: `0 0 12px ${n.color}80`,
                      background: `${n.color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0
                    }}>
                      <img
                        src={`/escudo${n.id.charAt(0).toUpperCase() + n.id.slice(1)}.png`}
                        alt={n.name}
                        style={{ width: "85%", height: "85%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }}
                      />
                    </div>
                    <span>{n.name}</span>
                  </div>
                  {activeNation === n.id && (
                    <span style={{ color: n.color, fontSize: "0.8rem", textTransform: "uppercase" }}>
                      Activo
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="pergamino-btn"
              style={{
                marginTop: "20px",
                padding: "10px",
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #444 0%, #222 100%)",
                borderColor: "#333",
                color: "#fff"
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
