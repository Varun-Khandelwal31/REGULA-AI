import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Send, Globe, FileText, Loader2, AlertTriangle } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  isVoice: boolean;
  voiceDuration?: string;
  hasActionCard?: boolean;
  actionCard?: {
    title: string;
    due?: string | null;
    amount?: string | null;
    link?: string;
  };
  timestamp: Date;
}

const Voice = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'user',
      content: 'Voice Note [0:04]',
      isVoice: true,
      voiceDuration: '0:04',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 2,
      type: 'assistant',
      content: 'Namaste ji! Aapki 2 filings pending hain: GSTR-3B kal tak aur EPF challan 5 din mein. Kya main form tayar karun?',
      isVoice: true,
      voiceDuration: '0:12',
      hasActionCard: true,
      actionCard: {
        title: 'GSTR-3B Draft Ready',
        due: 'Tomorrow',
        amount: '₹8,300',
      },
      timestamp: new Date(Date.now() - 50000),
    },
    {
      id: 3,
      type: 'user',
      content: 'Haan bilkul',
      isVoice: false,
      timestamp: new Date(Date.now() - 40000),
    },
    {
      id: 4,
      type: 'assistant',
      content: 'Perfect! Filing Agent khol raha hoon. Aapka GSTR-3B pre-filled ho jayega. Sirf ek tap mein submit kar sakte ho.',
      isVoice: false,
      hasActionCard: true,
      actionCard: {
        title: 'Open Filing Agent',
        link: '/app/filing',
      },
      timestamp: new Date(Date.now() - 30000),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('hi');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses: Record<string, { content: string; actionCard?: Message['actionCard'] }> = {
    'hai': {
      content: 'Namaste! Main RegulaAI Assistant hoon. Aap mujhse GST, EPF, ya kisi bhi compliance savaal pooch sakte ho. Aapki kitni filings pending hain?',
      actionCard: { title: 'View All Pending', link: '/app/obligations' },
    },
    'hello': {
      content: 'Hello! I\'m your RegulaAI Assistant. You can ask me about GST, EPF, or any compliance questions. You have 3 filings due this week.',
      actionCard: { title: 'View All Pending', link: '/app/obligations' },
    },
    'gstr': {
      content: 'GSTR-3B kaafi important hai. Agar aap miss karte ho, toh ₹50/day late fee lagta hai. Main check kar raha hoon... aapka GSTR-3B July 20 tak file karna hai.',
      actionCard: { title: 'File GSTR-3B Now', due: 'July 20', amount: '₹8,300', link: '/app/filing' },
    },
    'epf': {
      content: 'EPF June ka contribution July 15 tak file karna hai. Agar delay hoti hai, toh 1% interest per month lagta hai. Shall I prepare the challan?',
      actionCard: { title: 'Generate EPF Challan', due: 'July 15' },
    },
    'penalty': {
      content: 'Currently aap pe ek overdue filing hai: GSTR-3B June 2025. Ispe ₹600 late fee already accumulate ho chuka hai. Har din ₹50 badhta hai.',
      actionCard: { title: 'Pay Penalty & File', amount: '₹600+', link: '/app/filing' },
    },
    'deadline': {
      content: 'Aapki upcoming deadlines:\n• GSTR-1: July 11 (2 days)\n• GSTR-3B: July 20\n• EPF: July 15',
      actionCard: { title: 'View Calendar', link: '/app/obligations' },
    },
    'help': {
      content: 'Main aapko ye karne mein madad kar sakta hoon:\n• GST filing status check\n• Deadline reminders\n• Penalty calculation\n• Filing agent open karna\n• Circular analysis\n\nKya help chahiye?',
    },
    'filing': {
      content: 'Filing Agent mein jaata hoon. Wahan se aap apni returns pre-filled karwa sakte ho aur ek click mein submit kar sakte ho.',
      actionCard: { title: 'Open Filing Agent', link: '/app/filing' },
    },
    'analysis': {
      content: 'Circular Analyzer mein aap kisi bhi government circular ka URL ya text paste kar sakte ho. Hamare AI agents extract karnege ki aap kya karna hai.',
      actionCard: { title: 'Open Circular Analyzer', link: '/app/analyzer' },
    },
    'radar': {
      content: 'Compliance Radar se aap future regulatory changes predict kar sakte ho. Is month 2 big changes expected hain textile sector mein.',
      actionCard: { title: 'Open Compliance Radar', link: '/app/radar' },
    },
  };

  const getAIResponse = (text: string): { content: string; actionCard?: Message['actionCard'] } => {
    const lowerText = text.toLowerCase();

    // Check for keywords
    if (lowerText.includes('gstr') || lowerText.includes('gst')) {
      return aiResponses['gstr'];
    }
    if (lowerText.includes('epf') || lowerText.includes('pf') || lowerText.includes('epfo')) {
      return aiResponses['epf'];
    }
    if (lowerText.includes('penalty') || lowerText.includes('fine') || lowerText.includes('late fee')) {
      return aiResponses['penalty'];
    }
    if (lowerText.includes('deadline') || lowerText.includes('due') || lowerText.includes('date')) {
      return aiResponses['deadline'];
    }
    if (lowerText.includes('help') || lowerText.includes('madad')) {
      return aiResponses['help'];
    }
    if (lowerText.includes('file') || lowerText.includes('submit')) {
      return aiResponses['filing'];
    }
    if (lowerText.includes('circular') || lowerText.includes('analysis')) {
      return aiResponses['analysis'];
    }
    if (lowerText.includes('radar') || lowerText.includes('predict')) {
      return aiResponses['radar'];
    }
    if (lowerText.includes('hai') || lowerText.includes('hindi')) {
      return aiResponses['hai'];
    }
    if (lowerText.includes('hello') || lowerText.includes('hi ')) {
      return aiResponses['hello'];
    }

    // Default response
    return {
      content: language === 'hi'
        ? 'Main samajh gaya. Aap kya karna chahte ho? Main aapki compliance savaalon ka jawab de sakta hoon aur filing mein madad kar sakta hoon.'
        : 'I understand. What would you like to do? I can help with compliance questions and filing.',
    };
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      isVoice: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(inputText);
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        isVoice: false,
        hasActionCard: !!response.actionCard,
        actionCard: response.actionCard,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);

        const voiceMessage: Message = {
          id: Date.now(),
          type: 'user',
          content: 'Voice Note [0:03]',
          isVoice: true,
          voiceDuration: '0:03',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, voiceMessage]);
        setIsTyping(true);

        setTimeout(() => {
          const response = aiResponses['gstr'];
          const aiMessage: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: response.content,
            isVoice: true,
            voiceDuration: '0:15',
            hasActionCard: true,
            actionCard: response.actionCard,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
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
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
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
                        <span className="text-sm opacity-90">{message.voiceDuration}</span>
                      </div>
                      <button className="ml-2 opacity-70 hover:opacity-100">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-current border-b-4 border-b-transparent ml-0.5" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  )}
                </div>

                {message.hasActionCard && message.actionCard && (
                  <div className={`mt-2 bg-white border border-border rounded-lg p-3 shadow-sm ${
                    message.type === 'user' ? 'bg-primary/5 border-primary/20' : ''
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

                <div className={`text-xs text-text-tertiary mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border rounded-2xl px-4 py-3 rounded-bl-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-text-tertiary rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-text-tertiary rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-text-tertiary rounded-full typing-dot" />
                  <span className="text-xs text-text-tertiary ml-2">RegulaAI is typing...</span>
                </div>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing-dot {
          animation: typing 1.4s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default Voice;
