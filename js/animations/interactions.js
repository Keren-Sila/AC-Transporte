/**
 * Small pointer and scroll interactions shared across the site.
 * All effects are opt-in for fine pointers and disabled for reduced motion.
 */

const HERO_PARTICLES = [
  ['12%', '24%', 'dot', '2px', '-1.2s', '9px'], ['26%', '68%', 'dot', '3px', '-4.4s', '14px'],
  ['43%', '18%', 'orb', '13px', '-6.8s', '20px'], ['58%', '72%', 'dot', '2px', '-2.7s', '12px'],
  ['69%', '28%', 'dot', '3px', '-8.2s', '17px'], ['82%', '56%', 'orb', '9px', '-3.6s', '26px'],
  ['91%', '18%', 'dot', '2px', '-5.1s', '11px'], ['36%', '42%', 'dot', '2px', '-7.5s', '8px'],
  ['52%', '52%', 'orb', '7px', '-1.9s', '22px'], ['76%', '78%', 'dot', '2px', '-9.1s', '15px'],
  ['18%', '84%', 'dot', '3px', '-2.1s', '10px'], ['62%', '12%', 'dot', '2px', '-5.9s', '13px'],
  ['88%', '72%', 'orb', '12px', '-6.2s', '24px'], ['47%', '88%', 'dot', '2px', '-3.3s', '9px']
];

export function initMotionInteractions() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionLite = document.documentElement.dataset.motion === 'lite';
  initHeroTruck(reduceMotion, motionLite);
  initHeroParticles(reduceMotion, motionLite);
  if (reduceMotion) return;

  if (!motionLite) initScrollProgress();

  if (motionLite || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  initPointerSpotlights();
  initHeroParallax();
}

function initHeroTruck(reduceMotion, motionLite) {
  const hero = document.querySelector('.ac-hero');
  if (!hero || hero.querySelector('.ac-hero-truck-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = `ac-hero-truck-wrap${reduceMotion || motionLite ? '' : ' is-arriving'}${motionLite ? ' is-lite' : ''}`;
  wrap.setAttribute('aria-hidden', 'true');
  const truck = document.createElement('img');
  truck.className = 'ac-hero-truck';
  truck.alt = '';
  truck.decoding = 'async';
  truck.loading = 'eager';
  truck.fetchPriority = 'high';
  truck.src = `${document.body.dataset.root || ''}assets/images/hero/truck-realistic.png`;
  wrap.append(truck);

  const background = hero.querySelector('.ac-hero-bg');
  background ? background.after(wrap) : hero.prepend(wrap);
}

function initHeroParticles(reduceMotion, motionLite) {
  const hero = document.querySelector('.ac-hero');
  if (!hero || reduceMotion || hero.querySelector('.hero-particle-field')) return;

  const field = document.createElement('div');
  field.className = 'hero-particle-field';
  field.setAttribute('aria-hidden', 'true');
  const visibleParticles = motionLite ? HERO_PARTICLES.slice(0, 7) : HERO_PARTICLES;

  visibleParticles.forEach(([x, y, type, size, delay, drift]) => {
    const particle = document.createElement('span');
    particle.className = `hero-particle hero-particle--${type}`;
    particle.style.setProperty('--particle-x', x);
    particle.style.setProperty('--particle-y', y);
    particle.style.setProperty('--particle-size', size);
    particle.style.setProperty('--particle-delay', delay);
    particle.style.setProperty('--particle-drift', drift);
    field.append(particle);
  });

  const truck = hero.querySelector('.ac-hero-truck-wrap');
  truck ? truck.before(field) : hero.append(field);
}

function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  let frame = 0;
  const update = () => {
    frame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, amount))})`;
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
}

function initPointerSpotlights() {
  const targets = document.querySelectorAll([
    '.service-detail-card', '.fleet-card', '.contact-prep-card', '.tracking-widget',
    '.service-photo-card', '.service-card', '.step-card', '.about-story-card', '.about-bases-card'
  ].join(', '));

  targets.forEach((target) => {
    let frame = 0;
    let pointX = 0;
    let pointY = 0;

    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      pointX = event.clientX - rect.left;
      pointY = event.clientY - rect.top;
      target.classList.add('has-pointer-spotlight', 'is-spotlit');
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        target.style.setProperty('--spot-x', `${pointX}px`);
        target.style.setProperty('--spot-y', `${pointY}px`);
        frame = 0;
      });
    }, { passive: true });

    target.addEventListener('pointerleave', () => {
      target.classList.remove('is-spotlit');
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });
  });
}

function initHeroParallax() {
  const hero = document.querySelector('.ac-hero, .inner-hero');
  if (!hero) return;
  const homeHero = hero.matches('.ac-hero');
  const baseLightX = hero.classList.contains('contact-hero') ? 80 : hero.classList.contains('tracking-hero') ? 80 : 82;
  const baseLightY = hero.classList.contains('contact-hero') ? 23 : hero.classList.contains('tracking-hero') ? 24 : 25;

  let frame = 0;
  let nextX = 0;
  let nextY = 0;

  const update = () => {
    frame = 0;
    if (homeHero) {
      hero.style.setProperty('--hero-shift-x', `${nextX}px`);
      hero.style.setProperty('--hero-shift-y', `${nextY}px`);
    } else {
      hero.style.setProperty('--hero-light-x', `${baseLightX + nextX}%`);
      hero.style.setProperty('--hero-light-y', `${baseLightY + nextY}%`);
    }
  };

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - .5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - .5;
    nextX = Math.max(-1, Math.min(1, relativeX)) * (homeHero ? 7 : 6);
    nextY = Math.max(-1, Math.min(1, relativeY)) * (homeHero ? 5 : 4);
    if (!frame) frame = window.requestAnimationFrame(update);
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    nextX = 0;
    nextY = 0;
    if (!frame) frame = window.requestAnimationFrame(update);
  });
}
