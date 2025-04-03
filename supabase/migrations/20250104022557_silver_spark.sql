/*
  # Add email field to profiles table

  1. Changes
    - Add email column to profiles table
    - Update handle_new_user function to store email
    - Add index on email column for better performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Update existing profiles with email from auth.users
UPDATE profiles
SET email = users.email
FROM auth.users
WHERE profiles.id = users.id AND profiles.email IS NULL;

-- Make email NOT NULL after updating existing records
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Add index on email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;