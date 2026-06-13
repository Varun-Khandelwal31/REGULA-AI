import { useState } from 'react';
import { TrendingUp, Bell, Check, ExternalLink, Loader2, Info, Calendar } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Prediction {
  id: number;
  probability: number;
  title: string;
  expectedDate: string;
  sources: string[];
  impact: 'low' | 'medium' | 'high';
  details: string;
  reminded: boolean;
}

const Radar = () => {
  const { addToast } = useToast();
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: 1,
      probability: 74,
      title: 'New MSME Registration portal mandatory for turnover >₹40L',
      expectedDate: 'August 2025',
      sources: ['Union Budget speech analysis', 'MCA press release'],
      impact: 'medium',
      details: 'Udyam registration window transitioning to new portal with enhanced verification requirements.',
      reminded: false,
    },
    {
      id: 2,
      probability: 61,
      title: 'GST rate revision for textile sector',
      expectedDate: 'September 2025',
      sources: ['Parliamentary standing committee report'],
      impact: 'high',
      details: '5% GST slab may be discontinued for textile sector. Items may move to 12% bracket.',
      reminded: false,
    },
    {
      id: 3,
      probability: 55,
      title: 'EPF wage ceiling revision from ₹15,000 to ₹21,000',
      expectedDate: 'December 2025',
      sources: ['Labour Ministry circular draft'],
      impact: 'medium',
      details: 'More employees will come under EPF coverage. Employer contribution will increase.',
      reminded: false,
    },
    {
      id: 4,
      probability: 42,
      title: 'New e-invoicing threshold reduced to ₹1Cr turnover',
      expectedDate: 'October 2025',
      sources: ['CBIC internal proposal'],
      impact: 'high',
      details: 'Currently ₹5Cr threshold. Businesses below ₹5Cr but above ₹1Cr will need e-invoicing.',
      reminded: false,
    },
    {
      id: 5,
      probability: 38,
      title: 'FSSAI license mandatory for small food vendors',
      expectedDate: 'March 2026',
      sources: ['FSSAI consultation paper'],
      impact: 'low',
      details: 'Proposal to bring street food vendors under simplified registration.',
      reminded: false,
    },
  ]);

  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [settingReminder, setSettingReminder] = useState<number | null>(null);

  const setReminder = (id: number) => {
    setSettingReminder(id);
    setTimeout(() => {
      setPredictions(prev => prev.map(p => p.id === id ? { ...p, reminded: true } : p));
      setSettingReminder(null);
      addToast('Reminder set successfully', 'success');
    }, 1000);
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-accent-green';
    if (prob >= 50) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    const colors = {
      high: 'bg-accent-red/20 text-accent-red',
      medium: 'bg-accent-amber/20 text-accent-amber',
      low: 'bg-white/10 text-white/70',
    };
    return colors[impact];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-navy p-6 rounded-card">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-white">Compliance Radar</h1>
        </div>
        <p className="text-white/70">
          Predicted regulatory changes — know before they happen
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-text-primary">{predictions.length}</div>
          <div className="text-sm text-text-tertiary">Predictions Tracked</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-red">{predictions.filter(p => p.impact === 'high').length}</div>
          <div className="text-sm text-text-tertiary">High Impact</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-green">{predictions.filter(p => p.probability >= 70).length}</div>
          <div className="text-sm text-text-tertiary">High Confidence</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-primary">{predictions.filter(p => p.reminded).length}</div>
          <div className="text-sm text-text-tertiary">Reminders Set</div>
        </div>
      </div>

      {/* 90 Day Forecast */}
      <div className="bg-navy rounded-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Next 90 Days Forecast</h2>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar className="w-4 h-4" />
            Updated 2 hours ago
          </div>
        </div>

        <div className="space-y-4">
          {predictions.map(prediction => (
            <div
              key={prediction.id}
              className={`relative bg-navy-dark border rounded-lg p-5 transition cursor-pointer ${
                selectedPrediction?.id === prediction.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setSelectedPrediction(selectedPrediction?.id === prediction.id ? null : prediction)}
            >
              <div className="flex items-start gap-4">
                {/* Probability indicator */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-2xl">
                    {prediction.probability >= 70 ? '🔮' : prediction.probability >= 50 ? '🎯' : '💭'}
                  </div>
                  <div className={`text-lg font-bold ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}%
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        prediction.probability >= 70
                          ? 'bg-accent-green/20 text-accent-green'
                          : prediction.probability >= 50
                          ? 'bg-accent-amber/20 text-accent-amber'
                          : 'bg-accent-red/20 text-accent-red'
                      }`}
                    >
                      {prediction.probability >= 70 ? 'HIGH' : prediction.probability >= 50 ? 'MEDIUM' : 'LOW'}
                    </span>
                    <span className="text-sm text-white/60">
                      Expected: {prediction.expectedDate}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getImpactColor(prediction.impact)}`}>
                      Impact: {prediction.impact.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-white font-medium mb-2">{prediction.title}</h3>

                  {/* Confidence bar */}
                  <div className="mt-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prediction.probability >= 70
                            ? 'bg-accent-green'
                            : prediction.probability >= 50
                            ? 'bg-accent-amber'
                            : 'bg-accent-red'
                        }`}
                        style={{ width: `${prediction.probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {prediction.sources.map((source, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {source}
                      </span>
                    ))}
                  </div>

                  {/* Expanded Details */}
                  {selectedPrediction?.id === prediction.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                      <p className="text-white/80 text-sm mb-4">{prediction.details}</p>

                      {/* Impact Analysis */}
                      <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <h4 className="text-white text-sm font-medium mb-2">Potential Impact on Your Business</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• May require process changes</li>
                          <li>• Potential compliance deadline</li>
                          <li>• Action needed within 30-60 days</li>
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReminder(prediction.id);
                          }}
                          disabled={prediction.reminded || settingReminder === prediction.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            prediction.reminded
                              ? 'bg-accent-green/20 text-accent-green cursor-default'
                              : 'bg-primary hover:bg-primary-dark text-white'
                          }`}
                        >
                          {settingReminder === prediction.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Setting...
                            </>
                          ) : prediction.reminded ? (
                            <>
                              <Check className="w-4 h-4" />
                              Reminder Set
                            </>
                          ) : (
                            <>
                              <Bell className="w-4 h-4" />
                              Set Reminder
                            </>
                          )}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition">
                          <ExternalLink className="w-4 h-4" />
                          View Sources
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminder badge */}
                {prediction.reminded && selectedPrediction?.id !== prediction.id && (
                  <div className="absolute top-4 right-4">
                    <Bell className="w-4 h-4 text-accent-green" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-navy rounded-card p-6">
        <h3 className="text-white font-medium mb-4">Data Sources Powering the Radar</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'PRS India Legislative Research',
            'Ministry of Finance',
            'Union Budget Archives',
            'Parliamentary Standing Committee Reports',
            'CBIC Circulars',
            'MCA Notifications',
            'Labour Ministry Circular Drafts',
          ].map((source, i) => (
            <div
              key={i}
              className="px-4 py-3 bg-navy-dark border border-white/10 rounded-lg text-sm text-white/70 flex items-center gap-2 hover:border-primary/50 transition"
            >
              <div className="w-2 h-2 bg-accent-green rounded-full" />
              {source}
            </div>
          ))}
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

export default Radar;
