/* ==========================================================================
   AC TRANSPORTE - SCRIPT DE ANIMAÇÃO DA FROTA & INTERAÇÕES DE SCROLL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initHeroTruckPhysics();
  initRoadTimeline();
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

/* 2. HIGHLIGHT DOS LINKS DA NAVBAR */
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
  });
}

/* 3. ANIMAÇÃO DE FÍSICA E MOVIMENTO DO CAMINHÃO NO HERO (HERO TRUCK PHYSICS) */
function initHeroTruckPhysics() {
  const truckHero = document.getElementById('heroInteractiveTruck');
  if (!truckHero) return;

  let currentY = 0;
  let targetY = 0;
  let currentX = 0;
  let targetX = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 800) {
      targetY = (scrollY * 0.18);
      targetX = Math.sin(scrollY * 0.01) * 8;
    }
  });

  // Loop de Animação Suave 60 FPS
  function animateTruck() {
    currentY += (targetY - currentY) * 0.08;
    currentX += (targetX - currentX) * 0.08;

    if (truckHero) {
      truckHero.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    requestAnimationFrame(animateTruck);
  }

  animateTruck();
}

/* 4. A ROTA DA CARGA - TIMELINE VERTICAL E CAMINHÃO GUIADO PELO SCROLL */
function initRoadTimeline() {
  const roadSection = document.getElementById('jornada');
  const roadLine = document.getElementById('roadProgressLine');
  const truckMarker = document.getElementById('scrollTruckMarker');
  const cp1 = document.getElementById('cp1');
  const cp2 = document.getElementById('cp2');
  const cp3 = document.getElementById('cp3');

  if (!roadSection || !roadLine || !truckMarker) return;

  window.addEventListener('scroll', () => {
    const rect = roadSection.getBoundingClientRect();
    const sectionHeight = roadSection.offsetHeight;
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      let progress = ((windowHeight - rect.top) / (sectionHeight + windowHeight)) * 100;
      progress = Math.min(Math.max(progress, 0), 100);

      roadLine.style.height = `${progress}%`;
      truckMarker.style.top = `${progress}%`;

      if (progress >= 20 && cp1) cp1.classList.add('active');
      else if (cp1) cp1.classList.remove('active');

      if (progress >= 55 && cp2) cp2.classList.add('active');
      else if (cp2) cp2.classList.remove('active');

      if (progress >= 85 && cp3) cp3.classList.add('active');
      else if (cp3) cp3.classList.remove('active');
    }
  });
}

/* 5. MODAL DA POLÍTICA DE PRIVACIDADE (LGPD) */
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

/* 6. SELEÇÃO DIRETA DE SERVIÇOS NOS CARDS */
window.selectServiceInForm = function(serviceName) {
  const selectElem = document.getElementById('tipoServicoSelect');
  if (selectElem) {
    selectElem.value = serviceName;
  }
  const cotacaoSec = document.getElementById('cotacao');
  if (cotacaoSec) {
    cotacaoSec.scrollIntoView({ behavior: 'smooth' });
  }
};

/* 7. FORMULÁRIO CALCULADORA DE FRETE CORPORATIVA */
function initCalculatorForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const origem = document.getElementById('origemCidade');
    const destino = document.getElementById('destinoCidade');
    const tipo = document.getElementById('tipoServicoSelect');
    const nome = document.getElementById('clienteNome');
    const tel = document.getElementById('clienteTelefone');

    let isValid = true;

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

    if (!nome.value.trim()) {
      showInputError(nome, true);
      isValid = false;
    } else { showInputError(nome, false); }

    if (!tel.value.trim()) {
      showInputError(tel, true);
      isValid = false;
    } else { showInputError(tel, false); }

    if (!isValid) return;

    const veiculo = document.getElementById('tipoVeiculoSelect').value;
    const peso = document.getElementById('pesoEstimado').value.trim();
    const dataPref = document.getElementById('dataPreferencial').value;
    const obs = document.getElementById('observacoesCarga').value.trim();

    let msg = `🚛 *SOLICITAÇÃO DE COTAÇÃO - AC TRANSPORTE LTDA*\n`;
    msg += `_Atendimento Corporativo & Fretes_\n\n`;
    msg += `*Cliente/Empresa:* ${nome.value.trim()}\n`;
    msg += `*WhatsApp:* ${tel.value.trim()}\n`;
    msg += `------------------------------------\n`;
    msg += `*📍 COLETA (ORIGEM):* ${origem.value.trim()}\n`;
    msg += `*🏁 ENTREGA (DESTINO):* ${destino.value.trim()}\n`;
    if (dataPref) msg += `*Data Preferencial:* ${dataPref}\n`;
    msg += `------------------------------------\n`;
    msg += `*Modalidade:* ${tipo.value}\n`;
    msg += `*Veículo Recomendado:* ${veiculo}\n`;
    if (peso) msg += `*Peso / Volume:* ${peso}\n`;
    if (obs) msg += `*Observações:* ${obs}\n`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/5511912349106?text=${encodedMsg}`;

    if (!navigator.onLine) {
      alert('Aparentemente você está offline. O link do WhatsApp foi gerado e será aberto.');
    }

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
