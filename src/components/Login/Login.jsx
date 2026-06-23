import { useState, useEffect } from "react";
import { auth, db } from "../../Firebase/config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import AppaBackground from "../AppaBackground/AppaBackground";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const INTRO_PHRASE = "Espero que ames cada cosa que te doy, feliz mes amor 💕";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wagTail, setWagTail] = useState(false);

  // Typewriter intro — only once per session
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("introShown"));
  const [displayedText, setDisplayedText] = useState("");
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (!showIntro) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(INTRO_PHRASE.slice(0, i + 1));
      i++;
      if (i >= INTRO_PHRASE.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIntroFading(true);
          setTimeout(() => {
            sessionStorage.setItem("introShown", "true");
            setShowIntro(false);
          }, 900);
        }, 1800);
      }
    }, 65);
    return () => clearInterval(interval);
  }, [showIntro]);
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const cleanEmail = (rawEmail) => {
    let emailStr = rawEmail.trim().toLowerCase();
    if (emailStr.includes("@gamil.com")) {
      emailStr = emailStr.replace("@gamil.com", "@gmail.com");
    }
    return emailStr;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const targetEmail = cleanEmail(email);
    const isCaren = targetEmail === "carenvivianagomezramon@gmail.com";
    const isEvelyn = targetEmail === "evelyngomezvanegas@gmail.com";

    if (!isCaren && !isEvelyn) {
      setError("Solo Caren Viviana y Evelyn Natalia tienen acceso a este portal sagrado 🍃");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      try {
        // Try logging in with the live Firebase Authentication
        userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
      } catch (err) {
        // If user does not exist in Firebase Auth yet, automatically sign them up!
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-email") {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, targetEmail, password);
          } catch (createErr) {
            if (createErr.code === "auth/email-already-in-use") {
              throw err; // Password was wrong for existing user
            }
            throw createErr;
          }
        } else {
          throw err;
        }
      }

      const user = userCredential.user;
      const userDocRef = doc(db, "usuarios", user.uid);
      
      let rol = isCaren ? "admin" : "usuario";
      const baseProfile = {
        uid: user.uid,
        correo: targetEmail,
        nombre: isCaren ? "Caren" : "Evelyn",
        apodo: isCaren ? "Vivi" : "Eve",
        rol: rol,
        nacion: isCaren ? "agua" : "tierra",
        fechaRegistro: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
        tutorialCompletado: false
      };

      let finalUserData = baseProfile;

      try {
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, baseProfile);
        } else {
          const cloudData = userDocSnap.data();
          finalUserData = { ...baseProfile, ...cloudData };
          rol = finalUserData.rol || rol;
          await setDoc(userDocRef, { ultimoAcceso: new Date().toISOString() }, { merge: true });
        }
      } catch (firestoreErr) {
        console.warn("Firestore access denied. Continuing with in-memory profile.", firestoreErr);
        finalUserData.isFallback = true;
      }

      // Update AuthContext user state
      setUsuario(finalUserData);

      // Appa tail wag animation
      setWagTail(true);
      setTimeout(() => {
        if (rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Contraseña espiritual incorrecta. Inténtalo de nuevo.");
      } else if (err.code === "auth/invalid-email") {
        setError("El formato de correo no es válido.");
      } else {
        setError("Error de ingreso: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Por favor, escribe primero tu correo sagrado arriba.");
      return;
    }
    setError("");
    const targetEmail = cleanEmail(email);
    
    const isCaren = targetEmail === "carenvivianagomezramon@gmail.com";
    const isEvelyn = targetEmail === "evelyngomezvanegas@gmail.com";

    if (!isCaren && !isEvelyn) {
      setError("Solo Caren Viviana y Evelyn Natalia pueden restablecer contraseñas en este portal.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, targetEmail);
      alert("¡Correo espiritual enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña. ✉️💕");
    } catch (err) {
      setError("Error al enviar restablecimiento: " + err.message);
    }
  };

  if (showIntro) {
    return (
      <div
        className="typewriter-screen"
        style={{ opacity: introFading ? 0 : 1, transition: "opacity 0.9s ease" }}
      >
        <p className="typewriter-text">{displayedText}</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <AppaBackground />

      <div className="pergamino" style={{ zIndex: 10 }}>
        <h2 className="pergamino-header">El Mundo Avatar</h2>
        
        {error && (
          <div
            style={{
              backgroundColor: "rgba(192, 57, 43, 0.15)",
              color: "#c0392b",
              border: "1px solid rgba(192, 57, 43, 0.3)",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              marginBottom: "15px",
              textAlign: "left"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="pergamino-input-group">
            <label className="pergamino-label">Correo Sagrado</label>
            <input
              type="email"
              className="pergamino-input"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="pergamino-input-group">
            <label className="pergamino-label">Contraseña Espiritual</label>
            <input
              type="password"
              className="pergamino-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="pergamino-btn" disabled={loading}>
            {loading ? "Abriendo Portales..." : "Volar al Mundo Avatar 🍃"}
          </button>
        </form>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button
            onClick={handleForgotPassword}
            style={{
              background: "transparent",
              border: "none",
              color: "#8b572a",
              fontFamily: "Outfit",
              fontSize: "0.85rem",
              fontWeight: "600",
              textDecoration: "underline",
              cursor: "pointer",
              outline: "none"
            }}
          >
            ¿Olvidaste tu contraseña espiritual? ✉️
          </button>
        </div>

        <p style={{ marginTop: "15px", fontSize: "0.75rem", color: "#63431d", opacity: 0.7 }}>
          *Si es tu primera vez, tu cuenta se registrará automáticamente en Firebase con la contraseña provista.
        </p>
      </div>

      {wagTail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ animation: "wag-tail 1s infinite alternate", fontSize: "4rem" }}>
            🐃💨
          </div>
          <h2 style={{ color: "#fff", marginTop: "20px", fontFamily: "Cinzel" }}>
            ¡Yip Yip! Appa mueve la cola feliz
          </h2>
          <p style={{ color: "#a8d8ea", fontFamily: "Outfit", marginTop: "5px" }}>
            ¡Acceso concedido! Volando al portal...
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wag-tail {
          0% { transform: scale(1) rotate(-5deg); }
          100% { transform: scale(1.05) rotate(5deg); }
        }
      `}} />
    </div>
  );
}
