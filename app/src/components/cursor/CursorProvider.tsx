import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING = { stiffness: 600, damping: 40, mass: 0.2 };

export default function CursorProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);
  const rafRef = useRef(0);

  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
      if (!visible) setVisible(true);
    },
    [mouseX, mouseY, visible],
  );

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInWebview = target.closest("#browser-view");
    if (isInWebview) {
      setHovering(false);
      return;
    }
    const interactive =
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']") ||
      target.closest("[data-hover='glow']");
    setHovering(!!interactive);
  }, []);

  const handleMouseDown = useCallback(() => setPressing(true), []);
  const handleMouseUp = useCallback(() => setPressing(false), []);
  const handleMouseLeave = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (isTouchDevice) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseDown, handleMouseUp, handleMouseLeave, isTouchDevice]);

  if (isTouchDevice) return <>{children}</>;

  const size = pressing ? 28 : hovering ? 48 : 6;
  const opacity = pressing ? 0.2 : hovering ? 0.1 : 0.35;

  return (
    <>
      {children}
      {visible && (
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 9999,
            x: springX,
            y: springY,
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ width: size, height: size, opacity }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            style={{
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Inner dot */}
          <motion.div
            animate={{
              width: pressing ? 3 : 5,
              height: pressing ? 3 : 5,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "50%",
              background: "var(--accent)",
              opacity: 0.6,
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      )}
    </>
  );
}
