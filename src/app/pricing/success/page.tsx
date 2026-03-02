import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20">
            <CheckCircle className="h-10 w-10 text-violet-400" />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-extrabold text-white">
          อัปเกรดสำเร็จแล้ว!
        </h1>
        <p className="mb-2 text-gray-400">
          Credits จะอัปเดตภายใน 1 นาที
        </p>
        <p className="mb-8 text-sm text-gray-600">
          ขอบคุณที่ใช้ MangaMind ✨
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            สร้าง Story เลย
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:border-white/20 hover:text-white transition-colors"
          >
            ไป Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
