# Proyecto Matriz

Proyecto Matriz es un sitio estático en [Next.js](https://nextjs.org/) sobre la
transición energética chilena. Durante el build transforma datos de la
[Comisión Nacional de Energía](https://www.cne.cl/) en páginas editoriales,
artefactos descargables y salida estática lista para publicar en
[Cloudflare Pages](https://pages.cloudflare.com/).

Sitio canónico: [matriz.fnunez.cl](https://matriz.fnunez.cl/)

## Qué hace este repositorio

- Publica una portada editorial sobre la nueva matriz energética chilena
- Expone vistas temáticas por región y por tecnología
- Incluye una herramienta para comparar regiones y un archivo mensual
- Genera artefactos públicos en JSON y CSV a partir de datos agregados de la CNE
- Exporta un sitio estático con `robots.txt`, `sitemap.xml`, canonicals, Open
  Graph y JSON-LD

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Zod
- Vitest
- Cloudflare Pages

## Rutas principales

- `/`
- `/datos`
- `/regiones`
- `/regiones/[slug]`
- `/tecnologias`
- `/tecnologias/[slug]`
- `/comparar`
- `/archivo`
- `/archivo/[month]`

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Definir estas variables en `.env.local` cuando necesites regenerar artefactos
con datos frescos de la CNE:

```bash
CNE_API_BASE_URL=https://api.cne.cl
CNE_API_EMAIL=...
CNE_API_PASSWORD=...
```

Sin esas credenciales, los builds que regeneran datos fallarán en `prebuild`.

## Comandos principales

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run generate-artifacts
npm run check-output
npm run check-routes
npm run write-snapshot
npm run analyze
```

Notas:

- `npm run build` ejecuta primero `npm run generate-artifacts`.
- `npm run build` escribe la exportación estática en `out/`.
- `npm run analyze` usa webpack a propósito, porque aquí el análisis no sale del
  camino por defecto con Turbopack.

## Salida y artefactos de datos

Los artefactos públicos generados incluyen:

- `public/data/current/summary.json`
- `public/data/current/metadata.json`
- `public/data/downloads/regiones-current.csv`
- `public/data/downloads/tecnologias-current.csv`
- `public/data/downloads/matriz-current.csv`
- `public/data/snapshots/*.json`

No se deben publicar payloads crudos de la CNE ni secretos.

## SEO y superficie de rastreo

Actualmente el repositorio genera:

- metadata por página con canonical, Open Graph y Twitter
- JSON-LD a nivel de sitio
- `robots.txt` generado
- `sitemap.xml` generado
- cabeceras de caché y seguridad en `public/_headers`
- soporte de `No-Vary-Search` para parámetros habituales de campaña

La configuración de la URL canónica vive en `app/site.ts`.

## Deploy

Configuración recomendada para Cloudflare Pages:

```text
Production branch: main
Build command: npm run build
Output directory: out
Node version: 20
```

`wrangler.toml` debe mantener:

```toml
pages_build_output_dir = "./out"
```

## Automatización

Workflows actuales de GitHub Actions:

- `cloudflare-pages-refresh.yml` dispara el rebuild semanal en Cloudflare Pages
- `lychee.yml` revisa enlaces en Markdown y HTML

El workflow programado depende de este secret del repositorio:

```bash
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=...
```

## Validación antes de desplegar

Ejecutar:

```bash
npm run lint
npm run test
npm run build
npm run check-output
npm run check-routes
```

Después de un build exitoso, conviene revisar:

- `out/index.html`
- `out/datos/index.html`
- `out/robots.txt`
- `out/sitemap.xml`
- `out/data/current/summary.json`
- `out/data/current/metadata.json`

Si `npm run build` falla, la causa más común es que falten credenciales válidas
de la CNE.

## Más detalle

La guía operativa para agentes vive en `AGENTS.md`.
