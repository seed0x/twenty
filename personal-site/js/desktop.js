/* ==========================================================================
   desktop.js — the Finder: menu bar, desktop icons, dialogs, boot and
   shut-down screens, desktop patterns, #/routing and keyboard shortcuts.
   ========================================================================== */

const Desktop = (() => {
  const $ = (sel, r = document) => r.querySelector(sel);
  const { h } = Apps;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch (_) { /* ignore */ } },
  };
  const baseTitle = document.title;

  // ---- Desktop patterns -----------------------------------------------------
  function setPattern(name) {
    document.body.dataset.pattern = name;
    store.set('pattern', name);
  }
  function loadPattern() {
    const saved = store.get('pattern');
    const valid = (k) => Apps.PATTERNS.some(([key]) => key === k);
    document.body.dataset.pattern = valid(saved) ? saved : (valid(document.body.dataset.pattern) ? document.body.dataset.pattern : 'stipple');
  }
  // history.* can throw inside sandboxed frames; the site works fine without it.
  const nav = (fn) => { try { fn(); } catch (_) { /* ignore */ } };

  // ---- Modal dialogs --------------------------------------------------------
  /** alert({ icon, text, buttons: ['Cancel', 'OK'] }) → Promise<clicked label> */
  function alert({ icon = 'note', text = '', html = '', buttons = ['OK'], defaultButton = buttons.length - 1 }) {
    return new Promise((resolve) => {
      const previous = document.activeElement;
      const backdrop = h('div.dialog-backdrop');
      const dialog = h('div.dialog', { role: 'alertdialog', 'aria-modal': 'true', tabindex: -1 });
      const body = h('div.dialog-body', h('div.dialog-icon', { html: ICONS.get(icon) }), h('div.dialog-text'));
      if (html) body.lastChild.innerHTML = html; else body.lastChild.textContent = text;
      const row = h('div.dialog-buttons');
      const finish = (label) => {
        backdrop.remove();
        document.removeEventListener('keydown', onKey, true);
        if (previous && previous.focus) previous.focus({ preventScroll: true });
        resolve(label);
      };
      buttons.forEach((label, i) => {
        const b = h('button.btn', { type: 'button', text: label });
        if (i === defaultButton) b.classList.add('default');
        b.addEventListener('click', () => finish(label));
        row.append(b);
      });
      const onKey = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); finish(buttons[defaultButton]); }
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(buttons.length > 1 ? buttons[0] : buttons[0]); }
      };
      document.addEventListener('keydown', onKey, true);
      dialog.append(body, row);
      backdrop.append(dialog);
      $('#dialogs').append(backdrop);
      (row.children[defaultButton] || dialog).focus({ preventScroll: true });
    });
  }

  // ---- Menu bar -------------------------------------------------------------
  const menus = () => [
    { id: 'logo', logo: true, items: [
      { label: 'About This Macintosh…', action: Apps.openAboutMac },
      { sep: true },
      { label: 'Read Me', action: Apps.openAbout },
      { label: 'Terminal', key: '`', action: Apps.openTerminal },
      { label: 'Desktop Patterns…', action: Apps.openPatterns },
    ] },
    { label: 'File', items: [
      { label: `Open ${SITE.diskName}`, action: () => Apps.openFolder('hd') },
      { label: 'Open Applications', action: () => Apps.openFolder('apps') },
      { label: 'Open Client Work', action: () => Apps.openFolder('marketing') },
      { label: 'Open Blog', action: () => Apps.openFolder('blog') },
      { sep: true },
      { label: 'Read Me', action: Apps.openAbout },
      { label: 'What I Do', action: Apps.openServices },
      ...(SITE.resume ? [{ label: 'Résumé', action: Apps.openResume }] : []),
      { label: 'Contact…', action: Apps.openContact },
      { sep: true },
      { label: 'Close Window', key: 'Esc', action: () => WM.closeActive(), enabled: () => !!WM.active },
      { label: 'Close All', action: () => WM.closeAll(), enabled: () => WM.list().length > 0 },
    ] },
    { label: 'Edit', items: [
      { label: 'Undo', key: '⌘Z', disabled: true },
      { sep: true },
      { label: 'Cut', key: '⌘X', disabled: true },
      { label: 'Copy', key: '⌘C', disabled: true },
      { label: 'Paste', key: '⌘V', disabled: true },
      { label: 'Clear', disabled: true },
      { sep: true },
      { label: 'Copy Email Address', action: copyEmail },
    ] },
    { label: 'View', items: [
      { label: 'by Icon', check: () => Apps.finderView === 'icon', action: () => Apps.setFinderView('icon') },
      { label: 'by Name', check: () => Apps.finderView === 'list', action: () => Apps.setFinderView('list') },
      { sep: true },
      { label: 'Clean Up Desktop', action: () => layoutIcons(true) },
    ] },
    { label: 'Special', items: [
      { label: 'Empty Trash…', action: emptyTrash },
      { sep: true },
      { label: 'Desktop Patterns…', action: Apps.openPatterns },
      { sep: true },
      { label: 'Restart', action: restart },
      { label: 'Shut Down', action: shutDown },
    ] },
    { label: 'Help', items: [
      { label: 'About This Site', action: Apps.openHelp },
      { label: 'Keyboard Shortcuts', action: Apps.openHelp },
      ...(SITE.sourceUrl ? [{ sep: true }, { label: 'View Source', action: () => window.open(SITE.sourceUrl, '_blank', 'noopener') }] : []),
    ] },
  ];

  let openMenu = null;
  function closeMenus() {
    if (openMenu) openMenu.classList.remove('open');
    openMenu = null;
  }
  function fillDropdown(menu, def) {
    const ul = $('.dropdown', menu);
    ul.innerHTML = '';
    def.items.forEach((it) => {
      if (it.sep) { ul.append(h('li.sep', { role: 'separator' })); return; }
      const disabled = it.disabled || (typeof it.enabled === 'function' && !it.enabled());
      const li = h('li.item', { role: 'menuitem', tabindex: disabled ? -1 : 0, 'aria-disabled': disabled ? 'true' : null },
        h('span', it.check ? h('span.check', it.check() ? '✓' : '') : null, it.label),
        it.key ? h('kbd', it.key) : null);
      if (disabled) li.classList.add('disabled');
      else {
        const go = () => { closeMenus(); it.action && it.action(); };
        li.addEventListener('click', go);
        li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      }
      ul.append(li);
    });
  }
  function buildMenubar() {
    const bar = $('#menubar');
    bar.innerHTML = '';
    menus().forEach((def) => {
      const menu = h('div.menu', { role: 'none' });
      const title = h('button.menu-title', { type: 'button', role: 'menuitem', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
      if (def.logo) { title.classList.add('logo'); title.innerHTML = ICONS.get('logo'); title.setAttribute('aria-label', 'Site menu'); }
      else title.textContent = def.label;
      const dropdown = h('ul.dropdown', { role: 'menu' });
      menu.append(title, dropdown);
      const show = () => {
        closeMenus();
        fillDropdown(menu, def);
        menu.classList.add('open');
        title.setAttribute('aria-expanded', 'true');
        openMenu = menu;
      };
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        if (openMenu === menu) closeMenus(); else show();
      });
      title.addEventListener('mouseenter', () => { if (openMenu && openMenu !== menu) show(); });
      bar.append(menu);
    });
    bar.append(h('div.spacer'));
    bar.append(h('div.app-name', { id: 'app-name' }));
    bar.append(h('div.clock', { id: 'clock', role: 'timer', 'aria-live': 'off' }));
    document.addEventListener('click', (e) => { if (!e.target.closest('.menu')) closeMenus(); });
    updateAppName();
    tickClock();
    setInterval(tickClock, 10000);
  }
  function tickClock() {
    const now = new Date();
    const day = now.toLocaleDateString(undefined, { weekday: 'short' });
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    $('#clock').innerHTML = `<span class="day">${day}</span><span class="time">${time}</span>`;
  }
  function updateAppName() {
    const el = $('#app-name');
    if (!el) return;
    const active = WM.active;
    const isTerm = active && active.id === 'terminal';
    el.innerHTML = `${ICONS.get(isTerm ? 'terminal' : 'mac')}<span>${isTerm ? 'Terminal' : 'Finder'}</span>`;
  }
  function updateTitle() {
    const active = WM.active;
    document.title = active ? `${active.opts.title} — ${SITE.name}` : baseTitle;
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SITE.email);
      alert({ text: `${SITE.email} was copied to the Clipboard.` });
    } catch (_) {
      alert({ icon: 'caution', html: `Couldn’t access the Clipboard. The address is <strong>${Markdown.esc(SITE.email)}</strong>.` });
    }
  }
  async function emptyTrash() {
    const n = (SITE.trash || []).length;
    if (!n) return alert({ text: 'The Trash is already empty.' });
    const choice = await alert({ icon: 'caution', text: `The Trash contains ${n} item${n === 1 ? '' : 's'}. Are you sure you want to permanently remove ${n === 1 ? 'it' : 'them'}?`, buttons: ['Cancel', 'OK'] });
    if (choice !== 'OK') return;
    SITE.trash = [];
    const t = WM.get('trash');
    if (t) t.content.innerHTML = '<div class="finder"><div class="finder-status"><span>0 items</span><span>in the Trash</span></div><div class="finder-empty">The Trash is empty.</div></div>';
  }
  function restart() {
    try { sessionStorage.removeItem('booted'); } catch (_) { /* ignore */ }
    window.location.reload();
  }
  async function shutDown() {
    const choice = await alert({ icon: 'caution', text: 'Are you sure you want to shut down your computer now?', buttons: ['Cancel', 'Shut Down'] });
    if (choice !== 'Shut Down') return;
    closeMenus();
    const screen = h('div.shutdown', { role: 'button', tabindex: 0 },
      h('div', 'It’s now safe to close this tab.', h('small', '…or click anywhere to turn the computer back on.')));
    screen.addEventListener('click', restart);
    screen.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') restart(); });
    document.body.append(screen);
    screen.focus();
  }

  // ---- Desktop icons --------------------------------------------------------
  const desktopIcons = () => [
    { id: 'hd', icon: 'hd', label: SITE.diskName, open: () => Apps.openFolder('hd') },
    { id: 'readme', icon: 'readme', label: 'Read Me', open: Apps.openAbout },
    { id: 'services', icon: 'doc', label: 'What I Do', open: Apps.openServices },
    { id: 'apps', icon: 'folder-apps', label: 'Applications', open: () => Apps.openFolder('apps') },
    { id: 'marketing', icon: 'folder-marketing', label: 'Client Work', open: () => Apps.openFolder('marketing') },
    { id: 'blog', icon: 'folder-blog', label: 'Blog', open: () => Apps.openFolder('blog') },
    ...(SITE.resume ? [{ id: 'resume', icon: 'resume', label: 'Résumé', open: Apps.openResume }] : []),
    { id: 'contact', icon: 'mail', label: 'Contact', open: Apps.openContact },
    { id: 'terminal', icon: 'terminal', label: 'Terminal', open: Apps.openTerminal },
    { id: 'trash', icon: 'trash', label: 'Trash', open: Apps.openTrash, corner: true },
  ];
  let iconLayer = null;

  function buildIcons() {
    const desktop = $('#desktop');
    iconLayer = h('div.desktop-icons');
    desktop.append(iconLayer);
    desktopIcons().forEach((def) => {
      const el = Apps.iconEl(def);
      el.dataset.id = def.id;
      makeIconDraggable(el);
      iconLayer.append(el);
    });
    desktop.addEventListener('pointerdown', (e) => {
      if (e.target === desktop || e.target === iconLayer) {
        iconLayer.querySelectorAll('.icon.selected').forEach((i) => i.classList.remove('selected'));
      }
    });
    layoutIcons(false);
    window.addEventListener('resize', () => layoutIcons(false));
  }

  function layoutIcons(reset) {
    if (WM.isMobile()) return;
    if (reset) store.del('iconPos');
    let saved = {};
    try { saved = JSON.parse(store.get('iconPos') || '{}'); } catch (_) { saved = {}; }
    const dw = $('#desktop').clientWidth;
    const dh = $('#desktop').clientHeight;
    const colW = 108;
    const rowH = 84;
    const regular = desktopIcons().filter((d) => !d.corner).length;
    const fit = Math.max(1, Math.floor((dh - 100) / rowH));
    const cols = Math.max(1, Math.ceil(regular / fit));
    const perCol = Math.ceil(regular / cols);
    let n = 0;
    desktopIcons().forEach((def) => {
      const el = iconLayer.querySelector(`.icon[data-id="${def.id}"]`);
      if (!el) return;
      let x;
      let y;
      if (def.corner) { x = dw - colW - 4; y = dh - 96; }
      else {
        const col = Math.floor(n / perCol);
        const row = n % perCol;
        x = dw - colW * (col + 1) - 4;
        y = 12 + row * rowH;
        n++;
      }
      const s = saved[def.id];
      if (s && s.x >= 0 && s.y >= 0 && s.x <= dw - 40 && s.y <= dh - 40) { x = s.x; y = s.y; }
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    });
  }

  function makeIconDraggable(el) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || WM.isMobile()) return;
      const sx = e.clientX;
      const sy = e.clientY;
      const ox = parseFloat(el.style.left) || 0;
      const oy = parseFloat(el.style.top) || 0;
      let moved = false;
      const onMove = (ev) => {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 4) return;
        if (!moved) { moved = true; el.classList.add('dragging'); el.setPointerCapture(e.pointerId); }
        const dw = $('#desktop').clientWidth;
        const dh = $('#desktop').clientHeight;
        el.style.left = `${Math.max(0, Math.min(ox + dx, dw - 60))}px`;
        el.style.top = `${Math.max(0, Math.min(oy + dy, dh - 40))}px`;
      };
      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
        if (!moved) return;
        el.classList.remove('dragging');
        el.dataset.dragged = '1';
        let saved = {};
        try { saved = JSON.parse(store.get('iconPos') || '{}'); } catch (_) { saved = {}; }
        saved[el.dataset.id] = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) };
        store.set('iconPos', JSON.stringify(saved));
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });
  }

  // ---- Boot screen ----------------------------------------------------------
  function boot() {
    return new Promise((resolve) => {
      const el = $('#boot');
      let booted = false;
      try { booted = !!sessionStorage.getItem('booted'); } catch (_) { booted = false; }
      if (booted) { el.remove(); resolve(); return; }
      $('#boot-icon').innerHTML = ICONS.get('mac');
      $('#boot-text').textContent = SITE.bootText || 'Welcome to Macintosh.';
      el.hidden = false;
      const bar = $('#boot-progress');
      let progress = 0;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(timer);
        bar.style.width = '100%';
        setTimeout(() => {
          el.remove();
          try { sessionStorage.setItem('booted', '1'); } catch (_) { /* ignore */ }
          resolve();
        }, 220);
      };
      const timer = setInterval(() => {
        progress = Math.min(100, progress + 3 + Math.random() * 9);
        bar.style.width = `${progress}%`;
        if (progress >= 100) finish();
      }, 80);
      el.addEventListener('click', finish);
    });
  }

  // ---- Routing (#/section/item) ---------------------------------------------
  function handleHash() { Apps.openRoute(window.location.hash); }
  function bindRouting() {
    window.addEventListener('hashchange', handleHash);
    document.addEventListener('wm:open', (e) => {
      const r = e.detail.opts.route;
      if (r && window.location.hash !== r) nav(() => window.history.pushState(null, '', r));
    });
    document.addEventListener('wm:focus', (e) => {
      const r = e.detail.opts.route;
      if (r && window.location.hash !== r) nav(() => window.history.replaceState(null, '', r));
      updateTitle();
      updateAppName();
    });
    document.addEventListener('wm:close', () => {
      if (!WM.active) nav(() => window.history.replaceState(null, '', window.location.pathname + window.location.search));
      updateTitle();
      updateAppName();
    });
    // In-page links (#/blog/…) open windows even when the hash is unchanged.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#/"]');
      if (!a) return;
      e.preventDefault();
      Apps.openRoute(a.getAttribute('href'));
    });
  }

  // ---- Keyboard -------------------------------------------------------------
  function bindKeys() {
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (e.key === 'Escape') {
        if (openMenu) { closeMenus(); return; }
        if (typing && !e.target.classList.contains('term-hidden')) return;
        if (WM.active && WM.active.id === 'terminal' && typing) return;
        WM.closeActive();
      } else if (e.key === '`' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        Apps.openTerminal();
      }
    });
  }

  function init() {
    loadPattern();
    buildMenubar();
    buildIcons();
    bindRouting();
    bindKeys();
  }

  return { init, boot, alert, setPattern, layoutIcons, closeMenus, handleHash, restart };
})();
