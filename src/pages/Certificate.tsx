import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState, useMemo } from 'react';
import AccessGate from '../components/AccessGate';
import { Shield, Trophy, Download, ArrowLeft, CheckCircle2, Calendar, Hash, BarChart3, ExternalLink, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { evaluateCertificateEligibility, type CertificateEligibility } from '../lib/certificateGate';

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
  const [downloading, setDownloading] = useState(false);
  const [gateState, setGateState] = useState<'loading' | 'ok' | 'blocked'>('loading');
  const [eligibility, setEligibility] = useState<CertificateEligibility | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('latestCertificate');
    if (stored) {
      try {
        setCertData(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Certificate gate — the certificate may only be seen / downloaded once the
  // learner has finished EVERY quiz and their average is ≥60%.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const elig = await evaluateCertificateEligibility();
      if (cancelled) return;
      setEligibility(elig);
      setGateState(elig.eligible ? 'ok' : 'blocked');
    })();
    return () => { cancelled = true; };
  }, []);

  // If the user is eligible but has no stored certificate (e.g. old session),
  // synthesize the display data from the overall average without re-issuing.
  const synthesizedCert = useMemo(() => {
    if (gateState !== 'ok' || certData || !eligibility) return null;
    const avg = eligibility.average;
    const issued = new Date();
    const expires = new Date(issued);
    expires.setFullYear(expires.getFullYear() + 1);
    return {
      id: 'local-synth',
      userId: user?.id || '',
      username: user?.username || 'ISHAMI Learner',
      score: avg,
      totalQuestions: 100,
      quizTitle: 'Traffic Rules & Road Safety',
      issuedAt: issued.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      expiresAt: expires.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificateNo: `ISH-TRU-${issued.getFullYear()}-LOCAL`,
      passed: true,
    } as CertificateData;
  }, [gateState, certData, eligibility, user?.id, user?.username]);

  const displayCert: CertificateData | null = certData || synthesizedCert;

  const certificateNo = displayCert?.certificateNo || `ISH-TRU-${new Date().getFullYear()}-000000`;
  const score = displayCert?.score || 60;
  const totalQuestions = displayCert?.totalQuestions || 100;
  const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
  const passed = displayCert?.passed ?? percentage >= 60;
  const quizTitle = displayCert?.quizTitle || 'Traffic Rules & Road Safety';
  const issuedDate = displayCert?.issuedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const expiresDate = displayCert?.expiresAt || (() => {
    const d = new Date(); d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  })();
  const displayName = displayCert?.username || user?.username || 'ISHAMI Learner';
  const verifyUrl = `https://ishami-final.vercel.app/verify/${certificateNo}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&bgcolor=FFFFFF&color=000000&margin=8`;

  const areasOfUnderstanding = [
    { icon: '⚠️', text: t('cert.areas.road_signs', 'Road signs and their meanings') },
    { icon: '🚶', text: t('cert.areas.pedestrian_safety', 'Pedestrian and cyclist safety') },
    { icon: '🛣️', text: t('cert.areas.road_markings', 'Road markings and lane discipline') },
    { icon: '⚡', text: t('cert.areas.speed_limits', 'Speed limits and responsibility') },
    { icon: '🔺', text: t('cert.areas.right_of_way', 'Right of way and priority rules') },
    { icon: '🚗', text: t('cert.areas.overtaking', 'Overtaking and safe distances') },
    { icon: '🚦', text: t('cert.areas.traffic_lights', 'Traffic lights and signals') },
    { icon: '🌄', text: t('cert.areas.road_safety', 'Rwanda road-safety principles') },
  ];

  const handleDownloadPDF = async () => {
    if (gateState !== 'ok') {
      // Should never be reachable (button hidden when blocked) — safety net.
      return;
    }
    try {
      setDownloading(true);
      const { default: jsPDF } = await import('jspdf');

      // Convert a same-origin asset into a data URL so it can be embedded in the
      // PDF — used to stamp the real ISHAMI logo onto the certificate.
      const toDataUrl = async (src: string) => {
        const resp = await fetch(src);
        const blob = await resp.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      };

      let logoDataUrl: string | null = null;
      try { logoDataUrl = await toDataUrl('/apple-touch-icon.png'); } catch { /* fallback to drawn mark below */ }

      // Create landscape A4 PDF
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageW = 297;
      const pageH = 210;

      // Background
      pdf.setFillColor(10, 22, 40);
      pdf.rect(0, 0, pageW, pageH, 'F');

      // Gold border
      pdf.setDrawColor(201, 168, 76);
      pdf.setLineWidth(1);
      pdf.rect(8, 8, pageW - 16, pageH - 16);
      pdf.setLineWidth(0.5);
      pdf.rect(12, 12, pageW - 24, pageH - 24);

      // Gold corner triangles
      pdf.setFillColor(201, 168, 76);
      // Top-left
      pdf.triangle(8, 8, 35, 8, 8, 35, 'F');
      // Top-right
      pdf.triangle(pageW - 8, 8, pageW - 35, 8, pageW - 8, 35, 'F');
      // Bottom-left
      pdf.triangle(8, pageH - 8, 35, pageH - 8, 8, pageH - 35, 'F');
      // Bottom-right
      pdf.triangle(pageW - 8, pageH - 8, pageW - 35, pageH - 8, pageW - 8, pageH - 35, 'F');

      // ISHAMI logo — embed the real logo image (white tile with gold border,
      // matching the certificate shown on the website).
      if (logoDataUrl) {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(201, 168, 76);
        pdf.setLineWidth(0.6);
        pdf.roundedRect(36, 12, 25, 25, 3, 3, 'FD');
        pdf.addImage(logoDataUrl, 'PNG', 38, 14, 21, 21);
      } else {
        // Fallback: gold monogram tile if the logo image could not be loaded
        pdf.setFillColor(201, 168, 76);
        pdf.roundedRect(36, 12, 25, 25, 3, 3, 'F');
        pdf.setTextColor(10, 22, 40);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('ISHAMI', 48.5, 28, { align: 'center' });
      }
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ISHAMI', 68, 26);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      pdf.text('Digital Driving Education & Assessment Platform', 68, 32);

      // Gold Seal
      pdf.setFillColor(201, 168, 76);
      pdf.circle(pageW - 30, 30, 14, 'F');
      pdf.setFillColor(10, 22, 40);
      pdf.circle(pageW - 30, 30, 11, 'F');
      pdf.setFillColor(201, 168, 76);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ISHAMI', pageW - 30, 29, { align: 'center' });
      pdf.setFontSize(5);
      pdf.text('CERTIFIED', pageW - 30, 33, { align: 'center' });

      // Decorative line
      pdf.setDrawColor(201, 168, 76);
      pdf.setLineWidth(0.3);
      pdf.line(60, 42, pageW - 60, 42);

      // Title
      pdf.setTextColor(201, 168, 76);
      pdf.setFontSize(26);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CERTIFICATE OF COMPLETION', pageW / 2, 55, { align: 'center' });

      // Presented to
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This certificate is proudly presented to', pageW / 2, 65, { align: 'center' });

      // Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(displayName.toUpperCase(), pageW / 2, 80, { align: 'center' });

      // Decorative line under name
      pdf.setDrawColor(201, 168, 76);
      pdf.line(80, 85, pageW - 80, 85);

      // Description
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const descText = `for successfully completing the ${quizTitle} Program and demonstrating satisfactory knowledge of traffic regulations, road signs, and safe road-user behavior.`;
      const descLines = pdf.splitTextToSize(descText, 200);
      pdf.text(descLines, pageW / 2, 95, { align: 'center' });

      // Areas of Understanding - left side
      const areasY = 110;
      pdf.setTextColor(201, 168, 76);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AREAS OF UNDERSTANDING', 40, areasY);

      // PDF-safe area rows: standard fonts cannot draw emoji/check glyphs, so use
      // plain bullets and a drawn marker instead of the emoji icons shown on screen.
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      areasOfUnderstanding.forEach((area, i) => {
        const y = areasY + 6 + (i * 6);
        if (y < pageH - 40) {
          pdf.text(`• ${area.text}`, 40, y);
          // Checkmark marker
          pdf.setFillColor(34, 197, 94);
          pdf.circle(160, y - 1, 1.4, 'F');
          pdf.setTextColor(200, 200, 200);
        }
      });

      // Right side - Details
      const detailsX = 180;
      pdf.setTextColor(201, 168, 76);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CERTIFICATE DETAILS', detailsX, areasY);

      const details = [
        ['Result', passed ? 'PASS' : 'FAIL'],
        ['Final Score', `${percentage}%`],
        ['Certificate No.', certificateNo],
        ['Date Issued', issuedDate],
        ['Valid Until', expiresDate],
      ];

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      details.forEach(([label, value], i) => {
        const y = areasY + 7 + (i * 7);
        if (y < pageH - 40) {
          pdf.setTextColor(148, 163, 184);
          pdf.text(label, detailsX, y);
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.text(value, detailsX, y + 4);
          pdf.setFont('helvetica', 'normal');
        }
      });

      // QR Code section
      const qrX = pageW - 55;
      const qrY = areasY + 5;
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(qrX - 2, qrY - 2, 30, 30, 2, 2, 'F');
      // Load QR code image
      try {
        const qrImg = await fetch(qrCodeUrl);
        const qrBlob = await qrImg.blob();
        const qrDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(qrBlob);
        });
        pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, 26, 26);
      } catch {
        // Fallback: just show URL
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(5);
        pdf.text('QR Code', qrX + 13, qrY + 15, { align: 'center' });
      }

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(6);
      pdf.text('Scan to Verify', qrX + 13, qrY + 33, { align: 'center' });

      // Verification footer
      pdf.setDrawColor(201, 168, 76);
      pdf.setLineWidth(0.3);
      pdf.line(20, pageH - 25, pageW - 20, pageH - 25);

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      pdf.text(`Verify at: ${verifyUrl}`, pageW / 2, pageH - 18, { align: 'center' });

      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(6);
      pdf.text(`© ${new Date().getFullYear()} ISHAMI · Powered by Ferrivox Ltd`, pageW / 2, pageH - 12, { align: 'center' });

      pdf.save(`ISHAMI-Certificate-${certificateNo}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AccessGate
      requiredTier="full"
      title={t('cert.access_gate.title', 'Certificate Requires Full Access')}
      description={t('cert.access_gate.description', 'Upgrade to Full Access (3,000 RWF) to earn your Certificate of Completion.')}
    >
    {gateState === 'loading' ? (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">{t('cert.gate.checking', 'Checking certificate eligibility…')}</p>
        </div>
      </div>
    ) : gateState === 'blocked' ? (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-lg mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10"
          >
            <div className="inline-flex p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <Lock className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
              {t('cert.gate.title', 'Finish All Quizzes First')}
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('cert.gate.description', 'Your certificate unlocks once you have completed every quiz with an average of 60% or higher.')}
            </p>
            {eligibility && eligibility.total > 0 && (
              <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{t('cert.gate.progress_quizzes', 'Quizzes completed')}</span>
                  <span className="text-white font-medium">{eligibility.finished}/{eligibility.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style={{ width: `${Math.round((eligibility.finished / Math.max(1, eligibility.total)) * 100)}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{t('cert.gate.progress_average', 'Your average')}</span>
                  <span className={`font-medium ${eligibility.average >= 60 ? 'text-emerald-400' : 'text-yellow-400'}`}>{eligibility.average}%</span>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/quiz')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              {t('cert.gate.cta', 'Go to Quizzes')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    ) : (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto pt-16">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('cert.back_button', 'Back')}</span>
          </button>
        </motion.div>

        {/* Certificate Card */}
        <motion.div
          id="certificate-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 30%, #0f2340 60%, #0a1628 100%)' }}
        >
          {/* Gold border */}
          <div className="absolute inset-2 border border-yellow-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 border border-yellow-500/10 rounded-xl pointer-events-none" />

          {/* Corner accents */}
          {[
            'top-0 left-0', 'top-0 right-0 rotate-90',
            'bottom-0 left-0 -rotate-90', 'bottom-0 right-0 rotate-180'
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-20 h-20 opacity-20`}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0 0L100 0L0 100Z" fill="#c9a84c" />
              </svg>
            </div>
          ))}

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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-500/30 border-4 border-yellow-400/50">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-white mx-auto" />
                  <span className="text-[7px] font-bold text-white uppercase tracking-widest mt-0.5 block">ISHAMI</span>
                  <span className="text-[6px] text-yellow-100 uppercase tracking-widest">CERTIFIED</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-yellow-500/50" />
                <div className="w-2 h-2 bg-yellow-500 rotate-45" />
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 tracking-wide font-[family-name:var(--font-heading)]">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-slate-300 mt-2 text-sm">This certificate is proudly presented to</p>
            </div>

            {/* Name */}
            <div className="text-center mb-6">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide font-[family-name:var(--font-heading)] uppercase">
                {displayName}
              </h3>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-yellow-500/50" />
                <div className="w-2 h-2 bg-yellow-500 rotate-45" />
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-yellow-500/50" />
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed text-sm">
              {t('cert.description', 'for successfully completing the {quizTitle} Program and demonstrating satisfactory knowledge of traffic regulations, road signs, and safe road-user behavior.').replace('{quizTitle}', quizTitle)}
            </p>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Areas */}
              <div className="flex-1">
                <h4 className="text-center text-yellow-500 font-bold uppercase tracking-widest text-xs mb-4">
                  {t('cert.areasTitle', 'Areas of Understanding')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {areasOfUnderstanding.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-sm shrink-0">{area.icon}</span>
                      <span className="text-slate-200 text-xs flex-1">{area.text}</span>
                      {passed && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="w-full lg:w-64 shrink-0 space-y-3">
                {[
                  { icon: <Trophy className="w-4 h-4 text-yellow-400" />, label: 'Result', value: passed ? 'PASS' : 'FAIL', color: passed ? 'text-green-400' : 'text-red-400', bg: 'bg-yellow-500/20' },
                  { icon: <BarChart3 className="w-4 h-4 text-blue-400" />, label: 'Final Score', value: `${percentage}%`, color: 'text-white', bg: 'bg-blue-500/20' },
                  { icon: <Hash className="w-4 h-4 text-emerald-400" />, label: 'Certificate No.', value: certificateNo, color: 'text-white', bg: 'bg-emerald-500/20', mono: true },
                  { icon: <Calendar className="w-4 h-4 text-orange-400" />, label: 'Date Issued', value: issuedDate, color: 'text-white', bg: 'bg-orange-500/20' },
                  { icon: <Calendar className="w-4 h-4 text-red-400" />, label: 'Valid Until', value: expiresDate, color: 'text-white', bg: 'bg-red-500/20' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className={`p-1.5 rounded-lg ${item.bg}`}>{item.icon}</div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{item.label}</p>
                      <p className={`text-xs font-bold ${item.color} ${item.mono ? 'font-[family-name:var(--font-mono)]' : ''}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification + QR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Certificate Verification</p>
                  <p className="text-xs text-slate-300">ID: <span className="text-white font-[family-name:var(--font-mono)] font-bold">{certificateNo}</span></p>
                  <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 font-[family-name:var(--font-mono)] underline underline-offset-2 flex items-center gap-1 mt-1">
                    {verifyUrl} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">Scan to Verify</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-[10px] text-slate-500 italic">
                This certificate can be electronically verified at ishami-final.vercel.app/verify
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Generating PDF...' : 'Download PDF Certificate'}
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </button>
        </motion.div>
      </div>
    </div>
    )}
    </AccessGate>
  );
}
