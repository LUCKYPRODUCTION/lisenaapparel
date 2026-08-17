import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '../../utils/format'
import { generateInvoiceNumber } from '../../utils/invoice-number'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    if (!id) return
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, customers(*)')
      .eq('id', id)
      .single()
    setOrder(orderData)

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)
    setItems(itemsData || [])
    setLoading(false)
  }

  const handleDownloadJPG = async () => {
    const element = document.getElementById('invoice-template')
    if (!element) return
    const canvas = await html2canvas(element, { scale: 2 })
    const link = document.createElement('a')
    link.download = `${order.invoice_number}.jpg`
    link.href = canvas.toDataURL('image/jpeg')
    link.click()
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    // Custom PDF generation using html2canvas or direct jsPDF
    toast.info('Fungsi PDF akan segera diimplementasikan')
  }

  const handleWhatsApp = () => {
    if (!order?.customers?.whatsapp) {
      toast.warning('Nomor WhatsApp pelanggan tidak tersedia')
      return
    }
    const msg = `Halo Kak ${order.customers.name},\n\nBerikut nota pesanan dari LISENA APPAREL.\nInvoice: ${order.invoice_number}\nPesanan: ${order.order_name}\nTotal: ${formatCurrency(order.total)}\nDP: ${formatCurrency(order.dp)}\nSisa: ${formatCurrency(order.remaining)}\nDeadline: ${formatDate(order.deadline)}\n\nTerima kasih 🙏`
    const url = `https://wa.me/${order.customers.whatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Invoice tidak ditemukan</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => navigate('/invoices/new')}>Buat Nota Baru</Button>
        <Button variant="outline" onClick={handleDownloadJPG}>Download JPG</Button>
        <Button variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
        <Button variant="outline" onClick={handleWhatsApp}>Kirim WhatsApp</Button>
        <Button variant="destructive" onClick={async () => {
          if (confirm('Hapus invoice ini?')) {
            await supabase.from('orders').delete().eq('id', id)
            toast.success('Invoice dihapus')
            navigate('/dashboard')
          }
        }}>Hapus</Button>
      </div>

      {/* Invoice Template */}
      <div id="invoice-template" className="bg-white p-8 rounded shadow max-w-3xl mx-auto">
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold">LISENA APPAREL</h1>
          <p className="text-sm text-gray-600">PREMIUM CUSTOM APPAREL</p>
          <p className="text-xs text-gray-500">Konveksi • Sablon • Jersey • Bordir • Printing</p>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <p><strong>Invoice:</strong> {order.invoice_number}</p>
            <p><strong>Tanggal:</strong> {formatDate(order.created_at)}</p>
            <p><strong>Deadline:</strong> {formatDate(order.deadline)}</p>
          </div>
          <div>
            <p><strong>Pelanggan:</strong> {order.customers?.name}</p>
            <p><strong>WhatsApp:</strong> {order.customers?.whatsapp}</p>
            <p><strong>Alamat:</strong> {order.customers?.address}</p>
          </div>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Produk</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Warna</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Harga</th>
              <th className="text-right p-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{idx+1}</td>
                <td className="p-2">{item.product_name}</td>
                <td className="p-2">{item.size}</td>
                <td className="p-2">{item.color}</td>
                <td className="text-right p-2">{item.qty}</td>
                <td className="text-right p-2">{formatCurrency(item.price)}</td>
                <td className="text-right p-2">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Subtotal</td><td className="text-right p-2">{formatCurrency(order.subtotal)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2">Diskon</td><td className="text-right p-2">-{formatCurrency(order.discount)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Total</td><td className="text-right p-2 font-bold">{formatCurrency(order.total)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2">DP</td><td className="text-right p-2">{formatCurrency(order.dp)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Sisa</td><td className="text-right p-2 font-bold">{formatCurrency(order.remaining)}</td></tr>
          </tfoot>
        </table>
        <div className="text-center text-xs text-gray-500 mt-4 border-t pt-4">
          Terima kasih telah mempercayakan kebutuhan apparel Anda kepada Lisena Apparel.
        </div>
      </div>
    </div>
  )
}