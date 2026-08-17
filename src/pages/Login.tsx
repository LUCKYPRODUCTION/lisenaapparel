import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Login berhasil')
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning('Masukkan email terlebih dahulu')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Link reset password telah dikirim ke email Anda')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">LISENA APPAREL</h1>
          <p className="text-sm text-gray-500">Premium Custom Apparel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-600 hover:underline"
          >
            Lupa password?
          </button>
        </div>
      </div>
    </div>
  )
}