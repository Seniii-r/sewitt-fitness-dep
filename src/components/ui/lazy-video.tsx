"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

const DEFAULT_POSTER = "/img/Fitness.jpg";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  onPause?: () => void;
  /** When false, unloads video and resets to poster (e.g. user switched slide) */
  active?: boolean;
}

/**
 * Shows a poster/thumbnail until clicked. Does not request the video until then.
 * Uses preload="none", then sets src and plays in the same click handler (required for autoplay policy).
 */
export function LazyVideo({
  src,
  poster,
  className = "",
  onPause,
  active = true,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const posterUrl = poster || DEFAULT_POSTER;

  const handlePosterClick = useCallback(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    video.src = src;
    video.load();
    const played = video.play();
    if (played && typeof played.then === "function") {
      played.then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setIsPlaying(true);
    }
  }, [src, active]);

  // When active becomes false, unload and reset
  useEffect(() => {
    if (active) return;
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    onPause?.();
  }, [active, onPause]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.removeAttribute("src");
      video.load();
    }
  }, []);

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 ${className}`}>
      {/* Video element always in DOM when active so we can set src + play() in same user gesture */}
      {active ? (
        <video
          ref={videoRef}
          preload="none"
          playsInline
          muted={false}
          className="absolute inset-0 w-full h-full object-contain z-0"
          onEnded={handleVideoEnded}
          onPause={() => onPause?.()}
        />
      ) : null}

      {/* Poster + play button; hidden when video is playing */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePosterClick}
          className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400 z-10 bg-neutral-900"
          aria-label="Play video"
        >
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <span className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition transform hover:scale-110 hover:bg-white">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

export default LazyVideo;
