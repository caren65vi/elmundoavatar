import "./Timeline.css";
import { useState, useEffect } from "react";
import { db } from "../../Firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { defaultTimeline } from "../../mockData";
import { Plus, X, MapPin } from "lucide-react";

export default function Timeline({ user }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [momentTitle, setMomentTitle] = useState("");
  const [momentDate, setMomentDate] = useState("");
  const [momentDesc, setMomentDesc] = useState("");
  const [momentDetails, setMomentDetails] = useState("");
  const [momentElement, setMomentElement] = useState("agua");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "linea_tiempo"), orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });

      if (fetched.length > 0) {
        setMoments(fetched);
      } else {
        setMoments(defaultTimeline);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore loading error for timeline, using defaults: ", err);
      setMoments(defaultTimeline);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMoment = async (e) => {
    e.preventDefault();
    if (!momentTitle || !momentDate || !momentDesc) return;
    setSaving(true);

    try {
      const newMoment = {
        title: momentTitle,
        date: momentDate,
        description: momentDesc,
        details: momentDetails,
        element: momentElement,
        timestamp: new Date().toISOString(),
        createdBy: user.correo
      };

      await addDoc(collection(db, "linea_tiempo"), newMoment);

      setMomentTitle("");
      setMomentDate("");
      setMomentDesc("");
      setMomentDetails("");
      setShowAddForm(false);
    } catch (err) {
      alert("Error al agregar momento: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getElementColor = (el) => {
    switch (el) {
      case "agua": return "#1B6CA8";
      case "tierra": return "#4A7C59";
      case "fuego": return "#C0392B";
      case "aire": return "#E8B86D";
      default: return "var(--primary-color)";
    }
  };

  const getElementEmoji = (el) => {
    switch (el) {
      case "agua": return "🌊";
      case "tierra": return "🌱";
      case "fuego": return "🔥";
      case "aire": return "💨";
      default: return "❤️";
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando nuestra leyenda...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
            Nuestra Leyenda de Amor
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
            El registro cronológico de los hitos más hermosos que hemos compartido desde que iniciamos este viaje.
          </p>
        </div>

        {/* Add moment button visible only to admin (Caren) */}
        {user.rol === "admin" && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #a05a2c 0%, #7b3f15 100%)",
              border: "1px solid #63320c",
              color: "#f7edd5",
              borderRadius: "20px",
              fontFamily: "Cinzel",
              fontWeight: "bold",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
            }}
          >
            <Plus size={16} />
            <span>Agregar Hito</span>
          </button>
        )}
      </div>

      {/* Timeline Vertical Stack */}
      <div className="timeline-vertical">
        {moments.map((moment, idx) => {
          const elColor = getElementColor(moment.element);
          return (
            <div key={moment.id || idx} className="timeline-item">
              <div
                className="timeline-badge"
                style={{
                  borderColor: elColor,
                  color: elColor,
                  boxShadow: `0 0 10px ${elColor}30`,
                  backgroundColor: "var(--bg-color)"
                }}
              >
                {getElementEmoji(moment.element)}
              </div>

              <div
                className="timeline-card"
                style={{
                  borderColor: `${elColor}33`,
                  borderLeft: `4px solid ${elColor}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: elColor, textTransform: "uppercase", letterSpacing: "1px" }}>
                    {moment.date}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} />
                    <span>Hito de la Relación</span>
                  </span>
                </div>

                <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "12px", fontFamily: "Cinzel", textAlign: "left" }}>
                  {moment.title}
                </h3>
                
                <p style={{ fontSize: "0.95rem", color: "var(--text-color)", lineHeight: "1.5", textAlign: "left", marginBottom: "15px" }}>
                  {moment.description}
                </p>

                {moment.details && (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "12px 15px",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      textAlign: "left",
                      fontStyle: "italic",
                      borderLeft: `2px solid ${elColor}`
                    }}
                  >
                    {moment.details}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Moment Modal Form */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div
            className="pergamino"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px" }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowAddForm(false)}
              style={{ color: "#63431d" }}
            >
              <X size={20} />
            </button>

            <h2 className="pergamino-header" style={{ borderBottomColor: "rgba(99, 67, 29, 0.2)" }}>
              Agregar Hito del Amor
            </h2>

            <form onSubmit={handleAddMoment}>
              <div className="pergamino-input-group">
                <label className="pergamino-label">Título del Hito</label>
                <input
                  type="text"
                  className="pergamino-input"
                  placeholder="ej. Nuestra Primera Cita..."
                  value={momentTitle}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  required
                />
              </div>

              <div className="pergamino-input-group">
                <label className="pergamino-label">Fecha del Momento</label>
                <input
                  type="text"
                  className="pergamino-input"
                  placeholder="ej. 21 de Septiembre..."
                  value={momentDate}
                  onChange={(e) => setMomentDate(e.target.value)}
                  required
                />
              </div>

              <div className="pergamino-input-group">
                <label className="pergamino-label">Breve Descripción</label>
                <input
                  type="text"
                  className="pergamino-input"
                  placeholder="ej. El día que decidimos empezar este viaje..."
                  value={momentDesc}
                  onChange={(e) => setMomentDesc(e.target.value)}
                  required
                />
              </div>

              <div className="pergamino-input-group">
                <label className="pergamino-label">Detalles Románticos (Opcional)</label>
                <textarea
                  className="pergamino-input"
                  placeholder="ej. Siento que el viento nos guió..."
                  value={momentDetails}
                  onChange={(e) => setMomentDetails(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="pergamino-input-group">
                <label className="pergamino-label">Estación / Elemento Representativo</label>
                <select
                  value={momentElement}
                  onChange={(e) => setMomentElement(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid #d0b070",
                    borderRadius: "4px",
                    color: "#3b2c16",
                    fontFamily: "Outfit",
                    outline: "none"
                  }}
                >
                  <option value="agua">Agua 🌊 (Invierno)</option>
                  <option value="tierra">Tierra 🌱 (Primavera)</option>
                  <option value="fuego">Fuego 🔥 (Verano)</option>
                  <option value="aire">Aire 💨 (Otoño)</option>
                </select>
              </div>

              <button type="submit" className="pergamino-btn" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Momento en la Historia 📜"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
