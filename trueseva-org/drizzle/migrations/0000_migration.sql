CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  mobile text NOT NULL CHECK (mobile ~ '^[6-9][0-9]{9}$'),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  support_type text NOT NULL CHECK (support_type IN ('New Clothing','Essential Groceries','Financial Assistance')),
  district text NOT NULL CHECK (char_length(district) <= 60),
  message text NOT NULL CHECK (char_length(message) BETWEEN 5 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);