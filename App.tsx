
import React, { useState, useCallback } from 'react';
import { QuizQuestion, UserAnswer, QuizPattern, QuizMode, LearningCategory, QuizModeType } from './types';
import { QUESTIONS } from './constants/questions';
import { getQuestionsByPattern, shuffleQuestionOptions } from './utils/quizPatterns';
import { QuestionLoader } from './utils/questionLoader';
import { QuestionSet } from './types/questionSet';
import BookSelectionScreen from './components/BookSelectionScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LearningCategoryScreen from './components/LearningCategoryScreen';
import QuizModeSelectionScreen from './components/QuizModeSelectionScreen';
import PatternSelectionScreen from './components/PatternSelectionScreen';
import QuestionCard from './components/QuestionCard';
import OneByOneQuestionCard from './components/OneByOneQuestionCard';
import DictionaryScreen from './components/DictionaryScreen';
import DictionaryDetailCard from './components/DictionaryDetailCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'book_selection' | 'welcome' | 'category_selection' | 'quiz_mode_selection' | 'pattern_selection' | 'active' | 'one_by_one_active' | 'dictionary_list' | 'dictionary_detail' | 'finished'>('book_selection');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | null>(null);
  const [selectedQuizMode, setSelectedQuizMode] = useState<QuizModeType | null>(null);
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
      setQuizState('category_selection');
    } catch (error) {
      console.error('Failed to load question set:', error);
      // Handle error - could show error message
    }
  }, []);

  const prepareQuizQuestions = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions, questionSet?: QuestionSet, quizModeType?: QuizModeType) => {
    // Use current question set or fallback to empty array
    if (questionSet) {
      // Convert JSON questions to QuizQuestion format
      const quizQuestions = QuestionLoader.convertToQuizQuestions(questionSet.questions);
      
      // Apply pattern filtering based on mode
      let selectedQuestions: QuizQuestion[];
      
      if (quizModeType === QuizModeType.AllQuestions) {
        // All questions mode: use all questions, shuffle everything
        selectedQuestions = getQuestionsByPattern(QuizPattern.AllQuestions, quizQuestions);
        return selectedQuestions.map(shuffleQuestionOptions);
      } else if (quizModeType === QuizModeType.OneByOne) {
        // OneByOne mode: apply pattern filtering, shuffle everything
        selectedQuestions = getQuestionsByPattern(pattern, quizQuestions);
        return selectedQuestions.map(shuffleQuestionOptions);
      } else if (quizModeType === QuizModeType.Standard) {
        // Standard mode: apply pattern filtering, shuffle everything
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

  // Navigation handlers
  const showCategorySelection = useCallback(() => {
    setQuizState('category_selection');
  }, []);

  const showQuizModeSelection = useCallback(() => {
    setQuizState('quiz_mode_selection');
  }, []);

  const showPatternSelection = useCallback(() => {
    setQuizState('pattern_selection');
  }, []);

  const backToWelcome = useCallback(() => {
    setQuizState('category_selection');
  }, []);

  const backToCategorySelection = useCallback(() => {
    setQuizState('category_selection');
  }, []);

  const backToQuizModeSelection = useCallback(() => {
    setQuizState('quiz_mode_selection');
  }, []);

  const backToBookSelection = useCallback(() => {
    setQuizState('book_selection');
    setSelectedBook(null);
    setCurrentQuestionSet(null);
    setSelectedCategory(null);
    setSelectedQuizMode(null);
  }, []);

  // Category selection handler
  const handleCategorySelect = useCallback((category: LearningCategory) => {
    setSelectedCategory(category);
    if (category === LearningCategory.Dictionary) {
      // Dictionary mode: prepare questions and go directly to dictionary list
      const dictionaryQuestions = prepareQuizQuestions(QuizPattern.AllQuestions, currentQuestionSet || undefined);
      setQuestions(dictionaryQuestions);
      setCurrentQuestionIndex(0);
      setQuizState('dictionary_list');
    } else {
      // Quiz mode: show quiz mode selection
      showQuizModeSelection();
    }
  }, [prepareQuizQuestions, currentQuestionSet, showQuizModeSelection]);

  // Quiz mode selection handler
  const handleQuizModeSelect = useCallback((quizMode: QuizModeType) => {
    setSelectedQuizMode(quizMode);
    
    if (quizMode === QuizModeType.AllQuestions) {
      // All questions mode: start immediately without pattern selection
      const allQuestions = prepareQuizQuestions(QuizPattern.AllQuestions, currentQuestionSet || undefined, quizMode);
      setQuestions(allQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizState('active');
      const now = Date.now();
      setStartTime(now);
      setQuestionStartTime(now);
    } else {
      // OneByOne and Standard modes need pattern selection
      showPatternSelection();
    }
  }, [prepareQuizQuestions, currentQuestionSet, showPatternSelection]);

  // Pattern selection handler
  const handlePatternSelect = useCallback((pattern: QuizPattern) => {
    if (!selectedQuizMode) return;
    
    const questions = prepareQuizQuestions(pattern, currentQuestionSet || undefined, selectedQuizMode);
    setQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    
    if (selectedQuizMode === QuizModeType.Standard) {
      setQuizState('active');
      const now = Date.now();
      setStartTime(now);
      setQuestionStartTime(now);
    } else if (selectedQuizMode === QuizModeType.OneByOne) {
      setQuizState('one_by_one_active');
    }
  }, [selectedQuizMode, prepareQuizQuestions, currentQuestionSet]);

  // New handlers for OneByOne mode
  const handleOneByOneNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleOneByOneFinish = useCallback(() => {
    setQuizState('category_selection');
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
    setQuizState('category_selection');
  }, []);

  const renderContent = () => {
    switch (quizState) {
      case 'book_selection':
        return <BookSelectionScreen onSelectBook={handleBookSelect} />;
      case 'category_selection':
        return (
          <LearningCategoryScreen
            onCategorySelect={handleCategorySelect}
            onBack={backToBookSelection}
            questionSet={currentQuestionSet}
          />
        );
      case 'quiz_mode_selection': {
        const quizQuestions = currentQuestionSet ? QuestionLoader.convertToQuizQuestions(currentQuestionSet.questions) : [];
        return (
          <QuizModeSelectionScreen
            onModeSelect={handleQuizModeSelect}
            onBack={backToCategorySelection}
            questionSet={currentQuestionSet}
            questions={quizQuestions}
          />
        );
      }
      case 'pattern_selection': {
        const quizQuestions = currentQuestionSet ? QuestionLoader.convertToQuizQuestions(currentQuestionSet.questions) : [];
        return (
          <PatternSelectionScreen
            onPatternSelect={handlePatternSelect}
            onBack={backToQuizModeSelection}
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
            onBack={backToCategorySelection}
          />
        );
      case 'dictionary_list':
        return (
          <DictionaryScreen
            questions={questions}
            questionSet={currentQuestionSet}
            onQuestionSelect={handleDictionaryQuestionSelect}
            onBack={backToCategorySelection}
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
        // Legacy welcome screen - redirect to category selection
        return (
          <LearningCategoryScreen
            onCategorySelect={handleCategorySelect}
            onBack={backToBookSelection}
            questionSet={currentQuestionSet}
          />
        );
      default:
        return <BookSelectionScreen onSelectBook={handleBookSelect} />;
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