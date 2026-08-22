import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import legal from "../legal.module.css";
import { buildPageMetadata } from "../seo";
import { LEGAL_UPDATED_ISO, legalUpdatedText } from "../site";

const CONSENT_KEY = "matriz_consent";

const TITLE = "Política de privacidad";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description:
    "Cómo Proyecto Matriz trata los datos de navegación, las cookies de analítica y tu preferencia de consentimiento.",
  path: "/privacidad",
});

const SECTIONS = [
  { id: "privacy-responsible", label: "Responsable del tratamiento" },
  { id: "privacy-data", label: "Información que recopilamos" },
  { id: "privacy-purpose", label: "Finalidad del tratamiento" },
  { id: "privacy-basis", label: "Base legal" },
  { id: "privacy-processors", label: "Proveedores y encargados" },
  { id: "privacy-retention", label: "Conservación" },
  { id: "privacy-rights", label: "Tus derechos" },
  { id: "privacy-cookies", label: "Cookies y analítica" },
];

export default function PrivacidadPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={TITLE}
      lede={
        <p>
          Te explicamos qué datos recopila este sitio, por qué lo hacemos, con
          quién los compartimos y cómo puedes ejercer tus derechos.
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
        <h2 className={shell.sectionTitle} id="privacy-responsible">
          Responsable del tratamiento
        </h2>
        <p className={shell.sectionText}>
          Esta política aplica al sitio{" "}
          <strong>matriz.fnunez.cl</strong> (Proyecto Matriz), editado por{" "}
          <strong>Fabián Núñez</strong>. Para cualquier consulta puedes
          escribirnos a través de{" "}
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

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-data">
          Información que recopilamos
        </h2>
        <p className={shell.sectionText}>
          Este sitio no tiene formularios, cuentas de usuario ni comentarios.
          La información que puede llegar a procesarse se limita a:
        </p>
        <ul className={legal.list}>
          <li>
            <strong>Cookies y analítica:</strong> solo si aceptas, Google Tag
            Manager carga Google Analytics 4, que deja cookies de analítica
            agregada en tu navegador (<code className={legal.code}>_ga</code>,{" "}
            <code className={legal.code}>_gid</code>). No recopilamos datos
            personales a través de la analítica.
          </li>
          <li>
            <strong>Preferencia de cookies:</strong> guardamos tu elección
            (aceptar o rechazar) en el almacenamiento local del navegador bajo
            la clave <code className={legal.code}>{CONSENT_KEY}</code>. Este
            registro no contiene datos personales.
          </li>
          <li>
            <strong>Registros técnicos:</strong> el hosting (Cloudflare) puede
            procesar direcciones IP y metadatos de conexión en registros
            efímeros, para seguridad y funcionamiento del servicio. Este sitio
            no accede a esos registros.
          </li>
          <li>
            <strong>Métricas sin cookies:</strong> Cloudflare Web Analytics
            mide tráfico agregado sin usar cookies ni identificar personas.
          </li>
        </ul>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-purpose">
          Finalidad del tratamiento
        </h2>
        <p className={shell.sectionText}>Usamos la información únicamente para:</p>
        <ul className={legal.list}>
          <li>Entender de forma agregada qué visualizaciones se usan más, si autorizas la analítica.</li>
          <li>Recordar tu preferencia de cookies.</li>
          <li>Mantener el sitio disponible y seguro.</li>
        </ul>
        <p className={shell.sectionText}>
          No vendemos, alquilamos ni compartimos datos personales con fines
          publicitarios ni de perfilamiento. Los anuncios están desactivados en
          la configuración de Google Analytics de este sitio.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-basis">
          Base legal
        </h2>
        <p className={shell.sectionText}>
          Esta página opera en Chile. El tratamiento de datos personales se
          realiza sobre la base del consentimiento informado para la analítica,
          y de la necesidad técnica mínima para prestar el servicio cuando
          navegas el sitio.
        </p>
        <p className={shell.sectionText}>
          Las cookies analíticas solo se activan después de que haces clic en{" "}
          <strong>Aceptar cookies</strong> en el aviso de consentimiento. Puedes
          retirar tu consentimiento en cualquier momento haciendo clic en{" "}
          <strong>Gestionar cookies</strong>, al pie de cualquier página.
        </p>
        <p className={shell.sectionText}>
          En esta página y en la{" "}
          <Link href="/politica-de-cookies">política de cookies</Link> el aviso
          no se abre automáticamente, para que puedas leerlas antes de decidir.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-processors">
          Proveedores y encargados
        </h2>
        <p className={shell.sectionText}>
          Tus datos pueden ser procesados por los siguientes servicios
          externos:
        </p>
        <ul className={legal.list}>
          <li>
            <strong>Google</strong> (Google Tag Manager y Google Analytics 4,
            solo con tu consentimiento):{" "}
            <a
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              política de privacidad de Google
            </a>
          </li>
          <li>
            <strong>Cloudflare</strong> (hosting, CDN y Web Analytics):{" "}
            <a
              href="https://www.cloudflare.com/privacy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              cloudflare.com/privacy
            </a>
          </li>
        </ul>
        <p className={shell.sectionText}>
          Estos proveedores pueden estar ubicados fuera de Chile. Al usarlos,
          tus datos quedan sujetos a las políticas de privacidad de cada
          servicio. Los datos públicos de la CNE que alimentan el sitio se
          consultan desde el servidor; tu navegador nunca se conecta a la API
          de la CNE.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-retention">
          Conservación
        </h2>
        <p className={shell.sectionText}>
          Los datos de Google Analytics se conservan según la retención
          configurada en esa plataforma. Tu preferencia de cookies se mantiene
          en el almacenamiento local de tu navegador hasta que la cambies o
          borres los datos del sitio.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-rights">
          Tus derechos
        </h2>
        <p className={shell.sectionText}>
          Puedes pedirnos acceso, rectificación o eliminación de cualquier dato
          personal escribiéndonos por{" "}
          <a
            href="https://github.com/fanuneza"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          . Dado que este sitio no procesa datos personales identificables más
          allá de lo descrito, en la práctica bastará con rechazar o borrar las
          cookies desde tu navegador.
        </p>
      </section>

      <section className={`${shell.section} ${legal.section}`}>
        <h2 className={shell.sectionTitle} id="privacy-cookies">
          Cookies y analítica
        </h2>
        <p className={shell.sectionText}>
          Para más detalles sobre las cookies que usamos, cómo aceptarlas,
          rechazarlas o retirar tu consentimiento, revisa nuestra{" "}
          <Link href="/politica-de-cookies">política de cookies</Link>.
        </p>
        <p>
          <button type="button" className={legal.manageButton} data-consent-reopen="">
            Gestionar cookies
          </button>
        </p>
      </section>
    </PageShell>
  );
}
