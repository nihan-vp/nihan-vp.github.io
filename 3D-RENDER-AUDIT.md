# 3D rendering audit — `src/three/` + `Stage.tsx`

Not a code review of style. This is an audit of the **render pipeline as it actually draws**, measured by
running the site in a real Chromium with WebGL 2.0 (ANGLE / SwiftShader) and reading back pixels and GPU counters.

| What | Where |
|---|---|
| Single persistent renderer | `src/three/stage.ts` (219 lines) |
| GLSL: form, dust, god-rays | `src/three/shaders.ts` (92 lines) |
| Scroll → camera/colour keyframes | `src/three/choreography.ts` (98 lines) |
| Mount / WebGL fallback | `src/components/Stage.tsx` |

---

## The verdict up front

**It renders. It is genuinely pretty. It is not, technically, "high-end 3D rendering."**

The honest category it sits in: *a well-executed single-object shader hero*. There is one animated mesh, one
point cloud, and one full-screen gradient. That's it. It's a strong piece of **shader craft and art
direction**, and the choreography idea (camera state as a pure function of scroll) is a good one. But the
renderer is closer to a well-dressed `ShaderMaterial` demo than to a 3D *system*.

The gap between "looks impressive" and "high-end rendering" is measurable, and it comes down to four things:

1. **There is no lighting model.** Zero lights, no shadows, no environment, no reflections, no GI.
2. **There is no material system.** One raw `ShaderMaterial`. No PBR, no transmission, no SSS, no procedural detail.
3. **There is no scene.** One sphere, two torus rings, one point cloud, one backdrop quad. Nothing is *lit*; nothing *receives* anything.
4. **The pipeline is not production-grade.** Hand-rolled colour handling, an invented damping curve, no adaptive quality, no measurement.

Below, each of those with evidence.

---

## 1. What is actually on screen — measured

Instrumented `WebGL2RenderingContext.drawElements` on the live page.

```
draw calls                        ~31 / frame
triangles / frame                 ~96,360
mesh objects in the whole scene   3  (displaced sphere + 2 torus rings)
lights                            0
shadow maps                       0
render targets / post-processing   0
textures                          0
environment map                   0
```

**Total geometry:** 48,841 vertices desktop / 9,409 mobile — and **100% of it is one sphere**. 96,360 triangles,
`SphereGeometry(1, 220, 220)`, displaced in the vertex shader.

The two "orbit rings" that read as a system are `TorusGeometry(2.1, 0.004, 8, 256)` — 8-sided tubes with a
4 mm radius. Decorative line art, not geometry.

> **Put plainly:** the entire 3D scene is 3 meshes, 0 lights, 0 textures. A "high-end" WebGL scene is
> typically 50–500 draw calls, a PBR material stack, IBL, and at least one post pass. This is the other
> end of that spectrum — 96k triangles all pouring into the same single procedural surface.

---

## 2. It is not lit — it's painted

There are **no lights in the scene**. `formFrag` computes shading from three hand-placed fake directions
(`shaders.ts:53-59`):

```glsl
vec3 L=normalize(vec3(-0.6,0.8,0.7));          // one hardcoded key light
float diff = max(dot(n,L),0.0);
float wrap = max(dot(n,L)*0.5+0.5,0.0);        // second fake diffuse
vec3  H    = normalize(L+V); spec = pow(max(dot(n,H),0.0),60.0);
float fres = pow(1.0-max(dot(n,V),0.0),2.8);   // rim
float back = pow(max(dot(n,normalize(vec3(0.7,-0.1,-0.6))),0.0),2.0);  // third fake rim
vec3 col = mix(uDark,uLight,smoothstep(0.0,1.0,diff*0.75+wrap*0.25));
```

This is a **lit-from-one-direction Blinn-Phong approximation baked into a fragment shader**. It cannot:

- cast or receive shadows (no `PointLight`/`DirectionalLight`, no `castShadow`)
- respond to an environment (`scene.environment` is never set)
- produce reflections (no `MeshStandardMaterial`, no `envMap`, no `THREE.PMREMGenerator`)
- give you contact shadows on the background (there is no background geometry to receive them)

That is why the form looks like a **clay maquette floating in a starfield** rather than a physical object in
a space. It has shape, but it has no *place*. There is no ground, no horizon, no occlusion where it meets the
world.

