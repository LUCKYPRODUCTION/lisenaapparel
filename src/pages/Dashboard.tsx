import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency, formatDate } from '../utils/format'

export default function Dashboard() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    ordersInProduction: 0,
    ordersCompleted: 0,
    ordersOverdue: 0,
    revenueToday: 0,
    revenueMonth: 0,
    expensesMonth: 0,
    netProfit: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Example: fetch orders count etc. - implement full queries
    const today = new Date().toISOString().split('T')[0]
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

    // Orders today
    const { count: ordersToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('created_at::date', today)

    // Orders in production (status not in ['SELESAI','DIKIRIM'])
    const { count: inProduction } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .not('status', 'in', '("SELESAI","DIKIRIM")')

    // ... more queries

    setStats({
      ordersToday: ordersToday || 0,
      ordersInProduction: inProduction || 0,
      ordersCompleted: 0,
      ordersOverdue: 0,
      revenueToday: 0,
      revenueMonth: 0,
      expensesMonth: 0,
      netProfit: 0,
    })

    // Recent orders (last 5)
    const { data: recent } = await supabase
      .from('orders')
      .select('*, customers(name)')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentOrders(recent || [])

    // Chart: revenue last 7 days (dummy)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    setChartData(days.map(day => ({ name: day, revenue: Math.floor(Math.random() * 1000000) })))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dalam Produksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersInProduction}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersOverdue}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Omzet Hari Ini</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrency(stats.revenueToday)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Omzet Bulan Ini</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrency(stats.revenueMonth)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Laba Bersih</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatCurrency(stats.netProfit)}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Omzet 7 Hari Terakhir</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Status Produksi</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:'Proses',value:10},{name:'Selesai',value:20}]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Order Terbaru</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice</th>
                  <th className="text-left p-2">Pelanggan</th>
                  <th className="text-left p-2">Pesanan</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Deadline</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => window.location.href = `/invoices/${order.id}`}>
                    <td className="p-2">{order.invoice_number}</td>
                    <td className="p-2">{order.customers?.name}</td>
                    <td className="p-2">{order.order_name}</td>
                    <td className="p-2">-</td>
                    <td className="p-2">{formatDate(order.deadline)}</td>
                    <td className="p-2">{formatCurrency(order.total)}</td>
                    <td className="p-2"><span className="px-2 py-1 rounded-full text-xs bg-gray-200">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}