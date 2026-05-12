import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./PageShell.module.css";

type NavLink = {
  href: string;
  label: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  lede: ReactNode;
  navLinks?: NavLink[];
  asideTitle?: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  lede,
  navLinks = [],
  asideTitle,
  aside,
  children,
}: Props) {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          {navLinks.length > 0 ? (
            <nav className={styles.nav} aria-label="Navegacion de la seccion">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className={styles.intro}>
            <div className={styles.copy}>
              {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.lede}>{lede}</div>
            </div>

            {aside ? (
              <aside className={styles.aside}>
                {asideTitle ? <p className={styles.asideTitle}>{asideTitle}</p> : null}
                <div className={styles.asideBody}>{aside}</div>
              </aside>
            ) : null}
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </main>
  );
}
