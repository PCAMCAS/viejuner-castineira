"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard } from "../../_components/admin-guard";
import { supabase } from "../../../lib/supabase/client";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  game_system: string;
  faction: string;
  condition: string;
  status: "available" | "reserved" | "sold" | "hidden";
  is_visible: boolean;
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

function getStatusLabel(status: Product["status"]) {
  const statusLabels: Record<Product["status"], string> = {
    available: "Disponible",
    reserved: "Reservado",
    sold: "Vendido",
    hidden: "Oculto",
  };

  return statusLabels[status];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null,
  );

  async function loadProducts() {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, game_system, faction, condition, status, is_visible",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setProducts((data ?? []) as Product[]);
    setIsLoading(false);
  }

  async function hideProduct(productId: number) {
    const confirmHide = window.confirm(
      "¿Seguro que quieres ocultar este producto del catálogo?",
    );

    if (!confirmHide) return;

    setUpdatingProductId(productId);
    setErrorMessage("");

    const { error } = await supabase
      .from("products")
      .update({
        is_visible: false,
        status: "hidden",
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      setErrorMessage(error.message);
      setUpdatingProductId(null);
      return;
    }

    await loadProducts();
    setUpdatingProductId(null);
  }

  async function showProduct(productId: number) {
    const confirmShow = window.confirm(
      "¿Seguro que quieres volver a mostrar este producto en el catálogo?",
    );

    if (!confirmShow) return;

    setUpdatingProductId(productId);
    setErrorMessage("");

    const { error } = await supabase
      .from("products")
      .update({
        is_visible: true,
        status: "available",
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      setErrorMessage(error.message);
      setUpdatingProductId(null);
      return;
    }

    await loadProducts();
    setUpdatingProductId(null);
  }

  async function markProductAsSold(productId: number) {
    const confirmSold = window.confirm(
      "¿Seguro que quieres marcar este producto como vendido? Desaparecerá del catálogo.",
    );

    if (!confirmSold) return;

    setUpdatingProductId(productId);
    setErrorMessage("");

    const { error } = await supabase
      .from("products")
      .update({
        status: "sold",
        is_visible: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      setErrorMessage(error.message);
      setUpdatingProductId(null);
      return;
    }

    await loadProducts();
    setUpdatingProductId(null);
  }

  async function reactivateProduct(productId: number) {
    const confirmReactivate = window.confirm(
      "¿Seguro que quieres reactivar este producto? Volverá a aparecer como disponible en el catálogo.",
    );

    if (!confirmReactivate) return;

    setUpdatingProductId(productId);
    setErrorMessage("");

    const { error } = await supabase
      .from("products")
      .update({
        status: "available",
        is_visible: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      setErrorMessage(error.message);
      setUpdatingProductId(null);
      return;
    }

    await loadProducts();
    setUpdatingProductId(null);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Inventario
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Gestionar productos
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Revisa los items reales guardados en Supabase, cambia su
                visibilidad o márcalos como vendidos cuando una reserva se
                cierre.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-4">
              <Link
                href="/admin/products/new"
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Crear producto
              </Link>

              <Link
                href="/admin"
                className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
              >
                Volver al panel
              </Link>
            </nav>
          </header>

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se ha podido completar la acción.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <p className="text-lg font-bold text-zinc-100">
                Cargando productos...
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo el inventario desde Supabase.
              </p>
            </section>
          ) : null}

          {!isLoading && products.length > 0 ? (
            <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-2xl">
              <div className="grid grid-cols-1 gap-4 border-b border-zinc-800 p-5 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 md:grid-cols-[1fr_150px_150px_120px_270px]">
                <span>Producto</span>
                <span>Sistema</span>
                <span>Facción</span>
                <span>Precio</span>
                <span>Acciones</span>
              </div>

              <div className="divide-y divide-zinc-800">
                {products.map((product) => {
                  const isReserved = product.status === "reserved";
                  const isSold = product.status === "sold";
                  const isHidden =
                    product.status === "hidden" || !product.is_visible;
                  const isUpdating = updatingProductId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_150px_150px_120px_270px] md:items-center"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
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
                          <p className="text-lg font-black text-zinc-100">
                            {product.name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-400">
                            Estado físico: {product.condition}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                isReserved
                                  ? "bg-zinc-800 text-zinc-400"
                                  : isSold
                                    ? "bg-red-500/10 text-red-300"
                                    : isHidden
                                      ? "bg-zinc-800 text-zinc-400"
                                      : "bg-emerald-500/10 text-emerald-400"
                              }`}
                            >
                              {getStatusLabel(product.status)}
                            </span>

                            {isHidden ? (
                              <span className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-400">
                                No visible
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-300">
                        {getSystemName(product.game_system)}
                      </p>

                      <p className="text-sm text-zinc-300">{product.faction}</p>

                      <p className="text-2xl font-black">
                        {Number(product.price)} €
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                        >
                          Editar
                        </Link>

                        {isSold ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => reactivateProduct(product.id)}
                            className="rounded-xl border border-emerald-500/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                          >
                            {isUpdating ? "..." : "Reactivar"}
                          </button>
                        ) : isHidden ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => showProduct(product.id)}
                            className="rounded-xl border border-emerald-500/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                          >
                            {isUpdating ? "..." : "Mostrar"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => hideProduct(product.id)}
                            className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                          >
                            {isUpdating ? "..." : "Ocultar"}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isUpdating || isSold}
                          onClick={() => markProductAsSold(product.id)}
                          className="rounded-xl border border-red-500/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                        >
                          {isUpdating ? "..." : "Vendido"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {!isLoading && !errorMessage && products.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <p className="text-lg font-bold text-zinc-100">
                Todavía no hay productos.
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Crea el primer producto desde el panel de administración.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-block rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Crear producto
              </Link>
            </section>
          ) : null}
        </section>
      </main>
    </AdminGuard>
  );
}