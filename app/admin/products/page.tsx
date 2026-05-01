import Link from "next/link";
import { products } from "../../_data/catalog";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Inventario
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Gestionar productos
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Revisa los items del catálogo, cambia su visibilidad o márcalos
              como vendidos cuando una reserva se cierre.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin/products/new"
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
            >
              Crear producto
            </Link>

            <Link
              href="/admin"
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Volver al panel
            </Link>
          </nav>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-2xl">
          <div className="grid grid-cols-1 gap-4 border-b border-zinc-800 p-5 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:grid-cols-[1fr_160px_160px_130px_220px]">
            <span>Producto</span>
            <span>Sistema</span>
            <span>Facción</span>
            <span>Precio</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-zinc-800">
            {products.map((product) => {
              const isReserved = product.status === "Reservado";

              return (
                <article
                  key={product.id}
                  className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_160px_160px_130px_220px] md:items-center"
                >
                  <div>
                    <p className="text-lg font-black text-zinc-100">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      Estado físico: {product.condition}
                    </p>

                    <span
                      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        isReserved
                          ? "bg-zinc-800 text-zinc-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300">{product.system}</p>

                  <p className="text-sm text-zinc-300">{product.faction}</p>

                  <p className="text-2xl font-black">{product.price} €</p>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                    >
                      Editar
                    </Link>

                    <button className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400">
                      Ocultar
                    </button>

                    <button className="rounded-xl border border-red-500/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200">
                      Vendido
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}