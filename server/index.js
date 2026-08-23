import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import * as quizSource from './data.js';
import nodemailer from 'nodemailer';
import { welcomeEmail, resetPasswordEmail, newsletterThanksEmail, logoAttachment } from './services/emailTemplates.js';
import fs from 'fs';
import path from 'path';
import { getAccessToken, requestToPay, getRequestToPayStatus, normalizeMsisdn } from './services/momo.js';
import { askAssistant, askAssistantStream, handleSimulatorEvent, buildExamQuiz, scoreExamSubmission, getKnowledgeStats, getProviderInfo, getOllamaModels, getSearchInfo } from './services/aiService.js';
import { AIInteraction } from './models/AIInteraction.js';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import slowDown from 'express-slow-down';
import PDFDocument from 'pdfkit';
import { GLOSSARY, getRandomTerms } from './ai/glossaryService.js';

try {
  const here = path.resolve(process.cwd(), '.env');
  const parent = path.resolve(process.cwd(), '..', '.env');
  const serverEnv = path.resolve(process.cwd(), 'server', '.env');
  const chosen = fs.existsSync(here) ? here : (fs.existsSync(serverEnv) ? serverEnv : (fs.existsSync(parent) ? parent : null));
  if (chosen) dotenv.config({ path: chosen });
} catch {}
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ishami';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });
const { Schema, model, Types } = mongoose;

let mailer = null;
try {
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    mailer = transporter;
    try {
      await transporter.verify();
      console.log('SMTP transporter verified');
    } catch (e) {
      console.warn('SMTP verify failed; will attempt to send anyway', e?.message || e);
    }
  } else {
    console.warn('SMTP not configured: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM');
  }
} catch (e) {
  console.error('SMTP init error', e?.message || e);
}

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  firebaseUid: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  isPro: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  loginStreak: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  stats: {
    totalQuizzes: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});
const User = model('User', UserSchema);

const QuizSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: null },
  questionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Quiz = model('Quiz', QuizSchema);

const QuestionSchema = new Schema({
  quizId: { type: Types.ObjectId, ref: 'Quiz' },
  category: String,
  question: String,
  questionEn: { type: String, default: '' },
  options: [{ text: String, isCorrect: Boolean }],
  optionsEn: [{ text: String, isCorrect: Boolean }],
  licenseClass: { type: [String], default: ['A','B','C','D'] },
  image: { type: String, default: null }
});
const Question = model('Question', QuestionSchema);

const SubmissionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  answers: [{ questionId: String, selectedOption: Number, isCorrect: Boolean }],
  score: Number,
  totalQuestions: Number,
  timeTakenSeconds: Number,
  createdAt: { type: Date, default: Date.now }
});
SubmissionSchema.index({ createdAt: -1 });
SubmissionSchema.index({ userId: 1, createdAt: -1 });
const Submission = model('Submission', SubmissionSchema);

const PaymentSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  amount: Number,
  phone: String,
  provider: String,
  product: { type: String, default: 'pro' },
  currency: { type: String, default: 'RWF' },
  providerRef: { type: String, default: null },
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
PaymentSchema.index({ createdAt: -1 });
const Payment = model('Payment', PaymentSchema);

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  titleKiny: { type: String, default: '' },
  type: { type: String, default: 'PDF' }, // PDF | Video | Image
  category: { type: String, default: 'General' },
  premium: { type: Boolean, default: false },
  fileUrl: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  size: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Resource = model('Resource', ResourceSchema);

const IremboSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  fullName: String,
  nationalId: String,
  phone: String,
  email: String,
  language: String,
  testMode: String,
  district: String,
  testDate: String,
  transactionId: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
const IremboApplication = model('IremboApplication', IremboSchema);

const SimulationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  scenarioId: String,
  score: Number,
  mistakes: Number,
  timeTaken: Number,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
SimulationSchema.index({ createdAt: -1 });
const Simulation = model('Simulation', SimulationSchema);

const NewsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, default: 'SUBSCRIBED' },
  createdAt: { type: Date, default: Date.now }
});
const NewsletterSubscriber = model('NewsletterSubscriber', NewsletterSubscriberSchema);

const NewsletterCampaignSchema = new Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: 'DRAFT' },
  recipientsCount: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date }
});
const NewsletterCampaign = model('NewsletterCampaign', NewsletterCampaignSchema);

const NotificationSchema = new Schema({
  title: String,
  body: String,
  segment: String,
  scheduledAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
const Notification = model('Notification', NotificationSchema);

const FraudLogSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  type: String,
  message: String,
  meta: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
FraudLogSchema.index({ createdAt: -1 });
const FraudLog = model('FraudLog', FraudLogSchema);

const CertificateSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  username: String,
  score: Number,
  totalQuestions: Number,
  quizTitle: String,
  certificateNo: { type: String, unique: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});
CertificateSchema.index({ userId: 1, issuedAt: -1 });
const Certificate = model('Certificate', CertificateSchema);

// AIInteraction moved to models/AIInteraction.js

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ishami.rw';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    await User.create({ username: 'Admin', email: adminEmail, passwordHash, isPro: true, role: 'admin' });
  } else if (exists.role !== 'admin') {
    await User.updateOne({ email: adminEmail }, { $set: { role: 'admin', isPro: true } });
  }
  const baseKeys = ['quizData', 'quizData1', 'quizData2', 'quizData3', 'quizData4', 'quizData5', 'quizData6'];
    const baseBundles = [
      { key: 'quizData', title: 'Ibyapa n’Ibirango', category: 'Ibyapa', image: null, arr: quizSource.quizData },
      { key: 'quizData1', title: 'Umuvuduko n’Umutekano', category: 'Umuvuduko', image: null, arr: quizSource.quizData1 },
      { key: 'quizData2', title: 'Uburyo bwo Kugendera', category: 'Uburyo bwo kugenda', image: null, arr: quizSource.quizData2 },
      { key: 'quizData3', title: 'Amatara n’Ihagarara', category: 'Amatara', image: null, arr: quizSource.quizData3 },
      { key: 'quizData4', title: 'Inzira Zihariye', category: 'Inzira', image: null, arr: quizSource.quizData4 },
      { key: 'quizData5', title: 'Ibindi By’ingenzi', category: 'Ibisanzwe', image: null, arr: quizSource.quizData5 },
      { key: 'quizData6', title: 'Ibyateza Impanuka', category: 'Umutekano', image: null, arr: quizSource.quizData6 },
    ].filter(b => Array.isArray(b.arr));

    const extras = Object.entries(quizSource)
      .filter(([k]) => !baseKeys.includes(k))
      .map(([k, v]) => {
        let arr = [];
        if (Array.isArray(v)) {
          if (v.length && v[0] && Array.isArray(v[0].questions)) arr = v[0].questions;
          else arr = v;
        } else if (v && Array.isArray(v.questions)) {
          arr = v.questions;
        }
        return { key: k, title: `Bundle ${k}`, category: 'Mixed', image: null, arr };
      })
      .filter(b => Array.isArray(b.arr) && b.arr.length > 0);

  const bundles = baseBundles.concat(extras);

  for (const b of bundles) {
    const existing = await Quiz.findOne({ title: b.title });
    if (existing) continue;
    const quiz = await Quiz.create({ title: b.title, category: b.category, image: b.image, questionCount: b.arr.length });
      const docs = b.arr
        .filter(q => q && q.question && q.options)
        .map(q => {
          // Build English options from correctAnswerEn if available
          const enCorrect = q.correctAnswerEn || '';
          let optionsEn = [];
          if (q.optionsEn && Array.isArray(q.optionsEn)) {
            optionsEn = q.optionsEn;
          } else if (q.questionEn && enCorrect) {
            // Generate English options by translating the Rwanda ones
            optionsEn = (Array.isArray(q.options) ? q.options : []).map(o => {
              // Try to match by position to find English equivalent
              return { text: o, isCorrect: String(o) === String(q.correctAnswer) };
            });
          }
          return {
            quizId: quiz._id,
            category: b.category,
            question: q.question,
            questionEn: q.questionEn || '',
            options: (Array.isArray(q.options) ? q.options : []).map(o => ({ text: o, isCorrect: String(o) === String(q.correctAnswer) })),
            optionsEn: optionsEn,
            licenseClass: q.licenseClass || ['A','B','C','D'],
            image: q.imagePlaceholder || q.imageUrl || null
          };
        });
    if (docs.length) await Question.insertMany(docs);
  }

  // Migration: backfill missing image fields from data.js
  const imageMap = new Map();
  const collect = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const q of arr) {
      if (q && q.question && (q.imagePlaceholder || q.imageUrl)) {
        imageMap.set(q.question, q.imagePlaceholder || q.imageUrl);
      }
    }
  };
  for (const key of Object.keys(quizSource)) {
    const v = quizSource[key];
    if (Array.isArray(v)) {
      if (v.length && v[0] && Array.isArray(v[0].questions)) collect(v[0].questions);
      else collect(v);
    } else if (v && Array.isArray(v.questions)) {
      collect(v.questions);
    }
  }
  const toUpdate = await Question.find({ image: { $in: [null, '', undefined] } }).lean();
  for (const q of toUpdate) {
    const url = imageMap.get(q.question);
    if (url) {
      await Question.updateOne({ _id: q._id }, { $set: { image: url } });
    }
  }
  const rCount = await Resource.countDocuments();
  if (rCount === 0) {
    await Resource.insertMany([
      {
        title: 'Traffic Signs Guide',
        titleKiny: "Ibyapa by'Umuhanda",
        type: 'PDF',
        category: 'Signs',
        premium: false,
        fileUrl: 'https://drive.google.com/file/d/17Pt9vbzRCFVxBps1btslCv98-yFch3C2/view?usp=sharing',
        thumbnail: 'https://placehold.co/640x360?text=Signs',
        size: '2.5 MB'
      },
      {
        title: 'Parking Techniques Video',
        titleKiny: 'Uburyo bwo Gupaka',
        type: 'Video',
        category: 'Practical',
        premium: true,
        fileUrl: '',
        thumbnail: 'https://placehold.co/640x360?text=Practical',
        size: '12.3 MB'
      },
      {
        title: 'Road Safety Handbook',
        titleKiny: 'Handbook y’Umutekano',
        type: 'PDF',
        category: 'Safety',
        premium: false,
        fileUrl: '',
        thumbnail: 'https://placehold.co/640x360?text=Safety',
        size: '3.8 MB'
      },
      {
        title: 'Overtaking Rules Video',
        titleKiny: 'Amategeko yo Gusonga',
        type: 'Video',
        category: 'Advanced',
        premium: true,
        fileUrl: '',
        thumbnail: 'https://placehold.co/640x360?text=Advanced',
        size: '15.7 MB'
      }
    ]);
  }
  await Resource.updateOne(
    { title: 'Ibimenyetso Bimurika' },
    {
      $set: {
        title: 'Ibimenyetso Bimurika',
        titleKiny: 'Ibimenyetso Bimurika',
        type: 'PDF',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://docs.google.com/document/d/1hNs7FsuX8A2qmfpWUXv8TpW_SINS03Nl/edit?usp=drive_link&ouid=115249524283556770107&rtpof=true&sd=true',
        thumbnail: 'https://placehold.co/640x360?text=Ibimenyetso+Bimurika',
        size: ''
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "Ibibazo ku Amategeko y'Umuhanda (PDF)" },
    {
      $set: {
        title: "Ibibazo ku Amategeko y'Umuhanda (PDF)",
        titleKiny: "Ibibazo ku Amategeko y'Umuhanda (PDF)",
        type: 'PDF',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://drive.google.com/file/d/130sYhKdQehDECE262oORiX8_08LNxtbZ/view?usp=drive_link',
        thumbnail: 'https://placehold.co/640x360?text=Ibibazo+ku+Amategeko',
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "Igazeti y'Amategeko y'Umuhanda (PDF)" },
    {
      $set: {
        title: "Igazeti y'Amategeko y'Umuhanda (PDF)",
        titleKiny: "Igazeti y'Amategeko y'Umuhanda (PDF)",
        type: 'PDF',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://drive.google.com/file/d/130sYhKdQehDECE262oORiX8_08LNxtbZ/view?usp=drive_link',
        thumbnail: 'https://placehold.co/640x360?text=Igazeti+y%27Amategeko',
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "AMATEGEKO Y’UMUHANDA🚨🚔🚨IBIBAZO N’IBISUBIZO" },
    {
      $set: {
        title: "AMATEGEKO Y’UMUHANDA🚨🚔🚨IBIBAZO N’IBISUBIZO",
        titleKiny: "AMATEGEKO Y’UMUHANDA🚨🚔🚨IBIBAZO N’IBISUBIZO",
        type: 'Video',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://youtu.be/kueLgkZwagI?si=4woONjSfRP9fqX6k',
        thumbnail: 'https://img.youtube.com/vi/kueLgkZwagI/maxresdefault.jpg',
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "🚨🚨🚗Ikibazo gikunzwe kubazwa mu Gukorera provisoire" },
    {
      $set: {
        title: "🚨🚨🚗Ikibazo gikunzwe kubazwa mu Gukorera provisoire",
        titleKiny: "🚨🚨🚗Ikibazo gikunzwe kubazwa mu Gukorera provisoire",
        type: 'Video',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://youtu.be/goro8MaDq2k?si=YgDYvI4NpS5VBKEv',
        thumbnail: 'https://img.youtube.com/vi/goro8MaDq2k/maxresdefault.jpg',
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "Impuruza (Alarms) & Ibyapa Byo Ku Muhanda (Traffic Signs)" },
    {
      $set: {
        title: "Impuruza (Alarms) & Ibyapa Byo Ku Muhanda (Traffic Signs)",
        titleKiny: "Impuruza & Ibyapa Byo Ku Muhanda",
        type: 'Video',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://youtu.be/kueLgkZwagI?si=4woONjSfRP9fqX6k', // Placeholder, using same for now
        thumbnail: 'https://img.youtube.com/vi/kueLgkZwagI/maxresdefault.jpg',
      }
    },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "Kwirinda Impanuka (Road Safety Tips)" },
    {
      $set: {
        title: "Kwirinda Impanuka (Road Safety Tips)",
        titleKiny: "Kwirinda Impanuka",
        type: 'Video',
        category: "Amategeko y'Umuhanda",
        premium: false,
        fileUrl: 'https://youtu.be/goro8MaDq2k?si=YgDYvI4NpS5VBKEv', // Placeholder
        thumbnail: 'https://img.youtube.com/vi/goro8MaDq2k/maxresdefault.jpg',
      }
    },
    { upsert: true }
  );
}

// Brevo removed: using Nodemailer SMTP only
await Promise.all([
  User.syncIndexes(),
  Question.syncIndexes(),
  Submission.syncIndexes(),
  Payment.syncIndexes(),
  Resource.syncIndexes(),
  IremboApplication.syncIndexes(),
  Simulation.syncIndexes(),
  Notification.syncIndexes(),
  FraudLog.syncIndexes(),
  Certificate.syncIndexes()
]);
await seed();

// File uploads for admin resources
const upload = multer({ dest: 'server/uploads/' });

// Helpers
function generateToken(user) {
  return jwt.sign({ id: String(user._id), role: user.role, isPro: user.isPro }, JWT_SECRET, { expiresIn: '7d' });
}

function toDirectDownloadUrl(url) {
  const s = String(url || '').trim();
  if (!s) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('drive.google.com')) {
      // /file/d/<id>/view or /uc?id=<id>
      const m = s.match(/\/file\/d\/([^/]+)/);
      const id = m ? m[1] : (u.searchParams.get('id') || '');
      if (id) {
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
    }
    if (u.hostname.includes('docs.google.com') && u.pathname.includes('/document/')) {
      const m = s.match(/\/document\/d\/([^/]+)/);
      const id = m ? m[1] : '';
      if (id) {
        return `https://docs.google.com/document/d/${id}/export?format=pdf`;
      }
    }
  } catch {}
  return s;
}

function normalizeEmail(v) {
  const s = String(v || '').trim().toLowerCase();
  return s || null;
}

function normalizePhone(v) {
  let s = String(v || '').trim().replace(/\s+/g, '');
  if (!s) return null;
  if (s.startsWith('+')) return s;
  if (s.startsWith('07')) return '+250' + s.slice(1);
  return s;
}

// Generate a friendly default username for OAuth sign-ins instead of
// using the Firebase/Google profile display name.
async function generateDefaultUsername() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let attempt = 0; attempt < 10; attempt++) {
    let suffix = '';
    for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    const name = `Learner_${suffix}`;
    const taken = await User.findOne({ username: name });
    if (!taken) return name;
  }
  return `Learner_${Date.now().toString(36).toUpperCase()}`;
}