**The single highest-leverage change you can make here** is not more geometry — it's one real environment
light plus a contact shadow. A `RoomEnvironment` baked to a PMREM, fed to a real `MeshStandardMaterial` /
`MeshPhysicalMaterial` with `roughness`/`metalness`, plus a soft shadow-catching plane, would move this from
"shader demo" to "rendered object" more than adding 10× the polygons would.

---

## 3. The surface has no material — it has a colour ramp

Reading `formFrag`, the "material" is: `mix(dark, light, diffuse)` + rim + spec + contour lines.

- **No roughness variation.** Every square millimetre has the same response to light. Real surfaces read as
  real because roughness *changes* across them (fingerprints, oxidation, dust, wear).
- **No micro-detail.** No normal map, no noise-based bump, no anisotropy. The only "texture" is a shader
  contour line.
- **No reflection at all.** `uRim` fakes a rim glow; nothing reflects its surroundings. Combined with (2),
  the object is ungrounded.
- **The highlight is a fixed exponent** (`pow(..., 60.0)`) — a single hard spot, identical at every scale.

There's also a **correctness/aesthetics bug in the contour lines** (`shaders.ts:60-62`):

```glsl
float c = abs(fract(vP.y*8.5+vH*2.6)-0.5);
float line = 1.0-smoothstep(0.0, 0.035, c-0.465+0.035);
```

`smoothstep(0, 0.035, x)` is only non-zero for `x ∈ (0, 0.035)`. Writing the edge at `c = 0.465` inside a
`c ∈ [0, 0.5]` range means **the line fires over the whole range below the edge**, not as a thin band.
Measured: **89.5% of the surface range evaluates `line = 1.0`**. So instead of topographic contour lines you get
a broad wash across most of the form, with a hard cutoff at the top of each period. That's exactly the
"dirty smudge" banding visible across the body in the screenshots. If contour lines are the intent, it should
be something like `1.0 - smoothstep(0.0, 0.02, abs(fract(x) - 0.5))` — a *thin* band around the crest.

---

## 4. Lighting is pre-baked into keyframes, not simulated

`choreography.ts` animates `uDark`, `uLight`, `uRim` per section. Nice art direction — but note what it means:
the *lighting* changes by **interpolating handed-picked RGB values**, not by moving lights or changing
exposure. There is no HDR pipeline, no exposure control, no bloom, no tonemapping.

`renderer.toneMapping` is left at its default (`NoToneMapping`, confirmed at runtime) and no post stack
exists. So:

- Bright rim areas just **clip** instead of rolling off. Measured on the hero: **2.26% of the form's pixels
  are clipped** (2.3% is a lot for a soft-lit surface; a filmic curve would have prevented it).
- There's a hand-written dither (`shaders.ts:63`) to hide banding — i.e. you're *compensating* for the
  missing HDR pipeline with a hack.

**A real high-end chain here is:** render to a float/half-float target → bloom (selective, thresholded) →
ACES or AgX tonemap → dither → output. You already have the "dither" instinct; you're just missing the
half of the pipeline it's supposed to serve.

---

## 5. ~~Colour handling is inconsistent~~ — **WITHDRAWN, this was my error**

> **Correction (verified by rendering, not by reading).** I originally claimed `Color.setRGB()` was
> output-encoded a second time and was ~8–11 levels too bright. That is **false**. I read back the actual
> framebuffer for a raw `ShaderMaterial`: `setRGB(0.933,0.902,0.839)` produces the pixel `[238,230,214]`,
> i.e. the intended `#efe6d6`. A raw `ShaderMaterial` does not apply the output colour-space transform —
> only tone mapping/exposure — so hand-written sRGB floats pass through untouched. Meanwhile
> `Color('#efe6d6')` → `[220,202,171]` *because* it is linear-ised and then written raw. So the
> existing `setRGB` code was the **correct** choice, and the "fix" I recommended would have shifted every
> scroll colour ~10 levels dark. Lesson: the shader writes to the framebuffer directly; don't reason about
> colour management from the API surface, measure the pixel.

## 6. The damping is not frame-rate independent (the comment is wrong)

`stage.ts:156-158`:

```ts
const k  = 1 - Math.pow(0.0009, delta / 1000 + 0.0001); // "frame-rate independent damping"
const kk = Math.min(1, Math.max(0.04, k * 6));
cur[i] += (target[i] - cur[i]) * kk;
```

The `Math.pow(base, delta)` form *is* the standard exponential-damping approximation — but then `* 6` and a
`min(1, …)` clamp sit on top of it, and that's what breaks it. Measured effective lerp factor per frame:

