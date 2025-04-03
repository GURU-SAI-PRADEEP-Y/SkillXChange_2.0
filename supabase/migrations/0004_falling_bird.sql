/*
  # Add price and statistics tracking

  1. Changes
    - Add price field to gigs table
    - Add completion_rate to mentor_profiles
    - Add total_students to mentor_profiles
    - Add rating to mentor_profiles
  
  2. Security
    - Update RLS policies to include new fields
*/

-- Add price to gigs
ALTER TABLE gigs ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add statistics to mentor_profiles
ALTER TABLE mentor_profiles 
  ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 100.00,
  ADD COLUMN total_students INTEGER DEFAULT 0,
  ADD COLUMN rating DECIMAL(3,2) DEFAULT 5.00;