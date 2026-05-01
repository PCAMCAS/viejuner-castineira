import Link from "next/link";
import { PageHeader } from "../_components/page-header";

const reservationItems = [
  {
    id: 1,
    name: "Bibliotecario Blood Angels de metal",
    system: "Warhammer 40K",
    faction: "Blood Angels",
    price: 18,
  },
  {
    id: 2,
    name: "Necrones clásicos lote inicial",
    system: "Warhammer 40K",
    faction: "Necrones",
    price: 28,
  },
  {
    id: 3,
    name: "Altos Elfos lanceros clásicos",
    system: "Warhammer Fantasy",
    faction: "Altos Elfos",
    price: 32,
  },
];

const totalPrice = reservationItems.reduce((total, item) => {
  return total + item.price;
}, 0);

export default function ReservationsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Cesta de reservas"
          title="Mis reservas"
          description="Estos productos quedan reservados durante 7 días. Finaliza el pedido por WhatsApp antes de que caduque la reserva."
          actions={
            <Link
              href="/catalog"
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Volver al catálogo
            </Link>
          }
        />

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {reservationItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                      {item.system}
                    </p>

                    <h2 className="mt-2 text-xl font-black">{item.name}</h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      Facción: {item.faction}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-2xl font-black">{item.price} €</p>

                    <button className="rounded-xl border border-red-500/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200">
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
              Resumen
            </p>

            <div className="mt-5 space-y-4 text-sm text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Productos reservados</span>
                <span className="font-bold text-zinc-100">
                  {reservationItems.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Caducidad</span>
                <span className="font-bold text-amber-400">7 días</span>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <span>Total reservado</span>
                  <span className="text-3xl font-black text-zinc-100">
                    {totalPrice} €
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              Esta reserva todavía no implica pago online. La venta se cerrará
              por WhatsApp.
            </div>

            <button className="mt-6 w-full rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200">
              Cancelar reserva completa
            </button>
          </aside>
        </section>
      </section>
    </main>
  );
}