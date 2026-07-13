import styles from "./Stat.module.css";

type Props = {
  value: string;
  label: string;
  sub?: string;
  accent?: boolean;
};

export function Stat({ value, label, sub, accent }: Props) {
  return (
    <div className={`${styles.stat} ${accent ? styles.accent : ""}`}>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
