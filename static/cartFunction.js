// إظهار وإخفاء السلة
document.getElementById("show-cart").addEventListener("click", function () {
  const cart = document.getElementById("shopping-cart");
  const maincontent = document.getElementById("main-container");
  cart.style.display = "block";
  maincontent.style.display = "none";
});
document.getElementById("clear-cart").addEventListener("click", () => {
  if (confirm("هل أنت متأكد من تفريغ السلة؟")) {
      localStorage.removeItem("menuwati_cart");
    document.querySelector(".cart-total .cart-number").textContent = "0";
    document.getElementById("cart-badge").textContent = "0";
  }
});
document.getElementById("hide-cart").addEventListener("click", function () {
  const cart = document.getElementById("shopping-cart");
  const maincontent = document.getElementById("main-container");
  cart.style.display = "none";
  maincontent.style.display = "block";
});

// وظيفة التحكم بالكمية
document.addEventListener("DOMContentLoaded", function () {
  function updateItemTotal(cartItem) {
    const price = parseInt(cartItem.querySelector(".item-cart-price").textContent);
    const qty = parseInt(cartItem.querySelector(".item-qty").textContent);
    cartItem.querySelector(".item-cart-total").textContent = (price * qty).toLocaleString();
  }

  function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".cart-items").forEach((item) => {
      const itemTotal = parseInt(item.querySelector(".item-cart-total").textContent.replace(/,/g, ""));
      total += itemTotal;
    });
    document.querySelector(".cart-total .cart-number").textContent = total.toLocaleString();
  }

  document.querySelectorAll(".cart-items").forEach((cartItem) => {
    const plusBtn = cartItem.querySelector(".plus");
    const minusBtn = cartItem.querySelector(".minus");
    const qtySpan = cartItem.querySelector(".item-qty");

    plusBtn.addEventListener("click", () => {
      let qty = parseInt(qtySpan.textContent);
      qtySpan.textContent = ++qty;
      updateItemTotal(cartItem);
      updateCartTotal();
    });

    minusBtn.addEventListener("click", () => {
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qtySpan.textContent = --qty;
        updateItemTotal(cartItem);
        updateCartTotal();
      }
    });
  });
});

// إرسال الطلب إلى واتساب
document.getElementById("whatsapp-button").addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-number").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const note = document.getElementById("cust-note").value.trim();
  const orderType = document.getElementById("order-type").value;

  if (!name || !phone || !address) {
    alert("يرجى تعبئة الاسم ورقم الهاتف والعنوان.");
    return;
  }

  let message = "";
  message += "📌 *طلب جديد من Menuwati*%0A%0A";
  message += "```%0A";

  document.querySelectorAll(".cart-items").forEach((item) => {
    const itemName = item.querySelector(".item-cart-name").textContent.trim();
    const qty = item.querySelector(".item-qty").textContent.trim();
    const total = item.querySelector(".item-cart-total").textContent.trim();
    message += `${qty} x ${itemName} _____ ${total}د.ع%0A`;
  });

  message += "```%0A";
  message += "———————————%0A";

  const totalPrice = document.querySelector(".cart-total .cart-number").textContent.trim();
  message += `*المجموع: ${totalPrice} د.ع*%0A`;
  message += "================%0A%0A";

  message += "*معلومات الزبون*%0A";
  message += `- الاسم: ${name}%0A`;
  message += `- الرقم: ${phone}%0A`;
  message += `- العنوان: ${address}%0A`;
  message += `- نوع الطلب: ${orderType}%0A`;


  if (note) {
    message += `%0A*ملاحظة الزبون:* ${note}`;
  }

  const restaurantPhone = "9647800280007";
  const whatsappURL = `https://wa.me/${restaurantPhone}?text=${message}`;
  window.open(whatsappURL, "_blank");
  document.getElementById("shopping-cart").style.display = "none";
  document.getElementById("main-container").style.display = "block";
});