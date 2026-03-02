import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GENRE_TH: Record<string, string> = {
  action: "แอ็คชั่น", romance: "โรแมนติก", fantasy: "แฟนตาซี",
  comedy: "ตลก", horror: "สยองขวัญ", scifi: "ไซไฟ", sliceoflife: "ชีวิตประจำวัน",
};

const TYPE_TH: Record<string, string> = {
  manga: "มังงะ (ญี่ปุ่น)", manhwa: "มันฮวา (เกาหลี)",
  manhua: "มันฮวา (จีน)", webtoon: "เว็บตูน",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });

  if (user.credits <= 0) {
    return NextResponse.json(
      { error: "Credits หมดแล้ว กรุณาอัปเกรดแพลน" },
      { status: 402 }
    );
  }

  const body = await req.json();
  const { title, concept, genre, type, chapters = 5, language = "th" } = body;

  if (!concept || !genre || !type) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า GOOGLE_AI_API_KEY ใน .env" }, { status: 500 });
  }

  const isFree = user.plan === "FREE";
  const maxChapters = user.plan === "ULTRA" ? 5 : user.plan === "PRO" ? 3 : 1;
  const clampedChapters = Math.min(Number(chapters), maxChapters);
  const langLabel = language === "th" ? "ภาษาไทย" : "ภาษาอังกฤษ";
  const genreLabel = GENRE_TH[genre] ?? genre;
  const typeLabel = TYPE_TH[type] ?? type;

  const freePrompt = `คุณคือนักเขียนมังงะมืออาชีพ สร้าง story ${typeLabel} แนว${genreLabel} เป็น${langLabel}

ข้อมูล:
- ชื่อเรื่อง: ${title || "ตั้งชื่อให้เหมาะสม"}
- Concept: ${concept}
- จำนวนตอน: ${clampedChapters} ตอน
- รูปแบบ: ${typeLabel}
- แนว: ${genreLabel}

สร้าง synopsis ที่น่าสนใจ และ outline แต่ละตอนที่ชัดเจน (Free plan — ไม่มีตัวละครละเอียด)

ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่น:
{
  "title": "ชื่อเรื่องที่น่าสนใจ",
  "synopsis": "เรื่องย่อที่ดึงดูด 3-4 ประโยค อธิบายภาพรวมและ hook ของเรื่อง",
  "worldSetting": "",
  "characters": [],
  "chapters": [
    {
      "number": 1,
      "title": "ชื่อตอน",
      "summary": "สรุปเนื้อเรื่องของตอนนี้ 2-3 ประโยค",
      "keyScene": "",
      "dialogue": ""
    }
  ]
}`;

  const proPrompt = `คุณคือนักเขียนมังงะมืออาชีพชั้นนำ มีประสบการณ์สร้าง ${typeLabel} แนว${genreLabel} ระดับ bestseller
สร้าง story ที่สมบูรณ์และลึกซึ้ง เป็น${langLabel}

ข้อมูล:
- ชื่อเรื่อง: ${title || "ตั้งชื่อให้โดดเด่นและจดจำง่าย"}
- Concept: ${concept}
- จำนวนตอน: ${clampedChapters} ตอน
- รูปแบบ: ${typeLabel}
- แนว: ${genreLabel}

กฎสำคัญ:
1. ทุก field ต้องกรอกข้อมูลให้ครบ ห้ามเว้นว่าง
2. synopsis ต้องน่าสนใจและยาวพอ (4-5 ประโยค)
3. worldSetting ต้องอธิบายโลก บรรยากาศ และฉากหลักให้ชัดเจน (3-4 ประโยค)
4. ตัวละครต้องมีอย่างน้อย 3 คน แต่ละคนต้องมีข้อมูลครบทุก field
5. แต่ละตอนต้องมี summary ที่ละเอียด (3-4 ประโยค), keyScene ที่ระทึก, และ dialogue ที่เป็นตัวอย่างบทสนทนาจริงๆ

ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่น:
{
  "title": "ชื่อเรื่องที่โดดเด่น",
  "synopsis": "เรื่องย่อ 4-5 ประโยค ที่ดึงดูดผู้อ่าน บอก premise, conflict หลัก และ hook ของเรื่อง",
  "worldSetting": "อธิบายโลก ยุคสมัย บรรยากาศ สังคม และฉากหลักของเรื่อง 3-4 ประโยค",
  "characters": [
    {
      "name": "ชื่อตัวละคร",
      "role": "พระเอก/นางเอก/ผู้ร้ายหลัก/พระรอง/ผู้ช่วย",
      "personality": "บุคลิกและนิสัยโดยละเอียด 2-3 ประโยค",
      "ability": "ความสามารถพิเศษหรือทักษะโดดเด่น",
      "appearance": "รูปร่างหน้าตา สีผม สีตา และสิ่งที่โดดเด่น"
    }
  ],
  "chapters": [
    {
      "number": 1,
      "title": "ชื่อตอนที่น่าสนใจ",
      "summary": "สรุปเหตุการณ์ในตอนนี้ 3-4 ประโยค ระบุว่าเกิดอะไรขึ้น ใครทำอะไร และจบตอนด้วยอะไร",
      "keyScene": "อธิบายฉากสำคัญที่น่าตื่นเต้นในตอนนี้ 1-2 ประโยค",
      "dialogue": "ตัวอย่างบทสนทนาระหว่างตัวละคร เช่น\\nA: \\"ประโยคพูด\\"\\nB: \\"ประโยคตอบ\\"\\nA: \\"ประโยคต่อ\\""
    }
  ]
}`;

  const prompt = isFree ? freePrompt : proPrompt;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let content: object;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      content = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw };
    } catch {
      content = { raw };
    }

    const storyTitle =
      (content as { title?: string }).title || title || "Story ใหม่";

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        title: storyTitle,
        genre,
        type,
        language,
        prompt: concept,
        content: JSON.stringify(content),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    return NextResponse.json({ storyId: story.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Generate error:", msg);
    return NextResponse.json({ error: msg.slice(0, 300) }, { status: 500 });
  }
}
