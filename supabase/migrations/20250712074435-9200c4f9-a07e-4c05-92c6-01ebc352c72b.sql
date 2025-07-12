-- Create a function to generate sequential invoice numbers
CREATE OR REPLACE FUNCTION public.generate_sequential_invoice_number(invoice_type_prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_number integer;
    formatted_number text;
BEGIN
    -- Get the next number by finding the highest existing number for this type
    SELECT COALESCE(
        MAX(
            CASE 
                WHEN invoice_number ~ ('^' || invoice_type_prefix || '-\d{3}$') 
                THEN CAST(RIGHT(invoice_number, 3) AS integer)
                ELSE 0 
            END
        ), 0
    ) + 1 INTO next_number
    FROM invoices 
    WHERE invoice_type = CASE 
        WHEN invoice_type_prefix = 'GST' THEN 'gst'
        WHEN invoice_type_prefix = 'NON-GST' THEN 'non-gst'
        ELSE invoice_type_prefix
    END;
    
    -- Format the number with leading zeros (001, 002, etc.)
    formatted_number := invoice_type_prefix || '-' || LPAD(next_number::text, 3, '0');
    
    RETURN formatted_number;
END;
$$;