"use client";

import Link from "next/link";
import { media } from "../data/media";

function markNavClick() {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("sahanvi-nav-click", "1");
  }
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-column footer-about">
        <Link className="footer-brand logo-link" href="/">
          <img src={media.logo} alt="Sahanvi by Swapnavani" />
        </Link>
        <p>Weavers of heritage and elegance. Every saree carries a thread of tradition, handcrafted for women who value authenticity.</p>
      </div>
      <div className="footer-column">
        <h2>Explore</h2>
        <Link href="/new-arrivals">New Arrivals</Link>
        <Link href="/Kanjivaram%20Silks" onClick={markNavClick}>Kanjivaram Silks</Link>
        <Link href="/Pochampally" onClick={markNavClick}>Pochampally</Link>
        <Link href="/Gadwal%20Pattu" onClick={markNavClick}>Gadwal</Link>
        <Link href="/about">About Us</Link>
      </div>
      <div className="footer-column">
        <h2>Support</h2>
        <Link href="/shipping-payments">Shipping & Payments</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-conditions">Terms & Conditions</Link>
        <Link href="/return-exchange-policy">Return & Exchange Policy</Link>
        <Link href="/contact">Contact Support</Link>
      </div>
      <div className="footer-column footer-contact">
        <h2>Address</h2>
        <p>Flat-406 Vaishnovi TNR<br />Vasavi Colony, Saroor Nagar,<br />Hyderabad, Telangana</p>
        <h2>Contact</h2>
        <p>Tel: +91 9704888933<br />+91 9949779227<br />Email: orders@sahanvi.com</p>
      </div>
    </footer>
  );
}
