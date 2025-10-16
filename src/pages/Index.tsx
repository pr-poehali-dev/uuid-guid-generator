import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type UuidType = 'uuid-v4' | 'microsoft-guid';
type Language = 'en' | 'ar' | 'be' | 'zh' | 'de' | 'ru' | 'ja';

const translations = {
  en: {
    title: 'UUID V4 and GUID generator',
    generate: 'generate new',
    copy: 'copy to clipboard',
    copied: 'Copied!',
    selectUuid: 'select UUID',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: 'Language',
    identifier: 'Identifier'
  },
  ar: {
    title: 'مولد UUID V4 و GUID',
    generate: 'توليد جديد',
    copy: 'نسخ إلى الحافظة',
    copied: 'تم النسخ!',
    selectUuid: 'اختر UUID',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: 'اللغة',
    identifier: 'المعرف'
  },
  be: {
    title: 'Генератар UUID V4 і GUID',
    generate: 'стварыць новы',
    copy: 'скапіяваць у буфер',
    copied: 'Скапіявана!',
    selectUuid: 'выбраць UUID',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: 'Мова',
    identifier: 'Ідэнтыфікатар'
  },
  zh: {
    title: 'UUID V4 和 GUID 生成器',
    generate: '生成新的',
    copy: '复制到剪贴板',
    copied: '已复制！',
    selectUuid: '选择 UUID',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: '语言',
    identifier: '标识符'
  },
  de: {
    title: 'UUID V4 und GUID Generator',
    generate: 'neu generieren',
    copy: 'in Zwischenablage kopieren',
    copied: 'Kopiert!',
    selectUuid: 'UUID auswählen',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: 'Sprache',
    identifier: 'Kennung'
  },
  ru: {
    title: 'Генератор UUID V4 и GUID',
    generate: 'создать новый',
    copy: 'скопировать в буфер',
    copied: 'Скопировано!',
    selectUuid: 'выбрать UUID',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: 'Язык',
    identifier: 'Идентификатор'
  },
  ja: {
    title: 'UUID V4 および GUID ジェネレーター',
    generate: '新規生成',
    copy: 'クリップボードにコピー',
    copied: 'コピーしました！',
    selectUuid: 'UUID を選択',
    uuidV4: 'UUID v4',
    microsoftGuid: 'Microsoft GUID',
    language: '言語',
    identifier: '識別子'
  }
};

const languageNames = {
  en: 'English',
  ar: 'العربية',
  be: 'Беларуская',
  zh: '中文',
  de: 'Deutsch',
  ru: 'Русский',
  ja: '日本語'
};

const generateUuidV4 = (): string => {
  const hex = '0123456789abcdef';
  let uuid = '';
  
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hex[Math.floor(Math.random() * 4) + 8];
    } else {
      uuid += hex[Math.floor(Math.random() * 16)];
    }
  }
  
  return uuid;
};

const generateMicrosoftGuid = (): string => {
  const hex = '0123456789ABCDEF';
  let guid = '{';
  
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      guid += '-';
    } else if (i === 14) {
      guid += '4';
    } else if (i === 19) {
      guid += hex[Math.floor(Math.random() * 4) + 8];
    } else {
      guid += hex[Math.floor(Math.random() * 16)];
    }
  }
  
  guid += '}';
  return guid;
};

const Index = () => {
  const [uuidType, setUuidType] = useState<UuidType>('uuid-v4');
  const [language, setLanguage] = useState<Language>('en');
  const [currentUuid, setCurrentUuid] = useState<string>(generateUuidV4());
  const { toast } = useToast();

  const t = translations[language];

  const playClickSound = (frequency: number = 400) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleGenerate = () => {
    playClickSound(400);
    const newUuid = uuidType === 'uuid-v4' ? generateUuidV4() : generateMicrosoftGuid();
    setCurrentUuid(newUuid);
  };

  const handleCopy = async () => {
    playClickSound(550);
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUuid);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUuid;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (err) {
          console.error('Fallback copy failed:', err);
          textArea.remove();
        }
      }
      
      toast({
        description: t.copied,
        duration: 2000,
      });
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        description: 'Copy failed',
        duration: 2000,
        variant: 'destructive'
      });
    }
  };

  const handleTypeChange = (value: string) => {
    playClickSound(400);
    setUuidType(value as UuidType);
    const newUuid = value === 'uuid-v4' ? generateUuidV4() : generateMicrosoftGuid();
    setCurrentUuid(newUuid);
  };

  const handleLanguageChange = (value: string) => {
    playClickSound(400);
    setLanguage(value as Language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="absolute top-6 right-6">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[160px] bg-gradient-to-r from-[#2d2d2d] to-[#404040] border-[#404040] text-white">
              <div className="flex items-center gap-2">
                <Icon name="Globe" size={18} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-[#404040]">
              {Object.entries(languageNames).map(([code, name]) => (
                <SelectItem key={code} value={code} className="text-white hover:bg-[#404040]">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h1 className="text-5xl font-bold text-white text-center mb-16 tracking-wide">
          {t.title}
        </h1>

        <div className="bg-gradient-to-br from-[#2d2d2d] to-[#404040] rounded-2xl p-8 shadow-2xl border border-[#404040]">
          <div className="mb-4 text-sm text-gray-400 uppercase tracking-wider">
            {t.identifier}
          </div>
          
          <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-[#404040] shadow-inner">
            <p className="text-white text-2xl font-mono text-center break-all">
              {currentUuid}
            </p>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ff6b35] text-black font-semibold text-lg py-6 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
          >
            {t.copy}
          </Button>
        </div>

        <div className="flex justify-between items-end mt-6">
          <Button
            onClick={handleGenerate}
            variant="outline"
            className="bg-gradient-to-r from-[#2d2d2d] to-[#404040] hover:from-[#404040] hover:to-[#2d2d2d] border-[#404040] text-black font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Icon name="RotateCw" size={20} className="mr-2" />
            {t.generate}
          </Button>

          <Select value={uuidType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[200px] bg-gradient-to-r from-[#2d2d2d] to-[#404040] border-[#404040] text-black font-semibold py-6 rounded-xl">
              <div className="flex items-center gap-2">
                <Icon name="Link" size={18} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-[#404040]">
              <SelectItem value="uuid-v4" className="text-white hover:bg-[#404040]">
                {t.uuidV4}
              </SelectItem>
              <SelectItem value="microsoft-guid" className="text-white hover:bg-[#404040]">
                {t.microsoftGuid}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Index;