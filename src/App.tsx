import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './hooks/useAuth'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Production from './pages/Production'
import NewInvoice from './pages/Invoices/NewInvoice'
import InvoiceDetail from './pages/Invoices/InvoiceDetail'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import Inventory from './pages/Inventory'
import Finance from './pages/Finance'
import ReceivablesPayables from './pages/ReceivablesPayables'
import Purchases from './pages/Purchases'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Backup from './pages/Backup'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="production" element={<Production />} />
            <Route path="invoices/new" element={<NewInvoice />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="finance" element={<Finance />} />
            <Route path="receivables-payables" element={<ReceivablesPayables />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/backup" element={<Backup />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App