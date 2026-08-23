import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Shield, Trophy, Download, ArrowLeft, CheckCircle2, Calendar, Hash, BarChart3, Award, FileText } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import directorSignature from '../assets/ferrivox.png';

interface CertificateData {
  id: string;
  userId: string;
  username: string;
  score: number;
  totalQuestions: number;
  quizTitle: string;
  issuedAt: string;
  expiresAt?: string;
  certificateNo: string;
  passed: boolean;
}

export default function Certificate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Load certificate data from localStorage or generate sample
    const stored = localStorage.getItem('latestCertificate');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCertData(parsed);
        // Fetch the certificate ID from the server
        fetchCertificateId(parsed.certificateNo);
      } catch {}
    }
  }, []);

  const fetchCertificateId = async (certNo: string) => {
    try {
      const token = localStorage.getItem('ishami.token');
      if (!token) return;
      const res = await fetch(`/api/certificates/verify/${certNo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.valid && data.certificate?.id) {
        setCertificateId(data.certificate.id);
      }
    } catch {}
  };

  const handleDownloadPDF = async () => {
    if (!certificateId || !user) return;
    setDownloading(true);
    try {
      const token = localStorage.getItem('ishami.token');
      const response = await fetch(`/api/certificate/${certificateId}.pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ISHAMI-Certificate-${certData?.certificateNo || 'download'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Fallback to print
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to view your certificate.</p>
          <button onClick={() => navigate('/auth')} className="px-6 py-3 bg-blue-500 text-white rounded-xl">
            Log In
          </button>
        </div>
      </div>
    );
  }

  const certificateNo = certData?.certificateNo || `ISH-TRU-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  const score = certData?.score || 87;
  const totalQuestions = certData?.totalQuestions || 20;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = certData?.passed ?? percentage >= 70;
  const quizTitle = certData?.quizTitle || 'Traffic Rules & Road Safety Understanding';
  const issuedDate = certData?.issuedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const expiresDate = certData?.expiresAt || (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  })();
  const displayName = certData?.username || user.username;

  const areasOfUnderstanding = [
    { icon: '⚠️', text: 'Road signs and their meanings' },
    { icon: '🚶', text: 'Pedestrian and cyclist safety' },
    { icon: '🛣️', text: 'Road markings and lane discipline' },
    { icon: '⚡', text: 'Speed limits and responsibility' },
    { icon: '🔺', text: 'Right of way and priority rules' },
    { icon: '🚗', text: 'Overtaking and safe distances' },
    { icon: '🚦', text: 'Traffic lights and signals' },
    { icon: '🌄', text: 'Rwanda road-safety principles' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto pt-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </motion.div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 30%, #0f2340 60%, #0a1628 100%)',
          }}
        >
          {/* Decorative border pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cert-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cert-pattern)" />
            </svg>
          </div>

          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <path d="M0 0L100 0L0 100Z" fill="#c9a84c" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <path d="M100 0L0 0L100 100Z" fill="#c9a84c" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <path d="M0 100L100 100L0 0Z" fill="#c9a84c" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <path d="M100 100L0 100L100 0Z" fill="#c9a84c" />
            </svg>
          </div>

          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  <img src="/apple-touch-icon.png" alt="ISHAMI" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-[family-name:var(--font-heading)]">ISHAMI</h1>
                  <p className="text-xs text-slate-400">Digital Driving Education & Assessment Platform</p>
                </div>
              </div>

              {/* Gold Seal */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-500/30 border-4 border-yellow-400/50">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-white mx-auto" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest mt-1 block">ISHAMI</span>
                    <span className="text-[7px] text-yellow-100 uppercase tracking-widest">CERTIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-yellow-500/50" />
                <div className="w-2 h-2 bg-yellow-500 rotate-45" />
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-500 tracking-wide font-[family-name:var(--font-heading)]">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-slate-300 mt-3 text-sm sm:text-base">This certificate is proudly presented to</p>
            </div>

            {/* Recipient Name */}
            <div className="text-center mb-8">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide font-[family-name:var(--font-heading)] uppercase">
                {displayName}
              </h3>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-yellow-500/50" />
                <div className="w-2 h-2 bg-yellow-500 rotate-45" />
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed text-sm sm:text-base">
              for successfully completing the <span className="text-yellow-400 font-semibold">{quizTitle}</span> Program
              and demonstrating satisfactory knowledge of traffic regulations, road signs, and safe road-user behavior.
            </p>

            {/* Two-column layout: Areas + Details */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              {/* Left: Areas of Understanding */}
              <div className="flex-1">
                <h4 className="text-center text-yellow-500 font-bold uppercase tracking-widest text-sm mb-6 font-[family-name:var(--font-heading)]">
                  Areas of Understanding
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {areasOfUnderstanding.map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <span className="text-xl shrink-0">{area.icon}</span>
                      <span className="text-slate-200 text-sm flex-1">{area.text}</span>
                      {passed && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Training Details */}
              <div className="w-full lg:w-72 shrink-0">
                <div className="space-y-4">
                  {/* Training Result */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Training Result</p>
                      <p className={`text-lg font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                        {passed ? 'PASS' : 'FAIL'}
                      </p>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Final Score</p>
                      <p className="text-lg font-bold text-white">{percentage}%</p>
                    </div>
                  </div>

                  {/* Training Level */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Training Level</p>
                      <p className="text-sm font-semibold text-white">Traffic Rules Understanding</p>
                    </div>
                  </div>

                  {/* Certificate No */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Hash className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Certificate No.</p>
                      <p className="text-sm font-bold text-white font-[family-name:var(--font-mono)]">{certificateNo}</p>
                    </div>
                  </div>

                  {/* Date Issued */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Calendar className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Date Issued</p>
                      <p className="text-sm font-semibold text-white">{issuedDate}</p>
                    </div>
                  </div>

                  {/* Valid Until */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <Calendar className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Valid Until</p>
                      <p className="text-sm font-semibold text-white">{expiresDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Certificate Verification</p>
                  <p className="text-sm text-slate-300">Certificate ID: <span className="text-white font-[family-name:var(--font-mono)] font-bold">{certificateNo}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Scan QR code or visit link to verify authenticity:</p>
                  <a
                    href={`https://ishami.rw/verify/${certificateNo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 font-[family-name:var(--font-mono)] underline underline-offset-2"
                  >
                    https://ishami.rw/verify/{certificateNo}
                  </a>
                </div>
              </div>

              {/* Real QR Code */}
              <div className="text-center">
                <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://ishami.rw/verify/${certificateNo}`)}&bgcolor=FFFFFF&color=000000&margin=10`}
                    alt="Certificate QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback: generate a simple SVG QR-like pattern
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-wider">Scan to Verify</p>
              </div>
            </div>

            {/* Authorized Signatures */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="mb-2 h-16 flex items-center justify-center">
                  <img
                    src={directorSignature}
                    alt="Managing Director Signature"
                    className="h-14 w-auto object-contain filter brightness-0 invert opacity-80"
                  />
                </div>
                <div className="h-px w-28 bg-white/30 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Managing Director</p>
                <p className="text-[9px] text-slate-400">ISHAMI Platform</p>
              </div>

              {/* ISHAMI Official Seal */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-yellow-500/50 flex items-center justify-center mx-auto mb-2 bg-yellow-500/5">
                  <div className="text-center">
                    <Award className="w-8 h-8 text-yellow-500 mx-auto" />
                    <span className="text-[7px] text-yellow-500 uppercase tracking-widest font-bold block mt-1">ISHAMI</span>
                    <span className="text-[6px] text-yellow-400/70 uppercase tracking-widest">CERTIFIED</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400">Safe Roads, Safe Lives</p>
                <p className="text-[9px] text-slate-400">Build a Better Rwanda</p>
              </div>

              <div className="text-center">
                <div className="mb-2 h-16 flex items-center justify-center">
                  <svg viewBox="0 0 140 40" className="w-32 h-12 mx-auto">
                    <path d="M10 32 C20 8, 35 35, 50 15 C60 5, 75 30, 90 12 C100 2, 115 28, 130 18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="h-px w-28 bg-white/30 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Assessment Officer</p>
                <p className="text-[9px] text-slate-400">ISHAMI Platform</p>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-[10px] text-slate-500 mt-6 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              This certificate can be electronically verified through the Ishami platform.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? (lang === 'en' ? 'Downloading...' : 'Gukurura...') : (lang === 'en' ? 'Download PDF Certificate' : 'Kurura Icyemezo PDF')}
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
          >
            View Leaderboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
