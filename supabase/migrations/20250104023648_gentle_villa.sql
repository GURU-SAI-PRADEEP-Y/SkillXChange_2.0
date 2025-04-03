-- Create a function to handle the booking process atomically
CREATE OR REPLACE FUNCTION book_time_slot(
  p_slot_id UUID,
  p_student_id UUID,
  p_mentor_id UUID
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_booked boolean;
BEGIN
  -- Check if the slot is already booked
  SELECT is_booked INTO v_is_booked
  FROM time_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF v_is_booked THEN
    RETURN false;
  END IF;

  -- Create the booking
  INSERT INTO bookings (
    student_id,
    mentor_id,
    time_slot_id,
    status
  ) VALUES (
    p_student_id,
    p_mentor_id,
    p_slot_id,
    'confirmed'
  );

  -- Update the time slot status
  UPDATE time_slots
  SET is_booked = true
  WHERE id = p_slot_id;

  RETURN true;
END;
$$;