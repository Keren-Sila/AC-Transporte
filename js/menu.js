export function initMobileMenu() {
  const button = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('navMenu');
  if (!button || !menu) return;
  const close = () => {
    menu.classList.remove('active');
    button.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('active');
    button.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  const currentPath = window.location.pathname.replace(/\/$/, '/index.html');
  menu.querySelectorAll('a').forEach((link) => {
    const target = new URL(link.href, window.location.href);
    if (target.pathname === currentPath) link.classList.add('active');
  });
}
