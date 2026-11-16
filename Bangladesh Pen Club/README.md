# Bangladesh Pen Club website

A plain HTML, CSS and JavaScript site. No build step, so Vercel can host it for free as it is.

## Files
- `index.html`: all page text (about, events, team, contact)
- `style.css`: colours, fonts and layout
- `script.js`: reviews, the ink colour picker, the review form
- Put photos in an `images/` folder

## Change the content
- Club name, events, team and contact details: edit `index.html`
- Approved reviews: edit the `REVIEWS` list at the top of `script.js`
- Review form: paste a free form link into `FORM_ENDPOINT` at the top of `script.js` (Formspree has a free plan), and set `REVIEW_EMAIL`. Reviews then reach your inbox first and you decide which ones to publish. This also keeps spam off the public page.

## Put it online with Vercel (free)
1. Make a GitHub account with an email the club controls, then create a new repository and upload these files.
2. Sign up at vercel.com with that GitHub account.
3. Choose "Add New Project", pick the repository, and press Deploy. No settings needed.
4. Every time you save a change on GitHub, the site updates by itself.

The site will have an address like `bangladesh-pen-club.vercel.app`. You can add your own domain later in Vercel, without rebuilding anything.

Note: Vercel's free plan is meant for non-commercial use. Read their current terms if the club will ever sell tickets or memberships through the site.
