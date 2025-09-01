import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MermaidDiagram from './MermaidDiagram';

interface EbookSeparateViewerProps {
  contentFile: string;
  title: string;
  onBack: () => void;
  githubRepo?: string;
}

interface Page {
  id: number;
  title: string;
  content: string;
  headings: HeadingItem[];
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  pageIndex: number;
}

const EbookSeparateViewer: React.FC<EbookSeparateViewerProps> = ({ 
  contentFile, 
  title, 
  onBack, 
  githubRepo 
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [targetPage, setTargetPage] = useState<string>('');
  const [allHeadings, setAllHeadings] = useState<HeadingItem[]>([]);
  const [showToc, setShowToc] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMarkdownContent();
  }, [contentFile]);

  // 見出しを抽出する関数（全体用）
  const extractHeadings = (markdownText: string): HeadingItem[] => {
    const lines = markdownText.split('\n');
    const extractedHeadings: HeadingItem[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
        const id = text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
          .substring(0, 50) || `heading-${index}`;
          
        extractedHeadings.push({
          id,
          text: match[2],
          level,
          pageIndex: -1 // 後で設定
        });
      }
    });
    
    return extractedHeadings;
  };

  // マークダウンコンテンツをページに分割する関数
  const splitIntoPages = (markdownText: string): Page[] => {
    // 最初に全体の見出しを抽出
    const globalHeadings = extractHeadings(markdownText);
    
    // 最初に --- で分割
    let sections = markdownText.split(/^---\s*$/m);
    
    const resultPages: Page[] = [];
    let pageId = 1;

    sections.forEach((section, sectionIndex) => {
      if (section.trim() === '') return;

      // 各セクション内で # 見出し1で分割
      const h1Sections = section.split(/^(# .+)$/m).filter(Boolean);
      let currentH1Title = '';
      let currentContent = '';

      for (let i = 0; i < h1Sections.length; i++) {
        const part = h1Sections[i];
        
        if (part.match(/^# .+$/)) {
          // 前のページがあれば保存
          if (currentContent.trim() !== '') {
            const pageHeadings = extractHeadings(currentContent).map(h => ({
              ...h,
              pageIndex: pageId - 1
            }));
            
            resultPages.push({
              id: pageId++,
              title: currentH1Title || `ページ ${pageId - 1}`,
              content: currentContent.trim(),
              headings: pageHeadings
            });
            currentContent = '';
          }
          
          // 新しい見出し1を設定
          currentH1Title = part.replace(/^# /, '');
          currentContent = part + '\n\n';
        } else {
          // コンテンツを追加
          currentContent += part;
        }
      }

      // 最後のページを保存
      if (currentContent.trim() !== '') {
        const pageHeadings = extractHeadings(currentContent).map(h => ({
          ...h,
          pageIndex: pageId - 1
        }));
        
        resultPages.push({
          id: pageId++,
          title: currentH1Title || `ページ ${pageId - 1}`,
          content: currentContent.trim(),
          headings: pageHeadings
        });
      }
    });

    // ページが作成されなかった場合は全体を1ページとする
    if (resultPages.length === 0) {
      const pageHeadings = extractHeadings(markdownText).map(h => ({
        ...h,
        pageIndex: 0
      }));
      
      resultPages.push({
        id: 1,
        title: title || 'ページ 1',
        content: markdownText,
        headings: pageHeadings
      });
    }

    return resultPages;
  };

  // コンテンツ読み込み時にページ分割
  useEffect(() => {
    if (content) {
      const splitPages = splitIntoPages(content);
      setPages(splitPages);
      
      // 全ページの見出しを統合
      const combinedHeadings: HeadingItem[] = [];
      splitPages.forEach((page, pageIndex) => {
        page.headings.forEach(heading => {
          combinedHeadings.push({
            ...heading,
            pageIndex
          });
        });
      });
      setAllHeadings(combinedHeadings);
    }
  }, [content, title]);

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

  // ページナビゲーション関数
  const goToPrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    const index = pageNumber - 1;
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  };

  const handlePageJump = () => {
    const pageNumber = parseInt(targetPage);
    if (!isNaN(pageNumber)) {
      goToPage(pageNumber);
      setTargetPage('');
    }
  };

  // 見出しにジャンプする関数
  const jumpToHeading = (heading: HeadingItem) => {
    // まず対象のページに移動
    if (heading.pageIndex !== currentPageIndex) {
      setCurrentPageIndex(heading.pageIndex);
    }
    
    // 少し遅延してから見出しにスクロール
    setTimeout(() => {
      const element = document.getElementById(heading.id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    // 目次を閉じる
    setShowToc(false);
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

  const currentPage = pages[currentPageIndex];

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ライブラリに戻る
            </button>
            
            {/* ページ情報と目次ボタン */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowToc(!showToc)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="目次を表示/非表示"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                目次
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentPageIndex + 1} / {pages.length}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📖 {title}
          </h1>
          
          {currentPage && (
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {currentPage.title}
            </h2>
          )}
        </header>

        {/* ナビゲーションバー（上部） */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* 前へ・次へボタン */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentPageIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                前へ
              </button>
              
              <button
                onClick={goToNext}
                disabled={currentPageIndex === pages.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                次へ
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* ページジャンプ */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ページジャンプ:
              </span>
              <input
                type="number"
                min="1"
                max={pages.length}
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={`${currentPageIndex + 1}`}
              />
              <button
                onClick={handlePageJump}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                移動
              </button>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex gap-6 mb-6">
          {/* 目次サイドバー */}
          {showToc && allHeadings.length > 0 && (
            <aside className="w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  目次
                </h3>
                <button
                  onClick={() => setShowToc(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="目次を閉じる"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-1 max-h-96 overflow-y-auto">
                {allHeadings.map((heading, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToHeading(heading)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      hover:bg-blue-50 dark:hover:bg-gray-700
                      ${heading.level === 1 ? 'font-semibold text-gray-900 dark:text-gray-100' : ''}
                      ${heading.level === 2 ? 'ml-3 text-gray-800 dark:text-gray-200' : ''}
                      ${heading.level === 3 ? 'ml-6 text-gray-600 dark:text-gray-400' : ''}
                      ${heading.pageIndex === currentPageIndex 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
                        : ''
                      }
                    `}
                    title={`ページ ${heading.pageIndex + 1}に移動`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate flex-1">{heading.text}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        p.{heading.pageIndex + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </aside>
          )}

          {/* メインコンテンツ */}
          {currentPage && (
            <main className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 ${showToc ? 'flex-1' : 'w-full'}`}>
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
                {currentPage.content}
              </ReactMarkdown>
            </article>
            </main>
          )}
        </div>

        {/* ナビゲーションバー（下部） */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              前へ
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentPageIndex + 1} / {pages.length}
              </div>
              {currentPage && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPage.title}
                </div>
              )}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPageIndex === pages.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              次へ
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center space-y-4">
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

export default EbookSeparateViewer;