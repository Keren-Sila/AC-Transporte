const root = () => document.body.dataset.root || '';

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('is-error', isError);
  element.hidden = false;
}

export function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  let feedback = form.querySelector('[data-form-feedback]');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.className = 'form-feedback';
    feedback.dataset.formFeedback = '';
    feedback.setAttribute('role', 'status');
    feedback.hidden = true;
    form.append(feedback);
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const name = form.querySelector('#clienteNome')?.value || '';
    const company = form.querySelector('#clienteEmpresa')?.value || '';
    const phone = form.querySelector('#clienteTelefone')?.value || '';
    const email = form.querySelector('#clienteEmail')?.value || '';
    const origin = form.querySelector('#origemCidade')?.value || '';
    const destination = form.querySelector('#destinoCidade')?.value || '';
    const service = form.querySelector('#tipoServicoSelect')?.value || '';
    const cargo = form.querySelector('#pesoEstimado')?.value || '';
    const notes = form.querySelector('#observacoesCarga')?.value || '';

    try {
      const response = await fetch(`${root()}api/quotes`, {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, company, phone, email, origin, destination, service, cargo, notes,
          consent: form.querySelector('[name="consent"]').checked,
          website: form.querySelector('[name="website"]')?.value || '',
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar sua cotação.');
      setMessage(feedback, result.reference ? `Pedido recebido. Protocolo ${result.reference}. A equipe entrará em contato.` : 'Pedido recebido.');
      form.reset();
    } catch (error) {
      const waText = `Olá! Gostaria de uma cotação.\n\nOrigem: ${origin}\nDestino: ${destination}\nServiço: ${service}\nPeso/Carga: ${cargo || 'Não informado'}\nNome: ${name}\nEmpresa: ${company || 'Não informado'}\nWhatsApp: ${phone}\nE-mail: ${email || 'Não informado'}\nMensagem: ${notes || 'Não informado'}`;
      const waUrl = `https://wa.me/5511912349106?text=${encodeURIComponent(waText)}`;

      feedback.innerHTML = `Não foi possível conectar ao servidor. <br><a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex;margin-top:10px;padding:10px 18px;font-size:0.85rem;">Toque aqui para enviar via WhatsApp ↗</a>`;
      feedback.className = 'form-feedback is-error';
      feedback.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
}

async function adminRequest(path, csrfToken, options = {}) {
  const response = await fetch(`${root()}api/admin${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...(options.headers || {}) },
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Falha ao acessar painel.');
  return data;
}

async function trackingAdminRequest(path, csrfToken, options = {}) {
  const response = await fetch(`${root()}api/tracking${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Falha ao atualizar o rastreamento.');
  return data;
}

export function initAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (!panel) return;
  const login = panel.querySelector('#adminLogin');
  const dashboard = panel.querySelector('#adminDashboard');
  const message = panel.querySelector('[data-admin-message]');
  let csrfToken = null;

  const text = (node, value) => { node.textContent = value ?? ''; };
  const loadDashboard = async () => {
    const [quoteData, shipmentData] = await Promise.all([adminRequest('/quotes', csrfToken), adminRequest('/shipments', csrfToken)]);
    const quotes = panel.querySelector('#adminQuotes');
    quotes.replaceChildren();
    for (const quote of quoteData.quotes) {
      const row = document.createElement('article');
      row.className = 'admin-record';
      const details = document.createElement('div');
      const title = document.createElement('h3'); text(title, `${quote.reference} · ${quote.name}`);
      const info = document.createElement('p'); text(info, `${quote.company || quote.email || quote.phone} · ${quote.origin} → ${quote.destination} · ${quote.service}`);
      const status = document.createElement('p'); text(status, `Status: ${quote.status}`);
      details.append(title, info, status);
      const select = document.createElement('select');
      select.setAttribute('aria-label', `Alterar status de ${quote.reference}`);
      for (const [value, label] of [['new', 'Nova'], ['contacted', 'Em contato'], ['quoted', 'Cotada'], ['closed', 'Encerrada']]) {
        const option = document.createElement('option'); option.value = value; option.textContent = label; option.selected = value === quote.status; select.append(option);
      }
      select.addEventListener('change', async () => {
        try {
          await adminRequest(`/quotes/${quote.id}/status`, csrfToken, { method: 'PATCH', body: JSON.stringify({ status: select.value }) });
          text(message, 'Status da cotação atualizado.');
        } catch (error) { setMessage(message, error.message, true); }
      });
      row.append(details, select); quotes.append(row);
    }
    const shipments = panel.querySelector('#adminShipments');
    shipments.replaceChildren();
    for (const shipment of shipmentData.shipments) {
      const row = document.createElement('article'); row.className = 'admin-record';
      const info = document.createElement('p'); text(info, `${shipment.trackingCode} · ${shipment.reference} · ${shipment.origin} → ${shipment.destination} · ${shipment.status}`);
      row.append(info); shipments.append(row);
    }
  };

  const showDashboard = async () => {
    login.hidden = true; dashboard.hidden = false;
    try { await loadDashboard(); } catch (error) { setMessage(message, error.message, true); }
  };
  adminRequest('/session').then((session) => {
    if (session.authenticated) { csrfToken = session.csrfToken; return showDashboard(); }
  }).catch(() => {});

  login.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = login.querySelector('[type="submit"]'); submit.disabled = true;
    try {
      const result = await adminRequest('/login', null, { method: 'POST', body: JSON.stringify({ email: login.elements.namedItem('email').value, password: login.elements.namedItem('password').value }) });
      csrfToken = result.csrfToken; login.reset(); await showDashboard();
    } catch (error) { setMessage(message, error.message, true); }
    finally { submit.disabled = false; }
  });

  panel.querySelector('#adminLogout')?.addEventListener('click', async () => {
    try { await adminRequest('/logout', csrfToken, { method: 'POST' }); window.location.reload(); }
    catch (error) { setMessage(message, error.message, true); }
  });
  panel.querySelector('#shipmentForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const result = await trackingAdminRequest('/', csrfToken, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      setMessage(message, `Embarque criado: ${result.trackingCode}`); form.reset(); await loadDashboard();
    } catch (error) { setMessage(message, error.message, true); }
  });
  panel.querySelector('#trackingEventForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const code = data.code; delete data.code;
    try {
      await trackingAdminRequest(`/${encodeURIComponent(code)}/events`, csrfToken, { method: 'POST', body: JSON.stringify(data) });
      setMessage(message, 'Evento de rastreio registrado.'); form.reset(); await loadDashboard();
    } catch (error) { setMessage(message, error.message, true); }
  });
}

