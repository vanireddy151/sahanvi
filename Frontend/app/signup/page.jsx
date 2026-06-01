"use client";

import Header from "../components/Header";
import { apiUrl } from "../lib/api";

export default function SignupPage() {
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const response = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("sahanvi-auth", JSON.stringify(result));
      alert("Registration successful.");
    } else {
      alert(result.message || "Registration failed.");
    }
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Sign up</h1>
          <p>with your social network</p>
          <form className="signup-form" onSubmit={submit}>
            <label><span>Name</span><input name="name" required /></label>
            <label><span>E-mail</span><input name="email" type="email" required /></label>
            <label><span>Phone Number</span><input name="phone" type="tel" /></label>
            <div className="password-row">
              <label><span>Password</span><input name="password" type="password" required /></label>
              <label><span>Re-Type Password</span><input name="confirmPassword" type="password" required /></label>
            </div>
            <p className="member-copy">Already a member? <a href="/login">Sign in</a></p>
            <button className="checkout-primary" type="submit">Sign Up</button>
          </form>
        </section>
      </main>
    </div>
  );
}
