/**
 * AC TRANSPORTE - Card Micro-interactions & Quem Somos Slow Zoom
 */

export function initCardAnimations() {
  // 1. Service Cards Hover Interativo
  const serviceCards = document.querySelectorAll('.service-photo-card, .ac-rules li');
  
  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('is-hovered');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
    });
  });

  // 2. Quem Somos Image Slow Zoom (100% -> 103%) on Scroll
  const quemSomosPhoto = document.querySelector('.about-photo img, .ac-sec#sobre img');
  if (!quemSomosPhoto) return;

  if ('IntersectionObserver' in window) {
    const zoomObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          quemSomosPhoto.classList.add('zoom-active');
        } else {
          quemSomosPhoto.classList.remove('zoom-active');
        }
      });
    }, { threshold: 0.3 });

    zoomObserver.observe(quemSomosPhoto);
  }
}
