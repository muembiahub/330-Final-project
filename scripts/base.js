// -------------------- Global Variables --------------------
let cart = [];
let products = [];

// -------------------- Main Script --------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  const productList = document.getElementById('product-list');

  // -------------------- Fetch Products --------------------
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      displayProducts(productList, products); // show all initially
    })
    .catch(error => console.error('Error fetching products:', error));

  // -------------------- Search Filter --------------------
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(productList, filteredProducts);
  });

  // -------------------- Global Click Handler --------------------
  document.addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('add-to-cart')) addToCart(productId);
    if (e.target.classList.contains('increase')) increaseQuantity(productId);
    if (e.target.classList.contains('decrease')) decreaseQuantity(productId);
  });

  // -------------------- Product Rendering --------------------
  function displayProducts(container, productArray) {
    container.innerHTML = '';

    if (productArray.length === 0) {
      container.innerHTML = '<p>No products found.</p>';
      return;
    }

    productArray.forEach(product => {
      const div = document.createElement('div');
      div.classList.add('product-card');
      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}" width="100">
        <h2>${product.title}</h2>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      container.appendChild(div);
    });
  }

  // -------------------- Cart Logic --------------------
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
      console.log(`Quantity of ${product.title} increased to ${existingItem.quantity}`);
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
      console.log(`Added ${product.title} to cart`);
    }
    renderCart();
  }

  function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity++;
      renderCart();
    }
  }

  function decreaseQuantity(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
      } else {
        cart.splice(itemIndex, 1);
      }
      renderCart();
    }
  }

  // -------------------- Cart Rendering --------------------
  function renderCart() {
    const cartDiv = document.getElementById('card');
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
      cartDiv.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    const ul = document.createElement('ul');

    cart.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        ${item.title} - $${item.price} x ${item.quantity}
        <div>
          <button class="decrease" data-id="${item.id}">–</button>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
      `;
      ul.appendChild(li);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement('p');
    totalDiv.textContent = `Total: $${total.toFixed(2)}`;

    cartDiv.appendChild(ul);
    cartDiv.appendChild(totalDiv);
  }

  // -------------------- Banner Promo --------------------
  function createBanner(className,title, url, buttonText) {
    const banner = document.querySelector(`.${className}`);
    if (!banner) {
      console.warn(`Banner with class "${className}" not found.`);
      return;
    }

    console.log(`Banner "${className}" found, adding content...`);

    banner.innerHTML = "";
    const titleText = document.createElement("h2");
    titleText.textContent = title;
    banner.appendChild(titleText);

    const button = document.createElement("button");
    button.className = "banner-button";
    buttonText = className === "banner-promo" ? "Shop Now" : "Learn More";
    button.textContent = buttonText;
    banner.appendChild(button);
    button.addEventListener("click", () => {
      console.log(`Redirecting to ${url}`);
      window.location.href = url;
    });
  }

  // -------------------- Calls --------------------
  createBanner('winter',' Winter Sale! 20% Off All Items!', 'https://www.example.com/winter-sale');
  createBanner('summer', ' Summer Sale! Buy 1 Get 1 Free!', 'https://www.example.com/summer-sale');
  createBanner('autumn', ' Autumn Clearance! Up to 50% Off!', 'https://www.example.com/autumn-sale');
  createBanner('spring', ' Spring Specials! Fresh Deals Await!', 'https://www.example.com/spring-sale');
  createBanner('holiday', ' Holiday Sale! Save Big on Gifts!', 'https://www.example.com/holiday-sale');
  createBanner('banner-promo', 'Free Shipping on Orders Over $50!', 'https://www.example.com/shipping');
});
