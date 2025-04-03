/*
  # Add storage bucket for gig uploads

  1. New Storage
    - Create 'gig-uploads' bucket for storing gig-related files
    - Set up security policies for authenticated users

  2. Security
    - Allow authenticated users to upload files
    - Allow public access to read files
    - Restrict file updates and deletes to file owners
*/

-- Enable storage by inserting the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gig-uploads', 'gig-uploads', true);

-- Set up security policies
CREATE POLICY "Allow public access to gig uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gig-uploads');

CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gig-uploads');

CREATE POLICY "Allow owners to update their files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gig-uploads' AND owner = auth.uid());

CREATE POLICY "Allow owners to delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gig-uploads' AND owner = auth.uid());