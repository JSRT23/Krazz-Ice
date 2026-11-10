# 🍦 Krazz Ice — Frontend

Aplicación web de **Krazz Ice / Coffee & Rest**: catálogo, carrito y pedidos para clientes, y paneles operativos para meseros, cocina y administración.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

## Qué hace

- Interfaz por **rol**: `admin`, `mesero`, `cocina` y `cliente`, con rutas protegidas.
- Consume la API REST del backend [Coffee-Restaurant](https://github.com/JSRT23/Coffee-Restaurant) (Django + DRF + JWT).
- Por defecto apunta a `https://krazzice.pythonanywhere.com/api`; se puede cambiar con `VITE_API_URL`.

## Stack

React 19 · Vite 7 · React Router · Bootstrap · axios · nginx (imagen de producción)

## Variables de entorno

Copia `.env.example` a `.env` (opcional):

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `https://krazzice.pythonanywhere.com/api` |

## Cómo correrlo

### Con Docker

```bash
git clone https://github.com/JSRT23/Krazz-Ice.git
cd Krazz-Ice
docker compose up --build web          # producción (nginx) -> http://localhost:8080
docker compose --profile dev up dev    # desarrollo con HMR  -> http://localhost:5173
```

Para apuntar a otra API: `VITE_API_URL=http://localhost:8000/api docker compose up --build web` (la variable se incrusta en el build).

### Sin Docker

Requiere Node 20+.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # genera dist/
```

## Estructura Docker

| Archivo | Uso |
|---|---|
| `Dockerfile` | Build multi-etapa: `node:22-alpine` → `nginx:1.27-alpine` |
| `Dockerfile.dev` | Servidor Vite con HMR |
| `nginx.conf` | Fallback SPA y caché de assets |
| `docker-compose.yml` | Servicios `web` (8080) y `dev` (perfil `dev`, 5173) |
