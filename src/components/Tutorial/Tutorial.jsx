import "./Tutorial.css";
import React, { useState } from "react";
import { HelpCircle, ChevronRight, X } from "lucide-react";

export default function Tutorial({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡Yip Yip! Bienvenido al Mundo Avatar",
      description: "Esta página fue creada especialmente para ti con todo el amor. Permíteme darte un breve recorrido por los secretos de las cuatro naciones.",
      element: "appa",
      symbol: "💨"
    },
    {
      title: "Navegación de los 4 Elementos",
      description: "En la barra lateral izquierda encontrarás las secciones de la serie. Cada nación tiene su propia paleta de colores y sonidos tradicionales que cambiarán toda la página.",
      element: "nav",
      symbol: "🌊"
    },
    {
      title: "Cambiar tu Nación",
      description: "Puedes hacer clic en tu foto de perfil en la esquina inferior izquierda del menú para abrir la configuración y elegir qué nación representas (Agua, Tierra, Fuego o Aire) para personalizar toda tu experiencia.",
      element: "nacion",
      symbol: "🌱"
    },
    {
      title: "Juegos del Elemento Control",
      description: "Pon a prueba tu sabiduría en el Quiz de 200 preguntas para descubrir qué personaje eres, o ayuda a Appa a esquivar obstáculos en un laberinto interactivo de 4 niveles.",
      element: "juegos",
      symbol: "🔥"
    },
    {
      title: "Nuestra Leyenda de Amor",
      description: "Explora tus poemas recibidos con sobres antiguos, consulta los aniversarios mensuales en 'Nuestros Meses' y añade momentos especiales con ilustraciones de cada estación.",
      element: "amor",
      symbol: "❤️"
    },
    {
      title: "Appa, Tu Compañero",
      description: "Appa te acompañará en la esquina de la pantalla. Haz clic en él en cualquier momento para recibir mensajes divertidos, pistas del quiz o recordatorios románticos.",
      element: "appa-helper",
      symbol: "🐃"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 99999 }}>
      <div
        className="modal-content"
        style={{
          backgroundColor: "#f7edd5",
          color: "#3b2c16",
          border: "3px solid #caa360",
          boxShadow: "inset 0 0 40px rgba(139,87,42,0.2), 0 20px 45px rgba(0,0,0,0.6)",
          maxWidth: "480px",
          padding: "30px",
        }}
      >
        <button
          className="modal-close-btn"
          style={{ color: "#63431d" }}
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <span style={{ fontSize: "2rem" }}>{steps[currentStep].symbol}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#8b572a" }}>
            Guía del Avatar — Paso {currentStep + 1} de {steps.length}
          </span>
        </div>

        <h3 style={{ fontFamily: "Cinzel", fontSize: "1.4rem", color: "#63431d", marginBottom: "15px" }}>
          {steps[currentStep].title}
        </h3>

        <p style={{ fontFamily: "Outfit", fontSize: "0.95rem", lineHeight: "1.6", color: "#4e3d28", marginBottom: "25px" }}>
          {steps[currentStep].description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#8b572a",
              fontFamily: "Outfit",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Saltar tutorial
          </button>

          <button
            onClick={handleNext}
            style={{
              background: "linear-gradient(135deg, #a05a2c 0%, #7b3f15 100%)",
              color: "#f7edd5",
              border: "1px solid #63320c",
              borderRadius: "20px",
              padding: "8px 20px",
              fontFamily: "Cinzel",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            }}
          >
            <span>{currentStep === steps.length - 1 ? "Comenzar" : "Siguiente"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
