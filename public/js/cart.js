import { productData } from "./productData.js";

// Retrieve cart data from localStorage, if available
let cart_data = JSON.parse(localStorage.getItem("cart_data")) || [];
console.log(cart_data)

// handle sidebar 
const baggy = document.querySelector(".baggy")
const closeSidebarbtn = document.getElementById("close_btn")
const subtotal_price = document.getElementById("subtotal_price")

const sidebar = document.getElementById("sidecart")
const backdrop= document.querySelector(".backdrop")
const mobile = document.getElementById("mobile")
const cartAmount = document.querySelector(".cartAmount")
const mobileCartAmount = document.querySelector(".cartAmountm");


baggy.addEventListener("click", openSidebar)


if(backdrop && closeSidebarbtn){
  backdrop.addEventListener("click", closeSidebar)
  closeSidebarbtn.addEventListener("click", closeSidebar)
}

//  open and close of side bar
function openSidebar() {
  sidebar.classList.add("open")
  backdrop.style.display = "block"
  
  setTimeout(() => {
    backdrop.classList.add("show")

  }, 0)

  console.log("clicked")
}

function closeSidebar() {
  sidebar.classList.remove("open")
  backdrop.classList.remove("show")

  setTimeout(() => {
    backdrop.style.display = "none"

  }, 500)
}

//  add item to cart
export const addItem = (idx, id) =>{
    // find same item
    const foundItemId = cart_data.find(item => item.id.toString() === id.toString())

    if(foundItemId ){
        // increase qty
        alert("item already in cart.")
    } else{
        cart_data.push( productData[idx])
    }

    updateCart()
    openSidebar()

}
// remove cart items
function deleteFromCart(id) {
    cart_data = cart_data.filter((item) => item.id !== id);
    updateCart();
}

// increase Qty
export function incrementQty(id) {
    cart_data = cart_data.map(item => 
      item.id.toString() === id.toString()
      ? {...item, qty: item.qty + 1}
      : item
    )
    updateCart()
}

// decrease Qty
export function decrementQty(id) {
  cart_data = cart_data.map(item => 
    item.id.toString() === id.toString()
    ? {...item, qty: item.qty > 1 ? item.qty - 1 : item.qty}
    : item
  )
  updateCart()
}

// calculate total quantity
let totalQuantity = function() {
  let sum = 0;
  if (cart_data.length > 0) {
    cart_data.forEach(item => sum += item.qty);
    cartAmount.innerText = sum;
    mobileCartAmount.innerText = sum;
    cartAmount.style.display = "block"
    mobileCartAmount.style.display = "block"
  } else {
    cartAmount.innerText = "";
    mobileCartAmount.innerText = "";
    cartAmount.style.display = "none"
    mobileCartAmount.style.display = "none"
    
  }
}


//  calculate subtotal
function subTotalPrice (){
  let totalPrice = 0
  cart_data.forEach(item => totalPrice += item.price * item.qty)
  subtotal_price.innerHTML = totalPrice
  // save total price to localStorage
  localStorage.setItem("cartTotal", totalPrice)
}


const cartItems = document.querySelector(".cart_items");


// Render cart items
function getCartItems() {
  // Clear the existing cart items
  cartItems.innerHTML = "";

  cart_data.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart_item");

    // Create the remove item button
    const removeItem = document.createElement("div");
    removeItem.classList.add("remove_item");
    removeItem.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Add onclick handler for the remove item button
    removeItem.addEventListener("click", () => {
      deleteFromCart(item.id); 
    });

    // Create the item image
    const itemImg = document.createElement("div");
    itemImg.classList.add("item_img");
    itemImg.innerHTML = `<img src=${item.img} alt="">`;

    // Create the item details
    const itemDetails = document.createElement("div");
    itemDetails.classList.add("item_details");
    itemDetails.innerHTML = `
      <p>${item.name}</p>
      <strong>$${item.price}</strong>
      <div class="qty">
        <span class="decrement-btn" data-id="${item.id}">-</span>
        <strong>${item.qty}</strong>
        <span class="increment-btn" data-id="${item.id}">+</span>
      </div>
    `;

    // Append elements to the cart item container
    cartItem.appendChild(removeItem);
    cartItem.appendChild(itemImg);
    cartItem.appendChild(itemDetails);

    // Append the cart item to the cartItems container
    cartItems.appendChild(cartItem);

    // Add onclick handler for the decrement button
    const decrementBtn = cartItem.querySelector('.decrement-btn');
    decrementBtn.addEventListener('click', () => {
      decrementQty(item.id);
      updateCart();
    });

    // Add onclick handler for the increment button
    const incrementBtn = cartItem.querySelector('.increment-btn');
    incrementBtn.addEventListener('click', () => {
      incrementQty(item.id);
      updateCart();
    });
  });

}

// Update the cart
export function updateCart() {
  getCartItems();
  totalQuantity();
  subTotalPrice();
  localStorage.setItem("cart_data", JSON.stringify(cart_data)); // Store the cart data in localStorage
}

// Mobile view
if (mobile) {
  const baggy = document.querySelector(".baggym");
  const mobileSidebar = document.getElementById("sidecart");
  const mobileBackdrop = document.querySelector(".backdrop");

  baggy.addEventListener("click", openMobileSidebar);
  mobileBackdrop.addEventListener("click", closeMobileSidebar);

  function openMobileSidebar() {
    mobileSidebar.classList.add("open");
    mobileBackdrop.style.display = "block";

    setTimeout(() => {
      mobileBackdrop.classList.add("show");
    }, 0);

    console.log("Mobile sidebar clicked");
  }

  function closeMobileSidebar() {
    mobileSidebar.classList.remove("open");
    mobileBackdrop.classList.remove("show");

    setTimeout(() => {
      mobileBackdrop.style.display = "none";
    }, 500);
  }


  // Add event listeners for the increment and decrement buttons in the mobile view
  cartItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("qty-btn")) {
      const action = event.target.getAttribute("data-action");
      const itemId = event.target.getAttribute("data-id");
      console.log(itemId);

      if (action === "decrement") {
        decrementQty(itemId);
        updateCart();
      } else if (action === "increment") {
        incrementQty(itemId);
        updateCart();
      }

    
    }
  });

  // Render initial cart items and update the total quantity for the mobile view
  getCartItems();
  totalQuantity();

} else {
  // Render initial cart items and update the total quantity for desktop view
  getCartItems();
  totalQuantity();
}

// Calculate initial values
totalQuantity();
subTotalPrice();


// get final cart_data in function to use in the cart page
// export const finalData = (cartContent) => {
//   let dataArry=[]
//   if(cartContent.length > 0){

    
//   }
// }
