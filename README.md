# DesiCrunch

Smoor-inspired premium cloud-kitchen front-end built with **React + Vite**.

## Run locally (Windows)

### 1) Install Node.js
Install Node.js LTS (includes npm):
- https://nodejs.org/

Verify:

```bat
node -v
npm -v
```

### 2) Install dependencies
From project folder:

```bat
npm install
```

### 3) Start dev server

```bat
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

## Production build

```bat
npm run build
npm run preview
```

## Why Python is not needed
This project runs through Vite's Node-based dev server, so you do **not** need `python3 -m http.server`.
