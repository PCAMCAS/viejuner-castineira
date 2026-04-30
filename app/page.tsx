import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-amber-500">
          Reliquias, plomo y plástico veterano
        </p>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-zinc-50 sm:text-7xl">
          Viejuner Castiñeira
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Catálogo privado de miniaturas antiguas de Warhammer. Reserva tus
          piezas durante 7 días y finaliza el pedido por WhatsApp.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-amber-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-bold uppercase tracking-wide text-zinc-100 transition hover:border-amber-500 hover:text-amber-400"
          >
            Registrarse
          </Link>
        </div>
      </section>
    </main>
  );
}