type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center shadow-sm sm:p-12">
      <div className="max-w-lg">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
          Placeholder
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-4 leading-7 text-ink-muted">{description}</p>
      </div>
    </section>
  );
}
