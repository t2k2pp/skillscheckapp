
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center transform transition-all hover:scale-105 duration-300 ease-in-out">
      <h1 className="text-4xl font-extrabold text-primary dark:text-accent mb-4">
        C++ コーディングスキルテスト
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
        あなたのC++スキルを試してみましょう。
        <br />
        基礎から応用まで、幅広い知識が問われます。
      </p>
      <button
        onClick={onStart}
        className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-bold py-3 px-12 rounded-full shadow-lg transform transition-transform hover:translate-y-1 duration-300 ease-in-out text-xl"
      >
        テストを開始
      </button>
    </div>
  );
};

export default WelcomeScreen;
