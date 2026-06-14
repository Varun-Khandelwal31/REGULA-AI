import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Scale, Zap, FileText, Download, Plus, ChevronDown, ChevronUp, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AnalysisResult {
  obligation: string;
  applicableTo: string;
  deadline: string;
  penalty: string;
  action: string;
  confidence: number;
  agentA: number;
  agentB: number;
  judgeScore: number;
}

interface HistoryItem {
  id: number;
  date: string;
  obligation: string;
  confidence: number;
  source: string;
}

const Analyzer = () => {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [addedToObligations, setAddedToObligations] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, date: '2025-07-08', obligation: 'GSTR-9 Annual Return', confidence: 94, source: 'gst.gov.in/circular/123' },
    { id: 2, date: '2025-07-05', obligation: 'EPF Contribution Rules', confidence: 87, source: 'epfindia.gov.in' },
    { id: 3, date: '2025-06-28', obligation: 'E-invoicing Mandate', confidence: 91, source: 'cbic.gov.in' },
  ]);

  const simulateAnalysis = async () => {
    if (!inputValue.trim()) return;

    setIsAnalyzing(true);
    setStep(-1);
    setShowResult(false);
    setAddedToObligations(false);

    // Step 1: Intake
    await new Promise(r => setTimeout(r, 500));
    setStep(0);
    await new Promise(r => setTimeout(r, 1000));

    // Step 2: Debate
    setStep(1);
    await new Promise(r => setTimeout(r, 1200));

    // Step 3: Judge
    setStep(2);
    await new Promise(r => setTimeout(r, 1000));

    setIsAnalyzing(false);
    setShowResult(true);
    setStep(3);

    // Generate result
    setResult({
      obligation: 'GSTR-9 Annual Return FY 2024-25',
      applicableTo: 'GST registered (turnover &gt; ₹2Cr)',
      deadline: 'December 31, 2025',
      penalty: '₹200/day (max 0.25% of turnover)',
      action: 'File consolidated annual GST return through GST portal',
      confidence: 94,
      agentA: 96,
      agentB: 91,
      judgeScore: 94,
    });
  };

  const addToObligations = () => {
    if (!result) return;
    setAddedToObligations(true);

    // Add to history
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      obligation: result.obligation,
      confidence: result.confidence,
      source: activeTab === 'url' ? inputValue : 'Pasted text',
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const getStepStatus = (stepIndex: number) => {
    if (step > stepIndex) return 'completed';
    if (step === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Regulatory Circular Analyzer</h1>
        <p className="text-text-secondary mt-1">
          Paste any government circular URL or text — our agents will extract your obligations instantly
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'url'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-border'
            }`}
          >
            <Globe className="w-4 h-4" /> Paste URL
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'text'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-border'
            }`}
          >
            <FileText className="w-4 h-4" /> Paste Text
          </button>
        </div>

        {activeTab === 'url' ? (
          <div className="flex gap-4">
            <input
              type="url"
              placeholder="https://www.gst.gov.in/circular/..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <button
              onClick={simulateAnalysis}
              disabled={isAnalyzing || !inputValue.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Analyze <Search className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              placeholder="Paste the circular content here... (e.g., GST Circular, MCA Notification, EPF Guidelines)"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={simulateAnalysis}
                disabled={isAnalyzing || !inputValue.trim()}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    Analyze <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Processing */}
      {isAnalyzing && (
        <div className="bg-white rounded-card shadow-card p-6">
          <h3 className="font-medium text-text-primary mb-4">Agent Processing</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: 'Intake Agent', desc: 'Fetching circular...' },
              { icon: Scale, label: 'Debate Agents', desc: 'Interpreting regulation...' },
              { icon: Zap, label: 'Judge Agent', desc: 'Resolving interpretation...' },
            ].map((agent, i) => {
              const status = getStepStatus(i);
              return (
                <div key={i} className="flex items-center gap-3 p-4 bg-surface rounded-lg">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      status === 'completed'
                        ? 'bg-accent-green text-white'
                        : status === 'active'
                        ? 'bg-primary text-white animate-pulse'
                        : 'bg-border text-text-tertiary'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : status === 'active' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <agent.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{agent.label}</div>
                    <div className={`text-sm ${status === 'completed' ? 'text-accent-green' : status === 'active' ? 'text-primary' : 'text-text-tertiary'}`}>
                      {status === 'completed' ? 'Done' : status === 'active' ? agent.desc : 'Waiting...'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && result && (
        <div className="bg-white rounded-card shadow-card overflow-hidden border-t-4 border-accent-green animate-fadeIn">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-6 h-6 text-accent-green" />
              <h3 className="font-semibold text-text-primary text-lg">Circular Analysis Complete</h3>
            </div>

            <div className="bg-surface rounded-lg p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-tertiary">Obligation</div>
                  <div className="font-medium text-text-primary">{result.obligation}</div>
                </div>
                <div>
                  <div className="text-sm text-text-tertiary">Applicable To</div>
                  <div className="font-medium text-text-primary">{result.applicableTo}</div>
                </div>
                <div>
                  <div className="text-sm text-text-tertiary">Deadline</div>
                  <div className="font-medium text-text-primary">{result.deadline}</div>
                </div>
                <div>
                  <div className="text-sm text-text-tertiary">Penalty</div>
                  <div className="font-medium text-accent-red">{result.penalty}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-text-tertiary">Action Required</div>
                <div className="font-medium text-text-primary">{result.action}</div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-text-tertiary mb-2">Confidence Score</div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-accent-green">{result.confidence}%</div>
                      <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent-green transition-all" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-tertiary">Agent Scores</div>
                    <div className="text-sm text-text-primary space-x-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Agent A: {result.agentA}%</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Agent B: {result.agentB}%</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Judge: {result.judgeScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Transcript */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-2 text-sm text-primary font-medium mt-4 hover:underline"
            >
              {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Agent Debate Transcript
            </button>

            {showTranscript && (
              <div className="mt-4 space-y-3 text-sm animate-fadeIn">
                <div className="p-3 bg-blue-50 border-l-4 border-primary rounded">
                  <div className="font-medium text-primary mb-1">Agent A</div>
                  <p className="text-text-secondary">
                    "This circular mandates filing for ALL registered taxpayers under Section 44 of the CGST Act. The language 'all registered persons' is unequivocal and applies universally regardless of turnover."
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-600 rounded">
                  <div className="font-medium text-purple-600 mb-1">Agent B</div>
                  <p className="text-text-secondary">
                    "Objection. Section 44(1) explicitly limits the scope to taxpayers with aggregate turnover exceeding ₹2 Crores. The phrase 'all registered persons' must be read in context of the section proviso."
                  </p>
                </div>
                <div className="p-3 bg-accent-green/10 border-l-4 border-accent-green rounded">
                  <div className="font-medium text-accent-green mb-1">Judge Agent</div>
                  <p className="text-text-secondary">
                    "Agent B's interpretation is correct. Per Section 44(1) proviso and Circular 142/10/2021, the threshold applies. Final ruling: Applies to taxpayers with turnover &gt; ₹2Cr only. Confidence: 94%"
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={addToObligations}
                disabled={addedToObligations}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  addedToObligations
                    ? 'bg-accent-green/20 text-accent-green cursor-default'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {addedToObligations ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Obligations
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add to My Obligations
                  </>
                )}
              </button>
              <button className="px-4 py-2 bg-surface text-text-secondary rounded-lg font-medium hover:bg-border transition flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Analysis PDF
              </button>
              <Link
                to="/app/filing"
                className="px-4 py-2 bg-accent-green text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> Start Filing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h3 className="font-semibold text-text-primary mb-4">Recent Analyses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Obligation</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Confidence</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Source</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-border hover:bg-surface transition">
                  <td className="py-3 text-sm text-text-secondary">{item.date}</td>
                  <td className="py-3 text-sm font-medium text-text-primary">{item.obligation}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-accent-green/10 text-accent-green rounded text-sm font-medium">
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="py-3 text-sm text-text-tertiary truncate max-w-xs">{item.source}</td>
                  <td className="py-3">
                    <button className="text-primary text-sm hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      `}</style>
    </div>
  );
};

export default Analyzer;
