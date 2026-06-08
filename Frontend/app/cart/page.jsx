"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

export default function CartPage() {
  const [auth, setAuth] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("sahanvi-auth") || "null"));
    setCart(JSON.parse(localStorage.getItem("sahanvi-cart") || "[]"));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + priceNumber(item.price), 0);

  function removeItem(code) {
    const nextCart = cart.filter((item) => item.code !== code);
    setCart(nextCart);
    localStorage.setItem("sahanvi-cart", JSON.stringify(nextCart));
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!auth?.user) {
      window.location.href = "/signup";
      return;
    }

    const delivery = Object.fromEntries(new FormData(event.currentTarget).entries());
    const customerProfile = {
      ...auth.user,
      name: delivery.name,
      email: delivery.email,
      phone: delivery.phone,
      address: delivery.address,
      role: auth.user.role || "customer"
    };
    const order = {
      id: `SH-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: customerProfile,
      delivery,
      items: cart,
      status: "Pending confirmation"
    };
    const orders = JSON.parse(localStorage.getItem("sahanvi-orders") || "[]");
    localStorage.setItem("sahanvi-auth", JSON.stringify({ ...auth, user: customerProfile }));
    localStorage.setItem("sahanvi-customer-profile", JSON.stringify(customerProfile));
    localStorage.setItem("sahanvi-orders", JSON.stringify([order, ...orders]));
    localStorage.setItem("sahanvi-cart", "[]");
    setCart([]);
    alert("Order placed. You can review it in your profile.");
    window.location.href = "/profile";
  }

  return (
    <div className="next-page">
      <Header />
      <main className="cart-page">
        <section className="cart-hero">
          <p className="listing-kicker">Sahanvi Checkout</p>
          <h1>Cart & Delivery</h1>
          <p>Check your sarees and add delivery details in one place.</p>
        </section>

        <section className="cart-layout">
          <div className="cart-checkout-sheet">
            <div className="cart-items">
              <div className="cart-section-title">
                <h2>Selected Sarees</h2>
                <p>{cart.length ? `${cart.length} item${cart.length === 1 ? "" : "s"} ready for checkout` : "No sarees added yet"}</p>
              </div>
              {!cart.length ? (
                <div className="empty-cart">
                  <h3>Your cart is empty</h3>
                  <p>Choose a saree to continue checkout.</p>
                  <a className="hero-button" href="/new-arrivals">Shop New Arrivals</a>
                </div>
              ) : cart.map((item) => (
                <article className="cart-line-item" key={item.code || item.name}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.code}</p>
                    <strong>{item.price}</strong>
                    <button className="text-action" type="button" onClick={() => removeItem(item.code)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-details">
              <div className="cart-section-title">
                <h2>Delivery Details</h2>
                <p>We use this address for delivery and approved returns.</p>
              </div>
              <div className="order-summary-box">
                <div><span>Items</span><strong>{cart.length}</strong></div>
                <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
                <p>Payment and shipping confirmation will be shared by the Sahanvi team.</p>
              </div>
              {!auth?.user ? (
                <div className="cart-login-prompt">
                  <p>Sign up or sign in to place the order.</p>
                  <a className="checkout-primary" href="/signup">Sign Up with OTP</a>
                  <a href="/login">Already registered? Sign in</a>
                </div>
              ) : (
                <form className="otp-form" onSubmit={placeOrder}>
                  <label><span>Name</span><input name="name" defaultValue={auth.user.name || ""} required /></label>
                  <label><span>Email</span><input name="email" type="email" defaultValue={auth.user.email || ""} required /></label>
                  <label><span>Phone</span><input name="phone" type="tel" defaultValue={auth.user.phone || ""} required /></label>
                  <label><span>Address</span><textarea name="address" rows="4" defaultValue={auth.user.address || ""} placeholder="House/flat, street, city, state, pincode" required></textarea></label>
                  <button className="checkout-primary" type="submit" disabled={!cart.length}>Place Order</button>
                </form>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
