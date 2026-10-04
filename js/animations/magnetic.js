/**
 * AC TRANSPORTE - Magnetic CTA Buttons & Micro-Interactions
 * Attracts buttons toward mouse cursor gently on hover.
 */

export function initMagneticButtons() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-nav-cta, .btn-calc-submit');

  magneticBtns.forEach((btn) => {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isHovered = false;

    btn.addEventListener('mouseenter', () => {
      isHovered = true;
      btn.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease';
    });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX = (e.clientX - centerX) * 0.18; // 18% attraction strength
      mouseY = (e.clientY - centerY) * 0.18;
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      mouseX = 0;
      mouseY = 0;
      btn.style.transform = 'translate3d(0, 0, 0)';
    });

    btn.addEventListener('mousedown', () => {
      btn.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.96)`;
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
    });

    function animateMagnetic() {
      if (isHovered) {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        requestAnimationFrame(animateMagnetic);
      }
    }

    btn.addEventListener('mouseenter', () => {
      requestAnimationFrame(animateMagnetic);
    });
  });
}
