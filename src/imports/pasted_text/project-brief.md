PROJECT BRIEF — LuxeLife Properties. Read fully before generating anything.

WHAT THIS PROJECT IS
LuxeLife Properties is a furnished monthly rental platform for stays of
30 days or more in Sacramento and Oakland, California. It is inquiry
based. There is no instant booking. Users send an inquiry and a real
person replies.

We are building an eight page clickable prototype from a finished,
approved design. The graphic design team has completed their final pass.
Nothing in the design is open for revision.

HOW THIS PROJECT WILL RUN
I will give you one page at a time. For each page I will upload the
1440 desktop frame and give you a mobile layout spec written out in
full. Build only the page I give you. Wait for me before moving on.

Do not build pages I have not given you. Do not create placeholder
pages. Do not scaffold ahead.

Acknowledge these rules and then wait for the first page.

======================================================================
1. FIDELITY CONTRACT
======================================================================

This is a reproduction task, not a design task. Your job is to rebuild
the design exactly. You have no creative latitude.

DO NOT CHANGE, under any circumstance:
- Typefaces, font sizes, weights, line heights, letter spacing
- Any color value, including backgrounds, text, borders, shadows
- Any image, illustration, icon, or logo
- Spacing, padding, margins, gaps, container widths
- Corner radii, border widths, shadow values
- Layout order, section order, or element hierarchy
- Component structure or which component appears where
- Any visible copy, except where section 2 explicitly allows it

DO NOT ADD:
- Sections, cards, badges, dividers, or decorative elements not in the frame
- Stock photography or Unsplash imagery of any kind
- A color palette of your own
- Hover states, animations, or transitions not specified in the frame
- "Improvements," modernizations, or accessibility restyling

DO NOT REMOVE anything present in the frame.

Read every value from the frame itself. Never infer, never approximate,
never substitute a "close enough" value. If a value is ambiguous, stop
and ask me. Do not guess.

If you believe something in the design is wrong, do not fix it. List it
at the end of your output as a note and build it as designed.

======================================================================
2. SEO AND AIO — the only permitted deviations
======================================================================

ALLOWED:
- Real semantic tags: one h1 per page, h2 for sections, h3 for
  subsections, plus nav, main, section, footer, article
- CRITICAL: changing a tag must not change how it looks. Keep the exact
  visual styling from the frame. A visual h2 that becomes a semantic h1
  keeps its original size, weight, and color.
- Descriptive alt text on every image
- Page title and meta description
- FAQ blocks marked up as real question and answer pairs with FAQPage
  structured data
- Rewording heading and body copy for natural keyword fit:
  furnished housing, corporate housing, extended stay, monthly rental,
  Sacramento, Oakland
- Descriptive link text instead of generic

NOT ALLOWED under the SEO exception:
- Adding new visible sections, blocks, or content the design lacks
- Changing font size or weight to create hierarchy. Use tags, not styles.
- Lengthening copy past the space the design gives it
- Keyword stuffing or changing the voice

COPY RULES for any text you rewrite:
- No hyphens, dashes, or em dashes. Write full sentences.
- No ampersands. Always write "and".
- No middle dot separators. Use commas.
- Sentence case on all headings, titles, badges, and labels.
  Never Title Case.

======================================================================
3. RESPONSIVE — mobile first
======================================================================

Only 1440 desktop frames will be uploaded. The desktop frame is
authoritative for ALL visual styling at every breakpoint: colors,
typefaces, sizes, weights, photography, illustrations, icons, radii,
shadows, borders.

Do not scale or shrink the desktop layout to produce mobile. Do not
invent mobile layout. I will give you an explicit mobile layout spec
with every page. Build mobile from that spec.

If I forget to include a mobile spec, stop and ask for it. Do not
proceed without one.

TABLET: no designed 768 frame exists. Do not invent one. At 768 use the
mobile stack with increased max-widths and horizontal padding. Card
groups may go to two columns where content supports it. Nothing else
changes.

Breakpoints: base 390, @media (min-width: 768px), @media (min-width: 1440px).

Mobile requirements on every page:
- Tap targets 44px minimum
- No horizontal scroll from 320px up
- Inputs typed correctly: email, tel, number
- 16px minimum font size on inputs to stop iOS zoom
- Images scale inside their container, never overflow

