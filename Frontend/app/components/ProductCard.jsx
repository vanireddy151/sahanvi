"use client";

import { useState } from "react";
import { media } from "../data/media";

function originalPriceFor(priceStr) {
  const numeric = Number(String(priceStr).replace(/[^\d]/g, ""));
  if (!numeric) return "";
  const original = Math.round((numeric / 0.95) / 10) * 10;
  return `₹${original.toLocaleString("en-IN")}`;
}

export default function ProductCard({
  image = media.bannerPerson,
  name,
  price = "₹21,020",
  palluImageUrl = "",
  borderImageUrl = "",
  bodyImageUrl = "",
  fabric = "",
  occasion = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeImage, setActiveImage] = useState(image);
  const [addedMessage, setAddedMessage] = useState("");
  const code = name.match(/S\d+$/)?.[0] || "";
  const sareeName = name.replace(/\sS\d+$/, "");
  const cartItem = { name: sareeName, code, price, image };
  const gallery = [image, palluImageUrl, borderImageUrl, bodyImageUrl].filter(Boolean);

  function openModal() {
    setActiveImage(image);
    setIsOpen(true);
    setAddedMessage("");
  }

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    } catch {
      return null;
    }
  }

  function addItemToCart() {
    const existingCart = JSON.parse(localStorage.getItem("sahanvi-cart") || "[]");
    const nextCart = [...existingCart.filter((item) => item.code !== code), cartItem];
    localStorage.setItem("sahanvi-cart", JSON.stringify(nextCart));
  }

  function savePendingCartItem() {
    localStorage.setItem("sahanvi-pending-cart-item", JSON.stringify(cartItem));
  }

  function addItemToWishlist() {
    const existingWishlist = JSON.parse(localStorage.getItem("sahanvi-wishlist") || "[]");
    const nextWishlist = [...existingWishlist.filter((item) => item.code !== code), cartItem];
    localStorage.setItem("sahanvi-wishlist", JSON.stringify(nextWishlist));
    alert("Saved to wishlist.");
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  }

  function quickAdd(event) {
    event.stopPropagation();
    startCartCheckout();
  }

  function startCartCheckout() {
    const auth = getAuth();
    if (auth?.user) {
      addItemToCart();
      window.location.href = "/cart";
      return;
    }

    savePendingCartItem();
    setCheckoutOpen(true);
  }

  function addToCartStay() {
    const auth = getAuth();
    if (auth?.user) {
      addItemToCart();
      setAddedMessage("Added to cart.");
      return;
    }

    savePendingCartItem();
    setCheckoutOpen(true);
  }

  function sendOtp(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem("sahanvi-pending-customer", JSON.stringify(customer));
    localStorage.setItem("sahanvi-demo-otp", generatedOtp);
    setOtpSent(true);
    alert(`OTP sent. Demo OTP: ${generatedOtp}`);
  }

  function verifyOtp(event) {
    event.preventDefault();
    if (otp !== localStorage.getItem("sahanvi-demo-otp")) {
      alert("Please enter the correct OTP.");
      return;
    }

    const customer = JSON.parse(localStorage.getItem("sahanvi-pending-customer") || "{}");
    localStorage.setItem("sahanvi-auth", JSON.stringify({ user: { ...customer, role: "customer" } }));
    localStorage.setItem("sahanvi-customer-profile", JSON.stringify({ ...customer, role: "customer" }));
    addItemToCart();
    localStorage.removeItem("sahanvi-pending-customer");
    localStorage.removeItem("sahanvi-pending-cart-item");
    localStorage.removeItem("sahanvi-demo-otp");
    window.location.href = "/cart";
  }

  return (
    <>
      <article className="product-card">
        <div className="product-card-trigger" role="button" tabIndex={0} onClick={openModal} onKeyDown={handleTriggerKeyDown}>
          <span className="product-image">
            <img src={image} alt={sareeName} />
            <span className="product-discount-badge">5% Off</span>
            <button type="button" className="product-quick-add" aria-label={`Add ${sareeName} to cart`} onClick={quickAdd}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6h15l-1.8 8.5H8.2L6 3H3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="20" r="1.7" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="20" r="1.7" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </span>
          <span className="product-card-title">{sareeName}</span>
          {code ? <span className="product-card-code">{code}</span> : null}
          <span className="product-price-row">
            <span className="product-price">{price}</span>
            <span className="product-price-original">{originalPriceFor(price)}</span>
          </span>
        </div>
      </article>

      {isOpen ? (
        <div className="product-modal" role="dialog" aria-modal="true" aria-label={`${sareeName} details`}>
          <button className="product-modal-backdrop" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)} />
          <div className="product-modal-panel">
            <button className="product-modal-close" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)}>×</button>
            <div className="product-modal-image-col">
              {gallery.length > 1 ? (
                <div className="product-modal-thumbs">
                  {gallery.map((thumb) => (
                    <button
                      key={thumb}
                      type="button"
                      className={`product-modal-thumb${thumb === activeImage ? " active" : ""}`}
                      onClick={() => setActiveImage(thumb)}
                      aria-label="View image"
                    >
                      <img src={thumb} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
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

              <div className="product-modal-actions">
                <button type="button" className="product-buy-now" onClick={startCartCheckout}>Buy it now</button>
                <button type="button" className="product-add-cart" onClick={addToCartStay}>Add to Cart</button>
              </div>
              <p className="product-service-points">Secure checkout &middot; Carefully packed &middot; Easy returns</p>
              {addedMessage ? <p className="product-added-message">{addedMessage}</p> : null}
              <a className="product-modal-view-cart" href="/cart">View Cart</a>
            </div>
          </div>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Quick OTP signup">
          <button className="product-modal-backdrop" type="button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)} />
          <div className="checkout-modal-panel">
            <button className="product-modal-close" type="button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}>×</button>
            <p className="product-modal-kicker">Quick Checkout</p>
            <h2>Sign up with OTP</h2>
            <p className="checkout-help">Please sign in or register with OTP before adding this saree to cart.</p>
            {!otpSent ? (
              <form className="otp-form" onSubmit={sendOtp}>
                <label><span>Name</span><input name="name" required /></label>
                <label><span>Email</span><input name="email" type="email" required /></label>
                <label><span>Mobile Number</span><input name="phone" type="tel" pattern="[0-9]{10}" placeholder="10 digit mobile number" required /></label>
                <label><span>Delivery Address <small>(optional now)</small></span><textarea name="address" rows="3" placeholder="You can add this later while ordering"></textarea></label>
                <p className="member-copy">Already registered? <a href="/login?returnTo=/cart" onClick={savePendingCartItem}>Sign in with mobile</a></p>
                <button className="checkout-primary" type="submit">Send OTP</button>
              </form>
            ) : (
              <form className="otp-form" onSubmit={verifyOtp}>
                <label><span>Enter OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength="6" required /></label>
                <button className="checkout-primary" type="submit">Verify & Continue</button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
