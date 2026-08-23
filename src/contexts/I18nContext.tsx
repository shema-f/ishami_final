import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'rw';

type Translations = Record<string, Record<Lang, string>>;

const translations: Translations = {
  // ==== NAVIGATION ====
  'nav.home':            { en: 'Home', rw: 'Ahabanza' },
  'nav.aiAssistant':     { en: 'AI Assistant', rw: 'AI Musigati' },
  'nav.quiz':            { en: 'Quiz', rw: 'Ibazo' },
  'nav.simulation':      { en: '3D Simulation', rw: '3D Simulation' },
  'nav.resources':       { en: 'Resources', rw: 'Ibitekerezo' },
  'nav.leaderboard':     { en: 'Leaderboard', rw: 'Urutonde' },
  'nav.signIn':          { en: 'Sign In', rw: 'Injira' },
  'nav.getStarted':      { en: 'Get Started', rw: 'Tangira' },
  'nav.signOut':         { en: 'Sign Out', rw: 'Sohoka' },

  // ==== FOOTER ====
  'footer.subtitle':     { en: 'Traffic Rules', rw: 'Amategeko y\'Umuhanda' },
  'footer.description':  { en: 'Master Rwanda Traffic Rules with interactive quizzes, AI assistance, and 3D simulations. Menya Amategeko y\'Umuhanda mu buryo bugezweho.', rw: 'Menya Amategeko y\'Umuhanda mu Rwanda ukoresheje ibazo, AI, na 3D simulations. Ushobora kugena neza.' },
  'footer.quickLinks':   { en: 'Quick Links', rw: 'Amahero Nini' },
  'footer.legal':        { en: 'Legal', rw: 'Amategeko' },
  'footer.contactUs':    { en: 'Contact Us', rw: 'Tuvugane' },
  'footer.privacy':      { en: 'Privacy Policy', rw: 'Politiki y\'Ibanga' },
  'footer.terms':        { en: 'Terms of Service', rw: 'Amasezerano' },
  'footer.cookies':      { en: 'Cookie Policy', rw: 'Politiki ya Cookies' },
  'footer.rights':       { en: 'All rights reserved.', rw: 'Uburenganzira bwose buratungwa.' },
  'footer.madeIn':       { en: 'Made with', rw: 'Yakozwe na' },
  'footer.partnership':  { en: 'In partnership with', rw: 'Mu bikorwa na' },

  // ==== ROOT / INSTALL APP ====
  'root.installTitle':   { en: 'Install ISHAMI App', rw: 'Kora ISHAMI App ihere' },
  'root.installDesc':    { en: 'Get the best experience by installing our app. Works offline!', rw: 'Koresha neza app isura nziza. Ikorwaho nta intaneti!' },
  'root.installNow':     { en: 'Install Now', rw: 'Kora Ubu' },
  'root.maybeLater':     { en: 'Maybe Later', rw: 'Nyuma' },

  // ==== HOME PAGE ====
  'home.hero.eyebrow':   { en: '🚗 Rwanda Traffic Rules Learning Platform', rw: '🚗 Urubuga rwo Kwiga Amategeko y\'Umuhanda' },
  'home.hero.title1':    { en: 'Master', rw: 'Menya' },
  'home.hero.title2':    { en: 'Amategeko y\'Umuhanda', rw: 'Amategeko y\'Umuhanda' },
  'home.hero.title3':    { en: 'with Confidence', rw: 'Umenya Neza' },
  'home.hero.subtitle':  { en: 'Learn Rwanda traffic rules through interactive quizzes, AI-powered assistance, and immersive 3D driving simulations — before you hit the road.', rw: 'Kiga amategeko y\'umuhanda mu Rwanda ukoresheje ibazo, AI, na 3D simulations — mbere yo kugenda ku isura.' },
  'home.hero.startQuiz': { en: 'Start Free Quiz', rw: 'Tangira Quiz' },
  'home.hero.trySim':    { en: 'Try 3D Simulator', rw: 'Kora 3D Simulator' },
  'home.hero.users':     { en: 'Active learners', rw: 'Abiga batandukanye' },
  'home.hero.questions': { en: 'Practice questions', rw: 'Ibazo byo kugena' },
  'home.hero.passrate':  { en: 'Avg. pass rate', rw: 'Igiciro cyo kumenya' },

  'home.features.title': { en: 'Why Learn With ISHAMI', rw: 'Kuki Ushobora Kugena na ISHAMI' },
  'home.features.sub':   { en: 'Everything you need to pass your driving test — and be a safe driver for life.', rw: 'Ibintu byose ukeneye kugena igihe ukora test — kandi ukore umuyobozi w\'umuhanda utoza.' },

  'home.feat1.title':    { en: 'AI-Powered Tutor', rw: 'AI Musigati' },
  'home.feat1.desc':     { en: 'Get instant, personalized explanations to any traffic rule question.', rw: 'Menya ibintu byose ku nguvu y\'amategeko ya AI.' },
  'home.feat2.title':    { en: '3D Driving Sim', rw: '3D Driving Sim' },
  'home.feat2.desc':     { en: 'Practice real-world driving in a safe, immersive 3D city.', rw: 'Kugena gutwara imodoka mu mujyi wa 3D utoza.' },
  'home.feat3.title':    { en: 'Quiz Mode', rw: 'Ibazo' },
  'home.feat3.desc':     { en: 'Thousands of exam-style questions with instant feedback.', rw: 'Ibazo byinshi n\'ibisubizo byakuvugururaho.' },
  'home.feat4.title':    { en: 'Offline Ready', rw: 'Offline Nta Mpamvu' },
  'home.feat4.desc':     { en: 'Install the PWA and learn anywhere, even without internet.', rw: 'Kora PWA kandi ugeze aho hose ntakibazo.' },

  'home.flip.title':     { en: '🎴 Test Your Knowledge', rw: '🎴 Kumenya Ubwenge Bwawe' },
  'home.flip.subtitle':  { en: 'Flip the cards to reveal answers — Hindura amakarita urebe ibisubizo', rw: 'Hindura amakarita urebe ibisubizo — Flip the cards to reveal answers' },
  'home.flip.hint':      { en: 'Click any card to flip and reveal the correct answer. Ibintu bisobanura neza.', rw: 'Kanda karita icyo ari cyo cyose kumenya ibisubizo. The answers are revealed clearly.' },

  'home.testimonials.title': { en: '💬 Loved by Learners', rw: '💬 Biteganyijwe na Abiga' },
  'home.cta.title':      { en: 'Ready to Master the Road?', rw: 'Witegure Kumenya Umuhanda?' },
  'home.cta.subtitle':   { en: 'Join thousands of Rwandans passing their driving test with ISHAMI.', rw: 'Hugura urubuga rw\'Abanyarwanda benshi baiteranye amategeko na ISHAMI.' },
  'home.cta.start':      { en: 'Start Learning Free', rw: 'Tangira Kugena' },

  'home.newsletter.title': { en: '📬 Stay Updated', rw: '📬 Tuganirize' },
  'home.newsletter.desc':  { en: 'Get new practice questions, tips, and updates every week.', rw: 'Reba ibazo nshya, ibitekerezo, no guhuzwa buri cyumweru.' },
  'home.newsletter.email': { en: 'Email address', rw: 'Aderesi ya Email' },
  'home.newsletter.sub':   { en: 'Subscribe', rw: 'Iyandikishe' },

  // ==== AUTH PAGE ====
  'auth.welcome':       { en: 'Welcome to ISHAMI', rw: 'Murakaza neza kuri ISHAMI' },
  'auth.tagline':       { en: 'Master Rwanda Traffic Rules with AI-powered learning', rw: 'Menya Amategeko y\'Umuhanda ukoresheje AI' },
  'auth.feat1':         { en: '3,000+ practice questions', rw: 'Ibazo 3,000+ byo kugena' },
  'auth.feat2':         { en: 'Realistic 3D driving simulator', rw: '3D simulator yo gutwara imodoka' },
  'auth.feat3':         { en: 'AI tutor 24/7', rw: 'AI musigati 24/7' },
  'auth.feat4':         { en: 'Track your progress', rw: 'Kumenya ibyo wagiye' },

  'auth.signIn':        { en: 'Sign In', rw: 'Injira' },
  'auth.signUp':        { en: 'Sign Up', rw: 'Iyandikishe' },
  'auth.welcomeBack':   { en: 'Welcome Back!', rw: 'Murakaza neza!' },
  'auth.createAccount': { en: 'Create Account', rw: 'Kora Konti' },
  'auth.signInTo':      { en: 'Sign in to continue your learning journey', rw: 'Injira kugirango ugeze aho uherutse' },
  'auth.createAcc':     { en: 'Create your account to start mastering traffic rules', rw: 'Kora konti yawe kugirango utange kumenya amategeko' },

  'auth.username':      { en: 'Username', rw: 'Izina ryawe' },
  'auth.email':         { en: 'Email', rw: 'Email' },
  'auth.phone':         { en: 'Phone Number', rw: 'Nimero ya Telefone' },
  'auth.password':      { en: 'Password', rw: 'Ijambobanga' },
  'auth.confirmPass':   { en: 'Confirm Password', rw: 'Emeza Ijambobanga' },
  'auth.orContinue':    { en: 'Or continue with', rw: 'Cyangwa komeza na' },
  'auth.google':        { en: 'Continue with Google', rw: 'Komeza na Google' },
  'auth.facebook':      { en: 'Continue with Facebook', rw: 'Komeza na Facebook' },
  'auth.phoneLogin':    { en: 'Continue with Phone', rw: 'Komeza na Telefone' },
  'auth.forgot':        { en: 'Forgot password?', rw: 'Wibagiwe ijambobanga?' },
  'auth.reset':         { en: 'Reset Password', rw: 'Hindura Ijambobanga' },
  'auth.noAcc':         { en: "Don't have an account?", rw: 'Nta konti ufite?' },
  'auth.hasAcc':        { en: 'Already have an account?', rw: 'Ufite konti?' },
  'auth.createNow':     { en: 'Create one now', rw: 'Kora ubu' },
  'auth.signInNow':     { en: 'Sign in here', rw: 'Injira hano' },

  // ==== SIMULATION PAGE ====
  'sim.hero.title':      { en: '3D Driving Simulation', rw: '3D Driving Simulation' },
  'sim.hero.subtitle':   { en: 'Learn & Master Traffic Rules', rw: 'Menya neza Amategeko y\'Umuhanda' },
  'sim.hero.desc':       { en: 'Experience immersive 3D driving scenarios. Practice real-world situations safely and learn Rwanda\'s traffic rules through interactive gameplay. 🚗', rw: 'Kugena gutwara imodoka mu 3D. Menya amategeko y\'umuhanda mu Rwanda ukoresheje igikoresho cyiza. 🚗' },
  'sim.hero.play':       { en: 'Ready to Play?', rw: 'Witegure?' },

  'sim.how.title':       { en: '🎮 How It Works', rw: '🎮 Uko Ikora' },
  'sim.how.learn.title': { en: '📚 Learn Traffic Rules', rw: '📚 Kiga Amategeko' },
  'sim.how.learn.desc':  { en: 'Answer educational quizzes during gameplay to learn Rwanda\'s traffic rules.', rw: 'Subiza ibazo mu mujya ukina kugirango umenye amategeko y\'umuhanda.' },
  'sim.how.points.title':{ en: '⭐ Earn Points', rw: '⭐ Kora Ibipimo' },
  'sim.how.points.desc': { en: 'Correct answers and safe driving earn you points. Violations reduce your score.', rw: 'Ibisubizo neza kandi gutwara neza zibona ibipimo. Ibihekwa byadakora.' },
  'sim.how.rank.title':  { en: '🏆 Climb Leaderboard', rw: '🏆 Tungura Urutonde' },
  'sim.how.rank.desc':   { en: 'Compete with other players and climb the global leaderboard!', rw: 'Guhagarara n\'abandi kandi wezuru urutonde rwose!' },

  'sim.scenarios.title': { en: 'Available Scenarios', rw: 'Ibitekerezo Bihari' },
  'sim.scenarios.sub':   { en: 'Master every aspect of driving with our comprehensive simulation modules', rw: 'Kumenya ibintu byose byo gutwara imodoka ukoresheje ibitekerezo byiza' },

  'sim.feat.title':      { en: '✨ Features', rw: '✨ Ibintu Biri Mo' },
  'sim.feat.missions':   { en: 'Interactive Missions', rw: 'Ibikorwa Byiza' },
  'sim.feat.missionsD':  { en: 'Complete specific driving objectives', rw: 'Kugena ibyo gutwara imodoka' },
  'sim.feat.feedback':   { en: 'Real-time Feedback', rw: 'Ibisubizo Bya Saati' },
  'sim.feat.feedbackD':  { en: 'Get instant feedback on your driving', rw: 'Menya ibintu byose ku myitwarire yawe' },
  'sim.feat.rules':      { en: 'Traffic Rules', rw: 'Amategeko y\'Umuhanda' },
  'sim.feat.rulesD':     { en: 'Learn Rwanda\'s official traffic regulations', rw: 'Menya amategeko y\'umuhanda y\'igihugu' },
  'sim.feat.funny':      { en: 'Funny Moments', rw: 'Ibihekwa' },
  'sim.feat.funnyD':     { en: 'Enjoy silly car physics and sound effects', rw: 'Gushima imyitwarire ya modoka n\'amajwi meza' },

  // Scenario names
  'scen.1.title':        { en: 'Guided Start', rw: 'Gutangira Gutwara' },
  'scen.1.desc':         { en: 'Learn proper vehicle starting procedures', rw: 'Kumenya gutangira neza imodoka' },
  'scen.2.title':        { en: 'Traffic Flow', rw: 'Kugendagenda' },
  'scen.2.desc':         { en: 'Navigate traffic and follow rules', rw: 'Kugenda ku muhanda kuzinga amategeko' },
  'scen.3.title':        { en: 'Corners & Turns', rw: 'Imfuruka' },
  'scen.3.desc':         { en: 'Master turning techniques', rw: 'Menya imfuruka neza' },
  'scen.4.title':        { en: 'Parking', rw: 'Guhagarika' },
  'scen.4.desc':         { en: 'Parallel and perpendicular parking', rw: 'Guhagarika imodoka mu buryo bwiza' },
  'scen.5.title':        { en: 'Highway Driving', rw: 'Gutwara kuri Highway' },
  'scen.5.desc':         { en: 'High-speed driving and overtaking', rw: 'Gutwara cyihuse kandi gusubiza' },
  'scen.6.title':        { en: 'T-Cross Scenario', rw: 'Ihuriro ry\'Umuhanda T' },
  'scen.6.desc':         { en: 'Priority rules at T-intersections', rw: 'Amategeko y\'ihuriro T' },

  // Difficulties
  'diff.beginner':       { en: 'Beginner', rw: 'Umutangira' },
  'diff.intermediate':   { en: 'Intermediate', rw: 'Wihuse' },
  'diff.advanced':       { en: 'Advanced', rw: 'Umenya Neza' },

  // Generic
  'common.select':       { en: 'Select Scenario', rw: 'Hitamo' },
  'common.estimated':    { en: 'min', rw: 'min' },
  'common.objectives':   { en: 'Objectives', rw: 'Ibitekerezo' },
  'common.difficulty':   { en: 'Difficulty', rw: 'Ubushyuhe' },

  // ==== QUIZ PAGE ====
  'quiz.title':          { en: 'Choose a Quiz', rw: 'Hitamo Ibazo' },
  'quiz.subtitle':       { en: 'Each quiz contains 20 questions. Test your knowledge!', rw: 'Ibazo rifite ibibazo 20. Meza ubumenyi bwawe!' },
  'quiz.start':          { en: 'Start Quiz', rw: 'Tangira Ibazo' },
  'quiz.next':           { en: 'Next Question', rw: 'Ibazo Rikurikira' },
  'quiz.finish':         { en: 'Finish Quiz', rw: 'Komeza Ibazo' },
  'quiz.previous':       { en: 'Previous', rw: 'Ibanza' },
  'quiz.timeLeft':       { en: 'Time Left', rw: 'Igihe Riri Rindikiye' },
  'quiz.progress':       { en: 'Progress', rw: 'Iterambere' },
  'quiz.score':          { en: 'Score', rw: 'Amanota' },
  'quiz.congrats':       { en: 'Congratulations! 🎉', rw: 'Twabuze Neza! 🎉' },
  'quiz.keepPracticing': { en: 'Keep Practicing! 💪', rw: 'Komeza Utagire! 💪' },
  'quiz.passMessage':    { en: 'Excellent work! You\'re ready for the real driving test.', rw: 'Akazi keza! Witegure ikizamini cy\'umuhanda.' },
  'quiz.failMessage':    { en: 'You need 70% to pass. Review the materials and try again.', rw: 'Ukeneye 70% kugira ngo upasse. Rere ibicuruzwa ukazame nano.' },
  'quiz.getCertificate': { en: '🎓 Get Your Certificate', rw: '🎓 Shyiraho Icyemezo Cyawe' },
  'quiz.tryAgain':       { en: 'Try Again', rw: 'Ongera Utry' },
  'quiz.viewLeaderboard':{ en: 'View Leaderboard', rw: 'Raba Urutonde' },
  'quiz.unlockPro':      { en: 'Unlock Pro Access', rw: 'Fungura Pro' },
  'quiz.payMessage':     { en: 'You\'ve completed 6 free questions! Unlock all 20 questions and premium features for only', rw: 'Warakora ibibazo 6 by\'ubuntu! Fungura ibibazo 20 byose no ibintu by\'agaciro by\'agaciro kandi amafaranga y\'ubusa kandi:' },
  'quiz.language':       { en: 'Language', rw: 'Ururimi' },
  'quiz.kinyarwanda':    { en: 'Kinyarwanda', rw: 'Ikinyarwanda' },
  'quiz.english':        { en: 'English', rw: 'Icyongereza' },

  // ==== CERTIFICATE PAGE ====
  'cert.title':          { en: 'CERTIFICATE OF COMPLETION', rw: 'ICYEMEZO CYO KUZURWA' },
  'cert.presentedTo':    { en: 'This certificate is proudly presented to', rw: 'Icyemezo cy\'isi kiratanga rwose kuri' },
  'cert.forCompleting':  { en: 'for successfully completing the', rw: 'ku kwuzuza neza' },
  'cert.program':        { en: 'Program', rw: 'Program' },
  'cert.areasTitle':     { en: 'Areas of Understanding', rw: 'Ubuso bw\'Ubumenyi' },
  'cert.trainingResult': { en: 'Training Result', rw: 'Igisubizo cy\'Amahugurwa' },
  'cert.finalScore':     { en: 'Final Score', rw: 'Amanota ya Nyuma' },
  'cert.trainingLevel':  { en: 'Training Level', rw: 'Urwego rw\'Amahugurwa' },
  'cert.certificateNo':  { en: 'Certificate No.', rw: 'Nomero y\'Icyemezo' },
  'cert.dateIssued':     { en: 'Date Issued', rw: 'Itariki Yatangiriye' },
  'cert.downloadPdf':    { en: 'Download PDF Certificate', rw: 'Kurura Icyemezo PDF' },
  'cert.printCert':      { en: 'Print Certificate', rw: 'Gucapa Icyemezo' },
  'cert.verifyLink':     { en: 'Certificate Verification', rw: 'Kwemeza Icyemezo' },

  // HUD / Driving Simulator
  'hud.score':           { en: 'Score', rw: 'Amanota' },
  'hud.violations':      { en: 'Violations', rw: 'Ibihekwa' },
  'hud.time':            { en: 'Time', rw: 'Igihe' },
  'hud.scenario':        { en: 'Scenario', rw: 'Umutekano' },
  'hud.speed':           { en: 'Speed', rw: 'Umuvuduko' },
  'hud.fuel':            { en: 'Fuel', rw: 'Umuriro' },
  'hud.end':             { en: 'End Game', rw: 'Hagarara' },
  'hud.sound':           { en: 'Sound', rw: 'Ijwi' },
  'hud.muted':           { en: 'Muted', rw: 'Nta Majwi' },
};

interface I18nCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'ishami.lang';

const I18nContext = createContext<I18nCtx | undefined>(undefined);

const detectInitial = (): Lang => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'rw') return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('rw') || nav.startsWith('kin')) return 'rw';
    return 'en';
  } catch {
    return 'en';
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitial());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    try {
      document.documentElement.lang = lang === 'rw' ? 'rw' : 'en';
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: string, fallback?: string) => {
    const tr = translations[key];
    if (!tr) {
      return fallback ?? key;
    }
    return tr[lang] ?? tr.en ?? fallback ?? key;
  }, [lang]);

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside <I18nProvider>');
  }
  return ctx;
}
