import { createClient } from "@supabase/supabase-js";
import {
  PERSONAL_INFO,
  PROJECTS,
  EXPERIENCE,
  SKILL_CATEGORIES,
  EDUCATION,
  CERTIFICATIONS,
  sortExperiencesLatestFirst,
} from "../data";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful null client if env vars are unset during dev
export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim().length > 0
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Dynamic cache keys for resilient offline and local fallback
const CACHE_KEYS = {
  SETTINGS: "portfolio_site_settings_cache",
  PROJECTS: "portfolio_projects_cache",
  EXPERIENCE: "portfolio_experience_cache",
  SKILLS: "portfolio_skill_categories_cache",
  EDUCATION: "portfolio_education_cache",
  CERTS: "portfolio_certifications_cache",
};

// Global event notifier for instant reactive UI updates
export function notifyDataChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_data_updated"));
  }
}

// Auth helper verifying current admin session
export async function checkIsAdmin() {
  if (!supabase) return true;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("id", session.user.id)
      .maybeSingle();

    return !error && !!data;
  } catch {
    return false;
  }
}

// Admin email password authentication
export async function signInAdmin(email, password) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Sign out current admin user
export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// Fetch site configuration with dynamic persistence
export async function getSiteSettings() {
  let cachedSettings = {};
  try {
    const raw = localStorage.getItem(CACHE_KEYS.SETTINGS);
    if (raw) cachedSettings = JSON.parse(raw);
  } catch {
    // Ignore error
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const mapped = {
          name: data.site_name,
          kicker: data.kicker,
          role: data.role,
          statusBadge: data.status_badge,
          headline: data.headline,
          headlineAccent: data.headline_accent,
          codeCardTitle: data.code_card_title,
          valueProp: data.value_prop,
          university: data.university,
          avatar: data.photo_url,
          cvUrl: data.cv_url,
          github: data.github_url,
          linkedin: data.linkedin_url,
          instagram:
            data.instagram_url ||
            PERSONAL_INFO.instagram ||
            "https://instagram.com/mraynarr",
          email: data.email,
          location: data.location,
          timezone: data.timezone,
          status: data.availability_status,
          aboutP1: data.about_p1,
          aboutP2: data.about_p2,
          aboutP3: data.about_p3,
          principleTitle: data.principle_title,
          principleQuote: data.principle_quote,
          customProjectCount: data.custom_project_count || "",
          customCertCount: data.custom_cert_count || "",
          startYear: data.start_year || "",
          codeQuality: data.code_quality || "",
          // Custom section headings with fallback chain
          aboutKicker:
            data.about_kicker ||
            cachedSettings.aboutKicker ||
            PERSONAL_INFO.aboutKicker,
          aboutTitle:
            data.about_title ||
            cachedSettings.aboutTitle ||
            PERSONAL_INFO.aboutTitle,
          aboutTitleAccent:
            data.about_title_accent ||
            cachedSettings.aboutTitleAccent ||
            PERSONAL_INFO.aboutTitleAccent,
          aboutSubtitle:
            data.about_subtitle ||
            cachedSettings.aboutSubtitle ||
            PERSONAL_INFO.aboutSubtitle,
          skillsKicker:
            data.skills_kicker ||
            cachedSettings.skillsKicker ||
            PERSONAL_INFO.skillsKicker,
          skillsTitle:
            data.skills_title ||
            cachedSettings.skillsTitle ||
            PERSONAL_INFO.skillsTitle,
          skillsTitleAccent:
            data.skills_title_accent ||
            cachedSettings.skillsTitleAccent ||
            PERSONAL_INFO.skillsTitleAccent,
          skillsSubtitle:
            data.skills_subtitle ||
            cachedSettings.skillsSubtitle ||
            PERSONAL_INFO.skillsSubtitle,
          projectsKicker:
            data.projects_kicker ||
            cachedSettings.projectsKicker ||
            PERSONAL_INFO.projectsKicker,
          projectsTitle:
            data.projects_title ||
            cachedSettings.projectsTitle ||
            PERSONAL_INFO.projectsTitle,
          projectsTitleAccent:
            data.projects_title_accent ||
            cachedSettings.projectsTitleAccent ||
            PERSONAL_INFO.projectsTitleAccent,
          projectsSubtitle:
            data.projects_subtitle ||
            cachedSettings.projectsSubtitle ||
            PERSONAL_INFO.projectsSubtitle,
          expKicker:
            data.exp_kicker ||
            cachedSettings.expKicker ||
            PERSONAL_INFO.expKicker,
          expTitle:
            data.exp_title ||
            cachedSettings.expTitle ||
            PERSONAL_INFO.expTitle,
          expTitleAccent:
            data.exp_title_accent ||
            cachedSettings.expTitleAccent ||
            PERSONAL_INFO.expTitleAccent,
          expSubtitle:
            data.exp_subtitle ||
            cachedSettings.expSubtitle ||
            PERSONAL_INFO.expSubtitle,
          certsKicker:
            data.certs_kicker ||
            cachedSettings.certsKicker ||
            PERSONAL_INFO.certsKicker,
          certsTitle:
            data.certs_title ||
            cachedSettings.certsTitle ||
            PERSONAL_INFO.certsTitle,
          certsTitleAccent:
            data.certs_title_accent ||
            cachedSettings.certsTitleAccent ||
            PERSONAL_INFO.certsTitleAccent,
          certsSubtitle:
            data.certs_subtitle ||
            cachedSettings.certsSubtitle ||
            PERSONAL_INFO.certsSubtitle,
          contactKicker:
            data.contact_kicker ||
            cachedSettings.contactKicker ||
            PERSONAL_INFO.contactKicker,
          contactTitle:
            data.contact_title ||
            cachedSettings.contactTitle ||
            PERSONAL_INFO.contactTitle,
          contactTitleAccent:
            data.contact_title_accent ||
            cachedSettings.contactTitleAccent ||
            PERSONAL_INFO.contactTitleAccent,
          contactSubtitle:
            data.contact_subtitle ||
            cachedSettings.contactSubtitle ||
            PERSONAL_INFO.contactSubtitle,
          numbersKicker:
            data.numbers_kicker ||
            cachedSettings.numbersKicker ||
            PERSONAL_INFO.numbersKicker,
          numbersTitle:
            data.numbers_title ||
            cachedSettings.numbersTitle ||
            PERSONAL_INFO.numbersTitle,
          stat1Value:
            data.stat1_value !== undefined &&
            data.stat1_value !== null &&
            data.stat1_value !== ""
              ? data.stat1_value
              : cachedSettings.stat1Value ||
                data.custom_project_count ||
                cachedSettings.customProjectCount ||
                PERSONAL_INFO.stat1Value,
          stat1Label:
            data.stat1_label ||
            cachedSettings.stat1Label ||
            PERSONAL_INFO.stat1Label,
          stat1Desc:
            data.stat1_desc ||
            cachedSettings.stat1Desc ||
            PERSONAL_INFO.stat1Desc,
          stat2Value:
            data.stat2_value !== undefined &&
            data.stat2_value !== null &&
            data.stat2_value !== ""
              ? data.stat2_value
              : cachedSettings.stat2Value ||
                data.custom_cert_count ||
                cachedSettings.customCertCount ||
                PERSONAL_INFO.stat2Value,
          stat2Label:
            data.stat2_label ||
            cachedSettings.stat2Label ||
            PERSONAL_INFO.stat2Label,
          stat2Desc:
            data.stat2_desc ||
            cachedSettings.stat2Desc ||
            PERSONAL_INFO.stat2Desc,
          stat3Value:
            data.stat3_value !== undefined &&
            data.stat3_value !== null &&
            data.stat3_value !== ""
              ? data.stat3_value
              : cachedSettings.stat3Value ||
                data.start_year ||
                cachedSettings.startYear ||
                PERSONAL_INFO.stat3Value,
          stat3Label:
            data.stat3_label ||
            cachedSettings.stat3Label ||
            PERSONAL_INFO.stat3Label,
          stat3Desc:
            data.stat3_desc ||
            cachedSettings.stat3Desc ||
            PERSONAL_INFO.stat3Desc,
          stat4Value:
            data.stat4_value !== undefined &&
            data.stat4_value !== null &&
            data.stat4_value !== ""
              ? data.stat4_value
              : cachedSettings.stat4Value ||
                data.code_quality ||
                cachedSettings.codeQuality ||
                PERSONAL_INFO.stat4Value,
          stat4Label:
            data.stat4_label ||
            cachedSettings.stat4Label ||
            PERSONAL_INFO.stat4Label,
          stat4Desc:
            data.stat4_desc ||
            cachedSettings.stat4Desc ||
            PERSONAL_INFO.stat4Desc,
          rawId: data.id,
        };
        try {
          localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(mapped));
        } catch {
          // Ignore storage quota
        }
        return mapped;
      }
    } catch {
      // Fall through to local cache
    }
  }

  return { ...PERSONAL_INFO, ...cachedSettings };
}

