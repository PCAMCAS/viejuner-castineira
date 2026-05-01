import Link from "next/link";

const adminReservations = [
  {
    id: 1,
    customer: "Carlos Martínez",
    email: "carlos@example.com",
    whatsapp: "600 000 000",
    status: "Activa",
    expiresAt: "06/05/2026",
    items: [
      {
        id: 1,
        name: "Bibliotecario Blood Angels de metal",
        price: 18,
      },
      {
        id: 4,
        name: "Necrones clásicos lote inicial",
        price: 28,
      },
    ],
  },
  {
    id: 2,
    customer: "Laura Pérez",
    email: "laura@example.com",
    whatsapp: "611 111 111",
    status: "Activa",
    expiresAt: "04/05/2026",
    items: [
      {
        id: 2,
        name: "Pack Eldars clásicos",
        price: 42,
      },
    ],
  },
  {
    id: 3,
    customer: "Miguel Sánchez",
    email: "miguel@example.com",
    whatsapp: "622 222 222",
    status: "Activa",
    expiresAt: "07/05/2026",
    items: [
      {
        id: 6,
        name: "Skaven antiguos lote ratas de clan",
        price: 25,
      },
      {
        id: 8,
        name: "Condes Vampiro esqueletos antiguos",
        price: 22,
      },
    ],
  },
];

function getReservationTotal(items: { price: number }[]) {
  return items.reduce((total, item) => total + item.price, 0);
}

export default function AdminReservationsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Reservas
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Gestionar reservas
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Revisa qué ha reservado cada usuario, prepara pedidos y marca las
              reservas como vendidas cuando cierres la venta por WhatsApp.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
            >
              Volver al panel
            </Link>

            <Link
              href="/catalog"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              Ver catálogo
            </Link>
          </nav>
        </header>

        <section className="mt-8 space-y-5">
          {adminReservations.map((reservation) => {
            const total = getReservationTotal(reservation.items);

            return (
              <article
                key={reservation.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl"
              >
                <div className="flex flex-col gap-5 border-b border-zinc-800 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black">
                        {reservation.customer}
                      </h2>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                        {reservation.status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                      <p>Email: {reservation.email}</p>
                      <p>WhatsApp: {reservation.whatsapp}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 lg:min-w-72">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">Total</span>
                      <span className="text-3xl font-black">{total} €</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">Caduca</span>
                      <span className="font-bold text-amber-400">
                        {reservation.expiresAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Productos reservados
                  </p>

                  <div className="mt-4 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/40">
                    {reservation.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-4"
                      >
                        <p className="font-semibold text-zinc-200">
                          {item.name}
                        </p>

                        <p className="text-lg font-black">{item.price} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400">
                    Marcar como vendida
                  </button>

                  <button className="rounded-xl border border-red-500/40 px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200">
                    Cancelar reserva
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}