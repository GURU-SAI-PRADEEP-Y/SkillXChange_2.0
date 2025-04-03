import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../Button';

interface TimeSlotButtonProps {
  startTime: string;
  endTime: string;
  onBook: () => void;
  isLoading: boolean;
}

export function TimeSlotButton({ startTime, endTime, onBook, isLoading }: TimeSlotButtonProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-indigo-500 transition-colors">
      <div>
        <p className="font-medium text-gray-900">
          {new Date(startTime).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(startTime).toLocaleTimeString()} - 
          {new Date(endTime).toLocaleTimeString()}
        </p>
      </div>
      <Button
        onClick={onBook}
        isLoading={isLoading}
        className="ml-4"
      >
        <Calendar className="h-5 w-5 mr-2" />
        Book Now
      </Button>
    </div>
  );
}