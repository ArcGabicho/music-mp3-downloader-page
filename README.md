# Sitio web de Music MP3 Downloader

![Wallpaper](https://i.imgur.com/2lcUDNj.png)

Landing page del proyecto **[Music MP3 Downloader](https://github.com/ArcGabicho/music-mp3-downloader)**,
la app de escritorio multiplataforma (.NET 10 + Avalonia UI) para descargar audio
de YouTube en MP3 y reproducirlo en una interfaz moderna.

---

#### Ejecuta el script remoto para tener el proyecto de forma local

```bash
curl -fsSL https://raw.githubusercontent.com/ArcGabicho/music-mp3-downloader-page/main/setup.sh | bash
```

> [!WARNING]
> El script `setup.sh` clona el repositorio, entra en la carpeta, ejecuta
> `npm install` y arranca el servidor de desarrollo en <http://localhost:4321>.

---

#### Avisos de nuevas versiones

El formulario del footer envía el correo a la Pages Function
`functions/api/subscribe.ts`, que lo guarda en un KV namespace con el binding
`SUBSCRIBERS`. Para que funcione:

```bash
npx wrangler kv namespace create SUBSCRIBERS   # copia el id en wrangler.toml
```

```bash
npx wrangler pages dev -- npm run dev           # dev con funciones + KV
```

En producción, añade el mismo binding en Pages → Settings → Functions → KV
namespace bindings.

---

El sitio se publica en <https://music-mp3-downloader-page.pages.dev> gracias a Cloudflare Pages.