"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function startTest(testId: string) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // Get test
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select(`
      id,
      duration_minutes,
      total_marks,
      attempt_limit,
      status,
      module:modules (
        program_id
      )
    `)
    .eq("id", testId)
    .eq("status", "published")
    .maybeSingle();

  if (testError || !test) {
    return {
      error: "Test not found.",
    };
  }

  const moduleData = test.module;

  const module = Array.isArray(moduleData)
    ? moduleData[0]
    : moduleData;

  if (!module) {
    return {
      error: "Test module not found.",
    };
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("program_id", module.program_id)
    .eq("status", "active")
    .maybeSingle();

  if (!enrollment) {
    return {
      error: "You are not enrolled in this program.",
    };
  }

  // Check attempt count
  const { count: attemptCount } = await supabase
    .from("test_attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_id", testId)
    .eq("student_id", user.id);

  if ((attemptCount ?? 0) >= test.attempt_limit) {
    return {
      error: "You have used all available attempts.",
    };
  }

  // Check for existing unfinished attempt
  const { data: existingAttempt } = await supabase
    .from("test_attempts")
    .select("id, status")
    .eq("test_id", testId)
    .eq("student_id", user.id)
    .eq("status", "in_progress")
    .maybeSingle();

  if (existingAttempt) {
    return {
      success: true,
      attemptId: existingAttempt.id,
    };
  }

  // Create new attempt
  const { data: attempt, error: attemptError } = await supabase
    .from("test_attempts")
    .insert({
      test_id: testId,
      student_id: user.id,
      total_marks: test.total_marks,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    return {
      error: "Unable to start the test. Please try again.",
    };
  }

  revalidatePath("/student/tests");

  return {
    success: true,
    attemptId: attempt.id,
  };
}


export async function submitTest(
  attemptId: string,
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
  }>
) {
  const { user } = await requireRole("student");
  const supabase = await createClient();

  // Verify attempt belongs to current student
  const { data: attempt, error: attemptError } = await supabase
    .from("test_attempts")
    .select(`
      id,
      test_id,
      status,
      test:tests (
        id,
        total_marks,
        passing_marks
      )
    `)
    .eq("id", attemptId)
    .eq("student_id", user.id)
    .maybeSingle();

  if (attemptError || !attempt) {
    return {
      error: "Test attempt not found.",
    };
  }

  if (attempt.status !== "in_progress") {
    return {
      error: "This test has already been submitted.",
    };
  }

  const testData = attempt.test;

  const test = Array.isArray(testData)
    ? testData[0]
    : testData;

  if (!test) {
    return {
      error: "Test not found.",
    };
  }

  // Get questions
  const { data: questions, error: questionsError } =
    await supabase
      .from("test_questions")
      .select(`
        id,
        correct_answer,
        marks
      `)
      .eq("test_id", test.id);

  if (questionsError || !questions) {
    return {
      error: "Unable to load test questions.",
    };
  }

  // Prevent duplicate answers
  const uniqueAnswers = new Map(
    answers.map((answer) => [
      answer.questionId,
      answer.selectedAnswer,
    ])
  );

  let marksObtained = 0;

  const answerRows = questions.map((question) => {
    const selectedAnswer =
      uniqueAnswers.get(question.id) ?? null;

    const isCorrect =
      selectedAnswer !== null &&
      selectedAnswer === question.correct_answer;

    const marks = isCorrect ? question.marks : 0;

    marksObtained += marks;

    return {
      attempt_id: attempt.id,
      question_id: question.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      marks_obtained: marks,
    };
  });

  // Save answers
  if (answerRows.length > 0) {
    const { error: answersError } = await supabase
      .from("test_answers")
      .upsert(answerRows, {
        onConflict: "attempt_id,question_id",
      });

    if (answersError) {
      return {
        error: "Unable to save your answers.",
      };
    }
  }

  const totalMarks = test.total_marks;

  const percentage =
    totalMarks > 0
      ? Number(((marksObtained / totalMarks) * 100).toFixed(2))
      : 0;

  const passed = marksObtained >= test.passing_marks;

  const { error: updateError } = await supabase
    .from("test_attempts")
    .update({
      submitted_at: new Date().toISOString(),
      marks_obtained: marksObtained,
      total_marks: totalMarks,
      percentage,
      status: passed ? "passed" : "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", attempt.id)
    .eq("student_id", user.id);

  if (updateError) {
    return {
      error: "Unable to submit your test.",
    };
  }

  revalidatePath("/student/tests");
  revalidatePath(`/student/tests/${test.id}`);

  return {
    success: true,
    marksObtained,
    totalMarks,
    percentage,
    passed,
  };
}