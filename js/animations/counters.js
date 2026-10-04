/**
 * AC TRANSPORTE - Numerical Counter Animation Engine
 * Counts up statistics smoothly when scrolled into view.
 */

export function initCountersAnimation() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  if (!('IntersectionObserver' in window)) {
    counterElements.forEach((el) => {
      el.textContent = el.dataset.counterTarget;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('has-counted')) {
        entry.target.classList.add('has-counted');
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach((el) => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counterTarget, 10);
  const prefix = element.dataset.counterPrefix || '';
  const suffix = element.dataset.counterSuffix || '';
  const duration = parseInt(element.dataset.counterDuration, 10) || 1500;
  
  const startTimestamp = performance.now();

  function updateValue(currentTimestamp) {
    const elapsed = currentTimestamp - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.floor(easeProgress * target);

    element.textContent = `${prefix}${currentValue.toLocaleString('pt-BR')}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateValue);
    } else {
      element.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
    }
  }

  requestAnimationFrame(updateValue);
}
