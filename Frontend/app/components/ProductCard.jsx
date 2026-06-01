"use client";

import { useState } from "react";
import { media } from "../data/media";

export default function ProductCard({ image = media.bannerPerson, name, price = "₹21,020" }) {
  const [isOpen, setIsOpen] = useState(false);
  const code = name.match(/S\d+$/)?.[0] || "";
  const sareeName = name.replace(/\sS\d+$/, "");

  return (
    <>
      <article className="product-card">
        <button className="product-card-trigger" type="button" onClick={() => setIsOpen(true)}>
          <span className="product-image">
            <img src={image} alt={sareeName} />
            <span className="wishlist-button" aria-hidden="true">♡</span>
            <span className="product-badge">New Arrival</span>
          </span>
          <span className="product-card-title">{sareeName} {code}</span>
          <span className="product-price">{price}</span>
        </button>
      </article>

      {isOpen ? (
        <div className="product-modal" role="dialog" aria-modal="true" aria-label={`${sareeName} details`}>
          <button className="product-modal-backdrop" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)} />
          <div className="product-modal-panel">
            <button className="product-modal-close" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)}>×</button>
            <div className="product-modal-image">
              <img src={image} alt={sareeName} />
              <span className="product-badge">New Arrival</span>
            </div>
            <div className="product-modal-copy">
              <p className="product-modal-kicker">Sahanvi New Arrival</p>
              <h2>{sareeName}</h2>
              <p className="product-modal-code">{code}</p>
              <p className="product-modal-price">{price}</p>
              <p className="product-modal-note">Handpicked saree with graceful detailing and timeless handloom-inspired elegance.</p>
              <div className="product-modal-actions">
                <button type="button">Add to Cart</button>
                <a href="/signup">Sign Up to Checkout</a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
