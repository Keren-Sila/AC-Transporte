export function initWhatsApp() {
  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.getElementById('tipoServicoSelect');
      if (select) {
        const service = link.dataset.service === 'Fretes Urbanos e Mudanças'
          ? 'Mudanças Residenciais / Comerciais'
          : link.dataset.service;
        select.value = service;
      }
    });
  });
}
