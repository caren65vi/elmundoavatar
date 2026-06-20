import "./SpecialDates.css";
import React, { useState, useEffect, useRef } from "react";
import { defaultSpecialDates } from "../../mockData";
import { db } from "../../Firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Gift, Calendar, Heart, Hourglass } from "lucide-react";

export default function SpecialDates() {
  const [dates, setDates] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const canvasRef = useRef(null);

  // Load special dates from Firestore or fallback to mock data
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mensajes_especiales"));
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });

        if (fetched.length > 0) {
          setDates(fetched);
        } else {
          setDates(defaultSpecialDates);
        }
      } catch (err) {
        console.error("Error fetching special dates, using default: ", err);
        setDates(defaultSpecialDates);
      }
    };
    fetchDates();
  }, []);

  // Update countdown timers every second
  useEffect(() => {
    if (dates.length === 0) return;

    const timer = setInterval(() => {
      const newCountdowns = {};

      dates.forEach((d) => {
        const target = new Date(d.date).getTime();
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
          // Time is up!
          newCountdowns[d.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };

          // Trigger celebration once
          if (!celebrationActive) {
            setCelebrationMessage(d.description);
            setCelebrationActive(true);
          }
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          newCountdowns[d.id] = { days, hours, minutes, seconds, isZero: false };
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [dates, celebrationActive]);

  // Full Screen particle explosion on canvas when countdown hits 0
  useEffect(() => {
    if (!celebrationActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const elementsColors = ["#1B6CA8", "#A8D8EA", "#4A7C59", "#D4A843", "#C0392B", "#E67E22", "#E8B86D", "#F5F5F0"];

    // Spawn initial explosion particles
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        size: 3 + Math.random() * 8,
        color: elementsColors[Math.floor(Math.random() * elementsColors.length)],
        alpha: 1,
        decay: 0.01 + Math.random() * 0.02
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.alpha -= p.decay;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Refill some floating element bubbles
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -1 - Math.random() * 4,
            size: 4 + Math.random() * 10,
            color: elementsColors[Math.floor(Math.random() * elementsColors.length)],
            alpha: 0.8,
            decay: 0.002 + Math.random() * 0.005
          });
        }
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [celebrationActive]);

  return (
    <div>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Próximos Eventos
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          La cuenta regresiva sagrada para celebrar juntos los momentos que cambian nuestras vidas.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
        {dates.map((d) => {
          const cd = countdowns[d.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
          return (
            <div
              key={d.id}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                backdropFilter: "blur(10px)",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "rgba(192, 160, 96, 0.1)",
                    border: "1px solid var(--primary-color)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--primary-color)"
                  }}
                >
                  {d.id.includes("aniversario") ? <Heart size={20} fill="currentColor" /> : <Gift size={20} />}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "bold" }}>
                  📅 {new Date(d.date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                </span>
              </div>

              {d.photoUrl && (
                <img
                  src={d.photoUrl}
                  alt={d.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    border: "1px solid var(--border-color)"
                  }}
                />
              )}

              <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "8px", fontFamily: "Cinzel" }}>
                {d.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "25px", lineHeight: "1.4" }}>
                {d.description}
              </p>

              {/* Countdown numbers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", textAlign: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>{cd.days}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Días</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>{cd.hours}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Horas</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>{cd.minutes}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Min</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>{cd.seconds}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Seg</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration overlay modal when countdown reaches 0 */}
      {celebrationActive && (
        <>
          <canvas
            ref={canvasRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 99998,
              pointerEvents: "none"
            }}
          />
          <div className="modal-overlay" style={{ zIndex: 99997 }}>
            <div
              className="pergamino"
              style={{
                maxWidth: "500px",
                padding: "40px 30px",
                textAlign: "center",
                animation: "pop-in 0.4s ease forwards"
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(192, 160, 96, 0.1)",
                  border: "2px solid var(--primary-color)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2.2rem",
                  margin: "0 auto 20px"
                }}
              >
                🎉
              </div>

              <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)" }}>
                ¡Llegó la Fecha Especial! 💖
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  lineHeight: "1.7",
                  color: "#3b2c16",
                  fontStyle: "italic",
                  marginBottom: "30px"
                }}
              >
                {celebrationMessage || "Hoy celebramos otro hermoso paso juntos en nuestra leyenda del amor."}
              </p>

              <button
                onClick={() => setCelebrationActive(false)}
                className="pergamino-btn"
                style={{ maxWidth: "200px" }}
              >
                ¡Gracias Amor!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
