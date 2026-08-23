import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft, TestTube, CreditCard, CheckCircle2, Info } from 'lucide-react';
import PaypackPayment from '../components/PaypackPayment';
import { paymentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function TestPayment() {
  const { user } = useAuth();
  const [testConnection, setTestConnection] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const testPaypackConnection = async () => {
    setTestConnection('testing');
    setTestResult(null);
    try {
      const result = await paymentAPI.paypackTest();
      setTestConnection('success');
      setTestResult(result.message || 'Paypack connection successful!');
      toast.success('Paypack connected! ✅');
    } catch (e: any) {
      setTestConnection('failed');
      setTestResult(e?.message || 'Connection failed. Check your Paypack credentials.');
      toast.error('Paypack connection failed');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Paypack Payment Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing payment integration with Paypack (100 RWF test mode)
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Testing Phase — 100 RWF
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                This is in development mode. You'll receive a USSD prompt on your phone to confirm the 100 RWF payment. 
                Make sure your Paypack account has the phone number registered.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Test Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00A3AD]/10">
                <TestTube className="w-5 h-5 text-[#00A3AD]" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold">
                  Step 1: Test Connection
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verify Paypack API credentials
                </p>
              </div>
            </div>
            <button
              onClick={testPaypackConnection}
              disabled={testConnection === 'testing'}
              className="px-4 py-2 bg-[#00A3AD] text-white rounded-lg hover:bg-[#008891] transition-colors disabled:opacity-50"
            >
              {testConnection === 'testing' ? 'Testing...' : 'Test'}
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg ${
              testConnection === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              <p className="text-sm">{testResult}</p>
            </div>
          )}
        </motion.div>

        {/* Make Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00A3AD] to-[#008891]">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">
                Step 2: Make Test Payment
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send 100 RWF USSD push to your phone
              </p>
            </div>
          </div>

          {!showPayment ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-[#00A3AD]/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-[#00A3AD]" />
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-xl mb-2">
                100 RWF Test Payment
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Click the button below to send a test payment request to your phone
              </p>
              <button
                onClick={() => setShowPayment(true)}
                className="px-8 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Start Payment
              </button>
            </div>
          ) : (
            <PaypackPayment
              amount={100}
              product="pro"
              onSuccess={() => {
                toast.success('Test payment completed!');
              }}
              onCancel={() => {
                setShowPayment(false);
              }}
            />
          )}
        </motion.div>

        {/* Credentials Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Environment Variables Required
          </h4>
          <div className="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
            <p>PAYPACK_CLIENT_ID=9d121fe4-9bcc-11f1-8e47-deadd43720af</p>
            <p>PAYPACK_CLIENT_SECRET=3313c51... (your secret)</p>
            <p>PAYPACK_TEST_MODE=true</p>
            <p>PAYPACK_WEBHOOK_SECRET= (from dashboard)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
