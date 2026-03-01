export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-3xl font-semibold tracking-tightest text-text-primary">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm font-light text-text-secondary">{subtitle}</p> : null}
    </div>
  );
}
