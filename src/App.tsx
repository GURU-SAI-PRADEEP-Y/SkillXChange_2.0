import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { CreateGig } from './pages/CreateGig';
import { EditGig } from './pages/EditGig';
import { TimeSlots } from './pages/TimeSlots';
import { LandingPage } from './pages/LandingPage';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/gigs/create" element={<CreateGig />} />
        <Route path="/mentor/gigs/:id/edit" element={<EditGig />} />
        <Route path="/mentor/time-slots" element={<TimeSlots />} />
      </Routes>
    </BrowserRouter>
  );
}