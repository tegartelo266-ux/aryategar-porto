import { useState, type FormEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { HoverText, Magnetic, Reveal } from "./fx";

const underline =
  "underline decoration-white/40 underline-offset-[6px] transition-colors duration-500 hover:text-white hover:decoration-white";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// Dapatkan access key gratis di https://web3forms.com (masukkan emailmu), lalu paste di sini.
const WEB3FORMS_KEY = "d152717e-ac15-48b5-b6b4-226eda8d20dd";

function Badge({ emoji, className, size, rot, px, py, depth }: { emoji: string; className: string; size: string; rot: number; px: any; py: any; depth: number }) {
  const x = useTransform(px, (v: number) => v * depth);
  const y = useTransform(py, (v: number) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <div
        className="grid aspect-square place-items-center rounded-[52%] bg-[#4a4a4a] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] [animation:drift_6s_ease-in-out_infinite]"
        style={{ width: size, ["--r" as string]: `${rot}deg` }}
      >
        <span className="text-[clamp(36px,4.2vw,100px)] leading-none">{emoji}</span>
      </div>
    </motion.div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("Freelance");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 16 });
  const py = useSpring(my, { stiffness: 60, damping: 16 });
  const avX = useTransform(px, (v) => v * -14);
  const avY = useTransform(py, (v) => v * -14);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    if (!WEB3FORMS_KEY) {
      setStatus("done");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New portfolio inquiry — ${topic}`,
          name: name || "Portfolio visitor",
          email,
          topic,
          message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden px-[clamp(20px,5.2vw,100px)] py-[clamp(56px,7vw,140px)]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
    >
      <div className="mx-auto flex max-w-[1720px] flex-col items-center gap-[clamp(40px,5vw,100px)] lg:flex-row">
        <div className="flex w-full flex-col gap-[clamp(20px,1.7vw,26px)] lg:max-w-[937px] lg:flex-1">
          <HoverText
            as="h2"
            text={"Reach out\nfor more?"}
            fade={0.7}
            radius={260}
            amp={18}
            className="font-sfm text-[clamp(48px,7.3vw,140px)] leading-none tracking-[-0.02em]"
          />
          <Reveal delay={0.2}>
            <p className="max-w-[865px] font-sfr text-[clamp(17px,1.98vw,38px)] leading-[1.4] text-[#a7a7a7]">
              I regularly post my thoughts on{" "}
              <a href="https://dribbble.com/aryategar/shots" target="_blank" rel="noopener noreferrer" className={underline}>
                Dribbble
              </a>
              , and also on{" "}
              <a href="https://www.instagram.com/arya.uix/" target="_blank" rel="noopener noreferrer" className={underline}>
                Instagram
              </a>
              . Otherwise, my{" "}
              <a
                href="https://www.linkedin.com/in/arya-tegar-anubhawa-0a0373258/?isSelfProfile=true"
                target="_blank"
                rel="noopener noreferrer"
                className={underline}
              >
                LinkedIn
              </a>{" "}
              is always welcoming.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <form
              onSubmit={submit}
              className="mt-2 flex w-full max-w-[860px] flex-col gap-[clamp(14px,1.3vw,20px)] rounded-[clamp(24px,2vw,32px)] border border-white/12 bg-white/[0.04] p-[clamp(18px,1.8vw,32px)] backdrop-blur-md"
            >
              <div className="grid gap-[clamp(12px,1.2vw,18px)] sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="font-sfr text-[clamp(11px,0.9vw,14px)] uppercase tracking-[0.16em] text-white/45">Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setStatus("idle");
                    }}
                    placeholder="Your name"
                    className="rounded-2xl border border-white/12 bg-black/30 px-[clamp(14px,1.2vw,20px)] py-[clamp(10px,0.9vw,15px)] font-sfr text-[clamp(15px,1.1vw,19px)] text-white outline-none transition-colors duration-300 placeholder:text-white/35 focus:border-white/40"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sfr text-[clamp(11px,0.9vw,14px)] uppercase tracking-[0.16em] text-white/45">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus("idle");
                    }}
                    placeholder="you@email.com"
                    className="rounded-2xl border border-white/12 bg-black/30 px-[clamp(14px,1.2vw,20px)] py-[clamp(10px,0.9vw,15px)] font-sfr text-[clamp(15px,1.1vw,19px)] text-white outline-none transition-colors duration-300 placeholder:text-white/35 focus:border-white/40"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-sfr text-[clamp(11px,0.9vw,14px)] uppercase tracking-[0.16em] text-white/45">Message</span>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setStatus("idle");
                  }}
                  placeholder="Tell me about your project or what you need..."
                  className="resize-none rounded-2xl border border-white/12 bg-black/30 px-[clamp(14px,1.2vw,20px)] py-[clamp(10px,0.9vw,15px)] font-sfr text-[clamp(15px,1.1vw,19px)] leading-[1.5] text-white outline-none transition-colors duration-300 placeholder:text-white/35 focus:border-white/40"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {["Freelance", "Full-time", "Collaboration"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-full border px-[clamp(14px,1.2vw,20px)] py-[clamp(7px,0.6vw,10px)] font-sfr text-[clamp(12px,0.95vw,16px)] transition-colors duration-300 ${
                      topic === t ? "border-white bg-white text-ink" : "border-white/20 text-white/70 hover:border-white/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-sfr text-[clamp(11px,0.9vw,14px)] text-white/40">
                  {status === "error" ? "Something went wrong — please try again." : "No spam — I'll reply to your email."}
                </span>
                <Magnetic strength={0.25}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-full bg-white px-[clamp(20px,2.1vw,40px)] py-[clamp(12px,1.04vw,20px)] font-sfm text-[clamp(14px,1.25vw,24px)] tracking-[-0.36px] text-ink transition-transform duration-500 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "sending"
                      ? "Sending…"
                      : status === "done"
                        ? "Message sent ✓"
                        : status === "error"
                          ? "Try again"
                          : "Send message"}
                  </button>
                </Magnetic>
              </div>
            </form>
          </Reveal>
        </div>

        <Reveal className="relative w-full max-w-[clamp(280px,40vw,720px)] shrink-0 lg:w-[38vw]">
          <div className="relative mx-auto aspect-[1/1] w-[84%] sm:w-[82%]">
            <motion.div
              style={{ x: avX, y: avY }}
              className="absolute inset-0 overflow-hidden rounded-full bg-neutral-100/60 backdrop-blur-[75px] ring-1 ring-white/30"
            >
              <img src="/assets/16d13.webp" alt="Arya's avatar" loading="lazy" className="absolute inset-[0_-1%_-2%_-1%] size-[102%] max-w-none object-cover" />
            </motion.div>
            <Badge emoji="💪🏻" className="-left-[8%] top-[6%]" size="26%" rot={-12} px={px} py={py} depth={34} />
            <Badge emoji="😍" className="-right-[10%] top-[38%]" size="30%" rot={33} px={px} py={py} depth={-44} />
            <Badge emoji="😎" className="bottom-[2%] left-[2%]" size="24%" rot={-6} px={px} py={py} depth={26} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const foot = ["Works", "About", "Articles", "Experiments"];

export function Footer() {
  return (
    <footer className="relative z-10 bg-white text-ink">
      <div className="mx-auto flex max-w-[1720px] flex-col items-start gap-5 px-[clamp(20px,5.2vw,100px)] py-[clamp(24px,2.6vw,50px)] sm:flex-row sm:items-center sm:justify-between max-[1720px]:max-w-none">
        <p className="font-sfr text-[clamp(14px,1.67vw,32px)] tracking-[0.14px]">© 2025 arya.tgra</p>
        <nav className="flex flex-wrap gap-x-[clamp(16px,2.1vw,40px)] gap-y-2 font-sfr text-[clamp(14px,1.67vw,32px)]">
          {foot.map((f) => (
            <a key={f} href="#" className="group relative">
              <HoverText text={f} radius={60} amp={4} />
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <Magnetic strength={0.3}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-xl bg-black/10 px-4 py-3 font-sfr text-[clamp(14px,1.67vw,32px)] leading-[22px] tracking-[0.14px] transition-colors duration-500 hover:bg-ink hover:text-white"
          >
            Back up ↑
          </button>
        </Magnetic>
      </div>
    </footer>
  );
}
