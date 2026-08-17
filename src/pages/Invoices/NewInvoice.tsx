import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '../../lib/supabase'
import { generateInvoiceNumber } from '../../utils/invoice-number'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useNavigate } from 'react-router-dom'

const orderItemSchema = z.object({
  product_name: z.string().min(1, 'Nama produk wajib'),
  size: z.string().optional(),
  color: z.string().optional(),
  qty: z.number().min(1, 'Qty minimal 1'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  subtotal: z.number(),
})

const invoiceSchema = z.object({
  customer_id: z.string().uuid('Pilih pelanggan'),
  order_name: z.string().min(1, 'Nama pesanan wajib'),
  deadline: z.string().min(1, 'Deadline wajib'),
  notes: z.string().optional(),
  design_file_url: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Tambahkan minimal satu item'),
  discount: z.number().min(0).default(0),
  dp: z.number().min(0).default(0),
  payment_method: z.enum(['Cash', 'Transfer', 'QRIS', 'Lainnya']),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

export default function NewInvoice() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ product_name: '', size: '', color: '', qty: 1, price: 0, subtotal: 0 }],
      discount: 0,
      dp: 0,
      payment_method: 'Cash',
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchItems = watch('items')
  const watchDiscount = watch('discount')
  const watchDp = watch('dp')

  // Calculate subtotal
  const calculateSubtotal = (index: number) => {
    const qty = watchItems[index]?.qty || 0
    const price = watchItems[index]?.price || 0
    setValue(`items.${index}.subtotal`, qty * price)
  }

  const total = watchItems.reduce((sum, item) => sum + (item.subtotal || 0), 0) - watchDiscount
  const remaining = total - watchDp

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('id, name, whatsapp, address')
    setCustomers(data || [])
  }

  const onSubmit = async (data: InvoiceFormData) => {
    setLoading(true)
    try {
      const invoiceNumber = await generateInvoiceNumber()
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          invoice_number: invoiceNumber,
          customer_id: data.customer_id,
          order_name: data.order_name,
          deadline: data.deadline,
          notes: data.notes,
          design_file_url: data.design_file_url,
          subtotal: total + watchDiscount,
          discount: data.discount,
          total: total,
          dp: data.dp,
          remaining: remaining,
          payment_method: data.payment_method,
          status: 'ORDER MASUK',
        })
        .select()
        .single()

      if (error) throw error

      // Insert order items
      const items = data.items.map(item => ({
        order_id: order.id,
        product_name: item.product_name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: item.price,
        subtotal: item.subtotal,
      }))
      const { error: itemsError } = await supabase.from('order_items').insert(items)
      if (itemsError) throw itemsError

      toast.success('Invoice berhasil dibuat!')
      navigate(`/invoices/${order.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Buat Nota Baru</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer, Order Info */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Pelanggan</Label>
                <Select onValueChange={(val) => setValue('customer_id', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}
              </div>
              <div>
                <Label>Nama Pesanan</Label>
                <Input {...register('order_name')} />
                {errors.order_name && <p className="text-red-500 text-sm">{errors.order_name.message}</p>}
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" {...register('deadline')} />
                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
              </div>
              <div>
                <Label>Metode Pembayaran</Label>
                <Select onValueChange={(val) => setValue('payment_method', val as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method.message}</p>}
              </div>
            </div>
            <div>
              <Label>Catatan</Label>
              <Input {...register('notes')} />
            </div>
            <div>
              <Label>File Desain (URL)</Label>
              <Input {...register('design_file_url')} placeholder="Link file desain" />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Item Pesanan</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 md:grid-cols-6 gap-2 items-end border-b pb-2">
                <div>
                  <Label>Produk</Label>
                  <Input {...register(`items.${index}.product_name`)} />
                </div>
                <div>
                  <Label>Size</Label>
                  <Input {...register(`items.${index}.size`)} />
                </div>
                <div>
                  <Label>Warna</Label>
                  <Input {...register(`items.${index}.color`)} />
                </div>
                <div>
                  <Label>Qty</Label>
                  <Input type="number" {...register(`items.${index}.qty`, { valueAsNumber: true })} onChange={() => calculateSubtotal(index)} />
                </div>
                <div>
                  <Label>Harga</Label>
                  <Input type="number" {...register(`items.${index}.price`, { valueAsNumber: true })} onChange={() => calculateSubtotal(index)} />
                </div>
                <div>
                  <Label>Subtotal</Label>
                  <Input value={watchItems[index]?.subtotal || 0} disabled />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>Hapus</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ product_name: '', size: '', color: '', qty: 1, price: 0, subtotal: 0 })}>Tambah Item</Button>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>Rp {total + watchDiscount}</span></div>
            <div className="flex items-center gap-2">
              <Label>Diskon</Label>
              <Input type="number" className="w-32" {...register('discount', { valueAsNumber: true })} />
            </div>
            <div className="flex justify-between font-bold"><span>Total</span><span>Rp {total}</span></div>
            <div className="flex items-center gap-2">
              <Label>DP</Label>
              <Input type="number" className="w-32" {...register('dp', { valueAsNumber: true })} />
            </div>
            <div className="flex justify-between font-bold"><span>Sisa</span><span>Rp {remaining}</span></div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Nota'}
        </Button>
      </form>
    </div>
  )
}