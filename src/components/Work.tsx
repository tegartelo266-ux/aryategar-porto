import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { GradientTitle, HoverText, Pill, Reveal, Tilt } from "./fx";
import CaseStudy, { type CaseStudyData } from "./CaseStudy";
import { asset } from "../lib/asset";

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="group flex flex-1 flex-col gap-[10px] border-t border-white/80 pt-4">
      <span className="whitespace-nowrap font-inter-semi text-[clamp(24px,2vw,34px)] leading-none transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-2">
        {v}
      </span>
      <span className="font-inter text-[13px] leading-[1.45] text-white/80">{l}</span>
    </div>
  );
}

const cloudFeatures = [
  {
    t: "Drag & drop upload",
    d: "Add files with a simple drop.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V9m0 0-3 3m3-3 3 3" />
        <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.5 9.5 3.75 3.75 0 0 1 17 18" />
      </svg>
    ),
  },
  {
    t: "One-click sharing",
    d: "Create secure links in a single step.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 14.5 14.5 9.5" />
        <path d="M8 11 6 13a3.5 3.5 0 0 0 5 5l2-2" />
        <path d="M16 13l2-2a3.5 3.5 0 0 0-5-5l-2 2" />
      </svg>
    ),
  },
  {
    t: "Storage insights",
    d: "Track usage across every drive in real time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10M10 20V5M16 20v-6M22 20H2" />
      </svg>
    ),
  },
];

