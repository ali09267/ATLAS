import { useState } from "react";
import "../styles/AtlasBackground.css";

function AtlasBackground({ variant = "user" }) {
  const DOT_COUNT = variant === "admin" ? 80 : 200;

  const [dots] = useState(() =>
    Array.from({ length: DOT_COUNT }, (_, index) => {
      const size = Math.random() * 3 + 2;

      return {
        id: index,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        delay: `${Math.random() * -12}s`,
        duration: `${Math.random() * 8 + 8}s`,
      };
    }),
  );

  return (
    <div className={`atlas-background atlas-background-${variant}`}>
      <div className="atlas-glow atlas-glow-purple"></div>

      <div className="atlas-glow atlas-glow-blue"></div>

      <div className="atlas-dots">
        {dots.map((dot) => (
          <span
            key={dot.id}
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AtlasBackground;
