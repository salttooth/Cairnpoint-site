import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = new URL(".", import.meta.url).pathname;
const contentDir = path.join(root, "content", "resources");
const resourcesDir = path.join(root, "resources");
const dataFile = path.join(root, "data", "resources.json");

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Resource Markdown files must start with frontmatter.");
  }

  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }

  return { frontmatter, body: match[2].trim() };
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\n{2,}/);

  return lines
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("# ")) {
        return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
      }

      if (trimmed.startsWith("## ")) {
        return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
      }

      if (trimmed.startsWith("### ")) {
        return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${escapeHtml(line.slice(2).trim())}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
}

function siteHeader() {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header" aria-label="Site header">
      <a class="brand" href="../index.html" aria-label="CairnPoint Consulting home">
        <img class="brand-mark" src="../assets/images/cairnpoint-mark.svg" alt="" aria-hidden="true">
        <span>CairnPoint Consulting</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="../index.html#services">Services</a>
        <a href="../index.html#credibility">Experience</a>
        <a href="../index.html#resources">Resources</a>
        <a href="../index.html#contact">Contact</a>
      </nav>
    </header>`;
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <p>&copy; <span id="year"></span> CairnPoint Consulting. Accessibility strategy and media accessibility consulting by Kyle Van Auker.</p>
      <a href="../index.html">Home</a>
    </footer>
    <script src="../script.js"></script>`;
}

function articlePage(resource, html) {
  const title = escapeHtml(`${resource.title} | CairnPoint Consulting`);
  const description = escapeHtml(resource.description);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${escapeHtml(resource.title)}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://YOUR-DOMAIN.example/resources/${escapeHtml(resource.slug)}.html">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader()}
    <main id="main">
      <article class="article-page">
        <p class="eyebrow">${escapeHtml(resource.type)}</p>
        <p class="article-date">${escapeHtml(resource.date)}</p>
        <div class="article-content">
          ${html}
        </div>
        <p><a class="button button-primary" href="../resources.html">Back to resources</a></p>
      </article>
    </main>
    ${siteFooter()}
  </body>
</html>
`;
}

function resourcesIndex(resources) {
  const cards = resources
    .map(
      (resource) => `
          <article class="resource-card">
            <span class="resource-type">${escapeHtml(resource.type)}</span>
            <h3>${escapeHtml(resource.title)}</h3>
            <p>${escapeHtml(resource.description)}</p>
            <a href="${escapeHtml(resource.url)}">Open ${escapeHtml(resource.type.toLowerCase())}</a>
          </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Resources | CairnPoint Consulting</title>
    <meta name="description" content="Guides, articles, and resources for practical accessibility decision-making, media accessibility, and audio description strategy.">
    <meta property="og:title" content="Resources | CairnPoint Consulting">
    <meta property="og:description" content="Guides, articles, and resources for practical accessibility decision-making.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://YOUR-DOMAIN.example/resources.html">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header" aria-label="Site header">
      <a class="brand" href="index.html" aria-label="CairnPoint Consulting home">
        <img class="brand-mark" src="assets/images/cairnpoint-mark.svg" alt="" aria-hidden="true">
        <span>CairnPoint Consulting</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="index.html#services">Services</a>
        <a href="index.html#credibility">Experience</a>
        <a href="index.html#resources">Resources</a>
        <a href="index.html#contact">Contact</a>
      </nav>
    </header>

    <main id="main">
      <section class="section resources" aria-labelledby="resources-title">
        <div class="section-heading">
          <p class="eyebrow">Resources</p>
          <h1 id="resources-title" class="section-page-title">Whitepapers, guides, and media</h1>
          <p>
            A growing library for practical accessibility decision-making.
          </p>
        </div>
        <div class="resource-list">
          ${cards}
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>&copy; <span id="year"></span> CairnPoint Consulting. Accessibility strategy and media accessibility consulting by Kyle Van Auker.</p>
      <a href="index.html">Home</a>
    </footer>
    <script src="script.js"></script>
  </body>
</html>
`;
}

await mkdir(resourcesDir, { recursive: true });

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md")).sort();
const resources = [];

for (const file of files) {
  const markdown = await readFile(path.join(contentDir, file), "utf8");
  const { frontmatter, body } = parseFrontmatter(markdown);
  const required = ["title", "type", "description", "date", "slug"];
  for (const key of required) {
    if (!frontmatter[key]) throw new Error(`${file} is missing ${key} frontmatter.`);
  }

  const resource = {
    title: frontmatter.title,
    type: frontmatter.type,
    description: frontmatter.description,
    date: frontmatter.date,
    slug: frontmatter.slug,
    url: `resources/${frontmatter.slug}.html`,
  };
  resources.push(resource);
  await writeFile(path.join(resourcesDir, `${resource.slug}.html`), articlePage(resource, markdownToHtml(body)));
}

resources.sort((a, b) => b.date.localeCompare(a.date));

await writeFile(dataFile, `${JSON.stringify({ resources }, null, 2)}\n`);
await writeFile(path.join(root, "resources.html"), resourcesIndex(resources));

console.log(`Built ${resources.length} resource page${resources.length === 1 ? "" : "s"}.`);
