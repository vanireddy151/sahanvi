"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submitInquiry(event) {
    event.preventDefault();
    const inquiry = {
      id: `INQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...Object.fromEntries(new FormData(event.currentTarget).entries()),
      status: "New"
    };
    const inquiries = JSON.parse(localStorage.getItem("sahanvi-inquiries") || "[]");
    localStorage.setItem("sahanvi-inquiries", JSON.stringify([inquiry, ...inquiries]));
    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <div className="next-page">
      <Header />
      <main className="contact-page">
        <section className="search-hero">
          <p className="listing-kicker">Sahanvi Support</p>
          <h1>Contact Us</h1>
          <p>Ask about saree availability, styling, fall & pico, shipping, or order support.</p>
        </section>

        <section className="contact-layout">
          <form className="contact-form" onSubmit={submitInquiry}>
            <label><span>Name</span><input name="name" required /></label>
            <label><span>Email</span><input name="email" type="email" required /></label>
            <label><span>Phone</span><input name="phone" type="tel" required /></label>
            <label><span>Subject</span><input name="subject" required /></label>
            <label className="full"><span>Message</span><textarea name="message" rows="6" required /></label>
            <button className="checkout-primary" type="submit">Submit Inquiry</button>
            {sent ? <p className="admin-status">Inquiry submitted. Our team will contact you soon.</p> : null}
          </form>

          <aside className="contact-card">
            <h2>Store Help</h2>
            <p>Tel: +91 9704888933<br />+91 9949779227</p>
            <p>Email: orders@sahanvi.com</p>
            <p>Flat-406 Vaishnovi TNR, Vasavi Colony, Saroor Nagar, Hyderabad, Telangana</p>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
