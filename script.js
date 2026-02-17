const items = [
  { id: 1, name: "Masala Crostini Chaat", desc: "Crisp bites with mint yogurt", price: 220, category: "snacks" },
  { id: 2, name: "Royal Mithai Box", desc: "Assorted handcrafted sweets", price: 690, category: "combos" },
  { id: 3, name: "Saffron Rabri Jar", desc: "Slow reduced milk indulgence", price: 280, category: "sweets" },
  { id: 4, name: "Rose Cold Cocoa", desc: "Chocolate shake with gulkand", price: 190, category: "beverages" },
  { id: 5, name: "Dahi Puri Velvet", desc: "Tangy and creamy signature", price: 210, category: "snacks" },
  { id: 6, name: "Evening Tasting Duo", desc: "Savory + sweet curated combo", price: 420, category: "combos" },
  { id: 7, name: "Pista Kunafa Bite", desc: "Crisp layers with pistachio cream", price: 320, category: "sweets" },
  { id: 8, name: "Kesar Badam Latte", desc: "Warm comfort with saffron aroma", price: 210, category: "beverages" }
];

const cart = new Map();
const menuGrid = document.getElementById("menuGrid");
const filters = document.querySelectorAll(".filter");
const orderItems = document.getElementById("orderItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const emptyState = document.getElementById("emptyState");
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileOrderBtn = document.getElementById("mobileOrderBtn");

const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalAdd = document.getElementById("modalAdd");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

let activeItem = null;

function renderMenu(category = "all") {
  const filtered = category === "all" ? items : items.filter((item) => item.category === category);
  menuGrid.innerHTML = filtered
    .map(
      (item) => `
    <article class="food-card">
      <div class="food-image"></div>
      <div class="food-content">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="food-row">
          <strong>₹${item.price}</strong>
          <div>
            <button class="btn details-btn" data-id="${item.id}">Details</button>
            <button class="btn add-btn" data-id="${item.id}">Add</button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join("");
}

function updateCart() {
  const entries = [...cart.values()];
  emptyState.style.display = entries.length ? "none" : "block";

  orderItems.innerHTML = entries
    .map(
      ({ item, qty }) => `
      <div class="order-item">
        <div class="thumb"></div>
        <div>
          <strong>${item.name}</strong>
          <p>₹${item.price}</p>
        </div>
        <div class="order-actions">
          <button class="stepper" data-step="-1" data-id="${item.id}">-</button>
          <span>${qty}</span>
          <button class="stepper" data-step="1" data-id="${item.id}">+</button>
        </div>
      </div>
    `
    )
    .join("");

  const subtotal = entries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  subtotalEl.textContent = `₹${subtotal}`;
  totalEl.textContent = `₹${subtotal + 90}`;
}

function addToCart(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  const existing = cart.get(id);
  cart.set(id, { item, qty: existing ? existing.qty + 1 : 1 });
  updateCart();
}

menuGrid.addEventListener("click", (event) => {
  const addBtn = event.target.closest(".add-btn");
  const detailsBtn = event.target.closest(".details-btn");

  if (addBtn) {
    addToCart(Number(addBtn.dataset.id));
  }

  if (detailsBtn) {
    const id = Number(detailsBtn.dataset.id);
    activeItem = items.find((item) => item.id === id);
    if (!activeItem) return;
    modalTitle.textContent = activeItem.name;
    modalDesc.textContent = activeItem.desc;
    modalPrice.textContent = `₹${activeItem.price}`;
    modalImage.style.filter = `hue-rotate(${activeItem.id * 22}deg)`;
    modal.showModal();
  }
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.category);
  });
});

orderItems.addEventListener("click", (event) => {
  const stepper = event.target.closest(".stepper");
  if (!stepper) return;
  const id = Number(stepper.dataset.id);
  const current = cart.get(id);
  if (!current) return;

  const nextQty = current.qty + Number(stepper.dataset.step);
  if (nextQty <= 0) cart.delete(id);
  else cart.set(id, { ...current, qty: nextQty });

  updateCart();
});

modalAdd.addEventListener("click", () => {
  if (activeItem) addToCart(activeItem.id);
  modal.close();
});

closeModal.addEventListener("click", () => modal.close());

document.getElementById("goCheckout").addEventListener("click", () => {
  document.getElementById("checkout").scrollIntoView({ behavior: "smooth" });
});

mobileOrderBtn.addEventListener("click", () => {
  document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
});

menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") navLinks.classList.remove("open");
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((section) => observer.observe(section));

renderMenu();
updateCart();
