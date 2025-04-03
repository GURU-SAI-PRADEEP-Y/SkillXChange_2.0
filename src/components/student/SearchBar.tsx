import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for skills (e.g., Java, React, Python)"
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}