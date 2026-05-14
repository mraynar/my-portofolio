import { useState, useEffect, useRef } from "react";

/* ─── LAYOUT CONSTANTS ──────────────────────────────────── */
export const SECTION_MAX_W = 1320;
export const SECTION_PX = "clamp(16px, 3vw, 56px)";
export const SECTION_PY = "120px";

/* ─── TYPOGRAPHY ────────────────────────────────────────── */
export const F = {
  display: "'Plus Jakarta Sans', sans-serif",
  body: "'Outfit', sans-serif",
};

/* ─── THEME ─────────────────────────────────────────────── */
export const T = {
  bg:    (d) => (d ? "#060d1f" : "#ffffff"),
  bg2:   (d) => (d ? "#0d1b3e" : "#f0f4ff"),
  text:  (d) => (d ? "#e8f1ff" : "#0f1f4f"),
  text2: (d) => (d ? "#c3d8ff" : "#374151"),
  text3: (d) => (d ? "#93afd8" : "#6b7280"),
  card:  (d) => (d ? "#0d1b3e" : "#ffffff"),
  navBg: (d) => (d ? "rgba(6,13,31,0.96)" : "rgba(255,255,255,0.96)"),
};
export const BORDER = "rgba(59,130,246,.2)";

/* ─── HOOKS ─────────────────────────────────────────────── */
export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("theme") === "dark"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

/* ─── CONTAINER ─────────────────────────────────────────── */
export function Container({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{ width: "100%", maxWidth: SECTION_MAX_W, marginLeft: "auto", marginRight: "auto", ...style }}>
      {children}
    </div>
  );
}

