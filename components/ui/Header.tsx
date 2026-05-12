"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Regiones", href: "/regiones" },
  { label: "Tecnologias", href: "/tecnologias" },
  { label: "Comparar", href: "/comparar" },
  { label: "Datos", href: "/datos" },
  { label: "Archivo", href: "/archivo" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className={styles.header} role="banner">
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <Logo size={26} />
          <span className={styles.wordmark}>Proyecto Matriz</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegacion principal">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={styles.burger}
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ""}`} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!open}
      >
        <nav aria-label="Navegacion movil">
          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.mobileNavLink} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
