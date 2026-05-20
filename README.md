# LifeLink

A full-stack healthcare management platform that connects **Hospitals**, **Doctors**, and **Patients** through a single web application. Hospitals manage their staff and patients, doctors view their appointments and patient lists, and patients can book appointments at registered hospitals — all from one interface.

Built with the **MERN** stack (MongoDB, Express, React, Node.js) and fully containerised with Docker.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Run with Docker](#run-with-docker)
7. [Environment Variables](#environment-variables)
8. [User Flows](#user-flows)
9. [API Reference](#api-reference)
10. [Data Models](#data-models)
11. [Available Scripts](#available-scripts)
12. [Troubleshooting](#troubleshooting)
13. [License](#license)

---

## Features

- **Hospital portal** — register a hospital, view live stats (doctors, patients, appointments), manage staff and patients, plus a hospital-wide appointment view.
- **Doctor portal** — calendar-driven dashboard, today's appointments, patient roster, confirm / complete / cancel appointments.
- **Patient booking** — pick a hospital, choose a doctor by specialization, schedule a date and time, leave a note for the doctor.
- **Appointment status pipeline** — `Pending → Confirmed → Completed`, with a `Cancelled` exit state, so nothing is silently deleted.
- **Search everywhere** — patients, doctors, and appointments are filterable by name, condition, or specialty.
- **CSV export** — hospitals and doctors can export their patient list to CSV in one click.
- **Cookie-based session auth** with bcrypt-hashed passwords, per-request session validation, and no shared null-token collisions.
- **Responsive UI** built with React + Vite + Tailwind, refined for hospital and clinic environments.
- **Dockerised** — single `docker compose up` brings the database, backend, and frontend online together.

---

## Tech Stack

| Layer        | Tools                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| Frontend     | React 18, React Router 7, Vite 6, Tailwind CSS 4, Axios, lucide-react  |
| Backend      | Node.js, Express 4, Mongoose 8                                         |
| Database     | MongoDB 7                                                              |
| Auth         | Session cookies, bcryptjs, cookie-parser                               |
| Container    | Docker, Docker Compose                                                 |

---

## Architecture

```
┌──────────────┐      HTTP/JSON      ┌──────────────┐      Mongoose      ┌──────────────┐
│   Frontend   │  ─────────────────▶ │   Backend    │  ─────────────────▶│   MongoDB    │
│  React/Vite  │  ◀───────────────── │  Express API │  ◀──────────────── │   (Atlas or  │
│  Port 5173   │      Cookies        │  Port 5000   │                    │   container) │
└──────────────┘                     └──────────────┘                    └──────────────┘
```

In production the backend serves the built frontend (`frontend/dist`) and the same Express process handles both the static files and the API.

---

## Project Structure

```
LifeLink/
├── backend/
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Route handlers (auth, hospital, doctor, patient, appointment)
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas (Hospital, Doctor, Patient, Appointment)
│   ├── routes/             # Express routers
│   ├── Dockerfile          # Backend container image
│   └── server.js           # App entrypoint
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── components/     # Navbar, Home, About, Login, registers
│   │   ├── modules/        # Hospital/Doctor nav & sidebar
│   │   ├── pages/          # Dashboards, patients, doctors, appointments
│   │   ├── style/          # CSS modules
│   │   └── App.jsx         # Router
│   ├── Dockerfile          # Frontend container image (nginx-served)
│   ├── nginx.conf          # Reverse-proxy config for production frontend
│   └── vite.config.js
├── docker-compose.yml      # Orchestrates db + backend + frontend
├── .env.example            # Sample environment file
└── package.json            # Root scripts to install/build/run both apps
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **MongoDB** (local instance, Docker, or a MongoDB Atlas cluster)

### 1. Clone & install

```bash
git clone <repo-url>
cd LifeLink
npm run install-all
```

This installs dependencies for both `backend/` and `frontend/`.

### 2. Configure environment

Copy `.env.example` to `backend/.env` and edit the values:

```env
MONGO_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
NODE_ENV=development
COOKIE_SECURE=false
```

### 3. Run in development

In two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 4. Production build (without Docker)

```bash
npm run build       # builds the frontend into frontend/dist
npm start           # runs the backend, which also serves the built frontend
```

---

## Run with Docker

The fastest way to spin everything up locally:

```bash
docker compose up --build
```

This launches three services:

| Service   | Port | Description                                  |
| --------- | ---- | -------------------------------------------- |
| mongo     | 27017| MongoDB 7 with a persistent named volume     |
| backend   | 5000 | Express API connected to the mongo service   |
| frontend  | 5173 | Nginx serving the built React app, proxying `/api` to the backend |

Open **http://localhost:5173** in your browser.

To stop everything: `docker compose down`. Add `-v` to also drop the database volume.

---

## Environment Variables

| Variable       | Used by  | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `MONGO_URI`    | backend  | Mongo connection string                             |
| `JWT_SECRET`   | backend  | Secret used for signing (kept for future use)       |
| `PORT`         | backend  | Port the API listens on (default `5000`)            |
| `NODE_ENV`     | backend  | `development` or `production`                       |
| `COOKIE_SECURE`| backend  | `true` in production behind HTTPS, otherwise `false`|
| `VITE_API_URL` | frontend | Optional override for the API base URL             |

---

## User Flows

**Hospital**
1. Register at `/reg` with name, email, password, address.
2. Login at `/login` (select *Hospital*).
3. Land on `/hospitaldash` — dashboard stats, patient roster, doctor roster.

**Doctor**
1. Register at `/regd` and select the hospital they belong to.
2. Login at `/login` (select *Doctor*).
3. Land on `/doctordash` — calendar of appointments, today's list, total patients, pending count.

**Patient**
1. Go to `/appointment` (no account needed).
2. Pick hospital → pick doctor → date/time → patient details.
3. Submit. The doctor sees a new *Pending* appointment in their dashboard.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)
| Method | Route             | Purpose                                |
| ------ | ----------------- | -------------------------------------- |
| GET    | `/check-cookies`  | Validate current session cookie        |
| POST   | `/logout`         | Clear session                          |

### Hospital (`/hospital`)
| Method | Route          | Purpose                          |
| ------ | -------------- | -------------------------------- |
| POST   | `/register`    | Register a new hospital          |
| POST   | `/login`       | Hospital login                   |
| GET    | `/dashboard`   | Authenticated hospital dashboard |
| GET    | `/patients`    | List patients in a hospital      |
| GET    | `/doctors`     | List doctors in a hospital       |
| POST   | `/addPatient`  | Add a new patient                |
| GET    | `/me`          | Get current hospital id          |
| GET    | `/appointments`| Hospital-wide appointment list   |
| GET    | `/getall`      | List all hospitals (public)      |

### Doctor (`/doctors`)
| Method | Route                    | Purpose                          |
| ------ | ------------------------ | -------------------------------- |
| POST   | `/register`              | Register a doctor under hospital |
| POST   | `/login`                 | Doctor login                     |
| POST   | `/logout`                | Doctor logout                    |
| GET    | `/hospitals`             | List hospitals (public)          |
| GET    | `/patients`              | Patients assigned to the doctor  |
| GET    | `/patients/count`        | Patient count                    |
| GET    | `/appointments`          | All appointments                 |
| GET    | `/appointments/pending`  | Pending appointments             |
| POST   | `/appointment/confirm`   | Confirm an appointment           |
| POST   | `/appointment/cancel`    | Cancel an appointment            |
| POST   | `/appointment/complete`  | Mark appointment as completed    |
| POST   | `/appointment/remove`    | Hard-delete an appointment       |
| POST   | `/getall`                | List all doctors for a hospital  |

### Appointment (`/appointments`)
| Method | Route   | Purpose                |
| ------ | ------- | ---------------------- |
| POST   | `/book` | Book a new appointment |

---

## Data Models

- **Hospital** — `name`, `email`, `password`, `address`, `sessionToken`
- **Doctor** — `name`, `email`, `password`, `specialization`, `hospital` (ref), `sessionToken`
- **Patient** — `name`, `email`, `age`, `condition`, `doctorId`, `hospitalId`
- **Appointment** — `patient`, `doctor`, `hospital`, `date`, `status` (`Pending` / `Confirmed` / `Cancelled`)

Passwords on `Hospital` and `Doctor` are hashed with bcrypt via a pre-save hook.

---

## Available Scripts (root)

| Script                    | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run install-all`     | Install backend + frontend dependencies      |
| `npm run install-backend` | Install backend dependencies only            |
| `npm run install-frontend`| Install frontend dependencies only           |
| `npm run build`           | Build the frontend for production            |
| `npm start`               | Start the backend (serves built frontend)    |

---

## Troubleshooting

- **`MongoNetworkError`** — verify `MONGO_URI` is reachable. With Docker, the backend uses `mongo` as the host (the compose service name), not `localhost`.
- **`CORS` errors** — make sure the frontend origin is listed in `corsOptions.origin` in `backend/server.js`.
- **Stale session** — clear the `session_token` cookie in the browser and log in again.
- **Port already in use** — change `PORT` in `backend/.env` or stop the conflicting process.

---

## License

ISC
