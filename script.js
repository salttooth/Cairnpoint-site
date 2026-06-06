const resourceList = document.querySelector("#resource-list");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function normalizeResourceType(type) {
  const labels = {
    whitepaper: "Whitepaper",
    guide: "Guide",
    video: "Video",
    link: "Resource",
  };

  return labels[type] || "Resource";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderResources(resources) {
  if (!resourceList) return;

  if (!resources.length) {
    resourceList.innerHTML = "<p class=\"muted\">Resources will be added soon.</p>";
    return;
  }

  resourceList.innerHTML = resources
    .map((resource) => {
      const title = resource.title || "Untitled resource";
      const description = resource.description || "";
      const url = resource.url || resource.file || "#";
      const type = normalizeResourceType(resource.type);
      const action = resource.type === "video" ? "Watch" : "Open";
      const embed = resource.embed
        ? `<div class="video-frame"><iframe src="${escapeHtml(resource.embed)}" title="${escapeHtml(title)}" allowfullscreen></iframe></div>`
        : "";

      return `
        <article class="resource-card">
          <span class="resource-type">${escapeHtml(type)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
          ${embed}
          <a href="${escapeHtml(url)}">${escapeHtml(action)} ${escapeHtml(type.toLowerCase())}</a>
        </article>
      `;
    })
    .join("");
}

async function loadResources() {
  if (!resourceList) return;

  try {
    const response = await fetch("data/resources.json");
    if (!response.ok) throw new Error("Unable to load resources");
    const data = await response.json();
    const resources = Array.isArray(data) ? data : data.resources;
    renderResources(Array.isArray(resources) ? resources : []);
  } catch (error) {
    resourceList.innerHTML = "<p class=\"muted\">Resources will be added soon.</p>";
  }
}

loadResources();

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", (user) => {
    if (!user && window.location.hash.includes("invite_token")) {
      window.netlifyIdentity.open("signup");
    }
  });
}
