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

// Do not allow selecting a function date in the past.
const dateInput = document.getElementById("functionDate");
const localToday = new Date();
const localDateString = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, "0")}-${String(localToday.getDate()).padStart(2, "0")}`;
dateInput.min = localDateString;

// Send the selected date and enquiry details to the business WhatsApp.
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const whatsappNumber = "919496134192"; // India country code + number, digits only
  const name = document.getElementById("clientName").value.trim();
  const service = document.getElementById("serviceType").value;
  const functionDate = document.getElementById("functionDate").value;
  const details = document.getElementById("projectDetails").value.trim();
  const readableDate = new Date(`${functionDate}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const message = `Hi ZYCEE! My name is ${name}. I need: ${service}. Function date: ${readableDate}.${details ? ` Project details: ${details}` : ""}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// Fade content in as it enters view while scrolling.
const revealTargets = document.querySelectorAll(".intro, .section-heading, .work-card, .service-row, .quote-band, .contact-copy, .contact-form, .footer");
revealTargets.forEach((element) => element.classList.add("scroll-reveal"));
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

// Subtle floating orange particles. The canvas never blocks taps or scrolling.
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
function resizeParticleCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = Math.floor(canvasWidth * dpr);
  canvas.height = Math.floor(canvasHeight * dpr);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(34, Math.max(14, Math.floor(canvasWidth / 22)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    r: 0.7 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -0.12 - Math.random() * 0.3,
    alpha: 0.12 + Math.random() * 0.26,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((p) => {
    p.phase += 0.008;
    if (!reduceMotion) {
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.y += p.vy;
      if (p.y < -8) { p.y = canvasHeight + 8; p.x = Math.random() * canvasWidth; }
      if (p.x < -8) p.x = canvasWidth + 8;
      if (p.x > canvasWidth + 8) p.x = -8;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 137, 48, ${p.alpha})`;
    ctx.shadowColor = "rgba(255, 116, 26, 0.22)";
    ctx.shadowBlur = 7;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  if (!reduceMotion) requestAnimationFrame(drawParticles);
}
resizeParticleCanvas();
drawParticles();
window.addEventListener("resize", resizeParticleCanvas);
