"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiUrl } from "../lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setStatus("Invalid reset link. Please request a new one.");
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      setDone(true);
    } catch (error) {
      setStatus(error.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="listing-kicker">Account</p>
      <h1>Set New Password</h1>

      {done ? (
        <div className="auth-success">
          <p>Your password has been updated successfully.</p>
          <a className="hero-button" href="/login">Sign In</a>
        </div>
      ) : (
        <>
          <p className="auth-subtitle">Choose a strong password for your Sahanvi account.</p>
          <form className="otp-form" onSubmit={handleSubmit}>
            <label>
              <span>New Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                autoFocus
              />
            </label>
            <label>
              <span>Confirm Password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </label>
            {status && <p className="auth-error">{status}</p>}
            <button className="checkout-primary" type="submit" disabled={loading || !token}>
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="auth-page">
        <Suspense fallback={<section className="auth-card"><p>Loading…</p></section>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
