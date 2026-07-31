"use client";

export default function CheckoutModal({ open, onClose, otpSent, otp, setOtp, onSendOtp, onVerifyOtp, onSignInClick }) {
  if (!open) return null;

  return (
    <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Quick OTP signup">
      <button className="product-modal-backdrop" type="button" aria-label="Close checkout" onClick={onClose} />
      <div className="checkout-modal-panel">
        <button className="product-modal-close" type="button" aria-label="Close checkout" onClick={onClose}>×</button>
        <p className="product-modal-kicker">Quick Checkout</p>
        <h2>Sign up with OTP</h2>
        <p className="checkout-help">Please sign in or register with OTP before adding this saree to cart.</p>
        {!otpSent ? (
          <form className="otp-form" onSubmit={onSendOtp}>
            <label><span>Name</span><input name="name" required /></label>
            <label><span>Email</span><input name="email" type="email" required /></label>
            <label><span>Mobile Number</span><input name="phone" type="tel" pattern="[0-9]{10}" placeholder="10 digit mobile number" required /></label>
            <label><span>Delivery Address <small>(optional now)</small></span><textarea name="address" rows="3" placeholder="You can add this later while ordering"></textarea></label>
            <p className="member-copy">Already registered? <a href="/login?returnTo=/cart" onClick={onSignInClick}>Sign in with mobile</a></p>
            <button className="checkout-primary" type="submit">Send OTP</button>
          </form>
        ) : (
          <form className="otp-form" onSubmit={onVerifyOtp}>
            <label><span>Enter OTP</span><input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength="6" required /></label>
            <button className="checkout-primary" type="submit">Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  );
}
