# Danny Elite Training

Website for a youth/competitive soccer training business run by me and a small team of D1, USL2, and MLS Next athletes. Static site, live at [trainwithdanny.org](https://trainwithdanny.org).

## Features

### Booking flow
- **Two-step signup form** — visitor fills out a details form (name, contact, player age, program interest), which submits via [Web3Forms](https://web3forms.com) directly to email. On success, the form is replaced in place by a live scheduling embed, no page reload.
- **Trainer picker** — visitor chooses which trainer they want to train with before booking; the selection determines whose calendar loads in step 2.
- **Calendly / Cal.com support** — each trainer can be booked through either Calendly or Cal.com. The booking step detects which provider a trainer is configured for (by URL) and loads the matching inline embed.

### Trainer / team system
- **`trainers.js`** is the single source of truth for every trainer — name, role, bio tags, credentials, Calendly/Cal.com link, and training locations. Both the homepage trainer selector and the `team.html` roster page render themselves from this one file, so adding a trainer updates the whole site.
- **Team page** (`team.html`) — auto-generated profile cards per trainer with photo, tags, and a credentials list (pulled from `trainers.js`).
- **Google Apps Script trainer intake pipeline** (`tools/create_trainer_form.gs`) — a Google Form collects new-trainer applications (bio, teams played for, accolades, specialties, photo, up to 8 training fields). On submit, a script automatically:
  - Uploads the trainer's photo to `brand_assets/` in this repo via the GitHub API
  - Geocodes every submitted training location (name + address → lat/lng)
  - Builds a formatted trainer object and commits it straight into `trainers.js` on `main`
  - Emails Danny a summary with a reminder to create the trainer's Calendly account
  - This means a new trainer's profile can go from form submission to live on the site with no manual code edits.

### Training locations map
- Interactive [Leaflet](https://leafletjs.com) map showing each trainer's training fields as pins, with popups for field name and address.
- Per-trainer tabs above the map filter which set of location pins is shown, with the view auto-fitting to the selected trainer's fields.

### Homepage content
- Hero image/video carousel (swipe, drag, arrow keys, trackpad scroll, and dot navigation all supported) mixing photos and clips.
- About / bio section, accolades (NCAA D1, USL2, MLS Next), services (private training vs. small-group sessions), and testimonials.
- Responsive nav with scroll-aware styling and a mobile hamburger menu.
- Scroll-triggered fade/slide-in animations throughout via `IntersectionObserver`.
- Dedicated "Request Sent" confirmation page (`thanks.html`) with direct contact info as a fallback.

## Architecture

```
Visitor's browser
      │
      ├──► index.html / script.js / styles.css   (GitHub Pages, static)
      │
      ├──► Web3Forms API           (email → Danny)
      ├──► Calendly / Cal.com      (booking widget)
      │
      └──► Vercel: api/signup.ts   (serverless function)
                  │
                  └──► Supabase Postgres: `signups` table
```

The frontend is intentionally kept as plain, dependency-free HTML/CSS/JS served straight from GitHub Pages — there's no build step, no framework, and nothing that can break between "edit a file" and "it's live." The one piece that needed real server-side logic (persisting signups) is split out into its own small Vercel function rather than bolted onto the static site, so it can be deployed, versioned, and reasoned about independently. That function is also the only part of the system with write access to the database — the browser never talks to Supabase directly, and the service-role key never leaves the server.

The signup save is deliberately **best-effort and non-blocking**: the existing Web3Forms → Calendly booking flow doesn't wait on it or depend on its result. If Supabase or Vercel ever go down, visitors can still book a session exactly as before — the database write is additive logging, not a dependency the core user flow relies on.

## Tech stack

The site itself is plain HTML/CSS/JS — no build step or framework. It's paired with a small serverless backend for signups.

- **Leaflet.js** — training locations map
- **Calendly** and **Cal.com** embed widgets — booking
- **Web3Forms** — signup form email delivery
- **Vercel serverless function + Supabase (Postgres)** — persists every signup to a database (see [Signups database](#signups-database))
- **Google Apps Script + Google Forms** — trainer onboarding automation, pushing to this repo through the GitHub REST API
- Hosted as a static site with a custom domain (see `CNAME`)

## Project structure

```
index.html      Homepage (hero, about, accolades, services, testimonials, map, signup)
team.html       Full team roster, rendered from trainers.js
thanks.html     Post-signup confirmation page
trainers.js     Source of truth for all trainer data (rendered into index.html & team.html)
script.js       Carousel, nav, form submission, trainer selection, scroll animations
styles.css      Site styling
api/
  signup.js     Vercel serverless function — validates + inserts signups into Supabase
supabase/
  schema.sql    One-time SQL to create the `signups` table
tools/
  create_trainer_form.gs   Google Apps Script: trainer intake form + auto-publish pipeline
brand_assets/   Logos, photos, and video clips used across the site
CNAME           Custom domain for GitHub Pages
```

## Signups database

Every signup submitted through the homepage form is saved to a Supabase Postgres table (`signups`), independent of the Web3Forms email — one setup doesn't depend on the other.

**One-time setup:**
1. Create a free [Supabase](https://supabase.com) project, then run `supabase/schema.sql` in its SQL editor to create the `signups` table.
2. Copy the project's URL and **service role key** (Project Settings → API).
3. Create a free [Vercel](https://vercel.com) project linked to this GitHub repo. In its dashboard, add environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` with the values from step 2, then deploy.
4. Copy the deployed function's URL and paste it into `SIGNUP_API_URL` near the top of the form-submission section in `script.js`.
5. Commit and push — GitHub Pages serves the updated `script.js`.

The function lives at `api/signup.js` and does its own server-side validation and CORS handling (only `https://trainwithdanny.org` is allowed to call it). If the database call fails for any reason, the signup form still works exactly as before — the Supabase write is best-effort and never blocks the Web3Forms → Calendly booking flow.

## Adding a new trainer

**Manually:** add an entry to the `TRAINERS` array in `trainers.js` (id, name, role, photo, Calendly/Cal.com link, tags, credentials, locations) and drop their photo in `brand_assets/`. Both the homepage and team page pick it up automatically.

**Via the intake pipeline:** send the trainer the published Google Form. Once they submit, `tools/create_trainer_form.gs` handles the rest — see the setup steps in that file's header comment for one-time configuration (GitHub token, running `createTrainerForm()` and `installSubmitTrigger()`).
