# Correções para iPhone/Safari

## JavaScript
- `js/main.js`: se um componente (cabeçalho, rodapé, modal) não carregar, o resto do site continua funcionando. Cada módulo agora inicia isolado, então um erro não derruba menu, animações e formulário.
- `js/page-transition.js`: ao voltar para a página pelo botão/gesto de voltar do Safari, a camada escura da transição não fica mais cobrindo a tela (cache de página do iOS). Também tem uma trava de segurança de 4 s.
- `js/form.js`: quando não existe API no endereço (como no GitHub Pages), o formulário mostra um link para enviar a cotação pelo WhatsApp, já com os dados preenchidos. Antes aparecia uma mensagem de erro técnica.

## CSS (`css/motion.css`, `css/profissional.css`)
- `-webkit-text-size-adjust: 100%`: o iPhone não aumenta mais o texto ao girar a tela.
- Campos e select sem o estilo nativo do iOS, com seta própria no select.
- Margem de segurança lateral (notch) no iPhone em paisagem.
- Alturas com `svh` agora têm alternativa em `vh` para iOS mais antigo.

## HTML
- `apple-touch-icon` em PNG 180x180 (o iOS ignora SVG) e favicon PNG de 32 px.
- `format-detection: telephone=no` para o iOS não pintar o telefone de azul sozinho.
- Barra de status do modo "Adicionar à Tela de Início" mudou de `black-translucent` para `default` (texto legível sobre o cabeçalho branco).
- `pages/404.html`: caminhos absolutos (`/css/...`) trocados por relativos.

## Observação
Cabeçalho, rodapé e modal são carregados por `fetch()`. Por isso o site precisa ser aberto por um endereço (GitHub Pages, servidor Node), e não pelo arquivo direto no iPhone.

---

# Segunda rodada: animações no iPhone

## Por que as animações não apareciam no iPhone
1. O CSS do celular travava os dois caminhões com `transform ... !important`. Com isso, a entrada dos caminhões (que funciona no computador) nunca rodava no celular.
2. O código classificava o aparelho como "lite" (animações reduzidas) pela contagem de núcleos do processador. O Safari do iPhone informa poucos núcleos, então todo iPhone caía nesse modo. Agora só "Economia de dados" liga o modo lite.
3. No celular, a primeira rolagem fazia a cena do hero "pular" (o palco não fica fixo na tela, mas o código ainda tentava conduzir a cena pela rolagem). Corrigido em `js/animations/story.js`.
4. O logo do caminhão de volta aparecia espelhado (texto ao contrário). Corrigido: só a imagem é virada.

## Animações novas (`css/extra-motion.css` e `js/animations/extra.js`)
- Hero no celular: os caminhões entram dirigindo, um pela esquerda e outro pela direita, freiam ao chegar e depois balançam de leve. Ao rolar, deslizam em sentidos opostos. O velocímetro acompanha a chegada e para em 0 KM/H.
- Faixa laranja correndo logo abaixo do hero (fretes, serviços, MadeiraMadeira, Mercado Livre e as três bases).
- Títulos das seções aparecem palavra por palavra.
- Números das etapas entram com efeito de "pulo".
- Botão do WhatsApp com anel pulsante.
- Botões "Solicitar cotação" com brilho passando.
- Toque nos botões com ondinha, e os botões e cartões "afundam" ao serem tocados (o iPhone não tem hover).

## Importante
Se o iPhone estiver com Ajustes > Acessibilidade > Movimento > Reduzir Movimento ligado, o site desliga todas as animações de propósito, e a página aparece parada. Isso é uma regra de acessibilidade do iOS.
