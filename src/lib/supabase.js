/* global __SUPABASE_URL__, __SUPABASE_PUBLISHABLE_KEY__ */
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
import {
  getLocalItem,
  setLocalItem,
  removeLocalItem,
  broadcastDataSync,
} from "./localDb";

// Public RLS-protected Supabase project defaults for browser client reads
const PUBLIC_SUPABASE_URL = "https://jodkbpgzoptjibxkbbks.supabase.co";
const PUBLIC_SUPABASE_KEY = "sb_publishable_FQJSWNQO6wfOEwLdVxjoFw_8nBQWR9l";

const envUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof __SUPABASE_URL__ !== "undefined" ? __SUPABASE_URL__ : "");
const envKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof __SUPABASE_PUBLISHABLE_KEY__ !== "undefined"
    ? __SUPABASE_PUBLISHABLE_KEY__
    : "");

const supabaseUrl = (envUrl || PUBLIC_SUPABASE_URL).trim();
const supabaseAnonKey = (envKey || PUBLIC_SUPABASE_KEY).trim();

// Initialize Supabase browser client (protected by RLS policies)
export const supabase =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

const PRE_CLOUD_BACKUP_KEY = "portfolio_pre_cloud_backup";
let preCloudPromise = null;

// Preserve unsynced local data once before first Supabase cloud read
function preserveLocalBeforeCloudSync() {
  if (!supabase) return Promise.resolve();
  if (preCloudPromise) return preCloudPromise;

  preCloudPromise = (async () => {
    try {
      const existingBackup = await getLocalItem(PRE_CLOUD_BACKUP_KEY);
      if (existingBackup) return;

      const [settings, projects, experience, skills, education, certifications] =
        await Promise.all([
          getLocalItem(CACHE_KEYS.SETTINGS),
          getLocalItem(CACHE_KEYS.PROJECTS),
          getLocalItem(CACHE_KEYS.EXPERIENCE),
          getLocalItem(CACHE_KEYS.SKILLS),
          getLocalItem(CACHE_KEYS.EDUCATION),
          getLocalItem(CACHE_KEYS.CERTS),
        ]);

      const hasLocal =
        Boolean(settings) ||
        (Array.isArray(projects) && projects.length > 0) ||
        (Array.isArray(experience) && experience.length > 0) ||
        (Array.isArray(certifications) && certifications.length > 0);

      if (hasLocal) {
        await setLocalItem(PRE_CLOUD_BACKUP_KEY, {
          version: 1,
          savedAt: new Date().toISOString(),
          settings: settings || PERSONAL_INFO,
          projects: projects || PROJECTS,
          experience: experience || EXPERIENCE,
          skills: skills || SKILL_CATEGORIES,
          education: education || EDUCATION,
          certifications: certifications || CERTIFICATIONS,
        });
      }
    } catch {
      // Ignore non-critical snapshot errors
    }
  })();

  return preCloudPromise;
}

