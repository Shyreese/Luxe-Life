# LuxeLife Properties

Start here. AGENTS.md and CLAUDE.md are instructions for Figma Make's AI and can be ignored. The dev server does not run on its own outside Figma Make. Use the commands in section 2.

## 1. What this is

LuxeLife Properties offers furnished monthly rentals for 30 day stays and longer in Sacramento and Oakland. The site is inquiry based. There is no instant booking, and every stay is confirmed personally by the property manager.

* One live home: The Sacramento Condo.
* Oakland is coming soon.
* Supabase is connected for resident email OTP sign in and inquiry submission. Other resident data and forms are still mock data or demos.

## 2. Stack and how to run

* React 19 and React DOM 19
* react router 8 (`createBrowserRouter`, routes loaded on demand)
* Vite 8 with `@vitejs/plugin-react`
* Tailwind CSS v4 through `@tailwindcss/vite` (no Tailwind config file, theme tokens live in `src/index.css`)
* TypeScript 5.7
* Figtree font, self hosted as woff2 in `src/fonts`
* Package manager: pnpm 10. Node 22. Versions are pinned in `.mise.toml`.
* Formatting: oxfmt

Commands:

```
pnpm install        # install dependencies
pnpm dev            # start the dev server (port 3000 unless PORT is set, default 8443 in config)
pnpm build          # production build into dist
pnpm preview        # serve the built site locally
npx tsc --noEmit    # type check
```

## 3. Routes

Routes are defined in `src/router.tsx`. Only Home is bundled up front. Every other page is a separate chunk.

| Route | File | Access |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Public |
| `/sacramento-condo` | `src/pages/Product.tsx` | Public |
| `/partnership` | `src/pages/Partnership.tsx` | Public |
| `/inquiry` | `src/pages/Inquiry.tsx` | Public (noindex) |
| `/inquiry-received` | `src/pages/InquiryReceived.tsx` | Public (noindex, shown after an inquiry) |
| `/sign-in` | `src/pages/SignIn.tsx` | Public (noindex) |
| `/admin/sign-in` | `src/pages/AdminSignIn.tsx` | Public (noindex, administrator OTP only) |
| `/admin` | `src/pages/Admin.tsx` | Resident administrator only |
| `/confirmed` | `src/pages/Confirmed.tsx` | Resident only (noindex) |
| `/walkthrough` | `src/pages/Walkthrough.tsx` | Resident only (noindex) |
| `/resident-hub` | `src/pages/ResidentHub.tsx` | Resident only (noindex) |
| `*` | `src/pages/NotFound.tsx` | Public (noindex) |

The resident routes require an active Supabase session. Sensitive data still needs database row level security as described in section 6.

## 4. File map

| What | Where |
| --- | --- |
| Pages | `src/pages` |
| Router and root layout | `src/router.tsx` |
| Shared components (TopNav, Footer, AccentBar, HeroPattern, PropertyGallery) | `src/components` |
| Icons | `src/components/icons.tsx` |
| Mock data, pricing, access codes, helpers | `src/data/mockData.ts` |
| Images imported by code (WebP, a few PNG icons, logo) | `src/assets` and `src/imports` |
| Fonts | `src/fonts` |
| Global CSS, theme tokens, font faces | `src/index.css` |
| Favicons and sitemap | `public` |
| Site title, description, robots flag | `.figma/make/site.json` |
| Document shell | `index.html` |

## 5. Design rules to keep

**Layout**

* Mobile first. Check every change at 390px, 768px, and 1440px.

**Copy**

* Sentence case everywhere.
* No hyphens or dashes in visible copy.
* No ampersands. Write "and".
* No middle dots.
* No all caps labels.
* One h1 per page.

**Color and interaction**

* Use the tokens in `src/index.css` under `@theme`: terracotta, terracotta deep, terracotta dark, terracotta light, terracotta soft, cream, tan, sage, bronze, ink, body, muted, muted strong, navy, card.
* Use the shared `AccentBar` component above section headings. Do not rebuild it.
* Keep the global focus styles in `src/index.css`. Do not remove outlines.
* Every tap target is at least 44px tall.
* Keep contrast at WCAG AA or better when you add colors.

**Photos**

* Never use stock photos of people and present them as real staff or residents. Use real photos or initials avatars.

## 6. Demo logic to replace (must do before launch)

* [x] Remove the demo sign in rules and use Supabase email OTP without creating users from the sign in flow.
* [x ] Enable RLS on `public.inquiries` and allow insert-only submissions from anonymous and authenticated users. The inquiry form intentionally does not request inserted rows back, so do not add SELECT access:

```sql
alter table public.inquiries enable row level security;
grant insert (booking_for, full_name, email, phone, move_in, length, guest_name, guest_email, guest_phone, guest_org, message)
  on table public.inquiries to anon, authenticated;
drop policy if exists "public can submit inquiries" on public.inquiries;
create policy "public can submit inquiries"
  on public.inquiries for insert to anon with check (true);
drop policy if exists "authenticated users can submit inquiries" on public.inquiries;
create policy "authenticated users can submit inquiries"
  on public.inquiries for insert to authenticated with check (true);
```

