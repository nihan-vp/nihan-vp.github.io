import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PRO26_DENSE_POINTS } from './pro26-dense-points';

interface OrbitalParticle {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  radius: number;
  angle: number;
  angularSpeed: number;
  baseZ: number;
  zNoiseAmp: number;
  zNoiseFreq: number;
  zNoisePhase: number;
}

const Pro26VortexSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const burstTriggerRef = useRef<() => void>(() => {});
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions strictly bounded to section
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 850;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 0, 52);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. Ultra-Clear Faceted Crystal Particle Texture
    // ==========================================
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 128;
    pCanvas.height = 128;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const cx = 64, cy = 64;
      const N = 8;
      const outer = [];
      const inner = [];
      for (let i = 0; i < N; i++) {
        const angle = (i * Math.PI * 2) / N - Math.PI / 2;
        outer.push([cx + Math.cos(angle) * 46, cy + Math.sin(angle) * 46]);
        inner.push([cx + Math.cos(angle) * 22, cy + Math.sin(angle) * 22]);
      }

      // Facet Alphas & Brightness for 3D crystalline refraction
      const alphas = [0.96, 0.78, 0.92, 0.72, 0.88, 0.68, 0.95, 0.82];
      for (let i = 0; i < N; i++) {
        const next = (i + 1) % N;
        pCtx.beginPath();
        pCtx.moveTo(inner[i][0], inner[i][1]);
        pCtx.lineTo(outer[i][0], outer[i][1]);
        pCtx.lineTo(outer[next][0], outer[next][1]);
        pCtx.lineTo(inner[next][0], inner[next][1]);
        pCtx.closePath();
        pCtx.fillStyle = `rgba(255, 255, 255, ${alphas[i]})`;
        pCtx.fill();
        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
        pCtx.lineWidth = 1.2;
        pCtx.stroke();
      }

      // Inner table facet (intense diamond core)
      pCtx.beginPath();
      pCtx.moveTo(inner[0][0], inner[0][1]);
      for (let i = 1; i < N; i++) pCtx.lineTo(inner[i][0], inner[i][1]);
      pCtx.closePath();
      const grad = pCtx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.94)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.82)');
      pCtx.fillStyle = grad;
      pCtx.fill();
      pCtx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
      pCtx.lineWidth = 1.2;
      pCtx.stroke();

      // Sharp diffraction micro-spikes (4-point primary laser flare)
      const hGrad = pCtx.createLinearGradient(cx - 62, cy, cx + 62, cy);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = hGrad;
      pCtx.fillRect(cx - 62, cy - 1, 124, 2);

      const vGrad = pCtx.createLinearGradient(cx, cy - 62, cx, cy + 62);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = vGrad;
      pCtx.fillRect(cx - 1, cy - 62, 2, 124);

      // 45-degree diagonal secondary flares
      pCtx.save();
      pCtx.translate(cx, cy);
      pCtx.rotate(Math.PI / 4);
      const dGrad = pCtx.createLinearGradient(-42, 0, 42, 0);
      dGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      dGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = dGrad;
      pCtx.fillRect(-42, -0.75, 84, 1.5);
      pCtx.fillRect(-0.75, -42, 1.5, 84);
      pCtx.restore();

      // Center blazing specular glint dot
      const centerGrad = pCtx.createRadialGradient(cx, cy, 0, cx, cy, 6);
      centerGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      centerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = centerGrad;
      pCtx.beginPath();
      pCtx.arc(cx, cy, 6, 0, Math.PI * 2);
      pCtx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);
    particleTexture.generateMipmaps = true;
    particleTexture.minFilter = THREE.LinearMipmapLinearFilter;
    particleTexture.magFilter = THREE.LinearFilter;

    // ==========================================
    // 2. Edge-to-Edge Responsive Logo Sizing
    // ==========================================
    const calculateLogoScale = (w: number, h: number) => {
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const visibleWidth = visibleHeight * (w / h);

      const isMobile = w < 768;
      // Massive edge-to-edge coverage: 96% width on desktop and mobile!
      const targetWidth = visibleWidth * (isMobile ? 0.96 : 0.94);
      const targetHeight = visibleHeight * (isMobile ? 0.82 : 0.84);

      // Logo aspect ratio is ~2.1964:1
      const scaleX = targetWidth / 2.1964;
      const scaleY = targetHeight / 1.0;
      return Math.min(scaleX, scaleY);
    };

    let currentLogoScale = calculateLogoScale(width, height);

    // ==========================================
    // 3. Pro26 3D Logo Particle Arrays (4,785 Ultra-Dense Points)
    // ==========================================
    const numPoints = PRO26_DENSE_POINTS.length;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    const sizes = new Float32Array(numPoints);
    const pointTypes = new Uint8Array(numPoints);

    const currentX = new Float32Array(numPoints);
    const currentY = new Float32Array(numPoints);
    const currentZ = new Float32Array(numPoints);

    const targetX = new Float32Array(numPoints);
    const targetY = new Float32Array(numPoints);
    const targetZ = new Float32Array(numPoints);

    const vx = new Float32Array(numPoints);
    const vy = new Float32Array(numPoints);
    const vz = new Float32Array(numPoints);

    const baseColors = new Float32Array(numPoints * 3);
    const baseSizes = new Float32Array(numPoints);

    const updateTargetPositions = (scale: number) => {
      for (let i = 0; i < numPoints; i++) {
        const [nx, ny] = PRO26_DENSE_POINTS[i];
        targetX[i] = nx * scale;
        targetY[i] = ny * scale;
      }
    };

    updateTargetPositions(currentLogoScale);

    // Exact Pro26 Logo Blue (#0D89E8): r = 13/255 (0.051), g = 137/255 (0.537), b = 232/255 (0.910)
    // Exact Pro26 Text White (#FFFFFF): r = 1.0, g = 1.0, b = 1.0
    const exactBlueR = 13 / 255;
    const exactBlueG = 137 / 255;
    const exactBlueB = 232 / 255;

    for (let i = 0; i < numPoints; i++) {
      const [, , type] = PRO26_DENSE_POINTS[i];
      pointTypes[i] = type;

      // Tight planar depth so crystals align in a unified plane without parallax gaps
      targetZ[i] = (Math.random() - 0.5) * 0.35;

      // Emergence explosion from 3D space
      if (!prefersReducedMotion) {
        currentX[i] = targetX[i] + (Math.random() - 0.5) * 110;
        currentY[i] = targetY[i] + (Math.random() - 0.5) * 80;
        currentZ[i] = (Math.random() - 0.5) * 130;
      } else {
        currentX[i] = targetX[i];
        currentY[i] = targetY[i];
        currentZ[i] = targetZ[i];
      }

      positions[i * 3] = currentX[i];
      positions[i * 3 + 1] = currentY[i];
      positions[i * 3 + 2] = currentZ[i];

      if (type === 0) {
        // Blue 'P' Monogram — Exact brand blue #0D89E8
        baseColors[i * 3] = exactBlueR;
        baseColors[i * 3 + 1] = exactBlueG;
        baseColors[i * 3 + 2] = exactBlueB;
      } else {
        // 'ro26' Letters — Crisp pure white #FFFFFF
        baseColors[i * 3] = 1.0;
        baseColors[i * 3 + 1] = 1.0;
        baseColors[i * 3 + 2] = 1.0;
      }

      colors[i * 3] = baseColors[i * 3];
      colors[i * 3 + 1] = baseColors[i * 3 + 1];
      colors[i * 3 + 2] = baseColors[i * 3 + 2];

      // Seamless crystal particle size: overlaps facet-to-facet with ZERO gaps between crystals
      const pSize = (type === 0 ? 0.62 : 0.56) * (0.92 + Math.random() * 0.16);
      baseSizes[i] = pSize;
      sizes[i] = pSize;
    }

    const logoGeometry = new THREE.BufferGeometry();
    logoGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    logoGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    logoGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const logoMaterial = new THREE.PointsMaterial({
      size: 0.60,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      alphaTest: 0.03, // Cuts off sub-alpha haze for razor-sharp crystalline clarity
      depthWrite: false,
      sizeAttenuation: true,
    });

    const logoPointsMesh = new THREE.Points(logoGeometry, logoMaterial);
    scene.add(logoPointsMesh);

    // ==========================================
    // 4. Ambient 3D Swirling Vortex Logo Streams (~140 Particles)
    // ==========================================
    const textureLoader = new THREE.TextureLoader();
    const miniLogoTexture = textureLoader.load('/pro26-logo.png');
    miniLogoTexture.generateMipmaps = true;
    miniLogoTexture.minFilter = THREE.LinearMipmapLinearFilter;
    miniLogoTexture.magFilter = THREE.LinearFilter;

    const miniLogoGeometry = new THREE.PlaneGeometry(2.1964 * 0.9, 1.0 * 0.9);
    const vortexGroup = new THREE.Group();
    vortexGroup.rotation.x = -0.65;
    vortexGroup.rotation.y = 0.22;
    scene.add(vortexGroup);

    const orbitalParticles: OrbitalParticle[] = [];
    const orbitalCount = width < 768 ? 60 : 150;

    for (let i = 0; i < orbitalCount; i++) {
      const u = Math.random();
      const r = 26 + Math.pow(u, 1.4) * 65;
      const angle = Math.random() * Math.PI * 2;
      const angularSpeed = (0.35 / Math.pow(r, 0.6)) * (0.8 + Math.random() * 0.4);
      const baseZ = -18 * Math.exp(-r / 30) + (Math.random() - 0.5) * 16;

      const orbitalMat = new THREE.MeshBasicMaterial({
        map: miniLogoTexture,
        transparent: true,
        opacity: 0.16 + (1 - r / 90) * 0.38,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(miniLogoGeometry, orbitalMat);
      const scale = 0.38 + (1 - r / 90) * 0.45;
      mesh.scale.set(scale, scale, 1);
      vortexGroup.add(mesh);

      orbitalParticles.push({
        mesh,
        radius: r,
        angle,
        angularSpeed: prefersReducedMotion ? 0.05 : angularSpeed,
        baseZ,
        zNoiseAmp: 1.5 + Math.random() * 2.8,
        zNoiseFreq: 0.5 + Math.random() * 0.7,
        zNoisePhase: Math.random() * Math.PI * 2,
      });
    }

    // ==========================================
    // 5. Mouse Interaction & Shockwave Burst
    // ==========================================
    const mouse = {
      x: 9999,
      y: 9999,
      targetX: 9999,
      targetY: 9999,
      isHovered: false,
      normX: 0,
      normY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;

        const isHoveringLink = Boolean((e.target as HTMLElement)?.closest('a, button'));

        // Position small custom cursor follower directly in DOM (60/120fps smooth)
        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform = `translate3d(${localX}px, ${localY}px, 0)`;
          cursorDotRef.current.style.opacity = isHoveringLink ? '0' : '1';
        }
        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate3d(${localX}px, ${localY}px, 0)${isHoveringLink ? ' scale(1.65)' : ''}`;
          cursorRingRef.current.style.opacity = '1';
          if (isHoveringLink) {
            cursorRingRef.current.style.borderColor = '#3ba0ed';
            cursorRingRef.current.style.backgroundColor = 'rgba(13, 137, 232, 0.2)';
          } else {
            cursorRingRef.current.style.borderColor = 'rgba(13, 137, 232, 0.7)';
            cursorRingRef.current.style.backgroundColor = 'rgba(13, 137, 232, 0.1)';
          }
        }

        const ndcX = (localX / rect.width) * 2 - 1;
        const ndcY = -((localY / rect.height) * 2 - 1);

        mouse.normX = ndcX;
        mouse.normY = ndcY;

        const v = new THREE.Vector3(ndcX, ndcY, 0.5);
        v.unproject(camera);
        const dir = v.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

        mouse.targetX = worldPos.x;
        mouse.targetY = worldPos.y;
        mouse.isHovered = true;
      } else {
        if (mouse.isHovered) {
          mouse.isHovered = false;
          mouse.targetX = 9999;
          mouse.targetY = 9999;
          if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
          if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button')) return;
      if (cursorRingRef.current) cursorRingRef.current.style.transform += ' scale(0.7)';
    };

    const handleMouseUp = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = cursorRingRef.current.style.transform.replace(' scale(0.7)', '');
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = 9999;
      mouse.targetY = 9999;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
    };

    const triggerBurst = () => {
      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 1.6 + Math.random() * 3.5;
        vx[i] += Math.cos(angle) * force;
        vy[i] += Math.sin(angle) * force;
        vz[i] += (Math.random() - 0.5) * force * 2.8;
      }
    };
    burstTriggerRef.current = triggerBurst;

    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button')) return;
      triggerBurst();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    section.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    section.addEventListener('mouseleave', handleMouseLeave);
    section.addEventListener('click', handleClick);

    // Scroll tracking
    let scrollRotationOffset = 0;
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        scrollRotationOffset = (progress - 0.5) * 0.8;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 850;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      currentLogoScale = calculateLogoScale(width, height);
      updateTargetPositions(currentLogoScale);
    };
    window.addEventListener('resize', handleResize);

    // Intersection Observer
    let isSectionInView = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionInView = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    // ==========================================
    // 6. Animation Loop (60 FPS Physics & Waves)
    // ==========================================
    const springK = 0.065; // Snappy, clean return
    const damping = 0.83; // Fluid, responsive damping
    const mouseRadius = 5.5; // Precision micro-crystal ripple radius
    const mouseBlast = 1.35;

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isSectionInView || document.hidden) return;

      const elapsedTime = clock.getElapsedTime();

      // Mouse lerping with velocity vector for fluid wake effect
      let mouseVelX = 0;
      let mouseVelY = 0;
      if (mouse.isHovered) {
        const nextX = mouse.x + (mouse.targetX - mouse.x) * 0.22;
        const nextY = mouse.y + (mouse.targetY - mouse.y) * 0.22;
        mouseVelX = nextX - mouse.x;
        mouseVelY = nextY - mouse.y;
        mouse.x = nextX;
        mouse.y = nextY;
      } else {
        mouse.x = 9999;
        mouse.y = 9999;
      }

      // 3D Parallax Tilt for both Logo and Vortex
      if (!prefersReducedMotion) {
        const targetRotY = mouse.normX * 0.32;
        const targetRotX = -mouse.normY * 0.22;
        logoPointsMesh.rotation.y += (targetRotY - logoPointsMesh.rotation.y) * 0.045;
        logoPointsMesh.rotation.x += (targetRotX - logoPointsMesh.rotation.x) * 0.045;

        vortexGroup.rotation.y += (0.22 + mouse.normX * 0.25 - vortexGroup.rotation.y) * 0.035;
        vortexGroup.rotation.x += (-0.65 - mouse.normY * 0.22 - vortexGroup.rotation.x) * 0.035;
      }

      // Rotate ambient vortex around central axis
      vortexGroup.rotation.z += 0.0018 + scrollRotationOffset * 0.001;

      // Update ambient orbital particles
      for (let i = 0; i < orbitalParticles.length; i++) {
        const op = orbitalParticles[i];
        op.angle += op.angularSpeed * 0.015;
        const zNoise = Math.sin(elapsedTime * op.zNoiseFreq + op.zNoisePhase) * op.zNoiseAmp;
        op.mesh.position.set(
          Math.cos(op.angle) * op.radius,
          Math.sin(op.angle) * op.radius,
          op.baseZ + zNoise
        );
      }

      // Update Logo Points Physics & Harmonic Holographic Wave
      const posAttr = logoGeometry.attributes.position as THREE.BufferAttribute;
      const colAttr = logoGeometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i = 0; i < numPoints; i++) {
        const tx = targetX[i];
        const ty = targetY[i];

        // 3D Holographic undulating wave across the logo letters
        const waveZ = prefersReducedMotion
          ? targetZ[i]
          : targetZ[i] +
            Math.sin(elapsedTime * 2.2 + tx * 0.16) * 0.45 +
            Math.cos(elapsedTime * 1.8 + ty * 0.25) * 0.25;

        // Spring acceleration
        const fx = (tx - currentX[i]) * springK;
        const fy = (ty - currentY[i]) * springK;
        const fz = (waveZ - currentZ[i]) * springK;

        vx[i] = (vx[i] + fx) * damping;
        vy[i] = (vy[i] + fy) * damping;
        vz[i] = (vz[i] + fz) * damping;

        // Interactive Mouse Repulsion (Small, precise, fluid wake)
        if (mouse.isHovered && !prefersReducedMotion) {
          const dx = currentX[i] - mouse.x;
          const dy = currentY[i] - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadius * mouseRadius && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / mouseRadius;
            const force = Math.pow(normDist, 1.8) * mouseBlast;

            // Radial push + fluid velocity drag
            vx[i] += (dx / dist) * force + mouseVelX * 0.20 * normDist;
            vy[i] += (dy / dist) * force + mouseVelY * 0.20 * normDist;
            vz[i] += Math.sin(dist * 1.5 - elapsedTime * 4.0) * force * 1.0;

            // Highlight while preserving exact colors
            if (pointTypes[i] === 0) {
              colArr[i * 3] = Math.min(0.24, baseColors[i * 3] * 1.35);
              colArr[i * 3 + 1] = Math.min(0.76, baseColors[i * 3 + 1] * 1.25);
              colArr[i * 3 + 2] = 1.0;
            } else {
              colArr[i * 3] = 1.0;
              colArr[i * 3 + 1] = 1.0;
              colArr[i * 3 + 2] = 1.0;
            }
          } else {
            // Natural Crystalline Refractive Shimmer (Diamonds & Sapphires glinting in the light wave)
            const shimmerWave = Math.sin(elapsedTime * 2.8 + tx * 0.35 + ty * 0.25 + (i % 19) * 0.4);
            const glint = Math.pow(Math.max(0, shimmerWave), 7.0) * 0.45;

            if (pointTypes[i] === 0) {
              // Sapphire crystal glint: exact blue with intense specular glint highlight
              colArr[i * 3] = baseColors[i * 3] + glint * 0.22;
              colArr[i * 3 + 1] = baseColors[i * 3 + 1] + glint * 0.32;
              colArr[i * 3 + 2] = Math.min(1.0, baseColors[i * 3 + 2] + glint * 0.12);
            } else {
              // Diamond crystal glint: brilliant white
              colArr[i * 3] = Math.min(1.0, 1.0 + glint * 0.25);
              colArr[i * 3 + 1] = Math.min(1.0, 1.0 + glint * 0.25);
              colArr[i * 3 + 2] = Math.min(1.0, 1.0 + glint * 0.25);
            }
          }
        }

        currentX[i] += vx[i];
        currentY[i] += vy[i];
        currentZ[i] += vz[i];

        posArr[i * 3] = currentX[i];
        posArr[i * 3 + 1] = currentY[i];
        posArr[i * 3 + 2] = currentZ[i];
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      section.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      logoGeometry.dispose();
      logoMaterial.dispose();
      particleTexture.dispose();

      orbitalParticles.forEach((op) => {
        op.mesh.geometry.dispose();
        op.mesh.material.dispose();
      });
      miniLogoGeometry.dispose();
      miniLogoTexture.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="pro26-vortex"
      ref={sectionRef}
      className="relative w-full h-[660px] sm:h-[780px] lg:h-[900px] xl:h-[960px] overflow-hidden bg-[#050811] border-y border-white/[0.08] select-none cursor-crosshair md:cursor-none flex items-center justify-center group"
      style={{
        contain: 'paint layout',
      }}
      title="Interactive 3D Pro26 Particle Matrix — Hover to ripple • Click to burst"
    >
      {/* Sleek Small Custom Cursor Follower (Visible on desktop hover) */}
      <div
        ref={cursorRingRef}
        className="hidden md:block pointer-events-none absolute top-0 left-0 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border border-[#0D89E8]/70 bg-[#0D89E8]/10 backdrop-blur-[0.5px] transition-[opacity,transform,border-color,background-color] duration-75 ease-out opacity-0 z-30 shadow-[0_0_12px_rgba(13,137,232,0.45)]"
        aria-hidden="true"
      />
      <div
        ref={cursorDotRef}
        className="hidden md:block pointer-events-none absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#0D89E8] transition-opacity duration-75 opacity-0 z-30 shadow-[0_0_6px_#0D89E8,0_0_12px_#0D89E8]"
        aria-hidden="true"
      />

      {/* Top Subtle Brand Architecture Tag */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-12 z-20 flex items-center gap-2.5 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D89E8] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D89E8] shadow-[0_0_8px_#0D89E8]" />
        </span>
        <span className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-gray-400">
          Pro26 Interactive Architecture
        </span>
      </div>

      {/* 3D WebGL Canvas spanning the entire full width and height of the section */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      />

      {/* Atmospheric Central Pro26 Blue Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 137, 232, 0.08) 0%, rgba(10, 14, 23, 0.45) 55%, rgba(5, 8, 17, 0.98) 100%)',
        }}
      />

      {/* Soft Vignette top/bottom masks for seamless edge transitions */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0e17] via-[#0a0e17]/80 to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/80 to-transparent pointer-events-none z-[2]" />

      {/* Floating CTA Dock: "Visit www.pro26.in" */}
      <div className="absolute bottom-6 sm:bottom-9 z-20 flex flex-col items-center gap-2.5 pointer-events-auto">
        <a
          href="https://www.pro26.in"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#070b14]/85 border border-[#0D89E8]/40 hover:border-[#0D89E8] shadow-[0_4px_25px_rgba(13,137,232,0.25)] hover:shadow-[0_4px_35px_rgba(13,137,232,0.55)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Subtle gradient hover wash */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0D89E8]/15 via-transparent to-[#0D89E8]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Glowing pulse indicator dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D89E8] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0D89E8] shadow-[0_0_8px_#0D89E8]" />
          </span>

          {/* CTA Text */}
          <span className="text-xs sm:text-sm font-medium tracking-wide text-gray-200 group-hover:text-white transition-colors">
            Visit <span className="text-[#3ba0ed] font-semibold">www.pro26.in</span>
          </span>

          {/* External link arrow icon */}
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-[#3ba0ed] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Micro-hint interaction label */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-gray-500 tracking-wider uppercase opacity-80 pointer-events-none">
          <span>Move cursor to ripple</span>
          <span className="text-[#0D89E8]">•</span>
          <span>Click to disperse</span>
        </div>
      </div>
    </section>
  );
};

export default Pro26VortexSection;
