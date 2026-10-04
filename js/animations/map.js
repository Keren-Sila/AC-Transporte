/**
 * AC TRANSPORTE - Coverage Map Route Drawing & Pulsing Pins
 */

export function initMapAnimations() {
  const mapSection = document.getElementById('atuacao');
  if (!mapSection) return;

  const mapRoutes = mapSection.querySelectorAll('.map-route');
  const mapPins = mapSection.querySelectorAll('.map-pin');

  if (!('IntersectionObserver' in window)) {
    mapRoutes.forEach((r) => r.classList.add('drawn'));
    mapPins.forEach((p) => p.classList.add('pulsing'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        mapRoutes.forEach((route, idx) => {
          setTimeout(() => {
            route.classList.add('drawn');
          }, idx * 250);
        });

        mapPins.forEach((pin, idx) => {
          setTimeout(() => {
            pin.classList.add('pulsing');
          }, idx * 200 + 400);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(mapSection);
}
