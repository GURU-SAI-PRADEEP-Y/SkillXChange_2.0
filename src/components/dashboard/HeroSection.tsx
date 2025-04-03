import React, { useState } from 'react';
import { BookOpen, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../Button';

export function HeroSection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTeaching = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Check if mentor profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('mentor_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

      if (fetchError) throw fetchError;

      if (!existingProfile) {
        // Create mentor profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('mentor_profiles')
          .insert([{
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unnamed Mentor'
          }]);

        if (profileError) throw profileError;
      }

      navigate('/mentor/dashboard');
    } catch (error: any) {
      console.error('Error handling mentor profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Choose Your Learning Path
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with mentors or start your journey as a student. Learn, teach, and grow together.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1">
                <div className="h-full w-full flex flex-col items-center justify-center p-8 hover:bg-indigo-50 transition-colors">
                  <BookOpen className="h-16 w-16 text-indigo-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Become a Student</h2>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Find expert mentors and start learning new skills today
                  </p>
                  <Button
                    onClick={() => navigate('/student/dashboard')}
                    className="mt-4"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1">
                <div className="h-full w-full flex flex-col items-center justify-center p-8 hover:bg-indigo-50 transition-colors">
                  <Users className="h-16 w-16 text-indigo-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Become a Mentor</h2>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Share your expertise and help others grow
                  </p>
                  <Button
                    onClick={handleStartTeaching}
                    isLoading={isLoading}
                    className="mt-4"
                  >
                    Start Teaching
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}