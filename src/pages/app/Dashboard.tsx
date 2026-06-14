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
  Loader2,
} from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { mockObligations, mockActivities } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPenalty, setCurrentPenalty] = useState(600);
  const [healthScore, setHealthScore] = useState(78);
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);
  const [activities, setActivities] = useState(mockActivities);

  useEffect(() => {
    // Animate penalty counter
    const interval = setInterval(() => {
      setCurrentPenalty(prev => {
        const newVal = prev + Math.floor(Math.random() * 20) + 10;
        if (newVal % 200 < 50) {
          setShowPenaltyWarning(true);
          setTimeout(() => setShowPenaltyWarning(false), 3000);
        }
        return newVal;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Health score based on obligations
    const overdue = mockObligations.filter(o => o.status === 'overdue').length;
    const dueSoon = mockObligations.filter(o => o.status === 'due_soon').length;
    const total = mockObligations.length;
    const score = Math.max(0, Math.min(100, 100 - (overdue * 20) - (dueSoon * 5)));
    setHealthScore(score);
  }, []);

  const pending = mockObligations.filter(o => o.status === 'pending' || o.status === 'due_soon');
  const dueSoon = mockObligations.filter(o => o.status === 'due_soon');
  const overdue = mockObligations.filter(o => o.status === 'overdue');
  const completed = mockObligations.filter(o => o.status === 'completed');

  const complianceData = [
    { name: 'Compliant', value: completed.length, color: '#16A34A' },
    { name: 'Pending', value: pending.length, color: '#EF9F27' },
    { name: 'Overdue', value: overdue.length, color: '#E24B4A' },
  ];

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

  const handleTakeAction = (obligationId: string) => {
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
          {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here's your compliance status for {user?.businessName || 'Demo Business'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-card shadow-card p-5 hover:shadow-card-hover transition cursor-pointer group" onClick={() => handleQuickAction('obligations')}>
          <div className="flex items-center justify-between mb-3">
            <ClipboardList className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <Link to="/app/obligations" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="text-3xl font-bold text-text-primary">{mockObligations.length}</div>
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
            {mockObligations.slice(0, 6).map(obligation => (
              <div
                key={obligation.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition cursor-pointer"
                onClick={() => handleTakeAction(obligation.id)}
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
                    onClick={(e) => { e.stopPropagation(); handleTakeAction(obligation.id); }}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20 transition"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
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
              <div className="text-4xl font-bold text-accent-red">
                ₹{currentPenalty.toLocaleString()}
              </div>
              <div className="text-xs text-white/60 mt-1">Current Penalty (ticking up)</div>
            </div>
            <div className="text-sm text-center text-white/70 mb-4">
              Filing NOW saves ₹1,400 vs waiting 28 more days
            </div>
            <Link
              to="/app/filing"
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

      {/* Recent Activity */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-semibold text-text-primary mb-4">Recent Activity</h2>
        <div className="relative">
          <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border" />
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="relative flex items-start gap-4 pl-8">
                <div
                  className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    activity.status === 'success'
                      ? 'bg-accent-green text-white'
                      : activity.status === 'warning'
                      ? 'bg-accent-amber text-navy'
                      : 'bg-primary text-white'
                  }`}
                >
                  {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                  {activity.status === 'warning' && <Clock className="w-4 h-4" />}
                  {activity.status === 'info' && <TrendingUp className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">{activity.action}</span>
                    <span className="text-xs text-text-tertiary">{activity.time}</span>
                  </div>
                  <div className="text-sm text-text-secondary">{activity.details}</div>
                </div>
              </div>
            ))}
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
      `}</style>
    </div>
  );
};

export default Dashboard;
