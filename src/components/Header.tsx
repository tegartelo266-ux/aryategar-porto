import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HoverText, Magnetic } from "./fx";

const links = [
  { label: "Home", href: "#top", id: "top" },
  { label: "About me", href: "#about", id: "about" },
  { label: "Service", href: "#services", id: "services" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Work", href: "#webdesign", id: "webdesign" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = "top";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop <= y) cur = l.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter] duration-700 ${
          scrolled ? "bg-black/55 backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-[clamp(20px,5.2vw,100px)] py-[clamp(14px,2vw,40px)]">
          <a href="#top" className="flex items-center gap-3">
            <div className="size-[clamp(44px,4vw,77px)] shrink-0 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-white/30">
              <img src="/assets/16d13.webp" alt="Arya Tegar" className="size-full scale-125 object-cover" />
            </div>
            <div className="flex flex-col gap-1 whitespace-nowrap font-sfr leading-tight">
              <span className="text-[clamp(11px,1.04vw,20px)] text-white/60">Web &amp; UI/UX Design</span>
              <span className="text-[clamp(16px,1.67vw,32px)] text-white/90">Arya Tegar</span>
            </div>
          </a>

          <nav className="hidden items-start gap-[clamp(20px,2.1vw,40px)] font-sfm lg:flex">
            {links.map((l) => (
              <a key={l.id} href={l.href} className="group flex flex-col items-center gap-[2px]">
                <span
                  className={`text-[clamp(16px,1.67vw,32px)] leading-[1.6] transition-colors duration-500 ${
                    active === l.id ? "text-white" : "text-[#828282] group-hover:text-white"
                  }`}
                >
                  <HoverText text={l.label} radius={70} amp={5} />
                </span>
                <img
                  src="/assets/43035.svg"
                  alt=""
                  className={`size-1 transition-all duration-500 ${active === l.id ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Magnetic>
                <a
                  href="#contact"
                  className="glass block whitespace-nowrap rounded-full px-[clamp(20px,2.2vw,40px)] py-[clamp(10px,1vw,18px)] font-sfm text-[clamp(14px,1.25vw,24px)] leading-[1.4] text-white"
                >
                  Contact me
                </a>
              </Magnetic>
            </div>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="glass relative grid size-12 place-items-center rounded-full lg:hidden"
            >
              <span className={`absolute h-px w-5 bg-white transition-all duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-5 bg-white transition-all duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-black px-[clamp(20px,5.2vw,100px)]"
          >
            {[...links, { label: "Contact me", href: "#contact", id: "contact" }].map((l, i) => (
              <motion.a
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                className="border-b border-white/15 py-4 font-sfm text-[clamp(36px,10vw,72px)] leading-none text-white"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
