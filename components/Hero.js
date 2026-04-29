import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduce) return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // Prevent double-init during hot reloads
    if (wrap.dataset.ceisInit === "1") return;
    wrap.dataset.ceisInit = "1";

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const nodeCount = () => {
      const base = Math.round((w * h) / 26000);
      return Math.max(28, Math.min(base, 82));
    };

    let nodes = [];
    const initNodes = () => {
      const n = nodeCount();
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        r: 1.1 + Math.random() * 1.7,
      }));
    };

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseleave", onLeave, { passive: true });

    const maxDist = 170;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Subtle glow field
      const g = ctx.createRadialGradient(
        w * 0.52,
        h * 0.30,
        40,
        w * 0.52,
        h * 0.30,
        Math.max(w, h) * 0.8
      );
      g.addColorStop(0, "rgba(255,255,255,0.06)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Update
      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist2 = dx * dx + dy * dy;

          if (dist2 < 150 * 150) {
            p.vx += dx * 0.00003;
            p.vy += dy * 0.00003;
          }
        }

        p.vx *= 0.995;
        p.vy *= 0.995;
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.45;

            const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            lg.addColorStop(0, `rgba(191,0,6,${alpha})`);
            lg.addColorStop(1, `rgba(59,130,246,${alpha})`);

            ctx.strokeStyle = lg;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const p of nodes) {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 13);
        glow.addColorStop(0, "rgba(255,255,255,0.20)");
        glow.addColorStop(0.35, "rgba(191,0,6,0.14)");
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      initNodes();
    });

    ro.observe(wrap);
    resize();
    initNodes();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      delete wrap.dataset.ceisInit;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#05060d] text-white">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -inset-[30%] ceis-bgMesh" />
        <div className="absolute left-1/2 top-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 ceis-bgRing" />
        <div className="absolute inset-0 ceis-bgScan" />
        <div className="absolute inset-0 ceis-bgGrid" />
        <div className="absolute -inset-[20%] ceis-bgGrain" />
      </div>

      {/* Signal network canvas */}
      <div ref={wrapRef} className="relative">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-85 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="ceis-pill">Web Design and Development</span>
            <span className="ceis-pill">Creative Strategy</span>
            <span className="ceis-pill">AI Consulting and Implementation</span>
          </div>

          <h1 className="text-[clamp(38px,4.8vw,64px)] font-black leading-[1.02] tracking-tight">
            Creative That Stops the Scroll.
            <br />
            <span className="ceis-gradText">Engineering That Wins the Click.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-white/85 text-[clamp(16px,1.2vw,18px)] leading-relaxed">
            We build conversion-focused websites with modern development practices and creative strategies designed for real testing.
            Then we implement production-ready AI workflows that reduce manual work and improve how your business runs day to day.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-2xl bg-[#bf0006] px-5 py-3 font-extrabold shadow-[0_18px_44px_rgba(191,0,6,0.22)] hover:opacity-95"
            >
              Start a Project
            </Link>

            <Link
              href="/services/ai"
              className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-extrabold hover:bg-white/12"
            >
              Explore AI Services
            </Link>
          </div>

          <div className="mt-10 grid gap-3 max-w-3xl text-sm text-white/85">
            <div className="ceis-proof">Unique angles built for testing across ads, landing pages, and follow-up.</div>
            <div className="ceis-proof">Performance-minded builds with clean structure, strong CTAs, and measurable conversion paths.</div>
            <div className="ceis-proof">AI implementation with integrations, guardrails, and monitoring.</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ceis-bgMesh {
          background:
            radial-gradient(1100px 600px at 15% 20%, rgba(191,0,6,0.60), transparent 60%),
            radial-gradient(900px 520px at 90% 22%, rgba(59,130,246,0.36), transparent 58%),
            radial-gradient(800px 520px at 55% 85%, rgba(34,197,94,0.18), transparent 60%),
            conic-gradient(
              from 180deg at 50% 50%,
              rgba(191,0,6,0.26),
              rgba(255,255,255,0.10),
              rgba(59,130,246,0.22),
              rgba(191,0,6,0.26)
            );
          filter: blur(26px) saturate(1.15);
          transform: scale(1.15);
          animation: ceisDrift 10s ease-in-out infinite alternate;
          opacity: 0.95;
        }

        @keyframes ceisDrift {
          from { transform: translate3d(-1.5%, -1%, 0) scale(1.15) rotate(-2deg); }
          to   { transform: translate3d( 2.0%,  2%, 0) scale(1.22) rotate( 2deg); }
        }

        .ceis-bgRing {
          background: conic-gradient(
            from 0deg,
            rgba(191,0,6,0.40),
            rgba(59,130,246,0.26),
            rgba(34,197,94,0.14),
            rgba(191,0,6,0.40)
          );
          filter: blur(28px);
          opacity: 0.55;
          mask-image: radial-gradient(circle, transparent 44%, #000 58%, transparent 72%);
          animation: ceisSpin 14s linear infinite;
        }

        @keyframes ceisSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .ceis-bgScan {
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.06) 14%,
            transparent 28%,
            transparent 58%,
            rgba(255,255,255,0.05) 72%,
            transparent 86%
          );
          background-size: 240% 240%;
          animation: ceisScan 6.5s ease-in-out infinite;
          opacity: 0.75;
          mix-blend-mode: screen;
        }

        @keyframes ceisScan {
          0%   { background-position: 0% 20%; }
          50%  { background-position: 100% 60%; }
          100% { background-position: 0% 20%; }
        }

        .ceis-bgGrid {
          background:
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0.18;
          mask-image: radial-gradient(70% 60% at 50% 25%, #000 55%, transparent 85%);
        }

        .ceis-bgGrain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.10;
          mix-blend-mode: overlay;
          animation: ceisGrain 2.2s steps(2) infinite;
        }

        @keyframes ceisGrain {
          0%   { transform: translate3d(-2%, -2%, 0); }
          50%  { transform: translate3d( 2%,  1%, 0); }
          100% { transform: translate3d(-1%,  2%, 0); }
        }

        .ceis-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: rgba(255,255,255,0.92);
        }

        .ceis-gradText {
          background: linear-gradient(
            90deg,
            rgba(191,0,6,1),
            rgba(255,255,255,0.95),
            rgba(59,130,246,1),
            rgba(191,0,6,1)
          );
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ceisTextFlow 5.5s ease-in-out infinite;
        }

        @keyframes ceisTextFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .ceis-proof {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 10px 12px;
          backdrop-filter: blur(10px);
        }

        @media (prefers-reduced-motion: reduce) {
          .ceis-bgMesh,
          .ceis-bgRing,
          .ceis-bgScan,
          .ceis-bgGrain,
          .ceis-gradText {
            animation: none !important;
          }
          canvas {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
