"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGuard } from "../_components/auth-guard";
import { LogoutButton } from "../_components/logout-button";
import { PageHeader } from "../_components/page-header";
import { factions, gameSystems } from "../_data/catalog";
import { supabase } from "../../lib/supabase/client";

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

function getSystemName(systemSlug: string) {
  return (
    gameSystems.find((system) => system.slug === systemSlug)?.name ??
    systemSlug
  );
}

function getStatusLabel(status: Product["status"]) {
  if (status === "reserved") {
    return "Reservado";
  }

  if (status === "sold") {
    return "Vendido";
  }

  if (status === "hidden") {
    return "Oculto";
  }

  return "Disponible";
}

export default function CatalogContent() {
  const searchParams = useSearchParams();

  const selectedSystem = searchParams.get("system") ?? "all";
  const selectedFaction = searchParams.get("faction") ?? "all";
  const selectedSort = searchParams.get("sort") ?? "price-asc";

  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reservingProductId, setReservingProductId] = useState<number | null>(
    null,
  );

  const availableFactions =
    selectedSystem === "all"
      ? factions
      : factions.filter(
          (faction) =>
            faction.id === "all" || faction.gameSystemId === selectedSystem,
        );

  async function loadProducts() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error: expireError } = await supabase.rpc(
      "expire_old_reservations",
    );

    if (expireError) {
      setErrorMessage(expireError.message);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, game_system, faction, condition, status, is_visible",
      )
      .eq("is_visible", true)
      .in("status", ["available", "reserved"]);

    if (error) {
      setErrorMessage(error.message);
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setProducts((data ?? []) as Product[]);
    setIsLoading(false);
  }

  async function handleReserveProduct(product: Product) {
    if (product.status === "reserved") {
      return;
    }

    setReservingProductId(product.id);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase.rpc("reserve_product", {
      product_id_input: product.id,
    });

    if (error) {
      setErrorMessage(error.message);
      setReservingProductId(null);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) => {
        if (currentProduct.id !== product.id) {
          return currentProduct;
        }

        return {
          ...currentProduct,
          status: "reserved",
        };
      }),
    );

    setSuccessMessage(`Has reservado "${product.name}".`);
    setReservingProductId(null);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (selectedSystem === "all") {
        return true;
      }

      return product.game_system === selectedSystem;
    })
    .filter((product) => {
      if (selectedFaction === "all") {
        return true;
      }

      return product.faction === selectedFaction;
    })
    .sort((a, b) => {
      if (selectedSort === "price-desc") {
        return Number(b.price) - Number(a.price);
      }

      return Number(a.price) - Number(b.price);
    });

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-7xl">
          <PageHeader
            eyebrow="Catálogo privado"
            title="Miniaturas disponibles"
            description="Filtra por sistema, facción y precio. Los productos reservados se muestran en el catálogo, pero no se pueden volver a reservar."
            actions={
              <nav className="flex flex-wrap items-center gap-4">
                <Link
                  href="/profile"
                  className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                >
                  Mi perfil
                </Link>

                <Link
                  href="/reservations"
                  className="rounded-full border border-amber-500/50 px-5 py-2 text-sm font-bold uppercase tracking-wide text-amber-400 transition hover:border-amber-400 hover:text-amber-300"
                >
                  Mis reservas
                </Link>

                <LogoutButton className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400" />
              </nav>
            }
          />

          <form
            action="/catalog"
            className="mt-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-4"
          >
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Sistema
              </span>

              <select
                name="system"
                defaultValue={selectedSystem}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {gameSystems.map((system) => (
                  <option key={system.id} value={system.slug}>
                    {system.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Facción
              </span>

              <select
                name="faction"
                defaultValue={selectedFaction}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {availableFactions.map((faction) => (
                  <option
                    key={faction.id}
                    value={faction.id === "all" ? "all" : faction.name}
                  >
                    {faction.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Ordenar
              </span>

              <select
                name="sort"
                defaultValue={selectedSort}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                <option value="price-asc">Precio ascendente</option>
                <option value="price-desc">Precio descendente</option>
              </select>
            </label>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Filtrar
              </button>

              <Link
                href="/catalog"
                className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-400 transition hover:border-amber-500 hover:text-amber-400"
              >
                Limpiar
              </Link>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando{" "}
              <span className="font-bold text-zinc-100">
                {filteredProducts.length}
              </span>{" "}
              producto{filteredProducts.length === 1 ? "" : "s"}.
            </p>

            <p>
              Filtros activos:{" "}
              <span className="text-zinc-300">
                {selectedSystem === "all"
                  ? "Todos los sistemas"
                  : getSystemName(selectedSystem)}
                {" · "}
                {selectedFaction === "all"
                  ? "Todas las facciones"
                  : selectedFaction}
                {" · "}
                {selectedSort === "price-desc"
                  ? "Precio descendente"
                  : "Precio ascendente"}
              </span>
            </p>
          </div>

          {errorMessage ? (
            <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
              <p className="font-bold">No se ha podido completar la acción.</p>
              <p className="mt-2 text-sm">{errorMessage}</p>
            </section>
          ) : null}

          {successMessage ? (
            <section className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-emerald-200">
              <p className="font-bold">{successMessage}</p>

              <Link
                href="/reservations"
                className="mt-3 inline-block text-sm font-bold text-amber-400 transition hover:text-amber-300"
              >
                Ver mis reservas
              </Link>
            </section>
          ) : null}

          {isLoading ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <p className="text-lg font-bold text-zinc-100">
                Cargando productos...
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo el catálogo desde Supabase.
              </p>
            </section>
          ) : null}

          {!isLoading && filteredProducts.length > 0 ? (
            <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isReserved = product.status === "reserved";
                const isReserving = reservingProductId === product.id;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                              Sin imagen
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            {getSystemName(product.game_system)}
                          </p>

                          <Link href={`/product/${product.id}`}>
                            <h2 className="mt-2 text-xl font-black transition hover:text-amber-400">
                              {product.name}
                            </h2>
                          </Link>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isReserved
                              ? "bg-zinc-800 text-zinc-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </div>

                      <div className="mt-5 space-y-2 text-sm text-zinc-400">
                        <p>Facción: {product.faction}</p>
                        <p>Estado: {product.condition}</p>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <p className="text-3xl font-black">
                          {Number(product.price)} €
                        </p>

                        <button
                          type="button"
                          disabled={isReserved || isReserving}
                          onClick={() => handleReserveProduct(product)}
                          className={`rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition ${
                            isReserved
                              ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                              : "bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                          }`}
                        >
                          {isReserving
                            ? "Reservando..."
                            : isReserved
                              ? "Reservado"
                              : "Reservar"}
                        </button>
                      </div>

                      <Link
                        href={`/product/${product.id}`}
                        className="mt-4 inline-block text-sm font-bold text-amber-400 transition hover:text-amber-300"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : null}

          {!isLoading && !errorMessage && filteredProducts.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
              <p className="text-lg font-bold text-zinc-100">
                No hay miniaturas con esos filtros.
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                Prueba con otro sistema, facción u orden de precio.
              </p>
            </section>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}