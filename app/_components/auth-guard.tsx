"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setIsCheckingSession(false);
    }

    checkSession();
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Acceso privado
          </p>

          <h1 className="mt-3 text-3xl font-black">Comprobando sesión</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Verificando si has iniciado sesión.
          </p>
        </section>
      </main>
    );
  }

  return children;
}