import * as THREE from "three";
import { gsap, prefersReduced, isMobile, isTouch } from "../core/motion";
import { formVert, formFrag, dustVert, dustFrag, rayVert, rayFrag } from "./shaders";
import { sample, VEC_LEN, type Anchor } from "./choreography";

/**
 * One persistent renderer for the whole page. The sculptural form, the dust field and the
 * light backdrop are choreographed by scroll position (see choreography.ts).
 * Everything is disposed on teardown; rendering pauses when hidden or fully faded.
 */
export function createStage(canvas: HTMLCanvasElement): (() => void) | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile(), alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const mobile = isMobile();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  scene.add(camera);

  /* Sculptural form */
  const seg = mobile ? 96 : 220;
  const formGeo = new THREE.SphereGeometry(1, seg, seg);
  const formMat = new THREE.ShaderMaterial({
    vertexShader: formVert,
    fragmentShader: formFrag,
    uniforms: {
      uTime: { value: 0 },
      uDist: { value: 0.3 },
      uTwist: { value: 0.4 },
      uDark: { value: new THREE.Color() },
      uLight: { value: new THREE.Color() },
      uRim: { value: new THREE.Color() },
    },
  });
  const form = new THREE.Mesh(formGeo, formMat);
  const group = new THREE.Group();
  group.add(form);

  /* Orbit ring(s) — thin, quiet */
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false });
  const ringGeo = new THREE.TorusGeometry(2.1, 0.004, 8, 256);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 1.15;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.003, 8, 256), ringMat);
  ring2.rotation.set(1.9, 0.4, 0.2);
  group.add(ring, ring2);
  scene.add(group);

  /* Dust */
  const N = mobile ? 700 : 2600;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    pos.set([Math.cos(th) * r, (Math.random() - 0.5) * 18, Math.sin(th) * r * 0.7 - 2], i * 3);
    seed[i] = Math.random();
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const dustMat = new THREE.ShaderMaterial({
    vertexShader: dustVert,
    fragmentShader: dustFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: mobile ? 5 : 7 },
      uSpread: { value: 1 },
      uColor: { value: new THREE.Color("#f0e2cc") },
      uOpacity: { value: 0.55 },
    },
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* God-ray backdrop, parented to the camera so it behaves like volumetric light in the lens */
  const rayMat = new THREE.ShaderMaterial({
    vertexShader: rayVert,
    fragmentShader: rayFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
      uAmt: { value: 1 },
      uCenter: { value: new THREE.Vector2(0.66, 0.66) },
    },
  });
  const rayGeo = new THREE.PlaneGeometry(1, 1);
  const rays = new THREE.Mesh(rayGeo, rayMat);
  rays.position.z = -20;
  camera.add(rays);

  /* State */
  let anchors: Anchor[] = [];
  const target: number[] = new Array(VEC_LEN).fill(0);
  const cur: number[] = new Array(VEC_LEN).fill(0);
  let inited = false;
  const intro = { v: 1 };
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  let visible = true;
  let running = true;

  const readAnchors = () => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-cam]"));
    anchors = els
      .map((el) => ({ name: el.dataset.cam as string, y: el.getBoundingClientRect().top + window.scrollY }))
      .sort((a, b) => a.y - b.y);
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // size backdrop to cover frustum at its distance
    const hh = 2 * Math.tan((camera.fov * Math.PI) / 360) * 20;
    rays.scale.set(hh * camera.aspect * 1.05, hh * 1.05, 1);
    readAnchors();
  };
  resize();
  const ro = new ResizeObserver(() => resize());
  ro.observe(document.body);
  window.addEventListener("resize", resize);
  const refreshLater = window.setTimeout(readAnchors, 1200);

  const onMove = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!isTouch) window.addEventListener("pointermove", onMove);
  const onVis = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  const c = new THREE.Color();
  const lookAt = new THREE.Vector3();
  let time = 0;

  const tick = (_: number, delta: number) => {
    if (!running || !visible) return;
    sample(window.scrollY, anchors, target);
    if (!inited) {
      for (let i = 0; i < VEC_LEN; i++) cur[i] = target[i];
      inited = true;
    }
    const k = prefersReduced ? 1 : 1 - Math.pow(0.0009, delta / 1000 + 0.0001); // frame-rate independent damping
    const kk = Math.min(1, Math.max(0.04, k * 6));
    for (let i = 0; i < VEC_LEN; i++) cur[i] += (target[i] - cur[i]) * kk;

    const [cx, cy, cz, lx, ly, ox, oy, os, spin, dist, twist, spread, ringO, ray, op] = cur;
    canvas.style.opacity = String(Math.max(0, Math.min(1, op)));
    if (op < 0.01) return; // fully hidden behind opaque chapters → skip GPU work

    time += prefersReduced ? 0 : delta / 1000;
    ptr.sx += (ptr.x - ptr.sx) * 0.04;
    ptr.sy += (ptr.y - ptr.sy) * 0.04;

    const m = mobile ? 0.25 : 1;
    camera.position.set(cx + ptr.sx * 0.35, cy - ptr.sy * 0.2, cz * (mobile ? 1.12 : 1));
    lookAt.set(lx * m, ly, 0);
    camera.lookAt(lookAt);

    group.position.set(ox * m, oy + (mobile ? 1.7 : 0), 0); // lift the form above the title on small screens
    const sc = os * (mobile ? 0.62 : 1);
    group.scale.setScalar(sc);
    group.rotation.y = spin * 0.55 + time * 0.07 + ptr.sx * 0.35;
    group.rotation.x = ptr.sy * 0.12;
    ring.rotation.z = time * 0.08;
    ring2.rotation.z = -time * 0.05;

    formMat.uniforms.uTime.value = time;
    formMat.uniforms.uDist.value = dist + intro.v * 0.9;
    formMat.uniforms.uTwist.value = twist;
    formMat.uniforms.uDark.value.setRGB(cur[15], cur[16], cur[17]);
    formMat.uniforms.uLight.value.setRGB(cur[18], cur[19], cur[20]);
    c.setRGB(cur[21], cur[22], cur[23]);
    formMat.uniforms.uRim.value.copy(c);
    ringMat.color.copy(c);
    ringMat.opacity = ringO;
    dustMat.uniforms.uTime.value = time;
    dustMat.uniforms.uSpread.value = spread;
    rayMat.uniforms.uTime.value = time;
    rayMat.uniforms.uColor.value.copy(c);
    rayMat.uniforms.uAmt.value = ray * 0.55;
    rayMat.uniforms.uCenter.value.set(0.5 + (ox * m) * 0.06 + 0.12, 0.64);

    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  // Entrance: form materialises (scale from 0) once the loader lifts
  const tween = gsap.to(intro, { v: 0, duration: 3.2, ease: "expo.out", delay: 0.3 });

  return () => {
    running = false;
    tween.kill();
    gsap.ticker.remove(tick);
    window.clearTimeout(refreshLater);
    ro.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onVis);
    [formGeo, ringGeo, dustGeo, rayGeo].forEach((g) => g.dispose());
    [formMat, ringMat, dustMat, rayMat].forEach((m2) => m2.dispose());
    ring2.geometry.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
