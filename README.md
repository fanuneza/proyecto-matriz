# Proyecto Matriz

Sitio editorial en Next.js sobre la matriz energetica chilena, con datos
servidor-a-servidor desde la API publica de la CNE.

## Stack

- Next.js 16 App Router
- TypeScript
- Plotly para visualizaciones
- Cloudflare Pages para produccion estatica

## Comandos

```bash
npm run dev
npm run lint
npm run build
```

## Variables de entorno

Configurar en Cloudflare Pages y en `.env.local` para desarrollo:

```bash
CNE_API_BASE_URL=https://api.cne.cl
CNE_API_EMAIL=...
CNE_API_PASSWORD=...
```

No usar variables `NEXT_PUBLIC_*` para credenciales de CNE.

## Datos y refresco

La pagina principal obtiene datos desde la CNE durante `npm run build`. El
resultado se exporta como HTML estatico en `out/`; no hay rutas runtime de API
en produccion.

El refresco semanal esperado dispara un nuevo build de Cloudflare Pages mediante
un Deploy Hook. El workflow `.github/workflows/cloudflare-pages-refresh.yml`
puede ejecutar ese hook cada lunes:

```text
0 6 * * 1
POST <CLOUDFLARE_PAGES_DEPLOY_HOOK_URL>
```

La hora es UTC. Verificar el cambio CLT/CLST antes de asumir una hora local exacta
en Chile. Si la API de la CNE falla, el build debe fallar y Cloudflare Pages
mantiene publicado el ultimo deploy exitoso.

## Despliegue y recuperacion

Cloudflare Pages debe usar:

```text
Build command: npm run build
Output directory: out
Node version: 20
```

Variables requeridas en Cloudflare Pages:

```bash
CNE_API_BASE_URL=https://api.cne.cl
CNE_API_EMAIL=...
CNE_API_PASSWORD=...
```

Para el refresco semanal con GitHub Actions, crear el secret del repositorio:

```bash
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=...
```

Antes de desplegar, ejecutar localmente:

```bash
npm run lint
npm run build
```

Si el build programado falla, revisar los logs de Cloudflare Pages y GitHub
Actions; el sitio publico debe seguir sirviendo el ultimo deploy correcto. Para
recuperacion manual, reintentar el deploy hook o usar el rollback de Cloudflare
Pages al deploy anterior estable.

## SEO

El dominio canonico es `https://matriz.agenciachucao.cl`. `robots.txt` y
`sitemap.xml` se generan con las convenciones de metadata de Next.js.
