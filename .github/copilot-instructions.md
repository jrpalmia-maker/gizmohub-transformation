# Gizmohub Transformation - AI Coding Agent Guide

## Project Overview
**Gizmohub Digital Transformation** is an interactive proposal presentation web app for a mid-sized electronics retailer's modernization initiative. It demonstrates a shift from a monolithic, siloed architecture to a headless e-commerce system with real-time inventory sync and AI-driven personalization.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS + Google Gemini API (for chat assistant)

---

## Architecture Essentials

### High-Level Data Flow
1. **Frontend (React/SPA):** Static proposal content across multiple scrollable sections
2. **Chat Assistant Service:** Integrates Google Gemini API to answer questions about the proposal
3. **Project Context Injection:** `PROJECT_CONTEXT` constant in `constants.ts` provides system prompt to Gemini
4. **No Backend:** This is a client-side only app; Gemini API calls happen directly from the browser

### Component Structure
- **App.tsx**: Main container with navbar, hero section, routing via anchor links
- **Components**: Modular, section-based UI (ProblemSection, SolutionSection, Timeline, ComparisonTable)
- **ChatAssistant.tsx**: Floating chat widget with message history and streaming responses
- **Services/gemini.ts**: Handles Gemini API initialization and message sending

### Critical Integration: Gemini API
- **Environment Variable:** `GEMINI_API_KEY` loaded via `.env.local` (NOT `.env`)
- **Configuration:** Uses `gemini-2.5-flash` model with `temperature: 0.7`
- **System Instruction:** `PROJECT_CONTEXT` provides domain knowledge for accurate proposal-related answers
- **Message Format:** History passed as `{ role: string; parts: { text: string }[] }[]` for context retention
- **Error Handling:** Generic fallback messages if API fails (check API key validity)

---

## Build & Development Commands

```bash
npm install                # Install dependencies
npm run dev               # Start dev server (port 3000, http://0.0.0.0:3000)
npm run build             # Production build (outputs to dist/)
npm run preview           # Preview prod build
```

**Required Setup:** Create `.env.local` in root with:
```
GEMINI_API_KEY=<your-key>
```

**Vite Configuration Key Points:**
- React plugin enabled for JSX transformation
- `@` alias resolves to project root
- Environment variables exposed via `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

---

## Project-Specific Patterns & Conventions

### Styling
- **Tailwind CSS** for all styling (no CSS modules or separate files)
- **Dark/light theme:** Dark slate backgrounds (`slate-900`, `slate-800`) with white text; light sections use `slate-50` backgrounds
- **Consistent color scheme:** Blue (`blue-600`) for CTAs and accents, red for problems, green for solutions
- **Animation:** Use Tailwind `animate-pulse`, `transition-all`, `transform` for effects

### State Management
- **React Hooks Only:** useState, useRef, useEffect (no Redux/Context API)
- **Chat State Pattern:** messages array with `ChatMessage` interface containing id, role, text, timestamp
- **Scroll Detection:** useEffect with scroll event listener for navbar transparency toggle

### File Organization
- Components in `/components` folder, services in `/services`
- `types.ts` for TypeScript interfaces (ChatMessage, ProjectPhase enum, etc.)
- `constants.ts` for immutable data (PROJECT_CONTEXT, NAV_LINKS)
- No assets folder; icons defined as React components in Icons.tsx

### ChatAssistant Implementation Details
- **Toggle Button:** Fixed bottom-right, changes color/rotation when open
- **Message Rendering:** Different styling for user (right-aligned) vs model (left-aligned)
- **Auto-scroll:** Uses `messagesEndRef` ref to auto-scroll to latest message
- **Loading State:** isLoading flag prevents duplicate submissions during API call
- **Message History:** Mapped to Gemini history format before sending; includes all prior messages for context

---

## Common Development Tasks

### Adding a New Section
1. Create component in `/components/SectionName.tsx` with `SectionProps` interface
2. Add unique `id` prop for anchor link (e.g., `id="comparison"`)
3. Import and render in `App.tsx` within `<main>` tag
4. Update `NAV_LINKS` in `constants.ts` if section should appear in navigation

### Updating Project Context
- Edit `PROJECT_CONTEXT` in `constants.ts`
- This is the system prompt Gemini uses—keep it factual and proposal-specific
- Avoid generic instructions; focus on project details, timeline, objectives, problems

### Modifying ChatAssistant Behavior
- Temperature (0-1): Currently 0.7 (balanced). Lower = deterministic, Higher = creative
- Model: Currently `gemini-2.5-flash` (fast, cost-effective)
- Message history: Automatically managed; all messages sent to Gemini for context
- Error messages in `sendMessageToAssistant` are user-facing fallback responses

### Styling Adjustments
- Refer to existing components for Tailwind patterns (e.g., ProblemSection for card patterns)
- Use semantic color naming: red for problems/errors, green for solutions, blue for primary actions
- Ensure dark mode readability: sufficient contrast between `slate-900` backgrounds and text

---

## Gotchas & Important Notes

1. **API Key Loading:** Vite must run AFTER `.env.local` is created; changes to .env.local require server restart
2. **Environment Variable Syntax:** Used as `process.env.API_KEY` (shadowed by Vite define) and `process.env.GEMINI_API_KEY` (also exposed)
3. **Chat History Format:** Gemini API expects strict format `{ role: 'user'|'model'; parts: [{ text: string }] }[]`; deviation causes API errors
4. **No Backend Calls:** This app is entirely client-side; any API calls must be made directly from React components with CORS-enabled services (Gemini API is already configured)
5. **TypeScript Strict Mode:** Ensure all component props typed with interfaces (see SectionProps pattern)
6. **Scroll Anchors:** Navigation links use `href="#sectionId"` for smooth scrolling; section IDs must match NAV_LINKS hrefs

---

## Quick Reference

| File | Purpose |
|------|---------|
| `App.tsx` | Main layout, navbar, hero, footer, section composition |
| `components/*` | Modular UI sections (Problem, Solution, Timeline, Comparison, Chat) |
| `services/gemini.ts` | Gemini API wrapper, chat initialization, message sending |
| `constants.ts` | PROJECT_CONTEXT, NAV_LINKS, domain knowledge |
| `types.ts` | ChatMessage, SectionProps, ProjectPhase enum |
| `vite.config.ts` | Build config, port, env vars, React plugin, aliases |

---

## Tips for AI Agents

- **Context-Aware Responses:** Gemini is primed with PROJECT_CONTEXT; questions about inventory, mobile, siloed data will get proposal-specific answers
- **Component Reusability:** Use existing component patterns (ProblemSection, SolutionSection) as templates for new sections
- **Safe Edits:** Prefer editing within existing Tailwind class strings; avoid changing HTML structure without testing
- **Testing Changes:** Use `npm run dev` to see live changes; verify chat functionality by submitting test questions
