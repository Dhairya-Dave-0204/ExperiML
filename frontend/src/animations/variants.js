const EASE = [0.22, 1, 0.36, 1];

/* ============================================================
   Containers
============================================================ */

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

export const staggerFast = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const staggerSlow = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

/* ============================================================
   Fade
============================================================ */

export const fade = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.55,
      ease: EASE,
    },
  },
};

/* ============================================================
   Fade Up
============================================================ */

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: EASE,
    },
  },
};

/* ============================================================
   Fade Down
============================================================ */

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: EASE,
    },
  },
};

/* ============================================================
   Fade Left
============================================================ */

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: 24,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
};

/* ============================================================
   Fade Right
============================================================ */

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: -24,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
};

/* ============================================================
   Scale In
============================================================ */

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.55,
      ease: EASE,
    },
  },
};

/* ============================================================
   Pop In
============================================================ */

export const popIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

/* ============================================================
   Hero Widget Reveal
============================================================ */

export const widgetReveal = {
  hidden: {
    opacity: 0,
    x: 36,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

/* ============================================================
   Section Reveal
============================================================ */

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 32,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease: EASE,
    },
  },
};

/* ============================================================
   Card Reveal
============================================================ */

export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

/* ============================================================
   List Item Reveal
============================================================ */

export const listItemReveal = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: EASE,
    },
  },
};

/* ============================================================
   Statistics
============================================================ */

export const statReveal = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.5,
      ease: EASE,
    },
  },
};

/* ============================================================
   Navigation
============================================================ */

export const navbarReveal = {
  hidden: {
    opacity: 0,
    y: -16,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: EASE,
    },
  },
};

/* ============================================================
   Modal / Dialog
============================================================ */

export const modalReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.35,
      ease: EASE,
    },
  },

  exit: {
    opacity: 0,
    scale: 0.97,

    transition: {
      duration: 0.2,
    },
  },
};

/* ============================================================
   Custom variants
============================================================ */

export const heroContent = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};