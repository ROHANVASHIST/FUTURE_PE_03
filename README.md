# Enterprise SEO Content Cluster Generator (Topical Authority Engine)

An enterprise-grade, high-performance web application designed to architect and generate complete, semantically mapped, internally linked SEO content clusters. Powered by the high-reasoning Gemini models, the engine researches target keywords, builds semantic hub-and-spoke graphs, drafts long-form copy, and injects optimal contextual anchors.

---

## 🎨 Design & Experience Features

- **Contrast-Adaptive UI**: Elegant dual contrast modes (Minimalist Daylight & High-Contrast Cyberpunk Slate).
- **Interactive Cluster Architecture Map**: Beautiful tree-node diagram visualizing Pillar Master Nodes alongside Supporting Branch Nodes.
- **Google SERP Specification Previews**: Beautiful high-fidelity simulations of how headlines and meta descriptions will render on the Search Engine Results Page (SERP).
- **One-Click Export Suit**:
  - **Content Pack (`.md`)**: Complete portfolio export featuring semantic keyword mapping tables, partnership internal link matrices, and copy in clean Markdown.
  - **Print / PDF Pack**: Visually polished multi-page document layout tailored with custom headers/footers ready for presentation.
- **Instant Business Profiles**: Five industrial pre-configured templates (Healthcare, Hospitality, Wellness & Spa, Law Firms, and Home Services) to simulate instantly.

---

## 🚀 Key Functional Modules

1. **Topical Authority Map Constructor (`/api/seo/generate-plan`)**
   - Conducts semantic decomposition of business offerings.
   - Extracts localized key search intent schemas.
   - Maps parent-child internal routing to secure optimal PageRank distribution.
2. **Contextual Article Drafting Engine (`/api/seo/generate-blog`)**
   - Synthesizes long-form copy featuring modern headers and clean list layouts.
   - Embeds contextually relevant, highly descriptive hyperlink suggestions mapping directly to anchor texts requested by the linking matrix.

---

## 📁 Project Architecture

```bash
├── server.ts                       # Full-stack Express Backend & Vite server config
├── package.json                    # Application manifest & command dependencies
├── metadata.json                   # Applet configuration & permission scope
├── src/
│   ├── App.tsx                     # Main interactive application wrapper
│   ├── index.css                   # Custom global tailwind layer & contrast theme rules
│   ├── types.ts                    # Declared global TypeScript definitions 
│   └── components/
│       ├── BusinessForm.tsx        # Profile configuration form with fast preset buttons
│       ├── ClusterMap.tsx          # Responsive tree graph representation of the strategy
│       └── BlogPreview.tsx         # Google SERP spec preview & formatted copy visualizer
```

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
Ensure you have **Node.js** matching your active runtime environment installed.

### 2. Install Project Dependencies
Deploy the packages specified in the manifest:
```bash
npm install
```

### 3. Environment Key Setup
Verify that your local environments contains a valid API key configuration. Create `local.env` or `.env` in your root workspace:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Boot Dev Environment
Launch the concurrent client-developer environment proxying requests on the specified port:
```bash
npm run dev
```

---

## 📥 Export System Schema

### PDF Output Configuration
The application leverages native CSS Print media rules to ensure:
- Dynamic page breaks avoiding chopped header elements.
- Clean margins formatted at static values (`20mm`).
- Elegant, distinct presentation headers styling metadata metrics perfectly.

### Markdown Output Schema
Produces fully structured packages matching:
1. **Semantic Topic Matrix** detailing target query clusters & contextual user intents.
2. **Contextual Anchors Reference Schema** illustrating absolute origin and target pages with appropriate anchors.
3. **Pillar Articles and Supporting Page Contents** compiled into readable flat documentation blocks.
