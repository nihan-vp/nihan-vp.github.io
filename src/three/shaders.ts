/** GLSL for the persistent stage: interactive 3D clay sculpture, atmospheric dust and god-ray backdrop. */

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export const formVert = /* glsl */ `
${noise}
uniform float uTime;
uniform float uDist;
uniform float uTwist;
uniform vec4 uFormWeights;   // organic, torsion, facet, harmonic
uniform vec4 uStamps[16];    // xyz = unit sphere dir, w = sculpt height
uniform vec4 uBrush;         // xyz = hover hit dir, w = brush strength
uniform vec3 uPulsePos;
uniform float uPulseAge;

varying vec3 vN;
varying vec3 vObjN;
varying vec3 vP;
varying vec3 vBaseP;
varying float vH;
varying float vSculpt;
varying vec3 vView;

vec3 twist(vec3 p, float amt){
  float a = p.y * amt;
  float c = cos(a), s = sin(a);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}

float dispBase(vec3 p){
  vec3 q = twist(p, uTwist * 0.6 + uFormWeights.y * 0.85);
  float d = 0.0;

  if (uFormWeights.x > 0.001) {
    vec3 w = vec3(
      snoise(q * 0.82 + vec3(0.0, uTime * 0.07, 0.0)),
      snoise(q * 0.82 + vec3(3.1, -uTime * 0.05, 1.7)),
      snoise(q * 0.82 + vec3(-2.4, 1.2, uTime * 0.06))
    );
    float dOrg = snoise(q * 0.95 + w * 0.52 + vec3(0.0, uTime * 0.08, 0.0)) * 0.56
               + snoise(q * 2.25 - vec3(uTime * 0.06)) * 0.18
               + snoise(q * 4.6) * 0.045;
    d += dOrg * uFormWeights.x;
  }

  if (uFormWeights.y > 0.001) {
    float ang = atan(q.z, q.x) + q.y * 1.9 - uTime * 0.16;
    float dTor = sin(ang * 5.0) * 0.24
               + cos(q.y * 4.0 + sin(ang * 2.0)) * 0.20
               + snoise(q * 1.35 + vec3(0.0, uTime * 0.05, 0.0)) * 0.16;
    d += dTor * uFormWeights.y;
  }

  if (uFormWeights.z > 0.001) {
    float n1 = abs(snoise(q * 1.3 + vec3(0.0, uTime * 0.035, 0.0)));
    float n2 = abs(snoise(q * 2.5 - vec3(1.4, 0.0, uTime * 0.025)));
    float ridge = pow(1.0 - n1, 1.5);
    float terr = floor((ridge * 0.68 + (1.0 - n2) * 0.32) * 6.5) / 6.5;
    float dFac = mix(ridge, terr, 0.5) * 0.92 - 0.34;
    d += dFac * uFormWeights.z;
  }

  if (uFormWeights.w > 0.001) {
    float th = acos(clamp(q.y, -1.0, 1.0));
    float ph = atan(q.z, q.x);
    float dHar = (sin(th * 4.0 + uTime * 0.32) * cos(ph * 3.0 - uTime * 0.20) * 0.42
                + cos(th * 7.0 - ph * 2.0 + uTime * 0.24) * 0.20) * 0.92;
    d += dHar * uFormWeights.w;
  }

  return d * uDist;
}

float dispInteractive(vec3 p, out float pulseEnergy){
  float s = 0.0;
  for (int i = 0; i < 16; i++) {
    float w = uStamps[i].w;
    if (abs(w) > 0.001) {
      float d2 = max(0.0, 1.0 - dot(p, uStamps[i].xyz));
      s += w * exp(-d2 * 22.0);
    }
  }
  if (abs(uBrush.w) > 0.001) {
    float bd = max(0.0, 1.0 - dot(p, uBrush.xyz));
    s += uBrush.w * exp(-bd * 28.0);
  }
  pulseEnergy = 0.0;
  if (uPulseAge < 3.4) {
    float angDist = acos(clamp(dot(p, uPulsePos), -1.0, 1.0));
    float front = uPulseAge * 2.5;
    float env = exp(-uPulseAge * 1.4) * exp(-abs(angDist - front) * 3.6);
    float wave = sin((angDist - front) * 14.0) * env;
    pulseEnergy = abs(wave);
    s += wave * 0.13;
  }
  return s;
}

vec3 displaced(vec3 p, out float totalH, out float sculptH){
  float baseD = dispBase(p);
  float pulseE = 0.0;
  float interD = dispInteractive(p, pulseE);
  totalH = baseD + interD;
  sculptH = abs(interD) + pulseE * 0.9;
  return p * (1.0 + totalH) * vec3(0.84, 1.32, 0.84);
}

void main(){
  vec3 n0 = normalize(position);
  vec3 up = abs(n0.y) > 0.98 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 t = normalize(cross(n0, up));
  vec3 b = normalize(cross(n0, t));
  float e = 0.011;

  float h0, s0, h1, s1, h2, s2;
  vec3 p0 = displaced(n0, h0, s0);
  vec3 p1 = displaced(normalize(n0 + t * e), h1, s1);
  vec3 p2 = displaced(normalize(n0 + b * e), h2, s2);

  vec3 n = normalize(cross(p1 - p0, p2 - p0));
  if (dot(n, n0) < 0.0) n = -n;

  vObjN = n;
  vN = normalize(normalMatrix * n);
  vP = p0;
  vBaseP = n0;
  vH = h0;
  vSculpt = s0;

  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

export const formFrag = /* glsl */ `
uniform vec3 uDark;
uniform vec3 uLight;
uniform vec3 uRim;
uniform float uTime;
uniform vec4 uFinishWeights; // raw, glaze, topo, wire
uniform vec4 uBrush;         // xyz = cursor dir, w = strength
uniform float uHoverAmt;
uniform vec2 uPointer;

