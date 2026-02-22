# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running Locally with Firebase Emulator

This project uses Firebase Firestore. You can run a **local emulator** to avoid touching the production database.

### 1️ Install Firebase CLI

# React + Vite

A minimal React + Vite setup with Firebase Firestore support. Contributors can run a **local Firestore emulator** without touching the real database.

---

## 🚀 Getting Started (3 Steps)

1. **Clone the repo**
   ```bash
      git clone https://github.com/MadTubi/HelpTickeySystem.git
      cd HelpTicketSystem
   ```
   
2. **Install dependencies**
  ```bash
      npm install
```
3. **Run the app with Firebase emaultor**
   ```bash
      cp .env.example .env.local
   ```
4. **Configure .env.local for local emulator:**
  ```env
    REACT_APP_FIREBASE_API_KEY=demo-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=demo-project
    REACT_APP_USE_EMULATOR=true
   ```
5. **Start Firebase emulator:**
    firebase emulators:start


6.  **Start React app:**
```bash
  npm start
```
Your app now uses the local Firestore emulator safely!!

















