# Website Resmi PT ANKA JAYA UTAMA

Website statis resmi untuk pemasaran perumahan subsidi/MBR PT ANKA JAYA UTAMA, proyek Duta Kayong Permai Sukadana Type 36.

Website ini fokus untuk closing calon konsumen melalui WhatsApp, form minat, cek syarat KPR subsidi, download brosur, denah unit, siteplan, galeri proyek, dan tombol Google Maps.

Kontak email resmi: `Anka.jayautama@gmail.com`.

## Struktur Project

```text
.
├── index.html
├── assets
│   ├── brosur-pt-anka-jaya-utama.html
│   ├── brosur-pt-anka-jaya-utama.pdf
│   ├── css
│   │   └── styles.css
│   └── js
│       └── main.js
├── public
│   ├── icons
│   │   ├── apple-touch-icon.png
│   │   └── favicon.png
│   └── images
│       ├── denah-unit-rumah.jpg
│       ├── galeri-rumah-1.jpg
│       ├── galeri-rumah-2.jpg
│       ├── galeri-rumah-3.jpg
│       ├── hero-rumah-1.jpg
│       ├── hero-rumah-2.jpg
│       ├── logo-pt-anka-jaya-utama.png
│       ├── poster-duta-kayong-permai.jpg
│       └── siteplan-perumahan.png
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── vercel.json
└── .nojekyll
```

## Fitur Utama

- Landing page modern dan responsif untuk desktop dan mobile.
- CTA WhatsApp aktif ke `6281805344429`.
- Tombol Google Maps aktif untuk lokasi proyek.
- Form cek syarat KPR yang membuka WhatsApp dengan format pesan otomatis.
- Galeri gambar proyek asli.
- Section denah unit dan siteplan yang bisa dibuka dalam tab baru.
- Brosur digital PDF siap diunduh.
- SEO dasar: title, meta description, meta keywords, Open Graph, robots, sitemap, dan structured data.

## Deploy

Project ini adalah website statis tanpa proses build, sehingga siap di-deploy ke:

- GitHub Pages: upload repository, lalu aktifkan Pages dari branch utama dan folder root.
- Netlify: pilih repository, build command dikosongkan, publish directory `.`.
- Vercel: import repository sebagai static site. Konfigurasi `vercel.json` sudah tersedia.

## Data Produksi

Sebelum publish final, sesuaikan jika diperlukan:

- Domain pada `index.html`, `robots.txt`, dan `sitemap.xml`.
- Email resmi: `Anka.jayautama@gmail.com`.
- Informasi legalitas proyek terbaru.
- Akun media sosial resmi.
