/**
 * AC TRANSPORTE - IntersectionObserver Engine
 * Handles staggered scroll reveals with hardware-accelerated transitions.
 */

export function initObserver() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .ac-rules li, .feature-item, .service-photo-card, .value-item, .contact-proof-card');

  if (isReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Calculate stagger delay if index dataset is present
        const delay = entry.target.dataset.staggerDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
    // Add staggered delay for sibling lists/grids
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('ac-rules') || parent.classList.contains('service-photo-grid') || parent.classList.contains('feature-grid'))) {
      const childIndex = Array.from(parent.children).indexOf(el);
      el.dataset.staggerDelay = childIndex * 120; // 120ms stagger
    }
    observer.observe(el);
  });
}
