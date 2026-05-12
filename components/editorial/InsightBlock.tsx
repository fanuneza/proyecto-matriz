type Props = {
  title: string;
  value: string;
  context: string;
  source?: string;
};

export function InsightBlock({ title, value, context, source }: Props) {
  return (
    <figure role="figure" aria-label={title}>
      <figcaption>{title}</figcaption>
      <p>{value}</p>
      <p>{context}</p>
      {source ? <cite>{source}</cite> : null}
    </figure>
  );
}
