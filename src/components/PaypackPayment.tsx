import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Smartphone, CheckCircle2, XCircle, Loader2, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface PaypackPaymentProps {
  amount?: number;
  product?: 'pro' | 'irembo';
  onSuccess?: () => void;
  onCancel?: () => void;
}

type PaymentStatus = 'idle' | 'initiating' | 'pending' | 'success' | 'failed' | 'error';

export default function PaypackPayment({
  amount = 100, // Default to 100 RWF for testing
  product = 'pro',
  onSuccess,
  onCancel,
}: PaypackPaymentProps) {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paypackRef, setPaypackRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll for payment status
  const pollStatus = useCallback(async (txnId: string) => {
    if (pollCount >= 30) { // Max 30 polls (90 seconds)
      setStatus('error');
      setError('Payment timed out. Please check your phone and try again.');
      return;
    }

    try {
      const result = await paymentAPI.paypackStatus(txnId);
      if (result.status === 'SUCCESS') {
        setStatus('success');
        toast.success('Payment successful! 🎉');
        onSuccess?.();
        return;
      } else if (result.status === 'FAILED') {
        setStatus('failed');
        setError('Payment was declined. Please try again.');
        return;
      }
      // Still pending — poll again
      setPollCount(prev => prev + 1);
    } catch (e) {
      console.error('Poll error:', e);
    }
  }, [pollCount, onSuccess]);

  useEffect(() => {
    if (status !== 'pending' || !transactionId) return;

    const timer = setTimeout(() => {
      pollStatus(transactionId);
    }, 3000); // Poll every 3 seconds

    return () => clearTimeout(timer);
  }, [status, transactionId, pollStatus]);

  const handlePayment = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    // Validate Rwanda phone format
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid phone number (e.g., 078XXXXXXX)');
      return;
    }

    setStatus('initiating');
    setError(null);
    setPollCount(0);

    try {
      const result = await paymentAPI.paypackCashin({
        amount,
        phone: cleanPhone,
        product,
      });

      setTransactionId(result.transactionId);
      setPaypackRef(result.paypackRef);
      setStatus('pending');

      toast.info('📱 USSD prompt sent! Please check your phone to complete the payment.');
    } catch (e: any) {
      setStatus('error');
      setError(e?.message || 'Failed to initiate payment. Please try again.');
      toast.error('Payment initiation failed');
    }
  };

  const reset = () => {
    setStatus('idle');
    setTransactionId(null);
    setPaypackRef(null);
    setError(null);
    setPollCount(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#00A3AD] to-[#008891]">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold">
              Pay with Mobile Money
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Paypack
            </p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-[#00A3AD]/10 to-[#008891]/10 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Amount to pay</p>
          <p className="text-3xl font-bold text-[#00A3AD]">
            {amount.toLocaleString()} RWF
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {product === 'pro' ? 'ISHAMI Pro Upgrade' : 'Irembo Service'}
          </p>
        </div>

        {/* Idle State — Phone Input */}
        {status === 'idle' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  placeholder="078XXXXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your MTN or Airtel Money number
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              <Smartphone className="w-5 h-5" />
              Pay {amount.toLocaleString()} RWF
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Initiating State */}
        {status === 'initiating' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-[#00A3AD] mx-auto mb-4 animate-spin" />
            <p className="text-gray-900 dark:text-white font-semibold">Initiating payment...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Connecting to Paypack
            </p>
          </div>
        )}

        {/* Pending State — Waiting for USSD confirmation */}
        {status === 'pending' && (
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <Smartphone className="w-10 h-10 text-orange-500" />
            </motion.div>
            <p className="text-gray-900 dark:text-white font-semibold text-lg">
              Check Your Phone! 📱
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              A USSD prompt has been sent to <strong>{phone}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please confirm the payment on your phone
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Waiting for confirmation... (attempt {pollCount + 1}/30)</span>
            </div>
            {paypackRef && (
              <p className="text-xs text-gray-400 mt-3 font-mono">
                Ref: {paypackRef}
              </p>
            )}
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-11 h-11 text-green-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-xl">
              Payment Successful! 🎉
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Thank you for your payment of {amount.toLocaleString()} RWF
            </p>
            {onSuccess && (
              <button
                onClick={onSuccess}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl font-semibold"
              >
                Continue
              </button>
            )}
          </motion.div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-11 h-11 text-red-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-lg">
              Payment Failed
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {error || 'The payment was declined. Please try again.'}
            </p>
            <button
              onClick={reset}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-11 h-11 text-red-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold text-lg">
              Something Went Wrong
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {error || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={reset}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-3 h-3" />
          <span>Secured by Paypack • 256-bit encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
