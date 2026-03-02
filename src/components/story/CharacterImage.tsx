"use client";

import { useState } from "react";
import { ImageIcon, Loader2, RefreshCw, AlertCircle } from "lucide-react";

type CharacterProps = {
  name: string;
  appearance?: string;
  role?: string;
  ability?: string;
};

export default function CharacterImage({ character }: { character: CharacterProps }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: character.name,
          appearance: character.appearance,
          role: character.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "สร้างภาพไม่สำเร็จ");
        return;
      }

      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      {!imageUrl && !loading && !error && (
        <button
          onClick={generate}
          className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          สร้างภาพตัวละคร
        </button>
      )}

      {loading && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-white/5 bg-white/3">
          <div className="flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
            <p className="text-xs text-gray-500">กำลังสร้างภาพ...</p>
            <p className="text-xs text-gray-600">อาจใช้เวลา 15-30 วินาที</p>
          </div>
        </div>
      )}

      {error && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            ลองใหม่
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">ภาพตัวละคร (AI-generated)</p>
          <img
            src={imageUrl}
            alt={character.name}
            className="w-full max-w-[220px] rounded-xl border border-white/10"
          />
          <button
            onClick={generate}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            สร้างใหม่
          </button>
        </div>
      )}
    </div>
  );
}
