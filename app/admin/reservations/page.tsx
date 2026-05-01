"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard } from "../../_components/admin-guard";
import { supabase } from "../../../lib/supabase/client";

type Profile = {
  first_name: string;
  last_name: string;
  whatsapp: string;
};

type Product = {
  id: number;
  name: string;
  image_url: string | null;
  game_system: string;
  faction: string;
  condition: string;
};

type ReservationItem = {
  id: number;
  price_at_reservation: number;
  products: Product | null;
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

type RawReservationItem = {
  id: number;
  price_at_reservation: number;
  products: Product | Product[] | null;
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
  reservation_items: RawReservationItem[];
};

function getSystemName(system: string) {
  const systemNames: Record<string, string> = {
    "40k": "Warhammer 40K",
    aos: "Age of Sigmar",
    fantasy: "Warhammer Fantasy",
    otros: "Otros",
  };

  return systemNames[system] ?? system;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function getReservationTotal(items: ReservationItem[]) {
  return items.reduce((total, item) => {
    return total + Number(item.price_at_reservation);
  }, 0);
}

function getStatusLabel(status: Reservation["status"]) {
  const labels: Record<Reservation["status"], string> = {
    active: "Activa",
    expired: "Caducada",
    cancelled_by_user: "Cancelada por usuario",
    cancelled_by_admin: "Cancelada por admin",
    sold: "Vendida",
  };

  return labels[status];
}

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
    reservation_items: rawReservation.reservation_items.map((item) => ({
      id: item.id,
      price_at_reservation: item.price_at_reservation,
      products: getSingleValue(item.products),
    })),
  };
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadReservations() {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
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
            price_at_reservation,
            products (
              id,
              name,
              image_url,
              game_system,
              faction,
              condition
            )
          )
        `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setReservations([]);
      setIsLoading(false);
      return;
    }

    const normalizedReservations = ((data ?? []) as unknown as RawReservation[])
      .map(normalizeReservation);

    setReservations(normalizedReservations);
    setIsLoading(false);
  }

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <AdminGuard>
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

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="text-lg font-bold text-zinc-100">
                Cargando reservas...
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo reservas reales desde Supabase.
              </p>
            </section>
          ) : null}

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se han podido cargar las reservas.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {!isLoading && !errorMessage && reservations.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-10 text-center shadow-2xl">
              <p className="text-lg font-bold text-zinc-100">
                No hay reservas activas.
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Cuando un usuario reserve miniaturas aparecerán aquí.
              </p>
            </section>
          ) : null}

          {!isLoading && reservations.length > 0 ? (
            <section className="mt-8 space-y-5">
              {reservations.map((reservation) => {
                const profile = reservation.profiles;
                const items = reservation.reservation_items ?? [];
                const total = getReservationTotal(items);

                return (
                  <article
                    key={reservation.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl"
                  >
                    <div className="flex flex-col gap-5 border-b border-zinc-800 pb-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-black">
                            {profile
                              ? `${profile.first_name} ${profile.last_name}`
                              : "Cliente sin perfil"}
                          </h2>

                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-400">
                            {getStatusLabel(reservation.status)}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                          <p>
                            WhatsApp:{" "}
                            <span className="font-bold text-zinc-200">
                              {profile?.whatsapp ?? "No disponible"}
                            </span>
                          </p>

                          <p>Reserva #{reservation.id}</p>
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
                            {formatDate(reservation.expires_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Productos reservados
                      </p>

                      <div className="mt-4 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/40">
                        {items.map((item) => {
                          const product = item.products;

                          if (!product) {
                            return null;
                          }

                          return (
                            <div
                              key={item.id}
                              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex gap-4">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                                  {product.image_url ? (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-wide text-zinc-700">
                                      Sin foto
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold text-zinc-200">
                                    {product.name}
                                  </p>

                                  <p className="mt-1 text-sm text-zinc-500">
                                    {getSystemName(product.game_system)} ·{" "}
                                    {product.faction} · {product.condition}
                                  </p>
                                </div>
                              </div>

                              <p className="text-lg font-black">
                                {Number(item.price_at_reservation)} €
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl border border-zinc-800 px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-600"
                      >
                        Marcar vendida pronto
                      </button>

                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl border border-zinc-800 px-4 py-3 text-xs font-bold uppercase tracking-wide text-zinc-600"
                      >
                        Cancelar pronto
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : null}
        </section>
      </main>
    </AdminGuard>
  );
}