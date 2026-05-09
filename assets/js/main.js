const siteConfig = {
  whatsappNumber: "6281805344429",
  defaultMessage: "Halo PT ANKA JAYA UTAMA, saya ingin konsultasi rumah subsidi Type 36."
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

function buildWhatsappUrl(message) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message || siteConfig.defaultMessage)}`;
}

document.querySelectorAll("[data-wa]").forEach((link) => {
  link.setAttribute("href", buildWhatsappUrl(link.dataset.message));
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");
});

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const priceInput = document.querySelector("#price");
const downPaymentInput = document.querySelector("#downPayment");
const tenorInput = document.querySelector("#tenor");
const interestInput = document.querySelector("#interest");
const paymentOutput = document.querySelector("#monthlyPayment");
const downPaymentValue = document.querySelector("#downPaymentValue");
const tenorValue = document.querySelector("#tenorValue");

function calculatePayment() {
  if (!priceInput || !downPaymentInput || !tenorInput || !interestInput || !paymentOutput) {
    return;
  }

  const price = Number(priceInput.value) || 0;
  const dpPercent = Number(downPaymentInput.value) || 0;
  const tenorYears = Number(tenorInput.value) || 1;
  const yearlyInterest = Number(interestInput.value) || 0;
  const principal = Math.max(price - (price * dpPercent / 100), 0);
  const months = tenorYears * 12;
  const monthlyRate = yearlyInterest / 100 / 12;
  const payment = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));

  downPaymentValue.textContent = `${dpPercent}%`;
  tenorValue.textContent = `${tenorYears} tahun`;
  paymentOutput.textContent = `${rupiahFormatter.format(payment)} / bulan`;
}

[priceInput, downPaymentInput, tenorInput, interestInput].forEach((input) => {
  if (input) {
    input.addEventListener("input", calculatePayment);
  }
});

calculatePayment();

const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const tanggalSurvei = formData.get("tanggalSurvei");
    const message = [
      "Halo PT ANKA JAYA UTAMA, saya ingin cek syarat KPR subsidi.",
      "",
      `Nama: ${formData.get("nama")}`,
      `WhatsApp: ${formData.get("whatsapp")}`,
      `Domisili: ${formData.get("domisili")}`,
      `Pekerjaan: ${formData.get("pekerjaan")}`,
      `Penghasilan: ${formData.get("penghasilan")}`,
      `Status menikah: ${formData.get("status")}`,
      `Status rumah: ${formData.get("punyaRumah")}`,
      `Rencana survei: ${formData.get("survei")}`,
      tanggalSurvei ? `Tanggal survei: ${tanggalSurvei}` : "Tanggal survei: belum ditentukan",
      "",
      "Mohon dibantu pengecekan awal dan info unit yang tersedia."
    ].join("\n");

    if (formStatus) {
      formStatus.textContent = "Data siap dikirim. WhatsApp akan terbuka di tab baru.";
    }

    window.open(buildWhatsappUrl(message), "_blank", "noopener");
  });
}

const progressContent = document.querySelector("#progressContent");
const progressFilter = document.querySelector("#progressFilter");
const progressLightbox = document.querySelector("#progressLightbox");
const progressLightboxImage = progressLightbox?.querySelector("img");
const progressLightboxCaption = progressLightbox?.querySelector("figcaption");
const progressClose = progressLightbox?.querySelector("[data-lightbox-close]");
const progressPrev = progressLightbox?.querySelector("[data-lightbox-prev]");
const progressNext = progressLightbox?.querySelector("[data-lightbox-next]");
let progressPhotos = [];
let activeProgressPhoto = 0;
let activeProgressDate = "all";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveProgressSrc(src) {
  if (window.location.protocol === "file:" && src?.startsWith("/progress/")) {
    return `public${src}`;
  }

  return src || "";
}

function getSortedProgressUpdates() {
  return Array.isArray(window.progressUpdates)
    ? [...window.progressUpdates].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];
}

function renderProgressFilters(updates) {
  if (!progressFilter || !updates.length) {
    return;
  }

  const buttons = [
    '<button class="is-active" type="button" data-progress-filter="all">Semua Progres</button>',
    ...updates.map((update) => `<button type="button" data-progress-filter="${escapeHtml(update.date)}">${escapeHtml(update.displayDate)}</button>`)
  ].join("");

  progressFilter.innerHTML = buttons;

  progressFilter.querySelectorAll("[data-progress-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeProgressDate = button.dataset.progressFilter || "all";
      progressFilter.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderProgressUpdates();
    });
  });
}

function renderProgressUpdates() {
  if (!progressContent) {
    return;
  }

  const updates = getSortedProgressUpdates();

  if (!updates.length) {
    progressContent.innerHTML = '<p class="progress-placeholder">Foto progres akan segera diperbarui.</p>';
    return;
  }

  progressPhotos = [];

  const visibleUpdates = activeProgressDate === "all"
    ? updates
    : updates.filter((update) => update.date === activeProgressDate);

  const progressCards = visibleUpdates.map((update) => {
    const isLatest = update.date === updates[0].date;
    const updatePhotos = (update.photos || []).map((photo) => {
      const globalIndex = progressPhotos.length;
      const preparedPhoto = {
        ...photo,
        updateDate: update.displayDate,
        index: globalIndex,
        displaySrc: resolveProgressSrc(photo.src)
      };
      progressPhotos.push(preparedPhoto);
      return preparedPhoto;
    });

    const photoButtons = updatePhotos.map((photo, photoIndex) => `
      <button class="progress-photo" type="button" data-progress-index="${photo.index}">
        <img src="${escapeHtml(photo.displaySrc)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" width="1012" height="1800">
        <span>Foto ${String(photoIndex + 1).padStart(2, "0")} - ${escapeHtml(photo.caption || "Dokumentasi lapangan")}</span>
      </button>
    `).join("");

    return `
      <article class="progress-card">
        <div class="progress-card-header">
          <div>
            <div class="progress-meta">
              <span>${escapeHtml(update.displayDate)}</span>
              <span>${escapeHtml(update.status)}</span>
            </div>
            ${isLatest ? '<span class="progress-label">Terbaru</span>' : ""}
            <h3>${escapeHtml(update.title)}</h3>
            <p class="progress-location">Dokumentasi lapangan, ${escapeHtml(update.location)}.</p>
            <p class="progress-description">${escapeHtml(update.description)}</p>
            <button class="progress-view-button" type="button" data-progress-index="${updatePhotos[0]?.index ?? 0}" ${updatePhotos.length ? "" : "disabled"}>Lihat Foto Dokumentasi</button>
          </div>
          <div class="progress-count" aria-label="${updatePhotos.length} foto progres pembangunan">
            <strong>${updatePhotos.length}</strong>
            <span>Foto Dokumentasi</span>
          </div>
        </div>
        <div class="progress-grid">
          ${photoButtons || '<p class="progress-placeholder">Foto progres akan segera diperbarui.</p>'}
        </div>
        <p class="progress-note">Informasi progres mengikuti kondisi pekerjaan di lapangan dan dapat berubah sesuai perkembangan proyek. Untuk informasi terbaru, calon konsumen dapat menghubungi tim marketing PT ANKA JAYA UTAMA.</p>
      </article>
    `;
  }).join("");

  progressContent.innerHTML = progressCards || '<p class="progress-placeholder">Foto progres akan segera diperbarui.</p>';

  progressContent.querySelectorAll("[data-progress-index]").forEach((button) => {
    button.addEventListener("click", () => {
      openProgressLightbox(Number(button.dataset.progressIndex));
    });
  });

  progressContent.querySelectorAll(".progress-photo img").forEach((image) => {
    image.addEventListener("error", () => {
      const button = image.closest(".progress-photo");
      button?.classList.add("is-missing");
      button?.setAttribute("disabled", "");
      image.remove();
    });
  });
}

renderProgressFilters(getSortedProgressUpdates());

function setProgressLightboxPhoto(index) {
  if (!progressLightboxImage || !progressLightboxCaption || !progressPhotos.length) {
    return;
  }

  activeProgressPhoto = (index + progressPhotos.length) % progressPhotos.length;
  const photo = progressPhotos[activeProgressPhoto];
  progressLightboxImage.src = photo.displaySrc;
  progressLightboxImage.alt = photo.alt || "";
  progressLightboxCaption.textContent = photo.caption || photo.alt || "";
}

function openProgressLightbox(index) {
  if (!progressLightbox || !progressPhotos.length) {
    return;
  }

  setProgressLightboxPhoto(index);
  progressLightbox.classList.add("is-open");
  progressLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  progressClose?.focus();
}

function closeProgressLightbox() {
  if (!progressLightbox) {
    return;
  }

  progressLightbox.classList.remove("is-open");
  progressLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

progressClose?.addEventListener("click", closeProgressLightbox);
progressPrev?.addEventListener("click", () => setProgressLightboxPhoto(activeProgressPhoto - 1));
progressNext?.addEventListener("click", () => setProgressLightboxPhoto(activeProgressPhoto + 1));
progressLightbox?.addEventListener("click", (event) => {
  if (event.target === progressLightbox) {
    closeProgressLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!progressLightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeProgressLightbox();
  }

  if (event.key === "ArrowLeft") {
    setProgressLightboxPhoto(activeProgressPhoto - 1);
  }

  if (event.key === "ArrowRight") {
    setProgressLightboxPhoto(activeProgressPhoto + 1);
  }
});

renderProgressUpdates();
