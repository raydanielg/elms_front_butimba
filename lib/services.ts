import api from "./api";
import type { User, Course, DashboardStats, PaginatedResponse } from "./types";

export const auth = {
  login: (email: string, password: string) =>
    api.post<{ message: string; user: User; token: string }>("/auth/login", { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    phone?: string;
  }) => api.post<{ message: string; user: User; token: string }>("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get<{ user: User }>("/auth/me"),
  updateProfile: (data: Partial<User>) => api.put("/auth/profile", data),
  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put("/auth/password", data),
};

export const coursesApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Course>>("/courses", { params }),
  show: (id: number) => api.get<Course>(`/courses/${id}`),
  myCourses: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Course>>("/my-courses", { params }),
  enroll: (id: number) => api.post(`/courses/${id}/enroll`),
  unenroll: (id: number) => api.post(`/courses/${id}/unenroll`),
  create: (data: Partial<Course>) => api.post("/courses", data),
  update: (id: number, data: Partial<Course>) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};

export const dashboardApi = {
  stats: () => api.get<DashboardStats>("/dashboard/stats"),
};

export const submissionsApi = {
  mySubmissions: (params?: Record<string, string | number>) =>
    api.get("/my-submissions", { params }),
  submit: (assignmentId: number, data: { content?: string; file_path?: string; file_name?: string }) =>
    api.post(`/assignments/${assignmentId}/submissions`, data),
  grade: (submissionId: number, data: { score: number; feedback?: string }) =>
    api.put(`/submissions/${submissionId}/grade`, data),
};
