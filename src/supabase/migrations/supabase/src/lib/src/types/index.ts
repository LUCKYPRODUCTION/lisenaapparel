export interface Profile {
  id: string
  full_name: string
  role: 'OWNER' | 'ADMIN' | 'PRODUKSI' | 'KEUANGAN'
  phone: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  whatsapp: string
  address: string
  email: string
  notes: string
  created_at: string
  updated_at: string
}

// ... define all other types similarly