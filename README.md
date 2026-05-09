# Viejuner Castiñeira

🔗 **Aplicación desplegada en Vercel:**  
https://viejuner-castineira.vercel.app/

## Descripción

**Viejuner Castiñeira** es una aplicación web privada para gestionar la venta de miniaturas antiguas, lotes y piezas de Warhammer.

La aplicación permite que los usuarios registrados consulten un catálogo privado, filtren productos, vean fichas detalladas con imagen y reserven miniaturas durante un periodo limitado de 7 días. Además, incluye un panel de administración desde el que se pueden crear productos, subir imágenes, editar el inventario, revisar reservas activas y marcar ventas como cerradas.

El objetivo del proyecto es ofrecer una herramienta sencilla, práctica y funcional para vender miniaturas sin depender de hojas de cálculo, mensajes sueltos o control manual del stock.

---

## Tecnologías utilizadas

- **Next.js**: framework principal de React utilizado con App Router.
- **React**: construcción de interfaces mediante componentes.
- **TypeScript**: tipado estático para mejorar la seguridad del código.
- **Tailwind CSS**: estilos rápidos y consistentes mediante clases utilitarias.
- **Supabase**: backend usado para autenticación, base de datos PostgreSQL, funciones SQL y almacenamiento de imágenes.
- **Vercel**: plataforma de despliegue de la aplicación.

Next.js recomienda el App Router como sistema de rutas basado en archivos para aplicaciones modernas con React. Supabase proporciona Auth, base de datos PostgreSQL, Storage y llamadas RPC para funciones Postgres. Vercel ofrece integración directa con proyectos Next.js y despliegues automáticos desde Git.  
Fuentes: documentación oficial de Next.js, Supabase y Vercel.

---

## Funcionalidades principales

### Usuarios

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Perfil privado.
- Acceso al catálogo solo para usuarios autenticados.
- Visualización de reservas activas.
- Cancelación de reserva completa.
- Eliminación de productos individuales de una reserva.

### Catálogo

- Listado de productos reales desde Supabase.
- Filtrado por sistema.
- Filtrado por facción.
- Ordenación por precio ascendente o descendente.
- Visualización de imagen, estado, facción, precio y disponibilidad.
- Reserva directa desde el catálogo.
- Acceso a ficha detallada del producto.

### Producto

- Página individual para cada producto.
- Imagen real subida a Supabase Storage.
- Descripción.
- Sistema de juego.
- Facción.
- Estado físico.
- Precio.
- Botón de reserva si el producto está disponible.

### Reservas

- Reserva de productos durante 7 días.
- Creación automática de reserva activa para el usuario.
- Asociación de productos reservados a la reserva.
- Bloqueo del producto mientras está reservado.
- Liberación del producto si se elimina de la reserva.
- Cancelación completa de reserva.
- Caducidad automática de reservas antiguas.

### Administración

- Acceso protegido solo para usuarios con rol `admin`.
- Panel principal con datos reales:
  - productos activos,
  - reservas activas,
  - importe pendiente por vender,
  - actividad reciente.
- Creación de productos.
- Subida de imágenes.
- Edición de productos existentes.
- Ocultar productos.
- Reactivar productos ocultos.
- Marcar productos como vendidos.
- Gestión de reservas activas.
- Cancelación de reservas desde admin.
- Marcado de reservas como vendidas.

---

## Estructura general del proyecto

