import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MermaidDiagram from './MermaidDiagram';

interface EbookViewerProps {
  contentFile: string;
  title: string;
  onBack: () => void;
  githubRepo?: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const EbookViewer: React.FC<EbookViewerProps> = ({ contentFile, title, onBack, githubRepo }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMarkdownContent();
  }, [contentFile]);

  // 見出しを抽出する関数
  const extractHeadings = (markdownText: string): HeadingItem[] => {
    const lines = markdownText.split('\n');
    const extractedHeadings: HeadingItem[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ''); // 日本語対応
        const id = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
          .substring(0, 50); // IDの長さ制限
          
        extractedHeadings.push({
          id: id || `heading-${index}`,
          text: match[2],
          level
        });
      }
    });
    
    return extractedHeadings;
  };

  // コンテンツ読み込み時に見出しを抽出
  useEffect(() => {
    if (content) {
      const extractedHeadings = extractHeadings(content);
      setHeadings(extractedHeadings);
    }
  }, [content]);

  // スクロール監視でアクティブな見出しを更新
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll('h1, h2, h3');
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      let currentHeading = '';
      
      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        
        if (elementTop <= scrollTop + windowHeight / 3) {
          currentHeading = element.id;
        }
      });
      
      if (currentHeading !== activeHeading) {
        setActiveHeading(currentHeading);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初回実行
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHeading, headings]);

  const loadMarkdownContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.BASE_URL}question-sets/${contentFile}`);
      if (!response.ok) {
        throw new Error('マークダウンファイルの読み込みに失敗しました');
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">コンテンツを読み込んでいます...</p>
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
          <div className="space-x-4">
            <button
              onClick={loadMarkdownContent}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              再試行
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 見出しクリック時のスムーススクロール
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 見出しコンポーネント（ID自動付与）
  const createHeadingComponent = (level: number) => {
    return ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const cleanText = text.replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
      const id = cleanText
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
        .substring(0, 50) || `heading-${Date.now()}`;
      
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      
      // Proseクラスに対応する見出しスタイル
      const getHeadingClass = (level: number) => {
        switch (level) {
          case 1:
            return 'text-4xl font-bold mt-0 mb-8 text-gray-900 dark:text-gray-100';
          case 2:
            return 'text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-gray-100';
          case 3:
            return 'text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100';
          default:
            return '';
        }
      };
      
      return (
        <HeadingTag id={id} className={getHeadingClass(level)} {...props}>
          {children}
        </HeadingTag>
      );
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl xl:max-w-7xl">
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
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📖 {title}
          </h1>
        </header>

        {/* メインコンテンツエリア */}
        <div className="xl:flex xl:gap-8">
          {/* マークダウンコンテンツ（メインカラム） */}
          <main className="xl:flex-1 xl:max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <article 
              ref={contentRef}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-code:break-words"
            >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkEmoji]}
              components={{
                // 見出しにID自動付与
                h1: createHeadingComponent(1),
                h2: createHeadingComponent(2),
                h3: createHeadingComponent(3),
                img: ({ src, alt, ...props }) => (
                  <img
                    src={src?.startsWith('http') ? src : `${import.meta.env.BASE_URL}question-sets/images/${src}`}
                    alt={alt}
                    className="rounded-lg shadow-md max-w-full h-auto"
                    {...props}
                  />
                ),
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                pre: ({ children, ...props }) => (
                  <pre 
                    className="overflow-x-auto whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-700 p-4 rounded-lg" 
                    {...props}
                  >
                    {children}
                  </pre>
                ),
                code: ({ children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !className;
                  
                  if (isInline) {
                    return (
                      <code
                        className="break-words px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  
                  // Mermaid図の処理
                  if (language === 'mermaid') {
                    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                  }
                  
                  return (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={language || 'text'}
                      PreTag="div"
                      className="rounded-lg text-sm"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
                input: ({ type, checked, disabled, ...props }) => {
                  if (type === 'checkbox') {
                    return (
                      <input
                        type="checkbox"
                        checked={checked || false}
                        disabled={disabled !== undefined ? disabled : true}
                        className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        {...props}
                      />
                    );
                  }
                  return <input type={type} {...props} />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </main>

        {/* サイドナビゲーション（PCのみ表示） */}
        <aside className="hidden xl:block xl:w-72 xl:flex-shrink-0 sticky top-8 self-start">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              目次
            </h2>
            
            {headings.length > 0 ? (
              <nav className="space-y-1">
                {headings.map((heading, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      hover:bg-blue-50 dark:hover:bg-gray-700
                      ${heading.level === 1 ? 'font-semibold' : ''}
                      ${heading.level === 2 ? 'ml-2' : ''}
                      ${heading.level === 3 ? 'ml-4 text-gray-600 dark:text-gray-400' : ''}
                      ${activeHeading === heading.id 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                見出しが見つかりませんでした
              </p>
            )}
          </div>
        </aside>
        </div>

        {/* フッター */}
        <footer className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ライブラリに戻る
            </button>
            {githubRepo && (
              <a
                href={`https://github.com/${githubRepo}/blob/main/public/question-sets/${contentFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHubで見る
              </a>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            より高度な表現（Mermaid図、数式等）はGitHubでご確認ください
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EbookViewer;