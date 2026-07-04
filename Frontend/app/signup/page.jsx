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

export default function SignupPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event) {
    event.preventDefault();
    setStatus("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    if (data.password.trim() !== data.confirmPassword.trim()) {
      setStatus("Passwords do not match. Please type the same password in both fields.");
      return;
    }
    if (data.password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          password: data.password
        })
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus(result.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("sahanvi-auth", JSON.stringify({ token: result.token, user: result.user }));
      localStorage.setItem("sahanvi-customer-profile", JSON.stringify(result.user));
      const hasPendingCart = movePendingItemToCart();
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      window.location.href = returnTo || (hasPendingCart ? "/cart" : "/profile");
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
          <h1>Create Account</h1>
          <p>Sign up with your email to start shopping</p>
          <form className="signup-form" onSubmit={register}>
            <label>
              <span>Full Name</span>
              <input name="name" placeholder="Your full name" required />
            </label>
            <label>
              <span>Email Address</span>
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span>Mobile Number <small>(optional)</small></span>
              <input name="phone" type="tel" placeholder="10 digit number" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="Minimum 8 characters" autoComplete="new-password" required />
            </label>
            <label>
              <span>Confirm Password</span>
              <input name="confirmPassword" type="password" placeholder="Re-enter password" autoComplete="new-password" required />
            </label>
            <button className="checkout-primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="member-copy">Already have an account? <a href="/login">Sign in</a></p>
          </form>
          {status && <p className="auth-status">{status}</p>}
        </section>
      </main>
    </div>
  );
}
