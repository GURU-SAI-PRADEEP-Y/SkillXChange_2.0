import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { GigForm } from '../components/mentor/GigForm';

export function CreateGig() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Gig</h1>
          <GigForm />
        </div>
      </main>
    </div>
  );
}