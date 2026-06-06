# Claryon Portal

SaaS de agentes IA para empresas. Cada agente es un "trabajador virtual" especializado que ayuda con marketing, prospección, análisis y más.

---

## 🚀 Stack técnico

| Componente | Tecnología |
|---|---|
| Frontend | Next.js 14 + React + Tailwind CSS |
| Backend | Next.js API Routes |
| Base de datos | Supabase (Postgres) + Drizzle ORM |
| LLM | Anthropic Claude API |
| Auth | Auth.js v5 (Sprint 2) |
| Compilación de agentes | `scripts/compile-agents.ts` |

---

## 📋 Requisitos previos

- Node.js 24+ (verificar con `node --version`)
- npm 10+
- Cuenta de Supabase
- `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com)

---

## 🔧 Setup inicial

### 1. Clona el repo

```bash
git clone https://github.com/memovene09-hub/ai-client-portal.git
cd ai-client-portal
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (Postgres via Drizzle)
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres?sslmode=require

# App
NEXT_PUBLIC_APP_NAME=Claryon Portal
NEXT_PUBLIC_TENANT_ID=claryon-demo
```

### 4. Ejecuta migraciones de BD

```bash
npm run db:migrate
```

Verifica que la tabla se creó:

```bash
npm run db:studio
# Abre localhost:4983 en el navegador
```

### 5. Compila los agentes

```bash
npm run compile-agents
```

### 6. Levanta el servidor

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta servidor Next.js en puerto 3000 |
| `npm run build` | Build de producción |
| `npm run start` | Inicia servidor de producción |
| `npm run compile-agents` | Compila archivos de agentes a JSON serializado |
| `npm run db:migrate` | Aplica migraciones a Supabase |
| `npm run db:generate` | Genera migraciones desde `schema.ts` |
| `npm run db:studio` | Abre Drizzle Studio (inspector visual de BD) |

---

## 📂 Estructura de carpetas

```
ai-client-portal/
├── agents/
│   ├── claryon-prospectos/
│   │   ├── CLAUDE.md              ← Instrucciones del agente
│   │   ├── ClaryonContext.md      ← Contexto de Claryon
│   │   ├── MODES.json             ← Definición de modos
│   │   ├── compiled.json          ← [Generado por npm run compile-agents]
│   │   └── skills/
│   │       ├── busqueda.md
│   │       ├── scoring.md
│   │       ├── correo-contacto.md
│   │       └── insercion-notion.md
│   └── [otros agentes]/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx                 ← Root layout
│   ├── page.tsx                   ← Redirect a /dashboard
│   ├── (auth)/
│   │   └── login/page.tsx         ← Pantalla de login [stub, Sprint 2]
│   ├── (dashboard)/               ← Rutas protegidas (sidebar + nav)
│   │   ├── layout.tsx             ← Sidebar + nav
│   │   ├── dashboard/page.tsx     ← Dashboard home
│   │   ├── chat/page.tsx          ← Chat con agente (pantalla principal)
│   │   └── settings/page.tsx      ← Configuración de empresa
│   └── api/
│       ├── chat/route.ts          ← POST /api/chat (streaming)
│       └── settings/route.ts      ← GET/POST /api/settings
│
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ModeSelector.tsx
│   │   └── InputBar.tsx
│   ├── dashboard/
│   │   └── ActivityFeed.tsx
│   └── ui/
│       ├── Spinner.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── agent.ts                   ← buildSystemPromptFromCompiled()
│   ├── tenant.ts                  ← getTenantConfig()
│   ├── auth.ts                    ← [stub, Auth.js en Sprint 2]
│   └── db/
│       ├── schema.ts              ← Drizzle schema (Postgres)
│       ├── index.ts               ← Cliente Drizzle
│       └── tenant-context.ts      ← getTenantContext(), updateTenantContext()
│
├── types/
│   └── index.ts                   ← Tipos compartidos
│
├── config/
│   └── clients/
│       ├── claryon-demo.json      ← Config del tenant demo
│       └── bites-snacks.json      ← Config del tenant Bites [placeholder]
│
├── scripts/
│   └── compile-agents.ts          ← Pipeline de compilación de agentes
│
├── drizzle/
│   └── migrations/                ← SQL generado automáticamente
│
├── .env.example                   ← Plantilla de variables de entorno
├── .env.local                     ← Variables locales (gitignored)
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔄 Flujo de una consulta

