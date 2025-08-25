
import React, { useState, useCallback } from 'react';
import { QuizQuestion, UserAnswer } from './types';
import { QUESTIONS } from './constants/questions';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

// Fisher-Yates (aka Knuth) Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'welcome' | 'active' | 'finished'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const prepareQuizQuestions = useCallback(() => {
    // 1. Shuffle the order of questions
    const shuffledQuestions = shuffleArray(QUESTIONS);

    // 2. For each question, shuffle the order of its options
    return shuffledQuestions.map(question => {
      const correctAnswerText = question.options[question.correctAnswerIndex];
      const shuffledOptions = shuffleArray(question.options);
      const newCorrectAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
      
      return {
        ...question,
        options: shuffledOptions,
        correctAnswerIndex: newCorrectAnswerIndex,
      };
    });
  }, []);

  const startQuiz = useCallback(() => {
    setQuestions(prepareQuizQuestions());
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizState('active');
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
  }, [prepareQuizQuestions]);
  
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
        return <WelcomeScreen onStart={startQuiz} />;
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