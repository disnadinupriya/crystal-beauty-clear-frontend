export function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        return [];
    }
    cart = JSON.parse(cart);
    return cart;
}
export function addToCart(product, quantity) {
  const cart = getCart();
 
  const productIndex = cart.findIndex(
    (prdct) => prdct.productid === product.productid
  );
  if (productIndex === -1) {
    cart.push(
      { productid:product.productid,
        name: product.name,
        altName: product.altName,
        price: product.price,
        lablePrice: product.lablePrice,
        Image: product.Image,
        stock: product.stock,
        quantity: quantity }
    );

}
else{
  cart[productIndex].quantity += quantity;
  if(cart[productIndex].quantity <=0){
    cart= cart.filter(prdct => prdct.productid !== product.productid);
  }
}
localStorage.setItem("cart", JSON.stringify(cart));
return cart;
}
export function removeFromCart(productid) {
  let cart = getCart();
  cart = cart.filter(product => product.productid !== productid);
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function getTotal(){
    let cart = getCart();
    let total=0;
    cart.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total;
}

export function getTotalForLablePrice(){
  let cart = getCart();
  let total=0;
  cart.forEach((product) => {
    total += product.lablePrice * product.quantity;
  });
  return total;
}