
-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'car',
  engine_number TEXT,
  chassis_number TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  sac_code TEXT,
  gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  estimated_time INTEGER DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parts table
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  hsn_code TEXT,
  gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('gst', 'non-gst')),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  cgst_amount DECIMAL(10,2) DEFAULT 0,
  sgst_amount DECIMAL(10,2) DEFAULT 0,
  total_gst_amount DECIMAL(10,2) DEFAULT 0,
  labor_charges DECIMAL(10,2) DEFAULT 0,
  extra_charges JSONB DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'sent', 'paid', 'pending', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  kilometers INTEGER DEFAULT 0
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('service', 'part')),
  item_id UUID NOT NULL,
  name TEXT NOT NULL,
  sac_hsn_code TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  gst_rate DECIMAL(5,2) DEFAULT 18.00,
  cgst_amount DECIMAL(10,2) DEFAULT 0,
  sgst_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'card', 'upi', 'netbanking')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (assuming public access for now - can be modified later for auth)
CREATE POLICY "Enable all access for customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Enable all access for vehicles" ON public.vehicles FOR ALL USING (true);
CREATE POLICY "Enable all access for services" ON public.services FOR ALL USING (true);
CREATE POLICY "Enable all access for parts" ON public.parts FOR ALL USING (true);
CREATE POLICY "Enable all access for invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Enable all access for invoice_items" ON public.invoice_items FOR ALL USING (true);
CREATE POLICY "Enable all access for payments" ON public.payments FOR ALL USING (true);

-- Insert some sample data for services
INSERT INTO public.services (name, category, base_price, sac_code, gst_rate) VALUES
('Full Service', 'Maintenance', 2500.00, '998731', 18.00),
('Oil Change', 'Maintenance', 800.00, '998731', 18.00),
('Brake Service', 'Repair', 1200.00, '998731', 18.00),
('Engine Repair', 'Repair', 3500.00, '998731', 18.00),
('Tire Replacement', 'Repair', 1500.00, '998731', 18.00);

-- Insert some sample data for parts
INSERT INTO public.parts (name, category, price, hsn_code, gst_rate, stock_quantity, min_stock_level) VALUES
('Engine Oil 5W-30', 'Fluid', 450.00, '27101', 18.00, 50, 10),
('Brake Pads', 'Brake', 800.00, '87083', 18.00, 25, 5),
('Air Filter', 'Filter', 350.00, '84213', 18.00, 30, 8),
('Spark Plugs', 'Engine', 200.00, '85111', 18.00, 40, 10),
('Brake Fluid', 'Fluid', 180.00, '27101', 18.00, 20, 5);
