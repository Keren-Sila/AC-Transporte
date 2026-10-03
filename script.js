/* ==========================================================================
   AC TRANSPORTE LTDA - SCRIPT DE NAVEGAÇÃO & FÍSICA DA OPERAÇÃO (V2)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initHeroTruckPhysics();
  initOperacaoTimeline();
  initServiceCardSelection();
  initPrivacyModal();
  initCalculatorForm();
});

/* 1. MENU MOBILE HAMBÚRGUER */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* 2. HIGHLIGHT DOS LINKS DA NAVBAR NO SCROLL */
function initScrollAnimations() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let currentSec = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSec = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSec}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* 3. MOVIMENTO SUAVE DO CAMINHÃO NO HERO BANNER */
function initHeroTruckPhysics() {
  const truckHero = document.getElementById('heroInteractiveTruck');
  if (!truckHero) return;

  let currentY = 0;
  let targetY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 800) {
      targetY = (scrollY * 0.12);
    }
  }, { passive: true });

  function animateHeroTruck() {
    currentY += (targetY - currentY) * 0.08;
    if (truckHero) {
      truckHero.style.transform = `translate3d(0, ${currentY}px, 0)`;
    }
    requestAnimationFrame(animateHeroTruck);
  }

  animateHeroTruck();
}

/* 4. FLUXO DA OPERAÇÃO — CAMINHÃO GUIADO PELO SCROLL NAS ETAPAS (60 FPS LERP) */
function initOperacaoTimeline() {
  const operacaoSection = document.getElementById('operacao');
  const operacaoLine = document.getElementById('roadProgressLine');
  const truckMarker = document.getElementById('scrollTruckMarker');

  const cp1 = document.getElementById('cp1');
  const cp2 = document.getElementById('cp2');
  const cp3 = document.getElementById('cp3');
  const cp4 = document.getElementById('cp4');
  const cp5 = document.getElementById('cp5');

  if (!operacaoSection || !operacaoLine || !truckMarker) return;

  let currentProgress = 0;
  let targetProgress = 0;

  function updateProgress() {
    const rect = operacaoSection.getBoundingClientRect();
    const sectionHeight = operacaoSection.offsetHeight;
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      let progress = ((windowHeight - rect.top) / (sectionHeight + windowHeight)) * 100;
      targetProgress = Math.min(Math.max(progress, 0), 100);
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  function renderOperacaoProgress() {
    currentProgress += (targetProgress - currentProgress) * 0.1;

    operacaoLine.style.height = `${currentProgress}%`;
    truckMarker.style.top = `${currentProgress}%`;

    if (currentProgress >= 15 && cp1) cp1.classList.add('active');
    else if (cp1) cp1.classList.remove('active');

    if (currentProgress >= 35 && cp2) cp2.classList.add('active');
    else if (cp2) cp2.classList.remove('active');

    if (currentProgress >= 55 && cp3) cp3.classList.add('active');
    else if (cp3) cp3.classList.remove('active');

    if (currentProgress >= 75 && cp4) cp4.classList.add('active');
    else if (cp4) cp4.classList.remove('active');

    if (currentProgress >= 90 && cp5) cp5.classList.add('active');
    else if (cp5) cp5.classList.remove('active');

    requestAnimationFrame(renderOperacaoProgress);
  }

  renderOperacaoProgress();
}

/* 5. SELEÇÃO DIRETA DE SERVIÇOS NOS CARDS (VIA ADDEVENTLISTENER) */
function initServiceCardSelection() {
  const serviceLinks = document.querySelectorAll('.service-link[data-service]');
  const selectElem = document.getElementById('tipoServicoSelect');
  const cotacaoSec = document.getElementById('cotacao');

  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const serviceName = link.getAttribute('data-service');
      if (selectElem && serviceName) {
        selectElem.value = serviceName;
      }
      if (cotacaoSec) {
        cotacaoSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* 6. MODAL DA POLÍTICA DE PRIVACIDADE (LGPD) */
function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  const openBtn = document.getElementById('openPrivacyModalBtn');
  const closeBtn = document.getElementById('closePrivacyModalBtn');
  const confirmBtn = document.getElementById('confirmPrivacyBtn');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (confirmBtn) confirmBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* 7. FORMULÁRIO DE COTAÇÃO COM VALIDAÇÃO E INTEGRAÇÃO WHATSAPP */
function initCalculatorForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('clienteNome');
    const tel = document.getElementById('clienteTelefone');
    const origem = document.getElementById('origemCidade');
    const destino = document.getElementById('destinoCidade');
    const tipo = document.getElementById('tipoServicoSelect');

    let isValid = true;

    if (!nome.value.trim()) {
      showInputError(nome, true);
      isValid = false;
    } else { showInputError(nome, false); }

    if (!tel.value.trim()) {
      showInputError(tel, true);
      isValid = false;
    } else { showInputError(tel, false); }

    if (!origem.value.trim()) {
      showInputError(origem, true);
      isValid = false;
    } else { showInputError(origem, false); }

    if (!destino.value.trim()) {
      showInputError(destino, true);
      isValid = false;
    } else { showInputError(destino, false); }

    if (!tipo.value) {
      showInputError(tipo, true);
      isValid = false;
    } else { showInputError(tipo, false); }

    if (!isValid) return;

    const peso = document.getElementById('pesoEstimado').value.trim();
    const obs = document.getElementById('observacoesCarga').value.trim();

    let msg = `🚛 *SOLICITAÇÃO DE COTAÇÃO - AC TRANSPORTE LTDA*\n`;
    msg += `_Atendimento Corporativo & Cargas_\n\n`;
    msg += `*Cliente/Empresa:* ${nome.value.trim()}\n`;
    msg += `*WhatsApp:* ${tel.value.trim()}\n`;
    msg += `------------------------------------\n`;
    msg += `*📍 COLETA (ORIGEM):* ${origem.value.trim()}\n`;
    msg += `*🏁 ENTREGA (DESTINO):* ${destino.value.trim()}\n`;
    msg += `------------------------------------\n`;
    msg += `*Modalidade / Serviço:* ${tipo.value}\n`;
    if (peso) msg += `*Peso / Volume Aproximado:* ${peso}\n`;
    if (obs) msg += `*Observações:* ${obs}\n`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/5511912349106?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
  });
}

function showInputError(inputElem, isError) {
  if (isError) {
    inputElem.classList.add('is-invalid');
  } else {
    inputElem.classList.remove('is-invalid');
  }
}
