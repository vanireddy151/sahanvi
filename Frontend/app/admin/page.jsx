"use client";

import Header from "../components/Header";
import { apiUrl } from "../lib/api";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    const phone = String(auth?.user?.phone || "").replace(/\D/g, "");
    setAllowed(auth?.user?.role === "admin" || ["9704888933", "9949779227"].includes(phone));
  }, []);

  async function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch(apiUrl("/api/sarees"), { method: "POST", body: formData });
    alert(response.ok ? "Saree uploaded." : "Upload failed.");
  }

  return (
    <div className="next-page">
      <Header />
      {!allowed ? (
        <section className="admin-denied">
          <h1>Admin Sign In Required</h1>
          <p>Please sign in with an approved admin account to manage sarees.</p>
          <a className="hero-button" href="/login">Sign In</a>
        </section>
      ) : (
        <main className="admin-page">
          <section className="admin-hero">
            <p className="eyebrow">Sahanvi Admin</p>
            <h1>Upload sarees with category, type, code, Cloudinary image URL, and price.</h1>
          </section>
          <section className="admin-panel">
            <form className="admin-form" onSubmit={submit}>
              <div className="form-grid">
                <label><span>Category</span><select name="category"><option>Heritage Sarees</option><option>Signature Sarees</option><option>Sarees</option><option>Sahanvi Vintage</option></select></label>
                <label><span>Saree Type</span><input name="type" required /></label>
                <label><span>Saree Name</span><input name="name" required /></label>
                <label><span>Code</span><input name="code" required /></label>
                <label><span>Price</span><input name="price" type="number" required /></label>
                <label><span>Cloudinary Image URL</span><input name="imageUrl" type="url" placeholder="https://res.cloudinary.com/..." required /></label>
              </div>
              <label><span>Description</span><textarea name="description" rows="4"></textarea></label>
              <button className="checkout-primary" type="submit">Upload Saree</button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
}
