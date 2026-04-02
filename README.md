# Hotel Management System

A full-stack Hotel Management System built with Node.js/Express (backend) and React/Vite/Tailwind CSS (frontend).

## Project Structure

```
hotel-management/
├── backend/
│   ├── package.json
│   ├── server.js                     # Entry point
│   ├── app.js                        # Express setup, middleware, routes
│   ├── .env.example
│   ├── models/         (User, Room, Booking)
│   ├── controllers/    (auth, booking, room, user)
│   ├── routes/         (auth, room, booking, admin)
│   ├── middlewares/    (auth, admin, validation, sanitization, error)
│   ├── services/       (auth, booking, room, user)
│   └── utils/db.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── services/   (api, auth, booking, room, admin)
        └── pages/      (Landing, About, Contact, Booking, Login, Register, Dashboard, AdminDashboard, notFound)
```

## Tech Stack

- **Backend:** Node.js 18+, Express 4, MongoDB (Mongoose 8), JWT, bcryptjs, Helmet, express-rate-limit, express-validator
- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Axios, React Router 6, React Toastify

---

## Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev     # node --watch (Node 18+)
# or: npm start
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL defaults to http://localhost:3000/api for local dev
npm install
npm run dev
```

Frontend: http://localhost:5173 | Backend: http://localhost:3000

---

## Environment Variables

### Backend `.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | YES | MongoDB Atlas URI |
| `JWT_SECRET` | YES | Min 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRES_IN` | no | Default `7d` |
| `PORT` | no | Default `3000` |
| `NODE_ENV` | YES (prod) | Set to `production` — hides stack traces |
| `ALLOWED_ORIGINS` | YES (prod) | Comma-separated frontend URL(s) |

### Frontend `.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | YES (prod) | Full backend URL + `/api`, e.g. `https://your-api.onrender.com/api` |

---

## Production Deployment

### Backend → Render

1. New Web Service, root directory = `backend`
2. Build: `npm install` | Start: `npm start`
3. Set all env vars: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`

### Frontend → Vercel

1. Import repo, root directory = `frontend`
2. Build auto-detected (Vite). Add `VITE_API_URL` env var.

---

## First Admin User

Register normally, then update role in MongoDB Atlas:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login → JWT + user |
| GET | `/api/auth/profile` | User | Own profile |
| PUT | `/api/auth/profile` | User | Update profile |
| POST | `/api/auth/change-password` | User | Change password |
| GET | `/api/rooms` | — | List rooms |
| GET | `/api/rooms/search` | — | Search rooms |
| GET | `/api/rooms/featured` | — | Featured rooms |
| GET | `/api/rooms/:id` | — | Room by ID |
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/history` | User | Booking history |
| PATCH | `/api/bookings/:id/cancel` | User | Cancel booking |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id` | Admin | Update user |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/rooms` | Admin | All rooms |
| POST | `/api/admin/rooms` | Admin | Create room |
| PUT | `/api/admin/rooms/:id` | Admin | Update room |
| DELETE | `/api/admin/rooms/:id` | Admin | Delete room |
| GET | `/api/admin/bookings` | Admin | All bookings |
| PUT | `/api/admin/bookings/:id` | Admin | Update booking |
| PATCH | `/api/admin/bookings/:id/cancel` | Admin | Soft-cancel |
| DELETE | `/api/admin/bookings/:id` | Admin | Hard-delete |
| GET | `/health` | — | Health check |
