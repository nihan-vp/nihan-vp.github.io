/**
 * GLSL for the persistent stage.
 *
 * ── clay ─────────────────────────────────────────────────────────────────────
 * A displacement-material "clay" surface. It is still one draw call and still
 * uses no lights, but the response is modelled on real clay rather than vinyl:
 *   · broad, low-frequency folds + a thin detail octave (not noise mush)
 *   · wrapped diffuse + hemispheric ambient (clay scatters, it does not just
 *     bounce off the surface)
 *   · roughness-modulated specular so the highlight breaks up, plus a soft
 *     back-scatter term — that pale waxy edge is what reads as "clay"
 *   · a slow normals-space noise used as a thumbprint/impasto break-up
 *   · contour lines that behave like carved grooves (a thin band, not a wash)
 *
 * Interaction: three touch records press into the surface in world space and
 * deform the *displacement field* itself (n·p is measured against the touched
 * point), so dragging genuinely kneads the clay rather than sliding a texture.
 */

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
uniform float uTime; uniform float uDist; uniform float uTwist;
uniform vec4  uTouch[3];   // xyz = point on unit sphere, w = strength (signed: press / release bulge)
uniform vec2  uRipple[3];  // x = start time, y = active (0/1)
varying vec3 vN; varying vec3 vP; varying float vH; varying vec3 vView; varying float vTouch; varying float vSmoothY;

vec3 twist(vec3 p){ float a=p.y*uTwist*0.6; float c=cos(a), s=sin(a); return vec3(c*p.x-s*p.z, p.y, s*p.x+c*p.z); }

/* Broad folds (0.8) + one restrained detail octave. Deliberately low ratio so the
   surface keeps large readable planes instead of turning into noise. */
float baseDisp(vec3 p){
  return snoise(p*0.80+vec3(0.0,uTime*0.075,0.0))*0.52
       + snoise(p*2.05-vec3(uTime*0.05))*0.11;
}

/* Press / dent + ripple, accumulated in the un-displaced domain so the field
   deforms coherently as the pointer travels. */
float touchDisp(vec3 n, out float energy){
  float sum=0.0; energy=0.0;
  for(int i=0;i<3;i++){
    float w=uTouch[i].w;
    if(abs(w)<0.0005) continue;
    float d=acos(clamp(dot(n,normalize(uTouch[i].xyz)),-1.0,1.0));  // geodesic-ish falloff
    float g=exp(-d*d*5.5);                                          // local dent
    sum+=w*g;
    energy+=abs(w)*g;
    vec2 r=uRipple[i];
    float age=uTime-r.x;
    if(r.y>0.5 && age>0.0 && age<2.2){
      float front=age*2.4;                                          // expanding wavefront
      float ring=exp(-pow((d-front)*7.0,2.0));
      sum+=sin((d-front)*26.0)*ring*0.045*exp(-age*2.1)*sign(w);
      energy+=ring*abs(w);
    }
  }
  return sum;
}

vec3 displaced(vec3 p, out float h, out float touchAmt){
  vec3 q=twist(p);
  float energy;
  float t=smoothstep(0.62,1.0,length(p))*touchDisp(p,energy);   // keep the touch away from the poles
  float d=baseDisp(q)+t;
  h=d; touchAmt=energy+t;
  return p*(1.0+d*uDist)*vec3(0.86,1.30,0.86);
}

