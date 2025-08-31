
import React from 'react';
import { Quiz } from '../types';

interface QuizMetadataEditorProps {
  quiz: Quiz;
  onMetadataChange: (field: keyof Quiz, value: any) => void;
  isNew?: boolean;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; disabled?: boolean; }> = ({ label, value, onChange, name, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input
                type="text"
                name={name}
                id={name}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    </div>
);

export const QuizMetadataEditor: React.FC<QuizMetadataEditorProps> = ({ quiz, onMetadataChange, isNew }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onMetadataChange(e.target.name as keyof Quiz, e.target.value);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Image upload failed');
            const data = await response.json();
            onMetadataChange('coverImage', data.filename);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Quiz Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Title" name="title" value={quiz.title} onChange={handleInputChange} />
                <InputField label="ID (used for filename, e.g., 'my-new-quiz')" name="id" value={quiz.id} onChange={handleInputChange} disabled={!isNew} />
                
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            value={quiz.description}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Accent Color</label>
                    <div className="mt-1 flex items-center gap-2">
                        <input
                            type="color"
                            name="color"
                            id="color"
                            className="h-10 w-10 rounded-md border-gray-300"
                            value={quiz.color}
                            onChange={(e) => onMetadataChange('color', e.target.value)}
                        />
                         <span className="text-sm text-gray-600">{quiz.color}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
                    <div className="mt-1 flex items-center gap-4">
                        {quiz.coverImage && <img src={`/images/${quiz.coverImage}?t=${new Date().getTime()}`} alt="thumbnail" className="w-20 h-20 object-contain rounded-md border"/>}
                        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="text-sm"/>
                    </div>
                    {quiz.coverImage && <p className="text-xs text-gray-500 mt-1">Current: {quiz.coverImage}</p>}
                </div>

            </div>
        </div>
    );
};
