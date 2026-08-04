export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "SUPER_ADMIN" | "PRINCIPAL" | "REGISTRAR" | "ACCOUNTANT" | "TUTOR" | "STUDENT" | "APPLICANT" | "STAFF";
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  phone?: string;
  photo_url?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  level: string;
  department_id: string;
  duration_years: number;
  description?: string;
  is_active: boolean;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hod_id?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  program_id: string;
  subject_id?: string;
  year: number;
  semester: string;
  credits: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  program?: Program;
  subject?: Subject;
  tutors?: User[];
  topics?: Topic[];
  pivot?: {
    status: string;
    enrolled_at: string;
  };
}

export interface Topic {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_no: number;
  materials?: Material[];
}

export interface Material {
  id: string;
  topic_id: string;
  type: "PDF" | "SLIDE" | "VIDEO" | "LINK" | "ASSIGNMENT";
  title: string;
  file_url?: string;
  uploaded_by: string;
  due_date?: string;
  total_marks?: number;
  description?: string;
  submissions?: { id: string; status: string; marks?: number }[];
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  instructions?: string;
  max_marks: number;
  open_at?: string;
  due_at?: string;
  timer_minutes?: number;
  allow_late: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url?: string;
  content?: string;
  submitted_at: string;
  marks?: number;
  feedback?: string;
  status: "ON_TIME" | "LATE";
  student?: User;
}

export interface Announcement {
  id: string;
  scope: "GLOBAL" | "COURSE";
  course_id?: string;
  title: string;
  body: string;
  is_pinned: boolean;
  created_by: string;
  created_at?: string;
  creator?: User;
}

export interface DashboardStats {
  // Admin
  total_users?: number;
  total_students?: number;
  total_tutors?: number;
  total_staff?: number;
  total_applicants?: number;
  total_programs?: number;
  total_courses?: number;
  active_courses?: number;
  total_enrollments?: number;
  pending_applications?: number;
  pending_payments?: number;
  confirmed_payments?: number;
  failed_jobs?: number;
  storage_used?: number;
  // Student
  enrolled_courses?: number;
  completed_courses?: number;
  pending_assignments?: number;
  my_submissions?: number;
  // Tutor
  teaching_courses?: number;
  students_taught?: number;
  total_assignments?: number;
  total_submissions?: number;
  pending_submissions?: number;
  upcoming_classes?: number;
  // Principal
  applications_accepted?: number;
  applications_pending?: number;
  applications_rejected?: number;
  pass_rate?: number;
  fee_collection_rate?: number;
  total_collected?: number;
  total_outstanding?: number;
  // Registrar
  new_applications?: number;
  under_review?: number;
  accepted?: number;
  rejected?: number;
  enrolled_this_term?: number;
  courses_without_tutor?: number;
  // Accountant
  pending_verification?: number;
  outstanding_debts?: number;
  confirmations_today?: number;
  total_debtors?: number;
  // Applicant
  application_status?: string;
  program_applied?: string;
  mode_applied?: string;
  has_pay_slip?: boolean;
  // Staff
  announcements_count?: number;
  unread_messages?: number;
  upcoming_events?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    last_page: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

// ===== Certificate Types =====
export interface CertificateTemplate {
  id: string;
  name: string;
  type: "COMPLETION" | "AWARD" | "TRANSCRIPT" | "PARTICIPATION";
  page_size: "A4" | "A5" | "LETTER";
  orientation: "PORTRAIT" | "LANDSCAPE";
  trigger_type: string;
  trigger_config?: Record<string, unknown>;
  requires_fees_cleared: boolean;
  is_active: boolean;
  pages?: CertificatePage[];
  issues_count?: number;
}

export interface CertificatePage {
  id: string;
  template_id: string;
  page_no: number;
  width: number;
  height: number;
  background_image_url?: string;
  margin: number;
  elements?: CertificateElement[];
}

export interface CertificateElement {
  id: string;
  page_id: string;
  element_type: string;
  data?: Record<string, unknown>;
  pos_x: number;
  pos_y: number;
  width?: number;
  font: string;
  font_size: number;
  colour: string;
  align: "LEFT" | "CENTER" | "RIGHT";
  refpoint: string;
  z_index: number;
}

export interface CertificateIssue {
  id: string;
  template_id: string;
  user_id: string;
  course_id?: string;
  program_id?: string;
  code: string;
  hash: string;
  grade?: string;
  classification?: string;
  issued_by: string;
  issued_at: string;
  status: "ISSUED" | "REVOKED" | "REISSUED";
  revoke_reason?: string;
  serial_number?: number;
  template?: CertificateTemplate;
  user?: User;
  course?: Course;
  issuer?: User;
}

export interface CertificateVerification {
  valid: boolean;
  status: "VALID" | "REVOKED" | "NOT_FOUND";
  name?: string;
  program?: string;
  type?: string;
  grade?: string;
  classification?: string;
  issued_at?: string;
  code?: string;
}

export interface Award {
  id: string;
  name: string;
  description?: string;
  criteria?: Record<string, unknown>;
  template_id?: string;
  is_active: boolean;
}

export interface Transcript {
  student: { name: string; email: string };
  courses: {
    course_code?: string;
    course_title?: string;
    ca_marks: number;
    exam_marks: number;
    total: number;
    grade: string;
    academic_year: string;
    semester: string;
  }[];
  average: number;
  total_courses: number;
  generated_at: string;
}

// ===== Notification Types =====
export interface Notification {
  id: string;
  user_id: string;
  component?: string;
  event_type?: string;
  subject: string;
  body?: string;
  context_url?: string;
  read: boolean;
  read_at?: string;
  created_at?: string;
}

// ===== Message Types =====
export interface Conversation {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  members?: ConversationMember[];
  messages?: Message[];
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_at?: string;
  user?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  body: string;
  reply_to?: string;
  created_at?: string;
  user?: User;
}

// ===== Calendar Types =====
export interface CalendarEvent {
  id: string;
  name: string;
  description?: string;
  timestart: string;
  timeduration: number;
  eventtype: "course" | "site" | "user" | "group" | "category";
  course_id?: string;
  location?: string;
  visible: boolean;
}

// ===== Gradebook Types =====
export interface GradeItem {
  id: string;
  course_id: string;
  itemname?: string;
  itemtype: string;
  itemmodule?: string;
  grademax: number;
  grademin: number;
  hidden: boolean;
  category_id?: string;
}

export interface GradeCategory {
  id: string;
  course_id: string;
  fullname: string;
  aggregation: string;
}

export interface StudentGrade {
  item: GradeItem;
  grade?: { id: string; finalgrade?: number; feedback?: string };
  percentage?: number;
}

// ===== Badge Types =====
export interface Badge {
  id: string;
  name: string;
  description?: string;
  image?: string;
  type: string;
  active: boolean;
  issued_count?: number;
}

export interface BadgeIssued {
  id: string;
  badge_id: string;
  user_id: string;
  badge?: Badge;
}

// ===== Competency Types =====
export interface CompetencyFramework {
  id: string;
  name: string;
  description?: string;
  competencies_count?: number;
}

export interface Competency {
  id: string;
  framework_id: string;
  shortname: string;
  description?: string;
}

// ===== Question Bank Types =====
export interface QuestionCategory {
  id: string;
  name: string;
  info?: string;
  questions_count?: number;
}

export interface Question {
  id: string;
  category_id: string;
  qtype: string;
  name: string;
  questiontext: string;
  defaultmark: number;
  answers?: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  question_id: string;
  answer_no: number;
  answer: string;
  fraction: number;
  feedback?: string;
}
