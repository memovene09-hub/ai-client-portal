import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <nav className="w-48 flex-shrink-0 flex flex-col gap-1 p-4 border-r border-gray-200">
        <Link
          href="/dashboard"
          className="px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
        >
          Dashboard
        </Link>
        <Link
          href="/chat"
          className="px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
        >
          Chat
        </Link>
      </nav>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
