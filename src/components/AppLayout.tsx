import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Scale,
  LayoutDashboard,
  ClipboardList,
  Search,
  Globe,
  Mic,
  TrendingUp,
  FolderOpen,
  Settings,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/obligations', icon: ClipboardList, label: 'My Obligations' },
  { to: '/app/analyzer', icon: Search, label: 'Circular Analyzer' },
  { to: '/app/filing', icon: Globe, label: 'Filing Agent' },
  { to: '/app/voice', icon: Mic, label: 'Voice Assistant' },
  { to: '/app/radar', icon: TrendingUp, label: 'Compliance Radar' },
  { to: '/app/vault', icon: FolderOpen, label: 'Document Vault' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find(item => item.to === location.pathname)?.label || 'Dashboard';
  const healthScore = 78;

  // Get user from localStorage or use defaults
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('regulaai_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return { fullName: 'Demo User', email: 'demo@example.com', businessName: 'Demo Business', industry: 'Retail' };
  };

  const user = getStoredUser();

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('regulaai_auth');
    localStorage.removeItem('regulaai_user');
    localStorage.removeItem('regulaai_onboarding_complete');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-navy transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <a href="/" className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-white">RegulaAI</span>
            </a>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    isActive
                      ? 'bg-primary/15 text-white border-l-4 border-primary pl-2'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                {user?.fullName ? getInitials(user.fullName) : 'DU'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {user?.businessName || 'Demo Business'}
                </div>
                <div className="text-white/60 text-xs truncate">
                  {user?.industry || 'Not set'}
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs">Compliance Health</span>
                <span className={`text-sm font-bold ${healthScore >= 70 ? 'text-accent-green' : healthScore >= 50 ? 'text-accent-amber' : 'text-accent-red'}`}>
                  {healthScore}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    healthScore >= 70 ? 'bg-accent-green' : healthScore >= 50 ? 'bg-accent-amber' : 'bg-accent-red'
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-60">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-text-secondary"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center text-sm text-text-secondary">
            <span>{currentPage}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search regulations, deadlines, circulars..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative text-text-secondary hover:text-text-primary transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                  {user?.fullName ? getInitials(user.fullName) : 'DU'}
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="font-medium text-text-primary">{user?.fullName || 'Demo User'}</div>
                    <div className="text-xs text-text-secondary">{user?.email || 'demo@example.com'}</div>
                  </div>
                  <NavLink
                    to="/app/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface transition"
                  >
                    <User className="w-4 h-4" /> Profile
                  </NavLink>
                  <NavLink
                    to="/app/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface transition"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-surface transition w-full"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
