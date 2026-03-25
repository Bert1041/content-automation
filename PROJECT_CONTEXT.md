# PROJECT_CONTEXT.md

## Project Name

Fetemi Content Automation Platform

---

# Product Purpose

This platform automates the internal marketing workflow for a content team.

The system allows a marketing team to:

• generate SEO optimized articles
• review drafts internally
• adapt content for multiple platforms
• schedule and publish automatically

The goal is to reduce manual effort and maintain consistent content quality.

---

# Platforms Supported

Initial platforms:

* LinkedIn
* X (Twitter)
* Email newsletter

The system must be extensible so additional platforms can be added later.

---

# System Architecture

Frontend:

React / Next.js web application.

Backend services:

Firebase
Firestore database
Firebase authentication

Automation layer:

n8n workflows

AI services:

OpenAI API for:

* article generation
* URL summarization
* platform formatting

Hosting:

Google Cloud.

---

# Authentication Model

Authentication uses Firebase Auth.

Important rules:

• Users cannot self-signup
• Users are created by managers
• Login only system

User roles determine access to features.

---

# User Roles

The system has two roles.

---

## Content Manager

Responsible for creating content.

Permissions:

create content
edit drafts
select platforms
choose number of AI drafts
send draft for review
view own analytics

Cannot:

approve content
schedule publishing
edit SEO rules
manage users

---

## Manager

Responsible for review and approval.

Permissions:

approve drafts
reject drafts
leave feedback
schedule publishing
edit SEO rules
edit platform formatting rules
manage users
view system analytics

Managers also create user accounts.

---

# Core Workflow

Content creation follows this pipeline.

Idea submission
↓
AI draft generation
↓
Content Manager editing
↓
Manager review
↓
Platform adaptation
↓
Scheduling
↓
Automated publishing
↓
Analytics tracking

---

# Draft Generation Rules

Users can generate multiple drafts.

Maximum drafts allowed:

3

Each draft must present the topic from a different angle.

Examples:

educational
strategic
industry insight

---

# Content Input Types

Content generation can start from two inputs.

Option 1:

Raw content idea.

Option 2:

URL sources.

When URLs are provided the system:

extracts article text
summarizes key points
extracts SEO keywords

This summary becomes the AI prompt.

---

# SEO Content Requirements

Generated drafts must follow SEO best practices.

Rules include:

clear H1 title
H2 sections
H3 subsections
short paragraphs
keyword inclusion
internal and external links
readability around grade 7

Image placeholders should be included.

---

# Draft Editing

After drafts are generated the Content Manager can:

edit text
compare drafts
delete drafts
select a draft

Only one draft can proceed to review.

---

# Review Workflow

Content Manager sends draft for review.

Manager receives notification.

Manager can:

approve draft
reject draft
leave comments

Rejected drafts return to the Content Manager for revision.

---

# Platform Adaptation

After approval the system generates platform versions.

---

## LinkedIn format

hook opening
short paragraphs
bullet points
optional emojis
call to action

---

## X format

single main insight
line breaks
short sentences
1–2 hashtags

---

## Email format

subject line
intro paragraph
body text
call to action
signature

---

# Scheduling

Managers set the publish date.

Content Managers may suggest a date but cannot finalize it.

n8n handles scheduling.

A scheduled workflow checks for content where:

publish_date <= current_time

Those posts are published automatically.

---

# Content Status Lifecycle

Content moves through the following states.

Draft
Generated
Editing
Pending Review
Rejected
Approved
Scheduled
Published
Archived

---

# Analytics

The system provides analytics dashboards.

Metrics include:

drafts created
drafts pending review
drafts rejected
drafts approved
scheduled content
published content

Managers see system-wide analytics.

Content Managers see only their own metrics.

---

# Database Entities

Users

id
name
email
role
status
created_at

---

Submissions

id
creator_id
input_type
urls
platforms
draft_count
created_at

---

Drafts

id
submission_id
content
ai_version
status

---

Platform Versions

id
draft_id
platform
content

---

Rules

id
type
platform
content

---

Analytics

draft_id
approval_time
publish_time
platform

---

# System Screens

Shared screens:

Login
Settings
Notifications

---

Content Manager screens:

Dashboard
Create Content
Draft Editor
Draft List
Revision Page
Analytics

---

Manager screens:

Manager Dashboard
Review Queue
SEO Rules Manager
Formatting Rules Manager
User Management
Analytics

---

# AI Cost Controls

Maximum drafts per submission:

3

Maximum URLs per submission:

3

Maximum article length:

1200 words

---

# Future Platform Extensions

The architecture should allow adding new platforms easily.

Examples:

Instagram
TikTok
Blog CMS
Medium

Each platform requires new formatting rules.

---

# End of Project Context
