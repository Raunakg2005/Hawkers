# Naka — Beyond the Waiting Line

**Connecting India's daily-wage workers to better work, fair pay and their rights.**
Theme: Inclusive Design · Employment · Digital Empowerment — a frontend-only hackathon build (Next.js, mock data, no backend).

Every morning plumbers, painters, masons, electricians and helpers wait at a *naka* (roadside hiring point) hoping the right person walks by. Naka keeps that familiar way of working and adds a digital layer: nearby jobs with the pay written first, a skill card that replaces a résumé, a trust shield against scams, and rights & schemes in plain language.

## What's inside

| Route | What it does |
| --- | --- |
| `/` | 3D scroll story (three.js): workers waiting at the naka → job pins with pay rise across the city → arcs connect every worker to a job. Then: the problem, how it works, phone demo, design principles (Self-Determination Theory), rights teaser, SDG impact, personas. |
| `/jobs` | Find work: voice search (Hindi/English/Hinglish), duration-first filters (today / few days / months), trade chips, same-day-pay & verified filters, list or illustrated map, risky listings folded away by the Trust Shield. |
| `/jobs/[id]` | Job detail: the **Work Promise** (pay, payday, hours, place, perks — as icon facts), fair-pay meter, Trust Shield checklist, route & fare estimate, "I'm interested" flow that makes the worker re-confirm the terms first, share with family, report. |
| `/profile` | Skill Card builder: pick trade from pictures, years, area & days, rate vs fair band, voice intro, work photos → printable ID-style card with QR. |
| `/my-work` | Work diary for irregular income: earnings chart, dues & reminders, upcoming jobs, 90-day proof-of-work for welfare boards. |
| `/workers`, `/workers/[id]` | For employers: verified workers, endorsements, fair offer → Work Promise. |
| `/post-job` | Employer job wizard with live preview, fair-pay meter and clarity score. |
| `/rights` | Schemes (e-Shram, PM-SYM, PMSBY, PMJJBY, PM-JAY, PM SVANidhi, BOCW, ONORC, PMAY-U) by need, eligibility helper, document checklist, rights, grievance routes & helplines. |
| `/safety` | "Is this job safe?" checker, red flags, real-vs-fake listing comparison, before-you-go checklist. |

## Inclusive design decisions

- **Icon + colour + word**, never colour alone; big 48 px+ tap targets; bottom tab bar within thumb reach on phones.
- **Hindi / English** switch (`A | अ`) — both languages are server-rendered and swapped by CSS, so switching is instant and works without JS.
- **Read aloud** on every job card and key text (browser speech synthesis, no network), **voice search**.
- **Text size** (3 steps) and **low-data mode** (turns off 3D, smooth scroll and animations; auto-enabled on 2G / Save-Data).
- Pay is always the biggest thing on a card; duration is the first filter — built around irregular work.
- Respects `prefers-reduced-motion`; skip link, landmarks, labelled controls, visible focus.

## Tech & performance

- **Next.js 16 App Router**, React 19, TypeScript. Every page is statically prerendered (server-friendly: plain static HTML + small client islands).
- **One token sheet** — `src/styles/tokens.css` holds every colour, size, radius, shadow and duration for light and dark themes. Change the brand there and the whole UI (including the 3D scene, which reads `--scene-*` tokens) follows.
- **3D hero** in raw three.js, lazy-loaded on idle in its own chunk: the city is one merged geometry with procedural shader windows, no shadow maps, DPR capped and auto-lowered on slow frames, render loop paused off-screen / in background tabs. A static SVG poster is shown in low-data mode or without WebGL.
- **Lenis** smooth scrolling; one data-attribute motion engine (`data-reveal`, `data-tilt`, `data-count`, `data-story`…) so pages stay server components.
- Theme / language / text-size are applied by an inline script before first paint — no flash.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

All data is mock (`src/data/*`). Scheme details are simplified for the demo — always confirm on the official site or at a CSC.
