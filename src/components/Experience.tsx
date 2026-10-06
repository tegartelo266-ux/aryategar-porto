import { useState } from "react";
import { motion } from "motion/react";
import { GradientTitle, HoverText, Pill, Reveal } from "./fx";

const items = [
  {
    title: "UI/UX Designer Intern at Illiyin Studio",
    year: "2022 - 2023",
    text: "Supported the product team with wireframes, user flows and high-fidelity screens for client web apps, and learned how a design system holds a growing product together.",
    tags: ["Wireframing", "Prototyping", "Design System"],
  },
  {
    title: "Freelance UI/UX Designer at Illiyin Studio",
    year: "2023 - 2024",
    text: "Owned interface design from first sketch to developer handoff for mobile and web projects, running quick usability tests to refine every release.",
    tags: ["Mobile App", "Web App", "Usability Testing"],
  },
  {
    title: "Praetorian UI/UX Designer BNCC",
    year: "2025 - 2026",
    text: "Led visual and interaction design for community learning programs and events, mentoring newer members on Figma and critique practice.",
    tags: ["Leadership", "Mentoring", "Branding"],
  },
  {
    title: "Activis HIMTI",
    year: "2025 - Now",
    text: "Designing and building campus digital products as an active member, from promotional assets to front-end implementations shipped to real students.",
    tags: ["Front-end", "Community", "Visual Design"],
  },
];

function Row({ item, open, onToggle, index }: { item: (typeof items)[number]; open: boolean; onToggle: () => void; index: number }) {
  return (
    <Reveal delay={index * 0.08} y={30}>
      <div
        className={`relative border-b transition-colors duration-700 ease-[var(--ease-lux)] ${
          open ? "border-transparent bg-white text-ink" : "border-white/15 bg-transparent text-white"
        }`}
      >
        <button
          type="button"
          data-cursor={open ? "Close" : "Open"}
          aria-expanded={open}
          aria-controls={`exp-${index}`}
          onClick={onToggle}
          className="group/row relative flex w-full flex-col gap-3 px-[clamp(20px,5.2vw,100px)] py-[clamp(20px,2.6vw,50px)] text-left sm:flex-row sm:items-start sm:justify-between sm:gap-8"
        >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 origin-bottom bg-white/[0.07] transition-transform duration-700 ease-[var(--ease-lux)] ${
            open ? "scale-y-0" : "scale-y-0 [@media(hover:hover)]:group-hover/row:scale-y-100"
          }`}
        />
          <div className="min-w-0 sm:max-w-[60%] lg:max-w-[55%]">
            <HoverText
              as="span"
              text={item.title}
              by="word"
              fade={open ? 0 : 0.75}
              radius={150}
              amp={8}
              className={`block font-sfm leading-[1.2] transition-[font-size] duration-[800ms] ease-[var(--ease-lux)] ${
                open ? "text-[clamp(22px,1.98vw,38px)]" : "text-[clamp(26px,3.33vw,64px)]"
              }`}
            />
            <div
              id={`exp-${index}`}
              className={`grid transition-[grid-template-rows] duration-[800ms] ease-[var(--ease-lux)] motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-[clamp(10px,1vw,18px)] font-sfr text-[clamp(15px,1.67vw,32px)] leading-[1.2] text-[#434343]">
                  {item.text}
                </div>
                <div className="flex flex-wrap gap-2 pb-2 pt-5">
                  {item.tags.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={false}
                      animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: open ? 0.3 + i * 0.1 : 0 }}
                      className="rounded-full border border-ink/25 px-4 py-1.5 font-sfr text-[clamp(13px,1vw,18px)] text-ink"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[clamp(12px,1.5vw,28px)] sm:pt-1">
            <span className="whitespace-nowrap font-sfm text-[clamp(28px,4.17vw,80px)] leading-[1.2]">
              <HoverText text={item.year} radius={140} amp={8} />
            </span>
            <span
              aria-hidden
              className={`relative grid size-[clamp(28px,2.4vw,44px)] shrink-0 place-items-center rounded-full border transition-all duration-700 ease-[var(--ease-lux)] ${
                open ? "rotate-45 border-ink/40" : "border-white/40"
              }`}
            >
              <span className="absolute h-px w-1/2 bg-current" />
              <span className="absolute h-1/2 w-px bg-current" />
            </span>
          </div>
        </button>
      </div>
    </Reveal>
  );
}

export default function Experience() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="experience" className="py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-[clamp(32px,4vw,80px)]">
        <div className="flex flex-col gap-[clamp(20px,3vw,48px)] px-[clamp(20px,5.2vw,100px)] lg:flex-row lg:items-end lg:justify-between lg:gap-[8vw]">
          <div className="flex max-w-[699px] flex-col gap-[26px]">
            <Reveal>
              <Pill>Experience</Pill>
            </Reveal>
            <GradientTitle text={"A Yearly Snapshot of My Creative Growth"} className="text-[clamp(32px,3.33vw,64px)] !leading-[1.15]" radius={150} />
          </div>
          <p className="max-w-[728px] font-sfr text-[clamp(16px,1.67vw,32px)] leading-[1.2] text-[#a7a7a7]">
            <HoverText
              by="word"
              radius={120}
              amp={3}
              text="A quick look at where I've worked, what I owned, and the skills I picked up — from internships and freelance projects to leading design for campus communities."
            />
          </p>
        </div>
        <div className="border-t border-white/15">
          {items.map((it, i) => (
            <Row key={it.title} item={it} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
