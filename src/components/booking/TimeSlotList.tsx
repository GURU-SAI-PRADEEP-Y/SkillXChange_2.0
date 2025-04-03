import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  bookings?: {
    id: string;
    status: string;
  }[];
}

export function TimeSlotList() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeSlots();
    
    // Set up real-time subscription for both time_slots and bookings
    const timeSlotSubscription = supabase
      .channel('time_slots_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'time_slots' 
        }, 
        () => {
          loadTimeSlots(); // Reload slots when changes occur
        }
      )
      .subscribe();

    return () => {
      timeSlotSubscription.unsubscribe();
    };
  }, []);

  const loadTimeSlots = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all time slots with their booking status
      const { data, error } = await supabase
        .from('time_slots')
        .select(`
          *,
          bookings (
            id,
            status
          )
        `)
        .eq('mentor_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Update slots with booking status
      const updatedSlots = data?.map(slot => ({
        ...slot,
        is_booked: slot.is_booked || (slot.bookings && slot.bookings.length > 0)
      })) || [];

      setSlots(updatedSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      // Check if the slot is actually booked before allowing deletion
      const { data: slot, error: checkError } = await supabase
        .from('time_slots')
        .select('is_booked')
        .eq('id', id)
        .single();

      if (checkError) throw checkError;

      if (slot.is_booked) {
        console.error('Cannot delete a booked time slot');
        return;
      }

      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTimeSlots();
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {slots.length === 0 ? (
        <p className="text-center text-gray-500">No time slots available</p>
      ) : (
        slots.map((slot) => (
          <div
            key={slot.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              slot.is_booked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
            }`}
          >
            <div>
              <p className="font-medium">
                {new Date(slot.start_time).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(slot.start_time).toLocaleTimeString()} - 
                {new Date(slot.end_time).toLocaleTimeString()}
              </p>
              {slot.is_booked && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Booked
                </span>
              )}
            </div>
            {!slot.is_booked && (
              <Button
                variant="secondary"
                onClick={() => deleteSlot(slot.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}