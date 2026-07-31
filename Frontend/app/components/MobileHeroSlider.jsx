"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const IMAGE_DURATION_MS = 4500;

export default function MobileHeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  const slide = slides[activeIndex];

  const goTo = useCallback(
    (index) => {
      const total = slides.length;
      setProgress(0);
      setActiveIndex((index + total) % total);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slide.type !== "image") return undefined;

    setProgress(0);
    const start = performance.now();

    function tick(now) {
      const pct = Math.min((now - start) / IMAGE_DURATION_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        goTo(activeIndex + 1);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slide.type]);

  useEffect(() => {
    if (slide.type !== "video") return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    setProgress(0);

    function handleTimeUpdate() {
      if (!video.duration) return;
      setProgress(video.currentTime / video.duration);
    }

    function handleEnded() {
      goTo(activeIndex + 1);
    }

    video.currentTime = 0;
    video.play().catch(() => {});
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slide.type]);

  return (
    <div className="mobile-hero-banner">
      <div className="mobile-hero-progress">
        {slides.map((item, index) => (
          <div className="mobile-hero-progress-segment" key={item.src}>
            <div
              className="mobile-hero-progress-fill"
              style={{
                width: index < activeIndex ? "100%" : index === activeIndex ? `${progress * 100}%` : "0%"
              }}
            />
          </div>
        ))}
      </div>

      <div className="mobile-hero-story-media">
        {slide.type === "video" ? (
          <video key={slide.src} ref={videoRef} muted playsInline preload="auto">
            <source src={slide.src} type="video/mp4" />
          </video>
        ) : (
          <img key={slide.src} src={slide.src} alt="Sahanvi handloom sarees" />
        )}
        <div className="mobile-hero-banner-overlay" />
        {slide.kicker || slide.title ? (
          <div className="mobile-hero-banner-copy">
            {slide.kicker ? <p>{slide.kicker}</p> : null}
            {slide.title ? <h2>{slide.title}</h2> : null}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="mobile-hero-tap-zone mobile-hero-tap-zone-left"
        aria-label="Previous slide"
        onClick={() => goTo(activeIndex - 1)}
      />
      <button
        type="button"
        className="mobile-hero-tap-zone mobile-hero-tap-zone-right"
        aria-label="Next slide"
        onClick={() => goTo(activeIndex + 1)}
      />
    </div>
  );
}
