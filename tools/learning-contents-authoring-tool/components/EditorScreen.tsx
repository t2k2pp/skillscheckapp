import React, { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, QuestionLevel } from '../types';
import { QuizMetadataEditor } from './QuizMetadataEditor';
import { QuestionEditor } from './QuestionEditor';
import { SaveIcon, PlusIcon, ListBulletIcon, Squares2X2Icon, ArrowUturnLeftIcon } from './icons';

interface EditorScreenProps {
  filename: string;
  onBack: () => void;
}

type ViewMode = 'list' | 'card';

const NEW_QUIZ_TEMPLATE: Quiz = {
    id: 'new-quiz',
    title: 'New Quiz Title',
    description: '',
    color: '#007bff',
    image_path: '',
    totalQuestions: 0,
    questions: [],
    question_sets_id: 0, // This might need to be adjusted
};

export const EditorScreen: React.FC<EditorScreenProps> = ({ filename, onBack }) => {
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        if (filename === 'new') {
            setIsNew(true);
            const newQuiz = { ...NEW_QUIZ_TEMPLATE, id: `quiz-${Date.now()}` };
            setQuizData(newQuiz);
        } else {
            setIsNew(false);
            const fetchQuiz = async () => {
                try {
                    const response = await fetch(`/api/question-sets/${filename}`);
                    if (!response.ok) throw new Error('Failed to load quiz data.');
                    const data = await response.json();
                    setQuizData(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchQuiz();
        }
    }, [filename]);

    const handleMetadataChange = useCallback((field: keyof Quiz, value: any) => {
        setQuizData(prev => prev ? { ...prev, [field]: value } : null);
    }, []);

    const handleQuestionChange = useCallback((id: number, updatedQuestion: Question) => {
        setQuizData(prev => {
            if (!prev) return null;
            const updatedQuestions = prev.questions.map(q => q.id === id ? updatedQuestion : q);
            return { ...prev, questions: updatedQuestions };
        });
    }, []);

    const addQuestion = () => {
        setQuizData(prev => {
            if (!prev) return null;
            const newId = prev.questions.length > 0 ? Math.max(...prev.questions.map(q => q.id)) + 1 : 1;
            const newQuestion: Question = {
                id: newId,
                level: 'beginner' as QuestionLevel,
                text: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: ''
            };
            const updatedQuiz = { ...prev, questions: [...prev.questions, newQuestion], totalQuestions: prev.questions.length + 1 };
            return updatedQuiz;
        });
    };

    const deleteQuestion = useCallback((id: number) => {
        setQuizData(prev => {
            if (!prev) return null;
            const updatedQuestions = prev.questions.filter(q => q.id !== id);
             const updatedQuiz = { ...prev, questions: updatedQuestions, totalQuestions: updatedQuestions.length };
            return updatedQuiz;
        });
    }, []);
    
    const handleSave = async () => {
        if (!quizData) return;

        let finalFilename = filename;
        if (isNew) {
            if (!quizData.id || quizData.id === 'new-quiz') {
                alert('Please set a unique ID for the new quiz in the metadata section.');
                return;
            }
            finalFilename = `${quizData.id}.json`;
        }

        try {
            const response = await fetch(`/api/question-sets/${finalFilename}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quizData, null, 2)
            });
            if (!response.ok) throw new Error('Failed to save data.');
            
            if (isNew) {
                // Add to index.json
                const indexResponse = await fetch('/api/question-sets');
                const indexData = await indexResponse.json();
                const newSet = {
                    id: quizData.id,
                    title: quizData.title,
                    description: quizData.description,
                    version: quizData.version,
                    author: quizData.author,
                    categories: quizData.categories,
                    totalQuestions: quizData.questions.length,
                    estimatedTime: quizData.estimatedTime,
                    coverImage: quizData.coverImage,
                    color: quizData.color
                };
                indexData.questionSets.push(newSet);
                const updateIndexResponse = await fetch('/api/question-sets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(indexData, null, 2)
                });
                if (!updateIndexResponse.ok) throw new Error('Failed to update index.json');
            }

            alert('Quiz saved successfully!');
            onBack();
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <div className="text-red-500 p-4">Error: {error} <button onClick={onBack} className="text-blue-500 underline">Go Back</button></div>;
    if (!quizData) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                     <h1 className="text-3xl font-bold text-gray-900">{quizData.title}</h1>
                     <p className="text-gray-500 mt-1">{isNew ? 'Creating New Quiz' : 'Editing Quiz'}</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                        onClick={onBack}
                        className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center transition-colors"
                    >
                       <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                       Back to List
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ backgroundColor: quizData.color, color: 'white' }}
                        className={`font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center transition-opacity hover:opacity-90`}
                    >
                        <SaveIcon className="h-5 w-5 mr-2" />
                        Save
                    </button>
                </div>
            </header>
            
            <main>
                <QuizMetadataEditor quiz={quizData} onMetadataChange={handleMetadataChange} isNew={isNew} />
                
                <div className="mt-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Questions ({quizData.questions.length})</h2>
                        <div className="flex items-center space-x-4">
                             <div className="flex items-center bg-slate-200 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow' : 'text-slate-600 hover:bg-slate-300'}`}
                                    aria-label="List view"
                                >
                                    <ListBulletIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white shadow' : 'text-slate-600 hover:bg-slate-300'}`}
                                    aria-label="Card view"
                                >
                                    <Squares2X2Icon className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                 onClick={addQuestion}
                                 style={{ backgroundColor: quizData.color, color: 'white' }}
                                 className={`font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center transition-opacity hover:opacity-90`}
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Question
                            </button>
                        </div>
                    </div>
                    <div className={viewMode === 'list' 
                        ? 'space-y-4' 
                        : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    }>
                        {quizData.questions.map((q, i) => (
                            <QuestionEditor 
                                key={q.id} 
                                question={q} 
                                index={i}
                                onQuestionChange={handleQuestionChange}
                                onDeleteQuestion={deleteQuestion}
                                accentColor={quizData.color}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
