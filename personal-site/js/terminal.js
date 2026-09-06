/* ==========================================================================
   terminal.js — a little shell over the same content the desktop shows.
   Virtual filesystem: ~/README.txt, resume.txt, contact.txt, apps/, marketing/, blog/
   Commands: help ls cd pwd cat open about apps marketing blog contact resume
             pattern whoami date echo clear history exit … and a few easter eggs.
   ========================================================================== */

const Terminal = (() => {
  const HOST = 'macintosh';
  let root = null;
  let out = null;
  let promptEl = null;
  let typedEl = null;
  let cursorEl = null;
  let afterEl = null;
  let input = null;
  let cwd = [];
  let fs = null;
  const history = [];
  let histIdx = -1;
  let draft = '';

  // ---- plain-text helpers ---------------------------------------------------
  const plain = (s) => String(s || '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|\W)[*_]([^*_\n]+)[*_](?=\W|$)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1');
  const wrap = (text, width = 72) => String(text).split('\n').map((line) => {
    const words = line.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > width && cur) { lines.push(cur); cur = w; } else cur = (cur ? cur + ' ' : '') + w;
    }
    lines.push(cur);
    return lines.join('\n');
  }).join('\n');
  const list = (items) => items.map((t) => `  • ${plain(t)}`).join('\n');

  const aboutText = () => [
    `${SITE.name} — ${SITE.role}`,
    ''.padEnd(40, '='),
    plain(SITE.tagline), '',
    ...SITE.about.intro.map((p) => wrap(plain(p)) + '\n'),
    `Toolbox: ${(SITE.about.toolbox || []).join(', ')}`,
  ].join('\n');
  const resumeText = () => {
    const r = SITE.resume || {};
    const exp = (r.experience || []).map((e) => `${e.role} · ${e.company} (${e.period})\n${list(e.bullets || [])}`).join('\n\n');
    const edu = (r.education || []).map((e) => `${e.degree} — ${e.school} (${e.period})`).join('\n');
    return `${SITE.name} — ${SITE.role}\n${''.padEnd(40, '=')}\n${wrap(plain(r.summary || ''))}\n\nEXPERIENCE\n${exp}\n\nEDUCATION\n${edu}`;
  };
  const contactText = () => [SITE.email ? `Email: ${SITE.email}` : null, ...SITE.links.map((l) => `${l.label}: ${l.url}`)].filter(Boolean).join('\n');
  const servicesText = () => {
    const sv = SITE.services || {};
    return [`SERVICES\n${''.padEnd(40, '=')}`, wrap(plain(sv.lead || '')), '', ...(sv.items || []).map((it) => `${it.name}\n${wrap(plain(it.text))}\n`), sv.how && sv.how.length ? `How I work:\n${list(sv.how)}` : ''].filter((l) => l !== '').join('\n');
  };
  const projectText = (a) => [
    `${a.name} — ${plain(a.tagline)}`, ''.padEnd(40, '='),
    [a.year && `Year: ${a.year}`, a.role && `Role: ${a.role}`].filter(Boolean).join('   '), '',
    ...(a.description || []).map((p) => wrap(plain(p)) + '\n'),
    a.highlights && a.highlights.length ? `Highlights:\n${list(a.highlights)}\n` : '',
    a.stack && a.stack.length ? `Built with: ${a.stack.join(', ')}` : '',
    ...(a.links || []).map((l) => `${l.label}: ${l.url}`),
  ].filter((l) => l !== '').join('\n');
  const campaignText = (m) => [
    `${m.name}`, ''.padEnd(40, '='),
    [m.client, m.type, m.year].filter(Boolean).join(' · '), '',
    ...(m.description || []).map((p) => wrap(plain(p)) + '\n'),
    m.results && m.results.length ? `Results:\n${m.results.map((r) => `  ${r.value.padEnd(8)} ${r.label}`).join('\n')}\n` : '',
    m.highlights && m.highlights.length ? `What I did:\n${list(m.highlights)}` : '',
  ].filter((l) => l !== '').join('\n');

  // ---- virtual filesystem ---------------------------------------------------
  const dir = (children, open) => ({ type: 'dir', children, open });
  const file = (text, open) => ({ type: 'file', text, open });
  function buildFS() {
    const entries = (arr, ext, text, open) => Object.fromEntries(arr.map((x) => [`${x.id || x.slug}${ext}`, file(() => text(x), () => open(x))]));
    return dir({
      'README.txt': file(aboutText, Apps.openAbout),
      ...(SITE.resume ? { 'resume.txt': file(resumeText, Apps.openResume) } : {}),
      'contact.txt': file(contactText, Apps.openContact),
      'services.txt': file(servicesText, Apps.openServices),
      apps: dir(entries(SITE.apps, '.txt', projectText, (a) => Apps.openProject(a.id)), () => Apps.openFolder('apps')),
      clients: dir(entries(SITE.marketing, '.txt', campaignText, (m) => Apps.openCampaign(m.id)), () => Apps.openFolder('marketing')),
      blog: dir(entries(Apps.sortedPosts(), '.md', async (p) => {
        const post = await Apps.loadPost(p.slug);
        return `${p.title}\n${''.padEnd(40, '=')}\n${Apps.fmtDate(p.date)}\n\n${post.body.trim()}`;
      }, (p) => Apps.openPost(p.slug)), () => Apps.openFolder('blog')),
    }, () => Apps.openFolder('hd'));
  }

  function resolve(pathStr) {
    let segs;
    if (!pathStr || pathStr === '~') segs = [];
    else if (pathStr.startsWith('~/')) segs = pathStr.slice(2).split('/');
    else if (pathStr.startsWith('/')) segs = pathStr.slice(1).split('/');
    else segs = [...cwd, ...pathStr.split('/')];
    const res = [];
    for (const s of segs) {
      if (!s || s === '.') continue;
      if (s === '..') res.pop(); else res.push(s);
    }
    return res;
  }
  // Forgiving lookup: exact → case-insensitive → without extension
  function childOf(node, name) {
    if (!node || node.type !== 'dir') return null;
    const keys = Object.keys(node.children);
    const exact = keys.find((k) => k === name);
    const ci = exact || keys.find((k) => k.toLowerCase() === name.toLowerCase());
    const noExt = ci || keys.find((k) => k.replace(/\.(txt|md)$/i, '').toLowerCase() === name.toLowerCase());
    return noExt ? { name: noExt, node: node.children[noExt] } : null;
  }
  function find(pathStr) {
    let node = fs;
    const segs = resolve(pathStr);
    const real = [];
    for (const s of segs) {
      const hit = childOf(node, s);
      if (!hit) return null;
      node = hit.node;
      real.push(hit.name);
    }
    return { node, segs: real };
  }
  const pathString = (segs) => (segs.length ? `~/${segs.join('/')}` : '~');

  // ---- output ---------------------------------------------------------------
  function print(text, cls = '') {
    const el = document.createElement('div');
    el.className = `line ${cls}`.trim();
    el.textContent = text;
    out.appendChild(el);
    scroll();
  }
  function printHTML(html, cls = '') {
    const el = document.createElement('div');
    el.className = `line ${cls}`.trim();
    el.innerHTML = html;
    out.appendChild(el);
    scroll();
  }
  function scroll() { const sc = root.closest('.window-content') || root; sc.scrollTop = sc.scrollHeight; }
  const promptText = () => `${SITE.handle}@${HOST} ${pathString(cwd)} $ `;
  const esc = Markdown.esc;
  const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label || url)}</a>`;

  function columns(names) {
    const width = Math.max(40, Math.floor((root.clientWidth - 20) / 9.2));
    const col = Math.max(...names.map((n) => n.length)) + 2;
    const per = Math.max(1, Math.floor(width / col));
    const rows = [];
    for (let i = 0; i < names.length; i += per) rows.push(names.slice(i, i + per).map((n) => n.padEnd(col)).join('').trimEnd());
    return rows.join('\n');
  }

  // ---- commands -------------------------------------------------------------
  const commands = {
    help: {
      desc: 'Show this list',
      run: () => {
        const rows = Object.entries(commands).filter(([, c]) => !c.hidden).map(([n, c]) => `  ${n.padEnd(12)} ${c.desc}`);
        return `Commands:\n${rows.join('\n')}\n\nTip: Tab completes, ↑/↓ browse history, Esc closes other windows.`;
      },
    },
    ls: {
      desc: 'List folder contents',
      run: (args) => {
        const target = find(args[0] || '.');
        if (!target) return { err: `ls: ${args[0]}: No such file or directory` };
        if (target.node.type !== 'dir') return args[0];
        const names = Object.entries(target.node.children).map(([n, node]) => (node.type === 'dir' ? `${n}/` : n));
        return names.length ? columns(names) : '';
      },
    },
    cd: {
      desc: 'Change folder',
      run: (args) => {
        const target = find(args[0] || '~');
        if (!target) return { err: `cd: ${args[0]}: No such file or directory` };
        if (target.node.type !== 'dir') return { err: `cd: ${args[0]}: Not a directory` };
        cwd = target.segs;
        return '';
      },
    },
    pwd: { desc: 'Print current folder', run: () => pathString(cwd) },
    cat: {
      desc: 'Print a file',
      run: async (args) => {
        if (!args[0]) return { err: 'cat: missing file name' };
        const target = find(args[0]);
        if (!target) return { err: `cat: ${args[0]}: No such file or directory` };
        if (target.node.type === 'dir') return { err: `cat: ${args[0]}: Is a directory` };
        return await target.node.text();
      },
    },
    open: {
      desc: 'Open a file or folder as a window',
      run: (args) => {
        const target = find(args[0] || '.');
        if (!target) return { err: `open: ${args[0]}: No such file or directory` };
        if (typeof target.node.open === 'function') { target.node.open(); return `Opening ${pathString(target.segs)}…`; }
        return { err: `open: ${args[0]}: nothing to open` };
      },
    },
    about: {
      desc: 'Who is this?',
      run: () => {
        const art = [
          '   .--------.  ',
          '   | o    o |  ',
          '   |   ..   |  ',
          '   |  \\__/  |  ',
          '   |________|  ',
          '   |  ====  |  ',
          '   `--------\'  ',
        ];
        const facts = [
          `${SITE.handle}@${HOST}`,
          ''.padEnd(24, '-'),
          `OS:       ${SITE.systemName} ${SITE.systemVersion}`,
          `Name:     ${SITE.name}`,
          `Role:     ${SITE.role}`,
          SITE.location ? `Location: ${SITE.location}` : null,
          `Stack:    ${(SITE.about.toolbox || []).slice(0, 4).join(', ')}`,
        ].filter(Boolean);
        const lines = [];
        for (let i = 0; i < Math.max(art.length, facts.length); i++) lines.push(`${(art[i] || '').padEnd(16)}${facts[i] || ''}`);
        return `${lines.join('\n')}\n\n${wrap(plain(SITE.tagline))}\nType 'cat README.txt' for the long version.`;
      },
    },
    apps: {
      desc: 'List applications',
      run: () => `${SITE.apps.map((a) => `  ${a.id.padEnd(14)} ${a.name} — ${plain(a.tagline)}`).join('\n')}\n\nopen apps/<id> to see one.`,
    },
    clients: {
      desc: 'List client work',
      run: () => `${SITE.marketing.map((m) => `  ${m.id.padEnd(22)} ${m.name} — ${m.type || ''}`).join('\n')}\n\nopen clients/<id> to see one.`,
    },
    services: { desc: 'What I do', run: servicesText },
    marketing: { desc: '', hidden: true, run: () => commands.clients.run() },
    blog: {
      desc: 'List blog posts',
      run: () => `${Apps.sortedPosts().map((p) => `  ${p.date}  ${p.title}\n${''.padEnd(14)}${p.slug}.md`).join('\n')}\n\ncat blog/<slug>.md to read here, open blog/<slug>.md for a window.`,
    },
    contact: {
      desc: 'How to reach me',
      run: () => ({ html: [SITE.email ? `Email:    ${link(`mailto:${SITE.email}`, SITE.email)}` : null, ...SITE.links.map((l) => `${(l.label + ':').padEnd(9)} ${link(l.url)}`), '', Markdown.esc(SITE.contactNote || '')].filter((l) => l !== null).join('\n') }),
    },
    resume: { desc: 'Print the résumé', run: () => (SITE.resume ? resumeText() : 'No résumé on this disk yet. Try about or contact.') },
    pattern: {
      desc: 'Change the desktop pattern',
      run: (args) => {
        const names = Apps.PATTERNS.map(([k]) => k);
        if (!args[0]) return `Current: ${document.body.dataset.pattern}\nAvailable: ${names.join(', ')}`;
        if (!names.includes(args[0])) return { err: `pattern: unknown pattern '${args[0]}'. Try: ${names.join(', ')}` };
        Desktop.setPattern(args[0]);
        return `Desktop pattern set to ${args[0]}.`;
      },
    },
    whoami: { desc: 'Print user name', run: () => SITE.handle },
    hostname: { desc: 'Print host name', hidden: true, run: () => HOST },
    uname: { desc: 'System information', hidden: true, run: () => `${SITE.systemName} ${HOST} ${SITE.systemVersion} web/${navigator.platform || 'unknown'}` },
    date: { desc: 'Print the date', run: () => new Date().toString() },
    echo: { desc: 'Print text', run: (args) => args.join(' ') },
    history: { desc: 'Show command history', run: () => history.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`).join('\n') },
    clear: { desc: 'Clear the screen', run: () => { out.innerHTML = ''; return ''; } },
    exit: { desc: 'Close the Terminal', run: () => { setTimeout(() => WM.close('terminal'), 60); return 'logout'; } },
    quit: { desc: '', hidden: true, run: () => commands.exit.run() },
    gui: { desc: '', hidden: true, run: () => 'You are already in it — look behind this window.' },
    sudo: { desc: '', hidden: true, run: () => 'Nice try. This Mac has no root — only a happy face.' },
    rm: { desc: '', hidden: true, run: () => 'The Trash is in the bottom-right corner. Drag things there instead.' },
    vim: { desc: '', hidden: true, run: () => 'Opened vim. There is no way to exit vim on this system. (Type clear.)' },
    vi: { desc: '', hidden: true, run: () => commands.vim.run() },
    emacs: { desc: '', hidden: true, run: () => 'Emacs is a fine operating system. This one has a Terminal though.' },
    nano: { desc: '', hidden: true, run: () => 'nano: this filesystem is read-only. Edit js/content.js instead.' },
    hello: { desc: '', hidden: true, run: () => `Hello! I’m ${SITE.name}. Type 'about' to learn more or 'contact' to say hi back.` },
    hi: { desc: '', hidden: true, run: () => commands.hello.run() },
    man: { desc: '', hidden: true, run: (args) => (args[0] && commands[args[0]] ? `${args[0]} — ${commands[args[0]].desc || 'no manual entry'}` : 'What manual page do you want?\nTry: help') },
    which: { desc: '', hidden: true, run: (args) => (args[0] && commands[args[0]] ? `/bin/${args[0]}` : `${args[0] || ''} not found`) },
    neofetch: { desc: '', hidden: true, run: () => commands.about.run() },
    cowsay: { desc: '', hidden: true, run: (args) => { const t = args.join(' ') || 'moo'; const bar = ''.padEnd(t.length + 2, '-'); return ` ${bar}\n< ${t} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`; } },
  };

  // ---- run a line -----------------------------------------------------------
  async function run(line) {
    const trimmed = line.trim();
    print(promptText() + line, 'cmd');
    if (!trimmed) return;
    history.push(trimmed);
    histIdx = history.length;
    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (!cmd) { print(`${name}: command not found. Type 'help' for a list.`, 'err'); return; }
    try {
      const res = await cmd.run(args, trimmed);
      if (res == null || res === '') return;
      if (typeof res === 'string') print(res);
      else if (res.err) print(res.err, 'err');
      else if (res.html) printHTML(res.html);
    } catch (e) {
      print(`${name}: ${e.message}`, 'err');
    }
  }

  // ---- tab completion ---------------------------------------------------------
  function complete() {
    const val = input.value;
    const caret = input.selectionStart;
    const before = val.slice(0, caret);
    const parts = before.split(/\s+/);
    const partial = parts[parts.length - 1];
    let candidates = [];
    let replaceFrom = before.length - partial.length;
    if (parts.length === 1) {
      candidates = Object.keys(commands).filter((c) => !commands[c].hidden && c.startsWith(partial)).map((c) => `${c} `);
    } else {
      const slash = partial.lastIndexOf('/');
      const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : '';
      const namePart = partial.slice(slash + 1);
      const target = find(dirPart || '.');
      if (!target || target.node.type !== 'dir') return;
      candidates = Object.entries(target.node.children)
        .filter(([n]) => n.toLowerCase().startsWith(namePart.toLowerCase()))
        .map(([n, node]) => dirPart + n + (node.type === 'dir' ? '/' : ' '));
    }
    if (!candidates.length) return;
    let insert;
    if (candidates.length === 1) insert = candidates[0];
    else {
      print(promptText() + val, 'cmd');
      print(columns(candidates.map((c) => c.trim())));
      let prefix = candidates[0];
      for (const c of candidates) while (!c.startsWith(prefix)) prefix = prefix.slice(0, -1);
      insert = prefix;
    }
    input.value = val.slice(0, replaceFrom) + insert + val.slice(caret);
    const pos = replaceFrom + insert.length;
    input.setSelectionRange(pos, pos);
    render();
  }

  // ---- input line rendering -------------------------------------------------
  function render() {
    const v = input.value;
    const s = input.selectionStart ?? v.length;
    typedEl.textContent = v.slice(0, s);
    cursorEl.textContent = v[s] || ' ';
    afterEl.textContent = v.slice(s + 1);
    promptEl.textContent = promptText();
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const line = input.value;
      input.value = '';
      render();
      run(line).then(render);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      if (histIdx === history.length) draft = input.value;
      histIdx = Math.max(0, histIdx - 1);
      input.value = history[histIdx];
      input.setSelectionRange(input.value.length, input.value.length);
      render();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx >= history.length) return;
      histIdx = Math.min(history.length, histIdx + 1);
      input.value = histIdx === history.length ? draft : history[histIdx];
      input.setSelectionRange(input.value.length, input.value.length);
      render();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      print(promptText() + input.value + '^C', 'cmd');
      input.value = '';
      render();
    } else if (e.key === 'u' && e.ctrlKey) {
      e.preventDefault();
      input.value = input.value.slice(input.selectionStart);
      input.setSelectionRange(0, 0);
      render();
    }
  }

  function mount(container) {
    root = document.createElement('div');
    root.className = 'terminal unfocused';
    root.innerHTML =
      '<div class="term-out"></div>' +
      '<div class="term-input-line"><span class="prompt"></span><span class="typed"></span><span class="cursor"> </span><span class="after"></span></div>' +
      '<input class="term-hidden" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Terminal input">';
    container.appendChild(root);
    out = root.querySelector('.term-out');
    promptEl = root.querySelector('.prompt');
    typedEl = root.querySelector('.typed');
    cursorEl = root.querySelector('.cursor');
    afterEl = root.querySelector('.after');
    input = root.querySelector('.term-hidden');
    fs = buildFS();
    cwd = [];

    input.addEventListener('keydown', onKey);
    ['input', 'keyup', 'click', 'select'].forEach((ev) => input.addEventListener(ev, render));
    input.addEventListener('focus', () => root.classList.remove('unfocused'));
    input.addEventListener('blur', () => root.classList.add('unfocused'));
    container.addEventListener('mouseup', () => {
      if (String(window.getSelection && window.getSelection()).length) return;
      focus();
    });

    print(`${SITE.systemName} ${SITE.systemVersion} — Terminal`, 'accent');
    print(`Type 'help' to see what you can do, or try 'about', 'services', 'ls' and 'open clients'.`, 'dim');
    print('');
    render();
  }

  function focus() {
    if (input) input.focus({ preventScroll: true });
  }

  document.addEventListener('wm:focus', (e) => { if (e.detail && e.detail.id === 'terminal') setTimeout(focus, 0); });
  document.addEventListener('wm:close', (e) => { if (e.detail && e.detail.id === 'terminal') { root = out = input = null; } });

  return { mount, focus, run: (line) => run(line) };
})();
