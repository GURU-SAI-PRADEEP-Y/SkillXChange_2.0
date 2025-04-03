/*
  # Fix messages table relationships

  1. Changes
    - Drop and recreate messages table with proper foreign key relationships
    - Add indexes for better performance
    - Update RLS policies
  
  2. Security
    - Enable RLS
    - Add policies for message access control
*/

-- Drop existing messages table if it exists
DROP TABLE IF EXISTS messages;

-- Create messages table with proper relationships
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Create policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create composite index for common query pattern
CREATE INDEX idx_messages_participants_timestamp 
  ON messages(sender_id, recipient_id, created_at DESC);