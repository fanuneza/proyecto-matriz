import Link from "next/link";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Regiones", href: "/regiones" },
  { label: "Tecnologias", href: "/tecnologias" },
  { label: "Comparar", href: "/comparar" },
  { label: "Datos", href: "/datos" },
  { label: "Archivo", href: "/archivo" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.methodology}>
          <h2 className={styles.heading}>Metodologia</h2>
          <p>
            Los datos provienen de la API publica de la Comision Nacional de Energia
            (CNE). El sitio publica capacidad instalada operacional, proyectos en
            construccion y generacion distribuida agregada.
          </p>
        </div>

        <div className={styles.credits}>
          <nav aria-label="Enlaces del sitio" className={styles.nav}>
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className={styles.credit}>
            Desarrollo:{" "}
            <a
              href="https://agenciachucao.cl/?utm_source=proyecto-matriz&utm_medium=referral&utm_campaign=credit_footer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fabian Nunez
            </a>
          </p>
          <p className={styles.source}>
            Datos:{" "}
            <a href="https://api.cne.cl" target="_blank" rel="noopener noreferrer">
              Comision Nacional de Energia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
