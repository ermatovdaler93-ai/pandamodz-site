// PANDA MODZ — storefront interactions
const searchInput = document.getElementById("productSearch");
const productCards = [...document.querySelectorAll(".product-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const emptyState = document.getElementById("emptyState");
let selectedCategory = "all";

function updateProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesText = (card.dataset.search || "").includes(query) ||
      card.textContent.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" ||
      card.dataset.category === selectedCategory;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visibleCount++;
  });

  emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", updateProducts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.filter;
    updateProducts();
  });
});

document.querySelectorAll("[data-coming-soon]").forEach((button) => {
  button.addEventListener("click", () => {
    alert("Информация о продукте и ссылка на загрузку появятся после публикации релиза.");
  });
});

// Key checking is intentionally a placeholder until a secure backend is connected.
document.getElementById("keyForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("keyMessage");
  const key = document.getElementById("licenseKey").value.trim();
  message.textContent = key
    ? "Серверная проверка ключа пока не подключена. Это поле сейчас работает только как демонстрация."
    : "Введи ключ.";
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
menuToggle.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Snowfall canvas
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let flakes = [];
let width = 0;
let height = 0;

function resizeSnow() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(100, Math.max(35, Math.floor(width / 9)));
  flakes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 0.8 + 0.35,
    drift: Math.random() * 0.5 - 0.25,
    alpha: Math.random() * 0.55 + 0.2
  }));
}

function drawSnow() {
  ctx.clearRect(0, 0, width, height);
  flakes.forEach((flake) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(224, 207, 255, ${flake.alpha})`;
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();
    flake.y += flake.speed;
    flake.x += flake.drift;
    if (flake.y > height + 5) {
      flake.y = -5;
      flake.x = Math.random() * width;
    }
    if (flake.x > width + 5) flake.x = -5;
    if (flake.x < -5) flake.x = width + 5;
  });
  requestAnimationFrame(drawSnow);
}

window.addEventListener("resize", resizeSnow, { passive: true });
resizeSnow();
drawSnow();
document.getElementById("year").textContent = new Date().getFullYear();
