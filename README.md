# 🗂️ Kanban Board  
*A sleek, modern Kanban-style task management web app built with Vue 3 + TypeScript + Vite*

---

## 🚀 Demo  
Check it out live: [https://izakiel81.github.io/kanban-board/](https://izakiel81.github.io/kanban-board/)  

---

## 🧰 Tech Stack  
- **Framework**: [Vue 3](https://vuejs.org/) – Composition API + `<script setup>` syntax  
- **Language**: TypeScript  
- **Build Tool**: [Vite](https://vitejs.dev/)  
- **Styling**: _(your choice: e.g. Tailwind CSS / SCSS / CSS-Modules)_  
- **Icons / UI**: _(if applicable)_  
- **State Management**: _(if applicable: Pinia / Vuex / simple reactive state)_  
- **Deployment**: GitHub Pages / Netlify / Vercel _(choose one)_

---

## 🎯 Features  
- Drag & drop cards between columns (To Do → In Progress → Done)  
- Add / edit / delete tasks (cards)  
- Persist state (localStorage / backend API) _(if applicable)_  
- Responsive design — works on mobile & desktop  
- Friendly UI with animations & smooth UX  
- Customizable columns and workflows _(optional)_  
- Theme support (light/dark) _(optional)_

---

## 📁 Project Structure  
/
├─ public/ // static assets
├─ src/
│ ├─ components/ // Vue components (Card, Column, Board, etc.)
│ ├─ views/ // Page-level components
│ ├─ store/ // State management (if any)
│ ├─ styles/ // Global styles, variables
│ ├─ types/ // TypeScript definitions
│ └─ main.ts // App entry point
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ vite.config.ts

---

## 🛠️ Getting Started  
1. Clone the repository  
   ```bash
   git clone https://github.com/Izakiel81/kanban-board.git
   cd kanban-board
   ```
2. Install dependencies
  ```bash
  npm install
  # or
  yarn install
  ```
3. Run in development mode
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4.Build for production
  ```bash
  npm run build
  # or
  yarn build
  ```
5.Preview production build
  ```bash
  npm run preview
  # or
  yarn preview
  ```
