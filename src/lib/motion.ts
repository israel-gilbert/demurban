import { Variants } from "framer-motion";

/**
 * Wearix-style motion system
 * Subtle, consistent, premium (no bouncy / no dramatic movement)
 */

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Page load: gentle fade + small y
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

// Section reveal: fade only + controlled stagger (not slow)
export const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Item reveal: fade + tiny y
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

// Hover: subtle scale (Wearix feel)
export const hoverVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.04,
    transition: { duration: 0.25, ease: easeOut },
  },
};

// Container stagger for grids
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

// Tabs: simple fade/slide
export const tabVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: easeOut },
  },
};

// Overlay fade + light blur
export const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(6px)",
    transition: { duration: 0.22, ease: easeOut },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.18, ease: easeOut },
  },
};

// Menu panel slide-in (clean)
export const menuVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: easeOut },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.22, ease: easeOut },
  },
};

// Image transitions (subtle, no dramatic scale)
export const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    transition: { duration: 0.22, ease: easeOut },
  },
};

// Hero text reveal: still subtle
export const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// Collection reveal: subtle
export const collectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

// Badges: minimal pop (don’t distract)
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: easeOut },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.18, ease: easeOut },
  },
};

// Buttons: tiny lift only
export const buttonVariants: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.01,
    y: -1,
    transition: { duration: 0.18, ease: easeOut },
  },
  tap: {
    scale: 0.99,
    y: 0,
    transition: { duration: 0.1 },
  },
};

// Marquee/ticker animation (CSS-based)
export const marqueeAnimation = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  @keyframes marquee-reverse {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
`;

export const countVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: easeOut },
  },
};

export const tickerClasses = "animate-marquee hover:[animation-play-state:paused]";