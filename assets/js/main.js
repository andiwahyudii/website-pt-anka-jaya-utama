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