/* ─── REVEAL ─────────────────────────────────────────────── */
export function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms`, height: "100%", display: "flex", flexDirection: "column", }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

/* ─── DECORATIVE ELEMENTS ────────────────────────────────── */
export function DotsGrid({ cols, rows, dotColor = "#1e3a8a", opacity = 0.7, style = {} }) {
  return (
    <div className="absolute pointer-events-none grid"
      style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gap: 10, opacity, ...style }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, display: "block" }} />
      ))}
    </div>
  );
}

export function Star4({ size = 28, fill = "#2563eb", opacity = 1, style = {} }) {
  return (
    <svg className="absolute pointer-events-none"
      style={{ width: size, height: size, animation: "spinStar 10s linear infinite", ...style }}
      viewBox="0 0 24 24">
      <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5Z" fill={fill} opacity={opacity} />
    </svg>
  );
}

export function FloatDot({ size, color, style = {} }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, animation: "floatY 6s ease-in-out infinite", ...style }} />
  );
}

export function DiamondShape({ size = 32, color = "#2563eb", opacity = 0.45, style = {} }) {
  return (
    <div className="absolute pointer-events-none"
      style={{ width: size, height: size, background: color, opacity, transform: "rotate(45deg)", borderRadius: 3, ...style }} />
  );
}

export function RingShape({ size = 60, color = "#2563eb", opacity = 0.35, strokeW = 3, style = {} }) {
  return (
    <div className="absolute pointer-events-none rounded-full"
      style={{ width: size, height: size, border: `${strokeW}px solid ${color}`, opacity, ...style }} />
  );
}

/* ─── SECTION HEADING ────────────────────────────────────── */
export function SectionHeading({ title, accent, subtitle, dark }) {
  return (
    <Reveal className="text-center mb-16">
      <h2 style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(2rem,4vw,3.2rem)", letterSpacing: "-.6px", color: T.text(dark), lineHeight: 1.18, marginBottom: ".6rem" }}>
        {title} <span style={{ color: "#2563eb" }}>{accent}</span>
      </h2>
      {subtitle && (
        <p style={{ color: T.text3(dark), fontSize: "1.05rem", fontFamily: F.body, lineHeight: 1.75, marginTop: ".4rem", marginBottom: "2.8rem" }}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ─── PROJECT CARD ───────────────────────────────────────── */
export function ProjectCard({ p, dark }) {
  const RATIO = "53.125%";
  const thumbBg = dark ? "#0d1b3e" : "#1d4ed8";
  const repoBgDefault = dark ? "#1e40af" : "#1d4ed8";

  return (
    <div style={{
      background: T.card(dark),
      border: `1.5px solid ${dark ? "rgba(59,130,246,.35)" : BORDER}`,  // ← samakan dengan ExpCard
      borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
      transition: "transform .28s ease, box-shadow .28s ease, border-color .28s ease",  // ← durasi .28s sama ExpCard
      boxShadow: dark
        ? "0 0 0 1px rgba(59,130,246,.2), 0 0 20px rgba(37,99,235,.25), 0 4px 24px rgba(37,99,235,.15)"
        : "none",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";           // ← dari -10px ke -8px
        e.currentTarget.style.borderColor = dark ? "#60a5fa" : "rgba(37,99,235,.5)";
        e.currentTarget.style.boxShadow = dark
          ? "0 0 0 1.5px rgba(96,165,250,.6), 0 0 40px rgba(37,99,235,.55), 0 0 80px rgba(37,99,235,.25), 0 16px 48px rgba(37,99,235,.3)"
          : "0 24px 60px rgba(37,99,235,.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = dark ? "rgba(59,130,246,.35)" : BORDER;  // ← pakai BORDER constant
        e.currentTarget.style.boxShadow = dark
          ? "0 0 0 1px rgba(59,130,246,.2), 0 0 20px rgba(37,99,235,.25), 0 4px 24px rgba(37,99,235,.15)"
          : "none";
      }}>

      <div style={{ position: "relative", width: "100%", paddingTop: RATIO, overflow: "hidden", flexShrink: 0, background: thumbBg }}>
        {p.image ? (
          <img src={p.image} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: thumbBg }}>
            <span style={{ fontSize: "3rem", lineHeight: 1 }}>📁</span>
          </div>
        )}
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 2, fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff", background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: 99, padding: "5px 12px", fontFamily: F.body, lineHeight: 1 }}>
          {p.label}
        </span>
      </div>

      <div style={{ padding: "1.6rem 1.8rem 2rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.08rem", color: T.text(dark), marginBottom: ".5rem", lineHeight: 1.35 }}>{p.title}</h3>
        <p style={{ fontSize: ".92rem", lineHeight: 1.78, color: T.text3(dark), marginBottom: "1.2rem", fontFamily: F.body, flex: 1, minHeight: "5rem"}}>{p.desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.2rem" }}>
          {p.badges.map((b) => (
            <span key={b} style={{ fontSize: ".72rem", fontWeight: 600, padding: "5px 13px", borderRadius: 99, background: dark ? "rgba(30,64,175,.35)" : "#e8f1ff", color: dark ? "#c3d8ff" : "#1e40af", border: "1px solid rgba(37,99,235,.3)", fontFamily: F.body, lineHeight: 1 }}>
              {b}
            </span>
          ))}
        </div>

        {p.repo ? (
          <a href={p.repo} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", borderRadius: 12, background: repoBgDefault, color: "#fff", padding: "10px 16px", fontFamily: F.body, fontWeight: 600, fontSize: "clamp(.65rem, 2vw, .82rem)", lineHeight: 1, letterSpacing: ".03em", transition: "transform .2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = dark ? "#2563eb" : "#1e3a8a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = repoBgDefault; e.currentTarget.style.transform = "translateY(0)"; }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View Repository
          </a>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, background: dark ? "rgba(30,64,175,.25)" : "rgba(37,99,235,.1)", border: `1.5px solid ${dark ? "rgba(96,165,250,.3)" : "rgba(37,99,235,.4)"}`, padding: "10px 16px", cursor: "not-allowed", userSelect: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={dark ? "#60a5fa" : "#2563eb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: ".78rem", fontWeight: 600, color: dark ? "#93c5fd" : "#1e40af", fontFamily: F.body, lineHeight: 1, letterSpacing: ".03em" }}>
              Private Repository
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EXPERIENCE CARD ────────────────────────────────────── */
export function ExpCard({ c, dark, style = {} }) {
  return (
    <div style={{
    background: T.card(dark),
    border: `${c.featured ? "2px" : "1.5px"} solid ${c.featured ? "#2563eb" : dark ? "rgba(59,130,246,.35)" : BORDER}`,
    borderRadius: 22, overflow: "hidden", position: "relative",
    transition: "transform .28s ease, box-shadow .28s ease, border-color .28s ease",
    display: "flex", flexDirection: "column",
    height: "100%",
    boxShadow: dark
      ? `0 0 0 1px rgba(59,130,246,.2), 0 0 20px rgba(37,99,235,.25), 0 4px 24px rgba(37,99,235,.15)`
      : "none",
    ...style,
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.borderColor = dark ? "#60a5fa" : "rgba(37,99,235,.5)";
      e.currentTarget.style.boxShadow = dark
        ? "0 0 0 1.5px rgba(96,165,250,.6), 0 0 40px rgba(37,99,235,.55), 0 0 80px rgba(37,99,235,.25), 0 16px 48px rgba(37,99,235,.3)"
        : "0 24px 60px rgba(37,99,235,.22)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = c.featured ? "#2563eb" : dark ? "rgba(59,130,246,.35)" : BORDER;
      e.currentTarget.style.boxShadow = dark
        ? "0 0 0 1px rgba(59,130,246,.2), 0 0 20px rgba(37,99,235,.25), 0 4px 24px rgba(37,99,235,.15)"
        : "none";
    }}>

      {c.featured && (
        <div style={{ position: "absolute", top: 20, right: -28, transform: "rotate(45deg)", background: "#2563eb", color: "#fff", fontSize: ".6rem", fontWeight: 700, padding: "4px 38px", fontFamily: F.body, letterSpacing: ".1em", zIndex: 10 }}>
          CURRENT
        </div>
      )}

      <div style={{ position: "relative", height: 240, flexShrink: 0, overflow: "hidden", background: dark ? "linear-gradient(135deg,#0d1b3e,#1e3a6e)" : "linear-gradient(135deg,#e8f1ff,#dbeafe)" }}>
        {c.photo ? (
          <img src={c.photo} alt={c.photoAlt || c.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: dark ? "rgba(37,99,235,.25)" : "rgba(37,99,235,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={dark ? "#93afd8" : "#2563eb"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p style={{ fontSize: ".8rem", fontWeight: 600, color: dark ? "#93afd8" : "#2563eb", fontFamily: F.body }}>Add Activity Photo</p>
          </div>
        )}
        <span style={{ position: "absolute", bottom: 12, left: 14, background: dark ? "rgba(37,99,235,.55)" : "#2563eb", color: "#fff", fontSize: ".72rem", fontWeight: 700, fontFamily: F.body, padding: "5px 12px", borderRadius: 99, lineHeight: 1.5, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", letterSpacing: ".03em", boxShadow: "0 2px 8px rgba(37,99,235,.35)" }}>
          {c.date}
        </span>
      </div>

      <div style={{ padding: "1.2rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ marginBottom: ".8rem" }}>
          <span style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, background: c.badgeColor.bg, color: c.badgeColor.color, fontFamily: F.body, lineHeight: 1.5 }}>
            {c.badge}
          </span>
        </div>
        <h3 style={{ fontFamily: F.display, fontSize: "1.08rem", fontWeight: 800, color: "#2563eb", lineHeight: 1.3, marginBottom: ".35rem", letterSpacing: "-.2px" }}>{c.title}</h3>
        <p style={{ fontSize: ".85rem", color: T.text2(dark), fontWeight: 600, marginBottom: ".9rem", fontFamily: F.body, lineHeight: 1.5, opacity: 0.85 }}>{c.org}</p>

        <ul style={{ paddingLeft: "1.1rem", marginBottom: "1rem", flex: 1 }}>
          {c.items.map((item) => (
            <li key={item} style={{ fontSize: ".84rem", color: T.text3(dark), lineHeight: 1.72, marginBottom: 5, fontFamily: F.body }}>{item}</li>
          ))}
        </ul>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
          {c.tags.map((t) => (
            <span key={t} style={{ fontSize: ".68rem", fontWeight: 600, padding: "4px 11px", borderRadius: 7, background: dark ? "rgba(37,99,235,.2)" : "rgba(37,99,235,.09)", color: dark ? "#93c5fd" : "#1d4ed8", fontFamily: F.body, lineHeight: 1.5, border: `1px solid ${dark ? "rgba(96,165,250,.2)" : "rgba(37,99,235,.18)"}` }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────── */
export function Navbar({ dark, toggleDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const label = { home: "Home", about: "About", projects: "Projects", experience: "Experience", contact: "Contact" };
  const navItems = ["home", "about", "projects", "experience", "contact"];

  return (
    <>
      <nav style={{ background: T.navBg(dark), borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", transition: "border-color .3s ease" }}
        className="fixed top-0 left-0 right-0 z-[200] h-20">
        <Container className="flex items-center justify-between h-full" style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX }}>
          <a href="/" style={{ fontFamily: F.display, fontWeight: 800, fontSize: "1.5rem", color: "#2563eb", letterSpacing: "-.4px", lineHeight: 1, textDecoration: "none" }}>
            mraynar
          </a>

          <div className="hidden md:flex gap-10 items-center">
            {navItems.map((id) => (
              <a key={id} href={id === "home" ? "/" : id === "projects" ? "/projects" : id === "experience" ? "/experience" : `/#${id}`}
                style={{ fontSize: "1rem", color: T.text2(dark), fontFamily: F.body, lineHeight: 1, letterSpacing: ".01em", textDecoration: "none", fontWeight: 600, transition: "color .2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.text2(dark))}>
                {label[id]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="border-none cursor-pointer flex items-center justify-center rounded-full" style={{ width: 42, height: 42, background: dark ? "#1e40af" : "#2563eb", boxShadow: "0 2px 12px rgba(37,99,235,.4)" }}>
              {dark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>
            <button onClick={() => setOpen(true)} className="md:hidden flex flex-col gap-[6px] border-none bg-transparent cursor-pointer p-1">
              {[0, 1, 2].map((i) => (<span key={i} style={{ width: 24, height: 2.5, background: T.text(dark), borderRadius: 99, display: "block" }} />))}
            </button>
          </div>
        </Container>
      </nav>

      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 290, background: "rgba(0,0,0,.3)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />
          <div className="md:hidden" style={{
            position: "fixed", top: 12, left: 12, right: 12, zIndex: 300,
            borderRadius: 24,
            background: dark
              ? "linear-gradient(135deg, rgba(6,13,31,.97) 0%, rgba(13,27,62,.97) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,.98) 0%, rgba(240,244,255,.98) 100%)",
            border: dark ? "1.5px solid rgba(59,130,246,.35)" : "1.5px solid rgba(37,99,235,.15)",
            boxShadow: dark
              ? "0 0 0 1px rgba(59,130,246,.2), 0 8px 40px rgba(37,99,235,.35), 0 32px 80px rgba(0,0,0,.6)"
              : "0 8px 40px rgba(37,99,235,.18), 0 32px 80px rgba(0,0,0,.15)",
            overflow: "hidden",
            animation: "slideDown .3s ease forwards",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 16px", borderBottom: dark ? "1px solid rgba(59,130,246,.2)" : "1px solid rgba(37,99,235,.1)", background: dark ? "linear-gradient(90deg, rgba(37,99,235,.2), rgba(99,102,241,.1))" : "linear-gradient(90deg, rgba(37,99,235,.08), rgba(99,102,241,.04))" }}>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: "1.2rem", color: "#2563eb", letterSpacing: "-.3px" }}>mraynar</span>
              <button onClick={() => setOpen(false)}
                style={{ width: 34, height: 34, borderRadius: "50%", border: dark ? "1.5px solid rgba(59,130,246,.4)" : "1.5px solid rgba(37,99,235,.25)", background: dark ? "rgba(37,99,235,.2)" : "rgba(37,99,235,.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: dark ? "#93c5fd" : "#2563eb" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ padding: "10px 14px 14px" }}>
              {navItems.map((id, i) => (
                <a key={id}
                  href={id === "home" ? "/" : id === "projects" ? "/projects" : id === "experience" ? "/experience" : `/#${id}`}
                  onClick={() => setOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 14, textDecoration: "none", fontFamily: F.display, fontWeight: 700, fontSize: "1rem", color: dark ? "#e8f1ff" : "#0f1f4f", transition: "all .18s ease", marginBottom: i < navItems.length - 1 ? 4 : 0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = dark ? "rgba(37,99,235,.25)" : "rgba(37,99,235,.09)";
                    e.currentTarget.style.color = "#2563eb";
                    e.currentTarget.querySelector(".nav-dot").style.background = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = dark ? "#e8f1ff" : "#0f1f4f";
                    e.currentTarget.querySelector(".nav-dot").style.background = dark ? "rgba(37,99,235,.4)" : "rgba(37,99,235,.25)";
                  }}>
                  <span className="nav-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: dark ? "rgba(37,99,235,.4)" : "rgba(37,99,235,.25)", flexShrink: 0, transition: "background .18s ease" }} />
                  {label[id]}
                  <svg style={{ marginLeft: "auto", opacity: 0.4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              ))}
            </div>
            <div style={{ padding: "12px 22px 16px", borderTop: dark ? "1px solid rgba(59,130,246,.15)" : "1px solid rgba(37,99,235,.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.body, fontSize: ".8rem", color: dark ? "#93afd8" : "#6b7280", fontWeight: 500 }}>
                {dark ? "Dark Mode" : "Light Mode"}
              </span>
              <button onClick={() => { toggleDark(); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 99, border: dark ? "1.5px solid rgba(59,130,246,.35)" : "1.5px solid rgba(37,99,235,.2)", background: dark ? "rgba(37,99,235,.2)" : "rgba(37,99,235,.08)", cursor: "pointer", fontFamily: F.body, fontSize: ".8rem", fontWeight: 600, color: dark ? "#93c5fd" : "#2563eb" }}>
                {dark ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                )}
                Switch
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
export function Footer({ dark }) {
  return (
    <footer style={{
      background: dark ? "#060d1f" : "#0f1f4f",
      borderTop: dark ? "1px solid rgba(37,99,235,.2)" : "none",
    }}>
      {/* Top divider bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa, #3b82f6, #1d4ed8)" }} />

      <div style={{ maxWidth: SECTION_MAX_W, margin: "0 auto", padding: "2.4rem clamp(16px,3vw,56px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        {/* Logo */}
        <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: "1.4rem", color: "#3b82f6", letterSpacing: "-.3px" }}>mraynar</span>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "clamp(.6rem, 2vw, 1.8rem)", flexWrap: "nowrap", justifyContent: "center" }}>
          {["Home", "About", "Projects", "Experience", "Contact"].map((item) => (
            <a key={item}
              href={item === "Home" ? "/" : item === "Projects" ? "/projects" : item === "Experience" ? "/experience" : `/#${item.toLowerCase()}`}
              style={{ fontFamily: F.body, fontSize: ".82rem", fontWeight: 500, color: "rgba(148,163,184,.65)", textDecoration: "none", letterSpacing: ".03em", transition: "color .2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#93c5fd")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(148,163,184,.65)")}>
              {item}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "100%", maxWidth: 320, height: 1, background: "rgba(37,99,235,.25)", borderRadius: 99 }} />

        {/* Copyright */}
        <p style={{ fontFamily: F.body, fontSize: ".8rem", color: "rgba(148,163,184,.5)", textAlign: "center", lineHeight: 1.8, letterSpacing: ".02em" }}>
          &copy; 2026 <strong style={{ color: "rgba(147,197,253,.75)", fontWeight: 600 }}>Muhammad Raynar Hammam</strong>. All rights reserved.
        </p>
        <p style={{ fontFamily: F.body, fontSize: ".75rem", color: "rgba(148,163,184,.35)", letterSpacing: ".04em", textTransform: "uppercase" }}>
          Designed &amp; Developed in Surabaya, Indonesia
        </p>
      </div>
    </footer>
  );
}

/* ─── SCROLL TO TOP FAB ──────────────────────────────────── */
export function ScrollTopFab({ dark }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{ position: "fixed", bottom: 28, right: 28, zIndex: 500, width: 52, height: 52, borderRadius: "50%", border: `2px solid ${dark ? "rgba(147,175,216,.35)" : "rgba(37,99,235,.2)"}`, background: T.card(dark), boxShadow: "0 4px 16px rgba(0,0,0,.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s ease, opacity .3s ease", opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transform: show ? "translateY(0)" : "translateY(12px)" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = show ? "scale(1)" : "translateY(12px)")}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark ? "#c3d8ff" : "#2563eb"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

/* ─── GLOBAL CSS ─────────────────────────────────────────── */
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Outfit', sans-serif; overflow-x: hidden; }
 
  .overflow-x-auto::-webkit-scrollbar { display: none; }
  .overflow-x-auto { scrollbar-width: none; }
 
  @keyframes fadeUp      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn     { from{opacity:0;transform:scale(.86)} to{opacity:1;transform:scale(1)} }
  @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes spinStar    { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} 100%{transform:rotate(360deg)} }
  @keyframes fabPulse    { 0%,100%{box-shadow:0 4px 24px rgba(37,99,235,.55),0 0 0 0 rgba(37,99,235,.3)} 50%{box-shadow:0 4px 24px rgba(37,99,235,.55),0 0 0 14px rgba(37,99,235,0)} }
  @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
  @keyframes slideDown   { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
 
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
 
  @keyframes slideInBottom {
    from { opacity: 0; transform: translateY(80px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes heroPhotoIn {
    0%   { opacity: 0; transform: translateY(100px) scale(.96); }
    60%  { opacity: 1; }
    80%  { transform: translateY(-12px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0) translateY(10px); }
    70%  { transform: scale(1.18) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
 
  nav { animation: slideDown .7s .1s both; }
 
  .hero-photo-wrapper {
    width: min(380px, 32vw);
    height: calc(100vh - 96px);
    position: relative;
    overflow: visible;
    margin-right: 6vw;
  }
 
  @media (max-width: 768px) {
    .hero-photo-wrapper {
      position: absolute !important;
      right: -14vw !important;
      bottom: 0 !important;
      width: 64vw !important;
      height: calc(100vh - 96px) !important;
      margin-right: 0 !important;
      z-index: 1 !important;
      opacity: 1 !important;
      pointer-events: none !important;
    }
    .hero-photo-wrapper img { height: 72vh !important; }
    .hero-photo-wrapper > div:first-child { width: 130% !important; height: 65% !important; }
    .hero-photo-wrapper > div:nth-child(2) { width: 145% !important; height: 70% !important; }
    #home > div { align-items: center !important; padding-top: 0 !important; }
    #home > div > div:first-child {
      z-index: 2 !important; position: relative !important; max-width: 58% !important;
      padding-right: 0.5rem !important; margin-top: 0 !important; align-self: center !important;
      display: flex !important; flex-direction: column !important;
    }
    .hero-hi { font-size: 1.1rem !important; margin-bottom: 0.35rem !important; gap: 8px !important; order: 1 !important; margin-top: -11rem !important; }
    .hero-hi span { width: 24px !important; height: 2.5px !important; }
    #home > div > div:first-child h1 { font-size: clamp(2.1rem, 9vw, 3.2rem) !important; letter-spacing: -1px !important; line-height: 1.05 !important; margin-bottom: 0.5rem !important; order: 2 !important; }
    #home > div > div:first-child p:nth-child(3) { font-size: .8rem !important; letter-spacing: .12em !important; margin-bottom: 0 !important; order: 3 !important; }
    #home > div > div:first-child > div { order: 4 !important; margin-top: 2rem !important; }
    #home > div > div:first-child a { font-size: 0.92rem !important; padding: 16px 26px !important; white-space: nowrap !important; gap: 10px !important; }
  }
`;