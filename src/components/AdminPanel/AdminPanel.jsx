import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/config";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
  writeBatch,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { Shield, Users, Heart, Sparkles, Send, Calendar, Award, Database, Trash2, Edit3, X, Check, Bell } from "lucide-react";
import "./AdminPanel.css";
import { defaultCharacters, defaultTimeline, defaultAnniversaries, defaultSpecialDates, defaultPoems } from "../../mockData";
import { bookWaterEpisodes, bookEarthEpisodes, bookFireEpisodes } from "../../episodesData";
import { generateAllQuestions } from "../../quizQuestions";

export default function AdminPanel({ user }) {
  const [partnerActive, setPartnerActive] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  
  // Date counter configs
  const [anniversaryDate, setAnniversaryDate] = useState("2025-02-21");
  const [daysCount, setDaysCount] = useState(0);

  // Poem Form
  const [poemTitle, setPoemTitle] = useState("");
  const [poemContent, setPoemContent] = useState("");
  const [poemElement, setPoemElement] = useState("agua");
  const [sendingPoem, setSendingPoem] = useState(false);

  // Special Date Form
  const [dateTitle, setDateTitle] = useState("");
  const [dateVal, setDateVal] = useState("");
  const [dateDesc, setDateDesc] = useState("");
  const [dateElement, setDateElement] = useState("agua");
  const [datePhotoUrl, setDatePhotoUrl] = useState("");
  const [addingDate, setAddingDate] = useState(false);

  // Welcome Phrase Form
  const [welcomePhrase, setWelcomePhrase] = useState("");

  // Stats
  const [quizResults, setQuizResults] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Database seeder
  const [seeding, setSeeding] = useState(false);
  const [seedLog, setSeedLog] = useState([]);

  // CRUD — Fechas especiales
  const [specialDatesList, setSpecialDatesList] = useState([]);
  const [editingDate, setEditingDate] = useState(null); // { id, title, date, description, element, photoUrl }

  // CRUD — Poemas
  const [poemsList, setPoemsList] = useState([]);
  const [editingPoem, setEditingPoem] = useState(null); // { id, title, content, element }

  // Notificaciones historial
  const [notifHistory, setNotifHistory] = useState([]);

  // Inline toast instead of alert()
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Real-time partner presence & anniversary listener
  useEffect(() => {
    // Find Evelyn
    const evelynEmail = "evelyngomezvanegas@gmail.com";
    const q = query(collection(db, "usuarios"), where("correo", "==", evelynEmail));
    
    const unsubscribeUser = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const uDoc = snapshot.docs[0].data();
        setPartnerData(uDoc);

        // Check if active in the last 3 minutes
        const lastActiveTime = new Date(uDoc.ultimoAcceso || uDoc.lastActive).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - lastActiveTime) / 1000 / 60;
        setPartnerActive(diffMinutes < 3);
      }
    }, (err) => {
      console.warn("Firestore user presence listener blocked by permissions.", err);
    });

    // Fetch anniversary config
    const getAnniversary = async () => {
      try {
        const docSnap = await getDoc(doc(db, "configuracion", "aniversario"));
        if (docSnap.exists()) {
          const date = docSnap.data().date;
          setAnniversaryDate(date);
          calculateDays(date);
        } else {
          calculateDays(anniversaryDate);
        }
      } catch (e) {
        console.error(e);
        calculateDays(anniversaryDate);
      }
    };
    getAnniversary();

    // Fetch welcome phrase config
    const getWelcomePhrase = async () => {
      try {
        const docSnap = await getDoc(doc(db, "configuracion", "frase_intro"));
        if (docSnap.exists() && docSnap.data().phrase) {
          setWelcomePhrase(docSnap.data().phrase);
        } else {
          setWelcomePhrase("Espero que ames cada cosa que te doy, feliz mes amor");
        }
      } catch (e) {
        console.error(e);
        setWelcomePhrase("Espero que ames cada cosa que te doy, feliz mes amor");
      }
    };
    getWelcomePhrase();

    // Fetch Quiz results
    const fetchQuizStats = async () => {
      try {
        const snap = await getDocs(query(collection(db, "quiz_resultados"), orderBy("timestamp", "desc")));
        const res = [];
        snap.forEach((d) => res.push(d.data()));
        setQuizResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchQuizStats();

    // Real-time listener — Fechas especiales
    const unsubDates = onSnapshot(
      query(collection(db, "mensajes_especiales"), orderBy("timestamp", "desc")),
      (snap) => {
        setSpecialDatesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.warn("dates listener:", err)
    );

    // Real-time listener — Poemas
    const unsubPoems = onSnapshot(
      query(collection(db, "poemas"), orderBy("timestamp", "desc")),
      (snap) => {
        setPoemsList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.warn("poems listener:", err)
    );

    // Real-time listener — Notificaciones (historial últimas 10)
    const unsubNotif = onSnapshot(
      query(collection(db, "notificaciones"), orderBy("timestamp", "desc")),
      (snap) => {
        setNotifHistory(snap.docs.slice(0, 10).map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => console.warn("notif listener:", err)
    );

    return () => {
      unsubscribeUser();
      unsubDates();
      unsubPoems();
      unsubNotif();
    };
  }, []);

  const calculateDays = (dateStr) => {
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysCount(diffDays);
  };

  const handleUpdateAnniversary = async () => {
    try {
      await setDoc(doc(db, "configuracion", "aniversario"), {
        date: anniversaryDate,
        updatedBy: user.correo,
        timestamp: new Date().toISOString()
      });
      calculateDays(anniversaryDate);
      showToast("¡Fecha de aniversario actualizada! 💖");
    } catch (e) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleUpdateWelcomePhrase = async () => {
    try {
      await setDoc(doc(db, "configuracion", "frase_intro"), {
        phrase: welcomePhrase,
        updatedBy: user.correo,
        timestamp: new Date().toISOString()
      });
      showToast("¡Frase de bienvenida actualizada! 📝");
    } catch (e) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleSendPoem = async (e) => {
    e.preventDefault();
    if (!poemTitle || !poemContent) return;
    setSendingPoem(true);

    try {
      const poemData = {
        title: poemTitle,
        content: poemContent,
        element: poemElement,
        date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long" }),
        timestamp: new Date().toISOString(),
        sender: user.correo
      };

      // Add to Firestore
      await addDoc(collection(db, "poemas"), poemData);

      // Create notification triggers
      await addDoc(collection(db, "notificaciones"), {
        title: "¡Nuevo Poema de Amor! 📜",
        message: poemTitle,
        type: "poema",
        timestamp: new Date().toISOString()
      });

      setPoemTitle("");
      setPoemContent("");
      showToast(`¡Poema enviado! ${partnerData?.nombre || "Evelyn"} recibirá una notificación 💌`);
    } catch (err) {
      showToast("Error al publicar poema: " + err.message, "error");
    } finally {
      setSendingPoem(false);
    }
  };

  const handleAddSpecialDate = async (e) => {
    e.preventDefault();
    if (!dateTitle || !dateVal || !dateDesc) return;
    setAddingDate(true);

    try {
      await addDoc(collection(db, "mensajes_especiales"), {
        title: dateTitle,
        date: `${dateVal}T00:00:00`,
        description: dateDesc,
        element: dateElement,
        photoUrl: datePhotoUrl,
        timestamp: new Date().toISOString(),
        createdBy: user.correo
      });

      await addDoc(collection(db, "notificaciones"), {
        title: "Nueva fecha especial 💖",
        message: dateTitle,
        type: "fecha_especial",
        timestamp: new Date().toISOString()
      });

      setDateTitle("");
      setDateVal("");
      setDateDesc("");
      setDatePhotoUrl("");
      showToast("¡Fecha especial programada! 📅");
    } catch (err) {
      showToast("Error al agregar fecha: " + err.message, "error");
    } finally {
      setAddingDate(false);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    setSeedLog([]);
    const log = (msg) => setSeedLog((prev) => [...prev, msg]);

    try {
      const batch = writeBatch(db);

      // 1. Personajes
      const charsSnap = await getDocs(collection(db, "personajes"));
      if (charsSnap.empty) {
        defaultCharacters.forEach((char) => {
          batch.set(doc(collection(db, "personajes"), char.id), char);
        });
        log(`✅ ${defaultCharacters.length} personajes agregados`);
      } else {
        log(`⏭️ Personajes ya existen (${charsSnap.size})`);
      }

      // 2. Episodios
      const epsSnap = await getDocs(collection(db, "episodios"));
      if (epsSnap.empty) {
        const allEps = [
          ...bookWaterEpisodes.map(e => ({ ...e, book: 1, bookName: "agua" })),
          ...bookEarthEpisodes.map(e => ({ ...e, book: 2, bookName: "tierra" })),
          ...bookFireEpisodes.map(e => ({ ...e, book: 3, bookName: "fuego" })),
        ];
        allEps.forEach((ep) => {
          batch.set(doc(collection(db, "episodios")), ep);
        });
        log(`✅ ${allEps.length} episodios agregados`);
      } else {
        log(`⏭️ Episodios ya existen (${epsSnap.size})`);
      }

      // 3. Línea de tiempo
      const timeSnap = await getDocs(collection(db, "linea_tiempo"));
      if (timeSnap.empty) {
        defaultTimeline.forEach((moment, i) => {
          batch.set(doc(collection(db, "linea_tiempo")), { ...moment, timestamp: new Date(2024, i, 1).toISOString() });
        });
        log(`✅ ${defaultTimeline.length} momentos de la línea de tiempo agregados`);
      } else {
        log(`⏭️ Línea de tiempo ya existe (${timeSnap.size})`);
      }

      // 4. Aniversarios mensuales
      const annivSnap = await getDocs(collection(db, "fechas_especiales"));
      if (annivSnap.empty) {
        defaultAnniversaries.forEach((ann) => {
          batch.set(doc(collection(db, "fechas_especiales"), ann.id), ann);
        });
        log(`✅ ${defaultAnniversaries.length} aniversarios mensuales agregados`);
      } else {
        log(`⏭️ Fechas especiales ya existen (${annivSnap.size})`);
      }

      // 5. Fechas especiales (cumpleaños, etc.)
      const datesSnap = await getDocs(collection(db, "mensajes_especiales"));
      if (datesSnap.empty) {
        defaultSpecialDates.forEach((d) => {
          batch.set(doc(collection(db, "mensajes_especiales"), d.id), d);
        });
        log(`✅ ${defaultSpecialDates.length} fechas especiales agregadas`);
      } else {
        log(`⏭️ Mensajes especiales ya existen (${datesSnap.size})`);
      }

      // 6. Poemas iniciales
      const poemsSnap = await getDocs(collection(db, "poemas"));
      if (poemsSnap.empty) {
        defaultPoems.forEach((poem) => {
          batch.set(doc(collection(db, "poemas"), poem.id), { ...poem, timestamp: new Date().toISOString(), sender: user.correo });
        });
        log(`✅ ${defaultPoems.length} poemas iniciales agregados`);
      } else {
        log(`⏭️ Poemas ya existen (${poemsSnap.size})`);
      }

      // 7. Config inicial
      const quizQuestionsSnap = await getDocs(collection(db, "quiz_preguntas"));
      if (quizQuestionsSnap.empty) {
        const questions = generateAllQuestions();
        questions.forEach(({ id, ...question }) => {
          batch.set(doc(db, "quiz_preguntas", `aang_${String(id).padStart(3, "0")}`), {
            ...question,
            sourceId: id,
            series: "La leyenda de Aang"
          });
        });
        log(`✅ ${questions.length} preguntas del quiz agregadas`);
      } else {
        log(`⏭️ Preguntas del quiz ya existen (${quizQuestionsSnap.size})`);
      }

      // Actualiza también las preguntas ya existentes: las tarjetas del quiz necesitan su categoría.
      if (!quizQuestionsSnap.empty) {
        const categorizedQuestions = generateAllQuestions();
        categorizedQuestions.forEach(({ id, ...question }) => {
          batch.set(doc(db, "quiz_preguntas", `aang_${String(id).padStart(3, "0")}`), {
            ...question,
            sourceId: id,
            series: "La leyenda de Aang"
          });
        });
        log(`✅ ${categorizedQuestions.length} preguntas del quiz actualizadas con categorías`);
      }

      const configSnap = await getDoc(doc(db, "configuracion", "aniversario"));
      if (!configSnap.exists()) {
        batch.set(doc(db, "configuracion", "aniversario"), { date: "2025-02-21", updatedBy: user.correo, timestamp: new Date().toISOString() });
        batch.set(doc(db, "configuracion", "frase_intro"), { phrase: "Espero que ames cada cosa que te doy, feliz mes amor", updatedBy: user.correo, timestamp: new Date().toISOString() });
        log("✅ Configuración inicial creada");
      } else {
        log("⏭️ Configuración ya existe");
      }

      await batch.commit();
      log("🎉 ¡Base de datos lista! Recarga la página para ver los cambios.");
    } catch (err) {
      log("❌ Error: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Instantly trigger a surprise animation on partner's screen
  const triggerSurprise = async (type) => {
    try {
      await setDoc(doc(db, "configuracion", "sorpresa"), {
        type: type,
        timestamp: new Date().toISOString(),
        sender: user.correo
      });
      showToast(`¡Sorpresa de ${type} enviada! 🌟`);
    } catch (err) {
      showToast("Error al enviar sorpresa: " + err.message, "error");
    }
  };

  // --- CRUD Fechas Especiales ---
  const handleDeleteDate = async (id) => {
    if (!window.confirm("¿Eliminar esta fecha especial?")) return;
    try {
      await deleteDoc(doc(db, "mensajes_especiales", id));
      showToast("Fecha eliminada 🗑️");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  const handleSaveEditDate = async () => {
    if (!editingDate) return;
    try {
      const { id, ...data } = editingDate;
      await updateDoc(doc(db, "mensajes_especiales", id), {
        title: data.title,
        date: data.date,
        description: data.description,
        element: data.element,
        photoUrl: data.photoUrl || ""
      });
      setEditingDate(null);
      showToast("Fecha actualizada ✅");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // --- CRUD Poemas ---
  const handleDeletePoem = async (id) => {
    if (!window.confirm("¿Eliminar este poema?")) return;
    try {
      await deleteDoc(doc(db, "poemas", id));
      showToast("Poema eliminado 🗑️");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  const handleSaveEditPoem = async () => {
    if (!editingPoem) return;
    try {
      const { id, ...data } = editingPoem;
      await updateDoc(doc(db, "poemas", id), {
        title: data.title,
        content: data.content,
        element: data.element
      });
      setEditingPoem(null);
      showToast("Poema actualizado ✅");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // Enviar notificación personalizada
  const handleSendCustomNotif = async (title, message) => {
    try {
      await addDoc(collection(db, "notificaciones"), {
        title,
        message,
        type: "manual",
        timestamp: new Date().toISOString()
      });
      showToast("Notificación enviada 🔔");
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Inline toast notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          background: toast.type === "error" ? "rgba(192,57,43,0.95)" : "rgba(44,90,62,0.95)",
          border: `1px solid ${toast.type === "error" ? "#c0392b" : "#4a7c59"}`,
          color: toast.type === "error" ? "#f5b7b1" : "#a4cfa7",
          borderRadius: "12px",
          padding: "12px 24px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
          animation: "fadeSlideUp 0.3s ease"
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Panel de Vivi / Caren
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Herramientas exclusivas para enviar sorpresas, poemas, gestionar fechas importantes y supervisar estadísticas de {partnerData?.nombre || "Evelyn"}.
        </p>
      </div>

      {/* Top Presence & Days Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        {/* Presence */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ position: "relative" }}>
            <div className="user-avatar" style={{ fontSize: "1rem" }}>
              {partnerData?.apodo?.substring(0, 2).toUpperCase() || "EV"}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: partnerActive ? "#2ecc71" : "#7f8c8d",
                border: "2px solid #000",
                animation: partnerActive ? "pulse-presence 1.2s infinite" : "none"
              }}
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#fff" }}>
              {partnerData?.apodo || "Evelyn"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {partnerActive ? "Conectada Ahora" : "Desconectada"}
            </div>
          </div>
        </div>

        {/* Anniversary Configuration */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>
              Fecha de Aniversario
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--primary-color)", fontWeight: "bold" }}>
              {daysCount} Días
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--border-color)",
                color: "#fff",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "0.85rem",
                flex: 1
              }}
            />
            <button
              onClick={handleUpdateAnniversary}
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Guardar
            </button>
          </div>
        </div>

        {/* Welcome Phrase Configuration */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>
              Frase de Bienvenida Typewriter
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={welcomePhrase}
              onChange={(e) => setWelcomePhrase(e.target.value)}
              placeholder="Frase al cargar..."
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--border-color)",
                color: "#fff",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "0.85rem",
                flex: 1
              }}
            />
            <button
              onClick={handleUpdateWelcomePhrase}
              style={{
                background: "var(--primary-color)",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Immediate surprises & Poem creator */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        {/* Surprise controller */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--primary-color)" />
            <span>Sorpresa del Día</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.4" }}>
            Haz clic en un botón para desatar una animación mágica a pantalla completa en el dispositivo de {partnerData?.nombre || "Evelyn"} de forma instantánea.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={() => triggerSurprise("corazones")} style={{ padding: "12px", background: "rgba(255, 51, 102, 0.1)", border: "1px solid #ff3366", color: "#ff3366", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              💖 Lluvia Corazones
            </button>
            <button onClick={() => triggerSurprise("loto")} style={{ padding: "12px", background: "rgba(192, 160, 96, 0.1)", border: "1px solid var(--primary-color)", color: "var(--primary-color)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              🌸 Lluvia Lotos
            </button>
            <button onClick={() => triggerSurprise("appa")} style={{ padding: "12px", background: "rgba(168, 216, 234, 0.1)", border: "1px solid #1B6CA8", color: "#a8d8ea", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              🐮 Appa Volador
            </button>
            <button onClick={() => triggerSurprise("fuegos")} style={{ padding: "12px", background: "rgba(192, 57, 43, 0.1)", border: "1px solid #c0392b", color: "#e67e22", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              💥 Fuegos Artificiales
            </button>
          </div>
        </div>

        {/* Poem editor & Live preview */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Send size={18} color="var(--primary-color)" />
            <span>Redactar Poema Mágico</span>
          </h2>

          <form onSubmit={handleSendPoem}>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Título del poema..."
                value={poemTitle}
                onChange={(e) => setPoemTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <textarea
                placeholder="Contenido del poema..."
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontFamily: "var(--font-serif)" }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={poemElement}
                onChange={(e) => setPoemElement(e.target.value)}
                style={{ padding: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
              >
                <option value="agua">Agua 🌊</option>
                <option value="tierra">Tierra 🌱</option>
                <option value="fuego">Fuego 🔥</option>
                <option value="aire">Aire 💨</option>
              </select>

              <button
                type="submit"
                className="pergamino-btn"
                style={{ padding: "8px 16px", fontSize: "0.85rem", width: "auto", flex: 1 }}
                disabled={sendingPoem}
              >
                {sendingPoem ? "Publicando..." : "Enviar a Mi Amor 💌"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Date scheduler & Stats dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
        {/* Scheduler */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color="var(--primary-color)" />
            <span>Programar Cuenta Regresiva</span>
          </h2>

          <form onSubmit={handleAddSpecialDate}>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Título del evento (ej. Cumpleaños de Evelyn)..."
                value={dateTitle}
                onChange={(e) => setDateTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <textarea
                placeholder="Mensaje romántico sorpresa al llegar a cero..."
                value={dateDesc}
                onChange={(e) => setDateDesc(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="URL de Imagen/Foto (Opcional)..."
                value={datePhotoUrl}
                onChange={(e) => setDatePhotoUrl(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={dateElement}
                onChange={(e) => setDateElement(e.target.value)}
                style={{ padding: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
              >
                <option value="agua">Agua 🌊</option>
                <option value="tierra">Tierra 🌱</option>
                <option value="fuego">Fuego 🔥</option>
                <option value="aire">Aire 💨</option>
              </select>

              <button
                type="submit"
                className="pergamino-btn"
                style={{ padding: "8px 16px", fontSize: "0.85rem", width: "auto", flex: 1 }}
                disabled={addingDate}
              >
                {addingDate ? "Programando..." : "Programar Fecha 📅"}
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} color="var(--primary-color)" />
            <span>Últimos Resultados de {partnerData?.nombre || "Evelyn"}</span>
          </h2>

          {statsLoading ? (
            <div style={{ color: "var(--text-muted)" }}>Cargando estadísticas...</div>
          ) : quizResults.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto" }}>
              {quizResults.map((res, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "10px 15px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ color: "#fff", fontSize: "0.85rem" }}>{res.characterObtained}</strong>
                    <span style={{ color: "var(--primary-color)", fontSize: "0.8rem", fontWeight: "bold" }}>
                      Puntaje: {res.score}/{res.totalQuestions}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    📅 {new Date(res.timestamp).toLocaleString("es-ES")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {partnerData?.nombre || "Evelyn"} no ha realizado el quiz aún.
            </div>
          )}
        </div>
      </div>

      {/* ── GESTIÓN FECHAS ESPECIALES ── */}
      <div style={{ marginTop: "40px", background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={18} color="var(--primary-color)" />
          <span>Gestión de Fechas Especiales</span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>{specialDatesList.length} fechas</span>
        </h2>

        {specialDatesList.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No hay fechas programadas aún.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
            {specialDatesList.map((item) => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "12px 15px" }}>
                {editingDate?.id === item.id ? (
                  // ── Inline edit form ──
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input value={editingDate.title} onChange={(e) => setEditingDate({ ...editingDate, title: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }} />
                    <input type="date" value={editingDate.date?.substring(0, 10)} onChange={(e) => setEditingDate({ ...editingDate, date: e.target.value + "T00:00:00" })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }} />
                    <textarea value={editingDate.description} rows={2} onChange={(e) => setEditingDate({ ...editingDate, description: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem", resize: "vertical" }} />
                    <input value={editingDate.photoUrl || ""} placeholder="URL foto (opcional)" onChange={(e) => setEditingDate({ ...editingDate, photoUrl: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }} />
                    <select value={editingDate.element} onChange={(e) => setEditingDate({ ...editingDate, element: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <option value="agua">Agua 🌊</option><option value="tierra">Tierra 🌱</option><option value="fuego">Fuego 🔥</option><option value="aire">Aire 💨</option>
                    </select>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={handleSaveEditDate} style={{ flex: 1, padding: "7px", background: "rgba(46,204,113,0.15)", border: "1px solid #2ecc71", color: "#2ecc71", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                        <Check size={13} /> Guardar
                      </button>
                      <button onClick={() => setEditingDate(null)} style={{ flex: 1, padding: "7px", background: "rgba(127,140,141,0.1)", border: "1px solid #7f8c8d", color: "#7f8c8d", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "0.8rem" }}>
                        <X size={13} /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // ── Display row ──
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", color: "#fff", fontSize: "0.88rem", marginBottom: "3px" }}>{item.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        📅 {item.date?.substring(0, 10)} · {item.element}
                      </div>
                      {item.description && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "3px", lineClamp: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>{item.description}</div>}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => setEditingDate(item)} style={{ padding: "6px 10px", background: "rgba(192,160,96,0.1)", border: "1px solid var(--primary-color)", color: "var(--primary-color)", borderRadius: "6px", cursor: "pointer" }} title="Editar">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDeleteDate(item.id)} style={{ padding: "6px 10px", background: "rgba(192,57,43,0.1)", border: "1px solid #c0392b", color: "#e74c3c", borderRadius: "6px", cursor: "pointer" }} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── GESTIÓN POEMAS ── */}
      <div style={{ marginTop: "25px", background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Send size={18} color="var(--primary-color)" />
          <span>Gestión de Poemas</span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "normal" }}>{poemsList.length} poemas</span>
        </h2>

        {poemsList.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No hay poemas publicados aún.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
            {poemsList.map((item) => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "12px 15px" }}>
                {editingPoem?.id === item.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input value={editingPoem.title} onChange={(e) => setEditingPoem({ ...editingPoem, title: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }} />
                    <textarea value={editingPoem.content} rows={4} onChange={(e) => setEditingPoem({ ...editingPoem, content: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem", fontFamily: "var(--font-serif)", resize: "vertical" }} />
                    <select value={editingPoem.element} onChange={(e) => setEditingPoem({ ...editingPoem, element: e.target.value })}
                      style={{ padding: "7px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <option value="agua">Agua 🌊</option><option value="tierra">Tierra 🌱</option><option value="fuego">Fuego 🔥</option><option value="aire">Aire 💨</option>
                    </select>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={handleSaveEditPoem} style={{ flex: 1, padding: "7px", background: "rgba(46,204,113,0.15)", border: "1px solid #2ecc71", color: "#2ecc71", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                        <Check size={13} /> Guardar
                      </button>
                      <button onClick={() => setEditingPoem(null)} style={{ flex: 1, padding: "7px", background: "rgba(127,140,141,0.1)", border: "1px solid #7f8c8d", color: "#7f8c8d", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "0.8rem" }}>
                        <X size={13} /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", color: "#fff", fontSize: "0.88rem", marginBottom: "3px" }}>{item.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "3px" }}>{item.element} · {item.date || item.timestamp?.substring(0, 10)}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>{item.content?.substring(0, 60)}…</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => setEditingPoem(item)} style={{ padding: "6px 10px", background: "rgba(192,160,96,0.1)", border: "1px solid var(--primary-color)", color: "var(--primary-color)", borderRadius: "6px", cursor: "pointer" }} title="Editar">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDeletePoem(item.id)} style={{ padding: "6px 10px", background: "rgba(192,57,43,0.1)", border: "1px solid #c0392b", color: "#e74c3c", borderRadius: "6px", cursor: "pointer" }} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── HISTORIAL DE NOTIFICACIONES + ENVÍO MANUAL ── */}
      <div style={{ marginTop: "25px", background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={18} color="var(--primary-color)" />
          <span>Notificaciones</span>
        </h2>

        {/* Envío manual */}
        <NotifManualForm onSend={handleSendCustomNotif} />

        {/* Historial */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>Últimas enviadas</div>
          {notifHistory.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Sin notificaciones aún.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {notifHistory.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "10px 14px" }}>
                  <div>
                    <div style={{ fontSize: "0.83rem", color: "#fff", fontWeight: "bold" }}>{n.title}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{n.message}</div>
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: "10px" }}>
                    {new Date(n.timestamp).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Database Seeder — One-time setup tool */}
      <div style={{ marginTop: "40px", background: "var(--bg-panel)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "25px", textAlign: "left" }}>
        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={18} color="var(--primary-color)" />
          <span>Inicializar Base de Datos</span>
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.4" }}>
          Sube todos los datos del mundo Avatar a Firestore en un solo clic. Si ya existen, los omite automáticamente. Úsalo solo la primera vez.
        </p>
        <button
          onClick={seedDatabase}
          disabled={seeding}
          style={{
            padding: "12px 24px",
            background: seeding ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4a7c59 0%, #2c5a3e 100%)",
            border: "1px solid #4a7c59",
            color: "#a4cfa7",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: seeding ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {seeding ? "⏳ Subiendo datos..." : "🌱 Seed Database — Subir Todo a Firestore"}
        </button>

        {seedLog.length > 0 && (
          <div style={{ marginTop: "15px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "12px", fontFamily: "monospace", fontSize: "0.8rem" }}>
            {seedLog.map((line, i) => (
              <div key={i} style={{ color: line.startsWith("❌") ? "#e67e22" : line.startsWith("⏭️") ? "var(--text-muted)" : "#a4cfa7", marginBottom: "4px" }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-presence {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}} />
    </div>
  );
}

function NotifManualForm({ onSend }) {
  const [title, setTitle] = useState("Un mensaje especial 💕");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    await onSend(title, message);
    setMessage("");
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la notificación..."
        style={{ padding: "9px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "7px", fontSize: "0.85rem" }} />
      <div style={{ display: "flex", gap: "8px" }}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje que recibirá Evelyn..." required
          style={{ flex: 1, padding: "9px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)", color: "#fff", borderRadius: "7px", fontSize: "0.85rem" }} />
        <button type="submit" disabled={sending}
          style={{ padding: "9px 16px", background: "rgba(255,51,102,0.15)", border: "1px solid var(--primary-color)", color: "var(--primary-color)", borderRadius: "7px", fontWeight: "bold", cursor: sending ? "not-allowed" : "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          {sending ? "..." : "🔔 Enviar"}
        </button>
      </div>
    </form>
  );
}
