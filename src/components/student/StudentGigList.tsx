import React from 'react';
import { Gig } from '../../types/mentor';
import { StudentGigCard } from './StudentGigCard';

interface StudentGigListProps {
  gigs: Gig[];
  loading: boolean;
}

export function StudentGigList({ gigs, loading }: StudentGigListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No gigs found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gigs.map((gig) => (
        <StudentGigCard key={gig.id} gig={gig} />
      ))}
    </div>
  );
}