import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import MermaidDiagram from './MermaidDiagram';

interface VideoViewerProps {
  youtubeId: string;
  markdownFile?: string;
  title: string;
  onBack: () => void;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const VideoViewer: React.FC<VideoViewerProps> = ({ youtubeId, markdownFile, title, onBack }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // マークダウンファイルを読み込み
  useEffect(() => {
    const loadMarkdownContent = async () => {
      if (!markdownFile) {
        setMarkdownContent('');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/skillscheckapp/videos/${markdownFile}`);
        if (response.ok) {
          const content = await response.text();
          setMarkdownContent(content);
        } else {
          console.warn('Failed to load markdown file:', markdownFile);
          setMarkdownContent('');
        }
      } catch (error) {
        console.error('Error loading markdown file:', error);
        setMarkdownContent('');
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkdownContent();
  }, [markdownFile]);

  // マークダウンから見出しを抽出（EbookViewerから流用）
  const extractHeadings = (markdownText: string): HeadingItem[] => {
    const lines = markdownText.split('\n');
    const extractedHeadings: HeadingItem[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '').substring(0, 50);
        extractedHeadings.push({ 
          id: id || `heading-${index}`, 
          text: match[2], 
          level 
        });
      }
    });
    return extractedHeadings;
  };

  const headings = useMemo(() => extractHeadings(markdownContent), [markdownContent]);

  // カスタムヘディングコンポーネント（EbookViewerから流用）
  const getHeadingClass = (level: number) => {
    switch (level) {
      case 1: return 'text-4xl font-bold mt-0 mb-8 text-gray-900 dark:text-gray-100';
      case 2: return 'text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-gray-100';
      case 3: return 'text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100';
      default: return 'text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100';
    }
  };

  const createHeadingComponent = (level: number) => {
    return ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const textForId = text.replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
      const id = textForId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '').substring(0, 50);
      
      return React.createElement(`h${level}`, {
        id: id || `heading-${Date.now()}`,
        className: getHeadingClass(level),
        ...props
      }, children);
    };
  };

  // スムーススクロール機能
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ライブラリに戻る
            </button>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎥 {title}
          </h1>
        </header>

        {/* 動画セクション */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={`https://youtu.be/${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              YouTubeで開く
            </a>
          </div>
        </div>

        {/* 補助資料セクション */}
        {markdownContent && (
          <div className="xl:flex xl:gap-8">
            {/* メインコンテンツエリア */}
            <main className="flex-1 min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  補助資料
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">補助資料を読み込み中...</span>
                  </div>
                ) : (
                  <article className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkEmoji]}
                      components={{
                        h1: createHeadingComponent(1),
                        h2: createHeadingComponent(2),
                        h3: createHeadingComponent(3),
                        h4: createHeadingComponent(4),
                        h5: createHeadingComponent(5),
                        h6: createHeadingComponent(6),
                        code: ({ node, inline, className, children, ...props }) => {
                          const match = /language-(\w+)/.exec(className || '');
                          if (!inline && match && match[1] === 'mermaid') {
                            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                          }
                          return (
                            <code
                              className={`${className} ${inline ? 'bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm' : ''}`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {markdownContent}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </main>

            {/* サイドナビゲーション（PCのみ表示） */}
            {headings.length > 0 && (
              <aside className="hidden xl:block xl:w-72 xl:flex-shrink-0 sticky top-8 self-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    目次
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                          heading.level === 1 ? 'font-semibold text-gray-900 dark:text-white' :
                          heading.level === 2 ? 'font-medium text-gray-700 dark:text-gray-200 pl-4' :
                          'text-gray-600 dark:text-gray-300 pl-8'
                        }`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ライブラリに戻る
          </button>
        </footer>
      </div>
    </div>
  );
};

export default VideoViewer;