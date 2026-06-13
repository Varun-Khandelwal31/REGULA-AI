import { useState } from 'react';
import { Globe, Check, Edit, X, CheckCircle, AlertTriangle, Clock, Loader2, FileText, RefreshCw } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface FilingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface FormData {
  taxLiability: number;
  itcClaimed: number;
  netPayable: number;
  lateFee: number;
  interest: number;
}

const Filing = () => {
  const { addToast } = useToast();
  const [selectedObligation, setSelectedObligation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [steps, setSteps] = useState<FilingStep[]>([
    { id: 0, title: 'Authenticate', description: 'Logging into GST Portal...', status: 'pending' },
    { id: 1, title: 'Fetch Data', description: 'Loading form data...', status: 'pending' },
    { id: 2, title: 'Auto-fill Form', description: 'Pre-filling return data...', status: 'pending' },
    { id: 3, title: 'Await Approval', description: 'Waiting for your review...', status: 'pending' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    taxLiability: 14500,
    itcClaimed: 6200,
    netPayable: 8300,
    lateFee: 600,
    interest: 0,
  });

  const obligations = [
    { id: '1', name: 'GSTR-3B July 2025', due: 'July 20, 2025', type: 'GST', penalty: '₹50/day', status: 'due_soon' },
    { id: '2', name: 'GSTR-1 July 2025', due: 'July 11, 2025', type: 'GST', penalty: '₹200/day', status: 'due_soon' },
    { id: '3', name: 'EPF June 2025', due: 'July 15, 2025', type: 'EPFO', penalty: '1%/month', status: 'overdue' },
    { id: '4', name: 'ESI June 2025', due: 'July 10, 2025', type: 'ESI', penalty: '₹12,750', status: 'overdue' },
    { id: '5', name: 'GSTR-3B June 2025', due: 'July 15, 2025', type: 'GST', penalty: '₹600', status: 'overdue' },
  ];

  const selectObligation = (id: string) => {
    setSelectedObligation(id);
    setCurrentStep(0);
    setIsSubmitted(false);
    setShowEditForm(false);
    setSteps([
      { id: 0, title: 'Authenticate', description: 'Logging into GST Portal...', status: 'pending' },
      { id: 1, title: 'Fetch Data', description: 'Loading form data...', status: 'pending' },
      { id: 2, title: 'Auto-fill Form', description: 'Pre-filling return data...', status: 'pending' },
      { id: 3, title: 'Await Approval', description: 'Waiting for your review...', status: 'pending' },
    ]);

    // Simulate authentication
    setTimeout(() => {
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'active' } : s));
      setTimeout(() => {
        setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'completed', description: 'Logged in as GSTIN: 22AAAAA0000A1Z5' } : i === 1 ? { ...s, status: 'active' } : s));
        setCurrentStep(1);

        // Simulate fetching data
        setTimeout(() => {
          setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'completed', description: 'Data loaded from GST portal' } : i === 2 ? { ...s, status: 'active' } : s));
          setCurrentStep(2);

          // Simulate form filling
          setTimeout(() => {
            setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'completed', description: 'Form pre-filled successfully' } : i === 3 ? { ...s, status: 'active' } : s));
            setCurrentStep(3);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 300);
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setConfirmationNumber(`GST-2025-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'completed', description: 'Submitted successfully!' } : s));
      setCurrentStep(4);
      addToast('Return filed successfully! ✓', 'success');
    }, 2000);
  };

  const handleReset = () => {
    setSelectedObligation(null);
    setIsSubmitted(false);
  };

  const selected = obligations.find(o => o.id === selectedObligation);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Autonomous Filing Agent</h1>
        <p className="text-text-secondary mt-1">
          Let our browser agent pre-fill your returns. You just review and approve.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <AlertTriangle className="w-4 h-4" />
        <span>Prototype Demo Mode: All filing is simulated for demonstration purposes.</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Obligations List */}
        <div className="lg:col-span-1 bg-white rounded-card shadow-card p-4">
          <h3 className="font-semibold text-text-primary mb-4">Pending Obligations</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {obligations.map(obligation => (
              <button
                key={obligation.id}
                onClick={() => selectObligation(obligation.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedObligation === obligation.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary text-sm">{obligation.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    obligation.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {obligation.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                  </span>
                </div>
                <div className="text-xs text-text-tertiary mt-1 flex items-center justify-between">
                  <span>Due: {obligation.due}</span>
                  <span className="text-accent-red">{obligation.penalty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filing Workflow */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">{selected.name}</h3>
                    <div className="text-sm text-text-tertiary mt-1">
                      Type: {selected.type} | Due: {selected.due}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Demo Mode
                  </span>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    {steps.map((s, i) => (
                      <div key={s.id} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              s.status === 'completed'
                                ? 'bg-accent-green text-white'
                                : s.status === 'active'
                                ? 'bg-primary text-white animate-pulse'
                                : s.status === 'error'
                                ? 'bg-accent-red text-white'
                                : 'bg-border text-text-tertiary'
                            }`}
                          >
                            {s.status === 'completed' ? (
                              <Check className="w-5 h-5" />
                            ) : s.status === 'active' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <span>{i + 1}</span>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-xs font-medium text-text-primary">{s.title}</div>
                            <div className="text-xs text-text-tertiary max-w-[100px]">{s.description}</div>
                          </div>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${
                            s.status === 'completed' ? 'bg-accent-green' : 'bg-border'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Preview */}
                {currentStep >= 3 && !isSubmitted && (
                  <div className="bg-surface rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-text-primary">Filled Form Summary</h4>
                      <button
                        onClick={() => setShowEditForm(!showEditForm)}
                        className="text-primary text-sm hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit Values
                      </button>
                    </div>

                    {!showEditForm ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-text-tertiary">Tax Liability</div>
                          <div className="text-lg font-semibold text-text-primary">₹{formData.taxLiability.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-text-tertiary">ITC Claimed</div>
                          <div className="text-lg font-semibold text-text-primary">₹{formData.itcClaimed.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-text-tertiary">Net Payable</div>
                          <div className="text-lg font-semibold text-primary">₹{formData.netPayable.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="text-text-tertiary">Late Fee</div>
                          <div className="text-lg font-semibold text-accent-red">₹{formData.lateFee.toLocaleString()}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-text-tertiary text-xs">Tax Liability</label>
                          <input
                            type="number"
                            value={formData.taxLiability}
                            onChange={e => setFormData({ ...formData, taxLiability: parseInt(e.target.value) || 0 })}
                            className="w-full mt-1 px-3 py-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-text-tertiary text-xs">ITC Claimed</label>
                          <input
                            type="number"
                            value={formData.itcClaimed}
                            onChange={e => setFormData({ ...formData, itcClaimed: parseInt(e.target.value) || 0 })}
                            className="w-full mt-1 px-3 py-2 border rounded"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
                      <strong>Total Amount to Pay:</strong>{' '}
                      <span className="text-lg font-bold text-accent-amber">
                        ₹{(formData.netPayable + formData.lateFee).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submitted Success */}
                {isSubmitted && (
                  <div className="bg-accent-green/10 border border-accent-green rounded-lg p-6 text-center mb-6">
                    <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-accent-green mb-2">Filing Successful!</h4>
                    <p className="text-text-secondary mb-4">
                      Your {selected.name} has been submitted successfully.
                    </p>
                    <div className="bg-white rounded-lg p-4 inline-block">
                      <div className="text-sm text-text-tertiary">Confirmation Number</div>
                      <div className="text-lg font-mono font-bold text-text-primary">{confirmationNumber}</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {!isSubmitted ? (
                    <>
                      <button
                        onClick={handleApprove}
                        disabled={currentStep < 3 || isSubmitting}
                        className="flex-1 px-4 py-3 bg-accent-green text-white rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" /> Approve & Submit
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowEditForm(true)}
                        disabled={currentStep < 3}
                        className="px-4 py-3 bg-surface text-text-secondary rounded-lg font-medium hover:bg-border transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 text-accent-red hover:bg-accent-red/10 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" /> Download Acknowledgment
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-surface text-text-secondary rounded-lg font-medium hover:bg-border transition flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> File Another
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-card shadow-card p-12 text-center">
              <Globe className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Select an Obligation</h3>
              <p className="text-text-secondary">Choose a pending obligation from the list to begin the automated filing process.</p>
            </div>
          )}
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

export default Filing;
