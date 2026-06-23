import "./Poems.css";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { defaultPoems } from "../../mockData";
import { VolumeX, Volume2, Heart } from "lucide-react";

export default function Poems() {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPoemId, setOpenPoemId] = useState(null);
  const [audioActive, setAudioActive] = useState(false);
  const [synth, setSynth] = useState(null);

  // Load poems
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const q = query(collection(db, "poemas"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        if (data.length > 0) {
          setPoems(data);
        } else {
          setPoems(defaultPoems);
        }
      } catch (err) {
        console.error("Error loading poems from firestore: ", err);
        setPoems(defaultPoems);
      } finally {
        setLoading(false);
      }
    };
    fetchPoems();
  }, []);

  // Web Audio Synth for procedural ambient music
  const startProceduralMusic = (element) => {
    if (synth) {
      synth.ctx.close();
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // keep it soft and background
      masterGain.connect(ctx.destination);

      let timerId;

      if (element === "agua") {
        // Flowing arpeggios
        const notes = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25]; // C major / pentatonic
        let step = 0;

        const playWater = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 3);

          step++;
          timerId = setTimeout(playWater, 800);
        };
        playWater();
      } else if (element === "tierra") {
        // Low, stable earth drones
        const notes = [130.81, 164.81, 196.00, 220.00];
        let step = 0;

        const playEarth = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 5);

          step++;
          timerId = setTimeout(playEarth, 2000);
        };
        playEarth();
      } else if (element === "fuego") {
        // Warm pulsating beats
        const notes = [220.00, 261.63, 293.66, 349.23, 440.00];
        let step = 0;

        const playFire = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

          // lowpass filter to make it warm
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 3.5);

          step++;
          timerId = setTimeout(playFire, 1200);
        };
        playFire();
      } else {
        // Air sweeps and chimes
        const notes = [329.63, 392.00, 440.00, 587.33, 659.25, 880.00];
        let step = 0;

        const playAir = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

          // Add a subtle frequency modulation for wind sweep
          osc.frequency.linearRampToValueAtTime(notes[step % notes.length] + 20, ctx.currentTime + 1.5);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 2.5);

          step++;
          timerId = setTimeout(playAir, 1000);
        };
        playAir();
      }

      setSynth({ ctx, timerId });
      setAudioActive(true);
    } catch (e) {
      console.error("Failed to start audio: ", e);
    }
  };

  const stopMusic = () => {
    if (synth) {
      clearTimeout(synth.timerId);
      synth.ctx.close();
      setSynth(null);
    }
    setAudioActive(false);
  };

  // Stop music on unmount
  useEffect(() => {
    return () => {
      if (synth) {
        clearTimeout(synth.timerId);
        synth.ctx.close();
      }
    };
  }, [synth]);

  const togglePoem = (poem) => {
    if (openPoemId === poem.id) {
      setOpenPoemId(null);
      stopMusic();
    } else {
      setOpenPoemId(poem.id);
      if (audioActive) {
        startProceduralMusic(poem.element);
      }
    }
  };

  const handleAudioButton = (poemElement) => {
    if (audioActive) {
      stopMusic();
    } else {
      startProceduralMusic(poemElement);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando poemas para la distancia...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "35px", textAlign: "left" }}>
        <h1 style={{ fontFamily: "Cinzel Decorative", fontSize: "2rem", color: "var(--primary-color)", textShadow: "var(--neon-glow)", marginBottom: "10px" }}>
          Poemas para la Distancia
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontFamily: "Outfit" }}>
          Cartas escritas desde el alma para acortar las millas. Toca los sobres antiguos para leer su contenido e iniciar la melodía.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", alignItems: "center" }}>
        {poems.map((poem) => {
          const isOpen = openPoemId === poem.id;
          return (
            <div key={poem.id} style={{ width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              
              {/* Antique Envelope Box */}
              <div
                className="sobre-contenedor"
                onClick={() => togglePoem(poem)}
              >
                <div className={`sobre ${isOpen ? "abierto" : ""}`}>
                  <div className="sobre-solapa" />
                  <div className="sobre-cuerpo" />
                  <div className="sobre-carta">
                    <div style={{ padding: "10px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                      <span style={{ fontSize: "1.4rem" }}>📜</span>
                      <span style={{ fontSize: "0.75rem", fontFamily: "Cinzel", fontWeight: "bold", color: "#8b572a", marginTop: "5px" }}>
                        Desplegar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opened Poem Card */}
              {isOpen && (
                <div
                  className="pergamino"
                  style={{
                    maxWidth: "520px",
                    animation: "pop-in 0.4s ease forwards",
                    boxShadow: "inset 0 0 35px rgba(139,87,42,0.25), 0 15px 35px rgba(0,0,0,0.4)",
                    padding: "30px 40px",
                    marginTop: "-40px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(99, 67, 29, 0.2)", paddingBottom: "10px", marginBottom: "20px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#8b572a", fontFamily: "Cinzel" }}>
                      📅 {poem.date}
                    </span>
                    
                    {/* Audio controller inside opened poem */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAudioButton(poem.element);
                      }}
                      style={{
                        background: "rgba(99, 67, 29, 0.1)",
                        border: "1px solid rgba(99, 67, 29, 0.2)",
                        color: "#63431d",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        outline: "none"
                      }}
                      title={audioActive ? "Silenciar" : "Activar Música Ambiental"}
                    >
                      {audioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>

                  <h3 className="pergamino-header" style={{ border: "none", padding: 0, marginBottom: "20px", color: "#63431d", fontSize: "1.45rem" }}>
                    {poem.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.1rem",
                      lineHeight: "1.8",
                      color: "#3b2c16",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                      fontStyle: "italic",
                      marginBottom: "25px"
                    }}
                  >
                    {poem.content}
                  </p>

                  <div style={{ display: "flex", justifyContent: "center", color: "#c0392b" }}>
                    <Heart size={20} fill="currentColor" style={{ animation: "heart-beat 1.2s infinite" }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
