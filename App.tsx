
import React, { useState, useCallback } from 'react';
import { QuizQuestion, UserAnswer, QuizPattern, QuizMode } from './types';
import { QUESTIONS } from './constants/questions';
import { getQuestionsByPattern, shuffleQuestionOptions } from './utils/quizPatterns';
import { QuestionLoader } from './utils/questionLoader';
import { QuestionSet } from './types/questionSet';
import BookSelectionScreen from './components/BookSelectionScreen';
import WelcomeScreen from './components/WelcomeScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import PatternSelectionScreen from './components/PatternSelectionScreen';
import QuestionCard from './components/QuestionCard';
import OneByOneQuestionCard from './components/OneByOneQuestionCard';
import DictionaryScreen from './components/DictionaryScreen';
import DictionaryDetailCard from './components/DictionaryDetailCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'book_selection' | 'welcome' | 'mode_selection' | 'pattern_selection' | 'active' | 'one_by_one_active' | 'dictionary_list' | 'dictionary_detail' | 'finished'>('book_selection');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [selectedMode, setSelectedMode] = useState<QuizMode>(QuizMode.Standard);
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

  const prepareQuizQuestions = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions, questionSet?: QuestionSet, mode: QuizMode = QuizMode.Standard) => {
    // Use current question set or fallback to legacy questions
    if (questionSet) {
      // Convert JSON questions to QuizQuestion format
      const quizQuestions = QuestionLoader.convertToQuizQuestions(questionSet.questions);
      
      // Apply pattern filtering for Standard mode, all questions for other modes
      let selectedQuestions: QuizQuestion[];
      if (mode === QuizMode.Standard) {
        selectedQuestions = getQuestionsByPattern(pattern, quizQuestions);
        return selectedQuestions.map(shuffleQuestionOptions);
      } else if (mode === QuizMode.OneByOne) {
        // Shuffle questions but keep options shuffled per question
        selectedQuestions = getQuestionsByPattern(pattern, quizQuestions);
        return selectedQuestions.map(shuffleQuestionOptions);
      } else {
        // Dictionary mode: no shuffling, original order
        return getQuestionsByPattern(QuizPattern.AllQuestions, quizQuestions);
      }
    } else {
      // Fallback to empty array
      return [];
    }
  }, []);

  const startQuiz = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions) => {
    setQuestions(prepareQuizQuestions(pattern, currentQuestionSet || undefined, selectedMode));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    
    if (selectedMode === QuizMode.Standard) {
      setQuizState('active');
      const now = Date.now();
      setStartTime(now);
      setQuestionStartTime(now);
    } else if (selectedMode === QuizMode.OneByOne) {
      setQuizState('one_by_one_active');
    } else {
      setQuizState('dictionary_list');
    }
  }, [prepareQuizQuestions, currentQuestionSet, selectedMode]);

  const showModeSelection = useCallback(() => {
    setQuizState('mode_selection');
  }, []);

  const showPatternSelection = useCallback(() => {
    setQuizState('pattern_selection');
  }, []);

  const handleModeSelect = useCallback((mode: QuizMode) => {
    setSelectedMode(mode);
    if (mode === QuizMode.Dictionary) {
      // Dictionary mode doesn't need pattern selection
      startQuiz(QuizPattern.AllQuestions);
    } else {
      // Standard and OneByOne modes need pattern selection
      showPatternSelection();
    }
  }, [startQuiz, showPatternSelection]);

  const handlePatternSelect = useCallback((pattern: QuizPattern) => {
    startQuiz(pattern);
  }, [startQuiz]);

  const backToWelcome = useCallback(() => {
    setQuizState('welcome');
  }, []);

  const backToModeSelection = useCallback(() => {
    setQuizState('mode_selection');
  }, []);

  const backToBookSelection = useCallback(() => {
    setQuizState('book_selection');
    setSelectedBook(null);
    setCurrentQuestionSet(null);
  }, []);

  // New handlers for OneByOne mode
  const handleOneByOneNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleOneByOneFinish = useCallback(() => {
    setQuizState('welcome');
  }, []);

  // New handlers for Dictionary mode
  const handleDictionaryQuestionSelect = useCallback((questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setQuizState('dictionary_detail');
  }, []);

  const handleDictionaryBack = useCallback(() => {
    setQuizState('dictionary_list');
  }, []);

  const handleDictionaryPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleDictionaryNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);
  
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
      case 'mode_selection':
        return (
          <ModeSelectionScreen
            onModeSelect={handleModeSelect}
            onBack={backToWelcome}
            questionSet={currentQuestionSet}
          />
        );
      case 'pattern_selection': {
        const quizQuestions = currentQuestionSet ? QuestionLoader.convertToQuizQuestions(currentQuestionSet.questions) : [];
        return (
          <PatternSelectionScreen
            onPatternSelect={handlePatternSelect}
            onBack={backToModeSelection}
            questionSet={currentQuestionSet}
            questions={quizQuestions}
          />
        );
      }
      case 'one_by_one_active':
        return (
          <OneByOneQuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onNext={handleOneByOneNext}
            onFinish={handleOneByOneFinish}
            onBack={backToModeSelection}
          />
        );
      case 'dictionary_list':
        return (
          <DictionaryScreen
            questions={questions}
            questionSet={currentQuestionSet}
            onQuestionSelect={handleDictionaryQuestionSelect}
            onBack={backToModeSelection}
          />
        );
      case 'dictionary_detail':
        return (
          <DictionaryDetailCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onBack={handleDictionaryBack}
            onPrevious={handleDictionaryPrevious}
            onNext={handleDictionaryNext}
            hasPrevious={currentQuestionIndex > 0}
            hasNext={currentQuestionIndex < questions.length - 1}
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
            questionSet={currentQuestionSet}
          />
        );
      case 'welcome':
      default:
        return (
          <WelcomeScreen 
            onStart={showModeSelection}
            onPatternSelect={showModeSelection}
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