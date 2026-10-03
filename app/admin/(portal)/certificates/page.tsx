import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "./actions";

export const metadata = {
  title: "Certificates",
};

export default async function CertificatesPage() {
  const supabase = await createClient();

  const [certificatesResult, studentsResult, programsResult] =
    await Promise.all([
      supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("profiles")
        .select("id, fullname, email, student_id")
        .eq("role", "student")
        .eq("is_active", true)
        .order("fullname"),

      supabase
        .from("programs")
        .select("id, title")
        .order("title"),
    ]);

  const certificates = certificatesResult.data ?? [];
  const students = studentsResult.data ?? [];
  const programs = programsResult.data ?? [];

  const studentMap = new Map(
    students.map((student) => [
      student.id,
      {
        fullname: student.fullname,
        email: student.email,
        student_id: student.student_id,
      },
    ])
  );

  const programMap = new Map(
    programs.map((program) => [program.id, program.title])
  );

  const issuedCount = certificates.filter(
    (certificate) => certificate.status === "issued"
  ).length;

  const revokedCount = certificates.filter(
    (certificate) => certificate.status === "revoked"
  ).length;

  const expiredCount = certificates.filter(
    (certificate) => certificate.status === "expired"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Certificates
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Issue and manage student certificates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Certificates
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {certificates.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Issued
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {issuedCount}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Revoked
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {revokedCount}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Expired
          </p>

          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {expiredCount}
          </p>
        </div>
      </div>

      {/* Create Certificate */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Issue New Certificate
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Certificate number and title will be generated automatically.
          </p>
        </div>

        <form
          action={createCertificate}
          className="grid gap-5"
        >
          {/* Student + Program */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Student */}
            <div className="space-y-2">
              <label
                htmlFor="student_id"
                className="text-sm font-medium"
              >
                Student
              </label>

              <select
                id="student_id"
                name="student_id"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select student</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_id
                      ? `${student.student_id} — ${student.fullname}`
                      : student.fullname}
                  </option>
                ))}
              </select>
            </div>

            {/* Program */}
            <div className="space-y-2">
              <label
                htmlFor="program_id"
                className="text-sm font-medium"
              >
                Program
              </label>

              <select
                id="program_id"
                name="program_id"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select program</option>

                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue Date + Status */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Issue Date */}
            <div className="space-y-2">
              <label
                htmlFor="issue_date"
                className="text-sm font-medium"
              >
                Issue Date
              </label>

              <input
                id="issue_date"
                name="issue_date"
                type="date"
                required
                defaultValue={new Date()
                  .toISOString()
                  .split("T")[0]}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="issued"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="issued">Issued</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <label
              htmlFor="certificate_file"
              className="text-sm font-medium"
            >
              Certificate PDF
            </label>

            <input
              id="certificate_file"
              name="certificate_file"
              type="file"
              accept="application/pdf,.pdf"
              className="block w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm"
            />

            <p className="text-xs text-muted-foreground">
              Upload the student's certificate as a PDF. Maximum file size:
              10 MB.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Optional certificate description..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Issue Certificate
            </button>
          </div>
        </form>
      </div>

      {/* Certificate List */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            All Certificates
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage issued certificates and their status.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No certificates found.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {certificates.map((certificate) => {
              const student = studentMap.get(certificate.student_id);
              const program = programMap.get(certificate.program_id);

              return (
                <div
                  key={certificate.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      {/* Certificate Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {certificate.certificate_number}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            certificate.status === "issued"
                              ? "bg-emerald-100 text-emerald-700"
                              : certificate.status === "revoked"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {certificate.status}
                        </span>
                      </div>

                      {/* Certificate Title */}
                      <p className="mt-2 text-sm font-medium">
                        {certificate.title}
                      </p>

                      {/* Certificate Details */}
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <p>
                          <span className="font-medium text-foreground">
                            Student:
                          </span>{" "}
                          {student?.student_id
                            ? `${student.student_id} — ${student.fullname}`
                            : student?.fullname || "Unknown student"}
                        </p>

                        <p>
                          <span className="font-medium text-foreground">
                            Program:
                          </span>{" "}
                          {program || "Unknown program"}
                        </p>

                        <p>
                          <span className="font-medium text-foreground">
                            Issue Date:
                          </span>{" "}
                          {certificate.issue_date}
                        </p>
                      </div>

                      {/* Description */}
                      {certificate.description && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Description:
                          </span>{" "}
                          {certificate.description}
                        </p>
                      )}

                      {/* PDF */}
                      {certificate.certificate_url && (
                        <div className="mt-3">
                          <Link
                            href={certificate.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View / Download Certificate PDF
                          </Link>
                        </div>
                      )}

                      {!certificate.certificate_url && (
                        <p className="mt-3 text-xs text-amber-600">
                          No certificate PDF uploaded.
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2">
                      <details className="relative">
                        <summary className="cursor-pointer list-none rounded-lg border px-4 py-2 text-sm font-medium">
                          Edit
                        </summary>

                        <div className="absolute right-0 z-20 mt-2 w-[min(92vw,560px)] rounded-xl border bg-background p-5 shadow-xl">
                          <div className="mb-5">
                            <h4 className="font-semibold">
                              Edit Certificate
                            </h4>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Certificate number and title are system-generated.
                            </p>
                          </div>

                          {/* Generated Certificate Info */}
                          <div className="mb-5 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border bg-muted/30 p-3">
                              <p className="text-xs text-muted-foreground">
                                Certificate Number
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {certificate.certificate_number}
                              </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-3">
                              <p className="text-xs text-muted-foreground">
                                Certificate Title
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {certificate.title}
                              </p>
                            </div>
                          </div>

                          {/* Edit Form */}
                          <form
                            action={updateCertificate}
                            className="grid gap-4"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={certificate.id}
                            />

                            {/* Student */}
                            <div className="space-y-2">
                              <label
                                htmlFor={`edit-student-${certificate.id}`}
                                className="text-sm font-medium"
                              >
                                Student
                              </label>

                              <select
                                id={`edit-student-${certificate.id}`}
                                name="student_id"
                                required
                                defaultValue={certificate.student_id}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                              >
                                <option value="">
                                  Select student
                                </option>

                                {students.map((student) => (
                                  <option
                                    key={student.id}
                                    value={student.id}
                                  >
                                    {student.student_id
                                      ? `${student.student_id} — ${student.fullname}`
                                      : student.fullname}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Program */}
                            <div className="space-y-2">
                              <label
                                htmlFor={`edit-program-${certificate.id}`}
                                className="text-sm font-medium"
                              >
                                Program
                              </label>

                              <select
                                id={`edit-program-${certificate.id}`}
                                name="program_id"
                                required
                                defaultValue={certificate.program_id}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                              >
                                <option value="">
                                  Select program
                                </option>

                                {programs.map((program) => (
                                  <option
                                    key={program.id}
                                    value={program.id}
                                  >
                                    {program.title}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Issue Date + Status */}
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label
                                  htmlFor={`edit-date-${certificate.id}`}
                                  className="text-sm font-medium"
                                >
                                  Issue Date
                                </label>

                                <input
                                  id={`edit-date-${certificate.id}`}
                                  name="issue_date"
                                  type="date"
                                  required
                                  defaultValue={certificate.issue_date}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                              </div>

                              <div className="space-y-2">
                                <label
                                  htmlFor={`edit-status-${certificate.id}`}
                                  className="text-sm font-medium"
                                >
                                  Status
                                </label>

                                <select
                                  id={`edit-status-${certificate.id}`}
                                  name="status"
                                  defaultValue={certificate.status}
                                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                  <option value="issued">
                                    Issued
                                  </option>

                                  <option value="revoked">
                                    Revoked
                                  </option>

                                  <option value="expired">
                                    Expired
                                  </option>
                                </select>
                              </div>
                            </div>

                            {/* Replace PDF */}
                            <div className="space-y-2">
                              <label
                                htmlFor={`edit-file-${certificate.id}`}
                                className="text-sm font-medium"
                              >
                                Replace Certificate PDF
                              </label>

                              <input
                                id={`edit-file-${certificate.id}`}
                                name="certificate_file"
                                type="file"
                                accept="application/pdf,.pdf"
                                className="block w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm"
                              />

                              <p className="text-xs text-muted-foreground">
                                Leave empty to keep the current PDF.
                              </p>

                              {certificate.certificate_url && (
                                <Link
                                  href={certificate.certificate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs font-medium text-primary hover:underline"
                                >
                                  Open current PDF
                                </Link>
                              )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <label
                                htmlFor={`edit-description-${certificate.id}`}
                                className="text-sm font-medium"
                              >
                                Description
                              </label>

                              <textarea
                                id={`edit-description-${certificate.id}`}
                                name="description"
                                rows={3}
                                defaultValue={
                                  certificate.description ?? ""
                                }
                                placeholder="Optional certificate description..."
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                              />
                            </div>

                            {/* Save */}
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      </details>

                      {/* Delete */}
                      <form action={deleteCertificate}>
                        <input
                          type="hidden"
                          name="id"
                          value={certificate.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}