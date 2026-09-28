/**
 * Hand-authored to match supabase/migrations/*.sql exactly. Once the
 * Supabase project is live, regenerate this file from the real database
 * with:
 *
 *   npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts
 *
 * ...and it will supersede this file (the schema is the source of truth,
 * this file is a stand-in for local development until then).
 */

export type UserRole = "admin" | "instructor" | "student";
export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "assessment_scheduled"
  | "approved"
  | "rejected"
  | "enrolled";
export type LearningMode = "online_live" | "self_paced" | "hybrid";
export type EnrollmentStatus = "pending" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "partial" | "paid";
export type ProgramStatus = "draft" | "published" | "archived";
export type ProgramLevel = "beginner" | "intermediate" | "advanced";
export type ClassStatus = "scheduled" | "live" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type AssignmentStatus = "pending" | "submitted" | "reviewed" | "late";
export type CertificateStatus = "valid" | "revoked";
export type AnnouncementTargetType = "all" | "program" | "student";
export type BlogStatus = "draft" | "published";
export type NotificationType =
  | "announcement"
  | "class_reminder"
  | "assignment"
  | "quiz"
  | "certificate"
  | "application_status"
  | "enrollment_update";

interface Table<Row, Insert, Update = Partial<Insert>> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          role: UserRole;
          full_name: string;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          avatar_url: string | null;
          city: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        { id: string; full_name?: string; email?: string | null; role?: UserRole }
      >;
      students: Table<
        {
          id: string;
          student_code: string | null;
          father_or_guardian_name: string | null;
          date_of_birth: string | null;
          gender: string | null;
          address: string | null;
          education_level: string | null;
          institution: string | null;
          field_of_study: string | null;
          graduation_year: number | null;
          previous_skills: string | null;
          previous_experience: string | null;
          career_goal: string | null;
          application_id: string | null;
          created_at: string;
          updated_at: string;
        },
        { id: string } & Partial<Record<string, unknown>>
      >;
      admins: Table<
        { id: string; department: string | null; title: string | null; created_at: string; updated_at: string },
        { id: string; department?: string; title?: string }
      >;
      instructors: Table<
        { id: string; bio: string | null; specialization: string | null; created_at: string; updated_at: string },
        { id: string; bio?: string; specialization?: string }
      >;
      applications: Table<
        {
          id: string;
          application_code: string;
          full_name: string;
          father_or_guardian_name: string | null;
          date_of_birth: string | null;
          gender: string | null;
          email: string;
          phone: string;
          whatsapp: string | null;
          city: string | null;
          address: string | null;
          education_level: string | null;
          institution: string | null;
          field_of_study: string | null;
          graduation_year: number | null;
          previous_skills: string | null;
          previous_experience: string | null;
          current_digital_skills: string | null;
          program_id: string | null;
          learning_mode: LearningMode;
          availability: string | null;
          career_goal: string | null;
          referral_source: string | null;
          message: string | null;
          agreed_to_terms: boolean;
          status: ApplicationStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          assessment_scheduled_at: string | null;
          converted_student_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          full_name: string;
          email: string;
          phone: string;
          agreed_to_terms: boolean;
        } & Partial<Record<string, unknown>>
      >;
      enrollments: Table<
        {
          id: string;
          student_id: string;
          program_id: string;
          start_date: string | null;
          end_date: string | null;
          status: EnrollmentStatus;
          fee: number | null;
          payment_status: PaymentStatus;
          created_at: string;
          updated_at: string;
        },
        { student_id: string; program_id: string } & Partial<Record<string, unknown>>
      >;
      programs: Table<
        {
          id: string;
          slug: string;
          name: string;
          category: string;
          level: ProgramLevel;
          short_description: string | null;
          overview: string | null;
          who_this_is_for: string | null;
          learning_outcomes: string | null;
          eligibility: string | null;
          requirements: string | null;
          duration_weeks: number | null;
          class_format: string | null;
          weekly_schedule: string | null;
          fee: number | null;
          currency: string;
          certificate_info: string | null;
          image_url: string | null;
          status: ProgramStatus;
          display_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { slug: string; name: string; category: string } & Partial<Record<string, unknown>>
      >;
      program_modules: Table<
        {
          id: string;
          program_id: string;
          title: string;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        },
        { program_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      courses: Table<
        { id: string; program_id: string; title: string; description: string | null; display_order: number; created_at: string; updated_at: string },
        { program_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      lessons: Table<
        { id: string; course_id: string; title: string; description: string | null; display_order: number; created_at: string; updated_at: string },
        { course_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      learning_materials: Table<
        {
          id: string;
          lesson_id: string;
          title: string;
          type: string;
          url: string | null;
          storage_bucket: string | null;
          storage_path: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        },
        { lesson_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      classes: Table<
        {
          id: string;
          program_id: string;
          program_module_id: string | null;
          title: string;
          description: string | null;
          class_date: string;
          start_time: string;
          end_time: string;
          instructor_id: string | null;
          meeting_link: string | null;
          status: ClassStatus;
          created_at: string;
          updated_at: string;
        },
        { program_id: string; title: string; class_date: string; start_time: string; end_time: string } & Partial<Record<string, unknown>>
      >;
      class_attendance: Table<
        {
          id: string;
          class_id: string;
          student_id: string;
          status: AttendanceStatus;
          marked_by: string | null;
          marked_at: string;
          created_at: string;
          updated_at: string;
        },
        { class_id: string; student_id: string; status: AttendanceStatus }
      >;
      assignments: Table<
        {
          id: string;
          program_id: string;
          program_module_id: string | null;
          title: string;
          description: string | null;
          instructions: string | null;
          attachment_bucket: string | null;
          attachment_path: string | null;
          due_date: string | null;
          max_marks: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { program_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      assignment_submissions: Table<
        {
          id: string;
          assignment_id: string;
          student_id: string;
          status: AssignmentStatus;
          submission_bucket: string | null;
          submission_path: string | null;
          submission_note: string | null;
          marks_obtained: number | null;
          feedback: string | null;
          submitted_at: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        },
        { assignment_id: string; student_id: string } & Partial<Record<string, unknown>>
      >;
      quizzes: Table<
        {
          id: string;
          program_id: string;
          program_module_id: string | null;
          title: string;
          description: string | null;
          time_limit_minutes: number | null;
          passing_score: number;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { program_id: string; title: string } & Partial<Record<string, unknown>>
      >;
      quiz_questions: Table<
        { id: string; quiz_id: string; question: string; marks: number; display_order: number; created_at: string },
        { quiz_id: string; question: string } & Partial<Record<string, unknown>>
      >;
      quiz_options: Table<
        { id: string; question_id: string; option_text: string; is_correct: boolean; display_order: number },
        { question_id: string; option_text: string; is_correct?: boolean }
      >;
      quiz_attempts: Table<
        {
          id: string;
          quiz_id: string;
          student_id: string;
          answers: Record<string, string>;
          score: number | null;
          passed: boolean | null;
          started_at: string;
          submitted_at: string | null;
          created_at: string;
        },
        { quiz_id: string; student_id: string; answers?: Record<string, string> }
      >;
      student_progress: Table<
        {
          id: string;
          student_id: string;
          program_id: string;
          modules_completed: number;
          modules_total: number;
          assignments_completed: number;
          assignments_total: number;
          average_quiz_score: number | null;
          attendance_percentage: number | null;
          overall_percentage: number;
          updated_at: string;
        },
        { student_id: string; program_id: string } & Partial<Record<string, unknown>>
      >;
      certificates: Table<
        {
          id: string;
          certificate_code: string;
          verification_code: string;
          student_id: string;
          program_id: string;
          status: CertificateStatus;
          issue_date: string;
          revoked_at: string | null;
          revoked_reason: string | null;
          file_bucket: string | null;
          file_path: string | null;
          issued_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { student_id: string; program_id: string } & Partial<Record<string, unknown>>
      >;
      certificate_verifications: Table<
        {
          id: string;
          looked_up_code: string;
          certificate_id: string | null;
          result: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        },
        { looked_up_code: string; result: string } & Partial<Record<string, unknown>>
      >;
      announcements: Table<
        {
          id: string;
          title: string;
          body: string;
          target_type: AnnouncementTargetType;
          is_published: boolean;
          published_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { title: string; body: string } & Partial<Record<string, unknown>>
      >;
      announcement_targets: Table<
        { id: string; announcement_id: string; program_id: string | null; student_id: string | null; created_at: string },
        { announcement_id: string; program_id?: string; student_id?: string }
      >;
      notifications: Table<
        {
          id: string;
          profile_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          link: string | null;
          is_read: boolean;
          created_at: string;
        },
        { profile_id: string; type: NotificationType; title: string } & Partial<Record<string, unknown>>
      >;
      faqs: Table<
        { id: string; category: string; question: string; answer: string; is_published: boolean; display_order: number; created_at: string; updated_at: string },
        { category: string; question: string; answer: string } & Partial<Record<string, unknown>>
      >;
      testimonials: Table<
        {
          id: string;
          student_name: string;
          program_name: string | null;
          message: string;
          photo_url: string | null;
          rating: number | null;
          is_demo: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        },
        { student_name: string; message: string } & Partial<Record<string, unknown>>
      >;
      blog_categories: Table<{ id: string; slug: string; name: string }, { slug: string; name: string }>;
      blog_posts: Table<
        {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          featured_image_url: string | null;
          category_id: string | null;
          author_id: string | null;
          tags: string[];
          seo_title: string | null;
          seo_description: string | null;
          status: BlogStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        },
        { slug: string; title: string } & Partial<Record<string, unknown>>
      >;
      resources: Table<
        {
          id: string;
          title: string;
          description: string | null;
          category: string;
          file_bucket: string | null;
          file_path: string | null;
          external_url: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        },
        { title: string; category: string } & Partial<Record<string, unknown>>
      >;
      contact_messages: Table<
        {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        },
        { name: string; email: string; message: string } & Partial<Record<string, unknown>>
      >;
      site_settings: Table<
        { key: string; value: unknown; updated_by: string | null; updated_at: string },
        { key: string; value: unknown }
      >;
      site_content: Table<
        { id: string; page: string; section: string; content: unknown; updated_by: string | null; updated_at: string },
        { page: string; section: string; content: unknown }
      >;
      audit_logs: Table<
        {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: unknown;
          created_at: string;
        },
        { action: string; entity_type: string } & Partial<Record<string, unknown>>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      verify_certificate: {
        Args: { p_code: string };
        Returns: {
          result: string;
          student_name: string | null;
          program_name: string | null;
          certificate_code: string | null;
          issue_date: string | null;
          status: CertificateStatus | null;
        }[];
      };
      get_quiz_questions: {
        Args: { p_quiz_id: string };
        Returns: {
          question_id: string;
          question: string;
          marks: number;
          display_order: number;
          option_id: string;
          option_text: string;
          option_order: number;
        }[];
      };
      submit_quiz_attempt: {
        Args: { p_quiz_id: string; p_answers: Record<string, string> };
        Returns: Database["public"]["Tables"]["quiz_attempts"]["Row"];
      };
      is_enrolled: { Args: { p_program_id: string }; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      application_status: ApplicationStatus;
      learning_mode: LearningMode;
      enrollment_status: EnrollmentStatus;
      payment_status: PaymentStatus;
      program_status: ProgramStatus;
      program_level: ProgramLevel;
      class_status: ClassStatus;
      attendance_status: AttendanceStatus;
      assignment_status: AssignmentStatus;
      certificate_status: CertificateStatus;
      announcement_target_type: AnnouncementTargetType;
      blog_status: BlogStatus;
      notification_type: NotificationType;
    };
  };
}
