
import { productData } from "./productData.js";
import { incrementQty, decrementQty,updateCart, addItem } from "./cart.js";

let cart_data = JSON.parse(localStorage.getItem("cart_data")) || [];





function generateProductDetails() {
    const productDetails = document.querySelector('#productDetails');
  
    const sPImgDiv = document.createElement('div');
    sPImgDiv.classList.add('sP-img');

    const mainImg = document.createElement('img');
    mainImg.src = `${productData[3].img}`;
    mainImg.id = 'mainImg';
    mainImg.style.width = "100%";
    mainImg.alt = 'nuden poundo 5pounds';
    sPImgDiv.appendChild(mainImg);
    
  
    const imgGroupingDiv = document.createElement('div');
    imgGroupingDiv.classList.add('img-grouping');
  
    const imgByColDivs = [];
  
    const imgSrcs = [
      `${productData[3].img}`,
      'images/NURIFACT.png',
      'images/HOWMAKE.png',
      'images/BENEFIT.png'
    ];
  
    imgSrcs.forEach(src => {
      const imgByColDiv = document.createElement('div');
      imgByColDiv.classList.add('img-by-col');
  
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('diff-view');
      img.width = '100%';
      img.alt = 'nuden poundo 5pounds view';
      imgByColDiv.appendChild(img);
  
      imgByColDivs.push(imgByColDiv);
    });
  
    imgByColDivs.forEach(div => {
      imgGroupingDiv.appendChild(div);
    });
  
    sPImgDiv.appendChild(imgGroupingDiv);
    productDetails.appendChild(sPImgDiv);
  
    const singleProductDetailsDiv = document.createElement('div');
    singleProductDetailsDiv.classList.add('singleProductDetails');
  
    const productName = document.createElement('h4');
    productName.textContent = `${productData[3].name}`;
    singleProductDetailsDiv.appendChild(productName);
  
    const productPrice = document.createElement('h2');
    productPrice.textContent = `$${productData[3].price}`;
    singleProductDetailsDiv.appendChild(productPrice);
  

  
    const quantityDiv = document.createElement('div');
    quantityDiv.innerHTML = `
      <div class="qty2">
        <span id="decrement-btn" data-id="${productData[3].id}">-</span>
        <strong id="s_price">${productData[3].qty}</strong>
        <span id="increment-btn" data-id="${productData[3].id}">+</span>
      </div>
    `;
    
  
 
    singleProductDetailsDiv.appendChild(quantityDiv);

 
  
    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('btn-add-to-cart');
    addToCartBtn.textContent = 'Add to Cart';
    singleProductDetailsDiv.appendChild(addToCartBtn);
    addToCartBtn.addEventListener("click", () => {
      addItem(3, productData[3].id)
    })
  
    const detailsHeader = document.createElement('h4');
    detailsHeader.textContent = 'Details Of Our Nuden Poundo';
    singleProductDetailsDiv.appendChild(detailsHeader);
  
    const detailsSpan = document.createElement('span');
    detailsSpan.textContent = 'Miyen Nuden Poundo is crafted from a meticulous selection of organic, whole, ancient grains, root vegetables, and psyllium husk. This unique blend ensures an abundance of essential vitamins and minerals that your body craves. Indulge in one of your favorite dishes while nourishing your body simultaneously. The wealth of nutrients it encompasses fortifies your body, optimizing its performance and uplifting your mood. Additionally, it aids in managing and combating various diseases. Thanks to its slow breakdown within the body, it facilitates weight loss by providing prolonged satiety, without causing spikes in blood sugar or blood pressure.';
    singleProductDetailsDiv.appendChild(detailsSpan);
  
    const keyFeaturesHeader = document.createElement('h4');
    keyFeaturesHeader.textContent = 'Key Features and Benefits of Nuden Poundo:';
    singleProductDetailsDiv.appendChild(keyFeaturesHeader);
  
    const keyFeaturesList = document.createElement('ul');
    const keyFeatures = [
      'Miyen Nuden Poundo: A Superfood for Health and Strength.',
      'A Safer and Healthier Alternative to Traditional Poundos.',
      'Made from 10 Organic, Ancient Grains and Root Vegetables.',
      'Nutrient-Dense Ingredients for Optimal Body Function.',
      'Ancient Grains: Nutritional Powerhouses with Genetic Adaptabilities.',
      'Vegetable Roots: Rich Sources of Carbohydrates, Fiber, and Vitamins.',
      'Organic Nuden Poundo Ingredients: A Perfect Blend of Superfoods.',
      'Detailed Ingredient Analysis: Benefits of Each Component.',
      'Fortified with Essential Vitamins and Minerals, No Harmful Preservatives.',
      'Nutrient-Rich Poundo: A Wide Range of Health Benefits for Your Body.'
    ];
  
    keyFeatures.forEach(feature => {
      const listItem = document.createElement('li');
      listItem.innerHTML = feature.replace('<br>', '<br/>');
      keyFeaturesList.appendChild(listItem);
    });
  
    singleProductDetailsDiv.appendChild(keyFeaturesList);
  
    const ingredientsHeader = document.createElement('h4');
    ingredientsHeader.textContent = 'INGREDIENTS:';
    singleProductDetailsDiv.appendChild(ingredientsHeader);
  
    const ingredientsSpan = document.createElement('span');
    ingredientsSpan.textContent = 'Khorasan, Barley, Chickpea, Buckwheat, Sorghum, Spelt, Potato, Arrowroot Powder, Amaranth, psyllium Husk Powder.';
    singleProductDetailsDiv.appendChild(ingredientsSpan);
  
    const richInHeader = document.createElement('h4');
    richInHeader.textContent = 'RICH IN:';
    singleProductDetailsDiv.appendChild(richInHeader);
  
    const richInSpan = document.createElement('span');
    richInSpan.textContent = 'Potassium, Zinc, Iron, Dietary Fiber, Vitamin C, Magnesium, Vitamin B2, Phosphorus, Folate(Folic Acid), Protien, Calcium, Thiamine';
    singleProductDetailsDiv.appendChild(richInSpan);
  
    productDetails.appendChild(singleProductDetailsDiv);
    
   
  }
  
  // Call the function to generate the product details
  generateProductDetails();
  const decrementBtn = document.getElementById(`decrement-btn`);
  const s_price = document.getElementById("s_price")
  decrementBtn.addEventListener('click', () => {
    decrementQty(productData[3].id);
    if(s_price.innerHTML > 1){
  s_price.innerHTML--
    }
    updateCart();
  });
  
  const incrementBtn = document.getElementById(`increment-btn`);
  incrementBtn.addEventListener('click', () => {
    console.log('i got clicked');
    incrementQty(productData[3].id);
    console.log(s_price.innerHTML++)
    updateCart();
  });
  

  let mainImg = document.getElementById("mainImg");
  let smallImg = document.getElementsByClassName("diff-view");

  smallImg[0].addEventListener("click", function() {
    mainImg.src = smallImg[0].src;
    console.log("i got clicked")
  });
  smallImg[1].addEventListener("click", function() {
    mainImg.src = smallImg[1].src;
  });
  smallImg[2].addEventListener("click", function() {
    mainImg.src = smallImg[2].src;
  });
  smallImg[3].addEventListener("click", function() {
    mainImg.src = smallImg[3].src;
  });

