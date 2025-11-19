"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginRefresh } = useAuth();

  async function handleSubmit(e) {
    setIsSubmitting(true);
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        await loginRefresh();
        form.username === "ralisme" ? router.push("/") : router.push("/reports");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
      <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-2xl shadow-md w-80 space-y-4 text-text-primary">
        <h1 className="text-xl font-bold text-center text-text-secondary">DailyEase</h1>
        {error && <p className="text-status-error text-sm text-center">{error}</p>}
        <input type="text" placeholder="Username" value={form.username}
               onChange={(e)=>setForm({...form, username: e.target.value})}
               className="border border-accent-primary/60 w-full px-3 py-2 rounded text-text-secondary" />
        <input type="password" placeholder="Password" value={form.password}
               onChange={(e)=>setForm({...form, password: e.target.value})}
               className="border border-accent-primary/60 w-full px-3 py-2 rounded text-text-secondary" />
        <button className="w-full py-2 bg-accent-primary text-white rounded font-semibold hover:bg-btn-primary-hover active:bg-btn-primary-hover disabled:bg-btn-primary-hover"
        disabled={isSubmitting}>Login</button>
      </form>
    </div>
  );
}
