import { Link } from "react-router-dom";
import { Container, Card, Chip, Icon } from "./components";
import { useLanguage } from "./context/LanguageContext";

// Neo-brutalist 404 fallback page for unmatched public routes
export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <main
      id="main-content"
      className="min-h-[75vh] pt-24 pb-20 flex items-center"
      style={{ backgroundColor: "transparent" }}
    >
      <Container>
        <div className="max-w-xl mx-auto">
          <Card variant="flat" className="overflow-hidden" style={{ padding: 0 }}>
            <div className="google-bar" />
            <div className="p-6 sm:p-10 text-center space-y-5">
              <div className="flex justify-center">
                <Chip variant="red" className="font-mono font-extrabold">
                  ERROR 404
                </Chip>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink)",
                }}
              >
                {t("not_found_title")}
              </h1>

              <p
                className="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                style={{ color: "var(--ink-secondary)" }}
              >
                {t("not_found_desc")}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/#home"
                  className="neo-btn-primary text-sm font-bold py-2.5 px-5"
                >
                  <Icon name="arrow-left" size={16} />
                  {t("not_found_home")}
                </Link>
                <Link
                  to="/projects"
                  className="neo-btn-secondary text-sm font-bold py-2.5 px-5"
                >
                  {t("nav_projects")}
                </Link>
                <Link
                  to="/experience"
                  className="neo-btn-secondary text-sm font-bold py-2.5 px-5"
                >
                  {t("nav_experience")}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}
