import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { GradientTitle, HoverText, Pill, Reveal } from "./fx";
import HeroObject from "./HeroObject";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const bgX = useTransform(sx, (v) => v * -40);
  const bgY = useTransform(sy, (v) => v * -30);
  const fgX = useTransform(sx, (v) => v * 18);
  const fgY = useTransform(sy, (v) => v * 12);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[clamp(48px,8vw,150px)] pt-[clamp(120px,14vw,260px)]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <motion.div aria-hidden style={{ x: bgX, y: scrollY }} className="absolute inset-[-6%] -z-10">
        <motion.div style={{ y: bgY }} className="size-full">
          <HeroObject className="size-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </motion.div>
      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-[1920px] px-[clamp(20px,5.2vw,100px)]">
        <Reveal y={20}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <Pill>UI/UX &amp; Web Dev</Pill>
            <span className="inline-flex items-center gap-2 font-sfr text-[clamp(13px,1vw,18px)] text-white/60">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              Available for freelance
            </span>
          </div>
        </Reveal>
        <div className="mt-[clamp(14px,1.3vw,25px)] flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div style={{ x: fgX }}>
            <GradientTitle
              text={"Visual\nStoryteller"}
              fade={0.85}
              radius={320}
              amp={22}
              className="!font-sfr text-[clamp(44px,14.6vw,300px)] !leading-[0.9] tracking-[-0.02em]"
            />
          </motion.div>
          <Reveal delay={0.5} className="relative w-full max-w-[460px] lg:max-w-[440px] lg:pb-[2vw] lg:text-right">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-6 -inset-y-5 z-0"
              style={{ background: "radial-gradient(74% 74% at 55% 50%, rgba(0,0,0,0.72), transparent 74%)" }}
            />
            <p className="relative z-10 font-sfr text-[clamp(15px,1.46vw,28px)] leading-[1.35] text-[#a7a7a7]">
              <HoverText by="word" radius={110} amp={4} text={"Hi, I’m Arya\nUI/UX Designer & Front-end Dev\nClean, user-centered design"} />
            </p>
            <div className="relative z-10 mt-[clamp(20px,2vw,36px)] flex flex-wrap gap-3 lg:justify-end">
              <a
                href="#webdesign"
                data-cursor="Work"
                className="glass rounded-full px-[clamp(20px,2vw,36px)] py-[clamp(12px,1.1vw,20px)] font-sfm text-[clamp(14px,1.25vw,22px)] text-white"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="rounded-full bg-white px-[clamp(20px,2vw,36px)] py-[clamp(12px,1.1vw,20px)] font-sfm text-[clamp(14px,1.25vw,22px)] text-ink transition-transform duration-500 hover:scale-105"
              >
                Let's talk
              </a>
            </div>
          </Reveal>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-gradient-to-b from-white/70 to-transparent md:block"
      />
    </section>
  );
}

const stats = [
  { v: "1 yrs", l: "1 Years Work Experience" },
  { v: "10", l: "Projects Already Done" },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" ref={ref} className="relative px-[clamp(20px,5.2vw,100px)] py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto grid max-w-[1720px] gap-[clamp(32px,4vw,80px)] lg:grid-cols-[minmax(0,491fr)_minmax(0,1100fr)] lg:items-start">
        <Reveal>
          <div
            data-cursor="Hi!"
            className="relative mx-auto aspect-square w-full max-w-[491px] overflow-hidden rounded-full bg-neutral-900 ring-1 ring-white/20 lg:mx-0"
          >
            <motion.img
              src="/assets/5cc19.webp"
              alt="Portrait of Arya Tegar"
              style={{ y: imgY }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-[130%] w-full -top-[10%] object-cover object-[50%_18%]"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-[clamp(20px,2vw,32px)]">
          <Reveal>
            <Pill>About Me</Pill>
          </Reveal>
          <GradientTitle
            text={"Curious by nature.\nPrecise by practice."}
            fade={0.55}
            radius={200}
            amp={14}
            className="text-[clamp(34px,4.5vw,86px)] !leading-none tracking-[-0.02em]"
          />
          <div className="flex flex-col gap-[clamp(28px,3vw,64px)] lg:flex-row lg:items-start lg:justify-between">
            <p className="max-w-[1000px] font-sfr text-[clamp(16px,1.67vw,32px)] leading-[1.25] text-[#a7a7a7] lg:max-w-[600px]">
              <HoverText
                by="word"
                radius={120}
                amp={3}
                text="I’m Arya, a multidisciplinary designer and developer who turns complex ideas into clear, useful digital experiences. My process moves between research, interface design, and front-end craft."
              />
            </p>
            <div className="flex w-full flex-col gap-[18px] sm:max-w-[420px] lg:w-[clamp(320px,29vw,520px)] lg:shrink-0">
              {stats.map((s, i) => (
                <Reveal key={s.v} delay={0.1 * i} y={20}>
                  <div className="group flex items-baseline justify-between gap-4 border-t border-white/80 pt-4 transition-colors duration-500 hover:border-white">
                    <span className="font-inter-semi text-[34px] transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-2">
                      {s.v}
                    </span>
                    <span className="text-right font-inter text-[13px] leading-[1.35] text-white/80">{s.l}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
