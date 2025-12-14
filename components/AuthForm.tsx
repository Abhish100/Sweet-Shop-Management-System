import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Registration Step: 'details' = enter info, 'otp' = enter code
  const [regStep, setRegStep] = useState<'details' | 'otp'>('details');
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, initiateRegister, verifyOtp } = useAuth();

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setOtp('');
    setError('');
    setSuccessMsg('');
    setRegStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        await login(username, password);
        onClose();
      } else {
        // --- REGISTRATION FLOW ---
        if (regStep === 'details') {
           // Step 1: Send Details -> Get OTP
           const result = await initiateRegister(username, email, password);
           setRegStep('otp');
           // Show success message - OTP should be sent via email
           setSuccessMsg(`✅ OTP sent to ${email}. Please check your Gmail inbox (and spam folder) to complete registration.`);
        } else {
           // Step 2: Verify OTP
           await verifyOtp(email, otp, username, password);
           onClose();
        }
      }
    } catch (err: any) {
      // Show helpful error message for email configuration issues
      if (err.message && err.message.includes('Email service is disabled')) {
        setError('❌ Email service is not configured. Please configure Gmail in backend/.env file. See QUICK_EMAIL_SETUP.md for instructions.');
      } else if (err.message && err.message.includes('email configuration')) {
        setError('❌ Email configuration error: ' + err.message + ' See QUICK_EMAIL_SETUP.md for setup instructions.');
      } else {
        setError(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative border-t-8 border-red-600">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 font-serif">
          Abhishek Sweets
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {isLogin 
            ? 'Welcome back, sweet tooth!' 
            : regStep === 'details' 
              ? 'Join our family of dessert lovers.' 
              : 'Verify your email address.'}
        </p>
        
        {isLogin && (
          <div className="mb-4 bg-gray-50 text-gray-600 p-3 rounded border border-gray-200 text-xs">
            <p className="font-bold">Demo Credentials:</p>
            <p>User: <code>admin</code> | Pass: <code>admin123</code></p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded border border-red-100 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-50 text-green-600 p-3 rounded border border-green-100 text-sm font-bold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* LOGIN or REGISTRATION STEP 1 */}
          {(isLogin || regStep === 'details') && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  {isLogin ? "Username or Email" : "Username"}
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* REGISTRATION STEP 2: OTP */}
          {!isLogin && regStep === 'otp' && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Enter One-Time Password (OTP)</label>
              <input 
                type="text" 
                required
                maxLength={6}
                placeholder="123456"
                className="w-full border-2 border-red-200 rounded px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
              />
              <p className="text-xs text-center text-gray-600 mt-2">
                Check your Gmail inbox for the 6-digit code sent to <strong>{email}</strong>
              </p>
              <p className="text-xs text-center text-gray-400 mt-1">If you don't see it, check your spam folder.</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition shadow-lg disabled:opacity-50 mt-2"
          >
            {loading 
              ? 'Processing...' 
              : isLogin 
                ? 'Log In' 
                : regStep === 'details' ? 'Send OTP' : 'Verify & Create Account'
            }
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
          {isLogin ? "New to Abhishek Sweets? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }} 
            className="text-red-600 font-bold hover:underline"
          >
            {isLogin ? 'Create Account' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;