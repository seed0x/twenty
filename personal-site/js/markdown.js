/* ==========================================================================
   markdown.js — a small Markdown renderer, enough for a blog:
   headings, paragraphs, lists, blockquotes, fenced code, inline code,
   bold/italic/strike, links, images, pipe tables, horizontal rules,
   and an optional front matter block (--- key: value ---).
   ========================================================================== */

const Markdown = (() => {
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const safeUrl = (u) => (/^\s*(javascript|data|vbscript):/i.test(u) ? '#' : u);

  // Code spans are swapped for a placeholder so the other rules leave them alone.
  const PH = String.fromCharCode(0);
  const PH_RE = new RegExp(`${PH}(\\d+)${PH}`, 'g');

  function inline(text) {
    let s = esc(text);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `${PH}${codes.length - 1}${PH}`; });
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, t, u) => {
      const url = safeUrl(u);
      const ext = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${url}"${ext}>${t}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/ {2,}\n/g, '<br>\n');
    s = s.replace(PH_RE, (_, i) => `<code>${codes[+i]}</code>`);
    return s;
  }

  const isBlockStart = (l) =>
    /^(#{1,6}\s|```|>|\s*[-*+]\s+|\s*\d+[.)]\s+|\s*\|)/.test(l) || /^(-{3,}|\*{3,}|_{3,})\s*$/.test(l);

  function render(md) {
    const lines = String(md).replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      let m;
      if (/^\s*$/.test(line)) { i++; continue; }

      if ((m = line.match(/^```\s*(\w+)?\s*$/))) {
        const buf = []; i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push(`<pre><code${m[1] ? ` class="lang-${m[1]}"` : ''}>${esc(buf.join('\n'))}</code></pre>`);
        continue;
      }
      if ((m = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/))) {
        const l = m[1].length;
        out.push(`<h${l}>${inline(m[2])}</h${l}>`); i++; continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      if (/^>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
        out.push(`<blockquote>${render(buf.join('\n'))}</blockquote>`); continue;
      }
      if (/^\s*[-*+]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          let item = lines[i++].replace(/^\s*[-*+]\s+/, '');
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*+]\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
          items.push(item);
        }
        out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`); continue;
      }
      if (/^\s*\d+[.)]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          let item = lines[i++].replace(/^\s*\d+[.)]\s+/, '');
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
          items.push(item);
        }
        out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`); continue;
      }
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        const head = cells(line); i += 2;
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
        out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>` +
          rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') + '</tbody></table>');
        continue;
      }
      const buf = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && (buf.length === 0 || !isBlockStart(lines[i]))) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join('\n'))}</p>`);
    }
    return out.join('\n');
  }

  /** Splits optional front matter from the body and renders the rest. */
  function parse(md) {
    let body = String(md).replace(/\r\n?/g, '\n');
    const meta = {};
    const m = body.match(/^---\n([\s\S]*?)\n---\n?/);
    if (m) {
      m[1].split('\n').forEach((l) => {
        const k = l.indexOf(':');
        if (k > 0) meta[l.slice(0, k).trim()] = l.slice(k + 1).trim().replace(/^["']|["']$/g, '');
      });
      body = body.slice(m[0].length);
    }
    return { meta, body, html: render(body) };
  }

  return { render, parse, inline, esc };
})();
