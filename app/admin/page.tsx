"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "../_components/logout-button";
import { PageHeader } from "../_components/page-header";
import { supabase } from "../../lib/supabase/client";

const adminStats = [
  {
    label: "Productos activos",
    value: 6,
    description: "Disponibles o reservados en el catálogo",
  },
  {
    label: "Reservas activas",
    value: 3,
    description: "Clientes con productos bloqueados",
  },
  {
    label: "Pendiente por vender",
    value: "148 €",
    description: "Importe total de reservas activas",
  },
];

const recentReservations = [
  {
    id: 1,
    customer: "Carlos Martínez",
    whatsapp: "600 000 000",
    items: 2,
    total: 60,
    expiresIn: "5 días",
    status: "Activa",
  },
  {
    id: 2,
    customer: "Laura Pérez",
    whatsapp: "611 111 111",
    items: 1,
    total: 42,
    expiresIn: "2 días",
    status: "Activa",
  },
  {
    id: 3,
    customer: "Miguel Sánchez",
    whatsapp: "622 222 222",
    items: 3,
    total: 46,
    expiresIn: "6 días",
    status: "Activa",
  },
];

export default function AdminPage() {
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

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Panel privado"
          title="Administración"
          description="Gestiona productos, reservas y ventas sin tocar el código de la aplicación."
          actions={
            <nav className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
              >
                Ver catálogo
              </Link>

              <LogoutButton className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400" />
            </nav>
          }
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {adminStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl"
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                {stat.label}
              </p>

              <p className="mt-4 text-4xl font-black text-zinc-50">
                {stat.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {stat.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <Link
              href="/admin/products/new"
              className="block rounded-2xl border border-amber-500/40 bg-amber-500 px-6 py-5 text-zinc-950 shadow-2xl transition hover:bg-amber-400"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em]">
                Producto nuevo
              </p>

              <p className="mt-3 text-2xl font-black">Crear item</p>

              <p className="mt-2 text-sm font-semibold">
                Añadir miniatura, lote, precio, facción y foto.
              </p>
            </Link>

            <Link
              href="/admin/products"
              className="block rounded-2xl border border-zinc-800 bg-zinc-900/70 px-6 py-5 shadow-2xl transition hover:border-amber-500/60"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                Inventario
              </p>

              <p className="mt-3 text-2xl font-black text-zinc-100">
                Gestionar productos
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Editar precios, ocultar productos o marcar items como vendidos.
              </p>
            </Link>

            <Link
              href="/admin/reservations"
              className="block rounded-2xl border border-zinc-800 bg-zinc-900/70 px-6 py-5 shadow-2xl transition hover:border-amber-500/60"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                Reservas
              </p>

              <p className="mt-3 text-2xl font-black text-zinc-100">
                Ver reservas
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Revisar clientes, WhatsApp, productos reservados y caducidades.
              </p>
            </Link>
          </aside>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Actividad reciente
                </p>

                <h2 className="mt-2 text-2xl font-black">Reservas activas</h2>
              </div>

              <Link
                href="/admin/reservations"
                className="text-sm font-bold text-amber-400 transition hover:text-amber-300"
              >
                Ver todas
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {recentReservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-black">
                        {reservation.customer}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        WhatsApp: {reservation.whatsapp}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                      {reservation.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                    <p>
                      Items:{" "}
                      <span className="font-bold text-zinc-100">
                        {reservation.items}
                      </span>
                    </p>

                    <p>
                      Total:{" "}
                      <span className="font-bold text-zinc-100">
                        {reservation.total} €
                      </span>
                    </p>

                    <p>
                      Caduca en:{" "}
                      <span className="font-bold text-amber-400">
                        {reservation.expiresIn}
                      </span>
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400">
                      Marcar como vendida
                    </button>

                    <button className="rounded-xl border border-red-500/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200">
                      Cancelar reserva
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}