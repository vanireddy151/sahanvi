"use client";

import { useRouter } from "next/navigation";
import { media } from "../data/media";
import { useCartCheckout } from "./useCartCheckout";
import CheckoutModal from "./CheckoutModal";

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
  const router = useRouter();
  const code = name.match(/S\d+$/)?.[0] || "";
  const sareeName = name.replace(/\sS\d+$/, "");
  const cartItem = { name: sareeName, code, price, image };

  const { checkoutOpen, setCheckoutOpen, otpSent, otp, setOtp, startCartCheckout, sendOtp, verifyOtp, savePendingCartItem } =
    useCartCheckout(cartItem);

  function goToProduct() {
    sessionStorage.setItem(
      "sahanvi-active-product",
      JSON.stringify({ code, name: sareeName, price, image, palluImageUrl, borderImageUrl, bodyImageUrl, fabric, occasion })
    );
    router.push(`/product/${encodeURIComponent(code)}`);
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToProduct();
    }
  }

  function quickAdd(event) {
    event.stopPropagation();
    startCartCheckout();
  }

  return (
    <>
      <article className="product-card">
        <div className="product-card-trigger" role="button" tabIndex={0} onClick={goToProduct} onKeyDown={handleTriggerKeyDown}>
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