export function CloudCase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [8, 0]);

  return (
    <section id="webdesign" className="relative px-[clamp(20px,5.2vw,100px)] py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto flex max-w-[1720px] flex-col items-center gap-[clamp(28px,3vw,60px)] text-center">
        <div className="flex max-w-[759px] flex-col items-center gap-[clamp(18px,1.7vw,32px)]">
          <Reveal>
            <Pill>Web Design</Pill>
          </Reveal>
          <GradientTitle text="Cloud Storage" className="text-[clamp(36px,3.33vw,64px)] !leading-none" radius={180} />
          <p className="font-sfr text-[clamp(16px,1.25vw,24px)] leading-[1.2] text-[#a7a7a7] lg:text-[clamp(16px,1.67vw,32px)]">
            <HoverText by="word" radius={110} amp={3} text="Developed a cloud storage dashboard with features to simplify file management and sharing." />
          </p>
          <div className="flex w-full max-w-[480px] flex-col gap-[18px] text-left sm:flex-row sm:gap-8">
            <Stat v="1 Week" l="1 Week to make this app" />
            <Stat v="3 Variants" l="3 variants for this app" />
          </div>
        </div>

        <div className="grid w-full max-w-[1040px] gap-x-[clamp(24px,3vw,64px)] gap-y-[clamp(18px,1.6vw,28px)] text-left sm:grid-cols-3">
          {cloudFeatures.map((f, i) => (
            <Reveal key={f.t} delay={0.08 * i} y={20}>
              <div className="flex items-start gap-4">
                <span className="grid size-[clamp(40px,3vw,56px)] shrink-0 place-items-center rounded-full border border-white/15 text-white/80 [&>svg]:size-[45%]">
                  {f.icon}
                </span>
                <span className="flex flex-col">
                  <span className="font-sfm text-[clamp(16px,1.25vw,24px)] leading-tight text-white">{f.t}</span>
                  <span className="font-sfr text-[clamp(13px,1vw,18px)] leading-[1.4] text-[#a7a7a7]">{f.d}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div ref={ref} className="w-full [perspective:1600px]">
          <motion.div style={{ scale, rotateX: rotate }} className="relative mx-auto max-w-[1397px]">
            <div aria-hidden className="absolute inset-x-[10%] -bottom-[8%] top-[20%] -z-10 rounded-full bg-white/10 blur-[120px]" />
            <Tilt max={4} radius="32px">
              <img
                src="/assets/99f2a.webp"
                alt="Cloud storage dashboard shown on a tablet"
                loading="lazy"
                className="block w-full"
              />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Ticker({ to, prefix = "" }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [start, setStart] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const onScroll = () => {
      if (done) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        done = true;
        setStart(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const begun = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - begun) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value).toLocaleString("en-US")}
    </span>
  );
}

function LabelTag({ className, text }: { className: string; text: string }) {
  return (
    <span
      className={`glass absolute z-20 hidden items-center gap-2 rounded-full px-3 py-1.5 font-sfr text-[clamp(11px,0.9vw,14px)] text-white/80 sm:inline-flex ${className}`}
    >
      <span className="size-1.5 rounded-full bg-white" />
      {text}
    </span>
  );
}

const mobileFeatures = [
  {
    t: "Multi-account",
    d: "All cards and balances in one glance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="3" />
        <path d="M3 10h18" />
        <circle cx="16.5" cy="14.5" r="1" />
      </svg>
    ),
  },
  {
    t: "Smart budgeting",
    d: "Set limits and track spending instantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  },
  {
    t: "Real-time insights",
    d: "See trends the moment they happen.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v9l5 3" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export function MobileCase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yLeft = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-30, 50]);
  const yCard = useTransform(scrollYProgress, [0, 1], [30, -50]);

  return (
    <section className="relative px-[clamp(20px,5.2vw,100px)] py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto grid max-w-[1720px] items-center gap-[clamp(40px,4vw,80px)] lg:grid-cols-2">
        {/* left copy */}
        <div className="flex flex-col gap-[clamp(18px,1.7vw,32px)]">
          <Reveal>
            <Pill>Mobile Design</Pill>
          </Reveal>
          <GradientTitle text="Expanse Tracker" className="text-[clamp(36px,3.33vw,64px)] !leading-none" radius={180} />
          <p className="max-w-[590px] font-sfr text-[clamp(16px,1.25vw,24px)] leading-[1.2] text-[#a7a7a7] lg:text-[clamp(16px,1.67vw,32px)]">
            <HoverText
              by="word"
              radius={110}
              amp={3}
              text="A sleek and efficient expense tracker UI—built to empower users to take control of their finances"
            />
          </p>
          <div className="flex w-full max-w-[480px] flex-col gap-[18px] sm:flex-row sm:gap-8">
            <Stat v="1 Week" l="1 Week to make this app" />
            <Stat v="3 Variants" l="3 variants for this app" />
          </div>

          <div className="mt-2 flex flex-col gap-5">
            {mobileFeatures.map((f, i) => (
              <Reveal key={f.t} delay={0.1 * i} y={20}>
                <div className="flex items-start gap-4">
                  <span className="grid size-[clamp(34px,2.6vw,44px)] shrink-0 place-items-center rounded-full border border-white/15 text-white/80 [&>svg]:size-[45%]">
                    {f.icon}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sfm text-[clamp(15px,1.25vw,22px)] text-white">{f.t}</span>
                    <span className="font-sfr text-[clamp(13px,1vw,18px)] leading-[1.4] text-[#a7a7a7]">{f.d}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* showcase */}
        <div ref={ref} className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[560px]">
            <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[110px]" />

            {/* back screens */}
            <motion.div style={{ y: yLeft }} className="absolute left-0 top-[9%] w-[42%] -rotate-[10deg]">
              <div className="overflow-hidden rounded-[clamp(24px,2.2vw,38px)] border border-white/10 bg-neutral-900 opacity-55">
                <img src={asset("expanse-budget.png")} alt="" aria-hidden className="block w-full" />
              </div>
            </motion.div>
            <motion.div style={{ y: yRight }} className="absolute right-0 top-[5%] w-[42%] rotate-[10deg]">
              <div className="overflow-hidden rounded-[clamp(24px,2.2vw,38px)] border border-white/10 bg-neutral-900 opacity-55">
                <img src={asset("expanse-transactions.png")} alt="" aria-hidden className="block w-full" />
              </div>
            </motion.div>

            {/* main phone */}
            <motion.div style={{ y }} className="relative z-10 mx-auto w-[56%]">
              <Tilt max={9} radius="61px">
                <div className="glass relative overflow-hidden rounded-[clamp(36px,3.2vw,61px)] p-[clamp(10px,1.1vw,20px)]">
                  <img
                    src="/assets/4f94b.webp"
                    alt="Expanse Tracker app on an iPhone"
                    loading="lazy"
                    className="block w-full rounded-[clamp(28px,2.7vw,52px)]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
                </div>
              </Tilt>
            </motion.div>

            {/* floating balance card (animated counter) */}
            <motion.div
              style={{ y: yCard }}
              className="glass absolute left-[-3%] top-[44%] z-20 rounded-2xl px-[clamp(12px,1vw,18px)] py-[clamp(10px,0.8vw,14px)]"
            >
              <span className="block text-[clamp(10px,0.75vw,12px)] uppercase tracking-[0.16em] text-white/50">Total Balance</span>
              <span className="font-sfm text-[clamp(20px,1.7vw,30px)] leading-tight text-white">
                <Ticker to={854743} prefix="$" />
              </span>
            </motion.div>

            {/* floating payment toast */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute right-[-3%] top-[64%] z-20 flex items-center gap-3 rounded-2xl px-[clamp(12px,1vw,18px)] py-[clamp(10px,0.8vw,14px)]"
            >
              <span className="grid size-[clamp(26px,2vw,36px)] place-items-center rounded-full bg-white text-[clamp(13px,1vw,18px)] text-ink">
                ✓
              </span>
              <span className="flex flex-col">
                <span className="font-sfm text-[clamp(12px,1vw,16px)] leading-tight text-white">Payment received</span>
                <span className="font-inter text-[clamp(10px,0.8vw,13px)] text-white/60">+$1,240.00</span>
              </span>
            </motion.div>

            {/* labels */}
            <LabelTag className="left-[2%] top-[22%]" text="Top Up" />
            <LabelTag className="right-[6%] top-[34%]" text="Transfer" />
            <LabelTag className="left-[-2%] top-[74%]" text="Savings" />
          </div>
        </div>
      </div>
    </section>
  );
}

const works: CaseStudyData[] = [
  {
    t: "NFT Market App",
    d: "A mobile marketplace that makes buying and selling digital collectibles feel safe, fast, and genuinely fun.",
    tag: "Mobile App",
    img: "4fd8b",
    role: "UI/UX Designer & Front-end",
    year: "2023",
    client: "Personal Project",
    problem:
      "New collectors struggled to tell a trustworthy listing from a risky one, and the buying flow buried the first bid behind too many steps.",
    process: [
      "Mapped the end-to-end buyer journey and highlighted where people dropped off.",
      "Sketched low-fidelity flows and tested two navigation models with early users.",
      "Built a reusable card and filter system, then prototyped the bidding flow.",
    ],
    solution:
      "A mobile-first marketplace with clear trust signals, live bid states, and a two-tap path from browsing to bidding.",
    result: [
      { v: "2 taps", l: "From browsing to first bid" },
      { v: "1 system", l: "Reusable card components" },
    ],
    related: ["Cloud Storage V2", "Sales Dashboard"],
  },
  {
    t: "Cloud Storage V2",
    d: "A calm cloud dashboard that makes storing, uploading, and sharing files feel effortless.",
    tag: "Website",
    img: "d84b4",
    role: "Product Designer",
    year: "2024",
    client: "Concept Case Study",
    problem:
      "People couldn't see how much storage they had left, and sharing a single file took far more clicks than it should.",
    process: [
      "Audited the old dashboard and clustered user feedback into clear themes.",
      "Restructured the information architecture around files, sharing, and storage.",
      "Designed a component library for tables, drives, and empty states.",
    ],
    solution:
      "A clear storage overview with drag-and-drop uploads and shareable links created in a single step.",
    result: [
      { v: "-40%", l: "Fewer steps to share a file" },
      { v: "1 library", l: "Reusable UI components" },
    ],
    related: ["Sales Dashboard", "NFT Market App"],
  },
  {
    t: "Sales Dashboard",
    d: "A focused analytics view that turns scattered sales data into decisions teams can act on.",
    tag: "Website",
    img: "8923f",
    role: "UI/UX Designer",
    year: "2023",
    client: "Concept Case Study",
    problem:
      "Sales data lived in too many places, so the team spent more time compiling numbers than acting on them.",
    process: [
      "Interviewed the sales team to find the five metrics they check every morning.",
      "Prioritised those metrics on a single glanceable screen above the fold.",
      "Built chart and table components with light and dark support.",
    ],
    solution: "A focused dashboard that surfaces trends, targets, and anomalies without the usual clutter.",
    result: [
      { v: "5 metrics", l: "Visible above the fold" },
      { v: "1 screen", l: "Daily overview" },
    ],
    related: ["Cloud Storage V2", "NFT Market App"],
  },
  {
    t: "Health Tracker V1",
    d: "A friendly health tracker that turns activity, sleep, and nutrition into one daily story.",
    tag: "Mobile App",
    img: "b4ae5",
    role: "UI/UX Designer",
    year: "2024",
    client: "Personal Project",
    problem: "Most fitness apps felt clinical and noisy, which made daily logging something users dreaded instead of enjoyed.",
    process: [
      "Researched habit-forming patterns and low-friction daily logging.",
      "Designed a ring-based summary with a single clear primary action.",
      "Prototyped logging, streaks, and gentle reminders.",
    ],
    solution: "A warm, motivational interface that keeps the user's day readable at a glance and easy to update.",
    result: [
      { v: "3 metrics", l: "In a single view" },
      { v: "1 tap", l: "To log an activity" },
    ],
    related: ["Health Tracker V2", "WhatsApp Redesign"],
  },
  {
    t: "Health Tracker V2",
    d: "A matured version that keeps the simple feel and adds depth only when users ask for it.",
    tag: "Mobile App",
    img: "90015",
    role: "UI/UX Designer",
    year: "2024",
    client: "Personal Project",
    problem: "V1 looked great, but power users wanted deeper insights without losing the calm, simple experience.",
    process: [
      "Reviewed V1 usage patterns and collected the most common requests.",
      "Added progressive disclosure so detailed trends stay out of the way.",
      "Refined the visual system with a calmer palette and stronger contrast.",
    ],
    solution: "A refined app that leads with the friendly summary and reveals advanced trends only on demand.",
    result: [
      { v: "2 levels", l: "Simple and advanced" },
      { v: "V2", l: "Higher clarity and contrast" },
    ],
    related: ["Health Tracker V1", "WhatsApp Redesign"],
  },
  {
    t: "WhatsApp Redesign",
    d: "A modern take on messaging with calmer hierarchy, clearer media, and a thoughtful dark theme.",
    tag: "Mobile App",
    img: "whatsapp1.png",
    role: "UI/UX Designer",
    year: "2026",
    client: "Concept Redesign",
    problem: "The chat list and settings felt dated and cluttered for the way people actually use messaging today.",
    process: [
      "Ran a heuristic review of the current information architecture.",
      "Explored cleaner list density and a redesigned composer and media area.",
      "Prototyped dark mode and accessibility improvements.",
    ],
    solution: "A refreshed messaging experience with calmer hierarchy, clearer media handling, and a modern dark theme.",
    result: [
      { v: "New IA", l: "Cleaner navigation" },
      { v: "Dark mode", l: "Better readability" },
    ],
    related: ["Health Tracker V2", "NFT Market App"],
  },
];

export function Portfolio() {
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 280, damping: 30, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 280, damping: 30, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const preview = hover !== null && active === null ? works[hover] : null;

  return (
    <section id="portfolio" className="relative px-[clamp(20px,5.2vw,100px)] py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-[clamp(28px,3.5vw,70px)]">
        <div className="flex flex-col items-start gap-5">
          <Reveal>
            <Pill>Portofolio</Pill>
          </Reveal>
          <GradientTitle
            text="Explore My Portfolio of creative solution"
            className="max-w-[1100px] text-[clamp(32px,3.33vw,64px)] !leading-[1.1]"
            radius={170}
          />
        </div>
        <div className="grid gap-[clamp(16px,1.7vw,32px)] sm:grid-cols-2 xl:grid-cols-3" onPointerLeave={() => setHover(null)}>
          {works.map((w, i) => (
            <Reveal key={w.t} delay={(i % 3) * 0.1}>
              <Tilt max={6} radius="32px" className="h-full">
                <button
                  type="button"
                  onClick={() => {
                    setHover(null);
                    setActive(i);
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setHover(i);
                  }}
                  className="group/w flex h-full w-full flex-col gap-[clamp(16px,1.7vw,32px)] rounded-[32px] border border-[#606060] bg-ink/60 p-[clamp(14px,1.25vw,24px)] text-left backdrop-blur-[50px] transition-colors duration-500 hover:border-white/60"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden rounded-[24px] bg-neutral-900">
                    <img
                      src={asset(w.img)}
                      alt={w.t}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover/w:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[clamp(14px,1.5vw,36px)]">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-sfm text-[clamp(22px,1.98vw,38px)] leading-[1.2] tracking-[0.03px] text-white">
                        <HoverText text={w.t} radius={110} amp={5} />
                      </h3>
                      <p className="font-sfr text-[clamp(15px,1.25vw,24px)] leading-[1.45] text-[#bfbfbf]">{w.d}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <span className="inline-flex items-center rounded-lg bg-ink px-3 py-[6px] font-sfr text-[clamp(13px,0.94vw,18px)] text-white">
                        {w.tag}
                      </span>
                      <span className="inline-flex items-center gap-2 font-sfr text-[clamp(13px,0.94vw,18px)] text-white/55 transition-colors duration-500 group-hover/w:text-white">
                        View case study
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </button>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>

      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {preview && (
              <motion.img
                key={preview.img}
                src={asset(preview.img)}
                alt=""
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="size-[clamp(150px,13vw,250px)] rounded-[22px] object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/20"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <CaseStudy
        work={active !== null ? works[active] : null}
        works={works}
        onSelect={(title) => {
          const idx = works.findIndex((w) => w.t === title);
          if (idx >= 0) setActive(idx);
        }}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
