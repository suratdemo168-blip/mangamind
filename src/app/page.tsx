import Link from "next/link";
import { Sparkles, Zap, BookOpen, Star, ArrowRight, PenLine, Cpu, FileText, Check } from "lucide-react";

const GENRES = [
  { emoji: "⚔️", label: "แอ็คชั่น" },
  { emoji: "💕", label: "โรแมนติก" },
  { emoji: "🧙", label: "แฟนตาซี" },
  { emoji: "😂", label: "ตลก" },
  { emoji: "👻", label: "สยองขวัญ" },
  { emoji: "🚀", label: "ไซไฟ" },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI สร้าง Story ให้เลย",
    desc: "แค่พิมพ์ไอเดีย ได้ทั้ง plot ตัวละคร และโครงเรื่องแต่ละตอน ในไม่กี่วินาที",
    color: "text-violet-400",
  },
  {
    icon: BookOpen,
    title: "หลายรูปแบบ",
    desc: "สร้างได้ทั้งมังงะ, มันฮวา, มันฮวา หรือเว็บตูน AI ปรับสไตล์ตามที่คุณเลือก",
    color: "text-blue-400",
  },
  {
    icon: Zap,
    title: "ได้ผลทันที",
    desc: "ไม่ต้องรอ ได้โครงเรื่องครบพร้อมโปรไฟล์ตัวละครและตัวอย่างบทสนทนาทันที",
    color: "text-amber-400",
  },
];