// Storage keys shared across IndexedDB and legacy localStorage migration
const CACHE_KEYS = {
  SETTINGS: "portfolio_site_settings_cache",
  PROJECTS: "portfolio_projects_cache",
  EXPERIENCE: "portfolio_experience_cache",
  SKILLS: "portfolio_skill_categories_cache",
  EDUCATION: "portfolio_education_cache",
  CERTS: "portfolio_certifications_cache",
  MESSAGES: "portfolio_contact_messages",
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(value) {
  return typeof value === "string" && UUID_REGEX.test(value);
}

// Generate RFC4122 UUID so local records stay compatible with Postgres uuid
export function generateRecordId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Normalize experience object across local cache and Supabase schemas
function normalizeExperienceItem(item) {
  const activeVal =
    item.active !== undefined ? Boolean(item.active) : Boolean(item.current);
  return {
    ...item,
    category: item.category || item.type || "Organisasi",
    type: item.type || item.category || "Organisasi",
    active: activeVal,
    current: activeVal,
    bullets: Array.isArray(item.bullets) ? item.bullets : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    photo: item.photo || "",
    photoAlt: item.photoAlt || item.photo_alt || "",
    photo_alt: item.photo_alt || item.photoAlt || "",
    order_index: typeof item.order_index === "number" ? item.order_index : 0,
  };
}

// Compress oversized images without cropping to keep storage fast and lean
function compressImageToDataUrl(file, maxDim = 1400, quality = 0.84) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = () => {
      const rawDataUrl = reader.result;
      if (typeof rawDataUrl !== "string") {
        reject(new Error("Gagal membaca file gambar."));
        return;
      }
      // Keep small images or SVGs untouched
      if (file.type === "image/svg+xml" || file.size <= 180 * 1024) {
        resolve(rawDataUrl);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        try {
          const nw = img.naturalWidth || 1;
          const nh = img.naturalHeight || 1;
          const scale = Math.min(1, maxDim / Math.max(nw, nh));
          const w = Math.max(1, Math.round(nw * scale));
          const h = Math.max(1, Math.round(nh * scale));

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Try WebP first to preserve alpha at small size, fallback to JPEG
          ctx.drawImage(img, 0, 0, w, h);
          const webpUrl = canvas.toDataURL("image/webp", quality);
          if (
            webpUrl.startsWith("data:image/webp") &&
            webpUrl.length < rawDataUrl.length
          ) {
            resolve(webpUrl);
            return;
          }

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const jpegUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(jpegUrl.length < rawDataUrl.length ? jpegUrl : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// Global event notifier for instant reactive UI updates across tabs
export function notifyDataChanged() {
  broadcastDataSync();
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
  await preserveLocalBeforeCloudSync();
  const cachedSettings = (await getLocalItem(CACHE_KEYS.SETTINGS)) || {};

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
          await setLocalItem(CACHE_KEYS.SETTINGS, mapped);
        } catch {
          // Ignore non-critical read cache failure
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

  await setLocalItem(CACHE_KEYS.SETTINGS, updated);

  if (supabase) {
    const payload = {
      site_name: fields.name || updated.name || PERSONAL_INFO.name,
      kicker:
        fields.kicker ||
        updated.kicker ||
        "SISTEM INFORMASI & SOFTWARE ENGINEER",
      role: fields.role || updated.role || "",
      status_badge:
        fields.statusBadge || updated.statusBadge || "UPN Veteran Jawa Timur",
      headline: fields.headline || updated.headline || "Muhammad Raynar",
      headline_accent:
        fields.headlineAccent || updated.headlineAccent || "Hammam",
      code_card_title:
        fields.codeCardTitle || updated.codeCardTitle || "raynar-dev.ts",
      value_prop:
        fields.valueProp || updated.valueProp || PERSONAL_INFO.valueProp,
      university:
        fields.university || updated.university || PERSONAL_INFO.university,
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

    const targetId = isValidUuid(id) ? id : null;
    const { error } = targetId
      ? await supabase.from("site_settings").update(payload).eq("id", targetId)
      : await supabase.from("site_settings").upsert(payload);

    if (error && (error.code === "42703" || error.message?.includes("column"))) {
      const fallback = { ...payload };
      [
        "stat1_value",
        "stat1_label",
        "stat1_desc",
        "stat2_value",
        "stat2_label",
        "stat2_desc",
        "stat3_value",
        "stat3_label",
        "stat3_desc",
        "stat4_value",
        "stat4_label",
        "stat4_desc",
      ].forEach((col) => delete fallback[col]);
      const retry = targetId
        ? await supabase
          .from("site_settings")
          .update(fallback)
          .eq("id", targetId)
        : await supabase.from("site_settings").upsert(fallback);
      if (retry.error) {
        throw new Error(retry.error.message || "Gagal menyimpan ke Supabase.");
      }
    } else if (error) {
      throw new Error(error.message || "Gagal menyimpan ke Supabase.");
    }
  }

  notifyDataChanged();
  return updated;
}

// Parse JSON-encoded architecture lists returned as strings by Postgres
function parseArchitectureField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Keep raw string when not valid JSON
      }
    }
  }
  return value;
}

// Fetch published projects with dynamic persistence
export async function getProjects() {
  await preserveLocalBeforeCloudSync();
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
            architecture: parseArchitectureField(p.case_study_architecture),
            impact: p.case_study_impact,
          },
        }));
        try {
          await setLocalItem(CACHE_KEYS.PROJECTS, mapped);
        } catch {
          // Ignore non-critical read cache failure
        }
        return mapped;
      }
    } catch {
      // Fall through to local store
    }
  }

  const cached = await getLocalItem(CACHE_KEYS.PROJECTS);
  if (Array.isArray(cached) && cached.length > 0) return cached;
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

  await setLocalItem(CACHE_KEYS.PROJECTS, updated);

  if (supabase) {
    const dbPayload = {
      id: payload.id,
      title: payload.title || "Tanpa Judul",
      label: payload.label || "Web App",
      featured: Boolean(payload.featured),
      image: payload.image || "",
      problem: payload.problem || "",
      solution: payload.solution || "",
      impact: payload.impact || "",
      badges: Array.isArray(payload.badges) ? payload.badges : [],
      demo_url: payload.demoUrl || null,
      repo_notice:
        payload.repoNotice ||
        payload.repo_notice ||
        "Repositori Privat (Proyek Komersial / Institusi)",
      repo_reason:
        payload.repoReason ||
        payload.repo_reason ||
        "Kode sumber dilindungi NDA atau hak cipta klien.",
      case_study_role: payload.caseStudy?.role || "Full-Stack Developer",
      case_study_client: payload.caseStudy?.client || null,
      case_study_duration: payload.caseStudy?.duration || "2024",
      case_study_background: payload.caseStudy?.background || null,
      case_study_solution: payload.caseStudy?.solution || null,
      case_study_architecture: payload.caseStudy?.architecture || null,
      case_study_impact: payload.caseStudy?.impact || null,
      status: payload.status === "draft" ? "draft" : "published",
      order_index: payload.orderIndex ?? 0,
    };
    const { error } = await supabase.from("projects").upsert(dbPayload);
    if (error) {
      throw new Error(error.message || "Gagal menyimpan proyek ke Supabase.");
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete project by identifier
export async function deleteProject(id) {
  const current = await getProjects();
  const updated = current.filter((p) => p.id !== id);

  await setLocalItem(CACHE_KEYS.PROJECTS, updated);

  if (supabase) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      throw new Error(error.message || "Gagal menghapus proyek di Supabase.");
    }
  }

  notifyDataChanged();
}

// Delete multiple projects in one batch across local cache and Supabase
export async function deleteProjectsBulk(ids = []) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const current = await getProjects();
  const idSet = new Set(uniqueIds);
  const updated = current.filter((p) => !idSet.has(p.id));
  await setLocalItem(CACHE_KEYS.PROJECTS, updated);

  if (supabase) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .in("id", uniqueIds);
    if (error) {
      throw new Error(error.message || "Gagal menghapus proyek di Supabase.");
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
}

