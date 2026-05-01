"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "../_components/auth-guard";
import { LogoutButton } from "../_components/logout-button";
import { supabase } from "../../lib/supabase/client";

type Profile = {
  first_name: string;
  last_name: string;
  whatsapp: string;
  role: "user" | "admin";
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("No se ha podido leer la sesión.");
        setIsLoading(false);
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, whatsapp, role")
        .eq("id", user.id)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setProfile(data as Profile);
      setIsLoading(false);
    }

    loadProfile();
  }, []);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-3xl">
          <header className="border-b border-zinc-800 pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
              Cuenta
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Mi perfil
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Consulta tus datos de acceso y vuelve al catálogo o al panel de
              administración si tu cuenta tiene permisos.
            </p>
          </header>

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="font-bold text-zinc-100">Cargando perfil...</p>
            </section>
          ) : null}

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se ha podido cargar el perfil.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {!isLoading && profile ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Nombre
                  </p>
                  <p className="mt-2 text-lg font-bold text-zinc-100">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </p>
                  <p className="mt-2 text-lg font-bold text-zinc-100">
                    {email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    WhatsApp
                  </p>
                  <p className="mt-2 text-lg font-bold text-zinc-100">
                    {profile.whatsapp}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Rol
                  </p>
                  <p className="mt-2 text-lg font-bold text-zinc-100">
                    {profile.role === "admin" ? "Administrador" : "Usuario"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/catalog"
                  className="rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                >
                  Volver al catálogo
                </Link>

                {profile.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="rounded-xl bg-amber-500 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
                  >
                    Panel de administración
                  </Link>
                ) : null}

                <LogoutButton className="rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200" />
              </div>
            </section>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}