-- Create a table to track anonymous processing statistics
CREATE TABLE IF NOT EXISTS public.stats_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    file_type TEXT NOT NULL, -- 'image' or 'video'
    mime_type TEXT, -- 'image/jpeg', 'video/mp4', etc.
    size_bytes BIGINT,
    processing_time_ms INTEGER,
    
    -- Metadata Flags (Privacy Preserving - No actual data stored)
    meta_gps_found BOOLEAN DEFAULT false,
    meta_device_found BOOLEAN DEFAULT false,
    meta_ai_found BOOLEAN DEFAULT false,
    
    device_model TEXT, -- Optional: 'iPhone 15', 'Canon', etc. (Anonymized)
    
    status TEXT DEFAULT 'success' -- 'success' or 'error'
);

-- Enable Row Level Security
ALTER TABLE public.stats_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow Backend (Service Role) to INSERT
CREATE POLICY "Service Role can insert logs" 
ON public.stats_logs 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Policy: Allow Admins to SELECT (Read)
-- Assumes you have a way to identify admins, or temporarily allow service_role/authenticated read for dev
CREATE POLICY "Admins can view logs" 
ON public.stats_logs 
FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@cleanmeta.com'); -- Replace with actual admin check or role

-- Create an index for faster date-range queries
CREATE INDEX IF NOT EXISTS idx_stats_logs_created_at ON public.stats_logs(created_at);
