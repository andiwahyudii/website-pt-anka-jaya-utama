const fs = require("fs");
const path = require("path");

const root = process.cwd();
let hasError = false;

function fail(message) {
  console.error(`ERROR: ${message}`);
  hasError = true;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function isExternalOrAnchor(value) {
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("data:")
  );
}

const requiredFiles = [
  "index.html",
  "assets/css/styles.css",
  "assets/js/main.js",
  "src/data/progress.js",
  "vercel.json",
  "README.md",
  "robots.txt",
  "sitemap.xml"
];

requiredFiles.forEach((file) => {
  if (!exists(file)) {
    fail(`File wajib tidak ditemukan: ${file}`);
  }
});

const html = read("index.html");
const css = read("assets/css/styles.css");
const js = read("assets/js/main.js");
const progressDataSource = read("src/data/progress.js");
const vercelConfig = JSON.parse(read("vercel.json"));

if (!html.includes('id="progres-pembangunan"')) {
  fail('Section #progres-pembangunan tidak ditemukan di index.html');
}

if (!html.includes('href="#progres-pembangunan"')) {
  fail('Menu navbar Progres belum mengarah ke #progres-pembangunan');
}

if (!html.includes("Bisa Survei Lokasi")) {
  fail("Badge progres 'Bisa Survei Lokasi' belum ditemukan");
}

if (!html.includes('id="progressFilter"')) {
  fail("Filter tanggal progres belum ditemukan");
}

if (!Array.isArray(vercelConfig.rewrites)) {
  fail("vercel.json harus memiliki rewrites untuk static routing");
} else {
  const hasRootRewrite = vercelConfig.rewrites.some((rewrite) => rewrite.source === "/" && rewrite.destination === "/index.html");
  const hasProgressRewrite = vercelConfig.rewrites.some((rewrite) => rewrite.source === "/progress/:path*" && rewrite.destination === "/public/progress/:path*");

  if (!hasRootRewrite) {
    fail("vercel.json belum mengarahkan / ke /index.html");
  }

  if (!hasProgressRewrite) {
    fail("vercel.json belum mengarahkan /progress/:path* ke /public/progress/:path*");
  }
}

const references = [];

for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const value = match[1];
  if (!isExternalOrAnchor(value) && !value.startsWith("/progress/")) {
    references.push(value);
  }
}

for (const match of css.matchAll(/url\("?([^")]+)"?\)/g)) {
  const value = match[1];
  if (!isExternalOrAnchor(value)) {
    references.push(path.normalize(path.join("assets/css", value)));
  }
}

references.forEach((reference) => {
  const file = reference.split("?")[0];
  if (!exists(file)) {
    fail(`Referensi file tidak ditemukan: ${reference}`);
  }
});

global.window = {};
require(path.join(root, "src/data/progress.js"));

const progressUpdates = global.window.progressUpdates;

if (!Array.isArray(progressUpdates) || !progressUpdates.length) {
  fail("Data progressUpdates harus berupa array dan minimal berisi satu item");
} else {
  progressUpdates.forEach((update, updateIndex) => {
    if (!update.date || !update.displayDate || !update.title || !update.location || !update.status || !update.description) {
      fail(`Data progres index ${updateIndex} belum lengkap`);
    }

    if (!Array.isArray(update.photos) || !update.photos.length) {
      fail(`Data progres ${update.date} belum memiliki foto`);
      return;
    }

    update.photos.forEach((photo, photoIndex) => {
      if (!photo.src || !photo.src.startsWith("/progress/")) {
        fail(`Foto ${photoIndex + 1} pada ${update.date} harus memakai path /progress/...`);
        return;
      }

      if (!photo.alt || !photo.caption) {
        fail(`Foto ${photoIndex + 1} pada ${update.date} harus memiliki alt dan caption`);
      }

      const physicalFile = `public${photo.src}`;
      if (!exists(physicalFile)) {
        fail(`File foto progres tidak ditemukan: ${physicalFile}`);
      }
    });
  });
}

const searchableSource = [html, css, js, progressDataSource, read("README.md"), read("vercel.json"), read("robots.txt"), read("sitemap.xml")].join("\n");

if (/\/Users\/|file:\/\/|Desktop\/|Downloads\//.test(searchableSource)) {
  fail("Source masih mengandung path lokal");
}

if (hasError) {
  process.exit(1);
}

console.log("Static site validation passed.");
