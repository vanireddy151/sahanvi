"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      video.muted = true;
    });
  }, []);

  function unmuteVideo() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      unmuteVideo();
    }
  }

  return (
    <div
      className="hero-video-card"
      aria-label="Sahanvi story video"
      role="button"
      tabIndex={0}
      onClick={unmuteVideo}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className="hero-video"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        controls={false}
        disablePictureInPicture
      >
        <source src={src} type="video/mp4" />
      </video>
      <span className="video-sheen"></span>
    </div>
  );
}
