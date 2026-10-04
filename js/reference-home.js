const serviceContent = {
  container: {
    index: '01 / cargo profile',
    title: 'Container',
    description: 'Operações de contêiner com planejamento de coleta, janela e entrega para a sua cadeia continuar em movimento.',
    visual: 'service-visual-container',
  },
  road: {
    index: '02 / cargo profile',
    title: 'Road Freight',
    description: 'Fretes rodoviários organizados para percorrer São Paulo e regiões próximas com visibilidade em cada etapa.',
    visual: 'service-visual-road',
  },
  truck: {
    index: '03 / cargo profile',
    title: 'Truck',
    description: 'Veículos e operação sob medida para cargas que precisam de presença, cuidado e resposta rápida.',
    visual: 'service-visual-truck',
  },
};

function initReferenceServices() {
  const tabs = [...document.querySelectorAll('[data-service]')];
  const index = document.querySelector('[data-service-index]');
  const title = document.querySelector('[data-service-title]');
  const description = document.querySelector('[data-service-description]');
  const visual = document.querySelector('[data-service-visual]');
  if (!tabs.length || !index || !title || !description || !visual) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const content = serviceContent[tab.dataset.service];
      if (!content) return;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      visual.className = `service-visual ${content.visual}`;
      index.textContent = content.index;
      title.textContent = content.title;
      description.textContent = content.description;
    });
  });
}

function initReferenceScrollState() {
  const header = document.querySelector('.reference-home .header-site');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initReferenceServices();
  initReferenceScrollState();
});
