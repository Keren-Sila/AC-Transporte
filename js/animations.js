export function initScrollAnimations() {
  const navLinks = document.querySelectorAll('.nav-link[href*="#"]');
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length || !navLinks.length) return;
  const update = () => {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('active', new URL(link.href).hash === `#${current}`));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (!modal) return;
  const open = document.getElementById('openPrivacyModalBtn');
  const close = () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); };
  open?.addEventListener('click', () => { modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false'); });
  modal.querySelectorAll('#closePrivacyModalBtn, #confirmPrivacyBtn').forEach((button) => button.addEventListener('click', close));
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}
