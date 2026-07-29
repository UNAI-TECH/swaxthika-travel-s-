import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, CheckCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userDisplayName = name || email.split('@')[0] || 'Devotee Pilgrim';
    setSignedInUser(userDisplayName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/30 relative">
        <div className="bg-[#5d100a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-serif font-bold">
            {signedInUser
              ? 'Welcome Pilgrim'
              : isSignUp
              ? 'Create Swaxthika Account'
              : 'Sign In to Swaxthika'}
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Access personalized yatra plans, saved sevas, and pilgrim rewards.
          </p>
        </div>

        <div className="p-6">
          {signedInUser ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#2d6a4f]/10 text-[#2d6a4f] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 font-serif">
                Welcome, {signedInUser}!
              </h4>
              <p className="text-xs text-gray-600">
                You are now signed in to Swaxthika Travel. Your booked sevas and saved yatra plans will be synchronized across device apps.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#5d100a] text-white py-2.5 rounded-lg font-bold text-xs hover:bg-opacity-90 cursor-pointer"
              >
                Continue Devotional Journey
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Sundararajan"
                      className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Email Address / Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@example.com"
                    className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#534341] uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 border border-gray-300 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-[#5d100a] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5d100a] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 transition-all cursor-pointer shadow-md"
              >
                {isSignUp ? 'Create Devotee Profile' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-[#5d100a] font-bold hover:underline cursor-pointer"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
