---
title: Why my portfolio is a fake operating system
date: 2026-08-18
---

Most portfolio sites are the same page: a hero, three cards, a contact form. They work. They are also completely forgettable, and for someone who claims to build things for a living, that always felt like a missed opportunity.

This site is a desktop from the mid-nineties. Folders are the navigation, windows are the pages, and there's a Terminal for people who'd rather type. Here's how it works and why I made the choices I made.

## Constraints first

I set three rules before writing any code:

1. **No framework, no build step.** It's a personal site. I want to open a file, change some text, and reload. Vanilla HTML, CSS and JavaScript — that's it.
2. **Content lives in one place.** Everything you can read on the desktop comes from a single `content.js` file. Blog posts are Markdown files in a folder. Adding a project is adding an object to an array.
3. **It has to work on a phone.** A desktop metaphor on a five-inch screen is a bad idea unless windows become full-screen sheets and icons flow in a grid. So that's what happens below 640px.

## The window manager

The heart of the thing is about 250 lines. A window is a `<section>` with a title bar, a content area and a grow box in the corner. Opening one means creating that element, cascading its position so it doesn't sit exactly on top of the last one, and bumping a z-index counter when it's focused.

Dragging was the fun part. Classic Mac OS didn't move windows live — the machine couldn't redraw fast enough — so you dragged a dotted outline and the window jumped there when you let go. I kept that, not for performance but because it's charming and because it's *cheaper*: one absolutely-positioned `div` with a dotted border follows the pointer, and the real window only moves once.

```js
const onMove = (ev) => {
  outline.style.left = `${ox + ev.clientX - sx}px`;
  outline.style.top  = `${oy + ev.clientY - sy}px`;
};
const onUp = () => {
  win.style.left = outline.style.left;
  win.style.top  = outline.style.top;
  outline.remove();
};
```

Pointer events with `setPointerCapture` handle mouse, pen and touch in one code path. Double-clicking a title bar "window-shades" it down to just the title, which Mac OS 8 users will remember fondly and everyone else will discover by accident.

## Drawing the look

There are no image files on this site. Every icon is an inline SVG built from 1px rectangles on a 32×32 grid with `shape-rendering: crispEdges`, so they stay pixel-sharp at any size. The 50% dither you see in scrollbar tracks and on the desktop is a two-pixel `repeating-conic-gradient` — a checkerboard in one CSS declaration.

The striped title bar is a `repeating-linear-gradient` behind a title with a white background. The classic look is mostly *restraint*: one-pixel black borders, hard two-pixel shadows, no gradients that aren't dither, and a bitmap-style font.

## The blog

Posts are Markdown files. When you open one, the site fetches the file and renders it with a small Markdown parser I wrote for the purpose — headings, lists, code blocks, links, tables and blockquotes, which covers everything I've ever needed in a post. Each post has a shareable URL like `#/blog/this-post`, and the browser's back button does what you'd expect.

## The terminal

The Terminal reads the same content through a virtual filesystem: `README.txt`, `apps/`, `marketing/`, `blog/`. You can `ls`, `cat` and `cd` around it, and `open` anything to get its window. Tab completion and history work. It exists because some people — me included — would genuinely rather type `open blog` than find a folder.

## Was it worth it?

It took a couple of weekends. The site says something a scrolling page can't: *I like building things, and I care about details*. And every time I add a project, I get to draw a little icon for it, which is the best kind of chore.
