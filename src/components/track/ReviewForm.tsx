"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function ReviewForm({ orderCode, initialRating, initialReview }: { orderCode: string; initialRating: number | null; initialReview: string | null }) {
  const t = useTranslations("track");
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>(initialReview || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(initialRating !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, rating, reviewText: review })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Gagal mengirim ulasan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm text-center">
        <h3 className="font-display text-xl text-pine-dark mb-4">Ulasan Anda</h3>
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? "#F59E0B" : "none"} stroke={star <= rating ? "#F59E0B" : "#cbd5e1"} strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
        </div>
        {review && <p className="text-ink-soft italic">"{review}"</p>}
      </div>
    );
  }

  return (
    <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm">
      <h3 className="font-display text-xl text-pine-dark mb-2 text-center">Beri Nilai Perjalanan Anda</h3>
      <p className="text-ink-soft text-sm text-center mb-6">Bagaimana pengalaman Anda bersama driver kami?</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex justify-center gap-2 mb-6" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
            >
              <svg 
                width="36" height="36" viewBox="0 0 24 24" 
                fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"} 
                stroke={(hoverRating || rating) >= star ? "#F59E0B" : "#cbd5e1"} 
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tulis ulasan tentang driver atau tur ini (opsional)..."
          className="w-full max-w-md border border-line rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-pine min-h-[100px] resize-y"
        />

        <button 
          type="submit" 
          disabled={rating === 0 || isSubmitting}
          className="bg-pine-dark text-paper font-semibold tracking-wide px-8 py-3 rounded disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
        </button>
      </form>
    </div>
  );
}
