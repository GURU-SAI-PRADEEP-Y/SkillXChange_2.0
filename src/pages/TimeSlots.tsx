import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { TimeSlotForm } from '../components/booking/TimeSlotForm';
import { TimeSlotList } from '../components/booking/TimeSlotList';

export function TimeSlots() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Time Slots</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeSlotForm />
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Time Slots</h2>
              <TimeSlotList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}