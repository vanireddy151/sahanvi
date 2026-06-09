"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const returnReasons = [
  "Damaged product",
  "Wrong product received",
  "Quality concern",
  "Colour mismatch",
  "Other"
];

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

export default function ProfilePage() {
  const [auth, setAuth] = useState(null);
  const [orders, setOrders] = useState([]);
  const [returnOpen, setReturnOpen] = useState("");

  useEffect(() => {
    const currentAuth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    const allOrders = JSON.parse(localStorage.getItem("sahanvi-orders") || "[]");
    setAuth(currentAuth);
    setOrders(allOrders);
  }, []);

  function submitReturn(event, orderId) {
    event.preventDefault();
    const order = orders.find((item) => item.id === orderId);
    const request = {
      id: `RT-${Date.now()}`,
      orderId,
      createdAt: new Date().toISOString(),
      ...Object.fromEntries(new FormData(event.currentTarget).entries()),
      pickupAddress: order?.delivery?.address || "",
      status: "Return request submitted"
    };
    const requests = JSON.parse(localStorage.getItem("sahanvi-return-requests") || "[]");
    localStorage.setItem("sahanvi-return-requests", JSON.stringify([request, ...requests]));
    setOrders((currentOrders) => {
      const nextOrders = currentOrders.map((order) => (
        order.id === orderId ? { ...order, returnRequest: request, status: "Return requested" } : order
      ));
      localStorage.setItem("sahanvi-orders", JSON.stringify(nextOrders));
      return nextOrders;
    });
    setReturnOpen("");
    alert("Return request submitted. Sahanvi team will review it.");
  }

  if (!auth?.user) {
    return (
      <div className="next-page">
        <Header />
        <main className="profile-page">
          <section className="profile-empty">
            <h1>Sign in to view your profile</h1>
            <p>Your orders, delivery details, and return requests will appear here after login.</p>
            <a className="hero-button" href="/login">Sign In</a>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const orderItems = orders.flatMap((order) => order.items || []);
  const orderValue = orderItems.reduce((sum, item) => sum + priceNumber(item.price), 0);
  const returnCount = orders.filter((order) => order.returnRequest).length;

  return (
    <div className="next-page">
      <Header />
      <main className="profile-page">
        <section className="profile-hero">
          <p className="listing-kicker">Customer Profile</p>
          <h1>Welcome, {auth.user.name || "Customer"}</h1>
          <p>Track your orders, delivery information, and return requests in one place.</p>
          <div className="profile-summary">
            <article>
              <span>{orders.length}</span>
              <p>Orders</p>
            </article>
            <article>
              <span>{orderItems.length}</span>
              <p>Sarees</p>
            </article>
            <article>
              <span>₹{orderValue.toLocaleString("en-IN")}</span>
              <p>Order Value</p>
            </article>
            <article>
              <span>{returnCount}</span>
              <p>Returns</p>
            </article>
          </div>
        </section>

        <section className="profile-layout">
          <aside className="profile-card">
            <h2>Profile Details</h2>
            <dl>
              <div><dt>Name</dt><dd>{auth.user.name || "-"}</dd></div>
              <div><dt>Email</dt><dd>{auth.user.email || "-"}</dd></div>
              <div><dt>Phone</dt><dd>{auth.user.phone || "-"}</dd></div>
              <div><dt>Address</dt><dd>{auth.user.address || "Address will be saved after order placement."}</dd></div>
            </dl>
          </aside>

          <section className="order-listing" id="orders">
            <div className="order-listing-head">
              <h2>My Orders</h2>
              <span>{orders.length} order{orders.length === 1 ? "" : "s"}</span>
            </div>

            {!orders.length ? (
              <div className="empty-cart profile-empty-order">
                <h2>No orders yet</h2>
                <p>Your saree orders will appear here after checkout.</p>
                <a className="hero-button" href="/new-arrivals">Shop New Arrivals</a>
              </div>
            ) : orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div>
                    <p>Order ID</p>
                    <h3>{order.id}</h3>
                  </div>
                  <span>{order.status}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={`${order.id}-${item.code || item.name}`}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.code}</span>
                        <span>{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-delivery">
                  <h4>Delivery Address</h4>
                  <p>{order.delivery?.address}</p>
                </div>

                {order.returnRequest ? (
                  <div className="return-status">
                    <strong>{order.returnRequest.status}</strong>
                    <p>{order.returnRequest.reasonType}: {order.returnRequest.reason}</p>
                    <p>Pickup Address: {order.returnRequest.pickupAddress || order.delivery?.address}</p>
                  </div>
                ) : (
                  <button className="return-toggle" type="button" onClick={() => setReturnOpen(returnOpen === order.id ? "" : order.id)}>
                    Request Return
                  </button>
                )}

                {returnOpen === order.id ? (
                  <form className="return-form" onSubmit={(event) => submitReturn(event, order.id)}>
                    <div className="return-pickup-note">
                      <strong>Return Pickup Address</strong>
                      <p>{order.delivery?.address}</p>
                    </div>
                    <label>
                      <span>Reason Type</span>
                      <select name="reasonType" required>
                        <option value="">Select reason</option>
                        {returnReasons.map((reason) => <option key={reason}>{reason}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Reason Details</span>
                      <textarea name="reason" rows="4" placeholder="Tell us what happened" required></textarea>
                    </label>
                    <button className="checkout-primary" type="submit">Submit Return Request</button>
                  </form>
                ) : null}
              </article>
            ))}
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
