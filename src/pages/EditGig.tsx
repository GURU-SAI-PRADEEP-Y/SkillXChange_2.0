import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { GigForm } from '../components/mentor/GigForm';
import { supabase } from '../lib/supabase';
import { Gig } from '../types/mentor';

export function EditGig() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = React.useState<Gig | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadGig() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/signin');
          return;
        }

        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data.mentor_id !== user.id) {
          navigate('/mentor/dashboard');
          return;
        }

        setGig(data);
      } catch (error) {
        console.error('Error loading gig:', error);
        navigate('/mentor/dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadGig();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Gig</h1>
          <GigForm gig={gig} />
        </div>
      </main>
    </div>
  );
}