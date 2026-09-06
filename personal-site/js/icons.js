/* ==========================================================================
   icons.js — a tiny pixel-art icon library (inline SVG, 32×32 grid).
   Everything is drawn with 1px rects/paths so it stays crisp at any size.
   ========================================================================== */

const ICONS = (() => {
  const FOLDER = '#f3dd9a';
  const HD = '#e9e9e9';
  const PAPER = '#fff';
  const INK = '#000';
  const SCREEN = '#000';
  const GREEN = '#7ef07e';

  const svg = (inner, size = 32) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${inner}</svg>`;
  const r = (x, y, w, h, f = INK) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
  const p = (d, f = 'none', s = INK) => `<path d="${d}" fill="${f}" stroke="${s}" stroke-width="1"/>`;

  // Outline of a rectangle, 1px, on integer pixel boundaries
  const box = (x, y, w, h, fill = PAPER) =>
    r(x, y, w, h, INK) + r(x + 1, y + 1, w - 2, h - 2, fill);

  // ---- Documents ----------------------------------------------------------
  const page = (fill = PAPER) =>
    p('M6.5 3.5H20.5L25.5 8.5V28.5H6.5Z', fill) + p('M20.5 3.5V8.5H25.5');
  const lines = (from = 13) =>
    r(9, from, 13, 1) + r(9, from + 3, 13, 1) + r(9, from + 6, 13, 1) + r(9, from + 9, 8, 1);

  const doc = page() + lines();
  const readme = page() + r(9, 11, 6, 2) + lines(15);
  const resume = page() + r(11, 11, 4, 4) + r(9, 16, 8, 2) + r(9, 20, 13, 1) + r(9, 23, 13, 1) + r(9, 26, 8, 1);
  const post = page() + r(9, 11, 4, 1) + r(14, 11, 8, 1) + lines(15);
  const chart = page() + r(9, 22, 3, 5) + r(14, 17, 3, 10) + r(19, 12, 3, 15);

  // ---- Folders ------------------------------------------------------------
  const folderBase = (fill = FOLDER) =>
    r(2, 6, 12, 1) + r(2, 7, 1, 3) + r(13, 7, 1, 2) + r(3, 7, 10, 2, fill) +
    box(2, 9, 28, 18, fill) + r(3, 10, 26, 1, '#fff');
  const folder = folderBase();
  const folderApps = folderBase() +
    r(11, 14, 4, 4) + r(17, 14, 4, 4) + r(11, 20, 4, 4) + r(17, 20, 4, 4);
  const folderMarketing = folderBase() +
    r(9, 16, 3, 5) + r(12, 15, 2, 7) + r(14, 13, 2, 11) + r(16, 12, 2, 13) + r(18, 11, 2, 15) +
    r(22, 15, 1, 2) + r(23, 13, 1, 6) + r(25, 11, 1, 10);
  const folderBlog = folderBase() +
    r(8, 14, 16, 1) + r(8, 17, 16, 1) + r(8, 20, 16, 1) + r(8, 23, 10, 1);

  // ---- Hardware & apps ----------------------------------------------------
  const hd = box(2, 10, 28, 12, HD) + r(3, 20, 26, 1, '#b5b5b5') + r(6, 15, 2, 2) + r(10, 15, 12, 1, '#9a9a9a');

  const terminal =
    box(4, 4, 24, 18, SCREEN) +
    r(8, 9, 1, 1, GREEN) + r(9, 10, 1, 1, GREEN) + r(10, 11, 1, 1, GREEN) + r(9, 12, 1, 1, GREEN) + r(8, 13, 1, 1, GREEN) +
    r(13, 13, 5, 1, GREEN) +
    r(12, 22, 8, 2) + r(9, 24, 14, 2) + r(10, 25, 12, 1, '#fff');

  const mac =
    box(5, 2, 22, 27, PAPER) +
    box(8, 5, 16, 12, PAPER) +
    r(11, 8, 2, 2) + r(19, 8, 2, 2) + r(15, 10, 1, 2) +
    r(12, 12, 1, 1) + r(13, 13, 6, 1) + r(19, 12, 1, 1) +
    r(9, 20, 9, 1) + r(20, 20, 3, 1) + r(8, 25, 16, 1, '#c8c8c8') +
    r(6, 29, 20, 1) + r(4, 30, 24, 1);

  const trash =
    r(13, 2, 6, 1) + r(12, 3, 1, 1) + r(19, 3, 1, 1) +
    r(6, 4, 20, 2) +
    box(8, 6, 16, 22, PAPER) +
    r(11, 9, 1, 16) + r(15, 9, 1, 16) + r(19, 9, 1, 16);

  const mail = box(3, 8, 26, 17, PAPER) + p('M3.5 8.5L16 18L28.5 8.5') + p('M3.5 24.5L12 16M28.5 24.5L20 16');

  const patterns =
    box(3, 5, 26, 22, PAPER) +
    r(4, 6, 24, 3) + r(6, 7, 3, 1, '#fff') + r(11, 7, 3, 1, '#fff') + r(16, 7, 3, 1, '#fff') +
    r(6, 12, 8, 5, '#7a93a3') + r(16, 12, 10, 5, '#3682a4') + r(6, 19, 8, 5, '#cdbc93') + r(16, 19, 10, 5, '#6e6292');

  const megaphone =
    r(4, 13, 5, 6) + r(9, 11, 2, 10) + r(11, 9, 3, 14) + r(14, 7, 3, 18) + r(17, 6, 3, 20) +
    r(6, 19, 3, 6) +
    r(23, 13, 1, 2) + r(24, 11, 1, 6) + r(26, 9, 1, 10) + r(28, 7, 1, 14);

  const star = p('M16 2L20 12L30 12L22 18L25 29L16 22L7 29L10 18L2 12L12 12Z', PAPER);
  const globe =
    p('M16 3A13 13 0 1 0 16.01 3Z', PAPER) +
    p('M3.5 16H28.5M16 3.5V28.5M16 3.5C9 9 9 23 16 28.5M16 3.5C23 9 23 23 16 28.5M6 9H26M6 23H26');

  // Generic "application" icon: a little window with a letter in it
  const app = (letter = 'A', color = '#e8f0ff') =>
    box(3, 4, 26, 24, color) +
    r(4, 5, 24, 4, PAPER) + r(4, 6, 24, 1) + r(4, 8, 24, 1) + r(4, 9, 24, 1) +
    `<text x="16" y="24" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="14" fill="${INK}">${String(letter).slice(0, 1).toUpperCase()}</text>`;

  // Emoji fallback framed like a document
  const emoji = (ch) =>
    page() + `<text x="16" y="21" text-anchor="middle" font-size="12">${ch}</text>`;

  // ---- Dialog icons -------------------------------------------------------
  const note =
    p('M4.5 4.5H27.5V22.5H14L8 28V22.5H4.5Z', PAPER) +
    r(15, 8, 2, 8) + r(15, 18, 2, 2);
  const caution = p('M16 3L30.5 28.5H1.5Z', PAPER) + r(15, 11, 2, 9) + r(15, 22, 2, 2);
  const stop =
    p('M10.5 2.5H21.5L29.5 10.5V21.5L21.5 29.5H10.5L2.5 21.5V10.5Z', PAPER) +
    r(9, 15, 14, 3);

  // Menu-bar logo: a six-stripe rounded square (a nod to the era, not a trademark)
  const logo =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">` +
    `<clipPath id="logo-clip"><rect x="1" y="1" width="14" height="14" rx="3"/></clipPath>` +
    `<g clip-path="url(#logo-clip)">` +
    `<rect x="0" y="0" width="16" height="3" fill="#5fbb46"/><rect x="0" y="3" width="16" height="2.5" fill="#fdb827"/>` +
    `<rect x="0" y="5.5" width="16" height="2.5" fill="#f5821f"/><rect x="0" y="8" width="16" height="2.5" fill="#e03a3e"/>` +
    `<rect x="0" y="10.5" width="16" height="2.5" fill="#963d97"/><rect x="0" y="13" width="16" height="3" fill="#009ddc"/>` +
    `</g><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="#000"/></svg>`;

  const lib = {
    doc: svg(doc), readme: svg(readme), resume: svg(resume), post: svg(post), chart: svg(chart),
    folder: svg(folder), 'folder-apps': svg(folderApps), 'folder-marketing': svg(folderMarketing), 'folder-blog': svg(folderBlog),
    hd: svg(hd), terminal: svg(terminal), mac: svg(mac), trash: svg(trash), mail: svg(mail), patterns: svg(patterns),
    megaphone: svg(megaphone), star: svg(star), globe: svg(globe),
    note: svg(note), caution: svg(caution), stop: svg(stop),
    logo,
  };

  /**
   * get('folder') → svg markup. get('app', 'L', '#cfe8ff') for app icons.
   * Unknown names that look like an emoji are rendered inside a document frame.
   */
  function get(name, ...args) {
    if (name === 'app') return svg(app(...args));
    if (lib[name]) return lib[name];
    if (name && /\p{Extended_Pictographic}/u.test(name)) return svg(emoji(name));
    return lib.doc;
  }

  return { get, names: Object.keys(lib) };
})();
