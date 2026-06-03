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

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | API key de Anthropic |
| `NOTION_API_KEY` | Token de integración de Notion |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la app (default: Claryon Portal) |
| `NEXT_PUBLIC_TENANT_ID` | ID del tenant activo (default: claryon-demo) |
