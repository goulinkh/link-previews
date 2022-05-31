import { createHash } from "crypto";

/**
 *
 * @param {string} url
 * @returns {URL|null}
 */
export function parseUrl(url) {
  try {
    const url2 = new URL(url);
    if (!(url2.protocol === "http:" || url2.protocol === "https:"))
      throw new Error();
    return url2;
  } catch (_) {
    return null;
  }
}

export function hash(url) {
  return createHash("md5").update(url).digest("hex");
}