// Update site configuration
export async function saveSiteSettings(id, fields) {
  const current = await getSiteSettings();
  const updated = {
    ...current,
    ...fields,
    rawId: id || current.rawId || "default-site-settings",
  };

  try {
    localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }

  if (supabase) {
    try {
      const payload = {
        site_name: fields.name || updated.name,
        kicker: fields.kicker || updated.kicker,
        role: fields.role || updated.role || "",
        status_badge: fields.statusBadge || updated.statusBadge,
        headline: fields.headline || updated.headline,
        headline_accent: fields.headlineAccent || updated.headlineAccent,
        code_card_title:
          fields.codeCardTitle || updated.codeCardTitle || "raynar-dev.ts",
        value_prop: fields.valueProp || updated.valueProp,
        university: fields.university || updated.university,
        photo_url: fields.avatar || updated.avatar || "",
        cv_url: fields.cvUrl || updated.cvUrl || "",
        github_url: fields.github || updated.github || "",
        linkedin_url: fields.linkedin || updated.linkedin || "",
        instagram_url: fields.instagram || updated.instagram || "",
        email: fields.email || updated.email || "",
        location: fields.location || updated.location || "",
        timezone: fields.timezone || updated.timezone || "",
        availability_status: fields.status || updated.status || "",
        about_p1: fields.aboutP1 || updated.aboutP1 || "",
        about_p2: fields.aboutP2 || updated.aboutP2 || "",
        about_p3: fields.aboutP3 || updated.aboutP3 || "",
        principle_title: fields.principleTitle || updated.principleTitle || "",
        principle_quote: fields.principleQuote || updated.principleQuote || "",
        numbers_kicker:
          fields.numbersKicker || updated.numbersKicker || "BY THE NUMBERS",
        numbers_title:
          fields.numbersTitle ||
          updated.numbersTitle ||
          "Dampak & Pencapaian Riil",
        stat1_value:
          fields.stat1Value !== undefined
            ? fields.stat1Value
            : updated.stat1Value || "",
        stat1_label:
          fields.stat1Label !== undefined
            ? fields.stat1Label
            : updated.stat1Label || "",
        stat1_desc:
          fields.stat1Desc !== undefined
            ? fields.stat1Desc
            : updated.stat1Desc || "",
        stat2_value:
          fields.stat2Value !== undefined
            ? fields.stat2Value
            : updated.stat2Value || "",
        stat2_label:
          fields.stat2Label !== undefined
            ? fields.stat2Label
            : updated.stat2Label || "",
        stat2_desc:
          fields.stat2Desc !== undefined
            ? fields.stat2Desc
            : updated.stat2Desc || "",
        stat3_value:
          fields.stat3Value !== undefined
            ? fields.stat3Value
            : updated.stat3Value || "",
        stat3_label:
          fields.stat3Label !== undefined
            ? fields.stat3Label
            : updated.stat3Label || "",
        stat3_desc:
          fields.stat3Desc !== undefined
            ? fields.stat3Desc
            : updated.stat3Desc || "",
        stat4_value:
          fields.stat4Value !== undefined
            ? fields.stat4Value
            : updated.stat4Value || "",
        stat4_label:
          fields.stat4Label !== undefined
            ? fields.stat4Label
            : updated.stat4Label || "",
        stat4_desc:
          fields.stat4Desc !== undefined
            ? fields.stat4Desc
            : updated.stat4Desc || "",
        custom_project_count:
          fields.stat1Value ||
          fields.customProjectCount ||
          updated.stat1Value ||
          updated.customProjectCount ||
          "",
        custom_cert_count:
          fields.stat2Value ||
          fields.customCertCount ||
          updated.stat2Value ||
          updated.customCertCount ||
          "",
        start_year:
          fields.stat3Value ||
          fields.startYear ||
          updated.stat3Value ||
          updated.startYear ||
          "",
        code_quality:
          fields.stat4Value ||
          fields.codeQuality ||
          updated.stat4Value ||
          updated.codeQuality ||
          "",
        updated_at: new Date().toISOString(),
      };
      try {
        if (id && id !== "default-site-settings") {
          await supabase.from("site_settings").update(payload).eq("id", id);
        } else {
          await supabase.from("site_settings").upsert(payload);
        }
      } catch {
        const fallback = { ...payload };
        delete fallback.stat1_value;
        delete fallback.stat1_label;
        delete fallback.stat1_desc;
        delete fallback.stat2_value;
        delete fallback.stat2_label;
        delete fallback.stat2_desc;
        delete fallback.stat3_value;
        delete fallback.stat3_label;
        delete fallback.stat3_desc;
        delete fallback.stat4_value;
        delete fallback.stat4_label;
        delete fallback.stat4_desc;
        if (id && id !== "default-site-settings") {
          await supabase.from("site_settings").update(fallback).eq("id", id);
        } else {
          await supabase.from("site_settings").upsert(fallback);
        }
      }
    } catch {
      // Retain local cached state
    }
  }

  notifyDataChanged();
  return updated;
}