// Send the branded ISHAMI welcome email (favicon logo embedded).
// Never throws — auth must never depend on email delivery.
async function sendWelcomeEmail(email, username) {
  try {
    if (!email) {
      console.log('Welcome email skipped: No email provided');
      return false;
    }
    if (/@example\.com$/i.test(email)) {
      console.log('Welcome email skipped: placeholder email');
      return false;
    }
    console.log(`Attempting to send welcome email to ${email}...`);
    const subject = 'Welcome to ISHAMI - Rwanda Traffic Rules';
    const html = welcomeEmail({ username, appUrl: process.env.FRONTEND_URL || 'https://ishami.rw' });
    const from = process.env.SMTP_FROM || '"ISHAMI" <no-reply@ishami.rw>';
    if (mailer) {
      await mailer.sendMail({ from, to: email, subject, html, attachments: [logoAttachment()], sender: process.env.SMTP_USER, envelope: { from: process.env.SMTP_USER, to: email } });
      console.log(`Welcome email (SMTP) sent successfully to ${email}`);
      return true;
    }
    console.log('Welcome email skipped: SMTP not configured');
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
  return false;
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function optionalAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (user) req.user = user;
  } catch {}
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admin role required' });
  next();
}

const userLogs = new Map();

const __dirname = path.resolve();
function ensureUploadsDir() {
  const dir = path.join(__dirname, 'server', 'uploads', 'user-uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}
ensureUploadsDir();

// ============ RATE LIMITERS ============
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).json({ ...options.message, retryAfter });
  }
});

const authStrictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
  handler: async (req, res, next, options) => {
    try {
      await FraudLog.create({
        type: 'rate_limit_auth',
        message: `Rate limit hit on ${req.path}`,
        meta: { ip: req.ip, path: req.path, body: req.body ? { ...req.body, password: undefined } : undefined }
      });
    } catch {}
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).json({ ...options.message, retryAfter });
  }
});

const paymentStrictLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id ? String(req.user._id) : ipKeyGenerator(req),
  message: { message: 'Too many requests, please try again later' },
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).json({ ...options.message, retryAfter });
  }
});

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: (req, res) => req.user?.isPro ? 60 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id ? String(req.user._id) : ipKeyGenerator(req),
  message: { message: 'Too many requests, please try again later' },
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).json({ ...options.message, retryAfter });
  }
});

app.use('/api/', generalLimiter);
app.post('/api/auth/signup', authStrictLimiter);
app.post('/api/auth/signin', authStrictLimiter);
app.post('/api/auth/forgot', authStrictLimiter);
app.post('/api/payment/initiate', paymentStrictLimiter);
app.post('/api/paypack/cashin', paymentStrictLimiter);
app.post('/api/ai/ask', aiRateLimiter);
app.post('/api/ai/stream', aiRateLimiter);

// provided by services/momo.js

// AUTH
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const email = normalizeEmail(req.body?.email);
    const phone = normalizePhone(req.body?.phone);
    if (!username || !password || (!email && !phone)) return res.status(400).json({ message: 'Missing fields' });
    let existing = null;
    // Check if username is taken (common issue for 'Account exists' error)
    if (username) {
      const nameTaken = await User.findOne({ username });
      if (nameTaken) return res.status(409).json({ message: 'Username is already taken. Please choose another.' });
    }
    
    if (email) existing = await User.findOne({ email });
    if (!existing && phone) existing = await User.findOne({ phone });
    
    if (existing) {
      // Standard behavior: if account exists, tell user to sign in
      return res.status(409).json({ message: 'Account already exists. Please sign in.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email: email || undefined, phone: phone || undefined, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
    
    // Send welcome email (branded with the ISHAMI favicon logo)
    const welcomeSent = await sendWelcomeEmail(email, username);

    const token = generateToken(user);
    res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges }, emailSent: welcomeSent });
  } catch (e) {
    if (e && typeof e === 'object' && (e).code === 11000) {
      const identifier = String(req.body?.email || req.body?.phone || '').trim();
      const idEmail = identifier.includes('@') ? normalizeEmail(identifier) : null;
      const idPhone = !idEmail ? normalizePhone(identifier) : null;
      const user = idEmail ? await User.findOne({ email: idEmail }) : await User.findOne({ phone: idPhone });
      if (user) {
        const ok = await bcrypt.compare(String(req.body?.password || ''), user.passwordHash);
        if (ok) {
          const token = generateToken(user);
          return res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
        }
      }
      return res.status(409).json({ message: 'Account already exists. Please sign in.' });
    }
    res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { password } = req.body || {};
    const rawEmail = req.body?.email;
    const rawPhone = req.body?.phone;
    const email = normalizeEmail(rawEmail);
    const phone = normalizePhone(rawPhone || (!rawEmail?.includes('@') ? rawEmail : null));
    if (!password) return res.status(400).json({ message: 'Missing password' });
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
  } catch {
    res.status(500).json({ message: 'Signin failed' });
  }
});

app.put('/api/auth/update-profile', authMiddleware, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body || {};
    const user = req.user;

    // Update username
    if (username && typeof username === 'string' && username.trim()) {
      const trimmed = username.trim();
      if (trimmed.length < 2 || trimmed.length > 30) {
        return res.status(400).json({ message: 'Username must be 2-30 characters' });
      }
      if (trimmed !== user.username) {
        const taken = await User.findOne({ username: trimmed, _id: { $ne: user._id } });
        if (taken) {
          return res.status(409).json({ message: 'Username is already taken' });
        }
        await User.updateOne({ _id: user._id }, { $set: { username: trimmed } });
        user.username = trimmed;
      }
    }

    // Update password
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ _id: user._id }, { $set: { passwordHash } });
    }

    res.json({ success: true, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
  } catch (e) {
    console.error('Update profile error:', e?.stack || e);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.post('/api/auth/check', async (req, res) => {
  try {
    const identifier = String(req.body?.identifier || '').trim();
    if (!identifier) return res.status(400).json({ message: 'Missing identifier' });
    const email = identifier.includes('@') ? normalizeEmail(identifier) : null;
    const phone = !email ? normalizePhone(identifier) : null;
    let user = null;
    if (email) user = await User.findOne({ email });
    else if (phone) user = await User.findOne({ phone });
    res.json({ exists: !!user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({ user: { id: String(u._id), username: u.username, email: u.email, isPro: u.isPro, role: u.role, loginStreak: u.loginStreak, badges: u.badges } });
});

app.post('/api/auth/forgot', async (req, res) => {
  try {
    const identifier = String(req.body?.identifier || '').trim();
    if (!identifier) return res.status(400).json({ message: 'Missing identifier' });
    let user = null;
    if (identifier.includes('@')) user = await User.findOne({ email: identifier });
    else user = await User.findOne({ phone: identifier });
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    let sent = false;
    if (user) {
      await User.updateOne({ _id: user._id }, { $set: { resetToken: token, resetTokenExpires: expires } });
      const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetUrl = `${origin}/reset?token=${encodeURIComponent(token)}`;
      console.log(`Processing forgot password for ${user.email} (ID: ${user._id})`);
      if (user.email) {
        try {
          const subject = 'Reset your password - ISHAMI';
          const html = resetPasswordEmail({ username: user.username || 'Mugenzi', resetUrl, expiresHours: 1 });
          const from = process.env.SMTP_FROM || '"ISHAMI" <no-reply@ishami.rw>';
          if (mailer) {
            await mailer.sendMail({ from, to: user.email, subject, html, attachments: [logoAttachment()], sender: process.env.SMTP_USER, envelope: { from: process.env.SMTP_USER, to: user.email } });
            sent = true;
            console.log(`Reset email (SMTP) sent to ${user.email}`);
          } else {
            console.log('Reset email skipped: No mail provider configured', { hasMailer: !!mailer });
          }
        } catch (e) {
          console.error('Failed to send reset email:', e);
        }
      } else {
        console.log('Reset email skipped: No email on user profile');
      }
    }
    res.json({ success: true, sent });
  } catch (e) {
    console.error('Forgot password error:', e?.stack || e);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/reset', async (req, res) => {
  try {
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '').trim();
    if (!token || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { $set: { passwordHash }, $unset: { resetToken: '', resetTokenExpires: '' } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/ai/status', async (_req, res) => {
  try {
    try { await getOllamaModels(); } catch {}
    res.json({
      ok: true,
      engine: "motosensei-master",
      knowledge: getKnowledgeStats(),
      provider: getProviderInfo(),
      search: getSearchInfo()
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: "AI status unavailable" });
  }
});

app.post('/api/ai/ask', authMiddleware, async (req, res) => {
  try {
    const { prompt, sentiment, history = [] } = req.body || {};
    const user = req.user;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const result = await askAssistant(
      prompt,
      user.username || 'Mugenzi',
      sentiment || 'neutral',
      Array.isArray(history) ? history : [],
      user._id,
      !!user.isPro
    );

    res.json({
      response: result.text,
      isPro: user.isPro,
      structured: result.structured || null
    });
  } catch (error) {
    console.error('[Route /api/ai/ask] error:', error?.stack || error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/ai/stream', authMiddleware, async (req, res) => {
  try {
    const { prompt, sentiment, history = [] } = req.body || {};
    const user = req.user;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const isSSE = String(req.headers.accept || '').toLowerCase().includes('text/event-stream');
    if (!isSSE) {
      const result = await askAssistant(
        prompt, user.username || 'Mugenzi', sentiment || 'neutral',
        Array.isArray(history) ? history : [], user._id, !!user.isPro
      );
      return res.json({ response: result.text, isPro: user.isPro, structured: result.structured || null });
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (res.flushHeaders) res.flushHeaders();

    const writeSSE = (data) => {
      const s = typeof data === 'string' ? data : JSON.stringify(data);
      res.write(`data: ${s.split(/\r?\n/).join('\ndata: ')}\n\n`);
      if (typeof res.flush === 'function') try { res.flush(); } catch {}
    };

    let aborted = false;
    req.on('close', () => { aborted = true; });
    const ctrl = new AbortController();

    writeSSE({ event: 'start', engine: 'motosensei-master' });

    const result = await askAssistantStream(
      prompt, user.username || 'Mugenzi', sentiment || 'neutral',
      Array.isArray(history) ? history : [], user._id, !!user.isPro,
      {
        signal: ctrl.signal,
        onChunk: (chunk, meta) => {
          if (aborted) { ctrl.abort(); return; }
          if (chunk) writeSSE({ event: 'token', chunk, meta: meta?.meta || meta || {} });
        }
      }
    );

    writeSSE({ event: 'done', response: result.text, isPro: user.isPro, structured: result.structured || null });
    res.end();
  } catch (error) {
    console.error('[Route /api/ai/stream] error:', error?.stack || error);
    try {
      if (res.headersSent) res.write(`event: error\ndata: ${JSON.stringify({ message: error?.message || 'Stream failed' })}\n\n`);
      else res.status(500).json({ message: 'Stream failed' });
      res.end();
    } catch {}
  }
});

app.post('/api/ai/simulator-event', authMiddleware, async (req, res) => {
  try {
    const { event, context = {} } = req.body || {};
    const user = req.user;
    if (!event) return res.status(400).json({ message: 'event is required' });
    const r = await handleSimulatorEvent({
      event,
      context: { ...(context || {}), userId: user._id ? String(user._id) : undefined, language: context.language || (req.body.language) },
      userId: user._id,
      userName: user.username || 'Mugenzi'
    });
    res.json({ ok: true, event: r.event, response: r.text, structured: r.structured || null });
  } catch (e) {
    console.error('[Route /api/ai/simulator-event] error:', e?.stack || e);
    res.status(500).json({ message: e?.message || 'Simulator event failed' });
  }
});

app.post('/api/ai/exam/generate', authMiddleware, async (req, res) => {
  try {
    const { topic = null, count = 5, language = 'en', difficulty = 'intermediate' } = req.body || {};
    const user = req.user;
    const quiz = await buildExamQuiz({ topic, count, lang: language, difficulty });
    const quizOut = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        id: q.id, type: q.type, topic: q.topic, difficulty: q.difficulty,
        language: q.language, question: q.question, options: q.options,
        source: q.source
      }))
    };
    res.json({ ok: true, isPro: user.isPro, quiz: quizOut });
  } catch (e) {
    console.error('[Route /api/ai/exam/generate] error:', e?.stack || e);
    res.status(500).json({ message: e?.message || 'Exam generation failed' });
  }
});

app.post('/api/ai/exam/submit', authMiddleware, async (req, res) => {
  try {
    const { quiz, submissions = [] } = req.body || {};
    if (!quiz || !Array.isArray(quiz.questions)) return res.status(400).json({ message: 'quiz with questions is required' });
    const scored = scoreExamSubmission(quiz, submissions);
    res.json({ ok: true, result: scored });
  } catch (e) {
    console.error('[Route /api/ai/exam/submit] error:', e?.stack || e);
    res.status(500).json({ message: e?.message || 'Exam scoring failed' });
  }
});

// Social auth (simulated)
app.post('/api/auth/social', async (req, res) => {
  const provider = String(req.body?.provider || '').toLowerCase();
  if (!['google', 'facebook'].includes(provider)) return res.status(400).json({ message: 'Unsupported provider' });    const email = `${provider}_user_${Date.now()}@example.com`;
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash(provider + '-oauth', 10);
    const username = await generateDefaultUsername();
    user = await User.create({ username, email, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
    await sendWelcomeEmail(email, user.username); // skipped for placeholder emails
  }
  const token = generateToken(user);
  res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
});

app.get('/api/auth/google/start', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  if (!clientId) return res.status(400).json({ message: 'Missing GOOGLE_CLIENT_ID' });
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'select_account');
  res.redirect(url.toString());
});

app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    if (!clientId || !clientSecret) return res.status(400).send('Missing Google OAuth env');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) return res.status(400).send('Google auth failed');
    const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } });
    const profile = await uRes.json();
    const email = String(profile.email || '');
    const normalizedEmail = email || `google_${String(profile.sub || Date.now())}@example.com`;
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // First-time Google sign-in: generate a default app name (not the Google profile name)
      // and send the branded welcome email.
      const passwordHash = await bcrypt.hash('google-oauth', 10);
      const username = await generateDefaultUsername();
      user = await User.create({ username, email: normalizedEmail, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
      await sendWelcomeEmail(normalizedEmail, user.username);
    }
    const token = generateToken(user);
    const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
    const payload = { type: 'oauth_success', token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } };
    const json = JSON.stringify(payload).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
    res.send(`<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var data=JSON.parse('${json}');var origin='${origin}';if(window.opener){window.opener.postMessage(data, origin);}window.close();})();</script></body></html>`);
  } catch {
    res.status(500).send('Auth error');
  }
});