// Reorder projects array and persist new order_index
export async function reorderProjects(orderedList = []) {
  const updated = orderedList.map((item, idx) => ({
    ...item,
    orderIndex: idx + 1,
  }));

  await setLocalItem(CACHE_KEYS.PROJECTS, updated);

  if (supabase) {
    const updates = updated.map((item) => ({
      id: item.id,
      title: item.title || "Tanpa Judul",
      label: item.label || "Web App",
      featured: Boolean(item.featured),
      image: item.image || "",
      problem: item.problem || "",
      solution: item.solution || "",
      impact: item.impact || "",
      badges: Array.isArray(item.badges) ? item.badges : [],
      demo_url: item.demoUrl || null,
      repo_notice:
        item.repoNotice ||
        item.repo_notice ||
        "Repositori Privat (Proyek Komersial / Institusi)",
      repo_reason:
        item.repoReason ||
        item.repo_reason ||
        "Kode sumber dilindungi NDA atau hak cipta klien.",
      case_study_role: item.caseStudy?.role || "Full-Stack Developer",
      case_study_client: item.caseStudy?.client || null,
      case_study_duration: item.caseStudy?.duration || "2024",
      case_study_background: item.caseStudy?.background || null,
      case_study_solution: item.caseStudy?.solution || null,
      case_study_architecture: item.caseStudy?.architecture || null,
      case_study_impact: item.caseStudy?.impact || null,
      status: item.status === "draft" ? "draft" : "published",
      order_index: item.orderIndex,
    }));

    const { error } = await supabase.from("projects").upsert(updates);
    if (error) {
      throw new Error(error.message || "Gagal memperbarui urutan proyek.");
    }
  }

  notifyDataChanged();
  return updated;
}

// Fetch experience entries with dynamic persistence
export async function getExperience() {
  await preserveLocalBeforeCloudSync();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizeExperienceItem);
        const sorted = sortExperiencesLatestFirst(normalized);
        try {
          await setLocalItem(CACHE_KEYS.EXPERIENCE, sorted);
        } catch {
          // Ignore non-critical read cache failure
        }
        return sorted;
      }
    } catch {
      // Fall through to local store
    }
  }

  const cached = await getLocalItem(CACHE_KEYS.EXPERIENCE);
  if (Array.isArray(cached) && cached.length > 0) {
    return sortExperiencesLatestFirst(cached.map(normalizeExperienceItem));
  }
  return sortExperiencesLatestFirst(EXPERIENCE.map(normalizeExperienceItem));
}