// Fetch published projects with dynamic persistence
export async function getProjects() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((p) => ({
          id: p.id,
          title: p.title,
          label: p.label,
          featured: p.featured,
          image: p.image,
          problem: p.problem,
          solution: p.solution,
          impact: p.impact,
          badges: p.badges || [],
          demoUrl: p.demo_url,
          repoNotice: p.repo_notice,
          repoReason: p.repo_reason,
          status: p.status,
          orderIndex: p.order_index ?? 0,
          caseStudy: {
            role: p.case_study_role,
            client: p.case_study_client,
            duration: p.case_study_duration,
            background: p.case_study_background,
            solution: p.case_study_solution,
            architecture: p.case_study_architecture,
            impact: p.case_study_impact,
          },
        }));
        try {
          localStorage.setItem(CACHE_KEYS.PROJECTS, JSON.stringify(mapped));
        } catch {
          // Ignore
        }
        return mapped;
      }
    } catch {
      // Fall through to cache
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.PROJECTS);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore
  }
  return PROJECTS;
}

// Create or update project
export async function upsertProject(project) {
  const current = await getProjects();
  const id = project.id || `project-${Date.now()}`;
  const payload = { ...project, id };
  const exists = current.some((p) => p.id === id);
  const updated = exists
    ? current.map((p) => (p.id === id ? payload : p))
    : [...current, payload];

  try {
    localStorage.setItem(CACHE_KEYS.PROJECTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      const dbPayload = {
        id: payload.id,
        title: payload.title,
        label: payload.label,
        featured: Boolean(payload.featured),
        image: payload.image || "",
        problem: payload.problem,
        solution: payload.solution,
        impact: payload.impact,
        badges: payload.badges || [],
        demo_url: payload.demoUrl || null,
        repo_notice: payload.repoNotice,
        repo_reason: payload.repoReason,
        case_study_role: payload.caseStudy?.role || "Full-Stack Developer",
        case_study_client: payload.caseStudy?.client || null,
        case_study_duration: payload.caseStudy?.duration || "2024",
        case_study_background: payload.caseStudy?.background || null,
        case_study_solution: payload.caseStudy?.solution || null,
        case_study_architecture: payload.caseStudy?.architecture || null,
        case_study_impact: payload.caseStudy?.impact || null,
        status: payload.status || "published",
        order_index: payload.orderIndex ?? 0,
      };
      await supabase.from("projects").upsert(dbPayload);
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete project by identifier
export async function deleteProject(id) {
  const current = await getProjects();
  const updated = current.filter((p) => p.id !== id);

  try {
    localStorage.setItem(CACHE_KEYS.PROJECTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch {
      // Retain local deletion
    }
  }

  notifyDataChanged();
}

// Reorder projects array and persist new order_index
export async function reorderProjects(orderedList = []) {
  const updated = orderedList.map((item, idx) => ({
    ...item,
    orderIndex: idx + 1,
  }));

  try {
    localStorage.setItem(CACHE_KEYS.PROJECTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      const updates = updated.map((item) => ({
        id: item.id,
        title: item.title,
        label: item.label,
        featured: Boolean(item.featured),
        image: item.image || "",
        problem: item.problem || "",
        solution: item.solution || "",
        impact: item.impact || "",
        badges: item.badges || [],
        demo_url: item.demoUrl || null,
        repo_notice: item.repoNotice,
        repo_reason: item.repoReason,
        case_study_role: item.caseStudy?.role || "Full-Stack Developer",
        case_study_client: item.caseStudy?.client || null,
        case_study_duration: item.caseStudy?.duration || "2024",
        case_study_background: item.caseStudy?.background || null,
        case_study_solution: item.caseStudy?.solution || null,
        case_study_architecture: item.caseStudy?.architecture || null,
        case_study_impact: item.caseStudy?.impact || null,
        status: item.status || "published",
        order_index: item.orderIndex,
      }));

      await Promise.all(
        updates.map((dbPayload) =>
          supabase.from("projects").upsert(dbPayload)
        )
      );
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return updated;
}

// Fetch experience entries with dynamic persistence
export async function getExperience() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const normalized = data.map((item) => ({
          ...item,
          category: item.category || item.type || "Organisasi",
          type: item.type || item.category || "Organisasi",
          active: item.active !== undefined ? item.active : item.current,
          current: item.current !== undefined ? item.current : item.active,
          photoAlt: item.photoAlt || item.photo_alt || "",
          photo_alt: item.photo_alt || item.photoAlt || "",
        }));
        const sorted = sortExperiencesLatestFirst(normalized);
        try {
          localStorage.setItem(CACHE_KEYS.EXPERIENCE, JSON.stringify(sorted));
        } catch {
          // Ignore
        }
        return sorted;
      }
    } catch {
      // Fall through to cache
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.EXPERIENCE);
    if (cached) return sortExperiencesLatestFirst(JSON.parse(cached));
  } catch {
    // Fallback to initial data
  }
  return sortExperiencesLatestFirst(EXPERIENCE);
}

// Create or update experience entry
export async function upsertExperience(item) {
  const current = await getExperience();
  const id = item.id || `exp-${Date.now()}`;
  const payload = {
    ...item,
    id,
    category: item.category || item.type || "Organisasi",
    type: item.type || item.category || "Organisasi",
    active: item.active !== undefined ? item.active : item.current,
    current: item.current !== undefined ? item.current : item.active,
    photoAlt: item.photoAlt || item.photo_alt || "",
  };
  const exists = current.some(
    (e) =>
      e.id === id ||
      (item.role && e.role === item.role && e.org === item.org)
  );
  const updated = exists
    ? current.map((e) =>
        e.id === id ||
        (item.role && e.role === item.role && e.org === item.org)
          ? payload
          : e
      )
    : [...current, payload];

  try {
    localStorage.setItem(
      CACHE_KEYS.EXPERIENCE,
      JSON.stringify(sortExperiencesLatestFirst(updated))
    );
  } catch (err) {
    // Evict non-essential items if quota exceeded
    if (err && err.name === "QuotaExceededError") {
      try {
        localStorage.removeItem("portfolio_contact_messages");
        localStorage.setItem(
          CACHE_KEYS.EXPERIENCE,
          JSON.stringify(sortExperiencesLatestFirst(updated))
        );
      } catch {
        // Retain local memory state
      }
    }
  }

  if (supabase) {
    try {
      const isUuid =
        item.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          item.id
        );
      const dbPayload = {
        ...(isUuid ? { id: item.id } : {}),
        role: item.role,
        org: item.org,
        period: item.period,
        type: item.type || item.category || "Organisasi",
        current: Boolean(item.active ?? item.current ?? false),
        bullets: Array.isArray(item.bullets) ? item.bullets : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        photo: item.photo || "",
        photo_alt: item.photo_alt || item.photoAlt || "",
        order_index: typeof item.order_index === "number" ? item.order_index : 0,
      };
      await supabase.from("experience").upsert(dbPayload);
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete experience entry
export async function deleteExperience(id) {
  const current = await getExperience();
  const updated = current.filter((e) => e.id !== id && e.role !== id);

  try {
    localStorage.setItem(
      CACHE_KEYS.EXPERIENCE,
      JSON.stringify(sortExperiencesLatestFirst(updated))
    );
  } catch (err) {
    // Evict non-essential items if quota exceeded
    if (err && err.name === "QuotaExceededError") {
      try {
        localStorage.removeItem("portfolio_contact_messages");
        localStorage.setItem(
          CACHE_KEYS.EXPERIENCE,
          JSON.stringify(sortExperiencesLatestFirst(updated))
        );
      } catch {
        // Retain local memory state
      }
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) {
        await supabase.from("experience").delete().eq("role", id);
      }
    } catch {
      // Retain local deletion
    }
  }

  notifyDataChanged();
}

// Reorder experiences array and persist new order_index
export async function reorderExperience(orderedList = []) {
  const updated = orderedList.map((item, idx) => ({
    ...item,
    order_index: idx + 1,
  }));

  try {
    localStorage.setItem(
      CACHE_KEYS.EXPERIENCE,
      JSON.stringify(updated)
    );
  } catch (err) {
    // Evict non-essential items if quota exceeded
    if (err && err.name === "QuotaExceededError") {
      try {
        localStorage.removeItem("portfolio_contact_messages");
        localStorage.setItem(CACHE_KEYS.EXPERIENCE, JSON.stringify(updated));
      } catch {
        // Retain local memory state
      }
    }
  }

  if (supabase) {
    try {
      const updates = updated.map((item) => {
        const isUuid =
          item.id &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            item.id
          );
        return {
          ...(isUuid ? { id: item.id } : {}),
          role: item.role,
          org: item.org,
          period: item.period,
          type: item.type || item.category || "Organisasi",
          current: Boolean(item.active ?? item.current ?? false),
          bullets: Array.isArray(item.bullets) ? item.bullets : [],
          tags: Array.isArray(item.tags) ? item.tags : [],
          photo: item.photo || "",
          photo_alt: item.photo_alt || item.photoAlt || "",
          order_index: item.order_index,
        };
      });

      await Promise.all(
        updates.map((dbPayload) =>
          supabase.from("experience").upsert(dbPayload)
        )
      );
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return updated;
}

// Fetch skill categories with dynamic persistence
export async function getSkillCategories() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        try {
          localStorage.setItem(CACHE_KEYS.SKILLS, JSON.stringify(data));
        } catch {
          // Ignore
        }
        return data;
      }
    } catch {
      // Fall through
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.SKILLS);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore
  }
  return SKILL_CATEGORIES;
}

