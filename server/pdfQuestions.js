/**
 * PDF Quiz Questions — Extracted from "Amategeko y'Umuhanda" (Rwanda Traffic Rules)
 * Organized into 20-question quiz bundles for the Ishami platform.
 * Questions are in Kinyarwanda with English translations.
 * Each bundle has a category and license class associations.
 */

const b1 = [
  {
    question: "Ikinyabiziga cyose cyangwa ibinyabiziga bigenda bigomba kugira:",
    questionEn: "Every vehicle must have:",
    options: [
      { text: "Umuyobozi", isCorrect: true },
      { text: "Umuherekeza", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "A driver", isCorrect: true },
      { text: "A passenger", isCorrect: false },
      { text: "A and B are correct", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ingingo ya 2.10 — Umuyobozi ni umuntu wese utwaye ikinyabiziga."
  },
  {
    question: "Ijambo 'akayira' bivuga inzira nyabagendwa ifunganye yagenewe gusa:",
    questionEn: "The word 'akayira' means a narrow road reserved for:",
    options: [
      { text: "Abanyamaguru", isCorrect: false },
      { text: "Ibinyabiziga bigendera ku biziga bibiri", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Pedestrians", isCorrect: false },
      { text: "Two-wheeled vehicles", isCorrect: false },
      { text: "A and B are correct", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ingingo ya 2.7 — Akayira ni inzira ifunganye yagenewe abanyamaguru cyangwa ibinyabiziga bya biziga bibiri."
  },
  {
    question: "Kunyuranaho bikorerwa:",
    questionEn: "Overtaking is done:",
    options: [
      { text: "Mu ruhande rw'iburyo gusa", isCorrect: false },
      { text: "Igihe cyose ni ibumoso", isCorrect: true },
      { text: "Iburyo iyo unyura ku nyamaswa", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "On the right only", isCorrect: false },
      { text: "Always on the left", isCorrect: true },
      { text: "Right when passing animals", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Kunyuranaho bikorerwa ibumoso gusa mu Rwanda."
  },
  {
    question: "Ahatari mu nsisiro umuvuduko ntarengwa mu isaha wa velomoteri ni:",
    questionEn: "Outside urban areas, the speed limit for bicycles is:",
    options: [
      { text: "Km50", isCorrect: true },
      { text: "Km40", isCorrect: false },
      { text: "Km30", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "50 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "30 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa wa velomoteri ahatari mu nsisiro ni 50 km/h."
  },
  {
    question: "Nibura ikinyabiziga gitegetswe kugira uduhanagurakirahure tungahe:",
    questionEn: "Every vehicle must have at least how many wipers?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ikinyabiziga gitegetswe kugira nibura uduhanagurakirahure twa 1."
  },
  {
    question: "Uburyo bukoreshwa kugirango ikinyabiziga kigende gahoro igihe feri idakora neza babwita:",
    questionEn: "The technique to slow a vehicle when brakes fail is called:",
    options: [
      { text: "Feri y'urugendo", isCorrect: false },
      { text: "Feri yo guhagarara umwanya munini", isCorrect: false },
      { text: "Feri yo gutabara", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Service brake", isCorrect: false },
      { text: "Parking brake", isCorrect: false },
      { text: "Emergency brake", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Feri yo gutabara ikoreshwa igihe feri y'urugendo idakora neza."
  },
  {
    question: "Amatara maremare y'ikinyabiziga agomba kuzimwa mu bihe bikurikira:",
    questionEn: "Vehicle high beams must be turned off when:",
    options: [
      { text: "Iyo umuhanda umurikiye umuyobozi abasha kureba muri metero 20", isCorrect: false },
      { text: "Iyo ikinyabiziga kigiye kubisikana n'ibindi", isCorrect: true },
      { text: "Iyo ari mu nsisiro", isCorrect: false },
      { text: "Ibisubizo byose ni ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "When road is well lit", isCorrect: false },
      { text: "When about to meet oncoming vehicles", isCorrect: true },
      { text: "When in urban areas", isCorrect: false },
      { text: "All answers are correct", isCorrect: false }
    ],
    explanation: "Amatara maremare agomba kuzimwa igihe ikinyabiziga kigiye kubisikana n'ibindi."
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko umuvuduko ntarengwa w'amapikipiki mu isaha ni:",
    questionEn: "The default speed limit for motorcycles is:",
    options: [
      { text: "Km25", isCorrect: false },
      { text: "Km70", isCorrect: true },
      { text: "Km40", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "25 km/h", isCorrect: false },
      { text: "70 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa w'amapikipiki ni 70 km/h."
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko, umuvuduko ntarengwa ku modoka zitwara abagenzi mu buryo bwa rusange ni:",
    questionEn: "The default speed limit for passenger vehicles is:",
    options: [
      { text: "Km 60 mu isaha", isCorrect: true },
      { text: "Km 40 mu isaha", isCorrect: false },
      { text: "Km 25 mu isaha", isCorrect: false },
      { text: "Km 20 mu isaha", isCorrect: false }
    ],
    optionsEn: [
      { text: "60 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "25 km/h", isCorrect: false },
      { text: "20 km/h", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa ku modoka zitwara abagenzi ni 60 km/h."
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko, umuvuduko ntarengwa ku amatagisi zifite uburemere bwemewe butarenga kg 3500 ni:",
    questionEn: "The default speed limit for trucks over 3500 kg is:",
    options: [
      { text: "Km 60 mu isaha", isCorrect: false },
      { text: "Km 40 mu isaha", isCorrect: false },
      { text: "Km 75 mu isaha", isCorrect: true },
      { text: "Km 20 mu isaha", isCorrect: false }
    ],
    optionsEn: [
      { text: "60 km/h", isCorrect: false },
      { text: "40 km/h", isCorrect: false },
      { text: "75 km/h", isCorrect: true },
      { text: "20 km/h", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa ku amatagisi butarenga kg 3500 ni 75 km/h."
  },
  {
    question: "Ubugari bwa romoruki ikuruwe n'ikinyamitende itatu ntibugomba kurenza:",
    questionEn: "Trailer width pulled by a tricycle must not exceed:",
    options: [
      { text: "cm75", isCorrect: false },
      { text: "cm125", isCorrect: false },
      { text: "cm265", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: true }
    ],
    optionsEn: [
      { text: "75 cm", isCorrect: false },
      { text: "125 cm", isCorrect: false },
      { text: "265 cm", isCorrect: false },
      { text: "No correct answer", isCorrect: true }
    ],
    explanation: "Ubugari bwa romoruki ikuruwe n'ikinyamitende itatu ntibugomba kurenga ubugari bw'ikinyabiziga."
  },
  {
    question: "Uretse mu mujyi, uburemere ntarengwa ku binyabiziga bifite imitambiko itatu ni:",
    questionEn: "Outside cities, weight limit for 3+ axle vehicles is:",
    options: [
      { text: "Toni 10", isCorrect: false },
      { text: "Toni 12", isCorrect: false },
      { text: "Toni 16", isCorrect: true },
      { text: "Toni 24", isCorrect: false }
    ],
    optionsEn: [
      { text: "10 tons", isCorrect: false },
      { text: "12 tons", isCorrect: false },
      { text: "16 tons", isCorrect: true },
      { text: "24 tons", isCorrect: false }
    ],
    explanation: "Uburemere ntarengwa bwemewe ku binyabiziga bifite imitambiko itatu ni toni 16."
  },
  {
    question: "Kunyura ku binyabiziga bindi, uretse icy'ibiziga bibiri, bibujijwe:",
    questionEn: "Overtaking other vehicles (except two-wheelers) is prohibited at:",
    options: [
      { text: "Hafi y'iteme iyo hari umuhanda ufunganye", isCorrect: false },
      { text: "Hafi y'aho abanyamaguru banyura", isCorrect: false },
      { text: "Hafi y'ibice by'umuhanda bimeze nabi", isCorrect: false },
      { text: "Ibi bisubizo byose ni ukuri", isCorrect: true }
    ],
    optionsEn: [
      { text: "Near narrow bridges", isCorrect: false },
      { text: "Near pedestrian crossings", isCorrect: false },
      { text: "Near bad road sections", isCorrect: false },
      { text: "All of these answers", isCorrect: true }
    ],
    explanation: "Kunyuranaho bibujijwe ku iteme, hafi abanyamaguru, no hafi ibice by'umuhanda bimeze nabi."
  },
  {
    question: "Itara ndanganyuma rigomba gushyirwa aha hakurikira:",
    questionEn: "The rear light must be placed:",
    options: [
      { text: "Ahagereye inguni y'ibumoso y'ikinyabiziga", isCorrect: false },
      { text: "Ahagereye inguni y'iburyo bw'ikinyabiziga", isCorrect: false },
      { text: "Inyuma kandi y'impera y'ibumoso bw'ikinyabiziga", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Near the left corner", isCorrect: false },
      { text: "Near the right corner", isCorrect: false },
      { text: "At the rear on the left side", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Itara ndanganyuma rigomba kuboneka ahagereye inguni y'ibumoso inyuma."
  },
  {
    question: "Bumwe muri ubu bwoko bwa feri ituma imodoka iguma aho iri ku muzamuko bya 16%:",
    questionEn: "The brake that holds on a 16% slope is:",
    options: [
      { text: "Feri yo guhagarara umwanya munini", isCorrect: true },
      { text: "Feri y'urugendo", isCorrect: false },
      { text: "Feri yo gutabara", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Parking brake", isCorrect: true },
      { text: "Service brake", isCorrect: false },
      { text: "Emergency brake", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Feri yo guhagarara umwanya munini igomba gufata ku muzamuko bya 16%."
  },
  {
    question: "Ibinyabiziga bifite ubugari burenga m 2.10 bigomba kugira amatara:",
    questionEn: "Vehicles wider than 2.10m must have:",
    options: [
      { text: "Amatara ndangaburumbarare", isCorrect: true },
      { text: "Amatara ndangamubyimba", isCorrect: false },
      { text: "Amatara ndangacyerekezo", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Outline lights", isCorrect: true },
      { text: "Height lights", isCorrect: false },
      { text: "Direction lights", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibinyabiziga bifite ubugari burenga m 2.10 bigomba kugira amatara ndangaburumbarare."
  },
  {
    question: "Ahari hejuru cyane y'ubuso bumurika amatara ntihashobora kuba aharenze:",
    questionEn: "Lights above ground must not exceed:",
    options: [
      { text: "m1 na cm 50", isCorrect: false },
      { text: "m1 na cm 75", isCorrect: false },
      { text: "m 1 na cm 90", isCorrect: false },
      { text: "m2 na cm 10", isCorrect: true }
    ],
    optionsEn: [
      { text: "1.50 m", isCorrect: false },
      { text: "1.75 m", isCorrect: false },
      { text: "1.90 m", isCorrect: false },
      { text: "2.10 m", isCorrect: true }
    ],
    explanation: "Amatara ndangambere na ndanganyuma ntishobora kuba hejuru ya m 2.10."
  },
  {
    question: "Ikinyabiziga gishobora kugenda moteri itaka:",
    questionEn: "A vehicle may drive with engine off:",
    options: [
      { text: "Igihe kigenda ahamanuka", isCorrect: false },
      { text: "Igihe gikuruwe n'ikindi kinyabiziga", isCorrect: true },
      { text: "Igihe gifite feri y'urugendo", isCorrect: false },
      { text: "Ibisubizo byose ni byo", isCorrect: false }
    ],
    optionsEn: [
      { text: "When going downhill", isCorrect: false },
      { text: "When being towed", isCorrect: true },
      { text: "When having a service brake", isCorrect: false },
      { text: "All answers", isCorrect: false }
    ],
    explanation: "Ikinyabiziga gishobora kugenda moteri itaka igihe gikuruwe n'ikindi."
  },
  {
    question: "Amahoni y'ibinyabiziga agomba kohereza ijwi ry'injyana imwe rikomeza:",
    questionEn: "Vehicle horns must produce:",
    options: [
      { text: "Ijwi ry'injyana imwe rikomeza kandi ridace", isCorrect: true },
      { text: "Amajwi atandukanye", isCorrect: false },
      { text: "Ijwi rihindukirwa", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "A continuous uniform sound", isCorrect: true },
      { text: "Different sounds", isCorrect: false },
      { text: "A changing sound", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Amahoni agomba kohereza ijwi ry'injyana imwe rikomeza kandi ridace."
  }
];

const b2 = [
  {
    question: "Icyapa kivuga gutambuka mbere y'ibinyabiziga biturutse imbere gifite amabara:",
    questionEn: "The priority-to-oncoming sign has colors:",
    options: [
      { text: "Ubuso ni umweru", isCorrect: false },
      { text: "Ikirango ni umutuku n'umukara", isCorrect: false },
      { text: "Ikirango ni umweru n'umukara", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: true }
    ],
    optionsEn: [
      { text: "White background", isCorrect: false },
      { text: "Red and black border", isCorrect: false },
      { text: "White and black border", isCorrect: false },
      { text: "No correct answer", isCorrect: true }
    ],
    explanation: "Icyapa cyo gutambuka mbere cya mpandeshatu gicika ibumoso cyangwa iburyo."
  },
  {
    question: "Ni ryari itegeko ryo gutambuka mbere kw'iburyo rikurikizwa mu masangano:",
    questionEn: "When is 'priority to the right' applied at intersections?",
    options: [
      { text: "Iyo nta cyapa cyo gutambuka mbere gihari", isCorrect: false },
      { text: "Iyo traffic light zidakora", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "When no priority sign exists", isCorrect: false },
      { text: "When traffic lights aren't working", isCorrect: false },
      { text: "A and B are correct", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Itegeko ryo gutambuka mbere kw'iburyo rikoreshwa iyo nta cyapa cyo gutambuka mbere gihari."
  },
  {
    question: "Ibimenyetso bimurika bishobora no gushyirwa ibumoso cyangwa hejuru y'umuhanda:",
    questionEn: "Traffic lights can also be placed on the left or above the road:",
    options: [
      { text: "Hakurikijwe icyerekezo", isCorrect: false },
      { text: "Hakurikijwe icyo bigamije kwerekana", isCorrect: false },
      { text: "Kugirango birusheho kugaragara neza", isCorrect: true },
      { text: "Ibisubizo byose ni ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Based on direction", isCorrect: false },
      { text: "Based on what they show", isCorrect: false },
      { text: "To be more visible", isCorrect: true },
      { text: "All correct", isCorrect: false }
    ],
    explanation: "Bishobora gushyirwa ibumoso cyangwa hejuru kugirango birusheho kugaragara."
  },
  {
    question: "Iyo kuyobya umuhanda ari ngombwa, icyapa gifite ubuso bw'amabara:",
    questionEn: "Mandatory detour signs have background color:",
    options: [
      { text: "Ubururu", isCorrect: true },
      { text: "Umweru", isCorrect: false },
      { text: "Umutuku", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Blue", isCorrect: true },
      { text: "White", isCorrect: false },
      { text: "Red", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibyapa by'ibyerekezo bya ngombwa bifite ubuso bw'ubururu."
  },
  {
    question: "Ku mihanda ibyapa bikurikira bigomba kugaragazwa ku buryo bumwe:",
    questionEn: "On roads, these sign types must be displayed together:",
    options: [
      { text: "Ibyapa biyobora n'ibitegeka", isCorrect: false },
      { text: "Ibyapa biburira n'ibitegeka", isCorrect: false },
      { text: "Ibyapa bibuza n'ibitegeka", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Directional and mandatory", isCorrect: false },
      { text: "Warning and mandatory", isCorrect: false },
      { text: "Prohibitory and mandatory", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibyapa bibuza n'ibitegeka bigomba kugaragazwa ku buryo bumwe."
  },
  {
    question: "Icyapa cyerekana ahantu hagenewe guhagararwamo n'imodoka nini kirangwa:",
    questionEn: "Bus stop signs are colored:",
    options: [
      { text: "Ubururu n'umweru", isCorrect: true },
      { text: "Umukara n'umweru", isCorrect: false },
      { text: "Umutuku n'umweru", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Blue and white", isCorrect: true },
      { text: "Black and white", isCorrect: false },
      { text: "Red and white", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibyapa by'ahantu bigenewe amagare bifite ubuso bw'ubururu n'umweru."
  },
  {
    question: "Icyapa 'inzira y'amagare gusa' kirangwa n'ibara:",
    questionEn: "'Cycle lane only' sign color:",
    options: [
      { text: "Ubururu n'umweru", isCorrect: true },
      { text: "Umukara n'umweru", isCorrect: false },
      { text: "Umutuku n'umweru", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Blue and white", isCorrect: true },
      { text: "Black and white", isCorrect: false },
      { text: "Red and white", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibyapa by'inzira y'amagare bifite ubuso bw'ubururu n'umweru."
  },
  {
    question: "Icyapa 'umwanya muto' kirangwa n'ibara:",
    questionEn: "'Short parking' sign color:",
    options: [
      { text: "Ubururu n'umweru", isCorrect: true },
      { text: "Umukara n'umweru", isCorrect: false },
      { text: "Umutuku n'umweru", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Blue and white", isCorrect: true },
      { text: "Black and white", isCorrect: false },
      { text: "Red and white", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibyapa by'ahantu bihagararwamo amasegonda mike bifite ubuso bw'ubururu n'umweru."
  },
  {
    question: "Cyangwa kibujijwe kunyura kubindi binyabiziga uretse ibinyamitende ibiri n'amapikipiki:",
    questionEn: "Sign prohibiting all except two-wheelers:",
    options: [
      { text: "Umweru n'umukara", isCorrect: false },
      { text: "Umutuku n'umukara", isCorrect: true },
      { text: "Ubururu", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "White and black", isCorrect: false },
      { text: "Red and black", isCorrect: true },
      { text: "Blue", isCorrect: false },
      { text: "A and B", isCorrect: false }
    ],
    explanation: "Ibimenyetso byo kunyuranyiriza bifite umutuku n'umukara."
  },
  {
    question: "Icyapa 'hatanyurwa mu byerekezo byombi' kirangwa:",
    questionEn: "'No entry both ways' sign color:",
    options: [
      { text: "Umukara", isCorrect: false },
      { text: "Umweru", isCorrect: true },
      { text: "Ubururu", isCorrect: false },
      { text: "Umutuku", isCorrect: false }
    ],
    optionsEn: [
      { text: "Black", isCorrect: false },
      { text: "White", isCorrect: true },
      { text: "Blue", isCorrect: false },
      { text: "Red", isCorrect: false }
    ],
    explanation: "Icyapa cya 'hatanyurwa' gifite umweru mu buso bwacyo."
  },
  {
    question: "Icyapa gifite umutuku mu rundi rw'umuhondo kivuga:",
    questionEn: "A sign with yellow diagonal stripes means:",
    options: [
      { text: "Umuvuduko ntarengwa 30 km/h", isCorrect: false },
      { text: "Iherezo ry'umuvuduko muke utegetswe", isCorrect: true },
      { text: "Umuvuduko uri hejuru 30 km/h", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Speed limit 30 km/h", isCorrect: false },
      { text: "End of set low speed limit", isCorrect: true },
      { text: "Speed above 30 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Icyapa gifite umutuku mu rundi rw'umuhondo kivuga iherezo ry'umuvuduko."
  },
  {
    question: "Icyapa gifite umutuku n'umukara kivuga:",
    questionEn: "A red and black circular sign means:",
    options: [
      { text: "Ntihanyurwa", isCorrect: false },
      { text: "Birabujijwe guhagarara umwanya munini", isCorrect: true },
      { text: "Umuvuduko utarengeje", isCorrect: false },
      { text: "Inzira yabanyeshuli", isCorrect: false }
    ],
    optionsEn: [
      { text: "No entry", isCorrect: false },
      { text: "Short parking prohibited", isCorrect: true },
      { text: "Speed limit", isCorrect: false },
      { text: "School path", isCorrect: false }
    ],
    explanation: "Icyapa cya utudirwaho umwanya munini gifite umutuku n'umukara."
  },
  {
    question: "Icyapa B3 kivuga:",
    questionEn: "Sign B3 means:",
    options: [
      { text: "Uburenganzira bwo gutambuka mbere", isCorrect: true },
      { text: "Nta kinyabiziga kigendeshwa na moteri", isCorrect: false },
      { text: "Ibyerekezo bibiri by'umuhanda", isCorrect: false },
      { text: "Birabujijwe kunyuranaho", isCorrect: false }
    ],
    optionsEn: [
      { text: "Priority road", isCorrect: true },
      { text: "No motor vehicles", isCorrect: false },
      { text: "Two-way road", isCorrect: false },
      { text: "No overtaking", isCorrect: false }
    ],
    explanation: "Icyapa B3 kiranga uburenganzira bwo gutambuka mbere."
  },
  {
    question: "Icyapa gifite ishusho ya mpandeshatu kimenyesha:",
    questionEn: "A triangular sign indicates:",
    options: [
      { text: "Ibyago", isCorrect: true },
      { text: "Ibibujijwe", isCorrect: false },
      { text: "Ibitegetswe", isCorrect: false },
      { text: "Ntagisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Warnings", isCorrect: true },
      { text: "Prohibitions", isCorrect: false },
      { text: "Mandatory", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibimenyetso bya mpandeshatu biranga ibyago."
  },
  {
    question: "Iki kimenyetso cyaka kinyemerera gukomeza:",
    questionEn: "This lit signal allows you to:",
    options: [
      { text: "Yego", isCorrect: false },
      { text: "Yego ariko utanga inzira kubanyamaguru", isCorrect: true },
      { text: "Yego utanga inzira kubandi", isCorrect: false },
      { text: "Oya", isCorrect: false }
    ],
    optionsEn: [
      { text: "Yes", isCorrect: false },
      { text: "Yes but yield to pedestrians", isCorrect: true },
      { text: "Yes yield to others", isCorrect: false },
      { text: "No", isCorrect: false }
    ],
    explanation: "Itara ry'icyatsi ryemera gukomeza ariko uhe inzira abanyamaguru."
  },
  {
    question: "Mubimenyetso bimurika, itara ry'umuhondo risobanura:",
    questionEn: "Yellow traffic light means:",
    options: [
      { text: "Itegure kugenda", isCorrect: false },
      { text: "Birabujijwe gutambuka umurongo wo guhagarara", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Prepare to go", isCorrect: false },
      { text: "Don't cross the stop line", isCorrect: false },
      { text: "A and B correct", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Itara ry'umuhondo rirabuza gutambuka umurongo wo guhagarara."
  },
  {
    question: "Mubimenyetso bimurika, itara ry'icyatsi risobanura:",
    questionEn: "Green traffic light means:",
    options: [
      { text: "Kwitegura kugenda", isCorrect: false },
      { text: "Uburenganzira bwo kurenga icyo kimenyetso", isCorrect: true },
      { text: "Hagarara niba ifunze", isCorrect: false },
      { text: "Ntagisubizo cyukuri kirimo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Prepare to go", isCorrect: false },
      { text: "Right to cross", isCorrect: true },
      { text: "Stop if narrow", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Itara ry'icyatsi ryemera kugenda."
  },
  {
    question: "Icyapa cya mpandeshatu gifite umutuku mu buso bwacyo kivuga:",
    questionEn: "A red-background triangular sign means:",
    options: [
      { text: "Hagarara kereste", isCorrect: false },
      { text: "Hagarara niba ubona ntabyago", isCorrect: false },
      { text: "Birabujijwe kurenga icyo kimenyetso", isCorrect: true },
      { text: "Wemerewe kugenda", isCorrect: false }
    ],
    optionsEn: [
      { text: "Stop briefly", isCorrect: false },
      { text: "Stop if safe", isCorrect: false },
      { text: "Don't pass this sign", isCorrect: true },
      { text: "You may proceed", isCorrect: false }
    ],
    explanation: "Ibimenyetso by'umutuku mu buso bwabyo birabuza kunyurwa."
  },
  {
    question: "Icyapa cya 'Ntihanyurwa' gifite ibara:",
    questionEn: "'No entry' sign color:",
    options: [
      { text: "Umutuku", isCorrect: true },
      { text: "Ubururu", isCorrect: false },
      { text: "Umweru", isCorrect: false },
      { text: "Umuhondo", isCorrect: false }
    ],
    optionsEn: [
      { text: "Red", isCorrect: true },
      { text: "Blue", isCorrect: false },
      { text: "White", isCorrect: false },
      { text: "Yellow", isCorrect: false }
    ],
    explanation: "Icyapa 'Ntihanyurwa' gifite umutuku."
  }
];

const b3 = [
  {
    question: "Guhagarara akanya gato n'akanyini bibujijwe:",
    questionEn: "Short and long stops are prohibited:",
    options: [
      { text: "Ku mihanda y'icyerekezo kimwe hose", isCorrect: false },
      { text: "Mu ruhande ruteganye n'urwo ikindi kinyabiziga gihagazemo", isCorrect: false },
      { text: "Ku mihanda ibisikanirwamo butagifite m12", isCorrect: false },
      { text: "Ibisubizo byose nibyo", isCorrect: true }
    ],
    optionsEn: [
      { text: "On one-way roads", isCorrect: false },
      { text: "Parallel to parked vehicle", isCorrect: false },
      { text: "Narrow roads under 12m", isCorrect: false },
      { text: "All correct", isCorrect: true }
    ],
    explanation: "Guhagarara akanya gato n'akanyini bibujijwe mu bihe byose."
  },
  {
    question: "Iyo umuyobozi ageze mu ikorosi agomba kugenda:",
    questionEn: "At a roundabout, the driver must:",
    options: [
      { text: "Genda yitonze mu muhanda hagati", isCorrect: false },
      { text: "Genda yitonze iburyo", isCorrect: true },
      { text: "Genda yitonze ibumoso", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Drive in the middle", isCorrect: false },
      { text: "Drive on the right", isCorrect: true },
      { text: "Drive on the left", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Mu ikorosi umuyobozi agomba kugenda yitonze iburyo."
  },
  {
    question: "Mbere yo guhagarara ahantu hatemewe:",
    questionEn: "Before stopping at undesignated place, check:",
    options: [
      { text: "Nta kinyabiziga kimuturutse inyuma", isCorrect: false },
      { text: "Nta kinyabiziga kimuturutse imbere", isCorrect: false },
      { text: "Nta kinyabiziga kimuturutse imbere cyangwa inyuma", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "No vehicle from behind", isCorrect: false },
      { text: "No vehicle from ahead", isCorrect: false },
      { text: "No vehicle ahead or behind", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuyobozi agomba kureba imbere n'inyuma mbere yo guhagarara."
  },
  {
    question: "Mbere yo gupaka mu muhanda, agomba gusiga umwanya:",
    questionEn: "Before parking on road, leave gap:",
    options: [
      { text: "Metero 1", isCorrect: false },
      { text: "Metero 0.5", isCorrect: true },
      { text: "Metero 2", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "1 meter", isCorrect: false },
      { text: "0.5 meters", isCorrect: true },
      { text: "2 meters", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuyobozi agomba gusiga metero 0.5 hagati y'ikinyabiziga cye n'ibindi."
  },
  {
    question: "Mbere yo guhindura inzira:",
    questionEn: "Before changing direction, check:",
    options: [
      { text: "Nta kinyabiziga kimuturutse inyuma", isCorrect: true },
      { text: "Nta kinyabiziga kimuturutse imbere", isCorrect: false },
      { text: "Imbere n'inyuma", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "No vehicle from behind", isCorrect: true },
      { text: "No vehicle from ahead", isCorrect: false },
      { text: "Both ahead and behind", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuyobozi agomba kureba inyuma mbere yo guhindura inzira."
  },
  {
    question: "Umuvuduko ntarengwa mu mijyi ni:",
    questionEn: "Urban speed limit is:",
    options: [
      { text: "60 km/h", isCorrect: false },
      { text: "40 km/h", isCorrect: true },
      { text: "50 km/h", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "60 km/h", isCorrect: false },
      { text: "40 km/h", isCorrect: true },
      { text: "50 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa mu mijyi ni 40 km/h."
  },
  {
    question: "Umuvuduko ntarengwa ku modoka zitwara abagenzi:",
    questionEn: "Speed limit for passenger vehicles:",
    options: [
      { text: "60 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "80 km/h", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "60 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "80 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa ku modoka zitwara abagenzi ni 60 km/h."
  },
  {
    question: "Umuvuduko ntarengwa ku amatagisi butarenga kg 3500:",
    questionEn: "Speed limit for trucks over 3500 kg:",
    options: [
      { text: "60 km/h", isCorrect: false },
      { text: "40 km/h", isCorrect: false },
      { text: "75 km/h", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "60 km/h", isCorrect: false },
      { text: "40 km/h", isCorrect: false },
      { text: "75 km/h", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa ku amatagisi butarenga kg 3500 ni 75 km/h."
  },
  {
    question: "Umuvuduko ntarengwa w'amapikipiki:",
    questionEn: "Motorcycle speed limit:",
    options: [
      { text: "25 km/h", isCorrect: false },
      { text: "70 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "25 km/h", isCorrect: false },
      { text: "70 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko ntarengwa w'amapikipiki ni 70 km/h."
  },
  {
    question: "Umuvuduko ntarengwa wa velomoteri ahatari mu nsisiro:",
    questionEn: "Bicycle speed limit outside urban areas:",
    options: [
      { text: "50 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "30 km/h", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "50 km/h", isCorrect: true },
      { text: "40 km/h", isCorrect: false },
      { text: "30 km/h", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuvuduko wa velomoteri ahatari mu nsisiro ni 50 km/h."
  },
  {
    question: "Kuvuza ihoni bibujijwe:",
    questionEn: "Honking is prohibited:",
    options: [
      { text: "Hafi y'ibitaro", isCorrect: false },
      { text: "Ku musigiti, ku rusengero", isCorrect: false },
      { text: "Hafi y'ubuyobozi bwa polisi", isCorrect: false },
      { text: "Ibisubizo byose ni ukuri", isCorrect: true }
    ],
    optionsEn: [
      { text: "Near hospitals", isCorrect: false },
      { text: "At mosques, churches", isCorrect: false },
      { text: "Near police stations", isCorrect: false },
      { text: "All correct", isCorrect: true }
    ],
    explanation: "Kuvuza ihoni bibujijwe hasa y'ibitaro, amasengero, n'aho polisi bahagarara."
  },
  {
    question: "Ntibyemewe gukoresha telephone:",
    questionEn: "Using a phone is prohibited:",
    options: [
      { text: "Mu biro bya leta", isCorrect: false },
      { text: "Mu biro bya Polisi", isCorrect: false },
      { text: "Igihe utwaye ikinyabiziga", isCorrect: true },
      { text: "Ibisubizo byose ni ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "In government offices", isCorrect: false },
      { text: "In police offices", isCorrect: false },
      { text: "While driving", isCorrect: true },
      { text: "All correct", isCorrect: false }
    ],
    explanation: "Gukoresha telephone igihe utwaye ikinyabiziga ntibyemewe."
  },
  {
    question: "Mu gihe cy'impanuka, nimero y'ubutabazi:",
    questionEn: "Emergency number for road accidents:",
    options: [
      { text: "911", isCorrect: false },
      { text: "100", isCorrect: false },
      { text: "112", isCorrect: true },
      { text: "131", isCorrect: false }
    ],
    optionsEn: [
      { text: "911", isCorrect: false },
      { text: "100", isCorrect: false },
      { text: "112", isCorrect: true },
      { text: "131", isCorrect: false }
    ],
    explanation: "Nimero y'ubutabazi mu Rwanda ni 112."
  },
  {
    question: "Ugeze ahabereye impanuka, wakora mbere:",
    questionEn: "At accident scene, first do:",
    options: [
      { text: "Gusohora inkomere mu kinyabiziga", isCorrect: false },
      { text: "Kubaha icyo kunywa", isCorrect: false },
      { text: "Ku menyesha impanuka no guhamagara ubutabazi", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Remove injured from vehicle", isCorrect: false },
      { text: "Give water", isCorrect: false },
      { text: "Report and call emergency", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Mbere y'ibindi, menyesha impanuka kandi uhamagare ubutabazi."
  },
  {
    question: "Gutwara uzungazunga mu muhanda:",
    questionEn: "Driving zigzag on the road:",
    options: [
      { text: "Ni bibi ku kinyabiziga cy'imitende ibiri", isCorrect: false },
      { text: "Ni bibi igihe cyose", isCorrect: true },
      { text: "Ni bibi ku kinyabiziga cy'imitende ine", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Bad for two-wheelers only", isCorrect: false },
      { text: "Always bad", isCorrect: true },
      { text: "Bad for four-wheelers only", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Gutwara uzungazunga mu muhanda ntibyemewe ku buryo bwose."
  },
  {
    question: "Niki ugomba gukora igihe uhagira n'ubwitonzi bw'amatara y'ikinyabiziga giturutse mu kindi cyerekezo:",
    questionEn: "When blinded by oncoming lights at night:",
    options: [
      { text: "Humisha amatara maremare", isCorrect: false },
      { text: "Egera kuburyo bw'umuhanda ugabanye umuvuduko", isCorrect: true },
      { text: "Canira amatara", isCorrect: false },
      { text: "Ongera umuvuduko", isCorrect: false }
    ],
    optionsEn: [
      { text: "Flash high beams back", isCorrect: false },
      { text: "Move right and reduce speed", isCorrect: true },
      { text: "Flash your lights", isCorrect: false },
      { text: "Speed up", isCorrect: false }
    ],
    explanation: "Egera kuburyo bw'umuhanda kandi ugate umuvuduko."
  },
  {
    question: "Amatara y'urugendo mu ibihu:",
    questionEn: "Headlights in fog:",
    options: [
      { text: "Ni meza kuko ureba kure", isCorrect: false },
      { text: "Ni mabi kuko arakugarukira", isCorrect: true },
      { text: "Akwizeza ko abandi bakubona", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Good, see far", isCorrect: false },
      { text: "Bad, reflect back", isCorrect: true },
      { text: "Ensure others see you", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Amatara maremare mu ibihu arakugarukira akaguhuma amaso."
  },
  {
    question: "Igihe ukurikiwe n'ikinyabiziga gitwara abarwayi:",
    questionEn: "When followed by an ambulance:",
    options: [
      { text: "Kugihigamira ndetse ugahagarara", isCorrect: true },
      { text: "Kongera umuvuduko", isCorrect: false },
      { text: "Kugumana umuvuduko", isCorrect: false },
      { text: "Guhagarara bitunguranye", isCorrect: false }
    ],
    optionsEn: [
      { text: "Pull over and stop", isCorrect: true },
      { text: "Speed up", isCorrect: false },
      { text: "Keep same speed", isCorrect: false },
      { text: "Stop suddenly", isCorrect: false }
    ],
    explanation: "Ibinyabiziga ndakumirwa bigomba guhindirirwa inzira neza."
  },
  {
    question: "Niki ugomba gukora igihe uhaye n'amatungo mu muhanda:",
    questionEn: "When encountering livestock on road:",
    options: [
      { text: "Kuvuza ihoni", isCorrect: false },
      { text: "Gabanya umuvuduko", isCorrect: true },
      { text: "Kwatsa amatara", isCorrect: false },
      { text: "Wihuta unyureho", isCorrect: false }
    ],
    optionsEn: [
      { text: "Honk", isCorrect: false },
      { text: "Reduce speed", isCorrect: true },
      { text: "Turn on lights", isCorrect: false },
      { text: "Speed past", isCorrect: false }
    ],
    explanation: "Umuyobozi agomba kugabanya umuvuduko kugirango amatungo ahungire."
  }
];

const b4 = [
  {
    question: "Icyemezo cy'isuzumwa ry'ikinyabiziga cya 6 amezi:",
    questionEn: "Vehicle inspection certificate valid for 6 months:",
    options: [
      { text: "Kubinyabiziga bikora ubucuruzi", isCorrect: true },
      { text: "Ku binyabiziga bidakora ubucuruzi", isCorrect: false },
      { text: "Ku binyabiziga bya police", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Commercial vehicles", isCorrect: true },
      { text: "Non-commercial vehicles", isCorrect: false },
      { text: "Police vehicles", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Icyemezo cy'isuzumwa cya 6 amezi kubikora ubucuruzi."
  },
  {
    question: "Ikinyabiziga gishya gikenerwa gusuzumwa mbere nyuma y'imyaka:",
    questionEn: "New vehicle first inspection after:",
    options: [
      { text: "Umwaka umwe", isCorrect: false },
      { text: "Imyaka ibiri", isCorrect: true },
      { text: "Amezi 6", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "1 year", isCorrect: false },
      { text: "2 years", isCorrect: true },
      { text: "6 months", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ikinyabiziga gishya gikenerwa gusuzumwa mbere nyuma y'imyaka ibiri."
  },
  {
    question: "Ni ryari ushobora kwakiriza amatara yose ndangacyerekezo?",
    questionEn: "When can you use all indicator lights?",
    options: [
      { text: "Ubwe kuburira abandi", isCorrect: false },
      { text: "Igihe ikinyabiziga gishobora guteza ibyago", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: true },
      { text: "Ntagisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "To warn others", isCorrect: false },
      { text: "When vehicle may cause danger", isCorrect: false },
      { text: "A and B correct", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Amatara yose ndangacyerekezo ashobora gukorwa igihe ibyago bihari."
  },
  {
    question: "Umwana atwaye akabango k'ishuri:",
    questionEn: "Child with school crossing flag:",
    options: [
      { text: "Ikomereze nkaho ataragera", isCorrect: false },
      { text: "Itegure kureka atambuke", isCorrect: true },
      { text: "Gabanya umuvuduko", isCorrect: false },
      { text: "Komeza nkaho akiri hanze", isCorrect: false }
    ],
    optionsEn: [
      { text: "Pretend you haven't arrived", isCorrect: false },
      { text: "Prepare to let them cross", isCorrect: true },
      { text: "Reduce speed", isCorrect: false },
      { text: "Continue as if not there", isCorrect: false }
    ],
    explanation: "Abana bashobora kwinjira mu muhanda atitaye."
  },
  {
    question: "Uhuye n'ingorane ifite icyapa cya mpandeshatu:",
    questionEn: "Encounter vehicle with warning triangle:",
    options: [
      { text: "Guhagarara hanyuma ugenda witonze", isCorrect: true },
      { text: "Kwihuta wegera imbere", isCorrect: false },
      { text: "Gutegereza abanyamaguru", isCorrect: false },
      { text: "Guhindukiza vuba", isCorrect: false }
    ],
    optionsEn: [
      { text: "Stop then carefully proceed", isCorrect: true },
      { text: "Speed up to see ahead", isCorrect: false },
      { text: "Wait for pedestrians", isCorrect: false },
      { text: "Turn around quickly", isCorrect: false }
    ],
    explanation: "Guhagarara mbere kandi ukagenda witonze."
  },
  {
    question: "Icyapa 'umuhanda unyerera' kivuga:",
    questionEn: "'Slippery road' sign means:",
    options: [
      { text: "Umuhanda unyerera", isCorrect: true },
      { text: "Ipine ryapfumutse", isCorrect: false },
      { text: "Icyago kidasobanuye", isCorrect: false },
      { text: "Hatangirwa serivisi", isCorrect: false }
    ],
    optionsEn: [
      { text: "Slippery road", isCorrect: true },
      { text: "Flat tire", isCorrect: false },
      { text: "Unknown danger", isCorrect: false },
      { text: "Services ahead", isCorrect: false }
    ],
    explanation: "Icyapa cya mpandeshatu gifite ikinyabiziga gikigererano."
  },
  {
    question: "Icyapa 'gari ya moshi ibambiye' kivuga:",
    questionEn: "'Railway with gates' sign means:",
    options: [
      { text: "Umuyobozi w'amatungo", isCorrect: false },
      { text: "Inzira ya gari ya moshi", isCorrect: false },
      { text: "Gari ya moshi hatabambiye", isCorrect: false },
      { text: "Inkomane ibambiye", isCorrect: true }
    ],
    optionsEn: [
      { text: "Livestock herder", isCorrect: false },
      { text: "Railway line", isCorrect: false },
      { text: "Railway without gates", isCorrect: false },
      { text: "Gated railway crossing", isCorrect: true }
    ],
    explanation: "Icyapa gifite agakamyo k'inzira ya gari ya moshi."
  },
  {
    question: "Igihe ahumishijwe n'amatara y'ikinyabiziga giturutse mu kindi cyerekezo:",
    questionEn: "When blinded by oncoming vehicle lights:",
    options: [
      { text: "Humisha amatara", isCorrect: false },
      { text: "Egera kuburyo ugabanye umuvuduko", isCorrect: true },
      { text: "Canira amatara", isCorrect: false },
      { text: "Ongera umuvuduko", isCorrect: false }
    ],
    optionsEn: [
      { text: "Flash back", isCorrect: false },
      { text: "Move right and reduce speed", isCorrect: true },
      { text: "Flash lights", isCorrect: false },
      { text: "Speed up", isCorrect: false }
    ],
    explanation: "Egera kuburyo bw'umuhanda kandi ugate umuvuduko."
  },
  {
    question: "Umuyobozi w'inyamaswa asaba ibinyabiziga bihagarara:",
    questionEn: "Herder asks vehicles to stop:",
    options: [
      { text: "Agomba guhagarara", isCorrect: true },
      { text: "Kuvuza ihoni akomeza", isCorrect: false },
      { text: "Gabanya umuvuduko gusa", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Must stop", isCorrect: true },
      { text: "Honk and continue", isCorrect: false },
      { text: "Just reduce speed", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Umuyobozi agomba guhagarara igihe umuyobozi w'inyamaswa abasabira."
  },
  {
    question: "Niki ugomba gukora mu gihe cy'impanuka?",
    questionEn: "What to do at an accident?",
    options: [
      { text: "Gusohora inkomere", isCorrect: false },
      { text: "Kubaha icyo kunywa", isCorrect: false },
      { text: "Kumenyesha no guhamagara ubutabazi", isCorrect: true },
      { text: "Kugenda vuba", isCorrect: false }
    ],
    optionsEn: [
      { text: "Remove injured", isCorrect: false },
      { text: "Give water", isCorrect: false },
      { text: "Report and call emergency", isCorrect: true },
      { text: "Leave quickly", isCorrect: false }
    ],
    explanation: "Mbere y'ibindi, menyesha impanuka kandi uhamagare ubutabazi."
  },
  {
    question: "Iki cyapa kibuza kunyuranaho ibumoso:",
    questionEn: "Sign prohibiting left overtaking:",
    options: [
      { text: "Iburyo", isCorrect: false },
      { text: "Ibumoso", isCorrect: true },
      { text: "Iburyo n'ibumoso", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Right", isCorrect: false },
      { text: "Left", isCorrect: true },
      { text: "Both", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Kunyuranaho bikorerwa ibumoso gusa, no kwibujijwe."
  },
  {
    question: "Iki cyapa gisobanura: Umuhanda utaringaniye",
    questionEn: "Sign: Uneven road",
    options: [
      { text: "Umuhanda utaringaniye", isCorrect: true },
      { text: "Iherezo ry'ibibuzwa", isCorrect: false },
      { text: "Umuvuduko utarengeje", isCorrect: false },
      { text: "Inzira yabanyeshuli", isCorrect: false }
    ],
    optionsEn: [
      { text: "Uneven road", isCorrect: true },
      { text: "End of prohibitions", isCorrect: false },
      { text: "Speed limit", isCorrect: false },
      { text: "School path", isCorrect: false }
    ],
    explanation: "Icyapa gifite umuhanda utaringaniye."
  },
  {
    question: "Iki cyapa gisobanura: Akazamuko gahanamye",
    questionEn: "Sign: Steep hill",
    options: [
      { text: "Umuhanda wubatswe nabi", isCorrect: false },
      { text: "Akazamuko gahanamye", isCorrect: true },
      { text: "Umuhanda utaringaniye", isCorrect: false },
      { text: "Umuhanda wangijwe", isCorrect: false }
    ],
    optionsEn: [
      { text: "Poorly built road", isCorrect: false },
      { text: "Steep hill", isCorrect: true },
      { text: "Uneven road", isCorrect: false },
      { text: "Damaged road", isCorrect: false }
    ],
    explanation: "Icyapa gifite akazamuko gakomeye."
  },
  {
    question: "Iki cyapa gisobanura: Ntihanyurwa",
    questionEn: "Sign: No entry",
    options: [
      { text: "Ntihanyurwa n'abanyamaguru", isCorrect: false },
      { text: "Akayira kabanyamaguru", isCorrect: false },
      { text: "Ntihanyurwa", isCorrect: true },
      { text: "Ahantu habambukira", isCorrect: false }
    ],
    optionsEn: [
      { text: "No pedestrian entry", isCorrect: false },
      { text: "Pedestrian path", isCorrect: false },
      { text: "No entry", isCorrect: true },
      { text: "Crossing point", isCorrect: false }
    ],
    explanation: "Icyapa 'Ntihanyurwa' kibujiza kunjira."
  }
];

const b5 = [
  {
    question: "Ibinyabiziga bigomba gukorerwa isuzumwa buri mwaka:",
    questionEn: "Vehicles inspected every year:",
    options: [
      { text: "Ibinyabiziga bigenewe gutwara abagenzi", isCorrect: false },
      { text: "Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5", isCorrect: false },
      { text: "Ibinyabiziga bigenewe kwigisha gutwara", isCorrect: false },
      { text: "Ibisubizo byose ni ukuri", isCorrect: true }
    ],
    optionsEn: [
      { text: "Passenger vehicles", isCorrect: false },
      { text: "Cargo over 3.5 tons", isCorrect: false },
      { text: "Driving school vehicles", isCorrect: false },
      { text: "All correct", isCorrect: true }
    ],
    explanation: "Ibinyabiziga byose bikorera ubucuruzi bigomba gukorerwa isuzumwa buri mwaka."
  },
  {
    question: "Ubugari bw'imitwaro y'ibinyamitende itatu n'ine:",
    questionEn: "Load width for tricycles and quadricycles:",
    options: [
      { text: "cm 30 ku bugari kidapakiye", isCorrect: false },
      { text: "Metero 2.50 ntarengwa", isCorrect: false },
      { text: "A na B ni ibisubizo by'ukuri", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "30 cm beyond unloaded width", isCorrect: false },
      { text: "Max 2.50 meters", isCorrect: false },
      { text: "A and B correct", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ubugari bw'imitwaro ni cm 30 n'ubugari ntarengwa m 2.50."
  },
  {
    question: "Imizigo inyuma y'ibinyamitende itatu n'ine:",
    questionEn: "Rear overhang for tricycles/quadricycles:",
    options: [
      { text: "cm 20", isCorrect: false },
      { text: "cm 30", isCorrect: false },
      { text: "cm 50", isCorrect: true },
      { text: "cm 60", isCorrect: false }
    ],
    optionsEn: [
      { text: "20 cm", isCorrect: false },
      { text: "30 cm", isCorrect: false },
      { text: "50 cm", isCorrect: true },
      { text: "60 cm", isCorrect: false }
    ],
    explanation: "Imizigo inyuma y'ibinyamitende ntishobora kurenga cm 50."
  },
  {
    question: "Ikinyabiziga gifite imitambiko ibiri ntibugomba kurenga:",
    questionEn: "Vehicle with two axles must not exceed:",
    options: [
      { text: "Mitero 11", isCorrect: false },
      { text: "Mitero 10", isCorrect: false },
      { text: "Mitero 7", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "11 meters", isCorrect: false },
      { text: "10 meters", isCorrect: false },
      { text: "7 meters", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ikinyabiziga gifite imitambiko ibiri ntibugomba kurenga metero 7."
  },
  {
    question: "Ubugari bw'imitwaro y'ipikipiki:",
    questionEn: "Motorcycle load width:",
    options: [
      { text: "Mitero 1.25", isCorrect: true },
      { text: "cm 30", isCorrect: false },
      { text: "cm 75", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "1.25 meters", isCorrect: true },
      { text: "30 cm", isCorrect: false },
      { text: "75 cm", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ubugari bw'imitwaro y'ipikipiki ntibugomba kurenga metero 1.25."
  },
  {
    question: "Igice kirenga inyuma cy'ibinyabiziga bikomatanye:",
    questionEn: "Rear overhang of coupled vehicles:",
    options: [
      { text: "Mitero 3.50", isCorrect: true },
      { text: "Mitero 1.70", isCorrect: false },
      { text: "Mitero 5", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "3.50 meters", isCorrect: true },
      { text: "1.70 meters", isCorrect: false },
      { text: "5 meters", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Igice kirenga inyuma ntigikwiye kurenga metero 3.50."
  },
  {
    question: "Ibinyabiziga bifite inziga zidahagwa zifite umubyimba hasi ya:",
    questionEn: "Vehicles with worn tires under:",
    options: [
      { text: "cm 2", isCorrect: false },
      { text: "cm 3", isCorrect: false },
      { text: "cm 4", isCorrect: true },
      { text: "cm 5", isCorrect: false }
    ],
    optionsEn: [
      { text: "2 cm", isCorrect: false },
      { text: "3 cm", isCorrect: false },
      { text: "4 cm", isCorrect: true },
      { text: "5 cm", isCorrect: false }
    ],
    explanation: "Inziga zidahagwa zifite umubyimba hasi ya cm 4 ntizemewe."
  },
  {
    question: "Ikinyabiziga gitegetswe kugira uduhanagurakirahure:",
    questionEn: "Every vehicle must have wipers:",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ikinyabiziga gitegetswe kugira nibura uduhanagurakirahure twa 1."
  },
  {
    question: "Ibinyabiziga bishobora kurenza km 40 mu isaha bigomba kugira:",
    questionEn: "Vehicles over 40 km/h must have:",
    options: [
      { text: "Icyerekana umuvuduko", isCorrect: true },
      { text: "Amatara abiri", isCorrect: false },
      { text: "Uduhanagurakirahure 3", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Speedometer", isCorrect: true },
      { text: "Two lights", isCorrect: false },
      { text: "Three wipers", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibinyabiziga bishobora kurenza km 40 bigomba kugira icyerekana umuvuduko."
  },
  {
    question: "Amatara ndangacyerekezo y'imbere aba:",
    questionEn: "Front direction indicators are:",
    options: [
      { text: "Yera cyangwa umuhondo", isCorrect: true },
      { text: "Atukura", isCorrect: false },
      { text: "Ubururu", isCorrect: false },
      { text: "Umukara", isCorrect: false }
    ],
    optionsEn: [
      { text: "White or yellow", isCorrect: true },
      { text: "Red", isCorrect: false },
      { text: "Blue", isCorrect: false },
      { text: "Black", isCorrect: false }
    ],
    explanation: "Amatara ndangacyerekezo y'imbere aba yera cyangwa umuhondo."
  },
  {
    question: "Amatara ndangamubyimba na burumbarare bigomba kugaragara iyo:",
    questionEn: "Height/width outline lights visible when:",
    options: [
      { text: "Uburebure burenga m6 cyangwa ubugari burenga m2.10", isCorrect: true },
      { text: "Igihe cyose", isCorrect: false },
      { text: "Mu ijoro gusa", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Length > 6m or width > 2.10m", isCorrect: true },
      { text: "Always", isCorrect: false },
      { text: "Night only", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Bigomba kugaragara iyo uburebure burenga m6 cyangwa ubugari burenga m2.10."
  },
  {
    question: "Ubugari bwa romoruki ikuruwe na velomoteri:",
    questionEn: "Trailer width pulled by moped:",
    options: [
      { text: "cm25", isCorrect: false },
      { text: "cm125", isCorrect: false },
      { text: "cm45", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri kirimo", isCorrect: true }
    ],
    optionsEn: [
      { text: "25 cm", isCorrect: false },
      { text: "125 cm", isCorrect: false },
      { text: "45 cm", isCorrect: false },
      { text: "No correct answer", isCorrect: true }
    ],
    explanation: "Ubugari bwa romoruki ntibugomba kurenga ubugari bw'ikinyabiziga gikurura."
  },
  {
    question: "Ibinyabiziga bifite ubugari burenga m 2.10 bigomba kugira:",
    questionEn: "Vehicles over 2.10m wide must have:",
    options: [
      { text: "Itara ry'ubururu mu mpande zose", isCorrect: true },
      { text: "Amatara ndangambere", isCorrect: false },
      { text: "Amatara ndanganyuma", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Blue flashing lights all sides", isCorrect: true },
      { text: "Front lights", isCorrect: false },
      { text: "Rear lights", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibinyabiziga bifite ubugari burenga m 2.10 bigomba kugira itara ry'ubururu."
  },
  {
    question: "Imizigo y'ubuhinzi idafunze birashobora kugera ku:",
    questionEn: "Unpackaged agricultural loads can reach:",
    options: [
      { text: "Mitero 2.50", isCorrect: false },
      { text: "Mitero 2.75", isCorrect: true },
      { text: "Mitero 3", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "2.50 meters", isCorrect: false },
      { text: "2.75 meters", isCorrect: true },
      { text: "3 meters", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibintu by'ubuhinzi bidafunze birashobora kugera kuri m 2.75."
  },
  {
    question: "Ibinyabiziga bya police, izimya-nkongi, ndetse n'ibitwara abarwayi:",
    questionEn: "Police, fire and ambulance vehicles:",
    options: [
      { text: "Bishobora guca ibimenyetso byose", isCorrect: true },
      { text: "Birafise amategeko ari mu byerekezo byombi", isCorrect: false },
      { text: "Biraba aho bifuza", isCorrect: false },
      { text: "Nta gisubizo cy'ukuri", isCorrect: false }
    ],
    optionsEn: [
      { text: "Can bypass all signs", isCorrect: true },
      { text: "Must follow all rules", isCorrect: false },
      { text: "Can park anywhere", isCorrect: false },
      { text: "No correct answer", isCorrect: false }
    ],
    explanation: "Ibinyabiziga ndakumirwa byombi bishobora guca ibimenyetso."
  }
];

// Every bundle must contain exactly 20 questions. Bundles that were extracted
// with fewer (14-19) are padded to 20 by duplicating questions from the other
// bundles' pools (deterministic: first unused question from the shared pool).
const TARGET_QUESTION_COUNT = 20;
const sharedPool = [b1, b2, b3, b4, b5].flat().filter(q => q && q.question);

const padTo20 = (questions) => {
  const out = Array.isArray(questions) ? questions.slice(0, TARGET_QUESTION_COUNT) : [];
  let i = 0;
  while (out.length < TARGET_QUESTION_COUNT && i < sharedPool.length * 4) {
    const cand = sharedPool[i % sharedPool.length];
    if (cand && cand.question && !out.some(q => q.question === cand.question)) {
      out.push(cand);
    }
    i++;
  }
  return out;
};

export const pdfQuizBundles = [
  {
    id: "pdf_quiz_1",
    title: "Amategeko Y'Umubare (Fundamentals)",
    category: "Amategeko Y'Umubare",
    licenseClasses: ["A", "B", "C", "D"],
    questions: padTo20(b1)
  },
  {
    id: "pdf_quiz_2",
    title: "Ibimenyetso By'amahotaro (Traffic Signs)",
    category: "Ibimenyetso",
    licenseClasses: ["A", "B", "C", "D"],
    questions: padTo20(b2)
  },
  {
    id: "pdf_quiz_3",
    title: "Amategeko Yo Mu Muhanda (Road Rules)",
    category: "Amategeko Yo Mu Muhanda",
    licenseClasses: ["A", "B", "C", "D"],
    questions: padTo20(b3)
  },
  {
    id: "pdf_quiz_4",
    title: "Amategeko Y'Ibintu By'Ingenzi (Key Rules)",
    category: "Amategeko y'Ibintu by'Ingenzi",
    licenseClasses: ["A", "B", "C", "D"],
    questions: padTo20(b4)
  },
  {
    id: "pdf_quiz_5",
    title: "Amategeko Y'Ibinyabiziga (Vehicle Specs)",
    category: "Ibinyabiziga",
    licenseClasses: ["A", "B", "C", "D"],
    questions: padTo20(b5)
  }
];
