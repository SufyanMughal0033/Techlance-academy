"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createSupportTicket(values: {
  subject: string;
  category: string;
  message: string;
}) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  const subject = values.subject.trim();
  const message = values.message.trim();

  if (subject.length < 5) {
    return {
      error: "Subject must be at least 5 characters.",
    };
  }

  if (message.length < 10) {
    return {
      error: "Message must be at least 10 characters.",
    };
  }

  const allowedCategories = [
    "general",
    "technical",
    "academic",
    "assignment",
    "test",
    "attendance",
    "certificate",
  ];

  if (!allowedCategories.includes(values.category)) {
    return {
      error: "Please select a valid category.",
    };
  }

  const { error } = await supabase
    .from("support_tickets")
    .insert({
      student_id: user.id,
      subject,
      category: values.category,
      message,
      status: "open",
      priority: "normal",
    });

  if (error) {
    return {
      error: "Unable to create your support ticket. Please try again.",
    };
  }

  revalidatePath("/student/support");

  return {
    success: true,
    message: "Your support ticket has been created successfully.",
  };
}