# Agent: claryon-prospectos

## Archivos fuente

- **CLAUDE.md** — instrucciones base, modos A/B/C, flujo completo
- **ClaryonContext.md** — contexto de empresa Claryon, servicios S1-S4, ICP framework
- **MODES.json** — definición de modos (id, label, suffix de system prompt)
- **skills/busqueda.md** — skill de búsqueda de prospectos
- **skills/scoring.md** — skill de scoring según framework ICP
- **skills/correo-contacto.md** — skill de generación de correos de outreach
- **skills/insercion-notion.md** — skill de registro en Notion

## Cómo usa esto el portal

El portal consume `compiled.json` (artefacto generado — no editar a mano).
Para regenerarlo después de cambiar cualquier archivo fuente:

```bash
npm run compile-agents
```

`compiled.json` concatena en orden: `system_prompt_base` + `context` + `skills` + `mode.suffix`.
