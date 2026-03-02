import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

const HF_MODEL = "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, appearance, role } = await req.json();

  // ใช้ Gemini แปลคำอธิบายภาษาไทย → English prompt
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const geminiResult = await geminiModel.generateContent(
    `Convert this manga character to a Stable Diffusion image prompt (max 30 words, English only, describe physical appearance):
Name: ${name || ""}
Role: ${role || ""}
Appearance: ${appearance || ""}

Reply ONLY with the prompt. Example: "1girl, long black hair, blue eyes, school uniform, anime style"`
  );

  const basePrompt = geminiResult.response.text().trim().replace(/^["']|["']$/g, "");
  const fullPrompt = `${basePrompt}, masterpiece, best quality, anime style, detailed lineart, white background`;
  const negativePrompt = "lowres, bad anatomy, bad hands, blurry, realistic, 3d, photo";

  console.log("[image] prompt:", fullPrompt);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.HF_TOKEN && process.env.HF_TOKEN !== "your-hf-token") {
    headers["Authorization"] = `Bearer ${process.env.HF_TOKEN}`;
  }

  const hfRes = await fetch(HF_MODEL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        negative_prompt: negativePrompt,
        width: 512,
        height: 768,
        num_inference_steps: 25,
        guidance_scale: 7.0,
      },
    }),
    cache: "no-store",
  });

  console.log("[image] HF status:", hfRes.status);

  if (!hfRes.ok) {
    const errorText = await hfRes.text().catch(() => "");
    console.error("[image] HF error body:", errorText.slice(0, 300));

    if (hfRes.status === 503) {
      return NextResponse.json(
        { error: "โมเดลกำลังโหลด กรุณาลองใหม่อีก 30 วินาที" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `สร้างภาพไม่สำเร็จ (${hfRes.status})` },
      { status: 502 }
    );
  }

  const contentType = hfRes.headers.get("content-type") ?? "";
  if (!contentType.includes("image")) {
    const body = await hfRes.text();
    console.error("[image] unexpected content-type:", contentType, body.slice(0, 200));
    return NextResponse.json({ error: "ได้รับข้อมูลที่ไม่ใช่รูปภาพ" }, { status: 502 });
  }

  const buffer = await hfRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
