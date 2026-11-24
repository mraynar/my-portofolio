import { Link } from "react-router-dom";
import { Container, ExpCard, Stack, Cluster, Card, Chip, Icon } from "./components";
import { EXPERIENCE, EDUCATION } from "./data";

export default function ExperiencePage({
  experience = EXPERIENCE,
  education = EDUCATION,
}) {
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
            <span>Pengalaman</span>
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
            Linimasa{" "}
            <span style={{ color: "var(--google-blue)" }}>
              Pengalaman & Kontribusi
            </span>
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed"
            style={{ color: "var(--ink-secondary)" }}
          >
            Rekam jejak program kepemimpinan, kepengurusan organisasi
            mahasiswa, pengembangan sistem institusi, dan pengalaman magang
            industri.
          </p>
        </Container>
      </section>

      {/* Experience list */}
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2
              className="text-xs sm:text-sm font-bold tracking-wider font-mono uppercase"
              style={{ color: "var(--google-blue)" }}
            >
              Pengalaman Profesional & Organisasi
            </h2>
            <Stack gap={24}>
              {experience.map((item, idx) => (
                <ExpCard key={item.role + item.org} item={item} index={idx} />
              ))}
            </Stack>
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
              Riwayat Pendidikan Formal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {education.map((edu, idx) => (
                <Card
                  key={edu.school}
                  className="p-5 sm:p-6 border-l-4"
                  style={{
                    borderLeftColor:
                      idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs sm:text-sm font-bold font-mono"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {edu.period}
                    </span>
                    {edu.active && <Chip variant="green">Aktif</Chip>}
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
                        idx === 0 ? "var(--google-blue)" : "var(--google-green)",
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
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
