type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  glow: boolean;
  offsetX: number;
  offsetY: number;
};

type SpiralPoint = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
};

type OrbitPoint = {
  radius: number;
  angle: number;
  speed: number;
  eccentricity: number;
  size: number;
  phase: number;
};

type Nebula = {
  x: number;
  y: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
  squash: number;
  points: SpiralPoint[];
  bornAt: number;
  period: number;
  screenX: number;
  screenY: number;
  screenRadius: number;
};

type Meteor = { x: number; y: number; vx: number; vy: number; age: number; life: number };
type Burst = { x: number; y: number; vx: number; vy: number; size: number; age: number; life: number; hue: number };

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const createGalacticBackground = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return { setTime: (_minutes: number) => {}, destroy: () => {} };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 700px)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const lowPower = compact || navigator.hardwareConcurrency <= 4 || memory <= 4;
  const quality = reducedMotion ? 0.28 : lowPower ? 0.52 : 1;
  const pointer = { x: -1000, y: -1000, active: false };
  const far: Star[] = [];
  const middle: Star[] = [];
  const near: Star[] = [];
  const galaxy: SpiralPoint[] = [];
  const orbit: OrbitPoint[] = [];
  const nebulae: Nebula[] = [];
  const meteors: Meteor[] = [];
  const bursts: Burst[] = [];
  let width = 1;
  let height = 1;
  let minSize = 1;
  let pixelRatio = 1;
  let frame = 0;
  let destroyed = false;
  let lastFrame = performance.now();
  let lastPaint = 0;
  let nextMeteor = 2.4;
  let timeMinutes = 0;
  let randomState = 0x71ca91d;
  const glowSprite = document.createElement("canvas");
  glowSprite.width = 64;
  glowSprite.height = 64;
  const glowContext = glowSprite.getContext("2d");
  if (glowContext) {
    const glow = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(244,248,255,.95)");
    glow.addColorStop(0.22, "rgba(186,214,255,.52)");
    glow.addColorStop(1, "rgba(132,178,255,0)");
    glowContext.fillStyle = glow;
    glowContext.fillRect(0, 0, 64, 64);
  }

  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0;
    return randomState / 4294967296;
  };
  const between = (min: number, max: number) => min + random() * (max - min);

  const makeStars = (target: Star[], count: number, min: number, max: number, glowChance: number) => {
    for (let index = 0; index < count; index += 1) {
      target.push({
        x: random(), y: random(), size: between(min, max), alpha: between(0.32, 0.92),
        phase: between(0, TAU), speed: between(0.35, 1.35), glow: random() < glowChance,
        offsetX: 0, offsetY: 0,
      });
    }
  };

  const makeSpiral = (count: number, radius: number, arms: number, turns: number) => {
    const points: SpiralPoint[] = [];
    for (let index = 0; index < count; index += 1) {
      const distance = 0.025 + random() * radius;
      const angle = (index % arms) * TAU / arms + (distance / radius) * turns + between(-0.11, 0.11);
      points.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance * 0.54,
        size: between(0.55, 1.8),
        alpha: (1 - distance / radius * 0.5) * between(0.38, 0.9),
        phase: between(0, TAU),
      });
    }
    return points;
  };

  const createNebula = (x: number, y: number, generated = false): Nebula => {
    const now = performance.now() / 1000;
    const period = generated ? between(16, 26) : between(68, 138);
    return {
      x, y, radius: generated ? between(0.1, 0.19) : between(0.08, 0.17),
      hue: between(192, 304), phase: between(0, TAU), speed: between(-0.035, 0.035),
      squash: between(0.45, 0.72),
      points: makeSpiral(Math.max(28, Math.round(68 * quality)), 1, 2 + (random() * 3 | 0), between(2, 4.2)),
      bornAt: generated ? now : now - random() * period,
      period, screenX: 0, screenY: 0, screenRadius: 0,
    };
  };

  const respawnNebula = (nebula: Nebula, now: number) => {
    nebula.x = between(0.06, 0.94);
    nebula.y = between(0.08, 0.92);
    nebula.radius = between(0.08, 0.17);
    nebula.hue = between(192, 304);
    nebula.phase = between(0, TAU);
    nebula.speed = between(-0.035, 0.035);
    nebula.squash = between(0.45, 0.72);
    nebula.period = between(68, 138);
    nebula.bornAt = now;
    nebula.points = makeSpiral(Math.max(28, Math.round(68 * quality)), 1, 2 + (random() * 3 | 0), between(2, 4.2));
  };

  const build = () => {
    randomState = 0x71ca91d;
    far.length = 0; middle.length = 0; near.length = 0; galaxy.length = 0; orbit.length = 0; nebulae.length = 0;
    makeStars(far, Math.round(1150 * quality), 0.55, 1.15, 0);
    makeStars(middle, Math.round(430 * quality), 0.9, 1.8, 0.03);
    makeStars(near, Math.round(105 * quality), 2.6, 8.5, 1);
    galaxy.push(...makeSpiral(Math.round(1250 * quality), 0.44, 4, 6.2));
    for (let index = 0; index < Math.round(310 * quality); index += 1) {
      const radius = between(0.05, 0.5);
      orbit.push({ radius, angle: between(0, TAU), speed: between(0.08, 0.2) / Math.sqrt(radius), eccentricity: between(0.5, 0.82), size: between(0.75, 2.1), phase: between(0, TAU) });
    }
    const nebulaCount = lowPower ? 10 : 18;
    for (let index = 0; index < nebulaCount; index += 1) {
      nebulae.push(createNebula(
        (index % 4 + between(0.25, 0.75)) / 4,
        (Math.floor(index / 4) + between(0.28, 0.72)) / Math.ceil(nebulaCount / 4),
      ));
    }
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    minSize = Math.min(width, height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.05 : 1.35);
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const palette = () => {
    const hour = timeMinutes / 60;
    const daylight = Math.max(0, Math.sin(clamp((hour - 5) / 14, 0, 1) * Math.PI));
    const twilight = Math.max(0, 1 - Math.abs(hour - 6.3) / 2.2, 1 - Math.abs(hour - 18.4) / 2.5);
    return {
      top: [mix(2, 224, daylight), mix(2, 235, daylight), mix(8, 244, daylight)],
      bottom: [mix(5, 108, daylight), mix(8, 145, daylight), mix(28, 174, daylight)],
      hue: 218 + twilight * 62 - daylight * 21,
      star: 1 - daylight * 0.56 + twilight * 0.12,
      glow: 0.62 + twilight * 0.52 + daylight * 0.12,
      rotation: (timeMinutes / 1440) * TAU,
    };
  };

  const drawBackground = (colors: ReturnType<typeof palette>) => {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgb(${colors.top.map(Math.round).join(",")})`);
    gradient.addColorStop(1, `rgb(${colors.bottom.map(Math.round).join(",")})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    const halo = context.createRadialGradient(width * 0.5, height * 0.44, 0, width * 0.5, height * 0.44, minSize * 0.74);
    halo.addColorStop(0, `hsla(${colors.hue},72%,62%,${0.1 * colors.glow})`);
    halo.addColorStop(0.52, `hsla(${colors.hue + 54},74%,48%,${0.045 * colors.glow})`);
    halo.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = halo;
    context.fillRect(0, 0, width, height);
  };

  const drawAurora = (time: number, colors: ReturnType<typeof palette>) => {
    context.save();
    context.globalCompositeOperation = "screen";
    for (let band = 0; band < 3; band += 1) {
      const baseY = height * (0.12 + band * 0.11);
      const gradient = context.createLinearGradient(0, baseY - 70, 0, baseY + minSize * 0.24);
      gradient.addColorStop(0, `hsla(${colors.hue + band * 34},82%,68%,${0.075 * colors.glow})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(0, baseY + minSize * 0.22);
      context.lineTo(0, baseY);
      for (let x = 0; x <= width + 30; x += 30) {
        const y = baseY + Math.sin(x * 0.004 + time * (0.09 + band * 0.018) + band) * (34 + band * 10)
          + Math.sin(x * 0.009 - time * 0.05) * 14;
        context.lineTo(x, y);
      }
      context.lineTo(width, baseY + minSize * 0.22);
      context.closePath();
      context.fill();
    }
    context.restore();
  };

  const drawStarLayer = (stars: Star[], time: number, strength: number, repel: boolean) => {
    for (const star of stars) {
      const homeX = star.x * width;
      const homeY = star.y * height;
      let x = homeX + star.offsetX;
      let y = homeY + star.offsetY;
      if (repel && pointer.active && !reducedMotion) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > 1 && distanceSquared < 15000) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distanceSquared / 15000) * 7;
          star.offsetX += dx / distance * force;
          star.offsetY += dy / distance * force;
        }
      }
      star.offsetX *= 0.91;
      star.offsetY *= 0.91;
      x = homeX + star.offsetX;
      y = homeY + star.offsetY;
      const pulse = reducedMotion ? 1 : 0.65 + Math.sin(time * star.speed + star.phase) * 0.35;
      const alpha = star.alpha * pulse * strength;
      if (star.glow) {
        const radius = star.size * 2.5;
        context.globalAlpha = alpha;
        context.drawImage(glowSprite, x - radius, y - radius, radius * 2, radius * 2);
      } else {
        context.globalAlpha = alpha;
        context.fillStyle = "#f4f7ff";
        context.fillRect(x, y, star.size, star.size);
      }
    }
    context.globalAlpha = 1;
  };

  const drawGalaxy = (time: number, colors: ReturnType<typeof palette>) => {
    const centerX = width * 0.5;
    const centerY = height * 0.47;
    const rotation = colors.rotation + (reducedMotion ? 0 : time * 0.017);
    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.globalCompositeOperation = "screen";
    for (const star of galaxy) {
      const alpha = star.alpha * colors.star * (reducedMotion ? 0.82 : 0.58 + Math.sin(time * 0.72 + star.phase) * 0.26);
      context.globalAlpha = alpha;
      context.fillStyle = `hsl(${colors.hue + star.x * 62} 78% 84%)`;
      context.fillRect(star.x * minSize, star.y * minSize, star.size, star.size);
    }
    context.restore();
    context.globalAlpha = 1;
    const coreRadius = minSize * 0.17;
    const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
    core.addColorStop(0, `rgba(248,250,255,${0.34 * colors.star})`);
    core.addColorStop(0.26, `hsla(${colors.hue},88%,76%,${0.22 * colors.glow})`);
    core.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = core;
    context.fillRect(centerX - coreRadius, centerY - coreRadius, coreRadius * 2, coreRadius * 2);
  };

  const drawOrbit = (time: number, colors: ReturnType<typeof palette>) => {
    const centerX = width * 0.5;
    const centerY = height * 0.47;
    context.save();
    context.globalCompositeOperation = "screen";
    context.fillStyle = `hsla(${colors.hue + 40},82%,76%,${0.34 * colors.star})`;
    for (const point of orbit) {
      const angle = point.angle + colors.rotation + (reducedMotion ? 0 : time * point.speed);
      const x = centerX + Math.cos(angle) * point.radius * minSize;
      const y = centerY + Math.sin(angle) * point.radius * minSize * point.eccentricity;
      context.globalAlpha = (0.36 + Math.sin(time + point.phase) * 0.2) * colors.star;
      context.fillRect(x, y, point.size, point.size);
    }
    context.restore();
    context.globalAlpha = 1;
  };

  const drawNebulae = (time: number, colors: ReturnType<typeof palette>) => {
    context.save();
    context.globalCompositeOperation = "screen";
    for (const nebula of nebulae) {
      let progress = (time - nebula.bornAt) / nebula.period;
      if (progress >= 1) {
        respawnNebula(nebula, time);
        progress = 0;
      }
      const appearProgress = clamp(progress / 0.16, 0, 1);
      const appear = 0.15 + 0.85 * (1 - Math.pow(1 - appearProgress, 3));
      const fade = 1 - clamp((progress - 0.76) / 0.24, 0, 1);
      const life = appear * fade;
      const scale = 0.2 + appear * 0.8 - (1 - fade) * 0.42;
      if (life < 0.006) continue;
      const x = nebula.x * width;
      const y = nebula.y * height;
      const radius = nebula.radius * minSize * scale;
      nebula.screenX = x;
      nebula.screenY = y;
      nebula.screenRadius = radius;
      const hue = nebula.hue + Math.sin(colors.rotation + nebula.phase) * 24;
      const gas = context.createRadialGradient(x, y, 0, x, y, radius);
      gas.addColorStop(0, `hsla(${hue},85%,70%,${0.16 * colors.glow * life})`);
      gas.addColorStop(0.46, `hsla(${hue + 35},76%,54%,${0.08 * colors.glow * life})`);
      gas.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gas;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      context.save();
      context.translate(x, y);
      context.rotate(nebula.phase + colors.rotation * 0.5 + (reducedMotion ? 0 : time * nebula.speed));
      context.scale(1, nebula.squash);
      context.fillStyle = `hsl(${hue} 86% 84%)`;
      for (const point of nebula.points) {
        context.globalAlpha = point.alpha * colors.star * 0.52 * life;
        context.fillRect(point.x * radius, point.y * radius, point.size, point.size);
      }
      context.restore();
    }
    context.restore();
    context.globalAlpha = 1;
  };

  const scatterNebula = (nebula: Nebula, time: number) => {
    const amount = Math.round((lowPower ? 38 : 66) * (reducedMotion ? 0.35 : 1));
    for (let index = 0; index < amount; index += 1) {
      const angle = between(0, TAU);
      const speed = between(36, 260);
      bursts.push({
        x: nebula.screenX, y: nebula.screenY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        size: between(0.7, 2.4), age: 0, life: between(0.7, 1.65), hue: nebula.hue,
      });
    }
    respawnNebula(nebula, time);
  };

  const drawBursts = (delta: number) => {
    context.save();
    context.globalCompositeOperation = "screen";
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const burst = bursts[index];
      burst.age += delta;
      if (burst.age >= burst.life) { bursts.splice(index, 1); continue; }
      burst.x += burst.vx * delta;
      burst.y += burst.vy * delta;
      burst.vx *= Math.exp(-2.1 * delta);
      burst.vy *= Math.exp(-2.1 * delta);
      const life = 1 - burst.age / burst.life;
      context.globalAlpha = Math.sin(Math.PI * life) * 0.9;
      context.fillStyle = `hsl(${burst.hue} 88% 82%)`;
      context.fillRect(burst.x, burst.y, burst.size, burst.size);
    }
    context.restore();
    context.globalAlpha = 1;
  };

  const drawPressGlow = (now: number) => {
    if (!press.active || reducedMotion) return;
    const held = (now - press.started) / 1000;
    if (held < 0.1) return;
    const radius = clamp(8 + held * minSize * 0.085, 8, minSize * 0.34);
    const glow = context.createRadialGradient(press.x, press.y, 0, press.x, press.y, radius);
    glow.addColorStop(0, "rgba(255,255,255,.9)");
    glow.addColorStop(0.22, "rgba(205,224,255,.48)");
    glow.addColorStop(0.58, "rgba(153,188,255,.15)");
    glow.addColorStop(1, "rgba(120,165,255,0)");
    context.save();
    context.globalCompositeOperation = "screen";
    context.fillStyle = glow;
    context.fillRect(press.x - radius, press.y - radius, radius * 2, radius * 2);
    context.restore();
  };

  const drawMeteors = (delta: number) => {
    if (!reducedMotion) {
      nextMeteor -= delta;
      if (nextMeteor <= 0) {
        nextMeteor = between(3.5, 8);
        meteors.push({ x: between(-60, width * 0.62), y: between(0, height * 0.28), vx: between(650, 980), vy: between(210, 360), age: 0, life: between(0.65, 1.1) });
      }
    }
    for (let index = meteors.length - 1; index >= 0; index -= 1) {
      const meteor = meteors[index];
      meteor.age += delta;
      if (meteor.age >= meteor.life) { meteors.splice(index, 1); continue; }
      meteor.x += meteor.vx * delta;
      meteor.y += meteor.vy * delta;
      const alpha = Math.sin(Math.PI * meteor.age / meteor.life);
      const tailX = meteor.x - meteor.vx * 0.085;
      const tailY = meteor.y - meteor.vy * 0.085;
      const streak = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
      streak.addColorStop(0, `rgba(255,255,255,${alpha})`);
      streak.addColorStop(1, "rgba(174,207,255,0)");
      context.strokeStyle = streak;
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(meteor.x, meteor.y);
      context.lineTo(tailX, tailY);
      context.stroke();
    }
  };

  const paint = (now: number, delta: number) => {
    const time = now / 1000;
    const colors = palette();
    drawBackground(colors);
    drawAurora(time, colors);
    drawNebulae(time, colors);
    drawGalaxy(time, colors);
    drawOrbit(time, colors);
    drawStarLayer(far, time, colors.star * 0.74, true);
    drawStarLayer(middle, time, colors.star * 0.88, true);
    drawStarLayer(near, time, colors.star, false);
    drawBursts(delta);
    drawMeteors(delta);
    drawPressGlow(now);
  };

  const tick = (now: number) => {
    if (destroyed) return;
    const targetInterval = document.body.classList.contains("modal-open") || document.body.classList.contains("cosmic-transitioning") ? 66 : 33;
    if (!document.hidden && (now - lastPaint >= targetInterval || reducedMotion && lastPaint === 0)) {
      const delta = Math.min((now - lastFrame) / 1000, 0.08);
      lastFrame = now;
      lastPaint = now;
      paint(now, delta);
    }
    if (!reducedMotion) frame = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; };
  const onPointerLeave = () => { pointer.active = false; };
  const press = { active: false, x: 0, y: 0, started: 0, pointerId: -1 };
  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || reducedMotion) return;
    press.active = true;
    press.x = event.clientX;
    press.y = event.clientY;
    press.started = performance.now();
    press.pointerId = event.pointerId;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!press.active || event.pointerId !== press.pointerId) return;
    press.active = false;
    const held = performance.now() - press.started;
    const now = performance.now() / 1000;
    if (held >= 520) {
      let nebula: Nebula;
      if (nebulae.length >= (lowPower ? 9 : 16)) {
        nebula = nebulae[0];
        respawnNebula(nebula, now);
      } else {
        nebula = createNebula(clamp(press.x / width, 0.04, 0.96), clamp(press.y / height, 0.05, 0.95), true);
        nebulae.push(nebula);
      }
      nebula.x = clamp(press.x / width, 0.04, 0.96);
      nebula.y = clamp(press.y / height, 0.05, 0.95);
      nebula.bornAt = now;
      return;
    }
    let closest: Nebula | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (const nebula of nebulae) {
      const distance = Math.hypot(nebula.screenX - event.clientX, nebula.screenY - event.clientY);
      if (distance < Math.max(28, nebula.screenRadius * 0.72) && distance < closestDistance) {
        closest = nebula;
        closestDistance = distance;
      }
    }
    if (closest) scatterNebula(closest, now);
  };
  const onPointerCancel = () => { press.active = false; };
  const onVisibility = () => {
    if (!document.hidden) {
      lastFrame = performance.now();
      if (reducedMotion) paint(lastFrame, 0);
    }
  };

  build();
  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerCancel, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  if (reducedMotion) paint(performance.now(), 0);
  else frame = window.requestAnimationFrame(tick);

  return {
    setTime(_minutes: number) {
      timeMinutes = 0;
      if (reducedMotion) paint(performance.now(), 0);
    },
    destroy() {
      destroyed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
};
