/* ==========================================================================
   main.js — power on.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Desktop.init();
  Desktop.boot().then(() => {
    // Deep link (#/blog/slug etc.) or, on a plain visit, the Read Me.
    if (!Apps.openRoute(window.location.hash)) Apps.openAbout();
  });
});