// Create or update skill category
export async function upsertSkillCategory(cat) {
  const current = await getSkillCategories();
  const id = cat.id || `cat-${Date.now()}`;
  const payload = { ...cat, id };
  const exists = current.some((c) => c.id === id || c.name === cat.name);
  const updated = exists
    ? current.map((c) => (c.id === id || c.name === cat.name ? payload : c))
    : [...current, payload];

  try {
    localStorage.setItem(CACHE_KEYS.SKILLS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      await supabase.from("skill_categories").upsert(cat);
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return payload;
}

// Batch reorder skill categories and persist
export async function reorderSkillCategories(orderedList = []) {
  const updated = orderedList.map((item, idx) => ({
    ...item,
    order_index: idx + 1,
  }));

  try {
    localStorage.setItem(CACHE_KEYS.SKILLS, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }

  if (supabase) {
    try {
      const updates = updated.map((item) => {
        const isUuid =
          item.id &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            item.id
          );
        return {
          ...(isUuid ? { id: item.id } : {}),
          name: item.name,
          skills: item.skills || [],
          order_index: item.order_index,
        };
      });

      await supabase.from("skill_categories").upsert(updates);
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return updated;
}

// Delete skill category
export async function deleteSkillCategory(id) {
  const current = await getSkillCategories();
  const updated = current.filter((c) => c.id !== id && c.name !== id);

  try {
    localStorage.setItem(CACHE_KEYS.SKILLS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .eq("id", id);
      if (error) {
        await supabase.from("skill_categories").delete().eq("name", id);
      }
    } catch {
      // Retain local deletion
    }
  }

  notifyDataChanged();
}

// Fetch education list with dynamic persistence
export async function getEducation() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((item, idx) => {
          const fallback = EDUCATION[idx] || {};
          return {
            ...item,
            score: item.score || item.ipk || fallback.score || "",
            scoreLabel:
              item.score_label || item.scoreLabel || fallback.scoreLabel || "",
          };
        });
        try {
          localStorage.setItem(CACHE_KEYS.EDUCATION, JSON.stringify(mapped));
        } catch {
          // Ignore
        }
        return mapped;
      }
    } catch {
      // Fall through
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.EDUCATION);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore
  }
  return EDUCATION;
}

