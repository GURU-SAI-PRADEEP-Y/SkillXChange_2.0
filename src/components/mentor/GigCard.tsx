import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Clock, Trash2 } from 'lucide-react';
import { Gig } from '../../types/mentor';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';

interface GigCardProps {
  gig: Gig;
  onDelete?: () => void;
}

export function GigCard({ gig, onDelete }: GigCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this gig?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('gigs')
        .delete()
        .eq('id', gig.id)
        .eq('mentor_id', user.id); // Ensure the mentor owns the gig

      if (error) throw error;
      onDelete?.();
    } catch (error) {
      console.error('Error deleting gig:', error);
      alert('Failed to delete gig. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-shadow hover:shadow-lg">
      {gig.thumbnail_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={gig.thumbnail_url}
            alt={gig.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4">{gig.description}</p>
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
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => navigate(`/mentor/time-slots?gig=${gig.id}`)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            title="Schedule Time Slots"
          >
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Schedule Time Slots
            </span>
          </button>
          
          <button
            onClick={() => navigate(`/mentor/gigs/${gig.id}/edit`)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            title="Edit Gig"
          >
            <Pencil className="h-5 w-5 text-gray-600" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Edit Gig
            </span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full hover:bg-red-100 transition-colors relative group"
            title="Delete Gig"
          >
            <Trash2 className="h-5 w-5 text-red-600" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Delete Gig
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}