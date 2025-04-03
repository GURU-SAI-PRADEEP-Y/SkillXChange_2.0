import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { TimeSlotButton } from './TimeSlotButton';
import { sendBookingEmails } from '../../utils/email';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
}

interface BookingModalProps {
  mentorId: string;
  onClose: () => void;
  onBookingComplete: () => void;
  gigTitle: string;
}

export function BookingModal({ mentorId, onClose, onBookingComplete, gigTitle }: BookingModalProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAvailableSlots();
  }, [mentorId]);

  const loadAvailableSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_booked', false)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (slotId: string, startTime: string) => {
    setBookingSlotId(slotId);
    setBookingInProgress(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Start a transaction using RPC
      const { data: bookingResult, error: bookingError } = await supabase
        .rpc('book_time_slot', {
          p_slot_id: slotId,
          p_student_id: user.id,
          p_mentor_id: mentorId
        });

      if (bookingError) throw bookingError;

      if (!bookingResult) {
        throw new Error('Failed to book the slot');
      }

      // Get student and mentor profiles for email
      const [studentProfile, mentorProfile] = await Promise.all([
        supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single(),
        supabase
          .from('mentor_profiles')
          .select('email, full_name')
          .eq('id', mentorId)
          .single()
      ]);

      if (!studentProfile.data || !mentorProfile.data) {
        throw new Error('Could not fetch user profiles');
      }

      // Send confirmation emails
      const emailResult = await sendBookingEmails({
        student_email: studentProfile.data.email,
        mentor_email: mentorProfile.data.email,
        start_time: startTime,
        mentor_name: mentorProfile.data.full_name,
        student_name: studentProfile.data.full_name,
        gig_title: gigTitle
      });

      if (!emailResult.success) {
        console.warn('Emails may not have been sent successfully:', emailResult.error);
        // Continue with booking completion even if emails fail
      }

      onBookingComplete();
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book the session. Please try again.');
    } finally {
      setBookingInProgress(false);
      setBookingSlotId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Available Time Slots</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading available slots...</div>
          ) : slots.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No available time slots
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <TimeSlotButton
                  key={slot.id}
                  startTime={slot.start_time}
                  endTime={slot.end_time}
                  onBook={() => bookSlot(slot.id, slot.start_time)}
                  isLoading={bookingInProgress && bookingSlotId === slot.id}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}