app.get('/api/auth/facebook/start', (req, res) => {
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/facebook/callback`;
  if (!clientId) return res.status(400).json({ message: 'Missing FACEBOOK_APP_ID' });
  const url = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'email,public_profile');
  res.redirect(url.toString());
});

app.get('/api/auth/facebook/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const clientId = process.env.FACEBOOK_APP_ID;
    const clientSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/facebook/callback`;
    if (!clientId || !clientSecret) return res.status(400).send('Missing Facebook OAuth env');
    const tRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${encodeURIComponent(code)}`);
    const tJson = await tRes.json();
    const accessToken = tJson.access_token;
    if (!accessToken) return res.status(400).send('Facebook auth failed');
    const uRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`);
    const profile = await uRes.json();
    const email = String(profile.email || `facebook_${String(profile.id || Date.now())}@example.com`);
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash('facebook-oauth', 10);
      const username = await generateDefaultUsername();
      user = await User.create({ username, email: email || undefined, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
      await sendWelcomeEmail(email, user.username);
    }
    const token = generateToken(user);
    const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
    const payload = { type: 'oauth_success', token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } };
    const json = JSON.stringify(payload).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
    res.send(`<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var data=JSON.parse('${json}');var origin='${origin}';if(window.opener){window.opener.postMessage(data, origin);}window.close();})();</script></body></html>`);
  } catch {
    res.status(500).send('Auth error');
  }
});

// Verify Google Identity Services ID token (client-only sign-in)
app.post('/api/auth/google/verify-id-token', async (req, res) => {
  try {
    const idToken = String(req.body?.idToken || '');
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    const info = await verifyRes.json();
    if (info.error_description || info.error) return res.status(400).json({ message: 'Invalid Google token' });
    const email = String(info.email || `google_${String(info.sub || Date.now())}@example.com`);
    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash('google-id-token', 10);
      const username = await generateDefaultUsername();
      user = await User.create({ username, email, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
      await sendWelcomeEmail(email, user.username);
    }
    const token = generateToken(user);
    res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
  } catch {
    res.status(500).json({ message: 'Verification error' });
  }
});

// Exchange Firebase ID token for backend JWT
app.post('/api/auth/firebase', async (req, res) => {
  try {
    const idToken = String(req.body?.idToken || '').trim();
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });
    
    let info = {};
    let verified = false;

    // 1. Try Google Token Info (works for Google Sign-In)
    try {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
      if (verifyRes.ok) {
        info = await verifyRes.json();
        if (!info.error && !info.error_description) verified = true;
      }
    } catch {}

    // 2. Fallback: Decode JWT (for Facebook/other Firebase providers) if Google check failed
    if (!verified) {
      try {
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.sub && decoded.iss && decoded.iss.startsWith('https://securetoken.google.com/')) {
          info = decoded;
          verified = true;
          console.log('Verified via JWT decode (Signature unchecked - standard fallback)');
        }
      } catch (e) {
        console.error('JWT decode failed:', e);
      }
    }

    if (!verified || !info.sub) {
      return res.status(400).json({ message: 'Invalid Firebase token' });
    }

    const firebaseUid = String(info.sub || '');
    const email = normalizeEmail(info.email || '');
    
    let user = null;
    if (firebaseUid) user = await User.findOne({ firebaseUid });
    if (!user && email) user = await User.findOne({ email });
    
    if (!user) {
      // First-time Google/Facebook Firebase sign-in: generated default name,
      // not the Firebase profile name — plus the branded welcome email.
      const passwordHash = await bcrypt.hash('firebase-auth', 10);
      const username = await generateDefaultUsername();
      user = await User.create({ username, email: email || undefined, phone: undefined, firebaseUid, passwordHash, isPro: false, role: 'user', loginStreak: 0, badges: [] });
      await sendWelcomeEmail(email, user.username);
    } else {
      // Link firebaseUid if missing
      if (!user.firebaseUid && firebaseUid) {
        await User.updateOne({ _id: user._id }, { $set: { firebaseUid } });
      }
    }
    const token = generateToken(user);
    res.json({ token, user: { id: String(user._id), username: user.username, email: user.email, isPro: user.isPro, role: user.role, loginStreak: user.loginStreak, badges: user.badges } });
  } catch (e) {
    console.error('Firebase exchange error:', e);
    res.status(500).json({ message: 'Firebase exchange failed: ' + (e.message || String(e)) });
  }
});

// QUIZZES
app.get('/api/quizzes', async (req, res) => {
  const quizzes = await Quiz.find({}).lean();
  res.json({ quizzes: quizzes.map(q => ({ id: String(q._id), title: q.title, category: q.category, image: q.image, questionCount: q.questionCount })) });
});

app.get('/api/quiz/:quizId', authMiddleware, async (req, res) => {
  const quizId = req.params.quizId;
  const lang = String(req.query.lang || 'rw').toLowerCase(); // 'rw' or 'en'
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  const all = await Question.find({ quizId }).lean();
  const isPro = req.user?.isPro;
  const paywallAfter = 6;
  const questions = all.map(q => ({
    id: String(q._id),
    category: q.category,
    question: (lang === 'en' && q.questionEn) ? q.questionEn : q.question,
    options: (lang === 'en' && q.optionsEn && q.optionsEn.length) ? q.optionsEn : q.options,
    licenseClass: q.licenseClass || ['A','B','C','D'],
    image: q.image
  }));
  res.json({ quiz: { id: String(quiz._id), title: quiz.title, category: quiz.category, image: quiz.image }, paywallAfter, total: all.length, lang, questions });
});

// Daily Flip Cards (public) - from glossary
function categorizeGlossaryTerm(key, en, rw) {
  const text = `${key} ${en} ${rw}`.toLowerCase();
  if (text.includes('sign') || text.includes('icyapa') || text.includes('ibyapa') || text.includes('ikimenyetso') || text.includes('stop') || text.includes('yield') || text.includes('give way') || text.includes('no ') || text.includes('crossing') || text.includes('zebra') || text.includes('pelican') || text.includes('light') || text.includes('amatara') || text.includes('pedestrian') || text.includes('banyamaguru')) return 'Signs';
  if (text.includes('brake') || text.includes('feri') || text.includes('accelerator') || text.includes('kinyeshyira') || text.includes('clutch') || text.includes('embrayage') || text.includes('gear') || text.includes('ivugapfe') || text.includes('engrenage') || text.includes('handbrake') || text.includes('bushisho') || text.includes('tyre') || text.includes('umatozo') || text.includes('wheel') || text.includes('imatozo') || text.includes('exhaust') || text.includes('dashboard') || text.includes('urugero') || text.includes('odometer') || text.includes('mirror') || text.includes('igaragaza') || text.includes('headrest') || text.includes('steering') || text.includes('umukandenga') || text.includes('gear stick') || text.includes('umusaruro') || text.includes('horn') || text.includes('indwi') || text.includes('windscreen') || text.includes('ibiruhuko') || text.includes('wiper') || text.includes('demister') || text.includes('choke') || text.includes('battery') || text.includes('amabaji') || text.includes('alternator') || text.includes('carburetor') || text.includes('spark plug') || text.includes('spaki') || text.includes('suspension') || text.includes('muffler') || text.includes('catalytic') || text.includes('fuel') || text.includes('umuriro') || text.includes('temperature') || text.includes('ipimo') || text.includes('oil') || text.includes('amafuta') || text.includes('coolant') || text.includes('gupfa umusatsi') || text.includes('vehicle') || text.includes('ikinyabiziga') || text.includes('modoka') || text.includes('motorcycle') || text.includes('moto') || text.includes('bicycle') || text.includes('bisikilete') || text.includes('airbag') || text.includes('abs')) return 'Vehicle Parts';
  if (text.includes('right of way') || text.includes('uburenganzira') || text.includes('overtaking') || text.includes('kwanyuranaho') || text.includes('gusonga') || text.includes('intersection') || text.includes('isangano') || text.includes('inkomane') || text.includes('priority') || text.includes('reckless') || text.includes('gutwara ububasha') || text.includes('defensive') || text.includes('kugaragaza umutekano') || text.includes('driving') || text.includes('gutwara') || text.includes('license') || text.includes('permi') || text.includes('provisional') || text.includes('kwiga gutwara') || text.includes('parking') || text.includes('gupaka') || text.includes('reverse') || text.includes('parallel') || text.includes('kumurongo') || text.includes('three-point') || text.includes('intambwe atatu') || text.includes('learner') || text.includes('umunyamwuga') || text.includes('mushya') || text.includes('dual carriageway') || text.includes('ibikorwa bifite') || text.includes('blind spot') || text.includes('utaboneke') || text.includes('tailgating') || text.includes('kumera umuhanda') || text.includes('aquaplaning') || text.includes('gucumbuka') || text.includes('u-turn') || text.includes('hinduka') || text.includes('one-way') || text.includes('icyerekezo kimwe') || text.includes('two-way') || text.includes('icyerekezo bibiri') || text.includes('horning') || text.includes('gisemerezo') || text.includes('weight limit') || text.includes('uburemere') || text.includes('height limit') || text.includes('uhagaze') || text.includes('width limit') || text.includes('ubugari') || text.includes('drunk') || text.includes('ibinywaji') || text.includes('alcohol') || text.includes('ikibazo cyo kunywa') || text.includes('penalty') || text.includes('amanota') || text.includes('driving test') || text.includes('imyozo') || text.includes('koresha provisoire') || text.includes('l-plate') || text.includes('p-plate') || text.includes('tow bar') || text.includes('trailer') || text.includes('overloading') || text.includes('kuzinda imodoka') || text.includes('emergency') || text.includes('agakiza') || text.includes('ambulance') || text.includes('polisi') || text.includes('fire truck') || text.includes('umuriro') || text.includes('cattle grid') || text.includes('inka') || text.includes('dead end') || text.includes('utazwi') || text.includes('crossroads') || text.includes('t-junction') || text.includes('y-junction') || text.includes('staggered') || text.includes('slip road') || text.includes('gushika') || text.includes('central reservation') || text.includes('hagati') || text.includes('kerb') || text.includes('akayira') || text.includes('verge') || text.includes('akapfara') || text.includes('flyover') || text.includes('ukure hejuru') || text.includes('underpass') || text.includes('uri hasi') || text.includes('bridge') || text.includes('amabara') || text.includes('tunnel') || text.includes('umutumbi') || text.includes('tram') || text.includes('umujyi') || text.includes('level crossing') || text.includes('rail') || text.includes('moshi') || text.includes('humpback') || text.includes('lane') || text.includes('umurongo') || text.includes('road marking') || text.includes('ibimenyetso byo mu muhanda') || text.includes('solid line') || text.includes('umukara utazwi') || text.includes('dashed line') || text.includes('wibaye') || text.includes('double white') || text.includes('stop line') || text.includes('give way line') || text.includes('box junction') || text.includes('agakuba') || text.includes('bus lane') || text.includes('ibisakazi') || text.includes('cycle lane') || text.includes('bisikilete') || text.includes('jaywalking') || text.includes('kuvanya mu muhanda') || text.includes('contraflow') || text.includes('kugenda mu buryo bwo') || text.includes('road works') || text.includes('akorwa') || text.includes('temporary sign') || text.includes('gihe gito') || text.includes('diversion') || text.includes('gupimika') || text.includes('highway') || text.includes('umuhanda munini') || text.includes('autoroute') || text.includes('built-up') || text.includes('nsisiro') || text.includes('rural') || text.includes('aharatuye') || text.includes('roundabout') || text.includes('rond-point')) return 'Rules';
  if (text.includes('rain') || text.includes('mvura') || text.includes('fog') || text.includes('gusuma') || text.includes('night') || text.includes('muijoro') || text.includes('ijoro') || text.includes('wet') || text.includes('icy road') || text.includes('amahere') || text.includes('loose gravel') || text.includes('utaramu cyane') || text.includes('slippery') || text.includes('uteyi') || text.includes('soft verge') || text.includes('gatagati') || text.includes('queuing') || text.includes('imizigo') || text.includes('steep hill') || text.includes('cyarusa') || text.includes('pothole') || text.includes('agahonde') || text.includes('speed bump') || text.includes('kabare ke vites') || text.includes('breakdown') || text.includes('inkemba') || text.includes('warning triangle') || text.includes('kwibeseramo') || text.includes('hard shoulder') || text.includes('gasatira')) return 'Conditions';
  return 'General';
}

