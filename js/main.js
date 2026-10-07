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
  const lowPower = connection?.saveData;
  root.dataset.motion = reduced ? 'reduced' : (lowPower ? 'lite' : 'full');
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
  initMotionProfile();

  try {
    await loadComponents();
  } catch (error) {
    console.warn('Alguns componentes não puderam ser carregados via fetch:', error.message);
  }

  const safeInit = (fn, name) => {
    try { fn(); } catch (err) { console.error(`Erro ao inicializar ${name}:`, err); }
  };

  safeInit(initMobileMenu, 'Menu Mobile');
  safeInit(initScrollAnimations, 'Animações de Scroll');
  safeInit(initPrivacyModal, 'Modal de Privacidade');
  safeInit(initQuoteStepper, 'Stepper de Cotação');
  safeInit(initQuoteForm, 'Formulário de Cotação');
  safeInit(initAdminPanel, 'Painel Admin');
  safeInit(initTrackingLookup, 'Rastreamento');
  safeInit(initWhatsApp, 'WhatsApp');
  safeInit(initPageTransitions, 'Transições de Página');

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
});
