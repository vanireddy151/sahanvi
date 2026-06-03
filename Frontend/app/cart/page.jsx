"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CartPage() {
  const [auth, setAuth] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("sahanvi-auth") || "null"));
    setCart(JSON.parse(localStorage.getItem("sahanvi-cart") || "[]"));
  }, []);

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
          <h1>Your Cart</h1>
          <p>Review your sarees and add the delivery details required to place the order.</p>
        </section>

        <section className="cart-layout">
          <div className="cart-items">
            {!cart.length ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Choose a saree from New Arrivals or Collections to continue.</p>
                <a className="hero-button" href="/new-arrivals">Shop New Arrivals</a>
              </div>
            ) : cart.map((item) => (
              <article className="cart-line-item" key={item.code || item.name}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.code}</p>
                  <strong>{item.price}</strong>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-details">
            <h2>Delivery Details</h2>
            {!auth?.user ? (
              <div className="cart-login-prompt">
                <p>Please sign up or sign in before placing the order.</p>
                <a className="checkout-primary" href="/signup">Sign Up</a>
                <a href="/login">Already registered? Sign in</a>
              </div>
            ) : (
              <form className="otp-form" onSubmit={placeOrder}>
                <label><span>Full Name</span><input name="name" defaultValue={auth.user.name || ""} required /></label>
                <label><span>Email</span><input name="email" type="email" defaultValue={auth.user.email || ""} required /></label>
                <label><span>Phone Number</span><input name="phone" type="tel" defaultValue={auth.user.phone || ""} required /></label>
                <label><span>Delivery Address</span><textarea name="address" rows="5" defaultValue={auth.user.address || ""} placeholder="House/flat, street, city, state, pincode" required></textarea></label>
                <button className="checkout-primary" type="submit" disabled={!cart.length}>Place Order</button>
              </form>
            )}
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
