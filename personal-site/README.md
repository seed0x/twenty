# Vlad OS — a personal site that works like a classic desktop

A personal website and blog styled as a mid-nineties Mac desktop. Folders are the
navigation, windows are the pages, and there's a Terminal for people who'd rather type.

Plain HTML, CSS and JavaScript. **No framework, no build step, no dependencies.**

```
personal-site/
├── index.html          the page (edit <title> and the meta description here)
├── css/
│   ├── system.css      the "OS": menu bar, desktop, icons, windows, dialogs, patterns
│   └── apps.css        what lives inside the windows (documents, Finder, Terminal…)
├── js/
│   ├── content.js      ★ ALL YOUR CONTENT — name, bio, apps, marketing work, post list
│   ├── icons.js        pixel-art SVG icons
│   ├── markdown.js     small Markdown renderer for the blog
│   ├── wm.js           window manager (open, drag, resize, zoom, shade, focus)
│   ├── apps.js         the windows: Read Me, folders, projects, posts, contact, résumé…
│   ├── terminal.js     the Terminal app
│   ├── desktop.js      menu bar, desktop icons, dialogs, boot screen, routing, keys
│   └── main.js         power on
├── posts/              ★ blog posts, one Markdown file each
├── assets/             favicon, fonts (self-hosted), your images / résumé PDF
├── scripts/
│   └── build-single.mjs   optional: bundle everything into one .html file
└── vercel.json         headers for Vercel (optional)
```

## Make it yours

1. **Edit `js/content.js`.** Name, role, tagline, email, links, the About text, skills,
   résumé, the Applications and Marketing entries, and the list of blog posts.
   Text fields accept light Markdown (`**bold**`, `*italic*`, `` `code` ``, `[links](…)`).
2. **Edit `index.html`.** Change the `<title>`, `description` and Open Graph tags.
3. **Add a project screenshot.** Drop a PNG into `assets/` and set `image: 'assets/name.png'`
   on the app. Set `resume.pdf: 'assets/resume.pdf'` to get a Download button on the Résumé.
4. **Pick icons.** Marketing items accept `icon: 'megaphone' | 'chart' | 'mail' | 'star' | 'globe' | 'doc'`
   (or any emoji). Apps get a generated window icon with their first letter and `color`.
   To draw your own, add one to `js/icons.js` — they're 32×32 grids of 1px rectangles.

### Writing a blog post

1. Create `posts/my-post.md`. Optional front matter at the top:

   ```markdown
   ---
   title: My post
   date: 2026-10-01
   ---

   Body in Markdown: headings, lists, links, images, code fences, tables, quotes.
   ```

2. Add it to `posts` in `js/content.js` (title, date, summary, tags). Newest is sorted first.
3. That's it. The post has a shareable URL: `https://your-site/#/blog/my-post`.

## Run it locally

Open the folder with any static server (browsers block `fetch` of the post files over `file://`):

```bash
npx serve .              # or: python3 -m http.server 8000
```

Then visit the printed URL. Or bundle into a single file that works from disk:

```bash
node scripts/build-single.mjs   # → dist/index.html
```

## Deploy

It's static files, so anything works. The site lives in a subfolder here, so either move
`personal-site/` into its own repository or point the host at the subfolder.

**Vercel (recommended)**
1. Push to GitHub. In Vercel, *Add New… → Project*, import the repo.
2. Framework Preset: **Other**. If the site is in a subfolder, set **Root Directory** to `personal-site`.
3. Leave Build Command and Output Directory empty. Deploy.
   `vercel.json` adds clean URLs and a few security headers. Or from a terminal: `npx vercel` inside this folder.

**GitHub Pages** — Settings → Pages → *Deploy from a branch*, choose the branch and folder.
Rename the folder to `docs/` (or move the files to the repo root) if you deploy this repo as-is.

**Cloudflare Pages / Netlify** — connect the repo, no build command, publish directory = this folder.

## Using it

- Double-click (or tap) icons and folders. Drag windows by the title bar; they move as a dotted
  outline, like the real thing. Resize from the bottom-right corner, zoom with the box on the
  right of the title bar, collapse a window with a double-click on its title.
- **View ▸ by Name** switches folders to a list. **Special ▸ Desktop Patterns…** changes the wallpaper.
- Press <kbd>Esc</kbd> to close the front window and <kbd>`</kbd> to open the Terminal.
- Terminal: `help`, `about`, `ls`, `cd apps`, `cat ledgerly`, `open blog`, `pattern midnight`, `cowsay hi`.
  <kbd>Tab</kbd> completes, <kbd>↑</kbd>/<kbd>↓</kbd> browse history.
- Every window has a URL you can share: `#/about`, `#/apps/ledgerly`, `#/marketing`, `#/blog/hello-world`,
  `#/contact`, `#/resume`, `#/terminal`.
- On phones, windows open full-screen and icons flow in a grid.

## Notes

- The sample content (projects, campaigns, résumé, posts) is placeholder text written to show
  the layout — replace it with your own.
- Fonts: [DotGothic16](https://fonts.google.com/specimen/DotGothic16) and
  [VT323](https://fonts.google.com/specimen/VT323), both SIL Open Font License, self-hosted in `assets/fonts/`.
- Not affiliated with Apple. The logo in the menu bar is a generic striped square on purpose.
