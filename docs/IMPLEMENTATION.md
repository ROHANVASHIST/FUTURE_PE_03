# IMPLEMENTATION.md
# AI SEO Blog & Content Cluster Generator for Business Websites
### Future Interns — Prompt Engineering Task 3 (2026)

**Role**: CTO + Full-Stack Engineer  
**Chosen Business**: *SmileCraft Dental Clinic, Koramangala, Bengaluru*  
**Stack**: Next.js 14 / Vite React · TypeScript · Tailwind CSS · Google Gemini API · GitHub

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [SEO Content Theory — How This Actually Works](#2-seo-content-theory--how-this-actually-works)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Folder Structure](#4-folder-structure)
5. [Prompt Engineering System](#5-prompt-engineering-system)
6. [Backend Implementation](#6-backend-implementation)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Generated SEO Content Pack — Full Output](#8-generated-seo-content-pack--full-output)
9. [GitHub Repository Setup](#9-github-repository-setup)
10. [Testing & Quality Checks](#10-testing--quality-checks)
11. [Deployment](#11-deployment)
12. [Monetisation Path](#12-monetisation-path)

---

## 1. Project Overview

### Problem
Most local business websites get zero organic traffic. Not because their service is bad — but because their content has no keyword strategy, no internal linking, no search intent alignment, and no topical authority. "Posting articles" is not an SEO strategy. A content cluster is.

### Solution
A **structured prompt workflow** that generates a complete SEO content cluster:
- A long-form pillar blog targeting the primary keyword
- 3–5 supporting blogs covering sub-topics, FAQs, and location-specific queries
- SEO-optimised heading structures (H1 → H2 → H3) for every article
- Internal linking map connecting all cluster content
- Local SEO keyword injection (city + service combinations)
- Reusable prompt templates deployable for any client in any vertical

### Chosen Business

| Field | Detail |
|---|---|
| Business | SmileCraft Dental Clinic |
| Location | Koramangala, Bengaluru |
| Vertical | Healthcare / Dental |
| Primary Keyword | best dental clinic in Bengaluru |
| Content Cluster Theme | Dental care services + local Bengaluru search intent |
| Target Audience | Adults 25–55, Bengaluru residents, searching for dental care |
| Business Goal | Rank locally, generate appointment bookings, build authority |

---

## 2. SEO Content Theory — How This Actually Works

Every prompt decision below is grounded in how Google actually ranks content in 2026. Read this section before writing a single prompt.

### 2.1 Topical Authority vs. Random Articles

Google no longer ranks individual articles in isolation. It ranks **websites with demonstrated topical authority**. That means:

```
Random approach (fails):
  → "5 Tips for Good Teeth" (no keyword strategy)
  → "Our Dental Services" (not searchable)
  → "Welcome to Our Clinic" (zero search intent)

Content cluster approach (ranks):
  → PILLAR: "Best Dental Clinic in Bengaluru – Services, Cost & What to Expect"
       ↓ internally links to:
  → SUPPORT 1: "Dental Implant Cost in Bengaluru (2026 Guide)"
  → SUPPORT 2: "Teeth Whitening in Bengaluru – Is It Safe and Worth It?"
  → SUPPORT 3: "Root Canal Treatment in Bengaluru – Procedure, Cost & Recovery"
  → SUPPORT 4: "How to Choose the Right Dentist in Bengaluru"
  → SUPPORT 5: "Dental Clinic Near Koramangala – What Patients Should Know"
```

The pillar ranks for the broad keyword. Supporting blogs rank for long-tail keywords. They all link to each other, which tells Google: *this website knows this topic deeply*.

### 2.2 Search Intent — The Most Important SEO Concept

Every blog must match the **intent** of the searcher, not just the keyword.

| Intent Type | What User Wants | Example Query | Content Format |
|---|---|---|---|
| Informational | Learn something | "is teeth whitening safe" | educational blog, FAQs |
| Navigational | Find a specific place | "SmileCraft dental Koramangala" | clinic page, GMB |
| Commercial | Compare before buying | "best dental clinic Bengaluru" | listicle/comparison blog |
| Transactional | Ready to act | "dental implant cost Bengaluru" | service + pricing page |

Each prompt must be given the correct intent before generating content. Wrong intent = content Google will never rank.

### 2.3 Local SEO Keyword Formula

For local businesses, the highest-converting keyword structure is:

```
[Service] + [in/near] + [City/Area]

Examples:
- "dental implant cost in Bengaluru"
- "teeth whitening near Koramangala"
- "root canal treatment Bengaluru price"
- "best dentist for kids in Indiranagar"
```

These are called **geo-modified keywords**. They have lower search volume but extremely high conversion intent — the person is looking to act, not just learn.

### 2.4 The H1 → H2 → H3 Hierarchy

```
H1 (ONE per page): Primary keyword + searcher's question
  H2: Major subtopic (each H2 targets a secondary keyword or PAA question)
    H3: Specific detail, step, or sub-point under the H2
    H3: Another sub-point
  H2: Next major subtopic
    H3: Sub-point
```

Every prompt must enforce this structure. A flat article with only H2s doesn't signal content depth to Google.

### 2.5 E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trust)

Google's quality raters check for E-E-A-T. Prompts must inject:
- **Experience**: first-person patient perspective sections, "what to expect"
- **Expertise**: clinical explanations, procedure steps, accurate terminology
- **Authority**: internal links to related content, external reference cues ("according to dental research")
- **Trust**: transparent pricing ranges, FAQs that address fears, clinic credentials

---

## 3. Architecture Decisions

| Choice | Reason |
|---|---|
| **Vite App / Node Express Server** | React Client + Express Backend Architecture for rendering and API proxying |
| **TypeScript** | Typed schemas catch structural errors before API calls |
| **Gemini API** | Generates the advanced JSON schema formats accurately and cost-effectively |
| **Zod** | Runtime validation of generated blog structure before rendering |
| **Tailwind CSS** | Rapid UI without custom stylesheets |
| **GitHub** | Required; doubles as a portfolio and client proof |

### Data Flow

```
Business Input Form
        │
        ▼
   Express API (/api/seo/generate-cluster)
        │
        ▼
   Gemini Schema Validation & Generation
        │
        ▼
   JSON Response (Pillar + Supporting + Links)
        │
        ▼
   React UI & Content Renderer
```

---

## 4. Prompt Engineering System

### 4.1 System Prompt

The global instructions passed to Gemini instructing it on rules for headings, local keyword frequency, missing fluff, and ensuring high value search intent structure and internal links. We use Gemini Structured Outputs to strictly get JSON back.

---

## 5. Backend Implementation

Implemented in `server.ts` to obscure the `GEMINI_API_KEY` from the React client. Endpoints handle mapping requests, generating the cluster architectures, then expanding the pillar content via Gemini 2.5 models. 

---

## 6. Frontend Implementation

React + Tailwind interface allows users to input their business parameters, preview the visual cluster map, render out the full pillar and sub-blogs with proper H-tag rendering, and features a one-click zip export. 
