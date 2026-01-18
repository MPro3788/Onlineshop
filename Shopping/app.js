// Dummy-Produkte
const products = [
    { id: 1, name: "Notizbuch", price: 4.99 },
    { id: 2, name: "Kugelschreiber", price: 1.49 },
    { id: 3, name: "Kaffee", price: 5.49 },
    { id: 4, name: "Tasse", price: 7.99 },
    { id: 5, name: "Löffel", price: 3.99 }
  ];
  
  // Warenkorb aus localStorage laden oder leeren Startzustand
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  
  const productListEl = document.getElementById("product-list");
  const cartItemsEl = document.getElementById("cart-items");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");
  
  // Checkout Modal Elemente
  const checkoutModal = document.getElementById("checkout-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const payAmountEl = document.getElementById("pay-amount");
  const payNowBtn = document.getElementById("pay-now-btn");
  const payStatusEl = document.getElementById("pay-status");
  const payNameInput = document.getElementById("pay-name");
  const payEmailInput = document.getElementById("pay-email");
  const payMethodSelect = document.getElementById("pay-method");
  
  // Produkte rendern
  function renderProducts() {
    productListEl.innerHTML = "";
    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <div class="product-title">${p.name}</div>
        <div class="product-price">${p.price.toFixed(2)} €</div>
        <div class="product-actions">
          <input type="number" min="1" value="1" />
          <button class="btn-primary" data-id="${p.id}">Add</button>
        </div>
      `;
      productListEl.appendChild(div);
    });
  }
  
  // Warenkorb im DOM anzeigen
  function renderCart() {
    cartItemsEl.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;
  
    Object.values(cart).forEach((item) => {
      const tr = document.createElement("tr");
      const lineTotal = item.price * item.quantity;
      totalItems += item.quantity;
      totalPrice += lineTotal;
  
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toFixed(2)} €</td>
        <td>
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" />
        </td>
        <td>${lineTotal.toFixed(2)} €</td>
        <td>
          <button class="btn-link" data-remove="${item.id}">X</button>
        </td>
      `;
      cartItemsEl.appendChild(tr);
    });
  
    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = totalPrice.toFixed(2) + " €";
    checkoutBtn.disabled = totalItems === 0;
    saveCart();
  }
  
  // Warenkorb speichern
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // Produkt zum Warenkorb hinzufügen
  function addToCart(id, quantity) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
  
    if (!cart[id]) {
      cart[id] = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 0
      };
    }
    cart[id].quantity += quantity;
    renderCart();
  }
  
  // Menge aktualisieren
  function updateQuantity(id, quantity) {
    if (!cart[id]) return;
    const qty = Math.max(1, quantity);
    cart[id].quantity = qty;
    renderCart();
  }
  
  // Artikel entfernen
  function removeFromCart(id) {
    delete cart[id];
    renderCart();
  }
  
  // Modal öffnen/schließen
  function openCheckoutModal() {
    const totalText = cartTotalEl.textContent.trim();
    payAmountEl.textContent = totalText;
    payStatusEl.textContent = "";
    checkoutModal.classList.remove("hidden");
  }
  
  function closeCheckoutModal() {
    checkoutModal.classList.add("hidden");
  }
  
  // Fake-Payment ausführen
  function performFakePayment() {
    const name = payNameInput.value.trim();
    const email = payEmailInput.value.trim();
    const method = payMethodSelect.value;
  
    if (!name || !email) {
      payStatusEl.textContent = "Bitte Name und E-Mail ausfüllen.";
      return;
    }
  
    payStatusEl.textContent = "Zahlung wird verarbeitet...";
    payNowBtn.disabled = true;
  
    setTimeout(() => {
      payStatusEl.textContent = `Danke, ${name}! Deine Demo-Zahlung per ${method} war erfolgreich.`;
      cart = {};
      renderCart();
      payNowBtn.disabled = false;
    }, 1500);
  }
  
  // Event Listener für Produktliste (Add)
  productListEl.addEventListener("click", (e) => {
    if (e.target.matches("button[data-id]")) {
      const id = parseInt(e.target.getAttribute("data-id"), 10);
      const qtyInput = e.target.parentElement.querySelector("input");
      const qty = parseInt(qtyInput.value, 10) || 1;
      addToCart(id, qty);
    }
  });
  
  // Event Listener für Warenkorb (Menge ändern / entfernen)
  cartItemsEl.addEventListener("input", (e) => {
    if (e.target.matches("input[data-id]")) {
      const id = parseInt(e.target.getAttribute("data-id"), 10);
      const qty = parseInt(e.target.value, 10) || 1;
      updateQuantity(id, qty);
    }
  });
  
  cartItemsEl.addEventListener("click", (e) => {
    if (e.target.matches("button[data-remove]")) {
      const id = parseInt(e.target.getAttribute("data-remove"), 10);
      removeFromCart(id);
    }
  });
  
  // Warenkorb leeren
  clearCartBtn.addEventListener("click", () => {
    cart = {};
    renderCart();
  });
  
  // Checkout Button
  checkoutBtn.addEventListener("click", () => {
    openCheckoutModal();
  });
  
  // Modal schließen
  modalCloseBtn.addEventListener("click", closeCheckoutModal);
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal || e.target.classList.contains("modal-backdrop")) {
      closeCheckoutModal();
    }
  });
  
  // Bezahlen
  payNowBtn.addEventListener("click", performFakePayment);
  
  // Initiales Rendern
  renderProducts();
  renderCart();
  