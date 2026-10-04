/**
 * AC TRANSPORTE - Operation Timeline Progress Engine
 * Animates steps (1 -> 2 -> 3 -> 4 -> 5) sequentially as user scrolls down the operation section.
 */

export function initTimelineAnimation() {
  const operacaoSection = document.getElementById('operacao');
  if (!operacaoSection) return;

  const stepItems = operacaoSection.querySelectorAll('.ac-steps li, .process-steps li');
  if (!stepItems.length) return;

  if (!('IntersectionObserver' in window)) {
    stepItems.forEach((step) => step.classList.add('active-step'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stepItems.forEach((step) => {
          const rect = step.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.82) {
            step.classList.add('active-step');
          }
        });
      }
    });
  }, { threshold: 0.2 });

  stepItems.forEach((step) => observer.observe(step));
}
