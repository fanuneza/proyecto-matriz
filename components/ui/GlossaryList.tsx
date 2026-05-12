import { GLOSSARY } from "@/lib/glossary";

export function GlossaryList() {
  return (
    <section aria-label="Glosario">
      <h2>Glosario</h2>
      <dl>
        {GLOSSARY.map((entry) => (
          <div key={entry.term}>
            <dt>{entry.term}</dt>
            <dd>{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
