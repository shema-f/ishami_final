import { useState } from 'react';
import { motion } from 'motion/react';
import { FileCheck, Phone, Mail, Calendar, MapPin, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from '../contexts/AuthContext';
import { iremboAPI, paymentAPI } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';

export default function Irembo() {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    language: 'Kinyarwanda',
    testMode: 'Computer-based',
    licenseType: 'provisional',
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

    if (!/^\d{16}$/.test(formData.nationalId)) {
      newErrors.nationalId = t('irembo.validation.national_id_digits', 'National ID must be exactly 16 digits');
    }

    const birthYear = parseInt('19' + formData.nationalId.substring(1, 3));
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    if (age < 16) {
      newErrors.nationalId = t('irembo.validation.age_requirement', 'You must be at least 16 years old');
    }

    if (!/^(\+250|0)(78|79|72|73)\d{7}$/.test(formData.phone)) {
      newErrors.phone = t('irembo.validation.phone_invalid', 'Please enter a valid Rwandan phone number');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('irembo.validation.email_invalid', 'Please enter a valid email address');
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t('irembo.validation.terms_required', 'You must accept the terms and conditions');
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
    setShowPaymentDialog(false);    if (!user) return;
    try {
      setProcessing(true);
      setPaymentError(null);
      const isPermanent = formData.licenseType === 'permanent';
      const paymentAmount = isPermanent ? 10500 : 5500;
      const init = await paymentAPI.paypackCashin({
        amount: paymentAmount,
        phone: paymentPhone,
        product: 'irembo',
        iremboData: {
          fullName: formData.fullName,
          nationalId: formData.nationalId,
          email: formData.email,
          language: formData.language,
          testMode: formData.testMode,
          licenseType: formData.licenseType,
          district: formData.district,
          testDate: formData.testDate,
        },
      });
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
              {t('irembo.success.title', 'Application Submitted Successfully!')}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('irembo.success.description', 'Your Irembo driving test registration has been received.')}
            </p>

            <div className="bg-gradient-to-br from-[#00A3AD]/10 to-purple-500/10 rounded-2xl p-6 mb-8">
              <h3 className="text-gray-900 dark:text-white mb-4">{t('irembo.success.details_title', 'Registration Details')}</h3>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('irembo.success.transaction', 'Transaction:')}</span>
                  <code className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-[#00A3AD]">
                    {txnId}
                  </code>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('irembo.success.amount', 'Amount:')}</span>
                  <span className="text-gray-900 dark:text-white">{formData.licenseType === 'permanent' ? '10,500' : '5,500'} RWF</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('irembo.success.application_id', 'Application ID:')}</span>
                  <span className="text-gray-900 dark:text-white">{applicationId || '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('irembo.success.valid_until', 'Valid Until:')}</span>
                  <span className="text-orange-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {paymentStatus === 'PENDING' && (
              <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-gray-900 dark:text-white">{t('irembo.success.check_phone', '📱 Check your phone for USSD prompt to confirm payment...')}</p>
              </div>
            )}
            {paymentError && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400">{paymentError}</p>
              </div>
            )}

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-orange-900 dark:text-orange-100 mb-2">{t('irembo.success.important_title', 'Important:')}</h4>
                  <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
                    <li>• {t('irembo.success.important_items.approve', 'Approve the payment prompt within 8 hours')}</li>
                    <li>• {t('irembo.success.important_items.slot_release', 'If payment is not completed, your slot will be released')}</li>
                    <li>• {t('irembo.success.important_items.sms_confirmation', 'You will receive an SMS confirmation after payment')}</li>
                    <li>• {t('irembo.success.important_items.no_sms', 'If no SMS within 2 hours, contact us at support@ishami.rw')}</li>
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
                  licenseType: 'provisional',
                  district: '',
                  testDate: '',
                  termsAccepted: false
                });
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl hover:shadow-[#00A3AD]/50 transition-all duration-300"
            >
              {t('irembo.success.submit_another', 'Submit Another Application')}
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
          <div className="inline-flex mb-4">
            <img
              src="/irembo.png"
              alt="Irembo Help Desk"
              className="w-24 h-24 rounded-full object-contain shadow-xl shadow-blue-500/20"
              onError={(e) => {
                // Fallback to the blue circle icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden inline-flex p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full">
              <FileCheck className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 dark:text-white mb-4 text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)]">
            {t('irembo.title', 'Irembo Driving Test Registration')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
            {t('irembo.subtitle', "We'll help you register for your driving code exam through Irembo")}
          </p>
          {/* Pricing Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-gray-700/20">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'rw' ? 'Uruhushya rw\'Agateganyo' : 'Provisional License'}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">5,500 <span className="text-sm font-normal">RWF</span></div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-[#00A3AD]/30">
              <div className="text-xs text-[#00A3AD] uppercase tracking-wider mb-1 font-semibold">{lang === 'rw' ? 'Uruhushya rwa Burundu' : 'Permanent License'}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">10,500 <span className="text-sm font-normal">RWF</span></div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/20 dark:border-gray-700/20">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'rw' ? 'Ibiciro by\'Imikoreshereze' : 'Pro Features'}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1,000 <span className="text-sm font-normal">RWF</span></div>
            </div>
          </div>
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
              <h3 className="text-blue-900 dark:text-blue-100 mb-2">{t('irembo.info_banner.title', 'Before You Start:')}</h3>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <li>• {t('irembo.info_banner.items.age', 'You must be at least 16 years old')}</li>
                <li>• {t('irembo.info_banner.items.national_id', 'National ID is required (passports not accepted)')}</li>
                <li>• {t('irembo.info_banner.items.phone', 'Ensure your phone number is active for SMS notifications')}</li>
                <li>• {t('irembo.info_banner.items.processing', 'Processing time: Within 8 hours of payment')}</li>
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
                {t('irembo.form.full_name', 'Full Legal Name *')}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t('irembo.form.full_name_placeholder', 'Enter your full name as on ID')}
                required
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {t('irembo.form.national_id', 'National ID Number *')}
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder={t('irembo.form.national_id_placeholder', '16-digit National ID')}
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
                {t('irembo.form.phone', 'Phone Number *')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('irembo.form.phone_placeholder', '+250 78X XXX XXX')}
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
                {t('irembo.form.email', 'Email Address *')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('irembo.form.email_placeholder', 'your.email@example.com')}
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
                {t('irembo.form.language', 'Preferred Language *')}
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

            {/* License Type */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {t('irembo.form.license_type', 'License Type *')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.licenseType === 'provisional'
                    ? 'border-[#00A3AD] bg-[#00A3AD]/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                  <input type="radio" name="licenseType" value="provisional" checked={formData.licenseType === 'provisional'} onChange={handleChange} className="sr-only" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{lang === 'rw' ? "Uruhushya rw'Agateganyo" : 'Provisional License'}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">5,500 <span className="text-sm font-normal">RWF</span></span>
                </label>
                <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.licenseType === 'permanent'
                    ? 'border-[#00A3AD] bg-[#00A3AD]/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                  <input type="radio" name="licenseType" value="permanent" checked={formData.licenseType === 'permanent'} onChange={handleChange} className="sr-only" />
                  <span className="text-sm text-[#00A3AD] font-semibold mb-1">{lang === 'rw' ? 'Uruhushya rwa Burundu' : 'Permanent License'}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">10,500 <span className="text-sm font-normal">RWF</span></span>
                </label>
              </div>
            </div>

            {/* Test Mode */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {t('irembo.form.test_mode', 'Test Mode *')}
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
                {t('irembo.form.district', 'Test Center (District) *')}
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
              >
                <option value="">{t('irembo.form.district_placeholder', 'Select your district')}</option>
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
                {t('irembo.form.test_date', 'Preferred Test Date *')}
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
                  {t('irembo.form.terms', 'I confirm that all information provided is correct and I accept that passports or replacement ID certificates are not accepted. I agree to the')}{' '}
                  <a href="#" className="text-[#00A3AD] hover:underline">{t('irembo.form.terms_link', 'terms and conditions')}</a>.
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
              <span>{processing ? t('irembo.form.processing', 'Processing…') : (formData.licenseType === 'permanent' ? 'Submit Registration - 10,500 RWF' : 'Submit Registration - 5,500 RWF')}</span>
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
            {t('irembo.contact.need_help', 'Need help? Contact us at')}{' '}
            <a href="mailto:support@ishami.rw" className="text-[#00A3AD] hover:underline">
              support@ishami.rw
            </a>{' '}
            {t('irembo.contact.or_call', 'or call')}{' '}
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
            <DialogTitle>{t('irembo.payment_dialog.title', 'Confirm Payment')}</DialogTitle>
            <DialogDescription>
              To complete your Irembo registration, a payment of {formData.licenseType === 'permanent' ? '10,500' : '5,500'} RWF is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              {formData.licenseType === 'permanent' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Permanent License Fee:</span>
                    <span className="font-medium">10,000 RWF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Provider Fee:</span>
                    <span className="font-medium">500 RWF</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold">
                    <span>{t('irembo.payment_dialog.total', 'Total:')}</span>
                    <span>10,500 RWF</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span>{t('irembo.payment_dialog.registration_fee', 'Registration Test Fee:')}</span>
                    <span className="font-medium">5,000 RWF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('irembo.payment_dialog.service_fee', 'Service Provider Fee:')}</span>
                    <span className="font-medium">500 RWF</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold">
                    <span>{t('irembo.payment_dialog.total', 'Total:')}</span>
                    <span>5,500 RWF</span>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-phone" className="text-right">
                {t('irembo.payment_dialog.momo_number', 'MoMo Number')}
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
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>{t('irembo.payment_dialog.cancel', 'Cancel')}</Button>
            <Button onClick={handlePaymentConfirm} disabled={!/^(\+250|0)(78|79|72|73)\d{7}$/.test(paymentPhone)}>
              {t('irembo.payment_dialog.pay_now', 'Pay Now')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
