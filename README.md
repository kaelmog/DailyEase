# 🧾 DailyEase

**DailyEase** is an intuitive web app built to simplify and streamline daily reporting for retail or F&B operations.  
Originally created to help my girlfriend with her daily reports, it’s designed to make the reporting process faster, cleaner, and less error-prone — so she can spend more time focusing on what matters.

---

## 🚀 Project Overview

DailyEase provides a **single interface** to:

- Log **sales**, **payment methods**, and **product leftovers**.
- Automatically generate **formatted daily reports**.
- Instantly **share reports via WhatsApp** or **copy** them for submission.
- Reduce manual work and ensure **accurate, on-time reporting**.

Built with **Next.js 14 (App Router)**, **Supabase**, and a clean responsive UI, the app focuses on a minimal yet effective workflow.

---

## 🧩 Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Frontend   | **Next.js 14**, **React**, **Tailwind CSS**, **Headless UI** |
| Backend    | **Next.js API routes**, **Supabase** (database & auth)       |
| Auth       | JSON Web Token (JWT) with local storage                      |
| Deployment | Vercel                                                       |
| UI/UX      | Lightweight, mobile-first, and optimized for fast data entry |

---

## 🏗️ Current Features (Main Branch)

These are the **stable** and fully implemented features currently on `main`:

### ✅ Core Features

- **Report Management**

  - Create, edit, and delete daily sales reports.
  - Each report includes:
    - Outlet information and date.
    - Payment summary (cash, QRIS, GrabFood, GoFood, etc.).
    - Product sales summary.
    - Product leftovers.

- **Formatted Report Output**

  - Reports can be previewed, copied, or shared via WhatsApp.

- **Supabase Integration**

  - Product and category data automatically loaded from the database.

- **UI Enhancements**
  - Smooth animations (slide-in, fade-in transitions).
  - Mobile-friendly layout.
  - Consistent color palette with clear hierarchy.

---

## 🧪 In Progress (feature/core-reporting Branch)

These are **experimental / unreleased** features currently under development:

### 📊 Reporting System Core (Phase 3)

- **User Authentication**

  - JWT-based login and session handling.
  - Secure API route protection.

- **View Individual Reports**

  - `/reports/view/[id]` page for viewing a report in detail.

- **Product–Category Linking**

  - Dynamic mapping between `products` and `categories` for precise leftover categorization.
  - Category grouping and collapsible disclosure sections for clean data display.

- **Improved Data Flow**

  - Refactored `ReportForm.jsx` for cleaner state management.
  - Optimized `useEffect` and memoization to avoid unnecessary re-renders.

- **Enhanced Modularity**
  - Cleaner separation between reusable components (e.g., `ReportList`, `ReportForm`, `ReportView`).

> ⚠️ These features are under testing and **not yet merged** into the `main` branch.

---

## 🗂️ Project Structure
```
daily-ease/
├── app/
│ ├── api/
│ │ ├── reports/ # CRUD endpoints for reports
│ │ └── auth/ # JWT-based auth endpoints
│ └── reports/
│ ├── page.jsx # List all reports
│ └── create/ # Create new report
│
├── components/
│ ├── ReportForm.jsx
│ ├── ReportList.jsx
│ ├── ReportCard.jsx
│ └── ReviewModal.jsx
│
├── hooks/
│ └── useSupabaseData.js # Fetches product/category data
│
├── lib/
│ ├── supabaseClient.js
│ └── utils.js
│
└── README.md
```
---

## 🧠 Development Notes

- **Main branch:** stable and production-ready.
- **feature/core-reporting:** experimental; for building advanced report viewing and data linking features.
- Always create new feature branches before merging to `main` for testing or updates.

---

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

```NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_secret_key
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
