import escapeHtml from "escape-html";
import { writeFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { IMAGES_FOLDER, IMAGES_PREFIX, PREVIEW_SIZE } from "./config.mjs";
import { hash } from "./utils.mjs";

let browser, context;

export async function setup() {
  // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
  puppeteer.use(StealthPlugin());

  // Add adblocker plugin to block all ads and trackers (saves bandwidth)
  puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

  browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  context = await browser.createIncognitoBrowserContext();
}

export async function parse(url) {
  const page = await context.newPage();
  try {
    await page.setViewport({ width: PREVIEW_SIZE, height: PREVIEW_SIZE });
    await page.goto(url, { waitUntil: "networkidle0" });
    const screenshotUrl = await screenshot(page, url);
    const metadata = await parseMetadata(page, url);
    return { screenshot: screenshotUrl, metadata };
  } finally {
    await page.close();
  }
}

async function screenshot(page, url) {
  const image = await page.screenshot({
    type: "jpeg",
    quality: 100,
  });
  const resourceName = hash(url) + ".jpg";
  await writeFile(path.join(IMAGES_FOLDER, resourceName), image, {
    encoding: "binary",
  });
  return IMAGES_PREFIX + "/" + resourceName;
}

async function parseMetadata(page, url) {
  try {
    const metadata = {
      // Search Engine
      title: [
        { selector: "title", attr: null },
        { selector: 'meta[itemprop="name"]', attr: "content" },
        { selector: 'meta[name="twitter:title"]', attr: "content" },
        { selector: 'meta[property="og:title"]', attr: "content" },
      ],
      description: [
        {
          selector: 'meta[name="description"]',
          attr: "content",
        },
        {
          selector: 'meta[itemprop="description"]',
          attr: "content",
        },
        {
          selector: 'meta[name="twitter:description"]',
          attr: "content",
        },
        {
          selector: 'meta[property="og:description"]',
          attr: "content",
        },
      ],
      author: [
        {
          selector: 'meta[name="author"]',
          attr: "content",
        },
        { selector: 'meta[name="twitter:creator"]', attr: "content" },

        {
          selector:
            '[itemprop*="author" i] [itemprop="name"], [itemprop*="author" i]',
          attr: "content",
        },
      ],
      icon: [
        {
          selector: 'link[rel="icon" i], link[rel="shortcut icon" i]',
          attr: "href",
        },
      ],
      image: [
        { selector: 'meta[itemprop="image"]', attr: "content" },
        { selector: 'meta[name="twitter:image"]', attr: "content" },
        { selector: 'meta[property="og:image"]', attr: "content" },
      ],
      imageAlt: [
        { selector: 'meta[name="twitter:image:alt"]', attr: "content" },
        { selector: 'meta[property="og:image:alt"]', attr: "content" },
      ],
    };
    const parsedMetadata = await page.evaluate(
      ({ metadata }) => {
        return Object.keys(metadata).map((property) => {
          const rules = metadata[property];
          for (const rule of rules) {
            const el = document.querySelector(rule.selector);
            if (el) {
              const value = rule.attr
                ? el.getAttribute(rule.attr)
                : el.textContent;
              if (value) {
                const result = {};
                result[property] = value;
                return result;
              }
            }
          }
        });
      },
      { metadata }
    );

    let result = {};
    parsedMetadata.forEach((p) => (result = { ...result, ...p }));
    return {
      ...result,
      title: escapeString(result.title),
      description: escapeString(result.description),
      author: escapeString(result.author),
      imageAlt: escapeString(result.imageAlt),
      icon: resolveResource(url, result.icon),
      image: resolveResource(url, result.image),
      hostname: new URL(url).hostname,
    };
  } catch (e) {
    if (!e.message) {
      // TODO: capture the error from the evaluate function
      throw new Error("Failed to parse the metadata");
    }
    throw new Error(e);
  }
}

function resolveResource(url, resourceUrl) {
  if (!resourceUrl) return undefined;
  if (!resourceUrl.match(/^http(s):\/\//i)) {
    return new URL(resourceUrl, new URL(url).origin).href;
  }
}
function escapeString(text) {
  if (!text) return undefined;
  return escapeHtml(text);
}
