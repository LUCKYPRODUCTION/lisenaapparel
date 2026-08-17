import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Wallet, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Truck, 
  HandCoins, 
  Boxes, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Manajemen Produksi', path: '/production' },
  { icon: FileText, label: 'Buat Nota', path: '/invoices/new' },
  { icon: Wallet, label: 'Catatan Keuangan', path: '/finance' },
  { icon: ShoppingCart, label: 'Daftar Belanja', path: '/purchases' },
  { icon: BarChart3, label: 'Statistik', path: '/statistics' },
  { icon: Users, label: 'Pelanggan', path: '/customers' },
  { icon: Truck, label: 'Supplier', path: '/suppliers' },
  { icon: HandCoins, label: 'Utang Piutang', path: '/receivables-payables' },
  { icon: Boxes, label: 'Stok', path: '/inventory' },
  { icon: Settings, label: 'Pengaturan', path: '/settings' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!isMobile) setIsOpen(true)
    else setIsOpen(false)
  }, [isMobile])

  const toggleSidebar = () => setIsOpen(!isOpen)

  if (isMobile) {
    return (
      <>
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
        <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <span className="text-xl font-bold">LISENA</span>
            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      </>
    )
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">LISENA APPAREL</h1>
        <p className="text-xs text-gray-500">Premium Custom Apparel</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}