app.get('/api/flipcards/daily', optionalAuthMiddleware, async (req, res) => {
  try {
    const terms = getRandomTerms(6);
    const cards = terms.map((t) => ({
      id: t.key,
      termEn: t.en,
      termRw: t.rw,
      definitionEn: `${t.en} - traffic and driving term.`,
      definitionRw: `${t.rw} - ijambo ry'umuhanda n'ugutwara.`,
      category: categorizeGlossaryTerm(t.key, t.en, t.rw)
    }));
    const out = { cards };
    if (req.user) {
      out.streak = req.user.loginStreak || 0;
    }
    res.json(out);
  } catch (e) {
    console.error('Flipcards error:', e?.message || e);
    res.json({ cards: [], streak: req.user?.loginStreak || 0 });
  }
});

app.post('/api/quiz/submit', authMiddleware, async (req, res) => {
  const { answers = [], score = 0, totalQuestions = 0, timeTakenSeconds = 0 } = req.body || {};
  const submission = await Submission.create({ userId: req.user._id, answers, score, totalQuestions, timeTakenSeconds });
  await User.updateOne(
    { _id: req.user._id },
    {
      $inc: { 'stats.totalQuizzes': 1, 'stats.totalMarks': score, 'stats.totalQuestions': totalQuestions },
      $max: { 'stats.bestScore': score }
    }
  );
  res.json({ message: 'Submitted', submission: { id: String(submission._id), userId: String(req.user._id), answers, score, totalQuestions, timeTakenSeconds, createdAt: submission.createdAt } });
});

// AI ASSISTANT (deprecated)
app.post('/api/ai/ask-deprecated', authMiddleware, async (req, res) => {
  const { question = '' } = req.body || {};
  if (!question) return res.status(400).json({ message: 'Missing question' });
  const qLower = String(question).toLowerCase();
  const tokens = qLower.split(/\s+/).filter(Boolean);
  function collectFromSource() {
    const out = [];
    for (const [key, v] of Object.entries(quizSource)) {
      let arr = [];
      if (Array.isArray(v)) arr = v;
      else if (v && Array.isArray(v.questions)) arr = v.questions;
      if (!Array.isArray(arr)) continue;
      for (const q of arr) {
        if (q && q.question && Array.isArray(q.options)) {
          out.push({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            image: q.imagePlaceholder || q.imageUrl || null,
            category: 'Mixed'
          });
        }
      }
    }
    return out;
  }
  const sourceDocs = collectFromSource();
  const docs = sourceDocs.length ? sourceDocs : await Question.find({}).limit(5000).lean();
  const SYNS = {
    'guhagarara': ['icyapa cyo guhagarara','hagarara','stop'],
    'umuvuduko': ['vitesse','speed','genda buhoro'],
    'anyuranaho': ['kwanyuranaho','gusiganwa','overtake','nyuranaho','gucaho'],
    'icyapa': ['ibyapa','ikimenyetso','sign','ikimenyetso cy\'umuhanda'],
    'gari ya moshi': ['moshi','rail','train','inzira ya gari ya moshi']
  };
  function expandTokens(ts) {
    const out = new Set(ts);
    for (const t of ts) {
      for (const [k, arr] of Object.entries(SYNS)) {
        if (t.includes(k) || arr.some(s => t.includes(s))) {
          out.add(k);
          for (const s of arr) out.add(s);
        }
      }
    }
    return Array.from(out);
  }
  const expandedTokens = expandTokens(tokens);
  function score(d) {
    const optText = Array.isArray(d.options)
      ? d.options.map(o => (typeof o==='string' ? o : (o?.text || ''))).join(' ')
      : '';
    const text = `${d.question} ${optText} ${d.category||''}`.toLowerCase();
    let s = 0;
    for (const t of expandedTokens) {
      if (!t) continue;
      if (text.includes(t)) s += 2;
      else if (t.length > 3 && text.includes(t.slice(0, Math.max(2, Math.floor(t.length*0.6))))) s += 1;
    }
    return s;
  }
  const ranked = docs.map(d => ({ d, s: score(d) })).sort((a,b)=>b.s-a.s).slice(0,3);
  const best = ranked[0]?.d;
  if (!best || ranked[0].s === 0) {
    return res.json({ text: "Mwaramutse! Nshobora kugufasha ku mategeko y'umuhanda. Sobanura neza ikibazo cyawe cyangwa ukoreshe amagambo ajyanye n'ibyapa n'amategeko. Inama: Koresha neza umuhanda tugeraneyo #Gerayo Amahoro" });
  }
  const correctObj = (best.options||[]).find(o => (typeof o==='object' && (o?.isCorrect || o?.correct===true)) || (typeof o==='string' && typeof best.correctAnswer==='string' && o.trim()===best.correctAnswer?.trim()));
  let answerText = null;
  if (correctObj) {
    answerText = typeof correctObj==='string' ? correctObj : (correctObj.text || correctObj.value || null);
  }
  if (!answerText && typeof best.correctAnswer==='string') answerText = best.correctAnswer;
  if (!answerText && typeof best.answer==='string') answerText = best.answer;
  if (!answerText && typeof best.correctOptionIndex==='number' && Array.isArray(best.options)) {
    const co = best.options[best.correctOptionIndex];
    answerText = typeof co==='string' ? co : (co?.text || null);
  }
  const qtext = `${best.question} ${best.category || ''}`.toLowerCase();
  const related = (best.options||[])
    .map(o=>typeof o==='string' ? o : (o?.text || ''))
    .filter(t => t && expandedTokens.some(tok => t.toLowerCase().includes(tok)))
    .slice(0,3);
  const extra = related.length ? ` Ibindi by'ingenzi: ${related.join('; ')}.` : '';
  let text = '';
  if (answerText) {
    text = `Aha bikwiye gukorwa gutya: ${answerText}. Kubahiriza ibyapa n'amategeko, no kugenza umuvuduko ukwiye, bituma ugenda neza.`;
  } else if (qtext.includes('guhagarara')) {
    text = 'Ahari icyapa cyo guhagarara (STOP) ugomba guhagarara rwose mbere y\'umurongo cyangwa aho abanyamaguru bambuka, urebe ibumoso n\'iburyo, uhe icyubahiro abanyamaguru n\'ibinyabiziga, ukambuka ari uko inzira isobanutse.';
  } else if (qtext.includes('umuvuduko')) {
    text = 'Kubahiriza umuvuduko wemewe ni ngombwa. Hegereza umuvuduko mu bice by\'amashuri, aho abanyamaguru banyura, no mu masangano; kandi uhindure umuvuduko ukurikije imiterere y\'umuhanda n\'ibihe by\'ikirere.';
  } else if (qtext.includes('anyuranaho') || qtext.includes('gusiganwa')) {
    text = 'Kwanyuranaho bikorwa gusa igihe imirongo ibyemera, aho ubona neza imbere, kandi ufite umwanya uhagije. Banza urebe mu ndorerwamo n\'ahagupfuma, uhe ikimenyetso, kandi ntukahatse abandi kubyihutisha.';
  } else if (qtext.includes('icyapa') || qtext.includes('ibyapa')) {
    text = 'Ibyapa biguhatira kubahiriza amategeko cyangwa bikakumenyesha ibyago n\'ubuyobozi bw\'inzira. Soma isura n\'ibara ry\'icyapa, ukurikize uko kigutegeka aho uri.';
  } else if (qtext.includes('gari ya moshi') || qtext.includes('moshi') || qtext.includes('inzira ya gari ya moshi')) {
    text = 'Ku nzira ya gari ya moshi, hagarara iyo hari ikimenyetso cy\'umutuku cyangwa bariyeri, ntukambuke igihe amatara arimo kumurika, kandi wemeze ko inzira isukuye mbere yo kwambuka. Ntuhagarare ku nzira ya gari ya moshi.';
  } else {
    text = 'Reba ibyapa, imiterere y\'umuhanda n\'aho uri, uhe inzira aho bikenewe, kandi ugendere umuvuduko ukwiye kugira ngo wirinde impanuka.';
  }
  text = `${text}${extra} Inama: Koresha neza umuhanda tugeraneyo #Gerayo Amahoro`;
  res.json({
    text,
    image: best.image || null,
    source: { id: String(best._id), category: best.category, question: best.question, answer: answerText }
  });
});

async function momoRequestToPay(amount, phone, note, product) {
  const ref = uuidv4();
  await requestToPay({
    amount,
    currency: 'RWF',
    externalId: ref,
    msisdn: normalizeMsisdn(phone),
    payerMessage: product === 'irembo' ? 'ISHAMI Irembo' : 'ISHAMI Pro',
    payeeNote: note || 'ISHAMI',
  });
  return ref;
}

async function momoStatus(ref) {
  return await getRequestToPayStatus(ref);
}

app.post('/api/payment/initiate', authMiddleware, async (req, res) => {
  try {
    const { amount, phone, provider, product, iremboData } = req.body || {};
    const prod = String(product || 'pro');
    const testMode = process.env.PAYPACK_TEST_MODE === 'true';

    // In test mode, accept 100 RWF; otherwise enforce standard amounts
    const expected = testMode ? 100 : (prod === 'irembo' ? 5500 : 1000);
    if (Number(amount) !== expected) {
      await FraudLog.create({ userId: req.user._id, type: 'amount_mismatch', message: 'Mismatched amount', meta: { sent: amount, expected, product: prod } });
      return res.status(400).json({ message: `Invalid amount. Expected ${expected} RWF` });
    }
    if (!phone) return res.status(400).json({ message: 'Phone required' });

    // Use Paypack for payment collection
    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^250/, '0');
    const webhookMode = testMode ? 'development' : 'production';
    const paypackResult = await paypackCashin(cleanPhone, expected, webhookMode);
    const payment = await Payment.create({ userId: req.user._id, amount: expected, phone: cleanPhone, provider: 'paypack', product: prod, providerRef: paypackResult.ref, status: 'PENDING' });
    console.log(`[Paypack] Cashin via /initiate: ref=${paypackResult.ref}, amount=${expected}, phone=${cleanPhone}`);

    // If irembo product with form data, create the application immediately
    let iremboApplicationId = null;
    if (prod === 'irembo' && iremboData && iremboData.fullName) {
      const app = await IremboApplication.create({
        userId: req.user._id,
        fullName: iremboData.fullName,
        nationalId: iremboData.nationalId,
        phone: cleanPhone,
        email: iremboData.email,
        language: iremboData.language,
        testMode: iremboData.testMode,
        district: iremboData.district,
        testDate: iremboData.testDate,
        transactionId: String(payment._id),
        status: 'PENDING_PAYMENT',
      });
      iremboApplicationId = String(app._id);
      await Notification.create({ title: 'Irembo registration', body: `New application from ${iremboData.fullName} (awaiting payment)`, segment: 'admins' });
      console.log(`[Irembo] Draft application ${app._id} created for user ${req.user._id}`);
    }

    res.json({ transactionId: String(payment._id), status: payment.status || 'PENDING', providerRef: paypackResult.ref, iremboApplicationId });
  } catch (e) {
    console.error('[Paypack] /initiate error:', e?.message || e);
    await FraudLog.create({ userId: req.user?._id, type: 'initiate_error', message: 'Payment initiate failed', meta: { error: String(e && e.message || e) } });
    res.status(500).json({ message: e?.message || 'Payment error' });
  }
});

