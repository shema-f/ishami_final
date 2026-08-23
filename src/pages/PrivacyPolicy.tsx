import { motion } from 'motion/react';
import { Shield, Lock, Eye, Server, FileText, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import ferrivoxLogo from '../assets/ferrivox.png';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
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
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-heading)]">Privacy Policy</h1>
            <p className="text-white/80 mb-4">Politiki y'Ibanga</p>
            <div className="mx-auto inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 text-white">
              <img src={ferrivoxLogo} alt="Ferrivox Ltd" className="w-6 h-6 rounded-md ring-1 ring-white/30" />
              <span className="text-xs">In partnership with Ferrivox Ltd</span>
            </div>
          </div>

          <div className="p-8">
            <Tabs defaultValue="english" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="english" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> English
                  </TabsTrigger>
                  <TabsTrigger value="kinyarwanda" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Kinyarwanda
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* English Content */}
              <TabsContent value="english" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <p className="font-semibold text-blue-400">
                    Effective Date: February 1, 2026
                  </p>
                  <p className="mt-2 text-gray-300">
                    At ISHAMI APP, operated in partnership with Ferrivox Ltd, we value your privacy. This policy explains how we handle your data.
                  </p>
                </div>

                <div className="space-y-6">
                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">1. Information We Collect</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-200">Registration Data</h4>
                          <p className="text-gray-400">
                            When you register, we collect your name and phone number to create your account and track your exam progress.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-200">Payment Information</h4>
                          <p className="text-gray-400">
                            Payments are processed via Mobile Money (MoMo). While we record the transaction confirmation to unlock content, we do not store your full financial pin or private banking credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">2. How We Use Your Information</h3>
                      <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>To provide access to the 21 traffic rule exams.</li>
                        <li>To provide technical support via our contact numbers.</li>
                      </ul>
                    </div>
                  </section>

                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Server className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">3. Data Sharing</h3>
                      <p className="text-gray-400">
                        We do not sell your data. Information is only shared with Ferrivox Ltd for app maintenance and analytics to improve the user experience.
                      </p>
                    </div>
                  </section>
                </div>
              </TabsContent>

              {/* Kinyarwanda Content */}
              <TabsContent value="kinyarwanda" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <p className="font-semibold text-blue-400">
                    Itariki: 1 Gashyantare 2026
                  </p>
                  <p className="mt-2 text-gray-300">
                    Muri ISHAMI APP, ifatanyije na Ferrivox Ltd, duha agaciro amakuru yanyu bwite. Iyi politiki isobanura uko dufata amakuru yanyu.
                  </p>
                </div>

                <div className="space-y-6">
                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">1. Amakuru Dukusanya</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-200">Amakuru yo Kwiyandikisha</h4>
                          <p className="text-gray-400">
                            Iyo wiyandikishije, dukusanya izina ryawe na nimero ya terefone kugira ngo tugufungurire konti kandi dukurikirane iterambere ryawe mu bizamini.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-200">Amakuru y'Ubwishyu</h4>
                          <p className="text-gray-400">
                            Ubwishyu bukorwa binyuze muri Mobile Money (MoMo). N'ubwo tubika inyemezabwishyu kugira ngo dufungure ibirimo, ntabwo tubika umubare wawe w'ibanga (PIN) cyangwa amakuru y'ibanga ya banki.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">2. Uko Dukoresha Amakuru Yawe</h3>
                      <ul className="list-disc list-inside text-gray-400 space-y-2">
                        <li>Kuguha uburenganzira bwo kubona ibizamini 21 by'amategeko y'umuhanda.</li>
                        <li>Kuguha ubufasha bwa tekinike binyuze kuri nimero zacu.</li>
                      </ul>
                    </div>
                  </section>

                  <section className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Server className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">3. Gusangira Amakuru</h3>
                      <p className="text-gray-400">
                        Ntabwo tugurisha amakuru yawe. Amakuru asangizwa gusa na Ferrivox Ltd hagamijwe kwita kuri porogaramu no gusesengura kugira ngo serivisi zirusheho kuba nziza.
                      </p>
                    </div>
                  </section>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} ISHAMI App. All rights reserved.</p>
              <p className="mt-1">Ferrivox Ltd Partnership</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