```
[Browser] → /dashboard/chat
  └─ Selecciona modo + escribe mensaje
  └─ POST /api/chat { messages, modeId, tenantId }
  └─ [Server] Carga compiled.json del agente
  └─ buildSystemPromptFromCompiled(agentId, modeId)
  └─ Llama Claude API (streaming)
  └─ [Browser] Recibe y renderiza respuesta
```

---

## 🤖 Cómo agregar un nuevo agente

1. Crea la carpeta `agents/[nuevo-agente]/`
2. Agrega los archivos:
   - `CLAUDE.md` — instrucciones del agente
   - `[Context].md` — contexto específico
   - `MODES.json` — definición de modos (id, label, suffix)
   - `skills/` — archivos `.md` de habilidades
3. Compila:

```bash
npm run compile-agents
# [✓] nuevo-agente compiled — N skills, N modes
```

El pipeline detecta automáticamente cualquier carpeta en `agents/`.

---

## 📚 Documentación

- **Notion** — [Arquitectura, sprints y notas](https://www.notion.so/374807c3ed388197b96bc44b7b82c2ca)
- **GitHub** — [github.com/memovene09-hub/ai-client-portal](https://github.com/memovene09-hub/ai-client-portal)

---

## 🚦 Estado actual

### Sprint 1 — Completado ✅

- Next.js 14 + Tailwind + diseño Claryon
- Chat funcional con streaming (Claude API)
- Pipeline de compilación de agentes
- Supabase + Drizzle ORM (`tenant_context`)
- Pantalla de Configuración de Empresa

### Sprint 2 — Próximamente

- Auth.js v5 + Google OAuth
- Multi-tenant real con RLS en Supabase
- Persistencia de conversaciones en BD

### Sprint 3+

- Nuevo agente (quotation-agent)
- Analytics agent
- Stripe billing

---

## ⚠️ Deuda técnica conocida

| Ítem | Estado | Sprint |
|---|---|---|
| Login es mock (`setTimeout + router.push`) | Pendiente | Sprint 2 |
| `org_id` hardcodeado como `'claryon-demo'` en settings | Pendiente | Sprint 2 |
| Conversaciones en `useState` — no persisten entre refreshes | Pendiente | Sprint 2 |
| System prompt se carga en el servidor pero el cliente puede ver el agentId | En radar | Sprint 2 |

---

## 🛠️ Troubleshooting

**`DATABASE_URL` undefined**
Asegúrate de haber llenado `.env.local` y reinicia el servidor (`Ctrl+C` → `npm run dev`).

**`Agent [id] not compiled`**
Corre `npm run compile-agents` después de cambiar cualquier archivo en `agents/`.

**`Cannot find the middleware module`**
Caché de Next.js corrupto. Borra `.next/` y reinicia:
```bash
rm -rf .next && npm run dev   # bash
Remove-Item -Recurse -Force .next; npm run dev   # PowerShell
```

**Chat devuelve 500 al enviar mensaje**
Revisa la terminal del servidor. Generalmente es `ANTHROPIC_API_KEY` inválida o cuota agotada.

**Drizzle Studio no abre**
Verifica que `npm run db:migrate` completó sin errores y que `DATABASE_URL` apunta a Supabase con SSL.

---

## 📞 Contacto

- Dudas técnicas → Memo ([GitHub issues](https://github.com/memovene09-hub/ai-client-portal/issues))
- Decisiones de arquitectura → ver Notion