// Create or update experience entry
export async function upsertExperience(item) {
  const current = await getExperience();
  const id = item.id || generateRecordId();
  const payload = normalizeExperienceItem({ ...item, id });

  const hasIdMatch = current.some((e) => e.id && e.id === id);
  const matchEntry = (e) =>
    hasIdMatch
      ? e.id === id
      : Boolean(
        !item.id &&
        item.role &&
        item.org &&
        e.role === item.role &&
        e.org === item.org
      );

  const exists = current.some(matchEntry);
  const updated = exists
    ? current.map((e) => (matchEntry(e) ? payload : e))
    : [...current, payload];

  const sorted = sortExperiencesLatestFirst(updated);
  await setLocalItem(CACHE_KEYS.EXPERIENCE, sorted);

  if (supabase) {
    const dbPayload = {
      ...(isValidUuid(id) ? { id } : {}),
      role: payload.role,
      org: payload.org,
      org_url: payload.org_url || null,
      period: payload.period,
      type: payload.type,
      category: payload.category || null,
      current: Boolean(payload.active),
      bullets: payload.bullets,
      tags: payload.tags,
      photo: payload.photo || "",
      photo_alt: payload.photoAlt || "",
      order_index: payload.order_index,
    };
    let res = await supabase
      .from("experience")
      .upsert(dbPayload)
      .select()
      .maybeSingle();

    if (
      res.error &&
      (res.error.code === "42703" || res.error.message?.includes("column"))
    ) {
      const fallback = { ...dbPayload };
      delete fallback.category;
      delete fallback.org_url;
      res = await supabase
        .from("experience")
        .upsert(fallback)
        .select()
        .maybeSingle();
    }

    if (res.error) {
      throw new Error(
        res.error.message || "Gagal menyimpan pengalaman ke server."
      );
    }
    if (res.data && res.data.id && res.data.id !== id) {
      const synced = sorted.map((e) =>
        e.id === id ? { ...payload, id: res.data.id } : e
      );
      await setLocalItem(CACHE_KEYS.EXPERIENCE, synced);
      notifyDataChanged();
      return { ...payload, id: res.data.id };
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete experience entry
export async function deleteExperience(id) {
  const current = await getExperience();
  const updated = current.filter((e) => e.id !== id && e.role !== id);

  await setLocalItem(
    CACHE_KEYS.EXPERIENCE,
    sortExperiencesLatestFirst(updated)
  );

  if (supabase) {
    const { error } = isValidUuid(id)
      ? await supabase.from("experience").delete().eq("id", id)
      : await supabase.from("experience").delete().eq("role", id);
    if (error) {
      throw new Error(error.message || "Gagal menghapus pengalaman di server.");
    }
  }

  notifyDataChanged();
}

// Delete multiple experiences in one batch across local cache and Supabase
export async function deleteExperiencesBulk(ids = []) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const current = await getExperience();
  const idSet = new Set(uniqueIds);
  const updated = current.filter(
    (e) => !idSet.has(e.id) && !idSet.has(e.role)
  );
  await setLocalItem(
    CACHE_KEYS.EXPERIENCE,
    sortExperiencesLatestFirst(updated)
  );

  if (supabase) {
    const uuidIds = uniqueIds.filter(isValidUuid);
    const nonUuidRoles = uniqueIds.filter((val) => !isValidUuid(val));
    if (uuidIds.length > 0) {
      const { error } = await supabase
        .from("experience")
        .delete()
        .in("id", uuidIds);
      if (error) {
        throw new Error(
          error.message || "Gagal menghapus pengalaman di server."
        );
      }
    }
    if (nonUuidRoles.length > 0) {
      const { error } = await supabase
        .from("experience")
        .delete()
        .in("role", nonUuidRoles);
      if (error) {
        throw new Error(
          error.message || "Gagal menghapus pengalaman di server."
        );
      }
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
}

// Reorder experiences array and persist new order_index atomically
export async function reorderExperience(orderedList = []) {
  const updated = orderedList.map((item, idx) =>
    normalizeExperienceItem({
      ...item,
      id: item.id || generateRecordId(),
      order_index: idx + 1,
    })
  );

  await setLocalItem(CACHE_KEYS.EXPERIENCE, updated);

  if (supabase) {
    const syncedList = [...updated];
    for (let i = 0; i < updated.length; i += 1) {
      const item = updated[i];
      const dbPayload = {
        ...(isValidUuid(item.id) ? { id: item.id } : {}),
        role: item.role,
        org: item.org,
        org_url: item.org_url || null,
        period: item.period,
        type: item.type,
        category: item.category || null,
        current: Boolean(item.active),
        bullets: item.bullets,
        tags: item.tags,
        photo: item.photo || "",
        photo_alt: item.photoAlt || "",
        order_index: item.order_index,
      };
      let res = await supabase
        .from("experience")
        .upsert(dbPayload)
        .select("id")
        .maybeSingle();

      if (
        res.error &&
        (res.error.code === "42703" || res.error.message?.includes("column"))
      ) {
        const fallback = { ...dbPayload };
        delete fallback.category;
        delete fallback.org_url;
        res = await supabase
          .from("experience")
          .upsert(fallback)
          .select("id")
          .maybeSingle();
      }

      if (res.error) {
        throw new Error(
          res.error.message || "Gagal menyimpan urutan pengalaman ke server."
        );
      }
      if (res.data && res.data.id && res.data.id !== item.id) {
        syncedList[i] = { ...item, id: res.data.id };
      }
    }
    await setLocalItem(CACHE_KEYS.EXPERIENCE, syncedList);
    notifyDataChanged();
    return syncedList;
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
          await setLocalItem(CACHE_KEYS.SKILLS, data);
        } catch {
          // Ignore non-critical read cache failure
        }
        return data;
      }
    } catch {
      // Fall through to local store
    }
  }

  const cached = await getLocalItem(CACHE_KEYS.SKILLS);
  if (Array.isArray(cached) && cached.length > 0) return cached;
  return SKILL_CATEGORIES;
}

// Create or update skill category
export async function upsertSkillCategory(cat) {
  const current = await getSkillCategories();
  const id = cat.id || generateRecordId();
  const payload = { ...cat, id };
  const exists = current.some((c) => c.id === id || c.name === cat.name);
  const updated = exists
    ? current.map((c) => (c.id === id || c.name === cat.name ? payload : c))
    : [...current, payload];

  await setLocalItem(CACHE_KEYS.SKILLS, updated);

  if (supabase) {
    const dbPayload = {
      ...(isValidUuid(id) ? { id } : {}),
      name: payload.name,
      skills: payload.skills || [],
      order_index: payload.order_index ?? 0,
    };
    const { error } = await supabase.from("skill_categories").upsert(dbPayload);
    if (error) {
      throw new Error(error.message || "Gagal menyimpan keahlian ke server.");
    }
  }

  notifyDataChanged();
  return payload;
}

// Batch reorder skill categories and persist
export async function reorderSkillCategories(orderedList = []) {
  const updated = orderedList.map((item, idx) => ({
    ...item,
    id: item.id || generateRecordId(),
    order_index: idx + 1,
  }));

  await setLocalItem(CACHE_KEYS.SKILLS, updated);

  if (supabase) {
    const updates = updated.map((item) => ({
      ...(isValidUuid(item.id) ? { id: item.id } : {}),
      name: item.name,
      skills: item.skills || [],
      order_index: item.order_index,
    }));
    const { error } = await supabase.from("skill_categories").upsert(updates);
    if (error) {
      throw new Error(error.message || "Gagal memperbarui urutan keahlian.");
    }
  }

  notifyDataChanged();
  return updated;
}

// Delete skill category
export async function deleteSkillCategory(id) {
  const current = await getSkillCategories();
  const updated = current.filter((c) => c.id !== id && c.name !== id);

  await setLocalItem(CACHE_KEYS.SKILLS, updated);

  if (supabase) {
    const { error } = isValidUuid(id)
      ? await supabase.from("skill_categories").delete().eq("id", id)
      : await supabase.from("skill_categories").delete().eq("name", id);
    if (error) {
      throw new Error(error.message || "Gagal menghapus keahlian di server.");
    }
  }

  notifyDataChanged();
}

// Delete multiple skill categories in one batch across local cache and Supabase
export async function deleteSkillCategoriesBulk(ids = []) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const current = await getSkillCategories();
  const idSet = new Set(uniqueIds);
  const updated = current.filter(
    (c) => !idSet.has(c.id) && !idSet.has(c.name)
  );
  await setLocalItem(CACHE_KEYS.SKILLS, updated);

  if (supabase) {
    const uuidIds = uniqueIds.filter(isValidUuid);
    const names = uniqueIds.filter((val) => !isValidUuid(val));
    if (uuidIds.length > 0) {
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .in("id", uuidIds);
      if (error) {
        throw new Error(error.message || "Gagal menghapus keahlian di server.");
      }
    }
    if (names.length > 0) {
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .in("name", names);
      if (error) {
        throw new Error(error.message || "Gagal menghapus keahlian di server.");
      }
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
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
          await setLocalItem(CACHE_KEYS.EDUCATION, mapped);
        } catch {
          // Ignore non-critical read cache failure
        }
        return mapped;
      }
    } catch {
      // Fall through to local store
    }
  }

  const cached = await getLocalItem(CACHE_KEYS.EDUCATION);
  if (Array.isArray(cached) && cached.length > 0) return cached;
  return EDUCATION;
}

