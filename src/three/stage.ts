import * as THREE from "three";
import { gsap, prefersReduced, isMobile, isTouch } from "../core/motion";
import { formVert, formFrag, dustVert, dustFrag, rayVert, rayFrag } from "./shaders";
import { sample, VEC_LEN, type Anchor } from "./choreography";

/**
 * One persistent renderer for the whole page. The sculptural form, the dust field and the
 * light backdrop are choreographed by scroll position (see choreography.ts).
 *
 * Interaction: the clay responds to the pointer. Hovering pushes a soft dent into the
 * surface (raycast against the live deformed geometry), pressing deepens it, dragging
 * kneads, releasing sends a ripple. Everything is smoothed in a frame-rate independent
 * way and is completely inert under `prefers-reduced-motion` and on coarse pointers.
 *
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
  let dprCap = mobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  scene.add(camera);

  /* Interactive? Coarse pointers and reduced-motion users get the sculpture, not the toy. */
  const interactive = !isTouch && !prefersReduced;

  /* Sculptural form */
  const seg = mobile ? 112 : 200;
  const formGeo = new THREE.SphereGeometry(1, seg, seg);
  const TOUCH_MAX = 3;
  const touch = Array.from({ length: TOUCH_MAX }, () => new THREE.Vector4(0, 1, 0, 0));
  const ripple = Array.from({ length: TOUCH_MAX }, () => new THREE.Vector2(0, 0));
  const touchGlow = { v: 1 };

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
      uTouch: { value: touch },
      uRipple: { value: ripple },
      uTouchGlow: { value: 1 },
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
  const ring2Geo = new THREE.TorusGeometry(2.6, 0.003, 8, 256);
  const ring2 = new THREE.Mesh(ring2Geo, ringMat);
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

  /* ───────── pointer → clay ───────── */

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitPoint = new THREE.Vector3();
  const hitNormal = new THREE.Vector3();
  const smoothNormal = new THREE.Vector3(0, 1, 0); // the direction the dent follows, damped
  const localFromWorld = new THREE.Vector3();

  let hoverAmt = 0; // 0..1 how "on" the touch is
  let pressing = false;
  let pointerInside = false;
  let lastHitAt = 0;
  const rippleFx = { t: 0, strength: 0 };

  /**
   * Convert the raycast hit into a point on the *undeformed* unit sphere, because that is
   * the domain uTouch lives in. The mesh is scaled anisotropically and displaced, so the
   * world-space hit is normalised back into the local rest sphere.
   */
  const sampleHit = (): boolean => {
    ndc.set(ptr.x, -ptr.y);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(form, false);
    if (!hits.length) {
      // pointer is off the clay — the dent relaxes but dragging keeps the last normal
      pointerInside = false;
      return false;
    }
    const hit = hits[0];
    pointerInside = true;
    lastHitAt = performance.now();
    hitPoint.copy(hit.point);
    // undo the group's rotation/scale to get back into the sphere's own space
    form.worldToLocal(localFromWorld.copy(hit.point));
    if (hit.face) {
      hitNormal.copy(hit.face.normal).normalize();
      // face normals are per-face; the grazing angle is enough for a soft dent direction
      const world = hitNormal.clone().transformDirection(form.matrixWorld);
      smoothNormal.lerp(world, 0.25).normalize();
    }
    return true;
  };

  /** write the current touch into touch[0] (slot 0 is the live pointer; others hold ripples) */
  const writeTouch = (strength: number) => {
    localFromWorld.normalize();
    const tn = smoothNormal.clone();
    // the deform field is defined on the rest sphere; a good enough mapping is the
    // direction of the local hit — clay is soft, it does not need to be exact
    tn.applyQuaternion(form.quaternion.clone().invert()).normalize();
    touch[0].set(tn.x, tn.y, tn.z, strength);
  };

  const onMove = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!isTouch) window.addEventListener("pointermove", onMove);

  const onDown = (e: PointerEvent) => {
    if (!interactive || e.button !== 0) return;
    if (canvas.style.opacity && Number(canvas.style.opacity) < 0.5) return;
    pressing = true;
    if (sampleHit()) {
      ripple[0].set(0, 0);
      rippleFx.t = 0;
      rippleFx.strength = 0;
      touchGlow.v = 1.6;
    }
  };
  const onUp = () => {
    if (!pressing) return;
    pressing = false;
    // release: fire the ripple from wherever the clay was last touched
    if (pointerInside && touch[0].w !== 0) {
      ripple[0].set(0, 1); // time is written in the tick from liveTime
      rippleFx.t = 1;
      rippleFx.strength = Math.sign(touch[0].w);
    }
    touchGlow.v = 1;
  };

  if (interactive) {
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
  }

  const onVis = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  const c = new THREE.Color();
  const lookAt = new THREE.Vector3();
  let time = 0;

  const tick = (_: number, delta: number) => {
    if (!running || !visible) return;
    /* frame-rate independent damping, expressed as a half-life in seconds.
       (The previous `1 - 0.0009^(dt)`, multiplied by 6 and clamped to 1, made the
       response ~2x faster at 60Hz than at 144Hz and fully snapped at 30Hz.) */
    const dt = Math.min(delta, 64) / 1000;
    const k = 1 - Math.pow(0.5, dt / 0.10);
    const kSlow = 1 - Math.pow(0.5, dt / 0.16);

    sample(window.scrollY, anchors, target);
    if (!inited) {
      for (let i = 0; i < VEC_LEN; i++) cur[i] = target[i];
      inited = true;
    }
    for (let i = 0; i < VEC_LEN; i++) cur[i] += (target[i] - cur[i]) * k;

    const [cx, cy, cz, lx, ly, ox, oy, os, spin, dist, twist, spread, ringO, ray, op] = cur;
    canvas.style.opacity = String(Math.max(0, Math.min(1, op)));

    time += prefersReduced ? 0 : dt;
    /* wrap the clock: snoise(uTime*0.075) loses float precision after hours of uptime
       and the surface starts to stutter. 1e4s is ~2.8h and is a clean loop point for
       the slowest term (0.075 * 10000 = 750 noise units). */
    if (time > 1e4) time -= 1e4;

    ptr.sx += (ptr.x - ptr.sx) * kSlow;
    ptr.sy += (ptr.y - ptr.sy) * kSlow;

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

    /* ── clay interaction ── */
    if (interactive) {
      const onClay = op > 0.5 && sampleHit();
      const want = pressing ? (onClay ? 1 : 0.45) : onClay ? 0.34 : 0;
      // cursor reflects the *actual* hit test, not a stale pointerInside flag
      const wantCursor = pressing ? (onClay ? "grabbing" : "") : onClay ? "grab" : "";
      if (canvas.style.cursor !== wantCursor) canvas.style.cursor = wantCursor;
      hoverAmt += (want - hoverAmt) * k;
      // a pressed clay keeps its dent briefly after the pointer leaves the silhouette
      if (pressing || onClay || performance.now() - lastHitAt < 260) {
        writeTouch(pressing ? -0.34 * hoverAmt : -0.15 * hoverAmt);
      } else {
        touch[0].w += (0 - touch[0].w) * k;
        if (Math.abs(touch[0].w) < 0.0008) touch[0].w = 0;
      }
      // ripple bookkeeping: start the timer on release, then decay
      if (ripple[0].y > 0.5) {
        if (rippleFx.t > 0) {
          ripple[0].x = time;
          rippleFx.t = 0;
        }
        if (time - ripple[0].x > 2.2) ripple[0].y = 0;
      }
      touchGlow.v += (1 - touchGlow.v) * kSlow;
      formMat.uniforms.uTouchGlow.value = touchGlow.v;
    } else {
      touch[0].w += (0 - touch[0].w) * k;
    }

    formMat.uniforms.uTime.value = time;
    formMat.uniforms.uDist.value = dist + intro.v * 0.45;
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
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    window.removeEventListener("blur", onUp);
    document.removeEventListener("visibilitychange", onVis);
    [formGeo, ringGeo, ring2Geo, dustGeo, rayGeo].forEach((g) => g.dispose());
    [formMat, ringMat, dustMat, rayMat].forEach((m2) => m2.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
