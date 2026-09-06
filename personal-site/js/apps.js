/* ==========================================================================
   apps.js — everything that opens in a window.
   Read Me (about), Finder folders (HD / Applications / Marketing / Blog),
   project & campaign documents, blog posts, Contact, Résumé, About This
   Mac, Desktop Patterns, Trash, Help — plus the #/route table.
   ========================================================================== */

const Apps = (() => {
  const esc = Markdown.esc;
  const md = (s) => Markdown.inline(s || '');
  const coarse = () => window.matchMedia('(pointer: coarse)').matches;

  // ---- tiny DOM helper: h('div.foo', {attrs}, ...children) ----------------
  function h(tag, props, ...children) {
    const [name, ...classes] = tag.split('.');
    const el = document.createElement(name || 'div');
    if (classes.length) el.className = classes.join(' ');
    if (props && typeof props === 'object' && !(props instanceof Node) && !Array.isArray(props)) {
      for (const [k, v] of Object.entries(props)) {
        if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k === 'style') Object.assign(el.style, v);
        else if (v != null && v !== false) el.setAttribute(k, v === true ? '' : v);
      }
    } else if (props != null) children.unshift(props);
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : String(c));
    }
    return el;
  }

  const fmtDate = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const sortedPosts = () => [...SITE.posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const paragraphs = (arr) => (arr || []).map((t) => `<p>${md(t)}</p>`).join('');
  const linkButtons = (links) => (links || []).map((l) => {
    const ext = /^https?:/i.test(l.url);
    return `<a class="btn" href="${esc(l.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`;
  }).join('');
  const openHint = () => (coarse() ? 'tap to open' : 'double-click to open');

  // ---- Icons (desktop + Finder) -------------------------------------------
  function selectIcon(el) {
    const scope = el.parentElement || document;
    scope.querySelectorAll('.icon.selected').forEach((o) => o !== el && o.classList.remove('selected'));
    el.classList.add('selected');
  }

  /**
   * iconEl({ icon, label, open }) → a focusable .icon element.
   * Click selects, double-click (or a single tap on touch screens) opens.
   */
  function iconEl({ icon, label, open, id, iconArgs = [] }) {
    const el = h('div.icon', { tabindex: 0, role: 'button', 'aria-label': label, dataset: { id: id || '' } },
      h('span.icon-img', { html: ICONS.get(icon, ...iconArgs) }),
      h('span.icon-label', { text: label }));
    el.addEventListener('click', () => {
      if (el.dataset.dragged) { delete el.dataset.dragged; return; }
      selectIcon(el);
      if (coarse()) open();
    });
    el.addEventListener('dblclick', () => { if (!coarse()) open(); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectIcon(el); open(); }
    });
    return el;
  }

  // ---- Finder folders -----------------------------------------------------
  let finderView = 'icon';
  try { finderView = localStorage.getItem('finderView') || 'icon'; } catch (_) { /* private mode */ }

  const FOLDERS = {
    hd: {
      title: () => SITE.diskName,
      route: '#/hd', width: 560, height: 360,
      items: () => [
        { icon: 'folder-apps', label: 'Applications', kind: 'Folder', open: () => openFolder('apps') },
        { icon: 'folder-marketing', label: 'Marketing', kind: 'Folder', open: () => openFolder('marketing') },
        { icon: 'folder-blog', label: 'Blog', kind: 'Folder', open: () => openFolder('blog') },
        { icon: 'readme', label: 'Read Me', kind: 'Document', open: openAbout },
        ...(SITE.resume ? [{ icon: 'resume', label: 'Résumé', kind: 'Document', open: openResume }] : []),
        { icon: 'mail', label: 'Contact', kind: 'Document', open: openContact },
        { icon: 'terminal', label: 'Terminal', kind: 'Application', open: openTerminal },
      ],
    },
    apps: {
      title: () => 'Applications',
      route: '#/apps', width: 560, height: 360,
      items: () => [
        ...SITE.apps.map((a) => ({
          icon: a.icon || 'app', iconArgs: a.icon ? [] : [a.name, a.color], label: a.name, kind: 'Application',
          date: a.year, open: () => openProject(a.id),
        })),
        { icon: 'terminal', label: 'Terminal', kind: 'Application', open: openTerminal },
      ],
    },
    marketing: {
      title: () => 'Marketing',
      route: '#/marketing', width: 560, height: 360,
      items: () => SITE.marketing.map((m) => ({
        icon: m.icon || 'doc', label: m.name, kind: m.type || 'Document', date: m.year, open: () => openCampaign(m.id),
      })),
    },
    blog: {
      title: () => 'Blog',
      route: '#/blog', width: 600, height: 380,
      items: () => sortedPosts().map((p) => ({
        icon: 'post', label: p.title, kind: 'Post', date: fmtDate(p.date), open: () => openPost(p.slug),
      })),
    },
  };

  function openFolder(kind) {
    const def = FOLDERS[kind];
    if (!def) return null;
    return WM.open({
      id: `folder-${kind}`, title: def.title(), route: def.route,
      width: def.width, height: def.height, className: 'finder-window',
      content: (el) => renderFolder(el, kind),
    });
  }

  function renderFolder(el, kind) {
    const def = FOLDERS[kind];
    const items = def.items();
    el.innerHTML = '';
    const wrap = h('div.finder');
    wrap.append(h('div.finder-status',
      h('span', `${items.length} item${items.length === 1 ? '' : 's'}`),
      h('span', openHint())));
    if (!items.length) {
      wrap.append(h('div.finder-empty', 'Nothing here yet.'));
    } else if (finderView === 'list') {
      const rows = items.map((it) => {
        const tr = h('tr', { tabindex: 0 },
          h('td.name', h('span.mini', { html: ICONS.get(it.icon, ...(it.iconArgs || [])) }), it.label),
          h('td.dim', it.kind),
          h('td.dim', it.date || '—'));
        tr.addEventListener('click', () => {
          tr.parentElement.querySelectorAll('tr.selected').forEach((o) => o.classList.remove('selected'));
          tr.classList.add('selected');
          if (coarse()) it.open();
        });
        tr.addEventListener('dblclick', () => it.open());
        tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') it.open(); });
        return tr;
      });
      wrap.append(h('table.finder-list',
        h('thead', h('tr', h('th', 'Name'), h('th', 'Kind'), h('th', 'Date'))),
        h('tbody', rows)));
    } else {
      wrap.append(h('div.finder-grid', items.map((it) => iconEl(it))));
    }
    el.append(wrap);
  }

  function setFinderView(view) {
    finderView = view;
    try { localStorage.setItem('finderView', view); } catch (_) { /* ignore */ }
    for (const w of WM.list()) {
      if (w.id.startsWith('folder-')) renderFolder(w.content, w.id.slice(7));
      if (w.id === 'trash') renderTrash(w.content);
    }
  }

  // ---- Read Me (About) ----------------------------------------------------
  function openAbout() {
    return WM.open({
      id: 'about', title: 'Read Me', route: '#/about', width: 600, height: 500,
      content: `
        <div class="doc">
          <div class="hero">
            <div class="hero-icon">${ICONS.get('mac')}</div>
            <div>
              <h1>${esc(SITE.name)}</h1>
              <div class="sub">${esc(SITE.role)}${SITE.location ? ` · ${esc(SITE.location)}` : ''}</div>
            </div>
          </div>
          <p><strong>${md(SITE.tagline)}</strong></p>
          ${paragraphs(SITE.about.intro)}
          <h2>Toolbox</h2>
          <div class="tags">${(SITE.about.toolbox || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          ${SITE.about.now && SITE.about.now.length ? `<h2>Now</h2><ul>${SITE.about.now.map((t) => `<li>${md(t)}</li>`).join('')}</ul>` : ''}
          <div class="actions">
            <a class="btn" href="#/apps">Applications</a>
            <a class="btn" href="#/marketing">Marketing</a>
            <a class="btn" href="#/blog">Blog</a>
            <a class="btn" href="#/contact">Contact</a>
          </div>
        </div>`,
    });
  }

  // ---- About This Macintosh -----------------------------------------------
  function openAboutMac() {
    const tools = SITE.about.toolbox || [];
    return WM.open({
      id: 'about-mac', title: 'About This Macintosh', width: 480, height: 330, resizable: false,
      content: `
        <div class="about-mac">
          <div class="head">
            <div class="mac">${ICONS.get('mac')}</div>
            <div>
              <h1>${esc(SITE.name)}</h1>
              <div class="sub">${esc(SITE.role)}</div>
            </div>
          </div>
          <dl class="facts">
            <dt>System Software</dt><dd>${esc(SITE.systemName)} ${esc(SITE.systemVersion)} — a personal website</dd>
            <dt>Built-in Memory</dt><dd>${esc(tools.slice(0, 6).join(', '))}${tools.length > 6 ? '…' : ''}</dd>
            ${SITE.location ? `<dt>Location</dt><dd>${esc(SITE.location)}</dd>` : ''}
            <dt>Email</dt><dd><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd>
            ${SITE.links.map((l) => `<dt>${esc(l.label)}</dt><dd><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url.replace(/^https?:\/\/(www\.)?/, ''))}</a></dd>`).join('')}
          </dl>
          <div class="legal">© ${new Date().getFullYear()} ${esc(SITE.name)}. A homage to classic Mac OS; not affiliated with Apple.</div>
        </div>`,
    });
  }

  // ---- Applications: project document -------------------------------------
  function openProject(id) {
    const a = SITE.apps.find((x) => x.id === id);
    if (!a) return Desktop.alert({ icon: 'caution', text: `The application "${id}" could not be found.` });
    const shot = a.image
      ? `<div class="screenshot"><img src="${esc(a.image)}" alt="${esc(a.name)} screenshot"></div>`
      : `<div class="screenshot"><div class="placeholder"><span>${esc(a.name)} — screenshot coming soon</span></div></div>`;
    return WM.open({
      id: `app-${id}`, title: a.name, route: `#/apps/${id}`, width: 620, height: 520,
      content: `
        <div class="doc">
          <div class="hero">
            <div class="hero-icon">${ICONS.get(a.icon || 'app', a.name, a.color)}</div>
            <div>
              <h1>${esc(a.name)}</h1>
              <div class="sub">${md(a.tagline)}</div>
            </div>
          </div>
          <div class="meta">
            ${a.year ? `<span><b>Year</b> ${esc(a.year)}</span>` : ''}
            ${a.role ? `<span><b>Role</b> ${esc(a.role)}</span>` : ''}
          </div>
          ${paragraphs(a.description)}
          ${a.highlights && a.highlights.length ? `<h2>Highlights</h2><ul>${a.highlights.map((t) => `<li>${md(t)}</li>`).join('')}</ul>` : ''}
          ${a.stack && a.stack.length ? `<h2>Built with</h2><div class="tags">${a.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
          ${shot}
          <div class="actions">${linkButtons(a.links)}<a class="btn" href="#/apps">Back to Applications</a></div>
        </div>`,
    });
  }

  // ---- Marketing: campaign document ---------------------------------------
  function openCampaign(id) {
    const m = SITE.marketing.find((x) => x.id === id);
    if (!m) return Desktop.alert({ icon: 'caution', text: `The document "${id}" could not be found.` });
    return WM.open({
      id: `mkt-${id}`, title: m.name, route: `#/marketing/${id}`, width: 620, height: 520,
      content: `
        <div class="doc">
          <div class="hero">
            <div class="hero-icon">${ICONS.get(m.icon || 'doc')}</div>
            <div>
              <h1>${esc(m.name)}</h1>
              <div class="sub">${[m.client, m.type, m.year].filter(Boolean).map(esc).join(' · ')}</div>
            </div>
          </div>
          ${paragraphs(m.description)}
          ${m.results && m.results.length ? `<h2>Results</h2><div class="results">${m.results.map((r) => `<div class="result"><div class="value">${esc(r.value)}</div><div class="label">${esc(r.label)}</div></div>`).join('')}</div>` : ''}
          ${m.highlights && m.highlights.length ? `<h2>What I did</h2><ul>${m.highlights.map((t) => `<li>${md(t)}</li>`).join('')}</ul>` : ''}
          <div class="actions">${linkButtons(m.links)}<a class="btn" href="#/marketing">Back to Marketing</a></div>
        </div>`,
    });
  }

  // ---- Blog ---------------------------------------------------------------
  const postCache = {};
  async function loadPost(slug) {
    if (postCache[slug]) return postCache[slug];
    let text;
    if (window.__POSTS__ && typeof window.__POSTS__[slug] === 'string') {
      text = window.__POSTS__[slug];
    } else {
      const res = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
    }
    postCache[slug] = Markdown.parse(text);
    return postCache[slug];
  }

  function openPost(slug) {
    const meta = SITE.posts.find((p) => p.slug === slug);
    if (!meta) return Desktop.alert({ icon: 'caution', text: `There is no post called "${slug}".` });
    const id = `post-${slug}`;
    const w = WM.open({
      id, title: meta.title, route: `#/blog/${slug}`, width: 660, height: 540,
      content: `<div class="doc"><h1>${esc(meta.title)}</h1><div class="stamp">${esc(fmtDate(meta.date))}</div><p class="muted">Loading…</p></div>`,
    });
    if (w.loaded) return w;
    w.loaded = true;
    loadPost(slug).then((post) => {
      if (!WM.has(id)) return;
      const posts = sortedPosts();
      const idx = posts.findIndex((p) => p.slug === slug);
      const newer = posts[idx - 1];
      const older = posts[idx + 1];
      const tags = (meta.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
      w.content.innerHTML = `
        <article class="doc">
          <h1>${esc(post.meta.title || meta.title)}</h1>
          <div class="stamp">${esc(fmtDate(post.meta.date || meta.date))}${tags ? ` &nbsp; ${tags}` : ''}</div>
          ${post.html}
          <nav class="post-nav">
            <span>${older ? `<a href="#/blog/${esc(older.slug)}">← ${esc(older.title)}</a>` : ''}</span>
            <span>${newer ? `<a href="#/blog/${esc(newer.slug)}">${esc(newer.title)} →</a>` : '<a href="#/blog">All posts</a>'}</span>
          </nav>
        </article>`;
      w.content.scrollTop = 0;
    }).catch((err) => {
      if (!WM.has(id)) return;
      w.content.innerHTML = `
        <div class="doc">
          <h1>${esc(meta.title)}</h1>
          <p>Couldn't load <code>posts/${esc(slug)}.md</code> (${esc(err.message)}).</p>
          <p class="muted small">If you opened <code>index.html</code> straight from disk, browsers block reading the post files.
          Serve the folder instead (for example <code>npx serve</code> or <code>python3 -m http.server</code>),
          or run <code>node scripts/build-single.mjs</code> to bundle everything into one file.</p>
        </div>`;
    });
    return w;
  }

  // ---- Contact ------------------------------------------------------------
  function openContact() {
    return WM.open({
      id: 'contact', title: 'Contact', route: '#/contact', width: 520, height: 520,
      content: (el) => {
        el.innerHTML = `
          <div class="doc">
            <div class="hero">
              <div class="hero-icon">${ICONS.get('mail')}</div>
              <div><h1>Say hello</h1><div class="sub">${esc(SITE.contactNote || 'Work, internships, or just to say hi.')}</div></div>
            </div>
            <div class="contact-list">
              <div class="row"><span class="k">Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></div>
              ${SITE.links.map((l) => `<div class="row"><span class="k">${esc(l.label)}</span><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url.replace(/^https?:\/\/(www\.)?/, ''))}</a></div>`).join('')}
            </div>
            <form class="contact-form">
              <label>Your name <input name="name" autocomplete="name" required></label>
              <label>Message <textarea name="message" required></textarea></label>
              <div class="row">
                <button class="btn default" type="submit">Send</button>
                <span class="hint">Opens your email app with the message filled in.</span>
              </div>
            </form>
          </div>`;
        el.querySelector('form').addEventListener('submit', (e) => {
          e.preventDefault();
          const f = new FormData(e.target);
          const subject = encodeURIComponent(`Hello from ${f.get('name') || 'your website'}`);
          const body = encodeURIComponent(`${f.get('message') || ''}\n\n— ${f.get('name') || ''}`);
          window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
        });
      },
    });
  }

  // ---- Résumé -------------------------------------------------------------
  function openResume() {
    if (!SITE.resume) return Desktop.alert({ text: 'There is no résumé on this disk yet.' });
    const r = SITE.resume;
    return WM.open({
      id: 'resume', title: 'Résumé', route: '#/resume', width: 620, height: 540,
      content: `
        <div class="doc">
          <div class="hero">
            <div class="hero-icon">${ICONS.get('resume')}</div>
            <div><h1>${esc(SITE.name)}</h1><div class="sub">${esc(SITE.role)}</div></div>
          </div>
          ${r.summary ? `<p>${md(r.summary)}</p>` : ''}
          ${r.pdf ? `<div class="actions"><a class="btn default" href="${esc(r.pdf)}" target="_blank" rel="noopener">Download PDF</a></div>` : ''}
          <h2>Experience</h2>
          <div class="timeline">
            ${(r.experience || []).map((e) => `
              <div class="entry">
                <h3>${esc(e.role)} · ${esc(e.company)}</h3>
                <div class="when">${esc(e.period)}</div>
                <ul>${(e.bullets || []).map((b) => `<li>${md(b)}</li>`).join('')}</ul>
              </div>`).join('')}
          </div>
          ${r.education && r.education.length ? `<h2>Education</h2><div class="timeline">${r.education.map((e) => `
            <div class="entry"><h3>${esc(e.degree)}</h3><div class="when">${esc(e.school)} · ${esc(e.period)}</div></div>`).join('')}</div>` : ''}
          <h2>Skills</h2>
          <div class="tags">${(SITE.about.toolbox || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <div class="actions"><a class="btn" href="#/contact">Get in touch</a></div>
        </div>`,
    });
  }

  // ---- Terminal -----------------------------------------------------------
  function openTerminal() {
    const w = WM.open({
      id: 'terminal', title: 'Terminal', route: '#/terminal', width: 660, height: 420, className: 'terminal-window',
      content: (el) => Terminal.mount(el),
    });
    Terminal.focus();
    return w;
  }

  // ---- Desktop Patterns ---------------------------------------------------
  const PATTERNS = [
    ['stipple', 'Stipple'], ['bondi', 'Bondi'], ['teal', 'Teal'], ['sand', 'Sand'],
    ['plum', 'Plum'], ['grey', 'Grey'], ['grid', 'Grid'], ['midnight', 'Midnight'],
  ];
  function openPatterns() {
    return WM.open({
      id: 'patterns', title: 'Desktop Patterns', route: '#/patterns', width: 440, height: 360,
      content: (el) => {
        const grid = h('div.pattern-grid');
        const refresh = () => {
          const current = document.body.dataset.pattern;
          grid.querySelectorAll('.swatch-wrap').forEach((s) => s.classList.toggle('selected', s.dataset.pattern === current));
        };
        PATTERNS.forEach(([key, label]) => {
          const sw = h('div.swatch-wrap', { tabindex: 0, role: 'button', dataset: { pattern: key }, 'aria-label': `${label} pattern` },
            h('div.swatch', { dataset: { pattern: key } }), label);
          const pick = () => { Desktop.setPattern(key); refresh(); };
          sw.addEventListener('click', pick);
          sw.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
          grid.append(sw);
        });
        el.append(h('div.patterns', h('p', 'Pick a desktop pattern. Your choice is remembered on this device.'), grid));
        refresh();
      },
    });
  }

  // ---- Trash --------------------------------------------------------------
  function renderTrash(el) {
    el.innerHTML = '';
    const items = SITE.trash || [];
    const wrap = h('div.finder');
    wrap.append(h('div.finder-status', h('span', `${items.length} item${items.length === 1 ? '' : 's'}`), h('span', 'in the Trash')));
    if (!items.length) wrap.append(h('div.finder-empty', 'The Trash is empty.'));
    else wrap.append(h('div.finder-grid', items.map((it) => iconEl({
      icon: it.icon || 'doc', label: it.name,
      open: () => Desktop.alert({ icon: 'stop', text: `“${it.name}” can’t be opened because it is in the Trash. To use this item, first drag it out of the Trash.` }),
    }))));
    el.append(wrap);
  }
  function openTrash() {
    return WM.open({ id: 'trash', title: 'Trash', route: '#/trash', width: 480, height: 300, className: 'finder-window', content: renderTrash });
  }

  // ---- Help ---------------------------------------------------------------
  function openHelp() {
    return WM.open({
      id: 'help', title: 'About This Site', route: '#/help', width: 560, height: 460,
      content: `
        <div class="doc">
          <h1>How to use this site</h1>
          <p>This is ${esc(SITE.name)}’s personal site, dressed up as a desktop from the mid-nineties. Everything works the way you’d expect:</p>
          <ul>
            <li><strong>Folders</strong> are the navigation. Double-click (or tap) <em>Applications</em>, <em>Marketing</em> and <em>Blog</em>.</li>
            <li><strong>Windows</strong> can be dragged by their title bar, resized from the bottom-right corner, zoomed with the box on the right of the title bar, and collapsed with a double-click on the title.</li>
            <li><strong>Terminal</strong> is for people who’d rather type. Try <code>help</code>, <code>ls</code>, <code>cat README.txt</code> or <code>open blog</code>.</li>
            <li><strong>Menus</strong> at the top do what they say — including <em>Special ▸ Desktop Patterns…</em></li>
          </ul>
          <h2>Keyboard shortcuts</h2>
          <table>
            <tr><th>Esc or ⌘W / Ctrl+W</th><td>Close the front window</td></tr>
            <tr><th>Enter</th><td>Open the selected icon</td></tr>
            <tr><th>Tab</th><td>Move between icons and windows</td></tr>
            <tr><th>⌘T / Ctrl+Alt+T</th><td>Open the Terminal</td></tr>
          </table>
          <h2>Under the hood</h2>
          <p>Plain HTML, CSS and JavaScript — no framework, no build step. The window manager is about 250 lines; the blog is Markdown files rendered in the browser. Links to sections and posts are shareable (<code>#/blog/…</code>).</p>
          ${SITE.sourceUrl ? `<div class="actions"><a class="btn" href="${esc(SITE.sourceUrl)}" target="_blank" rel="noopener">View source</a></div>` : ''}
        </div>`,
    });
  }

  // ---- Routing (#/section/item) --------------------------------------------
  function openRoute(hash) {
    const path = String(hash || '').replace(/^#\/?/, '').replace(/\/+$/, '');
    if (!path) return false;
    const [section, item] = path.split('/').map(decodeURIComponent);
    switch (section) {
      case 'hd': openFolder('hd'); return true;
      case 'about': openAbout(); return true;
      case 'apps': openFolder('apps'); if (item) openProject(item); return true;
      case 'marketing': openFolder('marketing'); if (item) openCampaign(item); return true;
      case 'blog': openFolder('blog'); if (item) openPost(item); return true;
      case 'contact': openContact(); return true;
      case 'resume': openResume(); return true;
      case 'terminal': openTerminal(); return true;
      case 'patterns': openPatterns(); return true;
      case 'trash': openTrash(); return true;
      case 'help': openHelp(); return true;
      case 'about-mac': openAboutMac(); return true;
      default: return false;
    }
  }

  return {
    h, iconEl, selectIcon, fmtDate, sortedPosts, loadPost,
    openFolder, renderFolder, setFinderView, get finderView() { return finderView; },
    openAbout, openAboutMac, openProject, openCampaign, openPost, openContact, openResume,
    openTerminal, openPatterns, openTrash, openHelp, openRoute, PATTERNS,
  };
})();