```txt
app/
├── admin/
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   └── reservations/
│       └── page.tsx
├── catalog/
│   ├── page.tsx
│   └── catalog-content.tsx
├── login/
│   └── page.tsx
├── product/
│   └── [id]/
│       └── page.tsx
├── profile/
│   └── page.tsx
├── register/
│   └── page.tsx
├── reservations/
│   └── page.tsx
└── _components/
    ├── admin-guard.tsx
    ├── auth-guard.tsx
    ├── logout-button.tsx
    └── page-header.tsx

lib/
└── supabase/
    └── client.ts

    # Viejuner Castiñeira

🔗 **Aplicación desplegada en Vercel:**  
https://viejuner-castineira.vercel.app/

## Descripción

**Viejuner Castiñeira** es una aplicación web privada para gestionar la venta de miniaturas antiguas, lotes y piezas de Warhammer.

La aplicación permite que los usuarios registrados consulten un catálogo privado, filtren productos, vean fichas detalladas con imagen y reserven miniaturas durante un periodo limitado de 7 días. Además, incluye un panel de administración desde el que se pueden crear productos, subir imágenes, editar el inventario, revisar reservas activas y marcar ventas como cerradas.

El objetivo del proyecto es ofrecer una herramienta sencilla, práctica y funcional para vender miniaturas sin depender de hojas de cálculo, mensajes sueltos o control manual del stock.

---

## Tecnologías utilizadas

- **Next.js**: framework principal de React utilizado con App Router.
- **React**: construcción de interfaces mediante componentes.
- **TypeScript**: tipado estático para mejorar la seguridad del código.
- **Tailwind CSS**: estilos rápidos y consistentes mediante clases utilitarias.
- **Supabase**: backend usado para autenticación, base de datos PostgreSQL, funciones SQL y almacenamiento de imágenes.
- **Vercel**: plataforma de despliegue de la aplicación.

Next.js recomienda el App Router como sistema de rutas basado en archivos para aplicaciones modernas con React. Supabase proporciona Auth, base de datos PostgreSQL, Storage y llamadas RPC para funciones Postgres. Vercel ofrece integración directa con proyectos Next.js y despliegues automáticos desde Git.  
Fuentes: documentación oficial de Next.js, Supabase y Vercel.

---

## Funcionalidades principales

### Usuarios

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Perfil privado.
- Acceso al catálogo solo para usuarios autenticados.
- Visualización de reservas activas.
- Cancelación de reserva completa.
- Eliminación de productos individuales de una reserva.

### Catálogo

- Listado de productos reales desde Supabase.
- Filtrado por sistema.
- Filtrado por facción.
- Ordenación por precio ascendente o descendente.
- Visualización de imagen, estado, facción, precio y disponibilidad.
- Reserva directa desde el catálogo.
- Acceso a ficha detallada del producto.

### Producto

- Página individual para cada producto.
- Imagen real subida a Supabase Storage.
- Descripción.
- Sistema de juego.
- Facción.
- Estado físico.
- Precio.
- Botón de reserva si el producto está disponible.

### Reservas

- Reserva de productos durante 7 días.
- Creación automática de reserva activa para el usuario.
- Asociación de productos reservados a la reserva.
- Bloqueo del producto mientras está reservado.
- Liberación del producto si se elimina de la reserva.
- Cancelación completa de reserva.
- Caducidad automática de reservas antiguas.

### Administración

- Acceso protegido solo para usuarios con rol `admin`.
- Panel principal con datos reales:
  - productos activos,
  - reservas activas,
  - importe pendiente por vender,
  - actividad reciente.
- Creación de productos.
- Subida de imágenes.
- Edición de productos existentes.
- Ocultar productos.
- Reactivar productos ocultos.
- Marcar productos como vendidos.
- Gestión de reservas activas.
- Cancelación de reservas desde admin.
- Marcado de reservas como vendidas.

---

## Estructura general del proyecto

```txt
app/
├── admin/
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   └── reservations/
│       └── page.tsx
├── catalog/
│   ├── page.tsx
│   └── catalog-content.tsx
├── login/
│   └── page.tsx
├── product/
│   └── [id]/
│       └── page.tsx
├── profile/
│   └── page.tsx
├── register/
│   └── page.tsx
├── reservations/
│   └── page.tsx
└── _components/
    ├── admin-guard.tsx
    ├── auth-guard.tsx
    ├── logout-button.tsx
    └── page-header.tsx

lib/
└── supabase/
    └── client.ts

    ### `reservations`

Guarda las reservas de cada usuario.

**Campos principales:**

