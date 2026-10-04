/**
 * AC TRANSPORTE - Operation Timeline Progress Engine
 * Animates steps (01 -> 02 -> 03 -> 04 -> 05) sequentially with orange connecting line on scroll.
 */

export function initTimelineAnimation() {
  const operacaoSection = document.getElementById('operacao');
  if (!operacaoSection) return;

  const stepItems = operacaoSection.querySelectorAll('.ac-steps li, .process-steps li');
  if (!stepItems.length) return;

  // Insert progress bar connector if missing
  let progressLine = operacaoSection.querySelector('.timeline-progress-bar');
  if (!progressLine) {
    const parentContainer = stepItems[0].parentElement;
    if (parentContainer) {
      progressLine = document.createElement('div');
      progressLine.className = 'timeline-progress-bar';
      parentContainer.prepend(progressLine);
    }
  }

  if (!('IntersectionObserver' in window)) {
    stepItems.forEach((step) => step.classList.add('active-step'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stepItems.forEach((step, idx) => {
          const rect = step.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.75) {
            step.classList.add('active-step');
          }
        });
        
        // Calculate progress percentage
        const activeStepsCount = operacaoSection.querySelectorAll('.active-step').length;
        const progressPercentage = ((activeStepsCount - 1) / (stepItems.length - 1)) * 100;
        
        if (progressLine) {
          progressLine.style.width = `${Math.max(0, Math.min(progressPercentage, 100))}%`;
        }
      }
    });
  }, { threshold: 0.25 });

  stepItems.forEach((step) => observer.observe(step));
}
