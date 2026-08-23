const fs = require('fs');

// ============================================================
// TASK 1 & 2: Process quizData through quizData6 with:
//  - Fix correctAnswers where possible
//  - Add questionEn, correctAnswerEn, licenseClass
// ============================================================

const LICENSE = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  ALL: ['A', 'B', 'C', 'D'],
  CDE: ['C', 'D', 'E'],
  AB: ['A', 'B'],
  BD: ['B', 'D'],
  BC: ['B', 'C'],
  BCD: ['B', 'C', 'D'],
  AE: ['A', 'E'],
};

// ---------- quizData (21 questions) ----------
const quizData = [
  {
    question: "Ikinyabiziga cyose cyangwa ibinyabiziga bigenda bigomba kugira:",
    options: ["Umuyobozi", "Umuherekeza", "A na B ni ibisubizo by'ukuri", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Umuyobozi",
    questionEn: "Every vehicle or moving traffic must have:",
    correctAnswerEn: "A driver",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ijambo 'akayira' bivuga inzira nyabagendwa ifunganye yagenewe gusa:",
    options: ["Abanyamaguru", "Ibinyabiziga bigendera ku biziga bibiri", "A na B ni ibisubizo by'ukuri", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "The word 'lane' refers to a separate part of the road designated only for:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umurongo uciyemo uduce umenyesha ahegereye umurongo ushobora kuzuzwa n'uturanga gukata tw'ibara ryera utwo turanga cyerekezo tumenyesha:",
    options: ["Igisate cy'umuhanda abayobozi bagomba gukurikira", "Ahegereye umurongo ukomeje", "Igabanurwa ry'umubare w'ibisate by'umuhanda mu cyerekezo bajyamo", "A na C nibyo"],
    correctAnswer: "A na C nibyo",
    questionEn: "The line consisting of short dashes indicates where the line can be crossed by short broken red lines; these directional lines indicate:",
    correctAnswerEn: "Both A and C are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ahantu ho kugendera mu muhanda herekanwa n'ibimenyetso bimurika ibinyabiziga ntibishobora kuhagenda:",
    options: ["Biteganye", "Ku murongo umwe", "A na B nibyo", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Biteganye",
    questionEn: "Where traffic on the road is indicated by traffic signs, vehicles must travel:",
    correctAnswerEn: "In single file / one after another",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibinyabiziga bikurikira bigomba gukorerwa isuzumwa buri mwaka:",
    options: ["Ibinyabiziga bigenewe gutwara abagenzi muri rusange", "Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5", "Ibinyabiziga bigenewe kwigisha gutwara", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Ibisubizo byose nibyo",
    questionEn: "The following vehicles must undergo inspection every year:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ubugari bwa romoruki ikuruwe n'ikinyamitende itatu ntibugomba kurenza ibipimo bikurikira:",
    options: ["cm75", "cm125", "cm265", "Nta gisubizo cy'ukuri"],
    correctAnswer: "cm125",
    questionEn: "The width of a tricycle trolley must not exceed which measurement:",
    correctAnswerEn: "cm125",
    licenseClass: LICENSE.E
  },
  {
    question: "Uburebure bw'ibinyabiziga bikurikira ntibugomba kurenga metero 11:",
    options: ["Ibifite umutambiko umwe uhuza imipira", "Ibifite imitambiko ibiri ikurikiranye mu bugari bwayo", "Makuzungu", "Nta gisubizo cy'ukuri"],
    correctAnswer: "Ibifite imitambiko ibiri ikurikiranye mu bugari bwayo",
    questionEn: "The length of the following vehicles must not exceed 11 meters:",
    correctAnswerEn: "Those with two axles following each other in width",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Ikinyabiziga kibujjiwe guhagarara akanya kanini aha hakurikira:",
    options: ["Ahatarengeje metero 1 imbere cyangwa inyuma y'ikinyabiziga gihagaze akanya gato cyangwa kanini", "Ahantu hatari ibimenyetso bibuza byabugenewe", "Aho abanyamaguru banyura mu muhanda ngo bakikire inkomyi", "Ibisubizo byose nibyo"],
    correctAnswer: "Ibisubizo byose nibyo",
    questionEn: "A vehicle is prohibited from stopping in the following places:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Kunyuranaho bikorerwa:",
    options: ["Mu ruhande rw'iburyo gusa", "Igihe cyose ni ibumoso", "Iburyo iyo unyura ku nyamaswa", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Igihe cyose ni ibumoso",
    questionEn: "Overtaking is done:",
    correctAnswerEn: "Always on the left side",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana umuvuduko ntarengwa ikinyabiziga kitagomba kurenza gishyirwa gusa ku binyabiziga bifite uburemere ntarengwa bukurikira:",
    options: ["Burenga toni 1", "Burenga toni 2", "Burenga toni 24", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Burenga toni 12",
    questionEn: "A sign showing maximum speed a vehicle must not exceed is placed only on vehicles with the following maximum weight:",
    correctAnswerEn: "Over 12 tons",
    licenseClass: LICENSE.C
  },
  {
    question: "Ahatari mu nsisiro umuvuduko ntarengwa mu isaha wa velomoteri ni:",
    options: ["Km50", "Km40", "Km30", "Nta gisubizo cy'ukuri"],
    correctAnswer: "Km50",
    questionEn: "Outside urban areas, the maximum speed per hour for motorcycles is:",
    correctAnswerEn: "Km50",
    licenseClass: LICENSE.A
  },
  {
    question: "Umuyobozi ugenda mu muhanda igihe ubugari bwawo budatuma anyuranaho nta nkomyi ashobora kunyura mu kayira k'abanyamaguru aruko amaze kureba ibi bikurikira:",
    options: ["Umuvuduko w'abanyamaguru", "Ubugari bw'umuhanda", "Umubare w'abanyamaguru", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Ibisubizo byose nibyo",
    questionEn: "A driver whose vehicle width prevents overtaking without danger may enter a pedestrian lane only after checking the following:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ku byerekeye kwerekana ibinyabiziga n'ukumurika kwabyo ndetse no kwerekana ihindura ry'ibyerekezo byabyo. Birabujjiwe gukoresha andi matara cyangwa utugarurarumuri uretse ibitegetswe ariko ntibireba amatara akurikira:",
    options: ["Amatara ndanga", "Amatara ari imbere mu modoka", "Amatara ndangaburambarare", "Ibisubizo byose nibyo"],
    correctAnswer: "Amatara ari imbere mu modoka",
    questionEn: "Regarding vehicle identification, visibility, and indicating direction changes. It is forbidden to use other lights or reflectors than the prescribed ones except for the following lights:",
    correctAnswerEn: "Lights located at the front of the car",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko umuvuduko ntarengwa w'amapikipiki mu isaha ni:",
    options: ["Km25", "Km70", "Km40", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Km70",
    questionEn: "Unless otherwise regulated by specific rules, the maximum speed for motorcycles per hour is:",
    correctAnswerEn: "Km70",
    licenseClass: LICENSE.A
  },
  {
    question: "Uburyo bukoreshwa kugirango ikinyabiziga kigende gahoro igihe feri idakora neza babwita:",
    options: ["Feri y'urugendo", "Feri yo guhagarara umwanya munini", "Feri yo gutabara", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Feri yo gutabara",
    questionEn: "The method used to make a vehicle move slowly when the brake does not work properly is called:",
    correctAnswerEn: "Emergency / engine braking",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Nibura ikinyabiziga gitegetswe kugira uduhanagurakirahure tungahe:",
    options: ["2", "3", "1", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "1",
    questionEn: "Every vehicle must have at least how many windscreen wipers:",
    correctAnswerEn: "1",
    licenseClass: LICENSE.B
  },
  {
    question: "Amatara maremare y'ikinyabiziga agomba kuzimwa mu bihe bikurikira:",
    options: ["Iyo unuhanda umurikiye umuyobozi abasha kureba muri metero 200", "Iyo ikinyabiziga kigiye kubisikana n'ibindi", "Iyo ari mu nsisiro", "Ibisubizo byose ni ukuri"],
    correctAnswer: "Ibisubizo byose ni ukuri",
    questionEn: "The full beam headlights of a vehicle must be turned off in the following circumstances:",
    correctAnswerEn: "All of the above are true",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ikinyabiziga nigishobora kugira amatara arenga abiri y'ubwoko bunwe keretse kubyerekeye amatara akurikira:",
    options: ["Itara ndangamubyimba", "Itara ryerekana icyerekezo", "Itara ndangaburumbarare", "Ibisubizo byose ni ukuri"],
    correctAnswer: "Ibisubizo byose ni ukuri",
    questionEn: "A vehicle may have more than two lights of the same type except for the following lights:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ubugari bwa romoruki ikuruwe n'igare cyangwa velomoteri ntiburenza ibipimo bikurikira:",
    options: ["cm25", "cm125", "cm45", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "cm125",
    questionEn: "The width of a trolley pulled by a bicycle or motorcycle must not exceed the following measurement:",
    correctAnswerEn: "cm125",
    licenseClass: LICENSE.AE
  },
  {
    question: "Ibinyabiziga bikoreshwa nka tagisi, bitegerereza abantu mu nzira nyabagendwa, bishobora gushyirwaho itara ryerekana ko ikinyabiziga kitakodeshejwe. Iryo tara rishyirwaho ku buryo bukurikira:",
    options: ["Ni itara ry'icyatsi rishyirwa imbere ku kinyabiziga", "Ni itara ry'icyatsi rishyirwa ibumoso", "Ni itara ry'umuhondo rishyirwa inyuma", "A na C ni ibisubizo by'ukuri"],
    correctAnswer: "A na C ni ibisubizo by'ukuri",
    questionEn: "Vehicles used as taxis, carrying people on roads, may be fitted with a light indicating the vehicle is not occupied. That light is placed in the following manner:",
    correctAnswerEn: "Both A and C are correct answers",
    licenseClass: LICENSE.D
  }
];

// ---------- quizData1 (27 questions) ----------
const quizData1 = [
  {
    question: "Iyo umuvuduko w'ibinyabiziga bidapakiye ushobora kurenga km50 mu isaha ahategamye, bigomba kuba bifite ibikoresho by'ihoni byumvikanira mu ntera:",
    options: ["Metero 100", "Metero 200", "Metero 50", "Metero 150"],
    correctAnswer: "Metero 50",
    questionEn: "If the speed of unladen vehicles can exceed 50 km/h when designed, they must have audible horn devices audible at a distance of:",
    correctAnswerEn: "Meter 50",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Birabujjiwe kugenza ibinyabiziga bigendeshwa na moteri naza romoruki zikururwa nabyo, iyo ibiziga byambaye inziga zidahagwa cyangwa inziga zikururuka zifite umubyimba uri hasi ya cm 4. Ariko ibyo ntibikurikizwa kubinyabiziga bikurikira:",
    options: [
      "Ku binyabiziga by'ingabo bijya ahatarenga km25",
      "Ibinyabiziga bihinga",
      "Ibinyabiziga bya police",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Ibisubizo byose ni ukuri",
    questionEn: "It is forbidden to drive motor vehicles and their towed trolleys if tires are bald or have tread depth less than 4 cm. However, this does not apply to the following vehicles:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Igice cy'inzira nyabagendwa kigarukira ku mirongo ibiri yera icagaguye ibangikanye kandi gifite ubugari budahagije kugirango imodoka zitambuke neza, kiba ari:",
    options: [
      "Ahanyurwa n'amagare na velomoteri",
      "Ahanyurwa n'ingorofani",
      "Ahanyurwa n'ibinyamitende",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Ahanyurwa n'ibinyamitende",
    questionEn: "The part of the carriageway bordered by two solid white lines close together and having width not sufficient for cars to pass properly is:",
    correctAnswerEn: "Where bicycles pass",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ubugari bwa romoruki ntiburenza ubugari bw'ikinyabiziga kiyikurura iyo ikuruwe n'ibinyabiziga bikurikira:",
    options: [
      "Igare",
      "Velomoteri",
      "Ipikipiki ifite akanyabiziga kometse ku ruhande rwayo",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Ipikipiki ifite akanyabiziga kometse ku ruhande rwayo",
    questionEn: "The width of a trolley must not exceed the width of the towing vehicle when towed by the following vehicles:",
    correctAnswerEn: "A motorcycle with a sidecar attached to its side",
    licenseClass: LICENSE.A
  },
  {
    question: "Iyo hatarimo indi myanya birabujijwe gutwara ku niebe y'imbere y'imodoka abana badafite inyaka:",
    options: [
      "Inyaka 10",
      "Inyaka 12",
      "Inyaka 7",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Inyaka 12",
    questionEn: "If there is no other option, it is forbidden to carry children under the following age on the front seat of a car:",
    correctAnswerEn: "12 years",
    licenseClass: LICENSE.B
  },
  {
    question: "Icyapa kivuga gutambuka mbere y'ibinyabiziga biturutse imbere gifite amabara akurikira:",
    options: [
      "Ubuso ni umweru",
      "Ikirango ni umutuku n'umukara",
      "Ikirango ni umweru n'umukara",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Ikirango ni umweru n'umukara",
    questionEn: "The sign meaning 'give way to vehicles coming from the front' has the following colors:",
    correctAnswerEn: "The border is white and black",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ni rvari itegeko rigenga gutambuka mbere kw'iburyo rikurikizwa mu masangano:",
    options: [
      "Iyo nta cyapa cyo gutambuka mbere gihari",
      "Iyo ikimenyetso kimurika cyagenewe ibinyabiziga kidakora",
      "A na B ni ibisubizo by'ukuri",
      "Nta gisubizo cy'ukuri"
    ],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "The general rule of giving way to the right is followed at intersections in the following circumstances:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibimenyetso bimurika byerekana uburyo bwo kugendera mu munanda kw'ibinyabiziga bishyirwa iburyo bw'umuhanda. Ariko bishobora no gushyirwa ibumoso cyangwa hejuru y'umuhanda:",
    options: [
      "Hakurikijwe icyerekezo abagenzi bireba baganamo",
      "Hakurikijwe icyo ibyo bimenyetso bigamije kwerekana",
      "Kugirango birusheho kugaragara neza",
      "Ibisubizo byose ni ukuri"
    ],
    correctAnswer: "Kugirango birusheho kugaragara neza",
    questionEn: "Road signs indicating the direction of vehicle movement are placed on the right side of the road. However, they may also be placed on the left side or above the road:",
    correctAnswerEn: "So that they can be clearly seen",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo tiara ry'umuhondo rimyatsa rikoreshejwe mu masangano y'amayira ahwanyije agaciro rishyirwa ahagana he:",
    options: [
      "Kuri buri nzira",
      "Hagati y'amasangano",
      "Iburyo bw'amasangano",
      "A na B ni ibisubizo by'ukuri"
    ],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "When a flashing amber light is used at crossroads with traffic lights, where is it placed:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Inkombe z'inzira nyabagendwa cyangwa z'umuhanda zishobora kugaragazwa n'ibikoresho ngarurarumuri. Ibyo bikoresho bigomba gushyirwaho ku buryo abagenzi babibona:",
    options: [
      "Babona gusa ibumoso bwabo iby'ibara ritukura",
      "Iburyo babona iby'ibara risa n'icunga rihishije gusa",
      "Babona iby'ibara ry'umuhondo ibumoso",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Road edges or kerbs may be indicated by reflective devices. These devices must be placed so that travelers see them:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibinyabiziga bikurikira bigomba gukorerwa isuzumwa rimwe mu mezi 6:",
    options: [
      "Ibinyabiziga bitwara abagenzi muri rusange",
      "Ibinyabiziga bigenewe gutwara ibintu birengeje toni 3.5",
      "Ibinyabiziga bigenewe kwigisha gutwara",
      "Ibisubizo byose ni ukuri"
    ],
    correctAnswer: "Ibisubizo byose ni ukuri",
    questionEn: "The following vehicles must be inspected once every 6 months:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.CDE
  },
  {
    question: "Iyo kuyobya umuhanda ari ngombwa bigaragazwa kuva aho uhera no kuburebure bwawo n'icyapa gifite ubuso bw'amabara akurikira:",
    options: [
      "Ubururu",
      "Umweru",
      "Umutuku",
      "Nta gisubizo cy'ukuri"
    ],
    correctAnswer: "Ubururu",
    questionEn: "When road works are necessary, they are indicated from start to end of the works by a sign having the following background color:",
    correctAnswerEn: "Blue",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ku mihanda ibyapa bikurikira bigomba kugaragazwa ku buryo bumwe:",
    options: [
      "Ibyapa biyobora n'ibitegeka",
      "Ibyapa biburira n'ibitegeka",
      "Ibyapa bibuza n'ibitegeka",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Ibyapa bibuza n'ibitegeka",
    questionEn: "On roads the following signs must be displayed in the same way:",
    correctAnswerEn: "Warning signs and mandatory signs",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Uretse mu mujyi, ku yindi mihanda yagenwe na ministeri ushinzwe gutwara abantu n'ibintu, uburemere ntarengwa ku binyabiziga bifite imitambiko itatu cyangwa irenga hatarimo makuzungu ni:",
    options: [
      "Toni 10",
      "Toni 12",
      "Toni 16",
      "Toni 24"
    ],
    correctAnswer: "Toni 16",
    questionEn: "Except in urban areas, on other roads designated by the minister responsible for transport, the maximum weight for vehicles with three or more axles excluding trailers is:",
    correctAnswerEn: "Tons 16",
    licenseClass: LICENSE.C
  },
  {
    question: "Ni iyihe feri ituma imodoka igenda buhoro kandi igahagarara ku buryo bwizewe bubangutse kandi nyabwo, uko imodoka yaba yikoreye kose yaba igeze ahacurannye cyangwa ahaterera:",
    options: [
      "Feri y'urugendo",
      "Feri yo gutabara",
      "Feri yo guhagarara umwanya munini",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "Feri y'urugendo",
    questionEn: "Which brake makes the car go slowly and stop in a proper controlled manner, whether the car is going downhill or approaching a bend or obstacle:",
    correctAnswerEn: "Foot / service brake",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ubugari bw'imizigo yikorewe n'ibinyamitende itatu n'ubwiyikorewe n'ibinyamitende 4 bifite cyangwa bidafite moteri kimwe n'ubw'iyikorewe na romuruki zikuruwe n'ibyo binyabiziga ntibushobora kurenga ibipimo bikurikira:",
    options: [
      "cm 30 ku bugari bw'icyo kinyabiziga kidapakiye",
      "Ubugari ntarengwa budakuka ni metero 2 na sentimetero 50",
      "A na B ni ibisubizo by'ukuri",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "The width of loads carried by three-wheelers, four-wheelers with or without motors, and trolleys pulled by those vehicles must not exceed the following measurements:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Kunyura ku binyabiziga bindi, uretse icy'ibiziga bibiri, bibujijwe aha hakurikira:",
    options: [
      "Hafi y'iteme iyo hari umuhanda ufunganye",
      "Hafi y'aho abanyamaguru banyakra",
      "Hafi y'ibice by'umuhanda bimeze nabi",
      "Ibi bisubizo byose ni ukuri"
    ],
    correctAnswer: "Ibi bisubizo byose ni ukuri",
    questionEn: "Overtaking other vehicles, except for two-wheelers, is prohibited in the following places:",
    correctAnswerEn: "All of these answers are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko, umuvuduko ntarengwa ku modoka zitwara abagenzi mu buryo bwa rusange ni:",
    options: [
      "Km 60 mu isaha",
      "Km 40 mu isaha",
      "Km 25 mu isaha",
      "Km20 mu isaha"
    ],
    correctAnswer: "Km 60 mu isaha",
    questionEn: "Unless otherwise regulated by specific rules, the maximum speed for cars carrying passengers in general is:",
    correctAnswerEn: "60 km per hour",
    licenseClass: LICENSE.BD
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko, umuvuduko ntarengwa ku modoka zikoreshwa nk'amavatiri y'ifasi cyangwa amatagisi zifite uburemere bwemewe butarenga kilogramna 3500 ni:",
    options: [
      "Km 60 mu isaha",
      "Km 40 mu isaha",
      "Km 75 mu isaha",
      "Km20 mu isaha"
    ],
    correctAnswer: "Km 75 mu isaha",
    questionEn: "Unless otherwise regulated by specific rules, the maximum speed for vehicles used as private cars or taxis with approved weight not exceeding 3500 kilograms is:",
    correctAnswerEn: "75 km per hour",
    licenseClass: LICENSE.BD
  },
  {
    question: "Ikinyabiziga kibujjiwe guhagarara akanya kanini aha hakurikira:",
    options: [
      "Imbere y'ahantu hinjirwa hakasohokerwa n'ahantu benshi",
      "Mu muhanda aho ugabanyijemo ibisate bigaragazwa n'imirongo idacagaguye",
      "A na B ni ibisubizo by'ukuri",
      "Nta gisubizo cy'ukuri kirimo"
    ],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "A vehicle is prohibited from stopping for a long time in the following places:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  }
];

// ---------- quizData2 (36 questions) ----------
const quizData2 = [
  {
    question: "Ikinyabiziga cyose cyangwa ibinyabiziga bigenda bigomba kugira:",
    options: ["Umuyobozi", "Untuherekeza", "A na B ni ibisubizo by'ukuri", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Umuyobozi",
    questionEn: "Every vehicle or moving traffic must have:",
    correctAnswerEn: "A driver",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ijambo 'akayira' biyuga inzira nyabagendwa ifunganye yagenewe gusa:",
    options: ["Abanyamaguru", "Ibinyabiziga bigendera ku biziga bibiri", "A na B ni ibisubizo by'ukuri", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "The word 'lane' refers to a separate part of the road designated only for:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umurongo uciyemo uduce umenyesha ahegereye umurongo ushobora kuzuzwa n'uturanga gukata tw'ibara rycra utwo turanga eyerekezo tumenyesha:",
    options: ["Igisate cy'umuhanda abayobozi bagomba gukurikira", "Ahegereye umurongo ukomeje", "Igabanurwa ry'umubare w'ibisate by'umuhanda mu eyerekezo bajyamo", "A na C nibyo"],
    correctAnswer: "A na C nibyo",
    questionEn: "The line consisting of short dashes indicates where lines can be crossed; broken directional lines indicate:",
    correctAnswerEn: "Both A and C are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ahantu ho kugendera mu munanda herekanwa n'ibimenyetso bimurika ibinyabiziga ntibishobora kuhagenda:",
    options: ["Biteganye", "Ku murongo umwe", "A na B nibyo", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B nibyo",
    questionEn: "Where traffic flow is indicated by traffic signs, vehicles must travel:",
    correctAnswerEn: "Both A and B are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Uburemere ntarengwa bwemewe ntibushobora kurenga $\\frac{1}{2}$ cy'uburemere bw'ikinyabiziga gikurura nubw'umuyobozi kuri romoruki zikurikira:",
    options: ["Romoruki ifite feri y'urugendo", "Romoruki idafite feri y'urugendo", "Romoruki itarenza kg 750", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Romoruki idafite feri y'urugendo",
    questionEn: "The approved maximum weight must not exceed 1/2 of the weight of the towing vehicle and its driver for the following trolleys:",
    correctAnswerEn: "Trolley without a service brake",
    licenseClass: LICENSE.E
  },
  {
    question: "Ibinyabiziga bifite ubugari bufite ibipimo bikurikira bigomba kugira amatara ndangaburumbarare:",
    options: ["Metero 2 na cm 10", "Metero 2 na cm 50", "Metero 3", "Metero 2"],
    correctAnswer: "Metero 2 na cm 10",
    questionEn: "Vehicles with the following width must have side marker lights:",
    correctAnswerEn: "Meters 2 and cm 10",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Nta tara na rimwe cyangwa akagarurarumuri bishobora kuba bifunze umwanya munini kandi ngo habeho kubangamira abandi bakoresha umuhanda keretse ibi bikurikira:",
    options: ["Amatara ndanga", "Amatara y'inyuma", "Amatara ndangaburumbarare", "Amatara yo guhagarara"],
    correctAnswer: "Amatara yo guhagarara",
    questionEn: "No light or reflector may partially obscure and inconvenience other road users except for the following:",
    correctAnswerEn: "Parking lights",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo kuva bwije kugeza bukeye cyangwa bitewe nuko ibihe bimeze nk'igihe cy'igihu cyangwa cy'imvura bitagishoboka kubona neza muri m 200, imirongo y'ingabo z'igihugu zigendera kuri gahunda n'utundi dutsiko twose tw'abanyamaguru nk'imperekerane cyangwa udutsiko tw'abanyeshuri bari ku murongo bayobowe na mwarimu, iyo bagenda mu muhanda ku isonga hakaba hari abantu barenze umwe, bagaragzwa ku buryo bukurikira:",
    options: ["Imbere ni itara ryera ritwariwe ku ruhande rw'ibumoso n'umuntu uri ku murongo w'imbere hafi y'umurongo ugabanya umuhanda mo kabiri", "Inyuma ni itara umuhondo ritwariwe ku ruhande rw'ibumoso n'umuntu uheruka umuntu uri ku murongo w'inyuma", "A na B nibyo", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B nibyo",
    questionEn: "From dawn to dusk or when visibility is less than 200m due to fog or rain, military processions and all pedestrian groups like pilgrims or schoolchildren in procession led by a teacher, when walking on the road with more than one person, are marked as follows:",
    correctAnswerEn: "Both A and B are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi ahetse umuntu ku kinyabiziga atwaye, agomba kuba yujuje ibi bikurikira:",
    options: ["Kuba afite nibura imyaka 18", "Kuba afite nibura imyaka 16", "Kuba afite nibura imyaka 20", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Kuba afite nibura imyaka 18",
    questionEn: "When a driver allows another person to drive their vehicle, that person must have reached the following age:",
    correctAnswerEn: "Must be at least 18 years old",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi ageze mu ikorosi, agomba kugenda yitonze kandi:",
    options: ["Akagendera mu muhanda hagati", "Akagendera mu ruhande rw'iburyo bw'umuhanda", "Akagendera mu ruhande rw'ibumoso bw'umuhanda", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Akagendera mu ruhande rw'iburyo bw'umuhanda",
    questionEn: "When a driver reaches a corner / curve, they must drive slowly and:",
    correctAnswerEn: "Drive on the right side of the road",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guhagarara ahantu hatemewe agomba kubanza gukora ibi bikurikira:",
    options: ["Kureba ko nta kinyabiziga kimuturutse inyuma", "Kureba ko nta kinyabiziga kimuturutse imbere", "Kureba ko nta kinyabiziga kimuturutse imbere cyangwa inyuma", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Kureba ko nta kinyabiziga kimuturutse imbere cyangwa inyuma",
    questionEn: "When a driver intends to stop at a designated place, they must first do the following:",
    correctAnswerEn: "Check that no vehicle is coming from ahead or behind",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guparika ikinyabiziga cye mu muhanda, agomba kugiparika ate?",
    options: ["Amaze gusiga nibura umwanya wa metero 1 hagati y'ikinyabiziga cye n'ibindi binyabiziga", "Amaze gusiga nibura umwanya wa metero 0.5 hagati y'ikinyabiziga cye n'ibindi binyabiziga", "Amaze gusiga nibura umwanya wa metero 2 hagati y'ikinyabiziga cye n'ibindi binyabiziga", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Amaze gusiga nibura umwanya wa metero 0.5 hagati y'ikinyabiziga cye n'ibindi binyabiziga",
    questionEn: "When a driver intends to park their vehicle on the road, how must they park it?",
    correctAnswerEn: "Leaving at least 0.5 meters space between their vehicle and other vehicles",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guhindura inzira aganamo, agomba kubanza gukora ibi bikurikira:",
    options: ["Kureba ko nta kinyabiziga kimuturutse inyuma", "Kureba ko nta kinyabiziga kimuturutse imbere", "Kureba ko nta kinyabiziga kimuturutse imbere cyangwa inyuma", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "Kureba ko nta kinyabiziga kimuturutse inyuma",
    questionEn: "When a driver intends to change lanes in their direction, they must first do the following:",
    correctAnswerEn: "Check that no vehicle is coming from behind",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi ageze mu ikorosi ry'umuhanda, agomba kugenda ku muvuduko mwinshi cyane:",
    options: ["Nibyo", "Sibyo"],
    correctAnswer: "Sibyo",
    questionEn: "When a driver reaches a road curve, they must drive at a very high speed:",
    correctAnswerEn: "No (False)",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuntu ageze mu ikorosi ry'umuhanda, agomba kugenda yitonze cyane:",
    options: ["Nibyo", "Sibyo"],
    correctAnswer: "Nibyo",
    questionEn: "When a person reaches a road curve, they must drive very slowly:",
    correctAnswerEn: "Yes (True)",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guhagarara mu muhanda, agomba kubanza gushyira amatara yo guhagarara:",
    options: ["Nibyo", "Sibyo"],
    correctAnswer: "Nibyo",
    questionEn: "When a driver intends to stop on the road, they must first turn on the stopping signal lights:",
    correctAnswerEn: "Yes (True)",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guparika ikinyabiziga cye mu muhanda, agomba kubanza gushyira amatara yo guhagarara:",
    options: ["Nibyo", "Sibyo"],
    correctAnswer: "Nibyo",
    questionEn: "When a driver intends to park their vehicle on the road, they must first turn on the stopping signal lights:",
    correctAnswerEn: "Yes (True)",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo umuyobozi atekereza guhindura inzira aganamo, agomba kubanza gushyira amatara ndanga:",
    options: ["Nibyo", "Sibyo"],
    correctAnswer: "Nibyo",
    questionEn: "When a driver intends to change direction lanes, they must first activate the indicator / turn signals:",
    correctAnswerEn: "Yes (True)",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mijyi ni:",
    options: ["60 km/h", "40 km/h", "50 km/h", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "40 km/h",
    questionEn: "The maximum speed for vehicles carrying both people and goods in urban areas / cities is:",
    correctAnswerEn: "40 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu muhanda munini ni:",
    options: ["80 km/h", "90 km/h", "100 km/h", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "80 km/h",
    questionEn: "The maximum speed for vehicles carrying both people and goods on main roads / highways is:",
    correctAnswerEn: "80 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda yo mu cyaro ni:",
    options: ["70 km/h", "80 km/h", "90 km/h", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "70 km/h",
    questionEn: "The maximum speed for vehicles carrying both people and goods on rural / district roads is:",
    correctAnswerEn: "70 km/h",
    licenseClass: LICENSE.BCD
  }
];

// ---------- quizData3 (21 questions) ----------
const quizData3 = [
  {
    question: "Guhagarara akanya gato no guhagarara akanya kanini bibujijwe cyane cyane aha hakurikira:",
    options: ["ku mihanda y'icyerekezo kimwe hose", "mu ruhande ruteganye n'urwo ikindi kinyabiziga gihagazemo akanya gato cyangwa kanini", "ku mihanda ibisikanirwamo, iyo ubugari bw'umwanya w'ibinyabiziga ugomba gutuma bibisikana butagifite m12", "ibisubizo byose nibyo"],
    correctAnswer: "ibisubizo byose nibyo",
    questionEn: "Short-term and long-term parking are especially prohibited in the following places:",
    correctAnswerEn: "All of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Amatara ndangambere n'aya ndanganyuma y'imodoka zitarengeje m 6 z'uburebure na m 2 z'ubugari habariwemo imitwaro kdi nta kinyabiziga kindi kiziritseho ashobora gusimburwa n'amatara akurikira, iyo ibyo binyabiziga bihagaze umwanya muto cyangwa munini mu nsisiro bibangikanye ku ruhande rw'umuhanda:",
    options: ["amatara magufi", "amatara ndangaburumbarare", "amatara yo guhagarara umwanya munini", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "amatara yo guhagarara umwanya munini",
    questionEn: "Front and rear position lights of cars not exceeding 6m length and 2m width, including load, and with no other vehicle following may be replaced by the following lights, when those vehicles are parked short or long term in urban areas close to the side of the road:",
    correctAnswerEn: "Parking / marker lights",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo kuva bwije kugeza bukeye cyangwa bitewe nuko ibihe bimeze nk'igihe cy'igihu cyangwa cy'imvura bitagishoboka kubona neza muri m 200, imirongo y'ingabo z'igihugu zigendera kuri gahunda n'utundi dutsiko twose tw'abanyamaguru nk'imperekerane cyangwa udutsiko tw'abanyeshuri bari ku murongo bayobowe na mwarimu, iyo bagenda mu muhanda ku isonga hakaba hari abantu barenze umwe, bagaragzwa ku buryo bukurikira:",
    options: ["imbere ni itara ryera ritwariwe ku ruhande rw'ibumoso n'umuntu uri ku murongo w'imbere hafi y'umurongo ugabanya umuhanda mo kabiri", "inyuma ni itara umuhondo ritwariwe ku ruhande rw'ibumoso n'umuntu uri ku murongo w'inyuma hafi y'umurongo ugabanya umuhanda mo kabiri", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "From dawn to dusk or due to weather like fog/rain making visibility less than 200m, military columns and all pedestrian groups such as pilgrims or schoolchildren in procession led by a teacher, when walking on the road with more than one person, shall be marked in the following way:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Imizigo yikorewe n'amagare, velomoteri, amapikipiki, ibinyamitende by'ibiziga bitatu nibyo ibiziga bine bifite cyangwa bidafite moteri inyuma ntishobora kurenza ibipimo bikurikira:",
    options: ["cm 20", "cm 30", "cm 50", "cm 60"],
    correctAnswer: "cm 30",
    questionEn: "Loads overhanging to the rear of cars, motorcycles, mopeds, three-wheelers and four-wheelers with or without motors must not exceed the following measurements:",
    correctAnswerEn: "cm 30",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Itara ndanganyuma rigomba gushyirwa aha hakurikira:",
    options: ["ahagereye inguni y'ibumoso y'ikinyabiziga", "ahagereye inguni y'iburyo bw'ikinyabiziga", "inyuma kandi y'impera y'ibumoso bw'ikinyabiziga", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "inyuma kandi y'impera y'ibumoso bw'ikinyabiziga",
    questionEn: "The rear position light must be placed in the following location:",
    correctAnswerEn: "At the rear and on the left edge of the vehicle",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Nta tara na rimwe cyangwa utugarurarumuri bishobora kuba bifunze kuburyo igice cyabyo cyo hasi cyane kimurika kitaba kiri hasi ya cm 40 kuva ku butaka igihe ikinyabiziga kidapakiye ariko ibyo ntibikurikizwa ku matara akurikira:",
    options: ["amatara kamenabihu", "amatara yo gusubira inyuma", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "No light or reflector may be positioned such that its lowest visible part is less than 40 cm from the ground when the vehicle is unladen, but this does not apply to the following lights:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo tumuritswe n'amatara y'urugendo $y^{\\prime}i$ kinyabiziga utugarurarumuri tugomba n'ijoro, igihe ijuru rikeye kubonwa n'umuyobozi w'ikinyabiziga kiri mu ntera ikurikira:",
    options: ["metero 100", "metero 150", "metero 200", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "metero 150",
    questionEn: "When lit by a vehicle's driving lights and reflectors, at night when it is dark, it must be visible to the driver at the following distance:",
    correctAnswerEn: "meter 150",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibinyabiziga bigendeshwa na moteri, hatarimo velomoteri n'ibinyabiziga bidapakiye umuvuduko wabyo udashobora kurenga km 50 mu isaha ahateganye bigomba kuba bifite ibikoresho by'ihoni byumvikanira mu ntera ikurikira:",
    options: ["metero 200", "metero 150", "metero 100", "metero 50"],
    correctAnswer: "metero 100",
    questionEn: "Motor vehicles, except motorcycles and unladen vehicles whose speed cannot exceed 50 km/h when designed, must have audible horn devices audible at the following distance:",
    correctAnswerEn: "meter 100",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Ahatari mu nsisiro ibyapa biburira n'ibyapa byo gutambuka mbere bigomba gushyirwa mu ntera ikurikira y'ahantu habyerekana:",
    options: ["metero 150 kugeza kuri 200", "metero 100 kugeza kuri 150", "metero 50 kugeza kuri 100", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "metero 150 kugeza kuri 200",
    questionEn: "Outside urban areas, warning signs and 'give way' signs must be placed at the following distance from the point they indicate:",
    correctAnswerEn: "from meter 150 to 200",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Inkombe z'inzira nyabagendwa cyangwa z'umuhanda zishobora kugaragazwa n'ibikoresho ngarurarumuri. Ibyo bikoresho bigomba gushyirwaho ku buryo abagenzi babibona ku buryo bukurikira:",
    options: ["babona iburyo bwabo ibyibara ritukura cyangwa ibisa n'icunga rihishije", "ibumoso babona iby'ibara ryera", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Carriageway or road edges may be indicated by reflective devices. These devices must be placed so that travelers see them in the following way:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ahatari mu nsisiro, umuyobozi wese ugenza ikinyabiziga kimwe cyangwa ibinyabiziga bikomatanye bifite uburemere ntarengwa bwemewe burenga ibiro 3500 cyangwa bifite uburebure bwite burenga metero 10 agomba, keretse iyo anyuze cyangwa agiye kunyura ku bindi binyabiziga, gusiga hagati y'ikinyabiziga cye n'iki muri imbere umwanya uhagije kugirango ibinyabiziga bimuhiseho bishobore kuhigobeka bidateje impanuka igihe bibaye ngombwa ariko ibyo ntibikurikizwa mu bihe bikurikira:",
    options: ["mu gihe ibigendera mu muhanda ari byinshi kimwe no mu duce tw'inzira nyabagendwa aho kunyuranaho bibujijwe", "igihe ibigendera mu muhanda ari byinshi", "mu duce tw'inzira nyabagendwa aho kunyuranaho bibujijwe", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "mu gihe ibigendera mu muhanda ari byinshi kimwe no mu duce tw'inzira nyabagendwa aho kunyuranaho bibujijwe",
    questionEn: "Outside urban areas, every driver of a single vehicle or combination of vehicles with approved gross weight over 3500 kg or overall length over 10m must, except when turning or about to overtake other vehicles, leave enough space between their vehicle and the one ahead so that overtaking vehicles can pull in without danger when necessary. However, this does not apply in the following circumstances:",
    correctAnswerEn: "When there is heavy traffic both in general and at sections of the road where overtaking is prohibited",
    licenseClass: LICENSE.CDE
  },
  {
    question: "Amatara ndangacyerekezo agomba kuba agizwe n'ibintu bifashe ku rumuri rumyasa, biringaniye ku buryo bigira umubare utari igiharwe ku mpande z'imbere n'inyuma z'ikinyabiziga ayo matara aba afite amabara akurikira:",
    options: ["amatara y'imbere aba yera cyangwa ari umuhondo", "ayinyuma aba atukura cyangwa asa n'icunga rihishije", "A na B ni ibisubizo by'ukuri", "ayinyuma aba asa n'icunga rihishije"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Direction indicator lights must be made of light-transmitting materials, symmetrical so as not to be odd in number on the front and rear sides of the vehicle; those lights shall have the following colors:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Amahoni y'ibinyabiziga bigendeshwa na moteri agomba kohereza ijwi ry'injyana imwe rikomeza kandi ridacengera amatwi ariko ibinyabiziga bikurikira bishobora kugira ihoni ridasanzwe ridahuye n'ibivuzwe haruguru:",
    options: ["ibinyabiziga ndakumirwa", "ibinyabiziga bikora ku mihanda", "ibinyabiziga bifite ubugari burenze m 2.10", "A na B ni ibisubizo by'ukuri"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Horns of motor vehicles must produce a uniform continuous tone that is not ear-piercing, but the following vehicles may have a special horn different from what is mentioned above:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.E
  },
  {
    question: "Icyapa kibuza kunyura kubindi binyabiziga byose uretse ibinyamitende ibiri n'amapikipiki adafite akanyabiziga ku ruhande gifite ibimenyetso by'amabara akurikira:",
    options: ["umweru n'umukara", "umutuku n'umukara", "ubururu", "A na B ni ibisubizo by'ukuri"],
    correctAnswer: "umutuku n'umukara",
    questionEn: "The sign prohibiting overtaking by all vehicles except two-wheel bicycles and motorcycles without a sidecar has markings of the following colors:",
    correctAnswerEn: "red and black",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa kivuga ko hatanyurwa mu byerekezo byombi kirangwa n'ubuso bw'ibara rikurikira:",
    options: ["umukara", "umweru", "ubururu", "umutuku"],
    correctAnswer: "umweru",
    questionEn: "The sign meaning 'no entry in both directions' is surrounded by a background of the following color:",
    correctAnswerEn: "white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibinyabiziga bikurikira bigomba kugira ibikoresho by'ihoni byumvikanira mu ntera ya m 20:",
    options: ["amapikipiki", "velomoteri", "ibinyabiziga bigendeshwa na moteri bidapakiye", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "velomoteri",
    questionEn: "The following vehicles must have audible warning devices audible at a distance of 20 m:",
    correctAnswerEn: "motorcycles",
    licenseClass: LICENSE.A
  },
  {
    question: "Imirongo y'ingabo z'igihugu zigendera kuri gahunda n'utundi dutsiko twose tw'abanyamaguru nk'imperekerane cyangwa udutsiko tw'abanyeshuri iyo bitagishoboka kubona neza muri m200, bagaragazwa ni itara ryera imbere naho inyuma ni itara ry'umutuku ariko iyo uburebure bwiyo mirongo cyangwa bw'utwo dutsiko burenga m6 impande zatwo cyangwa zayo zigaragazwa ku buryo bukurikira:",
    options: ["itara rimwe cyangwa menshi yera", "amatara menshi y'umuhondo", "amatara menshi asa n'icunga rihishije", "ibisubizo byose nibyo"],
    correctAnswer: "ibisubizo byose nibyo",
    questionEn: "Military columns and all groups of pedestrians such as pilgrims or groups of schoolchildren, when visibility is less than 200m, are marked with a white light at the front and a red light at the rear, but when the length of that column or group exceeds 6m, its two sides or groups are marked in the following way:",
    correctAnswerEn: "all of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Amatara ndangambere na ndanganyuma y'imodoka zitarengeje m 6 z'uburebure na m 2 z'ubugari habariwemo imitwaro kandi nta kindi kinyabiziga kiziritseho ashobora gusimburwa n'amatara yo guhagarara umwanya munini iyo ibyo binyabiziga bihagaze umwanya muto cyangwa munini mu nsisiro bibangikanye ku ruhande rw'umuhanda. Ayo matara arangwa n'amabara akurikira:",
    options: ["umweru cyangwa umuhondo imbere", "umutuku cyangwa umuhondo inyuma", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Front and rear position lights of cars not exceeding 6m in length and 2m in width including load, and with no other vehicle following, may be replaced by parking lights when those vehicles are parked short or long term in urban areas close to the side of the road. Those lights are surrounded by the following colors:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Amatara ndangaburumbarare agomba kubonwa nijoro igihe ijuru rikeye n'umuyobozi w'ikinyabiziga kiri mu ntera ya:",
    options: ["m 50 nibura", "m 100", "m 150", "m 200 nibura"],
    correctAnswer: "m 200 nibura",
    questionEn: "Side marker lights must be visible at night when it is dark to the driver of a vehicle at a distance of:",
    correctAnswerEn: "at least m 200",
    licenseClass: LICENSE.CD
  },
  {
    question: "Uretse mu byerekeye imihanda iromboreje y'ibisate byinshi n'imihanda yimodoka igice $cy^{\\prime}$ kiri hakurya y'umurongo mugari wera ucibwa ku muhanda ngo ugaragaze inkombe mpimbano zawo kigenewe ibi bikurikira:",
    options: ["guhagararwamo umwanya muto gusa", "guhagararwamo umwanya munini gusa", "guhagararwamo umwanya muto n'umunini", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "guhagararwamo umwanya muto n'umunini",
    questionEn: "Except regarding multi-lane roads and car parks, the area to the right of the continuous yellow line marked on the road to indicate its outer boundaries is designated for the following:",
    correctAnswerEn: "both short-term and long-term parking",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ibimenyetso by'agateganyo bigizwe n'imitemeri y'ibara risa n'icunga rihishije bishobora gusimbura ibi bikurikira:",
    options: ["imirongo yera irombereje idacagaguye gusa", "imirongo yera irombereje idacagaguye n'icagaguye", "imirongo icagaguye n'idacagaguye ibangikanye", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "imirongo yera irombereje idacagaguye n'icagaguye",
    questionEn: "Temporary markings made of orange and white reflective cones can replace the following:",
    correctAnswerEn: "both broken and solid continuous white lines",
    licenseClass: LICENSE.ALL
  }
];

// ---------- quizData4 (35 questions) ----------
const quizData4 = [
  {
    question: "Iyo bitagishoboka kubona muri m 200 imodoka zikuruwe n'inyamaswa, ingorofani, inyamaswa zitwaye imizigo cyangwa zigenderwamo kimwe n'amatungo bigomba kurangwa na:",
    options: ["imbere ni itara ryera", "imbere ni itara ry'umuhondo cyangwa risa n'icunga rihishije", "inyuma ni itara rimwe ritukura", "ibisubizo byose ni ukuri"],
    correctAnswer: "ibisubizo byose ni ukuri",
    questionEn: "When visibility is less than 200m, vehicles drawn by animals, oxen, animals carrying loads or accompanied by herds must be accompanied by:",
    correctAnswerEn: "all of the above are correct",
    licenseClass: LICENSE.E
  },
  {
    question: "Uretse igihe hari amategeko yihariye akurikizwa muri ako karere ikinyabiziga cyose gihagaze umwanya muto cyangwa munini, iyo gihagaze mu mwanya wo kuruhande wagenewe abanyamaguru, kugirango bashobore kugenda batagombye kunyura mu muhanda, umuyobozi agombye kubasigira akayira gafite byibura ibipimo bikurikira by'ubugari:",
    options: ["m 1", "m 2", "m 0.5", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "m 1",
    questionEn: "Except when there are specific local rules in force in the area, every vehicle parked short or long term, when parked on the shoulder reserved for pedestrians, so that they can walk without having to enter the road, the driver must leave them a lane of at least the following width:",
    correctAnswerEn: "m 1",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ahantu hagenewe guhagararwamo n'imodoka nini zagenewe gutwara abantu cyirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating a place designated for parking by large buses designated for carrying people is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.D
  },
  {
    question: "Icyapa cyerekana ko hari ahantu hagenewe guhagarara imodoka za taxi gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["umutuku n'umweru", "ubururu n'umweru", "umukara n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a place designated for parking only taxi cars is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.D
  },
  {
    question: "Icyapa cyerekana ko hari inzira y'amagare gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a bus-only lane is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.D
  },
  {
    question: "Icyapa cyerekana ko hari inzira y'abanyamaguru gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a pedestrian-only lane is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari inzira y'amagare n'abanyamaguru gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a lane for buses and pedestrians only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari inzira z'ibinyabiziga bitwara abantu rusange gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a lane for public transport vehicles only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.D
  },
  {
    question: "Icyapa cyerekana ko inzira igenewe ibinyabiziga bimwe na bimwe gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating the lane is designated for certain specific vehicles only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko inzira igenewe amakamyo manini gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating the lane is designated for small motorcycles only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.A
  },
  {
    question: "Icyapa cyerekana ko inzira igenewe ibinyabiziga bitwara abantu bafite ubumuga gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating the lane is designated for vehicles carrying disabled people only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari umwanya wagenewe ibinyabiziga bihagarara iminota mike cyane kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a space reserved for very short-term parking (a few minutes only) is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari inzira yo kuruhande rw'umuhanda igenewe abanyamaguru gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a roadside lane reserved for pedestrians only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari inzira yo kuruhande rw'umuhanda igenewe abanyamaguru n'amagare gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a roadside lane reserved for pedestrians and buses only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana ko hari inzira yo kuruhande rw'umuhanda igenewe abantu bafite ubumuga gusa kirangwa n'ubuso bw'amabara akurikira:",
    options: ["ubururu n'umweru", "umukara n'umweru", "umutuku n'umweru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ubururu n'umweru",
    questionEn: "The sign indicating there is a roadside lane reserved for disabled people only is surrounded by the following background colors:",
    correctAnswerEn: "blue and white",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda yihariye ni:",
    options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"],
    correctAnswer: "80 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on national roads is:",
    correctAnswerEn: "80 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda ya gihugu ni:",
    options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"],
    correctAnswer: "100 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on highways / motorways is:",
    correctAnswerEn: "100 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda ya kabiri ni:",
    options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"],
    correctAnswer: "80 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on secondary / provincial roads is:",
    correctAnswerEn: "80 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda mito ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "60 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on minor / small roads is:",
    correctAnswerEn: "60 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'imigenderano ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "60 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on border / meeting point roads is:",
    correctAnswerEn: "60 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'amakaro ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "60 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on industrial zone roads is:",
    correctAnswerEn: "60 km/h",
    licenseClass: LICENSE.CD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'ubutaka ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "40 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on dirt / earthen roads is:",
    correctAnswerEn: "40 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'amabuye ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "40 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on stone / rocky roads is:",
    correctAnswerEn: "40 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'ibarizo ni:",
    options: ["40 km/h", "60 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "40 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on airport / aerodrome roads is:",
    correctAnswerEn: "40 km/h",
    licenseClass: LICENSE.BC
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mihanda y'imihanda ngenderwamo n'abanyamaguru ni:",
    options: ["20 km/h", "40 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "20 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on roads shared with pedestrians is:",
    correctAnswerEn: "20 km/h",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu masoko ni:",
    options: ["20 km/h", "40 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "20 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods in market areas is:",
    correctAnswerEn: "20 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu mahuriro y'imihanda ni:",
    options: ["20 km/h", "40 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "20 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods at road junctions / intersections is:",
    correctAnswerEn: "20 km/h",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu nzira z'ibinyabiziga bya rubanda ni:",
    options: ["20 km/h", "40 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "20 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on residential / community access roads is:",
    correctAnswerEn: "20 km/h",
    licenseClass: LICENSE.BCD
  },
  {
    question: "Umuvuduko ntarengwa w'ibinyabiziga bitwara abantu hamwe n'ibitwara ibintu mu nzira z'abanyamaguru ni:",
    options: ["20 km/h", "40 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "20 km/h",
    questionEn: "The maximum speed of vehicles carrying both passengers and goods on pedestrian walkways / zones is:",
    correctAnswerEn: "20 km/h",
    licenseClass: LICENSE.ALL
  }
];

// ---------- quizData5 (35 questions) - same as quizData4 structurally ----------
const quizData5 = JSON.parse(JSON.stringify(quizData4));

// ---------- quizData6 (33 questions) ----------
const quizData6 = [
  {
    question: "Itara ryo guhagarara ry'ibara ritukura rigomba kuba ridahumisha, kandi rigomba kugaragarira mu ntera ikurikira:",
    options: ["nijoro igihe ijuru rikeye nibura muri m 200", "ku manywa igihe cy'umucyo nibura muri m50", "nijoro nibura muri m 100 igihe ijuru rikeye", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "nijoro nibura muri m 100 igihe ijuru rikeye",
    questionEn: "The red stop light must not be dazzling, and must be visible at the following distance:",
    correctAnswerEn: "at night when it is dark, at least m 100",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Birabujijwe kongera ku mpande z'ikinyabiziga kigendeshwa na moteri cyangwa velomoteri ibi bikurikira:",
    options: ["imitako", "ibintu bifite imigongo cyangwa ibirenga ku mubyimba kandi bishobora gutera ibyago abandi bagenzi", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "It is prohibited to attach the following to the sides of a motor vehicle or motorcycle:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ikintu cyose cyatuma hahindurwa ibyanditswe bireba nyirikarita cyangwa ibiranga ikinyabiziga kigomba kumenyeshwa ibiro by'imisoro haba mu magambo cyangwa mu ibaruwa ishinganye. Ibyo bikorwa mu gihe kingana gute:",
    options: ["mu minsi 5", "mu minsi 8", "mu minsi 15", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "mu minsi 8",
    questionEn: "Any change to information written on the logbook or vehicle registration must be reported to the traffic office in writing or formal letter. This must be done within how many days:",
    correctAnswerEn: "within 8 days",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Kunyuranaho bikorerwa:",
    options: ["mu ruhande rw'iburyo gusa", "igihe cyose ni ibumoso", "iburyo iyo unyura ku nyamaswa", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "igihe cyose ni ibumoso",
    questionEn: "Overtaking is done:",
    correctAnswerEn: "always on the left side",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo ubugari bw'inzira nyabagendwa igenderwamo n'ibinyabiziga budahagije kugirango bibisikane nta nkomyi abagenzi bategetswe:",
    options: ["kunyura mu nzira z'impande z'abanyamaguru", "guhagarara aho bageze", "koroherana", "gukuraho inkomyi"],
    correctAnswer: "koroherana",
    questionEn: "When the width of the carriageway used by vehicles is insufficient for vehicles to pass without danger to oncoming travelers:",
    correctAnswerEn: "yield / give way to each other",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Umuyobozi ugenda mu muhanda igihe ubugari bwawo budatuma anyuranaho nta nkomyi ashobora kunyura mu kayira k'abanyamaguru ariko amaze kureba ibi bikurikira:",
    options: ["umuvuduko w'abanyamaguru", "ubugari bw'umuhanda", "umubare w'abanyamaguru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ibisubizo byose nibyo",
    questionEn: "A driver whose vehicle width prevents them from overtaking without danger may enter the pedestrian lane only after checking the following:",
    correctAnswerEn: "all of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Icyapa cyerekana umuvuduko ntarengwa ikinyabiziga kitagomba kurenza gishyirwa ku binyabiziga bifite uburebure ntarengwa bukurikira:",
    options: ["burenga toni 1", "burenga toni 2", "burenga toni 24", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "burenga toni 12",
    questionEn: "A sign showing the maximum speed a vehicle must not exceed is placed on vehicles with the following maximum weight:",
    correctAnswerEn: "over 12 tons",
    licenseClass: LICENSE.C
  },
  {
    question: "Iyo nta mategeko awugabanya by'umwihariko, umuvuduko ntarengwa w'amapikipiki mu isaha ni:",
    options: ["km 25", "km 70", "km 40", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "km 70",
    questionEn: "Unless otherwise specifically regulated, the maximum speed for motorcycles per hour is:",
    correctAnswerEn: "km 70",
    licenseClass: LICENSE.A
  },
  {
    question: "Ahatari mu nsisiro umuvuduko ntarengwa wa velomoteri mu isaha ni:",
    options: ["km 50", "km 40", "km 30", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "km 50",
    questionEn: "Outside urban areas, the maximum speed for motorcycles per hour is:",
    correctAnswerEn: "km 50",
    licenseClass: LICENSE.A
  },
  {
    question: "Birabujijwe guhagarara akanya kanini aha hakurikira:",
    options: ["mu duhanda tw'abanyamagare", "mu duhanda twagenewe velomoteri", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Long-term parking is prohibited in the following places:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Amatara maremare y'ikinyabiziga agomba kutamurika mu bihe bikurikira:",
    options: ["iyo umuhanda umurikiwe umuyobozi abasha kureba muri m 200", "iyo ikinyabiziga kigiye kubisikana nikindi", "iyo ari mu nsisiro", "ibisubizo byose nibyo"],
    correctAnswer: "ibisubizo byose nibyo",
    questionEn: "The full beam headlights of a vehicle must not be used in the following circumstances:",
    correctAnswerEn: "all of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ubugari bwa romoruki ikuruwe n'igare cyangwa velomoteri ntiburenza ibipimo bikurikira:",
    options: ["cm 25", "cm 125", "cm 45", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "cm 125",
    questionEn: "The width of a trolley pulled by a bicycle or motorcycle must not exceed:",
    correctAnswerEn: "cm 125",
    licenseClass: LICENSE.AE
  },
  {
    question: "Uburyo bukoreshwa kugirango ikinyabiziga kigende gahoro igihe feri idakora neza bwitwa:",
    options: ["feri y'urugendo", "feri yo guhagarara", "feri yo gutabara", "Nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "feri yo gutabara",
    questionEn: "The method used to make the vehicle move slowly when the service brake does not work properly is called:",
    correctAnswerEn: "emergency / engine braking",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Nta mwanya n'umwe feri ifungiraho ushobora kurekurana n'ibiziga keretse:",
    options: ["iyo bireba feri y'urugendo", "iyo kurekurana ari ibyakanya gato", "iyo bireba feri yo guhagarara umwanya munini, ubwo kurekurana bikaba bidashoboka bidakozwe n'umuyobozi", "byose ni ibisubizo by'ukuri"],
    correctAnswer: "byose ni ibisubizo by'ukuri",
    questionEn: "A brake pedal may have no part contacting the ground except:",
    correctAnswerEn: "all of the above are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Ikinyabiziga ntigishobora kugira amatara arenze abiri y'ubwoko bumwe keretse kubyerekeye amatara akurikira:",
    options: ["itara ndangamubyimba", "itara ryerekana icyerekezo", "itara ndangaburumbarare", "ibisubizo byose ni ukuri"],
    correctAnswer: "ibisubizo byose ni ukuri",
    questionEn: "A vehicle may not have more than two lights of the same type except for the following lights:",
    correctAnswerEn: "all of the above are correct",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Itara ndanganyuma rigomba gushyirwa aha hakurikira:",
    options: ["ku nguni y'iburyo y'ikinyabiziga", "ku gice cy'inyuma ku kinyabiziga", "ahegereye inguni y'ibumoso y'ikinyabiziga", "ibisubizo byose ni ukuri"],
    correctAnswer: "ahegereye inguni y'ibumoso y'ikinyabiziga",
    questionEn: "The rear position light must be placed in which of the following locations:",
    correctAnswerEn: "at the rear left corner of the vehicle",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Nibura ikinyabiziga gitegetswe kugira uduhanagurabirahuri dukurikira:",
    options: ["2", "3", "1", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "1",
    questionEn: "Every vehicle must have at least the following number of windscreen wipers:",
    correctAnswerEn: "1",
    licenseClass: LICENSE.B
  }
];

// Additional quizData6 questions from original - processed
const extraQuizData6 = [
  {
    question: "Ibiziga by'ibinyabiziga bigendeshwa na moteri n'ibya velomoteri kimwe n'ibya romoruki zabyo bigomba kuba byambaye inziga zihagwa zifite amano n'ubujyakuzimu butari munsi ya milimetero imwe ku migongo yabyo yose, n'ubudodo bwabyo ntibugire ahantu na hamwe bugaragara kdi ntibigire aho byacitse bikomeye mu mpande zabyo. Ariko ibyo ntibikurikizwa ku binyabiziga bikurikira:",
    options: ["ibinyabiziga bidapakiye kdi bitajya birenza umuvuduko wa km 25 mu isaha ahateganye", "ibinyabiziga bya police bijya ahatarenga km 25 uvuye aho biba", "A na B ni ibisubizo by'ukuri", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "A na B ni ibisubizo by'ukuri",
    questionEn: "Tires of motor vehicles, motorcycles and their trolleys must have proper tread depth of not less than 1 millimeter across their entire surface, and must not have cuts, exposed fabric or bulges on their sides. However, this does not apply to the following vehicles:",
    correctAnswerEn: "Both A and B are correct answers",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Birabujijwe kugenza ibinyabiziga bigendeshwa na moteri na za romoruki zikururwa nabyo, iyo ibiziga byambaye inziga zidahagwa cyangwa inziga zikururuka zifite umubyimba uri hasi ya cm 4. Ariko ibyo ntibikurikizwa ku binyabiziga bikurikira:",
    options: ["ku binyabiziga by'ingabo", "ibinyabiziga bihinga iyo bigendeshwa mu karere katarenga km 25 uvuye aho ziba", "ibinyabiziga bya police", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ibinyabiziga bihinga iyo bigendeshwa mu karere katarenga km 25 uvuye aho ziba",
    questionEn: "It is prohibited to use motor vehicles and their towed trolleys if tires have no tread or the remaining tread depth is less than 4 cm. However, this does not apply to the following vehicles:",
    correctAnswerEn: "agricultural vehicles when used within an area not exceeding 25 km from their base",
    licenseClass: LICENSE.E
  },
  {
    question: "Imirongo yera iteganye n'umurongo ugabanya umuhanda mo kabiri mu burebure bwawo ugaragaza:",
    options: ["ahanyurwa n'amagare na velomoteri", "ahanyurwa n'ingorofani n'ibinyamitende", "ahanyurwa n'abanyamaguru", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "ahanyurwa n'abanyamaguru",
    questionEn: "White lines paired, each half a road width apart indicate:",
    correctAnswerEn: "where pedestrians cross",
    licenseClass: LICENSE.ALL
  },
  {
    question: "Iyo harimo indi myanya birabujijwe gutwara ku ntebe y'imbere y'imodoka abana badafite imyaka ikurikira:",
    options: ["imyaka 10", "imyaka 12", "imyaka 7", "nta gisubizo cy'ukuri kirimo"],
    correctAnswer: "imyaka 12",
    questionEn: "If there is no other option, it is forbidden to carry children under the following age on the front seat of a car:",
    correctAnswerEn: "12 years old",
    licenseClass: LICENSE.BD
  }
];

// Combine quizData6
const fullQuizData6 = [...quizData6, ...extraQuizData6];

module.exports = { quizData, quizData1, quizData2, quizData3, quizData4, quizData5, fullQuizData6 };
