# Sweezy Web

Modern, gyors link-in-bio weboldal React.js, Vite és Tailwind CSS használatával.

## 🚀 Funkciók

- ⚡ Vite - Villámgyors fejlesztési környezet
- ⚛️ React 18 - Modern React funkciók
- 🎨 Tailwind CSS - Utility-first CSS keretrendszer
- 📱 Reszponzív design
- 🌙 Modern dark theme
- ✨ Smooth animációk és átmenetek

## 📦 Telepítés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Production build
npm run build

# Build előnézete
npm run preview
```

## 🌐 Netlify-ra telepítés

### Opció 1: Git integráció (Ajánlott)

1. Pushold a kódot GitHub-ra
2. Lépj be a Netlify-ba
3. Válaszd az "Import from Git" opciót
4. A build beállítások automatikusan be lesznek állítva a `netlify.toml` fájl alapján

### Opció 2: Manual Deploy (Drag & Drop)

**⚠️ FONTOS:** Ne a teljes projektet húzd be! Csak a build-elt `dist` mappát!

1. Először build-eld a projektet lokálisan:
   ```bash
   npm install
   npm run build
   ```

2. A build után létrejön egy `dist` mappa a projektben

3. A Netlify-ban válaszd a "Deploy manually" opciót

4. **Csak a `dist` mappát** húzd be (ne a teljes projektet, ne a `node_modules`-t!)

5. Kész! 🎉

### Opció 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🎨 Testreszabás

A profil adatait a `src/App.jsx` fájlban módosíthatod:
- Név, felhasználónév, bio
- Avatar URL
- Linkek és ikonok
- Színek és stílusok

## 📝 Licenc

MIT

