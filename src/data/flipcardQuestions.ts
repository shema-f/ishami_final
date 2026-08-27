// Traffic Rules FlipCard Questions — Bilingual (English + Kinyarwanda)
// Based on Rwanda driving rules, licensing, and safety

export interface FlipCardQuestion {
  id: number;
  question_en: string;
  question_kiny: string;
  answer_en: string;
  answer_kiny: string;
}

export const flipCardQuestions: FlipCardQuestion[] = [
  // Speed Limits
  {
    id: 1,
    question_en: "What is the speed limit in urban & built-up areas in Rwanda?",
    question_kiny: "Umuvuduko ntarengwa mu mijyi no mu nsisiro mu Rwanda ni uwuhe?",
    answer_en: "40 km/h — reduced near school zones and heavy pedestrian corridors.",
    answer_kiny: "40 km/h — ugabanuka cyane ku mashuri n'ahanyura abanyamaguru benshi.",
  },
  {
    id: 2,
    question_en: "What is the speed limit on rural roads and highways?",
    question_kiny: "Umuvuduko ntarengwa ku mihanda yo hanze y'umujyi na gariyandiko ni uwuhe?",
    answer_en: "60 km/h to 80 km/h, depending on posted signs.",
    answer_kiny: "60 km/h kugeza kuri 80 km/h bitewe n'ibyapa bihari.",
  },
  {
    id: 3,
    question_en: "What does a red triangle sign mean?",
    question_kiny: "Icyapa gifite ishusho ya mpandeshatu itukura gisobanura iki?",
    answer_en: "Warning sign — alerts you to upcoming danger ahead.",
    answer_kiny: "Icyapa cya kumenya — rigufasha kumenya akaga kari imbere.",
  },
  {
    id: 4,
    question_en: "What does a red traffic light mean?",
    question_kiny: "Icyapa cy'umutuku gikurikira hamwe n'umweru biduteye?",
    answer_en: "Stop fully before the stop line.",
    answer_kiny: "Hagarara neza mbere yo ku murongo wo guhagarara.",
  },
  {
    id: 5,
    question_en: "Which side of the road do you drive on in Rwanda?",
    question_kiny: "Ugendera ku ruhande rw'umuhanda rwa hehe mu Rwanda?",
    answer_en: "Traffic moves on the right. Overtake strictly on the left.",
    answer_kiny: "Ibinyabiziga bigendera iburyo. Kunyuranaho bikorerwa ibumoso gusa.",
  },
  {
    id: 6,
    question_en: "Can you pass on solid white lines in Rwanda?",
    question_kiny: "Ushobora guca ku murongo wera ukomeje mu Rwanda?",
    answer_en: "No — passing on solid white lines or around sharp blind curves is illegal.",
    answer_kiny: "Oya — guca ku murongo wera ukomeje cyangwa mu makorosi atabona neza birabujijwe.",
  },
  {
    id: 7,
    question_en: "Who has the right of way at a roundabout?",
    question_kiny: "Ni nda ufite uburenganzira bwo gutambuka mbere muri rond-point?",
    answer_en: "Vehicles already circulating inside the roundabout have right-of-way.",
    answer_kiny: "Ikinyabiziga kiri muri rond-point nicyo gifite uburenganzira bwo gutambuka mbere.",
  },
  {
    id: 8,
    question_en: "What should you do at a pedestrian zebra crossing?",
    question_kiny: "Ugomba gukora iki ku mirongo yera y'abanyamaguru (Zebra Crossing)?",
    answer_en: "Yield to pedestrians. Stop fully if a pedestrian is waiting at the curb.",
    answer_kiny: "Tegereza abanyamaguru. Hagarara neza igihe cyose umunyamaguru ateganya kwambuka.",
  },
  {
    id: 9,
    question_en: "What happens if you park in a 'No Parking' zone in Rwanda?",
    question_kiny: "Iki gikorwa gishobora gutuma imodoka yawe itwarwa mu Rwanda?",
    answer_en: "Your vehicle can be immediately towed and you'll face heavy fines.",
    answer_kiny: "Imodoka yawe ishobora gufatwa ku buryo bwihuse kandi ucibwa amande aremereye.",
  },
  {
    id: 10,
    question_en: "How do you get a driving license in Rwanda?",
    question_kiny: "Ushobora gutanga uruhushya rwo gutwara mu Rwanda uburyo buke?",
    answer_en: "Apply through IremboGov (www.irembo.gov.rw or dial *909#) — fully digital process.",
    answer_kiny: "Saba kuri IremboGov (www.irembo.gov.rw cyangwa ukande *909#) — uburyo bw'ikoranabuhanga bwose.",
  },
  {
    id: 11,
    question_en: "What is the minimum pass score for a Provisional License?",
    question_kiny: "Amanota fatizo yo gutsinda uruhushya rw'agateganyo ni angahe?",
    answer_en: "60% at Busanza Automated Center, or 12/20 at other centers.",
    answer_kiny: "60% ku Busanza Automated Center, cyangwa 12/20 ahandi hose.",
  },
  {
    id: 12,
    question_en: "What is Rwanda's policy on drunk driving?",
    question_kiny: "Politiki y'u Rwanda ku gutwara wasinze ni iki?",
    answer_en: "Zero tolerance — immediate vehicle impoundment, heavy fines, and mandatory detention.",
    answer_kiny: "Nta businzi — gufatirwa imodoka, amande aremereye, no gufungwa by'agateganyo.",
  },
  {
    id: 13,
    question_en: "How long do you have to pay traffic fines in Rwanda?",
    question_kiny: "Igihe ufitanye igihe cyo kwishyura amande y'umuhanda mu Rwanda?",
    answer_en: "Within 3 days via IremboGov. Late payment adds 10,000 RWF penalty.",
    answer_kiny: "Mu minsi 3 kuri IremboGov. Iyo uze igihe, ucibwa amande y'ubukererwe 10,000 RWF.",
  },
  {
    id: 14,
    question_en: "How should you drive downhill in Rwanda's hilly terrain?",
    question_kiny: "Ushobora gutwara he hasi hasi mu misozi y'u Rwanda?",
    answer_en: "Use engine braking (downshift) rather than continuous foot braking to prevent brake fade.",
    answer_kiny: "Koresha feri ya moteri (engine braking) aho gukomeza gukandagira feri y'ibirenge gusa.",
  },
  {
    id: 15,
    question_en: "What following distance should you maintain in rainy weather?",
    question_kiny: "Intera ugomba kugumana igihe imvura iri mu Rwanda?",
    answer_en: "Expand from 3 seconds to at least 4–5 seconds due to extended braking distances.",
    answer_kiny: "Ongerera kuri masegonda 4 kugeza kuri 5 kubera ko intera yo guhagarara yongera.",
  },
  {
    id: 16,
    question_en: "What should you do when encountering oncoming vehicles at night on unpaved roads?",
    question_kiny: "Ugomba gukora iki igihe uhuye n'ikindi kinyabiziga ijoro ku mihanda itarafunzwe?",
    answer_en: "Switch to low beams immediately to avoid blinding oncoming drivers.",
    answer_kiny: "Zimya amatara maremare (phare) ukoreshe magufi (code) kugira ngo utabahuma amaso.",
  },
  {
    id: 17,
    question_en: "What is the provisional license validity period?",
    question_kiny: "Igihe rwamara uruhushya rw'agateganyo ni ukwezi kungahe?",
    answer_en: "1 year. The definitive license is valid for multiple years and renewable.",
    answer_kiny: "Umwaka 1. Uruhushya rwa burundu ruramara imyaka myinshi kandi ruravugururwa.",
  },
  {
    id: 18,
    question_en: "What are the rainy seasons in Rwanda that affect driving?",
    question_kiny: "Ibihe by'imvura mu Rwanda bigira ingaruka ku gutwara ibinyabiziga ni ibihe?",
    answer_en: "March–May (long rains) and October–December (short rains).",
    answer_kiny: "Werurwe–Gicurasi (imvura ndende) n'Ukwakira–Ukuboza (imvera nke).",
  },
  {
    id: 19,
    question_en: "What is the Demerit Point System in Rwanda?",
    question_kiny: "Sisitemu yo Gukata Amanota (Demerit Points) mu Rwanda ni iki?",
    answer_en: "Violations deduct points from your license. Accumulated penalties lead to suspension or retraining.",
    answer_kiny: "Amakosa ukora agenda agabanya amanota ku ruhushya rwawe, bishobora no kugeza ku kwamburwa uruhushya cyangwa gusubizwa mu masomo.",
  },
  {
    id: 20,
    question_en: "How long does it take to receive a definitive (physical) driving license?",
    question_kiny: "Igihe uruhushya rwa burundu (urw'ikinyabiziga) rutwara?",
    answer_en: "Up to 21 days. You'll receive an SMS notification when it's ready for pickup.",
    answer_kiny: "Iminsi igera kuri 21. Uzakira ubutumwa bugufi (SMS) bukumenyesha igihe ruzabera rwiteguye.",
  },
  {
    id: 21,
    question_en: "What does a roundabout sign tell you to do?",
    question_kiny: "Icyapa gihambaye ngo umuhanda ukurikire iki (Rond-Point)?",
    answer_en: "Navigate around the roundabout, yielding to vehicles already inside.",
    answer_kiny: "Kuzenguruka rond-point, utegereza ibinyabiziga biri muri yo mbere.",
  },
  {
    id: 22,
    question_en: "What is the penalty for camera-detected speed violations?",
    question_kiny: "Ibihano byo kurenza umuvuduko bivumburwe n'amera ni ibihe?",
    answer_en: "Automated SMS notice with fine starting at 10,000 RWF, payable via IremboGov.",
    answer_kiny: "Ubutumwa bugufi (SMS) bw'ihazabu buhitangira 10,000 RWF, bushyurwa kuri IremboGov.",
  },
  {
    id: 23,
    question_en: "What should you maintain for fuel economy while driving?",
    question_kiny: "Iki gihe ugomba gukora kugira ngo wirinde amafaranga y'ibitoro?",
    answer_en: "Maintain smooth acceleration between 70–85 km/h, keep tire pressures proper, and turn off engine if idling >30 seconds.",
    answer_kiny: "Gabanya umuvuduko ukabije, shyiramo umwuka ukwiye mu mapine, kandi uzimye moteri igihe uhagaze ahantu hamwe hejuru y'amasegonda 30.",
  },
  {
    id: 24,
    question_en: "What do you need to apply for a provisional driving license?",
    question_kiny: "Ibintu ukeneye kugira ngo usabe uruhushya rw'agateganyo rwo gutwara?",
    answer_en: "National ID, test registration code, phone number, and email.",
    answer_kiny: "Indangamuntu, kode yo kwiyandikisha ku kizamini, numero ya telefoni, na email.",
  },
  {
    id: 25,
    question_en: "What is the fine for exceeding brief drop-off parking limits?",
    question_kiny: "Ibihano byo guhagarika imodoka igihe kirekire mu khiliya ni ibihe?",
    answer_en: "Immediate towing and heavy fines if you exceed 5 minutes in a drop-off zone.",
    answer_kiny: "Imodoka yawe itwarwa na kigingi ugacibwa n'amafaranga y'ihazabu iyo uze amasegonda 5 mu khiliya.",
  },
];
