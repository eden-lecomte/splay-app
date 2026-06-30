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

## 🖥️ Run it on your own computer (no terminal needed)

This lets you run SPLAY locally — handy offline, or for trying changes.
You need **Node.js** installed first (the "LTS" version from <https://nodejs.org> —
just click through the installer with the default options).

### Windows — the easy way (double-click)

**1. Get the files onto your computer.**
On the project's GitHub page, click the green **`< > Code`** button →
**Download ZIP**. Then find the downloaded file, right-click it → **Extract All**.

> Direct download link:
> https://github.com/eden-lecomte/splay-app/archive/refs/heads/master.zip

**2. Open the extracted `splay-app` folder and double-click `start-windows.bat`.**

That's it. The first time, it sets itself up (a minute or two), then a browser
window opens with the app. **To stop it, just close the black window.**

> 💡 If Windows shows a blue *"Windows protected your PC"* box, that's only because
> the file isn't from the app store. Click **More info → Run anyway**. It's safe —
> it just runs the app.
>
> **Next time:** open the same folder and double-click `start-windows.bat` again.

### Mac / Linux

Double-click **`start.sh`** (or in a terminal: `./start.sh`). Same behaviour — it
installs on first run and opens the browser.

### Manual way (any OS, using a terminal)

If you prefer typing commands, open a terminal in this folder and run:

```bash
npm install     # first time only — downloads what the app needs
npm run dev      # starts the app, then open the http://localhost:5173/ link it prints
```

Press **Ctrl + C** in the terminal to stop it.

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
