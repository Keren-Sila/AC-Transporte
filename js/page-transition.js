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

  const resetLayer = () => {
    layer.classList.remove('is-leaving');
    requestAnimationFrame(() => layer.classList.add('is-ready'));
  };

  resetLayer();

  // Reset layer on iOS BFCache back/forward swipe navigation
  window.addEventListener('pageshow', (event) => {
    resetLayer();
  });

  if (profile === 'reduced') return;

  let transitionTimer = null;

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

    if (transitionTimer) clearTimeout(transitionTimer);

    // Safety timeout: reset layer after 4s if navigation is interrupted
    transitionTimer = window.setTimeout(resetLayer, 4000);

    window.setTimeout(() => {
      window.location.assign(url.href);
    }, profile === 'lite' ? 260 : 410);
  });
}
