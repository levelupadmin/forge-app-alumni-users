# The Forge — Alumni Users

A standalone prototype of **The Forge Community** — a private alumni-only network for filmmakers, creators and writers who have graduated from a Forge edition.

> **Alumni, *only*.**
> Find collaborators. Hire each other. Post and apply to gigs.

This repository contains the full alumni-facing flow, isolated from the main Forge app for design iteration.

## What's inside

| Route | Page | Purpose |
| --- | --- | --- |
| `/community-redesign/landing` | `CommunityLanding` | Public, cold-audience landing page. |
| `/community-redesign/sign-in` | `CommunitySignIn` | Phone + OTP sign-in matched against the alumni list. |
| `/community-redesign/onboarding` | `CommunityOnboarding` | First-time profile setup. Required before browsing. |
| `/community-redesign` | `CommunityRedesign` | The Circle — directory, gigs board, chat. |
| `/community-redesign/creative/:id` | `CreativeProfile` | A single alum's profile (gated by own-profile completion). |
| `/community-redesign/post-gig` | `CommunityPostGig` | Alumni-side gig posting modal. |
| `/community-redesign/inbox` | `CommunityInbox` | Track applications you sent + conversations you started. |
| `/community-redesign/admin/gigs` | `AdminGigs` | LevelUp admin — manage and place sponsored gigs. |

## Running locally

```bash
npm install
npm run dev
```

Opens at <http://localhost:8080>. Root `/` redirects to the landing page.

### Test sign-in numbers (country code `+91`)

| Number | Who | Path |
| --- | --- | --- |
| `9876543210` | Aanya Mehra · Cohort 04 | Returning alum, profile complete |
| `9876511111` | Rohan Iyer · Cohort 03 | Returning alum, profile complete |
| `9876522222` | Maya Krishnan · Cohort 04 | First-time — forced through onboarding |
| `9999999999` | Test Alum · Cohort 05 | Returning alum, profile complete |
| Any other 10-digit number | — | "Not on our alumni list" |

OTP: any 6 digits succeeds; `000000` simulates a wrong code.

### Profile-gate flag

The "your profile must exist before you can view other profiles" rule reads `localStorage.forge.profileComplete`. To unlock or lock browsing without logging in:

```js
localStorage.setItem('forge.profileComplete', 'true');  // unlock
localStorage.setItem('forge.profileComplete', 'false'); // lock
```

## Design notes

- **Brand**: `#0b0a08` background · `#f5efe2` cream · amber `hsl(41 100% 62%)` primary · OpenSauceOne sans only.
- **Voice**: editorial, premium, cinematic-earnest. Italic-amber accents on the keyword in each headline. Lowercase tracked eyebrow labels.
- **Tagline**: *Alumni, only.*
- **Mobile-first**: the landing page hero keeps "Enter the Circle" above the fold; a sticky CTA bar appears once the hero scrolls off and hides again when the final CTA is in view.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · lucide-react · @radix-ui/react-avatar.

All data is mocked. No backend, no Supabase, no auth — this is a UX prototype.
