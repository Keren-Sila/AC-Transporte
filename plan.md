# Plano de movimento — AC Transporte

## Direção visual

- **Movimento:** editorial logístico cinematográfico, inspirado em demonstrações mobile-first com scroll storytelling, mas adaptado à identidade da AC Transporte.
- **Princípios:** hierarquia tipográfica forte; movimento direcional de rota; entradas progressivas por seção; microinterações discretas e funcionais.
- **Paleta:** papel quente para leitura e proximidade; asfalto escuro para operação e confiança; laranja proprietário para indicar ação, rota e progresso.
- **Layout:** narrativa vertical com faixas de conteúdo, linhas de percurso e blocos que entram em sequência, evitando excesso de cards flutuantes.
- **Elementos assinatura:** caminhão SVG entrando no hero; linha de progresso do documento; números das etapas funcionando como marcos de uma rota.
- **Interação:** o scroll conduz a jornada; hover reage apenas em dispositivos com ponteiro; links e botões mantêm affordance clara; nenhuma animação depende de áudio.
- **Animação:** entradas entre 450–800 ms com easing suave; stagger de até 95 ms; parallax limitado a poucos pixels; movimento ambiente lento; respeito integral a `prefers-reduced-motion`.
- **Tipografia:** Plus Jakarta Sans, títulos grandes e compactos, textos curtos e diretos, contraste alto.
- **Essência da marca:** transporte rodoviário próximo, planejado e sem complicação. Personalidade: direta, cuidadosa e eficiente.
- **Tom:** headlines objetivas e CTAs de ação, como “Acompanhe a rota” e “Pedir cotação”.
- **Marca:** o caminhão ilustrado com assinatura AC funciona como wordmark visual em movimento; o laranja `#E8610A` é a cor proprietária.

## Implementação

- `css/motion.css`: camada final de estilos para hero, reveal, progresso, parallax visual, etapas, cards, páginas internas e responsividade.
- `js/animations/story.js`: coordena estado do header, progresso de seção, parallax do hero e deriva do caminhão conforme a rolagem.
- `js/animations/index.js`: registra o novo módulo junto ao motor de animações existente.
- `index.html`: adiciona o convite de rolagem no hero e carrega a camada visual final.
- Demais páginas HTML: carregam o mesmo CSS para manter a linguagem de movimento consistente.
- `manus-routes.json`: declara as rotas estáticas da experiência.
