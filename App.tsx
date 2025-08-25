
import React, { useState, useCallback } from 'react';
import { QuizQuestion, UserAnswer, QuizPattern } from './types';
import { QUESTIONS } from './constants/questions';
import { getQuestionsByPattern, shuffleQuestionOptions } from './utils/quizPatterns';
import WelcomeScreen from './components/WelcomeScreen';
import PatternSelectionScreen from './components/PatternSelectionScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'welcome' | 'pattern_selection' | 'active' | 'finished'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const prepareQuizQuestions = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions) => {
    // 1. Get questions based on selected pattern
    const selectedQuestions = getQuestionsByPattern(pattern);

    // 2. For each question, shuffle the order of its options
    return selectedQuestions.map(shuffleQuestionOptions);
  }, []);

  const startQuiz = useCallback((pattern: QuizPattern = QuizPattern.AllQuestions) => {
    setQuestions(prepareQuizQuestions(pattern));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizState('active');
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
  }, [prepareQuizQuestions]);

  const showPatternSelection = useCallback(() => {
    setQuizState('pattern_selection');
  }, []);

  const handlePatternSelect = useCallback((pattern: QuizPattern) => {
    startQuiz(pattern);
  }, [startQuiz]);

  const backToWelcome = useCallback(() => {
    setQuizState('welcome');
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

  const restartQuiz = useCallback(() => {
    setQuizState('welcome');
  }, []);

  const renderContent = () => {
    switch (quizState) {
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
          />
        );
      case 'finished':
        return (
          <ResultsScreen
            userAnswers={userAnswers}
            questions={questions}
            onRestart={restartQuiz}
            totalTime={totalTime}
          />
        );
      case 'welcome':
      default:
        return <WelcomeScreen onStart={() => startQuiz()} onPatternSelect={showPatternSelection} />;
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