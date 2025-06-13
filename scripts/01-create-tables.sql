-- Create tables for MobiShop

-- customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);

-- vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  year TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  vin TEXT,
  license_plate TEXT,
  color TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on customer_id for faster queries
CREATE INDEX IF NOT EXISTS vehicles_customer_id_idx ON vehicles(customer_id);

-- appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes
  address TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  notes TEXT,
  reminder_email BOOLEAN DEFAULT TRUE,
  reminder_sms BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_vehicle_id_idx ON appointments(vehicle_id);
CREATE INDEX IF NOT EXISTS appointments_customer_id_idx ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments(date);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);

-- jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  service TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'estimate', -- estimate, in_progress, completed, cancelled
  notes TEXT,
  technician TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs(user_id);
CREATE INDEX IF NOT EXISTS jobs_appointment_id_idx ON jobs(appointment_id);
CREATE INDEX IF NOT EXISTS jobs_customer_id_idx ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS jobs_vehicle_id_idx ON jobs(vehicle_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);

-- estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  line_items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on job_id for faster queries
CREATE INDEX IF NOT EXISTS estimates_job_id_idx ON estimates(job_id);

-- invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  line_items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, paid, partial
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_checkout_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on job_id for faster queries
CREATE INDEX IF NOT EXISTS invoices_job_id_idx ON invoices(job_id);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Users can view their own customers" 
ON customers FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customers" 
ON customers FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customers" 
ON customers FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own customers" 
ON customers FOR DELETE 
USING (user_id = auth.uid());

-- Create policies for vehicles
CREATE POLICY "Users can view vehicles for their customers" 
ON vehicles FOR SELECT 
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert vehicles for their customers" 
ON vehicles FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update vehicles for their customers" 
ON vehicles FOR UPDATE 
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete vehicles for their customers" 
ON vehicles FOR DELETE 
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own appointments" 
ON appointments FOR DELETE 
USING (user_id = auth.uid());

-- Create policies for jobs
CREATE POLICY "Users can view their own jobs" 
ON jobs FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own jobs" 
ON jobs FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own jobs" 
ON jobs FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own jobs" 
ON jobs FOR DELETE 
USING (user_id = auth.uid());

-- Create policies for estimates
CREATE POLICY "Users can view estimates for their jobs" 
ON estimates FOR SELECT 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert estimates for their jobs" 
ON estimates FOR INSERT 
WITH CHECK (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update estimates for their jobs" 
ON estimates FOR UPDATE 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete estimates for their jobs" 
ON estimates FOR DELETE 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

-- Create policies for invoices
CREATE POLICY "Users can view invoices for their jobs" 
ON invoices FOR SELECT 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert invoices for their jobs" 
ON invoices FOR INSERT 
WITH CHECK (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can update invoices for their jobs" 
ON invoices FOR UPDATE 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete invoices for their jobs" 
ON invoices FOR DELETE 
USING (job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid()));

-- Create storage bucket for job images
-- Note: This would typically be done through the Supabase UI or API
-- INSERT INTO storage.buckets (id, name) VALUES ('job-images', 'job-images');
