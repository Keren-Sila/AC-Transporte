# AC Transporte

Site institucional e API para atendimento de transporte rodoviário em São Paulo. A interface usa azul-marinho e laranja, chamadas claras para cotação e componentes comuns entre as páginas.

## Estrutura

```text
AC-Transporte/
├── index.html
├── README.md
├── .gitignore
├── robots.txt
├── sitemap.xml
├── pages/                 # Empresa, serviços, frota, contato, privacidade, painel e rastreio
├── assets/                # Logos, ícones, imagens e fontes
├── css/                   # Estilos organizados por área
├── js/                    # Navegação, animações, formulários e contato
├── components/            # Cabeçalho, rodapé e modal compartilhados
└── backend/               # API Express, PostgreSQL, autenticação, migrations
```

## Funcionalidades

- Formulário de cotação envia dados validados à API; o painel lista e atualiza o status.
- Painel interno com login por e-mail e senha, sessões no PostgreSQL e proteção CSRF.
- Gestão de embarques e eventos; consulta pública usa código AC e exibe apenas status, rota e eventos informados pela equipe. Não há GPS em tempo real.
- Páginas de empresa, serviços, veículos considerados, contato e privacidade.

## Executar localmente

Requer Node.js 20+ e PostgreSQL. O site usa `fetch()` para carregar os componentes e precisa ser aberto pelo servidor Node, não diretamente via `file://` nem apenas Live Server.

```powershell
Copy-Item backend/.env.example backend/.env
# Edite backend/.env; use uma senha forte para o banco e um segredo aleatório com 32+ caracteres.
Set-Location backend
npm install
npm run db:migrate
npm run admin:create
npm run dev
```

Abra `http://localhost:3000`. O script `admin:create` cadastra ou redefine a senha da conta informada; não existe usuário padrão. O PostgreSQL deve estar iniciado e acessível pela `DATABASE_URL`.

## Backend e segurança

Veja [backend/README.md](backend/README.md). O código aplica Helmet/CSP, cookies `HttpOnly`/`SameSite`, hash Argon2id, limite de requisições, validação de esquema, limite de corpo, verificação de origem/CSRF e consultas parametrizadas. O painel não usa credenciais padrão.

Essa base técnica não é certificação de segurança nem substitui revisão operacional. Antes de produção: definir o domínio, configurar HTTPS e segredo de sessão no ambiente, escolher `DATA_RETENTION_DAYS`, backups cifrados, monitoramento, proteção distribuída contra abuso e revisar a política de privacidade. O servidor recusa iniciar em modo de produção enquanto o prazo de retenção não estiver configurado.

## SEO e publicação

`robots.txt` está pronto para o domínio raiz; `sitemap.xml` fica sem endereços até a AC Transporte escolher o domínio público. Informe o domínio para publicar URLs canônicas, sitemap completo e configuração de produção. A fotografia da capa atual é ilustrativa e externa; substitua por imagem autorizada da operação antes do lançamento.
