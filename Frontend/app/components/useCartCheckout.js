"use client";

import { useState } from "react";

export function useCartCheckout(cartItem) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    } catch {
      return null;
    }
  }

  function addItemToCart() {
    const existingCart = JSON.parse(localStorage.getItem("sahanvi-cart") || "[]");
    const nextCart = [...existingCart.filter((item) => item.code !== cartItem.code), cartItem];
    localStorage.setItem("sahanvi-cart", JSON.stringify(nextCart));
  }

  function savePendingCartItem() {
    localStorage.setItem("sahanvi-pending-cart-item", JSON.stringify(cartItem));
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

  function addToCartStay(onAdded) {
    const auth = getAuth();
    if (auth?.user) {
      addItemToCart();
      onAdded?.();
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

  return {
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
  };
}
