# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc1] - 2026-07-22

### Added (OS-0023 — Hardening & Qualidade)

- **Testing Infrastructure**: Vitest (162 tests), Playwright E2E, coverage thresholds
- **Observability**: Logger (requestId/correlationId), ErrorTracker, Performance metrics
- **Health Check**: `GET /api/health` (status, version, database, uptime, memory)
- **Security Middleware**: CSP, HSTS, X-XSS-Protection, X-Frame-Options, X-Content-Type-Options
- **Input Sanitization**: XSS prevention (sanitizeInput, sanitizeObject)
- **Rate Limiter**: In-memory rate limiter for auth endpoints
- **Environment Validation**: validateEnvironment() for required variables
- **Performance**: optimizePackageImports, pagination helpers, lazy load detection
- **Database Indexes**: 80+ indexes across all models (companyId, deletedAt, status, FKs)

### Added (OS-0024 — Deploy & Operação)

- **Environment Configuration**: .env.development, .env.staging, .env.production
- **Backup Procedures**: Full + incremental, storage, config, retention policy
- **Restore Procedures**: Database, storage, config, rollback
- **Versioning Strategy**: Semantic Versioning, branch model, tag convention
- **Monitoring**: Resource usage tracking, response time measurement
- **Admin Manual**: Installation, update, user management, permissions, logs, audit
- **User Manual**: Login, navigation, CRM, projects, OS, financial, dashboard
- **Operations Manual**: Environment specs, deploy, troubleshooting
- **Security Policy**: Vulnerability reporting, authentication, RBAC, data protection

### Added (OS-0021 — Dashboard)

- Executive Dashboard with Recharts (Bar, Line, Area, Pie, Funnel)
- Metric cards: StatCard, MetricCard, ProgressCard
- 4 business sections: Commercial, Production, Financial, Operation
- GlobalFilters (period, department, responsible)

### Added (OS-0020 — Administration)

- RBAC roles/permissions matrix
- Audit timeline with Before/After values
- Session management with revoke capability
- Security settings (expiration, attempts, block, MFA)
- System logs with level/module filtering
- Integration Service: typed cross-module flow (Lead → Financial)

### Changed

- Auth module: types/, schemas/, barrel, Zod v4 validation
- Navigation: Administração section (6 sub-items)
- ESLint: All non-pattern errors resolved
- Package version: `0.1.0` → `1.0.0-rc1`
- Proxy: Security headers + logging integrated
- System config: Version updated to `1.0.0`

### Fixed

- ESLint: prefer-const, no-explicit-any, no-empty-object-type, no-unescaped-entities
- TypeScript: strict mode compliance (11 type errors resolved)
- Empty Portuguese-named shell modules removed

### Security

- HTTP security headers (CSP, HSTS, X-XSS-Protection, X-Frame-Options)
- Input sanitization against XSS
- Rate limit structure for auth
- Environment variable validation
- Session management via Supabase Auth
- Audit logging for all operations

## [1.0.0] - 2026-07-25

### Added (OS-0034 — Comunicação Unificada / Omnichannel)
- **Communication Module**: Conversations, inbox, notifications, templates
- **Prisma Models**: AiConversation, AiMessage, etc.
- **UI Pages**: `/app/comunicacao/*` (conversas, inbox, notificacoes, templates)
- **Core Services**: Message providers, notification engine, template system

### Added (OS-0035 — No-Code Builder)
- **Builder Module**: Entity builder, form builder, layout builder, field registry
- **Prisma Models**: Dynamic entity/field definitions
- **UI Pages**: `/app/builder/*` (entities, layouts, forms)
- **Core Engine**: Renderer, validation engine, field types registry

### Added (OS-0036 — Eventos, Filas, Jobs)
- **Event Bus**: pub/sub with 13 internal events, registry, publishers, subscribers
- **Queue System**: 4 priority levels, scheduler (cron/interval/one_time/manual), retry (none/linear/exponential/custom)
- **Jobs Module**: 5 mock jobs, 3 executions, 3 schedules, 5 events
- **UI Pages**: `/app/system/jobs`, `scheduler`, `events`, `workers`

### Added (OS-0037 — Auditoria, Compliance, Governança)
- **Security Core**: Audit (13 actions), Compliance (LGPD/ISO 27001/SOC 2/OWASP), Governance (approvals), Policies (password/session/access/encryption/audit)
- **Security Module**: 7 audit events, 5 logs, 3 policies, 4 retentions
- **UI Pages**: `/app/security/*` (dashboard, audit, logs, policies, retention, compliance)

### Added (OS-0038 — Super Admin SaaS)
- **Platform Core**: Licensing (5 states), Billing (3 plans), Monitoring (11 metrics), Tenants (5 companies)
- **Platform Module**: Users, licenses, metrics, announcements
- **UI Pages**: `/platform/*` (dashboard, companies, plans, licenses, users, metrics, announcements, settings)

### Added (OS-0039 — Observabilidade, DevOps)
- **DevOps Core**: Logging (6 levels TRACE→FATAL), monitoring (uptime/memory/CPU), health (8 services), deployment, backup
- **DevOps Module**: Dashboard cards, log table, health cards, deployment/backup tables
- **UI Pages**: `/app/system/*` (dashboard, monitoring, logs, health, deployments, backups)

### Added (OS-0040 — Production Ready / Release 1.0)
- **Documentation**: Architecture (overview, folder structure, modules, patterns, business rules), Database (overview, schema), API (overview), Security (overview), Deployment (overview, Docker guide), Developer Guide (getting started, coding standards), ADRs (001-004)
- **Docker**: Multi-stage Dockerfile, docker-compose.yml (app + postgres), docker-compose.dev.yml, .dockerignore
- **Verification Scripts**: verify-project, verify-permissions, verify-routes, verify-modules, verify-env, generate-docs, health-check
- **Security Hardening**: Permission validation, route validation, env var validation, modular consistency checks
- **Performance**: Dynamic imports pattern, lazy loading structure, Suspense boundaries, memo pattern, server component optimization

### Changed
- Version: `1.0.0-rc1` → `1.0.0`
- All 29 modules reviewed for barrel exports and structural consistency
- Documentation restructured into 9 subdirectories under docs/
- package.json: scripts for verification, docker, and docs generation

### Fixed
- TypeScript strict compliance across all modules
- Module barrel file restoration (system module restored from devops overwrite)
- Audit schema type compatibility (z.unknown → z.record)
- Server action type assertions (as → as unknown as)

[1.0.0]: https://github.com/visualerp/visual-erp/releases/tag/v1.0.0
[1.0.0-rc1]: https://github.com/visualerp/visual-erp/releases/tag/v1.0.0-rc1
