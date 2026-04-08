# Notebook App — CLAUDE.md

## Project Overview
A downloadable desktop notebook app for storing, organizing, and retrieving notes from textbooks (or manually). Designed for students and self-learners who want structured, searchable notes that persist after a course ends.

**Creators:** Alex P. & Sunny S.
**Date:** April 7, 2026
**Status:** MVP / Pre-Production

---

## Core Problem
Students and learners need a dedicated place to store structured textbook notes in a hierarchy that mirrors how textbooks are organized — not scattered across Google Docs, Notion pages, or paper notebooks.

## Architecture

### Data Hierarchy (3-Tier)
```
Tier 1: Textbook
├── name, author, summary, index, glossary
│
├── Tier 2: Chapter
│   ├── chapter name, chapter summary, chapter index
│   │
│   └── Tier 3: Section
│       ├── summary
│       ├── listed notes (numbered/bullets with headings)
│       └── in-depth notes (with headings)
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React (Vite or Electron for desktop) |
| State | Zustand or Context API |
| Storage | IndexedDB via Dexie.js (local-first, no backend) |
| Styling | Tailwind CSS + custom CSS variables |
| Search | Fuse.js (client-side fuzzy search) |
| Export | Optional — markdown or JSON export |
| Desktop | Electron or Tauri for native packaging |

### No External APIs
- No AI integration
- No payment processing
- No cloud sync (local-only by default)
- No user accounts or authentication

---

## Design System

### Aesthetic
- **Theme:** Soft pastel notebook — warm, inviting, tactile
- **Vibe:** Physical notebook meets modern UI. Lined paper textures, rounded corners, colorful tabs
- **Layout:** Fixed left sidebar (textbook/chapter/section tree) + main content area with notebook-style lines

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-cream` | `#FFF8F0` | App background |
| `--bg-paper` | `#FFFDF7` | Note content area |
| `--lines` | `#E8DDD4` | Notebook ruling lines |
| `--accent-pink` | `#F4A5B8` | Primary action buttons |
| `--accent-lavender` | `#C3B1E1` | Secondary actions, tags |
| `--accent-mint` | `#A8E6CF` | Success states, chapter tabs |
| `--accent-sky` | `#A0D2F0` | Info, search highlights |
| `--accent-peach` | `#FFCBA4` | Warnings, textbook tabs |
| `--accent-butter` | `#FDE68A` | Highlights, starred notes |
| `--text-primary` | `#3D3535` | Body text |
| `--text-muted` | `#8B7E74` | Labels, placeholders |
| `--sidebar-bg` | `#F5EDE4` | Sidebar background |

### Typography
- **Display/Headings:** Rounded, friendly sans-serif (e.g., Nunito, Quicksand)
- **Body/Notes:** Clean readable sans (e.g., DM Sans, Plus Jakarta Sans)
- **Monospace (optional):** For code-style notes (JetBrains Mono)

### Component Patterns
- **Buttons:** Pill-shaped (border-radius: 9999px), pastel fills, soft shadow on hover
- **Sidebar items:** Rounded rectangles with pastel left-border accent by tier
- **Cards:** Soft shadow, 12-16px border-radius, cream/white background
- **Inputs:** Rounded, subtle border, warm placeholder text
- **Notebook lines:** Repeating 28-32px horizontal lines in content area via CSS background

---

## Feature Spec

### P0 — MVP (Build First)
- [ ] Sidebar tree: Textbook → Chapter → Section navigation
- [ ] Add/edit/delete at each tier
- [ ] Section editor: summary field, bullet/numbered notes, in-depth notes
- [ ] Global search bar (fuzzy search across all notes)
- [ ] Local persistence (IndexedDB)
- [ ] Notebook-lined content area

### P1 — Polish
- [ ] Textbook metadata: author, summary, index, glossary fields
- [ ] Chapter metadata: summary, chapter index
- [ ] Drag-and-drop reorder for chapters/sections
- [ ] Keyboard shortcuts (Ctrl+N new note, Ctrl+F search, etc.)
- [ ] Dark mode (muted dark pastels)

### P2 — Nice to Have
- [ ] Export to Markdown / JSON
- [ ] Import from Markdown
- [ ] Sticker/emoji decorations on notes
- [ ] Print-friendly view
- [ ] Tauri/Electron desktop packaging

---

## File Structure (Production)
```
notebook-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── SidebarTree.jsx
│   │   │   ├── TextbookItem.jsx
│   │   │   ├── ChapterItem.jsx
│   │   │   └── SectionItem.jsx
│   │   ├── Editor/
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── SummaryField.jsx
│   │   │   ├── BulletNotes.jsx
│   │   │   └── InDepthNotes.jsx
│   │   ├── Search/
│   │   │   └── SearchBar.jsx
│   │   ├── Modals/
│   │   │   ├── AddTextbook.jsx
│   │   │   ├── AddChapter.jsx
│   │   │   └── AddSection.jsx
│   │   └── Layout/
│   │       └── AppShell.jsx
│   ├── stores/
│   │   └── notebookStore.js
│   ├── db/
│   │   └── dexie.js
│   ├── hooks/
│   │   └── useSearch.js
│   ├── styles/
│   │   └── tokens.css
│   ├── App.jsx
│   └── main.jsx
├── CLAUDE.md
├── package.json
└── vite.config.js
```

---

## Development Commands
```bash
npm create vite@latest notebook-app -- --template react
cd notebook-app
npm install dexie zustand fuse.js
npm run dev        # local dev server
npm run build      # production build
```

## Desktop Packaging (Phase 2)
```bash
# Tauri (recommended — smaller binary)
npm install @tauri-apps/cli
npx tauri init
npx tauri build

# OR Electron
npm install electron electron-builder
npx electron-builder
```

---

## Conventions
- Components are functional React with hooks
- State managed via Zustand store (single source of truth)
- All data persisted to IndexedDB via Dexie — no server calls
- CSS variables defined in `tokens.css`, consumed via Tailwind or inline
- Each tier (textbook/chapter/section) has its own accent color
- IDs generated via `crypto.randomUUID()`
