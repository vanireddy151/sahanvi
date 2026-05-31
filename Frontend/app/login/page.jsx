"use client";

import Header from "../components/Header";

export default function LoginPage() {
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("sahanvi-auth", JSON.stringify(result));
      window.location.href = result.user.role === "admin" ? "/admin" : "/";
    } else {
      alert(result.message || "Login failed.");
    }
  }

  return (
    <div className="next-page">
      <Header />
      <main className="signup-page">
        <section className="signup-page-panel">
          <h1>Sign in</h1>
          <p>Welcome back to Sahanvi</p>
          <form className="login-form" onSubmit={submit}>
            <label><span>E-mail</span><input type="email" name="email" required /></label>
            <label><span>Password</span><input type="password" name="password" required /></label>
            <button className="checkout-primary" type="submit">Sign In</button>
          </form>
        </section>
      </main>
    </div>
  );
}
