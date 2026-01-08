---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: [
  "_bmad-output/planning-artifacts/analysis/brainstorming-session-2026-01-07.md",
  "_bmad-output/index.md",
  "_bmad-output/data-models.md",
  "_bmad-output/component-inventory.md",
  "_bmad-output/architecture.md"
]
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 4
workflowType: 'prd'
lastStep: 11
---

# Product Requirements Document - Life Calendar

**Author:** Choudat
**Date:** 2026-01-07

## Executive Summary

**Life Calendar** is pivoting from a client-side visualization tool to a robust, production-grade SaaS platform. This strategic evolution transforms the application into a persistent service, enabling secure user authentication, automatic cloud synchronization, and cross-device accessibility.

The driving force of this phase is the **Production-Readiness Initiative**. This comprehensive effort prioritizes a rigorous UX and Conversion Audit to optimize the user funnel from initial visit to active retention. A key deliverable is the new **Guided Onboarding Experience**, designed to accelerate time-to-value by seamlessly guiding users through account creation and initial calendar population.

### Key Differentiator: Visualizing Time Scarcity

Unlike conventional calendars that manage schedules, Life Calendar visualizes *time scarcity*, offering a macro-view of a human lifespan. The new authentication and onboarding systems are engineered not merely as functional barriers, but as integral parts of this narrative: "Securing your life's timeline."

The onboarding experience is designed to be highly interactive and responsive. It integrates directly with the core grid visualization, ensuring that new users are not dropped into an empty state ("cold start") but are instead coached to populate their life events meaningfully, establishing immediate emotional investment.

## Project Classification

**Technical Type:** SaaS Transformation (B2C Productivity Platform)
**Domain:** Personal Development & Temporal Visualization
**Complexity:** Medium-High (Data Persistence & Security)
**Project Context:** Brownfield Evolution—Extending a Next.js Monolith with Authentication & Database Integration.

### Classification Signals
- **Core SaaS Infrastructure:** Implementation of User Authentication (Auth), Account Management, and Cloud Persistence.
- **Product Growth:** Development of sophisticated Onboarding flows and Synchronization logic.
- **Quality & Optimization:** Execution of UX Audits and Conversion Optimization (Lead/Funnel Audit) to ensure production viability.

## Success Criteria

### User Success
*   **Perspective Shift:** Users report a distinct shift in mindset from "managing days" (Google Calendar) to "valuing years" (Life Calendar).
*   **Retrospective Clarity:** Users successfully document and review their "Year Passed" without friction, gaining closure and insight.
*   **Time Awareness:** Users actively engage with the "Healthy Years Remaining" visualization, using it as a motivator for life planning.
*   **Secure & Portable:** Users trust the system with their life data, confident it is safely synced across all their devices.

### Business Success
*   **Engagement Model:** High retention in "Seasonal Check-ins" (quarterly/yearly) rather than daily compulsion.
*   **Onboarding Conversion:** >60% of visitors who start the "Guided Onboarding" complete it and create an account.
*   **Trust Metric:** Zero support tickets related to "Lost Data" or "Sync Errors" during the launch phase.

### Technical Success (Production Readiness)
*   **Reliable Persistence:** 100% success rate for Database CRUD operations under standard load.
*   **Auth Performance:** Login/Signup flow completes in < 2 seconds.
*   **Client Performance:** Main Grid renders < 1.5s even with 50+ years of data populated.
*   **Audit Score:** Achieve a "Green" status on Internal UX and Lead Audits post-implementation.

## Product Scope

### MVP - Minimum Viable Product (The "Production-Ready" Core)
*   **Auth System:** Secure Sign-up/Login via Email & Social Providers.
*   **Cloud Persistence:** Database connection to automatically save User, Calendar, and Events.
*   **Guided Onboarding:** A step-by-step wizard to set up birthdate, life expectancy estimation, and first key events to prevent "Blank Canvas" anxiety.
*   **UX/Lead Polish:** Revised layout and flow focusing on conversion and trust signals (part of the UX Audit).

### Growth Features (Post-MVP)
*   **Life Audit Workflow:** Dedicated guided mode for yearly reviews.
*   **Export/Share:** Generate high-res images of the life grid for sharing.
*   **Health Span Integration:** More detailed inputs for health metrics to adjust the "Healthy Years" projection.

