
import React, { useState, useCallback } from 'react';
import { QuizQuestion, UserAnswer, QuizPattern } from './types';
import { QUESTIONS } from './constants/questions';
import { getQuestionsByPattern, shuffleQuestionOptions } from './utils/quizPatterns';
import { QuestionLoader } from './utils/questionLoader';
import { QuestionSet } from './types/questionSet';
import BookSelectionScreen from './components/BookSelectionScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PatternSelectionScreen from './components/PatternSelectionScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'book_selection' | 'welcome' | 'pattern_selection' | 'active' | 'finished'>('book_selection');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  // Book selection handler
  const handleBookSelect = useCallback(async (bookId: string) => {
    try {
      const questionSet = await QuestionLoader.loadQuestionSet(bookId);
      setSelectedBook(bookId);
      setCurrentQuestionSet(questionSet);
      setQuizState('welcome');
    } catch (error) {
      console.error('Failed to load question set:', error);
      // Handle error - could show error message
    }
  }, []);

  const prepareQuizQuestions = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions, questionSet?: QuestionSet) => {
    // Use current question set or fallback to legacy questions
    if (questionSet) {
      // Convert JSON questions to QuizQuestion format
      const quizQuestions = QuestionLoader.convertToQuizQuestions(questionSet.questions);
      // For now, return all questions - pattern filtering can be implemented later
      return quizQuestions.map(shuffleQuestionOptions);
    } else {
      // Fallback to legacy questions
      const selectedQuestions = getQuestionsByPattern(pattern);
      return selectedQuestions.map(shuffleQuestionOptions);
    }
  }, []);

  const startQuiz = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions) => {
    setQuestions(prepareQuizQuestions(pattern, currentQuestionSet || undefined));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizState('active');
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
  }, [prepareQuizQuestions, currentQuestionSet]);

  const showPatternSelection = useCallback(() => {
    setQuizState('pattern_selection');
  }, []);

  const handlePatternSelect = useCallback((pattern: QuizPattern) => {
    startQuiz(pattern);
  }, [startQuiz]);

  const backToWelcome = useCallback(() => {
    setQuizState('welcome');
  }, []);

  const backToBookSelection = useCallback(() => {
    setQuizState('book_selection');
    setSelectedBook(null);
    setCurrentQuestionSet(null);
  }, []);
  
  const handleAnswer = useCallback((answerIndex: number) => {
    const now = Date.now();
    const timeTaken = now - questionStartTime;
    const newAnswer: UserAnswer = { answerIndex, timeTaken };
    const newAnswers = [...userAnswers, newAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setQuestionStartTime(now);
    } else {
      setQuizState('finished');
      if (startTime) {
        setTotalTime(now - startTime);
      }
    }
  }, [userAnswers, currentQuestionIndex, questions.length, questionStartTime, startTime]);

  const handleEarlyFinish = useCallback(() => {
    const now = Date.now();
    setQuizState('finished');
    if (startTime) {
      setTotalTime(now - startTime);
    }
  }, [startTime]);

  const restartQuiz = useCallback(() => {
    setQuizState('welcome');
  }, []);

  const renderContent = () => {
    switch (quizState) {
      case 'book_selection':
        return <BookSelectionScreen onSelectBook={handleBookSelect} />;
      case 'pattern_selection':
        return (
          <PatternSelectionScreen
            onPatternSelect={handlePatternSelect}
            onBack={backToWelcome}
          />
        );
      case 'active':
        return (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onEarlyFinish={handleEarlyFinish}
          />
        );
      case 'finished':
        return (
          <ResultsScreen
            userAnswers={userAnswers}
            questions={questions}
            onRestart={restartQuiz}
            onBackToBooks={backToBookSelection}
            totalTime={totalTime}
          />
        );
      case 'welcome':
      default:
        return (
          <WelcomeScreen 
            onStart={() => startQuiz()} 
            onPatternSelect={showPatternSelection}
            onBackToBooks={backToBookSelection}
            bookTitle={currentQuestionSet?.title || 'Unknown Book'}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-500">
      <div className="w-full max-w-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;