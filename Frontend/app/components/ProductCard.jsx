"use client";

import { useState, useEffect, useRef } from "react";
import { media } from "../data/media";

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
  const [splashPhase, setSplashPhase] = useState("gone"); // gone → visible → sliding → gone
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeImage, setActiveImage] = useState(image);
  const splashTimers = useRef([]);
  const code = name.match(/S\d+$/)?.[0] || "";
  const sareeName = name.replace(/\sS\d+$/, "");
  const cartItem = { name: sareeName, code, price, image };
  const gallery = [image, palluImageUrl, borderImageUrl, bodyImageUrl].filter(Boolean);

  function clearSplashTimers() {
    splashTimers.current.forEach(clearTimeout);
    splashTimers.current = [];
  }

  function openModal() {
    setActiveImage(image);
    setIsOpen(true);
    setSplashPhase("visible");
    clearSplashTimers();
    splashTimers.current = [
      setTimeout(() => setSplashPhase("sliding"), 4400),
      setTimeout(() => setSplashPhase("gone"), 5100)
    ];
  }

  function skipProductSplash() {
    clearSplashTimers();
    setSplashPhase("sliding");
    splashTimers.current = [setTimeout(() => setSplashPhase("gone"), 600)];
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
        <button className="product-card-trigger" type="button" onClick={openModal}>
          <span className="product-image">
            <img src={image} alt={sareeName} />
            <span className="product-badge">New Arrival</span>
          </span>
          <span className="product-card-title">{sareeName}</span>
          {code ? <span className="product-card-code">{code}</span> : null}
          <span className="product-price">{price}</span>
        </button>
      </article>

      {splashPhase !== "gone" ? (
        <div className={`product-splash product-splash--${splashPhase}`}>
          <img className="product-splash-bg" src={image} alt={sareeName} />
          <div className="product-splash-overlay" />
          <div className="product-splash-copy">
            <p className="product-splash-kicker">Sahanvi New Arrival</p>
            <h2 className="product-splash-title">{sareeName}</h2>
            <p className="product-splash-code">{code}</p>
            <p className="product-splash-price">{price}</p>
            {fabric ? <p className="product-splash-detail">{fabric}</p> : null}
          </div>
          <button className="collection-splash-skip" type="button" onClick={skipProductSplash}>
            Skip intro
          </button>
          <div className="collection-splash-bar">
            <div className="collection-splash-bar-fill" />
          </div>
        </div>
      ) : null}

      {isOpen ? (
        <div className="product-modal" role="dialog" aria-modal="true" aria-label={`${sareeName} details`}>
          <button className="product-modal-backdrop" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)} />
          <div className="product-modal-panel">
            <button className="product-modal-close" type="button" aria-label="Close product details" onClick={() => setIsOpen(false)}>×</button>
            <div className="product-modal-image">
              <img src={activeImage} alt={sareeName} />
              <span className="product-badge">New Arrival</span>
            </div>
            <div className="product-modal-copy">
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
              <p className="product-modal-kicker">Sahanvi New Arrival</p>
              <h2>{sareeName}</h2>
              <p className="product-modal-code">{code}</p>
              <p className="product-modal-price">{price}</p>
              <p className="product-modal-note">Handpicked saree with graceful detailing and timeless handloom-inspired elegance.</p>
              <dl className="product-detail-list">
                <div><dt>Fabric</dt><dd>{fabric || "Silk blend with handloom-inspired finish"}</dd></div>
                <div><dt>Occasion</dt><dd>{occasion || "Wedding, festive, gifting, and elegant celebrations"}</dd></div>
                <div><dt>Includes</dt><dd>Saree with blouse piece where applicable</dd></div>
                <div><dt>Care</dt><dd>Dry clean recommended</dd></div>
              </dl>
              <p className="product-service-points">Secure checkout &middot; Carefully packed &middot; Easy returns</p>
              <div className="product-modal-actions">
                <button type="button" onClick={startCartCheckout}>Add to Cart</button>
                <button type="button" onClick={addItemToWishlist}>Save Wishlist</button>
                <a href="/cart">View Cart</a>
              </div>
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
