"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";

export type ApproveApplicationResult = {
  success: boolean;
  message?: string;
  error?: string;
  credentials?: {
    name: string;
    email: string;
    password: string;
  };
};

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

function generateTemporaryPassword() {
  const randomPart = crypto.randomUUID().replace(/-/g, "");

  return `TL@${randomPart.slice(0, 10)}9`;
}

export async function approveApplication(
  formData: FormData
): Promise<ApproveApplicationResult> {
  try {
    const { user: adminUser } = await requireRole("admin");

    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    const applicationId = String(
      formData.get("id") || ""
    ).trim();

    if (!applicationId) {
      return {
        success: false,
        error: "Application ID is required.",
      };
    }

    const {
      data: application,
      error: applicationError,
    } = await supabase
      .from("applications")
      .select(
        "id, full_name, email, phone, program, qualification, city, experience, message, status, student_id"
      )
      .eq("id", applicationId)
      .single();

    if (applicationError || !application) {
      return {
        success: false,
        error: "The application could not be found.",
      };
    }

    if (application.status !== "pending") {
      return {
        success: false,
        error: "This application has already been processed.",
      };
    }

    const programTitle = application.program.trim();

    const {
      data: program,
      error: programError,
    } = await supabase
      .from("programs")
      .select("id, title, status")
      .eq("title", programTitle)
      .maybeSingle();

    if (programError) {
      return {
        success: false,
        error: `Program lookup failed: ${programError.message}`,
      };
    }

    if (!program) {
      return {
        success: false,
        error: `No program was found for "${programTitle}". Make sure the application program exactly matches a program title.`,
      };
    }

    if (
      program.status !== "active" &&
      program.status !== "published"
    ) {
      return {
        success: false,
        error: `The selected program "${program.title}" is not currently available.`,
      };
    }

    const email = application.email
      .trim()
      .toLowerCase();

    let authUser = await findAuthUserByEmail(email);

    let createdAuthUser = false;
    let temporaryPassword = "";

    /*
     * ----------------------------------------------------
     * CREATE STUDENT AUTH ACCOUNT
     * ----------------------------------------------------
     */

    if (!authUser) {
      temporaryPassword = generateTemporaryPassword();

      const {
        data,
        error,
      } = await adminSupabase.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: application.full_name,
        },
      });

      if (error || !data.user) {
        return {
          success: false,
          error: `Student account could not be created: ${
            error?.message || "Unknown error"
          }`,
        };
      }

      authUser = data.user;
      createdAuthUser = true;
    }

    const studentUserId = authUser.id;

    /*
     * ----------------------------------------------------
     * CHECK EXISTING PROFILE
     * ----------------------------------------------------
     */

    const {
      data: existingProfile,
      error: profileLookupError,
    } = await supabase
      .from("profiles")
      .select("id, role, is_active")
      .eq("id", studentUserId)
      .maybeSingle();

    if (profileLookupError) {
      if (createdAuthUser) {
        await adminSupabase.auth.admin.deleteUser(
          studentUserId
        );
      }

      return {
        success: false,
        error: `Profile lookup failed: ${profileLookupError.message}`,
      };
    }

    /*
     * ----------------------------------------------------
     * MAKE SURE EXISTING ACCOUNT IS A STUDENT
     * ----------------------------------------------------
     */

    if (
      existingProfile &&
      existingProfile.role !== "student"
    ) {
      if (createdAuthUser) {
        await adminSupabase.auth.admin.deleteUser(
          studentUserId
        );
      }

      return {
        success: false,
        error:
          "This email is already connected to a non-student account.",
      };
    }

    /*
     * ----------------------------------------------------
     * CREATE STUDENT PROFILE
     * ----------------------------------------------------
     */

    if (!existingProfile) {
      const { error: profileError } =
        await adminSupabase
          .from("profiles")
          .insert({
            id: studentUserId,
            fullname: application.full_name,
            email,
            phone: application.phone || null,
            program: application.program || null,
            qualification:
              application.qualification || null,
            city: application.city || null,
            experience:
              application.experience || null,
            message: application.message || null,
            role: "student",
            is_active: true,
          });

      if (profileError) {
        if (createdAuthUser) {
          await adminSupabase.auth.admin.deleteUser(
            studentUserId
          );
        }

        return {
          success: false,
          error: `Student profile could not be created: ${profileError.message}`,
        };
      }
    }

    /*
     * ----------------------------------------------------
     * CHECK EXISTING ENROLLMENT
     * ----------------------------------------------------
     */

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
      return {
        success: false,
        error: `Enrollment lookup failed: ${enrollmentLookupError.message}`,
      };
    }

    /*
     * ----------------------------------------------------
     * ACTIVATE OR CREATE ENROLLMENT
     * ----------------------------------------------------
     */

    if (existingEnrollment) {
      const {
        error: enrollmentUpdateError,
      } = await adminSupabase
        .from("enrollments")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingEnrollment.id);

      if (enrollmentUpdateError) {
        return {
          success: false,
          error: `Enrollment could not be activated: ${enrollmentUpdateError.message}`,
        };
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
        return {
          success: false,
          error: `Student enrollment could not be created: ${enrollmentError.message}`,
        };
      }
    }

    /*
     * ----------------------------------------------------
     * APPROVE APPLICATION
     * ----------------------------------------------------
     */

    const {
      error: applicationUpdateError,
    } = await supabase
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
      return {
        success: false,
        error: `Application could not be approved: ${applicationUpdateError.message}`,
      };
    }

    /*
     * ----------------------------------------------------
     * REFRESH ADMIN PAGES
     * ----------------------------------------------------
     */

    revalidatePath("/admin/applications");
    revalidatePath("/admin/students");
    revalidatePath("/student");

    /*
     * ----------------------------------------------------
     * RETURN TEMPORARY CREDENTIALS
     *
     * Password is NOT stored in database.
     * It only returns to the admin browser once.
     * ----------------------------------------------------
     */

    if (createdAuthUser && temporaryPassword) {
      return {
        success: true,
        message:
          "Student account created and application approved.",
        credentials: {
          name: application.full_name,
          email,
          password: temporaryPassword,
        },
      };
    }

    return {
      success: true,
      message:
        "Application approved. A student account already existed for this email.",
    };
  } catch (error) {
    console.error(
      "Approve Application Error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while approving the application.",
    };
  }
}

