import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { GigList } from '../components/mentor/GigList';
import { MentorStats } from '../components/mentor/MentorStats';
import { Button } from '../components/Button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function MentorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    completionRate: 100,
    rating: 5.0
  });
  const [showChats, setShowChats] = useState(false);

  useEffect(() => {
    loadMentorStats();
  }, []);

  const loadMentorStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // First, ensure mentor profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('mentor_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!existingProfile) {
        // Create mentor profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('mentor_profiles')
          .insert([{
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unnamed Mentor',
            total_students: 0,
            completion_rate: 100,
            rating: 5.0
          }]);

        if (insertError) throw insertError;
      }

      // Now fetch the stats
      const { data: mentorStats, error: statsError } = await supabase
        .from('mentor_profiles')
        .select('total_students, completion_rate, rating')
        .eq('id', user.id)
        .single();

      if (statsError) throw statsError;

      if (mentorStats) {
        setStats({
          totalStudents: mentorStats.total_students || 0,
          completionRate: mentorStats.completion_rate || 100,
          rating: mentorStats.rating || 5.0
        });
      }
    } catch (error) {
      console.error('Error loading mentor stats:', error);
      // Set default stats if there's an error
      setStats({
        totalStudents: 0,
        completionRate: 100,
        rating: 5.0
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <MentorStats {...stats} />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
            <div className="flex gap-4">
              <Link to="/mentor/gigs/create">
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Gig
                </Button>
              </Link>
            </div>
          </div>
          
          <GigList />
        </div>
      </main>
    </div>
  );
}