| refresh | k (the "correct" term) | kk (what's actually used) | response |
|---|---|---|---|
| 30 Hz | 0.209 | **1.000** | instant — the clamp saturates it |
| 60 Hz | 0.111 | **0.666** | very fast |
| 90 Hz | 0.076 | **0.454** | |
| 120 Hz | 0.057 | **0.345** | |
| 144 Hz | 0.048 | **0.289** | |
| 240 Hz | 0.029 | **0.177** | sluggish |

So the camera/form settles **roughly twice as fast on a 60 Hz screen as on a 144 Hz one**, and is effectively
snapped (no easing at all) at 30 Hz. Your art direction — "the form follows the scroll with a lag" — is
therefore a different piece of art on every monitor. The `*6` was presumably added to make it feel snappier
on a 60 Hz dev machine; it converts a well-known correct formula into an incorrect one.

The correct version is the plain form, with damping expressed as a **half-life in seconds**:

```ts
// half-life of 0.12s, resolution independent
const k = 1 - Math.pow(0.5, delta / 1000 / 0.12);
```

Same bug exists in `ProjectArt.tsx:32` (`m.sx += (m.x - m.sx) * 0.06` — per-frame, fixed, so the 2D art
parallax is also 2.4× slower on a 144 Hz screen).

---

## 7. The vertex shader does 8× the work it needs to

Displacement + normals are computed by re-evaluating the full 3D simplex noise **4 times per vertex** for
position and **another 4 times** for the finite-difference normal (`shaders.ts:32-38`):

```glsl
float disp(vec3 p){ return snoise(p*0.95+...)*0.55 + snoise(p*2.3-...)*0.17; }  // 2 octaves
vec3 displaced(vec3 p){ ... float d=disp(q); ... }
// then:
vec3 p0=displaced(n0);                    // 2 snoise
vec3 p1=displaced(normalize(n0+t*e));     // 2 snoise
vec3 p2=displaced(normalize(n0+b*e));     // 2 snoise
vH = disp(twist(n0));                     // 2 snoise  <-- duplicate of p0's disp
```

`disp(twist(n0))` is **literally the same computation as `p0`** — it's evaluated a second time and stored in a
varying. That alone is 25% of the noise cost for free.

Measured cost: **390,728 simplex-noise evaluations per frame** at 60 fps = **23.4 million/second**, on
220×220 geometry. Standard technique is analytic normals via the noise gradient (or precomputed normal map),
which removes the two finite-difference evaluations entirely (→ 50% saving) and removing the duplicate `vH`
brings it to ~35% of current cost. That's the single cheapest performance win available, and it costs no
visual quality.

Also: 220×220 is past the point of diminishing returns for a *single* object. Half the segments with a
displacement that's *art-directed* (larger, more deliberate folds) would look better and run 4× faster.
Right now the silhouette is high-frequency mush because noise amplitude and mesh resolution are both cranked
to max — the eye has nowhere to rest.

---

## 8. Dust particles: the size formula explodes near the camera

`shaders.ts:75`:

```glsl
gl_PointSize = uSize*(0.4+aSeed*1.2)*(14.0/-mv.z);
```

Size is `1 / depth`, with **no upper clamp**. Points that pass near/behind the camera plane produce enormous
sprites:

| distance to camera | resulting point size |
|---|---|
| 0.1 | **1568 px** |
| 0.5 | 314 px |
| 1.0 | 157 px |
| 3.0 | 52 px |

That's the source of the **big soft blobs** in the hero (the ~40 px cream circles at 108,168 / 336,153 /
1050,187 in the screenshot) — they are single dust motes that drifted close to the lens. It *accidentally*
looks like bokeh, which is why it survives review. But it's undefined behaviour, not bokeh: there's no
aperture, no depth-of-field, no clamping. Points behind the camera (`mv.z > 0`) also get negative sizes and
can wrap.

Fix: `gl_PointSize = clamp(uSize * (14.0/-mv.z), 1.0, 24.0);` and cull `mv.z > -0.2`. If you want real
bokeh, that's a DOF pass — which is again the half-of-a-pipeline problem.

---

## 9. No adaptive quality, no measurement — and no idea which GPUs survive it

- `renderer.setPixelRatio(min(dpr, 2))` is set **once** and never revisited. A 4K/5K display with DPR 2
  renders 5200×2880 slightly-lit pixels every frame, forever.
- Quality tiers are chosen by **viewport width** (`window.innerWidth < 820`), not by GPU capability. A
  MacBook Pro on a small window gets the "mobile" 96-segment mesh; an Android phone in landscape or a
  desktop-resized window gets the 220-segment one.
