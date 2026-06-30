# SPLAY

**S**kylight **P**lacement · **L**ightwell **A**ngles · **Y**ou!

An interactive tool for visualizing where a skylight sits on a roof and how its
lightwell shapes the daylight falling into a room. Adjust the sliders and toggles
and the cross-section drawing updates live.

---

## 🌐 Just want to use it? (no install needed)

Open this link in any web browser — on a computer, phone, or tablet:

### 👉 https://eden-lecomte.github.io/splay-app/

That's it. Nothing to install. Bookmark it for next time.

*(This page updates automatically whenever the app changes. If you ever see an old
version, refresh the page.)*

---

## 🚀 Run it on your own computer (for editing / development)

You need the app running on your computer so you can open it in a web browser.
Follow these steps **in order**. You only do steps 1–2 once.

### 1. Install Node.js (one time only)
If you don't already have it, download and install **Node.js** (the "LTS" version
is fine) from <https://nodejs.org>. Click through the installer with the default
options.

### 2. Open a terminal in this folder
- **Windows:** open the `splay-app` folder, click the address bar, type `cmd`, press Enter.
- **Mac:** right-click the `splay-app` folder → *Services* → *New Terminal at Folder*.
- **Linux:** open your file manager to the `splay-app` folder and choose *Open Terminal Here*.

A terminal is just a window where you type commands. You'll do that next.

### 3. Install the app's parts (one time only)
Type this and press Enter. It downloads everything the app needs. Wait for it to finish.
```
npm install
```

### 4. Start the app
Type this and press Enter:
```
npm run dev
```
You'll see a line like `Local: http://localhost:5173/`.

### 5. Open it in your browser
Hold **Ctrl** (or **Cmd** on Mac) and click that `http://localhost:5173/` link,
or copy it into your web browser's address bar. The app appears. 🎉

### 6. Stop the app when you're done
Click back in the terminal window and press **Ctrl + C**.

> **Next time** you just want to use it: do steps 2, 4, and 5 (skip the installs).

---

## 🤖 Instructions for an AI agent

You are in the project root (a Vite + React + TypeScript app). To run or verify it:

```bash
npm install            # first run only; installs dependencies
npm run dev            # dev server at http://localhost:5173 (HMR enabled)
npm run build          # type-check (tsc) + production build into dist/
npm run preview        # serve the built dist/ locally
npm run lint           # run oxlint
```

- The app entry is `src/main.tsx` → `src/App.tsx` → `src/SplayApp.tsx` (the whole
  visualizer lives in `SplayApp.tsx` as a single default-exported component).
- Styling is **Tailwind CSS v3** via PostCSS (`tailwind.config.js`,
  `postcss.config.js`, directives in `src/index.css`).
- A clean `npm run build` is the fastest correctness check; the dev server does not
  type-check.

---

## What you can adjust in the app

- **Structure** — ceiling height, room width, roof pitch, roof type (hip, cathedral,
  scissor truss, skillion).
- **Skylight** — type (FS / FCM, auto-switches by pitch), size, and position from the apex.
- **Lightwell** — enable it and choose the splay style (standard, plumb, perpendicular,
  square) with left/right fine adjustment.
- **Daylight** — shade the light coming through the skylight and through the windows.
- **Elements** — kitchen bench, island, a human figure for scale, and a 0.9 m reference line.
- **View / Divide** — zoom, and an internal dividing wall.

> Note: some toggles (Tandem, Mirror, and kitchen-bench daylight clipping) are present
> in the UI but are placeholders in the current code — they don't draw anything yet.

---

## Tech stack & notes

- **Vite** (React + TypeScript) — chosen over the deprecated `create-react-app`, which
  fails on current Node versions.
- **Tailwind CSS v3** (PostCSS).
- The component source was recovered from a provided Word document; newlines and
  formatting were restored.

### Requirements
- Node.js 18+ (any current LTS works).