// Upsert education entry
export async function upsertEducation(item) {
  const current = await getEducation();
  const id = item.id || generateRecordId();
  const payload = { ...item, id };
  const exists = current.some((e) => e.id === id || e.school === item.school);
  const updated = exists
    ? current.map((e) =>
      e.id === id || e.school === item.school ? payload : e
    )
    : [...current, payload];

  await setLocalItem(CACHE_KEYS.EDUCATION, updated);

  if (supabase) {
    const dbPayload = {
      ...(isValidUuid(id) ? { id } : {}),
      school: payload.school || "",
      degree: payload.degree || "",
      period: payload.period || "",
      focus: payload.focus || "",
      active: Boolean(payload.active),
      order_index: payload.order_index ?? payload.orderIndex ?? 0,
      score: payload.score || payload.ipk || null,
      score_label: payload.scoreLabel || payload.score_label || null,
    };
    const { error } = await supabase.from("education").upsert(dbPayload);
    if (error && (error.message?.includes("score") || error.code === "42703")) {
      const fallback = { ...dbPayload };
      delete fallback.score;
      delete fallback.score_label;
      const retry = await supabase.from("education").upsert(fallback);
      if (retry.error) {
        throw new Error(retry.error.message || "Gagal menyimpan pendidikan.");
      }
    } else if (error) {
      throw new Error(error.message || "Gagal menyimpan pendidikan.");
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete education entry
export async function deleteEducation(id) {
  const current = await getEducation();
  const updated = current.filter((e) => e.id !== id && e.school !== id);

  await setLocalItem(CACHE_KEYS.EDUCATION, updated);

  if (supabase) {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      throw new Error(error.message || "Gagal menghapus pendidikan.");
    }
  }

  notifyDataChanged();
}

// Delete multiple education entries in one batch
export async function deleteEducationBulk(ids = []) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const current = await getEducation();
  const idSet = new Set(uniqueIds);
  const updated = current.filter(
    (e) => !idSet.has(e.id) && !idSet.has(e.school)
  );
  await setLocalItem(CACHE_KEYS.EDUCATION, updated);

  if (supabase) {
    const uuidIds = uniqueIds.filter(isValidUuid);
    const schools = uniqueIds.filter((val) => !isValidUuid(val));
    if (uuidIds.length > 0) {
      const { error } = await supabase
        .from("education")
        .delete()
        .in("id", uuidIds);
      if (error) {
        throw new Error(error.message || "Gagal menghapus pendidikan.");
      }
    }
    if (schools.length > 0) {
      const { error } = await supabase
        .from("education")
        .delete()
        .in("school", schools);
      if (error) {
        throw new Error(error.message || "Gagal menghapus pendidikan.");
      }
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
}

// Legacy static seed credential IDs eligible for one-click admin cleanup
export const LEGACY_STATIC_CERT_IDS = [
  "BABFA59PQ6P1",
  "O4E735ED1C19",
  "OPIQUC835DYO",
  "4EXG140QQPRL",
  "72ZDJ771LZYW",
  "UC-b1e1180e-06a6-461a-91a7-b6f3f75ddce1",
  "UC-e151d82f-7011-4b42-b94f-9f64eecb4eaa",
  "UC-806f4b45-0109-4c65-9720-389fff8ca068",
  "KNX-DA-001",
];

// Fetch certifications dynamically from Supabase without static seed fallback
export async function getCertifications() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && Array.isArray(data)) {
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
          await setLocalItem(CACHE_KEYS.CERTS, mapped);
        } catch {
          // Ignore non-critical read cache failure
        }
        return mapped;
      }
    } catch {
      // Fall through to local store
    }
  }

  const cached = await getLocalItem(CACHE_KEYS.CERTS);
  return Array.isArray(cached) ? cached : [];
}

// Upsert certification entry
export async function upsertCertification(cert) {
  const current = await getCertifications();
  const id = cert.id || generateRecordId();
  const payload = { ...cert, id };
  const exists = current.some(
    (c) =>
      c.id === id ||
      (cert.credentialId && c.credentialId === cert.credentialId)
  );
  const updated = exists
    ? current.map((c) =>
      c.id === id ||
        (cert.credentialId && c.credentialId === cert.credentialId)
        ? payload
        : c
    )
    : [...current, payload];

  await setLocalItem(CACHE_KEYS.CERTS, updated);

  if (supabase) {
    const dbPayload = {
      ...(isValidUuid(id) ? { id } : {}),
      title: payload.title || "Sertifikasi",
      issuer: payload.issuer || "",
      provider: payload.provider || "Lainnya",
      credential_id: payload.credentialId || payload.credential_id || "-",
      credential_url: payload.credentialUrl || payload.credential_url || "#",
      date: payload.date || "",
      order_index: payload.orderIndex ?? 0,
      image_url: payload.image || payload.imageUrl || null,
    };
    const { error } = await supabase.from("certifications").upsert(dbPayload);
    if (error && error.message && error.message.includes("image_url")) {
      const fallbackPayload = { ...dbPayload };
      delete fallbackPayload.image_url;
      const retry = await supabase
        .from("certifications")
        .upsert(fallbackPayload);
      if (retry.error) {
        throw new Error(retry.error.message || "Gagal menyimpan sertifikasi.");
      }
    } else if (error) {
      throw new Error(error.message || "Gagal menyimpan sertifikasi.");
    }
  }

  notifyDataChanged();
  return payload;
}

