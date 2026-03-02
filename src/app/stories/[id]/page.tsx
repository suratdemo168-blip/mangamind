import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, User, BookOpen, MessageSquare, Globe, Plus } from "lucide-react";
import ExportButtons from "@/components/story/ExportButtons";
import CharacterImage from "@/components/story/CharacterImage";

const GENRE_LABEL: Record<string, string> = {
  action: "⚔️ แอ็คชั่น", romance: "💕 โรแมนติก", fantasy: "🧙 แฟนตาซี",
  comedy: "😂 ตลก", horror: "👻 สยองขวัญ", scifi: "🚀 ไซไฟ",
  sliceoflife: "🌸 ชีวิตประจำวัน",
};

const TYPE_LABEL: Record<string, string> = {
  manga: "มังงะ", manhwa: "มันฮวา", manhua: "มันฮวา (จีน)", webtoon: "เว็บตูน",
};

type StoryContent = {
  title?: string;
  synopsis?: string;
  worldSetting?: string;
  characters?: {
    name: string;
    role: string;
    personality: string;
    ability?: string;
    appearance?: string;
  }[];
  chapters?: {
    number: number;
    title: string;
    summary: string;
    keyScene?: string;
    dialogue?: string;
  }[];
  raw?: string;
};

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [story, user] = await Promise.all([
    prisma.story.findUnique({ where: { id } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);
  if (!story || story.userId !== session.user.id) notFound();

  let content: StoryContent = {};
  try {
    content = JSON.parse(story.content);
  } catch {
    content = { raw: story.content };
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="no-print mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไป Dashboard
        </Link>

        {/* Title */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-gray-400">
              {GENRE_LABEL[story.genre] ?? story.genre}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-gray-400">
              {TYPE_LABEL[story.type] ?? story.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-gray-400">
              {story.language === "th" ? "🇹🇭 ไทย" : "🇺🇸 English"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white md:text-3xl">
            {content.title ?? story.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            สร้างเมื่อ {new Date(story.createdAt).toLocaleDateString("th-TH", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>

        {/* Synopsis */}
        {content.synopsis && (
          <section className="mb-6 rounded-2xl border border-white/5 bg-white/3 p-5">
            <h2 className="mb-2 flex items-center gap-2 font-semibold text-white">
              <BookOpen className="h-4 w-4 text-violet-400" />
              เรื่องย่อ
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">{content.synopsis}</p>
          </section>
        )}

        {/* World Setting */}
        {content.worldSetting && (
          <section className="mb-6 rounded-2xl border border-white/5 bg-white/3 p-5">
            <h2 className="mb-2 flex items-center gap-2 font-semibold text-white">
              <Globe className="h-4 w-4 text-blue-400" />
              โลกและฉาก
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">{content.worldSetting}</p>
          </section>
        )}

        {/* Characters */}
        {content.characters && content.characters.filter((c) => c.name?.trim()).length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <User className="h-4 w-4 text-pink-400" />
              ตัวละคร ({content.characters.filter((c) => c.name?.trim()).length} คน)
            </h2>
            <div className="flex flex-col gap-3">
              {content.characters.filter((c) => c.name?.trim()).map((char, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{char.name}</span>
                    {char.role?.trim() && (
                      <span className="rounded-full bg-violet-500/20 px-3 py-0.5 text-xs text-violet-300 border border-violet-500/20">
                        {char.role}
                      </span>
                    )}
                  </div>
                  {char.appearance?.trim() && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">รูปลักษณ์</span>
                      <p className="mt-0.5 text-sm text-gray-400">{char.appearance}</p>
                    </div>
                  )}
                  {char.personality?.trim() && (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">บุคลิก</span>
                      <p className="mt-0.5 text-sm text-gray-300">{char.personality}</p>
                    </div>
                  )}
                  {char.ability?.trim() && (
                    <div className="mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                      <span className="text-xs font-medium text-amber-400">⚡ ความสามารถ</span>
                      <p className="mt-0.5 text-sm text-amber-300">{char.ability}</p>
                    </div>
                  )}
                  <CharacterImage character={char} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chapters */}
        {content.chapters && content.chapters.length > 0 && (() => {
          const isFree = (user?.plan ?? "FREE") === "FREE";
          const FREE_LIMIT = 2;
          const visibleChapters = isFree ? content.chapters!.slice(0, FREE_LIMIT) : content.chapters!;
          const lockedChapters = isFree ? content.chapters!.slice(FREE_LIMIT) : [];

          return (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <BookOpen className="h-4 w-4 text-amber-400" />
                โครงเรื่อง ({content.chapters!.length} ตอน)
                {isFree && (
                  <span className="ml-auto text-xs font-normal text-gray-500">
                    เห็น {FREE_LIMIT}/{content.chapters!.length} ตอน
                  </span>
                )}
              </h2>
              <div className="flex flex-col gap-3">
                {visibleChapters.map((ch) => (
                  <div key={ch.number} className="rounded-2xl border border-white/5 bg-white/3 p-5">
                    <div className="mb-2 flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                        {ch.number}
                      </span>
                      <h3 className="font-semibold text-white">{ch.title}</h3>
                    </div>
                    <p className="mb-2 text-sm leading-relaxed text-gray-400">{ch.summary}</p>
                    {ch.keyScene && (
                      <p className="mb-2 text-xs text-gray-500">
                        <span className="text-gray-400">ฉากสำคัญ:</span> {ch.keyScene}
                      </p>
                    )}
                    {ch.dialogue && (
                      <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-3">
                        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="h-3 w-3" />
                          บทสนทนา
                        </div>
                        <div className="text-sm italic text-gray-300 whitespace-pre-line">{ch.dialogue}</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Locked chapters (Free plan) */}
                {lockedChapters.length > 0 && (
                  <div className="relative">
                    <div className="pointer-events-none select-none">
                      {lockedChapters.map((ch) => (
                        <div key={ch.number} className="mb-3 rounded-2xl border border-white/5 bg-white/3 p-5 blur-sm">
                          <div className="mb-2 flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                              {ch.number}
                            </span>
                            <h3 className="font-semibold text-white">{ch.title}</h3>
                          </div>
                          <p className="text-sm text-gray-400">{ch.summary}</p>
                        </div>
                      ))}
                    </div>
                    {/* Upgrade overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-transparent via-[#0c0b1a]/80 to-[#0c0b1a]">
                      <div className="text-center px-6 pt-12">
                        <p className="mb-1 font-bold text-white">
                          ยังมีอีก {lockedChapters.length} ตอน
                        </p>
                        <p className="mb-4 text-sm text-gray-400">
                          อัปเกรดเป็น Pro เพื่อดูโครงเรื่องทั้งหมด พร้อมตัวละคร + บทพูด
                        </p>
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                        >
                          ดู Pricing
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* Raw fallback */}
        {content.raw && (
          <section className="mb-6 rounded-2xl border border-white/5 bg-white/3 p-5">
            <pre className="whitespace-pre-wrap text-sm text-gray-300">{content.raw}</pre>
          </section>
        )}

        {/* Export */}
        <div className="no-print">
          <ExportButtons
            content={content}
            storyTitle={content.title ?? story.title}
          />
        </div>

        {/* CTA */}
        <div className="no-print mt-6 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            สร้าง Story ใหม่
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:border-white/20 hover:text-white transition-colors"
          >
            กลับไป Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
