import { useRouter } from 'next/router'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/component'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function logIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-6 space-y-6 shadow-md">
        <h1 className="text-2xl font-semibold text-text-primary text-center">Iniciar Sesión</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-surface hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-surface hover:bg-surface-hover spring-transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            />
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={logIn}
              className="w-full bg-secondary-600 text-white py-3 rounded-lg font-medium hover:bg-secondary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={signUp}
              className="w-full bg-secondary-600 text-white py-3 rounded-lg font-medium hover:bg-secondary-700 spring-transition focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}