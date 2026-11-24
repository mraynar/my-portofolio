import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, ProjectCard, Cluster, Icon } from "./components";
import { PROJECTS } from "./data";

export default function ProjectPage({ onOpenCaseStudy }) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const categories = [
    {
      label: "Semua",
      border: "var(--google-blue)",
      bg: "var(--google-blue-bg)",
      text: "var(--google-blue-text)",
    },
    {
      label: "Web App",
      border: "var(--google-blue)",
      bg: "var(--google-blue-bg)",
      text: "var(--google-blue-text)",
    },
    {
      label: "Mobile App",
      border: "var(--google-yellow)",
      bg: "var(--google-yellow-bg)",
      text: "var(--google-yellow-text)",
    },
    {
      label: "UI/UX Design",
      border: "var(--google-red)",
      bg: "var(--google-red-bg)",
      text: "var(--google-red-text)",
    },
    {
      label: "Data Analyst",
      border: "var(--google-green)",
      bg: "var(--google-green-bg)",
      text: "var(--google-green-text)",
    },
  ];

  const filteredProjects =
    activeFilter === "Semua"
      ? PROJECTS
      : PROJECTS.filter((p) => p.label === activeFilter);

  return (
    <main
      className="min-h-screen pt-24 sm:pt-28 pb-28"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      {/* Header banner */}
      <section
        className="pt-10 pb-14 sm:pt-14 sm:pb-16 border-b-2 mb-12"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <Container>
          <Cluster
            gap={8}
            className="mb-4 text-xs sm:text-sm font-bold font-mono uppercase"
            style={{ color: "var(--ink-muted)" }}
          >
            <Link
              to="/#home"
              className="hover:underline flex items-center gap-1.5"
              style={{ color: "var(--google-blue)" }}
            >
              <Icon name="arrow-left" size={16} />
              Beranda
            </Link>
            <span>/</span>
            <span>Portofolio Proyek</span>
          </Cluster>

          <h1
            className="font-extrabold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.12,
              color: "var(--ink)",
            }}
          >
            Semua{" "}
            <span style={{ color: "var(--google-blue)" }}>
              Proyek & Eksplorasi
            </span>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed mb-8"
            style={{ color: "var(--ink-secondary)" }}
          >
            Dokumentasi lengkap aplikasi web, solusi mobile, purwarupa desain
            UI/UX, dan dashboard analitik data yang telah saya rancang.
          </p>

          {/* Filter pills with Google category palette */}
          <Cluster gap={8} className="pt-1">
            {categories.map((cat) => {
              const active = activeFilter === cat.label;
              const count =
                cat.label === "Semua"
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.label === cat.label).length;

              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveFilter(cat.label)}
                  className="neo-badge text-xs sm:text-sm font-bold cursor-pointer transition-all"
                  style={{
                    backgroundColor: active ? cat.border : "var(--surface-alt)",
                    color: active ? "#ffffff" : "var(--ink)",
                    borderColor: active ? "var(--border)" : cat.border,
                    boxShadow: active
                      ? "3px 3px 0 var(--shadow-color)"
                      : "none",
                  }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </Cluster>
        </Container>
      </section>

      {/* Responsive projects grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenCaseStudy={onOpenCaseStudy}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
