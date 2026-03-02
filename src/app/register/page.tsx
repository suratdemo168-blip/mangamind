"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "เกิดข้อผิดพลาด");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-violet-400" />
          <h1 className="text-2xl font-bold text-white">สร้างบัญชีใหม่</h1>
          <p className="mt-1 text-sm text-gray-400">ฟรี 3 story/เดือน ไม่ต้องใช้บัตรเครดิต</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">ชื่อ</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="ชื่อของคุณ"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-300">อีเมล</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-300">รหัสผ่าน</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
