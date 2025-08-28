import React, { useState, useEffect } from 'react';
import { QuestionSetMetadata } from '../types/questionSet';

interface BookSelectionScreenProps {
  onSelectBook: (bookId: string) => void;
}

const BookSelectionScreen: React.FC<BookSelectionScreenProps> = ({ onSelectBook }) => {
  const [questionSets, setQuestionSets] = useState<QuestionSetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionSets();
  }, []);

  const loadQuestionSets = async () => {
    try {
      setLoading(true);
      // 問題集メタデータを取得
      const response = await fetch(`${import.meta.env.BASE_URL}question-sets/index.json`);
      if (!response.ok) {
        throw new Error('問題集の読み込みに失敗しました');
      }
      const data = await response.json();
      setQuestionSets(data.questionSets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '問題集の読み込みでエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">問題集を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={loadQuestionSets}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📚 スキルチェッカー ライブラリ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            学習したい分野を選択してください
          </p>
        </header>

        {questionSets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              問題集が見つかりません
            </h2>
            <p className="text-gray-500 dark:text-gray-500">
              問題集ファイルを追加してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {questionSets.map((questionSet) => (
              <div
                key={questionSet.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => onSelectBook(questionSet.id)}
              >
                <div className="p-6">
                  {/* カバーイメージまたはアイコン */}
                  <div 
                    className="w-full h-48 rounded-lg mb-6 flex items-center justify-center text-6xl"
                    style={{ 
                      backgroundColor: questionSet.color || '#2196F3',
                      background: questionSet.color 
                        ? `linear-gradient(135deg, ${questionSet.color}, ${questionSet.color}CC)` 
                        : 'linear-gradient(135deg, #2196F3, #1976D2)'
                    }}
                  >
                    {questionSet.coverImage ? (
                      <img
                        src={`${import.meta.env.BASE_URL}question-sets/${questionSet.coverImage}`}
                        alt={questionSet.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {questionSet.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* タイトルと説明 */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                    {questionSet.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {questionSet.description}
                  </p>

                  {/* メタ情報 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {questionSet.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* 統計情報 */}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>📝 {questionSet.totalQuestions}問</span>
                    <span>⏱️ {questionSet.estimatedTime}</span>
                  </div>

                  {/* バージョン情報 */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>by {questionSet.author}</span>
                      <span>v{questionSet.version}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* フッター */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>新しい問題集を追加するには、<code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">/public/question-sets/</code> フォルダにJSONファイルを配置してください</p>
        </footer>
      </div>
    </div>
  );
};

export default BookSelectionScreen;