import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { HeroSection } from '../components/dashboard/HeroSection';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}