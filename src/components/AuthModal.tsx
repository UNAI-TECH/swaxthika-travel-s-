import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSignInSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignInSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<UserSession | null>(null);

  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // Simulate Google Sign-In redirect/popup response after 1.2s
    setTimeout(() => {
      const mockUser: UserSession = {
        name: 'Sundararajan Swamy',
        email: 'sundar.swamy@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isLoggedIn: true
      };
      
      localStorage.setItem('swaxthika_user_session', JSON.stringify(mockUser));
      setSignedInUser(mockUser);
      setLoading(false);
      onSignInSuccess(mockUser);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#c5a059] bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
            Secure Authentication
          </span>

          <h3 className="text-xl font-serif font-bold mt-2">
            {signedInUser ? 'Welcome Devotee' : 'Sign In to Swaxthika'}
          </h3>
          
          <p className="text-[11px] text-white/70 mt-1">
            Access secure package bookings, boarding passes, and verified check-ins.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {signedInUser ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900 font-serif">
                  Auspicious Welcome, {signedInUser.name}!
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {signedInUser.email}
                </p>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                You are now signed in to Swaxthika Travel. Your package tours, bookings, and onboarding passes will be securely tracked.
              </p>

              <button
                onClick={onClose}
                className="w-full bg-[#5d100a] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all shadow-xs border border-[#c5a059]/30 mt-2"
              >
                Continue Pilgrimage Journey
              </button>
            </div>
          ) : (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 bg-[#5d100a]/10 rounded-2xl mx-auto flex items-center justify-center border border-[#c5a059]/20 shadow-3xs">
                <Sparkles className="w-8 h-8 text-[#5d100a]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800">
                  Google One-Click Authentication
                </h4>
                <p className="text-xs text-gray-500">
                  No passwords required. Securely log in using your Google account.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-300 hover:border-gray-400 transition-all shadow-2xs flex items-center justify-center gap-3 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.31v3.15C3.29 22.33 7.39 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.25 14.24c-.25-.72-.39-1.5-.39-2.3s.14-1.58.39-2.3V6.49H1.31C.47 8.16 0 10.02 0 12s.47 3.84 1.31 5.51l3.94-3.27z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.39 0 3.29 1.67 1.31 4.75l3.94 3.27c.95-2.85 3.61-4.96 6.75-4.96z"
                      />
                    </svg>
                    <span>Sign In with Google</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
