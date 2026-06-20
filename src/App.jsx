import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { Heart } from "lucide-react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Sections
import LoadingScreen from "./sections/LoadingScreen/LoadingScreen";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import SeriesInfo from "./sections/SeriesInfo/SeriesInfo";
import Characters from "./sections/Characters/Characters";
import Seasons from "./sections/Seasons/Seasons";
import Quiz from "./sections/Quiz/Quiz";
import AppaMaze from "./sections/AppaMaze/AppaMaze";
import MemoryGame from "./sections/MemoryGame/MemoryGame";
import Anniversaries from "./sections/Anniversaries/Anniversaries";
import SpecialDates from "./sections/SpecialDates/SpecialDates";
import Poems from "./sections/Poems/Poems";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Timeline from "./sections/Timeline/Timeline";
import Nations from "./sections/Nations/Nations";
import EasterEggs from "./sections/EasterEggs/EasterEggs";
import Credits from "./sections/Credits/Credits";

// Components
import Navigation from "./components/Navigation/Navigation";
import LockScreenSim from "./components/LockScreenSim/LockScreenSim";
import Tutorial from "./components/Tutorial/Tutorial";

// Protected Route Guard for logged in users
const RutaProtegida = ({ children }) => {
  const { usuario, loading } = useAuth();
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="elements-loader">
          <div className="loader-symbol" style={{ color: "#caa360", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>🌀</div>
        </div>
        <h2 style={{ color: "#fff", fontFamily: "Cinzel" }}>Abriendo Portales...</h2>
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
};

// Route Guard for admin only
const RutaAdmin = ({ children }) => {
  const { usuario, rol, loading } = useAuth();
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="elements-loader">
          <div className="loader-symbol" style={{ color: "#caa360", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>🌀</div>
        </div>
        <h2 style={{ color: "#fff", fontFamily: "Cinzel" }}>Abriendo Portales...</h2>
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace />;
  if (rol !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  useEffect(() => {
    const updateRomanticNightMode = () => {
      const hour = new Date().getHours();
      document.body.classList.toggle("romantic-night", hour >= 22 || hour < 6);
    };

    updateRomanticNightMode();
    const intervalId = window.setInterval(updateRomanticNightMode, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <RutaProtegida>
          <MainAppLayout defaultTab="dashboard" />
        </RutaProtegida>
      } />
      <Route path="/admin" element={
        <RutaAdmin>
          <MainAppLayout defaultTab="boyfriend-panel" />
        </RutaAdmin>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Inner Application Layout containing all navigation, tabs, music, Appa Mascot, and Real-time surprises
function MainAppLayout({ defaultTab }) {
  const { usuario, setUsuario } = useAuth();
  const user = usuario; // mapping to prevent refactoring user variable
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeNation, setActiveNation] = useState(user?.nacion || "agua");
  const [subNationTab, setSubNationTab] = useState("agua");

  useEffect(() => {
    if (!user?.uid || user.rol === "admin") return undefined;

    const visitStartedAt = Date.now();
    return () => {
      const timeInSeconds = Math.max(1, Math.round((Date.now() - visitStartedAt) / 1000));
      addDoc(collection(db, "historial_navegacion"), {
        usuarioUid: user.uid,
        seccion: activeTab,
        fechaVisita: serverTimestamp(),
        tiempoEnSegundos: timeInSeconds
      }).catch((error) => console.warn("No se pudo registrar la visita:", error));
    };
  }, [activeTab, user?.rol, user?.uid]);
  
  const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Custom notifications / Lockscreen overlay
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [lockScreenMsg, setLockScreenMsg] = useState("");

  // Easter Egg found symbols
  const [foundSymbols, setFoundSymbols] = useState({
    agua: false,
    tierra: false,
    fuego: false,
    aire: false
  });

  // Anniversary days counter
  const [anniversaryDate, setAnniversaryDate] = useState("2025-02-21");
  const [daysTogether, setDaysTogether] = useState(null);

  // Appa guide assistant states
  const [appaBubble, setAppaBubble] = useState("");
  const [appaTimer, setAppaTimer] = useState(null);
  const appaImgRef = React.useRef(null);
  React.useEffect(() => {
    const img = new Image();
    img.src = "/appa.png";
    appaImgRef.current = img;
  }, []);

  // Real-time surprise overlay states
  const [activeSurprise, setActiveSurprise] = useState(null);
  const surpriseCanvasRef = useRef(null);

  // Check if tutorial needs to be shown on load
  useEffect(() => {
    if (user && !user.tutorialCompletado) {
      setShowTutorial(true);
    }
  }, [user]);

  // Update user presence timestamp while active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        await setDoc(
          doc(db, "usuarios", user.uid),
          { ultimoAcceso: new Date().toISOString() },
          { merge: true }
        );
      } catch (e) {
        console.error("Error updating user presence: ", e);
      }
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [user]);

  // Listeners for real-time surprises, anniversary configs, and notifications
  useEffect(() => {
    if (!user) return;

    // Anniversary config listener
    const unsubAnniv = onSnapshot(doc(db, "configuracion", "aniversario"), (docSnap) => {
      if (docSnap.exists()) {
        const date = docSnap.data().date;
        setAnniversaryDate(date);
        calculateDays(date);
      } else {
        calculateDays(anniversaryDate);
      }
    }, (err) => {
      console.warn("Firestore anniversary listener blocked by permissions. Using default date.", err);
      calculateDays(anniversaryDate);
    });

    // Real-time surprises trigger listener
    const unsubSurprise = onSnapshot(doc(db, "configuracion", "sorpresa"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const surpriseTime = new Date(data.timestamp).getTime();
        const now = new Date().getTime();
        const diffSeconds = (now - surpriseTime) / 1000;

        // Trigger only if updated in the last 10 seconds and not triggered by self
        if (diffSeconds < 10 && data.sender !== user.correo) {
          triggerSurpriseOverlay(data.type);
        }
      }
    }, (err) => {
      console.warn("Firestore surprise listener blocked by permissions.", err);
    });

    // Notifications (triggers the lockscreen simulator)
    const unsubNotif = onSnapshot(collection(db, "notificaciones"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const notifTime = new Date(data.timestamp).getTime();
          const now = new Date().getTime();
          const diffSeconds = (now - notifTime) / 1000;

          // Trigger phone lockscreen overlay if message is recent
          if (diffSeconds < 10) {
            setLockScreenMsg(data.title + ": " + data.message);
            setShowLockScreen(true);
            if (Notification.permission === "granted") {
              new Notification(data.title || "Un mensaje de Appa", {
                body: data.message || "Tienes algo especial esperándote.",
                icon: "/appa.png"
              });
            }
          }
        }
      });
    }, (err) => {
      console.warn("Firestore notification listener blocked by permissions.", err);
    });

    return () => {
      unsubAnniv();
      unsubSurprise();
      unsubNotif();
    };
  }, [user]);

  const calculateDays = (dateStr) => {
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysTogether(diffDays);
  };

  // Real-time Surprise Animation Canvas drawing
  const triggerSurpriseOverlay = (type) => {
    setActiveSurprise(type);
    setTimeout(() => {
      setActiveSurprise(null);
    }, 8000); // stop drawing surprise after 8 seconds
  };

  useEffect(() => {
    if (!activeSurprise) return;

    const canvas = surpriseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let items = [];
    const elementsColors = ["#1B6CA8", "#A8D8EA", "#4A7C59", "#D4A843", "#C0392B", "#E67E22", "#E8B86D"];

    // Spawn surprise items
    if (activeSurprise === "corazones") {
      for (let i = 0; i < 40; i++) {
        items.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 50,
          vy: -2 - Math.random() * 5,
          vx: (Math.random() - 0.5) * 2,
          size: 15 + Math.random() * 20,
          emoji: "💖",
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2
        });
      }
    } else if (activeSurprise === "loto") {
      for (let i = 0; i < 45; i++) {
        items.push({
          x: Math.random() * canvas.width,
          y: -50,
          vy: 1.5 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 4,
          size: 14 + Math.random() * 18,
          emoji: "🌸",
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 3
        });
      }
    } else if (activeSurprise === "appa") {
      items.push({
        x: -250,
        y: canvas.height / 3,
        vx: 3.5,
        vy: 0,
        size: 180,
        isAppaImg: true,
        rotation: 0,
        rotationSpeed: 0
      });
    } else if (activeSurprise === "fuegos") {
      for (let i = 0; i < 150; i++) {
        items.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.5) * 16 - 3,
          size: 6 + Math.random() * 8,
          color: elementsColors[Math.floor(Math.random() * elementsColors.length)],
          alpha: 1,
          decay: 0.01 + Math.random() * 0.02
        });
      }
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeSurprise === "fuegos") {
        items.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.alpha -= p.decay;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();

          if (p.alpha <= 0) items.splice(idx, 1);
        });
      } else {
        items.forEach((item) => {
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.rotationSpeed;

          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate((item.rotation * Math.PI) / 180);

          if (item.isAppaImg && appaImgRef.current?.complete) {
            const half = item.size / 2;
            ctx.drawImage(appaImgRef.current, -half, -half, item.size, item.size);
            // "💨" trail
            ctx.font = "40px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("💨", -half - 55, 0);
          } else if (!item.isAppaImg) {
            ctx.font = `${item.size}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(item.emoji, 0, 0);
          }

          ctx.restore();
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [activeSurprise]);

  // Appa Mascot bubble
  const handleAppaClick = () => {
    if (appaTimer) clearTimeout(appaTimer);

    const quotes = [
      `¡Moo! ¡Feliz mes, ${user?.apodo || "amor"}! Eres mi agua control en las tormentas. 🌊`,
      "¡Yip Yip! ¿Damos un paseo volador por el Reino de la Tierra? 🐃💨",
      "Mooo... (Appa parece hambriento de poemas románticos) 📜",
      "¡Moo! Si necesitas ayuda con el quiz de sabiduría, pregúntame de nuevo. 🧭",
      `¿Sabías que Vivi pasó horas diseñando esta página pensando en ti? ❤️`,
      `¡Yip Yip! ${user?.rol === "admin" ? "Eve" : "Vivi"} es la maestra más asombrosa. 🌱`
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setAppaBubble(randomQuote);

    const timer = setTimeout(() => {
      setAppaBubble("");
    }, 5000);
    setAppaTimer(timer);
  };

  const handleFindSymbol = (element) => {
    setFoundSymbols((prev) => ({
      ...prev,
      [element]: true
    }));
  };

  const handleChangeNation = async (nationId) => {
    setActiveNation(nationId);
    if (user) {
      try {
        await setDoc(doc(db, "usuarios", user.uid), { nacion: nationId }, { merge: true });
        setUsuario((prev) => ({ ...prev, nacion: nationId }));
      } catch (e) {
        console.error("Error updating user nation:", e);
      }
    }
  };

  const handleTutorialClose = async () => {
    setShowTutorial(false);
    if (user) {
      try {
        await setDoc(doc(db, "usuarios", user.uid), { tutorialCompletado: true }, { merge: true });
        setUsuario((prev) => ({ ...prev, tutorialCompletado: true }));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelectTab = (tabId, subTab) => {
    if (tabId === "boyfriend-panel") {
      navigate("/admin");
    } else {
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
      setActiveTab(tabId);
      if (subTab) {
        setSubNationTab(subTab);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} onSelectTab={handleSelectTab} daysTogether={daysTogether} />;
      case "info":
        return (
          <>
            <SeriesInfo />
            {!foundSymbols.tierra && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <span
                  onClick={() => {
                    handleFindSymbol("tierra");
                    alert("¡Felicidades! Encontraste el Símbolo del Tierra Control 🌱");
                  }}
                  style={{ fontSize: "1.2rem", cursor: "pointer", opacity: 0.15, userSelect: "none" }}
                  onMouseEnter={(e) => e.target.style.opacity = "0.6"}
                  onMouseLeave={(e) => e.target.style.opacity = "0.15"}
                  title="¿Qué es esta semilla?"
                >
                  🌱
                </span>
              </div>
            )}
          </>
        );
      case "characters":
        return (
          <>
            <Characters />
            {!foundSymbols.fuego && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <span
                  onClick={() => {
                    handleFindSymbol("fuego");
                    alert("¡Felicidades! Encontraste el Símbolo del Fuego Control 🔥");
                  }}
                  style={{ fontSize: "1.2rem", cursor: "pointer", opacity: 0.15, userSelect: "none" }}
                  onMouseEnter={(e) => e.target.style.opacity = "0.6"}
                  onMouseLeave={(e) => e.target.style.opacity = "0.15"}
                  title="¿Una pequeña brasa?"
                >
                  🔥
                </span>
              </div>
            )}
          </>
        );
      case "season1":
        return <Seasons bookNumber={1} onFindSymbol={handleFindSymbol} foundSymbols={foundSymbols} />;
      case "season2":
        return <Seasons bookNumber={2} onFindSymbol={handleFindSymbol} foundSymbols={foundSymbols} />;
      case "season3":
        return <Seasons bookNumber={3} onFindSymbol={handleFindSymbol} foundSymbols={foundSymbols} />;
      case "nations":
        return <Nations defaultSubNation={subNationTab} />;
      case "quiz":
        return <Quiz user={user} />;
      case "appa-maze":
        return <AppaMaze user={user} />;
      case "memory-game":
        return <MemoryGame user={user} />;
      case "timeline":
        return <Timeline user={user} />;
      case "anniversaries":
        return <Anniversaries />;
      case "special-dates":
        return <SpecialDates />;
      case "poems":
        return <Poems />;
      case "easter-eggs":
        return <EasterEggs foundSymbols={foundSymbols} />;
      case "boyfriend-panel":
        return user?.rol === "admin" ? <AdminPanel user={user} /> : <Dashboard user={user} onSelectTab={handleSelectTab} />;
      case "credits":
        return <Credits onFindSymbol={handleFindSymbol} foundSymbols={foundSymbols} />;
      default:
        return <Dashboard user={user} onSelectTab={handleSelectTab} daysTogether={daysTogether} />;
    }
  };

  if (showSplash) {
    return <LoadingScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <div className={`app-wrapper theme-${activeNation}`}>
      <div className="stars-container">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              "--d": `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navigation
        activeTab={activeTab === "boyfriend-panel" && window.location.pathname !== "/admin" ? "dashboard" : activeTab}
        setActiveTab={handleSelectTab}
        user={user}
        onChangeNation={handleChangeNation}
        activeNation={activeNation}
        onLogout={() => navigate("/login")}
      />

      <div className="content-area">
        {renderTabContent()}
      </div>

      <div className="appa-mascot" onClick={handleAppaClick}>
        <img src="/appa.png" alt="Appa" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }} />
      </div>
      {appaBubble && <div className="appa-bubble">{appaBubble}</div>}

      {showLockScreen && (
        <div className="modal-overlay" style={{ zIndex: 99998 }} onClick={() => setShowLockScreen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            <LockScreenSim
              onOpenPoem={() => {
                setActiveTab("poems");
                setShowLockScreen(false);
              }}
              customMessage={lockScreenMsg}
            />
          </div>
        </div>
      )}

      {showTutorial && <Tutorial onClose={handleTutorialClose} />}

      {activeSurprise && (
        <canvas
          ref={surpriseCanvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 99999
          }}
        />
      )}
    </div>
  );
}
