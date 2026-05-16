"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Regiones", href: "/regiones" },
  { label: "Tecnologías", href: "/tecnologias" },
  { label: "Comparar", href: "/comparar" },
  { label: "Datos", href: "/datos" },
  { label: "Archivo", href: "/archivo" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className={styles.header} role="banner">
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <Logo size={26} />
          <span className={styles.wordmark}>Proyecto Matriz</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${isActive(href) ? styles.active : ""}`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={styles.burger}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
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
        <nav aria-label="Navegación móvil">
          <ul className={styles.mobileNavList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.mobileNavLink} ${isActive(href) ? styles.active : ""}`}
                  aria-current={isActive(href) ? "page" : undefined}
                  tabIndex={open ? undefined : -1}
                  onClick={close}
                >
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
