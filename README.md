# PrepTracker 🚀

A beautiful, production-ready personal preparation tracker for job switch prep — covering DSA, LeetCode patterns, and System Design.

## Features
- ✅ 3 Predefined Roadmaps: DSA, LeetCode Patterns, System Design
- ✅ Custom roadmap creation
- ✅ Per-topic & per-subtopic status tracking
- ✅ Notes editor per topic/subtopic
- ✅ Problem checklist with difficulty badges
- ✅ Progress bars everywhere
- ✅ Dark/Light mode toggle
- ✅ localStorage persistence (auto-save, debounced)
- ✅ Import/Export JSON backup
- ✅ Filter by status + search
- ✅ Confetti on 100% completion 🎉
- ✅ PWA-ready (installable on mobile)
- ✅ Mobile responsive

## Setup

```bash
# 1. Create a new Next.js app
npx create-next-app@latest preptracker --typescript --tailwind --eslint --app --src-dir=false --import-alias='@/*'

# 2. Copy all files from this package into the project root

# 3. Install dependencies
npm install lucide-react

# 4. Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## File Structure

```
preptracker/
├── app/
│   ├── layout.tsx          # Root layout with AppProvider
│   ├── page.tsx            # Dashboard home
│   ├── globals.css         # Global styles + animations
│   └── roadmaps/[id]/
│       └── page.tsx        # Roadmap detail page
├── components/
│   ├── AppShell.tsx        # Layout wrapper (sidebar + header)
│   ├── layout/
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── Header.tsx      # Top header (theme, import/export)
│   ├── dashboard/
│   │   ├── Dashboard.tsx   # Dashboard with stats
│   │   └── RoadmapCard.tsx # Roadmap card component
│   ├── roadmap/
│   │   ├── RoadmapView.tsx # Full roadmap detail view
│   │   ├── TopicItem.tsx   # Collapsible topic row
│   │   └── SubtopicItem.tsx# Subtopic with problem checklist
│   ├── modals/
│   │   ├── AddRoadmapModal.tsx
│   │   └── AddTopicModal.tsx
│   └── ui/
│       ├── ProgressBar.tsx
│       ├── StatusSelect.tsx
│       ├── Toast.tsx
│       └── Confetti.tsx
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Hardcoded roadmap data (200+ problems)
│   ├── store.tsx           # Context + useReducer state
│   └── utils.ts            # Helpers
└── public/
    └── manifest.json       # PWA manifest
```

## Creating Your Own Roadmap

Want a fully custom roadmap? Edit the predefined data directly.

### Steps

**1. Clone the repo**
```bash
git clone <your-fork>
cd preptracker
```

**2. Open `lib/data.ts`**

All roadmaps live in the `PREDEFINED_ROADMAPS` array. Each entry follows the `Roadmap` type defined in `lib/types.ts`.

**3. Add or replace a roadmap entry**
```ts
export const PREDEFINED_ROADMAPS: Roadmap[] = [
  {
    id: 'my-roadmap',
    title: 'My Custom Roadmap',
    icon: '🎯',
    description: 'Short description here',
    topics: [
      {
        id: 'topic-1',
        title: 'Week 1: Topic Name',
        description: 'What this week covers',
        subtopics: [...],
        problems: [...],
      },
    ],
  },
  // ...existing roadmaps
];
```

**4. Let AI generate it for you**

Paste this prompt into ChatGPT / Claude:

> "Generate a `Roadmap` object for [your topic] following this TypeScript type: [paste contents of `lib/types.ts`]. Return only valid TypeScript that fits the `Roadmap[]` array in `data.ts`."

Then paste the output directly into `PREDEFINED_ROADMAPS`.

**5. Restart the dev server**
```bash
npm run dev
```

Your roadmap will appear in the sidebar automatically.

> **Tip:** After customizing, use the **Export** button to back up your progress as JSON — it captures your statuses, notes, and problem completions.

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **React Context + useReducer** (state)
- **localStorage** (persistence, auto-save)
- **Lucide React** (icons)
- **Custom CSS** (animations, fonts from Google Fonts)

## Data Persistence
All data is stored in `localStorage` under the key `prepTrackerData`. Use the Export button to download a JSON backup, and Import to restore.
