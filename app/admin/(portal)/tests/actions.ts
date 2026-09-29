"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTest(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const durationMinutes = Number(
    formData.get("duration_minutes") || 30
  );

  const totalMarks = Number(
    formData.get("total_marks") || 0
  );

  const passingMarks = Number(
    formData.get("passing_marks") || 0
  );

  const attemptLimit = Number(
    formData.get("attempt_limit") || 1
  );

  const status = String(
    formData.get("status") || "published"
  ).trim();

  const testOrder = Number(
    formData.get("test_order") || 1
  );

  if (!moduleId || !title) {
    console.error("Create Test: Module and title are required.");
    return;
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0
  ) {
    console.error("Create Test: Invalid duration.");
    return;
  }

  if (
    !Number.isInteger(totalMarks) ||
    totalMarks < 0
  ) {
    console.error("Create Test: Invalid total marks.");
    return;
  }

  if (
    !Number.isInteger(passingMarks) ||
    passingMarks < 0
  ) {
    console.error("Create Test: Invalid passing marks.");
    return;
  }

  if (passingMarks > totalMarks && totalMarks > 0) {
    console.error(
      "Create Test: Passing marks cannot exceed total marks."
    );
    return;
  }

  if (
    !Number.isInteger(attemptLimit) ||
    attemptLimit <= 0
  ) {
    console.error("Create Test: Invalid attempt limit.");
    return;
  }

  if (!Number.isInteger(testOrder) || testOrder < 1) {
    console.error("Create Test: Invalid test order.");
    return;
  }

  if (!["published", "draft", "closed"].includes(status)) {
    console.error("Create Test: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("tests")
    .insert({
      module_id: moduleId,
      title,
      description: description || null,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
      passing_marks: passingMarks,
      attempt_limit: attemptLimit,
      status,
      test_order: testOrder,
    });

  if (error) {
    console.error("Create Test Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Test Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/tests");
}

export async function updateTest(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();
  const moduleId = String(formData.get("module_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const durationMinutes = Number(
    formData.get("duration_minutes") || 30
  );

  const totalMarks = Number(
    formData.get("total_marks") || 0
  );

  const passingMarks = Number(
    formData.get("passing_marks") || 0
  );

  const attemptLimit = Number(
    formData.get("attempt_limit") || 1
  );

  const status = String(
    formData.get("status") || "published"
  ).trim();

  const testOrder = Number(
    formData.get("test_order") || 1
  );

  if (!id || !moduleId || !title) {
    console.error(
      "Update Test: ID, module and title are required."
    );
    return;
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0
  ) {
    console.error("Update Test: Invalid duration.");
    return;
  }

  if (
    !Number.isInteger(totalMarks) ||
    totalMarks < 0
  ) {
    console.error("Update Test: Invalid total marks.");
    return;
  }

  if (
    !Number.isInteger(passingMarks) ||
    passingMarks < 0
  ) {
    console.error("Update Test: Invalid passing marks.");
    return;
  }

  if (passingMarks > totalMarks && totalMarks > 0) {
    console.error(
      "Update Test: Passing marks cannot exceed total marks."
    );
    return;
  }

  if (
    !Number.isInteger(attemptLimit) ||
    attemptLimit <= 0
  ) {
    console.error("Update Test: Invalid attempt limit.");
    return;
  }

  if (!Number.isInteger(testOrder) || testOrder < 1) {
    console.error("Update Test: Invalid test order.");
    return;
  }

  if (!["published", "draft", "closed"].includes(status)) {
    console.error("Update Test: Invalid status.");
    return;
  }

  const { error } = await supabase
    .from("tests")
    .update({
      module_id: moduleId,
      title,
      description: description || null,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
      passing_marks: passingMarks,
      attempt_limit: attemptLimit,
      status,
      test_order: testOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update Test Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Update Test Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/tests");
}

export async function deleteTest(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    console.error("Delete Test: Test ID is required.");
    return;
  }

  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Test Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Test Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/tests");
}

export async function createTestQuestion(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const testId = String(
    formData.get("test_id") || ""
  ).trim();

  const question = String(
    formData.get("question") || ""
  ).trim();

  const questionType = String(
    formData.get("question_type") || "mcq"
  ).trim();

  const optionA = String(
    formData.get("option_a") || ""
  ).trim();

  const optionB = String(
    formData.get("option_b") || ""
  ).trim();

  const optionC = String(
    formData.get("option_c") || ""
  ).trim();

  const optionD = String(
    formData.get("option_d") || ""
  ).trim();

  const correctAnswer = String(
    formData.get("correct_answer") || ""
  ).trim();

  const marks = Number(
    formData.get("marks") || 1
  );

  const questionOrder = Number(
    formData.get("question_order") || 1
  );

  if (!testId || !question) {
    console.error(
      "Create Question: Test and question are required."
    );
    return;
  }

  if (questionType !== "mcq") {
    console.error(
      "Create Question: Invalid question type."
    );
    return;
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    console.error(
      "Create Question: All four options are required."
    );
    return;
  }

  const normalizedCorrectAnswer =
    correctAnswer.toLowerCase();

  if (
    !["a", "b", "c", "d"].includes(
      normalizedCorrectAnswer
    )
  ) {
    console.error(
      "Create Question: Correct answer must be A, B, C or D."
    );
    return;
  }

  if (
    !Number.isInteger(marks) ||
    marks <= 0
  ) {
    console.error(
      "Create Question: Invalid marks."
    );
    return;
  }

  if (
    !Number.isInteger(questionOrder) ||
    questionOrder < 1
  ) {
    console.error(
      "Create Question: Invalid question order."
    );
    return;
  }

  const { error } = await supabase
    .from("test_questions")
    .insert({
      test_id: testId,
      question,
      question_type: questionType,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: normalizedCorrectAnswer,
      marks,
      question_order: questionOrder,
    });

  if (error) {
    console.error("Create Question Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Create Question Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/tests");
}

export async function deleteTestQuestion(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const id = String(
    formData.get("id") || ""
  ).trim();

  if (!id) {
    console.error(
      "Delete Question: Question ID is required."
    );
    return;
  }

  const { error } = await supabase
    .from("test_questions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Question Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      `Delete Question Error: ${error.message} | Details: ${
        error.details || "none"
      } | Hint: ${error.hint || "none"}`
    );
  }

  revalidatePath("/admin/tests");
}