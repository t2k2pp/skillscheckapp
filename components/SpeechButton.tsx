import React, { useState, useEffect } from 'react';
import { tts } from '../utils/speechSynthesis';

interface SpeechButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  className = '',
  size = 'md',
  disabled = false,
  ariaLabel
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(tts.isSupported());
  }, []);

  const handleSpeak = async () => {
    if (!isSupported || disabled || !text.trim()) return;

    try {
      if (isPlaying) {
        // 再生中の場合は停止
        tts.stop();
        setIsPlaying(false);
      } else {
        // 再生開始
        setIsPlaying(true);
        await tts.speak(text);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
    }
  };

  // サポートされていない場合は何も表示しない
  if (!isSupported) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs';
      case 'lg':
        return 'w-10 h-10 text-lg';
      case 'md':
      default:
        return 'w-8 h-8 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full
    transition-all duration-200 transform hover:scale-110
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${getSizeClasses()}
  `;

  const stateClasses = disabled
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : isPlaying
    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md animate-pulse'
    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md';

  return (
    <button
      onClick={handleSpeak}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${className}`}
      aria-label={ariaLabel || (isPlaying ? '読み上げを停止' : 'テキストを読み上げ')}
      title={isPlaying ? '読み上げを停止' : 'テキストを読み上げ'}
    >
      {isPlaying ? (
        <span>⏸️</span>
      ) : (
        <span>📢</span>
      )}
    </button>
  );
};

export default SpeechButton;