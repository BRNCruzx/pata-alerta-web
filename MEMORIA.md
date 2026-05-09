# Memória do Projeto - PataAlerta

## Última atualização: 09/05/2026

---

## Backend (Spring Boot 3.4.4 / Java 21)

### ✅ Implementado

#### Autenticação 2FA (Dois Fatores)
- **Migration V003**: `two_factor_enabled` + `two_factor_secret` na tabela `users`
- **Model `User.java`**: campos `twoFactorEnabled`, `twoFactorSecret`
- **`TotpUtil.java`**: Geração de segredo (Base32), validação TOTP (RFC 6238), geração de URL `otpauth://` para QR Code
- **`Base32.java`**: Codificação Base32 para chaves TOTP
- **Fluxo de login modificado** (`AuthService`):
  1. Se 2FA desabilitado → retorna JWT direto (igual antes)
  2. Se 2FA habilitado → retorna `{ twoFactorRequired: true, tempToken }` (token temporário de 5min)
- **Endpoints novos**:
  - `POST /auth/2fa/enable` (auth) → gera secret, retorna secret + qrCodeUrl
  - `POST /auth/2fa/verify` (público) → tempToken + código TOTP → retorna JWT real
  - `POST /auth/2fa/disable` (auth) → password → desabilita 2FA
- **`JwtTokenProvider`**: `generateTempToken()` com claim `twoFactorPending` e expiração de 5 minutos; `isTwoFactorPending()` para verificar
- **`AuthResponse`**: campos novos `twoFactorRequired`, `tempToken`
- **`UserResponse`**: campo novo `twoFactorEnabled`
- **DTOs**: `Enable2FAResponse`, `Verify2FARequest`, `Verify2FAResponse`, `Disable2FARequest`

#### Notificações por Email
- **Dependência**: `spring-boot-starter-mail` no `pom.xml`
- **Config**: `application.yml` com `spring.mail.*` (SMTP Gmail, configurável via env vars)
- **`EmailService.java`**: Envio de email com `sendEmail(to, subject, body)`, `sendVaccineAlert()`, `sendDailyReminder()`
- **`NotificationScheduler.java`**: Agora envia email + push notification nas tarefas agendadas:
  - 07:00 → lembrete diário de atividades (push + email para todos usuários)
  - 08:00 → alerta de vacinas vencendo (push + email para donos dos pets)

### Variáveis de ambiente para email
```
APP_MAIL_HOST=smtp.gmail.com
APP_MAIL_PORT=587
APP_MAIL_USERNAME=seu-email@gmail.com
APP_MAIL_PASSWORD=sua-senha-de-app
```

---

## Web (React)

### ✅ Implementado

#### Arquitetura
- `AppLayout.js` — Layout único que renderiza mobile (header laranja + bottom nav) ou web (navbar + sidebar) baseado no `isMobile`
- `PetContext.js` — Contexto global do pet selecionado entre todas as páginas
- `App.js` — React Router com layout aninhado

#### Páginas e funcionalidades

| Rota | Arquivo | Funcionalidade |
|------|---------|----------------|
| `/app` | `Dashboard.js` | Visão geral: cards de saúde + timeline de hoje |
| `/app/vaccines` | `Vaccines.js` | CRUD: listar, cadastrar e deletar vacinas |
| `/app/food` | `Food.js` | CRUD: listar, cadastrar, completar e deletar alimentação |
| `/app/walks` | `Walks.js` | CRUD: listar, cadastrar, completar e deletar passeios |
| `/app/vet` | `Vet.js` | CRUD: listar, cadastrar, completar e deletar consultas |
| `/app/schedule` | `Schedule.js` | Listar atividades agrupadas por data, com filtros |
| `/app/alerts` | `Alerts.js` | Alertas: vacinas vencendo, atividades pendentes/atrasadas |
| `/app/profile` | `Profile.js` | Editar perfil, alterar senha, info do plano |

#### Próximos passos sugeridos
1. Frontend da web: adicionar página de configuração 2FA (habilitar/desabilitar, mostrar QR code)
2. Frontend mobile: adaptar login para fluxo 2FA (mostrar campo de código quando `twoFactorRequired=true`)
3. Configurar SMTP de produção para envio de emails
4. Adicionar Firebase Admin SDK (`firebase-adminsdk.json`) em produção

---

## Backend - Estrutura de arquivos modificados/criados

```
src/main/java/com/patalerta/
├── controller/
│   └── AuthController.java              ← modificado (add 2FA endpoints)
├── dto/
│   ├── AuthResponse.java                ← modificado (twoFactorRequired, tempToken)
│   ├── UserResponse.java                ← modificado (twoFactorEnabled)
│   ├── Disable2FARequest.java           ← novo
│   ├── Enable2FAResponse.java           ← novo
│   ├── Verify2FARequest.java            ← novo
│   └── Verify2FAResponse.java           ← novo
├── model/
│   └── User.java                        ← modificado (2FA fields)
├── security/
│   └── JwtTokenProvider.java            ← modificado (temp token)
├── service/
│   ├── AuthService.java                 ← modificado (2FA login flow)
│   ├── EmailService.java                ← novo
│   └── NotificationScheduler.java       ← modificado (email integration)
└── util/
    ├── Base32.java                      ← novo
    └── TotpUtil.java                    ← novo

src/main/resources/
├── application.yml                      ← modificado (mail config)
└── db/migration/
    └── V003__add_2fa.sql                ← novo

pom.xml                                  ← modificado (mail dependency)
```
