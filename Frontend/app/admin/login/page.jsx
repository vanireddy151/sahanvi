"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { apiUrl } from "../../lib/api";

export default function AdminLoginPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

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

      if (data.user.role !== "admin") {
        setStatus("This account does not have admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("sahanvi-admin-session", JSON.stringify({ token: data.token, user: data.user }));
      window.location.href = "/admin";
    } catch {
      setStatus("Unable to sign in right now.");
      setLoading(false);
    }
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Admin Sign In</h1>
          <p>Sign in with your admin email and password.</p>
          <form className="login-form signup-form" onSubmit={signIn}>
            <label><span>Email</span><input type="email" name="email" required /></label>
            <label><span>Password</span><input type="password" name="password" required /></label>
            <button className="checkout-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="auth-status">{status}</p>
        </section>
      </main>
    </div>
  );
}
