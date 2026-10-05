import { useEffect, useState, type ReactNode } from "react";
import { HoverText } from "./fx";
import { asset } from "../lib/asset";

export type CaseStudyData = {
  t: string;
  d: string;
  tag: string;
  img: string;
  role: string;
  year: string;
  client: string;
  problem: string;
  process: string[];
  solution: string;
  result: { v: string; l: string }[];
  gallery: string[];
};

function Label({ children }: { children: ReactNode }) {
  return <span className="font-sfr text-[11px] uppercase tracking-[0.2em] text-white/40">{children}</span>;
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Label>{label}</Label>
      <p className="max-w-[60ch] font-sfr text-[clamp(16px,1.5vw,26px)] leading-[1.45] text-white/85">{body}</p>
    </div>
  );
}

export default function CaseStudy({ work, onClose }: { work: CaseStudyData | null; onClose: () => void }) {
  const [current, setCurrent] = useState<CaseStudyData | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (work) {
      setCurrent(work);
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setCurrent(null), 400);
    return () => clearTimeout(t);
  }, [work]);

  useEffect(() => {
    if (!current) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [current, onClose]);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${current.t} case study`}
      style={{ pointerEvents: shown ? "auto" : "none" }}
      className={`fixed inset-0 z-[95] overflow-y-auto overscroll-contain p-[clamp(12px,3vw,48px)] transition-opacity duration-300 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div aria-hidden onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

      <article
        className={`relative z-10 mx-auto w-full max-w-[1100px] overflow-hidden rounded-[clamp(24px,2.5vw,40px)] border border-white/12 bg-ink transition-all duration-500 ease-[var(--ease-lux)] ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.98] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="glass absolute right-[clamp(16px,2vw,28px)] top-[clamp(16px,2vw,28px)] z-20 grid size-[clamp(42px,3.2vw,56px)] place-items-center rounded-full"
        >
          <span className="relative block size-5">
            <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
          </span>
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900">
          <img src={asset(current.img)} alt={current.t} className="size-full object-cover" />
        </div>

        <div className="flex flex-col gap-[clamp(28px,4vw,64px)] p-[clamp(22px,4vw,72px)]">
          <header className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 px-4 py-1.5 font-sfr text-[11px] uppercase tracking-[0.16em] text-white/70">
                {current.tag}
              </span>
              <span className="font-sfr text-[11px] uppercase tracking-[0.16em] text-white/40">{current.year}</span>
            </div>
            <h3 className="font-sfm text-[clamp(34px,4.5vw,84px)] leading-[0.95] tracking-[-0.02em]">
              <HoverText text={current.t} radius={160} amp={10} />
            </h3>
            <p className="max-w-[75ch] font-sfr text-[clamp(16px,1.5vw,26px)] leading-[1.4] text-[#a7a7a7]">{current.d}</p>
          </header>

          <div className="grid gap-[clamp(20px,2vw,40px)] border-y border-white/12 py-[clamp(20px,2.5vw,40px)] sm:grid-cols-3">
            {[
              ["Role", current.role],
              ["Year", current.year],
              ["Client", current.client],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <span className="font-sfr text-[11px] uppercase tracking-[0.18em] text-white/40">{k}</span>
                <span className="font-sfm text-[clamp(15px,1.2vw,20px)] text-white/90">{v}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-[clamp(24px,3vw,56px)] lg:grid-cols-2">
            <Block label="The Problem" body={current.problem} />
            <Block label="The Solution" body={current.solution} />
          </div>

          <div className="flex flex-col gap-6">
            <Label>The Process</Label>
            <ol className="flex flex-col">
              {current.process.map((p, i) => (
                <li key={i} className="flex gap-[clamp(16px,1.6vw,32px)] border-t border-white/10 py-5">
                  <span className="font-inter-semi text-[clamp(15px,1.3vw,22px)] text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[70ch] font-sfr text-[clamp(15px,1.25vw,22px)] leading-[1.5] text-[#a7a7a7]">{p}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-6">
            <Label>Result</Label>
            <div className="flex flex-col gap-[18px] sm:flex-row sm:gap-10">
              {current.result.map((r) => (
                <div key={r.l} className="group flex flex-1 flex-col gap-2 border-t border-white/80 pt-4">
                  <span className="whitespace-nowrap font-inter-semi text-[clamp(28px,2.6vw,44px)] leading-none transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-2">
                    {r.v}
                  </span>
                  <span className="font-inter text-[13px] leading-[1.45] text-white/70">{r.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-[clamp(16px,1.5vw,24px)] sm:grid-cols-2">
            {current.gallery.map((g, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-[24px] bg-neutral-900">
                <img src={asset(g)} alt="" loading="lazy" className="size-full object-cover" />
              </div>
            ))}
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="glass inline-flex w-fit items-center gap-3 rounded-full px-[clamp(20px,2vw,36px)] py-[clamp(12px,1.1vw,20px)] font-sfm text-[clamp(15px,1.25vw,22px)] text-white"
          >
            Start a project like this →
          </a>
        </div>
      </article>
    </div>
  );
}
