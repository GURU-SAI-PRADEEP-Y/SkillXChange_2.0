/*
  # Add messages table indexes and fix foreign key relationships

  1. Changes
    - Add foreign key relationships for sender_id and recipient_id
    - Add indexes for better query performance
    - Add RLS policies for message access
*/

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS messages
  DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
  DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;

-- Add correct foreign key relationships
ALTER TABLE messages
  ADD CONSTRAINT messages_sender_id_fkey
    FOREIGN KEY (sender_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  ADD CONSTRAINT messages_recipient_id_fkey
    FOREIGN KEY (recipient_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient
  ON messages(sender_id, recipient_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
  ON messages(created_at DESC);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);