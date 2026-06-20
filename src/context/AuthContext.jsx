import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../Firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const targetEmail = firebaseUser.email.trim().toLowerCase();
        const isCaren = targetEmail === "carenvivianagomezramon@gmail.com";
        const isEvelyn = targetEmail === "evelyngomezvanegas@gmail.com";

        // Setup base document info
        const baseProfile = {
          uid: firebaseUser.uid,
          correo: firebaseUser.email,
          nombre: isCaren ? "Caren" : "Evelyn",
          apodo: isCaren ? "Vivi" : "Eve",
          rol: isCaren ? "admin" : "usuario",
          nacion: isCaren ? "agua" : "tierra",
          fechaRegistro: new Date().toISOString(),
          ultimoAcceso: new Date().toISOString(),
          tutorialCompletado: false
        };

        try {
          const userDocRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Merge existing data with essential fields
            const merged = { ...baseProfile, ...data };
            setUsuario(merged);

            // Update ultimoAcceso in Firestore asynchronously
            setDoc(userDocRef, { ultimoAcceso: new Date().toISOString() }, { merge: true }).catch(err => {
              console.warn("Could not update last active timestamp: ", err);
            });
          } else {
            // Write new document in Spanish
            await setDoc(userDocRef, baseProfile);
            setUsuario(baseProfile);
          }
        } catch (err) {
          console.warn("Firestore error during login profile fetch. Falling back to in-memory profile.", err);
          // Fallback in-memory profile so they can enter the app even if Firestore is blocked
          setUsuario({ ...baseProfile, isFallback: true });
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const rol = usuario ? usuario.rol : null;

  return (
    <AuthContext.Provider value={{ usuario, rol, loading, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
