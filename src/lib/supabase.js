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

  try {
    const cached = localStorage.getItem(CACHE_KEYS.SETTINGS);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore error
  }
  return { ...PERSONAL_INFO };
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
        updated_at: new Date().toISOString(),
      };
      if (id && id !== "default-site-settings") {
        await supabase.from("site_settings").update(payload).eq("id", id);
      } else {
        await supabase.from("site_settings").upsert(payload);
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
  const exists = current.some((e) => e.id === id || e.role === item.role);
  const updated = exists
    ? current.map((e) => (e.id === id || e.role === item.role ? payload : e))
    : [...current, payload];

  try {
    localStorage.setItem(
      CACHE_KEYS.EXPERIENCE,
      JSON.stringify(sortExperiencesLatestFirst(updated))
    );
  } catch {
    // Ignore
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
  } catch {
    // Ignore
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
        try {
          localStorage.setItem(CACHE_KEYS.EDUCATION, JSON.stringify(data));
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
      await supabase.from("education").upsert(payload);
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
      };
      await supabase.from("certifications").upsert(dbPayload);
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