// Delete certification entry by UUID, credential ID, or title
export async function deleteCertification(identifier) {
  const current = await getCertifications();
  const target = current.find(
    (c) =>
      c.id === identifier ||
      c.credentialId === identifier ||
      c.title === identifier
  );
  const updated = current.filter(
    (c) =>
      c.id !== identifier &&
      c.credentialId !== identifier &&
      c.title !== identifier
  );

  await setLocalItem(CACHE_KEYS.CERTS, updated);

  if (supabase) {
    const targetId = target?.id || identifier;
    if (isValidUuid(targetId)) {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", targetId);
      if (error) {
        throw new Error(error.message || "Gagal menghapus sertifikasi.");
      }
    } else if (target?.credentialId || identifier) {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("credential_id", target?.credentialId || identifier);
      if (error) {
        throw new Error(error.message || "Gagal menghapus sertifikasi.");
      }
    }
  }

  notifyDataChanged();
}

// Delete multiple certifications in one batch across local cache and Supabase
export async function deleteCertificationsBulk(identifiers = []) {
  const uniqueIds = [...new Set(identifiers.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const current = await getCertifications();
  const idSet = new Set(uniqueIds);
  const targets = current.filter(
    (c) => idSet.has(c.id) || idSet.has(c.credentialId) || idSet.has(c.title)
  );
  const updated = current.filter(
    (c) =>
      !idSet.has(c.id) &&
      !idSet.has(c.credentialId) &&
      !idSet.has(c.title)
  );
  await setLocalItem(CACHE_KEYS.CERTS, updated);

  if (supabase) {
    const uuidIds = [
      ...new Set(
        [...targets.map((t) => t.id), ...uniqueIds].filter(isValidUuid)
      ),
    ];
    const credIds = [
      ...new Set(
        targets
          .filter((t) => !isValidUuid(t.id) && t.credentialId)
          .map((t) => t.credentialId)
      ),
    ];
    if (uuidIds.length > 0) {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .in("id", uuidIds);
      if (error) {
        throw new Error(error.message || "Gagal menghapus sertifikasi.");
      }
    }
    if (credIds.length > 0) {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .in("credential_id", credIds);
      if (error) {
        throw new Error(error.message || "Gagal menghapus sertifikasi.");
      }
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
}

// Delete multiple contact messages across local cache and Supabase
export async function deleteContactMessagesBulk(ids = []) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return 0;

  const list = (await getLocalItem(CACHE_KEYS.MESSAGES)) || [];
  const idSet = new Set(uniqueIds);
  await setLocalItem(
    CACHE_KEYS.MESSAGES,
    list.filter((m) => !idSet.has(m.id))
  );

  if (supabase) {
    const uuidIds = uniqueIds.filter(isValidUuid);
    if (uuidIds.length > 0) {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .in("id", uuidIds);
      if (error) {
        throw new Error(error.message || "Gagal menghapus pesan.");
      }
    }
  }

  notifyDataChanged();
  return uniqueIds.length;
}

// Remove all legacy static seed certifications from local cache and Supabase
export async function purgeLegacyStaticCertifications() {
  const current = await getCertifications();
  const legacySet = new Set(LEGACY_STATIC_CERT_IDS);
  const remaining = current.filter((c) => !legacySet.has(c.credentialId));
  const removedCount = current.length - remaining.length;

  await setLocalItem(CACHE_KEYS.CERTS, remaining);

  if (supabase) {
    const { error } = await supabase
      .from("certifications")
      .delete()
      .in("credential_id", LEGACY_STATIC_CERT_IDS);
    if (error) {
      throw new Error(
        error.message || "Gagal menghapus data sertifikasi lama di Supabase."
      );
    }
  }

  notifyDataChanged();
  return removedCount;
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
      // Fall through to local persistence
    }
  }

  const list = (await getLocalItem(CACHE_KEYS.MESSAGES)) || [];
  list.unshift({
    id: `msg-${Date.now()}`,
    name: form.name,
    email: form.email,
    subject: form.subject || "Pesan dari Portofolio",
    message: form.message,
    created_at: new Date().toISOString(),
  });
  await setLocalItem(CACHE_KEYS.MESSAGES, list);
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
      // Fall through to local store
    }
  }

  const list = await getLocalItem(CACHE_KEYS.MESSAGES);
  return Array.isArray(list) ? list : [];
}

