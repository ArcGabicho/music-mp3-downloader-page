# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio.

## Qué es esto

La landing de marketing (una sola página, estática) de la app de escritorio
**Music MP3 Downloader**. Este repositorio es **solo el sitio web** — la app en
sí vive en `github.com/ArcGabicho/music-mp3-downloader`.

## Comandos

```bash
npm run dev        # servidor de desarrollo en :4321
npm run check      # type-check (astro check)
npm run build      # build estático a dist/
npm run preview    # sirve el dist/ ya construido
```

No hay tests ni linter de estilo. Después de cualquier cambio, ejecuta
`npm run check` y `npm run build` y confirma que terminan sin errores: es
exactamente lo que valida el CI (`.github/workflows/ci.yml`) en cada push y PR.

## Arquitectura

- **Astro por defecto.** Cada sección estática es un componente `.astro` en
  `src/components/`. `src/pages/index.astro` las compone en este orden: `Nav`,
  `Hero`, `Marquee`, `ValueProp`, `OsSection`, `TechSection`, `InstallCta`,
  `Footer`, y monta `ToasterMount` al final.
- **`Layout.astro` es el cascarón.** `src/layouts/Layout.astro` contiene todo el
  `<head>`: `<title>`/meta por defecto, Open Graph, Twitter Card, JSON-LD
  (`SoftwareApplication`), `<html lang="es">` y la carga de fuentes desde Google
  Fonts (**Inter** y **JetBrains Mono**). Acepta props `title`, `description`,
  `image` y `noindex`.
- **Iconos.** El favicon es la nota musical en cuadrado redondeado (mismo glifo
  que el círculo del `Nav`). Vive en `public/favicon.svg` + `public/favicon.ico`
  + `public/favicon.png` (apple-touch, 180×180), referenciados desde
  `Layout.astro`.
- **React solo para interactividad.** Un componente pasa a ser un island `.tsx`
  (hidratado con `client:load`) *solo* cuando necesita estado o manejadores de
  eventos. Islands actuales: `DownloadPicker`, `InstallTabs`, `ToasterMount`.
- **`DownloadPicker.tsx`** (en el hero) es el selector de descarga: lista los
  assets de la release fijada en la constante `RELEASE` (`v0.1.0`) del repo de la
  app, autoselecciona la build según el sistema operativo y enlaza al asset de
  GitHub. Al publicar una nueva release hay que actualizar `RELEASE`, `file`,
  `size` y `sha256` de cada entrada de `BUILDS`.
- **Sitio 100 % estático, sin backend.** No hay `functions/` ni adaptador SSR: el
  build produce solo HTML/CSS/JS en `dist/` y Cloudflare Pages lo publica tal
  cual (build `npm run build`, output `dist`, sin deploy command). El bloque
  "Entérate de cada versión" del `Footer` enlaza a las releases de GitHub y a su
  feed `releases.atom`; no hay formulario de correo.
- **Un solo toaster.** `ToasterMount.tsx` renderiza el único `<Toaster>` de
  `sileo` de toda la página (`position="bottom-right"`, `theme="system"`). Los
  islands llaman a `sileo.success` / `sileo.warning` / `sileo.error` desde el
  módulo compartido `sileo` — **no** añadas otro `<Toaster>`.
- **Tailwind v4, sin archivo de configuración.** Está conectado mediante
  `@tailwindcss/vite` en `astro.config.mjs`. Todos los tokens de tema
  (`--color-paper`, `--color-bone`, `--color-card`, `--color-ink`,
  `--color-ink-soft`, `--color-night`, `--color-hairline`, `--font-sans`,
  `--font-mono`) y los helpers (`.btn` con las variantes `.btn-lg`, `.btn-dark`,
  `.btn-light`, `.btn-ghost`; `.chip` y `.chip-dark`; `.wordmark`; `.eyebrow`)
  están definidos en `src/styles/global.css`. Añade nuevos tokens de diseño ahí
  con `@theme`.
- `AppMock.astro` es una maqueta puramente CSS del reproductor de escritorio,
  reutilizada con `size="sm"` en las tarjetas (`ValueProp`) y `size="lg"` en la
  sección oscura (`OsSection`).

## Convenciones

- Los archivos `.astro` usan `class` y `class:list`; los `.tsx` usan `className`.
- Los iconos vienen de `lucide-react` (solo en islands de React). Ojo: **no**
  tiene icono `Github` ni `Youtube` — usa SVG inline u otro icono para esos.
- Los contenedores de sección llevan el `id` que usan los anclajes del nav
  (`#caracteristicas`, `#plataformas`, `#tecnologia`, `#instalacion`); el hero
  usa `#top`.
- Todo el texto visible está en español.
- **Móvil primero.** Las clases sin prefijo son el estado de teléfono (el sitio
  debe funcionar desde ~320 px); `sm:` y `lg:` escalan hacia arriba. Nada
  desborda en horizontal: `body` lleva `overflow-x: hidden` +
  `overflow-wrap: break-word`, el bloque de comando de `InstallTabs` scrollea
  dentro de su caja, y los `.wordmark` gigantes usan `clamp()` con un mínimo que
  cabe en pantallas estrechas. Padding de sección `py-16` en móvil, `sm:py-28+`
  en escritorio. Los CTA sueltos van `w-full … sm:w-auto`.

## Lenguaje de diseño

Minimalista y monocromo, con aire de maquetación editorial contundente: fondo
hueso/papel (`bg-paper`), tinta casi negra, wordmarks de display enormes y con
tracking cerrado (`.wordmark`), botones tipo píldora, mucho espacio en blanco,
bordes de tarjeta suaves (`border-hairline`). Las secciones oscuras usan
`bg-night` con texto blanco. **Sin color de acento.** El hero es un `bg-night`
sólido — sin degradados, patrones ni formas decorativas.

## Comandos de instalación que aparecen en la página

`InstallTabs.tsx` incrusta los comandos de instalación reales, en dos pestañas
(**Arch / CachyOS** y **Windows**; macOS solo se menciona en el copy).
Mantenlos sincronizados con el README de la app:

- Arch / CachyOS: `yay -S music-mp3-downloader-bin`
- Windows: el one-liner `iwr … MusicMp3Downloader-Setup-x64.exe` de la última
  release de GitHub.