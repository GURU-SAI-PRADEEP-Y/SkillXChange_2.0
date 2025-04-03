import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../Input';
import { Button } from '../Button';
import { FileUpload } from '../uploads/FileUpload';
import { supabase } from '../../lib/supabase';

interface GigFormProps {
  gig?: {
    id: string;
    title: string;
    description: string;
    skillset: string[];
    thumbnail_url: string | null;
    video_url: string | null;
    price: number;
  };
}

export function GigForm({ gig }: GigFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    title: gig?.title || '',
    description: gig?.description || '',
    skillset: gig?.skillset.join(', ') || '',
    thumbnail_url: gig?.thumbnail_url || '',
    video_url: gig?.video_url || '',
    price: gig?.price?.toString() || '0' // Convert to string to avoid NaN
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert skills to lowercase and trim whitespace
      const skillset = formData.skillset
        .split(',')
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill.length > 0);

      const gigData = {
        title: formData.title,
        description: formData.description,
        skillset,
        thumbnail_url: formData.thumbnail_url,
        video_url: formData.video_url,
        price: parseFloat(formData.price) || 0, // Ensure valid number
        mentor_id: user.id,
      };

      if (gig) {
        const { error } = await supabase
          .from('gigs')
          .update(gigData)
          .eq('id', gig.id)
          .eq('mentor_id', user.id); // Ensure the mentor owns the gig
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gigs')
          .insert([gigData]);
        if (error) throw error;
      }

      navigate('/mentor/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid number input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <Input
        label="Skills (comma-separated)"
        value={formData.skillset}
        onChange={(e) => setFormData({ ...formData, skillset: e.target.value })}
        placeholder="react, typescript, node.js"
        required
      />

      <Input
        label="Price ($)"
        type="number"
        min="0"
        step="0.01"
        value={formData.price}
        onChange={handlePriceChange}
        required
      />

      <FileUpload
        accept="image/*"
        value={formData.thumbnail_url}
        onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
        onError={setError}
        maxSize={5}
        label="Thumbnail Image"
      />

      <FileUpload
        accept="video/*"
        value={formData.video_url}
        onChange={(url) => setFormData({ ...formData, video_url: url })}
        onError={setError}
        maxSize={100}
        label="Demo Video"
      />

      <Button type="submit" isLoading={loading}>
        {gig ? 'Update Gig' : 'Create Gig'}
      </Button>
    </form>
  );
}