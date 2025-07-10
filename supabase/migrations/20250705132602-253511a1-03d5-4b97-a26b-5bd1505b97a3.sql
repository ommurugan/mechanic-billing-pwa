
-- Create enum for vehicle types
CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'scooter', 'truck', 'van');

-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'upi', 'netbanking', 'bank_transfer');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');

-- Create enum for invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'pending', 'overdue', 'cancelled');

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    gst_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    vehicle_number TEXT NOT NULL UNIQUE,
    vehicle_type vehicle_type NOT NULL,
    engine_number TEXT,
    chassis_number TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table with SAC codes and individual GST
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    sac_code TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    gst_rate INTEGER NOT NULL CHECK (gst_rate IN (9, 18, 28)),
    estimated_time INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parts table with HSN codes and individual GST
CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    hsn_code TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    gst_rate INTEGER NOT NULL CHECK (gst_rate IN (9, 18, 28)),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    supplier TEXT,
    part_number TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_type TEXT NOT NULL CHECK (invoice_type IN ('gst', 'non-gst')),
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    cgst_amount DECIMAL(10,2) DEFAULT 0,
    sgst_amount DECIMAL(10,2) DEFAULT 0,
    total_gst_amount DECIMAL(10,2) DEFAULT 0,
    labor_charges DECIMAL(10,2) DEFAULT 0,
    extra_charges JSONB DEFAULT '[]',
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status invoice_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    kilometers INTEGER
);

-- Create invoice_items table
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('service', 'part')),
    item_id UUID NOT NULL,
    name TEXT NOT NULL,
    sac_hsn_code TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    gst_rate INTEGER NOT NULL,
    cgst_amount DECIMAL(10,2) DEFAULT 0,
    sgst_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - will be restricted after auth implementation)
CREATE POLICY "Enable all operations for authenticated users" ON customers FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON vehicles FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON services FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON parts FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON invoices FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON invoice_items FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON payments FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_vehicle_id ON invoices(vehicle_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_vehicles_number ON vehicles(vehicle_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to customers table
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
