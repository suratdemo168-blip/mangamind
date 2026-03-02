import Link from "next/link";
import { Check, Zap, Sparkles, BookOpen } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubscribeButton from "@/components/pricing/SubscribeButton";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    period: "/เดือน",
    desc: "สำหรับมือใหม่ที่อยากลอง",
    icon: BookOpen,
    iconColor: "text-gray-400",
    features: [
      "3 story/เดือน",
      "Outline สั้นๆ",
      "ทุก genre",
      "ทุก format",
    ],
    notIncluded: [
      "Plot + ตัวละครละเอียด",
      "บทสนทนา",
      "Priority generation",
    ],
    cta: "เริ่มต้นฟรี",
    highlight: false,
    badge: null,
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$12",
    period: "/เดือน",
    desc: "สำหรับนักเขียนที่จริงจัง",
    icon: Sparkles,
    iconColor: "text-violet-400",
    features: [
      "30 story/เดือน",
      "Plot + ตัวละครละเอียดครบ",
      "บทสนทนาทุกตอน",
      "Export PDF/TXT",
      "ทุก genre + format",
    ],
    notIncluded: [
      "Priority generation",
    ],
    cta: "เริ่มใช้ Pro",
    highlight: true,
    badge: "แนะนำ",
  },
  {
    id: "ULTRA",
    name: "Ultra",
    price: "$29",
    period: "/เดือน",
    desc: "สำหรับครีเอเตอร์มืออาชีพ",
    icon: Zap,
    iconColor: "text-amber-400",
    features: [
      "Story ไม่จำกัด",
      "ทุก feature ของ Pro",
      "AI แปลมังงะ (เร็วๆ นี้)",
      "Priority generation",
    ],
    notIncluded: [],
    cta: "เริ่มใช้ Ultra",
    highlight: false,
    badge: null,
  },
];

const FAQS = [
  {
    q: "ยกเลิก subscription ได้ไหม?",
    a: "ได้เลย ยกเลิกเมื่อไหรก็ได้ ไม่มีสัญญาผูกมัด แพลนจะใช้ได้จนหมดรอบที่จ่ายไป",
  },
  {
    q: "Credits reset เมื่อไหร่?",
    a: "รีเซ็ตทุกต้นเดือน credits ที่ไม่ได้ใช้จะหมดอายุ ไม่สะสมข้ามเดือน",
  },
  {
    q: "อัปเกรดแล้ว credits เพิ่มทันทีไหม?",
    a: "ทันทีเลยครับ พอชำระเงินเสร็จ credits จะอัปเดตในบัญชีภายใน 1 นาที",
  },
  {
    q: "ชำระเงินผ่านช่องทางไหนได้บ้าง?",
    a: "รับบัตรเครดิต/เดบิตทุกประเภทผ่าน Stripe ปลอดภัย 100%",
  },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  let currentPlan = "FREE";
  if (session) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    currentPlan = user?.plan ?? "FREE";
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium text-violet-400">ราคา</p>
          <h1 className="mb-3 text-3xl font-extrabold text-white md:text-4xl">
            เลือกแพลนที่เหมาะกับคุณ
          </h1>
          <p className="text-gray-400">ยกเลิกได้ทุกเมื่อ ไม่มีสัญญาผูกมัด</p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isDowngrade =
              (currentPlan === "ULTRA" && plan.id !== "ULTRA") ||
              (currentPlan === "PRO" && plan.id === "FREE");

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/5 bg-white/3"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <Icon className={`mb-3 h-6 w-6 ${plan.iconColor}`} />
                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>
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
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 line-through">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-700" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="mt-auto w-full rounded-full border border-white/10 py-2.5 text-center text-sm font-semibold text-gray-500">
                    แพลนปัจจุบัน
                  </div>
                ) : isDowngrade ? (
                  <div className="mt-auto w-full rounded-full border border-white/5 py-2.5 text-center text-xs text-gray-600">
                    ดาวน์เกรดผ่าน Dashboard
                  </div>
                ) : !session ? (
                  <Link
                    href="/register"
                    className={`mt-auto w-full rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-violet-600 text-white hover:bg-violet-500"
                        : "border border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : plan.id === "FREE" ? (
                  <Link
                    href="/create"
                    className="mt-auto w-full rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-300 hover:border-white/20 hover:text-white transition-colors"
                  >
                    ไปสร้าง Story
                  </Link>
                ) : (
                  <SubscribeButton
                    plan={plan.id as "PRO" | "ULTRA"}
                    label={plan.cta}
                    highlight={plan.highlight}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-xl font-bold text-white">คำถามที่พบบ่อย</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/5 bg-white/3 p-5">
                <h3 className="mb-2 font-semibold text-white">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
