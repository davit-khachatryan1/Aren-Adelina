import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const ssrOutDir = resolve(rootDir, ".prerender");
const distHtmlPaths = [
  resolve(rootDir, "dist/index.html"),
  resolve(rootDir, "dist/share.html"),
];

const findServerEntry = (directory) => {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      const nested = findServerEntry(fullPath);
      if (nested) {
        return nested;
      }
      continue;
    }

    if (fullPath.endsWith(".js") || fullPath.endsWith(".mjs")) {
      return fullPath;
    }
  }

  return null;
};

const serverEntryPath = findServerEntry(ssrOutDir);

if (!serverEntryPath) {
  throw new Error("Unable to find the built SSR entry in .prerender");
}

const { render } = await import(pathToFileURL(serverEntryPath).href);

if (typeof render !== "function") {
  throw new Error("SSR entry does not export a render() function");
}

const appHtml = render();

for (const distHtmlPath of distHtmlPaths) {
  const html = readFileSync(distHtmlPath, "utf8");
  const prerenderedHtml = html.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  writeFileSync(distHtmlPath, prerenderedHtml);
}

rmSync(ssrOutDir, { recursive: true, force: true });
