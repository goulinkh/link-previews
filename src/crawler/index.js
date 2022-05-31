import Cors from "@fastify/cors";
import ServeStatic from "@fastify/static";
import fastify from "fastify";
import { IMAGES_FOLDER, IMAGES_PREFIX } from "./config.mjs";
import { parse, setup } from "./puppeteer.mjs";
import { parseUrl } from "./utils.mjs";

const app = fastify({ logger: true });
app.register(Cors, { origin: true });
app.register(ServeStatic, {
  root: IMAGES_FOLDER,
  prefix: IMAGES_PREFIX,
});

await setup();

app.get("/", async (request, reply) => {
  const url = parseUrl(request.query.url);
  const emptyResult = {
    screenshot: null,
    metadata: {},
  };
  if (!url) {
    reply.code(400);
    emptyResult["error"] = "URL Wasn't provided";
    return emptyResult;
  }

  try {
    return await parse(url.href);
  } catch (err) {
    reply.code(500);
    // TODO: for debug purposes, you should remove this on production
    emptyResult["error"] = err.message;
    return emptyResult;
  }
});

// Run the server!
app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
