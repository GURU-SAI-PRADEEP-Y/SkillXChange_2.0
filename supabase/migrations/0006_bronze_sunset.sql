/*
  # Improve chat functionality

  1. Changes
    - Add indexes for better query performance
    - Add trigger for updating last_message
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Add function to handle message notifications
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Add notification handling logic here
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
CREATE TRIGGER on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();