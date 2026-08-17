-- Seed some default settings
INSERT INTO settings (key, value) VALUES 
('store_name', 'Lisena Apparel'),
('store_tagline', 'PREMIUM CUSTOM APPAREL'),
('store_address', 'Wonoanti, Gandusari, Trenggalek'),
('store_whatsapp', '6281234567890'),
('store_email', 'info@lisena.com'),
('store_instagram', '@lisenaapparel'),
('invoice_footer', 'Terima kasih telah mempercayakan kebutuhan apparel Anda kepada Lisena Apparel.'),
('invoice_prefix', 'LISA-{YEAR}-'),
('invoice_start_number', '1')
ON CONFLICT (key) DO NOTHING;

-- Insert a sample admin user (use Supabase Auth to create user first, then insert profile)
-- For demo, we'll handle via app.