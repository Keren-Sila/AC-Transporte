/**
 * AC TRANSPORTE LTDA - V3 Scroll Experience & Physics Engine Index
 * Exports all modular animation handlers.
 */

import { initObserver } from './observer.js';
import { initHeroAnimations } from './hero.js';
import { initCargoRouteAnimation } from './route.js';
import { initTimelineAnimation } from './timeline.js';
import { initCardAnimations } from './cards.js';
import { initCountersAnimation } from './counters.js';
import { initMagneticButtons } from './magnetic.js';
import { initMapAnimations } from './map.js';

export function initScrollAnimations() {
  initObserver();
  initHeroAnimations();
  initCargoRouteAnimation();
  initTimelineAnimation();
  initCardAnimations();
  initCountersAnimation();
  initMagneticButtons();
  initMapAnimations();
}

export function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (!modal) return;

  const openBtn = document.getElementById('openPrivacyModalBtn');
  const close = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  openBtn?.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });

  modal.querySelectorAll('#closePrivacyModalBtn, #confirmPrivacyBtn').forEach((button) => {
    button.addEventListener('click', close);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
