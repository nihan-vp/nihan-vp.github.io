import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PRO26_DENSE_POINTS } from './pro26-dense-points';

const Pro26VortexSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const burstTriggerRef = useRef<() => void>(() => { });
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
    // 3. Pro26 3D Logo Particle Arrays (28,000 Continuous Crystal Points)
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

      // Pure flat planar depth — zero tilt plane
      targetZ[i] = 0;

      // Emergence explosion from 3D space
      if (!prefersReducedMotion) {
        currentX[i] = targetX[i] + (Math.random() - 0.5) * 80;
        currentY[i] = targetY[i] + (Math.random() - 0.5) * 60;
        currentZ[i] = (Math.random() - 0.5) * 50;
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
    // 4. Deep-Space Starfield & Cosmic Particle Background (1,500 Stars)
    // ==========================================
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 64;
    sCanvas.height = 64;
    const sCtx = sCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(224, 242, 254, 0.9)');
      grad.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(13, 137, 232, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 64, 64);
    }
    const starTexture = new THREE.CanvasTexture(sCanvas);
    starTexture.minFilter = THREE.LinearFilter;
    starTexture.magFilter = THREE.LinearFilter;

    const numStars = 1500;
    const starPositions = new Float32Array(numStars * 3);
    const starColors = new Float32Array(numStars * 3);
    const starBaseColors = new Float32Array(numStars * 3);
    const starSpeeds = new Float32Array(numStars);
    const starTwinkleSpeed = new Float32Array(numStars);
    const starTwinklePhase = new Float32Array(numStars);
    const starDriftX = new Float32Array(numStars);
    const starDriftY = new Float32Array(numStars);

    for (let i = 0; i < numStars; i++) {
      // Cosmic 3D volume spreading deep behind the logo
      starPositions[i * 3] = (Math.random() - 0.5) * 260;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 2] = -150 + Math.random() * 138; // Z range: -150 to -12

      // Star color distribution: Diamond white, Pro26 brand blue, cyan stardust, soft violet
      const pick = Math.random();
      let r = 1.0, g = 1.0, b = 1.0;
      if (pick < 0.52) {
        // Pure diamond white / ice blue
        r = 0.95; g = 0.98; b = 1.0;
      } else if (pick < 0.78) {
        // Pro26 brand cosmic blue (#0D89E8)
        r = 13 / 255; g = 137 / 255; b = 232 / 255;
      } else if (pick < 0.93) {
        // Bright cyan / aqua stardust (#38bdf8)
        r = 56 / 255; g = 189 / 255; b = 248 / 255;
      } else {
        // Cosmic starlight violet (#a5b4fc)
        r = 165 / 255; g = 180 / 255; b = 252 / 255;
      }

      starBaseColors[i * 3] = r;
      starBaseColors[i * 3 + 1] = g;
      starBaseColors[i * 3 + 2] = b;

      starColors[i * 3] = r;
      starColors[i * 3 + 1] = g;
      starColors[i * 3 + 2] = b;

      // Slow forward drift creating 3D space travel depth
      starSpeeds[i] = 0.035 + Math.random() * 0.065;
      starTwinkleSpeed[i] = 1.2 + Math.random() * 2.8;
      starTwinklePhase[i] = Math.random() * Math.PI * 2;
      starDriftX[i] = (Math.random() - 0.5) * 0.008;
      starDriftY[i] = (Math.random() - 0.5) * 0.008;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.25,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starsMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starsMesh);

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
          cursorRingRef.current.style.transform = `translate3d(${localX}px, ${localY}px, 0)${isHoveringLink ? ' scale(1.3)' : ''}`;
          cursorRingRef.current.style.opacity = '1';
          if (isHoveringLink) {
            cursorRingRef.current.style.borderColor = '#3ba0ed';
            cursorRingRef.current.style.backgroundColor = 'rgba(13, 137, 232, 0.2)';
          } else {
            cursorRingRef.current.style.borderColor = 'rgba(13, 137, 232, 0.8)';
            cursorRingRef.current.style.backgroundColor = 'rgba(13, 137, 232, 0.12)';
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
      if (cursorRingRef.current) cursorRingRef.current.style.transform += ' scale(0.75)';
    };

    const handleMouseUp = () => {
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = cursorRingRef.current.style.transform.replace(' scale(0.75)', '');
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
        const force = 1.4 + Math.random() * 3.0;
        vx[i] += Math.cos(angle) * force;
        vy[i] += Math.sin(angle) * force;
        vz[i] += (Math.random() - 0.5) * force * 2.0;
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
    // 6. Animation Loop (60 FPS Physics & Cosmic Stars)
    // ==========================================
    const springK = 0.075; // Snappy, clean return
    const damping = 0.82; // Fluid, responsive damping
    const mouseRadius = 2.8; // Ultra-small pinpoint crystal ripple radius
    const mouseBlast = 0.95; // Gentle, elegant micro-displacement

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
        const nextX = mouse.x + (mouse.targetX - mouse.x) * 0.25;
        const nextY = mouse.y + (mouse.targetY - mouse.y) * 0.25;
        mouseVelX = nextX - mouse.x;
        mouseVelY = nextY - mouse.y;
        mouse.x = nextX;
        mouse.y = nextY;
      } else {
        mouse.x = 9999;
        mouse.y = 9999;
      }

      // No 3D tilt plane — logo remains perfectly flat and front-facing
      logoPointsMesh.rotation.set(0, 0, 0);

      // Subtle celestial camera parallax giving immense 3D space depth without tilting logo
      if (mouse.isHovered && !prefersReducedMotion) {
        camera.position.x += (mouse.normX * 1.6 - camera.position.x) * 0.035;
        camera.position.y += (mouse.normY * 1.1 - camera.position.y) * 0.035;
      } else {
        camera.position.x += (0 - camera.position.x) * 0.035;
        camera.position.y += (0 - camera.position.y) * 0.035;
      }
      camera.lookAt(0, 0, 0);

      // Update Deep-Space Starfield
      const starPosAttr = starGeometry.attributes.position as THREE.BufferAttribute;
      const starColAttr = starGeometry.attributes.color as THREE.BufferAttribute;
      const sPos = starPosAttr.array as Float32Array;
      const sCol = starColAttr.array as Float32Array;

      for (let i = 0; i < numStars; i++) {
        // Forward drift in 3D deep space
        sPos[i * 3 + 2] += starSpeeds[i];
        sPos[i * 3] += starDriftX[i];
        sPos[i * 3 + 1] += starDriftY[i];

        // Wrap around when star drifts close to the logo plane
        if (sPos[i * 3 + 2] > -10) {
          sPos[i * 3 + 2] = -150;
          sPos[i * 3] = (Math.random() - 0.5) * 260;
          sPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
        }

        // Shimmering celestial twinkle
        const twinkle = 0.40 + 0.60 * Math.sin(elapsedTime * starTwinkleSpeed[i] + starTwinklePhase[i]);
        const brightness = Math.max(0.12, twinkle);
        sCol[i * 3] = starBaseColors[i * 3] * brightness;
        sCol[i * 3 + 1] = starBaseColors[i * 3 + 1] * brightness;
        sCol[i * 3 + 2] = starBaseColors[i * 3 + 2] * brightness;
      }
      starPosAttr.needsUpdate = true;
      starColAttr.needsUpdate = true;

      // Update Logo Points Physics
      const posAttr = logoGeometry.attributes.position as THREE.BufferAttribute;
      const colAttr = logoGeometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i = 0; i < numPoints; i++) {
        const tx = targetX[i];
        const ty = targetY[i];

        // Flat planar alignment (zero tilt, no undulating distortion)
        const waveZ = targetZ[i];

        // Spring acceleration
        const fx = (tx - currentX[i]) * springK;
        const fy = (ty - currentY[i]) * springK;
        const fz = (waveZ - currentZ[i]) * springK;

        vx[i] = (vx[i] + fx) * damping;
        vy[i] = (vy[i] + fy) * damping;
        vz[i] = (vz[i] + fz) * damping;

        // Interactive Mouse Repulsion (Ultra-small, pinpoint ripple)
        if (mouse.isHovered && !prefersReducedMotion) {
          const dx = currentX[i] - mouse.x;
          const dy = currentY[i] - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadius * mouseRadius && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / mouseRadius;
            const force = Math.pow(normDist, 1.8) * mouseBlast;

            // Radial push + fluid velocity drag
            vx[i] += (dx / dist) * force + mouseVelX * 0.12 * normDist;
            vy[i] += (dy / dist) * force + mouseVelY * 0.12 * normDist;
            vz[i] += (Math.random() - 0.5) * force * 0.3;

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
            // Natural Crystalline Refractive Shimmer (Diamonds & Sapphires glinting)
            const shimmerWave = Math.sin(elapsedTime * 2.8 + tx * 0.35 + ty * 0.25 + (i % 19) * 0.4);
            const glint = Math.pow(Math.max(0, shimmerWave), 7.0) * 0.45;

            if (pointTypes[i] === 0) {
              // Sapphire crystal glint: exact blue with specular glint highlight
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
      window.removeEventListener('resize', handleResize);

      logoGeometry.dispose();
      logoMaterial.dispose();
      particleTexture.dispose();

      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();

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
      className="relative w-full h-[660px] sm:h-[780px] lg:h-[900px] xl:h-[960px] overflow-hidden bg-[#02040a] border-y border-white/[0.08] select-none cursor-crosshair md:cursor-none flex items-center justify-center group"
      style={{
        contain: 'paint layout',
      }}
      title=""
    >
      {/* Deep-Space Cosmic Nebula Background Glows */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(13, 137, 232, 0.12) 0%, rgba(14, 165, 233, 0.05) 45%, transparent 75%), radial-gradient(ellipse 60% 40% at 18% 75%, rgba(99, 102, 241, 0.07) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 82% 25%, rgba(13, 137, 232, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Sleek Ultra-Small Custom Cursor Follower (Visible on desktop hover) */}
      <div
        ref={cursorRingRef}
        className="hidden md:block pointer-events-none absolute top-0 left-0 w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border border-[#0D89E8]/80 bg-[#0D89E8]/15 backdrop-blur-[0.5px] transition-[opacity,transform,border-color,background-color] duration-75 ease-out opacity-0 z-30 shadow-[0_0_8px_rgba(13,137,232,0.45)]"
        aria-hidden="true"
      />
      <div
        ref={cursorDotRef}
        className="hidden md:block pointer-events-none absolute top-0 left-0 w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-[#0D89E8] transition-opacity duration-75 opacity-0 z-30 shadow-[0_0_4px_#0D89E8]"
        aria-hidden="true"
      />

      {/* 3D WebGL Canvas spanning the entire full width and height of the section */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
        aria-hidden="true"
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
      </div>
    </section>
  );
};

export default Pro26VortexSection;
