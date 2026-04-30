# Proyecto Matriz

Sitio editorial estatico sobre la matriz energetica chilena. La aplicacion se
construye con Next.js y publica una instantanea semanal de datos de la API de
la Comision Nacional de Energia (CNE).

## Estado actual

- Rama principal: `main`
- Implementacion actual: Next.js static export para Cloudflare Pages
- Rama historica: `railway-app`
- Dominio canonico: `https://matriz.fnunez.cl`

## Stack

- Next.js 16.2.4 App Router
- React 19.2.5 y React DOM 19.2.5
- TypeScript 6.0.3
- ESLint 10.2.1 con `eslint-config-next` 16.2.4
- Zod 4.4.1 para validacion de payloads CNE
- Plotly 3.5.0 y React Plotly 2.6.0 para visualizaciones
- Cloudflare Pages para hosting estatico
- GitHub Actions para disparar refrescos semanales

## Arquitectura

```text
CNE API
  -> lib/cne-client.ts
  -> lib/validators.ts
  -> lib/normalize-*.ts
  -> lib/aggregates.ts
  -> lib/story-data.ts
  -> app/page.tsx
  -> next build
  -> out/
  -> Cloudflare Pages
```

No hay rutas runtime de API en produccion. Las credenciales de CNE se usan solo
durante `npm run build`; el navegador recibe HTML, JS, CSS e imagenes estaticas.

Si la API de CNE falla o cambia de forma incompatible durante el build, el build
debe fallar. Cloudflare Pages mantiene publicado el ultimo deploy exitoso.

## Comandos

```bash
npm run dev
npm run lint
npm run build
```

`npm run build` genera la salida estatica en `out/`.

## Variables de entorno

Configurar en Cloudflare Pages y en `.env.local` para desarrollo:

```bash
CNE_API_BASE_URL=https://api.cne.cl
CNE_API_EMAIL=...
CNE_API_PASSWORD=...
```

No usar variables `NEXT_PUBLIC_*` para credenciales de CNE.

Para el refresco semanal con GitHub Actions, crear este secret del repositorio:

```bash
CLOUDFLARE_PAGES_DEPLOY_HOOK_URL=...
```

## Cloudflare Pages

Configuracion recomendada:

```text
Production branch: main
Build command: npm run build
Output directory: out
Node version: 20
```

El proyecto usa `output: "export"` en `next.config.ts`, por lo que Cloudflare
Pages debe servir el contenido generado en `out/`.

`wrangler.toml` debe mantener:

```toml
pages_build_output_dir = "./out"
```

## Refresco semanal

El archivo `.github/workflows/cloudflare-pages-refresh.yml` ejecuta cada lunes:

```text
0 6 * * 1
POST <CLOUDFLARE_PAGES_DEPLOY_HOOK_URL>
```

La hora es UTC. GitHub Actions dispara el Deploy Hook y Cloudflare Pages ejecuta
un nuevo build con las credenciales configuradas en Pages.

Para refrescar manualmente, ejecutar el Deploy Hook desde Cloudflare Pages o
desde un cliente autorizado. No guardar el hook en archivos versionados.

### Configurar el webhook semanal

1. En Cloudflare, entrar a **Workers & Pages**.
2. Abrir el proyecto de **Cloudflare Pages** de Proyecto Matriz.
3. Ir a **Settings** > **Builds**.
4. En **Deploy Hooks**, seleccionar **Add deploy hook**.
5. Usar estos valores:

```text
Deploy hook name: weekly-cne-refresh
Branch to build: main
```

6. Crear el hook y copiar la URL generada. La URL es secreta: cualquiera que la
   tenga puede disparar un build.
7. En GitHub, abrir el repositorio.
8. Ir a **Settings** > **Secrets and variables** > **Actions**.
9. En la pestana **Secrets**, seleccionar **New repository secret**.
10. Crear este secret:

```text
Name: CLOUDFLARE_PAGES_DEPLOY_HOOK_URL
Secret: <pegar aqui la URL del Deploy Hook de Cloudflare>
```

11. Guardar el secret.
12. Verificar que el workflow exista en la rama `main`:

```text
.github/workflows/cloudflare-pages-refresh.yml
```

13. En GitHub, ir a **Actions** > **Refresh Cloudflare Pages**.
14. Seleccionar **Run workflow** para probarlo manualmente.
15. Confirmar que el workflow termina correctamente.
16. En Cloudflare Pages, revisar **Deployments** y confirmar que aparece un
    nuevo deploy iniciado por Deploy Hook.

El calendario semanal queda definido por esta expresion cron del workflow:

```yaml
schedule:
  - cron: "0 6 * * 1"
```

Eso significa lunes a las 06:00 UTC. En Chile puede equivaler a una hora local
distinta segun horario de verano/invierno.

Si el test manual falla:

- Revisar que el secret exista exactamente como `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`.
- Confirmar que el Deploy Hook apunte a la rama `main`.
- Confirmar que Cloudflare Pages tenga `CNE_API_BASE_URL`, `CNE_API_EMAIL` y
  `CNE_API_PASSWORD`.
- Revisar los logs del workflow en GitHub Actions y los logs del build en
  Cloudflare Pages.

## SEO

El dominio canonico vive en `app/site.ts`.

Next genera:

- `robots.txt` desde `app/robots.ts`
- `sitemap.xml` desde `app/sitemap.ts`
- metadata y JSON-LD desde `app/layout.tsx`

## Validacion antes de desplegar

Despues de actualizar paquetes, validar siempre lint y build antes de desplegar.

```bash
npm run lint
npm run build
```

Despues del build, verificar:

- `out/index.html`
- `out/robots.txt`
- `out/sitemap.xml`
- que no exista `out/api`
- que no aparezcan credenciales ni variables `CNE_API_*` en `out/`

## Recuperacion

Si un build programado falla, revisar logs de GitHub Actions y Cloudflare Pages.
El sitio publico debe seguir sirviendo el ultimo deploy exitoso.

Si un deploy rompe produccion, usar rollback en Cloudflare Pages al deploy
anterior estable y corregir en una rama antes de promover nuevamente.
