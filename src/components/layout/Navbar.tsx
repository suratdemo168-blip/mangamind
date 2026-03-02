"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Sparkles, User, LogOut, ChevronDown, Menu, X, Zap } from "lucide-react";

const PLAN_BADGE: Record<string, { label: string; color: string }> = {
  FREE:  { label: "Free",  color: "bg-gray-700 text-gray-300" },
  PRO:   { label: "Pro",   color: "bg-violet-700 text-violet-200" },
  ULTRA: { label: "Ultra", color: "bg-amber-500 text-black" },
};

export default function Navbar() {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const plan = session?.user?.plan ?? "FREE";
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.FREE;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0c0b1a]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <span>MangaMind</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/create" className="text-sm text-gray-400 hover:text-white transition-colors">
            สร้าง Story
          </Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            ราคา
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* Credits */}
              <Link
                href="/dashboard"
                className="hidden items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors md:flex"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{plan === "ULTRA" ? "∞" : session.user.credits} credits</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="hidden max-w-24 truncate text-xs md:block">{session.user.name}</span>
                  <span className={`hidden rounded-full px-2 py-0.5 text-xs font-semibold md:block ${badge.color}`}>
                    {badge.label}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#14112a] py-1 shadow-xl">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Sparkles className="h-4 w-4 text-violet-400" /> แดชบอร์ด
                    </Link>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Zap className="h-4 w-4 text-amber-400" /> อัปเกรดแพลน
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                เริ่มต้นฟรี
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/create" className="text-sm text-gray-300" onClick={() => setMobileOpen(false)}>สร้าง Story</Link>
            <Link href="/pricing" className="text-sm text-gray-300" onClick={() => setMobileOpen(false)}>ราคา</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-300" onClick={() => setMobileOpen(false)}>แดชบอร์ด</Link>
                <button onClick={() => signOut()} className="text-left text-sm text-red-400">ออกจากระบบ</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-300" onClick={() => setMobileOpen(false)}>เข้าสู่ระบบ</Link>
                <Link href="/register" className="text-sm font-semibold text-violet-400" onClick={() => setMobileOpen(false)}>เริ่มต้นฟรี</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