### Vision (Future)
*   **AI Life Coach:** Insights based on entered data ("You've spent 5 years in this career...").
*   **Legacy Planning:** Features for long-term legacy documentation.

## User Journeys

**Journey 1: Lucas - The Perspective Seeker (New User Onboarding)**
Lucas (32, Software Engineer) has just had his first child and is suddenly struck by how fast time is moving. He searches for tools to visualize his lifespan and lands on Life Calendar.
*   **The Hook:** He is greeted not by a login wall, but by a value proposition: "Visualize Your Life in Weeks."
*   **The Action:** He clicks "Get Started" and enters the interactive onboarding flow. He answers three simple questions: Date of Birth, Life Expectancy Goal, and One Defining Event from last year.
*   **The Aha Moment:** The grid instantly renders. He sees the "past" weeks filled in, and the "future" weeks empty. It's striking.
*   **The Conversion:** A prompt appears: "Save your timeline to track your journey." He uses Google Auth to create an account in 2 seconds.
*   **The Outcome:** His data is persisted to the cloud. He adds his child's birth date to the calendar. He leaves feeling organized and returns a month later on his phone to check the grid.

### Journey Requirements Summary
*   **Interactive Onboarding:** Ability to input data and see results *before* requiring signup (deferred auth pattern).
*   **Social Auth Integration:** Rapid, low-friction login (Google/GitHub/Email).
*   **Cloud Sync:** Immediate persistence of local state to the database upon account creation.
*   **Responsive Design:** The grid and onboarding must be fully functional on mobile devices for the return visit.

## SaaS Specific Requirements

### Project-Type Overview
Life Calendar operates as a **Single-Tenant B2C SaaS**. Each user has an isolated environment for their life data. While currently free, the architecture must support future premium feature gating (e.g., Calendar Imports).

### Technical Architecture Considerations
*   **Authentication:**
    *   Social Login (Google) + Email/Password (Magic Link preferred for simplified UX).
    *   Session management via secure HTTP-only cookies (NextAuth.js / Clerk).
*   **Data Isolation:**
    *   Row-Level Security (RLS) or application-level logic to ensure users can ONLY access their own `events` and `calendars`.
    *   Exception: "Public Shared" grids (future) will require specific read-only access patterns.

### SaaS Features (MVP)
*   **Tenant Structure:**
    *   1 User = 1 Account = 1 Life Grid.
    *   No "Family" or "Team" accounts in MVP.
*   **Data Sovereignty:**
    *   **Export:** JSON/CSV dump of all user events.
    *   **Delete:** "Hard Delete" function that cascades to remove all user logs and events from the database immediately.
*   **Sharing Model:**
    *   **MVP:** Static Image Export (Client-side generation).
    *   **Post-MVP:** "Live Read-Only Link" (e.g., `lifecalendar.io/u/lucas`).

### Implementation Considerations
*   **Freemium Ready:** Database schema should include `plan_tier` (FREE | PRO) even if unused initially, to avoid painful migrations later.
*   **API Limits:** Basic rate limiting on API routes to prevent abuse, especially on the `POST /events` endpoints.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
**MVP Approach:** Experience First SaaS.
**Goal:** Deliver the emotional impact of the "Life Grid" immediately, then secure the user with trusted persistence.
**Team:** Brownfield (You + Copilot).

### MVP Feature Set (Phase 1)
**Core User Journeys Supported:**
*   Lucas (New User Onboarding).
*   Returning User (Sync & Review).

**Must-Have Capabilities:**
*   **Deferred Auth Onboarding:** Interactive grid setup before login.
*   **Secure Auth:** Google/Email login to save local state.
*   **Database Sync:** Reliability is the core feature.
*   **Responsive Web App:** Mobile-optimized for PWA installation.

### Post-MVP Features
**Phase 2 (Growth):**
*   **Life Audit Mode:** Guided questions for annual review.
*   **Public Profiles:** Optional "Share my Grid" with read-only views.

**Phase 3 (Expansion):**
*   **Calendar Import:** Integrations with Google/Apple Calendar.
*   **AI Insights:** Pattern recognition in life events.

