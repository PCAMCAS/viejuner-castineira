"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!firstName || !lastName || !whatsapp || !email || !password) {
      setErrorMessage("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setErrorMessage(signUpError.message);
      setIsLoading(false);
      return;
    }

    const userId = signUpData.user?.id;

    if (!userId) {
      setErrorMessage("No se ha podido crear el usuario.");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      whatsapp,
      role: "user",
    });

    if (profileError) {
      setErrorMessage(profileError.message);
      setIsLoading(false);
      return;
    }

    router.push("/catalog");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
          Nueva cuenta
        </p>

        <h1 className="text-3xl font-black">Registrarse</h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Crea tu cuenta para acceder al catálogo privado de miniaturas.
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <input
            name="firstName"
            type="text"
            placeholder="Nombre"
            autoComplete="given-name"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <input
            name="lastName"
            type="text"
            placeholder="Apellidos"
            autoComplete="family-name"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <input
            name="whatsapp"
            type="tel"
            placeholder="WhatsApp"
            autoComplete="tel"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
          />

          {errorMessage ? (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

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