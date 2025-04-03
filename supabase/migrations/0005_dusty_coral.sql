/*
  # Add chat and booking functionality

  1. New Tables
    - messages
      - id (uuid, primary key)
      - sender_id (uuid, references auth.users)
      - recipient_id (uuid, references auth.users)
      - content (text)
      - created_at (timestamptz)
    
    - time_slots
      - id (uuid, primary key)
      - mentor_id (uuid, references mentor_profiles)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - is_booked (boolean)
    
    - bookings
      - id (uuid, primary key)
      - student_id (uuid, references auth.users)
      - mentor_id (uuid, references mentor_profiles)
      - time_slot_id (uuid, references time_slots)
      - status (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create time_slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Time slots policies
CREATE POLICY "Anyone can view time slots"
  ON time_slots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mentors can manage their time slots"
  ON time_slots FOR ALL
  TO authenticated
  USING (auth.uid() = mentor_id);

-- Bookings policies
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Students can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Involved users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = mentor_id);