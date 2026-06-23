import "./SpecialDates.css";
import React, { useState, useEffect, useRef } from "react";
import { defaultSpecialDates } from "../../mockData";
import { db } from "../../Firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Gift, Heart, Plus, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PARTY_EMOJIS = ["🎉", "🎊", "✨", "💖", "🌟", "🎈", "🥳", "💫", "🎂", "🌸"];

const ELEMENT_CFG = {
  agua:   { color: "#1B6CA8", glow: "rgba(27,108,168,0.55)",  emoji: "🌊" },
  tierra: { color: "#4A7C59", glow: "rgba(74,124,89,0.55)",   emoji: "🌱" },
  fuego:  { color: "#C0392B", glow: "rgba(192,57,43,0.55)",   emoji: "🔥" },
  aire:   { color: "#c9a84c", glow: "rgba(232,184,109,0.55)", emoji: "💨" },
};

function isTodayDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export default function SpecialDates() {
  const { usuario } = useAuth();
  const [dates, setDates] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: "", message: "" });
  const canvasRef = useRef(null);
  const triggeredRef = useRef(new Set());

  // Add date form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formElement, setFormElement] = useState("agua");
  const [formPhoto, setFormPhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadDates = async () => {
    try {
      const snap = await getDocs(collection(db, "mensajes_especiales"));
      const fetched = [];
      snap.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      setDates(fetched.length > 0 ? fetched : defaultSpecialDates);
    } catch {
      setDates(defaultSpecialDates);
    }
  };

  useEffect(() => { loadDates(); }, []);

  useEffect(() => {
    if (dates.length === 0) return;
    const timer = setInterval(() => {
      const newCountdowns = {};
      dates.forEach((d) => {
        const diff = new Date(d.date).getTime() - Date.now();
        if (diff <= 0) {
          newCountdowns[d.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true };
          if (!triggeredRef.current.has(d.id)) {
            triggeredRef.current.add(d.id);
            setCelebrationData({ title: d.title, message: d.description });
            setCelebrationActive(true);
          }
        } else {
          newCountdowns[d.id] = {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            isZero: false
          };
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(timer);
  }, [dates]);

  useEffect(() => {
    if (!celebrationActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#1B6CA8", "#A8D8EA", "#4A7C59", "#D4A843", "#C0392B", "#E67E22", "#E8B86D", "#ff6bff", "#ffdd59", "#59eaff"];
    let particles = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14 - 4,
      size: 3 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.007 + Math.random() * 0.015
    }));
    let af;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      if (particles.length === 0) {
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -1.5 - Math.random() * 4,
            size: 4 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.9,
            decay: 0.002 + Math.random() * 0.004
          });
        }
      }
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.alpha -= p.decay;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      af = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(af);
  }, [celebrationActive]);

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formDesc) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "mensajes_especiales"), {
        title: formTitle,
        date: `${formDate}T00:00:00`,
        description: formDesc,
        element: formElement,
        photoUrl: formPhoto,
        timestamp: new Date().toISOString(),
        createdBy: usuario?.correo || "evelyn"
      });
      setFormTitle(""); setFormDate(""); setFormDesc(""); setFormPhoto(""); setFormElement("agua");
      setShowForm(false);
      showToast("¡Fecha especial guardada! 🎉");
      await loadDates();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "rgba(192,57,43,0.95)" : "rgba(44,90,62,0.95)", border: `1px solid ${toast.type === "error" ? "#c0392b" : "#4a7c59"}`, color: toast.type === "error" ? "#f5b7b1" : "#a4cfa7", borderRadius: "12px", padding: "12px 24px", fontSize: "0.9rem", fontWeight: "bold", zIndex: 99999, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: "35px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
            Fechas Especiales
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
            La cuenta regresiva sagrada para celebrar juntos los momentos que cambian nuestras vidas.
          </p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: showForm ? "rgba(192,160,96,0.15)" : "var(--primary-color)", color: showForm ? "var(--primary-color)" : "#000", border: "1px solid var(--primary-color)", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "0.9rem", fontFamily: "Cinzel", whiteSpace: "nowrap" }}
        >
          <Plus size={16} />
          {showForm ? "Cancelar" : "Agregar Fecha"}
        </button>
      </div>

      {/* Add Date Form */}
      {showForm && (
        <div className="add-date-form-wrap" style={{ marginBottom: "30px" }}>
          <h2>
            <Calendar size={18} color="var(--primary-color)" />
            Nueva Fecha Especial
          </h2>
          <form onSubmit={handleAddDate}>
            <div className="add-date-form-grid">
              <div className="full-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Título (ej. Cumpleaños de mamá 🎂)"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  className="form-input"
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <select className="form-input form-select" value={formElement} onChange={e => setFormElement(e.target.value)}>
                  <option value="agua">Agua 🌊</option>
                  <option value="tierra">Tierra 🌱</option>
                  <option value="fuego">Fuego 🔥</option>
                  <option value="aire">Aire 💨</option>
                </select>
              </div>
              <div className="full-row">
                <textarea
                  className="form-input"
                  placeholder="Mensaje de celebración (aparece cuando llega el día)..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="full-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="URL de foto (opcional)"
                  value={formPhoto}
                  onChange={e => setFormPhoto(e.target.value)}
                />
              </div>
              <div className="full-row form-submit-row">
                <button
                  type="submit"
                  className="pergamino-btn"
                  style={{ padding: "10px 20px", fontSize: "0.9rem", width: "auto" }}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar Fecha Especial 📅"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
        {dates.map((d) => {
          const cd = countdowns[d.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
          const isSpecialToday = isTodayDate(d.date);
          const cfg = ELEMENT_CFG[d.element] || ELEMENT_CFG.agua;

          return (
            <div
              key={d.id}
              className={`special-date-card${isSpecialToday ? " is-today" : ""}`}
              style={{ "--el-color": cfg.color, "--el-glow": cfg.glow }}
            >
              {isSpecialToday && (
                <>
                  <div className="floating-emojis-wrap" aria-hidden="true">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className="floating-emoji"
                        style={{
                          left: `${5 + (i * 9.5) % 88}%`,
                          animationDelay: `${i * 0.38}s`,
                          animationDuration: `${2.4 + (i % 3) * 0.7}s`,
                          fontSize: `${1.0 + (i % 3) * 0.35}rem`
                        }}
                      >
                        {PARTY_EMOJIS[i % PARTY_EMOJIS.length]}
                      </span>
                    ))}
                  </div>
                  <div className="today-banner">🎉 ¡HOY ES EL DÍA! 🎉</div>
                </>
              )}

              <div className="card-inner">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span className={`date-icon${isSpecialToday ? " date-icon-bounce" : ""}`}>
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
                    style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px", border: `1px solid ${cfg.color}` }}
                  />
                )}

                <h3 className={isSpecialToday ? "title-rainbow" : ""} style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "8px", fontFamily: "Cinzel" }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "25px", lineHeight: "1.4" }}>
                  {d.description}
                </p>

                {isSpecialToday ? (
                  <div className="celebration-strip">
                    <span>{cfg.emoji}</span>
                    <span style={{ fontFamily: "Cinzel", fontSize: "0.95rem", fontWeight: "bold" }}>¡Celebrando Hoy!</span>
                    <span>{cfg.emoji}</span>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", textAlign: "center" }}>
                    {[
                      { val: cd.days,    label: "Días" },
                      { val: cd.hours,   label: "Horas" },
                      { val: cd.minutes, label: "Min" },
                      { val: cd.seconds, label: "Seg" }
                    ].map(({ val, label }) => (
                      <div key={label} className="countdown-box">
                        <div className="countdown-num">{val}</div>
                        <div className="countdown-label">{label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration overlay when countdown hits 0 */}
      {celebrationActive && (
        <>
          <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 99998, pointerEvents: "none" }} />
          <div className="modal-overlay" style={{ zIndex: 99997 }}>
            <div className="pergamino" style={{ maxWidth: "500px", padding: "40px 30px", textAlign: "center", animation: "pop-in 0.4s ease forwards" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(192,160,96,0.1)", border: "2px solid var(--primary-color)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2.2rem", margin: "0 auto 20px" }}>
                🎉
              </div>
              <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99,67,29,0.2)" }}>
                {celebrationData.title || "¡Llegó la Fecha Especial!"} 💖
              </h2>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: "1.7", color: "#3b2c16", fontStyle: "italic", marginBottom: "30px" }}>
                {celebrationData.message || "Hoy celebramos otro hermoso paso juntos en nuestra leyenda del amor."}
              </p>
              <button onClick={() => setCelebrationActive(false)} className="pergamino-btn" style={{ maxWidth: "200px" }}>
                ¡Gracias Amor!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
