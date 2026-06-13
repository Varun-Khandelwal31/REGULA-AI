import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
];

const INDUSTRIES = [
  'Textile', 'Food & Beverage', 'Hardware/Steel', 'Manufacturing',
  'Retail', 'IT Services', 'Construction', 'Healthcare', 'Agriculture', 'Other'
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { user, updateUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    industry: '',
    state: '',
    city: '',
    employees: '',
    turnover: '',
    hasGST: false,
    gstin: '',
    hasEPFO: false,
    hasESI: false,
    hasUdyam: false,
    hasProfTax: false,
    hasFSSAI: false,
    whatsappNumber: '',
    alertEmail: user?.email || '',
    alertTiming: ['7days', '1day'] as string[],
    language: 'en' as 'en' | 'hi',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepNum: number) => {
    const newErrors: Record<string, string> = {};
    if (stepNum === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.employees) newErrors.employees = 'Number of employees is required';
      if (!formData.turnover) newErrors.turnover = 'Annual turnover is required';
    }
    if (stepNum === 2) {
      if (formData.hasGST && !formData.gstin.trim()) {
        newErrors.gstin = 'GSTIN is required when GST is registered';
      }
    }
    if (stepNum === 3) {
      if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
      if (!formData.alertEmail.trim()) newErrors.alertEmail = 'Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        updateUser({
          ...formData,
          hasGST: formData.hasGST,
          hasEPFO: formData.hasEPFO,
          hasESI: formData.hasESI,
          hasUdyam: formData.hasUdyam,
          hasProfTax: formData.hasProfTax,
          hasFSSAI: formData.hasFSSAI,
        });
        completeOnboarding();
        navigate('/app/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAlert = (value: string) => {
    setFormData(prev => ({
      ...prev,
      alertTiming: prev.alertTiming.includes(value)
        ? prev.alertTiming.filter(v => v !== value)
        : [...prev.alertTiming, value]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-text-primary">RegulaAI</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  s < step
                    ? 'bg-accent-green text-white'
                    : s === step
                    ? 'bg-primary text-white'
                    : 'bg-border text-text-tertiary'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 sm:w-32 h-1 rounded mx-1 ${
                    s < step ? 'bg-accent-green' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-text-tertiary mb-8">
          Step {step} of 3
        </div>

        {/* Form Content */}
        <div className="max-w-xl mx-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Tell us about your business</h2>
                <p className="text-text-secondary">This helps us customize your compliance experience</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.businessName ? 'border-accent-red' : 'border-border'}`}
                  />
                  {errors.businessName && <p className="text-accent-red text-sm mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Industry/Sector</label>
                  <select
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white ${errors.industry ? 'border-accent-red' : 'border-border'}`}
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-accent-red text-sm mt-1">{errors.industry}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">State</label>
                    <select
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white ${errors.state ? 'border-accent-red' : 'border-border'}`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-accent-red text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City name"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.city ? 'border-accent-red' : 'border-border'}`}
                    />
                    {errors.city && <p className="text-accent-red text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Number of Employees</label>
                    <select
                      value={formData.employees}
                      onChange={e => setFormData({ ...formData, employees: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white ${errors.employees ? 'border-accent-red' : 'border-border'}`}
                    >
                      <option value="">Select Range</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="200+">200+</option>
                    </select>
                    {errors.employees && <p className="text-accent-red text-sm mt-1">{errors.employees}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Annual Turnover</label>
                    <select
                      value={formData.turnover}
                      onChange={e => setFormData({ ...formData, turnover: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white ${errors.turnover ? 'border-accent-red' : 'border-border'}`}
                    >
                      <option value="">Select Range</option>
                      <option value="under20L">Under ₹20L</option>
                      <option value="20L-1Cr">₹20L–₹1Cr</option>
                      <option value="1Cr-5Cr">₹1Cr–₹5Cr</option>
                      <option value="5Cr+">₹5Cr+</option>
                    </select>
                    {errors.turnover && <p className="text-accent-red text-sm mt-1">{errors.turnover}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Which registrations do you have?</h2>
                <p className="text-text-secondary">We'll track all compliance obligations for these</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                  <div>
                    <div className="font-medium text-text-primary">GST Registration</div>
                    <div className="text-sm text-text-tertiary">Goods and Services Tax</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasGST: !formData.hasGST })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      formData.hasGST ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formData.hasGST ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.hasGST && (
                  <div className="ml-4">
                    <label className="block text-sm font-medium text-text-primary mb-1">GSTIN</label>
                    <input
                      type="text"
                      placeholder="22AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.gstin ? 'border-accent-red' : 'border-border'}`}
                    />
                    {errors.gstin && <p className="text-accent-red text-sm mt-1">{errors.gstin}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                  <div>
                    <div className="font-medium text-text-primary">EPFO Registration</div>
                    <div className="text-sm text-text-tertiary">Employees' Provident Fund</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasEPFO: !formData.hasEPFO })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      formData.hasEPFO ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formData.hasEPFO ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                  <div>
                    <div className="font-medium text-text-primary">ESI Registration</div>
                    <div className="text-sm text-text-tertiary">Employees' State Insurance</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasESI: !formData.hasESI })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      formData.hasESI ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formData.hasESI ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                  <div>
                    <div className="font-medium text-text-primary">Udyam/MSME Registration</div>
                    <div className="text-sm text-text-tertiary">MSME registration certificate</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasUdyam: !formData.hasUdyam })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      formData.hasUdyam ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formData.hasUdyam ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                  <div>
                    <div className="font-medium text-text-primary">Professional Tax Registration</div>
                    <div className="text-sm text-text-tertiary">State-level professional tax</div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasProfTax: !formData.hasProfTax })}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      formData.hasProfTax ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formData.hasProfTax ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.industry === 'Food & Beverage' && (
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition">
                    <div>
                      <div className="font-medium text-text-primary">FSSAI License</div>
                      <div className="text-sm text-text-tertiary">Food Safety and Standards Authority</div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, hasFSSAI: !formData.hasFSSAI })}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        formData.hasFSSAI ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          formData.hasFSSAI ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">How should we alert you?</h2>
                <p className="text-text-secondary">Choose your notification preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">WhatsApp Number</label>
                  <div className="flex gap-2">
                    <div className="px-3 py-3 border rounded-lg bg-surface text-text-secondary">+91</div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.whatsappNumber}
                      onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.whatsappNumber ? 'border-accent-red' : 'border-border'}`}
                    />
                  </div>
                  {errors.whatsappNumber && <p className="text-accent-red text-sm mt-1">{errors.whatsappNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Email for Alerts</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.alertEmail}
                    onChange={e => setFormData({ ...formData, alertEmail: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.alertEmail ? 'border-accent-red' : 'border-border'}`}
                  />
                  {errors.alertEmail && <p className="text-accent-red text-sm mt-1">{errors.alertEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Alert Timing</label>
                  <div className="space-y-3">
                    {[
                      { value: '30days', label: '30 days before deadline' },
                      { value: '7days', label: '7 days before deadline' },
                      { value: '1day', label: '1 day before deadline' },
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded border-2 transition flex items-center justify-center ${
                            formData.alertTiming.includes(option.value)
                              ? 'bg-primary border-primary'
                              : 'bg-white border-border'
                          }`}
                        >
                          {formData.alertTiming.includes(option.value) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-text-primary">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Language Preference</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, language: 'en' })}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        formData.language === 'en'
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-primary hover:bg-border'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, language: 'hi' })}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        formData.language === 'hi'
                          ? 'bg-primary text-white'
                          : 'bg-surface text-text-primary hover:bg-border'
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                step === 1
                  ? 'text-text-tertiary cursor-not-allowed'
                  : 'text-text-primary hover:bg-surface'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition"
            >
              {step === 3 ? 'Complete Setup' : 'Next'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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

export default Onboarding;
