-- Add unit_type column to invoice_items table
ALTER TABLE public.invoice_items 
ADD COLUMN unit_type text DEFAULT 'nos';

-- Add comment for the new column
COMMENT ON COLUMN public.invoice_items.unit_type IS 'Unit type for quantities (nos, ltrs, kgs, etc.)';

-- Create index for better performance
CREATE INDEX idx_invoice_items_unit_type ON public.invoice_items(unit_type);