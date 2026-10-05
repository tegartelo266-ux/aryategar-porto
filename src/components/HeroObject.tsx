import { useEffect, useRef } from "react";

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

type Node = { x: number; y: number; z: number; seed: number };

/**
 * The original hero 3D model: a rotating network globe. Points sit on a
 * sphere and are linked to their nearest neighbours, so it reads as a 3D
 * object. It auto-rotates and tilts toward the pointer. Rendered with a 2D
 * canvas + manual perspective projection (no WebGL dependency).
 */
export default function HeroObject({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- fibonacci sphere + nearest-neighbour network ---
    const N = 760;
    const nodes: Node[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * GOLDEN;
      nodes.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, seed: Math.random() });
    }

    const edges: [number, number][] = [];
    const seen = new Set<number>();
    for (let i = 0; i < N; i++) {
      const a = nodes[i];
      let b1 = -1;
      let b2 = -1;
      let b3 = -1;
      let d1 = Infinity;
      let d2 = Infinity;
      let d3 = Infinity;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < d1) {
          d3 = d2;
          b3 = b2;
          d2 = d1;
          b2 = b1;
          d1 = d;
          b1 = j;
        } else if (d < d2) {
          d3 = d2;
          b3 = b2;
          d2 = d;
          b2 = j;
        } else if (d < d3) {
          d3 = d;
          b3 = j;
        }
      }
      for (const b of [b1, b2, b3]) {
        if (b < 0) continue;
        const key = Math.min(i, b) * N + Math.max(i, b);
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, b]);
        }
      }
    }

    const pointer = { x: 0, y: 0 };
    let sx = 0;
    let sy = 0;
    let raf = 0;
    let cw = 0;
    let ch = 0;
    let dpr = 1;

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = w;
      ch = h;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = now * 0.001;
      sx += (pointer.x - sx) * 0.045;
      sy += (pointer.y - sy) * 0.045;

      const wide = cw / ch > 1.1;
      const cx = cw * (wide ? 0.66 : 0.5);
      const cy = ch * (wide ? 0.35 : 0.4);
      const base = Math.min(cw, ch) * (wide ? 0.3 : 0.42);
      const yaw = t * 0.26 + sx * 0.6;
      const pitch = Math.sin(t * 0.22) * 0.18 + sy * 0.34;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const fov = 3.2;

      ctx.clearRect(0, 0, cw, ch);

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.7);
      halo.addColorStop(0, "rgba(255,255,255,0.08)");
      halo.addColorStop(0.55, "rgba(255,255,255,0.025)");
      halo.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, cw, ch);

      const proj = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const rr = 1 + 0.05 * Math.sin(t * 1.35 + n.seed * 6.283);
        const x = n.x * rr;
        const y = n.y * rr;
        const z = n.z * rr;
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x1 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        const s = fov / (fov + z2);
        proj[i] = { x: cx + x1 * base * s, y: cy + y1 * base * s, d: (z2 + 1) * 0.5 };
      }

      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]];
        const b = proj[edges[e][1]];
        const d = (a.d + b.d) * 0.5;
        ctx.strokeStyle = `rgba(255,255,255,${(0.018 + d * 0.1).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        ctx.fillStyle = `rgba(255,255,255,${(0.07 + p.d * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.5 + p.d * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    if (reduce) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
