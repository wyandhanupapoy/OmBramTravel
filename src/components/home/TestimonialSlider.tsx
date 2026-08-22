'use client';

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  tour: { titleId: string; titleEn: string; titleZh: string };
  date: Date;
}

export function TestimonialSlider({ testimonials, locale }: { testimonials: Testimonial[], locale: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-pine-dark text-paper py-20 px-7 overflow-hidden">
      <div className="max-w-[1180px] mx-auto text-center">
        <h2 className="font-display text-4xl mb-12 text-beacon uppercase tracking-wide">
          {locale === "id" ? "Kata Mereka" : locale === "zh" ? "客户评价" : "What They Say"}
        </h2>
        
        <div className="relative h-[250px] md:h-[200px] flex items-center justify-center">
          {testimonials.map((t, idx) => {
            const title = locale === "en" ? t.tour.titleEn : locale === "zh" ? (t.tour.titleZh || t.tour.titleEn) : t.tour.titleId;
            return (
              <div 
                key={t.id} 
                className={`absolute w-full transition-all duration-700 ease-in-out ${
                  idx === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'
                }`}
              >
                <div className="flex justify-center gap-1 mb-6 text-yellow-400">
                  {Array.from({length: t.rating}).map((_, i) => (
                    <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-xl md:text-2xl italic leading-relaxed max-w-[800px] mx-auto mb-6 opacity-90">
                  "{t.reviewText}"
                </p>
                <div className="font-mono text-sm uppercase tracking-widest text-beacon">
                  {t.customerName} &mdash; <span className="opacity-75">{title}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-beacon w-6' : 'bg-line/30'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
