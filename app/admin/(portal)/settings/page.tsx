import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { saveSiteSettings } from "./actions";

export const metadata = {
  title: "Settings",
};

export const revalidate = 0;

export default async function Page() {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select(
      "id, academy_name, tagline, description, email, phone, whatsapp, address, website, facebook_url, instagram_url, linkedin_url, youtube_url, logo_url, favicon_url"
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load site settings: ${error.message}`
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Settings
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Manage Techlance Academy branding, contact information,
          website details, and social media links.
        </p>
      </div>

      <form action={saveSiteSettings} className="flex flex-col gap-6">
        {/* Academy Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Academy Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="academy_name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Academy Name
                  </label>

                  <input
                    id="academy_name"
                    name="academy_name"
                    type="text"
                    required
                    defaultValue={
                      settings?.academy_name ??
                      "Techlance Academy"
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tagline"
                    className="mb-2 block text-sm font-medium"
                  >
                    Tagline
                  </label>

                  <input
                    id="tagline"
                    name="tagline"
                    type="text"
                    defaultValue={settings?.tagline ?? ""}
                    placeholder="Practical digital skills for real careers"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={settings?.description ?? ""}
                  placeholder="Write a short description about Techlance Academy..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Contact Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={settings?.email ?? ""}
                  placeholder="info@techlance.website"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  defaultValue={settings?.phone ?? ""}
                  placeholder="+92 300 0000000"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 block text-sm font-medium"
                >
                  WhatsApp
                </label>

                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  defaultValue={settings?.whatsapp ?? ""}
                  placeholder="+92 300 0000000"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-medium"
                >
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={settings?.website ?? ""}
                  placeholder="https://techlance.website"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={settings?.address ?? ""}
                  placeholder="Faisalabad, Punjab, Pakistan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Social Media
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="facebook_url"
                  className="mb-2 block text-sm font-medium"
                >
                  Facebook URL
                </label>

                <input
                  id="facebook_url"
                  name="facebook_url"
                  type="url"
                  defaultValue={settings?.facebook_url ?? ""}
                  placeholder="https://facebook.com/..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="instagram_url"
                  className="mb-2 block text-sm font-medium"
                >
                  Instagram URL
                </label>

                <input
                  id="instagram_url"
                  name="instagram_url"
                  type="url"
                  defaultValue={settings?.instagram_url ?? ""}
                  placeholder="https://instagram.com/..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin_url"
                  className="mb-2 block text-sm font-medium"
                >
                  LinkedIn URL
                </label>

                <input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  defaultValue={settings?.linkedin_url ?? ""}
                  placeholder="https://linkedin.com/company/..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="youtube_url"
                  className="mb-2 block text-sm font-medium"
                >
                  YouTube URL
                </label>

                <input
                  id="youtube_url"
                  name="youtube_url"
                  type="url"
                  defaultValue={settings?.youtube_url ?? ""}
                  placeholder="https://youtube.com/@..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Branding
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="logo_url"
                  className="mb-2 block text-sm font-medium"
                >
                  Logo URL
                </label>

                <input
                  id="logo_url"
                  name="logo_url"
                  type="url"
                  defaultValue={settings?.logo_url ?? ""}
                  placeholder="https://..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="favicon_url"
                  className="mb-2 block text-sm font-medium"
                >
                  Favicon URL
                </label>

                <input
                  id="favicon_url"
                  name="favicon_url"
                  type="url"
                  defaultValue={settings?.favicon_url ?? ""}
                  placeholder="https://..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}