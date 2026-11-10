import { useCallback, useEffect, useState } from "react";
import { initScroll, destroyScroll, initReveals, killReveals, ScrollTrigger, prefersReduced } from "./core/motion";
import { initMagnetic } from "./core/interactions";
import Loader from "./components/Loader";
import Stage from "./components/Stage";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Identity from "./sections/Identity";
import Expertise from "./sections/Expertise";
import Projects from "./sections/Projects";
import Timeline from "./sections/Timeline";
import Pro26 from "./sections/Pro26";
import RocSection from "./sections/RocSection";
import Contact from "./sections/Contact";
import RocAI from "./roc/RocAI";

export default function App() {
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    initScroll();
    return () => destroyScroll();
  }, []);

  const done = useCallback(() => {
    setReady(true);
    setTimeout(() => setLoaderGone(true), 300);
  }, []);

  // Once fonts are loaded and the loader lifts, run text animations and measure everything.
  useEffect(() => {
    if (!ready) return;
    initReveals();
    const unmag = initMagnetic();
    const refresh = () => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("resize"));
    };
    const t = setTimeout(refresh, 250);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      unmag();
      killReveals();
    };
  }, [ready]);

  return (
    <>
      <a href="#about" className="skip" onClick={(e) => (e.preventDefault(), document.getElementById("about")?.scrollIntoView())}>
        Skip to content
      </a>
      {!loaderGone && <Loader onDone={done} />}
      <Stage />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main className={prefersReduced ? "reduced" : ""}>
        <Hero ready={ready} />
        <Identity />
        <Expertise />
        <Projects />
        <Timeline />
        <Pro26 />
        <RocSection />
        <Contact />
      </main>
      <RocAI />
    </>
  );
}