- `Math.max(0.04, …)` in the damping means the loop **never** early-outs.
- There's no frame-time watchdog: if the first 30 frames take >25 ms, nothing downgrades.
- The `ResizeObserver` on `document.body` fires repeatedly during the loader and pin changes, and `resize()`
  does a full `readAnchors()` (a `querySelectorAll` + per-element layout read) synchronously each time.

**Recommended:** a 60-frame rolling median of `delta`; if > 20 ms, step DPR 2 → 1.5 → 1, then segment count,
then dust count. This is ~30 lines and is the difference between "works on the machine I tested on" and
"works".

---

## 10. The framing is wrong on the first screen (measured)

I isolated the WebGL canvas (hid all DOM) and measured the form's bounding box against the viewport.

**Desktop 1440×900:**

```
form bbox          785..1365 × 117..856   (580 × 739 px)
form height        82% of viewport
headline overlap   45% of the headline sits ON TOP of the 3D form
                   68% of the form is covered by type
```

**45% of "NIHAN ALI VP" is drawn over the object.** The form is a 3D sculpture that is *simultaneously* the
background of the headline. It's neither: it competes. The eye can't read the name (cream on cream) and can't
look at the object (it's behind the letters). This is the classic compositing error — the hero object and the
hero type occupy the same screen real estate with the same value range. Either the form goes behind *and
dims* (raise black point, lower its value range by ~30%), or it moves out of the type's column.

**Mobile 390×844:**

```
form bbox          x 276..779  y 0..1677   (canvas is scaled ×2)
horizontal         form left edge at 35% of viewport, right edge clipped OFF-SCREEN
vertical           clipped TOP and BOTTOM
headline overlap   66% of the headline sits on top of the form
```

The form is **at maximum displacement** on the hero (`uDist = scroll_dist + intro*0.9`, and `intro` starts at
1 — so the hero literally opens at `0.32 + 0.9 = 1.22` displacement, the most deformed state anywhere in the
site). It reads as a **rock / pebble**, which is not the brand. And on mobile it's oversized and off-frame.
The `intro.v` "materialise" tween (0 → 0) is clever but the side effect is that the hero's *resting* state
never appears — it's always mid-morph.

---

## 11. The god-rays are parented to the camera, so they don't behave like light

`stage.ts:139-144`:

```ts
rays.position.z = -20;
camera.add(rays);
```

`scene.add(camera)` is present, so this works — but parenting to the camera means the "volumetric light"
**rigidly follows the lens**: it can't produce parallax, can't be occluded by the form, and its centre is
nudged by `uCenter = (0.5 + ox*0.06 + 0.12, 0.64)` to fake some movement. There's also no radial falloff
toward the edge of the quad, no occlusion by geometry, and no depth write — so it reads as a **screen-space
overlay**, not light in a volume.

For genuine god-rays you need a light source **in the scene**, geometry to occlude it, and a screen-space
radial-blur pass driven by the light's screen position. What's there now is a very nice-looking gradient
mask; it just isn't volumetric light.

---

## 12. Smaller things, in order of how much they matter

| Issue | Where | Effect |
|---|---|---|
| `uTime` grows unbounded; noise input is `uTime*0.10` | `shaders.ts:31-32` | after ~8 h of a kiosk tab left open, float32 precision at `~8640` gives 0.001 stepping → surface visibly boils/stutters. Wrap time (`mod(time, 1000.0)`) or use a time uniform reset. |
| Anchors measured synchronously inside `resize()`, including during a `pin` | `stage.ts:113-131`, `Projects.tsx` | I tested this: **no drift** at page top (pin offsets cancel). But measuring *mid-pin* (e.g. on `resize`/`orientationchange` while the Projects section is pinned) would cache a wrong `projects` y. Cache the offset *first* (before pinning) or listen to `ScrollTrigger.refresh` and re-measure at `scrollTo(0)` restore. Low probability, but a real trap. |
| `op < 0.01` early-return stops all uniform updates | `stage.ts:162` | while the canvas is hidden behind Projects/Pro26, `cur` keeps lerping toward a target it will then *snap* to update all at once on reveal. It usually resolves within a frame, but interaction with the pointer parallax makes reveal pop. |
| Pointer parallax is per-frame `* 0.04` | `stage.ts:165` | same frame-rate-dependence as §6; twice as fast on 144 Hz. |
| Object scale is multiplied by a keyframe *and* `mobile ? 0.62` | `stage.ts:173-174` | keyframe scales (1.25–2.0) were authored on desktop; multiplying again by 0.62 on mobile does not produce a proportional framing because `oy + 1.7` is also added. Result: blown-out mobile hero (§10). |
| Torus `tris` = 8×256×2 = 4,096 ×2 | `stage.ts:47,50` | trivial cost, but the rings are *the only other geometry* — treating them as decorative line art while spending 96k triangles on the sphere is the wrong trade. |
| Loader gate is real | `Loader.tsx:12`, `App.tsx` | measured **7.5 s cold / 10.5 s warm** before the curtain lifts in this CPU-rendered environment. Not a fair absolute, but the structure (await fonts → dwell 0.3 s → intro → onComplete → 0.3 s → loaderGone) means the *3D intro tween begins before the canvas is visible*. Fire the intro on `ready`, not on mount. |

---

## What "high-end" would actually require

Nothing here — in ambition or structure — is broken. But the word "high-end 3D rendering" has a meaning, and
it's a list of capabilities. Here's honestly where each stands:

| Capability | Present? | Leverage |
|---|---|---|
| PBR / IBL (image-based lighting) | ✗ | **highest.** One `PMREMGenerator` + `RoomEnvironment` + `MeshPhysicalMaterial` changes the object from clay to solid. |
| Contact shadow / grounding | ✗ | **very high.** A single soft shadow plane is what makes an object sit in a space. |
| Tonemapping + bloom (HDR chain) | ✗ (dither used as a patch) | **high.** Fixes the clipping and makes the rim lights feel photographic. |
| Post-processing (DOF, grain, aberration) | ✗ (grain is a DOM overlay) | medium — but DOF would justify the dust bokeh that §8 currently produces *by accident*. |
| Correct colour management | ✗ (inconsistent) | cheap, high credibility — §5. |
| Frame-rate-independent motion | ✗ | cheap, high credibility — §6. |
| Adaptive quality / perf budgeting | ✗ | cheap, high credibility — §9. |
| Micro-detail (normal/roughness maps) | ✗ | medium — breaks up the "hard plastic" specular. |
| Shadows from the object onto itself | ✗ | low (single convex-ish shape). |
| Multiple objects / instancing / LOD | ✗ | only if the concept needs it. |

The most defensible framing for this piece is: **"a procedural displacement shader with a scroll-choreographed
camera, in a single persistent WebGL context, degrading gracefully on mobile and no-WebGL."** That's a real,
specific, respectable claim, and the code earns it. "High-end 3D rendering" is a claim the screenshots will
get challenged on the moment anyone who does this for a living looks at the specular response.

---

## If you only do three things

1. **Replace the fake lighting with real IBL + a contact shadow.** `RoomEnvironment` → `PMREMGenerator` →
   `scene.environment`, move the surface to a `MeshPhysicalMaterial` with a noise-driven roughness, add a
   shadow plane. This is one afternoon and it's 80% of the perceived jump.
2. **Fix the three correctness bugs** — the contour-line range (§3), the `setRGB` colour space (§5), and the
   `kk` damping clamp (§6). All three are one-liners; all three are things a reviewer will spot.
3. **Fix the hero framing (§10).** Value-separate the form from the headline (or move it out of the type's
   column), fix the mobile scale so it isn't clipped on three edges, and let the hero show the *resting*
   shape rather than the maximum displacement.

Everything else — post-processing, adaptive quality, analytic normals — is optimisation on top of a
foundation that these three would establish.

---

### Method / reproducibility

- Chromium 153, WebGL 2.0 via ANGLE + SwiftShader (CPU raster, `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device))`).
  Absolute frame times are meaningless here (median 279 ms/frame is *entirely* CPU rasterisation); **relative**
  comparisons and all counters/measurements are valid.
- Draw calls and triangle counts: instrumented `drawElements` / `drawArrays` / `drawElementsInstanced` on
  `WebGL2RenderingContext.prototype` before app boot.
- Framing: DOM layers hidden via injected CSS, screenshot diffed to find the form's bright bbox (>110 luma, with
  row/column density filtering to exclude dust), compared against `h1.getBoundingClientRect()`.
- Colour: instantiated a second `WebGLRenderer` in-page, rendered a 0.5-grey `ShaderMaterial`, read back the
  pixel (128 → passthrough, 188 → re-encoded), and compared `Color.setRGB` vs `Color(hex)` storage + display.
- Contour: re-implemented the shader expression in JS and integrated the `line` term over `c ∈ [0, 0.5]`.
