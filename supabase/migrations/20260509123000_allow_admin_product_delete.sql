-- Permite que sólo los administradores eliminen productos desde el panel.
-- La UI ya está protegida con AdminGuard, pero esta política mantiene la
-- autorización crítica también en Supabase/RLS.

drop policy if exists "Solo admins pueden eliminar productos" on public.products;
create policy "Solo admins pueden eliminar productos"
  on public.products
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

notify pgrst, 'reload schema';