// Upsert education entry
export async function upsertEducation(item) {
  const current = await getEducation();
  const id = item.id || `edu-${Date.now()}`;
  const payload = { ...item, id };
  const exists = current.some((e) => e.id === id || e.school === item.school);
  const updated = exists
    ? current.map((e) =>
        e.id === id || e.school === item.school ? payload : e
      )
    : [...current, payload];

  try {
    localStorage.setItem(CACHE_KEYS.EDUCATION, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      const dbPayload = {
        id: payload.id,
        school: payload.school,
        degree: payload.degree,
        period: payload.period,
        focus: payload.focus,
        active: Boolean(payload.active),
        order_index: payload.order_index ?? payload.orderIndex ?? 0,
        score: payload.score || payload.ipk || null,
        score_label: payload.scoreLabel || payload.score_label || null,
      };
      const { error } = await supabase.from("education").upsert(dbPayload);
      if (error && (error.message.includes("score") || error.code === "42703")) {
        const fallback = { ...dbPayload };
        delete fallback.score;
        delete fallback.score_label;
        await supabase.from("education").upsert(fallback);
      }
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete education entry
export async function deleteEducation(id) {
  const current = await getEducation();
  const updated = current.filter((e) => e.id !== id && e.school !== id);

  try {
    localStorage.setItem(CACHE_KEYS.EDUCATION, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      await supabase.from("education").delete().eq("id", id);
    } catch {
      // Retain local deletion
    }
  }

  notifyDataChanged();
}

// Fetch certifications with dynamic persistence
export async function getCertifications() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((c) => ({
          title: c.title,
          issuer: c.issuer,
          provider: c.provider,
          credentialId: c.credential_id,
          credentialUrl: c.credential_url,
          date: c.date,
          id: c.id,
          orderIndex: c.order_index ?? 0,
          image: c.image_url || c.image || "",
        }));
        try {
          localStorage.setItem(CACHE_KEYS.CERTS, JSON.stringify(mapped));
        } catch {
          // Ignore
        }
        return mapped;
      }
    } catch {
      // Fall through
    }
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.CERTS);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore
  }
  return CERTIFICATIONS;
}

