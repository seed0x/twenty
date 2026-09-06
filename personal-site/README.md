# vladkolesnik.com

Personal site and blog of Vlad Kolesnik, styled as a classic Mac OS desktop.
Folders are the navigation, windows are the pages, and there's a Terminal for typing.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

```
index.html          the page (title and meta description live here)
css/system.css      the desktop: menu bar, icons, windows, dialogs, patterns
css/apps.css        what's inside the windows
js/content.js       ★ all the content: name, bio, services, applications, client work, post list
js/icons.js         pixel-art SVG icons
js/markdown.js      Markdown renderer for the blog
js/wm.js            window manager
js/apps.js          the windows (Read Me, folders, projects, posts, contact…)
js/terminal.js      the Terminal
js/desktop.js       menu bar, desktop icons, dialogs, boot screen, routing
js/main.js          power on
posts/              ★ blog posts, one Markdown file each
assets/             favicon, images
scripts/            optional: bundle everything into a single .html file
vercel.json         headers and clean URLs for Vercel
```

## Editing

- **Text and projects:** `js/content.js`. Fields accept light Markdown (`**bold**`, `[link](url)`).
- **Email:** set `email` in `js/content.js` to enable the Contact form.
- **A post:** add `posts/<slug>.md` and list it under `posts` in `js/content.js`.
- **A screenshot:** drop a PNG in `assets/` and set `image: 'assets/name.png'` on the project.
- **Résumé:** fill in `resume` in `js/content.js` and a Résumé document appears on the desktop.

## Run locally

```bash
npx serve .
```

(Opening `index.html` straight from disk works for everything except loading posts.)

## Deploy on Vercel

1. vercel.com → **Add New… → Project** → import `seed0x/vladkolesnik`.
2. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
3. **Deploy.** Every push to `main` redeploys.

## Using the site

- Double-click (or tap) icons. Drag windows by the title bar, resize from the corner, zoom with the box on the right, collapse with a double-click on the title.
- **View ▸ by Name** lists folder contents. **Special ▸ Desktop Patterns…** changes the wallpaper.
- <kbd>Esc</kbd> closes the front window, <kbd>`</kbd> opens the Terminal.
- Every window has a shareable URL: `#/about`, `#/services`, `#/apps/life-tracker`, `#/marketing`, `#/blog/hello`, `#/contact`.
- Client engagements are anonymized by default; fill in `client` and `links` in `js/content.js` to name them.

Not affiliated with Apple.
