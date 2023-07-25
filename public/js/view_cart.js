let   billTotal = JSON.parse(localStorage.getItem("cartTotal"))



const generateSmCart = (data) => {
    return `
    <div class="sm_product">
        <img src="${data.img}" class="sm_product_img" alt="first product in your cart">
        <div class="sm_text">
        <p class="sm_product_name">${data.name}</p>
        <p class="sm_product_price" >$${data.price}</p>
        </div>
        <div class="qty">
        <span class="decrement-btn" data-id="${data.id}">-</span>
        <strong class="item_qty">${data.qty}</strong>
        <span class="increment-btn" data-id="${data.id}">+</span>
        </div>
        <p class="sm_price" data-price="${data.price}">$${data.price * data.qty}</p>
        <button class="sm_delete_btn remove_item "><img src="images/close_btn.png" alt="remove item from cart" width="13px"></button>
    </div>
    `;
};

const setSmCart = () => {
    const smcartDiv = document.querySelector('.cart_container');

    let cartData = JSON.parse(localStorage.getItem('cart_data'));
    if (cartData.length === 0 || null ) {
        smcartDiv.innerHTML += `<img src="images/empty-cart.png" alt="your cart is empty" class="cart_empty">`;
    } else {
       for(let i = 0; i < cartData.length; i++){
        smcartDiv.innerHTML += generateSmCart(cartData[i])
    

        getBillUpdate()
        }
     
    }
    handleCardEvents();
};

const getBillUpdate = () => {
    const bill = document.querySelector(".bill")
    
    let totalB = 0
    //get all the prices of each items in local storage and add them up to calculate the final
    let productsInLocalStorage= JSON.parse(localStorage.getItem('cart_data'))

    productsInLocalStorage?.forEach(item => totalB += Number(item.price) * Number(item.qty))
    console.log(totalB)
  

    bill.innerHTML =`$${totalB}`
} 

const handleCardEvents = () => {
    const decrementBtn = document.querySelectorAll(".cart_container .decrement-btn");
    const incrementBtn = document.querySelectorAll(".cart_container .increment-btn");
    const qtys = document.querySelectorAll(".cart_container .item_qty");
    const price = document.querySelectorAll(".cart_container .sm_price");
    const deleteBtn = document.querySelectorAll(".sm_delete_btn")

    let product = JSON.parse(localStorage.getItem("cart_data"));

    qtys.forEach((item, i) => {
        let cost = Number(price[i].getAttribute("data-price"));
        console.log(cost);
        decrementBtn[i].addEventListener("click", () => {
            if (item.innerHTML > 1) {
                item.innerHTML--;
             
                price[i].innerHTML =`$${item.innerHTML * cost}`
                product[i].qty = Number(item.innerHTML)
                localStorage.setItem('cart_data',JSON.stringify(product))
                localStorage.setItem('cartTotal',JSON.stringify(billTotal -= cost))
                getBillUpdate()
                location.reload();
                
                
            }
        });
        incrementBtn[i].addEventListener("click", () => {
            if (item.innerHTML < 9) {
                item.innerHTML++;
                price.innerHTML =  `${0}`
               
                price[i].innerHTML =`$${item.innerHTML * cost}`
                product[i].qty = Number(item.innerHTML)
                
                localStorage.setItem('cart_data',JSON.stringify(product))
                localStorage.setItem('cartTotal',JSON.stringify(billTotal += cost))
                getBillUpdate()
                location.reload()
                
                
            }
        });
    });
        deleteBtn.forEach((eachBtn, idx) => {
            eachBtn.addEventListener("click", function() {
                product = product.filter((item, index) => index !== idx);
                localStorage.setItem("cart_data", JSON.stringify(product));
                
                getBillUpdate()
               
                location.reload()
               
            
           
                
               
            });
           
        });
    
};

setSmCart();
