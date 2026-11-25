import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  ExpCard,
  CareerPathwayBridge,
  RoadTrack,
  Cluster,
  Card,
  Chip,
  Icon,
} from "./components";
import {
  EXPERIENCE,
  EDUCATION,
  isInternshipExperience,
  sortExperiencesLatestFirst,
} from "./data";
import { useLanguage } from "./context/LanguageContext";
import {
  translateExperience,
  translateEducation,
  translateText,
} from "./lib/translations";

export default function ExperiencePage({
  experience = EXPERIENCE,
  education = EDUCATION,
  info = {},
}) {
  const { t, language } = useLanguage();
  const localizedExperience = useMemo(
    () => (experience || []).map((e) => translateExperience(e, language)),
    [experience, language]
  );
  const localizedEducation = useMemo(
    () => (education || []).map((e) => translateEducation(e, language)),
    [education, language]
  );
  const sortedAll = sortExperiencesLatestFirst(localizedExperience);
  const internships = sortedAll.filter(isInternshipExperience);
  const organizations = sortedAll.filter((item) => !isInternshipExperience(item));
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
            <span>{t("exp_page_crumb")}</span>
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
            {info.expTitle
              ? translateText(info.expTitle, language)
              : t("exp_page_title_1")}{" "}
            <span style={{ color: "var(--google-blue)" }}>
              {info.expTitleAccent
                ? translateText(info.expTitleAccent, language)
                : t("exp_page_title_2")}
            </span>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed"
            style={{ color: "var(--ink-secondary)" }}
          >
            {info.expSubtitle
              ? translateText(info.expSubtitle, language)
              : t("exp_page_desc")}
          </p>
        </Container>
      </section>

      {/* Experience list */}
      <Container>
        <div className="w-full space-y-12">
          {/* Internship and professional experience placed first */}
          <div className="space-y-6">
            <div
              className="p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--google-blue-bg)",
                    color: "var(--google-blue)",
                  }}
                >
                  <Icon name="briefcase" size={20} />
                </div>
                <div>
                  <h2
                    className="font-extrabold text-base sm:text-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {t("exp_internship_title")}
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {t("exp_internship_desc")}
                  </p>
                </div>
              </div>
              <span
                className="neo-badge text-xs font-mono font-bold self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue-text)",
                  borderColor: "var(--google-blue)",
                }}
              >
                {internships.length} {t("exp_milestones")}
              </span>
            </div>

            <div className="relative">
              <RoadTrack />
              {internships.map((item, idx) => (
                <ExpCard
                  key={item.id || item.role + item.org}
                  item={item}
                  index={idx}
                  isLeft={idx % 2 === 0}
                  customIndex={idx + 1}
                />
              ))}
            </div>
          </div>

          {/* Continuous career progression connector between sections */}
          <CareerPathwayBridge
            kicker={t("exp_bridge_kicker")}
            title={t("exp_bridge_title")}
            description={t("exp_bridge_desc")}
          />

          {/* Section 2: Campus and leadership organizations (Placed below) */}
          <div className="space-y-6">
            <div
              className="p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--google-green-bg)",
                    color: "var(--google-green)",
                  }}
                >
                  <Icon name="users" size={20} />
                </div>
                <div>
                  <h2
                    className="font-extrabold text-base sm:text-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {t("exp_org_title")}
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {t("exp_org_desc")}
                  </p>
                </div>
              </div>
              <span
                className="neo-badge text-xs font-mono font-bold self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--google-green-bg)",
                  color: "var(--google-green-text)",
                  borderColor: "var(--google-green)",
                }}
              >
                {organizations.length} {t("exp_milestones")}
              </span>
            </div>

            <div className="relative">
              <RoadTrack />
              {organizations.map((item, idx) => (
                <ExpCard
                  key={item.id || item.role + item.org}
                  item={item}
                  index={idx}
                  isLeft={idx % 2 === 0}
                  customIndex={internships.length + idx + 1}
                />
              ))}
            </div>
          </div>

          {/* Education section */}
          <div
            className="pt-10 border-t-2 space-y-6"
            style={{ borderColor: "var(--border)" }}
          >
            <h2
              className="text-xs sm:text-sm font-bold tracking-wider font-mono uppercase"
              style={{ color: "var(--google-blue)" }}
            >
              {t("exp_edu_title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {localizedEducation.map((edu, idx) => (
                <Card
                  key={edu.school}
                  className="p-5 sm:p-6 border-l-4"
                  style={{
                    borderLeftColor:
                      idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs sm:text-sm font-bold font-mono"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {edu.period}
                        </span>
                        {edu.active && (
                          <Chip variant="green">{t("exp_active")}</Chip>
                        )}
                      </div>
                      <h3
                        className="font-extrabold text-lg sm:text-xl mb-1"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--ink)",
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        className="text-sm sm:text-base font-bold mb-2.5"
                        style={{
                          color:
                            idx === 0
                              ? "var(--google-blue)"
                              : "var(--google-green)",
                        }}
                      >
                        {edu.school}
                      </p>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        {edu.focus}
                      </p>
                    </div>

                    {(edu.score || edu.ipk) && (
                      <div
                        className="w-full md:w-44 shrink-0 md:self-center px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl border-2 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:gap-0.5 transition-transform hover:scale-[1.02]"
                        style={{
                          backgroundColor:
                            idx === 0
                              ? "var(--google-blue-bg)"
                              : "var(--google-green-bg)",
                          borderColor:
                            idx === 0
                              ? "var(--google-blue)"
                              : "var(--google-green)",
                          boxShadow: "2px 2px 0 var(--shadow-color)",
                        }}
                      >
                        <span
                          className="text-[10px] font-black font-mono uppercase tracking-wider whitespace-nowrap"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {edu.scoreLabel ||
                            (idx === 0
                              ? language === "en" ? "GPA" : "IPK"
                              : language === "en"
                                ? "FINAL GRADE"
                                : "NILAI AKHIR")}
                        </span>
                        <span
                          className="text-xs sm:text-base font-black font-mono tracking-tight whitespace-nowrap"
                          style={{
                            color:
                              idx === 0
                                ? "var(--google-blue)"
                                : "var(--google-green)",
                          }}
                        >
                          [{String(edu.score || edu.ipk).replace(/^\[+|\]+$/g, "").trim()}]
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
