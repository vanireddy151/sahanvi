"use client";

import { useState, useEffect } from "react";

export default function CollectionSplash({ image, type, description }) {
  const [phase, setPhase] = useState("visible"); // visible → fading → gone

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 4400);
    const goneTimer = setTimeout(() => setPhase("gone"), 5100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  function skip() {
    setPhase("fading");
    setTimeout(() => setPhase("gone"), 600);
  }

  if (phase === "gone") return null;

  return (
    <div className={`collection-splash${phase === "fading" ? " collection-splash--fading" : ""}`}>
      <img className="collection-splash-bg" src={image} alt={type} />
      <div className="collection-splash-overlay" />
      <div className="collection-splash-copy">
        <p className="collection-splash-kicker">Sahanvi Collection</p>
        <h1 className="collection-splash-title">{type}</h1>
        <p className="collection-splash-desc">{description}</p>
      </div>
      <button className="collection-splash-skip" type="button" onClick={skip}>
        Skip intro
      </button>
      <div className="collection-splash-bar">
        <div className="collection-splash-bar-fill" />
      </div>
    </div>
  );
}
