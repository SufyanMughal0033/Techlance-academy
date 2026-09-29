import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  createTest,
  updateTest,
  deleteTest,
  createTestQuestion,
  deleteTestQuestion,
} from "./actions";

export const metadata = {
  title: "Tests",
};

export default async function TestsPage() {
  const supabase = await createClient();

  const [
    { data: tests, error: testsError },
    { data: modules },
    { data: questions },
  ] = await Promise.all([
    supabase
      .from("tests")
      .select(
        "id, module_id, title, description, duration_minutes, total_marks, passing_marks, attempt_limit, status, test_order, created_at, updated_at"
      )
      .order("test_order", { ascending: true }),

    supabase
      .from("modules")
      .select("id, title, program_id")
      .order("title", { ascending: true }),

    supabase
      .from("test_questions")
      .select(
        "id, test_id, question, question_type, option_a, option_b, option_c, option_d, correct_answer, marks, question_order"
      )
      .order("question_order", { ascending: true }),
  ]);

  const moduleMap = new Map(
    (modules ?? []).map((module) => [
      module.id,
      module,
    ])
  );

  const questionsByTest = new Map<
    string,
    typeof questions
  >();

  for (const question of questions ?? []) {
    const existing =
      questionsByTest.get(question.test_id) ?? [];

    existing.push(question);
    questionsByTest.set(question.test_id, existing);
  }

  const totalTests = tests?.length ?? 0;

  const publishedCount =
    tests?.filter(
      (test) => test.status === "published"
    ).length ?? 0;

  const draftCount =
    tests?.filter(
      (test) => test.status === "draft"
    ).length ?? 0;

  const closedCount =
    tests?.filter(
      (test) => test.status === "closed"
    ).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold">
          Tests
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Create and manage student tests and MCQ questions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Tests
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {totalTests}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Published
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {publishedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Draft
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {draftCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Closed
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {closedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Test */}
      <Card>
        <CardHeader>
          <CardTitle>Create Test</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={createTest}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Module
              </label>

              <select
                name="module_id"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select module</option>

                {(modules ?? []).map((module) => (
                  <option
                    key={module.id}
                    value={module.id}
                  >
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Test Title
              </label>

              <Input
                name="title"
                placeholder="React JS Final Test"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Description
              </label>

              <Input
                name="description"
                placeholder="Test description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Duration (minutes)
              </label>

              <Input
                name="duration_minutes"
                type="number"
                min="1"
                defaultValue="30"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Total Marks
              </label>

              <Input
                name="total_marks"
                type="number"
                min="0"
                defaultValue="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Passing Marks
              </label>

              <Input
                name="passing_marks"
                type="number"
                min="0"
                defaultValue="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Attempt Limit
              </label>

              <Input
                name="attempt_limit"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                defaultValue="published"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Test Order
              </label>

              <Input
                name="test_order"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">
                Create Test
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>

        <CardContent>
          {testsError ? (
            <div className="py-10 text-center text-sm text-destructive">
              Failed to load tests: {testsError.message}
            </div>
          ) : !tests?.length ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No tests found.
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => {
                const module = moduleMap.get(
                  test.module_id
                );

                const testQuestions =
                  questionsByTest.get(test.id) ?? [];

                return (
                  <div
                    key={test.id}
                    className="rounded-lg border p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {test.title}
                          </h3>

                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                            {test.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Module:{" "}
                          {module?.title ?? "Unknown Module"}
                        </p>

                        {test.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {test.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <details>
                          <summary className="cursor-pointer list-none">
                            <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                              Edit
                            </span>
                          </summary>

                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
                              <h3 className="mb-5 text-lg font-semibold">
                                Edit Test
                              </h3>

                              <form
                                action={updateTest}
                                className="grid gap-4 md:grid-cols-2"
                              >
                                <input
                                  type="hidden"
                                  name="id"
                                  value={test.id}
                                />

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Module
                                  </label>

                                  <select
                                    name="module_id"
                                    defaultValue={
                                      test.module_id
                                    }
                                    required
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                  >
                                    {(modules ?? []).map(
                                      (moduleOption) => (
                                        <option
                                          key={
                                            moduleOption.id
                                          }
                                          value={
                                            moduleOption.id
                                          }
                                        >
                                          {
                                            moduleOption.title
                                          }
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Test Title
                                  </label>

                                  <Input
                                    name="title"
                                    defaultValue={test.title}
                                    required
                                  />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-sm font-medium">
                                    Description
                                  </label>

                                  <Input
                                    name="description"
                                    defaultValue={
                                      test.description ?? ""
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Duration
                                  </label>

                                  <Input
                                    name="duration_minutes"
                                    type="number"
                                    min="1"
                                    defaultValue={
                                      test.duration_minutes
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Total Marks
                                  </label>

                                  <Input
                                    name="total_marks"
                                    type="number"
                                    min="0"
                                    defaultValue={
                                      test.total_marks
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Passing Marks
                                  </label>

                                  <Input
                                    name="passing_marks"
                                    type="number"
                                    min="0"
                                    defaultValue={
                                      test.passing_marks
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Attempt Limit
                                  </label>

                                  <Input
                                    name="attempt_limit"
                                    type="number"
                                    min="1"
                                    defaultValue={
                                      test.attempt_limit
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>

                                  <select
                                    name="status"
                                    defaultValue={test.status}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                  >
                                    <option value="published">
                                      Published
                                    </option>

                                    <option value="draft">
                                      Draft
                                    </option>

                                    <option value="closed">
                                      Closed
                                    </option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Test Order
                                  </label>

                                  <Input
                                    name="test_order"
                                    type="number"
                                    min="1"
                                    defaultValue={
                                      test.test_order
                                    }
                                  />
                                </div>

                                <div className="flex gap-2 md:col-span-2">
                                  <Button type="submit">
                                    Save Changes
                                  </Button>

                                  <a
                                    href="/admin/tests"
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
                                  >
                                    Cancel
                                  </a>
                                </div>
                              </form>
                            </div>
                          </div>
                        </details>

                        <form action={deleteTest}>
                          <input
                            type="hidden"
                            name="id"
                            value={test.id}
                          />

                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </form>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-md bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>

                        <p className="mt-1 font-medium">
                          {test.duration_minutes} min
                        </p>
                      </div>

                      <div className="rounded-md bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Marks
                        </p>

                        <p className="mt-1 font-medium">
                          {test.total_marks}
                        </p>
                      </div>

                      <div className="rounded-md bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Passing
                        </p>

                        <p className="mt-1 font-medium">
                          {test.passing_marks}
                        </p>
                      </div>

                      <div className="rounded-md bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Attempts
                        </p>

                        <p className="mt-1 font-medium">
                          {test.attempt_limit}
                        </p>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="mt-6 border-t pt-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Questions
                          </h4>

                          <p className="text-xs text-muted-foreground">
                            {testQuestions.length} question
                            {testQuestions.length !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>

                      <form
                        action={createTestQuestion}
                        className="grid gap-4 rounded-lg bg-secondary/30 p-4"
                      >
                        <input
                          type="hidden"
                          name="test_id"
                          value={test.id}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Question
                          </label>

                          <Input
                            name="question"
                            placeholder="What is a React component?"
                            required
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Option A
                            </label>

                            <Input
                              name="option_a"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Option B
                            </label>

                            <Input
                              name="option_b"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Option C
                            </label>

                            <Input
                              name="option_c"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Option D
                            </label>

                            <Input
                              name="option_d"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Correct Answer
                            </label>

                            <select
                              name="correct_answer"
                              defaultValue="A"
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="A">
                                Option A
                              </option>

                              <option value="B">
                                Option B
                              </option>

                              <option value="C">
                                Option C
                              </option>

                              <option value="D">
                                Option D
                              </option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Marks
                            </label>

                            <Input
                              name="marks"
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Question Order
                            </label>

                            <Input
                              name="question_order"
                              type="number"
                              min="1"
                              defaultValue={
                                testQuestions.length + 1
                              }
                            />
                          </div>
                        </div>

                        <input
                          type="hidden"
                          name="question_type"
                          value="mcq"
                        />

                        <div>
                          <Button type="submit">
                            Add Question
                          </Button>
                        </div>
                      </form>

                      {testQuestions.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {testQuestions.map(
                            (question, index) => (
                              <div
                                key={question.id}
                                className="rounded-lg border p-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="font-medium">
                                      {index + 1}.{" "}
                                      {question.question}
                                    </p>

                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                      <div className="rounded border p-2 text-sm">
                                        <strong>A:</strong>{" "}
                                        {question.option_a}
                                      </div>

                                      <div className="rounded border p-2 text-sm">
                                        <strong>B:</strong>{" "}
                                        {question.option_b}
                                      </div>

                                      <div className="rounded border p-2 text-sm">
                                        <strong>C:</strong>{" "}
                                        {question.option_c}
                                      </div>

                                      <div className="rounded border p-2 text-sm">
                                        <strong>D:</strong>{" "}
                                        {question.option_d}
                                      </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                      <span>
                                        Correct:{" "}
                                        <strong>
                                          {
                                            question.correct_answer
                                          }
                                        </strong>
                                      </span>

                                      <span>
                                        Marks:{" "}
                                        <strong>
                                          {question.marks}
                                        </strong>
                                      </span>

                                      <span>
                                        Order:{" "}
                                        <strong>
                                          {
                                            question.question_order
                                          }
                                        </strong>
                                      </span>
                                    </div>
                                  </div>

                                  <form
                                    action={
                                      deleteTestQuestion
                                    }
                                  >
                                    <input
                                      type="hidden"
                                      name="id"
                                      value={question.id}
                                    />

                                    <Button
                                      type="submit"
                                      variant="destructive"
                                      size="sm"
                                    >
                                      Delete
                                    </Button>
                                  </form>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}