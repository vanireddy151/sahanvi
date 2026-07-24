"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
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

function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("Verifying your email…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    async function verify() {
      try {
        const response = await fetch(apiUrl("/api/auth/verify-email"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Verification failed.");

        localStorage.setItem("sahanvi-auth", JSON.stringify({ token: data.token, user: data.user }));
        localStorage.setItem("sahanvi-customer-profile", JSON.stringify(data.user));
        movePendingItemToCart();
        setDone(true);
        setStatus("Your email has been verified.");
      } catch (error) {
        setStatus(error.message || "Unable to verify email. Please try again.");
      }
    }

    verify();
  }, [token]);

  return (
    <section className="auth-card">
      <p className="listing-kicker">Account</p>
      <h1>Verify Email</h1>
      <p className="auth-subtitle">{status}</p>
      {done && (
        <div className="auth-success">
          <a className="hero-button" href="/profile">Continue</a>
        </div>
      )}
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="next-page">
      <Header />
      <main className="auth-page">
        <Suspense fallback={<section className="auth-card"><p>Loading…</p></section>}>
          <VerifyEmailPanel />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
