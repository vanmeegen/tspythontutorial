# TypeScript → Python Quiz 🐍

An interactive quiz application for experienced TypeScript developers transitioning to Python. Test your knowledge across 6 categories with 30 challenging questions covering language differences, gotchas, Pythonic patterns, and the modern Python ecosystem.

![Quiz Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## ✨ Features

- **6 Quiz Categories**
  - 📝 Language Basics — Type system, scoping, None checks
  - ⚠️ Tricky Gotchas — Mutable defaults, late binding, integer caching
  - 🐍 Pythonic Style — EAFP, enumerate, unpacking, context managers
  - ⚡ Async Patterns — Coroutines, asyncio.gather, event loop
  - 🛠️ Ecosystem & Tools — uv, Ruff, pytest, pyproject.toml
  - 🌐 Web Frameworks — FastAPI, Pydantic, SQLAlchemy 2.0

- **Gamification**
  - 🔥 Streak system with score multipliers (up to 3x!)
  - 🎯 Difficulty-based scoring (Easy: 100, Medium: 200, Hard: 300)
  - ✨ Confetti animations on correct answers
  - 📊 Progress tracking across categories

- **Modern UX**
  - 🌙 Cyberpunk/terminal aesthetic
  - 📱 Fully responsive design
  - ⚡ Smooth animations and transitions
  - 💡 Detailed explanations after each answer

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ts-to-python-quiz.git
cd ts-to-python-quiz

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## 🌐 Deploy

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### GitHub Pages
1. Update `vite.config.ts` to set `base` to your repo name:
   ```ts
   base: '/ts-to-python-quiz/'
   ```
2. Build and deploy:
   ```bash
   npm run build
   gh-pages -d dist
   ```

## 📚 What You'll Learn

This quiz covers the most important differences between TypeScript and Python:

| Topic | What's Covered |
|-------|----------------|
| **Type System** | Runtime vs compile-time, Protocol vs interface, type hints |
| **Scoping** | No block scope, LEGB rule, walrus operator |
| **Gotchas** | Mutable default args, late binding, integer caching |
| **Idioms** | EAFP, enumerate, unpacking, context managers |
| **Async** | Lazy coroutines, asyncio.gather, event loop blocking |
| **Tooling** | uv, Ruff, pytest fixtures, pyproject.toml |
| **Web** | FastAPI, Pydantic, SQLAlchemy 2.0, Depends() |

## 🛠️ Tech Stack

- **React 18** — UI library
- **TypeScript 5** — Type safety
- **Vite 5** — Build tool
- **CSS-in-JS** — Inline styles for simplicity

## 📄 License

MIT © 2025

---

**Made for TypeScript developers who are ready to embrace the 🐍**
