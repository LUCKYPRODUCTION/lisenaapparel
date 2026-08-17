import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'

export function Header() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // Redirect to invoice detail if query matches invoice pattern
    if (searchQuery.match(/^LISA-\d{4}-\d{4}$/)) {
      navigate(`/invoices/${searchQuery}`)
    } else {
      // TODO: implement global search
      alert('Pencarian global akan mencari di pelanggan, produk, supplier, dll.')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Cari invoice, pelanggan, produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Button type="submit" size="sm" variant="secondary">Cari</Button>
      </form>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User size={18} />
              <span className="hidden md:inline">{profile?.full_name || user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}