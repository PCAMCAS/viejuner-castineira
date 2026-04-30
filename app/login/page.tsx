import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
          Acceso privado
        </p>

        <h1 className="text-3xl font-black">Iniciar sesión</h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Próximamente conectaremos este formulario con Supabase Auth.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <button className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400">
            Entrar
          </button>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-amber-400"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}