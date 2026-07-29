"use client";

import { useRef } from "react";
import { apiUrl } from "../lib/api";

export default function ClientDiariesSlider({ testimonials }) {
  const trackRef = useRef(null);

  function slide(direction) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".happy-customer-card");
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="happy-customers-slider">
      <button
        type="button"
        className="happy-customers-arrow happy-customers-arrow-prev"
        aria-label="Previous photos"
        onClick={() => slide(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="happy-customers-grid" ref={trackRef}>
        {testimonials.map((item) => (
          <div className="happy-customer-card" key={item._id}>
            <img src={apiUrl(item.imageUrl)} alt={item.caption || "A Sahanvi client"} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="happy-customers-arrow happy-customers-arrow-next"
        aria-label="Next photos"
        onClick={() => slide(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
