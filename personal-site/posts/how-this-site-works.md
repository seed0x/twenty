---
title: How this site works
date: 2026-09-06
---

There is no framework here and no build step. The whole site is one HTML file, two stylesheets and a handful of small scripts.

## The desktop

Every window is a `<section>` with a title bar, a content area and a grow box in the corner. The window manager is about 250 lines: it cascades new windows, raises the one you click, and lets you drag, resize, zoom and collapse them.

Dragging works the way classic Mac OS did it: a dotted outline follows the pointer and the window jumps into place when you let go. It was a performance trick in 1995. Here it's just a nice detail.

## Icons

There are no image files. Every icon is an inline SVG made of one-pixel rectangles on a 32×32 grid, so it stays sharp at any size. The dither on the desktop and in the scrollbars is a two-pixel `repeating-conic-gradient`.

## Content

Everything about me lives in one file, `content.js`. Adding a project is adding an object to a list. Blog posts are Markdown files that the site fetches and renders in the browser with a small parser.

Each window has a URL — `#/apps/life-tracker`, `#/blog/hello` — so any page here can be linked directly, and the back button does what you expect.

## The terminal

The Terminal reads the same content through a small virtual filesystem: `README.txt`, `apps/`, `marketing/`, `blog/`. You can `ls`, `cd`, `cat` and `open` your way around, with tab completion and history.

On phones, windows open full-screen and the icons flow into a grid.
