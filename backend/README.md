# Backend AC Transporte

API REST para cotações, painel administrativo e rastreamento de cargas.

## Módulos

- `POST /api/quotes`: valida e registra pedidos de cotação.
- `/api/admin/*`: sessão administrativa, gestão de cotações e criação/atualização de embarques.
- `GET /api/tracking/:code`: consulta pública limitada a eventos e situação do embarque, sem expor dados pessoais.
- PostgreSQL para contas, cotações, sessões, embarques e eventos de rastreio.

## Segurança aplicada

- Helmet/CSP, HTTPS obrigatório em produção, cookies `HttpOnly`, `Secure` e `SameSite=Strict`.
- Senhas armazenadas com Argon2id; sessão regenerada no login e revogada no logout.
- Verificação de `Origin` e token CSRF em operações administrativas.
- Limites por IP, tamanho de corpo, validação por esquema, campos limitados e respostas de erro sem detalhes internos.
- Consultas SQL parametrizadas; dados privados não aparecem na rota pública de rastreio.
- Um campo honeypot reduz envios automatizados no formulário.

O painel só pode ser usado após configurar um banco, segredos e criar a primeira conta administrativa. Não há usuário ou senha padrão. Em produção, `DATA_RETENTION_DAYS` é obrigatório; os registros de cotação vencidos são removidos diariamente. Para múltiplos servidores, configure um armazenamento compartilhado para rate limit. Configure backups cifrados, alertas e controles de acesso no provedor antes de receber dados reais.

## Execução

Consulte o `README.md` da raiz e `.env.example`. Execute as migrações com `npm run db:migrate` e crie a conta inicial com `npm run admin:create`. O processo não é pronto para produção sem domínio, TLS, gestão de segredos e política de retenção aprovada.
