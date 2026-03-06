import { motion } from "motion/react";
import { useState, useEffect } from "react";

const LETTERS = ["A", "T", "O", "M", "\u00A0", "A", "I"];

export function BrandWordmark() {
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasPlayed(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 40,
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          display: "flex",
          gap: 2,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 86,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
        aria-label="ATOM AI"
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            initial={hasPlayed ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: hasPlayed ? 0 : i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "inline-block",
              background: i < 4
                ? "linear-gradient(180deg, #ffffff 20%, #a2a3e9 100%)"
                : "linear-gradient(180deg, #a2a3e9 0%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}
