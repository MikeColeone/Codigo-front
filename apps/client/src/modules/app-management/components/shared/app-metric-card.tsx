interface AppMetricCardProps {
  label: string;
  value: string;
}

function AppMetricCard({ label, value }: AppMetricCardProps) {
  return (
    <div className="rounded-sm border border-[var(--ide-border)] bg-[var(--ide-sidebar-bg)] p-3">
      <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--ide-text-muted)]">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-[var(--ide-text)]">
        {value}
      </div>
    </div>
  );
}

export default AppMetricCard;
