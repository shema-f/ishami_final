import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router';
import {
  ShieldCheck, ShieldX, Loader2, Award, Calendar, Hash, BarChart3,
  CheckCircle2, XCircle, KeyRound, ArrowLeft, ExternalLink
} from 'lucide-react';
import { verifyCertificate } from '../services/api';

interface VerifyResult {
  valid?: boolean;
  message?: string;
  certificate?: {
    certificateNo: string;
    username: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    valid: boolean;
    quizTitle: string;
    issuedAt: string;
    expiresAt: string | null;
  };
}

export default function CertificateVerify() {
  const { certificateNo = '' } = useParams();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await verifyCertificate(certificateNo);
      setResult(res);
      setLoading(false);
    })();
  }, [certificateNo]);

  const cert = result?.certificate;
  const isVerified = !!cert && result?.valid === true && cert.valid;

  return (
    <div className="min-h-screen bg-[#080c18] pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-5">
            <ShieldCheck className="w-4 h-4" />
            ISHAMI Certificate Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
            Verify a Certificate
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Checking certificate <code className="text-blue-400 font-mono">{certificateNo}</code>
          </p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-sm text-gray-400">Verifying certificate…</p>
          </div>
        )}

        {!loading && isVerified && cert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, #10b981 0%, transparent 40%), radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 40%)` }} />
            <div className="relative z-10 p-8 sm:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-11 h-11 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2 font-[family-name:var(--font-heading)]">
                Certificate Verified ✓
              </h2>
              <p className="text-sm text-gray-300 mb-8">
                This certificate is genuine and was issued by ISHAMI.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    <img src="/apple-touch-icon.png" alt="ISHAMI" className="w-9 h-9 object-contain" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">ISHAMI</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Digital Driving Education</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-1">Awarded to</p>
                <p className="text-2xl font-bold text-white uppercase mb-4">{cert.username}</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-gray-400">Certificate No.</span>
                    <span className="text-xs text-white font-mono ml-auto">{cert.certificateNo}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs text-gray-400">Program</span>
                    <span className="text-xs text-white ml-auto text-right">{cert.quizTitle}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-gray-400">Score</span>
                    <span className="text-xs text-white ml-auto">{cert.score}/{cert.totalQuestions} · {cert.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-xs text-gray-400">Issued</span>
                    <span className="text-xs text-white ml-auto">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>
                  {cert.expiresAt && (
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-xs text-gray-400">Valid until</span>
                      <span className="text-xs text-white ml-auto">{new Date(cert.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {!cert.passed && (
                <p className="text-xs text-amber-400 mb-4">Note: This certificate was issued for a score below the 70% pass threshold.</p>
              )}
            </div>
          </motion.div>
        )}

        {!loading && !isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl bg-[#1a1020] border border-red-500/20 p-10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <ShieldX className="w-11 h-11 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-3 font-[family-name:var(--font-heading)]">
              Certificate Not Found
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              {result?.message === 'Certificate not found'
                ? 'No ISHAMI certificate matches this number. Please double-check the certificate number.'
                : result?.valid === false && result?.message === 'Certificate not found'
                ? 'No ISHAMI certificate matches this number. Please double-check the certificate number.'
                : (result?.message || 'We could not verify this certificate right now.')}
            </p>
            <p className="text-xs text-gray-500 font-mono mb-8">
              {certificateNo}
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <KeyRound className="w-4 h-4" />
              Take a Quiz & Earn Your Certificate
            </Link>
          </motion.div>
        )}

        {!loading && (
          <p className="text-center text-[11px] text-gray-600 mt-8 flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Verified via the official ISHAMI platform · Powered by Ferrivox Ltd
          </p>
        )}
      </div>
    </div>
  );
}