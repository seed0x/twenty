/* ==========================================================================
   wm.js — the window manager.
   Opens/closes/focuses windows, drags them as dotted outlines (like the
   real thing), resizes with the grow box, zooms, and "window-shades" on a
   title-bar double-click. Emits wm:open / wm:focus / wm:close events.
   ========================================================================== */

const WM = (() => {
  const wins = new Map();
  let zTop = 100;
  let cascade = 0;
  let active = null;

  const desktop = () => document.getElementById('desktop');
  const isMobile = () => window.matchMedia('(max-width: 640px), (pointer: coarse) and (max-width: 900px)').matches;
  const emit = (type, w) => document.dispatchEvent(new CustomEvent(`wm:${type}`, { detail: w }));

  function open(opts) {
    if (wins.has(opts.id)) {
      const existing = wins.get(opts.id);
      existing.el.classList.remove('shaded');
      focus(existing);
      return existing;
    }

    const el = document.createElement('section');
    el.className = `window ${opts.className || ''}`.trim();
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', opts.title);
    el.tabIndex = -1;
    el.dataset.id = opts.id;
    el.innerHTML =
      '<div class="titlebar">' +
      '<button class="closebox" type="button" aria-label="Close window"></button>' +
      '<span class="title"></span>' +
      '<button class="zoombox" type="button" aria-label="Zoom window"></button>' +
      '</div>' +
      '<div class="window-content"></div>' +
      '<div class="growbox" aria-hidden="true"></div>';
    el.querySelector('.title').textContent = opts.title;
    if (opts.resizable === false) el.classList.add('no-resize');

    const content = el.querySelector('.window-content');
    if (typeof opts.content === 'string') content.innerHTML = opts.content;
    else if (opts.content instanceof Node) content.appendChild(opts.content);
    else if (typeof opts.content === 'function') opts.content(content);

    // Size & position (cascaded, kept inside the desktop)
    const dw = desktop().clientWidth;
    const dh = desktop().clientHeight;
    const width = Math.min(opts.width || 540, Math.max(240, dw - 24));
    const height = Math.min(opts.height || 400, Math.max(160, dh - 24));
    const n = cascade++ % 7;
    let x = opts.x ?? (36 + n * 26);
    let y = opts.y ?? (22 + n * 24);
    x = Math.max(0, Math.min(x, dw - width - 4));
    y = Math.max(0, Math.min(y, dh - height - 4));
    Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` });

    const w = { id: opts.id, el, opts, content, zoomSaved: null };
    wins.set(opts.id, w);
    desktop().appendChild(el);

    el.addEventListener('pointerdown', () => focus(w), true);
    el.querySelector('.closebox').addEventListener('click', (e) => { e.stopPropagation(); close(opts.id); });
    el.querySelector('.zoombox').addEventListener('click', (e) => { e.stopPropagation(); zoom(w); });
    const titlebar = el.querySelector('.titlebar');
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('button')) return;
      el.classList.toggle('shaded');
    });
    makeDraggable(w, titlebar);
    makeResizable(w, el.querySelector('.growbox'));

    focus(w);
    emit('open', w);
    return w;
  }

  function focus(w) {
    if (!w || w.el.classList.contains('active')) return;
    if (active) active.el.classList.remove('active');
    active = w;
    w.el.classList.add('active');
    w.el.style.zIndex = ++zTop;
    emit('focus', w);
  }

  function close(id) {
    const w = wins.get(id);
    if (!w) return;
    wins.delete(id);
    w.el.remove();
    if (active === w) {
      active = null;
      let top = null;
      for (const o of wins.values()) if (!top || +o.el.style.zIndex > +top.el.style.zIndex) top = o;
      if (top) focus(top);
    }
    if (typeof w.opts.onClose === 'function') w.opts.onClose(w);
    emit('close', w);
  }

  function closeActive() { if (active) close(active.id); }
  function closeAll() { [...wins.keys()].forEach(close); }

  function zoom(w) {
    if (isMobile()) return;
    const s = w.el.style;
    if (w.zoomSaved) {
      Object.assign(s, w.zoomSaved);
      w.zoomSaved = null;
    } else {
      w.zoomSaved = { left: s.left, top: s.top, width: s.width, height: s.height };
      const dw = desktop().clientWidth;
      const dh = desktop().clientHeight;
      Object.assign(s, { left: '6px', top: '6px', width: `${dw - 14}px`, height: `${dh - 14}px` });
    }
  }

  // ---- Dragging: a dotted outline follows the pointer; the window jumps on release
  function makeDraggable(w, handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button') || isMobile()) return;
      e.preventDefault();
      const dRect = desktop().getBoundingClientRect();
      const rect = w.el.getBoundingClientRect();
      const ox = rect.left - dRect.left;
      const oy = rect.top - dRect.top;
      const sx = e.clientX;
      const sy = e.clientY;
      let outline = null;
      let nx = ox;
      let ny = oy;

      const onMove = (ev) => {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        if (!outline) {
          if (Math.hypot(dx, dy) < 3) return;
          outline = document.createElement('div');
          outline.className = 'drag-outline';
          outline.style.width = `${rect.width}px`;
          outline.style.height = `${rect.height}px`;
          desktop().appendChild(outline);
        }
        nx = Math.max(-rect.width + 80, Math.min(ox + dx, dRect.width - 80));
        ny = Math.max(0, Math.min(oy + dy, dRect.height - 24));
        outline.style.left = `${nx}px`;
        outline.style.top = `${ny}px`;
      };
      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        if (outline) {
          outline.remove();
          w.el.style.left = `${nx}px`;
          w.el.style.top = `${ny}px`;
          w.zoomSaved = null;
        }
      };
      handle.setPointerCapture(e.pointerId);
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    });
  }

  function makeResizable(w, grip) {
    grip.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      focus(w);
      const dRect = desktop().getBoundingClientRect();
      const rect = w.el.getBoundingClientRect();
      const left = rect.left - dRect.left;
      const top = rect.top - dRect.top;
      const sx = e.clientX;
      const sy = e.clientY;
      let outline = null;
      let nw = rect.width;
      let nh = rect.height;

      const onMove = (ev) => {
        if (!outline) {
          outline = document.createElement('div');
          outline.className = 'drag-outline';
          outline.style.left = `${left}px`;
          outline.style.top = `${top}px`;
          desktop().appendChild(outline);
        }
        nw = Math.max(220, Math.min(rect.width + (ev.clientX - sx), dRect.width - left));
        nh = Math.max(120, Math.min(rect.height + (ev.clientY - sy), dRect.height - top));
        outline.style.width = `${nw}px`;
        outline.style.height = `${nh}px`;
      };
      const onUp = () => {
        grip.removeEventListener('pointermove', onMove);
        grip.removeEventListener('pointerup', onUp);
        grip.removeEventListener('pointercancel', onUp);
        if (outline) {
          outline.remove();
          w.el.style.width = `${nw}px`;
          w.el.style.height = `${nh}px`;
          w.zoomSaved = null;
        }
      };
      grip.setPointerCapture(e.pointerId);
      grip.addEventListener('pointermove', onMove);
      grip.addEventListener('pointerup', onUp);
      grip.addEventListener('pointercancel', onUp);
    });
  }

  /** Keep windows reachable after the viewport shrinks. */
  function relayout() {
    const dw = desktop().clientWidth;
    const dh = desktop().clientHeight;
    for (const w of wins.values()) {
      const s = w.el.style;
      const width = Math.min(parseFloat(s.width), Math.max(240, dw - 12));
      const height = Math.min(parseFloat(s.height), Math.max(160, dh - 12));
      s.width = `${width}px`;
      s.height = `${height}px`;
      s.left = `${Math.max(0, Math.min(parseFloat(s.left), dw - width))}px`;
      s.top = `${Math.max(0, Math.min(parseFloat(s.top), dh - 24))}px`;
    }
  }
  window.addEventListener('resize', relayout);

  return {
    open, close, closeActive, closeAll, focus, zoom, isMobile,
    get active() { return active; },
    get: (id) => wins.get(id),
    has: (id) => wins.has(id),
    list: () => [...wins.values()],
  };
})();
