import Link from 'next/link'
import ActivityFeed from '@/components/dashboard/ActivityFeed'

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Claryon Portal
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Agente activo: <span className="font-medium text-gray-700">claryon-prospectos</span>
        </p>
        <Link
          href="/chat"
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Ir al chat →
        </Link>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
        Actividad reciente
      </h2>
      <ActivityFeed />
    </div>
  )
}
