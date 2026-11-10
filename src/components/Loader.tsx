import { useEffect, useRef, useState } from "react";
import { gsap } from "../core/motion";

/** Opening title card. Waits for fonts, counts up, then lifts like a curtain. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const prog = { v: 0 };
    let fontsReady = false;
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3500))]).then(() => (fontsReady = true));
    const tl = gsap.timeline();
    tl.fromTo(".ld-name span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.1);
    tl.to(prog, {
      v: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => setN(Math.round(fontsReady ? prog.v : Math.min(prog.v, 92))),
    }, 0.2);
    const check = gsap.ticker.add(() => {
      if (!fontsReady && prog.v >= 100) setN(92);
      if (prog.v >= 100 && fontsReady) {
        setN(100);
        gsap.ticker.remove(check);
        gsap
          .timeline({ onComplete: onDone })
          .to(".ld-meta, .ld-name", { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" })
          .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "expo.inOut" }, "-=0.1");
      }
    });
    return () => {
      gsap.ticker.remove(check);
      tl.kill();
    };
  }, [onDone]);

  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="ld-meta mono">
        <span>NIHAN ALI V P</span>
        <span>Portfolio · MMXXVI</span>
      </div>
      <div className="ld-center">
        <div className="ld-name" aria-hidden="true">
          <div className="mask"><span>Creativity first.</span></div>
          <div className="mask"><span><em>Technology underneath.</em></span></div>
        </div>
      </div>
      <div className="ld-meta mono">
        <span>Loading experience</span>
        <span className="ld-count">{String(n).padStart(3, "0")}</span>
      </div>
      <div className="ld-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
    </div>
  );
}