// Upload file to Supabase Storage or optimize into Data URL for local mode
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
      // Fallback to optimized local Data URL
    }
  }

  if (
    typeof document !== "undefined" &&
    file instanceof Blob &&
    file.type &&
    file.type.startsWith("image/")
  ) {
    return compressImageToDataUrl(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Convert base64 Data URL into a File object for Supabase Storage upload
async function dataUrlToFile(dataUrl, baseName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const mime = blob.type || "image/jpeg";
  const ext = mime.includes("png")
    ? "png"
    : mime.includes("webp")
      ? "webp"
      : "jpg";
  return new File([blob], `${baseName}.${ext}`, { type: mime });
}

// Upload inline base64 photo to Supabase Storage bucket, returning CDN URL
async function uploadInlineImageIfNeeded(value, folder, slug) {
  if (!supabase || typeof value !== "string" || !value.startsWith("data:image/")) {
    return { url: value || "", uploaded: false };
  }
  try {
    const safeSlug = String(slug || "asset")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);
    const file = await dataUrlToFile(value, safeSlug);
    const filePath = `${folder}/${Date.now()}-${safeSlug}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);
      if (publicUrl) return { url: publicUrl, uploaded: true };
    }
  } catch {
    // Keep original Data URL if bucket upload is unavailable
  }
  return { url: value, uploaded: false };
}

// Inspect whether an unsynced pre-cloud local snapshot exists in IndexedDB
export async function getPreCloudBackupInfo() {
  const backup = await getLocalItem(PRE_CLOUD_BACKUP_KEY);
  if (!backup) return null;
  return {
    savedAt: backup.savedAt || null,
    counts: {
      projects: Array.isArray(backup.projects) ? backup.projects.length : 0,
      experience: Array.isArray(backup.experience)
        ? backup.experience.length
        : 0,
      skills: Array.isArray(backup.skills) ? backup.skills.length : 0,
      education: Array.isArray(backup.education) ? backup.education.length : 0,
      certifications: Array.isArray(backup.certifications)
        ? backup.certifications.length
        : 0,
    },
  };
}

// Export full CMS snapshot from local IndexedDB or active state as JSON
export async function exportCmsSnapshot() {
  const [settings, projects, experience, skills, education, certifications] =
    await Promise.all([
      getSiteSettings(),
      getProjects(),
      getExperience(),
      getSkillCategories(),
      getEducation(),
      getCertifications(),
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    projects,
    experience,
    skills,
    education,
    certifications,
  };
}

// Push complete local CMS dataset and inline images into Supabase Cloud
export async function syncLocalDataToSupabase(
  onProgress = () => { },
  customSnapshot = null
) {
  if (!supabase) {
    throw new Error(
      "Kredensial Supabase belum aktif. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env dan Vercel."
    );
  }

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    throw new Error(
      "Sesi admin Supabase belum aktif. Silakan masuk ulang di /admin/login menggunakan akun admin Supabase."
    );
  }

  const preBackup = await getLocalItem(PRE_CLOUD_BACKUP_KEY);
  const snapshot = customSnapshot || preBackup || (await exportCmsSnapshot());

  let uploadedImages = 0;

  // 1. Sync profile and site settings
  onProgress("Mengunggah foto profil dan pengaturan situs...");
  const settingsData = { ...(snapshot.settings || PERSONAL_INFO) };
  if (settingsData.avatar) {
    const res = await uploadInlineImageIfNeeded(
      settingsData.avatar,
      "profile",
      "avatar"
    );
    settingsData.avatar = res.url;
    if (res.uploaded) uploadedImages += 1;
  }

  const { data: allSettingsRows } = await supabase
    .from("site_settings")
    .select("id")
    .order("updated_at", { ascending: false });

  const primarySettingsId = allSettingsRows?.[0]?.id || null;
  if (allSettingsRows && allSettingsRows.length > 1) {
    const duplicateIds = allSettingsRows.slice(1).map((r) => r.id);
    await supabase.from("site_settings").delete().in("id", duplicateIds);
  }

  await saveSiteSettings(primarySettingsId, settingsData);

  // 2. Sync projects
  const rawProjects = Array.isArray(snapshot.projects) ? snapshot.projects : [];
  onProgress(`Menyinkronkan ${rawProjects.length} proyek ke Supabase...`);
  const preparedProjects = [];
  for (let i = 0; i < rawProjects.length; i += 1) {
    const p = rawProjects[i];
    const imgRes = await uploadInlineImageIfNeeded(
      p.image,
      "projects",
      p.id || `project-${i + 1}`
    );
    if (imgRes.uploaded) uploadedImages += 1;
    preparedProjects.push({
      ...p,
      id: p.id || `project-${Date.now()}-${i}`,
      image: imgRes.url,
      orderIndex: i + 1,
    });
  }

  const { data: existingProjRows } = await supabase
    .from("projects")
    .select("id");
  const keepProjIds = new Set(preparedProjects.map((p) => p.id));
  const staleProjIds = (existingProjRows || [])
    .map((r) => r.id)
    .filter((id) => !keepProjIds.has(id));
  if (staleProjIds.length > 0) {
    await supabase.from("projects").delete().in("id", staleProjIds);
  }
  await reorderProjects(preparedProjects);

  // 3. Sync experience timeline
  const rawExp = Array.isArray(snapshot.experience) ? snapshot.experience : [];
  onProgress(`Menyinkronkan ${rawExp.length} pengalaman ke Supabase...`);
  const preparedExp = [];
  for (let i = 0; i < rawExp.length; i += 1) {
    const item = normalizeExperienceItem(rawExp[i]);
    const photoRes = await uploadInlineImageIfNeeded(
      item.photo,
      "experience",
      item.role || `exp-${i + 1}`
    );
    if (photoRes.uploaded) uploadedImages += 1;
    preparedExp.push({
      ...item,
      id: isValidUuid(item.id) ? item.id : generateRecordId(),
      photo: photoRes.url,
      order_index: i + 1,
    });
  }

  const { data: existingExpRows } = await supabase
    .from("experience")
    .select("id");
  const keepExpIds = new Set(preparedExp.map((e) => e.id));
  const staleExpIds = (existingExpRows || [])
    .map((r) => r.id)
    .filter((id) => !keepExpIds.has(id));
  if (staleExpIds.length > 0) {
    await supabase.from("experience").delete().in("id", staleExpIds);
  }
  await reorderExperience(preparedExp);

  // 4. Sync skill categories
  const rawSkills = Array.isArray(snapshot.skills) ? snapshot.skills : [];
  onProgress(`Menyinkronkan ${rawSkills.length} kategori keahlian...`);
  const preparedSkills = rawSkills.map((s, idx) => ({
    ...s,
    id: isValidUuid(s.id) ? s.id : generateRecordId(),
    order_index: idx + 1,
  }));
  const { data: existingSkillRows } = await supabase
    .from("skill_categories")
    .select("id");
  const keepSkillIds = new Set(preparedSkills.map((s) => s.id));
  const staleSkillIds = (existingSkillRows || [])
    .map((r) => r.id)
    .filter((id) => !keepSkillIds.has(id));
  if (staleSkillIds.length > 0) {
    await supabase.from("skill_categories").delete().in("id", staleSkillIds);
  }
  await reorderSkillCategories(preparedSkills);

  // 5. Sync education records
  const rawEdu = Array.isArray(snapshot.education) ? snapshot.education : [];
  onProgress(`Menyinkronkan ${rawEdu.length} riwayat pendidikan...`);
  const preparedEdu = rawEdu.map((ed, idx) => ({
    ...ed,
    id: isValidUuid(ed.id) ? ed.id : generateRecordId(),
    order_index: idx + 1,
  }));
  const { data: existingEduRows } = await supabase
    .from("education")
    .select("id");
  const keepEduIds = new Set(preparedEdu.map((e) => e.id));
  const staleEduIds = (existingEduRows || [])
    .map((r) => r.id)
    .filter((id) => !keepEduIds.has(id));
  if (staleEduIds.length > 0) {
    await supabase.from("education").delete().in("id", staleEduIds);
  }
  for (let i = 0; i < preparedEdu.length; i += 1) {
    await upsertEducation(preparedEdu[i]);
  }

  // 6. Sync certifications
  const rawCerts = Array.isArray(snapshot.certifications)
    ? snapshot.certifications
    : [];
  onProgress(`Menyinkronkan ${rawCerts.length} sertifikasi...`);
  const preparedCerts = [];
  for (let i = 0; i < rawCerts.length; i += 1) {
    const c = rawCerts[i];
    const certImg = await uploadInlineImageIfNeeded(
      c.image || c.imageUrl,
      "certificates",
      c.credentialId || `cert-${i + 1}`
    );
    if (certImg.uploaded) uploadedImages += 1;
    preparedCerts.push({
      ...c,
      id: isValidUuid(c.id) ? c.id : generateRecordId(),
      image: certImg.url,
      orderIndex: i + 1,
    });
  }
  const { data: existingCertRows } = await supabase
    .from("certifications")
    .select("id");
  const keepCertIds = new Set(preparedCerts.map((c) => c.id));
  const staleCertIds = (existingCertRows || [])
    .map((r) => r.id)
    .filter((id) => !keepCertIds.has(id));
  if (staleCertIds.length > 0) {
    await supabase.from("certifications").delete().in("id", staleCertIds);
  }
  for (let i = 0; i < preparedCerts.length; i += 1) {
    await upsertCertification(preparedCerts[i]);
  }

  await removeLocalItem(PRE_CLOUD_BACKUP_KEY);
  notifyDataChanged();

  return {
    projects: preparedProjects.length,
    experience: preparedExp.length,
    skills: preparedSkills.length,
    education: preparedEdu.length,
    certifications: preparedCerts.length,
    uploadedImages,
  };
}

// Import a JSON CMS backup into local IndexedDB and optionally Supabase
export async function importCmsSnapshot(snapshot, onProgress = () => { }) {
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error("Format file backup JSON tidak valid.");
  }

  onProgress("Menyimpan backup ke penyimpanan lokal...");
  if (snapshot.settings) {
    await setLocalItem(CACHE_KEYS.SETTINGS, snapshot.settings);
  }
  if (Array.isArray(snapshot.projects)) {
    await setLocalItem(CACHE_KEYS.PROJECTS, snapshot.projects);
  }
  if (Array.isArray(snapshot.experience)) {
    await setLocalItem(
      CACHE_KEYS.EXPERIENCE,
      sortExperiencesLatestFirst(snapshot.experience.map(normalizeExperienceItem))
    );
  }
  if (Array.isArray(snapshot.skills)) {
    await setLocalItem(CACHE_KEYS.SKILLS, snapshot.skills);
  }
  if (Array.isArray(snapshot.education)) {
    await setLocalItem(CACHE_KEYS.EDUCATION, snapshot.education);
  }
  if (Array.isArray(snapshot.certifications)) {
    await setLocalItem(CACHE_KEYS.CERTS, snapshot.certifications);
  }

  if (supabase) {
    return syncLocalDataToSupabase(onProgress, snapshot);
  }

  notifyDataChanged();
  return {
    projects: Array.isArray(snapshot.projects) ? snapshot.projects.length : 0,
    experience: Array.isArray(snapshot.experience)
      ? snapshot.experience.length
      : 0,
    skills: Array.isArray(snapshot.skills) ? snapshot.skills.length : 0,
    education: Array.isArray(snapshot.education)
      ? snapshot.education.length
      : 0,
    certifications: Array.isArray(snapshot.certifications)
      ? snapshot.certifications.length
      : 0,
    uploadedImages: 0,
  };
}
