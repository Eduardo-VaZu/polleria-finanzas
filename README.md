# Polleria Finanzas

Aplicacion web administrativa para gestionar finanzas base de polleria.

Alcance V1:
- Compras
- Ventas
- Gastos
- Caja
- Reportes

No incluye inventario en esta version.

## Stack

- Next.js 16 + TypeScript
- PostgreSQL
- Prisma 7
- Tailwind CSS
- Docker Compose

## Requisitos

- Node.js 22.x
- Docker Desktop activo
- npm

## Variables de entorno

Crear `.env` (ya incluido localmente) con:

```env
APP_NAME="Polleria Finanzas"
APP_ENV="development"
APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polleria_finanzas?schema=public"
JWT_SECRET="dev_local_secret_change_me"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS="10"
APP_TIMEZONE="America/Lima"
APP_CURRENCY="PEN"
```

## Levantar proyecto local

```bash
npm install
npm run docker:up
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

App: `http://localhost:3000`

## Scripts principales

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
npm run db:seed
npm run docker:up
npm run docker:down
npm run docker:logs
npm run docker:reset
```

## Estado actual

- Migracion inicial aplicada: `20260506032508_init`
- Seed inicial operativo (idempotente)
- Utilidades globales en `src/lib`
- Estructura modular base creada

## Usuario inicial

- Email: `admin@polleria.com`
- Password: `admin123456`
- Rol: `ADMIN`

## Produccion (Vercel)

- Usar PostgreSQL externo.
- Configurar variables en dashboard Vercel.
- Ejecutar `npm run db:deploy` en entorno de despliegue.
- Cambiar `JWT_SECRET` por valor fuerte de produccion.
