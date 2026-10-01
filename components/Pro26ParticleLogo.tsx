import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PRO26_LOGO_POINTS } from './pro26-logo-points';

interface Pro26ParticleLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  scaleFactor?: number;
  showControls?: boolean;
}

const Pro26ParticleLogo: React.FC<Pro26ParticleLogoProps> = ({
  className = '',
  width = '100%',
  height = '320px',
  scaleFactor = 1.0,
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAssembled, setIsAssembled] = useState(false);
  const [interactionHint, setInteractionHint] = useState(true);

  // Trigger burst callback ref
  const triggerBurstRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let w = container.clientWidth || 600;
    let h = container.clientHeight || 320;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 48);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Create ultra-clear faceted crystal particle texture via offscreen Canvas
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

    // Extract Point Data
    const numPoints = PRO26_LOGO_POINTS.length; // 919 points
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    const sizes = new Float32Array(numPoints);
    const pointTypes = new Uint8Array(numPoints);

    // Physics state arrays
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

    // Scale coordinates to pleasant 3D world dimensions
    // Logo span in 3D: width ~ 36, height ~ 16
    const logoScale = 16 * scaleFactor;

    // Exact Pro26 Logo Blue (#0D89E8): rgb(13, 137, 232)
    const exactBlueR = 13 / 255;
    const exactBlueG = 137 / 255;
    const exactBlueB = 232 / 255;

    for (let i = 0; i < numPoints; i++) {
      const [nx, ny, type] = PRO26_LOGO_POINTS[i];
      pointTypes[i] = type;

      // Target resting positions
      targetX[i] = nx * logoScale;
      targetY[i] = ny * logoScale;
      targetZ[i] = (Math.random() - 0.5) * 1.2; // subtle initial 3D thickness

      // Initial explosion from 3D space
      if (!prefersReducedMotion) {
        currentX[i] = targetX[i] + (Math.random() - 0.5) * 60;
        currentY[i] = targetY[i] + (Math.random() - 0.5) * 45;
        currentZ[i] = (Math.random() - 0.5) * 75;
      } else {
        currentX[i] = targetX[i];
        currentY[i] = targetY[i];
        currentZ[i] = targetZ[i];
      }

      positions[i * 3] = currentX[i];
      positions[i * 3 + 1] = currentY[i];
      positions[i * 3 + 2] = currentZ[i];

      // Exact Colors
      if (type === 0) {
        // Blue 'P' Monogram: Exact Pro26 Blue #0D89E8
        baseColors[i * 3] = exactBlueR;
        baseColors[i * 3 + 1] = exactBlueG;
        baseColors[i * 3 + 2] = exactBlueB;
      } else {
        // 'ro26' Letters: Pure Crisp White #FFFFFF
        baseColors[i * 3] = 1.0;
        baseColors[i * 3 + 1] = 1.0;
        baseColors[i * 3 + 2] = 1.0;
      }

      colors[i * 3] = baseColors[i * 3];
      colors[i * 3 + 1] = baseColors[i * 3 + 1];
      colors[i * 3 + 2] = baseColors[i * 3 + 2];

      // Ultra-clear crystal particle size with sharp facet clarity
      sizes[i] = (type === 0 ? 1.15 : 1.05) * (0.90 + Math.random() * 0.20);
    }

    // Geometry & Material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.15,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      alphaTest: 0.03, // Cuts off sub-alpha haze for razor-sharp crystalline clarity
      depthWrite: false,
      sizeAttenuation: true,
    });

    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);

    // Mouse Interaction
    const mouse = {
      x: 9999,
      y: 9999,
      targetX: 9999,
      targetY: 9999,
      hover: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        // Unproject mouse coordinates into world coordinates at z = 0
        const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        // Convert NDC to camera view space at z = 0
        const v = new THREE.Vector3(ndcX, ndcY, 0.5);
        v.unproject(camera);
        const dir = v.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        mouse.targetX = pos.x;
        mouse.targetY = pos.y;
        mouse.hover = true;
      } else {
        mouse.hover = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.hover = false;
      mouse.targetX = 9999;
      mouse.targetY = 9999;
    };

    // Burst / Dispersion Function
    const triggerBurst = () => {
      for (let i = 0; i < numPoints; i++) {
        vx[i] += (Math.random() - 0.5) * 1.8;
        vy[i] += (Math.random() - 0.5) * 1.8;
        vz[i] += (Math.random() - 0.5) * 2.4;
      }
    };
    triggerBurstRef.current = triggerBurst;

    const handleClick = () => {
      triggerBurst();
      setInteractionHint(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('click', handleClick);

    // Resize
    const handleResize = () => {
      if (!container) return;
      w = container.clientWidth || 600;
      h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Spring Physics Parameters
    const springK = 0.065; // Snappy, clean return
    const damping = 0.83; // Fluid, responsive damping
    const mouseRadius = 4.2; // Small, refined influence radius (was 8.5)
    const mouseBlast = 0.95; // Repulsion strength

    let animationFrameId: number;
    const clock = new THREE.Clock();
    let assembleTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      assembleTimer += 0.016;
      if (assembleTimer > 1.2 && !isAssembled) {
        setIsAssembled(true);
      }

      // Smooth mouse lerping with velocity extraction
      let mouseVelX = 0;
      let mouseVelY = 0;
      if (mouse.hover) {
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

      // 3D Parallax Tilt
      if (mouse.hover && !prefersReducedMotion) {
        const normMouseX = mouse.targetX / (logoScale * 1.2);
        const normMouseY = mouse.targetY / (logoScale * 0.6);
        pointsMesh.rotation.y += (normMouseX * 0.35 - pointsMesh.rotation.y) * 0.05;
        pointsMesh.rotation.x += (-normMouseY * 0.25 - pointsMesh.rotation.x) * 0.05;
      } else {
        // Idle gentle float
        pointsMesh.rotation.y += (0 - pointsMesh.rotation.y) * 0.04;
        pointsMesh.rotation.x += (0 - pointsMesh.rotation.x) * 0.04;
      }

      // Update Point Physics
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i = 0; i < numPoints; i++) {
        const tx = targetX[i];
        const ty = targetY[i];

        // Harmonic 3D wave wobble (makes logo feel alive)
        const waveZ = prefersReducedMotion
          ? targetZ[i]
          : targetZ[i] + Math.sin(elapsedTime * 2.2 + tx * 0.25) * 0.65;

        // 1. Spring force pulling toward logo shape
        const fx = (tx - currentX[i]) * springK;
        const fy = (ty - currentY[i]) * springK;
        const fz = (waveZ - currentZ[i]) * springK;

        vx[i] = (vx[i] + fx) * damping;
        vy[i] = (vy[i] + fy) * damping;
        vz[i] = (vz[i] + fz) * damping;

        // 2. Mouse Repulsion Blast (Small, tight fluid ripple)
        if (mouse.hover && !prefersReducedMotion) {
          const dx = currentX[i] - mouse.x;
          const dy = currentY[i] - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadius * mouseRadius && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / mouseRadius;
            const force = Math.pow(normDist, 1.8) * mouseBlast;

            vx[i] += (dx / dist) * force + mouseVelX * 0.18 * normDist;
            vy[i] += (dy / dist) * force + mouseVelY * 0.18 * normDist;
            vz[i] += Math.sin(dist * 1.8 - elapsedTime * 4.0) * force * 1.0;

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
            const shimmerWave = Math.sin(elapsedTime * 2.8 + tx * 0.35 + ty * 0.25 + (i % 17) * 0.4);
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

        // Apply velocity
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
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scaleFactor]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Particle Logo Canvas */}
      <div
        ref={mountRef}
        className="w-full cursor-pointer relative overflow-hidden select-none"
        style={{ width, height }}
        title=""
      />

      {/* Subtle Hint & Interactive Actions */}
      {showControls && (
        <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-cyan-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>919 Active Particle Points</span>
          </span>
          <button
            onClick={() => triggerBurstRef.current()}
            className="hover:text-cyan-300 transition-colors underline decoration-dotted text-[11px]"
          >
            Scatter &amp; Reform
          </button>
        </div>
      )}
    </div>
  );
};

export default Pro26ParticleLogo;
