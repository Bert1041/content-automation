# Fetemi Content Automation Platform

The **Fetemi Content Automation Platform** is a structured system designed to automate the end-to-end content creation, review, adaptation, and publishing process for LinkedIn, X (Twitter), and Email. 

---

## 🎯 1. Objective
Automate marketing workflows while maintaining:
- **Role-based Access**: Specialized paths for Content Managers and Managers.
- **Standards & Traceability**: Enforcement of SEO, formatting, and draft versioning.
- **Pipeline Visibility**: Real-time analytics and status tracking.
- **AI-Driven Scalability**: Leveraging **n8n** and **OpenAI (GPT API)** for efficient generation.

---

## 👥 2. Users & Roles

| Role | Access / Permissions |
| :--- | :--- |
| **Content Manager** | Submit ideas/URLs, select platforms, edit/track draft versions, send for Manager review, suggest publish dates (optional), view own analytics. |
| **Manager** | Review/approve/reject drafts, provide feedback, set final publish dates, manage global SEO & formatting rules, view full organization-wide analytics. |

> [!NOTE]
> - Only Managers can set final publish dates and edit SEO/formatting rules.
> - Content Managers can view dynamic rules but cannot edit them.

---

## 🔄 3. Features & Workflow

### 3.1 Login & Authentication
- **Tech Stack**: Firebase Auth
- **Flow**: Login → Role-check → Dashboard redirect (based on assigned role).

### 3.2 Content Submission
- **Input**: Raw idea OR 1-3 source URLs.
- **Preprocessing**: URL validation (HTTP 200), content summarization, keyword extraction (primary & long-tail), and optional plagiarism check.
- **Constraints**: Enforced max draft limit (e.g., 3). Multiple URLs result in a merged summary.

### 3.3 Draft Generation (n8n + OpenAI)
- **Parallel Tasks**: Generate N drafts simultaneously.
- **Draft Structure**: 
  - H1 → H2 → H3 structure with 700-800 words per section.
  - Short, readable paragraphs (2-3 sentences).
  - Integrated SEO keywords and 2-3 internal/external links.
  - Readability grade 7 + contextual image placeholders.
- **Reliability**: Automatic retry logic for AI failures and cost-control enforcement.

### 3.4 Review & Revision Flow
- **Content Manager Review**: Edit drafts, track AI versions, and validate an **SEO Checklist** (keyword placement, heading structure, links, readability).
- **Manager Review**: Approve, reject (with comments), or perform minor edits. Finalizes the set publish date.
- **Edge Case Publishing**: 
  - Approval *after* scheduled date → Auto-publish immediately.
  - Past scheduled date → Ask to reschedule or publish now.

### 3.5 Platform Adaptation (n8n)
| Platform | Rules Summary |
| :--- | :--- |
| **LinkedIn** | PAS format, bullet points, emojis, CTA, and image. |
| **X (Twitter)** | One core idea, benefit-first, line breaks, max 2 hashtags, 280 character limit. |
| **Email** | Subject line, brief intro (1-3 sentences), skimmable body, CTA, friendly sign-off (250-600 words). |

### 3.6 Scheduling & Publishing
- **Cron-based Publishing**: n8n periodically checks for `publish_date <= current_time` for approved content. 
- **Retry Logic**: Automated retry per failed platform API attempt with detailed logging.

---

## 📊 4. Metrics & Analytics

- **Pipeline**: Tracking throughput from creation to publication.
- **SEO & Compliance**: Keyword compliance, link checks, and readability scores.
- **AI Efficiency**: Tracking the % of drafts approved without manual edits.
- **Platform Distribution**: Content distribution across LinkedIn, X, and Email.

---

## 📂 5. Database Entities

- **Users**: ID, role, email, status, last login.
- **Content Submissions**: Creator ID, type, URLs, selected platforms, keywords, draft count.
- **Drafts**: text, AI version, status (draft/selected/pending/approved/rejected/archived), updatedAt.
- **Platform Adaptation**: Platform, adapted text, media references, versioning.
- **Rules (SEO/Formatting)**: Rule type, content, manager ID, version tracking.

---

## 🛠️ 6. Tech Stack

- **Frontend**: React / Next.js (built via Antigravity).
- **Automation**: **n8n** (workflows, cron, API integrations).
- **AI**: OpenAI GPT API.
- **Auth & Hosting**: Firebase (Auth, Firestore, Hosting) / Google Cloud.
- **Notifications**: In-app alerts + Email via n8n.

---

## 🛡️ 7. Reliability & Edge Cases

1. **Past Date**: Ask to reschedule or publish now.
2. **AI/API Failure**: Automatic retries with error logging and Manager notification.
3. **Archived Content**: Prevent inadvertent publication.
4. **Rate Limits**: Queue handling in n8n to respect platform API limits.

---

## 🖥️ 8. System Screens

| Shared | Content Manager | Manager (Admin) |
| :--- | :--- | :--- |
| Login / Settings | Dashboard (Own Work) | Dashboard (Full Pipeline) |
| Notifications | Submit Content / URLs | Review Queue |
| Analytics (Filtered) | Draft Editor & List | SEO & Formatting Rules Manager |
| | Revision View | User Management |

---

*This blueprint is production-ready, covering end-to-end automation with a focus on quality, roles, and cost control.*
