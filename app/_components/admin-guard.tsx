"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        router.replace("/catalog");
        return;
      }

      setIsCheckingAccess(false);
    }

    checkAdminAccess();
  }, [router]);

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Comprobando acceso
          </p>

          <h1 className="mt-3 text-3xl font-black">Panel privado</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Verificando si tu cuenta tiene permisos de administrador.
          </p>
        </section>
      </main>
    );
  }

  return children;
}