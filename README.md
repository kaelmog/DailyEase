# Daily-Ease — v6 Stable 1.0

**DailyEase** is an intuitive web app built to simplify and streamline daily reporting for retail or F&B operations.  
Originally created to help my girlfriend with her daily reports, it’s designed to make the reporting process faster, cleaner, and less error-prone — so she can spend more time focusing on what matters.

---

## 🚀 Features

### 🔐 Authentication

- Login with username & password
- Secure **HTTP-only JWT cookies**
- `/api/auth/me` auto-verifies session
- Middleware-protected routes

### 📊 Reporting System

- Create, view, edit, delete reports
- Auto-calc total sales & transactions
- Leftovers grouped by product category
- Category order comes directly from database
- WhatsApp sharing & clipboard copy

### 📱 UI & UX

- Fully responsive UI for all screens
- Custom components (Modal, Button, Inputs)
- Smooth animations
- Optimized data hooks

### 🗄️ Backend

- Supabase PostgreSQL
- Full service-role server access for secure operations

---

## 🧱 Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 15 (App Router) |
| Styling   | TailwindCSS             |
| Database  | Supabase                |
| Auth      | JWT + HTTP-only cookies |
| Icons     | Lucide                  |
| UI State  | Custom hooks + context  |

## 🖥️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/<yourusername>/daily-ease.git
cd daily-ease
```

### 2. Install dependencies

```
npm install
```

### 3. Set up environmet variables

Create a .env.local file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_secret_key
ADMIN_API_SECRET=your_secret_key
```

### 4. Run Locally

```
npm run dev
```

Visit: http://localhost:3000

---

## 💡 Future Plans

- Monthly and historical report tracking.
- PDF or Excel export options.
- Role-based access control.
- Dashboard summary for multi-outlet tracking.

---

## ❤️ Author

**Developed with love by Kaelmog (Me ofc)**
Made for my beloved love of my life to simplify her daily store reporting workflow.

---

## 📄 License

MIT License - feel free to use and adapt for your own operations.
