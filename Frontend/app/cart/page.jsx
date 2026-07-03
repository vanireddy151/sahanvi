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
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    setAuth(JSON.parse(localStorage.getItem("sahanvi-auth") || "null"));
    setCart(JSON.parse(localStorage.getItem("sahanvi-cart") || "[]"));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + priceNumber(item.price), 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  function removeItem(code) {
    const nextCart = cart.filter((item) => item.code !== code);
    setCart(nextCart);
    localStorage.setItem("sahanvi-cart", JSON.stringify(nextCart));
  }

  function loadRazorpayCheckout() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
      document.body.appendChild(script);
    });
  }

  function savePaidOrder(delivery, payment) {
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
      subtotal,
      gst,
      total,
      status: "Order placed",
      paymentStatus: "Paid",
      payment
    };
    const orders = JSON.parse(localStorage.getItem("sahanvi-orders") || "[]");
    localStorage.setItem("sahanvi-auth", JSON.stringify({ ...auth, user: customerProfile }));
    localStorage.setItem("sahanvi-customer-profile", JSON.stringify(customerProfile));
    localStorage.setItem("sahanvi-orders", JSON.stringify([order, ...orders]));
    localStorage.setItem("sahanvi-cart", "[]");
    setCart([]);
    alert("Payment successful. Your order is saved in your profile.");
    window.location.href = "/profile";
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (!auth?.user) {
      window.location.href = "/signup";
      return;
    }
    if (!cart.length) return;

    const delivery = Object.fromEntries(new FormData(event.currentTarget).entries());
    setPaymentStatus("Opening secure payment...");

    try {
      await loadRazorpayCheckout();
      const response = await fetch("/api/payments/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: `SH-${Date.now()}`,
          notes: {
            customerName: delivery.name,
            customerPhone: delivery.phone,
            customerEmail: delivery.email
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create payment order.");

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Sahanvi Handloom Sarees",
        description: "Saree order payment",
        order_id: data.order.id,
        prefill: {
          name: delivery.name,
          email: delivery.email,
          contact: delivery.phone
        },
        notes: {
          deliveryAddress: delivery.address
        },
        theme: {
          color: "#5a2f1d"
        },
        async handler(paymentResponse) {
          setPaymentStatus("Verifying payment...");
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                delivery,
                items: cart
              })
            });
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verifyData.error || "Payment verification failed.");

            savePaidOrder(delivery, {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            });
          } catch (error) {
            setPaymentStatus(error.message || "We could not verify this payment. Please contact support before retrying.");
          }
        },
        modal: {
          ondismiss() {
            setPaymentStatus("Payment was not completed.");
          }
        }
      });

      checkout.open();
    } catch (error) {
      setPaymentStatus(error.message || "Payment could not be started.");
    }
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
                <div><span>GST (5%)</span><strong>₹{gst.toLocaleString("en-IN")}</strong></div>
                <div className="order-total-row"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
                <p>Secure online payment is powered by Razorpay.</p>
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
                  <button className="checkout-primary" type="submit" disabled={!cart.length}>Pay Now</button>
                  {paymentStatus ? <p className="payment-status">{paymentStatus}</p> : null}
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
