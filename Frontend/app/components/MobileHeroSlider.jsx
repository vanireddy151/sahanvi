"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileHeroSlider({ image, kicker, title, videoSrc }) {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = slides.indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (activeIndex === 1) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [activeIndex]);

  function goToSlide(index) {
    const slide = trackRef.current?.children[index];
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  return (
    <div className="mobile-hero-banner">
      <div className="mobile-hero-track" ref={trackRef}>
        <div className="mobile-hero-slide">
          <img src={image} alt="Sahanvi handloom sarees" />
          <div className="mobile-hero-banner-overlay" />
          <div className="mobile-hero-banner-copy">
            <p>{kicker}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="mobile-hero-slide">
          <video ref={videoRef} muted loop playsInline preload="metadata">
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="slider-dots">
        {[0, 1].map((index) => (
          <span
            key={index}
            className={index === activeIndex ? "active" : ""}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToSlide(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
