'use client';
import React, { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import ErrorBanner from '@/components/ui/errorBanner';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', admin_secret: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Register failed');
      } else {
        setSuccess('User created successfully');
        setForm({ username: '', password: '', admin_secret: '' });
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-6 rounded-2xl shadow-md w-80 space-y-4 text-text-primary"
      >
        <h1 className="text-xl font-bold text-center text-text-secondary">
          Create Account (Admin)
        </h1>

        {error && <ErrorBanner message={error} />}
        {success && (
          <div className="bg-green-500 text-white p-2 rounded text-sm text-center">{success}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
          <Input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Admin Secret</label>
          <Input
            value={form.admin_secret}
            onChange={(e) => setForm({ ...form, admin_secret: e.target.value })}
            placeholder="admin secret"
          />
          <p className="text-xs text-text-secondary mt-1">
            Only the admin can create users. Provide your ADMIN_SECRET.
          </p>
        </div>

        <Button
          type="submit"
          className={`w-full py-2 bg-accent-primary text-white rounded font-semibold ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          {loading ? <Loader2 /> : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
