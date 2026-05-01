"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "../_components/auth-guard";
import { PageHeader } from "../_components/page-header";
import { supabase } from "../../lib/supabase/client";

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
  reservation_items: ReservationItem[];
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

export default function ReservationsPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isCancellingReservation, setIsCancellingReservation] = useState(false);

  async function loadReservation() {
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

    const { error: expireError } = await supabase.rpc(
      "expire_old_reservations",
    );

    if (expireError) {
      setErrorMessage(expireError.message);
      setReservation(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
          id,
          status,
          expires_at,
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
      .eq("user_id", user.id)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message);
      setReservation(null);
      setIsLoading(false);
      return;
    }

    setReservation((data as Reservation | null) ?? null);
    setIsLoading(false);
  }

  async function removeReservationItem(itemId: number) {
    const confirmRemove = window.confirm(
      "¿Seguro que quieres quitar este producto de tu reserva?",
    );

    if (!confirmRemove) {
      return;
    }

    setUpdatingItemId(itemId);
    setErrorMessage("");

    const { error } = await supabase.rpc("remove_reservation_item", {
      item_id_input: itemId,
    });

    if (error) {
      setErrorMessage(error.message);
      setUpdatingItemId(null);
      return;
    }

    await loadReservation();
    setUpdatingItemId(null);
  }

  async function cancelReservation() {
    if (!reservation) {
      return;
    }

    const confirmCancel = window.confirm(
      "¿Seguro que quieres cancelar la reserva completa? Todos los productos volverán al catálogo.",
    );

    if (!confirmCancel) {
      return;
    }

    setIsCancellingReservation(true);
    setErrorMessage("");

    const { error } = await supabase.rpc("cancel_active_reservation", {
      reservation_id_input: reservation.id,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsCancellingReservation(false);
      return;
    }

    await loadReservation();
    setIsCancellingReservation(false);
  }

  useEffect(() => {
    loadReservation();
  }, []);

  const reservationItems = reservation?.reservation_items ?? [];

  const totalPrice = reservationItems.reduce((total, item) => {
    return total + Number(item.price_at_reservation);
  }, 0);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-5xl">
          <PageHeader
            eyebrow="Cesta de reservas"
            title="Mis reservas"
            description="Estos productos quedan reservados durante 7 días. Finaliza el pedido por WhatsApp antes de que caduque la reserva."
            actions={
              <Link
                href="/catalog"
                className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
              >
                Volver al catálogo
              </Link>
            }
          />

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="text-lg font-bold text-zinc-100">
                Cargando reservas...
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo tu cesta desde Supabase.
              </p>
            </section>
          ) : null}

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se ha podido completar la acción.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {!isLoading && !errorMessage && !reservation ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-10 text-center shadow-2xl">
              <p className="text-lg font-bold text-zinc-100">
                No tienes reservas activas.
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Cuando reserves una miniatura desde el catálogo aparecerá aquí.
              </p>

              <Link
                href="/catalog"
                className="mt-6 inline-block rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Ir al catálogo
              </Link>
            </section>
          ) : null}

          {!isLoading && reservation ? (
            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {reservationItems.map((item) => {
                  const product = item.products;
                  const isUpdating = updatingItemId === item.id;

                  if (!product) {
                    return null;
                  }

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
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
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                              {getSystemName(product.game_system)}
                            </p>

                            <h2 className="mt-2 text-xl font-black">
                              {product.name}
                            </h2>

                            <p className="mt-2 text-sm text-zinc-400">
                              Facción: {product.faction}
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                              Estado: {product.condition}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <p className="text-2xl font-black">
                            {Number(item.price_at_reservation)} €
                          </p>

                          <button
                            type="button"
                            disabled={isUpdating || isCancellingReservation}
                            onClick={() => removeReservationItem(item.id)}
                            className="rounded-xl border border-red-500/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                          >
                            {isUpdating ? "Quitando..." : "Quitar"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Resumen
                </p>

                <div className="mt-5 space-y-4 text-sm text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Productos reservados</span>
                    <span className="font-bold text-zinc-100">
                      {reservationItems.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Caduca el</span>
                    <span className="font-bold text-zinc-100">
                      {formatDate(reservation.expires_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tiempo restante</span>
                    <span className="font-bold text-amber-400">
                      {getDaysLeft(reservation.expires_at)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between">
                      <span>Total reservado</span>
                      <span className="text-3xl font-black text-zinc-100">
                        {totalPrice} €
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                  Esta reserva todavía no implica pago online. La venta se
                  cerrará por WhatsApp.
                </div>

                <button
                  type="button"
                  disabled={
                    isCancellingReservation || reservationItems.length === 0
                  }
                  onClick={cancelReservation}
                  className="mt-6 w-full rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                >
                  {isCancellingReservation
                    ? "Cancelando..."
                    : "Cancelar reserva completa"}
                </button>
              </aside>
            </section>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}