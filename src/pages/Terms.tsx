import { motion } from 'motion/react';
import { FileText, BadgeCheck, DollarSign, AlertCircle, Copyright } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ferrivoxLogo from '../assets/ferrivox.png';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-lg shadow-black/20 flex items-center justify-center">
                <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">ISHAMI</div>
                <div className="text-xs text-white/80 uppercase tracking-wider">Traffic Rules</div>
              </div>
            </div>
            <div className="inline-flex p-3 bg-white/20 rounded-3xl mb-4 backdrop-blur-sm">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-heading)]">Terms of Service</h1>
            <p className="text-white/80 mb-4">Amasezerano yo Gukoresha</p>
            <div className="mx-auto inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 text-white">
              <img src={ferrivoxLogo} alt="Ferrivox Ltd" className="w-6 h-6 rounded-md ring-1 ring-white/30" />
              <span className="text-xs">In partnership with Ferrivox Ltd</span>
            </div>
          </div>

          <div className="p-8">
            <Tabs defaultValue="english" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="kinyarwanda">Kinyarwanda</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="english" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h3>
                    <p className="text-gray-400">
                      By downloading and using the "ISHAMI APP", you agree to these terms provided by Ferrivox Ltd.
                    </p>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">2. Services & Fees</h3>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                      <li>Free Content: The first 5 questions in exams and AI are provided free of charge (Ubuntu).</li>
                      <li>Paid Content: Access to the remaining 20 exams requires a one-time payment of 1,000 RWF.</li>
                      <li>Payment Process: Payments must be made via web app or app using MoMo. Content will be unlocked within approximately 5 minutes of verification.</li>
                    </ul>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">3. Disclaimer</h3>
                    <p className="text-gray-400">
                      While our app contains questions designed to mirror the provisoire computer-based exam, passing the mock exams in this app does not guarantee a passing grade in the official Rwanda National Police traffic exam. The driving scenarios are for educational purposes only.
                    </p>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Copyright className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">4. Intellectual Property</h3>
                    <p className="text-gray-400">
                      All app content, including the "Moto Sensei" interface logic and exam questions, is the property of Ferrivox Ltd.
                    </p>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="kinyarwanda" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">1. Kwemera Amategeko</h3>
                    <p className="text-gray-400">
                      Iyo ukuriye kandi ukoresha “ISHAMI APP”, uba wemeye aya mategeko atangwa na Ferrivox Ltd.
                    </p>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">2. Serivisi n'Ubwishyu</h3>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                      <li>Ubusa: Ibibazo 5 bya mbere mu bizamini n'AI bitangwa ku buntu (Ubuntu).</li>
                      <li>Ubwishyu: Kugera ku bizamini 20 bisigaye bisaba kwishyura RWF 1,000 rimwe gusa.</li>
                      <li>Uburyo bwo Kwishyura: Uburyo bwo kwishyura ni ukoresheje MoMo binyuze kuri web/app. Ibirimo bifungurwa mu gihe kitarenze minota 5 nyuma yo kugenzurwa.</li>
                    </ul>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">3. Ibisobanuro</h3>
                    <p className="text-gray-400">
                      N'ubwo porogaramu igira ibibazo bisa n'iby'Ikizamini cya provisoire, gutsinda ibizamini byo kuri porogaramu ntibiguha uburenganzira bwo gutsinda ku buryo bwikora Ikizamini cya Polisi y'u Rwanda. Ibyiciro byo gutwara ni iby'amasomo gusa.
                    </p>
                  </div>
                </section>

                <section className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Copyright className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">4. Uburenganzira ku By'umutungo</h3>
                    <p className="text-gray-400">
                      Ibirimo byose bya porogaramu, harimo “Moto Sensei” n'ibibazo by'amasomo, ni umutungo wa Ferrivox Ltd.
                    </p>
                  </div>
                </section>
              </TabsContent>
            </Tabs>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} ISHAMI App • Ferrivox Ltd Partnership</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
