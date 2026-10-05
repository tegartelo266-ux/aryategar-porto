import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

const isMouse = (e: { pointerType: string }) => e.pointerType === "mouse";

export function CursorFX() {
  const spot = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ringPos = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let sx = tx;
    let sy = ty;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      const t = e.target as HTMLElement | null;
      const view = t?.closest?.("[data-cursor]") as HTMLElement | null;
      const link = t?.closest?.("a,button");
      const text = t?.closest?.("input,textarea");
      const state = text ? "text" : view ? "view" : link ? "link" : "";
      if (ring.current) ring.current.dataset.state = state;
      if (label.current) label.current.textContent = view?.dataset.cursor ?? "";
    };
    const tick = () => {
      rx += (tx - rx) * 0.55;
      ry += (ty - ry) * 0.55;
      sx += (tx - sx) * 0.18;
      sy += (ty - sy) * 0.18;
      if (ringPos.current) ringPos.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      if (spot.current) {
        spot.current.style.setProperty("--x", `${sx}px`);
        spot.current.style.setProperty("--y", `${sy}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fx-cursor pointer-events-none" aria-hidden>
      <div
        ref={spot}
        className="fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(560px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.07), transparent 65%)",
        }}
      />
      <div ref={ringPos} className="fixed left-0 top-0 z-[100] will-change-transform">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div ref={ring} className="fx-ring">
            <span ref={label} />
          </div>
        </div>
      </div>
      <div ref={dot} className="fixed left-0 top-0 z-[101] will-change-transform">
        <div className="-translate-x-1/2 -translate-y-1/2 size-[5px] rounded-full bg-white" />
      </div>
    </div>
  );
}

/**
 * Ambient starfield that drifts slowly and lets the dots evade the pointer.
 * Dots are pushed in the direction the cursor travels, then spring back home.
 */
export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    type Dot = {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      tw: number;
      ph: number;
    };

    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    const RADIUS = 170;
    const R2 = RADIUS * RADIUS;

    const make = (): Dot => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return {
        x,
        y,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
        r: Math.random() * 1.3 + 0.5,
        a: Math.random() * 0.45 + 0.2,
        tw: Math.random() * 2 + 0.5,
        ph: Math.random() * Math.PI * 2,
      };
    };

    const paint = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(now * 0.001 * d.tw + d.ph);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(d.a * tw).toFixed(3)})`;
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(70, Math.min(240, Math.round((w * h) / 11000)));
      if (dots.length < count) {
        while (dots.length < count) dots.push(make());
      } else {
        dots.length = count;
      }
      if (reduce) paint(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      mouse.vx = Math.max(-45, Math.min(45, e.clientX - mouse.x));
      mouse.vy = Math.max(-45, Math.min(45, e.clientY - mouse.y));
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = e.pointerType !== "touch";
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(34, now - last) / 16.667;
      last = now;

      for (const d of dots) {
        // spring back toward the dot's home position
        d.vx += (d.ox - d.x) * 0.006 * dt;
        d.vy += (d.oy - d.y) * 0.006 * dt;

        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const dist = Math.sqrt(d2) || 0.001;
            const t = 1 - dist / RADIUS;
            const push = t * t * 2.4;
            d.vx += (dx / dist) * push * dt;
            d.vy += (dy / dist) * push * dt;
            // extra nudge following the cursor's direction of travel
            d.vx += mouse.vx * 0.02 * t * dt;
            d.vy += mouse.vy * 0.02 * t * dt;
          }
        }

        d.vx *= 0.9;
        d.vy *= 0.9;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      }

      // decay the stored cursor velocity so the push fades when the pointer stops
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      paint(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {
      paint(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}

/** Quick cinematic fade-from-black with the name mark on first load. */
export function IntroCurtain() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      onAnimationComplete={() => setDone(true)}
      className="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-black"
    >
      <motion.span
        initial={{ opacity: 0, y: 12, letterSpacing: "0.5em" }}
        animate={{ opacity: [0, 1, 0], y: [12, 0, -10], letterSpacing: "0.2em" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-sfm text-[clamp(20px,1.8vw,32px)] text-white/70"
      >
        ARYA
      </motion.span>
    </motion.div>
  );
}

type HoverTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  fade?: number;
  by?: "char" | "word";
  radius?: number;
  amp?: number;
  delay?: number;
};

export function HoverText({
  text,
  as: Tag = "span",
  className = "",
  fade = 0,
  by = "char",
  radius = 130,
  amp = 10,
  delay = 0,
}: HoverTextProps) {
  const root = useRef<HTMLElement>(null);
  const outers = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(root, { once: true, margin: "0px 0px -8% 0px" });
  const lines = text.split("\n");
  const total = by === "char" ? text.replace(/\s/g, "").length : text.split(/\s+/).length;

  const each = (fn: (outer: HTMLSpanElement, inner: HTMLElement) => void) =>
    outers.current.forEach((o) => {
      const inner = o?.firstElementChild as HTMLElement | null;
      if (o && inner) fn(o, inner);
    });

  const onMove = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    each((o, inner) => {
      const r = o.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), (e.clientY - (r.top + r.height / 2)) * 0.85);
      const t = Math.max(0, 1 - d / radius);
      const k = t * t * (3 - 2 * t);
      const base = Number(o.dataset.base);
      inner.style.transition = "transform .35s cubic-bezier(.22,1,.36,1), opacity .35s, text-shadow .35s";
      inner.style.transform = `translate3d(0,${-k * amp}px,0) scale(${1 + k * 0.12})`;
      inner.style.opacity = String(base + (1 - base) * Math.min(1, k * 1.4));
      inner.style.textShadow = k > 0.06 ? `0 0 ${k * 26}px rgba(255,255,255,${k * 0.55})` : "";
    });
  };
  const onLeave = () =>
    each((o, inner) => {
      inner.style.transition = "transform .9s cubic-bezier(.22,1,.36,1), opacity .9s, text-shadow .9s";
      inner.style.transform = "";
      inner.style.opacity = o.dataset.base ?? "1";
      inner.style.textShadow = "";
    });

  let n = 0;
  let slot = 0;
  const Comp = Tag as ElementType;
  const unit = (content: string) => {
    const i = n++;
    const base = 1 - fade * (total > 1 ? i / (total - 1) : 0);
    const myDelay = delay + i * (by === "char" ? 0.022 : 0.05);
    const idx = slot++;
    return (
      <span
        key={idx}
        ref={(el) => {
          outers.current[idx] = el;
        }}
        data-base={base}
        className="inline-block"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translate3d(0,.45em,0) rotate(3deg)",
          filter: inView ? "blur(0)" : "blur(8px)",
          transition: `opacity 1s ${myDelay}s var(--ease-lux), transform 1.1s ${myDelay}s var(--ease-lux), filter 1s ${myDelay}s var(--ease-lux)`,
        }}
      >
        <span className="inline-block will-change-transform" style={{ opacity: base }}>
          {content}
        </span>
      </span>
    );
  };

  return (
    <Comp ref={root} aria-label={text.replace(/\n/g, " ")} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <span aria-hidden>
        {lines.map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {line.split(" ").map((w, wi, arr) => (
              <span key={wi}>
                <span className="inline-block whitespace-nowrap">
                  {by === "char" ? [...w].map((c) => unit(c)) : unit(w)}
                </span>
                {wi < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Comp>
  );
}

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transition: "transform .6s cubic-bezier(.22,1,.36,1)" }}
      onPointerMove={(e) => {
        if (!isMouse(e) || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        ref.current.style.transition = "transform .15s ease-out";
        ref.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
        ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

export function Tilt({
  children,
  className = "",
  max = 7,
  radius = "35px",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  radius?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`group relative [transform-style:preserve-3d] ${className}`}
      style={{ transition: "transform .8s cubic-bezier(.22,1,.36,1)" }}
      onPointerMove={(e) => {
        if (!isMouse(e) || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ref.current.style.transition = "transform .12s ease-out";
        ref.current.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-6px)`;
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
        ref.current.style.transform = "";
      }}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: radius,
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.16), transparent 55%)",
        }}
      />
    </div>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 48,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Pill({ icon = "/assets/64956.svg", children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="glass inline-flex items-center gap-3 rounded-full py-[clamp(8px,0.8vw,14px)] pl-[clamp(14px,1.3vw,25px)] pr-[clamp(18px,1.7vw,32px)] text-[clamp(16px,1.67vw,32px)] leading-[1.2] text-white font-sfm">
      <img src={icon} alt="" className="size-[clamp(28px,2.6vw,50px)]" />
      {children}
    </div>
  );
}

export function GradientTitle({
  text,
  className = "",
  fade = 0.8,
  radius,
  amp,
}: {
  text: string;
  className?: string;
  fade?: number;
  radius?: number;
  amp?: number;
}) {
  return (
    <HoverText
      as="h2"
      text={text}
      fade={fade}
      radius={radius}
      amp={amp}
      className={`font-sfm leading-[1.1] tracking-[-0.01em] ${className}`}
    />
  );
}
