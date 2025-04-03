import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';
import { sendBookingEmails } from '../../utils/email';

interface TimeSlot {
  id: string;
  mentor_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface BookingCalendarProps {
  mentorId: string;
  onBookingComplete: () => void;
}

export function BookingCalendar({ mentorId, onBookingComplete }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    loadAvailableSlots(selectedDate);
  }, [selectedDate, mentorId]);

  const loadAvailableSlots = async (date: Date) => {
    setLoading(true);
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: slots, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_booked', false)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (slot: TimeSlot) => {
    setBookingInProgress(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get student and mentor details
      const [studentData, mentorData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('mentor_profiles').select('*').eq('id', mentorId).single()
      ]);

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          student_id: user.id,
          mentor_id: mentorId,
          time_slot_id: slot.id,
          status: 'confirmed'
        }]);

      if (bookingError) throw bookingError;

      // Update time slot
      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ is_booked: true })
        .eq('id', slot.id);

      if (slotError) throw slotError;

      // Send confirmation emails
      await sendBookingEmails({
        student_email: studentData.data.email,
        mentor_email: mentorData.data.email,
        start_time: slot.start_time,
        mentor_name: mentorData.data.full_name,
        student_name: studentData.data.full_name
      });

      onBookingComplete();
    } catch (error) {
      console.error('Error booking slot:', error);
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Book a Session</h3>
      
      <div className="mb-4">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading available slots...</div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No available slots for this date
        </div>
      ) : (
        <div className="space-y-2">
          {availableSlots.map((slot) => (
            <Button
              key={slot.id}
              onClick={() => bookSlot(slot)}
              variant="secondary"
              isLoading={bookingInProgress}
              className="w-full justify-start"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}