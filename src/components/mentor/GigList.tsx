import React from 'react';
import { supabase } from '../../lib/supabase';
import { Gig } from '../../types/mentor';
import { GigCard } from './GigCard';

export function GigList() {
  const [gigs, setGigs] = React.useState<Gig[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadGigs();
  }, []);

  async function loadGigs() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGigs(data || []);
    } catch (error) {
      console.error('Error loading gigs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleGigDelete = () => {
    loadGigs(); // Reload the gigs list after deletion
  };

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
        <p className="text-gray-500">No gigs yet. Create your first gig to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gigs.map((gig) => (
        <GigCard key={gig.id} gig={gig} onDelete={handleGigDelete} />
      ))}
    </div>
  );
}