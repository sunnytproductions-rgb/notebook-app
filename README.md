# My Notebook 📓

A cute desktop notebook app for organizing textbook notes. Built with React + Electron.

By Alex P. & Sunny S.

---

## Quick Start (Mac — Development)

```bash
# 1. Install dependencies
npm install

# 2. Run in dev mode (opens Electron window with hot reload)
npm run electron:dev
```

This opens the app in a desktop window on your Mac. Changes to the React code update instantly.

---

## Building the Windows .exe

You don't build on your Mac. GitHub does it for you.

### First-Time Setup (5 minutes)

1. **Create a GitHub repo**
   ```bash
   cd notebook-app
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Go to github.com → New Repository → name it `notebook-app`
   - Follow the instructions to push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/notebook-app.git
   git branch -M main
   git push -u origin main
   ```

3. **GitHub Actions builds automatically** — go to the "Actions" tab on your repo, you'll see the build running.

4. **Download the .exe** — once the build completes (2-3 minutes), click the workflow run → scroll down to "Artifacts" → download `notebook-windows-installer`.

5. **Send to Alex** — unzip the artifact, and you'll have a `My Notebook Setup 1.0.0.exe` ready to go.

### Every Time You Make Changes

```bash
# Edit code, then:
git add .
git commit -m "Fixed the thing"
git push
```

GitHub builds a fresh `.exe` automatically. Download from Actions → send to Alex.

### Manual Trigger

You can also trigger a build manually:
1. Go to your repo → Actions tab
2. Click "Build Windows Installer" on the left
3. Click "Run workflow" → "Run workflow"

---

## Project Structure

```
notebook-app/
├── electron/
│   ├── main.js          ← Electron window setup
│   └── preload.js       ← Security bridge
├── src/
│   ├── main.jsx         ← React entry point
│   └── App.jsx          ← The entire notebook UI
├── public/
│   └── icon.png         ← App icon (add your own 512x512 PNG)
├── .github/
│   └── workflows/
│       └── build.yml    ← GitHub Actions build config
├── index.html
├── package.json
├── vite.config.js
└── CLAUDE.md            ← Project documentation
```

---

## Making Changes

All the UI code lives in **`src/App.jsx`**. That's the single file you'll edit for:
- Layout changes
- New features
- Color/style tweaks
- Adding new data fields

The Electron shell (`electron/main.js`) rarely needs changes — it just creates the window.

---

## Adding an App Icon

Replace `public/icon.png` with a 512x512 PNG of your app icon. The build will use it for:
- The `.exe` installer icon
- The Windows taskbar icon
- The app window icon

---

## Version Bumps

Before sending a new build to Alex, bump the version in `package.json`:

```json
"version": "1.0.1"
```

This way Alex can tell which version he's running.

---

## Data Storage

All notes are stored in the user's local browser storage (Electron's built-in Chromium). Data lives at:

```
Windows: %APPDATA%/my-notebook/
Mac:     ~/Library/Application Support/my-notebook/
```

**Data persists across updates** — installing a new version doesn't erase notes.
