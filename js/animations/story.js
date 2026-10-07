/**
 * AC TRANSPORTE — Scroll story controller
 * Pins the hero scene while the truck arrives and the road moves into place.
 */

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => {
  const point = clamp(value);
  return point * point * (3 - 2 * point);
};

export function initStoryMotion() {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const profile = root.dataset.motion || (reduceMotion ? 'reduced' : 'full');
  const header = document.querySelector('.header-site');
  const hero = document.querySelector('.ac-hero-instagram');
  const story = hero?.querySelector('.ac-hero-scroll');
  const stage = hero?.querySelector('.ac-hero-stage');
  const truckGoing = hero?.querySelector('.ac-hero-truck-wrap.truck-going') || hero?.querySelector('.ac-hero-truck-wrap');
  const truckReturning = hero?.querySelector('.ac-hero-truck-wrap.truck-returning');
  const roadTop = hero?.querySelector('.ac-hero-road-band.road-top') || hero?.querySelector('.ac-hero-road-band');
  const roadBottom = hero?.querySelector('.ac-hero-road-band.road-bottom');
  const roadDashTop = roadTop?.querySelector('.road-dashed-line');
  const roadDashBottom = roadBottom?.querySelector('.road-dashed-line');
  const pill = hero?.querySelector('.btn-road-pill');
  const copy = hero?.querySelector('.ac-hero-transition-copy');
  const copyParts = copy ? [...copy.children] : [];
  const sections = [...document.querySelectorAll('.ac-sec, .quote-section, .inner-hero')];
  const innerHeroes = [...document.querySelectorAll('.inner-hero')];

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
    root.style.setProperty('--hero-header-height', `${header.offsetHeight}px`);
  };

  if (header) {
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (reduceMotion || profile === 'reduced') {
    copy?.classList.add('is-active');
    return;
  }

  let frame = 0;
  let entrance = 0;
  let entranceStart = null;
  let previousProgress = 0;
  let previousTime = 0;
  let storyStart = story ? story.getBoundingClientRect().top + window.scrollY : 0;

  const renderStory = (progress) => {
    if (!story || !stage || !truckGoing || !roadTop) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const truckWidth = truckGoing.offsetWidth || 300;
    const truckHeight = truckGoing.offsetHeight || 150;
    const entry = clamp(progress / 0.16);
    const arrive = 1 - Math.pow(1 - entry, 3);
    const centeredX = (width - truckWidth) / 2;

    // Truck 1 (Going - Left to Right on Upper Road)
    const truck1X = -truckWidth - 30 + (centeredX + truckWidth + 30) * arrive;

    // Truck 2 (Returning - Right to Left on Lower Road)
    const truck2X = width + 30 - (centeredX + truckWidth + 30) * arrive;

    const roadProgress = smooth((progress - 0.30) / 0.28);
    const r1Top = 68 - 46 * roadProgress;
    const r1Height = 12 + 2 * roadProgress;

    const r2Top = 84 - 46 * roadProgress;
    const r2Height = 12 + 2 * roadProgress;

    const scale = 1 + roadProgress * (profile === 'lite' || width < 700 ? 0.12 : 0.2);
    const visibleBottom = 0.903;

    // Center of Upper Road for Truck 1 (Going)
    const lane1Center = (r1Top + r1Height / 2) * height / 100;
    const truck1Y = lane1Center - truckHeight * (1 + (visibleBottom - 1) * scale);

    // Center of Lower Road for Truck 2 (Returning)
    const lane2Center = (r2Top + r2Height / 2) * height / 100;
    const truck2Y = lane2Center - truckHeight * (1 + (visibleBottom - 1) * scale);

    truckGoing.style.setProperty('--truck-x', `${truck1X.toFixed(2)}px`);
    truckGoing.style.setProperty('--truck-y', `${truck1Y.toFixed(2)}px`);
    truckGoing.style.setProperty('--truck-scale', scale.toFixed(3));
    truckGoing.style.setProperty('--truck-rotate', `${(-Math.sin(roadProgress * Math.PI) * 0.18).toFixed(2)}deg`);

    if (truckReturning) {
      truckReturning.style.setProperty('--truck-x', `${truck2X.toFixed(2)}px`);
      truckReturning.style.setProperty('--truck-y', `${truck2Y.toFixed(2)}px`);
      truckReturning.style.setProperty('--truck-scale', (scale * 0.95).toFixed(3));
      truckReturning.style.setProperty('--truck-rotate', `${(Math.sin(roadProgress * Math.PI) * 0.18).toFixed(2)}deg`);
    }

    if (roadTop) {
      roadTop.style.setProperty('--road-top', `${r1Top.toFixed(2)}%`);
      roadTop.style.setProperty('--road-height', `${r1Height.toFixed(2)}%`);
      if (roadDashTop) roadDashTop.style.setProperty('--road-offset-x', `${(-progress * 3000).toFixed(1)}px`);
    }

    if (roadBottom) {
      roadBottom.style.setProperty('--road-top-2', `${r2Top.toFixed(2)}%`);
      roadBottom.style.setProperty('--road-height-2', `${r2Height.toFixed(2)}%`);
      if (roadDashBottom) roadDashBottom.style.setProperty('--road-offset-x', `${(progress * 3000).toFixed(1)}px`);
    }
    if (pill) {
      const opacity = 1 - smooth((progress - 0.20) / 0.12);
      pill.style.opacity = opacity.toFixed(3);
      pill.style.visibility = opacity < 0.03 ? 'hidden' : 'visible';
    }

    if (copy) {
      const roadBottom = (roadTop + roadHeight) * height / 100;
      const safeBottom = Math.max(24, height * 0.04);
      const freeSpace = Math.max(0, height - roadBottom - copy.offsetHeight - safeBottom);
      const copyTop = roadBottom + freeSpace / 2;
      copy.style.top = `${(copyTop / height * 100).toFixed(2)}%`;
      copy.classList.toggle('is-active', progress > 0.72);
      copyParts.forEach((part, index) => {
        const visible = smooth((progress - (0.58 + index * 0.06)) / 0.22);
        part.style.opacity = visible.toFixed(3);
        part.style.transform = `translateY(${(18 * (1 - visible)).toFixed(2)}px)`;
      });
    }

    const now = performance.now();
    const elapsed = Math.max(now - previousTime, 16);
    const speed = previousTime ? Math.min(80, Math.round(Math.abs(progress - previousProgress) / elapsed * 60000)) : 0;
    if (telemetry) telemetry.innerHTML = `AC TRANSPORTE · <b>${speed}</b> KM/H`;
    previousProgress = progress;
    previousTime = now;
  };

  const update = () => {
    frame = 0;
    if (story && stage) {
      const travel = Math.max(story.offsetHeight - stage.offsetHeight, 1);
      const scrollProgress = clamp((window.scrollY - storyStart) / travel);
      const target = Math.max(scrollProgress, entrance);
      const current = Number(story.dataset.progress || 0);
      let progress = current + (target - current) * 0.14;
      if (Math.abs(target - progress) < 0.0005) progress = target;
      story.dataset.progress = progress.toFixed(5);
      hero.style.setProperty('--hero-progress', progress.toFixed(3));
      renderStory(progress);

      if (entrance < 0.16 || Math.abs(target - progress) >= 0.0005) schedule();
    }

    const viewport = window.innerHeight;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionProgress = clamp((viewport - rect.top) / (viewport + rect.height));
      section.style.setProperty('--section-progress', sectionProgress.toFixed(3));
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

  const startEntrance = (time) => {
    if (entranceStart === null) entranceStart = time;
    entrance = 0.16 * clamp((time - entranceStart) / 2400);
    schedule();
    if (entrance < 0.16) window.requestAnimationFrame(startEntrance);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    if (story) storyStart = story.getBoundingClientRect().top + window.scrollY;
    updateHeader();
    schedule();
  }, { passive: true });

  schedule();
  if (story && stage) window.requestAnimationFrame(startEntrance);
}
