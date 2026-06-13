import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', top: '80px', right: '20px',
        zIndex: 9999, display: 'flex', 
        flexDirection: 'column', gap: '8px'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding: '12px 18px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            minWidth: '240px',
            animation: 'slideIn 0.3s ease',
            background: toast.type === 'success' ? '#16A34A' 
              : toast.type === 'warning' ? '#EF9F27' 
              : toast.type === 'error' ? '#E24B4A' 
              : '#1E5EE5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {toast.type === 'success' ? '✅ ' 
              : toast.type === 'warning' ? '⚠️ ' 
              : toast.type === 'error' ? '❌ ' 
              : 'ℹ️ '}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
