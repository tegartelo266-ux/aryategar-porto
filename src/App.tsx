import { MotionConfig } from "motion/react";
import { CursorFX, IntroCurtain, StarField } from "./components/fx";
import Header from "./components/Header";
import { About, Hero } from "./components/Hero";
import Services from "./components/Services";
import Experience from "./components/Experience";
import { CloudCase, MobileCase, Portfolio } from "./components/Work";
import { Contact, Footer } from "./components/Contact";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen overflow-x-clip bg-black font-sfr text-white">
        <StarField />
        <div className="grain" aria-hidden />
        <IntroCurtain />
        <CursorFX />
        <Header />
        <main>
          <Hero />
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
