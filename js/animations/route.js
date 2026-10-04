/**
 * AC TRANSPORTE - Signature Cargo Route Scroll Engine ("A Jornada da Carga")
 * Controls the vertical SVG journey route line (strokeDashoffset) and gliding truck marker.
 */

export function initCargoRouteAnimation() {
  if (document.getElementById('acCargoRouteContainer')) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  // Build Fixed SVG Route & Truck Container
  const container = document.createElement('div');
  container.id = 'acCargoRouteContainer';
  container.className = 'ac-cargo-route-container';
  container.setAttribute('aria-hidden', 'true');

  container.innerHTML = `
    <svg class="ac-route-svg" viewBox="0 0 40 1000" preserveAspectRatio="none">
      <path class="ac-route-bg-line" d="M 20 0 L 20 1000" />
      <path class="ac-route-active-line" id="acRouteActivePath" d="M 20 0 L 20 1000" />
    </svg>
    <div class="ac-route-truck-marker" id="acRouteTruckMarker">
      <span class="truck-emoji">🚛</span>
      <span class="route-pulse-glow"></span>
    </div>
  `;

  document.body.appendChild(container);

  const activePath = document.getElementById('acRouteActivePath');
  const truckMarker = document.getElementById('acRouteTruckMarker');

  if (!activePath || !truckMarker) return;

  const pathLength = activePath.getTotalLength();
  activePath.style.strokeDasharray = `${pathLength}`;
  activePath.style.strokeDashoffset = `${pathLength}`;

  let ticking = false;

  function updateRouteOnScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight <= 0) return;

    const scrollRatio = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    // Update SVG strokeDashoffset
    const drawLength = pathLength * scrollRatio;
    activePath.style.strokeDashoffset = `${pathLength - drawLength}`;

    // Update Truck position along right screen axis (from top: 80px to top: calc(100vh - 100px))
    const minTop = 80;
    const maxTop = window.innerHeight - 100;
    const currentTop = minTop + scrollRatio * (maxTop - minTop);

    truckMarker.style.transform = `translate3d(0, ${currentTop.toFixed(1)}px, 0)`;

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateRouteOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateRouteOnScroll, { passive: true });
  updateRouteOnScroll();
}