Confirm no layout breaks at 320, 390, 430, 768, 1024, 1440, 1920.

======================================================================
4. BUILD RULES
======================================================================

Build only the page I give you. Do not modify, refactor, or touch any
other page file. Each new page is a standalone file. Swap main.tsx to
render the current page for preview.

TopNav and Footer are shared components. Build them once on the Home
page. On every page after, copy them verbatim from the Home page. Do
not rebuild, restyle, or "improve" them.

The design file contains internal labels that are instructions to
designers, not user facing copy. Never render text such as "Color
Accent," "Hero Photo," "Property Photo," "Icon," "Logo Mark," or any
similar placeholder label as visible text. If a labeled box contains a
real image in the desktop frame, use the image.

Never render lorem ipsum. If you find placeholder body text, stop and
ask me for real copy.

At the end of every page you build, list:
1. Any value you had to guess, and what you chose
2. Any conflict you found in the design
3. Anything you flagged but built as designed

======================================================================
5. SITE MAP AND WIRING
======================================================================

Every link and button in this prototype must work. Use these exact
targets on every page.

ROUTES:
/                      Home
/midtown-modern-suite  Product
/partnership           Partnership
/inquiry               Send Inquiry
/inquiry-received      Received Inquiry
/confirmed             Confirmed
/walkthrough           Steps Walk Through
/resident-hub          Resident Hub

TOPNAV, identical on every page:
- Logo                 /
- Home                 /
- Properties           /#homes
- Partner with us      /partnership
- Sign in              href="#"   // no sign in page designed yet
- Phone number         tel: link

FOOTER, identical on every page:
- Properties           /#homes
- Pricing              href="#"   // no page designed yet
- Partner with us      /partnership
- About                href="#"   // no page designed yet
- Contact              href="#"   // no page designed yet
- FAQ                  /#faq
- Privacy policy       href="#"   // no page designed yet
- Terms of service     href="#"   // no page designed yet

Note: the design file says "Homes" in the footer and "Properties" in the
nav. Use "Properties" in both places.

HOME:
- See available homes              /#homes
- Get early access to new homes    /#early-access
- Anchor nav pills                 in page anchors
- Midtown card, Check availability /midtown-modern-suite
- Oakland card, Notify me          /#early-access
- Pricing, Check availability      /inquiry
- FAQ rows                         accordion only, no navigation
- Get our partner guide            submit, then success state
- Get early access                 submit, then success state

PRODUCT:
- Check availability               /inquiry
- Send an inquiry                  /inquiry
- Meet your property manager       no link
- Similar homes card               /#homes
- FAQ rows                         accordion only

PARTNERSHIP:
- Tell us about your organization  submit, then success state
- FAQ rows                         accordion only

SEND INQUIRY:
- Submit                           /inquiry-received
- "I am booking for someone else"  checkbox expands and collapses the
                                   guest details fields in place, with
                                   no navigation. Both states must work.

RECEIVED INQUIRY:
- Primary CTA                      /confirmed

CONFIRMED:
- Walkthrough CTA                  /walkthrough

STEPS WALK THROUGH:
- Next and Back                    move between steps in page, no route change
- Final step CTA                   /resident-hub

RESIDENT HUB:
- Quick answers                    accordion only
- Contact CTA                      mailto: link

Every href="#" gets a code comment saying the page is not yet designed.
Never invent routes or pages to fill them.

======================================================================
6. GLOBAL MOBILE PATTERNS
======================================================================

These apply to every page and are not repeated in the per page specs.

Mobile menu: logo left, hamburger right. Tapping the hamburger opens a
full screen panel with the desktop nav items stacked vertically and a
close X in the top right. Style the panel in the desktop palette.

Anchor nav pill rows: keep the horizontal row but make it horizontally
scrollable. Pills keep their exact desktop styling. The active pill stays
visible on load. Do not convert to a dropdown.

Multi column desktop rows become single column stacks in the same order,
unless the page spec says otherwise.

Full bleed sections keep their desktop background color.

Form fields go full width and stack in the same order as desktop.

======================================================================

Acknowledge these rules. Then wait. I will send the Home page next.