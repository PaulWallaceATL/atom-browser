import type { Variants, Transition } from "motion/react";

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: springGentle },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.12 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springGentle },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2, transition: spring },
};

export const glowPulse: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};
