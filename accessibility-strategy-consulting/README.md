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

## Admin Setup

The `/admin` folder is configured for Decap CMS with Netlify Identity and Git Gateway.

To enable backend control after deployment:

1. Deploy this folder to Netlify.
2. Enable Netlify Identity.
3. Enable Git Gateway.
4. Invite yourself as an admin user.
5. Visit `/admin` on the live site.

The contact form is also configured for Netlify Forms.