- `id`
- `user_id`
- `status`
- `expires_at`
- `cancelled_at`
- `sold_at`
- `created_at`
- `updated_at`

**Estados utilizados:**

```txt
active
expired
cancelled_by_user
cancelled_by_admin
sold
```

---

### `reservation_items`

Guarda los productos incluidos en cada reserva.

**Campos principales:**

- `id`
- `reservation_id`
- `product_id`
- `price_at_reservation`
- `created_at`

---

### `product_comments`

Guarda los comentarios visibles en la ficha de cada producto.

**Campos principales:**

- `id`
- `product_id`
- `user_id`
- `author_name`
- `body`
- `created_at`

**Permisos recomendados:**

- cualquier visitante puede leer comentarios,
- cualquier usuario autenticado puede crear comentarios para productos visibles,
- sólo los perfiles con rol `admin` pueden eliminar comentarios.

El script `supabase/product_comments.sql` crea la tabla, el índice y las políticas RLS necesarias.

---

## Funciones SQL utilizadas

La aplicación utiliza funciones PostgreSQL en Supabase para mantener la lógica crítica de reservas en el backend.

**Funciones principales:**

```txt
reserve_product
remove_reservation_item
cancel_active_reservation
admin_cancel_reservation
admin_mark_reservation_sold
expire_old_reservations
```

Estas funciones permiten:

- reservar un producto,
- evitar reservas duplicadas de productos no disponibles,
- liberar productos al quitar una reserva,
- cancelar reservas,
- marcar reservas como vendidas,
- caducar reservas antiguas automáticamente.

Se usa `supabase.rpc()` para llamar estas funciones desde el frontend.

---

## Autenticación y permisos

La autenticación se gestiona con Supabase Auth.

La aplicación diferencia dos tipos de usuario:

```txt
user
admin
```

### Usuario normal

Puede:

- registrarse,
- iniciar sesión,
- ver catálogo,
- reservar productos,
- ver sus reservas,
- cancelar sus propias reservas.

No puede acceder al panel de administración.

### Usuario admin

Puede:

- acceder al catálogo,
- acceder al perfil,
- acceder al panel privado,
- crear productos,
- editar productos,
- ocultar productos,
- marcar productos como vendidos,
- gestionar reservas de usuarios.

El acceso a las rutas privadas de administración está protegido con el componente:

```txt
AdminGuard
```

El acceso a rutas que requieren sesión está protegido con:

```txt
AuthGuard
```

---

## Variables de entorno

Para ejecutar el proyecto se necesitan estas variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

En Vercel deben configurarse las mismas variables en:

```txt
Project Settings → Environment Variables
```

Las variables que empiezan por `NEXT_PUBLIC_` están disponibles en el navegador, tal como indica la documentación de Next.js para variables de entorno públicas.

---

## Instalación local

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Entrar en la carpeta:

```bash
cd viejuner-castineira
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env.local`:

```bash
touch .env.local
```

Añadir las variables de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:3000
```

---

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera una build de producción.

```bash
npm run lint
```

Ejecuta ESLint para revisar el código.

---

## Flujo de uso

### Usuario

1. El usuario se registra.
2. Inicia sesión.
3. Accede al catálogo.
4. Filtra productos por sistema o facción.
5. Reserva una miniatura disponible.
6. Consulta sus reservas.
7. Puede quitar productos o cancelar la reserva completa.
8. Finaliza la compra por WhatsApp.

### Administrador

1. Inicia sesión con una cuenta admin.
2. Accede a su perfil.
3. Entra en el panel de administración.
4. Crea productos con imagen.
5. Revisa el inventario.
6. Consulta reservas activas.
7. Contacta con el usuario por WhatsApp.
8. Marca la reserva como vendida cuando se cierre la venta.

---

## Despliegue

La aplicación está desplegada en Vercel:

```txt
https://viejuner-castineira.vercel.app/
```

Cada `git push` al repositorio conectado genera un nuevo despliegue automático en Vercel.
