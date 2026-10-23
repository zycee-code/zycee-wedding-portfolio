// ZYCEE website interactions
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  // IMPORTANT: Replace this with your own WhatsApp number, country code included.
  // Example for India: 919876543210 (digits only, no +, spaces, or dashes). Replace the placeholder before publishing.
  const whatsappNumber = "91YOURNUMBER";

  const name = document.getElementById("clientName").value.trim();
  const service = document.getElementById("serviceType").value;
  const details = document.getElementById("projectDetails").value.trim();
  const message = `Hi ZYCEE! My name is ${name}. I'm interested in: ${service}.${details ? ` Project details: ${details}` : ""}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
