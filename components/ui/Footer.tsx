import Link from "next/link";
import { HomeLink } from "./HomeLink";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const EXPLORE_LINKS = [
  { label: "Regiones", href: "/regiones" },
  { label: "Tecnologías", href: "/tecnologias" },
  { label: "Comparar", href: "/comparar" },
];

const RESOURCE_LINKS = [
  { label: "Datos", href: "/datos" },
  { label: "Archivo", href: "/archivo" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <HomeLink className={styles.brand}>
            <Logo size={20} />
            <span className={styles.wordmark}>Proyecto Matriz</span>
          </HomeLink>
          <p className={styles.tagline}>
            Exploración visual de la transición energética chilena a partir de
            datos abiertos de la CNE.
          </p>
        </div>

        <div className={styles.linksCol}>
          <div className={styles.linkGroup}>
            <p className={styles.groupLabel}>Explorar</p>
            <ul className={styles.linkList}>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <p className={styles.groupLabel}>Recursos</p>
            <ul className={styles.linkList}>
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.sourceCol}>
          <p className={styles.groupLabel}>Fuente</p>
          <p className={styles.sourceText}>
            Datos de la API pública de la{" "}
            <a
              href="https://api.cne.cl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Comisión Nacional de Energía
            </a>
            : capacidad instalada operacional (<em>capacidad/instaladagx</em>),
            proyectos en construcción (<em>proyectosenconstrucciongx</em>) y
            generación distribuida (<em>netbilling</em>).
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.credit}>
          Desarrollo:{" "}
          <a
            href="https://fnunez.cl/?utm_source=proyecto-matriz&utm_medium=referral&utm_campaign=credit_footer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fabián Núñez
          </a>
        </p>
        <HomeLink className={styles.homeLink}>Proyecto Matriz</HomeLink>
      </div>
    </footer>
  );
}
