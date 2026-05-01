import Link from "next/link";
import { factions, gameSystems } from "../../../_data/catalog";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Nuevo item
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Crear producto
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Añade una miniatura individual o un lote al catálogo privado. Más
              adelante este formulario guardará el producto en Supabase y subirá
              la imagen a Storage.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Volver al panel
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
                placeholder="Ej: Bibliotecario Blood Angels de metal"
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
                placeholder="Estado, detalles, piezas incluidas, observaciones..."
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
                  placeholder="18"
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

                <select
                  id="condition"
                  name="condition"
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                >
                  <option value="" disabled>
                    Selecciona estado
                  </option>
                  <option value="new-on-sprue">Nuevo en matriz</option>
                  <option value="unassembled">Sin montar</option>
                  <option value="assembled">Montado</option>
                  <option value="primed">Imprimado</option>
                  <option value="painted">Pintado</option>
                  <option value="metal">Metal</option>
                  <option value="resin">Resina</option>
                  <option value="mixed">Mixto / lote variado</option>
                </select>
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
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                >
                  <option value="" disabled>
                    Selecciona sistema
                  </option>
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
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                >
                  <option value="" disabled>
                    Selecciona facción
                  </option>
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
                Imagen
              </p>

              <label
                htmlFor="image"
                className="mt-2 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-center transition hover:border-amber-500"
              >
                <span className="text-sm font-bold text-zinc-300">
                  Subir foto
                </span>
                <span className="mt-2 max-w-48 text-xs leading-5 text-zinc-500">
                  JPG, PNG o WEBP. Más adelante se guardará en Supabase Storage.
                </span>
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
              />
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              El producto aparecerá en el catálogo como disponible cuando se
              guarde.
            </div>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <span>
                <span className="block text-sm font-bold text-zinc-100">
                  Visible en catálogo
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  Puedes ocultarlo sin borrarlo.
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
              Crear producto
            </button>

            <Link
              href="/admin"
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