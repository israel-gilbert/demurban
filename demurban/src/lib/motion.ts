import { Variants } from "framer-motion";

/**
 * Reusable Wearix-style motion variants for consistent animations
 * All timings follow Wearix design: 300ms easeOut for page/section, 250ms for hovers
 */

// Page load: fade in + y slide (0->1 opacity, y 12px->0)
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Section reveal on scroll with stagger
export const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms stagger
      delayChildren: 0,
    },
  },
};

// Individual item for stagger
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Product card hover effect
export const hoverVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Container for staggering grid items
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Tab underline animation (layoutId controlled)
export const tabVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Mobile menu overlay fade
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Mobile menu panel slide-in from right
export const menuVariants: Variants = {
  hidden: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Gallery image crossfade
export const imageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier easeOut
    },
  },
};

// Marquee/ticker animation (CSS-based, but exported for reference)
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

// Announcement ticker CSS class
export const tickerClasses = "animate-marquee hover:animation-pause";
