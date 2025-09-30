document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // CART FUNCTIONALITY
    // ==========================
    const cartIcon = document.querySelector(".cart-icon");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");
    const cartContent = document.querySelector(".cart-content");
    const totalPriceElement = document.querySelector(".total-price");
    const addCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCountBadge = document.createElement("span");
    cartCountBadge.classList.add("cart-count-badge");
    if (cartIcon) {
        cartIcon.appendChild(cartCountBadge);
    }

    // ==========================
    // FAVORITES FUNCTIONALITY
    // ==========================
    const favIcon = document.querySelector(".fav-icon");
    const favorites = document.querySelector(".favorites");
    const favoritesClose = document.querySelector("#favorites-close");
    const favoritesContent = document.querySelector(".favorites-content");
    const addFavButtons = document.querySelectorAll(".add-to-favourites");
    const favCountBadge = document.createElement("span");
    favCountBadge.classList.add("fav-count-badge");
    if (favIcon) {
        favIcon.appendChild(favCountBadge);
    }
    
    // ==========================
    // ORDERED FUNCTIONALITY
    // ==========================
    const orderedIcon = document.querySelector(".ordered-icon");
    const ordered = document.querySelector(".ordered");
    const orderedClose = document.querySelector("#ordered-close");
    const orderedContent = document.querySelector(".ordered-content");
    const orderedCountBadge = document.querySelector(".ordered-count-badge"); // This badge should exist in your HTML

    // ==========================
    // EVENT LISTENERS
    // ==========================
    // Open/close cart
    if (cartIcon) {
        cartIcon.addEventListener("click", () => cart.classList.add("active"));
    }
    if (cartClose) {
        cartClose.addEventListener("click", () => cart.classList.remove("active"));
    }

    // Open/close favorites sidebar
    if (favIcon) {
        favIcon.addEventListener("click", () => favorites.classList.add("active"));
    }
    if (favoritesClose) {
        favoritesClose.addEventListener("click", () => favorites.classList.remove("active"));
    }

    // Open/close ordered items sidebar
    if (orderedIcon) {
        orderedIcon.addEventListener("click", () => ordered.classList.add("active"));
    }
    if (orderedClose) {
        orderedClose.addEventListener("click", () => ordered.classList.remove("active"));
    }

    // Handle Add to Cart buttons
    addCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            addToCart(button);
            button.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Added to cart!';
            button.style.color = "#fff";
            triggerShake(cartIcon);
        });
    });

    // Handle Add to Favorites buttons
    addFavButtons.forEach(button => {
        button.addEventListener("click", () => {
            addToFavorites(button);
        });
    });

    // Handle remove from cart, favorites
    document.addEventListener("click", event => {
        // Remove from Cart
        if (event.target.classList.contains("fa-trash")) {
            const cartBox = event.target.closest(".cart-box");
            const productTitle = cartBox.querySelector(".cart-product-title").textContent;
            
            cartBox.remove();
            let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = savedCart.filter(item => item.name !== productTitle);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            updateCartCount();
            updateTotal();

            document.querySelectorAll(".add-to-cart").forEach(btn => {
                if (btn.dataset.name === productTitle) {
                    btn.textContent = "Add to cart";
                    btn.style.color = "";
                }
            });
        }
        
        // Remove from Favorites
       
       document.addEventListener("click", function (event) {
    const removeBtn = event.target.closest(".favorites-remove");
    if (removeBtn) {
        const favBox = removeBtn.closest(".favorites-box");
        const productTitle = favBox.querySelector(".favorites-product-title").textContent;

        favBox.remove();

        // update localStorage
        let savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedFavs = savedFavs.filter(item => item.name !== productTitle);
        localStorage.setItem("favorites", JSON.stringify(updatedFavs));

        updateFavCount();

        // restore original "add to favourites" button
        document.querySelectorAll(".add-to-favourites").forEach(btn => {
            if (btn.dataset.name === productTitle) {
                btn.innerHTML = `
                    <i id="Icon" class="fa-regular fa-heart"></i>&nbsp;&nbsp;&nbsp;
                    <span id="favText">favorites</span>
                `;
                btn.style.color = "";
            }
        });
    }
});



        // Increment / decrement events
        if (event.target.classList.contains("increment") || event.target.classList.contains("decrement")) {
            const cartBox = event.target.closest(".cart-box");
            const productTitle = cartBox.querySelector(".cart-product-title").textContent;
            const qtyElement = cartBox.querySelector(".number");

            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cartItems.find(i => i.name === productTitle);
            
            if (item) {
                if (event.target.classList.contains("increment")) {
                    item.qty++;
                } else if (event.target.classList.contains("decrement") && item.qty > 1) {
                    item.qty--;
                }
                localStorage.setItem('cart', JSON.stringify(cartItems));
                qtyElement.textContent = item.qty;
                updateTotal();
                updateCartCount();
            }
        }
    });

    // New "Send to WhatsApp" button functionality
    const sendWhatsappBtn = document.querySelector("#send-whatsapp-btn");
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener("click", () => {
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
            if (cartItems.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Move items from cart to ordered
            let savedOrdered = JSON.parse(localStorage.getItem("ordered")) || [];
            savedOrdered = savedOrdered.concat(cartItems);
            localStorage.setItem("ordered", JSON.stringify(savedOrdered));
            
            // Clear the cart
            localStorage.removeItem("cart");

            // Update UI
            loadOrdered();
            loadCart();
            cart.classList.remove("active");
        });
    }

    // ==========================
    // FUNCTIONS
    // ==========================
    // Add item to cart logic
    function addToCart(button) {
        const productImgSrc = button.dataset.img;
        const productTitle = button.dataset.name;
        const productPrice = button.dataset.price;

        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cartItems.find(item => item.name === productTitle);

        if (existingItem) {
            existingItem.qty++;
        } else {
            cartItems.push({ name: productTitle, price: productPrice, img: productImgSrc, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCart(); // Rerender cart items
    }

    // Add item to favorites logic
    function addToFavorites(button) {
        const productImgSrc = button.dataset.img;
        const productTitle = button.dataset.name;
        const productPrice = button.dataset.price;
        
        let favoritesItems = JSON.parse(localStorage.getItem("favorites")) || [];
        const existingItem = favoritesItems.find(item => item.name === productTitle);

        if (existingItem) {
            alert("This item is already in your favorites!");
        } else {
            favoritesItems.push({ name: productTitle, price: productPrice, img: productImgSrc });
            localStorage.setItem("favorites", JSON.stringify(favoritesItems));
            loadFavorites();
            btn.innerHTML = `
                        <i id="Icon" class="fa-solid fa-heart" style="color: black;"></i>&nbsp;&nbsp;&nbsp;
                        <span id="favText" style="color: black;">Added to favourites</span>
                        `;
            ;
            triggerShake(favIcon);
        }
    }

    // Update total price
    function updateTotal() {
        let total = 0;
        const cartBoxes = document.querySelectorAll(".cart-box");
        cartBoxes.forEach(cartBox => {
            const price = parseFloat(cartBox.querySelector(".cart-price").dataset.price);
            const qty = parseInt(cartBox.querySelector(".number").textContent);
            total += price * qty;
        });
        totalPriceElement.textContent = `Ksh ${total}`;
    }

    // Update cart badge
    function updateCartCount() {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = 0;
        savedCart.forEach(item => {
            totalItems += item.qty;
        });
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? "block" : "none";
    }

    // Update favorites badge
    function updateFavCount() {
        const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        favCountBadge.textContent = savedFavs.length;
        favCountBadge.style.display = savedFavs.length > 0 ? "block" : "none";
    }

    // Update ordered badge
    function updateOrderedCount() {
        const savedOrdered = JSON.parse(localStorage.getItem("ordered")) || [];
        orderedCountBadge.textContent = savedOrdered.length;
        // Make sure you don't have a CSS rule that hides it on load.
        // It will be hidden if savedOrdered.length is 0.
        orderedCountBadge.style.display = savedOrdered.length > 0 ? "block" : "none";
        triggerShake(orderedIcon);
    }
    
    // Render Functions
    function loadCart() {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        cartContent.innerHTML = "";
        
        savedCart.forEach(item => {
            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");
            cartBox.innerHTML = `
                <img src="${item.img}" alt="cart-img">
                <div class="cart-detail">
                    <h2 class="cart-product-title">${item.name}</h2>
                    <span class="cart-price" data-price="${item.price}">Ksh ${item.price}</span>
                    <div class="cart-quantity">
                        <button class="decrement">-</button>
                        <span class="number">${item.qty}</span>
                        <button class="increment">+</button>
                    </div> 
                </div> 
                <i class="fa-solid fa-trash"></i>
            `;
            cartContent.appendChild(cartBox);
            
            document.querySelectorAll(".add-to-cart").forEach(btn => {
                if (btn.dataset.name === item.name) {
                    btn.textContent = "Added to cart!";
                    btn.style.color = "#fff";
                }
            });
        });
        updateCartCount();
        updateTotal();
    }
    
    function loadFavorites() {
        const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        favoritesContent.innerHTML = "";
        
        savedFavs.forEach(item => {
            const favBox = document.createElement("div");
            favBox.classList.add("favorites-box");
            favBox.innerHTML = `
                <img src="${item.img}" alt="favorites-img">
                <div class="favorites-detail">
                    <h2 class="favorites-product-title">${item.name}</h2>
                    <span class="favorites-price" data-price="${item.price}">Ksh ${item.price}</span>
                </div>
                <i class="fa-solid fa-trash favorites-remove"></i>
            `;
            favoritesContent.appendChild(favBox);
            
            document.querySelectorAll(".add-to-favourites").forEach(btn => {
                if (btn.dataset.name === item.name) {
                   btn.innerHTML = `
                        <i id="Icon" class="fa-solid fa-heart" style="color: black;"></i>&nbsp;&nbsp;&nbsp;
                        <span id="favText" style="color: black;">Added to favourites</span>
                        `;
                    btn.style.color = "black";
                }
            });
        });
        updateFavCount();
    }

    function loadOrdered() {
        const savedOrdered = JSON.parse(localStorage.getItem("ordered")) || [];
        orderedContent.innerHTML = "";
        
        savedOrdered.forEach(item => {
            const orderedBox = document.createElement("div");
            orderedBox.classList.add("ordered-box");
            orderedBox.innerHTML = `
                <img src="${item.img}" alt="ordered-img">
                <div class="ordered-detail">
                    <h2 class="ordered-product-title">${item.name}</h2>
                    <span class="ordered-price" data-price="${item.price}">Ksh ${item.price}</span>
                    <div class="ordered-quantity">
                        <span class="number">${item.qty}</span>
                    </div>
                </div>
            `;
            orderedContent.appendChild(orderedBox);
        });
        updateOrderedCount();
    }
    
    // Shared Functions
    function triggerShake(element) {
        element.classList.add("shake");
        element.addEventListener("animationend", () => {
            element.classList.remove("shake");
        }, { once: true });
    }

    // Initial load on page start
    loadCart();
    loadFavorites();
    loadOrdered();
});

 document.querySelectorAll(".scroll-wrapper").forEach(wrapper => {
      const grid = wrapper.querySelector(".sale-grid");
      const leftBtn = wrapper.querySelector(".scroll-btn.left");
      const rightBtn = wrapper.querySelector(".scroll-btn.right");

      let currentIndex = 0;

      function getItemWidth() {
        const item = grid.querySelector(".sale-item");
        if (!item) return grid.clientWidth;
        const style = window.getComputedStyle(item);
        const gap = parseInt(style.marginRight || 0) || 48;
        return item.offsetWidth + gap;
      }

      function updateArrows() {
        const totalItems = grid.querySelectorAll(".sale-item").length;
        const itemsPerPage = Math.floor(grid.clientWidth / getItemWidth());

        if (currentIndex <= 0) {
          leftBtn.classList.add("hidden");
        } else {
          leftBtn.classList.remove("hidden");
        }

        if (currentIndex >= totalItems - itemsPerPage) {
          rightBtn.classList.add("hidden");
        } else {
          rightBtn.classList.remove("hidden");
        }
      }

      function smoothScrollTo(index) {
        const target = index * getItemWidth();
        let start = grid.scrollLeft;
        let end = target;
        let duration = 600;
        let startTime = null;

        function animateScroll(timestamp) {
          if (!startTime) startTime = timestamp;
          let progress = Math.min((timestamp - startTime) / duration, 1);
          grid.scrollLeft = start + (end - start) * easeInOutQuad(progress);
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        }
        function easeInOutQuad(t) {
          return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        }
        requestAnimationFrame(animateScroll);
      }

      rightBtn.addEventListener("click", () => {
        currentIndex++;
        smoothScrollTo(currentIndex);
        updateArrows();
      });

      leftBtn.addEventListener("click", () => {
        currentIndex--;
        smoothScrollTo(currentIndex);
        updateArrows();
      });

      // init
      updateArrows();
      window.addEventListener("resize", updateArrows);
    });
  
    document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".cart-icon");
  const cart = document.querySelector(".cart");
  const cartClose = document.querySelector("#cart-close");
  const overlay = document.querySelector(".overlay");

  function enableCartForMobile() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (cartIcon && cart && overlay) {
        // open
        cartIcon.addEventListener("click", () => {
          cart.classList.add("active");
          overlay.classList.add("active");
        });

        // close
        cartClose.addEventListener("click", () => {
          cart.classList.remove("active");
          overlay.classList.remove("active");
        });

        overlay.addEventListener("click", () => {
          cart.classList.remove("active");
          overlay.classList.remove("active");
        });
      }
    }
  }

  // Run on load
  enableCartForMobile();

  // Also run again if screen resizes
  window.addEventListener("resize", enableCartForMobile);
});


