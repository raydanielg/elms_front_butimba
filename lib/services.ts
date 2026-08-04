import api from "./api";
import type { User, DashboardStats, ApiResponse, CertificateTemplate, CertificateIssue, CertificateVerification, Award, Transcript, Notification, Conversation, Message, CalendarEvent, StudentGrade, Badge, BadgeIssued, CompetencyFramework, QuestionCategory, Question } from "./types";

export const auth = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; access_token: string }>>("/auth/login", { email, password }),
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => api.post<ApiResponse<{ user: User; access_token: string }>>("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get<ApiResponse<{ user: User }>>("/auth/me"),
  updateProfile: (data: Partial<User>) => api.put("/auth/profile", data),
  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put("/auth/password", data),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    api.post("/auth/reset-password", data),
};

export const coursesApi = {
  list: (params?: Record<string, string | number>) =>
    api.get("/courses", { params }),
  show: (id: string) => api.get(`/courses/${id}`),
  myCourses: () => api.get("/courses/mine"),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  getStudents: (id: string) => api.get(`/courses/${id}/students`),
  getTutors: (id: string) => api.get(`/courses/${id}/tutors`),
  create: (data: Record<string, unknown>) => api.post("/courses", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

export const dashboardApi = {
  stats: () => api.get<ApiResponse<DashboardStats>>("/dashboard/stats"),
  charts: () => api.get("/dashboard/charts"),
  calendar: (params?: Record<string, string>) => api.get("/dashboard/calendar", { params }),
  activity: () => api.get("/dashboard/activity"),
};

export const lmsApi = {
  getTopics: (courseId: string) => api.get(`/courses/${courseId}/topics`),
  createTopic: (courseId: string, data: Record<string, unknown>) => api.post(`/courses/${courseId}/topics`, data),
  getMaterials: (topicId: string) => api.get(`/topics/${topicId}/materials`),
  createMaterial: (topicId: string, data: Record<string, unknown>) => api.post(`/topics/${topicId}/materials`, data),
  createAssignment: (courseId: string, data: Record<string, unknown>) => api.post(`/courses/${courseId}/assignments`, data),
  submitAssignment: (assignmentId: string, data: Record<string, unknown>) =>
    api.post(`/assignments/${assignmentId}/submit`, data),
  getSubmissions: (assignmentId: string) => api.get(`/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId: string, data: { marks: number; feedback?: string }) =>
    api.patch(`/submissions/${submissionId}/grade`, data),
  getAnnouncements: (courseId?: string) =>
    api.get(courseId ? `/courses/${courseId}/announcements` : "/announcements"),
  getOnlineClasses: (courseId: string) => api.get(`/courses/${courseId}/online-classes`),
  getForum: (courseId: string) => api.get(`/courses/${courseId}/forum`),
};

export const financeApi = {
  getFees: () => api.get("/fees"),
  getPayments: (params?: Record<string, string | number>) => api.get("/payments", { params }),
  verifyPayment: (id: string) => api.patch(`/payments/${id}/verify`),
  getDebts: () => api.get("/debts"),
  myPayments: () => api.get("/me/payments"),
  myDebts: () => api.get("/me/debts"),
  myResults: () => api.get("/me/results"),
};

// ===== Certificate API =====
export const certificateApi = {
  listTemplates: (params?: Record<string, string | boolean>) =>
    api.get<ApiResponse<CertificateTemplate[]>>("/certificate-templates", { params }),
  showTemplate: (id: string) =>
    api.get<ApiResponse<CertificateTemplate>>(`/certificate-templates/${id}`),
  createTemplate: (data: Record<string, unknown>) =>
    api.post<ApiResponse<CertificateTemplate>>("/certificate-templates", data),
  updateTemplate: (id: string, data: Record<string, unknown>) =>
    api.patch<ApiResponse<CertificateTemplate>>(`/certificate-templates/${id}`, data),
  deleteTemplate: (id: string) =>
    api.delete(`/certificate-templates/${id}`),
  duplicateTemplate: (id: string) =>
    api.post<ApiResponse<CertificateTemplate>>(`/certificate-templates/${id}/duplicate`),
  addPage: (templateId: string, data?: Record<string, unknown>) =>
    api.post(`/certificate-templates/${templateId}/pages`, data ?? {}),
  addElement: (pageId: string, data: Record<string, unknown>) =>
    api.post(`/pages/${pageId}/elements`, data),
  updateElement: (id: string, data: Record<string, unknown>) =>
    api.patch(`/elements/${id}`, data),
  deleteElement: (id: string) =>
    api.delete(`/elements/${id}`),

  issue: (data: { template_id: string; user_id: string; course_id?: string; program_id?: string; grade?: string; classification?: string }) =>
    api.post<ApiResponse<CertificateIssue>>("/certificates/issue", data),
  bulkIssue: (data: { template_id: string; cohort_id?: string; program_id?: string }) =>
    api.post<ApiResponse<Record<string, unknown>>>("/certificates/bulk-issue", data),
  revoke: (id: string, reason: string) =>
    api.patch<ApiResponse<CertificateIssue>>(`/certificates/${id}/revoke`, { reason }),
  reissue: (id: string) =>
    api.post<ApiResponse<CertificateIssue>>(`/certificates/${id}/reissue`),
  indexIssues: (params?: Record<string, string>) =>
    api.get("/certificates", { params }),
  showIssue: (id: string) =>
    api.get<ApiResponse<CertificateIssue>>(`/certificates/${id}`),
  myCertificates: () =>
    api.get<ApiResponse<CertificateIssue[]>>("/me/certificates"),

  generateTranscript: (data: { student_id: string; academic_year?: string; semester?: string }) =>
    api.post<ApiResponse<Transcript>>("/transcripts/generate", data),

  verify: (code: string) =>
    api.get<ApiResponse<CertificateVerification>>(`/verify/${code}`),

  listAwards: () => api.get<ApiResponse<Award[]>>("/awards"),
  createAward: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Award>>("/awards", data),
};

// ===== Notification API =====
export const notificationApi = {
  list: () => api.get<ApiResponse<Notification[]>>("/me/notifications"),
  unreadCount: () => api.get<ApiResponse<{ unread_count: number }>>("/me/notifications/unread-count"),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post("/me/notifications/read-all"),
};

// ===== Messaging API =====
export const messageApi = {
  listConversations: () => api.get<ApiResponse<Conversation[]>>("/messages/conversations"),
  showConversation: (id: string) => api.get<ApiResponse<Conversation>>(`/messages/conversations/${id}`),
  createConversation: (data: { name?: string; member_ids: string[]; is_group?: boolean }) =>
    api.post<ApiResponse<Conversation>>("/messages/conversations", data),
  sendMessage: (conversationId: string, data: { body: string; reply_to?: string }) =>
    api.post<ApiResponse<Message>>(`/messages/conversations/${conversationId}`, data),
  markRead: (conversationId: string) =>
    api.post(`/messages/conversations/${conversationId}/read`),
};

// ===== Calendar API =====
export const calendarApi = {
  list: (params?: Record<string, string>) => api.get<ApiResponse<CalendarEvent[]>>("/calendar", { params }),
  create: (data: Record<string, unknown>) => api.post<ApiResponse<CalendarEvent>>("/calendar", data),
  delete: (id: string) => api.delete(`/calendar/${id}`),
};

// ===== Gradebook API =====
export const gradebookApi = {
  gradebook: (courseId: string) =>
    api.get(`/courses/${courseId}/gradebook`),
  createCategory: (courseId: string, data: Record<string, unknown>) =>
    api.post(`/courses/${courseId}/grade-categories`, data),
  createItem: (courseId: string, data: Record<string, unknown>) =>
    api.post(`/courses/${courseId}/grade-items`, data),
  updateGrade: (itemId: string, userId: string, data: { grade?: number; feedback?: string }) =>
    api.put(`/grade-items/${itemId}/grades/${userId}`, data),
  myGrades: (courseId: string) =>
    api.get<ApiResponse<StudentGrade[]>>(`/courses/${courseId}/my-grades`),
  studentGrades: (courseId: string, userId: string) =>
    api.get(`/courses/${courseId}/grades/${userId}`),
  exportCsv: (courseId: string) =>
    api.get(`/courses/${courseId}/grades/export`, { responseType: "blob" }),
  setCompletionCriteria: (courseId: string, data: Record<string, unknown>) =>
    api.post(`/courses/${courseId}/completion-criteria`, data),
  completionStatus: (courseId: string, userId: string) =>
    api.get(`/courses/${courseId}/completion/${userId}`),
  markComplete: (cmid: string) =>
    api.post(`/modules/${cmid}/complete`),
};

// ===== Badge API =====
export const badgeApi = {
  list: () => api.get<ApiResponse<Badge[]>>("/badges"),
  create: (data: Record<string, unknown>) => api.post<ApiResponse<Badge>>("/badges", data),
  issue: (badgeId: string, userId: string) =>
    api.post(`/badges/${badgeId}/issue`, { user_id: userId }),
  myBadges: () => api.get<ApiResponse<BadgeIssued[]>>("/me/badges"),
};

// ===== Competency API =====
export const competencyApi = {
  listFrameworks: () => api.get<ApiResponse<CompetencyFramework[]>>("/competency-frameworks"),
  createFramework: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<CompetencyFramework>>("/competency-frameworks", data),
  createCompetency: (frameworkId: string, data: { shortname: string; description?: string }) =>
    api.post(`/competency-frameworks/${frameworkId}/competencies`, data),
  rateCompetency: (competencyId: string, data: { user_id: string; rating: number; proficiency?: string }) =>
    api.put(`/competencies/${competencyId}/rate`, data),
};

// ===== Question Bank API =====
export const questionBankApi = {
  listCategories: (params?: Record<string, string>) =>
    api.get<ApiResponse<QuestionCategory[]>>("/question-categories", { params }),
  createCategory: (data: { name: string; info?: string; parent_id?: string }) =>
    api.post<ApiResponse<QuestionCategory>>("/question-categories", data),
  listQuestions: (params?: Record<string, string>) =>
    api.get("/questions", { params }),
  showQuestion: (id: string) => api.get<ApiResponse<Question>>(`/questions/${id}`),
  createQuestion: (data: Record<string, unknown>) =>
    api.post<ApiResponse<Question>>("/questions", data),
  updateQuestion: (id: string, data: Record<string, unknown>) =>
    api.patch(`/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),
};

// ===== Enrolment API =====
export const enrolmentApi = {
  listEnrolments: (courseId: string) => api.get(`/courses/${courseId}/enrolments`),
  createEnrolment: (courseId: string, data: Record<string, unknown>) =>
    api.post(`/courses/${courseId}/enrolments`, data),
  listGroups: (courseId: string) => api.get(`/courses/${courseId}/groups`),
  createGroup: (courseId: string, data: Record<string, unknown>) =>
    api.post(`/courses/${courseId}/groups`, data),
  listCohorts: () => api.get("/cohorts"),
  createCohort: (data: Record<string, unknown>) => api.post("/cohorts", data),
};

// ===== Application API =====
export const applicationApi = {
  list: (params?: Record<string, string>) =>
    api.get("/applications", { params }),
  show: (id: string) => api.get(`/applications/${id}`),
  accept: (id: string, data?: { cohort_name?: string }) =>
    api.post(`/applications/${id}/accept`, data ?? {}),
  reject: (id: string) => api.post(`/applications/${id}/reject`),
};

// ===== Applicant Application API (for APPLICANT role) =====
export const applicantApi = {
  submitApplication: (data: {
    program_id: string;
    mode: string;
    form_data?: Record<string, unknown>;
    pay_slip_url?: string;
  }) => api.post("/applications", data),
  myApplicationStatus: (id: string) => api.get(`/applications/${id}/status`),
  myApplications: () => api.get("/my-applications"),
  uploadPaySlip: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/files/draft", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updatePaySlip: (applicationId: string, paySlipUrl: string) =>
    api.patch(`/applications/${applicationId}/pay-slip`, { pay_slip_url: paySlipUrl }),
};

// ===== Programs API (public) =====
export const programsApi = {
  list: () => api.get("/programs"),
};

// ===== Payment Gateway API =====
export const paymentGatewayApi = {
  list: () => api.get("/payment-gateways"),
  verifyPayment: (paymentId: string, data?: { gateway_reference?: string }) =>
    api.post(`/payments/${paymentId}/verify`, data ?? {}),
};
