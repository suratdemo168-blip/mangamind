import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, Zap, Plus, BookOpen, Clock } from "lucide-react";

const PLAN_BADGE: Record<string, { label: string; color: string }> = {
  FREE:  { label: "Free",  color: "bg-gray-700 text-gray-300" },
  PRO:   { label: "Pro",   color: "bg-violet-700 text-violet-200" },
  ULTRA: { label: "Ultra", color: "bg-amber-500 text-black" },
};

const GENRE_LABEL: Record<string, string> = {
  action: "แอ็คชั่น", romance: "โรแมนติก", fantasy: "แฟนตาซี",
  comedy: "ตลก", horror: "สยองขวัญ", scifi: "ไซไฟ", sliceoflife: "ชีวิตประจำวัน",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [user, stories] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.story.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const plan = user?.plan ?? "FREE";
  const credits = user?.credits ?? 0;
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.FREE;
  const maxCredits = plan === "PRO" ? 30 : plan === "ULTRA" ? 999 : 3;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              สวัสดี, {session.user.name} 👋
            </h1>
            <p className="mt-1 text-sm text-gray-400">พร้อมสร้าง story ใหม่แล้วหรือยัง?</p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-sm text-white hover:bg-violet-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            สร้าง Story ใหม่
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-gray-400">Credits เหลือ</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {plan === "ULTRA" ? "∞" : credits}
              {plan !== "ULTRA" && (
                <span className="text-sm font-normal text-gray-500">/{maxCredits}</span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <div className="mb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-gray-400">Story ที่สร้าง</span>
            </div>
            <p className="text-2xl font-bold text-white">{stories.length}</p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/5 bg-white/3 p-4 sm:col-span-1">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-gray-400">แพลนปัจจุบัน</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${badge.color}`}>
                {badge.label}
              </span>
              {plan === "FREE" && (
                <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300">
                  อัปเกรด →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade banner (Free users) */}
        {plan === "FREE" && credits === 0 && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-4">
            <div>
              <p className="font-semibold text-white">Credits หมดแล้ว</p>
              <p className="text-sm text-gray-400">อัปเกรดเป็น Pro เพื่อสร้างต่อ</p>
            </div>
            <Link
              href="/pricing"
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              อัปเกรด
            </Link>
          </div>
        )}

        {/* Stories */}
        <div>
          <h2 className="mb-4 font-semibold text-white">Story ของฉัน</h2>
          {stories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-gray-600" />
              <p className="font-semibold text-gray-400">ยังไม่มี story</p>
              <p className="mt-1 text-sm text-gray-600">กดปุ่ม "สร้าง Story ใหม่" เพื่อเริ่มต้น</p>
              <Link
                href="/create"
                className="mt-4 flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
                สร้างเดี๋ยวนี้
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group rounded-2xl border border-white/5 bg-white/3 p-5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-colors"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {story.title}
                    </h3>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-400">
                      {GENRE_LABEL[story.genre] ?? story.genre}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-gray-500 line-clamp-2">{story.prompt}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    {new Date(story.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
