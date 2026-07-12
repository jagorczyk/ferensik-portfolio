# Ferensik — portfolio 3D

Frontend portfolio w React, Vite, TypeScript i React Three Fiber. Źródłowy model znajduje się w `public/models/sara.dff`.

## Uruchomienie

```bash
npm install
npm run dev
```

## Model DFF

Aplikacja parsuje `public/models/sara.dff` bezpośrednio w przeglądarce przez `rw-parser-ng`, a następnie buduje z geometrii `THREE.BufferGeometry`. Brakujące tekstury TXD są celowo zastępowane monochromatycznymi materiałami. Fallback geometryczny pojawia się tylko podczas ładowania lub przy błędzie parsera.

## Build

```bash
npm run build
```