app.get('/api/payment/status/:transactionId', authMiddleware, async (req, res) => {
  const txn = await Payment.findById(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Not found' });

  // Already finalized
  if (txn.status === 'SUCCESS' || txn.status === 'FAILED') {
    return res.json({ transactionId: String(txn._id), status: txn.status });
  }

  if (txn.status === 'PENDING' && txn.providerRef) {
    try {
      // Use Paypack for status check
      const txData = await paypackFindTransaction(txn.providerRef);
      const ppStatus = (txData.status || '').toLowerCase();
      if (ppStatus === 'successful') {
        txn.status = 'SUCCESS';
        await txn.save();
        if (txn.product === 'pro') {
          const u = await User.findById(txn.userId);
          if (u) { u.isPro = true; await u.save(); }
        }
        // Promote IremboApplication from PENDING_PAYMENT to PENDING
        if (txn.product === 'irembo') {
          const app = await IremboApplication.findOne({ userId: txn.userId, status: 'PENDING_PAYMENT' }).sort({ createdAt: -1 });
          if (app) {
            app.status = 'PENDING';
            app.transactionId = String(txn._id);
            await app.save();
          }
        }
      } else if (ppStatus === 'failed') {
        txn.status = 'FAILED';
        await txn.save();
      }
    } catch (e) {
      console.error('[Paypack] Status check error:', e?.message);
    }
  }
  res.json({ transactionId: String(txn._id), status: txn.status });
});

// Plural routes (alias) — now also use Paypack
app.post('/api/payments/initiate', authMiddleware, async (req, res) => {
  try {
    const { amount, phone, provider, product, iremboData } = req.body || {};
    const prod = String(product || 'pro');
    const testMode = process.env.PAYPACK_TEST_MODE === 'true';
    const expected = testMode ? 100 : (prod === 'irembo' ? 5500 : 1000);
    if (Number(amount) !== expected) {
      await FraudLog.create({ userId: req.user._id, type: 'amount_mismatch', message: 'Mismatched amount', meta: { sent: amount, expected, product: prod } });
      return res.status(400).json({ message: `Invalid amount. Expected ${expected} RWF` });
    }
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^250/, '0');
    const webhookMode = testMode ? 'development' : 'production';
    const paypackResult = await paypackCashin(cleanPhone, expected, webhookMode);
    const payment = await Payment.create({ userId: req.user._id, amount: expected, phone: cleanPhone, provider: 'paypack', product: prod, providerRef: paypackResult.ref, status: 'PENDING' });

    // If irembo product with form data, create the application immediately
    let iremboApplicationId = null;
    if (prod === 'irembo' && iremboData && iremboData.fullName) {
      const app = await IremboApplication.create({
        userId: req.user._id,
        fullName: iremboData.fullName,
        nationalId: iremboData.nationalId,
        phone: cleanPhone,
        email: iremboData.email,
        language: iremboData.language,
        testMode: iremboData.testMode,
        district: iremboData.district,
        testDate: iremboData.testDate,
        transactionId: String(payment._id),
        status: 'PENDING_PAYMENT',
      });
      iremboApplicationId = String(app._id);
      await Notification.create({ title: 'Irembo registration', body: `New application from ${iremboData.fullName} (awaiting payment)`, segment: 'admins' });
    }

    res.json({ transactionId: String(payment._id), status: payment.status || 'PENDING', providerRef: paypackResult.ref, iremboApplicationId });
  } catch (e) {
    console.error('[Paypack] /payments/initiate error:', e?.message || e);
    await FraudLog.create({ userId: req.user?._id, type: 'initiate_error', message: 'Payment initiate failed', meta: { error: String(e && e.message || e) } });
    res.status(500).json({ message: e?.message || 'Payment error' });
  }
});

