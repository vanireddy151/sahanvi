"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiUrl } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      setDone(true);
    } catch (error) {
      const msg = error.name === "AbortError"
        ? "Request timed out. The server may be waking up — please try again in a moment."
        : error.message || "Unable to send reset email. Please try again.";
      setStatus(msg);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="next-page">
      <Header />
      <main className="auth-page">
        <section className="auth-card">
          <p className="listing-kicker">Account</p>
          <h1>Forgot Password</h1>

          {done ? (
            <div className="auth-success">
              <p>If that email is registered with Sahanvi, a password reset link has been sent. Please check your inbox (and spam folder).</p>
              <a className="hero-button" href="/login">Back to Sign In</a>
            </div>
          ) : (
            <>
              <p className="auth-subtitle">Enter the email address linked to your account and we'll send you a reset link.</p>
              <form className="otp-form" onSubmit={handleSubmit}>
                <label>
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                </label>
                {status && <p className="auth-error">{status}</p>}
                <button className="checkout-primary" type="submit" disabled={loading}>
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
                <p className="auth-switch">Remember your password? <a href="/login">Sign In</a></p>
              </form>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
