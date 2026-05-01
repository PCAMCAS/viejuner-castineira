"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AdminGuard } from "../../../../_components/admin-guard";
import { factions, gameSystems } from "../../../../_data/catalog";
import { supabase } from "../../../../../lib/supabase/client";

const PRODUCT_IMAGES_BUCKET = "product-images";

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadProduct() {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, game_system, faction, condition, status, is_visible",
      )
      .eq("id", productId)
      .single();

    if (error) {
      setErrorMessage(error.message);
      setProduct(null);
      setIsLoading(false);
      return;
    }

    setProduct(data as Product);
    setIsLoading(false);
  }

  async function uploadNewImage(image: File) {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedImageTypes.includes(image.type)) {
      throw new Error("La imagen debe ser JPG, PNG o WEBP.");
    }

    const fileExtension = image.name.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, image);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async function handleSaveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const name = String(formData.get("name") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      const price = Number(formData.get("price"));
      const condition = String(formData.get("condition") ?? "").trim();
      const gameSystem = String(formData.get("system") ?? "").trim();
      const faction = String(formData.get("faction") ?? "").trim();
      const isVisible = formData.get("isVisible") === "on";
      const image = formData.get("image");

      if (!name || !description || !condition || !gameSystem || !faction) {
        throw new Error("Rellena todos los campos obligatorios.");
      }

      if (!price || price <= 0) {
        throw new Error("El precio debe ser mayor que 0.");
      }

      let imageUrl = product.image_url;

      if (image instanceof File && image.size > 0) {
        imageUrl = await uploadNewImage(image);
      }

      let nextStatus = product.status;

      if (product.status !== "sold" && product.status !== "reserved") {
        nextStatus = isVisible ? "available" : "hidden";
      }

      const { error } = await supabase
        .from("products")
        .update({
          name,
          description,
          price,
          condition,
          game_system: gameSystem,
          faction,
          image_url: imageUrl,
          is_visible: isVisible,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No se han podido guardar los cambios.");
      }

      setIsSaving(false);
    }
  }

  async function markProductAsSold() {
    if (!product) {
      return;
    }

    const confirmSold = window.confirm(
      "¿Seguro que quieres marcar este producto como vendido? Desaparecerá del catálogo.",
    );

    if (!confirmSold) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("products")
      .update({
        status: "sold",
        is_visible: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  useEffect(() => {
    if (!productId) {
      setErrorMessage("ID de producto no válido.");
      setIsLoading(false);
      return;
    }

    loadProduct();
  }, [productId]);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-5xl">
          {isLoading ? (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Editar item
              </p>

              <h1 className="mt-3 text-3xl font-black">
                Cargando producto...
              </h1>
            </section>
          ) : null}

          {!isLoading && errorMessage && !product ? (
            <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                Error
              </p>

              <h1 className="mt-3 text-3xl font-black">
                No se ha podido cargar el producto
              </h1>

              <p className="mt-4 text-sm">{errorMessage}</p>

              <Link
                href="/admin/products"
                className="mt-6 inline-block rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Volver a productos
              </Link>
            </section>
          ) : null}

          {!isLoading && product ? (
            <>
              <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                    Editar item
                  </p>

                  <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                    {product.name}
                  </h1>

                  <p className="mt-4 max-w-2xl text-zinc-400">
                    Modifica los datos del producto real guardado en Supabase.
                  </p>
                </div>

                <nav className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/admin/products"
                    className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                  >
                    Volver a productos
                  </Link>

                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
                  >
                    Ver ficha
                  </Link>
                </nav>
              </header>

              <form
                onSubmit={handleSaveProduct}
                className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"
              >
                <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                    >
                      Nombre del producto
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={product.name}
                      className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                    >
                      Descripción
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      defaultValue={product.description ?? ""}
                      className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="price"
                        className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                      >
                        Precio
                      </label>

                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={Number(product.price)}
                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="condition"
                        className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                      >
                        Estado físico
                      </label>

                      <input
                        id="condition"
                        name="condition"
                        type="text"
                        defaultValue={product.condition}
                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="system"
                        className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                      >
                        Sistema
                      </label>

                      <select
                        id="system"
                        name="system"
                        defaultValue={product.game_system}
                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                      >
                        {gameSystems
                          .filter((system) => system.id !== "all")
                          .map((system) => (
                            <option key={system.id} value={system.slug}>
                              {system.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="faction"
                        className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                      >
                        Facción
                      </label>

                      <select
                        id="faction"
                        name="faction"
                        defaultValue={product.faction}
                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                      >
                        {factions
                          .filter((faction) => faction.id !== "all")
                          .map((faction) => (
                            <option key={faction.id} value={faction.name}>
                              {faction.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </section>

                <aside className="h-fit space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Imagen actual
                    </p>

                    <div className="mt-2 aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                            Sin imagen
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="image"
                      className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                    >
                      Cambiar imagen
                    </label>

                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-zinc-950"
                    />
                  </div>

                  <label className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                    <span>
                      <span className="block text-sm font-bold text-zinc-100">
                        Visible en catálogo
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        Ocultarlo no borra el producto.
                      </span>
                    </span>

                    <input
                      type="checkbox"
                      name="isVisible"
                      defaultChecked={product.is_visible}
                      className="h-5 w-5 accent-amber-500"
                    />
                  </label>

                  {errorMessage ? (
                    <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {errorMessage}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || product.status === "sold"}
                    onClick={markProductAsSold}
                    className="w-full rounded-xl border border-red-500/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
                  >
                    Marcar como vendido
                  </button>

                  <Link
                    href="/admin/products"
                    className="block text-center text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
                  >
                    Cancelar
                  </Link>
                </aside>
              </form>
            </>
          ) : null}
        </section>
      </main>
    </AdminGuard>
  );
}