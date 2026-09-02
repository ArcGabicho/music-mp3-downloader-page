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
npx wrangler kv namespace create SUBSCRIBERS            # namespace de producción
npx wrangler kv namespace create SUBSCRIBERS --preview  # namespace de preview
```

En producción, añade el binding en el dashboard:
**Pages → tu proyecto → Settings → Functions → KV namespace bindings**
(variable: `SUBSCRIBERS`).

Para desarrollo local con la función y un KV efímero:

```bash
npx wrangler pages dev --kv SUBSCRIBERS -- npm run dev
```

---

#### Despliegue

El proyecto está montado como **Cloudflare Pages**. En Settings → Builds &
deployments:

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `npx wrangler pages deploy dist` *(o vacío para deploy automático por Git)* |

> [!WARNING]
> No uses `npx wrangler deploy` a secas: ese comando es de **Workers** y falla
> con `Missing entry-point to Worker script or to assets directory`.

El sitio se publica en <https://music-mp3-downloader-page.pages.dev> gracias a Cloudflare Pages.