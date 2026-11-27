/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  translateText,
  translateInfo,
  translateEducation,
  translateProject,
  translateExperience,
  translateSkillCategory,
  translateCertification,
} from "../lib/translations";

export {
  translateText,
  translateInfo,
  translateEducation,
  translateProject,
  translateExperience,
  translateSkillCategory,
  translateCertification,
};

// Translation dictionary for Indonesian and English
export const TRANSLATIONS = {
  id: {
    // Navigation
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_skills: "Keahlian",
    nav_projects: "Proyek",
    nav_experience: "Pengalaman",
    nav_contact: "Kontak",
    download_cv: "Unduh CV",
    language_label: "Bahasa",

    // Hero
    hero_tag: "SISTEM INFORMASI & SOFTWARE ENGINEER",
    hero_campus: "UPN Veteran Jawa Timur",
    hero_bio:
      "Mengembangkan aplikasi web dan mobile berbasis sistem informasi yang terukur, fungsional, dan berorientasi pada efisiensi operasional. Mahasiswa aktif Sistem Informasi di UPN \"Veteran\" Jawa Timur.",
    hero_view_projects: "Lihat Proyek",
    hero_links: "TAUTAN:",
    hero_terminal_role:
      "Mahasiswa Sistem Informasi - UPN \"Veteran\" Jawa Timur",
    hero_terminal_title: "raynar-dev.ts",
    hero_online: "Online",

    // About
    about_kicker: "TENTANG SAYA",
    about_title: "Membangun Solusi Digital yang Relevan & Terukur",
    about_p1:
      "Mahasiswa Sistem Informasi UPN \"Veteran\" Jawa Timur dengan fokus rekayasa perangkat lunak terapan. Memadukan analisis kebutuhan bisnis, desain arsitektur modular, dan implementasi kode yang bersih.",
    about_p2:
      "Aktif dalam organisasi penalaran riset ilmiah kampus, kepanitiaan teknologi, dan program inkubasi kepemimpinan industri. Terbiasa memimpin inisiatif digital dari tahap identifikasi masalah hingga penerapan.",
    about_stat_gpa: "Semester 6 (IPK 3.84)",
    about_stat_projects: "8+ Proyek Selesai",
    about_stat_exp: "5+ Pengalaman Organisasi & Magang",
    about_stat_certs: "11 Sertifikasi Kompetensi",
    pillar_si_title: "Sistem Informasi Terapan",
    pillar_si_desc:
      "Analisis proses bisnis, pemodelan data relasional, dan perancangan alur kerja digital yang efisien.",
    pillar_fullstack_title: "Pengembangan Full-Stack",
    pillar_fullstack_desc:
      "Rekayasa aplikasi web dan mobile modern menggunakan React, Tailwind CSS, Flutter, dan PostgreSQL.",
    pillar_collab_title: "Kolaborasi & Manajemen",
    pillar_collab_desc:
      "Komunikasi lintas divisi, kepemimpinan tim proyek, dan dokumentasi teknis yang transparan.",

    // Skills
    skills_kicker: "KEAHLIAN TEKNIS",
    skills_title: "Kompilasi Alat & Teknologi Rekayasa",
    skills_desc:
      "Teknologi yang saya gunakan secara aktif dalam pengembangan perangkat lunak dan manajemen sistem informasi.",
    skills_all: "Semua",

    // Projects
    projects_kicker: "PORTOFOLIO TERPILIH",
    projects_title: "Karya & Rekayasa Perangkat Lunak",
    projects_desc:
      "Kumpulan proyek aplikasi web, mobile, dan sistem informasi yang telah dibangun.",
    projects_view_all: "Lihat Semua Proyek",
    projects_view_case_study: "Lihat Studi Kasus",
    projects_case_study_full: "Lihat Studi Kasus Lengkap",
    projects_preview: "Pratinjau Proyek",
    projects_input_cms: "Input via Admin CMS",
    projects_live_demo: "Buka Live Demo",
    projects_key_impact: "DAMPAK UTAMA",

    // Experience
    exp_kicker: "REKAM JEJAK",
    exp_title: "Pengalaman Magang & Organisasi",
    exp_desc:
      "Rekam jejak kontribusi profesional industri serta kepemimpinan organisasi kampus.",
    exp_internship_title: "Pengalaman Magang & Profesional",
    exp_internship_desc:
      "Praktik industri dan rekayasa perangkat lunak terapan.",
    exp_org_title: "Pengalaman Organisasi & Komunitas",
    exp_org_desc:
      "Kemitraan publik, riset penalaran, dan pembinaan komunitas.",
    exp_view_timeline: "Lihat Linimasa Lengkap",
    exp_show_more: "Lihat Lebih Banyak",
    exp_show_less: "Tampilkan Lebih Sedikit",
    exp_tag_internship: "Magang",
    exp_tag_org: "Organisasi",
    exp_present: "Sekarang",
    exp_milestones: "Pengalaman",

    // Education & Certifications
    edu_kicker: "PENDIDIKAN & KREDENSIAL",
    edu_title: "Pendidikan Formal & Sertifikasi",
    edu_desc:
      "Fondasi akademis dan validasi keahlian industri terstandarisasi.",
    edu_tab_edu: "Pendidikan",
    edu_tab_certs: "Sertifikasi",
    edu_view_credential: "Verifikasi Kredensial",

    // Modal & Cards
    modal_bg_problem: "01. Latar Belakang & Masalah",
    modal_solution: "02. Pendekatan Solusi",
    modal_arch_tech: "03. Arsitektur & Teknologi",
    modal_arch_default:
      "Arsitektur modular memisahkan antarmuka, logika bisnis, dan basis data.",
    modal_impact: "04. Dampak Konkret",
    modal_repo_status: "Status Repositori:",
    modal_visit_demo: "Kunjungi Live Demo",
    modal_close: "Tutup",
    modal_role: "Peran:",
    modal_client: "Klien:",

    // Project Page
    project_page_crumb: "Portofolio Proyek",
    project_page_title_1: "Semua",
    project_page_title_2: "Proyek & Eksplorasi",
    project_page_desc:
      "Dokumentasi lengkap aplikasi web, solusi mobile, dan purwarupa desain.",
    featured_badge: "PROYEK UNGGULAN",

    // Experience Page
    exp_page_crumb: "Pengalaman",
    exp_page_title_1: "Linimasa",
    exp_page_title_2: "Pengalaman & Kontribusi",
    exp_page_desc:
      "Rekam jejak program kepemimpinan, kepengurusan kampus, dan magang.",
    exp_bridge_kicker: "KONEKSI JEJAK KARIR",
    exp_bridge_title: "Alur Perkembangan: Dari Ekosistem Kampus ke Industri",
    exp_bridge_desc:
      "Landasan kepemimpinan di kampus mengakselerasi rekayasa di industri.",
    exp_bridge_campus: "Organisasi Kampus",
    exp_bridge_internship: "Praktik Magang",
    exp_edu_title: "Riwayat Pendidikan Formal",
    exp_active: "Aktif",

    // Contact
    contact_kicker: "TERBUKA UNTUK KOLABORASI",
    contact_title_1: "Mari Membangun",
    contact_title_2: "Sesuatu Bersama",
    contact_desc:
      "Memiliki peluang magang, proyek rekayasa perangkat lunak, atau diskusi seputar sistem informasi? Jangan ragu untuk menghubungi saya.",
    contact_linkedin: "Hubungi via LinkedIn",
    contact_name_label: "NAMA LENGKAP",
    contact_name_placeholder: "Nama Anda",
    contact_email_label: "ALAMAT EMAIL",
    contact_email_placeholder: "email@domain.com",
    contact_subject_label: "SUBJEK / TOPIK",
    contact_subject_placeholder: "Peluang magang / diskusi proyek",
    contact_message_label: "PESAN",
    contact_message_placeholder: "Tuliskan pesan atau detail kolaborasi di sini...",
    contact_submit: "Kirim Pesan",
    contact_sending: "Mengirim...",
    contact_status: "Terbuka untuk Magang & Peluang Kolaborasi Proyek",
    contact_response_time: "Respon cepat biasanya dalam 1x24 jam kerja.",

    // Footer
    footer_rights: "Hak Cipta Dilindungi.",
    footer_system: "Dirancang dengan sistem neo-brutalisme Google.",

    // Not Found Page
    not_found_title: "Halaman Tidak Ditemukan",
    not_found_desc:
      "Tautan yang Anda buka mungkin telah dipindahkan atau tidak tersedia. Silakan kembali ke beranda portofolio.",
    not_found_home: "Kembali ke Beranda",
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_experience: "Experience",
    nav_contact: "Contact",
    download_cv: "Download CV",
    language_label: "Language",

    // Hero
    hero_tag: "INFORMATION SYSTEMS & SOFTWARE ENGINEER",
    hero_campus: "UPN Veteran Jawa Timur",
    hero_bio:
      "Developing scalable, functional, and operationally efficient web and mobile applications. Undergraduate Information Systems student at UPN \"Veteran\" Jawa Timur.",
    hero_view_projects: "View Projects",
    hero_links: "LINKS:",
    hero_terminal_role:
      "Information Systems Student - UPN \"Veteran\" Jawa Timur",
    hero_terminal_title: "raynar-dev.ts",
    hero_online: "Online",

    // About
    about_kicker: "ABOUT ME",
    about_title: "Building Relevant & Scalable Digital Solutions",
    about_p1:
      "Information Systems student at UPN \"Veteran\" Jawa Timur focusing on applied software engineering. Combining business requirements analysis, modular architecture design, and clean code implementation.",
    about_p2:
      "Active in campus scientific research organizations, tech committees, and industry leadership incubation programs. Experienced in leading digital initiatives from problem identification to deployment.",
    about_stat_gpa: "6th Semester (GPA 3.84)",
    about_stat_projects: "8+ Completed Projects",
    about_stat_exp: "5+ Org & Internship Records",
    about_stat_certs: "11 Skill Certifications",
    pillar_si_title: "Applied Information Systems",
    pillar_si_desc:
      "Business process analysis, relational data modeling, and efficient digital workflow design.",
    pillar_fullstack_title: "Full-Stack Development",
    pillar_fullstack_desc:
      "Engineering modern web and mobile apps using React, Tailwind CSS, Flutter, and PostgreSQL.",
    pillar_collab_title: "Collaboration & Leadership",
    pillar_collab_desc:
      "Cross-functional communication, project team leadership, and transparent technical documentation.",

    // Skills
    skills_kicker: "TECHNICAL SKILLS",
    skills_title: "Engineering Tools & Technology Stack",
    skills_desc:
      "Technologies I actively use in software development and information systems management.",
    skills_all: "All",

    // Projects
    projects_kicker: "FEATURED PORTFOLIO",
    projects_title: "Projects & Software Engineering",
    projects_desc:
      "A collection of web, mobile, and information system applications developed.",
    projects_view_all: "View All Projects",
    projects_view_case_study: "View Case Study",
    projects_case_study_full: "View Full Case Study",
    projects_preview: "Project Preview",
    projects_input_cms: "Input via Admin CMS",
    projects_live_demo: "Open Live Demo",
    projects_key_impact: "KEY IMPACT",

    // Experience
    exp_kicker: "CAREER MILESTONES",
    exp_title: "Internship & Organization Experience",
    exp_desc:
      "Track record of professional industry contributions and campus organization leadership.",
    exp_internship_title: "Internship & Professional Experience",
    exp_internship_desc:
      "Industry practice and applied software engineering.",
    exp_org_title: "Organization & Community Experience",
    exp_org_desc:
      "Public partnerships, research reasoning, and community development.",
    exp_view_timeline: "View Full Timeline",
    exp_show_more: "View More",
    exp_show_less: "Show Less",
    exp_tag_internship: "Internship",
    exp_tag_org: "Organization",
    exp_present: "Present",
    exp_milestones: "Milestones",

    // Education & Certifications
    edu_kicker: "EDUCATION & CREDENTIALS",
    edu_title: "Formal Education & Certifications",
    edu_desc:
      "Academic foundations and standardized industry skill validations.",
    edu_tab_edu: "Education",
    edu_tab_certs: "Certifications",
    edu_view_credential: "Verify Credential",

    // Modal & Cards
    modal_bg_problem: "01. Background & Problem",
    modal_solution: "02. Solution Approach",
    modal_arch_tech: "03. Architecture & Technology",
    modal_arch_default:
      "Modular architecture separating UI, business logic, and database.",
    modal_impact: "04. Concrete Impact",
    modal_repo_status: "Repository Status:",
    modal_visit_demo: "Visit Live Demo",
    modal_close: "Close",
    modal_role: "Role:",
    modal_client: "Client:",

    // Project Page
    project_page_crumb: "Project Portfolio",
    project_page_title_1: "All",
    project_page_title_2: "Projects & Explorations",
    project_page_desc:
      "Complete documentation of web apps, mobile solutions, and UI/UX.",
    featured_badge: "FEATURED PROJECT",

    // Experience Page
    exp_page_crumb: "Experience",
    exp_page_title_1: "Timeline of",
    exp_page_title_2: "Experience & Contributions",
    exp_page_desc:
      "Track record of leadership programs, student orgs, and internships.",
    exp_bridge_kicker: "CAREER PROGRESSION CONNECTOR",
    exp_bridge_title: "Development Path: From Campus Ecosystem to Industry",
    exp_bridge_desc:
      "Campus leadership foundations accelerate applied software engineering.",
    exp_bridge_campus: "Campus Organization",
    exp_bridge_internship: "Internship Practice",
    exp_edu_title: "Formal Education History",
    exp_active: "Active",

    // Contact
    contact_kicker: "OPEN FOR COLLABORATION",
    contact_title_1: "Let's Build",
    contact_title_2: "Something Together",
    contact_desc:
      "Have an internship opportunity, software project, or discussion about information systems? Feel free to reach out.",
    contact_linkedin: "Connect via LinkedIn",
    contact_name_label: "FULL NAME",
    contact_name_placeholder: "Your Name",
    contact_email_label: "EMAIL ADDRESS",
    contact_email_placeholder: "email@domain.com",
    contact_subject_label: "SUBJECT / TOPIC",
    contact_subject_placeholder: "Internship opportunity / project discussion",
    contact_message_label: "MESSAGE",
    contact_message_placeholder: "Write your message or collaboration details here...",
    contact_submit: "Send Message",
    contact_sending: "Sending...",
    contact_status: "Open for Internship & Project Collaboration Opportunities",
    contact_response_time: "Typically responds within 24 business hours.",

    // Footer
    footer_rights: "All Rights Reserved.",
    footer_system: "Designed with Google neo-brutalism system.",

    // Not Found Page
    not_found_title: "Page Not Found",
    not_found_desc:
      "The link you opened may have been moved or does not exist. Please return to the portfolio homepage.",
    not_found_home: "Back to Home",
  },
};

const LanguageContext = createContext(null);

// Global language state provider
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem("app_language");
      return saved === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });

  const setLanguage = useCallback((lang) => {
    const validLang = lang === "en" ? "en" : "id";
    setLanguageState(validLang);
    try {
      localStorage.setItem("app_language", validLang);
      document.documentElement.lang = validLang;
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "id" ? "en" : "id";
      try {
        localStorage.setItem("app_language", next);
        document.documentElement.lang = next;
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore DOM attribute errors
    }
  }, [language]);

  // Synchronize language across tabs and external storage changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (
        e.key === "app_language" &&
        (e.newValue === "en" || e.newValue === "id")
      ) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = useMemo(() => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.id;
    return (key, fallback = "") => dict[key] || fallback || key;
  }, [language]);

  const tText = useCallback(
    (text) => (language === "en" ? translateText(text, "en") : text),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      tText,
    }),
    [language, setLanguage, toggleLanguage, t, tText]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to access global language state
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if rendered outside provider
    return {
      language: "id",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key, fallback = "") =>
        TRANSLATIONS.id[key] || fallback || key,
      tText: (text) => text,
    };
  }
  return context;
}
