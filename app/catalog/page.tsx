import Link from "next/link";
import { AuthGuard } from "../_components/auth-guard";
import { LogoutButton } from "../_components/logout-button";
import { PageHeader } from "../_components/page-header";
import { factions, gameSystems, products } from "../_data/catalog";

type CatalogSearchParams = {
  system?: string | string[];
  faction?: string | string[];
  sort?: string | string[];
};

type CatalogPageProps = {
  searchParams?: Promise<CatalogSearchParams>;
};

function getParamValue(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const selectedSystem = getParamValue(params?.system, "all");
  const selectedFaction = getParamValue(params?.faction, "all");
  const selectedSort = getParamValue(params?.sort, "price-asc");

  const availableFactions =
    selectedSystem === "all"
      ? factions
      : factions.filter(
          (faction) =>
            faction.id === "all" || faction.gameSystemId === selectedSystem,
        );

  const filteredProducts = products
    .filter((product) => {
      if (selectedSystem === "all") {
        return true;
      }

      return product.systemSlug === selectedSystem;
    })
    .filter((product) => {
      if (selectedFaction === "all") {
        return true;
      }

      return product.factionSlug === selectedFaction;
    })
    .sort((a, b) => {
      if (selectedSort === "price-desc") {
        return b.price - a.price;
      }

      return a.price - b.price;
    });

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-7xl">
          <PageHeader
            eyebrow="Catálogo privado"
            title="Miniaturas disponibles"
            description="Filtra por sistema, facción y precio. Los productos reservados se muestran en el catálogo, pero no se pueden volver a reservar."
            actions={
              <nav className="flex flex-wrap items-center gap-4">
                <Link
                  href="/reservations"
                  className="rounded-full border border-amber-500/50 px-5 py-2 text-sm font-bold uppercase tracking-wide text-amber-400 transition hover:border-amber-400 hover:text-amber-300"
                >
                  Mis reservas
                </Link>

                <LogoutButton className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400" />
              </nav>
            }
          />

          <form
            action="/catalog"
            className="mt-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-4"
          >
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Sistema
              </span>

              <select
                name="system"
                defaultValue={selectedSystem}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
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

              <select
                name="faction"
                defaultValue={selectedFaction}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {availableFactions.map((faction) => (
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

              <select
                name="sort"
                defaultValue={selectedSort}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                <option value="price-asc">Precio ascendente</option>
                <option value="price-desc">Precio descendente</option>
              </select>
            </label>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Filtrar
              </button>

              <Link
                href="/catalog"
                className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-400 transition hover:border-amber-500 hover:text-amber-400"
              >
                Limpiar
              </Link>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando{" "}
              <span className="font-bold text-zinc-100">
                {filteredProducts.length}
              </span>{" "}
              producto{filteredProducts.length === 1 ? "" : "s"}.
            </p>

            <p>
              Filtros activos:{" "}
              <span className="text-zinc-300">
                {selectedSystem === "all"
                  ? "Todos los sistemas"
                  : selectedSystem}
                {" · "}
                {selectedFaction === "all"
                  ? "Todas las facciones"
                  : selectedFaction}
                {" · "}
                {selectedSort === "price-desc"
                  ? "Precio descendente"
                  : "Precio ascendente"}
              </span>
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isReserved = product.status === "Reservado";

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center bg-zinc-950 transition hover:bg-zinc-900">
                        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                          Imagen
                        </span>
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            {product.system}
                          </p>

                          <Link href={`/product/${product.id}`}>
                            <h2 className="mt-2 text-xl font-black transition hover:text-amber-400">
                              {product.name}
                            </h2>
                          </Link>
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

                      <Link
                        href={`/product/${product.id}`}
                        className="mt-4 inline-block text-sm font-bold text-amber-400 transition hover:text-amber-300"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <p className="text-lg font-bold text-zinc-100">
                No hay miniaturas con esos filtros.
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Prueba con otro sistema, facción u orden de precio.
              </p>
            </section>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}