/*
 * --------------------------------------------------------
 * REJECT APPLICATION
 * --------------------------------------------------------
 */

export async function rejectApplication(
  formData: FormData
): Promise<void> {
  const { user: adminUser } =
    await requireRole("admin");

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
    console.error(
      "Reject Application Error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      `Reject Application Error: ${error.message}`
    );
  }

  revalidatePath("/admin/applications");
}
export type ResetStudentPasswordResult = {
  success: boolean;
  message?: string;
  error?: string;
  credentials?: {
    name: string;
    email: string;
    password: string;
  };
};

export async function resetStudentPassword(
  applicationId: string
): Promise<ResetStudentPasswordResult> {
  try {
    await requireRole("admin");

    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Get approved application
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .select("id, full_name, email, status, student_id")
      .eq("id", applicationId)
      .single();

    if (applicationError || !application) {
      return {
        success: false,
        error: "Application not found.",
      };
    }

    if (application.status !== "approved") {
      return {
        success: false,
        error: "This application is not approved yet.",
      };
    }

    if (!application.student_id) {
      return {
        success: false,
        error: "This student does not have an Auth account yet.",
      };
    }

    // Generate a completely new temporary password
    const temporaryPassword = generateTemporaryPassword();

    // Update Supabase Auth password
    const { error: updateError } =
      await adminSupabase.auth.admin.updateUserById(
        application.student_id,
        {
          password: temporaryPassword,
        }
      );

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Could not generate new password.",
      };
    }

    revalidatePath("/admin/applications");
    revalidatePath("/admin/students");

    return {
      success: true,
      message: "New temporary password generated successfully.",
      credentials: {
        name: application.full_name,
        email: application.email,
        password: temporaryPassword,
      },
    };
  } catch (error) {
    console.error("resetStudentPassword error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the password.",
    };
  }
}