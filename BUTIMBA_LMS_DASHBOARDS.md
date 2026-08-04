# Butimba LMS — Dashboard Content by Role

> **What this is:** *What should appear* on each role's dashboard — data, KPI cards, widgets,
> lists, quick actions, and navigation — **NOT visual UI/styling**.
> Use this as the information architecture for your frontend.

---

## 0. Common Shell (kwa dashboards zote)

Every logged-in dashboard shares this frame; only the *content* changes by role.

- **Top bar:** logo, global search, notifications bell, messages, profile menu, role switcher (if a user holds multiple roles).
- **Left navigation:** role-specific menu (listed per role below).
- **Main area:** summary/KPI cards → primary widgets → tables/lists.
- **Right rail (optional):** calendar, announcements, quick links.
- **Footer:** support/contact, college motto.

> Rule: a widget shows **only if** the user's capabilities allow it (see spec RBAC).

---

## 1. SUPER_ADMIN — Msimamizi Mkuu

**KPI cards**
- Total users (breakdown: students / tutors / staff / applicants)
- Total programs & courses (active)
- Active enrolments
- Pending applications
- Storage used
- System health (cron OK?, failed jobs count)

**Primary widgets**
- System health panel: scheduled tasks status, failed/adhoc jobs, error-log count
- Recent audit log (who did what, when)
- Enrolment & user growth chart (trend)
- Announcements manager (global)
- Plugins/config quick-status (auth, enrol, payment gateways enabled)

**Lists / tables**
- Users table (search, filter by role/status, activate/suspend)
- Latest applications, latest payments

**Quick actions**
- Create user · Create program/course · Assign roles · Run backup · View logs · Edit site config

**Navigation**
Dashboard · Users · Roles & Permissions · Programs/Courses · Categories · Enrolment · Cohorts · Finance settings · Reports · Logs & Analytics · Config · Plugins · Backup/Restore

---

## 2. PRINCIPAL — Mkuu wa Chuo

**KPI cards**
- Total students · Total tutors
- This intake: applications (accepted / pending / rejected)
- Overall pass rate (%)
- Fee collection rate (collected vs expected %)

**Primary widgets**
- **Principal's message editor** (edit Home message)
- Enrolment trend by program & mode (Masafa/Kutwa/Bweni)
- Academic performance overview (avg grades, completion rate)
- Finance summary (collected vs outstanding)
- College-wide announcements composer

**Lists / tables**
- Programs overview (enrolment per program)
- Escalations/approvals awaiting principal

**Quick actions**
- Post message · Publish announcement · View academic report · View finance report

**Navigation**
Dashboard · Home Message · Reports (Academic, Finance, Enrolment, Completion) · Announcements · Programs · Staff directory

---

## 3. REGISTRAR — Msajili / Admissions

**KPI cards**
- New applications · Under review · Accepted · Rejected
- Students enrolled this term
- Courses without an assigned tutor (alert)

**Primary widgets**
- **Applications queue** (review: accept/reject) — filter by program/course/mode
- **Applicants-per-course sheet** (count + list per course)
- Cohort/intake manager (create intake, sync to courses)
- Tutor-assignment panel (assign tutor → course)

**Lists / tables**
- Student records (search, program, mode, status)
- Courses list (create course + code, edit, activate)
- Pending enrolments

**Quick actions**
- Review application · Create course (+code) · Enrol student · Assign tutor · Create cohort

**Navigation**
Dashboard · Applications · Courses & Codes · Programs · Enrolment · Cohorts/Intakes · Students · Tutor assignments · Reports

---

## 4. ACCOUNTANT — Mhasibu

**KPI cards**
- Total collected (period)
- Payments pending verification
- Outstanding debts (total)
- Confirmations today

**Primary widgets**
- **Payments-to-verify queue** (confirm pay slip / control number)
- Revenue chart by program & mode
- Debt aging (0–30 / 31–60 / 60+ days)
- Fee-structure manager (per program/mode/item)

**Lists / tables**
- Payment history (search by student)
- Debtors list (student, balance, due date)

**Quick actions**
- Verify payment · Edit fee item · Record/adjust debt · Export finance report

**Navigation**
Dashboard · Payments · Verify Queue · Fee Structure · Debts · Reports/Exports

---

## 5. TUTOR — Mwalimu (Editing Teacher)

**KPI cards**
- My courses
- Students taught
- Pending grading (assignments + quizzes)
- Upcoming online classes

