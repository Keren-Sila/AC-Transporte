import { initMobileMenu } from './menu.js';
import { initScrollAnimations, initPrivacyModal } from './animations.js';
import { initQuoteForm, initAdminPanel, initTrackingLookup } from './form.js';
import { initQuoteStepper } from './animations/quote-stepper.js';
import { initWhatsApp } from './whatsapp.js';
import { initPageTransitions } from './page-transition.js';

function initMotionProfile() {
  const root = document.documentElement;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  root.dataset.motion = reduced ? 'reduced' : (mobile && lowPower ? 'lite' : 'full');
}

async function loadComponents() {
  const root = document.body.dataset.root || '';
  const slots = [...document.querySelectorAll('[data-include]')];
  await Promise.all(slots.map(async (slot) => {
    const response = await fetch(`${root}${slot.dataset.include}`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Component ${slot.dataset.include} unavailable`);
    slot.outerHTML = (await response.text()).replaceAll('{{root}}', root);
  }));
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    initMotionProfile();
    await loadComponents();
    initMobileMenu();
    initScrollAnimations();
    initPrivacyModal();
    initQuoteStepper();
    initQuoteForm();
    initAdminPanel();
    initTrackingLookup();
    initWhatsApp();
    initPageTransitions();
    document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  } catch (error) {
    console.error('Não foi possível carregar os componentes do site.', error);
  }
});