varying vec3 vN;
varying vec3 vObjN;
varying vec3 vP;
varying vec3 vBaseP;
varying float vH;
varying float vSculpt;
varying vec3 vView;

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float clayGrain(vec3 p){
  float wheel = sin(p.y * 86.0 + sin(p.x * 9.0 + p.z * 9.0) * 1.4) * 0.5;
  float pores = sin(p.x * 53.0 + p.y * 41.0) * sin(p.z * 47.0 - p.y * 37.0);
  return wheel * 0.55 + pores * 0.45;
}

void main(){
  vec3 nBase = normalize(vN);
  vec3 V = normalize(vView);

  // Subtle tactile micro-bump normal for raw clay texture
  float g0 = clayGrain(vP);
  float gx = clayGrain(vP + vec3(0.008, 0.0, 0.0)) - g0;
  float gy = clayGrain(vP + vec3(0.0, 0.008, 0.0)) - g0;
  float gz = clayGrain(vP + vec3(0.0, 0.0, 0.008)) - g0;
  float grainAmt = uFinishWeights.x * 0.22 + uFinishWeights.z * 0.12 + uFinishWeights.y * 0.03;
  vec3 n = normalize(nBase - vec3(gx, gy, gz) * grainAmt * 5.0);

  // Studio 3-point lighting with subtle cursor-tracked key highlight
  vec3 L1 = normalize(vec3(-0.55 + uPointer.x * 0.35, 0.78 - uPointer.y * 0.25, 0.72));
  vec3 L2 = normalize(vec3(0.75, -0.22, -0.52));
  vec3 L3 = normalize(vec3(0.15, -0.85, 0.35));

  float diff = max(dot(n, L1), 0.0);
  float wrap = max(dot(n, L1) * 0.55 + 0.45, 0.0);
  float fill = max(dot(n, L2), 0.0);
  float bounce = max(dot(n, L3), 0.0);

  vec3 H1 = normalize(L1 + V);
  vec3 H2 = normalize(L2 + V);
  float fres = pow(1.0 - max(dot(n, V), 0.0), 2.7);
  float ao = 0.54 + 0.58 * smoothstep(-0.42, 0.48, vH);

  // Subsurface scattering feel through thin ridges
  float sss = pow(clamp(dot(-L1, V) * 0.5 + 0.5, 0.0, 1.0), 2.4) * smoothstep(-0.08, 0.55, vH);
  vec3 clayTone = mix(uDark, mix(uLight, vec3(0.76, 0.46, 0.30), 0.22), smoothstep(0.0, 1.0, diff * 0.65 + wrap * 0.35));

  // 1. Raw Clay finish
  float rawSpec = pow(max(dot(n, H1), 0.0), 24.0) * 0.18;
  vec3 rawCol = clayTone * ao;
  rawCol += uRim * (fres * 1.15 + sss * 0.48 + fill * 0.22);
  rawCol += uLight * (rawSpec + bounce * 0.06);
  rawCol -= g0 * 0.022;

  // 2. Glazed Ceramic finish
  float glazeSpec1 = pow(max(dot(n, H1), 0.0), 130.0) * 1.15;
  float glazeSpec2 = pow(max(dot(n, H1), 0.0), 28.0) * 0.32;
  float glazeRimSpec = pow(max(dot(n, H2), 0.0), 75.0) * 0.55;
  float envGrad = smoothstep(-0.6, 0.7, reflect(-V, n).y);
  vec3 glazeBase = mix(uDark * 0.75, uLight * 0.88, smoothstep(0.05, 0.95, diff * 0.78 + wrap * 0.22));
  vec3 glazeCol = glazeBase * (0.58 + 0.52 * ao);
  glazeCol += mix(uDark, uLight * 0.45, envGrad) * fres * 0.85;
  glazeCol += uRim * (fres * 1.2 + glazeRimSpec);
  glazeCol += uLight * (glazeSpec1 + glazeSpec2);

  // 3. Topographic Obsidian finish
  float topoC = abs(fract(vP.y * 8.5 + vH * 2.6) - 0.5);
  float topoLine = 1.0 - smoothstep(0.0, 0.032, topoC - 0.468 + 0.032);
  vec3 topoCol = mix(uDark, uLight * 0.85, smoothstep(0.0, 1.0, diff * 0.7 + wrap * 0.3)) * ao;
  topoCol += uRim * (fres * 1.3 + fill * 0.35) + uLight * pow(max(dot(n, H1), 0.0), 56.0) * 0.45;
  topoCol = mix(topoCol, topoCol * 0.35 + uRim * 0.95, topoLine * 0.82);

  // 4. Architectural Wire / Lattice finish
  float lon = abs(fract(atan(vBaseP.z, vBaseP.x) * 18.0 / 6.2831853) - 0.5);
  float lat = abs(fract(vBaseP.y * 14.0) - 0.5);
  float iso = abs(fract(vH * 10.0) - 0.5);
  float gridLon = 1.0 - smoothstep(0.0, 0.045, lon - 0.455 + 0.045);
  float gridLat = 1.0 - smoothstep(0.0, 0.045, lat - 0.455 + 0.045);
  float gridIso = 1.0 - smoothstep(0.0, 0.055, iso - 0.445 + 0.055);
  float grid = max(max(gridLon, gridLat), gridIso * 0.85);
  vec3 wireBase = mix(uDark * 0.65, uLight * 0.32, diff * 0.5 + wrap * 0.25) * ao;
  vec3 wireLineCol = mix(uLight, uRim, 0.62 + 0.38 * fres);
  vec3 wireCol = mix(wireBase + uRim * fres * 0.65, wireLineCol, grid * (0.45 + 0.55 * fres + 0.25 * diff));

  vec3 col = rawCol * uFinishWeights.x
           + glazeCol * uFinishWeights.y
           + topoCol * uFinishWeights.z
           + wireCol * uFinishWeights.w;

  // Delicate universal contour whisper on Raw & Glaze
  float subtleC = abs(fract(vP.y * 8.5 + vH * 2.6) - 0.5);
  float subtleLine = 1.0 - smoothstep(0.0, 0.03, subtleC - 0.47 + 0.03);
  col = mix(col, col * 0.72 + uRim * 0.14, subtleLine * 0.22 * (uFinishWeights.x + uFinishWeights.y));

  // Interactive sculpting/pulse kinetic warmth
  col += uRim * min(vSculpt, 0.45) * (0.35 + fres * 0.9);

  // Cursor spotlight halo on hover
  if (uHoverAmt > 0.001) {
    float spot = exp(-max(0.0, 1.0 - dot(normalize(vBaseP), uBrush.xyz)) * 22.0);
    col += mix(uRim, uLight, 0.35) * spot * uHoverAmt * 0.42;
  }

  // Subtle dither to eliminate gradient banding
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}`;

export const dustVert = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
uniform float uSpread;
uniform vec2 uPointer;
varying float vA;
void main(){
  vec3 p = position * uSpread;
  p.y += sin(uTime * 0.12 + aSeed * 40.0) * 0.38;
  p.x += cos(uTime * 0.09 + aSeed * 25.0) * 0.32 + uPointer.x * (0.35 * aSeed);
  p.y = mod(p.y + uTime * 0.05 * (0.3 + aSeed) + 9.0, 18.0) - 9.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.4 + aSeed * 1.25) * (14.0 / -mv.z);
  vA = 0.25 + 0.75 * aSeed;
  gl_Position = projectionMatrix * mv;
}`;

export const dustFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * a * vA * uOpacity);
}`;

export const rayVert = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
export const rayFrag = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uAmt;
uniform vec2 uCenter;
void main(){
  vec2 p = vUv - uCenter;
  float r = length(p);
  float a = atan(p.y, p.x);
  float rays = 0.5 + 0.5 * sin(a * 13.0 + uTime * 0.12 + sin(a * 5.0 + uTime * 0.07) * 2.0);
  rays = pow(rays, 3.0);
  float fall = exp(-r * 3.0);
  float core = exp(-r * 8.5);
  float v = (rays * 0.55 + 0.25) * fall * 0.55 + core * 0.55;
  gl_FragColor = vec4(uColor * v * uAmt, v * uAmt);
}`;
