import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Download, CheckCircle, Globe, Filter, Search, Calendar, AlertTriangle, Clock, ChevronDown, ChevronUp, X } from 'lucide-react';
import { mockObligations } from '../../data/mockData';

const Obligations = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'penalty' | 'type'>('date');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredObligations = mockObligations
    .filter(obligation => {
      const matchesFilter = filter === 'All' || obligation.type === filter;
      const matchesSearch = obligation.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'penalty') return a.daysRemaining - b.daysRemaining;
      return a.type.localeCompare(b.type);
    });

  const getStatusBadge = (status: string, days: number) => {
    if (status === 'completed' || completed.includes(showCompleteModal || '')) {
      return { bg: 'bg-accent-green/10', text: 'text-accent-green', label: 'Completed' };
    }
    if (days <= 0) return { bg: 'bg-accent-red/10', text: 'text-accent-red', label: 'Overdue' };
    if (days <= 7) return { bg: 'bg-accent-amber/10', text: 'text-accent-amber', label: 'Due Soon' };
    return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending' };
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      GST: 'bg-primary/10 text-primary',
      EPFO: 'bg-purple-100 text-purple-600',
      ESI: 'bg-orange-100 text-orange-600',
      MCA: 'bg-green-100 text-green-700',
      'Professional Tax': 'bg-cyan-100 text-cyan-600',
      'Income Tax': 'bg-emerald-100 text-emerald-600',
      FSSAI: 'bg-pink-100 text-pink-600',
      Udyam: 'bg-indigo-100 text-indigo-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const markComplete = (id: string) => {
    setCompleted(prev => [...prev, id]);
    setShowCompleteModal(null);
  };

  const handleFile = (id: string) => {
    navigate('/app/filing');
  };

  const isCompleted = (id: string) => completed.includes(id) || mockObligations.find(o => o.id === id)?.status === 'completed';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">My Obligations</h1>
        <p className="text-text-secondary mt-1">Track and manage all your compliance obligations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card shadow-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'GST', 'EPFO', 'ESI', 'MCA', 'Professional Tax', 'Income Tax', 'FSSAI'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-3 ml-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date' | 'penalty' | 'type')}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
            >
              <option value="date">Sort by: Due Date</option>
              <option value="penalty">Sort by: Urgency</option>
              <option value="type">Sort by: Type</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search obligations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-text-primary">{mockObligations.length}</div>
          <div className="text-sm text-text-tertiary">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-amber">{mockObligations.filter(o => o.status === 'due_soon').length}</div>
          <div className="text-sm text-text-tertiary">Due This Week</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-red">{mockObligations.filter(o => o.status === 'overdue').length}</div>
          <div className="text-sm text-text-tertiary">Overdue</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent-green">{mockObligations.filter(o => o.status === 'completed').length + completed.length}</div>
          <div className="text-sm text-text-tertiary">Completed</div>
        </div>
      </div>

      {/* Obligations List */}
      <div className="space-y-4">
        {filteredObligations.map(obligation => {
          const badge = getStatusBadge(obligation.status, obligation.daysRemaining);
          const isExpanded = expandedId === obligation.id;
          const done = isCompleted(obligation.id);

          return (
            <div
              key={obligation.id}
              className={`bg-white rounded-card shadow-card overflow-hidden transition ${
                done ? 'opacity-75' : ''
              }`}
            >
              <div
                className="p-5 cursor-pointer hover:bg-surface/50"
                onClick={() => setExpandedId(isExpanded ? null : obligation.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      done ? 'bg-accent-green' :
                      obligation.status === 'overdue' ? 'bg-accent-red' :
                      obligation.status === 'due_soon' ? 'bg-accent-amber' :
                      'bg-accent-green'
                    }`} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-semibold ${done ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
                          {obligation.name}
                        </h3>
                        <span className={`${badge.bg} ${badge.text} px-2 py-0.5 rounded text-xs font-medium`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                        <span className={getTypeColor(obligation.type)}>{obligation.type}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(obligation.dueDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {obligation.daysRemaining <= 0 ? (
                          <span className="text-accent-red font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {Math.abs(obligation.daysRemaining)} days overdue
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {obligation.daysRemaining} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-text-tertiary" /> : <ChevronDown className="w-5 h-5 text-text-tertiary" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-border animate-fadeIn">
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-text-tertiary">Penalty: </span>
                        <span className="text-accent-red font-medium">{obligation.penalty}</span>
                      </div>
                      <div>
                        <span className="text-text-tertiary">Reference: </span>
                        <span className="text-text-primary">{obligation.regulationRef}</span>
                      </div>
                      <div>
                        <span className="text-text-tertiary">Required Documents:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {obligation.requiredDocs.map((doc, i) => (
                            <span key={i} className="px-2 py-0.5 bg-surface text-text-secondary text-xs rounded">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {!done && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleFile(obligation.id); }}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2"
                          >
                            <Globe className="w-4 h-4" /> File Now
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowCompleteModal(obligation.id); }}
                            className="px-4 py-2 bg-accent-green text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Mark Complete
                          </button>
                        </>
                      )}
                      <button
                        disabled
                        className="px-4 py-2 bg-surface text-text-secondary rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" /> Download Draft
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredObligations.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          No obligations found matching your criteria
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Mark as Complete?</h3>
                <p className="text-sm text-text-secondary">This will update your compliance status.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(null)}
                className="flex-1 px-4 py-2 bg-surface text-text-secondary rounded-lg font-medium hover:bg-border transition"
              >
                Cancel
              </button>
              <button
                onClick={() => markComplete(showCompleteModal)}
                className="flex-1 px-4 py-2 bg-accent-green text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Obligations;
