"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const updateVideo = () => {
      frameRef.current = null;
      if (!video.duration || !Number.isFinite(video.duration)) return;

      const bounds = section.getBoundingClientRect();
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const travelled = Math.min(Math.max(-bounds.top, 0), scrollableDistance);
      const nextProgress = travelled / scrollableDistance;

      video.currentTime = nextProgress * video.duration;
      setProgress(nextProgress);
    };

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateVideo);
      }
    };

    const handleLoadedMetadata = () => {
      setIsReady(true);
      requestUpdate();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[260vh] bg-pine-dark text-paper">
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          src="/scrollvideo.webm"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-pine-dark/55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,48,36,0.95),rgba(18,48,36,0.45),rgba(18,48,36,0.7))]" />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col justify-between px-7 py-16 lg:py-24">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-beacon">Scroll the journey</span>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(34px,5vw,64px)] uppercase leading-[1.02] tracking-tight">
              Bandung bergerak bersama Anda.
            </h2>
          </div>

          <div className="flex items-end justify-between gap-8">
            <p className="max-w-sm text-lg text-white/75">
              Setiap gerakan scroll membawa perjalanan maju. Tarik kembali untuk mengulang rute.
            </p>
            <div className="hidden text-right sm:block">
              <span className="font-mono text-3xl text-beacon">{Math.round(progress * 100)}%</span>
              <span className="mt-1 block font-display text-xs uppercase tracking-widest text-white/60">Journey progress</span>
            </div>
          </div>
        </div>

        {!isReady && (
          <div className="absolute bottom-8 left-7 font-mono text-[10px] uppercase tracking-widest text-white/50">Loading journey film...</div>
        )}
      </div>
    </section>
  );
}
