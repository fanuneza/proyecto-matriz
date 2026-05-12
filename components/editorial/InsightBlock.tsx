import styles from "./InsightBlock.module.css";

type Props = {
  title: string;
  value: string;
  context: string;
  source?: string;
};

export function InsightBlock({ title, value, context, source }: Props) {
  return (
    <figure role="figure" aria-label={title} className={styles.block}>
      <figcaption className={styles.title}>{title}</figcaption>
      <p className={styles.value}>{value}</p>
      <p className={styles.context}>{context}</p>
      {source ? <cite className={styles.source}>{source}</cite> : null}
    </figure>
  );
}
