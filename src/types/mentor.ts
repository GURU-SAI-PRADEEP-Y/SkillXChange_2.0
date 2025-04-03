export interface MentorProfile {
  id: string;
  full_name: string;
  email: string;
  bio: string | null;
  created_at: string;
}

export interface Gig {
  id: string;
  mentor_id: string;
  title: string;
  description: string;
  skillset: string[];
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}