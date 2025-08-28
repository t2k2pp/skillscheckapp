const fs = require('fs');
const path = require('path');

// Import the questions from the existing file (we'll manually copy the data)
const questionsData = `
export const QUESTIONS = [
  // 基礎レベル (1-16)
  {
    id: 1,
    level: 'beginner',
    text: 'Dockerコンテナの基となるテンプレートを何と呼びますか？',
    options: ['テンプレート', 'スナップショット', 'イメージ', 'ボリューム'],
    correctAnswerIndex: 2,
    explanation: 'Dockerイメージは、コンテナを作成するためのテンプレートです。アプリケーションとその依存関係が含まれている読み取り専用のテンプレートです。',
  },
  // ... (他の問題も同様に続く)
];
`;

// Create the Docker question set JSON
const dockerQuestionSet = {
  "id": "docker",
  "title": "Docker スキルチェッカー", 
  "description": "Dockerのスキルを効率的に測定できる問題集です。基礎から上級まで幅広いレベルの問題を収録し、実践的なスキル評価を提供します。",
  "version": "1.0.0",
  "author": "Docker Learning Team",
  "categories": ["基礎", "中級", "上級"],
  "totalQuestions": 75,
  "estimatedTime": "60-75分",
  "coverImage": "docker-logo.png",
  "color": "#2496ED",
  "questions": []
};

console.log('Run this script to convert your TypeScript questions to JSON format');