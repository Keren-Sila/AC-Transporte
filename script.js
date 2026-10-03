/* ==========================================================================
   AC TRANSPORTE - SCRIPT PRINCIPAL INTERATIVO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initRoadTimeline();
  initPrivacyModal();
  initWizardForm();
});

/* 1. MENU MOBILE HAMBÚRGUER */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* 2. ANIMAÇÕES DE SCROLL E HIGHLIGHT DE LINKS DA NAVBAR */
function initScrollAnimations() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const heroTruck = document.getElementById('heroTruck');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (heroTruck && scrollY < 600) {
      heroTruck.style.transform = `translateX(${scrollY * 0.12}px)`;
    }

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

/* 3. A ROTA DA CARGA - TIMELINE E CAMINHÃO ANIMADO */
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

/* 4. MODAL DA POLÍTICA DE PRIVACIDADE (LGPD) */
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

/* 5. CALCULADORA E WIZARD DE COTAÇÃO EM 4 PASSOS */
let currentWizardStep = 1;

function initWizardForm() {
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', handleFormSubmit);
  }
}

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

window.nextWizardStep = function(fromStep) {
  if (!validateStep(fromStep)) return;

  if (fromStep < 4) {
    switchWizardStep(fromStep + 1);
  }
};

window.prevWizardStep = function(fromStep) {
  if (fromStep > 1) {
    switchWizardStep(fromStep - 1);
  }
};

function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const origem = document.getElementById('origemCidade');
    if (!origem.value.trim()) {
      showInputError(origem, true);
      isValid = false;
    } else {
      showInputError(origem, false);
    }
  } else if (step === 2) {
    const destino = document.getElementById('destinoCidade');
    if (!destino.value.trim()) {
      showInputError(destino, true);
      isValid = false;
    } else {
      showInputError(destino, false);
    }
  } else if (step === 3) {
    const tipo = document.getElementById('tipoServicoSelect');
    if (!tipo.value) {
      showInputError(tipo, true);
      isValid = false;
    } else {
      showInputError(tipo, false);
    }
  } else if (step === 4) {
    const nome = document.getElementById('clienteNome');
    const tel = document.getElementById('clienteTelefone');
    
    if (!nome.value.trim()) {
      showInputError(nome, true);
      isValid = false;
    } else {
      showInputError(nome, false);
    }

    if (!tel.value.trim()) {
      showInputError(tel, true);
      isValid = false;
    } else {
      showInputError(tel, false);
    }
  }

  return isValid;
}

function showInputError(inputElem, isError) {
  if (isError) {
    inputElem.classList.add('is-invalid');
  } else {
    inputElem.classList.remove('is-invalid');
  }
}

function switchWizardStep(targetStep) {
  const currentPane = document.getElementById(`paneStep${currentWizardStep}`);
  const targetPane = document.getElementById(`paneStep${targetStep}`);
  
  if (currentPane) currentPane.classList.remove('active');
  if (targetPane) targetPane.classList.add('active');

  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById(`stepIndicator${i}`);
    const line = document.getElementById(`stepLine${i}`);

    if (ind) {
      ind.classList.remove('active', 'completed');
      if (i === targetStep) ind.classList.add('active');
      else if (i < targetStep) ind.classList.add('completed');
    }

    if (line) {
      line.classList.remove('completed');
      if (i < targetStep) line.classList.add('completed');
    }
  }

  currentWizardStep = targetStep;

  if (targetStep === 4) {
    updateSummaryDetails();
  }
}

function updateSummaryDetails() {
  const summaryBox = document.getElementById('summaryDetailsText');
  if (!summaryBox) return;

  const origem = document.getElementById('origemCidade').value.trim() || 'Não informado';
  const origemBairro = document.getElementById('origemBairro').value.trim();
  const destino = document.getElementById('destinoCidade').value.trim() || 'Não informado';
  const destinoBairro = document.getElementById('destinoBairro').value.trim();
  const tipoServico = document.getElementById('tipoServicoSelect').value || 'Não informado';
  const veiculo = document.getElementById('tipoVeiculoSelect').value || 'Aconselhado pela AC';
  const peso = document.getElementById('pesoEstimado').value.trim() || 'A combinar';

  summaryBox.innerHTML = `
    <p><strong>• Coleta (Origem):</strong> ${origem} ${origemBairro ? `(${origemBairro})` : ''}</p>
    <p><strong>• Entrega (Destino):</strong> ${destino} ${destinoBairro ? `(${destinoBairro})` : ''}</p>
    <p><strong>• Serviço:</strong> ${tipoServico} | <strong>Veículo:</strong> ${veiculo}</p>
    <p><strong>• Carga:</strong> ${peso}</p>
  `;
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateStep(4)) return;

  const origem = document.getElementById('origemCidade').value.trim();
  const origemBairro = document.getElementById('origemBairro').value.trim();
  const origemTipo = document.getElementById('origemTipo').value;
  
  const destino = document.getElementById('destinoCidade').value.trim();
  const destinoBairro = document.getElementById('destinoBairro').value.trim();
  const dataPref = document.getElementById('dataPreferencial').value;
  
  const tipoServico = document.getElementById('tipoServicoSelect').value;
  const veiculo = document.getElementById('tipoVeiculoSelect').value;
  const peso = document.getElementById('pesoEstimado').value.trim();
  const obs = document.getElementById('observacoesCarga').value.trim();

  const nome = document.getElementById('clienteNome').value.trim();
  const tel = document.getElementById('clienteTelefone').value.trim();

  let msg = `🚚 *SOLICITAÇÃO DE COTAÇÃO - AC TRANSPORTE*\n`;
  msg += `_FRETES E MUDANÇAS INFORMAÇÕES_\n\n`;
  msg += `*Cliente:* ${nome}\n`;
  msg += `*WhatsApp:* ${tel}\n`;
  msg += `------------------------------------\n`;
  msg += `*📍 COLETA (ORIGEM):* ${origem}`;
  if (origemBairro) msg += ` - ${origemBairro}`;
  msg += ` (${origemTipo})\n`;
  
  msg += `*🏁 ENTREGA (DESTINO):* ${destino}`;
  if (destinoBairro) msg += ` - ${destinoBairro}`;
  if (dataPref) msg += `\n*Data Preferencial:* ${dataPref}`;
  
  msg += `\n------------------------------------\n`;
  msg += `*Modalidade:* ${tipoServico}\n`;
  msg += `*Veículo Preferencial:* ${veiculo}\n`;
  if (peso) msg += `*Peso / Volume:* ${peso}\n`;
  if (obs) msg += `*Observações:* ${obs}\n`;

  const encodedMsg = encodeURIComponent(msg);
  // Número oficial de WhatsApp principal da AC Transporte
  const whatsappUrl = `https://wa.me/5511912349106?text=${encodedMsg}`;

  if (!navigator.onLine) {
    alert('Aparentemente você está offline. O link do WhatsApp foi gerado e será aberto.');
  }

  window.open(whatsappUrl, '_blank');
}
