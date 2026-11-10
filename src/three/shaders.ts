/** GLSL for the persistent stage: a sculptural displaced form, atmospheric dust and a god-ray backdrop. */

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
varying vec3 vN; varying vec3 vP; varying float vH; varying vec3 vView;
vec3 twist(vec3 p){ float a=p.y*uTwist*0.6; float c=cos(a), s=sin(a); return vec3(c*p.x-s*p.z, p.y, s*p.x+c*p.z); }
float disp(vec3 p){ return snoise(p*0.95+vec3(0.0,uTime*0.10,0.0))*0.55 + snoise(p*2.3-vec3(uTime*0.07))*0.17; }
vec3 displaced(vec3 p){ vec3 q=twist(p); float d=disp(q); return p*(1.0+d*uDist)*vec3(0.84,1.32,0.84); }
void main(){
  vec3 n0=normalize(position);
  vec3 t=normalize(cross(n0,vec3(0.0,1.0,0.0001))); vec3 b=normalize(cross(n0,t));
  float e=0.012;
  vec3 p0=displaced(n0); vec3 p1=displaced(normalize(n0+t*e)); vec3 p2=displaced(normalize(n0+b*e));
  vec3 n=normalize(cross(p1-p0,p2-p0)); if(dot(n,n0)<0.0) n=-n;
  vN=normalize(normalMatrix*n); vP=p0; vH=disp(twist(n0));
  vec4 mv=modelViewMatrix*vec4(p0,1.0); vView=-mv.xyz; gl_Position=projectionMatrix*mv;
}`;

export const formFrag = /* glsl */ `
uniform vec3 uDark; uniform vec3 uLight; uniform vec3 uRim; uniform float uTime;
varying vec3 vN; varying vec3 vP; varying float vH; varying vec3 vView;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec3 n=normalize(vN); vec3 V=normalize(vView);
  vec3 L=normalize(vec3(-0.6,0.8,0.7));
  float diff=max(dot(n,L),0.0);
  float wrap=max(dot(n,L)*0.5+0.5,0.0);
  vec3 H=normalize(L+V); float spec=pow(max(dot(n,H),0.0),60.0);
  float fres=pow(1.0-max(dot(n,V),0.0),2.8);
  float back=pow(max(dot(n,normalize(vec3(0.7,-0.1,-0.6))),0.0),2.0);
  vec3 col=mix(uDark,uLight,smoothstep(0.0,1.0,diff*0.75+wrap*0.25));
  col*=0.62+0.55*smoothstep(-0.45,0.55,vH);          // cavity occlusion
  col+=uRim*fres*1.35+uRim*back*0.45+uLight*spec*0.55;
  float c=abs(fract(vP.y*8.5+vH*2.6)-0.5);             // topographic contour lines
  float line=1.0-smoothstep(0.0,0.035,c-0.465+0.035);
  col=mix(col,col*0.55+uRim*0.12,line*0.5);
  col+=(hash(gl_FragCoord.xy+uTime)-0.5)*0.025;        // dither
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
  gl_PointSize=uSize*(0.4+aSeed*1.2)*(14.0/-mv.z);
  vA=0.25+0.75*aSeed; gl_Position=projectionMatrix*mv;
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
  float v=(rays*0.55+0.25)*fall*0.55+core*0.55;
  gl_FragColor=vec4(uColor*v*uAmt,v*uAmt);
}`;