### Risk Mitigation Strategy
*   **Technical Risks:** DOM Performance on high-week counts. *Mitigation:* Use React Window/Virtualization.
*   **Adoption Risks:** "One-time use" behavior. *Mitigation:* Collect email during onboarding for seasonal "Check-in" reminders (Lifecycle marketing).

## Functional Requirements

### Authentication & Identity
*   FR1: Users can authenticate using Third-Party Providers (Google).
*   FR2: Users can authenticate using Email (Magic Link or Passwordless flow).
*   FR3: Users remain authenticated across page reloads and browser sessions until logout.
*   FR4: Users can explicitly log out, clearing their local session.

### Onboarding Experience
*   FR5: Unauthenticated Visitors can input birthday and life expectancy to preview their generated life grid.
*   FR6: Unauthenticated Visitors can define one "Key Past Event" during the preview flow.
*   FR7: The System must preserve the Unauthenticated Visitor's preview data during the Sign-Up process (Deferred Auth).
*   FR8: Users are redirected to their personalized dashboard immediately after successful account creation.

### Life Calendar Core
*   FR9: Users can view their life grid visualized in weeks, with past weeks distinct from future weeks.
*   FR10: Users can create a new Life Event with a Title, Date, and Description.
*   FR11: Users can edit existing Life Events.
*   FR12: Users can delete Life Events.
*   FR13: Users can assign a Category (e.g., Work, Family, Travel) to an event.
*   FR14: Users can view a summary of their "Years Passed" vs "Years Remaining".

### Data Persistence (SaaS)
*   FR15: The System automatically saves all created/edited events to the cloud database.
*   FR16: The System synchronizes user data across multiple devices logged into the same account.
*   FR17: Users see a visual indicator when their data is successfully saved (or if sync fails).

### Data Sovereignty & Management
*   FR18: Users can export all their event data in a machine-readable format (JSON/CSV).
*   FR19: Users can permanently delete their account and all associated data ("Hard Delete").

### Profile & Configuration Management
*   FR20: Users can update their `Date of Birth` and `Life Expectancy` settings post-onboarding (triggering a grid recalculation).
*   FR21: Users can update their account details (Display Name).

### Advanced Error Handling & Offline State
*   FR22: The System must support "Optimistic UI" updates (events appear immediately before server confirmation).
*   FR23: The System maintains a local "Offline Queue" for actions performed without network connectivity.
*   FR24: The System must prevent data loss during session expiry (Re-auth modal without page refresh).

### Visualization Controls
*   FR26: Users can filter the Life Grid visualization by Category (e.g., show only "Work").
*   FR27: The System validates Event Dates against the user's lifespan boundaries.

## Non-Functional Requirements

### Performance & Scalability
*   **Core Web Vitals:**
    *   **LCP (Largest Contentful Paint):** < 2.5s on mobile/desktop.
    *   **INP (Interaction to Next Paint):** < 200ms.
    *   **CLS (Cumulative Layout Shift):** < 0.1.
    *   **TTFB (Time to First Byte):** < 600ms (Must exclude static assets from Clerk Middleware matcher).
*   **Database:**
    *   Must use **Neon Connection Pooling** endpoint (Transaction Mode).
    *   Driver: `@neondatabase/serverless` (Enables Edge compatibility & WebSocket tunneling).
*   **Bundle Size:**
    *   **First Load JS (Shared):** < 120kb (Gzipped).
    *   **Dashboard Loading State:** Must render under 1.5s on 4G.

### Security
*   **Auth:** Clerk Integration with **Svix Signature Verification** for webhooks to prevent spoofing.
*   **Data Authorization:**
    *   Primary: Application-layer tenant isolation (Service Layer).
    *   Secondary (Optional): **RLS** configured via transaction-scoped session variables (due to Pooling).
*   **CSP:** Strict Content Security Policy (Nonce-based) compatible with Next.js Streaming.

### Reliability
*   **Resilience:** Optimistic UI required for all **Standard CRUD** mutations (Event creation, updates, deletes).
*   **Constraint:** Synchronous Server Actions must limit execution to < 10s (Vercel Hobby Limit constraint to force good architectural patterns).
*   **Async Processing:** Operations >10s (e.g., bulk recurring event generation, exports) must offload to background jobs (e.g., Inngest).
*   **Cold Starts:** Skeleton UI / Streaming Suspense boundaries required for all data-dependent UI.


