-- Add user_id column to sheet_data table
ALTER TABLE public.sheet_data 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to have a null user_id (will need manual update later)
-- Make user_id required for new records
ALTER TABLE public.sheet_data 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Drop old public policies on sheet_data
DROP POLICY IF EXISTS "Anyone can read sheet data" ON public.sheet_data;
DROP POLICY IF EXISTS "Only authenticated users can insert sheet data" ON public.sheet_data;

-- Create new RLS policies for sheet_data
CREATE POLICY "Users can view their own sheet data"
ON public.sheet_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sheet data"
ON public.sheet_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sheet data"
ON public.sheet_data
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sheet data"
ON public.sheet_data
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();