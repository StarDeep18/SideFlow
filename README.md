<div align="center">

# ⚡ SideFlow

**The Universal Productivity Communication Sidebar**

Access all your apps — chat, email, AI, music — from a persistent browser sidebar without switching tabs.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/StarDeep18/SideFlow)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)

</div>

---

## 🎯 What is SideFlow?

SideFlow is a Chrome extension that puts a smart sidebar in your browser — giving you instant access to your most-used apps without tab-switching chaos.

**It's NOT** "WhatsApp in a sidebar."
**It IS** a unified productivity operating layer inside your browser.

Think: **Arc Browser** meets **Raycast** meets **Discord sidebar** — as a lightweight Chrome extension.

---

## ✨ Features

### 🏗️ Core
- **App Dock** — Vertical icon strip with 8 pre-configured apps
- **Workspace System** — Work, Study, Personal contexts with per-workspace app memory
- **Keyboard-First** — `Alt+1-2` for apps, `Ctrl+K` command palette, `Ctrl+Shift+Space` toggle
- **Smart Embedding** — Sites that support iframes load inline; others get a polished "Open in Tab" fallback

### 🎨 Design
- **4 Themes** — Dark, Midnight, Nord, OLED Black
- **8 Accent Colors** — Customizable via Settings
- **Premium Animations** — Spring-physics transitions, hover states, micro-interactions
- **Compact Layout** — 48px dock, 32px header, maximum content space

### ⌨️ Command Palette
- `Ctrl+K` to open
- Fuzzy search across apps, workspaces, themes, actions
- Full keyboard navigation (↑↓ Enter Esc)
- Grouped results by category

### ⚙️ Settings
- Theme switcher with live previews
- Accent color picker
- Animation toggle
- Shortcut hints toggle

---

## 📸 Screenshots

| Sidebar with App | Command Palette | Settings |
|:---:|:---:|:---:|
| Dark theme, ChatGPT loaded | Raycast-style `Ctrl+K` | Theme & accent picker |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Google Chrome](https://www.google.com/chrome/)

### Install & Build

```bash
# Clone the repo
git clone https://github.com/StarDeep18/SideFlow.git
cd SideFlow

# Install dependencies
npm install

# Build the extension
npm run build
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. Click the **SideFlow icon** in toolbar, or press `Ctrl+Shift+Space`

### Development

```bash
# Start dev server with hot reload
npm run dev
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+Space` | Toggle sidebar |
| `Alt+1` | Open WhatsApp |
| `Alt+2` | Open Telegram |
| `Ctrl+K` | Command palette |
| `Ctrl+Shift+K` | Command palette (global) |
| `↑` `↓` `Enter` `Esc` | Navigate command palette |

---

## 🏛️ Architecture

```
src/
├── background/          # MV3 service worker (shortcuts, lifecycle)
├── sidepanel/           # Main sidebar UI (React)
│   ├── components/
│   │   ├── AppDock/           # Vertical app launcher
│   │   ├── WebView/           # Iframe manager + blocked-app fallback
│   │   ├── WorkspaceSwitcher/ # Context switching
│   │   ├── CommandPalette/    # Ctrl+K command center
│   │   ├── Onboarding/       # First-run flow
│   │   └── Settings/         # Theme, accent, preferences
│   ├── styles/                # Design tokens, reset, animations
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point
├── popup/               # Toolbar popup (minimal)
├── stores/              # Zustand state (app, workspace, settings)
├── types/               # TypeScript interfaces
└── utils/               # Storage abstraction, constants
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI | React 18 + TypeScript | Component model, type safety |
| State | Zustand | 1.2KB, perfect for extensions |
| Styling | Vanilla CSS + Custom Properties | Tiny bundle, native theming |
| Build | Vite + CRXJS | Fast builds, extension hot-reload |
| Storage | Chrome Storage API | Sync-ready, extension-native |
| Extension | Manifest V3 + Side Panel API | Latest Chrome APIs |

### Bundle Size

| Asset | Size | Gzipped |
|---|---|---|
| App JS | 20KB | 6KB |
| App CSS | 17KB | 3.2KB |
| React | 191KB | 60KB |
| **Total** | **~230KB** | **~70KB** |

---

## 📱 Supported Apps

| App | Status | Method |
|---|---|---|
| ChatGPT | ✅ Embedded | iframe |
| Notion | ✅ Embedded | iframe |
| X / Twitter | ✅ Embedded | iframe |
| Spotify | ✅ Embedded | iframe |
| WhatsApp | 🔗 Open in Tab | Blocks iframe |
| Gmail | 🔗 Open in Tab | Blocks iframe |
| Telegram | 🔗 Open in Tab | Blocks iframe |
| Google Calendar | 🔗 Open in Tab | Blocks iframe |

---

## 🗺️ Roadmap

- [x] **Phase 1** — Sidebar, App Dock, Workspaces, Shortcuts
- [x] **Phase 2** — Command Palette, Settings, Themes
- [ ] **Phase 3** — Focus Mode, Custom Apps, Cloud Sync
- [ ] **Phase 4** — AI Features, Productivity Widgets, Analytics
- [ ] **Phase 5** — Firefox, Edge, Electron Desktop App

---

## 🎨 Themes

| Dark | Midnight | Nord | OLED |
|:---:|:---:|:---:|:---:|
| `#0F0F14` | `#0A0E1A` | `#2E3440` | `#000000` |
| Deep charcoal | Navy blue | Arctic blue | Pure black |

---

## 🛡️ Privacy

- **Zero data collection** — everything stays in Chrome Storage
- **3 permissions only** — `sidePanel`, `storage`, `commands` + `declarativeNetRequest`
- **No analytics** — no tracking, no telemetry
- **Open source** — audit the code yourself

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**Built with ⚡ by [StarDeep18](https://github.com/StarDeep18)**

*SideFlow — the future of browser multitasking.*

</div>
