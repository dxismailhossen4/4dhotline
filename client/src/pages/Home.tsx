import { useState } from "react";

export default function Home() {
  const [rememberSession, setRememberSession] = useState(true);

  return (
    <div className="min-h-screen bg-[#050c14] px-0 py-0 text-[#f5efe7]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#07131f] px-4 pb-2 pt-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between px-1 pt-1 text-[12px] font-medium text-[#f4efe8]">
          <span className="ml-1">10:56</span>
          <div className="flex items-center gap-2 text-[#f4efe8]">
            <span className="text-[11px]">◔</span>
            <span className="text-[11px]">◌</span>
            <span className="text-[11px]">▣</span>
            <span className="rounded-full bg-[#f4d97d] px-1.5 py-0.5 text-[10px] font-bold text-[#0d1622]">93</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-full border border-[#1b2d3d] bg-[#101c2b] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f0efe7] text-[#0b1520]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12 3.5a7.5 7.5 0 0 1 7.5 7.5V12h-1.5v-1a6 6 0 1 0-12 0v1H4.5v-1A7.5 7.5 0 0 1 12 3.5Zm0 9.5a3 3 0 0 1 3 3v2.5h-6V16a3 3 0 0 1 3-3Zm-7 7v-1.5h14V20H5Z"/>
              </svg>
            </div>
            <div className="flex items-center gap-2 overflow-hidden text-[17px] font-medium text-[#f0ece1]">
              <span className="text-[#d7d1c7]">↻</span>
              <span className="truncate text-[#f0ece1]">4dhotline.online/login</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-2xl leading-none text-[#f5efe8]">＋</button>
            <div className="flex h-7 min-w-[34px] items-center justify-center rounded-full bg-[#f0d67a] px-2 text-[11px] font-bold text-[#0d1822]">
              20
            </div>
            <button className="text-xl leading-none text-[#f5efe8]">⋮</button>
          </div>
        </div>

        <div className="relative mt-6 flex items-start justify-between px-1">
          <div className="flex items-baseline gap-2 text-[#f7f2e9]">
            <span className="font-serif text-[18px] italic tracking-[-0.03em]">Malaysian Guru</span>
            <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#d7b75d]">4D HOTLINE</span>
          </div>

          <div className="relative flex items-center">
            <span className="select-none text-[72px] font-medium leading-none text-[#f0f2f6]/10" style={{ fontFamily: "Georgia, serif" }}>
              4
            </span>
            <button className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#30425e] bg-[#091925] text-xl text-[#ece4d1]">
              ☰
            </button>
          </div>
        </div>

        <div className="mt-7 px-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-[#d1be74]">Member Access</p>

          <h1
            className="mt-5 text-[72px] leading-[0.86] tracking-[-0.075em] text-[#f5f1ea]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Welcome<br />back
          </h1>

          <p className="mt-4 max-w-[360px] text-[18px] leading-[1.55] text-[#c8c9cf]">
            Log in to review your membership state, payment history and available member content.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-[#d4af37]/70 pb-3 px-1">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.24em] text-[#d7b761]">
            <span>04</span>
            <span className="tracking-[0.18em] text-[#d9d2c8]">Secure entry</span>
          </div>

          <div className="flex gap-1">
            {[0, 0, 0, 0].map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${index < 3 ? "bg-[#d4af37]" : "bg-[#d4af37]/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[18px] border border-[#1f2c3d] bg-[#0d1a26]/90 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-[#d7d3cd]">
                Email
              </label>
              <input
                type="email"
                defaultValue="you@example.com"
                className="w-full rounded-xl border border-[#2b3a49] bg-[#111d2d] px-3 py-3 text-[18px] text-[#f1ede7] outline-none placeholder:text-[#d8d7d4]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.22em] text-[#d7d3cd]">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-[#2b3a49] bg-[#111d2d] px-3 py-3">
                <input
                  type="password"
                  defaultValue="123456"
                  className="w-full bg-transparent text-[18px] text-[#f1ede7] outline-none placeholder:text-[#d8d7d4]"
                  placeholder="Enter password"
                />
                <span className="ml-2 text-lg text-[#d2d1ce]">◉</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-[15px] text-[#f0ece4]">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={() => setRememberSession(!rememberSession)}
                className="h-4 w-4 accent-[#d4af37]"
              />
              <span>Remember session</span>
            </label>

            <button className="text-[15px] text-[#e9e4dc] underline decoration-[#d4af37]/60 underline-offset-4">
              Forgot password?
            </button>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-[#d4af37] px-4 py-3 text-[17px] font-bold uppercase tracking-[0.08em] text-[#0b1722] shadow-[0_10px_30px_rgba(212,175,55,0.35)]">
            Log in →
          </button>

          <div className="mt-8 text-center text-[16px] text-[#efe8df]">
            New here? <button className="font-medium text-[#efe8df] underline decoration-[#d4af37]/60 underline-offset-4">Create account</button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-2 pb-2 pt-2">
          <button className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#0c1824] text-2xl text-[#edf0ec] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">☰</button>
          <button className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d5d0c7]/20 bg-[#101c2b] text-3xl text-[#f3ece4]">◌</button>
          <button className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#0c1824] text-2xl text-[#edf0ec] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">◁</button>
        </div>
      </div>
    </div>
  );
}

