import { useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { CursorFX, IntroCurtain, StarField } from "./components/fx";
import Header from "./components/Header";
import { About, Hero } from "./components/Hero";
import Services from "./components/Services";
import Experience from "./components/Experience";
import { CloudCase, MobileCase, Portfolio } from "./components/Work";
import { Contact, Footer } from "./components/Contact";

export default function App() {
  const [revealed, setRevealed] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip bg-black font-sfr text-white">
        <StarField />
        <div className="grain" aria-hidden />
        <IntroCurtain onLeave={() => setRevealed(true)} />
        <CursorFX />
        <Header />
        <main>
          <motion.div
            initial={false}
            animate={{ opacity: revealed ? 1 : 0.5, scale: revealed ? 1 : 1.04 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 38%" }}
          >
            <Hero />
          </motion.div>
          <About />
          <Services />
          <Experience />
          <CloudCase />
          <MobileCase />
          <Portfolio />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
