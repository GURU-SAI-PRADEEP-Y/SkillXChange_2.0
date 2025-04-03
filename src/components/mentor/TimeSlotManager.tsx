import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export function TimeSlotManager() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('mentor_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const createTimeSlot = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      const { error } = await supabase
        .from('time_slots')
        .insert([{
          mentor_id: user.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        }]);

      if (error) throw error;
      await loadTimeSlots();
    } catch (error) {
      console.error('Error creating time slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Time Slots</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <Button onClick={createTimeSlot} isLoading={loading} className="w-full mb-6">
        <Calendar className="h-5 w-5 mr-2" />
        Add Time Slot
      </Button>

      <div className="space-y-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              slot.is_booked ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="font-medium">
                  {new Date(slot.start_time).toLocaleDateString()} at{' '}
                  {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {!slot.is_booked && (
              <Button
                variant="secondary"
                onClick={() => deleteTimeSlot(slot.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}