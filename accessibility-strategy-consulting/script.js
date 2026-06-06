// Paste your Formspree endpoint here, for example:
// const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcxyz";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const resourceList = document.querySelector("#resource-list");
const contactForm = document.querySelector("[data-formspree-form]");
const formStatus = document.querySelector("#form-status");
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

if (contactForm) {
  contactForm.setAttribute("action", FORMSPREE_ENDPOINT);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      if (formStatus) {
        formStatus.textContent = "Add your Formspree endpoint in script.js before using the form.";
      }
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
    if (formStatus) formStatus.textContent = "Sending your request...";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Formspree submission failed");
      window.location.href = "thank-you.html";
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "The form could not be sent. Please try again.";
      }
      if (submitButton) submitButton.disabled = false;
    }
  });
}
