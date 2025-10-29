export default function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    return [];
  }
  return JSON.parse(cart);
}

export function addToCart(product, quantity = 1) {
  let cart = getCart();

  // Optional: check if product already in cart
  const existingIndex = cart.findIndex(item => item.productid === product.productid);

  if (existingIndex === -1) {
    // ✅ Add new item
    cart.push({
      productid: product.productid,
      name: product.name,
      altName: product.altName,
      price: product.price,
      lablePrice: product.lablePrice,
      image: product.Image?.[0],
      quantity: quantity,
    });
  } else {
    // ✅ Update existing item quantity
    cart[existingIndex].quantity += quantity;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productid) {
  let cart = getCart();
  cart = cart.filter(item => item.productid !== productid);
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function getTotal(){
    let cart = getCart();
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
}

export function getTotalForLablePrice(){
    let cart = getCart();
    let total = 0;
    cart.forEach(item => {
        total += item.lablePrice * item.quantity;
    });
    return total;
}