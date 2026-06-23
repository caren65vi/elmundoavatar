import "./LoadingScreen.css";
import { useEffect } from "react";

export default function LoadingScreen({ onFinished }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 4000); // 4 seconds of gorgeous splash
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="splash-screen">
      <div className="elements-loader">
        <div className="loader-symbol agua" style={{ animationDelay: "0s" }}>
          <img src="/escudoAgua.png" alt="Agua" style={{ width: "85%", height: "85%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
        </div>
        <div className="loader-symbol tierra" style={{ animationDelay: "1.5s" }}>
          <img src="/escudoTierra.png" alt="Tierra" style={{ width: "85%", height: "85%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
        </div>
        <div className="loader-symbol fuego" style={{ animationDelay: "3s" }}>
          <img src="/escudoFuego.png" alt="Fuego" style={{ width: "85%", height: "85%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
        </div>
        <div className="loader-symbol aire" style={{ animationDelay: "4.5s" }}>
          <img src="/escudoAire.png" alt="Aire" style={{ width: "85%", height: "85%", objectFit: "contain", borderRadius: "50%", mixBlendMode: "multiply" }} />
        </div>
      </div>
      <h1 className="splash-logo">El Mundo Avatar</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Outfit", fontSize: "0.9rem", marginTop: "15px", letterSpacing: "2px" }}>
        CARGANDO TU MUNDO MÁGICO...
      </p>
    </div>
  );
}
