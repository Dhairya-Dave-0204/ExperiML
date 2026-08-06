/* ============================================================
   Default
   ------------------------------------------------------------
   Used for most sections throughout the application.
============================================================ */

export const defaultViewport = {
  once: true,
  amount: 0.2,
};

/* ============================================================
   Small Components
   ------------------------------------------------------------
   Cards, badges, FAQ items, statistics, etc.
============================================================ */

export const smallViewport = {
  once: true,
  amount: 0.15,
};

/* ============================================================
   Large Sections
   ------------------------------------------------------------
   Hero sections, About sections, Contact blocks,
   Documentation sections.
============================================================ */

export const sectionViewport = {
  once: true,
  amount: 0.3,
};

/* ============================================================
   Continuous
   ------------------------------------------------------------
   Used only when a component should animate every time
   it enters the viewport.
============================================================ */

export const repeatViewport = {
  once: false,
  amount: 0.2,
};

/* ============================================================
   Fully Visible
   ------------------------------------------------------------
   Animation begins only when almost the entire component
   is visible.
============================================================ */

export const fullViewport = {
  once: true,
  amount: 0.6,
};