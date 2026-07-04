"use client";

import { useState, useEffect, useRef } from "react";

export default function CollectionSplash({ image, type, description }) {
  const [phase, setPhase] = useState("visible"); // visible → sliding → gone
  const timers = useRef([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    // Skip splash when navigating from the site's own nav menu
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("sahanvi-nav-click")) {
      sessionStorage.removeItem("sahanvi-nav-click");
      setPhase("gone");
      return;
    }
    timers.current = [
      setTimeout(() => setPhase("sliding"), 4400),
      setTimeout(() => setPhase("gone"), 5100)
    ];
    return clearTimers;
  }, []);

  function slideUp(scrollToProducts = false) {
    clearTimers();
    setPhase("sliding");
    timers.current = [setTimeout(() => {
      setPhase("gone");
      if (scrollToProducts) {
        const target = document.getElementById("collection-products");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    }, 700)];
  }

  if (phase === "gone") return null;

  return (
    <div className={`collection-splash${phase === "sliding" ? " collection-splash--sliding" : ""}`}>
      <img className="collection-splash-bg" src={image} alt={type} />
      <div className="collection-splash-overlay" />
      <div className="collection-splash-copy">
        <p className="collection-splash-kicker">Sahanvi Collection</p>
        <h1 className="collection-splash-title">{type}</h1>
        <p className="collection-splash-desc">{description}</p>
        <button className="collection-splash-shopnow" type="button" onClick={() => slideUp(true)}>
          Shop Now
        </button>
      </div>
      <button className="collection-splash-skip" type="button" onClick={slideUp}>
        Skip intro
      </button>
      <div className="collection-splash-bar">
        <div className="collection-splash-bar-fill" />
      </div>
    </div>
  );
}
