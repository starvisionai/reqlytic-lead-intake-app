# Reqlytic

> **Turn messy, unstructured business requests into clear, prioritized, actionable insights — powered by AI.**

---

## Overview

Reqlytic is an AI-powered intake management platform that helps businesses capture, analyze, and act on incoming requests from any source. Whether it's a sales inquiry, a support ticket, a partnership proposal, or an internal ops request, Reqlytic instantly transforms raw, unstructured messages into structured summaries, priority scores, sentiment analysis, and suggested next steps.

---

## Features

### 🧠 AI-Powered Request Analysis
- Automatically categorizes incoming requests (Sales, Support, Vendor, Partnership, etc.)
- Assigns **priority levels** (High / Medium / Low) with reasoning
- Detects **urgency** and **sentiment** (Positive, Frustrated, Urgent, etc.)
- Scores **business opportunity level**
- Extracts key details and flags missing information

### 📋 Smart Intake Workflow
- Capture requests from multiple sources: Contact Form, Email, Phone Call Notes, Referral, Social Media, and more
- AI generates a concise **request summary**
- Provides a **suggested response draft** ready to send
- Produces a **follow-up checklist** of action items
- Flags recommended next steps for the team

### 📊 Dashboard & Analytics
- At-a-glance stats: total intakes, high-priority items, pending follow-ups
- Priority and category distribution charts
- "Needs Attention" list for urgent or unreviewed requests
- Recent intake activity feed

### 🗂️ Intake History & Management
- Full searchable, filterable history of all intake records
- Filter by status, priority, category, and source
- Sort by date, priority, or company name
- Export filtered records to **CSV**

### ⚙️ Customizable Settings
- Set your **company name** and **business context** to tailor AI analysis
- Configure preferred **communication tone** (Professional, Friendly, Direct, etc.)
- Add default **CTA links**, **scheduling links**, and **email signatures** to AI-generated drafts

### 🔐 Authentication & Access Control
- Secure email/password registration with OTP email verification
- Google OAuth sign-in
- Role-based access: **Admin** users see all records; **regular users** see only their own
- Password reset via email

---

## Use Cases

| Industry | Example Use |
|---|---|
| **Agencies** | Triage client project requests and prioritize by value |
| **SaaS / Tech** | Categorize and route support tickets instantly |
| **Consulting** | Score and summarize inbound partnership or vendor inquiries |
| **Operations** | Manage internal requests with clear priorities and owners |
| **Sales Teams** | Identify high-opportunity leads from raw contact form submissions |

---

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend & DB:** Base44 platform (entities, authentication, integrations)
- **AI:** Base44 InvokeLLM integration (GPT-4o-mini)
- **Routing:** React Router v6
- **Data Fetching:** TanStack React Query
- **Charts:** Recharts

---

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx          # Public marketing landing page
│   ├── Dashboard.jsx        # Main analytics dashboard
│   ├── NewIntake.jsx        # Create & analyze a new intake request
│   ├── IntakeDetail.jsx     # View/edit a single intake record
│   ├── IntakeHistory.jsx    # Searchable history table + CSV export
│   ├── Settings.jsx         # User/company settings
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── components/
│   ├── layout/
│   │   └── AppLayout.jsx    # Sidebar + mobile nav shell
│   ├── intake/
│   │   ├── AnalysisResult.jsx   # Displays AI analysis output
│   │   ├── PriorityBadge.jsx
│   │   └── StatusBadge.jsx
│   ├── AuthLayout.jsx
│   ├── AppLogo.jsx
│   └── ui/                  # shadcn/ui component library
├── entities/
│   └── IntakeRecord.json    # Data schema for intake records
├── api/
│   └── base44Client.js      # Pre-initialized Base44 SDK
└── App.jsx                  # Router + auth provider setup
```

---

## Getting Started

This app is built and hosted on the [Base44](https://base44.com) platform. To run or fork it:

1. Log in to your Base44 account
2. Open the app in the Base44 editor
3. Use **Dashboard → GitHub Sync** to connect a GitHub repository for version control
4. The app is ready to use — no additional environment setup required

---

## License

MIT