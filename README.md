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
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
