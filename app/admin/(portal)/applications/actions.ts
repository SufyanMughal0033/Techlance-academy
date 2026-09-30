"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";

async function findAuthUserByEmail(email: string) {
  const adminSupabase = createAdminClient();

  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } =
      await adminSupabase.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw new Error(
        `Unable to search Auth users: ${error.message}`
      );
    }

    const user = data.users.find(
      (item) =>
        item.email?.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

export async function approveApplication(
  formData: FormData
): Promise<void> {
  const { user: adminUser } = await requireRole("admin");

  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const applicationId = String(
    formData.get("id") || ""
  ).trim();

  if (!applicationId) {
    console.error(
      "Approve Application: Application ID is required."
    );
    return;
  }

  const { data: application, error: applicationError } =
    await supabase
      .from("applications")
      .select(
        "id, full_name, email, phone, program, qualification, city, experience, message, status, student_id"
      )
      .eq("id", applicationId)
      .single();

  if (applicationError || !application) {
    console.error(
      "Approve Application: Application not found.",
      applicationError?.message
    );

    throw new Error(
      "The application could not be found."
    );
  }

  if (application.status !== "pending") {
    console.error(
      "Approve Application: Application is not pending."
    );
    return;
  }

  const programTitle = application.program.trim();

  const { data: program, error: programError } =
    await supabase
      .from("programs")
      .select("id, title, status")
      .eq("title", programTitle)
      .maybeSingle();

  if (programError) {
    console.error(
      "Approve Application: Program lookup failed.",
      programError.message
    );

    throw new Error(
      `Program lookup failed: ${programError.message}`
    );
  }

  if (!program) {
    throw new Error(
      `No program was found for "${programTitle}". Please make sure the application program exactly matches a program title.`
    );
  }

  if (
    program.status !== "active" &&
    program.status !== "published"
  ) {
    throw new Error(
      `The selected program "${program.title}" is not currently available.`
    );
  }

  const email = application.email.trim().toLowerCase();

  let authUser = await findAuthUserByEmail(email);
  let createdAuthUser = false;

  if (!authUser) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const { data, error } =
      await adminSupabase.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${siteUrl}/auth/callback?next=/student/set-password`,
          data: {
            full_name: application.full_name,
          },
        }
      );

    if (error || !data.user) {
      console.error(
        "Approve Application: Auth account creation failed.",
        error?.message
      );

      throw new Error(
        `Student account could not be created: ${
          error?.message || "Unknown error"
        }`
      );
    }

    authUser = data.user;
    createdAuthUser = true;
  }

  const studentUserId = authUser.id;

  const {
    data: existingProfile,
    error: profileLookupError,
  } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", studentUserId)
    .maybeSingle();

  if (profileLookupError) {
    console.error(
      "Approve Application: Profile lookup failed.",
      profileLookupError.message
    );

    if (createdAuthUser) {
      await adminSupabase.auth.admin.deleteUser(
        studentUserId
      );
    }

    throw new Error(
      `Profile lookup failed: ${profileLookupError.message}`
    );
  }

  if (
    existingProfile &&
    existingProfile.role !== "student"
  ) {
    if (createdAuthUser) {
      await adminSupabase.auth.admin.deleteUser(
        studentUserId
      );
    }

    throw new Error(
      "This email is already connected to a non-student account."
    );
  }

  if (!existingProfile) {
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .insert({
        id: studentUserId,
        fullname: application.full_name,
        email,
        phone: application.phone || null,
        program: application.program || null,
        qualification: application.qualification || null,
        city: application.city || null,
        experience: application.experience || null,
        message: application.message || null,
        role: "student",
        is_active: true,
      });

    if (profileError) {
      console.error(
        "Approve Application: Profile creation failed.",
        profileError.message
      );

      if (createdAuthUser) {
        await adminSupabase.auth.admin.deleteUser(
          studentUserId
        );
      }

      throw new Error(
        `Student profile could not be created: ${profileError.message}`
      );
    }
  }

  const {
    data: existingEnrollment,
    error: enrollmentLookupError,
  } = await adminSupabase
    .from("enrollments")
    .select("id, status")
    .eq("student_id", studentUserId)
    .eq("program_id", program.id)
    .maybeSingle();

  if (enrollmentLookupError) {
    console.error(
      "Approve Application: Enrollment lookup failed.",
      enrollmentLookupError.message
    );

    throw new Error(
      `Enrollment lookup failed: ${enrollmentLookupError.message}`
    );
  }

  if (existingEnrollment) {
    const { error: enrollmentUpdateError } =
      await adminSupabase
        .from("enrollments")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingEnrollment.id);

    if (enrollmentUpdateError) {
      console.error(
        "Approve Application: Enrollment update failed.",
        enrollmentUpdateError.message
      );

      throw new Error(
        `Enrollment could not be activated: ${enrollmentUpdateError.message}`
      );
    }
  } else {
    const { error: enrollmentError } =
      await adminSupabase
        .from("enrollments")
        .insert({
          student_id: studentUserId,
          program_id: program.id,
          status: "active",
        });

    if (enrollmentError) {
      console.error(
        "Approve Application: Enrollment creation failed.",
        enrollmentError.message
      );

      throw new Error(
        `Student enrollment could not be created: ${enrollmentError.message}`
      );
    }
  }

  const { error: applicationUpdateError } =
    await supabase
      .from("applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUser.id,
        student_id: studentUserId,
      })
      .eq("id", applicationId)
      .eq("status", "pending");

  if (applicationUpdateError) {
    console.error(
      "Approve Application: Application update failed.",
      applicationUpdateError.message
    );

    throw new Error(
      `Application could not be approved: ${applicationUpdateError.message}`
    );
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/students");
  revalidatePath("/student");
}

export async function rejectApplication(
  formData: FormData
): Promise<void> {
  const { user: adminUser } = await requireRole("admin");

  const supabase = await createClient();

  const applicationId = String(
    formData.get("id") || ""
  ).trim();

  if (!applicationId) {
    console.error(
      "Reject Application: Application ID is required."
    );
    return;
  }

  const { error } = await supabase
    .from("applications")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", applicationId)
    .eq("status", "pending");

  if (error) {
    console.error("Reject Application Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Reject Application Error: ${error.message}`
    );
  }

  revalidatePath("/admin/applications");
}