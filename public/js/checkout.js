
const checkout_btn= document.querySelector("#checkout_btn");


checkout_btn.addEventListener("click", () => {

    fetch("/stripe-checkout", {
      method:"POST",
      headers: new Headers({"content-type": "application/json"}),
      body: JSON.stringify({
        items: JSON.parse(localStorage.getItem("cart_data")),
        shippingFee: 12,
      }),
    })
    .then((res) => res.json())
    .then((url) => {
      location.href = url;
    })
    .catch(err => console.log(err))
  })