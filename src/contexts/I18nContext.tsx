import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'rw';

type Translations = Record<string, Record<Lang, string>>;

const translations: Translations = {
  // ==== NAVIGATION ====
  'nav.home':            { en: 'Home', rw: 'Ahabanza' },
  'nav.aiAssistant':     { en: 'AI Assistant', rw: ' AI ' },
  'nav.quiz':            { en: 'Quiz', rw: 'Ibizamini' },
  'nav.simulation':      { en: '3D Simulation', rw: '3D simulation' },
  'nav.resources':       { en: 'Resources', rw: 'Imfashanyigisho' },
  'nav.leaderboard':     { en: 'Leaderboard', rw: 'Leaderboard' },
  'nav.signIn':          { en: 'Sign In', rw: 'Injira' },
  'nav.getStarted':      { en: 'Get Started', rw: 'Tangira Ubu' },
  'nav.signOut':         { en: 'Sign Out', rw: 'Sohoka' },

  // ==== FOOTER ====
  'footer.subtitle':     { en: 'Traffic Rules', rw: "Amategeko y'Umuhanda" },
  'footer.description':  { en: 'Master Rwanda Traffic Rules with interactive quizzes, AI assistance, and 3D simulations.', rw: "Menya neza amategeko y'umuhanda mu Rwanda ukoresheje ibizamini bikorwa kuri interineti, ubufasha bwa AI, n'imyitozo yo gutwara muri 3D." },
  'footer.quickLinks':   { en: 'Quick Links', rw: 'Aho Wahita Ugana' },
  'footer.legal':        { en: 'Legal', rw: 'Amategeko' },
  'footer.contactUs':    { en: 'Contact Us', rw: 'Twandikire' },
  'footer.privacy':      { en: 'Privacy Policy', rw: "Politiki y'Ubuzima Bwite" },
  'footer.terms':        { en: 'Terms of Service', rw: "Amabwiriza n'Amategeko y'Imikoreshereze" },
  'footer.cookies':      { en: 'Cookie Policy', rw: 'Politiki ya Kuki (Cookies)' },
  'footer.rights':       { en: 'All rights reserved.', rw: 'all rights reserved' },
  'footer.madeIn':       { en: 'Made with', rw: "made with'" },
  'footer.partnership':  { en: 'In partnership with', rw: 'Ku bufatanye na' },

  // ==== ROOT / INSTALL APP ====
  'root.installTitle':   { en: 'Install ISHAMI App', rw: 'Shyira Porogaramu ya ISHAMI muri Telefoni' },
  'root.installDesc':    { en: 'Get the best experience by installing our app. Works offline!', rw: "Bona uburyo bwiza bwo gukoresha ushyira porogaramu yacu muri telefoni. Ikora no mu gihe udafite interineti!" },
  'root.installNow':     { en: 'Install Now', rw: 'Yishyiremo Ubu' },
  'root.maybeLater':     { en: 'Maybe Later', rw: 'Wenda Nyuma' },

  // ==== COMMON ====
  'common.select':       { en: 'Select Scenario', rw: "Hitamo Uburyo bw'Imyitozo" },
  'common.estimated':    { en: 'min', rw: 'min' },
  'common.objectives':   { en: 'Objectives', rw: 'Intego' },
  'common.difficulty':   { en: 'Difficulty', rw: 'Uburemere' },

  // ==== HOME PAGE ====
  'home.hero.eyebrow':   { en: '🚗 Rwanda Traffic Rules Learning Platform', rw: "🚗 Urubuga rwo Kwiga Amategeko y'Umuhanda" },
  'home.hero.title1':    { en: 'Master', rw: 'Menya' },
  'home.hero.title2':    { en: "Amategeko y'Umuhanda", rw: "Amategeko y'Umuhanda" },
  'home.hero.title3':    { en: 'with Confidence', rw: 'Umenya Neza' },
  'home.hero.subtitle':  { en: 'Learn Rwanda traffic rules through interactive quizzes, AI-powered assistance, and immersive 3D driving simulations — before you hit the road.', rw: "Kiga amategeko y'umuhanda mu Rwanda ukoresheje ibazo, AI, na 3D simulations — mbere yo kugenda ku isura." },
  'home.hero.startQuiz': { en: 'Start Free Quiz', rw: 'Tangira Quiz' },
  'home.hero.trySim':    { en: 'Try 3D Simulator', rw: 'Kora 3D Simulator' },
  'home.hero.users':     { en: 'Active learners', rw: 'Abiga batandukanye' },
  'home.hero.questions': { en: 'Practice questions', rw: 'Ibazo byo kugena' },
  'home.hero.passrate':  { en: 'Avg. pass rate', rw: 'Igiciro cyo kumenya' },

  'home.features.title': { en: 'Why Learn With ISHAMI', rw: 'Kuki Ushobora Kugena na ISHAMI' },
  'home.features.sub':   { en: 'Everything you need to pass your driving test — and be a safe driver for life.', rw: "Ibintu byose ukeneye kugena igihe ukora test — kandi ukore umuyobozi w'umuhanda utoza." },

  'home.features.quizzes_title':    { en: 'Interactive Quizzes', rw: 'Ibizamini ' },
  'home.features.quizzes_desc':     { en: 'Test your knowledge with timed quizzes based on real Rwanda traffic rules.', rw: "Suzuma ubumenyi bwawe ukoresheje ibizamini  bishingiye ku mategeko y'umuhanda y'u Rwanda nyayo." },
  'home.features.simulation_title': { en: '3D Driving Simulation', rw: 'Imyitozo yo Gutwara Ibinyabiziga muri 3D' },
  'home.features.simulation_desc':  { en: 'Practice real-world scenarios in immersive 3D environments.', rw: "Itoze ibiba mu muhanda nyabyo mu buryo bw'amashusho yimbitse ya 3D." },
  'home.features.ai_title':         { en: 'AI Assistant - Moto-Sensei', rw: 'Umufasha wa AI - Moto-Sensei' },
  'home.features.ai_desc':          { en: 'Get instant answers from your friendly Rwandan driving instructor.', rw: "Bona ibisubizo ako kanya bitanzwe n'umwarimu wawe ugufasha kwiga gutwara ibinyabiziga mu Rwanda." },
  'home.features.resources_title':  { en: 'Download Resources', rw: "download Inyandiko n'Imfashanyigisho" },
  'home.features.resources_desc':   { en: 'Access PDFs, videos, and images of traffic signs and rules.', rw: "Bona inyandiko za PDF, amashusho, n'amafoto by'ibyapa n'amategeko y'umuhanda." },

  'home.stats.students':  { en: 'Students', rw: 'Abanyeshuri' },
  'home.stats.questions': { en: 'Questions', rw: 'Ibibazo' },
  'home.stats.pass_rate': { en: 'Pass Rate', rw: "Ijanisha ry'Abatsinda" },

  'home.loading': { en: 'Loading...', rw: 'Birigutunganywa...' },
  'home.learn_more': { en: 'Learn more', rw: 'Menya byinshi' },

  'home.feat1.title':    { en: 'AI-Powered Tutor', rw: 'AI Musigati' },
  'home.feat1.desc':     { en: 'Get instant, personalized explanations to any traffic rule question.', rw: "Menya ibintu byose ku nguvu y'amategeko ya AI." },
  'home.feat2.title':    { en: '3D Driving Sim', rw: '3D Driving Sim' },
  'home.feat2.desc':     { en: 'Practice real-world driving in a safe, immersive 3D city.', rw: 'Kugena gutwara imodoka mu mujyi wa 3D utoza.' },
  'home.feat3.title':    { en: 'Quiz Mode', rw: 'Ibazo' },
  'home.feat3.desc':     { en: 'Thousands of exam-style questions with instant feedback.', rw: "Ibazo byinshi n'ibisubizo byakuvugururaho." },
  'home.feat4.title':    { en: 'Offline Ready', rw: 'Offline Nta Mpamvu' },
  'home.feat4.desc':     { en: 'Install the PWA and learn anywhere, even without internet.', rw: 'Kora PWA kandi ugeze aho hose ntakibazo.' },

  'home.flip.title':     { en: '🎴 Test Your Knowledge', rw: '🎴 Kumenya Ubwenge Bwawe' },
  'home.flip.subtitle':  { en: 'Flip the cards to reveal answers', rw: 'Hindura amakarita urebe ibisubizo' },
  'home.flip.hint':      { en: 'Click any card to flip and reveal the correct answer.', rw: 'Kanda karita icyo ari cyo cyose kumenya ibisubizo.' },

  'home.ai_section.badge':            { en: 'AI-Powered Learning', rw: "Uburyo bwo Kwiga Bwifashisha AI" },
  'home.ai_section.title':            { en: 'Meet Moto-Sensei', rw: 'Menya Moto-Sensei' },
  'home.ai_section.description':      { en: 'Your friendly AI driving instructor. Ask questions in Kinyarwanda, get instant explanations, and master traffic rules faster.', rw: "Umwarimu wawe wa AI ugufasha kwiga gutwara. Baza ibibazo mu Kinyarwanda, uhabwe ibisobanuro aka kanya, kandi umenye amategeko y'umuhanda vuba cyane." },
  'home.ai_section.cta':              { en: 'Chat with Moto-Sensei', rw: 'Ganira na Moto-Sensei' },
  'home.ai_section.preview_greeting': { en: "Muraho! I'm Moto-Sensei. What would you like to learn today?", rw: "Muraho! Ndi Moto-Sensei. Ni iki mwifuza kwiga uyu munsi?" },
  'home.ai_section.preview_question': { en: 'What does a red triangle sign mean?', rw: "Icyapa gifite ishusho ya mpandeshatu itukura gisobanura iki?" },

  'home.certificate_section.badge':            { en: 'Earn Your Certificate', rw: 'Bona Icyangombwa Cyawe' },
  'home.certificate_section.title':            { en: 'Get Your Official ISHAMI Certificate', rw: 'Bona Icyangombwa Cyemewe cya ISHAMI' },
  'home.certificate_section.description':      { en: 'Complete the Traffic Rules & Road Safety quiz and earn an official certificate. Share it with employers, print it, or verify it online. Prove your driving knowledge!', rw: "Rangiza ikizamini cy'Amategeko y'Umuhanda n'Umutekano wo mu Muhanda uhabwe icyangombwa cyemewe. Gisangize abakoresha, gicapishe, cyangwa ugenzure ukuri kwacyo kuri interineti. Garagaza ubumenyi bwawe!" },
  'home.certificate_section.take_quiz':        { en: 'Take a Quiz', rw: 'Kora Ikizamini' },
  'home.certificate_section.view_certificate': { en: 'View Certificate', rw: 'Reba Icyangombwa' },
  'home.certificate_section.certificate_title': { en: 'Certificate of Completion', rw: "Icyangombwa cy'Usoje Amasomo" },
  'home.certificate_section.final_score':      { en: 'Final Score', rw: 'Amanota ya Nyuma' },
  'home.certificate_section.electronically_verifiable': { en: 'Electronically verifiable', rw: "Gishobora kugenzurwa hifashishijwe ikoranabuhanga" },

  'home.testimonials.title':   { en: '💬 Loved by Learners', rw: '💬 Biteganyijwe na Abiga' },
  'home.testimonials.subtitle': { en: 'Join thousands of successful learners', rw: "Fatanya n'ibihumbi by'abanyeshuri batsinze neza" },

  'home.irembo_section.title':       { en: 'Need Help with Irembo Registration?', rw: "Ukeneye Ubufasha bwo Kwiyandikisha ku Irembo?" },
  'home.irembo_section.description': { en: 'We can help you get your exam code through Irembo services. Fast, reliable, and secure assistance.', rw: "Twagufasha kubona kode yo gukorera ikizamini binyuze muri serivisi za Irembo. Ubufasha bwihuse, bwizewe, kandi butekanye." },
  'home.irembo_section.cta':         { en: 'Get Irembo Help', rw: 'Bona Ubufasha bwa Irembo' },
  'home.irembo_section.fee':         { en: 'Service Fee: 5,500 RWF | Processing Time: Within 8 hours', rw: "Igiciro cya Serivisi: 5,500 RWF | Igihe Bitwara: Mu masaha 8" },

  'home.cta.title':    { en: 'Ready to Master the Road?', rw: 'Witegure Kumenya Umuhanda?' },
  'home.cta.subtitle': { en: 'Join thousands of Rwandans passing their driving test with ISHAMI.', rw: "Hugura urubuga rw'Abanyarwanda benshi baiteranye amategeko na ISHAMI." },
  'home.cta.start':    { en: 'Start Learning Free', rw: 'Tangira Kugena' },
  'home.cta.start_button': { en: 'Start Learning', rw: 'Tangira Kwiga' },

  'home.newsletter.title': { en: '📬 Stay Updated', rw: '📬 Tuganirize' },
  'home.newsletter.desc':  { en: 'Get new practice questions, tips, and updates every week.', rw: 'Reba ibazo nshya, ibitekerezo, no guhuzwa buri cyumweru.' },
  'home.newsletter.email': { en: 'Email address', rw: 'Aderesi ya Email' },
  'home.newsletter.enter_email': { en: 'Enter your email', rw: 'Injiza imeri yawe' },
  'home.newsletter.sub':   { en: 'Subscribe', rw: 'Iyandikishe' },
  'home.newsletter.subscribe': { en: 'Subscribe', rw: 'Iyandikishe' },
  'home.newsletter.success': { en: '✓ Thank you for subscribing! Check your email for confirmation.', rw: "✓ Urakoze kwiyandikisha! Reba muri imeri yawe ubutumwa bwo kwemeza." },
  'home.newsletter.error': { en: 'Subscription failed. Please try again.', rw: "Kwiyandikisha byanze. Ongera ugerageze." },

  // ==== BLOG / ARTICLES ====
  'nav.blog':              { en: 'Blog', rw: 'Inyandiko' },
  'blog.title':            { en: 'Articles & Blog', rw: "Inyandiko n'Amateka" },
  'blog.subtitle':         { en: 'Read traffic rules, driving guides, and important articles in both English and Kinyarwanda.', rw: "Soma amategeko y'umuhanda, amabwiriza yo gutwara, n'inkuru zingenzi ziri mu Kinyarwanda n'Icyongereza." },
  'blog.ferrivox':         { en: 'In partnership with', rw: 'Ku bufatanye na' },
  'blog.ferrivox_tagline': { en: 'Software Development & Data Engineering Company', rw: "Ishirahamwe ry'Ikoranabuhanga n'Ubufasha bw'Amakuru" },
  'blog.read_more':        { en: 'Read more', rw: 'Soma byinshi' },
  'blog.back_to_articles': { en: 'Back to Articles', rw: 'Subira inyuma' },
  'blog.back_to_list':     { en: 'Back to articles', rw: 'Subira ku nyandiko' },
  'blog.not_found':        { en: 'Article not found', rw: 'Inyandiko ntibonetse' },
  'blog.powered_by':       { en: 'Powered by', rw: 'Ibikorwa by' },
  'blog.visit_ferrivox':   { en: 'Visit Ferrivox', rw: 'Sura Ferrivox' },

  'home.blog_section.badge':    { en: 'Articles & Blog', rw: "Inyandiko n'Amateka" },
  'home.blog_section.title':    { en: 'Read Our Latest Articles', rw: 'Soma Inyandiko Dutangaye' },
  'home.blog_section.desc':     { en: 'Stay updated with driving tips, traffic rules guides, and licensing information — in English and Kinyarwanda.', rw: "Guma uzi amakuru y'ubuhanga bwo gutwara, amabwiriza y'amategeko y'umuhanda, n'amakuru y'uruhushya — mu Kinyarwanda n'Icyongereza." },
  'home.blog_section.view_all': { en: 'View All Articles', rw: 'Reba Inyandiko Zose' },

  // ==== AUTH PAGE ====
  'auth.welcome':       { en: 'Welcome to ISHAMI', rw: 'Murakaza neza kuri ISHAMI' },
  'auth.tagline':       { en: 'Master Rwanda Traffic Rules with AI-powered learning', rw: "Menya Amategeko y'Umuhanda ukoresheje AI" },
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

  // ==== AUTH PAGE (NEW KEYS) ====
  'auth.features.quizzes':       { en: 'Interactive Quizzes with real exam questions', rw: "Ibibazo ngororamutwe bifite ibibazo by'ibizamini nyabyo" },
  'auth.features.ai_assistant':  { en: 'AI Assistant for instant answers', rw: 'Ubufasha bwa AI buguha ibisubizo ako kanya' },
  'auth.features.track_progress': { en: 'Track Progress and compete with others', rw: "Kurikirana intambwe utera kandi uhangane n'abandi" },
  'auth.features.simulation':    { en: '3D Driving Simulations', rw: 'Imyitozo yo gutwara ibinyabiziga mu buryo bwa 3D' },

  'auth.form.username_label':      { en: 'Username', rw: 'Izina ukoresha' },
  'auth.form.username_placeholder': { en: 'Enter your username', rw: 'Injiza izina ukoresha' },
  'auth.form.email_phone_label':   { en: 'Email or Phone', rw: 'Imeri cyangwa Nimero ya Telefoni' },
  'auth.form.email_phone_placeholder': { en: 'name@example.com or +2507xxxxxxx', rw: 'izina@urugero.com cyangwa +2507xxxxxxx' },
  'auth.form.password_label':      { en: 'Password', rw: 'Ijambobanga' },
  'auth.form.password_placeholder': { en: 'Enter your password', rw: 'Injiza ijambobanga ryawe' },
  'auth.form.remember_me':         { en: 'Remember me', rw: 'Unyibuke' },
  'auth.form.forgot_password':     { en: 'Forgot password?', rw: 'Wibagiwe ijambobanga?' },

  'auth.button.sign_in':     { en: 'Sign In', rw: 'Injira' },
  'auth.button.sign_up':     { en: 'Create Account', rw: 'Kora Konti' },
  'auth.button.please_wait': { en: 'Please wait...', rw: 'Tegereza gato...' },

  'auth.forgot_password_modal.email_phone_label':      { en: 'Email or Phone', rw: 'Imeri cyangwa Nimero ya Telefoni' },
  'auth.forgot_password_modal.email_phone_placeholder': { en: 'Enter email or phone', rw: 'Injiza imeri cyangwa nimero ya telefoni' },
  'auth.forgot_password_modal.send_reset_link':        { en: 'Send Reset Link', rw: 'Ohereza Ihuza ryo Gusubiramo Ijambobanga' },
  'auth.forgot_password_modal.cancel':                 { en: 'Cancel', rw: 'Kureka' },

  'auth.social.or_continue_with': { en: 'Or continue with', rw: 'Cyangwa komeza ukoresheje' },
  'auth.social.google':           { en: 'Google', rw: 'Google' },
  'auth.social.facebook':         { en: 'Facebook', rw: 'Facebook' },

  'auth.legal.by_continuing':    { en: 'By continuing, you agree to our', rw: 'Mu gukomeza, wemeye' },
  'auth.legal.terms_of_service': { en: 'Terms of Service', rw: "Amabwiriza n'Amategeko y'Imikoreshereze" },
  'auth.legal.and':              { en: 'and', rw: 'na' },
  'auth.legal.privacy_policy':   { en: 'Privacy Policy', rw: "Politiki y'Ubuzima Bwite" },

  'auth.errors.google_sign_in_token':    { en: 'Google sign-in did not return an ID token', rw: "Kwinjira ukoresheje Google ntibyatange ikimenyetso cy'umwirondoro (ID token)" },
  'auth.errors.google_sign_in_failed':   { en: 'Google sign-in failed', rw: 'Kwinjira ukoresheje Google byanze' },
  'auth.errors.facebook_sign_in_token':  { en: 'Facebook sign-in did not return an Access token', rw: "Kwinjira ukoresheje Facebook ntibyatange ikimenyetso cy'uburenganzira (Access token)" },
  'auth.errors.facebook_sign_in_failed': { en: 'Facebook sign-in failed', rw: 'Kwinjira ukoresheje Facebook byanze' },
  'auth.errors.popup_blocked':           { en: 'Popup was blocked. Please allow popups for this site.', rw: "Idirishya rito (popup) ryakumiriwe. Nyabuneka hemerera amadirishya mato kuri uru rubuga." },
  'auth.errors.sign_in_cancelled':      { en: 'Sign-in cancelled.', rw: 'Kwinjira byahagaritswe.' },
  'auth.errors.email_phone_required':   { en: 'Email or phone is required', rw: 'Imeri cyangwa nimero ya telefoni birakenewe' },
  'auth.errors.username_required':      { en: 'Username is required', rw: 'Izina ukoresha rirakenewe' },
  'auth.errors.account_exists':         { en: 'Account already exists. Please sign in.', rw: 'Iyi konti isanzwe ihari. Nyabuneka injira.' },
  'auth.errors.auth_failed':            { en: 'Authentication failed', rw: 'Kugenzura umwirondoro byanze' },

  // ==== RESOURCES PAGE ====
  'res.title':        { en: 'Learning Resources', rw: 'Imfashanyigisho zo Kwiga' },
  'res.subtitle':     { en: 'Download study materials, videos, and reference images', rw: "Koporora inyandiko zo kwiga, amashusho, n'amafoto y'urufatiro" },
  'res.filters.all':  { en: 'All', rw: 'Byose' },
  'res.filters.pdf':  { en: 'PDF', rw: 'PDF' },
  'res.filters.video': { en: 'Video', rw: 'Amashusho' },
  'res.filters.image': { en: 'Image', rw: 'Amafoto' },
  'res.resource.size':        { en: 'Size:', rw: 'Ingano:' },
  'res.resource.coming_soon': { en: 'Coming Soon', rw: 'Bizaza vuba' },
  'res.resource.pro_only':    { en: 'Pro Only', rw: 'Aba Pro gusa' },
  'res.resource.watch':       { en: 'Watch', rw: 'Reba' },
  'res.resource.download':    { en: 'Download', rw: 'Download' },
  'res.empty_state':          { en: 'No resources found for this filter.', rw: 'Nta mfashanyigisho zibonetse kuri iyi muyunguruzi.' },
  'res.paywall.title':              { en: 'Premium Resource', rw: 'Imfashanyigisho Zihariye (Premium)' },
  'res.paywall.description':        { en: 'This resource is only available to Pro members. Upgrade for only', rw: 'Iyi mfashanyigisho igenewe gusa abanyamuryango ba Pro. Kora upgrade kuri' },
  'res.paywall.price':              { en: '100 RWF', rw: '100 RWF' },
  'res.paywall.description_suffix': { en: 'to access all premium content.', rw: 'kugira ngo ugere ku masomo yose yihariye.' },
  'res.paywall.upgrade_button':     { en: 'Upgrade to Pro - 100 RWF', rw: 'Zamura kuri Pro - 100 RWF' },
  'res.paywall.browse_free':        { en: 'Browse Free Resources', rw: "Shakisha Imfashanyigisho z'Ubuntu" },

  // ==== SIMULATION PAGE ====
  'sim.hero.title':      { en: '3D Driving Simulation', rw: '3D Driving Simulation' },
  'sim.hero.subtitle':   { en: 'Learn & Master Traffic Rules', rw: "Menya neza Amategeko y'Umuhanda" },
  'sim.hero.desc':       { en: "Experience immersive 3D driving scenarios. Practice real-world situations safely and learn Rwanda's traffic rules through interactive gameplay. 🚗", rw: "Kugena gutwara imodoka mu 3D. Menya amategeko y'umuhanda mu Rwanda ukoresheje igikoresho cyiza. 🚗" },
  'sim.hero.play':       { en: 'Ready to Play?', rw: 'Witegure?' },

  'sim.how.title':       { en: '🎮 How It Works', rw: '🎮 Uko Ikora' },
  'sim.how.learn.title': { en: '📚 Learn Traffic Rules', rw: '📚 Kiga Amategeko' },
  'sim.how.learn.desc':  { en: "Answer educational quizzes during gameplay to learn Rwanda's traffic rules.", rw: "Subiza ibazo mu mujya ukina kugirango umenye amategeko y'umuhanda." },
  'sim.how.points.title':{ en: '⭐ Earn Points', rw: '⭐ Kora Ibipimo' },
  'sim.how.points.desc': { en: 'Correct answers and safe driving earn you points. Violations reduce your score.', rw: 'Ibisubizo neza kandi gutwara neza zibona ibipimo. Ibihekwa byadakora.' },
  'sim.how.rank.title':  { en: '🏆 Climb Leaderboard', rw: '🏆 Tungura Urutonde' },
  'sim.how.rank.desc':   { en: 'Compete with other players and climb the global leaderboard!', rw: "Guhagarara n'abandi kandi wezuru urutonde rwose!" },

  'sim.scenarios.title': { en: 'Available Scenarios', rw: 'Ibitekerezo Bihari' },
  'sim.scenarios.sub':   { en: 'Master every aspect of driving with our comprehensive simulation modules', rw: 'Kumenya ibintu byose byo gutwara imodoka ukoresheje ibitekerezo byiza' },

  'sim.feat.title':      { en: '✨ Features', rw: '✨ Ibintu Biri Mo' },
  'sim.feat.missions':   { en: 'Interactive Missions', rw: 'Ibikorwa Byiza' },
  'sim.feat.missionsD':  { en: 'Complete specific driving objectives', rw: 'Kugena ibyo gutwara imodoka' },
  'sim.feat.feedback':   { en: 'Real-time Feedback', rw: 'Ibisubizo Bya Saati' },
  'sim.feat.feedbackD':  { en: 'Get instant feedback on your driving', rw: 'Menya ibintu byose ku myitwarire yawe' },
  'sim.feat.rules':      { en: 'Traffic Rules', rw: "Amategeko y'Umuhanda" },
  'sim.feat.rulesD':     { en: "Learn Rwanda's official traffic regulations", rw: "Menya amategeko y'umuhanda y'igihugu" },
  'sim.feat.funny':      { en: 'Funny Moments', rw: 'Ibihekwa' },
  'sim.feat.funnyD':     { en: 'Enjoy silly car physics and sound effects', rw: "Gushima imyitwarire ya modoka n'amajwi meza" },

  // Simulation - Loading
  'sim.loading.title':    { en: 'Loading ISHAMI Simulator', rw: 'Gutegura Imyitozo ya ISHAMI muri 3D' },
  'sim.loading.subtitle': { en: 'Preparing Kigali environment...', rw: "Hategurwa amashusho y'Umujyi wa Kigali..." },

  // Simulation - Not Available
  'sim.not_available.title':       { en: '3D Simulation Not Available', rw: 'Imyitozo ya 3D Ntabwo Ishobora Gukora' },
  'sim.not_available.description': { en: 'The driving simulation requires a device with 3D graphics support. Please use a desktop computer or laptop.', rw: "Iyi myitozo yo gutwara muri 3D isaba igikoresho gishyigikira amashusho ya 3D. Nyamuneka koresha mudasobwa y'ameza cyangwa mudasobwa igendanwa." },
  'sim.not_available.return_home': { en: 'Return Home', rw: 'Gusubira Ahabanza' },

  'sim.back_button': { en: 'Back', rw: 'Gusubira Inyuma' },

  // Simulation - Flyover Labels
  'sim.flyover_labels.kigali':            { en: 'Driving Training Area', rw: 'Ahantu ho Kwitoreza Gutwara' },
  'sim.flyover_labels.convention_centre':  { en: 'Training District', rw: "Akarere k'Imyitozo" },
  'sim.flyover_labels.training_route':     { en: 'Follow the highlighted path', rw: 'Kurikira inzira igaragajwe' },
  'sim.flyover_labels.your_vehicle':       { en: 'Starting Position', rw: 'Aho Utangirira' },

  'sim.aerial_view':  { en: 'AERIAL VIEW', rw: 'KUREBA MU KIRERE' },
  'sim.guided_start': { en: 'Guided Start', rw: 'Gutangira Uyobowe' },

  // Simulation - Route Preview
  'sim.route_preview.title':            { en: 'ROUTE PREVIEW', rw: 'KUREBA INZIRA MBERE' },
  'sim.route_preview.start':            { en: 'START', rw: 'TANGIRA' },
  'sim.route_preview.destination':      { en: 'DESTINATION', rw: 'AHO UJYA' },
  'sim.route_preview.road':             { en: 'ROAD', rw: 'UMUHANDA' },
  'sim.route_preview.steps':            { en: '{count} steps', rw: 'Intambwe {count}' },
  'sim.route_preview.starting_point':   { en: 'Starting point', rw: 'Aho utangirira' },
  'sim.route_preview.final_destination': { en: 'Final destination', rw: 'Aho ugomba kugera' },
  'sim.route_preview.step':             { en: 'Step {number}', rw: 'Intambwe {number}' },

  // Simulation - Mission Criteria
  'sim.mission_criteria.title':           { en: 'Mission Criteria', rw: 'Ibisabwa mu Butumwa' },
  'sim.mission_criteria.speed_limit':     { en: 'Speed Limit', rw: 'Umuvuduko Ntarengwa' },
  'sim.mission_criteria.time':            { en: 'Time', rw: 'Igihe' },
  'sim.mission_criteria.follow_route':    { en: 'Follow the highlighted route', rw: 'Kurikira inzira igaragajwe' },
  'sim.mission_criteria.signal_turns':    { en: 'Signal at every turn', rw: 'Tanga ikimenyetso kuri buri ikorosi' },
  'sim.mission_criteria.no_collisions':   { en: 'No building collisions', rw: 'Kutagonga inyubako' },
  'sim.mission_criteria.no_speeding':     { en: 'No speeding', rw: 'Kurenza umuvuduko ntibyemewe' },

  // Simulation - Cinematic
  'sim.cinematic.driving_area': { en: 'Driving Training Area', rw: 'Ahantu ho Kwitoreza Gutwara' },

  // Simulation - Skip Hint
  'sim.skip_hint.press':  { en: 'Press', rw: 'Kanda' },
  'sim.skip_hint.enter':  { en: 'ENTER', rw: 'ENTER' },
  'sim.skip_hint.to_skip': { en: 'to skip', rw: 'kugira ngo ukomeze imbere' },

  // Simulation - Collisions
  'sim.collisions.minor':   { en: 'You bumped into an obstacle. Drive more carefully!', rw: 'Wagonze inzitizi. Twarana ubwitonzi bwisumbuyeho!' },
  'sim.collisions.warning': { en: 'Careful! You hit a building. Slow down near structures.', rw: 'Itondere! Wagonze inyubako. Gabanya umuvuduko wegereye inzu.' },
  'sim.collisions.major':   { en: 'Dangerous collision! You must avoid buildings entirely.', rw: 'Impanuka ikomeye! Ugomba kwirinda kugonga inyubako na gato.' },

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
  'scen.6.title':        { en: 'T-Cross Scenario', rw: "Ihuriro ry'Umuhanda T" },
  'scen.6.desc':         { en: 'Priority rules at T-intersections', rw: "Amategeko y'ihuriro T" },

  // Difficulties
  'diff.beginner':       { en: 'Beginner', rw: 'Umutangira' },
  'diff.intermediate':   { en: 'Intermediate', rw: 'Wihuse' },
  'diff.advanced':       { en: 'Advanced', rw: 'Umenya Neza' },

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
  'quiz.passMessage':    { en: "Excellent work! You're ready for the real driving test. Keep up the great work!", rw: 'Wakoze neza cyane! Witeguye gukora ikizamini nyacyo cyo gutwara ibinyabiziga. Komeza uwo murava!' },
  'quiz.failMessage':    { en: 'You need 70% to pass. Review the materials and try again. You got this!', rw: "Ukeneye 70% kugira ngo utsinde. Subiramo imfashanyigisho maze wongere ugerageze. Urabishoboye!" },
  'quiz.getCertificate': { en: '🎓 Get Your Certificate', rw: '🎓 Bona Icyangombwa Cyawe' },
  'quiz.tryAgain':       { en: 'Try Again', rw: 'Ongera Ugerageze' },
  'quiz.viewLeaderboard':{ en: 'View Leaderboard', rw: "Reba Urutonde rw'Abatsinze Neza" },
  'quiz.unlockPro':      { en: 'Unlock Pro Access', rw: 'Fungura Byose nka Pro' },
  'quiz.payMessage':     { en: "You've completed 6 free questions! Unlock all 20 questions and premium features for only", rw: "Usoje ibibazo 6 by'ubuntu! Fungura ibibazo byose uko ari 20 n'izindi serivisi zihariye kuri" },
  'quiz.language':       { en: 'Language', rw: 'Ururimi' },
  'quiz.kinyarwanda':    { en: 'Kinyarwanda', rw: 'Ikinyarwanda' },
  'quiz.english':        { en: 'English', rw: 'Icyongereza' },

  // Quiz Results
  'quiz.results.congratulations': { en: 'Congratulations! 🎉', rw: 'Urakoze cyane! 🎉' },
  'quiz.results.keep_practicing': { en: 'Keep Practicing! 💪', rw: 'Komeza Witoze! 💪' },
  'quiz.results.your_score':      { en: 'Your Score:', rw: 'Amanota Yawe:' },
  'quiz.results.excellent_work':  { en: "Excellent work! You're ready for the real driving test. Keep up the great work!", rw: 'Wakoze neza cyane! Witeguye gukora ikizamini nyacyo cyo gutwara ibinyabiziga. Komeza uwo murava!' },
  'quiz.results.need_70_percent': { en: 'You need 70% to pass. Review the materials and try again. You got this!', rw: "Ukeneye 70% kugira ngo utsinde. Subiramo imfashanyigisho maze wongere ugerageze. Urabishoboye!" },
  'quiz.results.get_certificate': { en: '🎓 Get Your Certificate', rw: '🎓 Bona Icyangombwa Cyawe' },
  'quiz.results.try_again':       { en: 'Try Again', rw: 'Ongera Ugerageze' },
  'quiz.results.view_leaderboard': { en: 'View Leaderboard', rw: "Reba Urutonde rw'Abatsinze Neza" },

  // Quiz List
  'quiz.quiz_list.time_left':    { en: 'Time Left', rw: 'Igihe Gisigaye' },
  'quiz.quiz_list.progress':     { en: 'Progress', rw: 'Intambwe Umaze Gutera' },
  'quiz.quiz_list.score':        { en: 'Score', rw: 'Amanota' },
  'quiz.quiz_list.previous':     { en: 'Previous', rw: 'Ibibazo Byabanje' },
  'quiz.quiz_list.next_question': { en: 'Next Question', rw: 'Ikibazo Gikurikira' },
  'quiz.quiz_list.finish_quiz':  { en: 'Finish Quiz', rw: 'Soza Ikizamini' },

  // Quiz Paywall
  'quiz.paywall.title':              { en: 'Unlock Pro Access', rw: 'Fungura Byose nka Pro' },
  'quiz.paywall.description':        { en: "You've completed 6 free questions! Unlock all 20 questions and premium features for only", rw: "Usoje ibibazo 6 by'ubuntu! Fungura ibibazo byose uko ari 20 n'izindi serivisi zihariye kuri" },
  'quiz.paywall.testing_price':      { en: '100 RWF', rw: '100 RWF' },
  'quiz.paywall.production_price':   { en: '1,000 RWF', rw: '1,000 RWF' },
  'quiz.paywall.pro_features_title': { en: 'Pro Features:', rw: 'Ibyiza bya Konti ya Pro:' },
  'quiz.paywall.features.unlimited_quizzes': { en: 'Unlimited quiz attempts', rw: 'Gukora ibizamini inshuro zose ushaka' },
  'quiz.paywall.features.full_simulation':   { en: 'Full 3D simulation access', rw: "Kwinjira muri porogaramu yose y'imyitozo ya 3D" },
  'quiz.paywall.features.unlimited_ai':      { en: 'Unlimited AI assistant questions', rw: 'Kubaza umufasha wa AI ibibazo bitagira ingano' },
  'quiz.paywall.features.premium_resources': { en: 'Premium resources download', rw: "Gukoporora inyandiko n'amasomo yihariye" },
  'quiz.paywall.phone_placeholder': { en: 'Phone number (e.g. 0788xxxxxx)', rw: 'Nimero ya telefoni (urugero: 0788xxxxxx)' },
  'quiz.paywall.processing':        { en: 'Processing...', rw: 'Biratunganywa...' },
  'quiz.paywall.pay_button':        { en: 'Pay with Mobile Money - 100 RWF', rw: 'Ishyura ukoresheje Mobile Money - 100 RWF' },
  'quiz.paywall.phone_not_found':   { en: 'Your phone number is not approved on Paypack. Please add it on the Paypack dashboard → Approved Numbers.', rw: "Nimero yawe ya telefoni ntiyemejwe kuri Paypack. Nyamuneka yishyire kuri paji yawe ya Paypack → Nimero Zemejwe." },
  'quiz.paywall.check_phone':       { en: '📱 Check your phone for USSD prompt...', rw: '📱 Reba kuri telefoni yawe ubutumwa bwa USSD...' },
  'quiz.paywall.maybe_later':       { en: 'Maybe Later', rw: 'Wenda Nyuma' },

  // ==== CERTIFICATE PAGE ====
  'cert.auth_required.message': { en: 'Please log in to view your certificate.', rw: 'Nyamuneka injira kugira ngo urebe icyangombwa cyawe.' },
  'cert.auth_required.button':  { en: 'Log In', rw: 'Injira' },
  'cert.back_button':           { en: 'Back', rw: 'Gusubira inyuma' },

  'cert.title':          { en: 'ISHAMI', rw: 'ISHAMI' },
  'cert.subtitle':       { en: 'Digital Driving Education & Assessment Platform', rw: "Urubuga rw'Ikoranabuhanga ryo Kwigisha no Gusuzuma Ubumenyi bwo Gutwara Ibinyabiziga" },
  'cert.certified':      { en: 'CERTIFIED', rw: 'BYEMEJWEYO' },
  'cert.completion_title': { en: 'CERTIFICATE OF COMPLETION', rw: "ICYANGOMBWA CY'URANGIJE AMASOMO" },
  'cert.presentedTo':    { en: 'This certificate is proudly presented to', rw: "Iki cyangombwa gitanzwe ku bw'ishema kuri" },
  'cert.description':    { en: 'for successfully completing the {quizTitle} Program and demonstrating satisfactory knowledge of traffic regulations, road signs, and safe road-user behavior.', rw: "kubera gutsinda neza gahunda ya {quizTitle} no kugaragaza ubumenyi bushimishije ku mategeko y'umuhanda, ibyapa byo mu muhanda, n'imyitwarire myiza y'umunyamuhanda." },
  'cert.forCompleting':  { en: 'for successfully completing the', rw: 'ku kwuzuza neza' },
  'cert.program':        { en: 'Program', rw: 'Program' },
  'cert.areasTitle':     { en: 'Areas of Understanding', rw: 'Ingingo Zizweho' },
  'cert.areas.road_signs':       { en: 'Road signs and their meanings', rw: "Ibyapa byo mu muhanda n'ibisobanuro byabyo" },
  'cert.areas.pedestrian_safety': { en: 'Pedestrian and cyclist safety', rw: "Umutekano w'abanyamaguru n'abanyamagare" },
  'cert.areas.road_markings':    { en: 'Road markings and lane discipline', rw: "Ibimenyetso byo mu muhanda no kugendera mu mukono" },
  'cert.areas.speed_limits':     { en: 'Speed limits and responsibility', rw: "Umuvuduko ntarengwa n'inshingano zo kwitwararika" },
  'cert.areas.right_of_way':     { en: 'Right of way and priority rules', rw: "Amategeko y'uburenganzira bw'ibanze no gutanga inzira" },
  'cert.areas.overtaking':       { en: 'Overtaking and safe distances', rw: "Kunyuranaho n'intera y'umutekano hagati y'ibinyabiziga" },
  'cert.areas.traffic_lights':   { en: 'Traffic lights and signals', rw: "Amatara n'ibimenyetso byo kuyobora ibinyabiziga" },
  'cert.areas.road_safety':      { en: 'Rwanda road-safety principles', rw: "Amahame y'umutekano wo mu muhanda mu Rwanda" },

  'cert.trainingResult':   { en: 'Training Result', rw: "Ibyavuye mu Masomo" },
  'cert.pass':             { en: 'PASS', rw: 'YATSINZE' },
  'cert.fail':             { en: 'FAIL', rw: 'YATSINZWE' },
  'cert.finalScore':       { en: 'Final Score', rw: 'Amanota ya Nyuma' },
  'cert.trainingLevel':    { en: 'Training Level', rw: "Urwego rw'Amasomo" },
  'cert.training_level_value': { en: 'Traffic Rules Understanding', rw: "Gusobanukirwa Amategeko y'Umuhanda" },
  'cert.certificateNo':    { en: 'Certificate No.', rw: "Nimero y'Icyangombwa" },
  'cert.dateIssued':       { en: 'Date Issued', rw: 'Itariki Cyatangiweho' },
  'cert.valid_until':      { en: 'Valid Until', rw: 'Kizageza Ku Cyatangiweho' },

  'cert.verification.title':        { en: 'Certificate Verification', rw: "Kugenzura Ukuri kw'Icyangombwa" },
  'cert.verification.scan_text':    { en: 'Scan QR code or visit link to verify authenticity:', rw: "Koresha QR code cyangwa sura ihuza kugira ngo ugenzure ukuri kwacyo:" },
  'cert.verification.scan_to_verify': { en: 'Scan to Verify', rw: 'Kanda hano Ugenzure' },

  'cert.signatures.managing_director':  { en: 'Managing Director', rw: 'Umuyobozi Mukuru' },
  'cert.signatures.assessment_officer': { en: 'Assessment Officer', rw: 'Umukozi Ushinzwe Ibisuzumwa' },
  'cert.signatures.platform':           { en: 'ISHAMI Platform', rw: 'Urubuga ISHAMI' },
  'cert.signatures.motto_line1':        { en: 'Safe Roads, Safe Lives', rw: 'Umuhanda Utekanye, Ubuzima Butekanye' },
  'cert.signatures.motto_line2':        { en: 'Build a Better Rwanda', rw: 'Twubake u Rwanda Rwiza' },

  'cert.footer_note': { en: 'This certificate can be electronically verified through the Ishami platform.', rw: "Iki cyangombwa gishobora kugenzurwa hakoreshejwe ikoranabuhanga binyuze ku rubuga rwa Ishami." },

  'cert.downloadPdf':    { en: 'Download PDF Certificate', rw: 'Koporora Icyangombwa muri PDF' },
  'cert.printCert':      { en: 'Print Certificate', rw: 'Gucapa Icyemezo' },
  'cert.verifyLink':     { en: 'Certificate Verification', rw: 'Kwemeza Icyemezo' },
  'cert.actions.downloading':       { en: 'Downloading...', rw: 'Birakororwa...' },
  'cert.actions.download_pdf':      { en: 'Download PDF Certificate', rw: 'Koporora Icyangombwa muri PDF' },
  'cert.actions.view_leaderboard':  { en: 'View Leaderboard', rw: "Reba Urutonde rw'Abatsinze neza" },

  // ==== LEADERBOARD PAGE ====
  'lb.title':       { en: 'Leaderboard', rw: "Urutonde rw'Abatsinze Neza" },
  'lb.subtitle':    { en: 'Top performers in Rwanda Traffic Rules mastery', rw: "Abatsinze neza cyane mu kumenya amategeko y'umuhanda mu Rwanda" },
  'lb.loading':     { en: 'Loading leaderboard...', rw: 'Urutonde rurimo gutunganywa...' },
  'lb.motivation.title':       { en: 'Climb the Rankings!', rw: 'Zamuka mu Ntera!' },
  'lb.motivation.description': { en: 'Complete quizzes daily to maintain your streak and earn badges', rw: "Kora ibizamini buri munsi kugira ngo ugumane umuvuduko kandi wegukane imidari" },
  'lb.motivation.real_time':   { en: 'Updated in real-time', rw: 'Bivugururwa ako kanya' },
  'lb.share.title':       { en: 'Share this leaderboard', rw: 'Sangiza abandi uru rutonde' },
  'lb.share.facebook':    { en: 'Facebook', rw: 'Facebook' },
  'lb.share.whatsapp':    { en: 'WhatsApp', rw: 'WhatsApp' },
  'lb.share.copy_link':   { en: 'Copy Link', rw: 'Koporora Ihuza' },
  'lb.share.copied':      { en: 'Copied!', rw: 'Byakoporowe!' },
  'lb.share.share_text':  { en: 'ISHAMI App Leaderboard — Can you beat me?', rw: "Urutonde rw'Abatsinze kuri Porogaramu ya ISHAMI — Ushobora kundusha?" },
  'lb.table.rank':          { en: 'Rank', rw: 'Umwanya' },
  'lb.table.user':          { en: 'User', rw: 'Umukoresha' },
  'lb.table.best_score':    { en: 'Best Score', rw: 'Amanota Meza Cyane' },
  'lb.table.quizzes':       { en: 'Quizzes', rw: 'Ibizamini' },
  'lb.table.total_marks':   { en: 'Total Marks', rw: 'Amanota Yose Hamwe' },
  'lb.table.average':       { en: 'Average', rw: 'Impuzandengo' },
  'lb.table.best_score_label': { en: 'best score', rw: 'amanota meza cyane' },
  'lb.certification_cta.badge':       { en: 'Earn Your Certificate', rw: 'Bona Icyangombwa Cyawe' },
  'lb.certification_cta.title':       { en: 'Ready to Get Certified?', rw: 'Witeguye Guhabwa Icyangombwa?' },
  'lb.certification_cta.description': { en: 'Top the leaderboard and earn your official ISHAMI Certificate of Completion. Share it with employers or verify it online.', rw: "Za ku isonga ku rutonde maze wegukane Icyangombwa Cyemewe cya ISHAMI cy'Usoje Amasomo. Gisangize abakoresha cyangwa ugenzure ukuri kwacyo kuri interineti." },
  'lb.certification_cta.take_quiz':      { en: 'Take a Quiz', rw: 'Kora Ikizamini' },
  'lb.certification_cta.view_certificate': { en: 'View Certificate', rw: 'Reba Icyangombwa' },
  'lb.cta.description': { en: 'Think you can make it to the top?', rw: 'Utekereza ko ushobora kugera ku isonga?' },
  'lb.cta.button':      { en: 'Start Climbing', rw: 'Tangira Kuza mu bimbere' },
  'lb.unknown':         { en: 'Unknown', rw: 'Ntibizwi' },

  // ==== PROFILE PAGE ====
  'profile.auth_required.message': { en: 'Please log in to view your profile.', rw: 'Nyamuneka injira kugira ngo urebe umwirondoro wawe.' },
  'profile.auth_required.button':  { en: 'Log In', rw: 'Injira' },
  'profile.stats.quizzes_taken':  { en: 'Quizzes Taken', rw: 'Ibizamini Byakozwe' },
  'profile.stats.best_score':     { en: 'Best Score', rw: 'Amanota Meza Cyane' },
  'profile.stats.average_score':  { en: 'Average Score', rw: "Impuzandengo y'Amanota" },
  'profile.stats.quizzes_passed': { en: 'Quizzes Passed', rw: 'Ibizamini Byatsinzwe' },
  'profile.settings.title':                { en: 'Profile Settings', rw: "Igenamiterere ry'Umwirondoro" },
  'profile.settings.username_label':       { en: 'Username', rw: 'Izina Ukoresha' },
  'profile.settings.username_placeholder': { en: 'Enter new username', rw: 'Injiza izina rishya ukoresha' },
  'profile.settings.email_label':          { en: 'Email', rw: 'Imeri' },
  'profile.settings.change_password_label': { en: 'Change Password', rw: 'Guhindura Ijambobanga' },
  'profile.settings.current_password_placeholder': { en: 'Current password', rw: 'Ijambobanga usanganywe' },
  'profile.settings.new_password_placeholder':     { en: 'New password', rw: 'Ijambobanga rishya' },
  'profile.settings.confirm_password_placeholder': { en: 'Confirm new password', rw: 'Emeza ijambobanga rishya' },
  'profile.settings.update_password': { en: 'Update Password', rw: 'Vugurura Ijambobanga' },
  'profile.settings.saving':          { en: 'Saving...', rw: 'Birabikwa...' },
  'profile.settings.cancel':          { en: 'Cancel', rw: 'Kureka' },
  'profile.quiz_history.title':       { en: 'Quiz History', rw: "Amateka y'Ibizamini" },
  'profile.quiz_history.no_history':  { en: 'No quizzes taken yet', rw: 'Nta kizamini urakora na kimwe' },
  'profile.quiz_history.start_quiz':  { en: 'Start a Quiz', rw: 'Tangira Ikizamini' },
  'profile.achievements.title':       { en: 'Achievements', rw: 'Ibyagezweho' },
  'profile.achievements.badges.first_quiz.title':  { en: 'First Quiz', rw: "Ikizamini cya Mbere" },
  'profile.achievements.badges.first_quiz.desc':   { en: 'Complete your first quiz', rw: 'Usoje ikizamini cyawe cya mbere' },
  'profile.achievements.badges.hot_streak.title':  { en: 'Hot Streak', rw: 'Umuvuduko Wikurikiranya' },
  'profile.achievements.badges.hot_streak.desc':   { en: 'Pass 3 quizzes in a row', rw: 'Gutsinda ibizamini 3 byikurikiranya' },
  'profile.achievements.badges.perfect_score.title': { en: 'Perfect Score', rw: 'Amanota 100%' },
  'profile.achievements.badges.perfect_score.desc':  { en: 'Score 100% on a quiz', rw: 'Gutsindira amanota 100% ku kizamini' },
  'profile.achievements.badges.champion.title':   { en: 'Champion', rw: "Inshingano y'Indashyikirwa" },
  'profile.achievements.badges.champion.desc':    { en: 'Score above 90%', rw: 'Kurenza amanota 90%' },
  'profile.achievements.badges.scholar.title':    { en: 'Scholar', rw: "Umunyeshuri w'Umwete" },
  'profile.achievements.badges.scholar.desc':     { en: 'Take 10 quizzes', rw: 'Gukora ibizamini 10' },
  'profile.achievements.badges.pro_member.title': { en: 'Pro Member', rw: 'Umunyamuryango wa Pro' },
  'profile.achievements.badges.pro_member.desc':  { en: 'Upgrade to Pro', rw: 'Kuzamura kuri konti ya Pro' },
  'profile.pro_badge': { en: 'Pro Member', rw: 'Umunyamuryango wa Pro' },
  'profile.logout':    { en: 'Log Out', rw: 'Sohoka' },
  'profile.toast.username_empty':     { en: 'Username cannot be empty', rw: "Izina ukoresha ntirishobora gusigara ryera" },
  'profile.toast.username_updated':   { en: 'Username updated successfully!', rw: 'Izina ukoresha ryavuguruwe neza!' },
  'profile.toast.password_fill_all':  { en: 'Please fill in all password fields', rw: "Nyamuneka uzuze imyanya yose y'ijambobanga" },
  'profile.toast.passwords_no_match': { en: 'New passwords do not match', rw: 'Amagambo banga mashya ntabwo ahuye' },
  'profile.toast.password_too_short': { en: 'Password must be at least 6 characters', rw: "Ijambobanga rigomba kuba rigizwe n'inyuguti nibura 6" },
  'profile.toast.password_updated':   { en: 'Password updated successfully!', rw: 'Ijambobanga ryavuguruwe neza!' },

  // ==== IREMBO PAGE ====
  'irembo.title':       { en: 'Irembo Driving Test Registration', rw: "Kwiyandikisha ku Kizamini cyo Gutwara Ibinyabiziga binyuze kuri Irembo" },
  'irembo.subtitle':    { en: "We'll help you register for your driving code exam through Irembo", rw: "Tuzagufasha kwiyandikisha ku kizamini cy'amategeko y'umuhanda binyuze kuri Irembo" },
  'irembo.service_fee': { en: 'Service Fee: 5,500 RWF', rw: 'Ikiguzi cya Serivisi: 5,500 RWF' },
  'irembo.info_banner.title':        { en: 'Before You Start:', rw: 'Mbere yo Gutangira:' },
  'irembo.info_banner.items.age':    { en: 'You must be at least 16 years old', rw: "Ugomba kuba ufite byibuze imyaka 16 y'amavuko" },
  'irembo.info_banner.items.national_id': { en: 'National ID is required (passports not accepted)', rw: 'Indangamuntu irakenewe (pasiporo ntizemewe)' },
  'irembo.info_banner.items.phone':  { en: 'Ensure your phone number is active for SMS notifications', rw: "Reba neza ko nimero yawe ya telefoni ikora kugira ngo ubone ubutumwa bugufi (SMS)" },
  'irembo.info_banner.items.processing': { en: 'Processing time: Within 8 hours of payment', rw: "Igihe byishyurirwa: Mu masaha 8 umaze kwishyura" },
  'irembo.form.full_name':            { en: 'Full Legal Name *', rw: "Amazina Yose Yemewe n'Amategeko *" },
  'irembo.form.full_name_placeholder': { en: 'Enter your full name as on ID', rw: "Andika amazina yawe yose nk'uko ari ku ndangamuntu" },
  'irembo.form.national_id':          { en: 'National ID Number *', rw: "Nimero y'Indangamuntu *" },
  'irembo.form.national_id_placeholder': { en: '16-digit National ID', rw: "Imibare 16 y'indangamuntu" },
  'irembo.form.phone':                { en: 'Phone Number *', rw: 'Nimero ya Telefoni *' },
  'irembo.form.phone_placeholder':    { en: '+250 78X XXX XXX', rw: '+250 78X XXX XXX' },
  'irembo.form.email':                { en: 'Email Address *', rw: 'Aderesi ya Imeri *' },
  'irembo.form.email_placeholder':    { en: 'your.email@example.com', rw: 'imeri.yawe@urugero.com' },
  'irembo.form.language':             { en: 'Preferred Language *', rw: 'Ururimi Wifuza Gukoresha *' },
  'irembo.form.test_mode':            { en: 'Test Mode *', rw: "Uburyo bw'Ikizamini *" },
  'irembo.form.district':             { en: 'Test Center (District) *', rw: "Aho Ikizamini Kizakorerwa (Akarere) *" },
  'irembo.form.district_placeholder': { en: 'Select your district', rw: 'Hitamo akarere kawe' },
  'irembo.form.test_date':            { en: 'Preferred Test Date *', rw: "Itariki Wifuza Gukoreraho Ikizamini *" },
  'irembo.form.terms':                { en: 'I confirm that all information provided is correct and I accept that passports or replacement ID certificates are not accepted. I agree to the', rw: "Ndemeza ko amakuru yose natanze ari ukuri kandi nzi neza ko pasiporo cyangwa icyemezo cy'agateganyo cy'indangamuntu bitari bwakirwe. Nemeye" },
  'irembo.form.terms_link':           { en: 'terms and conditions', rw: "amategeko n'amabwiriza" },
  'irembo.form.submit_button':        { en: 'Submit Registration - 5,500 RWF', rw: 'Ohereza Kwiyandikisha - 5,500 RWF' },
  'irembo.form.processing':           { en: 'Processing…', rw: 'Biratunganywa…' },
  'irembo.validation.national_id_digits': { en: 'National ID must be exactly 16 digits', rw: "Indangamuntu igomba kuba igizwe n'imibare 16 neza" },
  'irembo.validation.age_requirement':    { en: 'You must be at least 16 years old', rw: 'Ugomba kuba ufite byibuze imyaka 16' },
  'irembo.validation.phone_invalid':      { en: 'Please enter a valid Rwandan phone number', rw: 'Nyamuneka injiza nimero nyayo ya telefoni yo mu Rwanda' },
  'irembo.validation.email_invalid':      { en: 'Please enter a valid email address', rw: 'Nyamuneka injiza aderesi nyayo ya imeri' },
  'irembo.validation.terms_required':     { en: 'You must accept the terms and conditions', rw: "Ugomba kwemera amategeko n'amabwiriza" },
  'irembo.success.title':          { en: 'Application Submitted Successfully!', rw: 'Ubusabe bwo Kwiyandikisha Bwoherejwe Neza!' },
  'irembo.success.description':    { en: 'Your Irembo driving test registration has been received.', rw: "Ubusabe bwawe bwo kwiyandikisha ku kizamini binyuze kuri Irembo bwakiriwe." },
  'irembo.success.details_title':  { en: 'Registration Details', rw: 'Ibisobanuro byo Kwiyandikisha' },
  'irembo.success.transaction':    { en: 'Transaction:', rw: 'Ihererekanya:' },
  'irembo.success.amount':         { en: 'Amount:', rw: 'Amafaranga:' },
  'irembo.success.application_id': { en: 'Application ID:', rw: "Nimero y'Ubusabe (ID):" },
  'irembo.success.valid_until':    { en: 'Valid Until:', rw: 'Bizageza Ku Cyatangiweho:' },
  'irembo.success.check_phone':    { en: '📱 Check your phone for USSD prompt to confirm payment...', rw: "📱 Reba kuri telefoni yawe ubutumwa bwa USSD bwo kwemeza ubwishyu..." },
  'irembo.success.important_title': { en: 'Important:', rw: 'Icyitonderwa:' },
  'irembo.success.important_items.approve':        { en: 'Approve the payment prompt within 8 hours', rw: 'Emeza ubwishyu mu masaha 8' },
  'irembo.success.important_items.slot_release':   { en: 'If payment is not completed, your slot will be released', rw: "Iyo wishyuye utinze, umwanya wawe wo gukora urarekurwa" },
  'irembo.success.important_items.sms_confirmation': { en: 'You will receive an SMS confirmation after payment', rw: "Uzakira ubutumwa bugufi (SMS) bwemeza ko wishyuye" },
  'irembo.success.important_items.no_sms':         { en: 'If no SMS within 2 hours, contact us at support@ishami.rw', rw: 'Niba utabonye SMS mu masaha 2, twandikire kuri support@ishami.rw' },
  'irembo.success.submit_another':  { en: 'Submit Another Application', rw: 'Ohereza Ubundi Busabe' },
  'irembo.contact.need_help': { en: 'Need help? Contact us at', rw: 'Ukeneye ubufasha? Twandikire kuri' },
  'irembo.contact.or_call':   { en: 'or call', rw: 'cyangwa utubwire kuri' },
  'irembo.payment_dialog.title':          { en: 'Confirm Payment', rw: 'Emeza Ubwishyu' },
  'irembo.payment_dialog.description':    { en: 'To complete your Irembo registration, a payment of 5,500 RWF is required.', rw: "Kugira ngo usoze kwiyandikisha kuri Irembo, hakenewe ubwishyu bwa 5,500 RWF." },
  'irembo.payment_dialog.registration_fee': { en: 'Registration Test Fee:', rw: "Amafaranga y'Ikizamini cyo Kwiyandikisha:" },
  'irembo.payment_dialog.service_fee':    { en: 'Service Provider Fee:', rw: 'Ikiguzi cya Serivisi:' },
  'irembo.payment_dialog.total':          { en: 'Total:', rw: 'Yose Hamwe:' },
  'irembo.payment_dialog.momo_number':    { en: 'MoMo Number', rw: 'Nimero ya MoMo' },
  'irembo.payment_dialog.cancel':         { en: 'Cancel', rw: 'Kureka' },
  'irembo.payment_dialog.pay_now':        { en: 'Pay Now', rw: 'Ishyura Ubu' },

  // ==== AI ASSISTANT PAGE ====
  'ai.title':       { en: 'Moto-Sensei', rw: 'Moto-Sensei' },
  'ai.subtitle':    { en: 'Rwanda Traffic Rules AI Instructor', rw: "Umwarimu wa AI ku Mategeko y'Umuhanda mu Rwanda" },
  'ai.badges.languages':         { en: 'Kinyarwanda + English', rw: 'Ikinyarwanda + Icyongereza' },
  'ai.badges.safety_validated':  { en: 'Safety validated', rw: 'Umutekano wemejwe' },
  'ai.badges.verified_knowledge': { en: 'Verified knowledge', rw: 'Ubumenyi bwagenzuwe' },
  'ai.free_questions': { en: '{count} free questions remaining', rw: "Hasigaye ibibazo {count} by'ubuntu" },
  'ai.new_chat':       { en: 'New Chat', rw: 'Ibiganiro Bishya' },
  'ai.search_chats_placeholder': { en: 'Search chats...', rw: 'Shakisha mu biganiro...' },
  'ai.no_conversations': { en: 'No conversations found', rw: 'Nta biganiro byabonetse' },
  'ai.conversation_count': { en: '{count} conversations', rw: 'Ibiganiro {count}' },
  'ai.export':         { en: 'Export', rw: 'Sohora' },
  'ai.import':         { en: 'Import', rw: 'Injiza' },
  'ai.importing':      { en: 'Importing...', rw: 'Birinjira...' },
  'ai.share':          { en: 'Share', rw: 'Sangiza' },
  'ai.copy_link':      { en: 'Copy link', rw: 'Koporora ihuza' },
  'ai.copied':         { en: 'Copied!', rw: 'Byakoporowe!' },
  'ai.messages':       { en: 'messages', rw: 'ubutumwa' },
  'ai.confidence.high':   { en: 'High confidence', rw: 'Icyizere cyo hejuru' },
  'ai.confidence.medium': { en: 'Medium confidence', rw: 'Icyizere giciriritse' },
  'ai.confidence.low':    { en: 'Low confidence', rw: 'Icyizere gito' },
  'ai.errors.rate_limited': { en: 'Too many requests right now. Please wait a moment and try again. #GerayoAmahoro', rw: "Ubusabe bubaye bwinshi ako kanya. Tegereza akanya gato wongere ugerageze. #GerayoAmahoro" },
  'ai.errors.server_error': { en: 'The AI engine ran into a temporary issue. Please try again shortly. #GerayoAmahoro', rw: "Uburyo bwa AI bugize ikibazo by'akanya gato. Ongera ugerageze mu kanya. #GerayoAmahoro" },

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
