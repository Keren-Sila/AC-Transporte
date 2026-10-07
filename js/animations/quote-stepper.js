/** Progressive, accessible multi-step forms (quoteForm & driverForm). */
export function initFormStepper(formId, prefix = 'quote') {
  const form = document.getElementById(formId);
  if (!form) return;

  const panels = [...form.querySelectorAll(`[data-${prefix}-step-panel]`)];
  const indicators = [...form.querySelectorAll(`[data-${prefix}-step-indicator]`)];
  const status = form.querySelector(`[data-${prefix}-step-status]`);
  const progress = form.querySelector(`[data-${prefix}-step-progress]`);
  if (panels.length < 2 || panels.length !== indicators.length) return;

  const titles = indicators.map((indicator) => indicator.querySelector('small')?.textContent.trim() || 'Etapa');
  let current = 0;

  const showStep = (next, focus = true) => {
    current = Math.max(0, Math.min(panels.length - 1, next));
    panels.forEach((panel, index) => {
      const active = index === current;
      panel.hidden = !active;
      panel.disabled = !active;
      panel.classList.remove('is-entering');
      if (active && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.requestAnimationFrame(() => panel.classList.add('is-entering'));
      }
    });

    indicators.forEach((indicator, index) => {
      indicator.dataset.state = index < current ? 'complete' : index === current ? 'current' : 'upcoming';
      if (index === current) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    if (progress) progress.style.width = `${(current / (panels.length - 1)) * 100}%`;
    if (status) status.textContent = `Etapa ${current + 1} de ${panels.length} · ${titles[current]}`;
    if (focus) panels[current].querySelector('legend')?.focus({ preventScroll: true });
  };

  form.addEventListener('click', (event) => {
    const nextButton = event.target.closest(`[data-${prefix}-next]`);
    const backButton = event.target.closest(`[data-${prefix}-back]`);
    if (!nextButton && !backButton) return;

    if (backButton) {
      showStep(current - 1);
      return;
    }

    const invalidControl = [...panels[current].querySelectorAll('input, select, textarea')]
      .find((control) => !control.disabled && !control.checkValidity());
    if (invalidControl) {
      invalidControl.reportValidity();
      invalidControl.focus();
      return;
    }
    showStep(current + 1);
  });

  form.addEventListener('reset', () => window.setTimeout(() => showStep(0, false), 0));
  showStep(0, false);
}

export function initQuoteStepper() {
  initFormStepper('quoteForm', 'quote');
  initFormStepper('driverForm', 'driver');
}
