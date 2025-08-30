import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Dynamic import to reduce initial bundle size
        const mermaid = (await import('mermaid')).default;
        
        if (!isLoaded) {
          mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
          });
          setIsLoaded(true);
        }

        // Wait for next tick to ensure DOM is ready
        setTimeout(async () => {
          if (ref.current) {
            try {
              ref.current.innerHTML = '';
              const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
              const { svg } = await mermaid.render(id, chart);
              if (ref.current) { // Check again after async operation
                ref.current.innerHTML = svg;
              }
            } catch (renderError) {
              if (ref.current) {
                ref.current.innerHTML = `
                  <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p class="text-red-600 dark:text-red-400 text-sm">
                      Mermaid図の表示エラー: ${renderError instanceof Error ? renderError.message : '不明なエラー'}
                    </p>
                    <pre class="text-xs mt-2 bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-x-auto">${chart}</pre>
                  </div>
                `;
              }
            }
          }
        }, 0);
      } catch (error) {
        console.error('Mermaid loading error:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p class="text-red-600 dark:text-red-400 text-sm">
                Mermaidライブラリの読み込みエラー
              </p>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart, isLoaded]);

  return (
    <div 
      ref={ref} 
      className="mermaid-diagram my-4 flex justify-center"
      style={{ textAlign: 'center' }}
    />
  );
};

export default MermaidDiagram;