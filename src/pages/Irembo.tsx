import { useState } from 'react';
import { motion } from 'motion/react';
import { FileCheck, Phone, Mail, Calendar, MapPin, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from '../contexts/AuthContext';
import { iremboAPI, paymentAPI } from '../services/api';

export default function Irembo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    language: 'Kinyarwanda',
    testMode: 'Computer-based',
    district: '',
    testDate: '',
    termsAccepted: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState(false);
  const [txnId, setTxnId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');

  const districts = [
    'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Gatsibo',
    'Kayonza', 'Kirehe', 'Ngoma', 'Rwamagana', 'Burera',
    'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', 'Gisagara',
    'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza',
    'Nyaruguru', 'Ruhango', 'Karongi', 'Ngororero', 'Nyabihu',
    'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // National ID validation (16 digits)
    if (!/^\d{16}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'National ID must be exactly 16 digits';
    }

    // Age check (extract year from ID - first 5 digits represent birth year + last 2 of century)
    const birthYear = parseInt('19' + formData.nationalId.substring(1, 3));
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    if (age < 16) {
      newErrors.nationalId = 'You must be at least 16 years old';
    }

    // Phone validation (Rwandan format)
    if (!/^(\+250|0)(78|79|72|73)\d{7}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Rwandan phone number';
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPaymentPhone(formData.phone);
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async () => {
    setShowPaymentDialog(false);
    if (!user) return;
    try {
      setProcessing(true);
      setPaymentError(null);
      // Use Paypack for payment — 100 RWF in test mode
      const init = await paymentAPI.paypackCashin({ amount: 100, phone: paymentPhone, product: 'irembo' });
      setTxnId(init.transactionId);
      setPaymentStatus('PENDING');
      
      let finalStatus = 'PENDING';
      let tries = 0;
      await new Promise<void>((resolve) => {
        const iv = setInterval(async () => {
          tries++;
          try {
            const st = await paymentAPI.paypackStatus(init.transactionId);
            setPaymentStatus(st.status);
            if (st.status === 'SUCCESS' || st.status === 'FAILED') {
               finalStatus = st.status;
               clearInterval(iv); 
               resolve(); 
            }
            if (tries > 40) {
                finalStatus = 'TIMEOUT';
                clearInterval(iv); 
                resolve(); 
            }
          } catch { clearInterval(iv); resolve(); }
        }, 3000);
      });
      
      if (finalStatus !== 'SUCCESS') { 
          setProcessing(false); 
          setPaymentError(finalStatus === 'TIMEOUT' ? 'Payment timed out' : 'Payment failed'); 
          return; 
      }

      const reg = await iremboAPI.register({
        userId: user.id,
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        phone: formData.phone,
        email: formData.email,
        language: formData.language,
        testMode: formData.testMode,
        district: formData.district,
        testDate: formData.testDate,
        transactionId: String(init.transactionId),
      });
      setApplicationId(reg.application?.id || '');
      setSubmitted(true);
      setProcessing(false);
    } catch (e: any) {
      setProcessing(false);
      setPaymentError(e?.message || 'Request failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/20 dark:border-gray-700/20 shadow-2xl"
        >
          <div className="text-center">
            <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            
            <h2 className="text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your Irembo driving test registration has been received.
            </p>

            {/* Payment & Application */}
            <div className="bg-gradient-to-br from-[#00A3AD]/10 to-purple-500/10 rounded-2xl p-6 mb-8">
              <h3 className="text-gray-900 dark:text-white mb-4">Registration Details</h3>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                  <code className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-[#00A3AD]">
                    {txnId}
                  </code>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white">5,500 RWF</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Application ID:</span>
                  <span className="text-gray-900 dark:text-white">{applicationId || '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                  <span className="text-orange-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {paymentStatus === 'PENDING' && (
              <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-gray-900 dark:text-white">📱 Check your phone for USSD prompt to confirm payment...</p>
              </div>
            )}
            {paymentError && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400">{paymentError}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-orange-900 dark:text-orange-100 mb-2">Important:</h4>
                  <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
                    <li>• Approve the payment prompt within 8 hours</li>
                    <li>• If payment is not completed, your slot will be released</li>
                    <li>• You will receive an SMS confirmation after payment</li>
                    <li>• If no SMS within 2 hours, contact us at support@ishami.rw</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  nationalId: '',
                  phone: '',
                  email: '',
                  language: 'Kinyarwanda',
                  testMode: 'Computer-based',
                  district: '',
                  testDate: '',
                  termsAccepted: false
                });
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl hover:shadow-[#00A3AD]/50 transition-all duration-300"
            >
              Submit Another Application
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-4">
            <FileCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-gray-900 dark:text-white mb-4">
            Irembo Driving Test Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We'll help you register for your driving code exam through Irembo
            <span className="block mt-1 text-[#00A3AD]">
              Service Fee: 5,500 RWF
            </span>
          </p>
        </motion.div>

        {/* Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="text-blue-900 dark:text-blue-100 mb-2">Before You Start:</h3>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <li>• You must be at least 16 years old</li>
                <li>• National ID is required (passports not accepted)</li>
                <li>• Ensure your phone number is active for SMS notifications</li>
                <li>• Processing time: Within 8 hours of payment</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/20 dark:border-gray-700/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name as on ID"
                required
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                National ID Number *
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="16-digit National ID"
                required
                maxLength={16}
                className={`w-full px-4 py-4 bg-white dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                  errors.nationalId ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-[#00A3AD]'
                }`}
              />
              {errors.nationalId && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.nationalId}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250 78X XXX XXX"
                required
                className={`w-full px-4 py-4 bg-white dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-[#00A3AD]'
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className={`w-full px-4 py-4 bg-white dark:bg-gray-700 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-[#00A3AD]'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Preferred Language *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              >
                <option value="Kinyarwanda">Kinyarwanda</option>
                <option value="English">English</option>
                <option value="French">French</option>
              </select>
            </div>

            {/* Test Mode */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Test Mode *
              </label>
              <select
                name="testMode"
                value={formData.testMode}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              >
                <option value="Computer-based">Computer-based</option>
                <option value="Paper-based">Paper-based</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Test Center (District) *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              >
                <option value="">Select your district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Date */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Test Date *
              </label>
              <input
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#00A3AD] border-gray-300 rounded focus:ring-[#00A3AD] mt-0.5"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  I confirm that all information provided is correct and I accept that 
                  passports or replacement ID certificates are not accepted. I agree to the 
                  <a href="#" className="text-[#00A3AD] hover:underline"> terms and conditions</a>.
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.termsAccepted}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={processing}
            >
              <FileCheck className="w-5 h-5" />
              <span>{processing ? 'Processing…' : 'Submit Registration - 5,500 RWF'}</span>
            </button>
          </form>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-gray-600 dark:text-gray-400"
        >
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@ishami.rw" className="text-[#00A3AD] hover:underline">
              support@ishami.rw
            </a>{' '}
            or call{' '}
            <a href="tel:+250788000000" className="text-[#00A3AD] hover:underline">
              +250 788 000 000
            </a>
          </p>
        </motion.div>
      </div>
      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              To complete your Irembo registration, a payment of 5,500 RWF is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Registration Test Fee:</span>
                <span className="font-medium">5,000 RWF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service Provider Fee:</span>
                <span className="font-medium">500 RWF</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>5,500 RWF</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-phone" className="text-right">
                MoMo Number
              </Label>
              <Input
                id="payment-phone"
                value={paymentPhone}
                onChange={(e) => setPaymentPhone(e.target.value)}
                className="col-span-3"
                placeholder="078..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handlePaymentConfirm} disabled={!/^(\+250|0)(78|79|72|73)\d{7}$/.test(paymentPhone)}>
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
