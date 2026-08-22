import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import legal from "../legal.module.css";
import { buildPageMetadata } from "../seo";
import { LEGAL_UPDATED_ISO, legalUpdatedText } from "../site";

const CONSENT_KEY = "matriz_consent";

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gtmId =
  typeof rawGtmId === "string" && /^GTM-[A-Z0-9]+$/.test(rawGtmId)
    ? rawGtmId
    : null;

const TITLE = "Política de cookies";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description:
    "Cookies y almacenamiento local que usa Proyecto Matriz, para qué sirven y cómo gestionar tu consentimiento.",
  path: "/politica-de-cookies",
});

const SECTIONS = [
  { id: "cookies-definicion", label: "Qué son las cookies y el almacenamiento local" },
  { id: "cookies-usadas", label: "Cookies y almacenamiento que usamos" },
  { id: "cookies-gtm", label: "Google Tag Manager y Google Analytics" },
  { id: "cookies-consentimiento", label: "Cómo gestionamos el consentimiento" },
  { id: "cookies-retiro", label: "Cómo retirar el consentimiento" },
  { id: "cookies-proveedores", label: "Proveedores relacionados" },
  { id: "cookies-mas", label: "Más información" },
];

export default function PoliticaDeCookiesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={TITLE}
      lede={
        <p>
          Información sobre las cookies que usamos, para qué sirven y cómo
          puedes gestionar tu consentimiento.
        </p>
      }
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: TITLE },
      ]}
    >
      <p className={legal.updated}>
        Última actualización:{" "}
        <time dateTime={LEGAL_UPDATED_ISO}>{legalUpdatedText()}</time>
      </p>

      <nav className={legal.toc} aria-label="Contenido de esta página">
        <p className={legal.tocTitle}>En esta página</p>
        <ol className={legal.tocList}>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-definicion">
          Qué son las cookies y el almacenamiento local
        </h2>
        <p className={shell.sectionText}>
          Las cookies son pequeños archivos de texto que un sitio web guarda en
          tu navegador para recordar información entre visitas. También usamos
          el <strong>almacenamiento local del navegador</strong> para guardar tu
          preferencia de cookies, con la misma finalidad y sin acceder a
          información fuera de tu navegador.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-usadas">
          Cookies y almacenamiento que usamos
        </h2>
        <p className={shell.sectionText}>Proyecto Matriz usa exclusivamente:</p>
        <div className={legal.tableWrap} role="region" aria-label="Tabla de cookies usadas en este sitio" tabIndex={0}>
          <table className={legal.table}>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Propósito</th>
                <th scope="col">Duración</th>
                <th scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className={legal.code}>{CONSENT_KEY}</code>
                </td>
                <td>
                  Almacena tu preferencia de cookies (aceptar o rechazar) en el
                  navegador.
                </td>
                <td>Hasta que cambies tu elección o borres los datos del sitio</td>
                <td>Necesaria / preferencias</td>
              </tr>
              <tr>
                <td>
                  <code className={legal.code}>_ga</code>,{" "}
                  <code className={legal.code}>_ga_*</code>,{" "}
                  <code className={legal.code}>_gid</code>
                </td>
                <td>
                  Cookies de Google Analytics 4 para análisis agregado del
                  tráfico. Solo se cargan si aceptas.
                </td>
                <td>Hasta 2 años</td>
                <td>Analítica (opcional)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-gtm">
          Google Tag Manager y Google Analytics
        </h2>
        <p className={shell.sectionText}>
          {gtmId ? (
            <>
              Usamos Google Tag Manager con el identificador{" "}
              <code className={legal.code}>{gtmId}</code> para cargar Google
              Analytics 4 solo cuando das tu consentimiento. Antes de aceptar,
              no se descarga ningún script de analítica ni se envían datos a
              Google.
            </>
          ) : (
            <>
              Este sitio puede usar Google Tag Manager para cargar Google
              Analytics 4, pero solo cuando existe una configuración de
              analítica activa y tú autorizas su uso. Antes de aceptar, no se
              descarga ningún script de analítica ni se envían datos a Google.
            </>
          )}
        </p>
        <p className={shell.sectionText}>
          Si aceptas, Google Analytics recopila información agregada sobre
          páginas visitadas, dispositivos y origen del tráfico. No enviamos
          datos personales a través de la analítica.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-consentimiento">
          Cómo gestionamos el consentimiento
        </h2>
        <p className={shell.sectionText}>
          La primera vez que visitas matriz.fnunez.cl se abre un aviso de
          consentimiento sobre la página. Puedes hacer clic en{" "}
          <strong>Aceptar cookies</strong> para autorizar la analítica, o en{" "}
          <strong>Rechazar cookies</strong> para denegarla.
        </p>
        <p className={shell.sectionText}>
          Tu decisión se guarda en el almacenamiento local del navegador bajo la
          clave <code className={legal.code}>{CONSENT_KEY}</code>. Mientras no
          exista una elección guardada, Google Analytics 4 no se carga ni se
          envía ningún dato a Google.
        </p>
        <p className={shell.sectionText}>
          La única excepción son la <Link href="/privacidad">política de privacidad</Link>{" "}
          y esta página: en ellas el aviso no se abre automáticamente, para que
          puedas leerlas antes de decidir. Siempre puedes abrirlo desde{" "}
          <strong>Gestionar cookies</strong>, al pie de cualquier página.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-retiro">
          Cómo retirar el consentimiento
        </h2>
        <p className={shell.sectionText}>
          Puedes cambiar tu preferencia en cualquier momento con el siguiente
          control, disponible también al pie de todas las páginas del sitio.
        </p>
        <p>
          <button type="button" className={legal.manageButton} data-consent-reopen="">
            Gestionar cookies
          </button>
        </p>
        <p className={shell.sectionText}>
          Ese botón retira la autorización de analítica y vuelve a mostrar el
          aviso para que elijas de nuevo. También puedes borrar las cookies y
          los datos de almacenamiento local desde la configuración de tu
          navegador.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-proveedores">
          Proveedores relacionados
        </h2>
        <p className={shell.sectionText}>
          El sitio se conecta con servicios externos que tienen sus propias
          políticas de privacidad y cookies:
        </p>
        <ul className={legal.list}>
          <li>
            Google Analytics y Google Tag Manager:{" "}
            <a
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              política de privacidad de Google
            </a>
          </li>
          <li>
            Cloudflare (hosting y métricas técnicas agregadas sin cookies):{" "}
            <a
              href="https://www.cloudflare.com/privacy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              cloudflare.com/privacy
            </a>
          </li>
        </ul>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="cookies-mas">
          Más información
        </h2>
        <p className={shell.sectionText}>
          Para saber cómo tratamos tus datos personales, revisa nuestra{" "}
          <Link href="/privacidad">política de privacidad</Link>. Si tienes
          dudas sobre cookies o consentimiento, escríbenos por{" "}
          <a
            href="https://github.com/fanuneza"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
