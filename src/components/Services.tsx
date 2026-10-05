import { GradientTitle, HoverText, Pill, Reveal, Tilt } from "./fx";

const services = [
  {
    label: "UI/UX Design",
    desc: "Research, wireframes and polished interfaces that put users first.",
    icon: "/assets/8ee65.svg",
    img: "/assets/79f09.webp",
    back: "#454545",
  },
  {
    label: "Front-end Dev",
    desc: "Pixel-accurate, responsive builds with smooth, accessible interactions.",
    icon: "/assets/aa4c5.svg",
    img: "/assets/63e88.webp",
    back: "#757575",
  },
  {
    label: "Redesign App/Web",
    desc: "A fresh revamp that lifts clarity, usability and conversion.",
    icon: "/assets/6e18a.svg",
    img: "/assets/14718.webp",
    back: "#757575",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-[clamp(20px,5.2vw,100px)] py-[clamp(48px,6vw,120px)]">
      <div className="mx-auto max-w-[1720px]">
        <div className="flex flex-col gap-[clamp(20px,3vw,48px)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <Reveal>
              <Pill>Service</Pill>
            </Reveal>
            <GradientTitle text="My Service" className="text-[clamp(36px,3.33vw,64px)] !leading-[0.9]" radius={160} />
          </div>
          <p className="max-w-[728px] font-sfr text-[clamp(16px,1.67vw,32px)] leading-[1.2] text-[#a7a7a7]">
            <HoverText
              by="word"
              radius={120}
              amp={3}
              text="From first sketch to shipped product — I design clean, user-centered interfaces and build them into fast, responsive front-ends that feel effortless to use."
            />
          </p>
        </div>

        <div className="mt-[clamp(32px,4vw,80px)] grid gap-[clamp(20px,1.7vw,32px)] md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12}>
              <Tilt>
                <a
                  href="#portfolio"
                  data-cursor="Explore"
                  className="group/card relative flex aspect-[552/602] w-full flex-col overflow-hidden rounded-[35px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-white/25"
                >
                  <div className="flex shrink-0 items-center gap-[clamp(10px,0.8vw,16px)] border-b border-white/10 px-[clamp(18px,1.7vw,32px)] py-[clamp(18px,2vw,36px)]">
                    <img src={s.icon} alt="" className="size-[clamp(24px,2.6vw,50px)]" />
                    <span className="whitespace-nowrap font-sfm text-[clamp(20px,1.77vw,34px)] leading-[0.9] text-white">{s.label}</span>
                  </div>

                  <div className="relative flex-1">
                    <div
                      className="absolute left-[9%] right-[9%] top-[4%] bottom-[12%] rounded-[30px] opacity-50 transition-transform duration-700 ease-[var(--ease-lux)] group-hover/card:-translate-y-[3%]"
                      style={{ background: s.back }}
                    />
                    <div className="absolute left-[4.5%] right-[4.5%] top-[9%] bottom-[7%] rounded-[30px] bg-[#9e9d9d] transition-transform duration-700 ease-[var(--ease-lux)] group-hover/card:-translate-y-[1.5%]" />
                    <div className="absolute inset-x-[1.5%] bottom-[3%] top-[15%] overflow-hidden rounded-[30px] bg-neutral-800">
                      <img
                        src={s.img}
                        alt={s.label}
                        loading="lazy"
                        className="size-full object-cover grayscale transition duration-700 ease-[var(--ease-lux)] group-hover/card:scale-110 group-hover/card:grayscale-0 [@media(hover:none)]:grayscale-0"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-[clamp(16px,1.5vw,26px)] pb-[clamp(16px,1.5vw,26px)] pr-[28%] pt-[clamp(44px,4vw,72px)] opacity-0 transition-all duration-500 ease-[var(--ease-lux)] group-hover/card:translate-y-0 group-hover/card:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                        <p className="font-sfr text-[clamp(13px,1vw,18px)] leading-[1.45] text-white/90">{s.desc}</p>
                      </div>
                    </div>
                    <div className="glass absolute bottom-[3%] right-[2%] grid aspect-square w-[23%] place-items-center rounded-full border-[6px] !border-black !bg-white/10 transition-transform duration-700 ease-[var(--ease-lux)] group-hover/card:rotate-45">
                      <img src="/assets/8e860.svg" alt="" className="size-[60%]" />
                    </div>
                  </div>
                </a>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
