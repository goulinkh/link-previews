import fs from "fs";
import path from "path";

// screenshots width and height (in px)
export const PREVIEW_SIZE = 800;
export const IMAGES_PREFIX = "/screenshots";
export const IMAGES_FOLDER = path.join(path.resolve(), "public");

if (!fs.existsSync(IMAGES_FOLDER)) {
  fs.mkdirSync(IMAGES_FOLDER);
}
