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

if (!html.includes('id="alur-polri"')) {
  fail('Section #alur-polri tidak ditemukan di index.html');
}

if (!html.includes('href="#alur-polri"')) {
  fail('Menu navbar Khusus Polri belum mengarah ke #alur-polri');
}

[
  "Alur Pendaftaran Khusus Anggota Polri / PNS Polri",
  "Booking Unit Rp500.000",
  "Simulasi Bayar Efektif 10-11 Bulan",
  "Informasi PUM ASABRI untuk Pemohon",
  "Rekening Pribadi Pemohon",
  "Checklist Persyaratan KPR Subsidi Anggota Polri / PNS Polri",
  "Daftar Minat Khusus Polri"
].forEach((text) => {
  if (!html.includes(text)) {
    fail(`Konten Polri belum lengkap: ${text}`);
  }
});

[
  'name="kategoriPemohon"',
  'name="pumAsabri"',
  'name="simulasiPolri"',
  'name="minatUnit"',
  'name="catatan"'
].forEach((field) => {
  if (!html.includes(field)) {
    fail(`Field form belum ditemukan: ${field}`);
  }
});

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

const headers = Array.isArray(vercelConfig.headers)
  ? vercelConfig.headers.flatMap((item) => Array.isArray(item.headers) ? item.headers : [])
  : [];
const headerKeys = headers.map((header) => header.key);
[
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy"
].forEach((key) => {
  if (!headerKeys.includes(key)) {
    fail(`Security header belum ditemukan di vercel.json: ${key}`);
  }
});

const csp = headers.find((header) => header.key === "Content-Security-Policy")?.value || "";
[
  "default-src 'self'",
  "upgrade-insecure-requests",
  "frame-src https://www.google.com https://maps.google.com",
  "form-action 'self' https://wa.me https://api.whatsapp.com"
].forEach((rule) => {
  if (!csp.includes(rule)) {
    fail(`CSP belum memuat aturan: ${rule}`);
  }
});

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

if (/\/Users\/|file:\/\/|Desktop\/|Downloads\/|localhost|127\.0\.0\.1/.test(searchableSource)) {
  fail("Source masih mengandung path lokal");
}

const httpMatches = searchableSource.match(/http:\/\/(?!www\.sitemaps\.org\/schemas\/sitemap\/0\.9)/g);
if (httpMatches) {
  fail("Source masih mengandung URL http:// yang dapat memicu mixed content");
}

const prohibitedClaims = [
  /pasti\s+lolos/i,
  /pasti\s+akad/i,
  /dijamin\s+disetujui/i,
  /PUM\s+ASABRI\s+pasti\s+cair/i,
  /tanpa\s+BI\s+Checking/i,
  /wajib\s+membeli/i
];

prohibitedClaims.forEach((pattern) => {
  if (pattern.test(searchableSource)) {
    fail(`Klaim berisiko ditemukan: ${pattern}`);
  }
});

for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  const tag = match[0];
  if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(tag)) {
    fail(`Link target="_blank" belum memakai rel noopener noreferrer: ${tag}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Static site validation passed.");
