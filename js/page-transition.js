/**
 * Cross-page transition layer for the static multi-page site.
 * Keeps navigation native while adding a short visual handoff.
 */

export function initPageTransitions() {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const profile = root.dataset.motion || (reduceMotion ? 'reduced' : 'full');
  const layer = document.createElement('div');
  layer.className = 'page-transition-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<span class="page-transition-grid"></span><span class="page-transition-mark">AC</span>';
  document.body.append(layer);

  requestAnimationFrame(() => {
    layer.classList.add('is-ready');
  });

  if (profile === 'reduced') return;

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download') || link.dataset.transition === 'none') return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.protocol !== window.location.protocol) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;

    event.preventDefault();
    layer.classList.remove('is-ready');
    layer.classList.add('is-leaving');
    window.setTimeout(() => { window.location.assign(url.href); }, profile === 'lite' ? 260 : 410);
  });
}
