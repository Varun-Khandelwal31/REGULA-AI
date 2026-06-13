import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  TrendingUp,
  Zap,
  Calendar,
  X,
} from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mockObligations } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [penalty, setPenalty] = useState(600);
  const [healthScore, setHealthScore] = useState(78);
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);

  // Read onboarding user data
  const userData = JSON.parse(localStorage.getItem('regulaai_user') || '{}');
  const name = userData.fullName || userData.name || 'User';
  const businessName = userData.businessName || 'Demo Business';
  const sector = userData.industry || userData.sector || 'default';
  const state = userData.state || 'All India';

  const [showWelcome, setShowWelcome] = useState(
    localStorage.getItem('regulaai_onboarding_complete') === 'true' &&
    !localStorage.getItem('regulaai_welcome_dismissed')
  );

  const handleDismissWelcome = () => {
    localStorage.setItem('regulaai_welcome_dismissed', 'true');
    setShowWelcome(false);
  };

  // Sector based obligations filter
  const sectorObligations = {
    'Textile': ['GSTR-1', 'GSTR-3B', 'EPF Challan', 'ESI Contribution', 'HSN Report', 'GSTR-9'],
    'Food & Beverage': ['GSTR-1', 'GSTR-3B', 'FSSAI Renewal', 'EPF Challan', 'ESI', 'Shop License Renewal'],
    'IT Services': ['GSTR-1', 'GSTR-3B', 'TDS Return', 'Advance Tax', 'Professional Tax', 'MCA Annual Return'],
    'default': ['GSTR-1', 'GSTR-3B', 'EPF Challan', 'ESI Contribution', 'Professional Tax', 'MCA Annual Return']
  };

  const sectorList = sectorObligations[sector as keyof typeof sectorObligations] || sectorObligations['default'];

  const matchObligation = (obName: string, obType: string) => {
    const nameLower = obName.toLowerCase();
    const typeLower = obType.toLowerCase();
    return sectorList.some(term => {
      const termLower = term.toLowerCase();
      if (termLower === 'gstr-1') return nameLower.includes('gstr-1');
      if (termLower === 'gstr-3b') return nameLower.includes('gstr-3b');
      if (termLower === 'gstr-9') return nameLower.includes('gstr-9');
      if (termLower === 'epf challan') return nameLower.includes('epf') || typeLower.includes('epfo');
      if (termLower === 'esi contribution' || termLower === 'esi') return nameLower.includes('esi') || typeLower.includes('esi');
      if (termLower === 'fssai renewal') return nameLower.includes('fssai') || typeLower.includes('fssai');
      if (termLower === 'shop license renewal') return nameLower.includes('shop') || nameLower.includes('license');
      if (termLower === 'tds return') return nameLower.includes('tds') || typeLower.includes('income tax');
      if (termLower === 'advance tax') return nameLower.includes('advance') || typeLower.includes('income tax');
      if (termLower === 'professional tax') return nameLower.includes('professional') || typeLower.includes('professional');
      if (termLower === 'mca annual return') return nameLower.includes('mca') || typeLower.includes('mca');
      if (termLower === 'hsn report') return nameLower.includes('hsn') || nameLower.includes('gstr-1');
      return nameLower.includes(termLower) || typeLower.includes(termLower);
    });
  };

  const displayObligations = mockObligations.filter(o => matchObligation(o.name, o.type));

  const pending = displayObligations.filter(o => o.status === 'pending' || o.status === 'due_soon');
  const dueSoon = displayObligations.filter(o => o.status === 'due_soon');
  const overdue = displayObligations.filter(o => o.status === 'overdue');
  const completed = displayObligations.filter(o => o.status === 'completed');

  const complianceData = [
    { name: 'Compliant', value: completed.length, color: '#16A34A' },
    { name: 'Pending', value: pending.length, color: '#EF9F27' },
    { name: 'Overdue', value: overdue.length, color: '#E24B4A' },
  ];

  // Penalty ticking up by 50 every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setPenalty(prev => {
        const newVal = prev + 50;
        if (newVal % 200 === 0) {
          setShowPenaltyWarning(true);
          setTimeout(() => setShowPenaltyWarning(false), 3000);
        }
        return newVal;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Health score based on display obligations
    const total = displayObligations.length;
    if (total === 0) {
      setHealthScore(100);
      return;
    }
    const score = Math.max(0, Math.min(100, 100 - (overdue.length * 20) - (dueSoon.length * 5)));
    setHealthScore(score);
  }, [displayObligations, overdue.length, dueSoon.length]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 0) return 'bg-accent-red text-white';
    if (days <= 7) return 'bg-accent-amber text-navy';
    return 'bg-accent-green text-white';
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-accent-green';
    if (score >= 50) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const handleTakeAction = () => {
    navigate('/app/filing');
  };

  const handleQuickAction = (type: string) => {
    switch (type) {
      case 'analyzer':
        navigate('/app/analyzer');
        break;
      case 'filing':
        navigate('/app/filing');
        break;
      case 'obligations':
        navigate('/app/obligations');
        break;
      case 'radar':
        navigate('/app/radar');
        break;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-primary/10 border border-primary/20 rounded-card p-5 flex items-center justify-between animate-fadeIn">
          <div>
            <h4 className="font-semibold text-primary">🎉 Welcome to RegulaAI, {businessName}!</h4>
            <p className="text-sm text-text-secondary mt-1">Your compliance dashboard is ready.</p>
          </div>
          <button onClick={handleDismissWelcome} className="text-text-tertiary hover:text-text-primary transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Penalty Warning Toast */}
      {showPenaltyWarning && (
        <div className="fixed top-20 right-6 z-50 bg-accent-red text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-5 h-5" />
          Penalty increasing! File now to stop.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {getGreeting()}, {name} 👋
        </h1>
        <p className="text-text-secondary mt-1">
          Here's your compliance status for <strong className="text-text-primary">{businessName}</strong> · <span className="text-xs px-2 py-0.5 bg-surface border rounded text-text-secondary">{sector} · {state}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-card shadow-card p-5 hover:shadow-card-hover transition cursor-pointer group" onClick={() => handleQuickAction('obligations')}>
          <div className="flex items-center justify-between mb-3">
            <ClipboardList className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <Link to="/app/obligations" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="text-3xl font-bold text-text-primary">{displayObligations.length}</div>
          <div className="text-sm text-text-secondary mt-1">Total Obligations</div>
          <div className="text-xs text-text-tertiary mt-1">across all registrations</div>
        </div>

        <div className="bg-white rounded-card shadow-card p-5 hover:shadow-card-hover transition cursor-pointer group animate-pulse-border" onClick={() => handleQuickAction('filing')}>
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-5 h-5 text-accent-amber group-hover:scale-110 transition-transform" />
            <Link to="/app/filing" className="text-xs text-accent-amber hover:underline">File now</Link>
          </div>
          <div className="text-3xl font-bold text-accent-amber">{dueSoon.length}</div>
          <div className="text-sm text-text-secondary mt-1">Due This Week</div>
          <div className="text-xs text-text-tertiary mt-1">action required</div>
        </div>

        <div className="bg-white rounded-card shadow-card p-5 hover:shadow-card-hover transition cursor-pointer group" onClick={() => handleQuickAction('filing')}>
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-5 h-5 text-accent-red group-hover:scale-110 transition-transform animate-pulse" />
            <Link to="/app/filing" className="text-xs text-accent-red hover:underline">Urgent</Link>
          </div>
          <div className="text-3xl font-bold text-accent-red">{overdue.length}</div>
          <div className="text-sm text-text-secondary mt-1">Overdue</div>
          <div className="text-xs text-text-tertiary mt-1">penalty accumulating</div>
        </div>

        <div className="bg-white rounded-card shadow-card p-5 hover:shadow-card-hover transition group">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-5 h-5 text-accent-green group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold text-accent-green">{completed.length}</div>
          <div className="text-sm text-text-secondary mt-1">Completed</div>
          <div className="text-xs text-text-tertiary mt-1">this quarter</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-card shadow-card p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleQuickAction('filing')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Quick File
          </button>
          <button
            onClick={() => handleQuickAction('analyzer')}
            className="px-4 py-2 bg-surface text-text-secondary rounded-lg text-sm font-medium hover:bg-border transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Analyze Circular
          </button>
          <button
            onClick={() => handleQuickAction('radar')}
            className="px-4 py-2 bg-surface text-text-secondary rounded-lg text-sm font-medium hover:bg-border transition flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" /> Check Radar
          </button>
          <button
            onClick={() => handleQuickAction('obligations')}
            className="px-4 py-2 bg-surface text-text-secondary rounded-lg text-sm font-medium hover:bg-border transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> View Calendar
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming Obligations */}
        <div className="lg:col-span-3 bg-white rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Upcoming Obligations</h2>
            <Link to="/app/obligations" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {displayObligations.slice(0, 6).map(obligation => (
              <div
                key={obligation.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition cursor-pointer"
                onClick={handleTakeAction}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      obligation.status === 'overdue'
                        ? 'bg-accent-red'
                        : obligation.status === 'due_soon'
                        ? 'bg-accent-amber'
                        : 'bg-accent-green'
                    }`}
                  />
                  <div>
                    <div className="font-medium text-text-primary">{obligation.name}</div>
                    <div className="text-sm text-text-tertiary">
                      Due {new Date(obligation.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {' '}• {obligation.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDaysRemainingColor(obligation.daysRemaining)}`}>
                    {obligation.daysRemaining <= 0
                      ? `${Math.abs(obligation.daysRemaining)}d overdue`
                      : `${obligation.daysRemaining}d`}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTakeAction(); }}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20 transition"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
            {displayObligations.length === 0 && (
              <div className="text-center text-text-tertiary py-8">
                No active obligations found for sector {sector}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Penalty Clock */}
          <div className="bg-navy rounded-card p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-accent-red" />
              <h3 className="font-semibold">Live Penalty Clock</h3>
            </div>
            <div className="mb-4">
              <div className="text-sm text-white/70">Obligation: GSTR-3B — June 2025</div>
              <div className="text-xs text-white/50">Overdue by 12 days</div>
            </div>
            <div className="text-center py-4">
              <div key={penalty} className="text-4xl font-bold text-accent-red animate-flashRed">
                ₹{penalty.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-white/60 mt-1">Current Penalty (ticking up)</div>
            </div>
            <div className="text-sm text-center text-white/70 mb-4">
              Filing NOW saves ₹{(penalty + 1400).toLocaleString('en-IN')} vs waiting 28 more days
            </div>
            <Link
              to="/app/filing"
              onClick={() => addToast('Opening Filing Agent...', 'info')}
              className="block w-full py-3 bg-accent-red hover:bg-red-600 text-white font-medium rounded-lg text-center transition"
            >
              File Now
            </Link>
          </div>

          {/* Compliance Health */}
          <div className="bg-white rounded-card shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Compliance Health</h3>
              <span className={`text-lg font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4 space-y-2">
                {complianceData.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-text-secondary">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/app/obligations"
              className="block text-center text-primary text-sm hover:underline"
            >
              View all obligations →
            </Link>
          </div>
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
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(239, 159, 39, 0.2); }
        }
        .animate-pulse-border {
          animation: pulseBorder 2s ease-in-out infinite;
        }
        @keyframes flashRed { 
          0% { color: #E24B4A; transform: scale(1.05); }
          100% { color: #E24B4A; transform: scale(1); } 
        }
        .animate-flashRed {
          animation: flashRed 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
