"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveSiteSettings(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const academyName = String(
    formData.get("academy_name") || ""
  ).trim();

  const tagline = String(formData.get("tagline") || "").trim();
  const description = String(
    formData.get("description") || ""
  ).trim();

  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const whatsapp = String(
    formData.get("whatsapp") || ""
  ).trim();
  const address = String(
    formData.get("address") || ""
  ).trim();

  const website = String(
    formData.get("website") || ""
  ).trim();

  const facebookUrl = String(
    formData.get("facebook_url") || ""
  ).trim();

  const instagramUrl = String(
    formData.get("instagram_url") || ""
  ).trim();

  const linkedinUrl = String(
    formData.get("linkedin_url") || ""
  ).trim();

  const youtubeUrl = String(
    formData.get("youtube_url") || ""
  ).trim();

  const logoUrl = String(
    formData.get("logo_url") || ""
  ).trim();

  const faviconUrl = String(
    formData.get("favicon_url") || ""
  ).trim();

  if (!academyName) {
    console.error("Save Site Settings: Academy name is required.");
    return;
  }

  const settings = {
    academy_name: academyName,
    tagline: tagline || null,
    description: description || null,
    email: email || null,
    phone: phone || null,
    whatsapp: whatsapp || null,
    address: address || null,
    website: website || null,
    facebook_url: facebookUrl || null,
    instagram_url: instagramUrl || null,
    linkedin_url: linkedinUrl || null,
    youtube_url: youtubeUrl || null,
    logo_url: logoUrl || null,
    favicon_url: faviconUrl || null,
    updated_at: new Date().toISOString(),
  };

  const { data: existingSettings, error: fetchError } =
    await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

  if (fetchError) {
    console.error("Load Site Settings Error:", {
      message: fetchError.message,
      details: fetchError.details,
      hint: fetchError.hint,
      code: fetchError.code,
    });

    throw new Error(
      `Load Site Settings Error: ${fetchError.message}`
    );
  }

  let error;

  if (existingSettings) {
    const result = await supabase
      .from("site_settings")
      .update(settings)
      .eq("id", existingSettings.id);

    error = result.error;
  } else {
    const result = await supabase
      .from("site_settings")
      .insert(settings);

    error = result.error;
  }

  if (error) {
    console.error("Save Site Settings Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Save Site Settings Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/testimonials");
  revalidatePath("/faqs");
  revalidatePath("/blog");
}