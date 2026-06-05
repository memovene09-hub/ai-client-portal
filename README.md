# ai-client-portal

Interfaz web que permite a clientes de Claryon interactuar con sus agentes IA sin acceso técnico.

**Stack:** Next.js 14 · Tailwind CSS · Auth.js v5 · Anthropic SDK · Notion API

**Documentación de arquitectura:** https://www.notion.so/374807c3ed388197b96bc44b7b82c2ca

---

## Instalación

```bash
# Clonar el repo
git clone https://github.com/memovene09-hub/ai-client-portal.git
cd ai-client-portal

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y llenar ANTHROPIC_API_KEY y NOTION_API_KEY

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Pipeline de compilación de agentes

Los agentes viven en `agents/[agentId]/` como archivos Markdown editables. Antes de que el portal pueda usarlos, hay que compilarlos:

```bash
npm run compile-agents
```

Esto genera `agents/[agentId]/compiled.json` — un JSON serializado con el system prompt completo, contexto, skills y modos. El portal consume ese artefacto en runtime.

**Reglas:**
- Correr `npm run compile-agents` cada vez que se modifique `CLAUDE.md`, `ClaryonContext.md`, cualquier `skills/*.md` o `MODES.json`.
- `compiled.json` es autogenerado — no editar a mano.
- `compiled.json` está en `.gitignore` y no se commitea.

**Archivos fuente por agente:**

| Archivo | Rol |
|---|---|
| `CLAUDE.md` | System prompt base — instrucciones del agente |
| `ClaryonContext.md` | Contexto de la empresa y servicios |
| `skills/*.md` | Habilidades modulares del agente |
| `MODES.json` | Modos de operación con sus suffixes de prompt |
| `compiled.json` | Artefacto generado — no commitear |

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | API key de Anthropic |
| `NOTION_API_KEY` | Token de integración de Notion |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la app (default: Claryon Portal) |
| `NEXT_PUBLIC_TENANT_ID` | ID del tenant activo (default: claryon-demo) |