const STEPS = [
  {
    icon: PenLine,
    step: "01",
    title: "กรอกไอเดียของคุณ",
    desc: "แค่พิมพ์ concept สั้นๆ เลือก genre และรูปแบบ เช่น มังงะ, เว็บตูน หรือมันฮวา",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI ทำงานให้ทันที",
    desc: "AI วิเคราะห์ไอเดียและสร้าง plot ฉาก ตัวละคร และบทสนทนาให้ครบภายในไม่กี่วินาที",
  },
  {
    icon: FileText,
    step: "03",
    title: "รับ Story ของคุณ",
    desc: "ดู story ที่สร้างเสร็จแล้ว แก้ไขได้ตามต้องการ และ export เป็น PDF หรือ TXT (Pro/Ultra)",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/เดือน",
    desc: "สำหรับมือใหม่ที่อยากลอง",
    features: ["3 story/เดือน", "Outline สั้นๆ", "ทุก genre", "ไม่ต้องใช้บัตรเครดิต"],
    cta: "เริ่มต้นฟรี",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/เดือน",
    desc: "สำหรับนักเขียนที่จริงจัง",
    features: ["30 story/เดือน", "Plot + ตัวละคร + บทสนทนาครบ", "Export PDF/TXT", "ทุก genre + format"],
    cta: "เริ่มใช้ Pro",
    href: "/register",
    highlight: true,
  },
  {
    name: "Ultra",
    price: "$29",
    period: "/เดือน",
    desc: "สำหรับครีเอเตอร์มืออาชีพ",
    features: ["Story ไม่จำกัด", "ทุก feature ของ Pro", "AI แปลมังงะ (เร็วๆ นี้)", "Priority generation"],
    cta: "เริ่มใช้ Ultra",
    href: "/register",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "ต้องมีความรู้การเขียนไหม?",
    a: "ไม่ต้องเลย แค่มีไอเดียก็พอ AI จะจัดการทุกอย่างให้ตั้งแต่ plot จนถึงบทสนทนา",
  },
  {
    q: "AI สร้างภาษาไทยได้ไหม?",
    a: "ได้ครับ MangaMind รองรับภาษาไทยเต็มรูปแบบ สามารถขอให้ AI สร้าง story เป็นภาษาไทยได้เลย",
  },
  {
    q: "แพลน Free มีข้อจำกัดอะไรบ้าง?",
    a: "Free ได้ 3 story/เดือน และจะได้แค่ outline สั้นๆ ถ้าอยากได้ plot ละเอียด ตัวละคร และบทสนทนาครบ ต้องอัปเกรดเป็น Pro ขึ้นไป",
  },
  {
    q: "ยกเลิก subscription ได้ไหม?",
    a: "ได้เลย ยกเลิกเมื่อไหรก็ได้ ไม่มีสัญญาผูกมัด แพลนจะใช้ได้จนหมดรอบที่จ่ายไป",
  },
  {
    q: "AI แปลมังงะคืออะไร?",
    a: "Feature ใน Ultra plan ที่กำลังจะมา — อัปโหลดรูปมังงะ AI จะอ่านข้อความในภาพและแปลเป็นภาษาที่คุณเลือก",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0b1a]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-28 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-violet-900/20 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            สร้าง Story การ์ตูน
            <span className="block bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              ด้วย AI ในไม่กี่วินาที
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base text-gray-400 md:text-lg">
            แค่มีไอเดีย AI จะสร้าง story มังงะให้ครบ ทั้ง plot ตัวละคร และบทสนทนา
            ไม่ต้องมีประสบการณ์เขียน
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              เริ่มต้นฟรีเลย
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-gray-300 hover:border-white/20 hover:text-white transition-colors"
            >
              ดูราคา <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            แพลนฟรี 3 เรื่อง/เดือน — ไม่ต้องใช้บัตรเครดิต
          </p>
        </div>
      </section>

      {/* Genres */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-center text-sm text-gray-500">รองรับทุก genre</p>
          <div className="flex flex-wrap justify-center gap-3">
            {GENRES.map((g) => (
              <span
                key={g.label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
              >
                {g.emoji} {g.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">
            ทุกอย่างที่คุณต้องการในการเขียน story
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/5 bg-white/3 p-6 hover:border-white/10 transition-colors"
              >
                <f.icon className={`mb-4 h-7 w-7 ${f.color}`} />
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm font-medium text-violet-400">วิธีการใช้งาน</p>
          <h2 className="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
            3 ขั้นตอนง่ายๆ ได้ story ทันที
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-6 hidden h-px w-full translate-x-6 bg-gradient-to-r from-violet-500/40 to-transparent md:block" />
                )}
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
                  <s.icon className="h-5 w-5 text-violet-400" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {s.step.slice(1)}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-medium text-violet-400">ราคา</p>
          <h2 className="mb-3 text-center text-2xl font-bold text-white md:text-3xl">
            เลือกแพลนที่เหมาะกับคุณ
          </h2>
          <p className="mb-12 text-center text-sm text-gray-500">ยกเลิกได้ทุกเมื่อ ไม่มีสัญญาผูกมัด</p>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                  plan.highlight
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/5 bg-white/3 hover:border-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    แนะนำ
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{plan.desc}</p>
                </div>
                <ul className="mb-6 flex flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-auto w-full rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "border border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            "MangaMind ช่วยให้ผมสร้าง webtoon series แรกได้ภายในบ่ายเดียว AI เข้าใจการเล่าเรื่องแบบมังงะได้ดีมาก"
          </p>
          <p className="mt-3 text-xs text-gray-600">— ผู้ทดสอบ Beta</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-center text-sm font-medium text-violet-400">FAQ</p>
          <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">
            คำถามที่พบบ่อย
          </h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/5 bg-white/3 p-5"
              >
                <h3 className="mb-2 font-semibold text-white">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            พร้อมสร้าง story ของคุณแล้วหรือยัง?
          </h2>
          <p className="mb-6 text-gray-400">เริ่มต้นฟรี อัปเกรดเมื่อพร้อม</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            เริ่มต้นฟรีเลย
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8 text-center text-xs text-gray-600">
        <p>© 2025 MangaMind. สงวนลิขสิทธิ์ทุกประการ</p>
      </footer>
    </div>
  );
}
