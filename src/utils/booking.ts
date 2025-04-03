import { supabase } from '../lib/supabase';

export async function createBooking(params: {
  slotId: string;
  studentId: string;
  mentorId: string;
}) {
  const { slotId, studentId, mentorId } = params;

  // First, check if the slot is already booked
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('is_booked')
    .eq('id', slotId)
    .single();

  if (slotError) throw slotError;
  if (slot.is_booked) throw new Error('This time slot is no longer available');

  // Create the booking and update the slot status in a transaction
  const { data, error } = await supabase.rpc('book_time_slot', {
    p_slot_id: slotId,
    p_student_id: studentId,
    p_mentor_id: mentorId
  });

  if (error) throw error;
  return data;
}