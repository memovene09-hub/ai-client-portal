/**
 * Seed script — precarga datos de prueba en Supabase
 * Uso: npm run db:seed
 *
 * Inserta (o actualiza si ya existen) dos tenants con contexto completo
 * para que Sprint 2 tenga data lista para testear.
 */

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { tenantContext } from '@/lib/db/schema'

// ---------------------------------------------------------------------------
// DB connection
// ---------------------------------------------------------------------------

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set. Check your .env.local file.')
  process.exit(1)
}

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seeds = [
  {
    org_id: 'claryon-demo',
    basic_info: {
      name: 'Claryon S.A. de C.V.',
      description:
        'Empresa de tecnología especializada en implementación de Microsoft 365 y automatización con inteligencia artificial para PyMEs en México.',
      tone_of_voice: 'Profesional, directo y cercano. Habla como un consultor experto que conoce el negocio del cliente.',
    },
    market: {
      target_audience:
        'PyMEs mexicanas de 10–200 empleados en sectores de manufactura, distribución y servicios profesionales que buscan modernizar su operación con Microsoft 365.',
      pain_points: [
        'Procesos manuales que consumen tiempo del equipo',
        'Falta de visibilidad y control sobre el negocio',
        'Dificultad para adoptar herramientas digitales sin soporte técnico',
        'Costos altos de IT sin resultados claros',
      ],
    },
    products: [
      {
        name: 'Implementación M365',
        description: 'Setup completo de Microsoft 365: correo, Teams, SharePoint y seguridad',
        price: '$25,000 MXN',
      },
      {
        name: 'Automatización con AI',
        description: 'Agentes IA personalizados para procesos de ventas, operaciones o soporte',
        price: 'Desde $15,000 MXN / mes',
      },
      {
        name: 'Soporte Técnico',
        description: 'Soporte mensual para Microsoft 365 y herramientas de productividad',
        price: '$8,000 MXN / mes',
      },
    ],
    goals: {
      main_objective:
        'Cerrar 3 nuevos clientes por mes en el segmento PyME de manufactura y distribución en Jalisco y CDMX durante Q3 2026.',
    },
  },
  {
    org_id: 'bites-snacks',
    basic_info: {
      name: 'Bites Snacks S.A. de C.V.',
      description:
        'Empresa mexicana de snacks saludables y naturales. Productos sin conservadores artificiales, empaque sustentable, para el estilo de vida activo.',
      tone_of_voice: 'Energético, positivo y cercano. Habla como un amigo que cuida su salud, no como una marca corporativa.',
    },
    market: {
      target_audience:
        'Jóvenes de 18–35 años en México con estilo de vida activo o aspiracional saludable. Compran en e-commerce o tiendas de conveniencia.',
      pain_points: [
        'Los snacks disponibles en el mercado son procesados o artificiales',
        'Las opciones saludables importadas son muy caras',
        'Difícil encontrar snacks ricos Y nutritivos a precio accesible',
      ],
    },
    products: [
      {
        name: 'Bites Almendra & Miel',
        description: 'Mix de almendras tostadas con miel natural. 100g.',
        price: '$89 MXN',
      },
      {
        name: 'Bites Cacao & Coco',
        description: 'Bolitas energéticas de cacao y coco. 8 piezas.',
        price: '$95 MXN',
      },
      {
        name: 'Bites Proteína',
        description: 'Barra de proteína con whey y frutas deshidratadas.',
        price: '$75 MXN',
      },
      {
        name: 'Bites Trail Mix',
        description: 'Mix de nueces, semillas y frutos rojos. 150g.',
        price: '$110 MXN',
      },
    ],
    goals: {
      main_objective:
        'Crecer la comunidad en Instagram a 20,000 seguidores y aumentar las ventas de e-commerce en un 40% para fin de 2026.',
    },
  },
]

// ---------------------------------------------------------------------------
// Run seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱  Seeding tenant_context...\n')

  for (const data of seeds) {
    await db
      .insert(tenantContext)
      .values({
        org_id: data.org_id,
        basic_info: data.basic_info,
        market: data.market,
        products: data.products,
        goals: data.goals,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: tenantContext.org_id,
        set: {
          basic_info: data.basic_info,
          market: data.market,
          products: data.products,
          goals: data.goals,
          updated_at: new Date(),
        },
      })

    console.log(`[✓] Seeded ${data.org_id}`)
  }

  console.log('\n✅  Done. Run `npm run db:studio` to verify.')
  await client.end()
}

seed().catch(err => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
