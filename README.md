# Accessibility Strategy Consulting Site

Simple static website for CairnPoint Consulting, Kyle Van Auker's accessibility strategy and media accessibility consulting practice.

## Local Preview

From this folder:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Resource Updates

Resources are stored in `data/resources.json`.

Uploaded whitepapers and documents belong in `assets/docs`.

Each resource supports:

- `title`
- `type`: `whitepaper`, `guide`, `video`, or `link`
- `description`
- `file`: optional uploaded document path
- `url`: optional external link
- `embed`: optional video embed URL

## Formspree Setup

The contact form is configured for Formspree.

Paste your endpoint near the top of `script.js`:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
```

The form redirects to `thank-you.html` after a successful submission.

## SEO Placeholders

Replace `https://YOUR-DOMAIN.example/` with the live CairnPoint domain in:

- `index.html`
- each service page
- `thank-you.html`
- `sitemap.xml`
- `robots.txt`

## Admin Setup

The `/admin` folder is configured for Decap CMS with Netlify Identity and Git Gateway.

This is optional and separate from the Vercel-hosted public site. To enable CMS control later:

1. Deploy this folder to Netlify.
2. Enable Netlify Identity.
3. Enable Git Gateway.
4. Invite yourself as an admin user.
5. Visit `/admin` on the live site.
