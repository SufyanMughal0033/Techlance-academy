import "server-only";

import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select(
      "academy_name, tagline, description, email, phone, whatsapp, address, website, facebook_url, instagram_url, linkedin_url, youtube_url, logo_url, favicon_url"
    )
    .limit(1)
    .maybeSingle();

  return {
    name: data?.academy_name || siteConfig.name,
    tagline: data?.tagline || siteConfig.tagline,
    description: data?.description || siteConfig.description,

    url: data?.website || siteConfig.url,

    contact: {
      email: data?.email || siteConfig.contact.email,
      phone: data?.phone || siteConfig.contact.phone,
      whatsapp: data?.whatsapp || siteConfig.contact.whatsapp,
      address: data?.address || siteConfig.contact.address,
    },

    social: {
      facebook:
        data?.facebook_url || siteConfig.social.facebook,
      instagram:
        data?.instagram_url || siteConfig.social.instagram,
      linkedin:
        data?.linkedin_url || siteConfig.social.linkedin,
      youtube:
        data?.youtube_url || siteConfig.social.youtube,
    },

    logoUrl: data?.logo_url || null,
    faviconUrl: data?.favicon_url || null,
  };
}