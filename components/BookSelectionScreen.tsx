import React, { useState, useEffect, useMemo } from 'react';
import { QuestionSetMetadata } from '../types/questionSet';

interface BookSelectionScreenProps {
  onSelectBook: (bookId: string, metadata?: QuestionSetMetadata) => void;
}

const BookSelectionScreen: React.FC<BookSelectionScreenProps> = ({ onSelectBook }) => {
  const [questionSets, setQuestionSets] = useState<QuestionSetMetadata[]>([]);
  const [filteredQuestionSets, setFilteredQuestionSets] = useState<QuestionSetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'totalQuestions' | 'estimatedTime'>('title');

  useEffect(() => {
    loadQuestionSets();
  }, []);

  // すべてのカテゴリを取得
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    questionSets.forEach(set => {
      set.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [questionSets]);

  // 主要カテゴリの分類
  const categoryGroups = useMemo(() => {
    return {
      'プログラミング・開発': allCategories.filter(cat => 
        cat.includes('React') || cat.includes('Vue') || cat.includes('Python') || 
        cat.includes('Node.js') || cat.includes('C++') || cat.includes('フロントエンド') || 
        cat.includes('バックエンド') || cat.includes('Vite')
      ),
      'インフラ・ツール': allCategories.filter(cat => 
        cat.includes('Docker') || cat.includes('Git') || cat.includes('GitHub') || 
        cat.includes('DevOps') || cat.includes('インフラ')
      ),
      'データ・データベース': allCategories.filter(cat => 
        cat.includes('データベース') || cat.includes('SQL') || cat.includes('データ')
      ),
      'ビジネスアプリケーション': allCategories.filter(cat => 
        cat.includes('PowerApps') || cat.includes('Excel') || cat.includes('Microsoft') || 
        cat.includes('CAPM') || cat.includes('PMP') || cat.includes('プロジェクト管理')
      ),
      'AI・機械学習': allCategories.filter(cat => 
        cat.includes('AI') || cat.includes('機械学習') || cat.includes('G検定') || 
        cat.includes('ディープラーニング')
      )
    };
  }, [allCategories]);

  // フィルタリングとソート機能
  useEffect(() => {
    let filtered = [...questionSets];

    // 検索フィルタ
    if (searchQuery.trim()) {
      filtered = filtered.filter(set => 
        set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // カテゴリグループフィルタ
    if (selectedCategoryGroup !== 'all') {
      const groupCategories = categoryGroups[selectedCategoryGroup as keyof typeof categoryGroups] || [];
      filtered = filtered.filter(set => 
        set.categories.some(cat => groupCategories.includes(cat))
      );
    }

    // 個別カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(set => 
        set.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalQuestions':
          return b.totalQuestions - a.totalQuestions;
        case 'estimatedTime':
          return a.estimatedTime.localeCompare(b.estimatedTime);
        case 'title':
        default:
          return a.title.localeCompare(b.title, 'ja');
      }
    });

    setFilteredQuestionSets(filtered);
  }, [questionSets, searchQuery, selectedCategory, selectedCategoryGroup, sortBy, categoryGroups]);

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

        {/* カテゴリタブ */}
        {!loading && !error && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => {
                  setSelectedCategoryGroup('all');
                  setSelectedCategory('all');
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedCategoryGroup === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                すべて ({questionSets.length})
              </button>
              {Object.entries(categoryGroups).map(([groupName, categories]) => {
                const count = questionSets.filter(set => 
                  set.categories.some(cat => categories.includes(cat))
                ).length;
                
                if (count === 0) return null;
                
                return (
                  <button
                    key={groupName}
                    onClick={() => {
                      setSelectedCategoryGroup(groupName);
                      setSelectedCategory('all');
                    }}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                      selectedCategoryGroup === groupName
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {groupName === 'プログラミング・開発' && '💻'} 
                    {groupName === 'インフラ・ツール' && '🔧'} 
                    {groupName === 'データ・データベース' && '📊'} 
                    {groupName === 'ビジネスアプリケーション' && '🏢'} 
                    {groupName === 'AI・機械学習' && '🤖'} 
                    {' '}
                    {groupName} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 検索・フィルタ機能 */}
        {!loading && !error && (
          <div className="mb-8 space-y-4">
            {/* 検索バー */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="問題集を検索... (タイトル、説明、カテゴリ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* フィルタとソートオプション */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* カテゴリフィルタ */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">カテゴリ:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                >
                  <option value="all">すべて</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* ソートオプション */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">並び順:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'title' | 'totalQuestions' | 'estimatedTime')}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                >
                  <option value="title">タイトル順</option>
                  <option value="totalQuestions">問題数順</option>
                  <option value="estimatedTime">所要時間順</option>
                </select>
              </div>

              {/* 結果表示 */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredQuestionSets.length}件 / {questionSets.length}件
              </div>
            </div>
          </div>
        )}

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
        ) : filteredQuestionSets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              検索結果が見つかりません
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              検索条件を変更して再度お試しください
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCategoryGroup('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              検索をクリア
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredQuestionSets.map((questionSet) => (
              <div
                key={questionSet.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full flex flex-col"
                onClick={() => onSelectBook(questionSet.id, questionSet)}
              >
                {/* カバーイメージまたはアイコン */}
                <div 
                  className="w-full h-32 rounded-t-2xl flex items-center justify-center text-4xl flex-shrink-0"
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
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {questionSet.title.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  {/* タイトル */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {questionSet.title}
                  </h3>

                  {/* 説明文 */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-grow">
                    {questionSet.description}
                  </p>

                  {/* カテゴリタグ */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {questionSet.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                    {questionSet.categories.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs">
                        +{questionSet.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* 統計情報とメタデータ */}
                  <div className="space-y-2 mt-auto">
                    {/* コンテンツタイプ表示 */}
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        questionSet.type === 'ebook' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {questionSet.type === 'ebook' ? '📖 電子書籍' : '📝 クイズ'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>{questionSet.type === 'ebook' ? '📄' : '📝'}</span>
                        <span>{questionSet.type === 'ebook' ? 'ページ数' : `${questionSet.totalQuestions}問`}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{questionSet.estimatedTime}</span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
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