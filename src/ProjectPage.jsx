import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, ProjectCard, Cluster, Icon, Pagination } from "./components";
import { PROJECTS } from "./data";
import { useLanguage } from "./context/LanguageContext";
import { translateProject, translateInfo } from "./lib/translations";

export default function ProjectPage({
  onOpenCaseStudy,
  projects = PROJECTS,
  info = {},
}) {
  const { t, language } = useLanguage();
  const localizedInfo = useMemo(
    () => translateInfo(info, language),
    [info, language]
  );
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const localizedProjects = useMemo(
    () => (projects || []).map((p) => translateProject(p, language)),
    [projects, language]
  );

  const categories = [
    {
      key: "ALL",
      label: t("skills_all"),
      border: "var(--google-blue)",
      bg: "var(--google-blue-bg)",
      text: "var(--google-blue-text)",
    },
    {
      key: "Web App",
      label: "Web App",
      border: "var(--google-blue)",
      bg: "var(--google-blue-bg)",
      text: "var(--google-blue-text)",
    },
    {
      key: "Mobile App",
      label: "Mobile App",
      border: "var(--google-yellow)",
      bg: "var(--google-yellow-bg)",
      text: "var(--google-yellow-text)",
    },
    {
      key: "UI/UX Design",
      label: "UI/UX Design",
      border: "var(--google-red)",
      bg: "var(--google-red-bg)",
      text: "var(--google-red-text)",
    },
    {
      key: "Data Analyst",
      label: "Data Analyst",
      border: "var(--google-green)",
      bg: "var(--google-green-bg)",
      text: "var(--google-green-text)",
    },
  ];

  const filteredProjects =
    activeFilter === "ALL"
      ? localizedProjects
      : localizedProjects.filter((p) => p.label === activeFilter);

  return (
    <main
      className="min-h-screen pt-16 sm:pt-20 pb-20 relative"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Header banner */}
      <section
        className="pt-6 pb-10 sm:pt-8 sm:pb-12 border-b-2 mb-8"
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
              {t("nav_home")}
            </Link>
            <span>/</span>
            <span>{t("project_page_crumb")}</span>
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
            {localizedInfo.projectsTitle || t("project_page_title_1")}{" "}
            <span style={{ color: "var(--google-blue)" }}>
              {localizedInfo.projectsTitleAccent || t("project_page_title_2")}
            </span>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed mb-8"
            style={{ color: "var(--ink-secondary)" }}
          >
            {localizedInfo.projectsSubtitle || t("project_page_desc")}
          </p>

          {/* Filter pills with Google category palette */}
          <Cluster gap={8} className="pt-1">
            {categories.map((cat) => {
              const active = activeFilter === cat.key;
              const count =
                cat.key === "ALL"
                  ? projects.length
                  : projects.filter((p) => p.label === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveFilter(cat.key);
                    setCurrentPage(1);
                  }}
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
        {(() => {
          const maxPage = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
          const effectivePage = Math.min(currentPage, maxPage);
          const paginatedProjects = filteredProjects.slice(
            (effectivePage - 1) * pageSize,
            effectivePage * pageSize
          );

          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpenCaseStudy={onOpenCaseStudy}
                  />
                ))}
              </div>

              <Pagination
                currentPage={effectivePage}
                totalItems={filteredProjects.length}
                pageSize={pageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 350, behavior: "smooth" });
                }}
                itemLabel={language === "en" ? "projects" : "proyek"}
              />
            </>
          );
        })()}
      </Container>
    </main>
  );
}
