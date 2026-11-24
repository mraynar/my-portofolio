import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Chip, Icon } from "../components";
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

// Protected admin dashboard layout
export default function AdminLayout() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
    { id: "projects", label: `Proyek (${projects.length})`, icon: "folder" },
    { id: "experience", label: "Pengalaman", icon: "briefcase" },
    { id: "skills", label: "Keahlian", icon: "code" },
    { id: "education", label: "Pendidikan & Sertifikasi", icon: "education" },
    {
      id: "messages",
      label: `Pesan (${messages.length})`,
      icon: "mail",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
    >
      <div className="bg-code-tile fixed inset-0 pointer-events-none opacity-40" />

      {/* Admin header */}
      <header
        className="sticky top-0 z-40 border-b-2 px-4 sm:px-8 py-3.5 flex items-center justify-between"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-mono font-extrabold text-base sm:text-lg"
            style={{ color: "var(--ink)" }}
          >
            <span>&#123; mraynar &#125;</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285f4]" />
              <span className="w-2 h-2 rounded-full bg-[#ea4335]" />
              <span className="w-2 h-2 rounded-full bg-[#fbbc04]" />
              <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            </span>
          </Link>
          <Chip variant="blue">ADMIN CMS</Chip>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="neo-btn-secondary text-xs sm:text-sm font-bold hidden sm:inline-flex"
          >
            <Icon name="external-link" size={14} />
            Lihat Website
          </Link>

          <button
            onClick={handleLogout}
            className="neo-badge text-xs sm:text-sm font-bold cursor-pointer"
            style={{
              backgroundColor: "var(--google-red-bg)",
              color: "var(--google-red-text)",
              borderColor: "var(--google-red)",
            }}
          >
            <Icon name="log-out" size={14} />
            Keluar
          </button>
        </div>
      </header>

      {/* Main container */}
      <Container className="relative z-10 flex-1 py-8 sm:py-10">
        {/* Navigation tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="neo-badge text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all"
                style={{
                  backgroundColor: active
                    ? "var(--google-blue)"
                    : "var(--surface)",
                  color: active ? "#ffffff" : "var(--ink)",
                  borderColor: active ? "var(--border)" : "var(--border)",
                  boxShadow: active
                    ? "2px 2px 0 var(--shadow-color)"
                    : "none",
                }}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content view */}
        <div className="pb-16">
          {activeTab === "overview" && (
            <AdminOverview
              projectsCount={projects.length}
              experienceCount={experience.length}
              skillsCount={skills.length}
              messages={messages}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && info && (
            <AdminProfile
              initialInfo={info}
              onUpdateInfo={(updated) => setInfo(updated)}
            />
          )}

          {activeTab === "projects" && (
            <AdminProjects projects={projects} onRefresh={loadCmsData} />
          )}

          {activeTab === "experience" && (
            <AdminExperience experience={experience} onRefresh={loadCmsData} />
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
      </Container>
    </div>
  );
}