* [ ] Apply `supabase/migrations/20261122000400_allow_authenticated_inquiries.sql` so signed-in residents can submit new stay inquiries without gaining access to read inquiry records. The Resident Hub's new-inquiry link prefills their contact details; each submission starts with new stay dates and blank guest details.
* [ ] Apply `supabase/migrations/20261122000500_pending_inquiry_access.sql` so residents can read only their own pending inquiry details and submission dates in the Resident Hub.
* [x] In Supabase Auth settings, disable public user sign up, configure custom SMTP for delivery to real guest email addresses, and use `{{ .Token }}` in the email template for six digit codes. Inquiry, resident, and allowlisted administrator sign in is provisioned by the private `request-inquiry-otp` Edge Function; deploy it with `supabase functions deploy request-inquiry-otp`. Residents can sign in regardless of stay status.
* [] Protect `/resident-hub`, `/walkthrough`, and `/confirmed` with a session check. Redirect signed out visitors to `/sign-in`.
* [ ] Move access codes and the wifi password (`ACCESS` in `mockData.ts`) to a table with row level security. Show them only to a signed in resident with an active stay.
* [x] Remove the demo resident PDFs from the public site so their URLs cannot expose resident paperwork.
* [ ] Apply `supabase/migrations/20261122000000_private_resident_documents.sql`, `supabase/migrations/20261122000100_resident_document_read_access.sql`, `supabase/migrations/20261122000200_stay_lease_receipt_documents.sql`, and `supabase/migrations/20261122000300_fix_document_admin_check.sql` after the resident admin migrations. These create a private `resident-documents` bucket and restrict it to two PDFs per stay: `lease.pdf` and `payment-receipt.pdf`, up to 15 MB each. Administrators can manage stay documents; only the resident matching the stay ID and account email can read them, and only while the stay is active or ended. The final migration uses a restricted security-definer helper to check the administrator allowlist without granting residents access to `resident_admins`. In `/admin`, upload one lease and one payment receipt when adding or editing a resident stay. The Resident Hub lists these documents for all that resident's active and previous stays with five-minute signed links. Re-upload any required paperwork through `/admin` and attach it to the correct stay.
* [ ] Save the Inquiry, Partnership, and Early access forms to tables. Generate Request IDs on the server (`generateRequestId` and `DEMO_REQUEST_ID` in `mockData.ts` are demo only).
* [ ] Enable business email notifications: set the `RESEND_API_KEY` and a private `INQUIRY_WEBHOOK_SECRET` as Supabase Edge Function secrets, then deploy `send-inquiry-notification` with `supabase functions deploy send-inquiry-notification`. In **Database > Webhooks**, create an `INSERT` webhook for `public.inquiries` pointing to `https://<project-ref>.supabase.co/functions/v1/send-inquiry-notification` and add the `x-webhook-secret` header with the same secret. This sends a notification to `info@luxelp.com` for both public and signed-in inquiries. The function does not send guest confirmation emails.
* [ ] Add spam protection: Turnstile or similar, a honeypot field, and a rate limit.
* [ ] Save walkthrough progress per resident.
* [ ] Replace the rest of the mock data (`RESIDENT`, `STAY`, `INQUIRY_SUMMARY`, `CONFIRMED_STAY`) with real records.
* [x] Apply `supabase/migrations/20261115000000_resident_admin.sql`, `supabase/migrations/20261115000100_allow_resident_history.sql`, and `supabase/migrations/20261115000200_repair_resident_admin_policies.sql` in the Supabase SQL Editor. Add an administrator with `insert into public.resident_admins (email) values ('owner@example.com');` using their lowercase sign-in email, then deploy the updated function with `supabase functions deploy request-inquiry-otp`. Administrators sign in at `/admin/sign-in` with their email OTP and can add or update resident records at `/admin`. The admin sign-in request is checked against `public.resident_admins`. Set a resident's status to `active` only after confirming the stay. Residents with a past or pending stay can still sign in; the Resident Hub shows their stay record or a no-stay-information message.


## 7. Launch checklist

* [ ] Set `robots.index` to true in `.figma/make/site.json`, and remove the "Flip to index at launch" comment in `index.html`. Also remove the page level `noindex` meta tags from the pages that should be indexed.
* [ ] Replace `https://example.com` in `public/sitemap.xml` with the real domain. Add `/inquiry` back to the sitemap if you want it indexed, and remove its noindex tag at the same time.
* [ ] Use absolute `og:image` URLs. Home, Product, and Partnership build them from `window.location.origin`, which crawlers that skip JavaScript cannot see.
* [ ] Add prerendering so crawlers see titles, meta tags, and structured data.
* [ ] Build the About, Contact, Privacy, and Terms pages. The footer links currently point to `#`. Privacy and Terms need legal review.
* [ ] Run `npx tsc --noEmit` and `pnpm build`, then check every route on mobile.

## 8. Real data still needed from the owner

* [ ] Phone number
* [ ] Manager email
* [ ] Condo street address (the site shows only North Natomas)
* [ ] Oakland address
* [ ] Deposit and cleaning fees
* [ ] Max guests
* [ ] Amy's real photo (set `PROPERTY_MANAGER_PHOTO` in `src/data/mockData.ts`)
* [ ] Whether partners need a contract or a minimum volume
* [ ] Review count, and confirmation that the reviews are real and may be shown
* [ ] Sources for the competitor price comparison
* [ ] Square footage and distances
* [ ] The nearby places list

## 9. Nice to have later

* [ ] Extract the shared scrollspy, pill nav, carousel, and early access form into components. They are copied across pages today.
* [ ] Replace the remaining hex literals with tokens.
* [ ] Move the scoped `<style>` tags in Confirmed, InquiryReceived, ResidentHub, and Walkthrough into `src/index.css`.

## 10. Contacts

* Armon, UX designer: design questions.

* Amy Flatt, property manager: property details, access, and guest questions.

* Shyreese Tyiska, property owner: pricing, partnerships, and business decisions.

Live preview: https://cling-from-01145145.figma.site

Figma Make file: https://www.figma.com/make/JaXk7TBbwEtjPnRCveW24o/Lux-Life-Launch-Build
