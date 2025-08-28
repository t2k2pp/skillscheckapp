// Script to extract all Docker questions and convert to JSON
const fs = require('fs');

// Read the TypeScript file and manually convert each question
// This is a template - we'll manually create the full JSON with all 75 questions

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
  "questions": [
    // All 75 questions will be added here manually
  ]
};

console.log('This is a template for Docker questions conversion');