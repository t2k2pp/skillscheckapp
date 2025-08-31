import React, { useState, useEffect } from 'react';

interface QuestionSetInfo {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  // Add other fields from index.json as needed
}

interface IndexScreenProps {
  onEdit: (filename: string) => void;
}

export const IndexScreen: React.FC<IndexScreenProps> = ({ onEdit }) => {
  const [questionSets, setQuestionSets] = useState<QuestionSetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionSets = async () => {
    try {
      const response = await fetch('/api/question-sets');
      if (!response.ok) {
        throw new Error('Failed to fetch question sets');
      }
      const data = await response.json();
      setQuestionSets(data.questionSets);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const handleDelete = async (setInfo: QuestionSetInfo) => {
    const filename = `${setInfo.id}.json`;
    if (!window.confirm(`Are you sure you want to delete ${filename} and its associated image?`)) {
      return;
    }

    try {
        const imageToDelete = setInfo.coverImage;

        // Delete the json file
        const resJson = await fetch(`/api/question-sets/${filename}`, { method: 'DELETE' });
        if (!resJson.ok) throw new Error(`Failed to delete ${filename}`);

        // Delete the image file if it exists
        if (imageToDelete) {
            const resImg = await fetch(`/api/images/${imageToDelete}`, { method: 'DELETE' });
            if (!resImg.ok) console.error(`Failed to delete image ${imageToDelete}`);
        }

        // Update index.json on the server
        const updatedSets = questionSets.filter(qs => qs.id !== setInfo.id);
        const resIndex = await fetch('/api/question-sets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionSets: updatedSets })
        });
        if (!resIndex.ok) throw new Error('Failed to update index.json');

        // Refresh the list
        fetchQuestionSets();

    } catch (err) {
        setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Learning Contents Manager</h1>
      <button 
        onClick={() => onEdit('new')} 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add New Question Set
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questionSets.map((qs) => (
          <div key={qs.id} className="border rounded-lg p-4 shadow-lg">
            <img src={`/images/${qs.coverImage}`} alt={qs.title} className="w-full h-32 object-contain mb-4" />
            <h2 className="text-xl font-semibold">{qs.title}</h2>
            <p className="text-gray-600 mb-2">{qs.id}</p>
            <p className="text-gray-700 mb-4">{qs.description}</p>
            <div className="flex justify-end space-x-2">
                <button 
                    onClick={() => onEdit(`${qs.id}.json`)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(qs)} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Delete
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};