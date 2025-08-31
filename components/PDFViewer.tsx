import React from 'react';

interface PDFViewerProps {
  pdfFile: string;
  title: string;
  onBack: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfFile, title, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            📄 {title}
          </h1>
        </header>


        {/* PDF表示エリア */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          <iframe
            src={`/skillscheckapp/pdfs/${pdfFile}`}
            width="100%"
            height="800px"
            className="border-0 rounded-lg"
            title={title}
          />
        </div>

        {/* フッター */}
        <footer className="mt-8 text-center">
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

export default PDFViewer;