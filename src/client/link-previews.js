window.linkPreviews = { SERVER_URL: "http://localhost:3001" };
function selectQueryLinks() {
  return Array.from(document.querySelectorAll("a"));
}

const previews = new Map();

async function fetchPreview(url) {
  // skip if already fetched
  if (previews.get(url)) return previews.get(url);
  const response = await fetch(window.linkPreviews.SERVER_URL + "?url=" + url);
  if (!response.ok) {
    throw new Error("Received an error from the server");
  }
  const payload = await response.json();
  previews.set(url, payload);
  return payload;
}

// Mount, unmount preview popup

function showPreview(element) {
  const preview = previews.get(element.getAttribute("href"));
  if (!preview) return;

  const title = preview.metadata.title
    ? `<div style="width:380px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:18px; line-height:28px; font-weight:bold;">${preview.metadata.title}</div>`
    : "";
  const description = preview.metadata.description
    ? `<div style="text-overflow:ellipsis; white-space:pre-wrap; font-size:14px; line-height:20px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;">${preview.metadata.description}</div>`
    : "";
  const icon = preview.metadata.icon
    ? `<img src="${preview.metadata.icon}" style="height:20px; width:20px;"/>`
    : "";
  const hostname = preview.metadata.hostname
    ? `<div style="text-transform:uppercase; color:rgba(0,0,0,0.5);">${preview.metadata.hostname}</div>`
    : "";
  const titleDescription = `<div style="flex:1; display:flex; flex-direction:column; gap: 10px;">${title}${description}</div>`;
  const iconHostname = `<div style="display:flex; flex-direction:row; align-items:center; gap:10px;">${icon}${hostname}</div>`;
  const metadata = `<div style="display:flex; flex-direction:column; gap:10px; white-space:no-wrap; padding: 10px;">${titleDescription}${iconHostname}</div>`;
  const screenshot = preview.screenshot
    ? `<img src="${window.linkPreviews.SERVER_URL}${preview.screenshot}" style="height:200px; width:200px;"/>`
    : "";
  const popup = `<div style="pointer-events: none; font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif; color: black; position:absolute; left:0; top:125%; z-index: 20; display:flex; height:200px; width:600px; flex-direction:row; overflow:hidden; border-radius:10px; background:#fefefe; box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 3px 8px; transition: all 0.15s ease-out;">${metadata}${screenshot}</div>`;

  const popupElement = htmlToElement(popup);
  // wait for the parent styling "relative" to be applied
  element.style.position = "relative";
  element.appendChild(popupElement);
  element.previewPopup = popupElement;
}

async function hidePreview(element) {
  if (element.previewPopup) {
    element.previewPopup.style.opacity = "0";
    // wait for transition to finish
    await wait(200);
    element.removeChild(element.previewPopup);
    element.previewPopup = undefined;
  }
}

// Utils

const wait = (delay) => new Promise((r) => setTimeout(r, delay));

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

// Main

const elements = selectQueryLinks();

// prefetch all the previews
elements.forEach((element) => {
  const url = element.getAttribute("href");
  try {
    fetchPreview(url);
  } catch {}
});

// setup listeners
elements.forEach((element) => {
  element.addEventListener("mouseenter", () => showPreview(element));
  element.addEventListener("focus", () => showPreview(element));
  element.addEventListener("mouseleave", () => hidePreview(element));
  element.addEventListener("focusout", () => hidePreview(element));
});
