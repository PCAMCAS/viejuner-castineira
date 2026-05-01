"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type AdminGuardProps = {
  children: ReactNode;
};

type AccessStatus = "checking" | "allowed" | "denied";

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const [accessStatus, setAccessStatus] = useState<AccessStatus>("checking");
  const [message, setMessage] = useState("Verificando sesión...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function checkAdminAccess() {
      setMessage("Comprobando usuario autenticado...");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setAccessStatus("denied");
        setMessage("No se ha podido comprobar la sesión.");
        setDetails(userError.message);
        return;
      }

      if (!user) {
        setAccessStatus("denied");
        setMessage("No hay ninguna sesión iniciada.");
        setDetails("Inicia sesión con tu cuenta de administrador.");
        return;
      }

      setMessage("Comprobando permisos de administrador...");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setAccessStatus("denied");
        setMessage("No se ha podido leer tu perfil.");
        setDetails(profileError.message);
        return;
      }

      if (!profile) {
        setAccessStatus("denied");
        setMessage("Tu usuario no tiene perfil asociado.");
        setDetails("Existe sesión, pero no hay fila en la tabla profiles.");
        return;
      }

      if (profile.role !== "admin") {
        setAccessStatus("denied");
        setMessage("Tu cuenta no tiene permisos de administrador.");
        setDetails(`Rol actual detectado: ${profile.role}`);
        return;
      }

      setAccessStatus("allowed");
    }

    checkAdminAccess();
  }, []);

  if (accessStatus === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Comprobando acceso
          </p>

          <h1 className="mt-3 text-3xl font-black">Panel privado</h1>

          <p className="mt-3 text-sm text-zinc-400">{message}</p>
        </section>
      </main>
    );
  }

  if (accessStatus === "denied") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Acceso denegado
          </p>

          <h1 className="mt-3 text-3xl font-black">{message}</h1>

          {details ? (
            <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left text-sm text-zinc-400">
              {details}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
            >
              Ir al login
            </Link>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              Reintentar
            </button>
          </div>
        </section>
      </main>
    );
  }

  return children;
}