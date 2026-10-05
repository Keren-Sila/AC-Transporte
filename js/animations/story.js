/**
 * AC TRANSPORTE — Scroll story controller
 * One rAF loop for the whole page, with full/lite/reduced motion profiles.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function initStoryMotion() {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const profile = root.dataset.motion || (reduceMotion ? 'reduced' : 'full');
  const header = document.querySelector('.header-site');
  const hero = document.querySelector('.ac-hero-instagram');
  const truck = hero?.querySelector('.ac-hero-truck-wrap');
  const telemetry = hero?.querySelector('.ac-hero-telemetry span');
  const road = hero?.querySelector('.road-dashed-line');
  const sections = [...document.querySelectorAll('.ac-sec, .quote-section, .inner-hero')];
  const innerHeroes = [...document.querySelectorAll('.inner-hero')];

  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (reduceMotion || profile === 'reduced') return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;

    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - viewport * .42, 1);
      const progress = clamp((-heroRect.top) / travel);
      hero.style.setProperty('--hero-progress', progress.toFixed(3));

      if (truck) {
        const motionScale = profile === 'lite' || window.innerWidth <= 700 ? .58 : 1;
        const drive = Math.sin(progress * Math.PI);
        truck.style.setProperty('--truck-x', '0px');
        truck.style.setProperty('--truck-y', `${(-progress * 190 * motionScale).toFixed(2)}px`);
        truck.style.setProperty('--truck-scale', (1 + progress * .62 * motionScale).toFixed(3));
        truck.style.setProperty('--truck-rotate', `${(-drive * .22 * motionScale).toFixed(2)}deg`);
        if (telemetry) telemetry.textContent = `AC TRANSPORTE · ${Math.round(drive * 68 * motionScale)} KM/H`;
        if (road) road.style.setProperty('--road-offset-x', `${(-progress * 300).toFixed(1)}px`);
      }
    }

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      section.style.setProperty('--section-progress', progress.toFixed(3));
    });

    if (profile === 'full') {
      innerHeroes.forEach((innerHero) => {
        const rect = innerHero.getBoundingClientRect();
        const shiftX = clamp((rect.top / Math.max(viewport, 1)) * -9, -9, 9);
        const shiftY = clamp((rect.top / Math.max(viewport, 1)) * -6, -6, 6);
        innerHero.style.setProperty('--inner-shift-x', `${shiftX.toFixed(2)}px`);
        innerHero.style.setProperty('--inner-shift-y', `${shiftY.toFixed(2)}px`);
      });
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}
