# Website Resmi PT ANKA JAYA UTAMA

Website statis resmi untuk pemasaran perumahan subsidi/MBR PT ANKA JAYA UTAMA, proyek Duta Kayong Permai Sukadana Type 36.

Website ini fokus untuk closing calon konsumen melalui WhatsApp, form minat, cek syarat KPR subsidi, alur khusus Anggota Polri / PNS Polri, download brosur, denah unit, siteplan, galeri proyek, progres pembangunan, dan tombol Google Maps.

Kontak email resmi: `Anka.jayautama@gmail.com`.

## Struktur Project

```text
.
├── index.html
├── package.json
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
│   ├── images
│       ├── denah-unit-rumah.jpg
│       ├── galeri-rumah-1.jpg
│       ├── galeri-rumah-2.jpg
│       ├── galeri-rumah-3.jpg
│       ├── hero-rumah-1.jpg
│       ├── hero-rumah-2.jpg
│       ├── logo-pt-anka-jaya-utama.png
│       ├── poster-duta-kayong-permai.jpg
│       └── siteplan-perumahan.png
│   └── progress
│       └── 2026-04-30
│           ├── progress-01.jpg
│           ├── progress-02.jpg
│           ├── progress-03.jpg
│           ├── progress-04.jpg
│           ├── progress-05.jpg
│           └── progress-06.jpg
├── src
│   └── data
│       └── progress.js
├── scripts
│   └── validate-static-site.js
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
- Section khusus Anggota Polri / PNS Polri berisi ringkasan cepat, alur pendaftaran, checklist dokumen, informasi PUM ASABRI, dan CTA WhatsApp.
- Galeri gambar proyek asli.
- Section Progres Pembangunan dengan data terpisah, grid foto, lightbox, dan CTA WhatsApp.
- Section denah unit dan siteplan yang bisa dibuka dalam tab baru.
- Brosur digital PDF siap diunduh.
- SEO dasar: title, meta description, meta keywords, Open Graph, robots, sitemap, dan structured data.
- Security headers Vercel: HSTS, nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy, dan Content-Security-Policy.

## Section Khusus Anggota Polri / PNS Polri

Section `#alur-polri` menjelaskan:

- Booking unit Rp500.000 sebagai tanda minat awal mengikuti prosedur dan ketersediaan unit.
- Alur konsultasi, pemilihan unit, booking, dokumen KPR subsidi, pengajuan bank, akad, dan serah terima.
- Simulasi bayar efektif 10-11 bulan/tahun sebagai alat bantu perencanaan cashflow, bukan perubahan terhadap akad bank.
- Informasi PUM ASABRI sebagai informasi awal sesuai ketentuan ASABRI, satuan kerja, bendahara, mitra bayar, bank, dan instansi terkait.
- Rekening pribadi pemohon atas nama pemohon dalam administrasi PUM ASABRI.
- Checklist dokumen KPR subsidi dan dokumen awal konsultasi PUM ASABRI.

Semua CTA WhatsApp tetap memakai nomor resmi `6281805344429` dan pesan otomatis dibentuk aman melalui `encodeURIComponent`.

## Update Progres Pembangunan

Data progres berada di:

```text
src/data/progress.js
```

Foto progres berada di folder:

```text
public/progress/
```

Untuk menambah progres tanggal baru:

1. Buat folder baru:

```text
public/progress/2026-05-08/
```

2. Upload foto dengan nama konsisten huruf kecil:

```text
progress-01.jpg
progress-02.jpg
progress-03.jpg
```

3. Tambahkan data baru di bagian paling atas `window.progressUpdates` pada `src/data/progress.js`:

```js
{
  date: "2026-05-08",
  displayDate: "08 Mei 2026",
  title: "Progres Pembangunan Tahap Lanjutan",
  location: "Sukadana, Kabupaten Kayong Utara",
  status: "Update Lapangan",
  description: "Dokumentasi lanjutan pekerjaan unit rumah, akses lingkungan, dan perkembangan kawasan Perumahan Duta Kayong Permai.",
  photos: [
    {
      src: "/progress/2026-05-08/progress-01.jpg",
      caption: "Tampak depan progres pembangunan tahap lanjutan.",
      alt: "Progres pembangunan rumah subsidi Perumahan Duta Kayong Permai tanggal 08 Mei 2026"
    }
  ]
}
```

Data progres otomatis diurutkan dari tanggal terbaru ke tanggal lama. Item terbaru akan mendapat label `Terbaru`.

Untuk mengganti caption foto, ubah nilai `caption`. Untuk mengganti alt text SEO/aksesibilitas, ubah nilai `alt`. Untuk mengganti foto, upload file JPG baru dengan nama file yang sama atau ubah nilai `src` sesuai nama file baru.

## Deploy

Project ini adalah website statis tanpa dependency frontend. Script `npm run build` hanya menjalankan validasi path, data progres, dan konfigurasi Vercel.

Deploy:

- GitHub Pages: upload repository, lalu aktifkan Pages dari branch utama dan folder root.
- Netlify: pilih repository, build command dikosongkan, publish directory `.`.
- Vercel: import repository sebagai static site dengan Application Preset `Other`, Root Directory `./`, Build Command `npm run build` atau dikosongkan, dan Output Directory `.`. Konfigurasi `vercel.json` sudah tersedia, termasuk rewrite agar URL `/progress/...` membaca file dari `public/progress/...`.

Setelah update foto atau data progres:

1. Commit perubahan ke GitHub.
2. Push ke branch utama yang terhubung ke Vercel.
3. Vercel akan melakukan deployment ulang sesuai pengaturan repository.

## Data Produksi

Sebelum publish final, sesuaikan jika diperlukan:

- Domain pada `index.html`, `robots.txt`, dan `sitemap.xml`.
- Email resmi: `Anka.jayautama@gmail.com`.
- Informasi legalitas proyek terbaru.
- Akun media sosial resmi.
