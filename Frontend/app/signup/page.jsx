"use client";

import { useState } from "react";
import Header from "../components/Header";

const adminPhones = ["9704888933", "9949779227"];

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

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
  const [otpSent, setOtpSent] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  function sendOtp(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const phone = normalizePhone(data.phone);
    if (phone.length !== 10) {
      setStatus("Please enter a valid 10 digit mobile number.");
      return;
    }

    const profile = {
      name: data.name,
      email: data.email,
      phone,
      address: data.address,
      role: adminPhones.includes(phone) ? "admin" : "customer"
    };
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem("sahanvi-demo-otp", generatedOtp);
    setPendingProfile(profile);
    setOtpSent(true);
    setStatus(`OTP sent to ${phone}. Demo OTP: ${generatedOtp}`);
  }

  function verifyOtp(event) {
    event.preventDefault();
    if (otp !== localStorage.getItem("sahanvi-demo-otp")) {
      setStatus("Please enter the correct OTP.");
      return;
    }

    localStorage.setItem("sahanvi-auth", JSON.stringify({ user: pendingProfile }));
    localStorage.setItem("sahanvi-customer-profile", JSON.stringify(pendingProfile));
    localStorage.removeItem("sahanvi-demo-otp");
    const hasPendingCart = movePendingItemToCart();
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    window.location.href = returnTo || (hasPendingCart ? "/cart" : pendingProfile.role === "admin" ? "/admin" : "/profile");
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Sign up</h1>
          <p>Create your Sahanvi profile with mobile OTP</p>
          {!otpSent ? (
            <form className="signup-form" onSubmit={sendOtp}>
              <label><span>Name</span><input name="name" required /></label>
              <label><span>E-mail</span><input name="email" type="email" required /></label>
              <label><span>Mobile Number</span><input name="phone" type="tel" placeholder="10 digit mobile number" required /></label>
              <label><span>Delivery Address <small>(optional now)</small></span><textarea name="address" rows="4" placeholder="Address is compulsory only when ordering"></textarea></label>
              <p className="member-copy">Already a member?<a href="/login">Sign in with OTP</a></p>
              <button className="checkout-primary" type="submit">Send OTP</button>
            </form>
          ) : (
            <form className="signup-form" onSubmit={verifyOtp}>
              <label><span>Enter OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength="6" required /></label>
              <button className="checkout-primary" type="submit">Verify & Create Profile</button>
              <p className="member-copy"><button type="button" onClick={() => setOtpSent(false)}>Edit details</button></p>
            </form>
          )}
          <p className="auth-status">{status}</p>
        </section>
      </main>
    </div>
  );
}
