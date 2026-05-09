"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { AuthGuard } from "../../_components/auth-guard";
import { gameSystems } from "../../_data/catalog";
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

type Profile = {
  first_name: string;
  last_name: string;
  role: "user" | "admin";
};

type ProductComment = {
  id: number;
  product_id: number;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
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

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [commentErrorMessage, setCommentErrorMessage] = useState("");
  const [commentSuccessMessage, setCommentSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );

  const loadCurrentProfile = useCallback(async function loadCurrentProfile() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, role")
      .eq("id", user.id)
      .single();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(data as Profile);
  }, []);

  const loadComments = useCallback(async function loadComments() {
    if (!productId) {
      setComments([]);
      return;
    }

    const { data, error } = await supabase
      .from("product_comments")
      .select("id, product_id, user_id, author_name, body, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      setCommentErrorMessage(error.message);
      setComments([]);
      return;
    }

    setComments((data ?? []) as ProductComment[]);
  }, [productId]);

  const loadProduct = useCallback(async function loadProduct() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setCommentErrorMessage("");
    setCommentSuccessMessage("");

    if (!productId) {
      setErrorMessage("Producto no válido.");
      setProduct(null);
      setComments([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, game_system, faction, condition, status, is_visible",
      )
      .eq("id", productId)
      .eq("is_visible", true)
      .in("status", ["available", "reserved"])
      .single();

    if (error) {
      setErrorMessage("No se ha encontrado este producto.");
      setProduct(null);
      setComments([]);
      setIsLoading(false);
      return;
    }

    setProduct(data as Product);
    await Promise.all([loadCurrentProfile(), loadComments()]);
    setIsLoading(false);
  }, [loadComments, loadCurrentProfile, productId]);

  async function handleReserveProduct() {
    if (!product) {
      return;
    }

    setIsReserving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase.rpc("reserve_product", {
      product_id_input: product.id,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsReserving(false);
      return;
    }

    setProduct({
      ...product,
      status: "reserved",
    });

    setSuccessMessage("Producto reservado correctamente.");
    setIsReserving(false);
    router.refresh();
  }

  async function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product || !profile) {
      setCommentErrorMessage("No se ha podido identificar tu perfil.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = String(formData.get("comment") ?? "").trim();

    setCommentErrorMessage("");
    setCommentSuccessMessage("");

    if (!body) {
      setCommentErrorMessage("Escribe un comentario antes de publicarlo.");
      return;
    }

    if (body.length > 500) {
      setCommentErrorMessage("El comentario no puede superar 500 caracteres.");
      return;
    }

    setIsSubmittingComment(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setCommentErrorMessage("No se ha podido comprobar la sesión.");
      setIsSubmittingComment(false);
      return;
    }

    const { data, error } = await supabase
      .from("product_comments")
      .insert({
        product_id: product.id,
        user_id: user.id,
        author_name: `${profile.first_name} ${profile.last_name}`.trim(),
        body,
      })
      .select("id, product_id, user_id, author_name, body, created_at")
      .single();

    if (error) {
      setCommentErrorMessage(error.message);
      setIsSubmittingComment(false);
      return;
    }

    setComments((currentComments) => [
      data as ProductComment,
      ...currentComments,
    ]);
    form.reset();
    setCommentSuccessMessage("Comentario publicado correctamente.");
    setIsSubmittingComment(false);
  }

  async function handleDeleteComment(comment: ProductComment) {
    if (profile?.role !== "admin") {
      setCommentErrorMessage("Sólo el admin puede eliminar comentarios.");
      return;
    }

    const shouldDelete = window.confirm(
      "¿Seguro que quieres eliminar este comentario?",
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingCommentId(comment.id);
    setCommentErrorMessage("");
    setCommentSuccessMessage("");

    const { error } = await supabase
      .from("product_comments")
      .delete()
      .eq("id", comment.id);

    if (error) {
      setCommentErrorMessage(error.message);
      setDeletingCommentId(null);
      return;
    }

    setComments((currentComments) =>
      currentComments.filter((currentComment) => currentComment.id !== comment.id),
    );
    setCommentSuccessMessage("Comentario eliminado correctamente.");
    setDeletingCommentId(null);
  }

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const isReserved = product?.status === "reserved";
  const isAdmin = profile?.role === "admin";

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
        <section className="mx-auto max-w-6xl">
          {isLoading ? (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                Detalle del producto
              </p>

              <h1 className="mt-3 text-3xl font-black">
                Cargando producto...
              </h1>

              <p className="mt-3 text-sm text-zinc-400">
                Leyendo la miniatura desde Supabase.
              </p>
            </section>
          ) : null}

          {!isLoading && errorMessage && !product ? (
            <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">
                Producto no disponible
              </p>

              <h1 className="mt-3 text-3xl font-black">{errorMessage}</h1>

              <p className="mt-4 text-sm">
                Puede que el producto esté vendido, oculto o que ya no exista.
              </p>

              <Link
                href="/catalog"
                className="mt-6 inline-block rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
              >
                Volver al catálogo
              </Link>
            </section>
          ) : null}

          {!isLoading && product ? (
            <>
              <header className="flex flex-col gap-6 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                    Detalle del producto
                  </p>

                  <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                    {product.name}
                  </h1>

                  <p className="mt-4 max-w-2xl text-zinc-400">
                    Revisa el sistema, facción, estado físico y disponibilidad
                    antes de añadirlo a tu cesta de reservas.
                  </p>
                </div>

                <nav className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/catalog"
                    className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-bold uppercase tracking-wide text-zinc-300 transition hover:border-amber-500 hover:text-amber-400"
                  >
                    Volver al catálogo
                  </Link>

                  <Link
                    href="/reservations"
                    className="text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
                  >
                    Mis reservas
                  </Link>
                </nav>
              </header>

              <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
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

                <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                        {getSystemName(product.game_system)}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {product.name}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        isReserved
                          ? "bg-zinc-800 text-zinc-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  {product.description ? (
                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Descripción
                      </p>

                      <p className="mt-3 text-sm leading-6 text-zinc-300">
                        {product.description}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 text-sm text-zinc-400">
                    <div className="flex items-center justify-between gap-4">
                      <span>Facción</span>
                      <span className="font-bold text-zinc-100">
                        {product.faction}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span>Estado físico</span>
                      <span className="font-bold text-zinc-100">
                        {product.condition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                      <span>Precio</span>
                      <span className="text-3xl font-black text-zinc-100">
                        {Number(product.price)} €
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                    Las reservas duran 7 días. La venta final se cerrará por
                    WhatsApp, sin pago online.
                  </div>

                  {errorMessage ? (
                    <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {errorMessage}
                    </p>
                  ) : null}

                  {successMessage ? (
                    <p className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {successMessage}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    disabled={isReserved || isReserving}
                    onClick={handleReserveProduct}
                    className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${
                      isReserved
                        ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                        : "bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    }`}
                  >
                    {isReserving
                      ? "Reservando..."
                      : isReserved
                        ? "Producto reservado"
                        : "Reservar producto"}
                  </button>

                  {isReserved ? (
                    <Link
                      href="/reservations"
                      className="mt-4 block text-center text-sm font-bold text-amber-400 transition hover:text-amber-300"
                    >
                      Ver mis reservas
                    </Link>
                  ) : null}
                </aside>
              </section>

              <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
                <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
                      Comentarios
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Opiniones y dudas sobre este producto
                    </h2>
                  </div>

                  <p className="text-sm text-zinc-400">
                    {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
                  </p>
                </div>

                <form onSubmit={handleAddComment} className="mt-6 space-y-4">
                  <label className="block space-y-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Añadir comentario
                    </span>
                    <textarea
                      name="comment"
                      rows={4}
                      maxLength={500}
                      placeholder="Escribe tu comentario, pregunta o aclaración..."
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-zinc-500 focus:border-amber-500"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-zinc-500">
                      Todos los comentarios publicados serán visibles para los
                      usuarios y administradores.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmittingComment}
                      className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {isSubmittingComment ? "Publicando..." : "Publicar"}
                    </button>
                  </div>
                </form>

                {commentErrorMessage ? (
                  <p className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {commentErrorMessage}
                  </p>
                ) : null}

                {commentSuccessMessage ? (
                  <p className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {commentSuccessMessage}
                  </p>
                ) : null}

                <div className="mt-6 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold text-zinc-100">
                              {comment.author_name || "Usuario"}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                              {formatCommentDate(comment.created_at)}
                            </p>
                          </div>

                          {isAdmin ? (
                            <button
                              type="button"
                              disabled={deletingCommentId === comment.id}
                              onClick={() => handleDeleteComment(comment)}
                              className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                            >
                              {deletingCommentId === comment.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          ) : null}
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-300">
                          {comment.body}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center">
                      <p className="font-bold text-zinc-100">
                        Aún no hay comentarios.
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        Sé la primera persona en comentar este producto.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}
