# CivicPulse — Complaint Heatmap Dashboard

A full-stack civic issue tracking platform with interactive heatmaps, built with Node.js, Express, MongoDB, and Leaflet.js.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone and install
```bash
cd complaint-heatmap/server
npm install
```

### 2. Configure environment
Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complaint_heatmap
JWT_SECRET=your_super_secret_key_change_this
ADMIN_EMAIL=admin@heatmap.com
ADMIN_PASSWORD=Admin@123
```

### 3. Seed sample data
```bash
npm run seed
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Open in browser
```
http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role  | Email                 | Password     |
|-------|-----------------------|--------------|
| Admin | admin@heatmap.com     | Admin@123    |
| User  | rahul@example.com     | password123  |
| User  | priya@example.com     | password123  |
| User  | amit@example.com      | password123  |

---

## 📁 Project Structure

```
complaint-heatmap/
├── server/
│   ├── models/
│   │   ├── User.js           # User schema (bcrypt hashing)
│   │   └── Complaint.js      # Complaint schema
│   ├── routes/
│   │   ├── auth.js           # /api/register, /api/login
│   │   └── complaints.js     # /api/complaints CRUD
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly
│   ├── server.js             # Express entry point
│   ├── seed.js               # Sample data seeder
│   ├── .env                  # Environment variables
│   └── package.json
└── client/
    └── index.html            # SPA frontend (Tailwind + Leaflet)
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/register   — Register new user
POST /api/login      — Login (returns JWT)
```

### Complaints (all require Bearer token)
```
GET  /api/complaints              — Get all complaints (filter by ?category=&status=&mine=true)
POST /api/complaints              — Submit a complaint
PATCH /api/complaints/:id/status  — Update status (Admin only)
```

---

## ✨ Features

- **Heatmap Dashboard** — Toggle between marker view and heat density layer
- **Geo-tagged complaints** — Click map to select exact location
- **Admin Panel** — Update complaint status (Pending → In Progress → Resolved)
- **Deduplication** — Prevents same user from submitting same category at same location
- **JWT Auth** — Secure, stateless authentication
- **Auto-refresh** — Dashboard polls every 30 seconds
- **Responsive** — Works on mobile, tablet, and desktop

---

## 🌐 Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | Node.js + Express.js    |
| Database | MongoDB + Mongoose      |
| Auth     | JWT + bcryptjs          |
| Frontend | HTML + Tailwind CSS     |
| Maps     | Leaflet.js + Leaflet.heat |
| Fonts    | DM Sans (Google Fonts)  |

---

## 🗺️ Map Details

- Default center: New Delhi, India (28.6139°N, 77.2090°E)
- Heatmap gradient: Blue → Blue → Red → Dark Red (by density)
- Category color-coded markers
- Click any marker to see complaint details

---

## 🔒 Security Notes

- Never commit `.env` to version control
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Restrict CORS `origin` to your actual frontend domain
