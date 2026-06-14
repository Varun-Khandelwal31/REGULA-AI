import { useState, useEffect } from 'react';
import { User, Bell, FileText, Users, CreditCard, Save, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const tabs = [
  { id: 'profile', label: 'Business Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'registrations', label: 'Registrations', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const INDUSTRIES = [
  'Textile', 'Food & Beverage', 'Hardware/Steel', 'Manufacturing',
  'Retail', 'IT Services', 'Construction', 'Healthcare', 'Agriculture', 'Other'
];

interface Registration {
  name: string;
  active: boolean;
  id: string;
  editing?: boolean;
}

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'active';
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    businessName: '',
    industry: '',
    state: '',
    city: '',
    employees: '',
    turnover: '',
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    whatsapp: '',
    email: '',
    alert30days: true,
    alert7days: true,
    alert1day: true,
    language: 'en' as 'en' | 'hi',
  });

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([
    { name: 'GST', active: false, id: '' },
    { name: 'EPFO', active: false, id: '' },
    { name: 'ESI', active: false, id: '' },
    { name: 'Udyam', active: false, id: '' },
    { name: 'Professional Tax', active: false, id: '' },
    { name: 'FSSAI', active: false, id: '' },
  ]);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', email: 'partner@example.com', role: 'Admin', status: 'active' },
  ]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('Viewer');

  // Invoice/usage state
  const [usage] = useState({
    circularAnalyses: { used: 3, total: 10 },
    filings: { used: 12, total: 'unlimited' },
    storage: { used: 45, total: 100 }, // in MB
  });

  // Initialize from user data
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        businessName: user.businessName || '',
        industry: user.industry || '',
        state: user.state || '',
        city: user.city || '',
        employees: user.employees || '',
        turnover: user.turnover || '',
      });
      setNotifications({
        whatsapp: user.whatsappNumber || '',
        email: user.alertEmail || user.email || '',
        alert30days: user.alertTiming?.includes('30days') ?? true,
        alert7days: user.alertTiming?.includes('7days') ?? true,
        alert1day: user.alertTiming?.includes('1day') ?? true,
        language: user.language || 'en',
      });
      setRegistrations([
        { name: 'GST', active: user.hasGST || false, id: user.gstin || '' },
        { name: 'EPFO', active: user.hasEPFO || false, id: '' },
        { name: 'ESI', active: user.hasESI || false, id: '' },
        { name: 'Udyam', active: user.hasUdyam || false, id: '' },
        { name: 'Professional Tax', active: user.hasProfTax || false, id: '' },
        { name: 'FSSAI', active: user.hasFSSAI || false, id: '' },
      ]);
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [profile, notifications, registrations]);

  const handleSave = () => {
    // Update user context + localStorage
    updateUser({
      fullName: profile.fullName,
      email: profile.email,
      businessName: profile.businessName,
      industry: profile.industry,
      state: profile.state,
      city: profile.city,
      employees: profile.employees,
      turnover: profile.turnover,
      whatsappNumber: notifications.whatsapp,
      alertEmail: notifications.email,
      alertTiming: [
        notifications.alert30days ? '30days' : '',
        notifications.alert7days ? '7days' : '',
        notifications.alert1day ? '1day' : '',
      ].filter(Boolean),
      language: notifications.language,
      hasGST: registrations.find(r => r.name === 'GST')?.active || false,
      gstin: registrations.find(r => r.name === 'GST')?.id || '',
      hasEPFO: registrations.find(r => r.name === 'EPFO')?.active || false,
      hasESI: registrations.find(r => r.name === 'ESI')?.active || false,
      hasUdyam: registrations.find(r => r.name === 'Udyam')?.active || false,
      hasProfTax: registrations.find(r => r.name === 'Professional Tax')?.active || false,
      hasFSSAI: registrations.find(r => r.name === 'FSSAI')?.active || false,
    });

    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleRegistration = (name: string) => {
    setRegistrations(prev => prev.map(r => r.name === name ? { ...r, active: !r.active } : r));
  };

  const updateRegistrationId = (name: string, id: string) => {
    setRegistrations(prev => prev.map(r => r.name === name ? { ...r, id } : r));
  };

  const addTeamMember = () => {
    if (!newTeamEmail.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      email: newTeamEmail,
      role: newTeamRole,
      status: 'pending',
    };
    setTeamMembers(prev => [...prev, member]);
    setNewTeamEmail('');
    setNewTeamRole('Viewer');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your account and preferences</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition flex items-center gap-2"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        )}
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="bg-accent-green/10 border border-accent-green text-accent-green rounded-lg px-4 py-3 flex items-center gap-2">
          <Check className="w-5 h-5" />
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-border ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Business Profile</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Business Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={e => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Industry/Sector</label>
                <select
                  value={profile.industry}
                  onChange={e => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">State</label>
                  <select
                    value={profile.state}
                    onChange={e => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={e => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Number of Employees</label>
                  <select
                    value={profile.employees}
                    onChange={e => setProfile({ ...profile, employees: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                  >
                    <option value="">Select</option>
                    <option value="1-10">1–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51-200">51–200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Annual Turnover</label>
                  <select
                    value={profile.turnover}
                    onChange={e => setProfile({ ...profile, turnover: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                  >
                    <option value="">Select</option>
                    <option value="under20L">Under ₹20L</option>
                    <option value="20L-1Cr">₹20L–₹1Cr</option>
                    <option value="1Cr-5Cr">₹1Cr–₹5Cr</option>
                    <option value="5Cr+">₹5Cr+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Notification Preferences</h3>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">WhatsApp Number for Alerts</label>
                <div className="flex gap-2">
                  <div className="px-4 py-3 bg-surface border border-border rounded-lg text-text-secondary">+91</div>
                  <input
                    type="tel"
                    value={notifications.whatsapp}
                    onChange={e => setNotifications({ ...notifications, whatsapp: e.target.value })}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Email for Alerts</label>
                <input
                  type="email"
                  value={notifications.email}
                  onChange={e => setNotifications({ ...notifications, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Alert Timing</label>
                <div className="space-y-3">
                  {[
                    { key: 'alert30days', label: '30 days before deadline' },
                    { key: 'alert7days', label: '7 days before deadline' },
                    { key: 'alert1day', label: '1 day before deadline' },
                  ].map(option => (
                    <label key={option.key} className="flex items-center gap-3 cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded border-2 transition flex items-center justify-center ${
                          notifications[option.key as keyof typeof notifications]
                            ? 'bg-primary border-primary'
                            : 'bg-white border-border'
                        }`}
                      >
                        {notifications[option.key as keyof typeof notifications] && (
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
                    onClick={() => setNotifications({ ...notifications, language: 'en' })}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      notifications.language === 'en'
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-primary hover:bg-border'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setNotifications({ ...notifications, language: 'hi' })}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      notifications.language === 'hi'
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-primary hover:bg-border'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Active Registrations</h3>

              <div className="space-y-4">
                {registrations.map((reg, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium text-text-primary">{reg.name}</div>
                        {reg.active && reg.id && (
                          <div className="text-sm text-text-tertiary mt-1">ID: {reg.id}</div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleRegistration(reg.name)}
                        className={`w-14 h-8 rounded-full transition-colors ${
                          reg.active ? 'bg-primary' : 'bg-border'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                            reg.active ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    {reg.active && (
                      <div className="px-4 pb-4 pt-0">
                        <input
                          type="text"
                          placeholder={`Enter your ${reg.name} ID/Number`}
                          value={reg.id}
                          onChange={e => updateRegistrationId(reg.name, e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Team Members</h3>

              <div className="space-y-3 mb-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">{member.email}</div>
                      <div className="text-sm text-text-tertiary">{member.role} • {member.status}</div>
                    </div>
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="text-accent-red hover:bg-accent-red/10 p-2 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">Invite New Member</h4>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newTeamEmail}
                    onChange={e => setNewTeamEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                  <select
                    value={newTeamRole}
                    onChange={e => setNewTeamRole(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-white"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    onClick={addTeamMember}
                    disabled={!newTeamEmail.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="max-w-xl space-y-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Current Plan & Usage</h3>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-medium text-text-primary">Free Plan</div>
                    <div className="text-sm text-text-tertiary">Getting started with RegulaAI</div>
                  </div>
                  <span className="px-3 py-1 bg-accent-green text-white text-sm rounded-full">Active</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Circular Analyses</span>
                      <span className="text-text-primary">{usage.circularAnalyses.used} / {usage.circularAnalyses.total}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(usage.circularAnalyses.used / usage.circularAnalyses.total) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Filings This Month</span>
                      <span className="text-text-primary">{usage.filings.used} ({usage.filings.total})</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent-green" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Document Storage</span>
                      <span className="text-text-primary">{usage.storage.used}MB / {usage.storage.total}MB</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent-amber" style={{ width: `${(usage.storage.used / usage.storage.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h4 className="font-medium text-text-primary mb-2">Upgrade to Pro</h4>
                <ul className="text-sm text-text-secondary space-y-2 mb-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-green" /> Unlimited circular analyses</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-green" /> Priority support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-green" /> Advanced compliance radar</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-green" /> Team collaboration (5 members)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-green" /> 1GB document storage</li>
                </ul>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-text-primary">₹999<small className="text-sm font-normal text-text-tertiary">/month</small></span>
                  <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save button fixed at bottom on mobile */}
      {hasChanges && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border">
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      )}

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

export default Settings;
