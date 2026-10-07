/**
 * AC TRANSPORTE - Animações extras
 * Faixa correndo, títulos palavra por palavra, paralaxe dos caminhões no celular e toque com ondinha.
 */

const reduced = () => document.documentElement.dataset.motion === 'reduced';
function initMarquee() {
  const band = document.querySelector('.ac-hero-facts-band');
  if (!band || document.querySelector('.ac-marquee')) return;
  const items = ['Fretes e mudanças', 'Transporte rodoviário', 'Coleta e entrega', 'MadeiraMadeira', 'Mercado Livre', 'Base Mauá', 'Base Arujá', 'Base Cajamar'];
  const group = () => {
    const el = document.createElement('div');
    el.className = 'ac-marquee-group';
    items.forEach((text) => {
      const span = document.createElement('span');
      span.textContent = text;
      el.append(span);
    });
    return el;
  };

  const marquee = document.createElement('div');
  marquee.className = 'ac-marquee';
  marquee.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'ac-marquee-track';
  track.append(group(), group());
  marquee.append(track);
  band.after(marquee);
}
function initWordReveal() {
  document.querySelectorAll('.ac-sec .ac-h2, .ac-sec .ac-h3').forEach((heading) => {
    if (heading.children.length || heading.classList.contains('has-split')) return;
    const words = heading.textContent.trim().split(/\s+/);
    if (!words.length || !words[0]) return;
    heading.setAttribute('aria-label', words.join(' '));
    heading.textContent = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', String(index));
      span.textContent = word;
      heading.append(span);
      if (index < words.length - 1) heading.append(' ');
    });
    heading.classList.add('has-split');
  });
}

// No celular os caminhões deslizam em sentidos opostos conforme a página rola.
function initMobileParallax() {
  const hero = document.querySelector('.ac-hero-instagram');
  const stage = hero?.querySelector('.ac-hero-stage');
  if (!hero || !stage) return;
  const mobile = window.matchMedia('(max-width: 768px)');
  
  // Usar Intersection Observer para melhor performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let rafId = null;
        const update = () => {
          if (!mobile.matches) { 
            hero.style.removeProperty('--m-shift'); 
            return; 
          }
          const height = Math.max(stage.offsetHeight, 1);
          const ratio = Math.min(Math.max(window.scrollY / height, 0), 1.2);
          hero.style.setProperty('--m-shift', `${(ratio * 46).toFixed(1)}px`);
        };
        
        const handleScroll = () => {
          if (!rafId) rafId = window.requestAnimationFrame(() => {
            update();
            rafId = null;
          });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        update();
      }
    });
  }, { threshold: 0 });
  
  observer.observe(stage);
}

// Ondinha no ponto do toque: o iPhone não tem hover, então o botão precisa responder de outro jeito.
function initTapRipple() {
  const selector = '.btn, .whatsapp-fab, .quote-phone';
  const touchStart = {};
  
  document.addEventListener('pointerdown', (event) => {
    const target = event.target.closest(selector);
    if (!target) return;
    
    // Registrar o ponto de toque
    touchStart[event.pointerId] = { x: event.clientX, y: event.clientY, target };
    
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.7;
    
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    if (getComputedStyle(target).overflow === 'visible') target.style.overflow = 'hidden';
    
    const ripple = document.createElement('span');
    ripple.className = 'tap-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    
    target.append(ripple);
    
    const cleanup = () => ripple.remove();
    ripple.addEventListener('animationend', cleanup, { once: true });
    
    // Remover após timeout se animação não termincar (fallback)
    setTimeout(cleanup, 700);
  }, { passive: true });
}
export function initExtraMotion() {
  if (reduced()) return;
  initMarquee();
  initWordReveal();
  initMobileParallax();
  initTapRipple();
}