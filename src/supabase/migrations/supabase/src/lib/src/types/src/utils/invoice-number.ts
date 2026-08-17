import { supabase } from '../lib/supabase'

export async function generateInvoiceNumber(): Promise<string> {
  // Get settings for prefix and start number
  const { data: settings } = await supabase
    .from('settings')
    .select('value')
    .in('key', ['invoice_prefix', 'invoice_start_number'])
  
  const prefix = settings?.find(s => s.key === 'invoice_prefix')?.value || 'LISA-{YEAR}-'
  const startNumber = parseInt(settings?.find(s => s.key === 'invoice_start_number')?.value || '1', 10)
  
  // Get current year
  const year = new Date().getFullYear()
  const formattedPrefix = prefix.replace('{YEAR}', year.toString())
  
  // Get last invoice number from orders with this year's prefix
  const { data } = await supabase
    .from('orders')
    .select('invoice_number')
    .ilike('invoice_number', `${formattedPrefix}%`)
    .order('created_at', { ascending: false })
    .limit(1)
  
  let nextNumber = startNumber
  if (data && data.length > 0) {
    const last = data[0].invoice_number
    const parts = last.split('-')
    const num = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(num)) nextNumber = num + 1
  }
  
  return `${formattedPrefix}${String(nextNumber).padStart(4, '0')}`
}