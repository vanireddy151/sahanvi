"use client";

import { useState } from "react";
import Header from "../components/Header";

const adminPhones = ["9704888933", "9949779227"];

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  function sendOtp(event) {
    event.preventDefault();
    const mobile = normalizePhone(new FormData(event.currentTarget).get("phone"));
    if (mobile.length !== 10) {
      setStatus("Please enter a valid 10 digit mobile number.");
      return;
    }
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem("sahanvi-demo-otp", generatedOtp);
    setPhone(mobile);
    setOtpSent(true);
    setStatus(`OTP sent to ${mobile}. Demo OTP: ${generatedOtp}`);
  }

  function verifyOtp(event) {
    event.preventDefault();
    if (otp !== localStorage.getItem("sahanvi-demo-otp")) {
      setStatus("Please enter the correct OTP.");
      return;
    }

    const savedProfile = JSON.parse(localStorage.getItem("sahanvi-customer-profile") || "{}");
    const user = {
      ...savedProfile,
      phone,
      name: savedProfile.name || "Customer",
      role: adminPhones.includes(phone) ? "admin" : "customer"
    };
    localStorage.setItem("sahanvi-auth", JSON.stringify({ user }));
    localStorage.setItem("sahanvi-customer-profile", JSON.stringify(user));
    localStorage.removeItem("sahanvi-demo-otp");
    window.location.href = user.role === "admin" ? "/admin" : "/profile";
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Sign in</h1>
          <p>Use your mobile number to continue with OTP</p>
          {!otpSent ? (
            <form className="login-form signup-form" onSubmit={sendOtp}>
              <label><span>Mobile Number</span><input type="tel" name="phone" placeholder="10 digit mobile number" required /></label>
              <button className="checkout-primary" type="submit">Send OTP</button>
              <p className="member-copy">New customer?<a href="/signup">Create profile</a></p>
            </form>
          ) : (
            <form className="login-form signup-form" onSubmit={verifyOtp}>
              <label><span>Enter OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength="6" required /></label>
              <button className="checkout-primary" type="submit">Verify & Sign In</button>
              <p className="member-copy"><button type="button" onClick={() => setOtpSent(false)}>Change mobile number</button></p>
            </form>
          )}
          <p className="auth-status">{status}</p>
        </section>
      </main>
    </div>
  );
}
