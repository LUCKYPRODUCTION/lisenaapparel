-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('OWNER', 'ADMIN', 'PRODUKSI', 'KEUANGAN')) DEFAULT 'ADMIN',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT,
  product_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  cost_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  min_stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product variants (size, color, etc)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders (invoices)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  order_name TEXT,
  deadline DATE,
  notes TEXT,
  design_file_url TEXT,
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2),
  dp DECIMAL(10,2) DEFAULT 0,
  remaining DECIMAL(10,2),
  payment_method TEXT CHECK (payment_method IN ('Cash', 'Transfer', 'QRIS', 'Lainnya')),
  status TEXT CHECK (status IN ('ORDER MASUK','DESAIN','ACC DESAIN','POTONG BAHAN','PRODUKSI','SABLON/BORDIR','FINISHING','QC','SELESAI','DIKIRIM')) DEFAULT 'ORDER MASUK',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT,
  size TEXT,
  color TEXT,
  qty INTEGER,
  price DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Production orders (additional tracking)
CREATE TABLE production_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('ORDER MASUK','DESAIN','ACC DESAIN','POTONG BAHAN','PRODUKSI','SABLON/BORDIR','FINISHING','QC','SELESAI','DIKIRIM')) DEFAULT 'ORDER MASUK',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Production status history
CREATE TABLE production_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  production_order_id UUID REFERENCES production_orders(id) ON DELETE CASCADE,
  status TEXT,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- Payments (linked to orders)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  method TEXT,
  reference TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT CHECK (category IN ('Bahan','Gaji','Listrik','Internet','Transport','Operasional','Marketing','Produksi','Lainnya')),
  description TEXT,
  amount DECIMAL(10,2),
  date DATE,
  method TEXT,
  reference TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Income (besides order payments, e.g., other income)
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT CHECK (category IN ('DP','Pelunasan','Penjualan','Lainnya')),
  description TEXT,
  amount DECIMAL(10,2),
  date DATE,
  method TEXT,
  reference TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Receivables (piutang)
CREATE TABLE receivables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  total DECIMAL(10,2),
  paid DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  status TEXT CHECK (status IN ('Belum Bayar','Sebagian','Lunas','Terlambat')) DEFAULT 'Belum Bayar',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payables (hutang)
CREATE TABLE payables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  description TEXT,
  total DECIMAL(10,2),
  paid DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  status TEXT CHECK (status IN ('Belum Bayar','Sebagian','Lunas','Terlambat')) DEFAULT 'Belum Bayar',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory (for raw materials)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  cost_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory transactions
CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID REFERENCES inventory(id),
  type TEXT CHECK (type IN ('masuk','keluar','penyesuaian')),
  qty INTEGER,
  note TEXT,
  transaction_date DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Purchase orders (belanja)
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  item_name TEXT,
  qty INTEGER,
  price DECIMAL(10,2),
  total DECIMAL(10,2),
  order_date DATE,
  status TEXT CHECK (status IN ('Belum Dibeli','Sudah Dibeli','Diterima')) DEFAULT 'Belum Dibeli',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Settings
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_orders_invoice_number ON orders(invoice_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_deadline ON orders(deadline);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Example policies (can be customized)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- For simplicity, allow all authenticated users to view all data (since roles are managed in app)
-- In production, restrict based on roles using custom claims.
CREATE POLICY "Authenticated users can read all" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert" ON customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON customers FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat for other tables similarly