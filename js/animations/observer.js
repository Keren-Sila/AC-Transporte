/**
 * AC TRANSPORTE - IntersectionObserver Engine
 * Handles staggered scroll reveals with hardware-accelerated transitions.
 */

export function initObserver() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll([
    '.reveal-on-scroll', '.ac-rules li', '.feature-item', '.service-photo-card', '.value-item', '.contact-proof-card',
    '.inner-page .inner-hero-copy > *', '.inner-page .hero-aside',
    '.inner-page .section-heading-block', '.inner-page .story-grid > *', '.inner-page .principle-card',
    '.inner-page .service-detail-card', '.inner-page .service-process-layout > *', '.inner-page .service-process-list li',
    '.inner-page .fleet-card', '.inner-page .contact-channel-column', '.inner-page .contact-prep-card',
    '.inner-page .contact-channel', '.inner-page .tracking-how-layout > *', '.inner-page .tracking-how-list li',
    '.inner-page .inner-cta > *', '.inner-page .fleet-quote-layout > *',
    '.inner-page .contact-bottom-inner > *', '.inner-page .tracking-help-inner > *',
    '.ac-facts > div', '.ac-steps li', '.ac-three > *', '.quote-intro', '.calculator-card'
  ].join(', '));

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
    if (parent && (
      parent.classList.contains('ac-rules') || parent.classList.contains('service-photo-grid') || parent.classList.contains('feature-grid') ||
      parent.classList.contains('principle-grid') || parent.classList.contains('service-detail-grid') ||
      parent.classList.contains('service-process-list') || parent.classList.contains('fleet-card-grid') ||
      parent.classList.contains('contact-channel-list') || parent.classList.contains('tracking-how-list') ||
      parent.classList.contains('inner-hero-copy') || parent.classList.contains('ac-steps') ||
      parent.classList.contains('ac-facts') || parent.classList.contains('ac-three')
    )) {
      const childIndex = Array.from(parent.children).indexOf(el);
      el.dataset.staggerDelay = Math.min(childIndex, 4) * 95;
    }

    if (el.matches('.hero-aside, .service-detail-card, .fleet-card, .contact-prep-card, .ac-steps li')) el.dataset.reveal = 'scale';
    else if (el.matches('.story-grid > :first-child, .contact-main-grid > :first-child, .service-process-layout > :first-child, .tracking-how-layout > :first-child')) el.dataset.reveal = 'left';
    else if (el.matches('.story-grid > :last-child, .contact-main-grid > :last-child, .service-process-layout > :last-child, .tracking-how-layout > :last-child')) el.dataset.reveal = 'right';
    observer.observe(el);
  });
}
