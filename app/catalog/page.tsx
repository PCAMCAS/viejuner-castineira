import Link from "next/link";
import { factions, gameSystems, products } from "../_data/catalog";

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Catálogo privado
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Miniaturas disponibles
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Filtra por sistema, facción y precio. Los productos reservados se
              muestran en el catálogo, pero no se pueden volver a reservar.
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
          >
            Salir
          </Link>
        </header>

        <section className="mt-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Sistema
            </span>

            <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500">
              {gameSystems.map((system) => (
                <option key={system.id} value={system.slug}>
                  {system.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Facción
            </span>

            <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500">
              {factions.map((faction) => (
                <option key={faction.id} value={faction.slug}>
                  {faction.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Ordenar
            </span>

            <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500">
              <option value="price-asc">Precio ascendente</option>
              <option value="price-desc">Precio descendente</option>
            </select>
          </label>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const isReserved = product.status === "Reservado";

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-zinc-950">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                    Imagen
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                        {product.system}
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        {product.name}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isReserved
                          ? "bg-zinc-800 text-zinc-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-zinc-400">
                    <p>Facción: {product.faction}</p>
                    <p>Estado: {product.condition}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-3xl font-black">{product.price} €</p>

                    <button
                      disabled={isReserved}
                      className={`rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition ${
                        isReserved
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                          : "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                      }`}
                    >
                      {isReserved ? "Reservado" : "Reservar"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}