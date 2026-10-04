/**
 * AC TRANSPORTE — Scroll story controller
 * Motion tied to the user's reading position, with bounded movement and reduced-motion support.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function initStoryMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initHeaderState();

  if (reduceMotion) return;

  initHeroScrollStory();
  initSectionProgress();
  initInnerHeroParallax();
}

function initHeaderState() {
  const header = document.querySelector('.header-site');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initHeroScrollStory() {
  const hero = document.querySelector('.ac-hero');
  if (!hero) return;

  const truck = hero.querySelector('.ac-hero-truck-wrap');
  let frame = 0;

  const update = () => {
    frame = 0;
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(hero.offsetHeight - window.innerHeight * .42, 1);
    const progress = clamp((-rect.top) / travel);
    hero.style.setProperty('--hero-progress', progress.toFixed(3));

    if (truck) {
      const drift = progress * -48;
      const lift = Math.sin(progress * Math.PI) * 11;
      const tilt = progress * -1.6;
      truck.style.setProperty('--truck-x', `${drift.toFixed(2)}px`);
      truck.style.setProperty('--truck-y', `${lift.toFixed(2)}px`);
      truck.style.setProperty('--truck-rotate', `${tilt.toFixed(2)}deg`);
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}

function initSectionProgress() {
  const sections = document.querySelectorAll('.ac-sec, .quote-section, .inner-hero');
  if (!sections.length) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      section.style.setProperty('--section-progress', progress.toFixed(3));
    });
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}

function initInnerHeroParallax() {
  const heroes = document.querySelectorAll('.inner-hero');
  if (!heroes.length) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    heroes.forEach((hero) => {
      const rect = hero.getBoundingClientRect();
      const shiftX = clamp((rect.top / Math.max(window.innerHeight, 1)) * -7, -7, 7);
      const shiftY = clamp((rect.top / Math.max(window.innerHeight, 1)) * -5, -5, 5);
      hero.style.setProperty('--inner-shift-x', `${shiftX.toFixed(2)}px`);
      hero.style.setProperty('--inner-shift-y', `${shiftY.toFixed(2)}px`);
    });
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}
