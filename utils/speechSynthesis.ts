/**
 * Web Speech API を使用した読み上げ機能のユーティリティ
 * Google Chrome の speechSynthesis API を優先し、
 * 利用できない場合は代替手段を提供
 */

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class TextToSpeech {
  private static instance: TextToSpeech | null = null;
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private supported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * 読み上げに適さない記号や文字を除去・置換してテキストを整形する
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // バッククォートを除去
      .replace(/`/g, '')
      // 複数の記号を読みやすい形に置換
      .replace(/\-\-/g, 'から')
      .replace(/\-\>/g, 'から')
      .replace(/\<\-/g, 'から')
      .replace(/=\>/g, 'となる')
      .replace(/\!\=/g, '不等')
      .replace(/\=\=/g, '等しい')
      .replace(/\<\=/g, '以下')
      .replace(/\>\=/g, '以上')
      // HTMLタグを除去
      .replace(/<[^>]*>/g, '')
      // 複数のスペースを1つに
      .replace(/\s+/g, ' ')
      // 行頭・行末のスペースを除去
      .trim();
  }

  private constructor() {
    this.initializeSpeech();
  }

  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech();
    }
    return TextToSpeech.instance;
  }

  private initializeSpeech(): void {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.supported = true;
      this.loadVoices();
      
      // voices が非同期で読み込まれる場合に対応
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    } else {
      console.warn('Web Speech API is not supported in this browser');
    }
  }

  private loadVoices(): void {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  private getPreferredVoice(lang: string = 'ja-JP'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // 優先順位: 
    // 1. Google 日本語音声
    // 2. Microsoft 日本語音声  
    // 3. その他の日本語音声
    // 4. デフォルト音声

    const priorities = [
      (voice: SpeechSynthesisVoice) => voice.name.includes('Google') && voice.lang.startsWith('ja'),
      (voice: SpeechSynthesisVoice) => voice.name.includes('Microsoft') && voice.lang.startsWith('ja'),
      (voice: SpeechSynthesisVoice) => voice.lang.startsWith('ja'),
      (voice: SpeechSynthesisVoice) => voice.default
    ];

    for (const priorityCheck of priorities) {
      const voice = this.voices.find(priorityCheck);
      if (voice) return voice;
    }

    return this.voices.length > 0 ? this.voices[0] : null;
  }

  public speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.supported || !this.synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // 現在の読み上げを停止
      this.stop();

      // テキストをクリーンアップしてから読み上げ用のUtteranceを作成
      const cleanedText = this.cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      this.currentUtterance = utterance;

      // 音声設定
      const voice = this.getPreferredVoice(options.lang);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = options.lang || 'ja-JP';
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // イベントハンドラ
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // 読み上げ開始
      this.synth.speak(utterance);
    });
  }

  public stop(): void {
    if (this.synth && this.supported) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synth && this.supported && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.supported && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  public isPaused(): boolean {
    return this.synth ? this.synth.paused : false;
  }

  public isSupported(): boolean {
    return this.supported;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// シングルトンインスタンスをエクスポート
export const tts = TextToSpeech.getInstance();