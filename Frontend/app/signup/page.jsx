"use client";

import { useState } from "react";
import Header from "../components/Header";
import PasswordInput from "../components/PasswordInput";
import { apiUrl } from "../lib/api";

export default function SignupPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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

      setDone(true);
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
          {done ? (
            <div className="auth-success">
              <p>Almost there! We've sent a verification link to your email. Please check your inbox and click the link to activate your account.</p>
              <a className="hero-button" href="/login">Sign In</a>
            </div>
          ) : (
            <>
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
                  <PasswordInput name="password" placeholder="Minimum 8 characters" autoComplete="new-password" required />
                </label>
                <label>
                  <span>Confirm Password</span>
                  <PasswordInput name="confirmPassword" placeholder="Re-enter password" autoComplete="new-password" required />
                </label>
                <button className="checkout-primary" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </button>
                <p className="member-copy">Already have an account? <a href="/login">Sign in</a></p>
              </form>
              {status && <p className="auth-status">{status}</p>}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
