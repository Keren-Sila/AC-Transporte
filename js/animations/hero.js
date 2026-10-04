/**
 * AC TRANSPORTE - Hero Cinematic Entrance & Mouse Parallax
 */

export function initHeroAnimations() {
  const heroSection = document.querySelector('.hero-section, .ac-hero');
  if (!heroSection) return;

  // 1. Cinematic Entrance Sequence (~1 second total)
  const header = document.querySelector('.header-site');
  const kicker = heroSection.querySelector('.hero-kicker, .section-tag');
  const headline = heroSection.querySelector('h1, .hero-headline');
  const subline = heroSection.querySelector('p, .hero-subline');
  const actions = heroSection.querySelector('.ac-actions, .hero-actions-row');
  const truckImg = heroSection.querySelector('.hero-truck-graphic, .about-photo img, .hero-backdrop');

  // Set initial states for entrance
  const elements = [header, kicker, headline, subline, actions, truckImg].filter(Boolean);
  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  // Trigger sequence
  setTimeout(() => {
    if (header) { header.style.opacity = '1'; header.style.transform = 'translateY(0)'; }
  }, 100);

  setTimeout(() => {
    if (kicker) { kicker.style.opacity = '1'; kicker.style.transform = 'translateY(0)'; }
    if (headline) { headline.style.opacity = '1'; headline.style.transform = 'translateY(0)'; }
  }, 300);

  setTimeout(() => {
    if (subline) { subline.style.opacity = '1'; subline.style.transform = 'translateY(0)'; }
  }, 500);

  setTimeout(() => {
    if (actions) { actions.style.opacity = '1'; actions.style.transform = 'translateY(0)'; }
    if (truckImg) { truckImg.style.opacity = '1'; truckImg.style.transform = 'translateY(0)'; }
  }, 700);

  // 2. Mouse Parallax Effect on Hero Graphic
  const parallaxTarget = heroSection.querySelector('.hero-truck-graphic, .hero-backdrop');
  if (!parallaxTarget || window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    targetX = (e.clientX - centerX) * 0.035; // subtle 15px max shift
    targetY = (e.clientY - centerY) * 0.025;
  });

  heroSection.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function renderParallax() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    if (parallaxTarget) {
      parallaxTarget.style.transform = `translate3d(${mouseX.toFixed(2)}px, ${mouseY.toFixed(2)}px, 0)`;
    }
    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}
