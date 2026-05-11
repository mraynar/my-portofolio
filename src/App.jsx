import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  T, F, BORDER, SECTION_PX, SECTION_PY, SECTION_MAX_W,
  Container, Reveal, DotsGrid, Star4, FloatDot, DiamondShape, RingShape,
  SectionHeading, ProjectCard, ExpCard, Navbar, Footer, ScrollTopFab, GLOBAL_CSS, useDarkMode,
} from "./components";
import { TECH_STACK, PROJECTS, CERTIFICATIONS, EXPERIENCE } from "./data";
import ProjectPage from "./ProjectPage";
import ExperiencePage from "./ExperiencePage";

/* ─── SCROLL TO TOP ON ROUTE CHANGE ────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ─── TYPING ANIMATION HOOK ─────────────────────────────── */
function useTypingEffect(text, speed = 80, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return [displayed, done];
}

/* ─── HERO ──────────────────────────────────────────────── */
function Hero({ dark }) {
  const [line1] = useTypingEffect("MUHAMMAD", 75, 500);
  const [line2] = useTypingEffect("RAYNAR", 75, 500 + 75 * 8 + 120);
  const [line3, nameDone] = useTypingEffect("HAMMAM", 75, 500 + 75 * 8 + 120 + 75 * 6 + 120);

  const subtitleDelay = "2.3s";
  const btnDelay = "2.6s";

  return (
    <section id="home" className="relative overflow-hidden"
      style={{ height: "100vh", paddingTop: 96, paddingBottom: 0, background: T.bg(dark), display: "flex", alignItems: "center" }}>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(37,99,235,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.12) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

      <DotsGrid cols={9} rows={5} dotColor="#1d4ed8" opacity={0.65} style={{ top: "22%", left: "44%", animation: "popIn .5s .1s cubic-bezier(.34,1.56,.64,1) both" }} />
      <DotsGrid cols={5} rows={3} dotColor="#1d4ed8" opacity={0.55} style={{ bottom: "10%", right: "6%", animation: "popIn .5s .2s cubic-bezier(.34,1.56,.64,1) both" }} />
      <FloatDot size={18} color="#fbbf24" style={{ top: "38%", left: "3%", animationDelay: "-1s", animation: "popIn .55s .15s cubic-bezier(.34,1.56,.64,1) both, floatY 6s 0.7s ease-in-out infinite" }} />
      <FloatDot size={14} color="#2563eb" style={{ bottom: "22%", right: "7%", animation: "popIn .55s .25s cubic-bezier(.34,1.56,.64,1) both, floatY 6s 0.8s ease-in-out infinite" }} />
      <FloatDot size={12} color="#ef4444" style={{ top: "22%", right: "40%", animation: "popIn .5s .18s cubic-bezier(.34,1.56,.64,1) both, floatY 6s 0.7s ease-in-out infinite" }} />
      <Star4 fill="#2563eb" opacity={1} style={{ top: "28%", right: "38%", animation: "popIn .6s .12s cubic-bezier(.34,1.56,.64,1) both, spinStar 10s linear infinite" }} />
      <Star4 size={20} fill="#ef4444" opacity={0.95} style={{ bottom: "26%", left: "36%", animation: "popIn .6s .22s cubic-bezier(.34,1.56,.64,1) both, spinStar 10s linear infinite" }} />
      <Star4 size={22} fill="#1d4ed8" opacity={0.8} style={{ top: "16%", right: "34%", animation: "popIn .6s .08s cubic-bezier(.34,1.56,.64,1) both, spinStar 10s linear infinite" }} />
      <DiamondShape size={24} color="#fbbf24" opacity={0.5} style={{ top: "60%", left: "12%", animation: "popIn .55s .3s cubic-bezier(.34,1.56,.64,1) both" }} />
      <DiamondShape size={16} color="#2563eb" opacity={0.45} style={{ top: "14%", left: "28%", animation: "popIn .5s .05s cubic-bezier(.34,1.56,.64,1) both" }} />
      <RingShape size={80} color="#2563eb" opacity={0.3} strokeW={4} style={{ bottom: "18%", left: "22%", animation: "popIn .7s .28s cubic-bezier(.34,1.56,.64,1) both" }} />
      <RingShape size={50} color="#fbbf24" opacity={0.35} strokeW={3} style={{ top: "36%", right: "18%", animation: "popIn .7s .16s cubic-bezier(.34,1.56,.64,1) both" }} />

      <Container style={{ paddingLeft: SECTION_PX, paddingRight: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0, height: "100%", position: "relative" }}>
        <div style={{ flex: 1, zIndex: 2, maxWidth: 580, paddingRight: "2rem" }}>
          <p className="hero-hi" style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.55rem", color: T.text3(dark), marginBottom: ".5rem", lineHeight: 1.3, letterSpacing: "-.01em", opacity: 0, animation: "fadeUp .8s .2s forwards", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#2563eb", flexShrink: 0 }} />
            Hi I&apos;m
          </p>

          <h1 style={{ fontFamily: F.display, fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-2px", color: "#2563eb", marginBottom: "1rem", opacity: 0, animation: "fadeUp .6s .38s forwards" }}>
            {line1 || <span style={{ opacity: 0 }}>M</span>}
            <br />
            <span style={{ color: T.text(dark) }}>{line2 || <span style={{ opacity: 0 }}>R</span>}</span>
            <br />
            {line3 || <span style={{ opacity: 0 }}>H</span>}
            {!nameDone && <span style={{ display: "inline-block", width: "3px", height: "0.85em", background: "#2563eb", marginLeft: 4, verticalAlign: "middle", animation: "cursorBlink .7s steps(1) infinite", borderRadius: 2 }} />}
          </h1>

          <p style={{
            fontSize: ".88rem", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase",
            color: T.text3(dark), marginBottom: "2.4rem", lineHeight: 1.6, fontFamily: F.body,
            opacity: 0,
            animation: `slideInLeft .7s ${subtitleDelay} cubic-bezier(.22,.68,0,1.2) forwards`,
          }}>
            Information Systems Student &amp; Developer
          </p>

          <div style={{ opacity: 0, animation: `fadeUp .8s ${btnDelay} forwards`, display: "inline-block" }}>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-3 no-underline rounded-full transition-all duration-200 hover:-translate-y-1"
              style={{ background: "#2563eb", color: "#fff", fontFamily: F.body, fontWeight: 700, fontSize: "1.1rem", padding: "20px 44px", boxShadow: "0 8px 36px rgba(37,99,235,.55)", lineHeight: 1, letterSpacing: ".02em" }}>
              Explore My Journey
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        {/* Photo */}
        <div className="hero-photo-wrapper" style={{
          opacity: 0,
          // GANTI:
          opacity: 1,
          position: "relative", flexShrink: 0, alignSelf: "flex-end",
        }}>
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "130%", height: "68%", background: "#3b82f6", borderRadius: "50% 50% 0 0 / 38% 38% 0 0", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "145%", height: "73%", borderRadius: "50% 50% 0 0 / 38% 38% 0 0", border: "2px solid rgba(147,197,253,0.55)", zIndex: 0 }} />
          <FloatDot size={16} color="#fbbf24" style={{ bottom: "62%", left: "-2%", animationDelay: "-1s", zIndex: 3 }} />
          <FloatDot size={11} color="#1d4ed8" style={{ bottom: "68%", right: "-4%", animationDelay: "-2.5s", zIndex: 3 }} />
          <img src="/images/about/Profile Utama.PNG" alt="Muhammad Raynar Hammam"
            style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", zIndex: 2, height: "77vh", width: "auto", maxWidth: "none" }} />
        </div>
      </Container>

      <style>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-56px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(80px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPhotoIn {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0) translateY(10px); }
          70%  { transform: scale(1.18) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────── */
function About({ dark }) {
  const educations = [
    { period: "2024 – Present", degree: "Bachelor of Information Systems", school: 'UPN "Veteran" Jawa Timur', note: "Currently Active", current: true },
    { period: "2021 – 2024", degree: "Software Engineering", school: "SMKN 2 Surabaya", note: "Graduated with Honors", current: false },
  ];

  return (
    <section id="about" className="relative overflow-hidden"
      style={{ background: "#2563eb", paddingTop: SECTION_PY, paddingBottom: 0, scrollMarginTop: "80px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", zIndex: 0 }} />
      <DotsGrid cols={9} rows={4} dotColor="#fff" opacity={0.35} style={{ top: "4%", left: "1%", zIndex: 1 }} />
      <DotsGrid cols={6} rows={3} dotColor="#fff" opacity={0.28} style={{ top: "5%", right: "2%", zIndex: 1 }} />
      <DotsGrid cols={5} rows={2} dotColor="#fff" opacity={0.22} style={{ bottom: "22%", left: "3%", zIndex: 1 }} />
      <DotsGrid cols={7} rows={3} dotColor="#fff" opacity={0.25} style={{ bottom: "18%", right: "3%", zIndex: 1 }} />
      <Star4 size={34} fill="rgba(255,255,255,.95)" opacity={1} style={{ top: "7%", right: "5%", zIndex: 1 }} />
      <Star4 size={22} fill="rgba(255,255,255,.80)" opacity={1} style={{ top: "12%", left: "18%", zIndex: 1, animationDelay: "-2s" }} />
      <Star4 size={18} fill="rgba(255,255,255,.70)" opacity={1} style={{ bottom: "28%", left: "2%", zIndex: 1, animationDelay: "-4s" }} />
      <Star4 size={26} fill="#fbbf24" opacity={0.9} style={{ bottom: "30%", right: "6%", zIndex: 1, animationDelay: "-1s" }} />
      <FloatDot size={18} color="#fbbf24" style={{ top: "18%", right: "10%", animationDelay: "-1.5s", zIndex: 1 }} />
      <FloatDot size={13} color="#fff" style={{ top: "35%", left: "5%", animationDelay: "-3s", zIndex: 1 }} />
      <DiamondShape size={28} color="#fff" opacity={0.22} style={{ top: "14%", left: "32%", zIndex: 1 }} />
      <DiamondShape size={20} color="#fbbf24" opacity={0.45} style={{ top: "38%", right: "3%", zIndex: 1 }} />
      <RingShape size={140} color="#fff" opacity={0.12} strokeW={4} style={{ top: "-40px", left: "35%", zIndex: 1 }} />
      <RingShape size={60} color="#fbbf24" opacity={0.3} strokeW={3} style={{ bottom: "28%", right: "22%", zIndex: 1 }} />

      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
        <div className="about-wrap" style={{ position: "relative" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <Reveal delay={80}>
              <div className="about-card" style={{ background: dark ? "#0d1b3e" : "#f3f6fc", borderRadius: 28, padding: "2.6rem 2.8rem", boxShadow: dark ? "0 20px 60px rgba(0,0,0,.5),0 4px 16px rgba(0,0,0,.3)" : "0 20px 60px rgba(0,0,0,.22),0 4px 16px rgba(0,0,0,.1)", boxSizing: "border-box", height: "100%", border: dark ? "1px solid rgba(59,130,246,.2)" : "none" }}>
                <h2 style={{ fontFamily: F.display, fontSize: "1.75rem", fontWeight: 800, color: "#2563eb", letterSpacing: "-.4px", lineHeight: 1.18 }}>ABOUT ME</h2>
                <div style={{ width: 44, height: 4, background: "#3b82f6", borderRadius: 99, margin: "12px 0 20px" }} />
                <p style={{ fontSize: ".97rem", lineHeight: 1.85, color: dark ? "#c3d8ff" : "#1e293b", marginBottom: "1rem", fontFamily: F.body }}>
                  I&apos;m <strong style={{ color: "#1d4ed8", fontWeight: 700 }}>Muhammad Raynar Hammam</strong>, an Information Systems student at <strong style={{ color: "#1d4ed8", fontWeight: 700 }}>UPN &ldquo;Veteran&rdquo; Jawa Timur</strong> with solid experience in web development.
                </p>
                <p style={{ fontSize: ".97rem", lineHeight: 1.85, color: dark ? "#c3d8ff" : "#1e293b", fontFamily: F.body, marginBottom: "1.8rem" }}>
                  Currently expanding into <span style={{ color: dark ? "#93c5fd" : "#1d4ed8", fontWeight: 600 }}>mobile and iOS development</span> and <span style={{ color: dark ? "#93c5fd" : "#1d4ed8", fontWeight: 600 }}>data</span>, while also having experience growing an online business through social media.
                </p>      
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, background: dark ? "rgba(37,99,235,.25)" : "rgba(37,99,235,.09)", borderRadius: 16, padding: "1.3rem", border: dark ? "1px solid rgba(59,130,246,.2)" : "none" }}>
                  {[["10+", "Projects"], ["5+", "Organizations"], ["10+", "Certifications"]].map(([n, l]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: F.display, fontSize: "1.65rem", fontWeight: 800, color: dark ? "#60a5fa" : "#2563eb", display: "block", lineHeight: 1.2 }}>{n}</span>
                      <span style={{ fontSize: ".76rem", color: dark ? "#93afd8" : "#6b7280", fontWeight: 500, letterSpacing: ".04em", fontFamily: F.body }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="about-card" style={{ background: dark ? "#0d1b3e" : "#f3f6fc", borderRadius: 28, padding: "2.6rem 2.8rem", boxShadow: dark ? "0 20px 60px rgba(0,0,0,.5)" : "0 20px 60px rgba(0,0,0,.22)", boxSizing: "border-box", height: "100%", border: dark ? "1px solid rgba(59,130,246,.2)" : "none" }}>
                <h2 style={{ fontFamily: F.display, fontSize: "1.75rem", fontWeight: 800, color: dark ? "#60a5fa" : "#2563eb", letterSpacing: "-.4px", lineHeight: 1.18 }}>EDUCATION</h2>
                <div style={{ width: 44, height: 4, background: "#3b82f6", borderRadius: 99, margin: "12px 0 28px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {educations.map((edu, i) => (
                    <div key={edu.school} style={{ display: "flex", gap: 18, paddingBottom: i < educations.length - 1 ? "2.4rem" : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: edu.current ? "linear-gradient(135deg,#2563eb,#60a5fa)" : "linear-gradient(135deg,#1e40af,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: edu.current ? "0 4px 16px rgba(37,99,235,.55)" : "0 4px 12px rgba(37,99,235,.3)", flexShrink: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                        </div>
                        {i < educations.length - 1 && <div style={{ width: 2, flex: 1, background: dark ? "linear-gradient(to bottom,rgba(96,165,250,.5),rgba(96,165,250,.08))" : "linear-gradient(to bottom,rgba(37,99,235,.4),rgba(37,99,235,.08))", marginTop: 6, borderRadius: 99, minHeight: 48 }} />}
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <span style={{ fontSize: ".78rem", fontWeight: 700, color: edu.current ? (dark ? "#60a5fa" : "#2563eb") : (dark ? "#93c5fd" : "#3b82f6"), fontFamily: F.body, letterSpacing: ".04em", display: "block", marginBottom: 5 }}>{edu.period}</span>
                        <h4 style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1.02rem", color: dark ? "#e8f1ff" : "#0f1f4f", lineHeight: 1.3, marginBottom: 4 }}>{edu.degree}</h4>
                        <p style={{ fontSize: ".88rem", color: dark ? "#c3d8ff" : "#374151", fontFamily: F.body, lineHeight: 1.6, marginBottom: 4 }}>{edu.school}</p>
                        <span style={{ fontSize: ".78rem", color: dark ? "#93afd8" : "#6b7280", fontFamily: F.body, fontStyle: "italic" }}>{edu.note}</span>
                        {edu.current && (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: ".68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: dark ? "rgba(96,165,250,.2)" : "rgba(37,99,235,.12)", color: dark ? "#93c5fd" : "#1d4ed8", fontFamily: F.body, letterSpacing: ".05em", textTransform: "uppercase", border: dark ? "1px solid rgba(96,165,250,.3)" : "none" }}>● Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="about-photo-center" aria-hidden="true">
            <img src="/images/about/Profile Kedua.PNG" alt=""
              className="about-photo-img"
              style={{ display: "block", height: "420px", width: "auto", objectFit: "contain", objectPosition: "bottom center", userSelect: "none", pointerEvents: "none", filter: "drop-shadow(-6px 0 20px rgba(0,0,0,.3)) drop-shadow(6px 0 20px rgba(0,0,0,.25))" }} />
          </div>
        </div>
      </Container>

      <style>{`
        @media (min-width: 900px) {
          .about-grid { grid-template-columns: 1fr 1fr !important; align-items: stretch !important; padding-bottom: 200px !important; }
          .about-grid > div, .about-card { height: 100% !important; }
          .about-photo-center { display: block !important; position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; bottom: 0 !important; z-index: 20 !important; pointer-events: none !important; }
          .about-photo-img {
            opacity: 0;
            animation: slideInBottom .9s .3s cubic-bezier(.22,.68,0,1.1) forwards;
          }
        }
        @media (max-width: 899px) {
          .about-photo-center { display: none !important; }
          .about-grid { padding-bottom: 0 !important; }
          #about { padding-bottom: ${SECTION_PY} !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── SKILLS ────────────────────────────────────────────── */
function Skills({ dark }) {
  return (
    <section id="skills" className="relative overflow-hidden"
      style={{ background: T.bg(dark), paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(37,99,235,${dark ? ".14" : ".08"}) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,${dark ? ".14" : ".08"}) 1px,transparent 1px)`,
        backgroundSize: "40px 40px", zIndex: 0,
      }} />
      <div className="absolute pointer-events-none" style={{ top: "0%", right: "0%", width: 480, height: 480, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(37,99,235,.22) 0%,transparent 70%)" : "radial-gradient(circle,rgba(37,99,235,.11) 0%,transparent 70%)", filter: "blur(48px)", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "0%", left: "0%", width: 360, height: 360, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)" : "radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)", filter: "blur(44px)", zIndex: 0 }} />
      <DotsGrid cols={8} rows={4} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.6} style={{ top: "6%", right: "2%", zIndex: 1 }} />
      <DotsGrid cols={6} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.45} style={{ top: "8%", left: "2%", zIndex: 1 }} />
      <DotsGrid cols={5} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.35} style={{ bottom: "8%", left: "30%", zIndex: 1 }} />
      <Star4 size={28} fill="#2563eb" opacity={0.85} style={{ top: "10%", left: "6%", zIndex: 1 }} />
      <Star4 size={20} fill="#fbbf24" opacity={0.75} style={{ top: "8%", right: "10%", zIndex: 1, animationDelay: "-2s" }} />
      <Star4 size={16} fill="#2563eb" opacity={0.65} style={{ bottom: "14%", right: "8%", zIndex: 1, animationDelay: "-4s" }} />
      <DiamondShape size={28} color="#fbbf24" opacity={0.4} style={{ bottom: "12%", left: "5%", zIndex: 1 }} />
      <DiamondShape size={18} color="#2563eb" opacity={0.3} style={{ top: "18%", right: "22%", zIndex: 1 }} />
      <RingShape size={90} color="#2563eb" opacity={0.22} strokeW={4} style={{ bottom: "6%", right: "8%", zIndex: 1 }} />
      <RingShape size={60} color="#fbbf24" opacity={0.25} strokeW={3} style={{ top: "16%", left: "16%", zIndex: 1 }} />
      <FloatDot size={14} color="#2563eb" style={{ top: "30%", right: "5%", animationDelay: "-1.5s", zIndex: 1 }} />
      <FloatDot size={10} color="#fbbf24" style={{ bottom: "28%", left: "8%", animationDelay: "-3.2s", zIndex: 1 }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: dark ? 0.18 : 0.1 }} preserveAspectRatio="none">
        <line x1="0%" y1="25%" x2="100%" y2="75%" stroke="#2563eb" strokeWidth="1" strokeDasharray="6 8" />
        <line x1="0%" y1="75%" x2="100%" y2="25%" stroke="#2563eb" strokeWidth="1" strokeDasharray="6 8" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 10" />
      </svg>
      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
        <SectionHeading title="TECH" accent="STACK" subtitle="Technologies and tools I work with" dark={dark} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="skills-grid">
          {TECH_STACK.map((t, i) => (
            <Reveal key={t.name} delay={(i % 6) * 60}>
              <div className="tech-card"
                style={{ background: T.card(dark), border: `1.5px solid ${BORDER}`, borderRadius: 18, padding: "1.4rem 0.8rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", cursor: "default", transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(37,99,235,.25)"; e.currentTarget.style.borderColor = "rgba(37,99,235,.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = BORDER; }}>
                <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(255,255,255,.07)" : "rgba(37,99,235,.06)", borderRadius: 12, padding: 10, flexShrink: 0 }}>
                  <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.innerHTML = `<span style="font-size:1.1rem;font-weight:700;color:#2563eb;">${t.name.slice(0, 2).toUpperCase()}</span>`; }} />
                </div>
                <span style={{ fontSize: ".8rem", fontWeight: 600, color: T.text2(dark), fontFamily: F.body, lineHeight: 1.4, textAlign: "center" }}>{t.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
      <style>{`
        @media (min-width: 768px) {
          .skills-grid { grid-template-columns: repeat(6, 1fr) !important; gap: 20px !important; }
          .tech-card { padding: 1.8rem 1rem !important; }
          .tech-card > div:first-child { width: 64px !important; height: 64px !important; }
          .tech-card span { font-size: .88rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── PROJECTS PREVIEW ───────────────────────────────────── */
const PROJ_BG = (dark) => dark ? "#0d1b3e" : "#e2e8f8";

function ProjectsPreview({ dark }) {
  const featured = PROJECTS.filter((p) => p.featured);
  return (
    <section id="projects" className="relative overflow-hidden"
      style={{ background: PROJ_BG(dark), paddingTop: "160px", paddingBottom: "160px", scrollMarginTop: "80px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: dark ? "radial-gradient(circle, rgba(37,99,235,0.28) 1.5px, transparent 1.5px)" : "radial-gradient(circle, rgba(37,99,235,0.18) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", zIndex: 0 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: dark ? "linear-gradient(rgba(37,99,235,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.18) 1px,transparent 1px)" : "linear-gradient(rgba(37,99,235,.11) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.11) 1px,transparent 1px)", backgroundSize: "84px 84px", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ top: "-5%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(37,99,235,.22) 0%,transparent 70%)" : "radial-gradient(circle,rgba(37,99,235,.1) 0%,transparent 70%)", filter: "blur(56px)", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "-5%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)" : "radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)", filter: "blur(48px)", zIndex: 0 }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: dark ? 0.2 : 0.12 }} preserveAspectRatio="none">
        <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#2563eb" strokeWidth="1" strokeDasharray="8 12" />
        <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="8 12" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 14" />
      </svg>
      <DotsGrid cols={9} rows={4} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.55} style={{ top: "3%", left: "1%", zIndex: 1 }} />
      <DotsGrid cols={6} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.45} style={{ top: "4%", right: "2%", zIndex: 1 }} />
      <Star4 size={32} fill="#2563eb" opacity={0.9} style={{ top: "5%", right: "5%", zIndex: 1 }} />
      <Star4 size={22} fill="#fbbf24" opacity={0.85} style={{ top: "8%", left: "6%", zIndex: 1, animationDelay: "-2s" }} />
      <Star4 size={26} fill="#fbbf24" opacity={0.8} style={{ bottom: "7%", right: "6%", zIndex: 1, animationDelay: "-1s" }} />
      <FloatDot size={18} color="#2563eb" style={{ top: "12%", right: "12%", animationDelay: "-1s", zIndex: 1 }} />
      <DiamondShape size={28} color="#2563eb" opacity={0.25} style={{ top: "10%", left: "18%", zIndex: 1 }} />
      <RingShape size={130} color="#2563eb" opacity={0.16} strokeW={4} style={{ top: "-50px", left: "32%", zIndex: 1 }} />
      <RingShape size={80} color="#fbbf24" opacity={0.3} strokeW={3} style={{ top: "30%", right: "8%", zIndex: 1 }} />
      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
        <SectionHeading title="FEATURED" accent="PROJECTS" subtitle="A selection of work I'm proud of" dark={dark} />
        <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: "3.5rem" }}>
          {featured.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <ProjectCard p={p} dark={dark} />
            </Reveal>
          ))}
        </div>
        <div className="md:hidden" style={{ marginBottom: "2.8rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {featured.slice(0, 2).map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div style={{ background: T.card(dark), border: "1.5px solid rgba(59,130,246,.2)", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 32px rgba(37,99,235,.12)" }}>
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", background: dark ? "#0d1b3e" : "#1d4ed8" }}>
                    {p.image && <img src={p.image} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />}
                    <span style={{ position: "absolute", top: 10, left: 10, zIndex: 2, fontSize: ".6rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff", background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)", borderRadius: 99, padding: "4px 10px", fontFamily: F.body, lineHeight: 1 }}>{p.label}</span>
                  </div>
                  <div style={{ padding: "1.2rem 1.4rem 1.5rem" }}>
                    <h3 style={{ fontFamily: F.display, fontWeight: 700, fontSize: "1rem", color: T.text(dark), marginBottom: ".4rem", lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: ".87rem", lineHeight: 1.7, color: T.text3(dark), marginBottom: ".9rem", fontFamily: F.body }}>{p.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.badges.map((b) => <span key={b} style={{ fontSize: ".68rem", fontWeight: 600, padding: "4px 11px", borderRadius: 99, background: dark ? "rgba(30,64,175,.35)" : "#e8f1ff", color: dark ? "#c3d8ff" : "#1e40af", border: "1px solid rgba(37,99,235,.3)", fontFamily: F.body }}>{b}</span>)}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a href="/projects"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, borderRadius: 99, textDecoration: "none", transition: "all .2s ease", background: dark ? "transparent" : "#1d4ed8", border: `2px solid ${dark ? "#2563eb" : "#1d4ed8"}`, color: dark ? "#2563eb" : "#ffffff", fontSize: ".95rem", padding: "14px 36px", fontFamily: F.body, lineHeight: 1, letterSpacing: ".02em" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = dark ? "transparent" : "#1d4ed8"; e.currentTarget.style.borderColor = dark ? "#2563eb" : "#1d4ed8"; e.currentTarget.style.color = dark ? "#2563eb" : "#fff"; }}>
            Explore All Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </Container>
    </section>
  );
}

/* ─── EXPERIENCE PREVIEW ─────────────────────────────────── */
function ExperiencePreview({ dark }) {
  const featuredItems = EXPERIENCE.filter((e) => e.featured).slice(0, 2);
  return (
    <section id="experience" className="relative overflow-hidden"
      style={{ background: T.bg(dark), paddingTop: "160px", paddingBottom: "160px" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(37,99,235,${dark ? ".12" : ".07"}) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,${dark ? ".12" : ".07"}) 1px,transparent 1px)`, backgroundSize: "52px 52px", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ top: "20%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(37,99,235,.2) 0%,transparent 70%)" : "radial-gradient(circle,rgba(37,99,235,.09) 0%,transparent 70%)", filter: "blur(48px)", zIndex: 0 }} />
      <DotsGrid cols={5} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.55} style={{ bottom: "8%", right: "3%", zIndex: 1 }} />
      <Star4 size={24} fill="#2563eb" opacity={0.85} style={{ top: "4%", left: "4%", zIndex: 1 }} />
      <Star4 size={20} fill="#fbbf24" opacity={0.8} style={{ bottom: "14%", right: "22%", animationDelay: "-3s", zIndex: 1 }} />
      <DiamondShape size={34} color="#fbbf24" opacity={0.38} style={{ top: "12%", right: "6%", zIndex: 1 }} />
      <RingShape size={110} color="#2563eb" opacity={0.18} strokeW={4} style={{ bottom: "3%", left: "3%", zIndex: 1 }} />
      <FloatDot size={14} color="#2563eb" style={{ top: "40%", left: "3%", animationDelay: "-2s", zIndex: 1 }} />
      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", padding: "2.4rem 2.8rem", position: "relative", overflow: "hidden", marginBottom: "3rem" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
            <Star4 size={22} fill="rgba(255,255,255,.5)" style={{ top: "12%", right: "3%", position: "absolute" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ fontFamily: F.display, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-.4px", lineHeight: 1.18, marginBottom: ".5rem" }}>EXPERIENCE</h2>
                <p style={{ opacity: 0.82, fontSize: ".92rem", fontFamily: F.body, lineHeight: 1.7, maxWidth: 360 }}>A collection of my professional journey and contributions.</p>
              </div>
              <div className="exp-stats" style={{ display: "flex", gap: 10, flexWrap: "nowrap" }}>
                {[["4+", "Organizations"], ["3+", "Projects"], ["2022", "Since"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,.18)", borderRadius: 16, padding: ".75rem 1rem", backdropFilter: "blur(8px)", flex: "0 0 auto" }}>
                    <span style={{ fontFamily: F.display, fontWeight: 800, display: "block", lineHeight: 1.2, fontSize: "clamp(1.1rem, 3vw, 1.8rem)" }}>{n}</span>
                    <span style={{ opacity: 0.85, fontFamily: F.body, lineHeight: 1.4, fontSize: "clamp(.58rem, 1.5vw, .76rem)", whiteSpace: "nowrap" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginBottom: "3.5rem" }}>
          {(featuredItems.length > 0 ? featuredItems : EXPERIENCE.slice(0, 2)).map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <ExpCard c={c} dark={dark} />
            </Reveal>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a href="/experience"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, borderRadius: 99, textDecoration: "none", transition: "all .2s ease", background: "transparent", border: "2px solid #2563eb", color: "#2563eb", fontSize: ".95rem", padding: "14px 36px", fontFamily: F.body, lineHeight: 1, letterSpacing: ".02em" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2563eb"; }}>
            Explore More Experience
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </Container>
      <style>{`
        @media (max-width: 640px) {
          .exp-stats { width: 100%; justify-content: flex-start; }
          .exp-stats > div { padding: .6rem .75rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── CERTIFICATIONS ─────────────────────────────────────── */
const CERT_SECTION_BG = (dark) => (dark ? "#0d1b3e" : "#e2e8f8");

const PROVIDER_CONFIG = {
  Coursera: { color: "#0056d3", label: "Coursera" },
  Dicoding: { color: "#4f46e5", label: "Dicoding" },
  Udemy:    { color: "#a435f0", label: "Udemy" },
};

function CertificationCard({ cert, dark }) {
  const cfg = PROVIDER_CONFIG[cert.provider] || { color: "#2563eb", label: cert.provider };

  return (
    <div
      style={{
        flex: "0 0 300px",
        width: 300,
        background: dark ? "#0d1b3e" : "#ffffff",
        border: `1.5px solid ${dark ? "rgba(59,130,246,.25)" : "rgba(37,99,235,.15)"}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .32s ease, box-shadow .32s ease, border-color .32s ease",
        boxShadow: dark
          ? "0 0 0 1px rgba(59,130,246,.15), 0 4px 20px rgba(37,99,235,.12)"
          : "0 4px 16px rgba(37,99,235,.07)",
        scrollSnapAlign: "start",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.borderColor = cfg.color;
        e.currentTarget.style.boxShadow = dark
          ? `0 0 0 1.5px ${cfg.color}, 0 0 40px ${cfg.color}55, 0 20px 48px rgba(37,99,235,.3)`
          : `0 0 0 1.5px ${cfg.color}55, 0 20px 48px ${cfg.color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = dark ? "rgba(59,130,246,.25)" : "rgba(37,99,235,.15)";
        e.currentTarget.style.boxShadow = dark
          ? "0 0 0 1px rgba(59,130,246,.15), 0 4px 20px rgba(37,99,235,.12)"
          : "0 4px 16px rgba(37,99,235,.07)";
      }}
    >
      {/* Image thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "60%",
          background: dark ? "#0a1628" : "#dbeafe",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={cert.image}
          alt={cert.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            display: "block",
          }}
          onError={(e) => {
            const parent = e.currentTarget.parentElement;
            e.currentTarget.style.display = "none";
            parent.style.background = `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}11)`;
            const fb = document.createElement("div");
            fb.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px";
            fb.innerHTML = `<span style="font-size:2rem">🎓</span><span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:.95rem;font-weight:800;color:${cfg.color};letter-spacing:-0.5px">${cert.provider}</span>`;
            parent.appendChild(fb);
          }}
        />
        {/* Provider badge */}
        <span
          style={{
            position: "absolute", top: 10, left: 10, zIndex: 2,
            fontSize: ".6rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
            color: "#fff", background: cfg.color, borderRadius: 99,
            padding: "4px 10px", fontFamily: F.body, lineHeight: 1,
            boxShadow: `0 2px 10px ${cfg.color}88`,
          }}
        >
          {cert.provider}
        </span>
        {/* Connector dot */}
        <div
          style={{
            position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%", background: cfg.color,
            border: `3px solid ${dark ? "#0d1b3e" : "#fff"}`,
            boxShadow: `0 0 12px ${cfg.color}99`, zIndex: 3,
          }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: "1.4rem 1.4rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h4
          style={{
            fontFamily: F.display, fontWeight: 700, fontSize: ".93rem",
            color: T.text(dark), lineHeight: 1.4, marginBottom: ".35rem",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
        >
          {cert.title}
        </h4>
        <p style={{ fontSize: ".78rem", color: cfg.color, fontWeight: 600, fontFamily: F.body, marginBottom: ".25rem" }}>
          {cert.issuer}
        </p>
        <p style={{ fontSize: ".72rem", color: T.text3(dark), fontFamily: F.body, marginBottom: "1rem" }}>
          {cert.date}
        </p>

        {/* Credential ID */}
        <div
          style={{
            background: dark ? "rgba(37,99,235,.12)" : "rgba(37,99,235,.06)",
            border: `1px solid ${dark ? "rgba(59,130,246,.2)" : "rgba(37,99,235,.12)"}`,
            borderRadius: 10, padding: ".45rem .7rem", marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: ".62rem", color: T.text3(dark), fontFamily: F.body, display: "block", letterSpacing: ".04em", marginBottom: 2 }}>
            CREDENTIAL ID
          </span>
          <span style={{ fontSize: ".68rem", fontWeight: 600, color: dark ? "#93c5fd" : "#1d4ed8", fontFamily: "monospace", wordBreak: "break-all" }}>
            {cert.credentialId}
          </span>
        </div>

        {/* Show Credential button */}
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            textDecoration: "none", borderRadius: 12, padding: "10px 14px",
            background: cfg.color, color: "#fff",
            fontFamily: F.body, fontWeight: 700, fontSize: ".8rem", lineHeight: 1, letterSpacing: ".03em",
            boxShadow: `0 4px 16px ${cfg.color}55`,
            transition: "transform .2s ease, box-shadow .2s ease",
            marginTop: "auto",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}77`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}55`; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Show Credential
        </a>
      </div>
    </div>
  );
}

function Certifications({ dark }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section
      id="certifications"
      className="relative overflow-hidden"
      style={{ background: CERT_SECTION_BG(dark), paddingTop: SECTION_PY, paddingBottom: SECTION_PY }}
    >
      {/* Background dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: dark
          ? "radial-gradient(circle, rgba(37,99,235,0.28) 1.5px, transparent 1.5px)"
          : "radial-gradient(circle, rgba(37,99,235,0.18) 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px", zIndex: 0,
      }} />
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: dark
          ? "linear-gradient(rgba(37,99,235,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.18) 1px,transparent 1px)"
          : "linear-gradient(rgba(37,99,235,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.12) 1px,transparent 1px)",
        backgroundSize: "84px 84px", zIndex: 0,
      }} />
      {/* Glow blobs */}
      <div className="absolute pointer-events-none" style={{ top: "-5%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(37,99,235,.22) 0%,transparent 70%)" : "radial-gradient(circle,rgba(37,99,235,.1) 0%,transparent 70%)", filter: "blur(52px)", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: "0%", left: "0%", width: 360, height: 360, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(79,70,229,.15) 0%,transparent 70%)" : "radial-gradient(circle,rgba(79,70,229,.06) 0%,transparent 70%)", filter: "blur(44px)", zIndex: 0 }} />

      {/* Decorative elements */}
      <DotsGrid cols={6} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.5} style={{ top: "6%", right: "2%", zIndex: 1 }} />
      <Star4 size={28} fill="#2563eb" opacity={0.8} style={{ bottom: "10%", left: "5%", zIndex: 1 }} />
      <Star4 size={20} fill="#fbbf24" opacity={0.7} style={{ top: "8%", left: "12%", zIndex: 1, animationDelay: "-2s" }} />
      <RingShape size={80} color="#2563eb" opacity={0.2} strokeW={4} style={{ top: "10%", left: "2%", zIndex: 1 }} />
      <DiamondShape size={26} color="#4f46e5" opacity={0.28} style={{ bottom: "14%", right: "6%", zIndex: 1 }} />
      <FloatDot size={12} color="#2563eb" style={{ top: "35%", right: "4%", animationDelay: "-1.5s", zIndex: 1 }} />

      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>

        {/* ── Header: left-aligned + scroll arrows ── */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.8rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              {/* Sub-label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".6rem" }}>
                <span style={{ display: "inline-block", width: 32, height: 3, borderRadius: 99, background: "#2563eb" }} />
                <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: ".8rem", letterSpacing: ".14em", textTransform: "uppercase", color: T.text3(dark) }}>
                  My Credentials
                </span>
              </div>
              <h2 style={{
                fontFamily: F.display, fontWeight: 800,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                letterSpacing: "-.6px", color: T.text(dark), lineHeight: 1.15, marginBottom: ".5rem",
              }}>
                Certification <span style={{ color: "#2563eb" }}>Skills</span>
              </h2>
              <p style={{ color: T.text3(dark), fontSize: ".95rem", fontFamily: F.body, lineHeight: 1.7, maxWidth: 480 }}>
                Professional credentials validating my technical expertise across multiple platforms.
              </p>
            </div>

            {/* Arrow buttons */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {[{ dir: -1, label: "←" }, { dir: 1, label: "→" }].map(({ dir, label }) => (
                <button
                  key={dir}
                  onClick={() => scrollBy(dir)}
                  aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    border: `2px solid ${dark ? "rgba(59,130,246,.35)" : "rgba(37,99,235,.25)"}`,
                    background: dark ? "rgba(37,99,235,.15)" : "rgba(37,99,235,.07)",
                    color: dark ? "#93c5fd" : "#2563eb",
                    cursor: "pointer", fontSize: "1.1rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#2563eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = dark ? "rgba(37,99,235,.15)" : "rgba(37,99,235,.07)"; e.currentTarget.style.color = dark ? "#93c5fd" : "#2563eb"; e.currentTarget.style.borderColor = dark ? "rgba(59,130,246,.35)" : "rgba(37,99,235,.25)"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Carousel track ── */}
        <div style={{ position: "relative" }}>
          {/* Left fade edge */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, background: `linear-gradient(to right, ${CERT_SECTION_BG(dark)}, transparent)`, zIndex: 4, pointerEvents: "none" }} />
          {/* Right fade edge */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: `linear-gradient(to left, ${CERT_SECTION_BG(dark)}, transparent)`, zIndex: 4, pointerEvents: "none" }} />

          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: "1rem",
              paddingTop: "0.5rem",
              cursor: "grab",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseDown={(e) => {
              const el = e.currentTarget;
              el.style.cursor = "grabbing";
              const startX = e.pageX - el.offsetLeft;
              const scrollLeft = el.scrollLeft;
              const onMove = (me) => { el.scrollLeft = scrollLeft - (me.pageX - el.offsetLeft - startX); };
              const onUp = () => { el.style.cursor = "grab"; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          >
            {CERTIFICATIONS.map((cert) => (
              <CertificationCard key={cert.credentialId} cert={cert} dark={dark} />
            ))}
          </div>
        </div>

        {/* ── Stats strip ── */}
        <Reveal delay={120}>
          <div id="cert-stats" className="cert-stats-hide" style={{
            marginTop: "1rem",
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12,
            background: dark ? "rgba(37,99,235,.12)" : "rgba(37,99,235,.07)",
            borderRadius: 20, padding: "1.8rem",
            border: `1px solid ${dark ? "rgba(59,130,246,.2)" : "rgba(37,99,235,.12)"}`,
          }}>
          {[
            ["3", "Platforms", "Coursera, Dicoding & Udemy"],
            [CERTIFICATIONS.length.toString(), "Certificates", "Verified & credentialed"],
            ["2024–2026", "Active Period", "Continuous learning"],
          ].map(([n, label, sub]) => (
            <div key={label} style={{ textAlign: "center", minWidth: 0 }}>
              <span style={{ fontFamily: F.display, fontSize: "clamp(.95rem, 3vw, 2rem)", fontWeight: 800, color: "#2563eb", display: "block", lineHeight: 1.1 }}>{n}</span>
              <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: "clamp(.55rem, 1.8vw, .9rem)", color: T.text(dark), display: "block", marginTop: 4, whiteSpace: "nowrap" }}>{label}</span>
              <span style={{ fontFamily: F.body, fontSize: "clamp(.45rem, 1.4vw, .75rem)", color: T.text3(dark), whiteSpace: "nowrap", display: "block" }}>{sub}</span>
            </div>
          ))}
          </div>
        </Reveal>
      </Container>

      <style>{`
        #certifications [style*="overflow-x"]::-webkit-scrollbar { display: none; }

        @media (max-width: 480px) {
          .cert-stats-hide {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────── */
const CONTACT_BG = (dark) => dark ? "#0a1628" : "#f0f4ff";

function Contact({ dark }) {
  const socials = [
    { href: "https://instagram.com/mraynarr", label: "Instagram", bg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fff", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
    { href: "https://linkedin.com/in/mraynar", label: "LinkedIn", bg: "#0a66c2", color: "#fff", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { href: "https://github.com/mraynar", label: "GitHub", bg: dark ? "#e8f1ff" : "#0f1f4f", color: dark ? "#060d1f" : "#fff", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> },
    { href: "mailto:raynarham23@gmail.com", label: "Email Me", bg: "#2563eb", color: "#fff", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
  ];

  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: CONTACT_BG(dark), paddingTop: 120, paddingBottom: 120 }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(37,99,235,${dark ? ".12" : ".07"}) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,${dark ? ".12" : ".07"}) 1px,transparent 1px)`, backgroundSize: "52px 52px", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 500, borderRadius: "50%", background: dark ? "radial-gradient(circle,rgba(37,99,235,.25) 0%,transparent 70%)" : "radial-gradient(circle,rgba(37,99,235,.12) 0%,transparent 70%)", filter: "blur(56px)", zIndex: 0 }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: dark ? 0.16 : 0.09 }} preserveAspectRatio="none">
        <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#2563eb" strokeWidth="1" strokeDasharray="8 12" />
        <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#2563eb" strokeWidth="1" strokeDasharray="8 12" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 16" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 16" />
      </svg>
      <DotsGrid cols={7} rows={3} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.45} style={{ top: "5%", left: "2%", zIndex: 1 }} />
      <DotsGrid cols={5} rows={2} dotColor={dark ? "#2563eb" : "#1d4ed8"} opacity={0.38} style={{ bottom: "8%", right: "3%", zIndex: 1 }} />
      <Star4 size={30} fill="#2563eb" opacity={0.9} style={{ top: "8%", right: "5%", zIndex: 1 }} />
      <Star4 size={20} fill="#fbbf24" opacity={0.85} style={{ bottom: "12%", left: "6%", animationDelay: "-4s", zIndex: 1 }} />
      <DiamondShape size={32} color="#2563eb" opacity={0.28} style={{ top: "35%", left: "4%", zIndex: 1 }} />
      <RingShape size={120} color="#2563eb" opacity={0.15} strokeW={4} style={{ bottom: "0%", right: "10%", zIndex: 1 }} />
      <FloatDot size={14} color="#2563eb" style={{ top: "28%", right: "3%", animationDelay: "-2s", zIndex: 1 }} />

      <Container style={{ paddingLeft: SECTION_PX, paddingRight: SECTION_PX, position: "relative", zIndex: 2 }}>
        <Reveal className="text-center">
          <p style={{ fontFamily: F.display, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.08, color: T.text(dark), marginBottom: "1.2rem", fontSize: "clamp(2.4rem,6vw,5.5rem)" }}>
            LET&apos;S WORK<br /><span style={{ color: "#2563eb" }}>TOGETHER</span>
          </p>
          <p style={{ color: T.text3(dark), marginBottom: "3rem", fontSize: "1.05rem", fontFamily: F.body, lineHeight: 1.75 }}>Got a project in mind? Let&apos;s build something.</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex justify-center items-center flex-wrap" style={{ gap: "0.8rem" }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2.5 no-underline font-semibold transition-all duration-200"
                style={{ background: s.bg, color: s.color, fontSize: ".92rem", padding: "14px 24px", borderRadius: 14, fontFamily: F.body, lineHeight: 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,.24)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                {s.icon}{s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────── */
function HomePage({ dark }) {
  return (
    <>
      <Hero dark={dark} />
      <About dark={dark} />
      <Skills dark={dark} />
      <ProjectsPreview dark={dark} />
      <ExperiencePreview dark={dark} />
      <Certifications dark={dark} />
      <Contact dark={dark} />
    </>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────── */
export default function App() {
  const [dark, toggleDark] = useDarkMode();

  return (
    <BrowserRouter>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: T.bg(dark), color: T.text(dark), minHeight: "100vh" }}>
        <ScrollToTop />
        <Navbar dark={dark} toggleDark={toggleDark} />
        <ScrollTopFab dark={dark} />
        <Routes>
          <Route path="/" element={<HomePage dark={dark} />} />
          <Route path="/projects" element={<ProjectPage dark={dark} />} />
          <Route path="/experience" element={<ExperiencePage dark={dark} />} />
        </Routes>
        <Footer dark={dark} />
      </div>
    </BrowserRouter>
  );
}