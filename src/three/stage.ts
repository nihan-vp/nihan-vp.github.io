import * as THREE from "three";
import { gsap, prefersReduced, isMobile, isTouch } from "../core/motion";
import { playClayTap } from "../core/audio";
import { formVert, formFrag, dustVert, dustFrag, rayVert, rayFrag } from "./shaders";
import { sample, VEC_LEN, type Anchor } from "./choreography";
import { clayState, MAX_STAMPS, type ClayFinish, type ClayForm, type ClayTool } from "./clayState";

const FORM_VEC: Record<ClayForm, [number, number, number, number]> = {
  organic: [1, 0, 0, 0],
  torsion: [0, 1, 0, 0],
  facet: [0, 0, 1, 0],
  harmonic: [0, 0, 0, 1],
};

const FINISH_VEC: Record<ClayFinish, [number, number, number, number]> = {
  raw: [1, 0, 0, 0],
  glaze: [0, 1, 0, 0],
  topo: [0, 0, 1, 0],
  wire: [0, 0, 0, 1],
};

const TOOL_LABEL: Record<ClayTool, string> = {
  orbit: "Orbit",
  push: "Push",
  pull: "Pull",
  ripple: "Ripple",
};

/**
 * One persistent renderer for the whole page. The interactive 3D clay sculpture, the dust field
 * and the light backdrop are choreographed by scroll position and respond directly to pointer input.
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

  /* Interactive sculptural clay form */
  const seg = mobile ? 112 : 224;
  const formGeo = new THREE.SphereGeometry(1, seg, seg);
  const stampUniforms = Array.from({ length: MAX_STAMPS }, () => new THREE.Vector4(0, 0, 1, 0));

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
      uFormWeights: { value: new THREE.Vector4(1, 0, 0, 0) },
      uFinishWeights: { value: new THREE.Vector4(1, 0, 0, 0) },
      uStamps: { value: stampUniforms },
      uBrush: { value: new THREE.Vector4(0, 0, 1, 0) },
      uPulsePos: { value: new THREE.Vector3(0, 0, 1) },
      uPulseAge: { value: 99 },
      uHoverAmt: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    },
  });
  const form = new THREE.Mesh(formGeo, formMat);
  const group = new THREE.Group();
  group.add(form);

  /* Precision orbital gimbals + satellite nodes */
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false });
  const ringGeo = new THREE.TorusGeometry(2.1, 0.0045, 8, 256);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = 1.15;

  const ring2Geo = new THREE.TorusGeometry(2.6, 0.0032, 8, 256);
  const ring2 = new THREE.Mesh(ring2Geo, ringMat);
  ring2.rotation.set(1.9, 0.4, 0.2);

  const satGeo = new THREE.SphereGeometry(0.036, 14, 14);
  const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, depthWrite: false });
  const sat1 = new THREE.Mesh(satGeo, satMat);
  sat1.position.set(2.1, 0, 0);
  const sat2 = new THREE.Mesh(satGeo, satMat);
  sat2.position.set(-1.05, 1.818, 0);
  const sat3 = new THREE.Mesh(satGeo, satMat);
  sat3.position.set(0, 2.6, 0);
  ring.add(sat1, sat2);
  ring2.add(sat3);

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
      uPointer: { value: new THREE.Vector2(0, 0) },
    },
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* God-ray backdrop, parented to the camera */
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
  let curOp = 1;

  /* Interactive clay state */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const invGroupMat = new THREE.Matrix4();
  const localRay = new THREE.Ray();
  const unitSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
  const hitPt = new THREE.Vector3();
  const hitDir = new THREE.Vector3();
  const brushTargetDir = new THREE.Vector3(0, 0, 1);
  let hoverTarget = 0;
  let isHovering = false;
  let lastCursorLabel = "";
  let pulseAge = 99;
  let dragYaw = 0;
  let dragPitch = 0;
  let dragYawVel = 0;
  let dragPitchVel = 0;

  const drag = {
    active: false,
    x: 0,
    y: 0,
    moved: 0,
    mode: "orbit" as ClayTool,
    hitDir: new THREE.Vector3(0, 0, 1),
    lastStampTime: 0,
    lastStampDir: new THREE.Vector3(0, 0, 1),
  };

  const setCursorLabel = (lbl: string) => {
    if (lbl === lastCursorLabel) return;
    lastCursorLabel = lbl;
    window.dispatchEvent(new CustomEvent("clay-cursor", { detail: lbl }));
  };

  const hitClay = (clientX: number, clientY: number, out: THREE.Vector3): boolean => {
    if (!visible || curOp < 0.15) return false;
    ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    camera.updateMatrixWorld();
    group.updateMatrixWorld();
    raycaster.setFromCamera(ndc, camera);
    invGroupMat.copy(group.matrixWorld).invert();
    localRay.copy(raycaster.ray).applyMatrix4(invGroupMat);
    // Normalize ellipsoid (0.94, 1.42, 0.94) into unit sphere space
    localRay.origin.set(localRay.origin.x / 0.94, localRay.origin.y / 1.42, localRay.origin.z / 0.94);
    localRay.direction.set(localRay.direction.x / 0.94, localRay.direction.y / 1.42, localRay.direction.z / 0.94).normalize();
    if (!localRay.intersectSphere(unitSphere, hitPt)) return false;
    out.copy(hitPt).normalize();
    return true;
  };

  const isDomUi = (targetEl: EventTarget | null) => {
    if (document.querySelector(".roc-panel.open, .cs")) return true;
    const menu = document.getElementById("menu");
    if (menu && menu.style.display !== "none") return true;
    if (!(targetEl instanceof Element)) return false;
    return !!targetEl.closest("a, button, input, textarea, select, [role='button'], .clay-hud, .roc-launch, .nav");
  };

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
    if (!isTouch) {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    if (drag.active) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.moved += Math.hypot(dx, dy);
      drag.x = e.clientX;
      drag.y = e.clientY;

      if (drag.mode === "orbit") {
        const vy = dx * 0.0085;
        const vp = dy * 0.0065;
        dragYaw += vy;
        dragPitch = Math.max(-1.05, Math.min(1.05, dragPitch + vp));
        dragYawVel = vy;
        dragPitchVel = vp;
      } else if (drag.mode === "push" || drag.mode === "pull") {
        if (hitClay(e.clientX, e.clientY, hitDir)) {
          brushTargetDir.copy(hitDir);
          hoverTarget = 1;
          const now = performance.now();
          if (hitDir.dot(drag.lastStampDir) < 0.992 || now - drag.lastStampTime > 55) {
            clayState.addStamp(hitDir.x, hitDir.y, hitDir.z, drag.mode === "push" ? -0.14 : 0.14);
            drag.lastStampDir.copy(hitDir);
            drag.lastStampTime = now;
          }
        }
      }
      return;
    }

    if (isTouch) return;
    if (!isDomUi(e.target) && hitClay(e.clientX, e.clientY, hitDir)) {
      isHovering = true;
      hoverTarget = 1;
      brushTargetDir.copy(hitDir);
      clayState.setHovering(true);
      setCursorLabel(TOOL_LABEL[clayState.tool]);
    } else if (isHovering) {
      isHovering = false;
      hoverTarget = 0;
      clayState.setHovering(false);
      setCursorLabel("");
    }
  };

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (isDomUi(e.target)) return;
    if (!hitClay(e.clientX, e.clientY, hitDir)) return;

    const tool = clayState.tool;
    // On touch, allow vertical page scrolling in Orbit mode while keeping tap-to-ripple & Push/Pull sculpting
    if (e.pointerType === "touch" && tool === "orbit") {
      drag.active = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved = 0;
      drag.mode = "ripple";
      drag.hitDir.copy(hitDir);
      return;
    }

    drag.active = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.moved = 0;
    drag.mode = tool;
    drag.hitDir.copy(hitDir);
    drag.lastStampDir.copy(hitDir);
    drag.lastStampTime = performance.now();
    brushTargetDir.copy(hitDir);
    hoverTarget = 1;

    if (tool === "push" || tool === "pull") {
      clayState.addStamp(hitDir.x, hitDir.y, hitDir.z, tool === "push" ? -0.14 : 0.14);
      playClayTap(0.45);
    }
  };

  const onUp = () => {
    if (!drag.active) return;
    if (drag.moved < 8) {
      formMat.uniforms.uPulsePos.value.copy(drag.hitDir);
      pulseAge = 0;
      playClayTap(0.8);
    }
    drag.active = false;
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  const unsubReset = clayState.onReset(() => {
    dragYawVel = 0;
    dragPitchVel = 0;
    gsap.to({ y: dragYaw, p: dragPitch }, {
      y: 0,
      p: 0,
      duration: 0.9,
      ease: "power3.out",
      onUpdate() {
        const t = this.targets()[0] as { y: number; p: number };
        dragYaw = t.y;
        dragPitch = t.p;
      },
    });
    formMat.uniforms.uPulsePos.value.set(0, 0.25, 0.97).normalize();
    pulseAge = 0;
    playClayTap(0.6);
  });

  const unsubPulse = clayState.onPulse(() => {
    formMat.uniforms.uPulsePos.value.set(0.22, 0.28, 0.93).normalize();
    pulseAge = 0;
    playClayTap(0.8);
  });

  const onVis = () => (visible = !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  const c = new THREE.Color();
  const lookAt = new THREE.Vector3();
  const targetFormVec = new THREE.Vector4();
  const targetFinishVec = new THREE.Vector4();
  let time = 0;

  const tick = (_: number, delta: number) => {
    if (!running || !visible) return;
    const dt = Math.min(0.05, delta / 1000);

    sample(window.scrollY, anchors, target);
    if (!inited) {
      for (let i = 0; i < VEC_LEN; i++) cur[i] = target[i];
      inited = true;
    }
    const k = prefersReduced ? 1 : 1 - Math.pow(0.0009, dt + 0.0001);
    const kk = Math.min(1, Math.max(0.04, k * 6));
    for (let i = 0; i < VEC_LEN; i++) cur[i] += (target[i] - cur[i]) * kk;

    const [cx, cy, cz, lx, ly, ox, oy, os, spin, dist, twist, spread, ringO, ray, op] = cur;
    curOp = op;
    canvas.style.opacity = String(Math.max(0, Math.min(1, op)));
    const hudVisible = op > 0.15;
    clayState.setStageVisible(hudVisible);

    if (op < 0.01) {
      if (isHovering) {
        isHovering = false;
        hoverTarget = 0;
        clayState.setHovering(false);
        setCursorLabel("");
      }
      return;
    }

    time += prefersReduced ? 0 : dt;
    if (pulseAge < 4.0) pulseAge += dt;

    ptr.sx += (ptr.x - ptr.sx) * 0.05;
    ptr.sy += (ptr.y - ptr.sy) * 0.05;

    // Inertia on manual clay orbit
    if (!drag.active) {
      dragYaw += dragYawVel;
      dragPitch = Math.max(-1.05, Math.min(1.05, dragPitch + dragPitchVel));
      dragYawVel *= 0.92;
      dragPitchVel *= 0.92;
    }

    const m = mobile ? 0.25 : 1;
    camera.position.set(cx + ptr.sx * 0.35, cy - ptr.sy * 0.2, cz * (mobile ? 1.12 : 1));
    lookAt.set(lx * m, ly, 0);
    camera.lookAt(lookAt);

    group.position.set(ox * m, oy + (mobile ? 1.7 : 0), 0);
    const sc = os * (mobile ? 0.62 : 1);
    group.scale.setScalar(sc);
    group.rotation.y = spin * 0.55 + time * 0.07 + ptr.sx * 0.32 + dragYaw;
    group.rotation.x = ptr.sy * 0.12 + dragPitch;

    ring.rotation.z = time * 0.09 + dragYaw * 0.25;
    ring2.rotation.z = -time * 0.055 - dragPitch * 0.3;

    // Smooth morphing between form modes & finishes
    const fv = FORM_VEC[clayState.form];
    targetFormVec.set(fv[0], fv[1], fv[2], fv[3]);
    formMat.uniforms.uFormWeights.value.lerp(targetFormVec, prefersReduced ? 1 : Math.min(1, dt * 5.2));

    const fnv = FINISH_VEC[clayState.finish];
    targetFinishVec.set(fnv[0], fnv[1], fnv[2], fnv[3]);
    formMat.uniforms.uFinishWeights.value.lerp(targetFinishVec, prefersReduced ? 1 : Math.min(1, dt * 6.5));

    // Smoothly interpolate sculpt stamps so reset springs clay back organically
    const stampLerp = prefersReduced ? 1 : Math.min(1, dt * 10);
    for (let i = 0; i < MAX_STAMPS; i++) {
      const src = clayState.stamps[i];
      const dst = stampUniforms[i];
      if (src) {
        dst.x += (src.x - dst.x) * stampLerp;
        dst.y += (src.y - dst.y) * stampLerp;
        dst.z += (src.z - dst.z) * stampLerp;
        dst.w += (src.strength - dst.w) * stampLerp;
      } else {
        dst.w += (0 - dst.w) * stampLerp;
      }
    }

    // Live tactile hover brush
    const brushLerp = Math.min(1, dt * 12);
    const uBrush = formMat.uniforms.uBrush.value as THREE.Vector4;
    uBrush.x += (brushTargetDir.x - uBrush.x) * brushLerp;
    uBrush.y += (brushTargetDir.y - uBrush.y) * brushLerp;
    uBrush.z += (brushTargetDir.z - uBrush.z) * brushLerp;
    const toolBrushAmp = clayState.tool === "push" ? -0.075 : clayState.tool === "pull" ? 0.075 : 0.04;
    const targetBrushW = hoverTarget * toolBrushAmp;
    uBrush.w += (targetBrushW - uBrush.w) * brushLerp;

    formMat.uniforms.uHoverAmt.value += (hoverTarget - formMat.uniforms.uHoverAmt.value) * brushLerp;
    formMat.uniforms.uPulseAge.value = pulseAge;
    formMat.uniforms.uPointer.value.set(ptr.sx, ptr.sy);

    formMat.uniforms.uTime.value = time;
    formMat.uniforms.uDist.value = dist + intro.v * 0.9;
    formMat.uniforms.uTwist.value = twist;
    formMat.uniforms.uDark.value.setRGB(cur[15], cur[16], cur[17]);
    formMat.uniforms.uLight.value.setRGB(cur[18], cur[19], cur[20]);
    c.setRGB(cur[21], cur[22], cur[23]);
    formMat.uniforms.uRim.value.copy(c);

    ringMat.color.copy(c);
    ringMat.opacity = ringO;
    satMat.color.copy(c);
    satMat.opacity = Math.min(1, ringO * 1.55);

    dustMat.uniforms.uTime.value = time;
    dustMat.uniforms.uSpread.value = spread;
    dustMat.uniforms.uPointer.value.set(ptr.sx, ptr.sy);

    rayMat.uniforms.uTime.value = time;
    rayMat.uniforms.uColor.value.copy(c);
    rayMat.uniforms.uAmt.value = ray * 0.55;
    rayMat.uniforms.uCenter.value.set(0.5 + ox * m * 0.06 + 0.12, 0.64);

    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  const tween = gsap.to(intro, { v: 0, duration: 3.2, ease: "expo.out", delay: 0.3 });

  return () => {
    running = false;
    setCursorLabel("");
    clayState.setHovering(false);
    tween.kill();
    unsubReset();
    unsubPulse();
    gsap.ticker.remove(tick);
    window.clearTimeout(refreshLater);
    ro.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    document.removeEventListener("visibilitychange", onVis);
    [formGeo, ringGeo, ring2Geo, satGeo, dustGeo, rayGeo].forEach((g) => g.dispose());
    [formMat, ringMat, satMat, dustMat, rayMat].forEach((m2) => m2.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
