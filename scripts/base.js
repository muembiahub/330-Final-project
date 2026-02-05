// -------------------- Global State --------------------
let cart = [];
let products = [];

// -------------------- Product Service --------------------
const ProductService = {
  async fetchProducts() {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      products = await res.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
};

// -------------------- UI Rendering --------------------
const UI = {
  displayProducts(container, productArray) {
    container.innerHTML = '';

    if (productArray.length === 0) {
      container.innerHTML = '<p>No products found.</p>';
      return;
    }

    productArray.forEach(product => {
      const div = document.createElement('div');
      div.classList.add('product-card');
      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      container.appendChild(div);
    });
  },

  renderCart() {
    const cartDiv = document.getElementById('cart-container'); 
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
        <span>${item.title} - $${item.price} x ${item.quantity}</span>
        <span>Subtotal: $${(item.price * item.quantity).toFixed(2)}</span>
        <div>
          <button class="decrease" data-id="${item.id}" aria-label="Decrease quantity">–</button>
          <button class="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      `;
      ul.appendChild(li);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement('p');
    totalDiv.textContent = `Total: $${total.toFixed(2)}`;

    const payButton = document.createElement('button');
    payButton.textContent = 'Pay Now';
    payButton.classList.add('pay-button');
    payButton.addEventListener('click', () => {
      alert(`Proceeding to payment. Total: $${total.toFixed(2)}`);
      // Or redirect to checkout
      // window.location.href = '/checkout?total=' + total.toFixed(2);
    });

    cartDiv.appendChild(ul);
    cartDiv.appendChild(totalDiv);
    cartDiv.appendChild(payButton);
  },

  updateCartCount() {
    const countSpan = document.querySelector('.cart-count');
    if (!countSpan) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.textContent = totalItems;
  },

  createBanner(className, title, text, url) {
    const banner = document.querySelector(`.${className}`);
    if (!banner) return;

    banner.innerHTML = `
      <h2>${title}</h2>
      <p>${text}</p>
      <button class="banner-button">
        ${["banner-promo", "banner-promo-2"].includes(className) ? "Shop Now" : "Learn More"}
      </button>
    `;

    banner.querySelector("button").addEventListener("click", () => {
      window.location.href = url;
    });
  }
};

// -------------------- Cart Logic --------------------
const Cart = {
  add(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    }
    UI.renderCart();
    UI.updateCartCount();
  },

  increase(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity++;
      UI.renderCart();
      UI.updateCartCount();
    }
  },

  decrease(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
      } else {
        cart.splice(itemIndex, 1);
      }
      UI.renderCart();
      UI.updateCartCount();
    }
  }
};

// -------------------- Search Logic --------------------
const Search = {
  filter(term) {
    const searchTerm = term.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
    const productList = document.getElementById('product-list');
    UI.displayProducts(productList, filteredProducts);
  }
};

// -------------------- Initialization --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.querySelector('.search-box input');
  const productList = document.getElementById('product-list');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const cartButton = document.querySelector('.cart-button');

  let currentIndex = 0;
  const limit = 4;

  // Fetch and display products
  const data = await ProductService.fetchProducts();
  UI.displayProducts(productList, data.slice(currentIndex, currentIndex + limit));

  // Pagination
  nextPageBtn.addEventListener('click', () => {
    if (currentIndex + limit < products.length) {
      currentIndex += limit;
      UI.displayProducts(productList, products.slice(currentIndex, currentIndex + limit));
    }
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentIndex - limit >= 0) {
      currentIndex -= limit;
      UI.displayProducts(productList, products.slice(currentIndex, currentIndex + limit));
    }
  });

  // Search
  searchInput.addEventListener('input', () => Search.filter(searchInput.value));

  // Global click handler
  document.addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    if (e.target.classList.contains('add-to-cart')) Cart.add(productId);
    if (e.target.classList.contains('increase')) Cart.increase(productId);
    if (e.target.classList.contains('decrease')) Cart.decrease(productId);
  });

  // Cart button toggle
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      UI.renderCart();
      document.getElementById('cart-container').classList.toggle('visible');
    });
  }

  // Banners
  const banners = [
    {class: 'banner-promo', title: 'Free Shipping', text: 'Enjoy free shipping on orders over $50', url: 'https://www.example.com/free-shipping'},
    {class: 'banner-winter', title: 'Winter Sale', text: 'Save 20% on winter essentials!', url: 'https://www.example.com/winter-sale'},
    {class : 'banner-summer', title: 'Summer Sale', text: 'Hot deals up to 50% off!', url: 'https://www.example.com/summer-sale'},
    {class: 'banner-autumn', title: 'Autumn Clearout', text: 'Clear out your autumn wardrobe with up to 70% off', url: 'https://www.example.com/autumn-clearout'},
    {class: 'banner-holiday', title: 'Holiday Sale', text: 'Shop our holiday collection and save up to 30% off', url: 'https://www.example.com/holiday-sale'},
    {class: 'banner-new-arrivals', title: 'New Arrivals', text: 'Explore our latest arrivals and find your next favorite piece', url: 'https://www.example.com/new-arrivals'},
    {class: 'banner-sale', title: 'Sale', text: 'Shop our sale section and find great deals on our best-selling items', url: 'https://www.example.com/sale'},
    {class: 'banner-promo-2', title: 'Spring Sale', text: 'Spring into savings with up to 40% off our seasonal collection', url: 'https://www.example.com/spring-sale'},
  ];

  banners.forEach(b => UI.createBanner(b.class, b.title, b.text, b.url));
});
