# Ferensik — portfolio modeli 3D

Interaktywne portfolio modeli 3D zbudowane w React, TypeScript, Vite i React Three Fiber.

## Funkcje

- interaktywne sceny 3D z obsługą obrotu i przybliżenia,
- ładowanie modeli RenderWare DFF oraz tekstur TXD w przeglądarce,
- statyczna prezentacja skinów z katalogu `public/skins`,
- formularz kontaktowy i przyciski dodawania modeli do zapytania,
- responsywny układ desktop/mobile,
- materiały zastępcze dla modeli bez pełnego zestawu tekstur.

## Uruchomienie

```bash
npm install
npm run dev
```

## Struktura zasobów

Modele prezentowane na stronie znajdują się w katalogu `public/models`. Skiny są przechowywane w `public/skins`. Każdy model może mieć odpowiadające mu pliki `.dff` i `.txd` o tej samej nazwie.

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Technologie

- React 18
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- `rw-parser-ng`
