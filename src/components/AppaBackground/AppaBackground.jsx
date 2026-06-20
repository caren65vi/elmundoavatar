import "./AppaBackground.css";
import React, { useEffect, useState } from "react";

export default function AppaBackground() {
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    // Generate random cloud properties
    const newClouds = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80}%`,
      left: `${-20 - Math.random() * 20}%`,
      scale: 0.5 + Math.random() * 1.2,
      duration: `${40 + Math.random() * 60}s`,
      delay: `${i * -12}s`,
      opacity: 0.05 + Math.random() * 0.1,
    }));
    setClouds(newClouds);
  }, []);

  return (
    <div className="appa-flight-bg">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud-layer"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: `${150 * cloud.scale}px`,
            height: `${80 * cloud.scale}px`,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
            opacity: cloud.opacity,
            "--duration": cloud.duration,
          }}
        />
      ))}
      <div className="login-appa-anim" style={{ right: "10%", bottom: "25%" }}>
        {/* Simple stylized SVG of Appa flying */}
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
          <path d="M40 30 C 50 15, 110 15, 120 30 C 130 45, 125 75, 110 80 C 90 85, 50 85, 40 75 C 30 65, 30 45, 40 30 Z" fill="#F0ECE1" />
          <path d="M120 40 C 125 45, 135 45, 138 38 C 140 32, 130 25, 120 32 Z" fill="#BDB39E" />
          <path d="M120 45 L 140 45 C 142 47, 142 53, 140 55 L 120 53 Z" fill="#D3C9B5" />
          {/* Arrows */}
          <path d="M80 20 L 105 38 L 95 38 L 125 55 L 90 55 L 80 50 Z" fill="#8EA3B5" opacity="0.8" />
          {/* Tail */}
          <path d="M35 55 C 15 50, 10 70, 25 75 C 35 78, 38 65, 35 55 Z" fill="#D3C9B5" />
          {/* Feet */}
          <ellipse cx="50" cy="82" rx="10" ry="12" fill="#D3C9B5" />
          <ellipse cx="70" cy="84" rx="10" ry="12" fill="#D3C9B5" />
          <ellipse cx="90" cy="84" rx="10" ry="12" fill="#D3C9B5" />
          <ellipse cx="110" cy="82" rx="10" ry="12" fill="#D3C9B5" />
          {/* Horns */}
          <path d="M115 28 C 122 18, 118 8, 110 10 C 105 11, 110 20, 113 25 Z" fill="#4B3D30" />
          <path d="M122 32 C 130 24, 128 14, 120 16 C 115 17, 118 26, 120 30 Z" fill="#4B3D30" />
          {/* Eyes */}
          <circle cx="128" cy="38" r="3" fill="#3B2C16" />
        </svg>
      </div>
    </div>
  );
}
