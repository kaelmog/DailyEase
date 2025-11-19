# Daily-Ease — v5 Stable 2.0

Daily-Ease is a lightweight, mobile-friendly reporting system built with **Next.js App Router**, designed for creating, managing, and sharing **daily sales reports** and **product leftovers**.  
It includes a full authentication system, protected routes, Supabase integration, and smooth UI/UX tailored for real outlet use.

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

---

## 📦 Project Setup

### 1️⃣ Install Dependencies

```bash
pnpm install
```
