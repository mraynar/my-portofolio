import { useState } from "react";
import {
  T, F, BORDER, SECTION_PX, SECTION_MAX_W,
  Container, Reveal, DotsGrid, Star4, FloatDot, DiamondShape, RingShape,
  ProjectCard,
} from "./components";
import { PROJECTS } from "./data";

export default function ProjectPage({ dark }) {
  const [filter, setFilter] = useState("All");
  const labels = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.label)))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.label === filter);

  return (
    <main style={{ paddingTop: 80 }}>

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)", paddingTop: "80px", paddingBottom: "80px", minHeight: 320, display: "flex", alignItems: "center" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", zIndex: 0 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 }} />

        <DotsGrid cols={8} rows={4} dotColor="rgba(255,255,255,.4)" opacity={1} style={{ top: "6%", right: "2%", zIndex: 1 }} />
        <DotsGrid cols={5} rows={3} dotColor="rgba(255,255,255,.3)" opacity={1} style={{ bottom: "8%", left: "2%", zIndex: 1 }} />
        <Star4 size={36} fill="rgba(255,255,255,.7)" opacity={1} style={{ top: "10%", right: "6%", zIndex: 1 }} />
        <Star4 size={24} fill="#fbbf24" opacity={0.9} style={{ bottom: "18%", left: "8%", zIndex: 1, animationDelay: "-2s" }} />
        <Star4 size={20} fill="rgba(255,255,255,.5)" opacity={1} style={{ top: "30%", left: "20%", zIndex: 1, animationDelay: "-4s" }} />
        <FloatDot size={18} color="#fbbf24" style={{ top: "20%", right: "14%", animationDelay: "-1s", zIndex: 1 }} />
        <FloatDot size={14} color="rgba(255,255,255,.6)" style={{ bottom: "24%", right: "28%", animationDelay: "-3s", zIndex: 1 }} />
        <DiamondShape size={28} color="rgba(255,255,255,.2)" opacity={1} style={{ top: "14%", left: "36%", zIndex: 1 }} />
        <DiamondShape size={20} color="#fbbf24" opacity={0.5} style={{ bottom: "12%", right: "18%", zIndex: 1 }} />
        <RingShape size={120} color="rgba(255,255,255,.15)" opacity={1} strokeW={4} style={{ top: "-30px", left: "44%", zIndex: 1 }} />
        <RingShape size={80} color="#fbbf24" opacity={0.2} strokeW={3} style={{ bottom: "4%", right: "8%", zIndex: 1 }} />

        {[
          { size: 22, color: "rgba(255,255,255,.5)", top: "8%", left: "48%" },
          { size: 18, color: "#fbbf24", bottom: "20%", left: "38%" },
          { size: 16, color: "rgba(255,255,255,.4)", top: "55%", right: "36%" },
        ].map(({ size, color, ...pos }, i) => (
          <svg key={i} className="absolute pointer-events-none" style={{ width: size, height: size, ...pos, zIndex: 1 }} viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ))}

        <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <a href="/" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontFamily: F.body, fontSize: ".88rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Back to Home
              </a>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: ".88rem" }}>/</span>
              <span style={{ color: "#fff", fontFamily: F.body, fontSize: ".88rem", fontWeight: 600 }}>Projects</span>
            </div>

            <h1 style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(2.6rem,5vw,4.4rem)", letterSpacing: "-2px", lineHeight: 1.08, color: "#fff", marginBottom: "1rem", opacity: 0, animation: "fadeUp .7s .1s forwards" }}>
              ALL <span style={{ color: "#fbbf24" }}>PROJECTS</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: "1.05rem", fontFamily: F.body, lineHeight: 1.75, maxWidth: 520, opacity: 0, animation: "fadeUp .7s .25s forwards" }}>
              Every project I&apos;ve built — from web apps and mobile solutions to UI/UX designs and data analytics tools.
            </p>

            <div style={{ display: "flex", gap: 20, marginTop: "2rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp .7s .4s forwards" }}>
              {[
                [PROJECTS.length + "+", "Total Projects"],
                [PROJECTS.filter((p) => p.featured).length, "Featured"],
                [Array.from(new Set(PROJECTS.map((p) => p.label))).length, "Categories"],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,.15)", borderRadius: 14, padding: ".7rem 1.3rem", backdropFilter: "blur(8px)" }}>
                  <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: "1.6rem", color: "#fff", display: "block", lineHeight: 1.2 }}>{n}</span>
                  <span style={{ color: "rgba(255,255,255,.8)", fontSize: ".72rem", fontFamily: F.body, letterSpacing: ".04em" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── FILTER + GRID ── */}
      <section className="relative overflow-hidden" style={{ background: T.bg(dark), paddingTop: "80px", paddingBottom: "120px" }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: dark
            ? "radial-gradient(circle, rgba(37,99,235,0.35) 1.5px, transparent 1.5px)"
            : "radial-gradient(circle, rgba(37,99,235,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px", zIndex: 0,
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: dark
            ? "linear-gradient(rgba(37,99,235,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.15) 1px,transparent 1px)"
            : "linear-gradient(rgba(37,99,235,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.09) 1px,transparent 1px)",
          backgroundSize: "80px 80px", zIndex: 0,
        }} />
        <div className="absolute pointer-events-none" style={{ inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 600, height: 600, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37,99,235,.09) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(99,102,241,.16) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "38%", left: "38%", width: 400, height: 400, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(251,191,36,.07) 0%, transparent 70%)" : "radial-gradient(circle, rgba(251,191,36,.04) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 0, opacity: dark ? 0.04 : 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "180px 180px",
        }} />

        <DotsGrid cols={5} rows={3} dotColor={dark ? "#3b82f6" : "#1d4ed8"} opacity={0.4} style={{ bottom: "5%", right: "2%", zIndex: 1 }} />
        <DotsGrid cols={4} rows={3} dotColor={dark ? "#3b82f6" : "#1d4ed8"} opacity={0.3} style={{ top: "8%", left: "1%", zIndex: 1 }} />
        <Star4 size={22} fill="#2563eb" opacity={0.7} style={{ top: "3%", right: "4%", zIndex: 1 }} />
        <Star4 size={16} fill="#fbbf24" opacity={0.6} style={{ top: "60%", left: "1.5%", zIndex: 1, animationDelay: "-3s" }} />
        <DiamondShape size={24} color="#fbbf24" opacity={0.3} style={{ top: "15%", left: "2%", zIndex: 1 }} />
        <DiamondShape size={16} color="#2563eb" opacity={0.2} style={{ bottom: "20%", right: "3%", zIndex: 1 }} />
        <RingShape size={90} color="#2563eb" opacity={0.12} strokeW={3} style={{ bottom: "8%", left: "3%", zIndex: 1 }} />
        <RingShape size={60} color="#fbbf24" opacity={0.15} strokeW={2} style={{ top: "22%", right: "6%", zIndex: 1 }} />
        <FloatDot size={14} color="#2563eb" style={{ top: "12%", left: "48%", animationDelay: "-1.5s", zIndex: 1, opacity: 0.5 }} />
        <FloatDot size={10} color="#fbbf24" style={{ top: "30%", right: "12%", animationDelay: "-0.8s", zIndex: 1, opacity: 0.6 }} />
        <FloatDot size={12} color="#3b82f6" style={{ top: "55%", left: "8%", animationDelay: "-3.2s", zIndex: 1, opacity: 0.45 }} />
        <FloatDot size={8}  color="#fbbf24" style={{ bottom: "30%", left: "22%", animationDelay: "-2.1s", zIndex: 1, opacity: 0.5 }} />
        <FloatDot size={11} color="#2563eb" style={{ bottom: "15%", right: "18%", animationDelay: "-4.5s", zIndex: 1, opacity: 0.4 }} />
        <FloatDot size={9}  color="#3b82f6" style={{ top: "78%", left: "35%", animationDelay: "-1.2s", zIndex: 1, opacity: 0.4 }} />
        <Star4 size={18} fill="#fbbf24" opacity={0.55} style={{ top: "42%", right: "3%", zIndex: 1, animationDelay: "-1s" }} />
        <Star4 size={14} fill="#2563eb" opacity={0.45} style={{ bottom: "35%", left: "6%", zIndex: 1, animationDelay: "-5s" }} />
        <Star4 size={16} fill="#3b82f6" opacity={0.4} style={{ top: "68%", right: "8%", zIndex: 1, animationDelay: "-2.5s" }} />
        <RingShape size={50} color="#2563eb" opacity={0.12} strokeW={2} style={{ top: "48%", left: "2%", zIndex: 1 }} />
        <RingShape size={40} color="#fbbf24" opacity={0.18} strokeW={2} style={{ top: "15%", right: "2%", zIndex: 1 }} />
        <DiamondShape size={14} color="#fbbf24" opacity={0.35} style={{ top: "75%", right: "5%", zIndex: 1 }} />
        <DiamondShape size={12} color="#2563eb" opacity={0.3} style={{ top: "35%", left: "3%", zIndex: 1 }} />

        <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>

          {/* Filter Pills */}
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "3rem" }}>
              {labels.map((lbl) => {
                const active = filter === lbl;
                return (
                  <button key={lbl} onClick={() => setFilter(lbl)}
                    style={{
                      fontFamily: F.body, fontSize: ".85rem", fontWeight: 700, padding: "9px 22px",
                      borderRadius: 99, border: `2px solid ${active ? "#2563eb" : dark ? "rgba(59,130,246,.35)" : BORDER}`,
                      background: active ? "#2563eb" : T.card(dark), color: active ? "#fff" : T.text2(dark),
                      cursor: "pointer", transition: "all .2s ease", letterSpacing: ".02em", lineHeight: 1,
                      boxShadow: dark && !active ? "0 0 0 1px rgba(59,130,246,.15), 0 0 12px rgba(37,99,235,.12)" : "none",
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.boxShadow = dark ? "0 0 0 1px rgba(96,165,250,.4), 0 0 20px rgba(37,99,235,.3)" : "none"; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = dark ? "rgba(59,130,246,.35)" : BORDER; e.currentTarget.style.color = T.text2(dark); e.currentTarget.style.boxShadow = dark ? "0 0 0 1px rgba(59,130,246,.15), 0 0 12px rgba(37,99,235,.12)" : "none"; } }}>
                    {lbl}
                    <span style={{ marginLeft: 6, opacity: 0.7, fontSize: ".75rem" }}>
                      ({lbl === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.label === lbl).length})
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Results count */}
          <Reveal>
            <p style={{ fontFamily: F.body, fontSize: ".9rem", color: T.text3(dark), marginBottom: "2rem" }}>
              Showing <strong style={{ color: T.text(dark) }}>{filtered.length}</strong> project{filtered.length !== 1 ? "s" : ""}
              {filter !== "All" && <> in <span style={{ color: "#2563eb", fontWeight: 700 }}>{filter}</span></>}
            </p>
          </Reveal>

          {/* ── Grid ── */}
          <div className="proj-outer">
            <div className="proj-grid">
              {filtered.map((p, i) => (
                <div key={`${p.title}-${filter}`} className="proj-card-wrap">
                  <ProjectCard p={p} dark={dark} />
                </div>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 0", color: T.text3(dark), fontFamily: F.body }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No projects found for &ldquo;{filter}&rdquo;</p>
            </div>
          )}

          {/* ── CTA Back to Home ── */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}>
            <a href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, borderRadius: 99, textDecoration: "none", transition: "all .2s ease", background: "transparent", border: "2px solid #2563eb", color: "#2563eb", fontSize: ".95rem", padding: "14px 36px", fontFamily: F.body, lineHeight: 1, letterSpacing: ".02em" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2563eb"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to Home
            </a>
          </div>
        </Container>

        <style>{`
          .proj-outer {
            display: flex;
            justify-content: center;
          }
          .proj-grid {
            display: grid;
            grid-template-columns: repeat(3, 360px);
            gap: 28px;
            justify-items: center;
          }
          .proj-card-wrap {
            width: 360px;
            display: flex;
            flex-direction: column;
          }
          .proj-card-wrap > div {
            flex: 1;
          }
          @media (max-width: 1160px) {
            .proj-grid { grid-template-columns: repeat(2, 360px); }
          }
          @media (max-width: 780px) {
            .proj-outer { padding: 0 16px; }
            .proj-grid { grid-template-columns: 1fr; width: 100%; }
            .proj-card-wrap { width: 100%; }
          }
        `}</style>
      </section>
    </main>
  );
}