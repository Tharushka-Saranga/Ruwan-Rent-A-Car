import fs from 'fs';
import path from 'path';

const framesDir = path.resolve('public/frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

const TOTAL_FRAMES = 60;
console.log(`Generating ${TOTAL_FRAMES} default cinematic drive animation frames...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const t = i / (TOTAL_FRAMES - 1); // 0.0 to 1.0
  const pad = String(i + 1).padStart(3, '0');
  const fileName = `frame_${pad}.svg`;

  // Motion physics variables
  const roadScroll = (i * 0.18) % 1.0;
  const carSwayX = Math.sin(t * Math.PI * 4) * 8;
  const carBounceY = Math.sin(t * Math.PI * 8) * 2.5;
  const exhaustIntensity = 0.5 + Math.sin(t * Math.PI * 6) * 0.4;
  const overheadLightY = ((i * 32) % 900) - 100;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <!-- Sky & Atmosphere Gradients -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#020406" />
      <stop offset="65%" stop-color="#050e0b" />
      <stop offset="100%" stop-color="#082017" />
    </linearGradient>
    <!-- Asphalt Highway Gradient -->
    <linearGradient id="roadGrad" x1="0" y1="380" x2="0" y2="900" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#070c0a" />
      <stop offset="40%" stop-color="#091410" />
      <stop offset="100%" stop-color="#040705" />
    </linearGradient>
    <!-- Headlight Beam Glow -->
    <radialGradient id="beamGlowL" cx="720" cy="620" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.45)" />
      <stop offset="50%" stop-color="rgba(5, 150, 105, 0.12)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
    <radialGradient id="beamGlowR" cx="880" cy="620" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.45)" />
      <stop offset="50%" stop-color="rgba(5, 150, 105, 0.12)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
    <!-- Car Metallic Paintwork Gradient -->
    <linearGradient id="carBodyGrad" x1="0" y1="560" x2="0" y2="760" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#14211b" />
      <stop offset="25%" stop-color="#0b1712" />
      <stop offset="60%" stop-color="#050a08" />
      <stop offset="100%" stop-color="#020302" />
    </linearGradient>
    <!-- Glass Tint Gradient -->
    <linearGradient id="glassGrad" x1="0" y1="580" x2="0" y2="670" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#04120d" />
      <stop offset="70%" stop-color="#020605" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <!-- Neon Glow Filters -->
    <filter id="neonEmerald" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur1" />
      <feGaussianBlur stdDeviation="16" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="neonRed" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur1" />
      <feGaussianBlur stdDeviation="22" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Deep Night Sky -->
  <rect width="1600" height="900" fill="#020302" />
  <rect width="1600" height="400" fill="url(#skyGrad)" />

  <!-- Distant City Skyline & Mountains Silhouette -->
  <path d="M0 380 L140 345 L280 365 L450 320 L620 375 L800 340 L980 370 L1150 330 L1320 360 L1480 335 L1600 380 L1600 400 L0 400 Z" fill="#030806" />

  <!-- Distant Horizon Highway Glow -->
  <line x1="0" y1="380" x2="1600" y2="380" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.35" filter="url(#softGlow)" />

  <!-- Perspective Highway Road -->
  <polygon points="760,380 840,380 1520,900 80,900" fill="url(#roadGrad)" />

  <!-- Highway Guardrails with Neon Edge Lines -->
  <line x1="760" y1="380" x2="80" y2="900" stroke="#10b981" stroke-width="3.5" stroke-opacity="0.6" filter="url(#neonEmerald)" />
  <line x1="840" y1="380" x2="1520" y2="900" stroke="#10b981" stroke-width="3.5" stroke-opacity="0.6" filter="url(#neonEmerald)" />

  <!-- Outer Speed Lines / Highway Reflectors -->
  ${Array.from({ length: 8 }, (_, idx) => {
    const p = ((idx / 8) + roadScroll) % 1.0;
    const y = 380 + Math.pow(p, 2.2) * 520;
    const leftX = 800 - 40 - p * 680;
    const rightX = 800 + 40 + p * 680;
    const size = Math.max(2, p * 8);
    const op = Math.max(0.1, p * 0.9);
    return `
      <circle cx="${leftX.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="#34d399" fill-opacity="${op.toFixed(2)}" filter="url(#softGlow)" />
      <circle cx="${rightX.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="#34d399" fill-opacity="${op.toFixed(2)}" filter="url(#softGlow)" />
    `;
  }).join('')}

  <!-- Center Lane Dashed Divider with High-Velocity Motion -->
  ${Array.from({ length: 12 }, (_, idx) => {
    const p = ((idx / 12) + roadScroll) % 1.0;
    const y1 = 380 + Math.pow(p, 2.4) * 520;
    const dashH = Math.max(3, Math.pow(p, 2) * 55);
    const y2 = Math.min(900, y1 + dashH);
    const strokeW = Math.max(1.5, p * 7);
    const op = Math.min(1, p * 1.2);
    return `
      <line x1="800" y1="${y1.toFixed(1)}" x2="800" y2="${y2.toFixed(1)}" stroke="#34d399" stroke-width="${strokeW.toFixed(1)}" stroke-opacity="${op.toFixed(2)}" filter="url(#softGlow)" />
    `;
  }).join('')}

  <!-- Overhead Highway Neon Gantry Light Motion Sweep -->
  <g transform="translate(0, ${overheadLightY})">
    <ellipse cx="800" cy="300" rx="600" ry="25" fill="none" stroke="rgba(16, 185, 129, 0.12)" stroke-width="40" filter="url(#softGlow)" />
  </g>

  <!-- Car Headlight Volumetric Forward Cones Projected onto Road -->
  <path d="M ${720 + carSwayX} ${650 + carBounceY} L 400 390 L 780 390 Z" fill="url(#beamGlowL)" />
  <path d="M ${880 + carSwayX} ${650 + carBounceY} L 820 390 L 1200 390 Z" fill="url(#beamGlowR)" />

  <!-- SPORTS COUPE CHASSIS -->
  <g transform="translate(${800 + carSwayX}, ${670 + carBounceY})">
    <!-- Ground Ambient Shadow & Road Contact Shadow -->
    <ellipse cx="0" cy="85" rx="310" ry="28" fill="#000000" fill-opacity="0.95" />
    <ellipse cx="0" cy="85" rx="240" ry="16" fill="#000000" />

    <!-- Wide Performance Rear Tires -->
    <rect x="-270" y="45" width="62" height="45" rx="10" fill="#030504" />
    <rect x="208" y="45" width="62" height="45" rx="10" fill="#030504" />

    <!-- Carbon Fiber Lower Rear Diffuser & Aerodynamic Fins -->
    <path d="M-220 70 L-250 82 L250 82 L220 70 Z" fill="#080c0a" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.3" />
    <line x1="-120" y1="70" x2="-120" y2="82" stroke="#10b981" stroke-width="2" stroke-opacity="0.4" />
    <line x1="-40" y1="70" x2="-40" y2="82" stroke="#10b981" stroke-width="2" stroke-opacity="0.4" />
    <line x1="40" y1="70" x2="40" y2="82" stroke="#10b981" stroke-width="2" stroke-opacity="0.4" />
    <line x1="120" y1="70" x2="120" y2="82" stroke="#10b981" stroke-width="2" stroke-opacity="0.4" />

    <!-- Twin Titanium Exhaust Ports with Blue Turbo Flame Pulse -->
    <ellipse cx="-170" cy="74" rx="14" ry="10" fill="#020302" stroke="#38bdf8" stroke-width="2.5" />
    <circle cx="-170" cy="74" r="${(6 * exhaustIntensity).toFixed(1)}" fill="#38bdf8" fill-opacity="${exhaustIntensity.toFixed(2)}" filter="url(#softGlow)" />
    <ellipse cx="170" cy="74" rx="14" ry="10" fill="#020302" stroke="#38bdf8" stroke-width="2.5" />
    <circle cx="170" cy="74" r="${(6 * exhaustIntensity).toFixed(1)}" fill="#38bdf8" fill-opacity="${exhaustIntensity.toFixed(2)}" filter="url(#softGlow)" />

    <!-- Aerodynamic Rear Bumper & Muscular Fenders -->
    <path d="M -260 48
             C -275 10, -265 -20, -220 -45
             C -190 -62, -150 -70, -110 -72
             L 110 -72
             C 150 -70, 190 -62, 220 -45
             C 265 -20, 275 10, 260 48
             C 245 72, 220 74, 180 75
             L -180 75
             C -220 74, -245 72, -260 48 Z"
          fill="url(#carBodyGrad)"
          stroke="#10b981"
          stroke-width="2"
          stroke-opacity="0.5" />

    <!-- Rear Active Aerodynamic Spoiler -->
    <path d="M -230 -62 Q 0 -68 230 -62 L 240 -74 Q 0 -82 -240 -74 Z" fill="#08100c" stroke="#34d399" stroke-width="1.8" filter="url(#softGlow)" />
    <line x1="-120" y1="-62" x2="-120" y2="-45" stroke="#10b981" stroke-width="3" stroke-opacity="0.6" />
    <line x1="120" y1="-62" x2="120" y2="-45" stroke="#10b981" stroke-width="3" stroke-opacity="0.6" />

    <!-- Aerodynamic Fastback Cabin & Sloped Rear Privacy Window -->
    <path d="M -150 -70
             C -130 -140, -90 -160, 0 -162
             C 90 -160, 130 -140, 150 -70 Z"
          fill="url(#glassGrad)"
          stroke="rgba(52, 211, 153, 0.45)"
          stroke-width="2" />

    <!-- Interior Silhouette & High-Mount LED Brake Light -->
    <line x1="-35" y1="-155" x2="35" y2="-155" stroke="#ef4444" stroke-width="3.5" filter="url(#neonRed)" />

    <!-- Full-Width Sculpted Red/Amber LED Light Bar (Signature Horizon Taillight) -->
    <path d="M -235 -22 L -120 -18 L 120 -18 L 235 -22" fill="none" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" filter="url(#neonRed)" />
    <path d="M -240 -22 L -180 -20" fill="none" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" />
    <path d="M 180 -20 L 240 -22" fill="none" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" />

    <!-- License Plate Recess & Verified Emblem -->
    <rect x="-65" y="12" width="130" height="34" rx="4" fill="#020403" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" />
    <text x="0" y="34" font-family="monospace, monospace" font-size="13" font-weight="900" fill="#10b981" text-anchor="middle" letter-spacing="2">RUWAN RENTALS</text>
    <text x="0" y="22" font-family="sans-serif" font-size="7" font-weight="700" fill="#a7f3d0" text-anchor="middle" letter-spacing="1">SRI LANKA VIP</text>

    <!-- Metallic Emerald Body Edge Highlights -->
    <path d="M -220 -45 Q 0 -52 220 -45" fill="none" stroke="rgba(16, 185, 129, 0.7)" stroke-width="1.8" />
  </g>

  <!-- Speed Vignette -->
  <rect width="1600" height="900" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="40" />
</svg>`;

  fs.writeFileSync(path.join(framesDir, fileName), svg.trim(), 'utf8');
}

console.log(`Successfully generated ${TOTAL_FRAMES} frames in ${framesDir}`);
