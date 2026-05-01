"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard } from "../_components/admin-guard";
import { LogoutButton } from "../_components/logout-button";
import { PageHeader } from "../_components/page-header";
import { supabase } from "../../lib/supabase/client";

type Profile = {
  first_name: string;
  last_name: string;
  whatsapp: string;
};

type ReservationItem = {
  id: number;
  price_at_reservation: number;
};

type Reservation = {
  id: number;
  status:
    | "active"
    | "expired"
    | "cancelled_by_user"
    | "cancelled_by_admin"
    | "sold";
  expires_at: string;
  profiles: Profile | null;
  reservation_items: ReservationItem[];
};

type RawReservation = {
  id: number;
  status:
    | "active"
    | "expired"
    | "cancelled_by_user"
    | "cancelled_by_admin"
    | "sold";
  expires_at: string;
  profiles: Profile | Profile[] | null;
  reservation_items: ReservationItem[];
};

type AdminStats = {
  activeProducts: number;
  activeReservations: number;
  pendingAmount: number;
};

function getSingleValue<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function normalizeReservation(rawReservation: RawReservation): Reservation {
  return {
    id: rawReservation.id,
    status: rawReservation.status,
    expires_at: rawReservation.expires_at,
    profiles: getSingleValue(rawReservation.profiles),
    reservation_items: rawReservation.reservation_items ?? [],
  };
}

function getReservationTotal(items: ReservationItem[]) {
  return items.reduce((total, item) => {
    return total + Number(item.price_at_reservation);
  }, 0);
}

function getDaysLeft(date: string) {
  const now = new Date();
  const expiresAt = new Date(date);
  const difference = expiresAt.getTime() - now.getTime();
  const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return "Caducada";
  }

  if (daysLeft === 1) {
    return "1 día";
  }

  return `${daysLeft} días`;
}

function getCustomerName(profile: Profile | null) {
  if (!profile) {
    return "Cliente sin perfil";
  }

  return `${profile.first_name} ${profile.last_name}`;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    activeProducts: 0,
    activeReservations: 0,
    pendingAmount: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadAdminDashboard() {
    setIsLoading(true);
    setErrorMessage("");

    const { error: expireError } = await supabase.rpc(
      "expire_old_reservations",
    );

    if (expireError) {
      setErrorMessage(expireError.message);
      setIsLoading(false);
      return;
    }

    const { count: activeProductsCount, error: productsError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_visible", true)
      .in("status", ["available", "reserved"]);

    if (productsError) {
      setErrorMessage(productsError.message);
      setIsLoading(false);
      return;
    }

    const { count: activeReservationsCount, error: reservationsCountError } =
      await supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString());

    if (reservationsCountError) {
      setErrorMessage(reservationsCountError.message);
      setIsLoading(false);
      return;
    }

    const { data: reservationsData, error: reservationsError } = await supabase
      .from("reservations")
      .select(
        `
          id,
          status,
          expires_at,
          profiles (
            first_name,
            last_name,
            whatsapp
          ),
          reservation_items (
            id,
            price_at_reservation
          )
        `,
      )
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (reservationsError) {
      setErrorMessage(reservationsError.message);
      setIsLoading(false);
      return;
    }

    const normalizedReservations = (
      (reservationsData ?? []) as unknown as RawReservation[]
    ).map(normalizeReservation);

    const pendingAmount = normalizedReservations.reduce((total, reservation) => {
      return total + getReservationTotal(reservation.reservation_items);
    }, 0);

    setStats({
      activeProducts: activeProductsCount ?? 0,
      activeReservations: activeReservationsCount ?? 0,
      pendingAmount,
    });

    setRecentReservations(normalizedReservations.slice(0, 3));
    setIsLoading(false);
  }

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  return (
    <AdminGuard>
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

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="text-lg font-bold text-zinc-100">
                Cargando panel...
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo productos y reservas reales desde Supabase.
              </p>
            </section>
          ) : null}

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se ha podido cargar el panel.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {!isLoading && !errorMessage ? (
            <>
              <section className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Productos activos
                  </p>

                  <p className="mt-4 text-4xl font-black text-zinc-50">
                    {stats.activeProducts}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Disponibles o reservados visibles en el catálogo.
                  </p>
                </article>

                <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Reservas activas
                  </p>

                  <p className="mt-4 text-4xl font-black text-zinc-50">
                    {stats.activeReservations}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Clientes con productos bloqueados actualmente.
                  </p>
                </article>

                <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Pendiente por vender
                  </p>

                  <p className="mt-4 text-4xl font-black text-zinc-50">
                    {stats.pendingAmount} €
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Importe total de reservas activas.
                  </p>
                </article>
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
                      Editar precios, ocultar productos o marcar items como
                      vendidos.
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
                      Revisar clientes, WhatsApp, productos reservados y
                      caducidades.
                    </p>
                  </Link>
                </aside>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Actividad reciente
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        Reservas activas
                      </h2>
                    </div>

                    <Link
                      href="/admin/reservations"
                      className="text-sm font-bold text-amber-400 transition hover:text-amber-300"
                    >
                      Ver todas
                    </Link>
                  </div>

                  {recentReservations.length === 0 ? (
                    <section className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-center">
                      <p className="font-bold text-zinc-100">
                        No hay reservas activas.
                      </p>

                      <p className="mt-2 text-sm text-zinc-400">
                        Cuando un usuario reserve miniaturas aparecerán aquí.
                      </p>
                    </section>
                  ) : null}

                  {recentReservations.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {recentReservations.map((reservation) => {
                        const total = getReservationTotal(
                          reservation.reservation_items,
                        );

                        return (
                          <article
                            key={reservation.id}
                            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="text-lg font-black">
                                  {getCustomerName(reservation.profiles)}
                                </p>

                                <p className="mt-1 text-sm text-zinc-400">
                                  WhatsApp:{" "}
                                  {reservation.profiles?.whatsapp ??
                                    "No disponible"}
                                </p>
                              </div>

                              <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                                Activa
                              </span>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                              <p>
                                Items:{" "}
                                <span className="font-bold text-zinc-100">
                                  {reservation.reservation_items.length}
                                </span>
                              </p>

                              <p>
                                Total:{" "}
                                <span className="font-bold text-zinc-100">
                                  {total} €
                                </span>
                              </p>

                              <p>
                                Caduca en:{" "}
                                <span className="font-bold text-amber-400">
                                  {getDaysLeft(reservation.expires_at)}
                                </span>
                              </p>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <Link
                                href="/admin/reservations"
                                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
                              >
                                Gestionar reserva
                              </Link>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              </section>
            </>
          ) : null}
        </section>
      </main>
    </AdminGuard>
  );
}