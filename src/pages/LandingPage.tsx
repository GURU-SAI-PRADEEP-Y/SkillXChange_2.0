import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Video, Users, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-black font-inter antialiased overflow-x-hidden">
      {/* Grid Background with larger grid boxes */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke='rgba(255, 255, 255, 0.1)' stroke-width='1' d='M0 0h80v80H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />

      {/* Content */}
      <div className="relative overflow-x-hidden">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              {/* Custom Logo */}
              <div className="flex items-center">
                <div className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">Skill</span>
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-white rounded-full transform rotate-45"></div>
                    <div className="absolute inset-0 border-2 border-white rounded-full transform rotate-90"></div>
                  </div>
                  <span className="ml-2">Change</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/signin')}
                className="px-6 py-2 rounded-lg bg-black border border-gray-700 text-white hover:bg-gray-900 transition-colors"
              >
                SignIn/SignUp
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Intensified and enlarged glowing light effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1000px] rounded-[50%] bg-gradient-to-b from-white/25 via-white/15 to-transparent opacity-80 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-[50%] bg-gradient-to-b from-white/30 via-white/20 to-transparent opacity-70 blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-[50%] bg-gradient-to-b from-white/35 via-white/25 to-transparent opacity-60 blur-xl"></div>
            
            {/* Additional light beam effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1000px] bg-gradient-to-b from-white/40 via-white/15 to-transparent opacity-70 blur-3xl"></div>
            
            <h1 className="text-[120px] font-bold text-white leading-none tracking-tight mb-8 relative z-10">
              <span className="block">Swap Skills,</span>
              <span className="block">Grow Together</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto relative z-10">
              Find the skills you want, share what you know.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-red-800 to-red-600 text-white hover:from-red-700 hover:to-red-500 transition-all duration-200 transform hover:scale-105 relative z-10"
            >
              Get started
            </button>
          </div>
        </div>

        {/* How it works Section - with margin and white background box */}
        <div className="py-24 px-8 bg-black relative">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-10">How it works?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-100 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Create a Profile</h3>
                  <p className="text-gray-700">
                    Create your SkillXchange profile in seconds with Google Auth. With one secure click, access personalized features, find skill matches, and start connecting—all while keeping your data protected.
                  </p>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Find Your Skill Match</h3>
                  <p className="text-gray-700">
                    Find Your Skill Match lets you connect with people who have the skills you want and are eager to learn what you can offer. Browse your interests to discover the perfect match for a rewarding skill exchange on SkillXchange!
                  </p>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Connect and Learn</h3>
                  <p className="text-gray-700">
                    Connect and Learn at SkillXchange is your gateway to exchanging knowledge with others, fostering growth and building valuable connections. Share what you know, learn something new, and grow together through collaborative skill-swapping experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="py-24 px-8 bg-black relative">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-10">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
                  Here, users will find features like skill matching, user reviews, event calendars, and interactive workshops—all designed to simplify connections, enhance learning, and create a seamless experience for everyone looking to share or learn new skills.
                </p>
                
                <button className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                  Explore
                </button>
              </div>
              
              <div className="relative mt-16 pt-10 pb-6 px-6 bg-gradient-to-b from-blue-50 to-cyan-100 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                      <Search className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Skill Matching</h3>
                    <p className="text-gray-700 text-center">
                      Quickly pairs you with users who have the skills you want to learn.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                      <Star className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">User Reviews & Ratings</h3>
                    <p className="text-gray-700 text-center">
                      Gain trust by checking feedback from past skill exchanges.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                      <Video className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Skill Workshops</h3>
                    <p className="text-gray-700 text-center">
                      Join group learning sessions led by skilled members.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                      <Calendar className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Event Calendar</h3>
                    <p className="text-gray-700 text-center">
                      Stay updated on upcoming events and skill-swap sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Happy Customers Section - with margin and white background box */}
        <div className="py-24 px-8 bg-black relative">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden p-10">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Happy Customers</h2>
                <h3 className="text-4xl font-bold text-gray-900 mb-10">What they're saying?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Customer" 
                    className="w-full h-64 object-cover object-center rounded-lg mb-4"
                  />
                  <p className="text-gray-700 mb-4">
                    "SkillXchange transformed how I learn new skills. I've been able to connect with experts in my field and share my own knowledge. The platform is intuitive and the community is incredibly supportive!"
                  </p>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Web Designer</p>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Customer" 
                    className="w-full h-64 object-cover object-center rounded-lg mb-4"
                  />
                  <p className="text-gray-700 mb-4">
                    "As someone looking to expand my programming skills, SkillXchange has been invaluable. I've connected with mentors who've helped me grow, and I've enjoyed teaching others what I know about data science."
                  </p>
                  <p className="font-semibold text-gray-900">David Chen</p>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80" 
                    alt="Customer" 
                    className="w-full h-64 object-cover object-center rounded-lg mb-4"
                  />
                  <p className="text-gray-700 mb-4">
                    "I joined SkillXchange to teach knitting, but I've ended up learning so much more! The platform makes it easy to schedule sessions and connect with people who share my interests. It's been a wonderful experience."
                  </p>
                  <p className="font-semibold text-gray-900">Eleanor Wright</p>
                  <p className="text-sm text-gray-500">Craft Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Highlights Section */}
        <div className="py-20 px-4 bg-gradient-to-r from-blue-900 to-cyan-900 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-5xl font-bold text-white mb-6">Community Highlights</h2>
                <p className="text-white text-lg mb-6">
                  Discover SkillXchange's Community Highlights—a showcase of top skill swappers and trending skills across web design, cooking, languages, and more. Explore profiles of members ready to teach and learn, as SkillXchange thrives through collaboration and shared growth.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Cryptocurrency" 
                    className="rounded-lg shadow-lg w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-10 px-4 bg-gray-900 text-white text-center">
          <p>Made by Guru sai pradeep</p>
        </footer>
      </div>
    </div>
  );
}