**Primary widgets**
- **My courses** (quick open, per-course student count)
- **Grading queue** (submissions & attempts awaiting marks)
- Upcoming deadlines & scheduled online classes
- Forum activity in my courses (unanswered questions)
- Course announcements composer

**Lists / tables**
- Assignments/quizzes I created (open/closed, submissions count)
- Recent student submissions

**Quick actions**
- Add topic/material (PDF/slides/video) · Create assignment · Create quiz · Grade · Schedule online class · Post announcement

**Navigation**
Dashboard · My Courses · Content/Topics · Assignments · Quizzes · Question Bank · Gradebook (my courses) · Forums · Online Classes · Calendar

---

## 6. STUDENT — Mwanafunzi

**KPI / summary cards**
- Enrolled courses
- Pending assignments
- Next deadline (with countdown)
- Overall grade / average
- Course completion (%)

**Primary widgets**
- **My courses** with progress/completion indicators
- **Upcoming deadlines & timed assessments** (show timer for quizzes/assignments)
- Timetable / upcoming online classes (join links: Meet/Zoom)
- Recent grades & results
- Announcements (global + per course)
- Forum: new/unread discussions in my courses
- Badges earned · competencies progress
- **My Status** shortcuts: Payments · Debts · Results

**Lists / tables**
- Course materials recently added
- Submission history

**Quick actions**
- Continue course · Submit assignment · Take quiz · Join class · View results · Check payments/debts

**Navigation**
Dashboard · My Courses · Assignments · Quizzes · Grades/Results · Calendar · Forums · Online Classes · My Status (Payments/Debts) · Badges · Messages

> **Gate:** Student dashboard unlocks only after confirmed registration/admission fee.

---

## 7. APPLICANT — Mwombaji (limited/pre-student)

**Status card (most important)**
- Application status: **Submitted / Under Review / Accepted / Rejected**
- Program & mode applied for

**Primary widgets**
- **Application checklist:** form completed → pay slip uploaded → fee confirmed
- Next-steps guidance:
  - If **Accepted** → pay & activate student login
  - If **Rejected** → reason + reapply option
  - If **Under Review** → expected timeline
- Notifications (status updates)

**Quick actions**
- Complete/edit application · Upload pay slip · Check status · Contact admissions

**Navigation**
My Application · Upload Documents · Status · Contact Admissions

---

## 8. STAFF — Wafanyakazi (general, non-teaching)

**KPI / widgets**
- Internal announcements
- Calendar / events
- Messages / directory
- Shared documents (if permitted)

**Quick actions**
- Read announcements · Send message · View calendar

**Navigation**
Dashboard · Announcements · Calendar · Messages · Directory · (task-specific modules as assigned)

---

## 9. Feature → Role Matrix (muhtasari)

| Widget / Area | Admin | Principal | Registrar | Accountant | Tutor | Student | Applicant |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| System health / logs | ✅ | — | — | — | — | — | — |
| User management | ✅ | — | partial | — | — | — | — |
| Principal's message | — | ✅ | — | — | — | — | — |
| Applications review | — | view | ✅ | — | — | — | — |
| Applicants-per-course sheet | ✅ | view | ✅ | — | — | — | — |
| Create course + code | ✅ | — | ✅ | — | — | — | — |
| Assign tutor | ✅ | — | ✅ | — | — | — | — |
| Fee structure / verify payment | ✅ | view | — | ✅ | — | — | — |
| Debts | ✅ | view | — | ✅ | — | own | — |
| My courses (teach) | — | — | — | — | ✅ | — | — |
| Grading queue | — | — | — | — | ✅ | — | — |
| My courses (learn) | — | — | — | — | — | ✅ | — |
| Assignments/quizzes (take) | — | — | — | — | — | ✅ | — |
| Results / grades | ✅ | summary | ✅ | — | own courses | own | — |
| Online classes | — | — | — | — | schedule | join | — |
| Announcements | ✅ global | ✅ global | course | — | course | read | read |
| Application status | — | — | — | — | — | — | ✅ |
| Badges / competencies | ✅ | summary | — | — | award | earn | — |

---

## 10. Notes for Frontend

- Drive visibility from **capabilities**, not just role name (a user may have overrides at course level).
- Each KPI card = one lightweight summary endpoint; each list/table = one paginated endpoint.
- Student & Tutor dashboards are the "heavy" ones (most widgets); Applicant is the lightest.
- Show **timers server-driven** for quizzes/assignments (frontend only displays remaining time).
- Empty states matter (e.g. "No pending grading", "No outstanding debts").

---

*End of dashboard content spec.*
