"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, Zap, Lock } from "lucide-react";

const GENRES = [
  { value: "action",      label: "⚔️ แอ็คชั่น" },
  { value: "romance",     label: "💕 โรแมนติก" },
  { value: "fantasy",     label: "🧙 แฟนตาซี" },
  { value: "comedy",      label: "😂 ตลก" },
  { value: "horror",      label: "👻 สยองขวัญ" },
  { value: "scifi",       label: "🚀 ไซไฟ" },
  { value: "sliceoflife", label: "🌸 ชีวิตประจำวัน" },
];

const TYPES = [
  { value: "manga",   label: "มังงะ" },
  { value: "manhwa",  label: "มันฮวา" },
  { value: "manhua",  label: "มันฮวา (จีน)" },
  { value: "webtoon", label: "เว็บตูน" },
];

export default function CreatePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    concept: "",
    genre: "fantasy",
    type: "manga",
    chapters: "1",
    language: "th",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-4 px-4 text-center">
        <Lock className="h-10 w-10 text-gray-600" />
        <h2 className="text-xl font-bold text-white">กรุณาเข้าสู่ระบบก่อน</h2>
        <Link
          href="/login"
          className="rounded-full bg-violet-600 px-6 py-2.5 font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const credits = session.user.credits;
  const plan = session.user.plan ?? "FREE";

  const CHAPTER_OPTIONS: Record<string, number[]> = {
    FREE:  [1],
    PRO:   [1, 2, 3],
    ULTRA: [1, 2, 3, 4, 5],
  };
  const chapterOptions = CHAPTER_OPTIONS[plan] ?? [1];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (credits <= 0) {
      setError("Credits หมดแล้ว กรุณาอัปเกรดแพลน");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, chapters: Number(form.chapters) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
      return;
    }

    await update();
    router.push(`/stories/${data.storyId}`);
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">สร้าง Story ใหม่</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>
              {plan === "ULTRA" ? "Credits ไม่จำกัด" : `เหลือ ${credits} credits`}
            </span>
            {plan === "FREE" && (
              <Link href="/pricing" className="ml-1 text-violet-400 hover:text-violet-300">
                อัปเกรด →
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Concept */}
          <div>
            <label className="mb-1.5 block font-medium text-white">
              ไอเดีย / Concept <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.concept}
              onChange={(e) => setForm({ ...form, concept: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="เช่น: เด็กชายธรรมดาคนหนึ่งได้รับพลังวิเศษจากอุกกาบาตลึกลับ และต้องปกป้องเมืองจากอสูรโบราณที่ตื่นขึ้นมา"
            />
            <p className="mt-1 text-xs text-gray-600">อธิบาย concept คร่าวๆ AI จะสร้างรายละเอียดให้เอง</p>
          </div>

          {/* Title (optional) */}
          <div>
            <label className="mb-1.5 block font-medium text-white">
              ชื่อเรื่อง <span className="text-gray-500 text-sm font-normal">(ไม่บังคับ)</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
              placeholder="ปล่อยว่างให้ AI ตั้งชื่อให้"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="mb-2 block font-medium text-white">แนวเรื่อง</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm({ ...form, genre: g.value })}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    form.genre === g.value
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block font-medium text-white">รูปแบบ</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    form.type === t.value
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chapters + Language */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-medium text-white">จำนวนตอน</label>
              <select
                value={form.chapters}
                onChange={(e) => setForm({ ...form, chapters: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0c0b1a] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
              >
                {chapterOptions.map((n) => (
                  <option key={n} value={n}>{n} ตอน</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block font-medium text-white">ภาษา</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0c0b1a] px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
              >
                <option value="th">ภาษาไทย</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Free plan notice */}
          {plan === "FREE" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              <span className="font-semibold">Free plan:</span> ได้แค่ outline สั้นๆ{" "}
              <Link href="/pricing" className="underline hover:text-amber-200">
                อัปเกรดเพื่อรับ story เต็มรูปแบบ
              </Link>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || credits <= 0}
            className="flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                AI กำลังสร้าง story...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                สร้าง Story
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
