
document.addEventListener("DOMContentLoaded", function () {
  const CART_KEY = "menuwati_cart";

  function saveCart(cartArray) {
    localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
  }

  function loadCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".cart-items").forEach(item => {
      const totalText = item.querySelector(".item-cart-total").textContent.replace(/,/g, "");
      total += parseInt(totalText);
    });
    document.querySelector(".cart-total .cart-number").textContent = total.toLocaleString();
  }

  function attachQtyListeners(cartItem, itemData) {
    const plusBtn = cartItem.querySelector(".plus");
    const minusBtn = cartItem.querySelector(".minus");
    const qtySpan = cartItem.querySelector(".item-qty");
    const priceSpan = cartItem.querySelector(".item-cart-price");
    const totalSpan = cartItem.querySelector(".item-cart-total");

    plusBtn.addEventListener("click", () => {
      let qty = ++itemData.qty;
      qtySpan.textContent = qty;
      totalSpan.textContent = (qty * itemData.price).toLocaleString();
      saveToStorageFromDOM();
      updateCartTotal();
    });

    minusBtn.addEventListener("click", () => {
      if (itemData.qty > 1) {
        let qty = --itemData.qty;
        qtySpan.textContent = qty;
        totalSpan.textContent = (qty * itemData.price).toLocaleString();
        saveToStorageFromDOM();
        updateCartTotal();
      }
    });
  }

  function renderCartItem(itemData) {
    const wrapper = document.createElement("div");
    wrapper.className = "cart-items";
    wrapper.innerHTML = `
     <div class="cart-item-header">
  <span class="item-cart-name">${itemData.name}</span>
  <button class="remove-item" title="حذف هذا العنصر">حذف</button>
</div>
      <div class="item-cart-info">
        <div class="item-price">
          <span class="item-cart-price cart-number">${itemData.price}</span>
        </div>
        <div class="item-count">
          <button class="minus">-</button>
          <span class="item-qty cart-number">${itemData.qty}</span>
          <button class="plus">+</button>
        </div>
        <div class="item-total">
          <span class="item-cart-total cart-number">${(itemData.price * itemData.qty).toLocaleString()}</span>
        </div>
      </div>
    `;
    document.querySelector(".item-cart-wrapper").appendChild(wrapper);
    attachQtyListeners(wrapper, itemData);
    wrapper.querySelector(".remove-item").addEventListener("click", () => {
  let cart = loadCart().filter(item => item.name !== itemData.name);
  saveCart(cart);
  renderCart(); // يعيد عرض السلة بعد التحديث
});
  }

  function saveToStorageFromDOM() {
    const items = [];
    document.querySelectorAll(".cart-items").forEach(item => {
      const name = item.querySelector(".item-cart-name").textContent.trim();
      const price = parseInt(item.querySelector(".item-cart-price").textContent.trim());
      const qty = parseInt(item.querySelector(".item-qty").textContent.trim());
      items.push({ name, price, qty });
    });
    saveCart(items);
  }

  function addItemToCart(name, price) {
    let cart = loadCart();
    let existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    renderCart();
  }

  function renderCart() {
    document.querySelector(".item-cart-wrapper").innerHTML = ""; // clear
    let cart = loadCart();
    cart.forEach(item => renderCartItem(item));
    updateCartTotal();
    updateCartBadge()
  }

  // زر الإضافة من المنتجات
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function () {
      const item = this.closest(".item");
      const name = item.querySelector(".item-name h2").textContent.trim();
      const priceText = item.querySelector(".price").textContent.replace(/[^\d]/g, "");
      const price = parseInt(priceText);
      addItemToCart(name, price);
    });
  });

  // عرض السلة من localStorage عند تحميل الصفحة
  renderCart();
  function updateCartBadge() {
  const cart = loadCart();
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById("cart-count").textContent = totalQty;
}
});
