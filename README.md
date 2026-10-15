# Karigar — Beyond the Waiting Line

**Connecting India's skilled daily-wage craftspeople and workers to better work, fair pay and their rights.**
Theme: Inclusive Design · Employment · Digital Empowerment — a frontend-only hackathon build (Next.js, mock data, no backend).

Every morning plumbers, painters, masons, electricians and helpers wait at a *naka* (roadside hiring point) hoping the right person walks by. Karigar transforms that familiar way of working into an empowering digital ecosystem: nearby jobs with the pay written first, a verified skill card that replaces a résumé, a trust shield against scams, and rights & schemes in plain language.

## What's inside

| Route | What it does |
| --- | --- |
| `/` | Hero with a hand-drawn 2D naka scene (chai tapri, painted kerb, five workers with their tools) and live job tickets showing pay. Then: a morning at the naka (the problem), how it works, phone demo, design principles (Self-Determination Theory), rights teaser, SDG impact, personas. |
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
- **4 languages — English, हिंदी (Hindi), मराठी (Marathi), ગુજરાતી (Gujarati).** Each is written in its own script in the picker; first-time visitors get a small "choose your language" sheet, and the browser language is used if it matches. All languages are server-rendered and swapped by CSS, so switching is instant and works without JS. The `L` type requires all four, so TypeScript flags any missing translation.
- **Read aloud** on every job card and key text (browser speech synthesis, no network) — Marathi falls back to a Hindi voice and Gujarati to English when the phone has no voice for it. **Voice search** understands trade words in all four languages.
- **Text size** (3 steps) and **low-data mode** (turns off smooth scroll and animations; auto-enabled on 2G / Save-Data).
- Pay is always the biggest thing on a card; duration is the first filter — built around irregular work.
- Respects `prefers-reduced-motion`; skip link, landmarks, labelled controls, visible focus.

## Tech & performance

- **Next.js 16 App Router**, React 19, TypeScript. Every page is statically prerendered (server-friendly: plain static HTML + small client islands).
- **One token sheet** — `src/styles/tokens.css` holds every colour, size, radius, shadow and duration for light and dark themes. Change the brand there and the whole UI (including the hero illustration, which reads `--scene-*` tokens) follows.
- **Hero illustration** is plain inline SVG (`NakaScene.tsx`) — no images or WebGL to download, themed by tokens, readable on 2G.
- **Lenis** smooth scrolling; one data-attribute motion engine (`data-reveal`, `data-tilt`, `data-count`, `data-story`…) so pages stay server components.
- Theme / language / text-size are applied by an inline script before first paint — no flash.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

### Docker

```bash
docker compose up --build        # http://localhost:3000
# or
docker build -t karigar . && docker run --rm -p 3000:3000 karigar
```

The image is a multi-stage build of Next.js `standalone` output on `node:22-alpine`: it runs as a non-root user, has a healthcheck, and `docker-compose.yml` runs it read-only with all capabilities dropped and a 256 MB memory limit.

All data is mock (`src/data/*`). Scheme details are simplified for the demo — always confirm on the official site or at a CSC.
