export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "lecturer" | "student";
  phone?: string;
  bio?: string;
  avatar?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  cover_image?: string;
  credit_hours: number;
  status: "draft" | "published" | "archived";
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  lecturers?: User[];
  modules?: Module[];
  announcements?: Announcement[];
  students_count?: number;
  modules_count?: number;
  pivot?: {
    role: string;
    progress: string;
    enrolled_at: string;
    completed_at?: string;
  };
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order: number;
  is_published: boolean;
  materials?: Material[];
  assignments?: Assignment[];
}

export interface Material {
  id: number;
  module_id: number;
  uploaded_by: number;
  title: string;
  description?: string;
  type: "file" | "video" | "link" | "document";
  file_path?: string;
  file_url?: string;
  file_size?: string;
  mime_type?: string;
  order: number;
  is_published: boolean;
}

export interface Assignment {
  id: number;
  module_id: number;
  created_by: number;
  title: string;
  description?: string;
  max_score: number;
  due_date?: string;
  allow_late_submission: boolean;
  is_published: boolean;
  submissions?: Submission[];
}

export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  content?: string;
  file_path?: string;
  file_name?: string;
  score?: number;
  feedback?: string;
  status: "pending" | "submitted" | "graded";
  submitted_at: string;
  graded_at?: string;
  user?: User;
  assignment?: Assignment;
}

export interface Announcement {
  id: number;
  course_id: number;
  user_id: number;
  title: string;
  body: string;
  is_pinned: boolean;
  created_at?: string;
  user?: User;
}

export interface DashboardStats {
  total_users?: number;
  total_students?: number;
  total_lecturers?: number;
  total_courses?: number;
  published_courses?: number;
  total_enrollments?: number;
  total_assignments?: number;
  total_submissions?: number;
  teaching_courses?: number;
  pending_submissions?: number;
  enrolled_courses?: number;
  completed_courses?: number;
  pending_assignments?: number;
  graded_submissions?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
