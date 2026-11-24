import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chip, Icon } from "../components";
import {
  checkIsAdmin,
  signOutAdmin,
  getSiteSettings,
  getProjects,
  getExperience,
  getSkillCategories,
  getEducation,
  getCertifications,
  getContactMessages,
  supabase,
} from "../lib/supabase";
import AdminOverview from "./AdminOverview";
import AdminProfile from "./AdminProfile";
import AdminProjects from "./AdminProjects";
import AdminExperience from "./AdminExperience";
import AdminSkills from "./AdminSkills";
import AdminEducationCerts from "./AdminEducationCerts";
import AdminMessages from "./AdminMessages";

// Protected admin dashboard layout with collapsible sidebar rail
export default function AdminLayout() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Sidebar collapse states for desktop and mobile
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      return saved !== null ? saved === "true" : false;
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // CMS state collections
  const [info, setInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Load all CMS datasets for admin manipulation
  const loadCmsData = useCallback(async () => {
    try {
      const [
        fetchedInfo,
        fetchedProjects,
        fetchedExp,
        fetchedSkills,
        fetchedEdu,
        fetchedCerts,
        fetchedMsgs,
      ] = await Promise.all([
        getSiteSettings(),
        getProjects(),
        getExperience(),
        getSkillCategories(),
        getEducation(),
        getCertifications(),
        getContactMessages(),
      ]);

      if (fetchedInfo) setInfo(fetchedInfo);
      if (fetchedProjects) setProjects(fetchedProjects);
      if (fetchedExp) setExperience(fetchedExp);
      if (fetchedSkills) setSkills(fetchedSkills);
      if (fetchedEdu) setEducation(fetchedEdu);
      if (fetchedCerts) setCertifications(fetchedCerts);
      if (fetchedMsgs) setMessages(fetchedMsgs);
    } catch {
      // Local fallbacks already configured in getters
    }
  }, []);

  // Verify admin session and initialize CMS data
  useEffect(() => {
    let mounted = true;
    async function initAdmin() {
      // Allow local inspection if credentials are not yet configured
      if (!supabase) {
        if (mounted) {
          setIsCheckingAuth(false);
        }
        await loadCmsData();
        return;
      }

      const verified = await checkIsAdmin();
      if (mounted) {
        if (!verified) {
          navigate("/admin/login");
        } else {
          setIsCheckingAuth(false);
          await loadCmsData();
        }
      }
    }
    initAdmin();
    return () => {
      mounted = false;
    };
  }, [navigate, loadCmsData]);

  const handleLogout = async () => {
    await signOutAdmin();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("admin_sidebar_collapsed", String(next));
        } catch {
          // Ignore localStorage errors
        }
        return next;
      });
    }
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 font-mono text-sm font-bold"
        style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
      >
        <div className="flex items-center gap-2">
          <Icon name="refresh" size={16} className="animate-spin" />
          Memverifikasi sesi keamanan admin...
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: "layout" },
    { id: "profile", label: "Profil & Bio", icon: "user" },
    {
      id: "projects",
      label: "Portofolio Proyek",
      count: projects.length,
      icon: "folder",
    },
    {
      id: "experience",
      label: "Pengalaman",
      count: experience.length,
      icon: "briefcase",
    },
    {
      id: "skills",
      label: "Keahlian",
      count: skills.length,
      icon: "code",
    },
    {
      id: "education",
      label: "Pendidikan & Sertifikasi",
      count: education.length + certifications.length,
      icon: "education",
    },
    {
      id: "messages",
      label: "Pesan Kontak",
      count: messages.length,
      icon: "mail",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
    >
      <div className="bg-code-tile fixed inset-0 pointer-events-none opacity-40" />

      {/* Admin header */}
      <header
        className="sticky top-0 z-40 border-b-2 px-3 sm:px-6 py-2.5 flex items-center justify-between"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={toggleSidebar}
            aria-label={
              isMobileOpen || !isCollapsed ? "Tutup Sidebar" : "Buka Sidebar"
            }
            title={
              isMobileOpen || !isCollapsed ? "Tutup Sidebar" : "Buka Sidebar"
            }
            className="neo-btn-secondary !min-h-[36px] p-2 font-bold text-xs flex items-center justify-center cursor-pointer shrink-0"
            style={{ width: "36px", height: "36px" }}
          >
            <Icon
              name={
                isMobileOpen || !isCollapsed ? "chevron-left" : "chevron-right"
              }
              size={16}
            />
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 font-mono font-extrabold text-sm sm:text-base truncate"
            style={{ color: "var(--ink)" }}
          >
            <span>&#123; mraynar &#125;</span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285f4]" />
              <span className="w-2 h-2 rounded-full bg-[#ea4335]" />
              <span className="w-2 h-2 rounded-full bg-[#fbbc04]" />
              <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            </span>
          </Link>
          <div className="hidden sm:block">
            <Chip variant="blue" className="text-[11px]">
              ADMIN CMS
            </Chip>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="neo-btn-secondary !min-h-[36px] py-1.5 px-3 text-xs font-bold"
            >
              <Icon name="external-link" size={13} />
              Lihat Website
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="neo-badge text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            style={{
              backgroundColor: "var(--google-red-bg)",
              color: "var(--google-red-text)",
              borderColor: "var(--google-red)",
            }}
          >
            <Icon name="log-out" size={13} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main body with collapsible sidebar rail */}
      <div className="flex flex-1 min-h-[calc(100vh-61px)] relative">
        {/* Mobile backdrop overlay when drawer is open */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 top-[61px] bg-black/40 z-20 md:hidden backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar navigation */}
        <aside
          className={`
            border-r-2 flex flex-col justify-between shrink-0
            transition-all duration-200 ease-in-out z-30
            ${
              isMobileOpen
                ? "fixed top-[61px] left-0 bottom-0 w-64 shadow-2xl"
                : "relative w-16 md:w-auto"
            }
            ${
              !isMobileOpen && isCollapsed
                ? "md:w-20"
                : !isMobileOpen && !isCollapsed
                ? "md:w-64"
                : ""
            }
          `}
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Top rail controls and navigation list */}
          <div className="p-2 sm:p-3 space-y-2">
            {/* Sidebar header row */}
            <div
              className={`
                flex items-center pb-2 mb-1 border-b-2
                ${
                  !isMobileOpen && isCollapsed
                    ? "justify-center"
                    : "justify-between px-2"
                }
              `}
              style={{ borderColor: "var(--border)" }}
            >
              {(isMobileOpen || !isCollapsed) && (
                <span className="text-[11px] font-extrabold font-mono uppercase tracking-wider text-[var(--ink-secondary)] truncate">
                  NAVIGASI CMS
                </span>
              )}
              <button
                onClick={toggleSidebar}
                aria-label={
                  isMobileOpen || !isCollapsed
                    ? "Ciutkan Sidebar"
                    : "Perluas Sidebar"
                }
                title={
                  isMobileOpen || !isCollapsed
                    ? "Ciutkan Sidebar"
                    : "Perluas Sidebar"
                }
                className="p-1 rounded-lg hover:bg-[var(--surface-alt)] cursor-pointer text-[var(--ink-secondary)] transition-colors"
              >
                <Icon
                  name={
                    isMobileOpen || !isCollapsed
                      ? "chevron-left"
                      : "chevron-right"
                  }
                  size={15}
                />
              </button>
            </div>

            {/* Menu items list */}
            <nav className="space-y-1.5" aria-label="Menu Admin">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                const isMini = !isMobileOpen && isCollapsed;

                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    title={isMini ? tab.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`
                      w-full rounded-xl transition-all cursor-pointer font-bold
                      flex items-center relative
                      ${
                        isMini
                          ? "justify-center p-3"
                          : "justify-between px-3 py-2.5 text-xs sm:text-sm"
                      }
                    `}
                    style={{
                      backgroundColor: active
                        ? "var(--google-blue)"
                        : "transparent",
                      color: active ? "#ffffff" : "var(--ink)",
                      border: active
                        ? "2px solid var(--border)"
                        : "2px solid transparent",
                      boxShadow: active
                        ? "2px 2px 0 var(--shadow-color)"
                        : "none",
                    }}
                  >
                    <div
                      className={`flex items-center ${
                        isMini ? "justify-center" : "gap-3 truncate"
                      }`}
                    >
                      <Icon
                        name={tab.icon}
                        size={isMini ? 20 : 18}
                        className="shrink-0"
                      />
                      {!isMini && (
                        <span className="truncate text-left">{tab.label}</span>
                      )}
                    </div>

                    {/* Badge counts */}
                    {tab.count !== undefined && (
                      <>
                        {!isMini ? (
                          <span
                            className="text-[11px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ml-1.5"
                            style={{
                              backgroundColor: active
                                ? "rgba(255, 255, 255, 0.25)"
                                : "var(--surface-alt)",
                              color: active ? "#ffffff" : "var(--ink-secondary)",
                              border: active
                                ? "1px solid rgba(255, 255, 255, 0.4)"
                                : "1px solid var(--border)",
                            }}
                          >
                            {tab.count}
                          </span>
                        ) : tab.count > 0 ? (
                          <span
                            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                tab.id === "messages"
                                  ? "var(--google-red)"
                                  : "var(--google-blue)",
                              border: "2px solid var(--surface)",
                            }}
                          />
                        ) : null}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar bottom summary */}
          <div
            className="p-2 sm:p-3 border-t-2"
            style={{ borderColor: "var(--border)" }}
          >
            {isMobileOpen || !isCollapsed ? (
              <div
                className="p-3 rounded-xl border-2 space-y-2"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="flex items-center gap-1.5 text-[var(--google-green)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--google-green)] animate-pulse" />
                    Online
                  </span>
                  <span className="text-[var(--ink-muted)]">v2.0</span>
                </div>
                <div className="text-[11px] text-[var(--ink-secondary)] truncate font-semibold">
                  Muhammad Raynar
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-1">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[var(--google-green)]"
                  title="Sesi Admin Aktif"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main content display area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1360px] mx-auto w-full">
            {/* Breadcrumb section indicator */}
            <div
              className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span style={{ color: "var(--ink-muted)" }}>ADMIN CMS</span>
                <span style={{ color: "var(--border)" }}>/</span>
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    color: "var(--google-blue)",
                  }}
                >
                  {currentTab.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[var(--ink-secondary)]">
                  Mode:
                </span>
                <Chip variant="green" className="text-[11px]">
                  Aktif & Terhubung
                </Chip>
              </div>
            </div>

            {/* Tab views */}
            <div className="pb-16">
              {activeTab === "overview" && (
                <AdminOverview
                  projectsCount={projects.length}
                  experienceCount={experience.length}
                  skillsCount={skills.length}
                  messages={messages}
                  onNavigateTab={selectTab}
                />
              )}

              {activeTab === "profile" && info && (
                <AdminProfile
                  initialInfo={info}
                  onUpdateInfo={(updated) => setInfo(updated)}
                />
              )}

              {activeTab === "projects" && (
                <AdminProjects
                  projects={projects}
                  onRefresh={loadCmsData}
                  info={info}
                  onUpdateInfo={(updated) => setInfo(updated)}
                />
              )}

              {activeTab === "experience" && (
                <AdminExperience
                  experience={experience}
                  onRefresh={loadCmsData}
                />
              )}

              {activeTab === "skills" && (
                <AdminSkills skills={skills} onRefresh={loadCmsData} />
              )}

              {activeTab === "education" && (
                <AdminEducationCerts
                  education={education}
                  certifications={certifications}
                  onRefresh={loadCmsData}
                />
              )}

              {activeTab === "messages" && (
                <AdminMessages messages={messages} onRefresh={loadCmsData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
