import React, { useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import { Gig } from '../../types/mentor';
import { Button } from '../Button';
import { BookingModal } from '../booking/BookingModal';
import { GigDetailsModal } from './GigDetailsModal';

interface StudentGigCardProps {
  gig: Gig;
}

export function StudentGigCard({ gig }: StudentGigCardProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const truncateDescription = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-white overflow-hidden shadow rounded-lg transition-shadow hover:shadow-lg">
        {gig.thumbnail_url && (
          <button 
            onClick={() => setShowDetails(true)}
            className="w-full aspect-video overflow-hidden"
          >
            <img
              src={gig.thumbnail_url}
              alt={gig.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
            />
          </button>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => setShowDetails(true)}
              className="text-left hover:text-indigo-600 transition-colors"
            >
              <h3 className="text-xl font-semibold text-current">{gig.title}</h3>
            </button>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-600">
                {gig.mentor_profiles?.rating?.toFixed(1) || '5.0'}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            {truncateDescription(gig.description)}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {gig.skillset.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Taught by</p>
              <p className="font-medium text-gray-900">{gig.mentor_profiles?.full_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-xl font-bold text-gray-900">${gig.price}</p>
            </div>
          </div>

          <Button onClick={() => setShowBooking(true)}>
            <Calendar className="h-5 w-5 mr-2" />
            Book Session
          </Button>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          mentorId={gig.mentor_id}
          gigTitle={gig.title}
          onClose={() => setShowBooking(false)}
          onBookingComplete={() => {
            setShowBooking(false);
          }}
        />
      )}

      {showDetails && (
        <GigDetailsModal
          gig={gig}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}