// Upsert certification entry
export async function upsertCertification(cert) {
  const current = await getCertifications();
  const id = cert.id || `cert-${Date.now()}`;
  const payload = { ...cert, id };
  const exists = current.some(
    (c) => c.id === id || c.credentialId === cert.credentialId
  );
  const updated = exists
    ? current.map((c) =>
        c.id === id || c.credentialId === cert.credentialId ? payload : c
      )
    : [...current, payload];

  try {
    localStorage.setItem(CACHE_KEYS.CERTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      const dbPayload = {
        id: payload.id,
        title: payload.title,
        issuer: payload.issuer,
        provider: payload.provider,
        credential_id: payload.credentialId,
        credential_url: payload.credentialUrl,
        date: payload.date,
        order_index: payload.orderIndex ?? 0,
        image_url: payload.image || payload.imageUrl || null,
      };
      const { error } = await supabase.from("certifications").upsert(dbPayload);
      if (error && error.message && error.message.includes("image_url")) {
        const fallbackPayload = { ...dbPayload };
        delete fallbackPayload.image_url;
        await supabase.from("certifications").upsert(fallbackPayload);
      }
    } catch {
      // Retain local state
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete certification entry
export async function deleteCertification(id) {
  const current = await getCertifications();
  const updated = current.filter((c) => c.id !== id && c.credentialId !== id);

  try {
    localStorage.setItem(CACHE_KEYS.CERTS, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  if (supabase) {
    try {
      await supabase.from("certifications").delete().eq("id", id);
    } catch {
      // Retain local deletion
    }
  }

  notifyDataChanged();
}

// Submit visitor contact form
export async function submitContactMessage(form) {
  if (supabase) {
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: form.name,
          email: form.email,
          subject: form.subject || "Pesan dari Portofolio",
          message: form.message,
        },
      ]);
      if (!error) return { success: true };
    } catch {
      // Fall through to local simulation
    }
  }

  // Save to local contact messages list
  try {
    const list = JSON.parse(
      localStorage.getItem("portfolio_contact_messages") || "[]"
    );
    list.unshift({
      id: `msg-${Date.now()}`,
      name: form.name,
      email: form.email,
      subject: form.subject || "Pesan dari Portofolio",
      message: form.message,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("portfolio_contact_messages", JSON.stringify(list));
  } catch {
    // Ignore
  }

  return { success: true, simulated: true };
}

// Fetch contact messages for admin
export async function getContactMessages() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) return data;
    } catch {
      // Fall through
    }
  }

  try {
    return JSON.parse(
      localStorage.getItem("portfolio_contact_messages") || "[]"
    );
  } catch {
    return [];
  }
}

// Upload file to Supabase Storage or convert to Data URL for offline
export async function uploadStorageFile(bucket, filePath, file) {
  if (supabase) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (publicUrl) return publicUrl;
      }
    } catch {
      // Fallback to local Data URL
    }
  }

  // Convert to local Data URL so images display without cloud bucket
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
