"use client";

import { useState } from "react";
import Header from "../components/Header";
import { apiUrl } from "../lib/api";

function movePendingItemToCart() {
  const pendingItem = JSON.parse(localStorage.getItem("sahanvi-pending-cart-item") || "null");
  if (!pendingItem) return false;
  const existingCart = JSON.parse(localStorage.getItem("sahanvi-cart") || "[]");
  const nextCart = [...existingCart.filter((item) => item.code !== pendingItem.code), pendingItem];
  localStorage.setItem("sahanvi-cart", JSON.stringify(nextCart));
  localStorage.removeItem("sahanvi-pending-cart-item");
  return true;
}

export default function LoginPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    const { email, password } = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("sahanvi-auth", JSON.stringify({ token: data.token, user: data.user }));
      localStorage.setItem("sahanvi-customer-profile", JSON.stringify(data.user));
      const hasPendingCart = movePendingItemToCart();
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      window.location.href = returnTo || (hasPendingCart ? "/cart" : data.user.role === "admin" ? "/admin" : "/profile");
    } catch {
      setStatus("Unable to connect. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Sign In</h1>
          <p>Welcome back to Sahanvi</p>
          <form className="login-form signup-form" onSubmit={signIn}>
            <label>
              <span>Email Address</span>
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="Your password" required />
              <a className="forgot-password-link" href="/forgot-password">Forgot password?</a>
            </label>
            <button className="checkout-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="member-copy">New customer? <a href="/signup">Create an account</a></p>
          </form>
          {status && <p className="auth-status">{status}</p>}
        </section>
      </main>
    </div>
  );
}
