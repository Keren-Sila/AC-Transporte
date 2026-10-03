# 🚛 AC Transporte — Site Institucional & Plataforma de Cotação de Frete

> **Cargas em movimento. Destinos conectados.**

Plataforma web institucional e sistema de cotação interativa de frete rodoviário para a **AC Transporte LTDA**, empresa de transporte de cargas com sede em São Paulo (SP).

---

## 📌 Visão Geral do Projeto

Este projeto consiste em um site institucional de alta performance, seguro, totalmente responsivo e pensado primeiramente para dispositivos móveis (*Mobile First*). O design adota o tema **Dark Mode** com a identidade visual da empresa (Laranja `#FF7700`, Preto `#0A0A0D` e Branco `#FFFFFF`), contando com animações interativas conectadas à rolagem da página.

### 🎯 Principais Funcionalidades Implementadas

1. **Visual & Identidade da Marca:**
   - Logo vetorial em SVG recriado em versão clara/escura com linhas de velocidade e ícone de caminhão baú.
   - Design System moderno com Glassmorphism, CSS Variables e tipografia *Plus Jakarta Sans*.

2. **Animação Interativa de Estrada ("A Rota da Carga"):**
   - Linha de progresso lateral em laranja que se preenche conforme o scroll do usuário.
   - Caminhão marcador que avança pela estrada e ativa os 3 pontos de verificação (**01. Saída**, **02. Em Trânsito**, **03. Chegada**).

3. **Calculadora / Formulário de Cotação em 4 Passos:**
   - **Passo 1 (Origem):** Cidade/UF, Bairro/CEP e Tipo de Local.
   - **Passo 2 (Destino):** Cidade/UF, Bairro/CEP e Data Preferencial.
   - **Passo 3 (Carga):** Modalidade do serviço (Municipal, Intermunicipal, Interestadual, Expressa), Peso estimado, Volume e Observações.
   - **Passo 4 (Contato):** Nome, WhatsApp (obrigatório) e E-mail, acompanhado de um card de resumo pré-envio.
   - Envio automático com formatação de mensagem direta para o WhatsApp da transportadora.

4. **Nossa Especialidade & Serviços:**
   - Grid de cards de serviços com atalho direto que pré-seleciona a modalidade na cotação.

5. **A AC Transporte & Diferenciais:**
   - Apresentação objetiva e sem promessas fictícias (empresa cadastrada no Simples Nacional, sede em São Paulo).
   - Destaque para os 4 diferenciais: *Atendimento Direto*, *Comunicação via WhatsApp*, *Cuidado com a Carga* e *Prazo Combinado*.

6. **Área de Atuação & Cobertura:**
   - Seletor interativo por abas (Capital SP, Grande SP/ABC, Interior/Litoral, Interestadual) com ilustração vetorial de malha rodoviária.

7. **Acessibilidade & Segurança (LGPD):**
   - Modal completo de **Política de Privacidade (LGPD)** no rodapé.
   - Foco visível (`:focus-visible`) para navegação por teclado (WCAG 2.1 AA).
   - Suporte a `prefers-reduced-motion` para usuários sensíveis a animações.
   - Botão flutuante (FAB) do WhatsApp com tooltip e animação de pulso.

---

## 🛠️ Arquitetura e Estrutura de Arquivos

```text
AC-Transporte/
├── index.html       # Estrutura HTML5 semântica e acessível
├── styles.css       # Design System CSS3, variáveis, animações e responsividade
├── script.js       # Lógica JS: scroll observers, wizard 4 passos, WhatsApp generator & LGPD modal
├── .gitignore       # Regras de exclusão para Git
└── README.md        # Documentação completa do projeto
```

---

## 🔒 Segurança e Recomendação de Produção

Para garantir alta disponibilidade (não sair do ar) e segurança máxima:
1. **Hospedagem Estática (Jamstack):** Deploy via Cloudflare Pages ou Vercel (sem servidor dinâmico para cair).
2. **Proteção de Borda:** Cloudflare DNS + HTTPS Gratuito + Cloudflare Turnstile contra bots e requisições maliciosas no formulário.
3. **Privacidade de Dados:** Nenhuma chave secreta fica exposta no front-end. As mensagens transitam de forma segura.

---

## 🚀 Como Executar Localmente

Como o projeto é construído em HTML/CSS/JS nativos e otimizados:
1. Abra a pasta do projeto no seu editor de código (VS Code, Antigravity IDE, etc.).
2. Abra o arquivo `index.html` em qualquer navegador moderno ou utilize uma extensão de servidor local (ex: *Live Server*).

---

## 📦 Repositório Git Privado & Como Enviar para o GitHub

O repositório Git local já foi inicializado nesta pasta. Para publicar o projeto no seu **GitHub Privado**:

1. Crie um novo repositório **Privado** no seu GitHub chamado `AC-Transporte` (sem inicializar com README).
2. No seu terminal, execute os seguintes comandos substituindo pelo seu link do GitHub:

```bash
git remote add origin https://github.com/Keren-Nunes/AC-Transporte.git
git branch -M main
git push -u origin main
```

---

*Desenvolvido com excelência para AC Transporte LTDA.*
