import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sprint 2: auth check aquí
  return NextResponse.next()
}
