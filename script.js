/* ==========================================================================
   AC TRANSPORTE - SCRIPT PRINCIPAL CORPORATIVO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
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

/* 2. HIGHLIGHT E SCROLL DOS LINKS DA NAVBAR */
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

/* 3. MODAL DA POLÍTICA DE PRIVACIDADE (LGPD) */
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

/* 4. SELEÇÃO DIRETA DE SERVIÇOS NOS CARDS */
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

/* 5. FORMULÁRIO CALCULADORA DE FRETE CORPORATIVA */
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

    // Validação dos campos obrigatórios
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

    // Formatação de mensagem profissional para WhatsApp
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
