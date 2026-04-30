import Center from "@/modules/dev-document/components/center";

export function HomeDevDocSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ide-text-muted)]">
          User Manual
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ide-text)]">
          使用手册
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-[var(--ide-text-muted)]">
          这里提供面向最终用户的操作指南、注意事项与常见问题。
        </p>
      </div>

      <div className="mt-8">
        <Center variant="embedded" />
      </div>
    </section>
  );
}
