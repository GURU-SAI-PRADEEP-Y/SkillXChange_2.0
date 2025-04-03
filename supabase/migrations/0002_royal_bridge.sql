/*
  # Create Mentor Gigs Schema

  1. New Tables
    - `mentor_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `bio` (text)
      - `created_at` (timestamp)
    
    - `gigs`
      - `id` (uuid, primary key)
      - `mentor_id` (uuid, references mentor_profiles)
      - `title` (text)
      - `description` (text)
      - `skillset` (text[])
      - `thumbnail_url` (text)
      - `video_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create mentor_profiles table
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create gigs table
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skillset TEXT[] NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

-- Policies for mentor_profiles
CREATE POLICY "Users can view any mentor profile"
  ON mentor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own mentor profile"
  ON mentor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own mentor profile"
  ON mentor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for gigs
CREATE POLICY "Users can view any gig"
  ON gigs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mentors can create their own gigs"
  ON gigs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can update their own gigs"
  ON gigs FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete their own gigs"
  ON gigs FOR DELETE
  TO authenticated
  USING (auth.uid() = mentor_id);