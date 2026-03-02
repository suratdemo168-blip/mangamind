"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  plan: "PRO" | "ULTRA";
  label: string;
  highlight?: boolean;
};

export default function SubscribeButton({ plan, label, highlight }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`mt-auto flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        highlight
          ? "bg-violet-600 text-white hover:bg-violet-500"
          : "border border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
      }`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </button>
  );
}