void main(){
  vec3 n0=normalize(position);
  vec3 t=normalize(cross(n0,vec3(0.0,1.0,0.0001))); vec3 b=normalize(cross(n0,t));
  float e=0.012;
  float h0,ta; float h1,ta1; float h2,ta2;
  vec3 p0=displaced(n0,h0,ta);
  vec3 p1=displaced(normalize(n0+t*e),h1,ta1);
  vec3 p2=displaced(normalize(n0+b*e),h2,ta2);
  vec3 n=normalize(cross(p1-p0,p2-p0)); if(dot(n,n0)<0.0) n=-n;
  vN=normalize(normalMatrix*n); vP=p0; vH=h0; vTouch=ta;
  vSmoothY=n0.y;   // pristine latitude — smooth, so contours stay continuous
  vec4 mv=modelViewMatrix*vec4(p0,1.0); vView=-mv.xyz; gl_Position=projectionMatrix*mv;
}`;

export const formFrag = /* glsl */ `
uniform vec3 uDark; uniform vec3 uLight; uniform vec3 uRim; uniform float uTime; uniform float uTouchGlow;
varying vec3 vN; varying vec3 vP; varying float vH; varying vec3 vView; varying float vTouch; varying float vSmoothY;

float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}

/* cheap value noise for the thumbprint break-up */
float vnoise(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=hash(i.xy+i.z*37.0), b=hash(i.xy+vec2(1.0,0.0)+i.z*37.0);
  float c=hash(i.xy+vec2(0.0,1.0)+i.z*37.0), d=hash(i.xy+vec2(1.0,1.0)+i.z*37.0);
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

/* Height field for the micro relief: thumb impressions + impasto ridges.
   Evaluated as a scalar and converted into a normal perturbation below. */
float relief(vec3 p){
  return vnoise(vec3(p.xy*12.0, vH*9.0))*0.58
       + vnoise(vec3(p.xz*5.5, vH*4.0))*0.42;
}

void main(){
  vec3 n0=normalize(vN); vec3 V=normalize(vView);

  /* ── tactile micro-normal: bump the surface with screen-space derivatives of the
     relief field. This is what stops it reading as polished plastic — every grazing
     highlight gets broken into fingertip-scale detail. ── */
  float rh=relief(vP);
  vec3 dpx=dFdx(vP), dpy=dFdy(vP);
  float dhx=dFdx(rh), dhy=dFdy(rh);
  vec3 r1=cross(dpy,n0), r2=cross(n0,dpx);
  float det=dot(dpx,r1);
  /* Guard the singularity: at grazing angles the screen-space basis collapses and the
     gradient explodes, punching black pinholes through the surface. Clamp the divisor
     and the resulting slope, and fade the bump out where the basis is degenerate. */
  float sgn = det < 0.0 ? -1.0 : 1.0;
  float detSafe = sgn*max(abs(det), 1e-7);   // NaN guard only — do not fade the bump
  vec3 grad=(r1*dhx+r2*dhy)/detSafe;
  float slope=length(grad);
  grad*= min(1.0, 2.5/max(slope,1e-5));      // bound the perturbation so normals can't flip
  vec3 n=normalize(n0-grad*0.010);

  /* lighting: soft key from upper-left, cool rim from behind-right */
  vec3 L=normalize(vec3(-0.52,0.74,0.60));
  vec3 L2=normalize(vec3(0.78,-0.12,-0.38));

  float ndl=dot(n,L);
  float wrap=pow(max((ndl+0.26)/1.26,0.0),1.35);        // some scatter, but form survives
  float fill=max(dot(n,L2)*0.5+0.5,0.0)*0.22;

  /* hemispheric ambient derived from the section palette so the clay keeps its temperature */
  float hemi=n.y*0.5+0.5;
  vec3 sky   = uLight*0.26 + uRim*0.09;
  vec3 floorC= uDark*0.85  + uRim*0.05;
  vec3 amb   = mix(floorC, sky, hemi);

  /* roughness varies across the surface (drier patches, glossier patches) */
  float rough=mix(0.70,1.0,relief(vP*2.2)*0.65+0.35*vnoise(vec3(vP.xy*2.4,vH*3.0)));

  if(dot(n,n0)<0.0) n=-n;   // never let a bad perturbation invert the shading
  vec3 H=normalize(L+V);
  float specPow=mix(96.0,22.0,rough);
  float spec=pow(max(dot(n,H),0.0),specPow)*mix(0.16,0.035,rough);
  spec*=smoothstep(0.0,0.30,wrap);                      // no highlight in full shadow

  float fres=pow(1.0-max(dot(n0,V),0.0),2.4);
  float back=pow(max(dot(n,normalize(vec3(0.75,-0.05,-0.55))),0.0),1.5);

  /* body colour */
  vec3 col=mix(uDark*1.05,uLight*0.74,wrap*0.88);
  col+=amb*0.30;

  /* cavity occlusion from the displacement field — the folds must read as depth */
  float ao=0.52+0.48*smoothstep(-0.70,0.52,vH);
  col*=ao;

  /* carved contour grooves — thin band around the crest of the displacement field.
     Uses the smooth view-space height only: mixing in the noisy relief here fractures
     the lines into dashes. */
  float phase=vSmoothY*5.2+vH*1.8;
  float d=abs(fract(phase)-0.5);            // 0 on the contour crest
  float w=max(fwidth(phase),1e-4);          // phase units per pixel
  float band=max(0.022,w*1.05);             // widen the line where it gets steep
  float groove=1.0-smoothstep(band,band*2.4,d);
  groove*=1.0-smoothstep(0.30,0.72,w);      // stop drawing lines that can't be resolved
  col=mix(col,col*0.72,groove*0.34);

  /* pigment unevenness */
  col*=0.93+0.13*vnoise(vec3(vP.xz*4.2,vH*3.0));

  col+=uRim*fres*0.85+uRim*back*0.40+uLight*spec;
  col+=uRim*vTouch*0.20*uTouchGlow;                      // pressed clay warms slightly

  /* filmic shoulder (ACES approximation) — keeps mid contrast and rolls highlights off */
  col*=1.16;
  col=(col*(2.51*col+0.03))/(col*(2.43*col+0.59)+0.14);
  col=clamp(col,0.0,1.0);

  /* dither to kill banding in the falloff */
  col+=(hash(gl_FragCoord.xy+fract(uTime)*61.0)-0.5)*(1.0/255.0)*1.4;

  gl_FragColor=vec4(col,1.0);
}`;

export const dustVert = /* glsl */ `
attribute float aSeed; uniform float uTime; uniform float uSize; uniform float uSpread;
varying float vA;
void main(){
  vec3 p=position*uSpread;
  p.y+=sin(uTime*0.12+aSeed*40.0)*0.35; p.x+=cos(uTime*0.09+aSeed*25.0)*0.3;
  p.y=mod(p.y+uTime*0.05*(0.3+aSeed)+9.0,18.0)-9.0;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  /* clamped: a mote drifting near the lens must not become a 1500px blob */
  gl_PointSize=clamp(uSize*(0.4+aSeed*1.2)*(14.0/max(-mv.z,0.35)),1.0,26.0);
  vA=(0.25+0.75*aSeed)*smoothstep(0.0,0.9,-mv.z);
  gl_Position=projectionMatrix*mv;
}`;

export const dustFrag = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity; varying float vA;
void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(uColor,a*a*vA*uOpacity); }`;

export const rayVert = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
export const rayFrag = /* glsl */ `
varying vec2 vUv; uniform float uTime; uniform vec3 uColor; uniform float uAmt; uniform vec2 uCenter;
void main(){
  vec2 p=vUv-uCenter; float r=length(p); float a=atan(p.y,p.x);
  float rays=0.5+0.5*sin(a*13.0+uTime*0.12+sin(a*5.0+uTime*0.07)*2.0); rays=pow(rays,3.0);
  float fall=exp(-r*3.0); float core=exp(-r*8.5);
  /* fade the quad's own edges so the plane never shows a seam on wide screens */
  float edge=smoothstep(0.0,0.14,vUv.x)*smoothstep(0.0,0.14,1.0-vUv.x)
            *smoothstep(0.0,0.14,vUv.y)*smoothstep(0.0,0.14,1.0-vUv.y);
  float v=(rays*0.55+0.25)*fall*0.55+core*0.55;
  gl_FragColor=vec4(uColor*v*uAmt*edge,v*uAmt*edge);
}`;
