import { GLOSSARY } from "@/lib/glossary";
import styles from "./ContentBlocks.module.css";

export function GlossaryList() {
  return (
    <section aria-label="Glosario" className={styles.section}>
      <h2>Glosario</h2>
      <dl className={styles.glossary}>
        {GLOSSARY.map((entry) => (
          <div key={entry.term} className={styles.entry}>
            <dt className={styles.term}>{entry.term}</dt>
            <dd className={styles.definition}>{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