export function initTrackingLookup() {
  const form = document.getElementById('trackingForm');
  if (!form) return;
  const output = document.getElementById('trackingResult');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    const code = form.querySelector('[name="code"]').value.trim();
    const loading = document.createElement('p');
    loading.className = 'tracking-feedback';
    loading.textContent = 'Consultando as atualizações…';
    output.replaceChildren(loading);
    output.setAttribute('aria-busy', 'true');
    output.dataset.status = '';
    if (submit) submit.disabled = true;
    try {
      const response = await fetch(`${root()}api/tracking/${encodeURIComponent(code)}`, { credentials: 'same-origin' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível consultar a carga.');
      output.replaceChildren();
      output.dataset.status = data.status || '';
      const heading = document.createElement('h2'); heading.textContent = `Embarque ${data.tracking_code}`;
      const statusLabels = { created: 'Cadastrado', collected: 'Coletado', in_transit: 'Em trânsito', out_for_delivery: 'Saiu para entrega', delivered: 'Entregue', delayed: 'Atrasado', cancelled: 'Cancelado' };
      const summary = document.createElement('div'); summary.className = 'tracking-summary';
      const status = document.createElement('p'); status.className = 'tracking-status'; status.textContent = statusLabels[data.status] || 'Em atualização';
      const route = document.createElement('p'); route.className = 'tracking-route'; route.textContent = `${data.origin} → ${data.destination}`;
      summary.append(status, route);
      const list = document.createElement('ol'); list.className = 'tracking-events';
      for (const event of [...data.events].reverse()) {
        const item = document.createElement('li');
        const labels = { created: 'Embarque cadastrado', collected: 'Carga coletada', in_transit: 'Em trânsito', out_for_delivery: 'Saiu para entrega', delivered: 'Entregue', delayed: 'Atraso informado', cancelled: 'Cancelado' };
        const title = document.createElement('strong'); title.textContent = labels[event.status] || 'Atualização';
        const detail = document.createElement('p'); detail.textContent = event.location || 'Atualização registrada pela equipe.';
        const date = document.createElement('time'); date.dateTime = event.at; date.textContent = new Date(event.at).toLocaleString('pt-BR');
        item.append(title, detail, date); list.append(item);
      }
      output.append(heading, summary, list);
    } catch (error) {
      const paragraph = document.createElement('p'); paragraph.className = 'tracking-feedback is-error'; paragraph.textContent = error.message; output.replaceChildren(paragraph);
    } finally {
      output.setAttribute('aria-busy', 'false');
      if (submit) submit.disabled = false;
    }
  });
}
