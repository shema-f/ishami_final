import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Zap, CreditCard, CheckCircle, XCircle, Loader2, Smartphone, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentAPI } from '../services/api';
import { toast } from 'sonner';

type RequiredTier = 'quiz' | 'full';

const TIER_ORDER = { free: 0, quiz: 1, full: 2 };

interface AccessGateProps {
  /** Minimum tier required to access the content */
  requiredTier: RequiredTier;
  /** The children to render if access is granted */
  children: React.ReactNode;
  /** Optional custom title for the paywall */
  title?: string;
  /** Optional custom description */
  description?: string;
}

/**
 * AccessGate — wraps content and shows a paywall if the user's tier is too low.
 *
 * Tier hierarchy:
 *  - free  (0) — no payment, only 6 free questions
 *  - quiz  (1) — 1,000 RWF — quizzes + free courses
 *  - full  (2) — 3,000 RWF — everything (AI, 3D sim, certificates, resources)
 */
export default function AccessGate({
  requiredTier,
  children,
  title,
  description,
}: AccessGateProps) {
  const { user, updateUser } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [payPhone, setPayPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [payPhoneError, setPayPhoneError] = useState<string | null>(null);

  const currentTier = (user?.accessTier || 'free') as keyof typeof TIER_ORDER;
  const hasAccess = (TIER_ORDER[currentTier] || 0) >= (TIER_ORDER[requiredTier] || 0);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Not authenticated — show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
            Sign In Required
          </h2>
          <p className="text-gray-400 mb-6">
            {description || 'Please sign in to access this content.'}
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            Sign In
          </a>
        </motion.div>
      </div>
    );
  }

  // Authenticated but tier too low — show paywall
  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
            {title || 'Upgrade Required'}
          </h2>
          <p className="text-gray-400 mb-6">
            {description ||
              (requiredTier === 'quiz'
                ? 'Upgrade to Quiz Access (1,000 RWF) to unlock quizzes and courses.'
                : 'Upgrade to Full Access (3,000 RWF) to unlock AI assistant, 3D simulation, certificates, and more.')}
          </p>
          <button
            onClick={() => setShowPaywall(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Upgrade Now
          </button>
        </motion.div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !paying && setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                Choose Your Plan
              </h2>
              <p className="text-gray-400 mb-6">
                Select a plan to unlock all features of ISHAMI.
              </p>

              {paymentStatus === 'SUCCESS' ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-500/20 rounded-3xl">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold">Payment Successful! 🎉</p>
                  <p className="text-gray-400 text-sm">Your access has been upgraded.</p>
                  <button
                    onClick={() => { setShowPaywall(false); setPaymentStatus(null); window.location.reload(); }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quiz Access Tier */}
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-blue-400">Quiz Access</h3>
                      <span className="text-2xl font-bold text-blue-400">1,000 RWF</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Unlock all quiz questions and free courses</p>
                    <div className="space-y-2">
                      {['Unlimited quiz questions', 'Access to free courses'].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full Access Tier */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-5 border border-yellow-500/30 text-left relative">
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                      BEST VALUE
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-yellow-400">Full Access</h3>
                      <span className="text-2xl font-bold text-yellow-400">3,000 RWF</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Unlock everything: quizzes, courses, AI, 3D simulation, and certificates</p>
                    <div className="space-y-2">
                      {[
                        'Unlimited quiz questions',
                        'Access to all courses',
                        'AI assistant (Moto-Sensei)',
                        '3D driving simulation',
                        'Certificate of completion',
                        'Premium resources',
                      ].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Input */}
                  {!paying && paymentStatus !== 'PENDING' && (
                    <>
                      <div className="relative">
                        <input
                          type="tel"
                          value={payPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPayPhone(val);
                            if (val && !/^(\+250|0)(78|79|72|73)\d{7}$/.test(val)) {
                              setPayPhoneError('Please enter a valid Rwandan phone number (078X/079X/072X/073X)');
                            } else {
                              setPayPhoneError(null);
                            }
                          }}
                          placeholder="Phone number (e.g. 0788xxxxxx)"
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            payPhoneError ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                      {payPhoneError && (
                        <p className="text-red-400 text-sm mt-1">{payPhoneError}</p>
                      )}

                      {/* Quiz Access Button */}
                      <button
                        disabled={!payPhone || !!payPhoneError || paymentStatus === 'PENDING'}
                        onClick={async () => {
                          if (!payPhone || !/^(\+250|0)(78|79|72|73)\d{7}$/.test(payPhone)) {
                            setPayPhoneError('Please enter a valid Rwandan phone number');
                            return;
                          }
                          setPaying(true);
                          setPaymentError(null);
                          try {
                            const res = await paymentAPI.paypackCashin({ amount: 1000, phone: payPhone, product: 'quiz' });
                            setPaymentStatus('PENDING');
                            setPaying(false);
                            let tries = 0;
                            const iv = setInterval(async () => {
                              tries++;
                              try {
                                const st = await paymentAPI.paypackStatus(res.transactionId);
                                if (st.status === 'SUCCESS' || st.status === 'FAILED') {
                                  setPaymentStatus(st.status);
                                  clearInterval(iv);
                                  if (st.status === 'SUCCESS' && updateUser) {
                                    updateUser({ isPro: true, accessTier: 'quiz' });
                                  }
                                }
                                if (tries > 40) { clearInterval(iv); setPaymentStatus('FAILED'); setPaymentError('Payment timed out'); }
                              } catch { clearInterval(iv); setPaymentStatus('FAILED'); setPaymentError('Could not check payment status'); }
                            }, 3000);
                          } catch (e: any) { setPaying(false); setPaymentError(e?.message || 'Payment failed'); }
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paying ? 'Processing...' : 'Quiz Access - 1,000 RWF'}
                      </button>

                      {/* Full Access Button */}
                      <button
                        disabled={!payPhone || !!payPhoneError || paymentStatus === 'PENDING'}
                        onClick={async () => {
                          if (!payPhone || !/^(\+250|0)(78|79|72|73)\d{7}$/.test(payPhone)) {
                            setPayPhoneError('Please enter a valid Rwandan phone number');
                            return;
                          }
                          setPaying(true);
                          setPaymentError(null);
                          try {
                            const res = await paymentAPI.paypackCashin({ amount: 3000, phone: payPhone, product: 'full' });
                            setPaymentStatus('PENDING');
                            setPaying(false);
                            let tries = 0;
                            const iv = setInterval(async () => {
                              tries++;
                              try {
                                const st = await paymentAPI.paypackStatus(res.transactionId);
                                if (st.status === 'SUCCESS' || st.status === 'FAILED') {
                                  setPaymentStatus(st.status);
                                  clearInterval(iv);
                                  if (st.status === 'SUCCESS' && updateUser) {
                                    updateUser({ isPro: true, accessTier: 'full' });
                                  }
                                }
                                if (tries > 40) { clearInterval(iv); setPaymentStatus('FAILED'); setPaymentError('Payment timed out'); }
                              } catch { clearInterval(iv); setPaymentStatus('FAILED'); setPaymentError('Could not check payment status'); }
                            }, 3000);
                          } catch (e: any) { setPaying(false); setPaymentError(e?.message || 'Payment failed'); }
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {paying ? 'Processing...' : 'Full Access - 3,000 RWF'}
                      </button>
                    </>
                  )}

                  {paymentStatus === 'PENDING' && (
                    <div className="py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3" />
                      <p className="text-gray-300">📱 Check your phone for USSD prompt...</p>
                      <p className="text-xs text-gray-500 mt-1">Confirm the payment on your phone</p>
                    </div>
                  )}

                  {paymentError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm">{paymentError}</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setShowPaywall(false); setPaymentStatus(null); setPaymentError(null); setPaying(false); }}
                    className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
