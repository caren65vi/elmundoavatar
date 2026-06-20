import "./Anniversaries.css";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { defaultAnniversaries } from "../../mockData";
import { Heart, Star, Sparkles } from "lucide-react";

export default function Anniversaries() {
  const [anniversaries, setAnniversaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnniversaries = async () => {
      try {
        const q = query(collection(db, "fechas_especiales"), orderBy("monthNumber", "asc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        if (data.length > 0) {
          setAnniversaries(data);
        } else {
          setAnniversaries(defaultAnniversaries);
        }
      } catch (err) {
        console.error("Error fetching anniversaries from firestore, using defaults: ", err);
        setAnniversaries(defaultAnniversaries);
      } finally {
        setLoading(false);
      }
    };

    fetchAnniversaries();
  }, []);

  const getElementBadge = (element) => {
    switch (element) {
      case "agua": return { sym: "🌊", name: "Agua", color: "#1B6CA8" };
      case "tierra": return { sym: "🌱", name: "Tierra", color: "#4A7C59" };
      case "fuego": return { sym: "🔥", name: "Fuego", color: "#C0392B" };
      case "aire": return { sym: "💨", name: "Aire", color: "#E8B86D" };
      default: return { sym: "❤️", name: "Amor", color: "var(--primary-color)" };
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando nuestros meses de amor...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Nuestros Meses de Amor
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Cada mes a tu lado es una nueva temporada, un nuevo elemento y un paso más en nuestra propia leyenda.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "25px" }}>
        {anniversaries.map((ann) => {
          const el = getElementBadge(ann.element);
          return (
            <div
              key={ann.id}
              className="pergamino"
              style={{
                maxWidth: "none",
                padding: "25px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                boxShadow: "inset 0 0 30px rgba(139,87,42,0.15), 0 8px 20px rgba(0,0,0,0.3)"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span
                    style={{
                      fontFamily: "Cinzel",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      color: el.color,
                      border: `1px solid ${el.color}40`,
                      borderRadius: "15px",
                      padding: "4px 12px",
                      background: `${el.color}10`,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    {["Agua","Fuego","Tierra","Aire"].includes(el.name)
                      ? <div style={{ width: "1.6rem", height: "1.6rem", borderRadius: "50%", border: `1.5px solid ${el.color}`, background: `${el.color}18`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img src={`/escudo${el.name}.png`} alt={el.name} style={{ width: "72%", height: "72%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
                        </div>
                      : <span>{el.sym}</span>}
                    <span>{el.name}</span>
                  </span>

                  <span
                    style={{
                      fontFamily: "Cinzel",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#63431d"
                    }}
                  >
                    Mes {ann.monthNumber}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "Cinzel",
                    fontSize: "1.25rem",
                    color: "#3b2c16",
                    marginBottom: "6px",
                    textAlign: "left"
                  }}
                >
                  {ann.title}
                </h3>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#8b572a",
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "15px",
                    textAlign: "left"
                  }}
                >
                  📅 {ann.date}
                </span>

                <p
                  style={{
                    fontFamily: "Outfit",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    color: "#4e3d28",
                    textAlign: "left",
                    whiteSpace: "pre-line"
                  }}
                >
                  {ann.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  borderTop: "1px dashed rgba(99, 67, 29, 0.2)",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.8rem",
                  color: "#8b572a"
                }}
              >
                <span>¡Feliz mes, amor!</span>
                <Heart size={14} fill="#c0392b" color="#c0392b" style={{ animation: "heart-beat 1.2s infinite" }} />
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}} />
    </div>
  );
}
