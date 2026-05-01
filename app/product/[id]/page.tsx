import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../_data/catalog";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  const isReserved = product.status === "Reservado";

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Detalle del producto
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Revisa el sistema, facción, estado físico y disponibilidad antes
              de añadirlo a tu cesta de reservas.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/catalog"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              Volver al catálogo
            </Link>

            <Link
              href="/reservations"
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Mis reservas
            </Link>
          </nav>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex aspect-[4/3] items-center justify-center bg-zinc-950">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                Imagen del producto
              </span>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                  {product.system}
                </p>

                <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  isReserved
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {product.status}
              </span>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 text-sm text-zinc-400">
              <div className="flex items-center justify-between gap-4">
                <span>Facción</span>
                <span className="font-bold text-zinc-100">
                  {product.faction}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Estado físico</span>
                <span className="font-bold text-zinc-100">
                  {product.condition}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                <span>Precio</span>
                <span className="text-3xl font-black text-zinc-100">
                  {product.price} €
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              Las reservas duran 7 días. La venta final se cerrará por
              WhatsApp, sin pago online.
            </div>

            <button
              disabled={isReserved}
              className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${
                isReserved
                  ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  : "bg-amber-500 text-zinc-950 hover:bg-amber-400"
              }`}
            >
              {isReserved ? "Producto reservado" : "Reservar producto"}
            </button>
          </aside>
        </section>
      </section>
    </main>
  );
}