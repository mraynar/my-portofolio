import {
  T, F, BORDER, SECTION_PX,
  Container, Reveal, DotsGrid, Star4, FloatDot, DiamondShape, RingShape,
  ExpCard,
} from "./components";
import { EXPERIENCE } from "./data";

export default function ExperiencePage({ dark }) {
  // Urutkan dari tahun terdahulu (ascending)
  const sorted = [...EXPERIENCE].sort((a, b) => {
    const getYear = (str) => parseInt(str?.match(/\d{4}/)?.[0] || "9999");
    return getYear(a.date) - getYear(b.date);
  });

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
              <span style={{ color: "#fff", fontFamily: F.body, fontSize: ".88rem", fontWeight: 600 }}>Experience</span>
            </div>
            <h1 style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(2.6rem,5vw,4.4rem)", letterSpacing: "-2px", lineHeight: 1.08, color: "#fff", marginBottom: "1rem", opacity: 0, animation: "fadeUp .7s .1s forwards" }}>
              MY <span style={{ color: "#fbbf24" }}>EXPERIENCE</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: "1.05rem", fontFamily: F.body, lineHeight: 1.75, maxWidth: 520, opacity: 0, animation: "fadeUp .7s .25s forwards" }}>
              A complete record of my professional roles, internships, and organizational contributions throughout my journey.
            </p>
            <div style={{ display: "flex", gap: 20, marginTop: "2rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp .7s .4s forwards" }}>
              {[[EXPERIENCE.length, "Experiences"], ["2022", "Since"], ["Now", "Active"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,.15)", borderRadius: 14, padding: ".7rem 1.3rem", backdropFilter: "blur(8px)" }}>
                  <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: "1.6rem", color: "#fff", display: "block", lineHeight: 1.2 }}>{n}</span>
                  <span style={{ color: "rgba(255,255,255,.8)", fontSize: ".72rem", fontFamily: F.body, letterSpacing: ".04em" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CONTENT ── */}
      <section className="relative overflow-hidden" style={{ background: T.bg(dark), paddingTop: "80px", paddingBottom: "120px" }}>

        {/* Layers */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: dark ? "radial-gradient(circle, rgba(37,99,235,0.35) 1.5px, transparent 1.5px)" : "radial-gradient(circle, rgba(37,99,235,0.18) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", zIndex: 0 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: dark ? "linear-gradient(rgba(37,99,235,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.15) 1px,transparent 1px)" : "linear-gradient(rgba(37,99,235,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.09) 1px,transparent 1px)", backgroundSize: "80px 80px", zIndex: 0 }} />
        <div className="absolute pointer-events-none" style={{ inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 600, height: 600, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)" : "radial-gradient(circle, rgba(37,99,235,.09) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(99,102,241,.16) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "38%", left: "38%", width: 400, height: 400, borderRadius: "50%", background: dark ? "radial-gradient(circle, rgba(251,191,36,.07) 0%, transparent 70%)" : "radial-gradient(circle, rgba(251,191,36,.04) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: dark ? 0.04 : 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "180px 180px" }} />

        {/* Ornamen */}
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
        <FloatDot size={8} color="#fbbf24" style={{ bottom: "30%", left: "22%", animationDelay: "-2.1s", zIndex: 1, opacity: 0.5 }} />
        <FloatDot size={11} color="#2563eb" style={{ bottom: "15%", right: "18%", animationDelay: "-4.5s", zIndex: 1, opacity: 0.4 }} />
        <Star4 size={18} fill="#fbbf24" opacity={0.55} style={{ top: "42%", right: "3%", zIndex: 1, animationDelay: "-1s" }} />
        <Star4 size={14} fill="#2563eb" opacity={0.45} style={{ bottom: "35%", left: "6%", zIndex: 1, animationDelay: "-5s" }} />
        <Star4 size={16} fill="#3b82f6" opacity={0.4} style={{ top: "68%", right: "8%", zIndex: 1, animationDelay: "-2.5s" }} />
        <RingShape size={50} color="#2563eb" opacity={0.12} strokeW={2} style={{ top: "48%", left: "2%", zIndex: 1 }} />
        <RingShape size={40} color="#fbbf24" opacity={0.18} strokeW={2} style={{ top: "15%", right: "2%", zIndex: 1 }} />
        <DiamondShape size={14} color="#fbbf24" opacity={0.35} style={{ top: "75%", right: "5%", zIndex: 1 }} />
        <DiamondShape size={12} color="#2563eb" opacity={0.3} style={{ top: "35%", left: "3%", zIndex: 1 }} />

        <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>

          {/* Section header */}
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "4rem" }}>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 20px rgba(37,99,235,.45)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2.2rem)", letterSpacing: "-.4px", color: T.text(dark), lineHeight: 1.18 }}>
                  My <span style={{ color: "#2563eb" }}>Journey</span>
                </h2>
                <p style={{ fontFamily: F.body, fontSize: ".9rem", color: T.text3(dark), marginTop: ".25rem" }}>
                  From the beginning — chronological order
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── DESKTOP: Timeline zigzag ── */}
          <div className="exp-desktop">
            {/* Center spine */}
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: dark ? "linear-gradient(to bottom, transparent, rgba(37,99,235,.5) 8%, rgba(37,99,235,.5) 92%, transparent)" : "linear-gradient(to bottom, transparent, rgba(37,99,235,.25) 8%, rgba(37,99,235,.25) 92%, transparent)", zIndex: 0 }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {sorted.map((c, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={c.title + c.org} delay={i * 100}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: i < sorted.length - 1 ? "3.5rem" : 0, flexDirection: isLeft ? "row" : "row-reverse" }}>

                      {/* Card side */}
                      <div style={{ flex: 1, paddingRight: isLeft ? "3rem" : 0, paddingLeft: isLeft ? 0 : "3rem" }}>
                        <ExpCard c={c} dark={dark} />
                      </div>

                      {/* Center node */}
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                        {/* Year badge */}
                        <div style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 99, padding: "6px 16px", marginBottom: 10, boxShadow: dark ? "0 0 20px rgba(37,99,235,.6), 0 4px 12px rgba(37,99,235,.4)" : "0 4px 16px rgba(37,99,235,.4)" }}>
                          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: ".78rem", color: "#fff", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
                            {c.date.match(/\d{4}/)?.[0]}
                          </span>
                        </div>
                        {/* Node dot */}
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#2563eb", border: `3px solid ${dark ? "#060d1f" : "#fff"}`, boxShadow: dark ? "0 0 0 3px rgba(37,99,235,.5), 0 0 20px rgba(37,99,235,.6)" : "0 0 0 3px rgba(37,99,235,.3)", position: "relative", zIndex: 2 }} />
                        {/* Connector line to card */}
                        <div style={{ width: 40, height: 2, background: dark ? "rgba(37,99,235,.4)" : "rgba(37,99,235,.2)", position: "absolute", [isLeft ? "right" : "left"]: "50%", marginTop: -1 }} />
                        {/* Arrow down between items */}
                        {i < sorted.length - 1 && (
                          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                            {[0, 1, 2].map((j) => (
                              <div key={j} style={{ width: 2, height: 8, borderRadius: 99, background: dark ? `rgba(37,99,235,${0.6 - j * 0.15})` : `rgba(37,99,235,${0.35 - j * 0.08})` }} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Empty opposite side */}
                      <div style={{ flex: 1 }} />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE: Vertical timeline with arrow connectors ── */}
          <div className="exp-mobile">
            {sorted.map((c, i) => (
              <div key={c.title + c.org}>
                <Reveal delay={i * 80}>
                  <div style={{ display: "flex", gap: 0 }}>
                    {/* Left spine + node */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16, flexShrink: 0 }}>
                      {/* Top line (skip for first) */}
                      {i > 0 && <div style={{ width: 2, height: 16, background: dark ? "rgba(37,99,235,.4)" : "rgba(37,99,235,.2)", marginBottom: 0 }} />}
                      {/* Year + node */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 99, padding: "4px 10px", marginBottom: 6, boxShadow: dark ? "0 0 16px rgba(37,99,235,.5)" : "0 4px 12px rgba(37,99,235,.35)" }}>
                          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: ".68rem", color: "#fff", letterSpacing: ".05em", whiteSpace: "nowrap" }}>
                            {c.date.match(/\d{4}/)?.[0]}
                          </span>
                        </div>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#2563eb", border: `2.5px solid ${dark ? "#060d1f" : "#fff"}`, boxShadow: dark ? "0 0 0 2px rgba(37,99,235,.5), 0 0 16px rgba(37,99,235,.5)" : "0 0 0 2px rgba(37,99,235,.3)", flexShrink: 0 }} />
                      </div>
                      {/* Bottom spine + arrow (skip for last) */}
                      {i < sorted.length - 1 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minHeight: 32, marginTop: 4 }}>
                          <div style={{ width: 2, flex: 1, background: dark ? "linear-gradient(to bottom, rgba(37,99,235,.5), rgba(37,99,235,.15))" : "linear-gradient(to bottom, rgba(37,99,235,.25), rgba(37,99,235,.06))" }} />
                          {/* Chevron arrow */}
                          <svg width="14" height="10" viewBox="0 0 14 10" style={{ marginTop: 2, flexShrink: 0 }}>
                            <path d="M1 1l6 7 6-7" stroke={dark ? "rgba(37,99,235,.7)" : "rgba(37,99,235,.45)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <div style={{ flex: 1, paddingBottom: i < sorted.length - 1 ? "1.5rem" : 0 }}>
                      <ExpCard c={c} dark={dark} />
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          {/* CTA back */}
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
          /* Desktop: zigzag timeline */
          .exp-desktop { display: block; position: relative; }
          .exp-mobile  { display: none; }

          @media (max-width: 768px) {
            .exp-desktop { display: none !important; }
            .exp-mobile  { display: block !important; }
          }
        `}</style>
      </section>
    </main>
  );
}