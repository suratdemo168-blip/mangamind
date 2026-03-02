"use client";

import { Download, Printer } from "lucide-react";

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
};

function buildTxt(content: StoryContent, storyTitle: string): string {
  const lines: string[] = [];
  const hr = "─".repeat(50);

  lines.push("═".repeat(50));
  lines.push(`  ${storyTitle}`);
  lines.push("═".repeat(50));
  lines.push("");

  if (content.synopsis) {
    lines.push("【 เรื่องย่อ 】");
    lines.push(hr);
    lines.push(content.synopsis);
    lines.push("");
  }

  if (content.worldSetting) {
    lines.push("【 โลกและฉาก 】");
    lines.push(hr);
    lines.push(content.worldSetting);
    lines.push("");
  }

  const chars = content.characters?.filter((c) => c.name?.trim()) ?? [];
  if (chars.length > 0) {
    lines.push(`【 ตัวละคร (${chars.length} คน) 】`);
    lines.push(hr);
    for (const c of chars) {
      lines.push(`▸ ${c.name}  [${c.role}]`);
      if (c.appearance?.trim()) lines.push(`  รูปลักษณ์: ${c.appearance}`);
      if (c.personality?.trim()) lines.push(`  บุคลิก: ${c.personality}`);
      if (c.ability?.trim()) lines.push(`  ความสามารถ: ${c.ability}`);
      lines.push("");
    }
  }

  if (content.chapters && content.chapters.length > 0) {
    lines.push(`【 โครงเรื่อง (${content.chapters.length} ตอน) 】`);
    lines.push(hr);
    for (const ch of content.chapters) {
      lines.push(`ตอนที่ ${ch.number}: ${ch.title}`);
      lines.push(ch.summary);
      if (ch.keyScene?.trim()) lines.push(`ฉากสำคัญ: ${ch.keyScene}`);
      if (ch.dialogue?.trim()) {
        lines.push("บทสนทนา:");
        lines.push(ch.dialogue);
      }
      lines.push("");
    }
  }

  lines.push(hr);
  lines.push("สร้างโดย MangaMind");

  return lines.join("\n");
}

type Props = {
  content: StoryContent;
  storyTitle: string;
};

export default function ExportButtons({ content, storyTitle }: Props) {
  const handleTxt = () => {
    const text = buildTxt(content, storyTitle);
    const blob = new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${storyTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={handleTxt}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white transition-colors"
      >
        <Download className="h-4 w-4" />
        Export TXT
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white transition-colors"
      >
        <Printer className="h-4 w-4" />
        Export PDF
      </button>
    </div>
  );
}
