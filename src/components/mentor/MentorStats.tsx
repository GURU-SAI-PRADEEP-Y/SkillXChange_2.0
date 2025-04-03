import React from 'react';
import { Users, Star, Award } from 'lucide-react';

interface MentorStatsProps {
  totalStudents: number;
  completionRate: number;
  rating: number;
}

export function MentorStats({ totalStudents, completionRate, rating }: MentorStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                <dd className="text-lg font-medium text-gray-900">{totalStudents}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                <dd className="text-lg font-medium text-gray-900">{completionRate}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                <dd className="text-lg font-medium text-gray-900">{rating.toFixed(1)}/5.0</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}