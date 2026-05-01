import { Suspense } from "react";
import CatalogContent from "./catalog-content";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Catálogo privado
            </p>

            <h1 className="mt-3 text-3xl font-black">Cargando catálogo</h1>

            <p className="mt-3 text-sm text-zinc-400">
              Preparando filtros y productos.
            </p>
          </section>
        </main>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}