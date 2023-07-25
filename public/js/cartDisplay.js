import { productData } from "./productData.js";
import { addItem } from "./cart.js";


// Generate product list
const productList = document.getElementById("product-list");
const generateProducts = () => {
    productData.forEach((data, idx) => {
      const product = document.createElement('div');
      product.classList.add('product');
      product.id = `product-id-${data.id}`;
  
      const image = document.createElement('img');
      image.src = data.img;
      image.alt = 'Product 1';
      image.classList.add('product-image');
      image.addEventListener('click', () => {
        window.location.href = data.page;
      });
      product.appendChild(image);
  
      const title = document.createElement('h3');
      title.classList.add('product-title');
      title.textContent = data.name;
      product.appendChild(title);
  
      const price = document.createElement('p');
      price.classList.add('product-price');
      price.textContent = `$${data.price}`;
      product.appendChild(price);
  
      const rating = document.createElement('div');
      rating.classList.add('product-rating');
  
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.textContent = '★';
        rating.appendChild(star);
      }
  
      product.appendChild(rating);
  
      const addToCartButton = document.createElement('button');
      addToCartButton.classList.add('product-button');
      addToCartButton.innerHTML = `Add to Cart <i class="fa fa-shopping-cart"></i>`;
      addToCartButton.addEventListener('click', () => {
        addItem(idx, data.id);
      });
      product.appendChild(addToCartButton);
  
      productList.appendChild(product);
    });
  };
  
  generateProducts();