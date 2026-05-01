import Link from "next/link";
import { notFound } from "next/navigation";
import { factions, gameSystems, products } from "../../../../_data/catalog";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Editar item
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Modifica los datos del producto. Más adelante este formulario
              guardará los cambios directamente en Supabase.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin/products"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              Volver a productos
            </Link>

            <Link
              href={`/product/${product.id}`}
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Ver ficha
            </Link>
          </nav>
        </header>

        <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <div>
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
              >
                Nombre del producto
              </label>

              <input
                id="name"
                name="name"
                type="text"
                defaultValue={product.name}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
              >
                Descripción
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={`Producto de ${product.faction}. Estado actual: ${product.condition}.`}
                className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Precio
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.price}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Estado físico
                </label>

                <input
                  id="condition"
                  name="condition"
                  type="text"
                  defaultValue={product.condition}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="system"
                  className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Sistema
                </label>

                <select
                  id="system"
                  name="system"
                  defaultValue={product.systemSlug}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                >
                  {gameSystems
                    .filter((system) => system.id !== "all")
                    .map((system) => (
                      <option key={system.id} value={system.slug}>
                        {system.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="faction"
                  className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Facción
                </label>

                <select
                  id="faction"
                  name="faction"
                  defaultValue={product.factionSlug}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                >
                  {factions
                    .filter((faction) => faction.id !== "all")
                    .map((faction) => (
                      <option key={faction.id} value={faction.slug}>
                        {faction.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Imagen actual
              </p>

              <div className="mt-2 flex aspect-square items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                  Imagen
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
              >
                Cambiar imagen
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-zinc-950"
              />
            </div>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <span>
                <span className="block text-sm font-bold text-zinc-100">
                  Visible en catálogo
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  Ocultarlo no borra el producto.
                </span>
              </span>

              <input
                type="checkbox"
                name="isVisible"
                defaultChecked
                className="h-5 w-5 accent-amber-500"
              />
            </label>

            <button
              type="button"
              className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              className="w-full rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200"
            >
              Marcar como vendido
            </button>

            <Link
              href="/admin/products"
              className="block text-center text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Cancelar
            </Link>
          </aside>
        </form>
      </section>
    </main>
  );
}