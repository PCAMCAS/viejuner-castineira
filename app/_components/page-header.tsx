import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-zinc-400">{description}</p>
      </div>

      {actions ? <div>{actions}</div> : null}
    </header>
  );
}