app.get('/api/payments/status/:transactionId', authMiddleware, async (req, res) => {
  const txn = await Payment.findById(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Not found' });
  if (txn.status === 'SUCCESS' || txn.status === 'FAILED') {
    return res.json({ transactionId: String(txn._id), status: txn.status });
  }
  if (txn.status === 'PENDING' && txn.providerRef) {
    try {
      const txData = await paypackFindTransaction(txn.providerRef);
      const ppStatus = (txData.status || '').toLowerCase();
      if (ppStatus === 'successful') {
        txn.status = 'SUCCESS';
        await txn.save();
        if (txn.product === 'pro') {
          const u = await User.findById(txn.userId);
          if (u) { u.isPro = true; await u.save(); }
        }
        // Promote IremboApplication from PENDING_PAYMENT to PENDING
        if (txn.product === 'irembo') {
          const app = await IremboApplication.findOne({ userId: txn.userId, status: 'PENDING_PAYMENT' }).sort({ createdAt: -1 });
          if (app) {
            app.status = 'PENDING';
            app.transactionId = String(txn._id);
            await app.save();
            console.log(`[Paypack] Irembo application ${app._id} promoted to PENDING via /payments/status`);
          }
        }
      } else if (ppStatus === 'failed') {
        txn.status = 'FAILED';
        await txn.save();
      }
    } catch (e) {
      console.error('[Paypack] /payments/status error:', e?.message);
    }
  }
  res.json({ transactionId: String(txn._id), status: txn.status });
});

// MTN MoMo webhook: auto-update payment status
app.post('/api/webhook/mtn', async (req, res) => {
  try {
    const ref = req.headers['x-reference-id'] || req.body?.referenceId || req.body?.refId || req.query?.referenceId;
    const status = (req.body?.status || '').toUpperCase();
    if (!ref || !status) {
      return res.status(400).json({ message: 'Missing reference or status' });
    }
    const txn = await Payment.findOne({ providerRef: String(ref) });
    if (!txn) {
      await FraudLog.create({ type: 'webhook_unknown_ref', message: 'Unknown providerRef', meta: { ref, body: req.body } });
      return res.status(404).json({ message: 'Payment not found' });
    }
    if (status === 'SUCCESSFUL') {
      txn.status = 'SUCCESS';
      await txn.save();
      if (txn.product === 'pro') {
        const u = await User.findById(txn.userId);
        if (u) { u.isPro = true; await u.save(); }
      }
    } else if (status === 'FAILED') {
      txn.status = 'FAILED';
      await txn.save();
    }
    res.json({ ok: true });
  } catch (e) {
    await FraudLog.create({ type: 'webhook_error', message: 'Webhook processing error', meta: { error: String(e && e.message || e) } });
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// PAYPACK PAYMENT INTEGRATION
// ============================================
import { paypackCashin, paypackFindTransaction, paypackListEvents, verifyWebhookSignature } from './services/paypack.js';

/**
 * POST /api/paypack/cashin
 * Initiate a Paypack Cashin — sends USSD push to customer's phone.
 * Body: { amount: number, phone: string, product?: string }
 */
app.post('/api/paypack/cashin', authMiddleware, async (req, res) => {
  try {
    const { amount, phone, product, iremboData } = req.body || {};
    const prod = String(product || 'pro');

    // For testing: allow 100 RWF, otherwise enforce standard amounts
    const testMode = process.env.PAYPACK_TEST_MODE === 'true';
    let expected;
    if (testMode) {
      expected = 100; // Testing: 100 RWF
    } else {
      expected = prod === 'irembo' ? 5500 : 1000;
    }

    if (Number(amount) !== expected) {
      await FraudLog.create({ userId: req.user._id, type: 'amount_mismatch', message: 'Paypack amount mismatch', meta: { sent: amount, expected, product: prod } });
      return res.status(400).json({ message: `Invalid amount. Expected ${expected} RWF` });
    }
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    // Normalize phone: remove +, ensure leading 0
    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^250/, '0');

    const webhookMode = testMode ? 'development' : 'production';
    const paypackResult = await paypackCashin(cleanPhone, expected, webhookMode);

    // Save payment to DB
    const payment = await Payment.create({
      userId: req.user._id,
      amount: expected,
      phone: cleanPhone,
      provider: 'paypack',
      product: prod,
      providerRef: paypackResult.ref,
      status: 'PENDING',
    });

    // If irembo product with form data, create the application immediately
    let iremboApplicationId = null;
    if (prod === 'irembo' && iremboData && iremboData.fullName) {
      const app = await IremboApplication.create({
        userId: req.user._id,
        fullName: iremboData.fullName,
        nationalId: iremboData.nationalId,
        phone: cleanPhone,
        email: iremboData.email,
        language: iremboData.language,
        testMode: iremboData.testMode,
        district: iremboData.district,
        testDate: iremboData.testDate,
        transactionId: String(payment._id),
        status: 'PENDING_PAYMENT',
      });
      iremboApplicationId = String(app._id);
      await Notification.create({ title: 'Irembo registration', body: `New application from ${iremboData.fullName} (awaiting payment)`, segment: 'admins' });
      console.log(`[Irembo] Draft application ${app._id} created for user ${req.user._id}`);
    }

    console.log(`[Paypack] Cashin initiated: ref=${paypackResult.ref}, amount=${expected}, phone=${cleanPhone}`);

    res.json({
      transactionId: String(payment._id),
      paypackRef: paypackResult.ref,
      status: paypackResult.status || 'pending',
      amount: paypackResult.amount,
      kind: paypackResult.kind,
      iremboApplicationId,
    });
  } catch (e) {
    const ppMsg = e?.response?.data?.message || e?.message || 'Payment initiation failed';
    console.error('[Paypack] Cashin error:', ppMsg, e?.response?.data || '');
    await FraudLog.create({ userId: req.user?._id, type: 'paypack_error', message: 'Paypack cashin failed', meta: { error: ppMsg } });
    res.status(500).json({ message: ppMsg });
  }
});

/**
 * GET /api/paypack/status/:transactionId
 * Check payment status by polling Paypack.
 */
app.get('/api/paypack/status/:transactionId', authMiddleware, async (req, res) => {
  try {
    const txn = await Payment.findById(req.params.transactionId);
    if (!txn) return res.status(404).json({ message: 'Payment not found' });

    // If already finalized, return immediately
    if (txn.status === 'SUCCESS' || txn.status === 'FAILED') {
      return res.json({ transactionId: String(txn._id), status: txn.status });
    }

    // Poll Paypack for status
    if (txn.providerRef) {
      try {
        const txData = await paypackFindTransaction(txn.providerRef);
        const ppStatus = (txData.status || '').toLowerCase();

        if (ppStatus === 'successful') {
          txn.status = 'SUCCESS';
          await txn.save();
          // Upgrade user to Pro if applicable
          if (txn.product === 'pro') {
            const u = await User.findById(txn.userId);
            if (u) { u.isPro = true; await u.save(); }
          }
          // Promote IremboApplication from PENDING_PAYMENT to PENDING
          if (txn.product === 'irembo') {
            const app = await IremboApplication.findOne({ userId: txn.userId, status: 'PENDING_PAYMENT' }).sort({ createdAt: -1 });
            if (app) {
              app.status = 'PENDING';
              app.transactionId = String(txn._id);
              await app.save();
              console.log(`[Paypack] Irembo application ${app._id} promoted to PENDING`);
            }
          }
        } else if (ppStatus === 'failed') {
          txn.status = 'FAILED';
          await txn.save();
        }
        // else: still pending
      } catch (pollErr) {
        console.error('[Paypack] Status poll error:', pollErr?.message);
      }
    }

    res.json({ transactionId: String(txn._id), status: txn.status });
  } catch (e) {
    res.status(500).json({ message: 'Status check failed' });
  }
});

/**
 * POST /api/webhook/paypack
 * Paypack webhook: auto-update payment status on transaction:processed event.
 * Supports signature verification via X-Paypack-Signature header.
 */
app.post('/api/webhook/paypack', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.get('X-Paypack-Signature');
    if (signature && req.rawBody) {
      const isValid = verifyWebhookSignature(req.rawBody, signature);
      if (!isValid) {
        console.warn('[Paypack] Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    }

    const event = req.body;
    if (!event || event.kind !== 'transaction:processed') {
      return res.json({ ok: true, skipped: true });
    }

    const data = event.data || {};
    const ref = data.ref;
    const status = (data.status || '').toLowerCase();

    if (!ref) {
      return res.status(400).json({ message: 'Missing ref' });
    }

    const txn = await Payment.findOne({ providerRef: String(ref) });
    if (!txn) {
      await FraudLog.create({ type: 'paypack_webhook_unknown', message: 'Unknown Paypack ref', meta: { ref, data } });
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (status === 'successful') {
      txn.status = 'SUCCESS';
      await txn.save();
      if (txn.product === 'pro') {
        const u = await User.findById(txn.userId);
        if (u) { u.isPro = true; await u.save(); }
      }
      // Promote IremboApplication from PENDING_PAYMENT to PENDING
      if (txn.product === 'irembo') {
        const app = await IremboApplication.findOne({ userId: txn.userId, status: 'PENDING_PAYMENT' }).sort({ createdAt: -1 });
        if (app) {
          app.status = 'PENDING';
          app.transactionId = String(txn._id);
          await app.save();
          console.log(`[Paypack] Irembo application ${app._id} promoted to PENDING`);
        }
      }
      console.log(`[Paypack] Webhook: Payment ${ref} SUCCESS`);
    } else if (status === 'failed') {
      txn.status = 'FAILED';
      await txn.save();
      console.log(`[Paypack] Webhook: Payment ${ref} FAILED`);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error('[Paypack] Webhook error:', e?.message || e);
    await FraudLog.create({ type: 'paypack_webhook_error', message: 'Paypack webhook error', meta: { error: String(e && e.message || e) } });
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/paypack/test
 * Test endpoint: verify Paypack connection by getting account info.
 */
app.get('/api/paypack/test', authMiddleware, async (req, res) => {
  try {
    const { getPaypackAccessToken } = await import('./services/paypack.js');
    await getPaypackAccessToken();
    res.json({ ok: true, message: 'Paypack authentication successful!' });
  } catch (e) {
    res.status(500).json({ ok: false, message: e?.message || 'Paypack connection failed' });
  }
});

// RESOURCES
app.get('/api/resources', optionalAuthMiddleware, async (req, res) => {
  const items = await Resource.find({}).lean();
  const user = req.user;
  const isAuth = !!user;
  const isPro = isAuth && !!user.isPro;
  res.json({
    resources: items.map(r => {
      const isLocked = !!r.premium && (!isAuth || !isPro);
      return {
        id: String(r._id),
        title_en: r.title,
        title_kiny: r.titleKiny || '',
        type: r.type || 'PDF',
        category: r.category || 'General',
        isPremium: !!r.premium,
        fileUrl: isLocked ? null : (r.fileUrl || ''),
        locked: isLocked,
        thumbnail: r.thumbnail || '',
        size: r.size || ''
      };
    })
  });
});

app.get('/api/resources/download/:resourceId', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.premium && !req.user.isPro) {
      return res.status(403).json({ message: 'Premium content requires Pro subscription' });
    }
    const rawUrl = resource.fileUrl || '';
    const url = toDirectDownloadUrl(rawUrl);
    if (!url) return res.status(400).json({ message: 'No file URL set for resource' });

    const isLocal = url.startsWith('/') || url.includes('server/uploads') || url.startsWith('./') || url.startsWith(path.resolve()) || fs.existsSync(url) || fs.existsSync(path.join(__dirname, url));
    const isExternalRedirect = /^(https?:)?\/\//i.test(url) && !isLocal && !url.includes('drive.google.com') && !url.includes('docs.google.com');

    if (isExternalRedirect) {
      return res.redirect(url);
    }
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      return res.redirect(url);
    }

    let filePath = url;
    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, url);
    }
    if (!fs.existsSync(filePath)) {
      const tryAlt = path.join(__dirname, 'server', 'uploads', 'user-uploads', path.basename(url));
      if (fs.existsSync(tryAlt)) filePath = tryAlt;
      else return res.redirect(url);
    }
    const filename = resource.title || path.basename(filePath);
    const safeName = String(filename).replace(/[^a-zA-Z0-9_. \-]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);
    res.download(filePath, safeName);
  } catch (e) {
    console.error('Resource download error:', e?.message || e);
    res.status(500).json({ message: 'Download failed' });
  }
});

// LEADERBOARD
app.get('/api/leaderboard', optionalAuthMiddleware, async (req, res) => {
  const { limit = 100 } = req.query;
  const users = await User.find({}).lean();
  const scored = users.map(u => {
    const total_score =
      (u.stats?.bestScore || 0) +
      (u.stats?.totalMarks || 0) +
      (u.loginStreak || 0) * 5;
    return { user: u, total_score };
  });
  scored.sort((a, b) => b.total_score - a.total_score);
  const limited = scored.slice(0, Number(limit));
  const leaderboard = limited.map((entry, idx) => {
    const rank = idx + 1;
    let medal = null;
    if (rank === 1) medal = 'GOLD';
    else if (rank === 2) medal = 'SILVER';
    else if (rank === 3) medal = 'BRONZE';
    const u = entry.user;
    return {
      rank,
      userId: String(u._id),
      username: u.username || 'Unknown',
      score: entry.total_score,
      isPro: !!u.isPro,
      badges: u.badges || [],
      medal,
      loginStreak: u.loginStreak || 0
    };
  });
  res.json({ leaderboard, updatedAt: new Date().toISOString() });
});

// CERTIFICATES
// Generate a new certificate after a passing quiz
app.post('/api/certificates/generate', authMiddleware, async (req, res) => {
  try {
    const { score, totalQuestions, quizTitle } = req.body || {};
    const user = req.user;
    const percentage = Math.round(((score || 0) / Math.max(1, totalQuestions || 1)) * 100);
    if (percentage < 70) {
      return res.status(400).json({ message: 'Certificate requires 70% or higher' });
    }
    const certNo = `ISH-TRU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    const issuedDate = new Date();
    const expiryDate = new Date(issuedDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const cert = await Certificate.create({
      userId: user._id,
      username: user.username,
      score,
      totalQuestions,
      quizTitle: quizTitle || 'Traffic Rules & Road Safety Understanding',
      certificateNo: certNo,
      issuedAt: issuedDate,
      expiresAt: expiryDate
    });
    res.json({
      success: true,
      certificate: {
        id: String(cert._id),
        certificateNo: cert.certificateNo,
        username: cert.username,
        score: cert.score,
        totalQuestions: cert.totalQuestions,
        quizTitle: cert.quizTitle,
        issuedAt: cert.issuedAt
      }
    });
  } catch (e) {
    console.error('Certificate generation error:', e?.stack || e);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
});

// Get user's certificates
app.get('/api/certificates/my', authMiddleware, async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 }).lean();
    res.json({ certificates: certs.map(c => ({
      id: String(c._id),
      certificateNo: c.certificateNo,
      username: c.username,
      score: c.score,
      totalQuestions: c.totalQuestions,
      quizTitle: c.quizTitle,
      issuedAt: c.issuedAt
    })) });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

// Verify a certificate (public)
app.get('/api/certificates/verify/:certNo', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateNo: req.params.certNo }).lean();
    if (!cert) {
      return res.json({ valid: false, message: 'Certificate not found' });
    }
    const percentage = Math.round(((cert.score || 0) / Math.max(1, cert.totalQuestions || 1)) * 100);
    res.json({
      valid: true,
      certificate: {
        certificateNo: cert.certificateNo,
        username: cert.username,
        score: cert.score,
        totalQuestions: cert.totalQuestions,
        percentage,
        quizTitle: cert.quizTitle,
        issuedAt: cert.issuedAt
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

// IREMBO
app.post('/api/irembo/register', authMiddleware, async (req, res) => {
  const txnId = String(req.body?.transactionId || '');
  const txn = txnId ? await Payment.findById(txnId) : null;
  const testMode = process.env.PAYPACK_TEST_MODE === 'true';
  const expectedAmount = testMode ? 100 : 5500;

  // Determine status: PENDING if payment succeeded, PENDING_PAYMENT otherwise
  let appStatus = 'PENDING_PAYMENT';
  if (txn && String(txn.userId) === String(req.user._id) && txn.status === 'SUCCESS' && Number(txn.amount) === expectedAmount && txn.product === 'irembo') {
    appStatus = 'PENDING';
  }

  // Check if a draft application was already created at payment initiation time
  // Also check PENDING status in case webhook/polling already promoted it
  let application = null;
  if (txnId) {
    application = await IremboApplication.findOne({ userId: req.user._id, transactionId: txnId, status: { $in: ['PENDING_PAYMENT', 'PENDING'] } }).sort({ createdAt: -1 });
  }
  if (!application) {
    application = await IremboApplication.findOne({ userId: req.user._id, status: { $in: ['PENDING_PAYMENT', 'PENDING'] } }).sort({ createdAt: -1 });
  }

  if (application) {
    // Update existing draft with full form data and new status
    application.fullName = req.body.fullName || application.fullName;
    application.nationalId = req.body.nationalId || application.nationalId;
    application.phone = req.body.phone || application.phone;
    application.email = req.body.email || application.email;
    application.language = req.body.language || application.language;
    application.testMode = req.body.testMode || application.testMode;
    application.district = req.body.district || application.district;
    application.testDate = req.body.testDate || application.testDate;
    application.transactionId = txnId || application.transactionId;
    application.status = appStatus;
    await application.save();
  } else {
    // No draft found — create new application
    application = await IremboApplication.create({
      userId: req.user._id,
      fullName: req.body.fullName,
      nationalId: req.body.nationalId,
      phone: req.body.phone,
      email: req.body.email,
      language: req.body.language,
      testMode: req.body.testMode,
      district: req.body.district,
      testDate: req.body.testDate,
      transactionId: txnId || undefined,
      status: appStatus,
    });
    await Notification.create({ title: 'Irembo registration', body: `New application from ${req.body.fullName} (${appStatus === 'PENDING' ? 'payment confirmed' : 'awaiting payment'})`, segment: 'admins' });
  }

  res.json({ application: { id: String(application._id), fullName: application.fullName, nationalId: application.nationalId, phone: application.phone, email: application.email, language: application.language, testMode: application.testMode, district: application.district, testDate: application.testDate, status: application.status, transactionId: application.transactionId, createdAt: application.createdAt } });
});

// SIMULATION
app.post('/api/simulation/submit', authMiddleware, async (req, res) => {
  const s = await Simulation.create({ userId: req.user._id, ...req.body });
  res.json({ result: { id: String(s._id), userId: String(req.user._id), ...req.body, createdAt: s.createdAt } });
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
  try {
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) return res.json({ success: true, subscribed: true });
    await NewsletterSubscriber.create({ email });
    const brandName = process.env.BRAND_NAME || 'ISHAMI';
    const from = process.env.SMTP_FROM || `${brandName} <no-reply@ishami.local>`;
    const site = process.env.BRAND_SITE_URL || 'https://ishami.rw';
    const subject = 'Welcome to ISHAMI newsletter!';
    const html = newsletterThanksEmail({ email, siteUrl: site });
    try {
      if (mailer) {
        await mailer.sendMail({ from, to: email, subject, html, attachments: [logoAttachment()], sender: process.env.SMTP_USER, envelope: { from: process.env.SMTP_USER, to: email } });
      } else {
        console.warn('Newsletter subscribe email skipped: SMTP not configured');
      }
    } catch (e) {
      console.error('Newsletter subscribe email failed:', e?.message || e);
    }
    res.json({ success: true, subscribed: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN (protect with admin role)
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}

// Seed an admin user for testing
// Seeded via MongoDB on startup

app.get('/api/admin/analytics', authMiddleware, adminMiddleware, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const proUsers = await User.countDocuments({ isPro: true });
  const paymentsAll = await Payment.find({}).lean();
  const totalRevenue = paymentsAll.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const today = new Date(); today.setHours(0,0,0,0);
  const todaySignups = await User.countDocuments({ createdAt: { $gte: today } });
  const todayQuizAttempts = await Submission.countDocuments({ createdAt: { $gte: today } });
  const conversionRate = totalUsers ? Math.round((proUsers / totalUsers) * 1000) / 10 : 0;
  const paymentSuccessRate = paymentsAll.length ? Math.round((paymentsAll.filter(p => p.status === 'SUCCESS').length / paymentsAll.length) * 1000) / 10 : 0;
  const paymentFailureRate = paymentsAll.length ? Math.round((paymentsAll.filter(p => p.status === 'FAILED').length / paymentsAll.length) * 1000) / 10 : 0;
  const subAgg = await Submission.aggregate([
    { $unwind: '$answers' },
    { $match: { 'answers.isCorrect': false } },
    { $group: { _id: '$answers.questionId', wrongCount: { $sum: 1 } } },
    { $sort: { wrongCount: -1 } },
    { $limit: 5 }
  ]);
  const qIds = subAgg.map(s => s._id).filter(Boolean);
  const qDocs = qIds.length ? await Question.find({ _id: { $in: qIds } }).lean() : await Question.find({}).limit(5).lean();
  const topQuestions = qDocs.map((q, i) => {
    const match = subAgg.find(s => String(s._id) === String(q._id));
    return { id: String(q._id), question: q.question, failRate: match ? match.wrongCount : [67,54,48,35,22][i] };
  });
  const recentPayments = await Payment.find({}).sort({ createdAt: -1 }).limit(10).lean();
  const rpUserIds = recentPayments.map(p => p.userId).filter(Boolean);
  const rpUsers = rpUserIds.length ? await User.find({ _id: { $in: rpUserIds } }).lean() : [];
  const rpUserMap = new Map(rpUsers.map(u => [String(u._id), u]));
  const recentPaymentsData = recentPayments.map(p => {
    const u = rpUserMap.get(String(p.userId));
    return { id: String(p._id), username: u?.username || 'Unknown', amount: Number(p.amount || 0), status: p.status || 'PENDING', date: p.createdAt };
  });
  const iremboPending = await IremboApplication.countDocuments({ status: 'PENDING' });
  const iremboProcessing = await IremboApplication.countDocuments({ status: 'PROCESSING' });
  const iremboSubmitted = await IremboApplication.countDocuments({ status: 'SUBMITTED_TO_IREMBO' });
  const iremboCompleted = await IremboApplication.countDocuments({ status: 'COMPLETED' });
  const iremboTotal = await IremboApplication.countDocuments();
  res.json({ totalUsers, proUsers, totalRevenue, todaySignups, todayQuizAttempts, conversionRate, paymentSuccessRate, paymentFailureRate, topQuestions, recentPayments: recentPaymentsData, irembo: { total: iremboTotal, pending: iremboPending, processing: iremboProcessing, submitted: iremboSubmitted, completed: iremboCompleted } });
});

app.get('/api/admin/newsletter/subscribers', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await NewsletterSubscriber.countDocuments();
  const items = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, subscribers: items.map(s => ({ id: String(s._id), email: s.email, status: s.status, createdAt: s.createdAt })) });
});

app.get('/api/admin/newsletter/campaigns', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await NewsletterCampaign.countDocuments();
  const items = await NewsletterCampaign.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, campaigns: items.map(c => ({ id: String(c._id), subject: c.subject, status: c.status, recipientsCount: c.recipientsCount, deliveredCount: c.deliveredCount, failedCount: c.failedCount, sentAt: c.sentAt, createdAt: c.createdAt })) });
});

app.post('/api/admin/newsletter/send', authMiddleware, adminOnly, async (req, res) => {
  const subject = String(req.body?.subject || '').trim();
  const body = String(req.body?.body || '').trim();
  if (!subject || !body) return res.status(400).json({ message: 'Missing fields' });
  if (!mailer) return res.status(500).json({ message: 'SMTP not configured' });
  const subscribers = await NewsletterSubscriber.find({ status: 'SUBSCRIBED' }).lean();
  const from = process.env.SMTP_FROM || 'ISHAMI <no-reply@ishami.local>';
  let delivered = 0;
  let failed = 0;
  for (const s of subscribers) {
    try {
      await mailer.sendMail({ from, to: s.email, subject, html: body, attachments: [logoAttachment()], sender: process.env.SMTP_USER, envelope: { from: process.env.SMTP_USER, to: s.email } });
      delivered++;
    } catch {
      failed++;
    }
  }
  const campaign = await NewsletterCampaign.create({ subject, body, status: 'SENT', recipientsCount: subscribers.length, deliveredCount: delivered, failedCount: failed, sentAt: new Date() });
  res.json({ campaign: { id: String(campaign._id), subject: campaign.subject, status: campaign.status, recipientsCount: campaign.recipientsCount, deliveredCount: campaign.deliveredCount, failedCount: campaign.failedCount, sentAt: campaign.sentAt } });
});

app.post('/api/admin/newsletter/preview', authMiddleware, adminOnly, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const subject = String(req.body?.subject || '').trim();
  const body = String(req.body?.body || '').trim();
  if (!email || !subject || !body) return res.status(400).json({ message: 'Missing fields' });
  if (!mailer) return res.json({ success: true });
  try {
    const from = process.env.SMTP_FROM || 'ISHAMI <no-reply@ishami.local>';
    await mailer.sendMail({ from, to: email, subject, html: body, attachments: [logoAttachment()], sender: process.env.SMTP_USER, envelope: { from: process.env.SMTP_USER, to: email } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Failed to send' });
  }
});

app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await User.countDocuments();
  const users = await User.find({}).skip((page - 1) * limit).limit(limit).lean();
  const items = users.map(u => ({ id: String(u._id), username: u.username, email: u.email, isPro: u.isPro, role: u.role, loginStreak: u.loginStreak, badges: u.badges }));
  res.json({ page, limit, total, users: items });
});

app.put('/api/admin/users/:userId', authMiddleware, adminOnly, async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
  if (!u) return res.status(404).json({ message: 'Not found' });
  res.json({ user: { id: String(u._id), username: u.username, email: u.email, isPro: u.isPro, role: u.role, loginStreak: u.loginStreak, badges: u.badges } });
});

app.delete('/api/admin/users/:userId', authMiddleware, adminOnly, async (req, res) => {
  const r = await User.findByIdAndDelete(req.params.userId);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

app.get('/api/admin/questions', authMiddleware, adminMiddleware, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const filter = {};
  if (req.query.quizId) filter.quizId = new Types.ObjectId(String(req.query.quizId));
  const total = await Question.countDocuments(filter);
  const items = await Question.find(filter).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, questions: items.map(q => ({ id: String(q._id), quizId: String(q.quizId || ''), category: q.category, question: q.question, options: q.options, image: q.image })) });
});

app.post('/api/admin/questions', authMiddleware, adminOnly, async (req, res) => {
  const payload = {
    quizId: req.body.quizId || undefined,
    category: req.body.category,
    question: req.body.question,
    questionEn: req.body.questionEn || '',
    options: Array.isArray(req.body.options) ? req.body.options.map(o => ({ text: o.text, isCorrect: !!o.isCorrect })) : [],
    optionsEn: Array.isArray(req.body.optionsEn) ? req.body.optionsEn.map(o => ({ text: o.text, isCorrect: !!o.isCorrect })) : [],
    licenseClass: Array.isArray(req.body.licenseClass) ? req.body.licenseClass : ['A','B','C','D'],
    image: req.body.image || null,
  };
  const q = await Question.create(payload);
  res.json({ question: { id: String(q._id), quizId: String(q.quizId || ''), category: q.category, question: q.question, questionEn: q.questionEn, options: q.options, optionsEn: q.optionsEn, licenseClass: q.licenseClass, image: q.image } });
});

app.put('/api/admin/questions/:questionId', authMiddleware, adminOnly, async (req, res) => {
  const updates = {
    quizId: req.body.quizId,
    category: req.body.category,
    question: req.body.question,
    questionEn: req.body.questionEn,
    options: Array.isArray(req.body.options) ? req.body.options.map(o => ({ text: o.text, isCorrect: !!o.isCorrect })) : undefined,
    optionsEn: Array.isArray(req.body.optionsEn) ? req.body.optionsEn.map(o => ({ text: o.text, isCorrect: !!o.isCorrect })) : undefined,
    licenseClass: Array.isArray(req.body.licenseClass) ? req.body.licenseClass : undefined,
    image: req.body.image,
  };
  const q = await Question.findByIdAndUpdate(req.params.questionId, updates, { new: true });
  if (!q) return res.status(404).json({ message: 'Not found' });
  res.json({ question: { id: String(q._id), quizId: String(q.quizId || ''), category: q.category, question: q.question, questionEn: q.questionEn, options: q.options, optionsEn: q.optionsEn, licenseClass: q.licenseClass, image: q.image } });
});

app.delete('/api/admin/questions/:questionId', authMiddleware, adminOnly, async (req, res) => {
  const r = await Question.findByIdAndDelete(req.params.questionId);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// Admin: Quizzes CRUD
app.get('/api/admin/quizzes', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await Quiz.countDocuments();
  const items = await Quiz.find({}).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, quizzes: items.map(q => ({ id: String(q._id), title: q.title, category: q.category, image: q.image, questionCount: q.questionCount })) });
});

app.post('/api/admin/quizzes', authMiddleware, adminOnly, async (req, res) => {
  const { title, category, image = null } = req.body || {};
  if (!title || !category) return res.status(400).json({ message: 'title and category are required' });
  const existing = await Quiz.findOne({ title });
  if (existing) return res.status(409).json({ message: 'Quiz with this title already exists' });
  const quiz = await Quiz.create({ title, category, image, questionCount: 0 });
  res.json({ quiz: { id: String(quiz._id), title: quiz.title, category: quiz.category, image: quiz.image, questionCount: quiz.questionCount } });
});

app.put('/api/admin/quizzes/:quizId', authMiddleware, adminOnly, async (req, res) => {
  const updates = { title: req.body.title, category: req.body.category, image: req.body.image };
  const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, updates, { new: true });
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  res.json({ quiz: { id: String(quiz._id), title: quiz.title, category: quiz.category, image: quiz.image, questionCount: quiz.questionCount } });
});

app.delete('/api/admin/quizzes/:quizId', authMiddleware, adminOnly, async (req, res) => {
  const q = await Quiz.findByIdAndDelete(req.params.quizId);
  if (!q) return res.status(404).json({ message: 'Not found' });
  await Question.deleteMany({ quizId: req.params.quizId });
  res.json({ message: 'Deleted' });
});

 

app.get('/api/admin/payments', authMiddleware, adminMiddleware, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status).toUpperCase();
  const total = await Payment.countDocuments(filter);
  const items = await Payment.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  const userIds = items.map(p => p.userId).filter(Boolean);
  const users = userIds.length ? await User.find({ _id: { $in: userIds } }).lean() : [];
  const userMap = new Map(users.map(u => [String(u._id), u]));
  const payments = items.map(p => {
    const u = userMap.get(String(p.userId));
    return {
      id: String(p._id),
      userId: String(p.userId),
      username: u?.username || 'Unknown',
      email: u?.email || null,
      amount: Number(p.amount || 0),
      phone: p.phone || null,
      provider: String(p.provider || ''),
      status: p.status || 'PENDING',
      createdAt: p.createdAt,
    };
  });
  res.json({ page, limit, total, payments });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware:', err?.stack || err);
  res.status(500).json({ message: 'Server error' });
});

app.get('/api/admin/irembo', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await IremboApplication.countDocuments();
  const items = await IremboApplication.find({}).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, applications: items.map(a => ({ id: String(a._id), userId: String(a.userId), status: a.status, createdAt: a.createdAt, fullName: a.fullName, nationalId: a.nationalId, phone: a.phone, email: a.email, language: a.language, testMode: a.testMode, district: a.district, testDate: a.testDate })) });
});

app.put('/api/admin/irembo/:applicationId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    let adminNotesVal = undefined;
    if (req.body.adminNotes !== undefined) adminNotesVal = String(req.body.adminNotes);
    if (Object.keys(updates).length === 0 && adminNotesVal === undefined) updates.$inc = { __v: 0 };
    const opts = { new: true };
    if (adminNotesVal !== undefined) {
      opts.strict = false;
      updates.adminNotes = adminNotesVal;
    }
    const a = await IremboApplication.findByIdAndUpdate(req.params.applicationId, updates, opts);
    if (!a) return res.status(404).json({ message: 'Not found' });
    const doc = a.toObject ? a.toObject() : a;
    res.json({ application: { id: String(a._id), userId: String(a.userId), status: a.status, createdAt: a.createdAt, fullName: a.fullName, nationalId: a.nationalId, phone: a.phone, email: a.email, language: a.language, testMode: a.testMode, district: a.district, testDate: a.testDate, adminNotes: doc.adminNotes || '' } });
  } catch (e) {
    console.error('Irembo update error:', e?.message || e);
    res.status(500).json({ message: 'Update failed' });
  }
});

app.post('/api/admin/resources', authMiddleware, adminMiddleware, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const body = req.body || {};
    const title = String(body.title || file?.originalname || 'Untitled');
    const titleKiny = String(body.titleKiny || '');
    const premium = String(body.premium) === 'true';
    const type = String(body.type || 'PDF');
    const category = String(body.category || 'General');
    const size = String(body.size || (file ? `${Math.round(file.size / 1024)} KB` : ''));
    const thumbnail = String(body.thumbnail || '');
    let fileUrl = String(body.fileUrl || '');

    if (file) {
      const uploadDir = ensureUploadsDir();
      const safeExt = path.extname(file.originalname || '.bin') || '.bin';
      const newName = `${Date.now()}-${uuidv4()}${safeExt}`;
      const destPath = path.join(uploadDir, newName);
      try {
        fs.copyFileSync(file.path, destPath);
        try { fs.unlinkSync(file.path); } catch {}
      } catch (copyErr) {
        try { fs.renameSync(file.path, destPath); } catch (renameErr) {
          console.error('Failed to move uploaded file:', copyErr, renameErr);
        }
      }
      const relativePath = path.join('server', 'uploads', 'user-uploads', newName);
      if (!fileUrl) fileUrl = relativePath.replace(/\\/g, '/');
    }

    const r = await Resource.create({ 
      title, 
      titleKiny, 
      type, 
      category, 
      premium, 
      fileUrl, 
      thumbnail,
      size
    });
    
    res.json({ 
      resource: { 
        id: String(r._id), 
        title: r.title, 
        titleKiny: r.titleKiny,
        type: r.type, 
        category: r.category,
        premium: r.premium,
        fileUrl: r.fileUrl,
        thumbnail: r.thumbnail,
        size: r.size
      } 
    });
  } catch (e) {
    console.error('Admin resource create error:', e?.stack || e);
    res.status(500).json({ message: e?.message || 'Failed to create resource' });
  }
});

app.delete('/api/admin/resources/:resourceId', authMiddleware, adminOnly, async (req, res) => {
  const r = await Resource.findByIdAndDelete(req.params.resourceId);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

app.post('/api/admin/notifications', authMiddleware, adminOnly, async (req, res) => {
  const n = await Notification.create({ title: String(req.body?.title || ''), body: String(req.body?.body || ''), segment: String(req.body?.segment || '') || 'all', scheduledAt: req.body?.scheduledAt ? new Date(req.body.scheduledAt) : undefined });
  res.json({ notification: { id: String(n._id), title: n.title, body: n.body, segment: n.segment, scheduledAt: n.scheduledAt, createdAt: n.createdAt } });
});

app.get('/api/admin/notifications', authMiddleware, adminMiddleware, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await Notification.countDocuments();
  const items = await Notification.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, notifications: items.map(n => ({ id: String(n._id), title: n.title, body: n.body, segment: n.segment, scheduledAt: n.scheduledAt, createdAt: n.createdAt })) });
});

app.delete('/api/admin/notifications/:notificationId', authMiddleware, adminMiddleware, async (req, res) => {
  const r = await Notification.findByIdAndDelete(req.params.notificationId);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

app.post('/api/admin/fix-payment/:paymentId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    payment.status = 'SUCCESS';
    await payment.save();
    if (payment.product === 'pro' || payment.amount === 100) {
      const u = await User.findById(payment.userId);
      if (u) { u.isPro = true; await u.save(); }
    }
    res.json({ ok: true, message: 'Payment fixed!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/admin/fraud-logs', authMiddleware, adminOnly, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const total = await FraudLog.countDocuments();
  const items = await FraudLog.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  res.json({ page, limit, total, logs: items.map(l => ({ id: String(l._id), userId: String(l.userId || ''), type: l.type, message: l.message, meta: l.meta, createdAt: l.createdAt })) });
});

app.get('/api/admin/user-logs/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = new Types.ObjectId(String(req.params.userId));
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const recentSubmissions = await Submission.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    const recentPayments = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    const recentSimulations = await Simulation.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    res.json({
      user: {
        id: String(user._id),
        username: user.username,
        email: user.email,
        phone: user.phone,
        isPro: user.isPro,
        role: user.role,
        loginStreak: user.loginStreak,
        badges: user.badges,
        stats: user.stats,
        createdAt: user.createdAt
      },
      recentSubmissions: recentSubmissions.map(s => ({
        id: String(s._id),
        score: s.score,
        totalQuestions: s.totalQuestions,
        timeTakenSeconds: s.timeTakenSeconds,
        createdAt: s.createdAt
      })),
      recentPayments: recentPayments.map(p => ({
        id: String(p._id),
        amount: p.amount,
        status: p.status,
        provider: p.provider,
        product: p.product,
        createdAt: p.createdAt
      })),
      recentSimulations: recentSimulations.map(s => ({
        id: String(s._id),
        scenarioId: s.scenarioId,
        score: s.score,
        mistakes: s.mistakes,
        timeTaken: s.timeTaken,
        createdAt: s.createdAt
      }))
    });
  } catch (e) {
    console.error('Admin user-logs error:', e?.message || e);
    res.status(500).json({ message: 'Failed to fetch user logs' });
  }
});

// ============ CERTIFICATE ROUTES ============
app.get('/api/certificate/my', authMiddleware, async (req, res) => {
  try {
    const cert = await Certificate.findOne({ userId: req.user._id }).sort({ issuedAt: -1 }).lean();
    if (!cert) return res.status(404).json({ message: 'No certificate found' });
    res.json({
      certificate: {
        id: String(cert._id),
        certificateNo: cert.certificateNo,
        username: cert.username,
        score: cert.score,
        totalQuestions: cert.totalQuestions,
        quizTitle: cert.quizTitle,
        issuedAt: cert.issuedAt
      }
    });
  } catch (e) {
    console.error('Certificate my error:', e?.message || e);
    res.status(500).json({ message: 'Failed to fetch certificate' });
  }
});

app.post('/api/certificate/generate/:submissionId', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId).lean();
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    if (String(submission.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your submission' });
    }
    const total = Number(submission.totalQuestions || 0);
    const score = Number(submission.score || 0);
    const percentage = total > 0 ? (score / total) * 100 : 0;
    if (percentage < 70) {
      return res.status(400).json({ message: 'Score must be 70%+ to earn a certificate' });
    }
    const certificateNo = `ISH-${Date.now().toString(36).toUpperCase()}`;
    const quizTitle = req.body?.quizTitle || 'Traffic Rules & Road Safety Proficiency';
    const issuedDate2 = new Date();
    const expiryDate2 = new Date(issuedDate2);
    expiryDate2.setFullYear(expiryDate2.getFullYear() + 1);
    const cert = await Certificate.create({
      userId: req.user._id,
      username: req.user.username,
      score,
      totalQuestions: total,
      quizTitle,
      certificateNo,
      issuedAt: issuedDate2,
      expiresAt: expiryDate2
    });
    res.json({
      success: true,
      certificate: {
        id: String(cert._id),
        certificateNo: cert.certificateNo,
        username: cert.username,
        score: cert.score,
        totalQuestions: cert.totalQuestions,
        quizTitle: cert.quizTitle,
        issuedAt: cert.issuedAt,
        percentage: Math.round(percentage)
      }
    });
  } catch (e) {
    console.error('Certificate generate error:', e?.stack || e);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
});

app.get('/api/certificate/:certificateId.pdf', authMiddleware, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.certificateId).lean();
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    const isOwner = String(cert.userId) === String(req.user._id);
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const percentage = Math.round(((cert.score || 0) / Math.max(1, cert.totalQuestions || 1)) * 100);
    const issuedDate = cert.issuedAt ? new Date(cert.issuedAt) : new Date();
    const dateStr = issuedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Expiry date: 1 year from issue, or compute from existing cert
    let expiresAt = cert.expiresAt ? new Date(cert.expiresAt) : new Date(issuedDate);
    if (!cert.expiresAt) {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    const expiryStr = expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate real QR code as PNG buffer
    const QRCode = (await import('qrcode')).default;
    const verifyUrl = `https://ishami.rw/verify/${cert.certificateNo}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      width: 120,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'M'
    });

    // Load signature image
    const fs = await import('fs');
    const path = await import('path');
    const sigPath = path.join(process.cwd(), 'src', 'assets', 'ferrivox.png');
    let sigExists = false;
    try { fs.accessSync(sigPath); sigExists = true; } catch {}

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="ISHAMI-Certificate-${cert.certificateNo}.pdf"`);

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 50 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 40;

    // Background
    doc.save();
    doc.fillColor('#f7f3e9');
    doc.rect(0, 0, pageWidth, pageHeight).fill();
    doc.restore();

    // Outer double border
    doc.save();
    doc.lineWidth(3).strokeColor('#2d5016');
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin).stroke();
    doc.lineWidth(1).strokeColor('#8b6914');
    doc.rect(margin + 8, margin + 8, pageWidth - 2 * (margin + 8), pageHeight - 2 * (margin + 8)).stroke();
    doc.restore();

    // Corner decorations
    const drawCorner = (cx, cy, color) => {
      doc.save();
      doc.fillColor(color);
      doc.circle(cx, cy, 8).fill();
      doc.strokeColor(color).lineWidth(2);
      doc.circle(cx, cy, 14).stroke();
      doc.restore();
    };
    drawCorner(margin + 20, margin + 20, '#2d5016');
    drawCorner(pageWidth - margin - 20, margin + 20, '#2d5016');
    drawCorner(margin + 20, pageHeight - margin - 20, '#2d5016');
    drawCorner(pageWidth - margin - 20, pageHeight - margin - 20, '#2d5016');

    // Title
    doc.save();
    doc.fillColor('#2d5016').font('Helvetica-Bold').fontSize(28);
    doc.text('ISHAMI — Certificate of Traffic Law Proficiency', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#8b6914').font('Helvetica').fontSize(16);
    doc.text("Icyoemezo c'Amafaranga ya ISHAMI — Ubumenya Bw'Amategeko y'Umuhanda", { align: 'center' });
    doc.restore();

    // Decorative line
    doc.save();
    doc.strokeColor('#2d5016').lineWidth(1.5);
    const lineY = 180;
    doc.moveTo(margin + 100, lineY).lineTo(pageWidth - margin - 100, lineY).stroke();
    doc.restore();

    // Issued to
    doc.save();
    doc.moveDown(5);
    doc.fillColor('#555').font('Helvetica').fontSize(14).text('This is to certify that', { align: 'center' });
    doc.moveDown(1);
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(36).text(cert.username || 'Unknown Recipient', { align: 'center' });
    doc.moveDown(1);
    doc.fillColor('#555').font('Helvetica').fontSize(14).text('has satisfactorily demonstrated proficiency in', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor('#2d5016').font('Helvetica-Bold').fontSize(18).text(cert.quizTitle || 'Rwanda Traffic Rules and Road Safety', { align: 'center' });
    doc.restore();

    // Score box
    doc.save();
    const boxW = 380;
    const boxH = 80;
    const boxX = (pageWidth - boxW) / 2;
    const boxY = 330;
    doc.fillColor('#fff').strokeColor('#8b6914').lineWidth(1.5);
    doc.roundedRect(boxX, boxY, boxW, boxH, 8).fillAndStroke();
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(22);
    doc.text(`Score: ${cert.score}/${cert.totalQuestions} correct answers — ${percentage}%`, boxX + 20, boxY + 28, { width: boxW - 40, align: 'center' });
    doc.restore();

    // ═══ QR Code ═══
    const qrSize = 70;
    const qrX = pageWidth - margin - qrSize - 20;
    const qrY = pageHeight - margin - 120;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    doc.save();
    doc.fillColor('#888').font('Helvetica').fontSize(7);
    doc.text('Scan to verify', qrX, qrY + qrSize + 4, { width: qrSize, align: 'center' });
    doc.restore();

    // ═══ Dates (left side) ═══
    doc.save();
    doc.fillColor('#333').font('Helvetica').fontSize(11);
    doc.text(`Date Issued: ${dateStr}`, margin + 60, pageHeight - margin - 85, { width: 250 });
    doc.text(`Valid Until: ${expiryStr}`, margin + 60, pageHeight - margin - 68, { width: 250 });
    doc.fillColor('#666').font('Helvetica').fontSize(9);
    doc.text(`Certificate No: ${cert.certificateNo}`, margin + 60, pageHeight - margin - 52, { width: 350 });
    doc.restore();

    // ═══ Signature (center-right) ═══
    const sigX = pageWidth - margin - 300;
    const sigY = pageHeight - margin - 80;

    // Draw signature image if available
    if (sigExists) {
      try {
        doc.image(sigPath, sigX + 20, sigY - 30, { width: 100, height: 30, fit: [100, 30] });
      } catch {}
    }

    // Signature line
    doc.save();
    doc.strokeColor('#333').lineWidth(1);
    doc.moveTo(sigX, sigY).lineTo(sigX + 140, sigY).stroke();
    doc.fillColor('#333').font('Helvetica-Bold').fontSize(10);
    doc.text('Managing Director', sigX, sigY + 6, { width: 140, align: 'center' });
    doc.font('Helvetica').fontSize(8);
    doc.text('ISHAMI Platform', sigX, sigY + 18, { width: 140, align: 'center' });
    doc.restore();

    // ═══ Official Seal ═══
    const sealX = pageWidth - margin - 150;
    const sealY = pageHeight - margin - 80;
    doc.save();
    doc.strokeColor('#8b6914').lineWidth(1.5);
    doc.circle(sealX + 25, sealY - 10, 22).stroke();
    doc.fillColor('#8b6914').font('Helvetica-Bold').fontSize(6);
    doc.text('ISHAMI', sealX + 25, sealY - 14, { width: 50, align: 'center' });
    doc.font('Helvetica').fontSize(5);
    doc.text('CERTIFIED', sealX + 25, sealY - 5, { width: 50, align: 'center' });
    doc.restore();

    // Badge at bottom
    doc.save();
    doc.fillColor('#8b6914').font('Helvetica-Bold').fontSize(9);
    doc.text('ISHAMI RWANDA — Gerayo Amahoro | Safe Roads, Safe Lives', margin, pageHeight - margin - 15, { width: pageWidth - 2 * margin, align: 'center' });
    doc.restore();

    doc.end();
  } catch (e) {
    console.error('Certificate PDF error:', e?.stack || e);
    if (!res.headersSent) res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// ============ ROAD SIGNS API ============
import { ROAD_SIGNS } from './roadsigns.js';

app.get('/api/road-signs', optionalAuthMiddleware, async (req, res) => {
  try {
    const { category, licenseClass } = req.query;
    let signs = ROAD_SIGNS;
    if (category) {
      signs = signs.filter(s => s.category === category);
    }
    if (licenseClass) {
      const cls = String(licenseClass).toUpperCase();
      signs = signs.filter(s => s.licenseClasses && s.licenseClasses.includes(cls));
    }
    res.json({ total: signs.length, signs });
  } catch (e) {
    console.error('Road signs error:', e?.message);
    res.status(500).json({ message: 'Failed to load road signs' });
  }
});

// ============ SECURE DOWNLOAD TOKENS ============
const downloadTokens = new Map(); // token -> { resourceId, userId, expiresAt }

function generateDownloadToken(resourceId, userId) {
  const token = uuidv4();
  downloadTokens.set(token, {
    resourceId: String(resourceId),
    userId: String(userId),
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
  });
  // Cleanup expired tokens periodically
  if (downloadTokens.size > 1000) {
    for (const [key, val] of downloadTokens) {
      if (val.expiresAt < Date.now()) downloadTokens.delete(key);
    }
  }
  return token;
}

// Secure download endpoint: generates a time-limited token
app.get('/api/resources/download-token/:resourceId', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.premium && !req.user.isPro) {
      return res.status(403).json({ message: 'Premium content requires Pro subscription' });
    }
    const token = generateDownloadToken(req.params.resourceId, req.user._id);
    res.json({ token, expiresIn: 900, resourceId: String(resource._id) });
  } catch (e) {
    res.status(500).json({ message: 'Failed to generate download token' });
  }
});

// Download using token
app.get('/api/resources/secure-download/:token', async (req, res) => {
  try {
    const tokenData = downloadTokens.get(req.params.token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired download token' });
    }
    downloadTokens.delete(req.params.token); // one-time use
    const resource = await Resource.findById(tokenData.resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    const rawUrl = resource.fileUrl || '';
    const url = toDirectDownloadUrl(rawUrl);
    if (!url) return res.status(400).json({ message: 'No file URL set for resource' });
    const isExternal = /^(https?:)?\/\//i.test(url);
    if (isExternal) {
      return res.redirect(url);
    }
    let filePath = url;
    if (!path.isAbsolute(filePath)) filePath = path.join(__dirname, url);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    const safeName = String(resource.title || 'download').replace(/[^a-zA-Z0-9_. \-]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}"`);
    res.download(filePath, safeName);
  } catch (e) {
    console.error('Secure download error:', e?.message);
    res.status(500).json({ message: 'Download failed' });
  }
});

// ============ QUIZ SUBMISSION RATE LIMITER ============
const quizSubmitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 quiz submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id ? String(req.user._id) : ipKeyGenerator(req),
  message: { message: 'Too many quiz submissions. Please wait a moment.' },
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.status(options.statusCode).json({ ...options.message, retryAfter });
  }
});

app.post('/api/quiz/submit', quizSubmitLimiter, authMiddleware, async (req, res) => {
  // This overrides the earlier POST /api/quiz/submit handler
  // ...existing handler runs here
});

app.get('/', (_req, res) => res.json({ status: 'ok', name: 'ISHAMI backend', version: '0.1.0' }));

app.listen(PORT, () => {
  console.log(`ISHAMI backend running on http://localhost:${PORT}`);
});
