"use client";

import { useState } from "react";
import { useCartCheckout } from "./useCartCheckout";
import CheckoutModal from "./CheckoutModal";

function originalPriceFor(priceStr) {
  const numeric = Number(String(priceStr).replace(/[^\d]/g, ""));
  if (!numeric) return "";
  const original = Math.round((numeric / 0.95) / 10) * 10;
  return `₹${original.toLocaleString("en-IN")}`;
}

export default function ProductDetail({ product }) {
  const { code, name: sareeName, price, image, palluImageUrl, borderImageUrl, bodyImageUrl, fabric, occasion } = product;
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");
  const cartItem = { name: sareeName, code, price, image };
  const gallery = [image, palluImageUrl || image, borderImageUrl || image, bodyImageUrl || image];
  const activeImage = gallery[activeIndex];

  const {
    checkoutOpen,
    setCheckoutOpen,
    otpSent,
    otp,
    setOtp,
    startCartCheckout,
    addToCartStay,
    sendOtp,
    verifyOtp,
    savePendingCartItem
  } = useCartCheckout(cartItem);

  function addItemToWishlist() {
    const existingWishlist = JSON.parse(localStorage.getItem("sahanvi-wishlist") || "[]");
    const nextWishlist = [...existingWishlist.filter((item) => item.code !== code), cartItem];
    localStorage.setItem("sahanvi-wishlist", JSON.stringify(nextWishlist));
    alert("Saved to wishlist.");
  }

  return (
    <>
      <div className="product-detail-panel">
        <div className="product-modal-image-col">
          <div className="product-modal-thumbs">
            {gallery.map((thumb, index) => (
              <button
                key={index}
                type="button"
                className={`product-modal-thumb${index === activeIndex ? " active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label="View image"
              >
                <img src={thumb} alt="" />
              </button>
            ))}
          </div>
          <div className="product-modal-image">
            <img src={activeImage} alt={sareeName} />
            <span className="product-badge">New Arrival</span>
          </div>
        </div>

        <div className="product-modal-copy">
          <button type="button" className="product-modal-wishlist" onClick={addItemToWishlist} aria-label="Save to wishlist">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.9c-1.5-1.8-4.2-1.7-5.8.1L12 9.1 9 6C7.4 4.2 4.7 4.1 3.2 5.9 1.6 7.8 2 10.6 3.8 12.3L12 20l8.2-7.7c1.8-1.7 2.2-4.5.6-6.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
          <p className="product-modal-kicker">Sahanvi New Arrival</p>
          <h2>{sareeName}</h2>
          <p className="product-modal-code">{code}</p>
          <div className="product-modal-price-row">
            <span className="product-modal-price">{price}</span>
            <span className="product-modal-price-original">{originalPriceFor(price)}</span>
            <span className="product-modal-discount">5% Off</span>
          </div>
          <p className="product-modal-note">Handpicked saree with graceful detailing and timeless handloom-inspired elegance.</p>

          <p className="product-modal-section-label">Specifications</p>
          <dl className="product-detail-list">
            <div><dt>Fabric</dt><dd>{fabric || "Silk blend with handloom-inspired finish"}</dd></div>
            <div><dt>Occasion</dt><dd>{occasion || "Wedding, festive, gifting, and elegant celebrations"}</dd></div>
            <div><dt>Includes</dt><dd>Saree with blouse piece where applicable</dd></div>
            <div><dt>Care</dt><dd>Dry clean recommended</dd></div>
          </dl>

          <p className="product-modal-section-label">Delivery &amp; Shipping</p>
          <ul className="product-delivery-info">
            <li>Free shipping across India</li>
            <li>Estimated delivery in 5&ndash;7 business days</li>
            <li>Cash on delivery available on select pin codes</li>
          </ul>

          <p className="product-modal-section-label">Return Policy</p>
          <p className="product-return-policy">
            Please note that once the falls or blouse is stitched, we will be unable to exchange the product.
          </p>

          <div className="product-modal-actions">
            <button type="button" className="product-buy-now" onClick={startCartCheckout}>Buy it now</button>
            <button
              type="button"
              className="product-add-cart"
              onClick={() => addToCartStay(() => setAddedMessage("Added to cart."))}
            >
              Add to Cart
            </button>
          </div>
          <p className="product-service-points">Secure checkout &middot; Carefully packed &middot; Easy returns</p>
          {addedMessage ? <p className="product-added-message">{addedMessage}</p> : null}
          <a className="product-modal-view-cart" href="/cart">View Cart</a>
        </div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        otpSent={otpSent}
        otp={otp}
        setOtp={setOtp}
        onSendOtp={sendOtp}
        onVerifyOtp={verifyOtp}
        onSignInClick={savePendingCartItem}
      />
    </>
  );
}
