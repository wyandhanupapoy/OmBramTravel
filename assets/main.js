/* ============================================================
   OM BRAM — Main Script
   assets/main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile menu toggle ---------- */
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      navLinks.style.cssText += open
        ? ''
        : 'position:absolute; top:74px; left:0; right:0; background:var(--pine-dark); flex-direction:column; padding:24px 28px; gap:20px; z-index:45;';
    });
  }

  /* ---------- Copy promo code ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-copy');
      navigator.clipboard?.writeText(code).catch(() => {});
      const original = btn.textContent;
      const doneText = btn.getAttribute('data-copy-done') || 'Disalin!';
      btn.textContent = doneText;
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
})();
