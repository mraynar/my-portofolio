import { createClient } from "@supabase/supabase-js";
import {
  PERSONAL_INFO,
  PROJECTS,
  EXPERIENCE,
  SKILL_CATEGORIES,
  EDUCATION,
  CERTIFICATIONS,
} from "../data";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful null client if env vars are unset during dev
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Auth helper verifying current admin session
export async function checkIsAdmin() {
  if (!supabase) return false;
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

// Fetch site configuration with static fallback
export async function getSiteSettings() {
  if (!supabase) return { ...PERSONAL_INFO };
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return { ...PERSONAL_INFO };

    return {
      name: data.site_name,
      kicker: data.kicker,
      statusBadge: data.status_badge,
      headline: data.headline,
      headlineAccent: data.headline_accent,
      valueProp: data.value_prop,
      university: data.university,
      avatar: data.photo_url,
      cvUrl: data.cv_url,
      github: data.github_url,
      linkedin: data.linkedin_url,
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
  } catch {
    return { ...PERSONAL_INFO };
  }
}

// Update site configuration
export async function saveSiteSettings(id, fields) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const payload = {
    site_name: fields.name,
    kicker: fields.kicker,
    status_badge: fields.statusBadge,
    headline: fields.headline,
    headline_accent: fields.headlineAccent,
    value_prop: fields.valueProp,
    university: fields.university,
    photo_url: fields.avatar,
    cv_url: fields.cvUrl,
    github_url: fields.github,
    linkedin_url: fields.linkedin,
    email: fields.email,
    location: fields.location,
    timezone: fields.timezone,
    availability_status: fields.status,
    about_p1: fields.aboutP1,
    about_p2: fields.aboutP2,
    about_p3: fields.aboutP3,
    principle_title: fields.principleTitle,
    principle_quote: fields.principleQuote,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("site_settings")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch published projects with static fallback
export async function getProjects() {
  if (!supabase) return PROJECTS;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return PROJECTS;

    return data.map((p) => ({
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
  } catch {
    return PROJECTS;
  }
}

// Create or update project
export async function upsertProject(project) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const payload = {
    id: project.id,
    title: project.title,
    label: project.label,
    featured: project.featured,
    image: project.image,
    problem: project.problem,
    solution: project.solution,
    impact: project.impact,
    badges: project.badges,
    demo_url: project.demoUrl || null,
    repo_notice: project.repoNotice,
    repo_reason: project.repoReason,
    case_study_role: project.caseStudy?.role || "Full-Stack Developer",
    case_study_client: project.caseStudy?.client || null,
    case_study_duration: project.caseStudy?.duration || "2024",
    case_study_background: project.caseStudy?.background || null,
    case_study_solution: project.caseStudy?.solution || null,
    case_study_architecture: project.caseStudy?.architecture || null,
    case_study_impact: project.caseStudy?.impact || null,
    status: project.status || "published",
    order_index: project.orderIndex ?? 0,
  };

  const { data, error } = await supabase
    .from("projects")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete project by identifier
export async function deleteProject(id) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

const LOCAL_EXP_KEY = "portfolio_experience_cache";

// Fetch experience entries with fallback
export async function getExperience() {
  if (!supabase) {
    try {
      const cached = localStorage.getItem(LOCAL_EXP_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to static data
    }
    return EXPERIENCE;
  }
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      try {
        const cached = localStorage.getItem(LOCAL_EXP_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // Fallback to static data
      }
      return EXPERIENCE;
    }
    return data;
  } catch {
    try {
      const cached = localStorage.getItem(LOCAL_EXP_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to static data
    }
    return EXPERIENCE;
  }
}

// Create or update experience entry
export async function upsertExperience(item) {
  if (!supabase) {
    const current = await getExperience();
    const id = item.id || `exp-${Date.now()}`;
    const payload = { ...item, id };
    const exists = current.some((e) => e.id === id || e.role === item.role);
    const updated = exists
      ? current.map((e) => (e.id === id || e.role === item.role ? payload : e))
      : [...current, payload];
    try {
      localStorage.setItem(LOCAL_EXP_KEY, JSON.stringify(updated));
    } catch {
      // Silently continue
    }
    return payload;
  }
  const { data, error } = await supabase
    .from("experience")
    .upsert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete experience entry
export async function deleteExperience(id) {
  if (!supabase) {
    const current = await getExperience();
    const updated = current.filter((e) => e.id !== id && e.role !== id);
    try {
      localStorage.setItem(LOCAL_EXP_KEY, JSON.stringify(updated));
    } catch {
      // Silently continue
    }
    return;
  }
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) {
    await supabase.from("experience").delete().eq("role", id);
  }
}

const LOCAL_SKILLS_KEY = "portfolio_skill_categories_cache";

// Fetch skill categories with fallback
export async function getSkillCategories() {
  if (!supabase) {
    try {
      const cached = localStorage.getItem(LOCAL_SKILLS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to static data
    }
    return SKILL_CATEGORIES;
  }
  try {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      try {
        const cached = localStorage.getItem(LOCAL_SKILLS_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // Fallback to static data
      }
      return SKILL_CATEGORIES;
    }
    return data;
  } catch {
    try {
      const cached = localStorage.getItem(LOCAL_SKILLS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to static data
    }
    return SKILL_CATEGORIES;
  }
}

// Create or update skill category
export async function upsertSkillCategory(cat) {
  if (!supabase) {
    const current = await getSkillCategories();
    const id = cat.id || `cat-${Date.now()}`;
    const payload = { ...cat, id };
    const exists = current.some((c) => c.id === id || c.name === cat.name);
    const updated = exists
      ? current.map((c) => (c.id === id || c.name === cat.name ? payload : c))
      : [...current, payload];
    try {
      localStorage.setItem(LOCAL_SKILLS_KEY, JSON.stringify(updated));
    } catch {
      // Silently continue
    }
    return payload;
  }
  const { data, error } = await supabase
    .from("skill_categories")
    .upsert(cat)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete skill category
export async function deleteSkillCategory(id) {
  if (!supabase) {
    const current = await getSkillCategories();
    const updated = current.filter((c) => c.id !== id && c.name !== id);
    try {
      localStorage.setItem(LOCAL_SKILLS_KEY, JSON.stringify(updated));
    } catch {
      // Silently continue
    }
    return;
  }
  const { error } = await supabase
    .from("skill_categories")
    .delete()
    .eq("id", id);
  if (error) {
    // Retry deleting by category name when custom identifier is used
    await supabase.from("skill_categories").delete().eq("name", id);
  }
}

// Fetch education list with fallback
export async function getEducation() {
  if (!supabase) return EDUCATION;
  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return EDUCATION;
    return data;
  } catch {
    return EDUCATION;
  }
}

// Upsert education entry
export async function upsertEducation(item) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { data, error } = await supabase
    .from("education")
    .upsert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete education entry
export async function deleteEducation(id) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
}

// Fetch certifications with fallback
export async function getCertifications() {
  if (!supabase) return CERTIFICATIONS;
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) return CERTIFICATIONS;
    return data.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      provider: c.provider,
      credentialId: c.credential_id,
      credentialUrl: c.credential_url,
      date: c.date,
      id: c.id,
    }));
  } catch {
    return CERTIFICATIONS;
  }
}

// Upsert certification entry
export async function upsertCertification(cert) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const payload = {
    id: cert.id || undefined,
    title: cert.title,
    issuer: cert.issuer,
    provider: cert.provider,
    credential_id: cert.credentialId,
    credential_url: cert.credentialUrl,
    date: cert.date,
    order_index: cert.orderIndex ?? 0,
  };

  const { data, error } = await supabase
    .from("certifications")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete certification entry
export async function deleteCertification(id) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// Submit visitor contact form
export async function submitContactMessage(form) {
  if (!supabase) {
    return { success: true, simulated: true };
  }
  const { error } = await supabase.from("contact_messages").insert([
    {
      name: form.name,
      email: form.email,
      subject: form.subject || "Pesan dari Portofolio",
      message: form.message,
    },
  ]);
  if (error) throw error;
  return { success: true };
}

// Fetch contact messages for admin
export async function getContactMessages() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Upload file to Supabase Storage bucket
export async function uploadStorageFile(bucket, filePath, file) {
  if (!supabase) throw new Error("Supabase credentials not configured.");
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
}
