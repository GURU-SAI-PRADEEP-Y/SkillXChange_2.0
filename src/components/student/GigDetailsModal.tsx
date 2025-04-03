import React, { useState } from 'react';
import { X, Star, Calendar, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { Gig } from '../../types/mentor';
import { Button } from '../Button';
import { BookingModal } from '../booking/BookingModal';

interface GigDetailsModalProps {
  gig: Gig;
  onClose: () => void;
}

export function GigDetailsModal({ gig, onClose }: GigDetailsModalProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  // Collect all media (thumbnail and video) into an array
  const mediaItems = [];
  if (gig.thumbnail_url) {
    mediaItems.push({
      type: 'image',
      url: gig.thumbnail_url
    });
  }
  if (gig.video_url) {
    mediaItems.push({
      type: 'video',
      url: gig.video_url
    });
  }

  const goToNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{gig.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Media Carousel */}
            <div className="space-y-6">
              {mediaItems.length > 0 && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {mediaItems[currentMediaIndex].type === 'image' ? (
                    <img
                      src={mediaItems[currentMediaIndex].url}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={mediaItems[currentMediaIndex].url}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {mediaItems.length > 1 && (
                    <>
                      <button 
                        onClick={goToPrevMedia}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={goToNextMedia}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      
                      {/* Carousel Indicators */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {mediaItems.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              index === currentMediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">About this Gig</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{gig.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Skills Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.skillset.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mentor</p>
                    <p className="text-lg font-medium text-gray-900">
                      {gig.mentor_profiles?.full_name}
                    </p>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Mail me to contact and learn and teach</span>
                        <span className="text-sm">{gig.mentor_profiles?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium text-gray-900">
                      {gig.mentor_profiles?.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-lg font-medium text-gray-900">
                      {gig.mentor_profiles?.completion_rate || 100}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-gray-900">${gig.price}</p>
                  </div>
                </div>

                <Button onClick={() => setShowBooking(true)} className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          mentorId={gig.mentor_id}
          gigTitle={gig.title}
          onClose={() => setShowBooking(false)}
          onBookingComplete={() => {
            setShowBooking(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}