import React, { useEffect, useState } from 'react';
import { Navbar } from '../navigation/Navbar';
import { GigList } from './GigList';
import { Button } from '../Button';
import { Plus, MessageCircle, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface MentorProfile {
  full_name: string;
  email: string;
  avatar_url: string | null;
  total_students: number;
  completion_rate: number;
  rating: number;
}

export function MentorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentorProfile();
  }, []);

  const loadMentorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Get mentor profile with all details
      const { data: mentorProfile, error } = await supabase
        .from('mentor_profiles')
        .select(`
          full_name,
          email,
          total_students,
          completion_rate,
          rating
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Get avatar from profiles table
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (mentorProfile) {
        setProfile({
          ...mentorProfile,
          avatar_url: userProfile?.avatar_url || null
        });
      }
    } catch (error) {
      console.error('Error loading mentor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name}</h2>
                <div className="flex items-center mt-2 text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Students</span>
                    <span className="font-medium">{profile?.total_students || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min((profile?.total_students || 0) / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Completion Rate</span>
                    <span className="font-medium">{profile?.completion_rate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${profile?.completion_rate || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-medium">{(profile?.rating || 5).toFixed(1)}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${((profile?.rating || 5) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/mentor/gigs/create" className="w-full">
                  <Button className="w-full">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Gig
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Messages
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Gigs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
              </div>
              <div className="p-6">
                <GigList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}