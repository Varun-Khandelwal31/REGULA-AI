import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Send, Globe, FileText, AlertTriangle } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isVoice?: boolean;
  voiceDuration?: string;
  hasCard?: boolean;
  actionCard?: {
    title: string;
    due?: string | null;
    amount?: string | null;
    link?: string;
  };
  timestamp: Date;
}

const Voice = () => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('hi');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allMessages: Omit<Message, 'timestamp'>[] = [
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Namaste! Main RegulaAI hoon — aapka compliance assistant.' 
    },
    { 
      id: 2, 
      sender: 'user', 
      text: '🎙️ Voice Note ▶ 0:04 — "Bhaiya aaj kaunsa filing bachhi hai?"',
      isVoice: true,
      voiceDuration: '0:04'
    },
    { 
      id: 3, 
      sender: 'bot', 
      hasCard: true,
      text: 'Namaste ji! 2 filings pending hain:\n1️⃣ GSTR-3B — kal tak\n2️⃣ EPF Challan — 5 din mein',
      actionCard: {
        title: 'GSTR-3B Draft Ready',
        due: 'Tomorrow',
        amount: '₹8,300',
      }
    },
    { 
      id: 4, 
      sender: 'user', 
      text: 'Haan bilkul, form tayar karo' 
    },
    { 
      id: 5, 
      sender: 'bot', 
      hasCard: true,
      text: 'Perfect! ✅ Filing Agent ready kar diya hai.',
      actionCard: {
        title: 'Open Filing Agent',
        link: '/app/filing',
      }
    },
  ];

  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    allMessages.forEach((msg) => {
      // Show typing indicator 1s before each bot message
      if (msg.sender === 'bot') {
        const delayMs = (msg as any).id === 1 ? 500 : (msg as any).id === 3 ? 3200 : 6800;
        setTimeout(() => setShowTyping(true), Math.max(0, delayMs - 1000));
      }
      
      const revealDelay = (msg as any).id === 1 ? 500 
        : (msg as any).id === 2 ? 1500 
        : (msg as any).id === 3 ? 3200 
        : (msg as any).id === 4 ? 5000 
        : 6800;

      setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages(prev => [...prev, { ...msg, timestamp: new Date() }]);
      }, revealDelay);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages, showTyping]);

  const getAIResponse = (text: string): { text: string; actionCard?: Message['actionCard'] } => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('gstr') || lowerText.includes('gst')) {
      return {
        text: 'GSTR-3B kaafi important hai. Agar aap miss karte ho, toh ₹50/day late fee lagta hai. Main check kar raha hoon... aapka GSTR-3B July 20 tak file karna hai.',
        actionCard: { title: 'File GSTR-3B Now', due: 'July 20', amount: '₹8,300', link: '/app/filing' }
      };
    }
    if (lowerText.includes('epf') || lowerText.includes('pf') || lowerText.includes('epfo')) {
      return {
        text: 'EPF June ka contribution July 15 tak file karna hai. Agar delay hoti hai, toh 1% interest per month lagta hai. Shall I prepare the challan?',
        actionCard: { title: 'Generate EPF Challan', due: 'July 15' }
      };
    }
    if (lowerText.includes('penalty') || lowerText.includes('fine') || lowerText.includes('late fee')) {
      return {
        text: 'Currently aap pe ek overdue filing hai: GSTR-3B June 2025. Ispe ₹600 late fee already accumulate ho chuka hai. Har din ₹50 badhta hai.',
        actionCard: { title: 'Pay Penalty & File', amount: '₹600+', link: '/app/filing' }
      };
    }
    if (lowerText.includes('deadline') || lowerText.includes('due') || lowerText.includes('date')) {
      return {
        text: 'Aapki upcoming deadlines:\n• GSTR-1: July 11 (2 days)\n• GSTR-3B: July 20\n• EPF: July 15',
        actionCard: { title: 'View Calendar', link: '/app/obligations' }
      };
    }

    return {
      text: language === 'hi'
        ? 'Main samajh gaya. Aap kya karna chahte ho? Main aapki compliance savaalon ka jawab de sakta hoon aur filing mein madad kar sakta hoon.'
        : 'I understand. What would you like to do? I can help with compliance questions and filing.',
    };
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setVisibleMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(inputText);
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        hasCard: !!response.actionCard,
        actionCard: response.actionCard,
        timestamp: new Date(),
      };
      setVisibleMessages(prev => [...prev, botMessage]);
      setShowTyping(false);
    }, 1200);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);

        const voiceMessage: Message = {
          id: Date.now(),
          sender: 'user',
          text: '🎙️ Voice Note ▶ 0:03',
          isVoice: true,
          voiceDuration: '0:03',
          timestamp: new Date(),
        };
        setVisibleMessages(prev => [...prev, voiceMessage]);
        setShowTyping(true);

        setTimeout(() => {
          setVisibleMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'Aapki GST filing status check kar raha hoon... Sab normal hai. GSTR-3B draft file ready hai.',
              hasCard: true,
              actionCard: { title: 'Open Filing Agent', link: '/app/filing' },
              timestamp: new Date(),
            },
          ]);
          setShowTyping(false);
        }, 1500);
      }, 3000);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hindi Voice Assistant</h1>
          <p className="text-text-secondary mt-1">
            Ask your compliance questions in Hindi or English — by voice or text
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              language === 'en' ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              language === 'hi' ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
            }`}
          >
            हिं
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Voice responses are in Hindi. Action cards link directly to Filing Agent.
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-card shadow-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">RegulaAI Assistant</div>
            <div className="text-sm text-white/70 flex items-center gap-1">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" /> Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {visibleMessages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-surface text-text-primary rounded-bl-sm border border-border'
                  }`}
                >
                  {message.isVoice ? (
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-3 bg-current rounded-full" />
                          <div className="w-1 h-5 bg-current rounded-full" />
                          <div className="w-1 h-2 bg-current rounded-full" />
                          <div className="w-1 h-4 bg-current rounded-full" />
                          <div className="w-1 h-3 bg-current rounded-full" />
                        </div>
                        <span className="text-sm opacity-90">{message.voiceDuration || '0:04'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  )}
                </div>

                {message.hasCard && message.actionCard && (
                  <div className={`mt-2 bg-white border border-border rounded-lg p-3 shadow-sm ${
                    message.sender === 'user' ? 'bg-primary/5 border-primary/20' : ''
                  }`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                      <FileText className="w-4 h-4 text-primary" />
                      {message.actionCard.title}
                    </div>
                    {(message.actionCard.due || message.actionCard.amount) && (
                      <div className="text-xs text-text-tertiary mt-1">
                        {message.actionCard.due && <span>Due: {message.actionCard.due}</span>}
                        {message.actionCard.due && message.actionCard.amount && <span> | </span>}
                        {message.actionCard.amount && <span>Amount: {message.actionCard.amount}</span>}
                      </div>
                    )}
                    <Link
                      to={message.actionCard.link || '/app/filing'}
                      className="mt-2 inline-block px-3 py-1.5 bg-primary text-white text-xs rounded font-medium hover:bg-primary-dark transition"
                    >
                      {message.actionCard.link ? 'Open' : 'View'}
                    </Link>
                  </div>
                )}

                <div className={`text-xs text-text-tertiary mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator bubble */}
          {showTyping && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border rounded-2xl px-4 py-3 rounded-bl-sm flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
                <span className="text-xs text-text-tertiary ml-2">RegulaAI is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 flex items-center gap-3">
          <button
            onClick={handleVoiceRecord}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isRecording
                ? 'bg-accent-red text-white animate-pulse'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          {isRecording && (
            <div className="flex items-center gap-2 text-accent-red">
              <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse" />
              <span className="text-sm">Recording...</span>
            </div>
          )}
          <input
            type="text"
            placeholder={language === 'hi' ? 'Hindi ya English mein likho...' : 'Type in Hindi or English...'}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 bg-surface border border-border rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            disabled={isRecording}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isRecording}
            className="w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voice;
