export interface LessonContent {
  courseId: string;
  lessonId: number;
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'assessment';
  title: string;
  titleKiny: string;
  content: LessonSection[];
  videoUrl?: string;
  quiz?: QuizData;
}

export interface LessonSection {
  heading?: string;
  headingKiny?: string;
  type: 'paragraph' | 'list' | 'tip' | 'warning' | 'image-placeholder' | 'highlight';
  text: string;
  textKiny?: string;
  items?: string[];
  itemsKiny?: string[];
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionKiny?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationKiny?: string;
}

// ============================================================
// TRAFFIC RULES FUNDAMENTALS
// ============================================================

const trafficRulesLessons: LessonContent[] = [
  // Lesson 1: Introduction
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 1,
    type: 'text',
    title: 'Introduction to Rwanda Traffic Rules',
    titleKiny: "Intangiriro ya Amategeko y'Umuhanda y'u Rwanda",
    content: [
      {
        type: 'paragraph',
        text: "Rwanda has made remarkable progress in road safety over the past decade. The country's traffic laws are designed to protect all road users — drivers, passengers, pedestrians, and cyclists alike. Understanding these laws is not just about passing an exam; it's about saving lives.",
        textKiny: "Rwanda yakoze intambwe bikubye mu bwiza bw'umutekano w'umuhanda mu myaka ishize. Amategeko y'umuhanda yarangijwe kuburinda abakoresha umuhanda bose — abashoferi, abagenzi, n'abagenzi b'amagare. Kwizera amategeka ari nubwo wizere, sibwo wibaza — ni ubuzima.",
      },
      {
        type: 'highlight',
        text: "Rwanda's Vision 2050 includes achieving zero road fatalities. Every citizen plays a role in making this vision a reality.",
        textKiny: "Iciyumviro cya Rwanda rya 2050 ririmo kugera ku zero urupfu rw'umuhanda. Buri kibondo kigira uruhare mu gutwika iciyumviro.",
      },
      {
        heading: 'Key Principles',
        headingKiny: 'Amategeko Yingenzi',
        type: 'list',
        items: [
          'Safety first — always prioritize the safety of yourself and others',
          'Obey all traffic signs and signals — they exist to protect you',
          'Drive at a speed appropriate for conditions — not just the speed limit',
          'Stay alert and focused — avoid distractions like phones',
          'Respect all road users — including pedestrians and cyclists',
          'Maintain your vehicle — regular checks prevent accidents',
        ],
        itemsKiny: [
          'Umutekano mbere — neza neza umutekano wawe n\'uw\'abandi',
          'Kwizera ibimenyetso by\'umuhanda — biriho kuburinda',
          'Kubaga mu bushobozi — sibwo uzwihe umuvuduko',
          'Gukorera neza — reka amabango',
          'Kubaha abakoresha umuhanda bose — harimo abagenzi n\'abagenzi b\'amagare',
          'Kubungabunga imodoka yawe — ukagare ibibazo',
        ],
      },
      {
        type: 'tip',
        text: "Pro tip: The best drivers in Rwanda aren't the fastest — they're the safest. Speed kills, but knowledge saves.",
        textKiny: "Inama: Abashoferi b'urwego rwo hejuru mu Rwanda sibo b'umuvuduko — ni ab'umutekano. Umuvuduko urapfa, aha ubumenyi bubuza.",
      },
    ],
  },

  // Lesson 2: Understanding Traffic Signs
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 2,
    type: 'text',
    title: 'Understanding Traffic Signs',
    titleKiny: "Kumenya Ibimenyetso by'Umuhanda",
    content: [
      {
        type: 'paragraph',
        text: "Traffic signs are the universal language of the road. In Rwanda, you'll encounter three main categories of signs: Warning signs (triangular), Regulatory signs (circular), and Informative signs (rectangular). Each color and shape tells you something different.",
        textKiny: "Ibimenyetso by'umuhanda ni ururimi rushinaro rw'umuhanda. Mu Rwanda, uzabona ibiciro bitatu by'ibimenyetso: Ibimenyetso by'ik提醒 (ubusanzwe), Ibimenyetso by'amategeko (urub투), n'Ibimenyetso by'amakuru (ubusanzwe).",
      },
      {
        heading: 'Warning Signs (Red Triangle)',
        headingKiny: 'Ibimenyetso by\'Iremenyo (Ubusanzwe bwa Burgundy)',
        type: 'list',
        items: [
          '🔴 Red border, white background — warns of danger ahead',
          'Examples: sharp curves, steep hills, pedestrian crossings, school zones',
          'Always reduce speed when you see a warning sign',
          'These signs don\'t command you to stop — they alert you to be cautious',
        ],
        itemsKiny: [
          '🔴 Umubiri mweru, ubusanzwe bwa burgundy — biramurira ibyago',
          'Urugero: imisozi, imisozi, ibibaho, ibibanza',
          'Neza neza neza uvuga ibimenyetso',
          'Ibimenyetso ntibakuze guhagarika — birakurinda',
        ],
      },
      {
        heading: 'Regulatory Signs (Blue Circle)',
        headingKiny: 'Ibimenyetso by\'Amategeko (Ubusanzwe bwa Blue)',
        type: 'list',
        items: [
          '🔵 Blue circle = mandatory action (you MUST do this)',
          '🔴 Red circle with slash = prohibition (you MUST NOT do this)',
          'Examples: speed limits, no overtaking, one-way streets',
          'These are legal requirements — violating them means breaking the law',
        ],
        itemsKiny: [
          '🔵 Ubusanzwe bwa blue = iyo usabwa',
          '🔴 Ubusanzwe bwa burgundy = iyo umaze',
          'Urugero: umuvuduko, gutinda, urujya rw\'umwe',
          'Ibi ni amategeko — gushyira ahantu bivuze gushyira ahantu',
        ],
      },
      {
        heading: 'Informative Signs (Rectangle)',
        headingKiny: 'Ibimenyetso by\'Amakuru (Ubusanzwe)',
        type: 'list',
        items: [
          '🟢 Green or blue rectangle = helpful information',
          'Examples: distances to cities, hospital locations, exit numbers',
          'These guide you — they don\'t give orders',
          'Often found on highways and major roads',
        ],
        itemsKiny: [
          '🟢 Ubusanzwe bwa green cyangwa blue = amakuru y\'amahitamo',
          'Urugero: intera, ibibanza, ibibanza',
          'Ibi bikurinda — ntibako amategeko',
          'Biraboneka ku muhanda mukuru',
        ],
      },
      {
        type: 'warning',
        text: "In Rwanda, traffic signs use both English and Kinyarwanda. Learn both versions — they may appear differently depending on the region.",
        textKiny: "Mu Rwanda, ibimenyetso by'umuhanda byombi ni Icyongereza n'Ikinyarwanda. Menya yombi — birashobora gutandukana ukurikije aho uri.",
      },
    ],
  },

  // Lesson 3: Road Markings (Interactive)
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 3,
    type: 'interactive',
    title: 'Road Markings',
    titleKiny: "Amabwiriza y'Umuhanda",
    content: [
      {
        type: 'paragraph',
        text: "Road markings are painted lines and symbols on the road surface that guide traffic flow. In Rwanda, the most common markings are center lines, lane markings, pedestrian crossings, and parking restrictions.",
        textKiny: "Amabwiriza y'umuhanda ni amabara y'amabara y'amabara y'amabara y'amabara y'amabara y'amabara.",
      },
      {
        heading: 'Center Lines',
        headingKiny: 'Imizigororo',
        type: 'list',
        items: [
          '🟡 Yellow center line — separates traffic moving in opposite directions',
          '⚪ White dashed line — you CAN cross to overtake (when safe)',
          '⚪ White solid line — you MUST NOT cross (no overtaking zone)',
          '🔴 Double solid lines — absolutely no crossing in either direction',
        ],
        itemsKiny: [
          '🟡 Imizigororo y\'umweru — itandukana n\'abandi',
          '⚪ Imizigororo y\'umweru — ushobora guhinduka',
          '⚪ Imizigororo y\'umweru — ntushobora guhinduka',
          '🔴 Imizigororo y\'umweru y\'imbere — ntushobora guhinduka',
        ],
      },
      {
        heading: 'Pedestrian Crossings',
        headingKiny: 'Ibibaho by\'Abagenzi',
        type: 'list',
        items: [
          '⚪ Zebra crossing (white stripes) — pedestrians have priority here',
          '🟡 Yellow zigzag lines near schools — no stopping or parking',
          'Always stop for pedestrians at marked crossings',
          'Failing to yield at crossings is a serious offense',
        ],
        itemsKiny: [
          '⚪ Ibibaho by\'abagenzi (amabara y\'umweru) — abagenzi bafite icyubahiro',
          '🟡 Amabara y\'umweru yakurikiranye — ntushobora gutega',
          'Neza neza abagenzi mu bibaho',
          'Gushyira mu bibaho ni icyaha gikomeye',
        ],
      },
      {
        type: 'tip',
        text: "Interactive exercise: Look at the road next time you're out. Can you identify all the markings? Try naming their meanings before looking them up!",
        textKiny: "Icyerekezo: Raba umuhanda igihe usohoka. Urashobora kumenya amabwiriza yose? Gerageza kuvuga ibyo bisobanura ushaka kubikoresha!",
      },
    ],
  },

  // Lesson 4: Right of Way
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 4,
    type: 'text',
    title: 'Right of Way Rules',
    titleKiny: "Amategeko y'Icyubahiro",
    content: [
      {
        type: 'paragraph',
        text: "Right of way determines who goes first at intersections, crosswalks, and merging points. In Rwanda, the rule is simple: whoever arrives first has the right to proceed. But there are important exceptions.",
        textKiny: "Icyubahiro kiragenga icyo ujya mbere mu bigereranyo, mu bibaho, no mu bice. Mu Rwanda, amategeko ni akarere: icyo ujya mbere nicyo kiriyo. Ariko hari ibintu by'agaciro.",
      },
      {
        heading: 'Basic Rules',
        headingKiny: 'Amategeko Y\'ingenzi',
        type: 'list',
        items: [
          'At a T-junction: the vehicle on the main road has priority',
          'At a crossroads: if no signs, yield to the vehicle on your right',
          'At a roundabout: vehicles inside the roundabout have priority',
          'Emergency vehicles (ambulance, fire, police) always have priority — pull over',
          'Pedestrians always have priority at marked crosswalks',
          'When entering a highway: yield to traffic already on the highway',
        ],
        itemsKiny: [
          'Mu bipimo: imodoka iri ku muhanda mukuru ifite icyubahiro',
          'Mu bigereranyo: niba hari ibimenyetso, ku muhanda',
          'Mu bipimo: imodoka iri mu bipimo ifite icyubahiro',
          'Imodoka y\'amabanga (amabanga, inkunga, amapolisi) ifite icyubahiro — reka',
          'Abagenzi bose bafite icyubahiro mu bibaho',
          'Igihe unjira mu muhanda mukuru: ku muhanda',
        ],
      },
      {
        type: 'warning',
        text: "In Rwanda, flashing lights on emergency vehicles mean you MUST yield immediately. Pull to the left side of the road and stop. Failure to yield to emergency vehicles can result in heavy fines and license suspension.",
        textKiny: "Mu Rwanda, amabyo y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga y'amabanga.",
      },
    ],
  },

  // Lesson 5: Dangerous Situations (Video)
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 5,
    type: 'video',
    title: 'Common Dangerous Situations',
    titleKiny: "Imimerere Mibi bizalizaho",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "This video lesson covers the most common dangerous driving situations in Rwanda. Watch carefully and note the correct responses to each scenario.",
        textKiny: "Iri somero rya video riradukurikirana imimerere mibi yo mu Rwanda. Raba neza kandi ufatire ibyo bisobanura.",
      },
      {
        heading: 'Scenarios Covered',
        headingKiny: 'Ibiciro Byari Mu Video',
        type: 'list',
        items: [
          'Sudden pedestrian crossing — how to react in time',
          'Motorcycle lane splitting — why it happens and how to stay safe',
          'Rain-slicked roads — braking distances increase dramatically',
          'Night driving hazards — reduced visibility and how to compensate',
          'Distracted driving — the #1 cause of accidents in Rwanda',
        ],
        itemsKiny: [
          'Abagenzi batege inkunga — icyo ukorera mu gihe',
          'Amamoto y\'amamodoka — kubera iki no kubera iki',
          'Imihanda y\'imvura — intero y\'ubusobanuro yongera',
          'Ibyago by\'ubusinzi — ubusinzi buke no kubera iki',
          'Kubaga mu bintu — icyubahiro cya mbere c\'ibibazo',
        ],
      },
      {
        type: 'tip',
        text: "After watching the video, think about your own driving habits. Do you check mirrors before changing lanes? Do you always signal? Small habits prevent big accidents.",
        textKiny: "Urimuka video, ubone ubusanzwe bwawe. Uraba intambwe mbere yo guhinduka? Urashaka amabango? Amabango y'akanya arinda ibibazo bikomeye.",
      },
    ],
  },

  // Lesson 6: Interactive Scenario
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 6,
    type: 'interactive',
    title: 'Interactive Scenario',
    titleKiny: "Icyiciro Gihuza",
    content: [
      {
        type: 'paragraph',
        text: "In this interactive lesson, you'll navigate through real-world driving scenarios. Each decision you make affects the outcome. Think carefully before choosing!",
        textKiny: "Mu somero iri, uzaganjira imimerere yo mu Rwanda. Ibyo ukorera bishobora gutuma ubona ibindi. Gereza neza mbere yo guhitamwo!",
      },
      {
        heading: 'Scenario: Busy Kigali Intersection',
        headingKiny: 'Icyiciro: Igereranyo ry\'Umujyi wa Kigali',
        type: 'list',
        items: [
          '🚗 You are driving on a 2-lane road in Kigali at 50 km/h',
          '🚶 A pedestrian steps onto a zebra crossing ahead',
          '🏍️ A motorcycle is approaching from behind, seemingly in a hurry',
          '❓ What do you do?减速, 检查后视镜, and prepare to stop',
        ],
        itemsKiny: [
          '🚗 Urabaga ku muhanda wa magere 2 mu Kigali ku 50 km/h',
          '🚶 Umugenzi amaze guhinduka mu bibaho',
          '🏍️ Umamoto urasohokera mu mbuye, bigaragara nk\'aho birambye',
          '❓ Ushobora iki? Gereza, reba intambwe, kandi uzi guhagarika',
        ],
      },
      {
        type: 'tip',
        text: "Key lesson: Always anticipate the unexpected. The best drivers don't just react to what's happening — they predict what might happen next.",
        textKiny: "Icyerekezo: Neza neza ibintu bitari ubusanzwe. Abashoferi b'urwego rwo hejuru sibo bikorera — bakwiye ibyo birashobora gusohokera.",
      },
    ],
  },

  // Lesson 7: Knowledge Quiz
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test what you've learned! Answer these questions to check your understanding of Rwanda traffic rules fundamentals.",
        textKiny: "Gerageza ibyo wize! Subiza ibibazo kugira ngo urebe ubumenyi bwawe bw'amategeko y'umuhanda y'u Rwanda.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What shape are warning signs in Rwanda?',
          questionKiny: 'Ibimenyetso by\'ik提醒 ni ubusanzwe bwa kigali mu Rwanda?',
          options: ['Circle', 'Triangle', 'Rectangle', 'Diamond'],
          correctIndex: 1,
          explanation: 'Warning signs in Rwanda are triangular (pointing up) with a red border and white background.',
          explanationKiny: 'Ibimenyetso by\'ik提醒 mu Rwanda ni ubusanzwe bwa burgundy.',
        },
        {
          id: 2,
          question: 'At a crossroads with no signs, who has priority?',
          questionKiny: 'Mu bigereranyo, niba hari ibimenyetso, icyo ujya mbere?',
          options: ['The vehicle approaching from the left', 'The vehicle approaching from the right', 'The larger vehicle', 'The faster vehicle'],
          correctIndex: 1,
          explanation: 'When there are no priority signs at a crossroads, you must yield to vehicles approaching from your right.',
          explanationKiny: 'Igihe hari ibimenyetso mu bigereranyo, usabwa guhinduka.',
        },
        {
          id: 3,
          question: 'What does a solid white center line mean?',
          questionKiny: 'Imizigororo y\'umweru ivuze iki?',
          options: ['You can overtake safely', 'You must not cross the line', 'The road is ending', 'Speed limit zone'],
          correctIndex: 1,
          explanation: 'A solid white center line means you must NOT cross it to overtake. This is a no-overtaking zone.',
          explanationKiny: 'Imizigororo y\'umweru ivuze iyo ntushobora guhinduka.',
        },
        {
          id: 4,
          question: 'When an ambulance approaches with flashing lights, you should:',
          questionKiny: 'Igihe amabanga y\'amabanga y\'amabanga y\'amabanga y\'amabanga y\'amabanga y\'amabanga:',
          options: ['Speed up to get out of the way', 'Pull to the left and stop', 'Continue driving normally', 'Block the road to help'],
          correctIndex: 1,
          explanation: 'You must yield to emergency vehicles. Pull to the left side of the road and stop until they pass.',
          explanationKiny: 'Usabwa guhinduka. Reka umuhanda kandi uhagarika.',
        },
        {
          id: 5,
          question: 'Zebra crossings are for:',
          questionKiny: 'Ibibaho by\'abagenzi ni:',
          options: ['Parking vehicles', 'Pedestrian crossings only', 'Bus stops', 'Motorcycle lanes'],
          correctIndex: 1,
          explanation: 'Zebra crossings (white stripes) are exclusively for pedestrians. Drivers must yield to anyone crossing at these marked areas.',
          explanationKiny: 'Ibibaho by\'abagenzi (amabara y\'umweru) ni abagenzi gusa. Abashoferi basabwa guhinduka.',
        },
      ],
    },
  },

  // Lesson 8: Final Assessment
  {
    courseId: 'traffic-rules-fundamentals',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Congratulations on completing the Rwanda Traffic Rules Fundamentals course! This final assessment tests everything you've learned. Pass with 70% or higher to earn your course certificate.",
        textKiny: "Wakiriye neza mu gutangira isomoro ry'Amategeko y'Umuhanda y'u Rwanda! Isuzuma ry'amera riragereranya ibyo wizeose. Tanga 70% cyangwa hejuru kugira ngo uronke icyemezo.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What is the FIRST thing you should check before driving?',
          questionKiny: 'Icyambere usabwa kureba mbere yo kubaga?',
          options: ['The radio station', 'Mirrors, seats, and seatbelt', 'Your phone notifications', 'The fuel gauge'],
          correctIndex: 1,
          explanation: 'Always check mirrors, adjust your seat, and fasten your seatbelt before starting the engine.',
          explanationKiny: 'Neza neza intambwe, uhindure intebe, kandi ufate urwego rwo mumahoro mbere yo gutangira.',
        },
        {
          id: 2,
          question: 'A blue circular sign with a white arrow means:',
          questionKiny: 'Ibimenyetso by\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru:',
          options: ['You must turn left', 'Mandatory direction — you must go this way', 'Optional detour', 'End of road'],
          correctIndex: 1,
          explanation: 'Blue circular signs with arrows are mandatory — they tell you what direction you MUST travel.',
          explanationKiny: 'Ibimenyetso by\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru bw\'umweru.',
        },
        {
          id: 3,
          question: 'When approaching a roundabout in Rwanda, you should:',
          questionKiny: 'Igihe unjira mu bice mu Rwanda, usabwa:',
          options: ['Enter immediately', 'Yield to vehicles already in the roundabout', 'Honk to signal entry', 'Stop and wait'],
          correctIndex: 1,
          explanation: 'At a roundabout, vehicles inside the roundabout have priority. Slow down and yield before entering.',
          explanationKiny: 'Mu bice, imodoka iri mu bice ifite icyubahiro. Gereza mbere yo kunjira.',
        },
        {
          id: 4,
          question: 'What is the recommended safe following distance?',
          questionKiny: 'Intero y\'amahitamo y\'amahitamo ni iki?',
          options: ['1 second', '2 seconds', '3-4 seconds', 'As close as possible'],
          correctIndex: 2,
          explanation: 'Maintain at least 3-4 seconds of following distance. This gives you enough time to react and stop safely.',
          explanationKiny: 'Neza neza 3-4 amasegonda y\'intero. Ibi bikuguha igihe kirekire.',
        },
        {
          id: 5,
          question: 'In rainy conditions, you should:',
          questionKiny: 'Mu gihe cy\'imvura, usabwa:',
          options: ['Drive faster to avoid the rain', 'Reduce speed and increase following distance', 'Turn on hazard lights while driving', 'Use high beam headlights'],
          correctIndex: 1,
          explanation: 'Rain reduces traction and visibility. Slow down, increase following distance, and use low beam headlights.',
          explanationKiny: 'Imvura igabanya ubusinzi no kubona. Gereza, neza neza intero, kandi ukoreshe amabyo.',
        },
      ],
    },
  },
];

// ============================================================
// SAFE DRIVING & ROAD SAFETY
// ============================================================

const safeDrivingLessons: LessonContent[] = [
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 1,
    type: 'text',
    title: 'Introduction to Defensive Driving',
    titleKiny: "Intangiriro yo Kubaga Neza",
    content: [
      {
        type: 'paragraph',
        text: "Defensive driving is a set of skills and practices that help you avoid accidents regardless of road conditions, weather, or the actions of other drivers. It's about being prepared for the unexpected and always having an escape route.",
        textKiny: "Kubaga neza ni ubushobozi n'ibikorwa bigufasha gukemura ibibaho, niba umuhanda, ubwoko, cyangwa ibikorwa by'abandi bashoferi. Ni ibintu birabereye bikurikirana.",
      },
      {
        heading: 'The Three Pillars of Defensive Driving',
        headingKiny: 'Ibigararo Bitatu by\'Kubaga Neza',
        type: 'list',
        items: [
          '🔍 Awareness — constantly scan your surroundings for potential hazards',
          '⏱️ Anticipation — predict what other road users might do next',
          '🛡️ Action — have a plan to avoid danger before it happens',
        ],
        itemsKiny: [
          '🔍 Kubona — neza neza ibibaho byose',
          '⏱️ Kubitegeka — ubwire ibyo abandi bashoferi bashobora gukora',
          '🛡️ Igikorwa — ushyireho plan mbere yo kubona ibyago',
        ],
      },
      {
        type: 'tip',
        text: "Defensive drivers are always asking themselves: 'What if?' What if that car pulls out? What if that child runs into the road? This mindset keeps you safe.",
        textKiny: "Abashoferi b'urwego rwo hejuru baratanga: 'Ntabwo?' Niba imodoka isohokera? Niba umwana anyurira muhanda? Iciyumviro kikurinda.",
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 2,
    type: 'text',
    title: 'Identifying Road Hazards',
    titleKiny: "Kumenya Ibyago by'Umuhanda",
    content: [
      {
        type: 'paragraph',
        text: "Road hazards come in many forms — from potholes and wet leaves to jaywalking pedestrians and erratic drivers. The key to safety is identifying hazards early and reacting appropriately.",
        textKiny: "Ibyago by'umuhanda biri mu buryo bwinshi — kuva mu mbibizo n'ibibera by'ibibera kugeza ku bagenzi n'abashoferi. Umutekano ni ubumenyi bw'ibyago mbere no gutangira.",
      },
      {
        heading: 'Common Hazards in Rwanda',
        headingKiny: 'Ibyago Bisanzwe mu Rwanda',
        type: 'list',
        items: [
          '🏍️ Motorcycles — often weave between lanes, unpredictable',
          '🚶 Pedestrians — especially near markets and schools',
          '🌧️ Rain — roads become slippery, visibility drops',
          '🕳️ Potholes — common on secondary roads, can cause loss of control',
          '🌙 Night driving — reduced visibility, unlit roads',
          '🐄 Livestock — cows and goats on roads in rural areas',
          '📱 Distracted drivers — phone use while driving',
        ],
        itemsKiny: [
          '🏍️ Amamoto — birashobora gutandukana, bidakwiye',
          '🚶 Abagenzi — cyane cane hafi y\'ibibanza',
          '🌧️ Imvura — imihanda irashobora gutandukana',
          '🕳️ Ibyago — bisanzwe mu mikenero, birashobora gutuma ubona',
          '🌙 Kubaga mu buzinzi — ubusinzi buke',
          '🐄 Inkunga — inkunga n\'inkunga mu bice by\'abanyarajisho',
          '📱 Abashoferi badakwiye — telefone y\'ubusinzi',
        ],
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 3,
    type: 'video',
    title: 'Pedestrian Safety',
    titleKiny: "Umutekano w'Abagenzi",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Pedestrians are the most vulnerable road users. In Rwanda, pedestrian fatalities account for a significant portion of road deaths. This video shows you how to protect pedestrians while driving.",
        textKiny: "Abagenzi ni abakoresha umuhanda batabarika cane. Mu Rwanda, abagenzi batayobowe bakorana igice gikomeye c\'urupfu rw\'umuhanda.",
      },
      {
        heading: 'Key Rules for Pedestrian Safety',
        headingKiny: 'Amategeko Yingenzi yo Kuburinda Abagenzi',
        type: 'list',
        items: [
          'Always yield at zebra crossings — pedestrians have absolute priority',
          'Slow down near schools, markets, and hospitals',
          'Watch for children — they can be unpredictable',
          'Use your horn to alert (not to intimidate)',
          'At night, use low beams to avoid blinding pedestrians',
        ],
        itemsKiny: [
          'Neza neza abagenzi mu bibaho — abagenzi bafite icyubahiro',
          'Gereza hafi y\'ibibanza, ibibanza, n\'ibibanza',
          'Reba abana — bashobora gutuma ubona',
          'Koreshe inkingi yo gutangira',
          'Mu buzinzi, koreshe amabyo',
        ],
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 4,
    type: 'text',
    title: 'Motorcycle & Cyclist Awareness',
    titleKiny: "Kumenya Abashoferi b'Amamoto",
    content: [
      {
        type: 'paragraph',
        text: "Motorcycles (motos) and bicycles are everywhere in Rwanda. They're smaller, faster, and more maneuverable than cars — which makes them harder to see and predict. Understanding how to share the road with two-wheelers is essential.",
        textKiny: "Amamoto n'amagare ari mu Rwanda yose. Arinto, aritezereye, kandi abitwaje mu buryo bw'imodoka — bivuze ko birashobora kunonwa no kutabonwa. Kwizera uburyo bwo gukemura mu buryo bw'ikibaho.",
      },
      {
        heading: 'Tips for Sharing with Two-Wheelers',
        headingKiny: 'Amabwiriza y\'Guherereka na Ababiri',
        type: 'list',
        items: [
          'Always check blind spots before changing lanes — motorcycles hide there',
          'Give them at least 1 meter of space when passing',
          'Don\'t assume they\'ll stay in their lane',
          'Watch for motorcycles turning from the left lane',
          'In rain, give extra space — motorcycles have less traction',
        ],
        itemsKiny: [
          'Neza neza intambwe mbere yo guhinduka — amamoto ari mu ntambwe',
          'Reka 1 meter y\'umwanya ugishyira',
          'Ntukwire ko bamera mu ntambwe',
          'Reba amamoto yo guhinduka mu ntambwe',
          'Mu gihe cy\'imvura, reka umwanya — amamoto arashobora gutandukana',
        ],
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 5,
    type: 'interactive',
    title: 'Safe Following Distance',
    titleKiny: "Intero Yemewe",
    content: [
      {
        type: 'paragraph',
        text: "Maintaining a safe following distance gives you time to react if the car ahead stops suddenly. The '3-second rule' is the gold standard — here's how to practice it.",
        textKiny: "Kubungabunga intero yemewe bikuguha igihe kirekire. 'Amasegonda atatu' ni urwego rwo hejuru — raba nuko urabikorera.",
      },
      {
        heading: 'How to Measure 3 Seconds',
        headingKiny: 'Uburyo bwo Kubara Amasegonda Atatu',
        type: 'list',
        items: [
          '1. Pick a stationary object (sign, tree, pole) ahead',
          '2. When the car ahead passes it, start counting: "one-thousand-one, one-thousand-two, one-thousand-three"',
          '3. If you pass the object before finishing, you\'re too close',
          '4. Add more seconds in rain, fog, or at night (4-5 seconds)',
        ],
        itemsKiny: [
          '1. Hitamwo icintu (ibimenyetso, igiti, ingamba) iri imbere',
          '2. Igihe imodoka iri imbere yayo, utangira kubara: "rimwe, kabiri, gatatu"',
          '3. Niba usohokera mbere yo gutangira, ujya hafi',
          '4. Yongera amasegonda mu gihe cy\'imvura, icyumba, cyangwa mu buzinzi',
        ],
      },
      {
        type: 'tip',
        text: "In wet conditions, double your following distance. In fog, triple it. Your stopping distance increases dramatically when the road is slippery.",
        textKiny: "Mu gihe cy\'imvura, intero yawe yongere. Mu icyumba, yongere. Intero yawe yongera mu buryo bw\'imvura mu gihe cy\'imvura.",
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 6,
    type: 'video',
    title: 'Weather & Night Driving',
    titleKiny: "Kubaga mu Buzima bw'Umwanda",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Driving at night or in bad weather requires extra caution. Visibility is reduced, roads are more dangerous, and other drivers may be harder to see. This video covers essential techniques for staying safe.",
        textKiny: "Kubaga mu buzinzi cyangwa mu bwoko bw\'ibibazo bisaba kujya neza. Ubushobozi buke, imihanda by\'ibibazo, kandi abandi bashoferi bashobora kunonwa.",
      },
      {
        heading: 'Night Driving Tips',
        headingKiny: 'Amabwiriza y\'Kubaga mu Buzinzi',
        type: 'list',
        items: [
          'Use low beam headlights — high beams blind oncoming traffic',
          'Reduce speed — you can\'t stop as quickly at night',
          'Watch for pedestrians in dark clothing — they\'re nearly invisible',
          'Keep your windshield clean — dirt scatters light',
          'Don\'t look directly at oncoming headlights — look at the right edge of the road',
        ],
        itemsKiny: [
          'Koreshe amabyo — amabyo yakurikiranye y\'abandi',
          'Gereza — ntushobora guhagarika mu buzinzi',
          'Reba abagenzi mu bineza — bataboneka',
          'Kubungabunga urubanza — icyumba cy\'abandi',
          'Nturebe amabyo yakurikiranye — reba iburyo bw\'umuhanda',
        ],
      },
    ],
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your understanding of safe driving principles!",
        textKiny: "Gerageza ubumenyi bwawe bw'amategeko yo kubaga neza!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What is the recommended following distance in good conditions?',
          questionKiny: 'Intero y\'amahitamo y\'amahitamo mu buryo bw\'amahitamo?',
          options: ['1 second', '2 seconds', '3-4 seconds', '5 seconds'],
          correctIndex: 2,
          explanation: 'The 3-4 second rule gives you enough time to react and stop safely.',
          explanationKiny: 'Amasegonda atatu 3-4 akuguha igihe kirekire.',
        },
        {
          id: 2,
          question: 'Why should you check blind spots before changing lanes?',
          questionKiny: 'Kubera iki usabwa kureba intambwe mbere yo guhinduka?',
          options: ['To see if the road is empty', 'Because motorcycles and cyclists often hide there', 'To check your makeup', 'Because the law requires it'],
          correctIndex: 1,
          explanation: 'Motorcycles and cyclists can easily hide in your blind spots. Always check before changing lanes.',
          explanationKiny: 'Amamoto n\'amagare bashobora kunonwa mu ntambwe yawe.',
        },
        {
          id: 3,
          question: 'In heavy rain, you should:',
          questionKiny: 'Mu gihe cy\'imvura, usabwa:',
          options: ['Drive faster to avoid getting wet', 'Slow down and increase following distance', 'Turn on hazard lights', 'Stop driving completely'],
          correctIndex: 1,
          explanation: 'Rain reduces traction and visibility. Slow down, increase following distance, and use low beam headlights.',
          explanationKiny: 'Imvura igabanya ubusinzi no kubona. Gereza, neza neza intero.',
        },
        {
          id: 4,
          question: 'At night, you should use:',
          questionKiny: 'Mu buzinzi, usabwa gukoresha:',
          options: ['High beam headlights always', 'Low beam headlights', 'No headlights', 'Hazard lights only'],
          correctIndex: 1,
          explanation: 'Low beam headlights are appropriate for night driving. High beams blind oncoming traffic.',
          explanationKiny: 'Amabyo yakurikiranye ni amahitamo.',
        },
        {
          id: 5,
          question: 'What does defensive driving primarily focus on?',
          questionKiny: 'Kubaga neza birabereye hehe?',
          options: ['Driving the fastest', 'Avoiding accidents through awareness and anticipation', 'Following the car ahead closely', 'Using the horn frequently'],
          correctIndex: 1,
          explanation: 'Defensive driving is about awareness, anticipation, and action to prevent accidents before they happen.',
          explanationKiny: 'Kubaga neza ni ubusinzi, kubitegeka, n\'igikorwa.',
        },
      ],
    },
  },
  {
    courseId: 'safe-driving-road-safety',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry'Impera",
    content: [
      {
        type: 'paragraph',
        text: "You've completed the Safe Driving & Road Safety course! This final assessment covers all key concepts. Score 70% or higher to earn your certificate.",
        textKiny: "Wakiriye neza mu gutangira isomoro ry\'Kubaga Neza no Kubungabunga Umutekano! Isuzuma ry\'amera riragereranya amategeko yose.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What are the three pillars of defensive driving?',
          questionKiny: 'Ibigararo bitatu by\'kubaga neza ni bito?',
          options: ['Speed, Power, Control', 'Awareness, Anticipation, Action', 'Look, Listen, Feel', 'Brake, Steer, Accelerate'],
          correctIndex: 1,
          explanation: 'Awareness (scan for hazards), Anticipation (predict what might happen), and Action (have an escape plan).',
          explanationKiny: 'Kubona (reba ibyago), Kubitegeka (ubwire ibyo birashobora gusohokera), n\'Igikorwa.',
        },
        {
          id: 2,
          question: 'When sharing the road with motorcycles, you should:',
          questionKiny: 'Igihe uherereka umuhanda na amamoto, usabwa:',
          options: ['Overtake them immediately', 'Give them at least 1 meter of space when passing', 'Flash your lights at them', 'Drive as close as possible'],
          correctIndex: 1,
          explanation: 'Always give motorcycles at least 1 meter of space when passing. They need room to maneuver safely.',
          explanationKiny: 'Neza neza amamoto 1 meter y\'umwanya.',
        },
        {
          id: 3,
          question: 'In foggy conditions, the 3-second rule should become:',
          questionKiny: 'Mu icyumba, amasegonda atatu ashobora gutangira:',
          options: ['1 second', '2 seconds', '4-5 seconds', '10 seconds'],
          correctIndex: 2,
          explanation: 'In fog, visibility is severely reduced. Increase to 4-5 seconds to give yourself more reaction time.',
          explanationKiny: 'Mu icyumba, ubusinzi buke buke. Yongera 4-5 amasegonda.',
        },
        {
          id: 4,
          question: 'Why should you look at the right edge of the road at night?',
          questionKiny: 'Kubera iki usabwa kubona iburyo bw\'umuhanda mu buzinzi?',
          options: ['To see potholes', 'To avoid being blinded by oncoming headlights', 'To find parking', 'To read road signs'],
          correctIndex: 1,
          explanation: 'Looking directly at oncoming headlights causes temporary blindness. Look at the right edge instead.',
          explanationKiny: 'Kureba amabyo yakurikiranye birashobora gutuma ubona.',
        },
        {
          id: 5,
          question: 'What is the #1 cause of accidents in Rwanda?',
          questionKiny: 'Icyubahiro cya mbere c\'ibibazo mu Rwanda ni iki?',
          options: ['Bad roads', 'Distracted driving', 'Speeding', 'Rain'],
          correctIndex: 1,
          explanation: 'Distracted driving (especially phone use) is the leading cause of accidents in Rwanda.',
          explanationKiny: 'Kubaga mu bintu (cyane telefone) ni icyubahiro cya mbere.',
        },
      ],
    },
  },
];

// ============================================================
// ROAD SIGNS & MARKINGS MASTERCLASS
// ============================================================

const roadSignsLessons: LessonContent[] = [
  {
    courseId: 'road-signs-markings',
    lessonId: 1,
    type: 'text',
    title: 'Overview of Sign Categories',
    titleKiny: "Ibiciro by'Ibimenyetso",
    content: [
      {
        type: 'paragraph',
        text: "Rwanda uses three main categories of road signs, each with a distinct shape and color scheme. Understanding these categories is the foundation of sign recognition.",
        textKiny: "Rwanda irikoresha ibiciro bitatu by'ibimenyetso by'umuhanda, buri gicegifise ubusanzwe n'ibara ryihariye. Kwizera ibi ni imizi yo kumenya ibimenyetso.",
      },
      {
        heading: 'The Three Categories',
        headingKiny: 'Ibiciro Bitatu',
        type: 'list',
        items: [
          'Warning Signs — Triangular, red border, white background — alert you to hazards ahead',
          'Regulatory Signs — Circular, blue or red — tell you what you must or must not do',
          'Informative Signs — Rectangular, green/blue — provide useful information about destinations and services',
        ],
        itemsKiny: [
          'Ibimenyetso by\'Iremenyo — Buri usanzwe bw\'umubato, impagarako y\'umutuku, umubiri mweru — birakuranga ibyago bihari',
          'Ibimenyetso by\'Amategeko — Buri usanzwe bw\'urub투, buruburu cyangwa umutuku — birakuze cyangwa ntibikuze',
          'Ibimenyetso by\'Amakuru — Buri usanzwe bw\'ubusanzwe, icyatsi/cy\'ubururu — biratanga amakuru y\'ahantu n\'serivisi',
        ],
      },
      {
        heading: 'Why Shape Matters',
        headingKiny: 'Kubera Iki Ubusanzwe Burihise',
        type: 'list',
        items: [
          'Triangle = Caution — something ahead requires your attention',
          'Circle = Rule — this is a legal requirement',
          'Rectangle = Information — helpful guidance for your journey',
          'Diamond = Temporary — construction or temporary conditions',
        ],
        itemsKiny: [
          'Ubusuzwe bwa Triangle — Iremenyo — haba icya gutegerezwa ko waraba',
          'Ubusuzwe bwa Circle — Amategeko — ni amategeko y\'uburengeranzwa',
          'Ubusuzwe bwa Rectangle — Amakuru — amabwiriza y\'amahitamo mu rugendo',
          'Ubusuzwe bwa Diamond — Bihari — gukora cyangwa imimerere y\'igihe gito',
        ],
      },
      {
        type: 'tip',
        text: "Pro tip: Even from a distance, you can identify a sign's category by its shape alone. Train your eyes to recognize shapes first, then colors, then details.",
        textKiny: "Inama: Ushobora kumenya ibiciro by'ibimenyetso-bitari hafi ukurikije ubusanzwe bwabyo gusa. Ohereza amaso yawe kubona ubusanzwe mbere, hanyuma ibara, hanyuma ibindi.",
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 2,
    type: 'interactive',
    title: 'Warning Signs',
    titleKiny: "Ibimenyetso by'Iremenyo",
    content: [
      {
        type: 'paragraph',
        text: "Warning signs are triangular with a red border. They alert drivers to potential hazards ahead. In Rwanda, you'll see these before curves, hills, pedestrian crossings, and more.",
        textKiny: "Ibimenyetso by'iremenyo ni ibisuzwe bya triangle bifise impagarako y'umutuku. Biratangaza abashoferi ibyago bihari imbere. Mu Rwanda, uzabibona mbere y'imisozi, ibibanza, n'ibindi.",
      },
      {
        heading: 'Common Warning Signs',
        headingKiny: 'Ibimenyetso by\'Iremenyo Bisanzwe',
        type: 'list',
        items: [
          '🔺 Sharp curve ahead — reduce speed immediately',
          '🔺 Steep hill — downshift and control your speed',
          '🔺 Pedestrian crossing — watch for people crossing',
          '🔺 School zone — children may be present',
          '🔺 Road narrowing — the road gets narrower ahead',
          '🔺 Construction zone — expect workers and equipment',
          '🔺 Animal crossing — livestock may be on the road',
          '🔺 Slippery road — reduce speed, especially in rain',
        ],
        itemsKiny: [
          '🔺 Imisozi y\'ubukene — heba umuvuduko amahoro',
          '🔺 Ikiyaga gikubye — hindura ingere kandi ukagure umuvuduko',
          '🔺 Ibibaho by\'abagenzi — reba abantu bafata intambwe',
          '🔺 Icyumba c\'isomero — abana bashobora kuboneka',
          '北路 y\'umuhanda — umuhanda uratura imbere',
          '🔺 Icyumba cy\'umwuka — utegereze abakozi n\'ibikoresho',
          '🔺 Inkunga z\'inyamaswa — inkunga zashobora kuboneka mu muhanda',
          '🔺 Umuhanda udakoroha — heba umuvuduko, cyane mu gihe cy\'imvura',
        ],
      },
      {
        type: 'warning',
        text: "Warning signs don't tell you to stop — they tell you to be prepared. Always reduce speed when you see a warning sign, as the actual hazard may be closer than it appears.",
        textKiny: "Ibimenyetso by'iremenyo ntibakuze guhagarika — birakwiye gutegerezwa. Neza neza heba umuvuduko ubona ibimenyetso by'iremenyo, kubera ibyago bihari birashobora kuba hafi cyane.",
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 3,
    type: 'interactive',
    title: 'Regulatory Signs',
    titleKiny: "Ibimenyetso by'Amategeko",
    content: [
      {
        type: 'paragraph',
        text: "Regulatory signs are circular and tell you what you MUST do or MUST NOT do. Blue circles mean mandatory actions; red circles with slashes mean prohibitions.",
        textKiny: "Ibimenyetso by'amategeko ni ibisuzwe bya burub투, birakuze cyangwa ntibikuze. Ibisuzwe bya buruburu bigaragara nk'ibikwiye kubakoreshwa; ibisuzwe bya umutuku bigaragara nk'ibikakata.",
      },
      {
        heading: 'Mandatory Signs (Blue Circle)',
        headingKiny: 'Ibimenyetso by\'Ibikwiye (Ubusuzwe bwa Buruburu)',
        type: 'list',
        items: [
          '🔵 Turn left/right — you must go this direction',
          '🔵 Proceed straight only — no turns allowed',
          '🔵 Minimum speed — you must drive at least this fast',
          '🔵 Roundabout ahead — follow the circular flow',
        ],
        itemsKiny: [
          '🔵 Guhuza ibumoso/iburyo — usabwa kuja mu rya rw\'umwe',
          '🔵 Gukomeza imbere gusa — ntihakurikizwe guhuza',
          '🔵 Umuvuduko muciriranco — usabwa kubaga birenze iyi',
          '🔵 Ibipimo biri imbere — kurikiza icyotsi cy\'urub투',
        ],
      },
      {
        heading: 'Prohibitory Signs (Red Circle)',
        headingKiny: 'Ibimenyetso by\'Ibibujijwe (Ubusuzwe bwa Mutuku)',
        type: 'list',
        items: [
          '🔴 Speed limit — do not exceed this speed',
          '🔴 No overtaking — do not pass other vehicles',
          '🔴 No entry — do not enter this road',
          '🔴 No parking — do not stop and leave your vehicle',
          '🔴 No U-turn — do not reverse direction',
        ],
        itemsKiny: [
          '🔴 Umuvuduko usabirirwa — ntukwere iyi umuvuduko',
          '🔴 Gutinda byabujijwe — ntukagurire imodoka z\'abandi',
          '🔴 Kunjira byabujijwe — ntujye mu muhanda uyu',
          '🔴 Gutega byabujijwe — ntuhagarike kandi ukeke imodoka yawe',
          '🔴 Guhinduka byabujijwe — ntugarura umuyoboro',
        ],
      },
      {
        type: 'tip',
        text: "Blue = you MUST do this. Red circle = you MUST NOT do this. Remember this simple rule and you'll never confuse regulatory signs.",
        textKiny: "Buruburu = usabwa kubikora. Ubusuzwe bwa umutuku = ntukabikora. Menya iyi ngamba yoroshe kandi ntuzakibangikanya ibimenyetso by'amategeko.",
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 4,      type: 'interactive',
      title: 'Informative Signs',
    titleKiny: "Ibimenyetso by'Amakuru",
    content: [
      {
        type: 'paragraph',
        text: "Informative signs are rectangular and provide helpful information. They guide you to destinations, services, and explain road conditions ahead.",
        textKiny: "Ibimenyetso by'amakuru ni ibisuzwe bya ubusanzwe bitanga amakuru y'amahitamo. Birakurya ku bahantu, serivisi, kandi bisobanura imimerere y'umuhanda iri imbere.",
      },
      {
        heading: 'Types of Informative Signs',
        headingKiny: 'Ibiciro by\'Ibimenyetso by\'Amakuru',
        type: 'list',
        items: [
          '🟢 Green rectangle — directional guidance on highways',
          '🔵 Blue rectangle — services (hospitals, gas stations, hotels)',
          '⚪ White rectangle — general information and distance markers',
          '🟡 Yellow rectangle — temporary information for construction zones',
        ],
        itemsKiny: [
          '🟢 Ubusuzwe bwa cyatsi — amabwiriza y\'umuyoboro ku muhanda mukuru',
          '🔵 Ubusuzwe bwa buruburu — serivisi (ibibanza, amahoto y\'amavunja, amahoteli)',
          '⚪ Ubusuzwe bwa umweru — amakuru rusange n\'ibibumbiyo by\'intera',
          '🟡 Ubusuzwe bwa umuheto — amakuru y\'igihe gito y\'ibyumba by\'ubwoko',
        ],
      },
      {
        heading: 'What They Tell You',
        headingKiny: 'Ibiko Bakuze',
        type: 'list',
        items: [
          'Distance to the next town or city',
          'Direction to hospitals, police stations, fuel',
          'Exit numbers and lane assignments',
          'Road names and route numbers',
          'Tourist attractions and rest areas',
        ],
        itemsKiny: [
          'Intera y\'igihe kizaza cyangwa urujyi',
          'Umuwoboro w\'ibibanza, ibibanza by\'amapolisi, amavunja',
          'Ibihariro by\'intambwe n\'ibibumbiyo by\'intambwe',
          'Amazina y\'umuhanda n\'ibihariro by\'urugendo',
          'Ibintu by\'abagenzi n\'aho upumira',
        ],
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 5,
    type: 'video',
    title: 'Road Markings Deep Dive',
    titleKiny: "Amabwiriza y'Umuhanda",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Road markings work alongside signs to guide traffic. This video walks you through every marking you'll encounter on Rwanda's roads.",
        textKiny: "Amabwiriza y'umuhanda akorana na ibimenyetso kugira ngo ayobore umutekano. Iri video rikubwira ibwiriza ryose uzabonana naryo ku muhanda w'u Rwanda.",
      },
      {
        heading: 'Center Line Markings',
        headingKiny: 'Amabwiriza y\'Imizigororo',
        type: 'list',
        items: [
          '🟡 Yellow solid center line — no crossing, no overtaking',
          '🟡 Yellow dashed center line — crossing allowed when safe',
          '⚪ White dashed line — lane guidance on one-way roads',
          '⚪ Double solid lines — absolutely no crossing',
        ],
        itemsKiny: [
          '🟡 Imizigororo y\'umweru y\'imfire — ntukagurire, ntukagurire',
          '🟡 Imizigororo y\'umweru y\'imfire y\'agace — utagurire iyo umutekano',
          '⚪ Imizigororo y\'umweru y\'agace — amabwiriza y\'intambwe ku muhanda w\'umwe',
          '⚪ Imizigororo y\'umweru y\'imbere — utagurire burundu',
        ],
      },
      {
        heading: 'Edge and Lane Markings',
        headingKiny: 'Amabwiriza y\'Impera n\'Intambwe',
        type: 'list',
        items: [
          '⚪ Solid white edge line — marks the road boundary',
          '⚪ Dashed white lines — separate lanes of same-direction traffic',
          '🟡 Yellow edge line — marks the left edge on divided highways',
          '🔴 Red markings — bus lanes or restricted zones',
        ],
        itemsKiny: [
          '⚪ Imizigororo y\'umweru y\'imfire — ifata imiterere y\'umuhanda',
          '⚪ Imizigororo y\'umweru y\'agace — itandukanya intambwe z\'umuyoboro umwe',
          '🟡 Imizigororo y\'umuheto y\'umweru — ifata impera y\'ibumoso ku muhanda mukuru',
          '🔴 Amabwiriza y\'umutuku — intambwe z\'ibisi cyangwa ahantu habujijwe',
        ],
      },
      {
        heading: 'Special Markings',
        headingKiny: 'Amabwiriza y\'Ibintu Bitandukanye',
        type: 'list',
        items: [
          '⚪ Zebra crossing — pedestrian priority area',
          '🟡 Zigzag lines — near schools, no stopping',
          '⚪ Arrows on road — indicate allowed directions',
          '⚪ Stop line — where you must stop at intersections',
        ],
        itemsKiny: [
          '⚪ Ibibaho by\'abagenzi — ahantu abagenzi bifite icyubahiro',
          '🟡 Imizigororo zigzag — hafi y\'isomero, ntuhagarike',
          '⚪ Utitiri ku muhanda — biragaragara ibibaho byemewe',
          '⚪ Umurongo wo guhagarika — aho usabwa guhagarika mu bigereranyo',
        ],
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 6,
    type: 'interactive',
    title: 'Sign Recognition Practice',
    titleKiny: "Amahugurwa y'Kumenya Ibimenyetso",
    content: [
      {
        type: 'paragraph',
        text: "Speed quiz time! In real driving, you only have 2-3 seconds to read and understand a sign. Practice identifying these signs quickly.",
        textKiny: "Igihe c\'isuzuma! Mu kubaga kwa nyabo, ufise amasegonda 2-3 gusa gusoma no gusobanura ibimenyetso. Jya ukiziriza kumenya ibi bisobanura vuba.",
      },
      {
        heading: 'Practice Scenarios',
        headingKiny: 'Ibiciro by\'Amahugurwa',
        type: 'list',
        items: [
          'You see a red triangle with a child figure — what should you do?',
          'A blue circle with an arrow pointing right — what does it mean?',
          'A red circle with "40" — what is the restriction?',
          'A green rectangle with "Kigali 50km" — what information is this?',
          'A white diamond with orange border — what does this indicate?',
        ],
        itemsKiny: [
          'Urabona triangle y\'umutuku ifise ishusho y\'umwana — icyo ukwiye kubikora?',
          'Buruburu bufitise intebe igaragaza iburyo — bisobanura iki?',
          'Buruburu bw\'umutuku bufise "40" — icyaha c\'umuvuduko ni iki?',
          'Rectangle y\'icyatsi bufise "Kigali 50km" — amakuru ari aya ni mehe?',
          'Diamond y\'umweru bufise impagarako y\'amachitiro — biragaragara iki?',
        ],
      },
      {
        type: 'tip',
        text: "Quick recognition saves lives. Practice by looking at signs during your daily commute. Can you name the category and meaning within 3 seconds?",
        textKiny: "Kumenya vuba bikurinda ubuzima. Jya uraba ibimenyetso mu gihe ushoramo ubusinzi bwawe. Urashobora kuvuga ibiciro n\'ubusobanuro mu minsi 3?",
      },
    ],
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your sign and marking knowledge!",
        textKiny: "Gerageza ubumenyi bwawe bw'ibimenyetso n'amabwiriza!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What shape are warning signs?',
          questionKiny: 'Ibimenyetso by\'iremenyo ni ibisuzwe biki?',
          options: ['Circle', 'Triangle', 'Rectangle', 'Diamond'],
          correctIndex: 1,
          explanation: 'Warning signs are triangular with a red border and white background.',
          explanationKiny: 'Ibimenyetso by\'iremenyo ni ibisuzwe bya triangle bifise impagarako y\'umutuku n\'umubiri mweru.',
        },
        {
          id: 2,
          question: 'A blue circular sign means:',
          questionKiny: 'Buruburu bw\'urub투 bisobanura:',
          options: ['Prohibition', 'Warning', 'Mandatory action', 'Information'],
          correctIndex: 2,
          explanation: 'Blue circular signs indicate mandatory actions — you MUST do what they show.',
          explanationKiny: 'Ibimenyetso bya buruburu bya burub투 biragaragara ibikwiye kubakoreshwa — usabwa kubikora.',
        },
        {
          id: 3,
          question: 'What do yellow zigzag lines on the road indicate?',
          questionKiny: 'Imizigororo zigzag y\'umuheto ku muhanda biragaragara iki?',
          options: ['Overtaking zone', 'No stopping or parking near schools', 'Speed bump ahead', 'Parking allowed'],
          correctIndex: 1,
          explanation: 'Yellow zigzag lines indicate a school zone where stopping and parking are prohibited.',
          explanationKiny: 'Imizigororo zigzag y\'umuheto biragaragara icyumba c\'isomero aho guhagarika n\'gutega birabujijwe.',
        },
        {
          id: 4,
          question: 'A solid yellow center line means:',
          questionKiny: 'Imizigororo y\'umweru y\'imfire bisobanura:',
          options: ['You can overtake', 'No crossing or overtaking', 'Road ends', 'One-way street'],
          correctIndex: 1,
          explanation: 'A solid yellow center line means you must not cross it to overtake.',
          explanationKiny: 'Imizigororo y\'umweru y\'imfire bisobanura ntukagurire kugira ngo ukagurire.',
        },
        {
          id: 5,
          question: 'Green rectangular signs on highways show:',
          questionKiny: 'Ibimenyetso bya rectangle y\'icyatsi ku muhanda mukuru biragaragara:',
          options: ['Speed limits', 'Directional guidance and distances', 'Warning hazards', 'Police checkpoints'],
          correctIndex: 1,
          explanation: 'Green rectangular signs provide directional guidance on highways, showing destinations and distances.',
          explanationKiny: 'Ibimenyetso bya rectangle y\'icyatsi biratanga amabwiriza y\'umuyoboro ku muhanda mukuru, biragaragara ahantu n\'intera.',
        },
      ],
    },
  },
  {
    courseId: 'road-signs-markings',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete this comprehensive assessment on road signs and markings. You need 70% or higher to pass.",
        textKiny: "Uzuze iyi isuzuma ryuzuye ku ibimenyetso by'umuhanda n'amabwiriza. Ushobora 70% cyangwa hejuru kugira ngo upasse.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Which sign category uses a red triangle?',            questionKiny: "Ibiciro by'ibimenyetso birikoresha triangle y'umutuku ni ibiki?",
          options: ['Regulatory', 'Informative', 'Warning', 'Temporary'],
          correctIndex: 2,
          explanation: 'Warning signs use a red triangle to alert drivers to hazards ahead.',            explanationKiny: "Ibimenyetso by'iremenyo birikoresha triangle y'umutuku kugira ngo biratangaze abashoferi ibyago bihari imbere.",
        },
        {
          id: 2,
          question: 'What does a red circular sign with a number indicate?',            questionKiny: "Buruburu bw'urub투 bufise umubare biragaragara iki?",
          options: ['Recommended speed', 'Maximum speed limit', 'Minimum speed', 'Distance to destination'],
          correctIndex: 1,
          explanation: 'A red circle with a number is a prohibitory sign indicating the maximum speed limit.',            explanationKiny: "Ubusuzwe bwa umutuku bufise umubare ni ibimenyetso by'ibikakata biragaragara umuvuduko usabirirwa.",
        },
        {
          id: 3,
          question: 'When you see a pedestrian crossing sign, you should:',
          questionKiny: "Igihe ubona ibimenyetso by'ibaho by'abagenzi, usabwa:",
          options: ['Speed up', 'Slow down and be prepared to stop', 'Honk your horn', 'Change lanes immediately'],
          correctIndex: 1,
          explanation: 'Pedestrian crossing signs warn you to slow down and be ready to yield to people crossing.',            explanationKiny: "Ibimenyetso by'ibaho by'abagenzi birakurinda kugira ngo uhagarare kandi uzi guhagarika abafata intambwe.",
        },
        {
          id: 4,
          question: 'What do white dashed lines between lanes mean?',            questionKiny: "Imizigororo y'umweru y'agace iri hagati y'intambwe bisobanura iki?",
          options: ['No crossing allowed', 'Lane changes permitted when safe', 'End of road', 'Bus lane only'],
          correctIndex: 1,
          explanation: 'White dashed lines separate lanes and permit lane changes when it is safe to do so.',            explanationKiny: "Imizigororo y'umweru y'agace itandukanya intambwe kandi yemera guhinduka iyo umutekano uriho.",
        },
        {
          id: 5,
          question: 'A blue circle with a white arrow is:',            questionKiny: "Ubusuzwe bwa buruburu bufise intebe y'umweru ni:",
          options: ['A warning', 'A prohibition', 'A mandatory direction', 'Information only'],
          correctIndex: 2,
          explanation: 'Blue circles with arrows indicate mandatory directions you must follow.',            explanationKiny: "Ibisuzwe bya buruburu bifise intebe biragaragara ibibaho by'ibikwiye kubakurikiza.",
        },
      ],
    },
  },
];

// ============================================================
// INTERSECTIONS, ROUNDABOUTS & RIGHT OF WAY
// ============================================================

const intersectionsLessons: LessonContent[] = [
  {
    courseId: 'intersections-roundabouts',
    lessonId: 1,
    type: 'text',
    title: 'Intersection Types Overview',
    titleKiny: "Ibiciro by'Ibigereranyo",
    content: [
      {
        type: 'paragraph',
        text: "Intersections are where most accidents happen. Understanding the different types helps you prepare for each one. In Rwanda, you'll encounter T-junctions, crossroads, roundabouts, and slip roads.",
        textKiny: "Ibigereranyo ni aho ibibazo bikendereye bihinduka. Kwizera ibiciro bitandukanye bigufasha gutegerezwa. Mu Rwanda, uzabona T-junctions, ibigereranyo, ibipimo, n'ibyotsi.",
      },
      {
        heading: 'Types of Intersections',
        headingKiny: 'Ibiciro by\'Ibigereranyo',
        type: 'list',
        items: [
          'T-Junction — where a minor road meets a major road at right angles',
          'Crossroads — two roads crossing each other, forming a + shape',
          'Roundabout — circular intersection with counter-clockwise flow',
          'Slip road — where roads merge or diverge at highway speed',
          'Staggered junction — offset T-junctions close together',
        ],
        itemsKiny: [
          'T-Junction — aho umuhanda muto sura umuhanda mukuru mu buryo bw\'imfuruka',
          'Ibigereranyo — imihanda ibiri itandukana, iri hagati y\'ibara ry\'+',
          'Ibipimo — ibigereranyo bya burub투 bifise icyotsi gikurikiranye',
          'Ibyotsi — aho imihanda itandukana cyangwa yongera umuvuduko w\'umuhanda mukuru',
          'Ibigereranyo bitandukanye — T-junctions zihambaye hafi y\'uburengeranzwa',
        ],
      },
      {
        type: 'tip',
        text: "Always slow down when approaching any intersection, even if you have the right of way. Other drivers may not follow the rules.",
        textKiny: "Neza neza heba umuvuduko igihe unjira mu bigereranyo, nubwo ufite icyubahiro. Abandi bashoferi bashobora kutakurikiza amategeko.",
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 2,
    type: 'text',
    title: 'T-Junctions & Crossroads',
    titleKiny: "Ibipimo n'Ibigereranyo",
    content: [
      {
        type: 'paragraph',
        text: "At T-junctions, the vehicle on the main road has priority. At crossroads without signs, yield to vehicles approaching from your right.",
        textKiny: "Mu T-junctions, imodoka iri ku muhanda mukuru ifite icyubahiro. Mu bigereranyo fatiza ibimenyetso, heba imodoka zurasohoka iburyo.",
      },
      {
        heading: 'Rules for T-Junctions',
        headingKiny: 'Amategeko ya T-Junctions',
        type: 'list',
        items: [
          'The minor road (the top of the T) must yield to the major road',
          'Look left, right, then left again before pulling out',
          'Use indicators early — at least 30 meters before turning',
          'If a stop sign is present, you must come to a complete stop',
        ],
        itemsKiny: [
          'Umuhanda muto (hejuru y\'T) usabwa guhagarika umuhanda mukuru',
          'Reba ibumoso, iburyo, hanyuma ibumoso nanone mbere yo gusohoka',
          'Koreshe ibibaho vuba — metersi 30 mbere yo guhinduka',
          'Niba hari ibimenyetso byo guhagarika, usabwa guhagarika burundu',
        ],
      },
      {
        heading: 'Rules for Crossroads',
        headingKiny: 'Amategeko ya Ibigereranyo',
        type: 'list',
        items: [
          'Without priority signs: yield to the vehicle on your right',
          'With priority signs: follow the signs',
          'When turning left, yield to oncoming traffic going straight',
          'When turning right, yield to oncoming traffic going straight or turning left',
        ],
        itemsKiny: [
          'Fatiza ibimenyetso by\'icyubahiro: heba imodoka iri iburyo',
          'Fite ibimenyetso by\'icyubahiro: kurikiza ibimenyetso',
          'Igihe uhinduka ibumoso, heba imodoka zurasohoka imbere',
          'Igihe uhinduka iburyo, heba imodoka zurasohoka imbere cyangwa zihinduka ibumoso',
        ],
      },
      {
        type: 'warning',
        text: "Never assume other drivers will yield. Always be prepared to stop, even when you have the right of way.",
        textKiny: "Ntukwire ko abandi bashoferi bashobora guhagarika. Neza neza utegerezwa guhagarika, nubwo ufite icyubahiro.",
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 3,
    type: 'video',
    title: 'Roundabout Rules',
    titleKiny: "Amategeko y'Ibipimo",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Roundabouts are becoming more common in Rwanda. They reduce accidents by slowing traffic and eliminating dangerous left turns. Here's how to navigate them correctly.",
        textKiny: "Ibipimo biragenda bisanzwe mu Rwanda. Biragabanya ibibazo mu buryo bwo gutema umutekano kandi birakurinda guhinduka gikomeye. Raba nuko urabigenjura neza.",
      },
      {
        heading: 'Entering a Roundabout',
        headingKiny: 'Kunjira mu Ibipimo',
        type: 'list',
        items: [
          'Yield to vehicles already in the roundabout',
          'Choose your lane before entering — right lane for right turns, left lane for left turns',
          'Enter when there is a safe gap in traffic',
          'Do not stop inside the roundabout unless traffic is blocked ahead',
        ],
        itemsKiny: [
          'Heba imodoka ziri mu ibipimo',
          'Hitamwo intambwe yawe mbere yo kunjira — intambwe y\'iburyo yo guhinduka iburyo, intambwe y\'ibumoso yo guhinduka ibumoso',
          'Njira ihari umwanya umutekano mu mutekano',
          'Ntuhagarika mu ibipimo niba umutekano urabujijwe imbere',
        ],
      },
      {
        heading: 'Inside the Roundabout',
        headingKiny: 'Mu Ibipimo',
        type: 'list',
        items: [
          'Keep moving — do not stop unless necessary',
          'Stay in your lane until you need to exit',
          'Use indicators to show your intended exit',
          'Watch for pedestrians at crossing points',
        ],
        itemsKiny: [
          'Komeza — ntuhagarika niba umutekano',
          'Guma mu intambwe yawe kugeza utegeka kugira ngo usohoke',
          'Koreshe ibibaho kugira ngo ugaragaze amahitamo yawe',
          'Reba abagenzi ku bice by\'intambwe',
        ],
      },
      {
        type: 'tip',
        text: "Think of a roundabout as a one-way street that goes in a circle. Follow the flow, signal your exit, and always yield to traffic already inside.",
        textKiny: "Wibure ibipimo nk\'umuhanda w\'umwe ukurikiranye umubiri. Kurikiza icyotsi, garagaza amahitamo yawe, kandi neza neza heba imodoka ziri mu ibipimo.",
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 4,
    type: 'interactive',
    title: 'Turning & Lane Changes',
    titleKiny: "Gujiangira n'Guhinduka",
    content: [
      {
        type: 'paragraph',
        text: "Safe turning requires proper lane positioning, correct signaling, and awareness of other road users. This interactive lesson covers turning techniques at intersections.",
        textKiny: "Guhinduka neza bisaba kwizera intambwe neza, kubisha neza, no kumenya abakoresha umuhanda. Iri somero riradukurikirana uburyo bwo guhinduka mu bigereranyo.",
      },
      {
        heading: 'Left Turn Procedure',
        headingKiny: 'Uburyo bwo Guhinduka Ibumoso',
        type: 'list',
        items: [
          '1. Check mirrors and blind spots',
          '2. Signal left at least 30 meters before the turn',
          '3. Move to the left lane or center of the road',
          '4. Yield to oncoming traffic and pedestrians',
          '5. Turn when clear, keeping to the left side of the road',
        ],
        itemsKiny: [
          '1. Reba intambwe n\'ibice bidakwiye',
          '2. Kisha ibumoso metersi 30 mbere yo guhinduka',
          '3. Jya mu intambwe y\'ibumoso cyangwa imbere y\'umuhanda',
          '4. Heba imodoka zurasohoka n\'abagenzi',
          '5. Hinduka igihe uracyariho, ukurikize iburyo bw\'umuhanda',
        ],
      },
      {
        heading: 'Right Turn Procedure',
        headingKiny: 'Uburyo bwo Guhinduka Iburyo',
        type: 'list',
        items: [
          '1. Check mirrors and blind spots',
          '2. Signal right at least 30 meters before the turn',
          '3. Move to the right edge of the road',
          '4. Yield to pedestrians and oncoming traffic',
          '5. Turn sharply into the correct lane',
        ],
        itemsKiny: [
          '1. Reba intambwe n\'ibice bidakwiye',
          '2. Kisha iburyo metersi 30 mbere yo guhinduka',
          '3. Jya ku impera y\'iburyo bw\'umuhanda',
          '4. Heba abagenzi n\'imodoka zurasohoka',
          '5. Hinduka neza mu intambwe y\'uburyo',
        ],
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 5,
    type: 'text',
    title: 'Priority at Intersections',
    titleKiny: "Icyubahiro mu Ibigereranyo",
    content: [
      {
        type: 'paragraph',
        text: "Understanding priority rules prevents confusion and accidents. In Rwanda, priority is determined by signs, road markings, and general rules.",
        textKiny: "Kwizera amategeko y'icyubahiro bigabanya ikibazo n'ibibazo. Mu Rwanda, icyubahiro kiratunganywa n'ibimenyetso, amabwiriza y'umuhanda, n'amategeko rusange.",
      },
      {
        heading: 'Priority Determination',
        headingKiny: 'Kubona Icyubahiro',
        type: 'list',
        items: [
          '1. Traffic signs — always obey posted priority signs first',
          '2. Traffic lights — follow the signals',
          '3. Road markings — yield lines and stop lines indicate priority',
          '4. General rule — yield to the vehicle on your right',
          '5. Emergency vehicles — always yield to ambulances, fire trucks, police',
        ],
        itemsKiny: [
          '1. Ibimenyetso by\'umuhanda — neza neza amategeko y\'icyubahiro mbere',
          '2. Amatara y\'umuhanda — kurikiza ibibaho',
          '3. Amabwiriza y\'umuhanda — imizigororo yo guhagarika n\'imizigororo yo guhagarika biragaragara icyubahiro',
          '4. Amategeko rusange — heba imodoka iri iburyo',
          '5. Imodoka y\'amabanga — neza neza heba amabanga, amabanga, amapolisi',
        ],
      },
      {
        heading: 'Common Priority Signs',
        headingKiny: 'Ibimenyetso by\'Icyubahiro Bisanzwe',
        type: 'list',
        items: [
          '🔺 Yellow diamond — you have priority',
          '🔺 Red triangle — you must yield',
          '🛑 Stop sign — complete stop required',
          '⚠️ Give way sign — yield to crossing traffic',
        ],
        itemsKiny: [
          '🔺 Diamond y\'umuheto — ufite icyubahiro',
          '🔺 Triangle y\'umutuku — usabwa guhagarika',
          '🛑 Ibimenyetso byo guhagarika — guhagarika burundu birabonetse',
          '⚠️ Ibimenyetso byo guhebera — heba imodoka zurasohoka',
        ],
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 6,
    type: 'interactive',
    title: 'Complex Scenario Practice',
    titleKiny: "Amahugurwa y'Imimerere",
    content: [
      {
        type: 'paragraph',
        text: "Practice navigating complex intersection scenarios. Each decision affects the outcome. Think carefully!",
        textKiny: "Jya ukiziriza kugenjura ibiciro by'ibigereranyo by'ubukire. Buri decisions iragira ingaruka. Gereza neza neza!",
      },
      {
        heading: 'Scenario: Multi-Lane Roundabout',
        headingKiny: 'Ibiciro: Ibipimo bya Intambwe Zingi',
        type: 'list',
        items: [
          '🚗 You approach a 2-lane roundabout in Kigali',
          '🚗 You need to take the third exit (turn left)',
          '🚗 A motorcycle is in the inner lane',
          '❓ What lane should you use and when should you exit?',
        ],
        itemsKiny: [
          '🚗 Urabona ibipimo bya intambwe 2 mu Kigali',
          '🚗 Ushobora kubona amahitamo ya gatatu (guhinduka ibumoso)',
          '🚗 Umamoto uri mu intambwe y\'imbere',
          '❓ Intambwe ki usabwa gukoresha n\'igihe usabwa kugira ngo usohoke?',
        ],
      },
      {
        heading: 'Scenario: Priority Intersection',
        headingKiny: 'Ibiciro: Igereranyo ry\'Icyubahiro',
        type: 'list',
        items: [
          '🚗 You approach an intersection with a priority sign',
          '🚗 An ambulance is approaching from the left with sirens on',
          '🚗 A pedestrian is waiting at the crosswalk',
          '❓ What is the correct sequence of actions?',
        ],
        itemsKiny: [
          '🚗 Urabona igereranyo rifise ibimenyetso by\'icyubahiro',
          '🚗 Amabanga arashohoka ibumoso afitise amabyo',
          '🚗 Umugenzi ari mu kibaho',
          '❓ Intambwe y\'uburyo bw\'ibikorwa ni iyi?',
        ],
      },
    ],
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your intersection and roundabout knowledge!",
        textKiny: "Gerageza ubumenyi bwawe bw'ibigereranyo n'ibipimo!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'At a crossroads with no signs, who has priority?',
          questionKiny: 'Mu bigereranyo fatiza ibimenyetso, nde afite icyubahiro?',
          options: ['The vehicle on the left', 'The vehicle on the right', 'The larger vehicle', 'The faster vehicle'],
          correctIndex: 1,
          explanation: 'Without priority signs, you must yield to vehicles approaching from your right.',
          explanationKiny: 'Fatiza ibimenyetso by\'icyubahiro, usabwa guhagarika imodoka zurasohoka iburyo.',
        },
        {
          id: 2,
          question: 'When entering a roundabout, you must:',
          questionKiny: 'Igihe unjira mu ibipimo, usabwa:',
          options: ['Enter immediately', 'Yield to vehicles already in the roundabout', 'Honk to signal entry', 'Stop and wait'],
          correctIndex: 1,
          explanation: 'Vehicles already in the roundabout have priority. Wait for a safe gap before entering.',
          explanationKiny: 'Imodoka ziri mu ibipimo zifite icyubahiro. Utangire umwanya umutekano mbere yo kunjira.',
        },
        {
          id: 3,
          question: 'At a T-junction, the vehicle on the minor road must:',
          questionKiny: 'Mu T-junction, imodoka iri ku muto usabwa:',
          options: ['Proceed without stopping', 'Yield to traffic on the major road', 'Turn left only', 'Speed up'],
          correctIndex: 1,
          explanation: 'The minor road (top of the T) must yield to the major road.',
          explanationKiny: 'Umuhanda muto (hejuru ya T) usabwa guhagarika umuhanda mukuru.',
        },
        {
          id: 4,
          question: 'When turning left at an intersection, you must yield to:',
          questionKiny: 'Igihe uhinduka ibumoso mu igereranyo, usabwa guhagarika:',
          options: ['Vehicles behind you', 'Oncoming traffic going straight', 'Pedestrians only', 'No one'],
          correctIndex: 1,
          explanation: 'When turning left, you must yield to oncoming traffic going straight.',
          explanationKiny: 'Igihe uhinduka ibumoso, usabwa guhagarika imodoka zurasohoka imbere.',
        },
        {
          id: 5,
          question: 'What should you do when approaching an intersection with a give way sign?',
          questionKiny: 'Igihe urabona igereranyo rifise ibimenyetso byo guhebera, icyo ukwiye kubikora:',
          options: ['Speed through', 'Slow down and be prepared to stop', 'Change lanes', ' honk'],
          correctIndex: 1,
          explanation: 'A give way sign means you must slow down and yield to crossing traffic.',
          explanationKiny: 'Ibimenyetso byo guhebera bisobanura usabwa guhagarika neza no guhagarika imodoka zurasohoka.',
        },
      ],
    },
  },
  {
    courseId: 'intersections-roundabouts',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the comprehensive intersection assessment. Score 70% or higher to pass.",
        textKiny: "Uzuze isuzuma ryuzuye ry\'ibigereranyo. Ushobora 70% cyangwa hejuru kugira ngo upasse.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Which intersection type uses circular traffic flow?',
          questionKiny: 'Ibiciro by\'igereranyo birikoresha icyotsi gikurikiranye ni ibiki?',
          options: ['T-Junction', 'Crossroads', 'Roundabout', 'Slip road'],
          correctIndex: 2,
          explanation: 'Roundabouts use circular traffic flow with counter-clockwise movement.',
          explanationKiny: 'Ibipimo birikoresha icyotsi gikurikiranye n\'ukugenda mu rupfu.',
        },
        {
          id: 2,
          question: 'When should you signal before turning at an intersection?',
          questionKiny: 'Igihe ki usabwa kugira ngo ukishe mbere yo guhinduka mu igereranyo?',
          options: ['5 meters before', 'At the intersection', 'At least 30 meters before', 'Only if someone is behind you'],
          correctIndex: 2,
          explanation: 'Signal at least 30 meters before turning to give other road users time to react.',
          explanationKiny: 'Kisha metersi 30 mbere yo guhinduka kugira ngo uhe abakoresha umuhanda igihe bwo gutegura.',
        },
        {
          id: 3,
          question: 'At a roundabout, which lane should you use for a right turn (first exit)?',
          questionKiny: 'Mu ibipimo, intambwe ki usabwa gukoresha yo guhinduka iburyo (amahitamo ya mbere)?',
          options: ['Left lane', 'Right lane', 'Center lane', 'Any lane'],
          correctIndex: 1,
          explanation: 'Use the right lane for the first exit (right turn) at a roundabout.',
          explanationKiny: 'Koreshe intambwe y\'iburyo yo amahitamo ya mbere (guhinduka iburyo) mu ibipimo.',
        },
        {
          id: 4,
          question: 'What must you do at a stop sign?',
          questionKiny: 'Icyo usabwa kubikora ku ibimenyetso byo guhagarika ni iki?',
          options: ['Slow down', 'Come to a complete stop', 'Stop only if cars are present', 'Yield and proceed'],
          correctIndex: 1,
          explanation: 'A stop sign requires a complete stop, regardless of traffic conditions.',
          explanationKiny: 'Ibimenyetso byo guhagarika bisaba guhagarika burundu, nta kibazo cy\'imimerere y\'umutekano.',
        },
        {
          id: 5,
          question: 'Emergency vehicles always have:',
          questionKiny: 'Imodoka y\'amabanga daimo bifite:',
          options: ['No special priority', 'Priority only at traffic lights', 'Absolute priority', 'Priority only on highways'],
          correctIndex: 2,
          explanation: 'Emergency vehicles (ambulance, fire, police) always have absolute priority. You must yield immediately.',
          explanationKiny: 'Imodoka y\'amabanga (amabanga, inkunga, amapolisi) daimo bifite icyubahiro cy\'uburundu. Usabwa guhagarika amahoro.',
        },
      ],
    },
  },
];

// ============================================================
// PRACTICAL DRIVING SKILLS
// ============================================================

const practicalSkillsLessons: LessonContent[] = [
  {
    courseId: 'practical-driving-skills',
    lessonId: 1,
    type: 'video',
    title: 'Parking Techniques',
    titleKiny: "Uburyo bwo Gutega",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Parking is one of the most stressful situations for new drivers. This video covers parallel parking, perpendicular parking, and angle parking techniques used in Rwanda.",
        textKiny: "Gutega ni imimerere imwe y'ibibazo ku bashoferi bashya. Iri video riradukurikirana uburyo bwo gutega, gutega mu buryo bw'imfire, n'uburyo bwo gutega mu buryo bw'umubato birikoreshwa mu Rwanda.",
      },
      {
        heading: 'Parallel Parking Steps',
        headingKiny: 'Intambwe zo Gutega mu Buryo bw\'Imfire',
        type: 'list',
        items: [
          '1. Find a space at least 1.5x the length of your car',
          '2. Pull up alongside the car in front, about 1 meter away',
          '3. Reverse slowly while turning the steering wheel fully right',
          '4. When your rear bumper aligns with theirs, turn the wheel fully left',
          '5. Continue reversing until you are straight and centered',
          '6. Adjust position as needed',
        ],
        itemsKiny: [
          '1. Rondera umwanya w\'uburebure bw\'ibinyabiziga by\'imodoka yawe',
          '2. Jya hafi y\'imodoka iri imbere, hagati ya meteri 1',
          '3. Garuka neza uri guhindura umupira wo kugenzura wose iburyo',
          '4. Igihe imbere yawe iri na yo iri, uhindure umupira wose ibumoso',
          '5. Komeza kugaruka kugeza ujya neza no mu mutongo',
          '6. Hindura ahantu ukeneye',
        ],
      },
      {
        heading: 'Perpendicular Parking',
        headingKiny: 'Gutega mu Buryo bw\'Imfire',
        type: 'list',
        items: [
          'Approach at a 90-degree angle to the parking space',
          'Signal your intent to park',
          'Turn into the space when your mirror aligns with the dividing line',
          'Straighten the wheel and pull forward until centered',
        ],
        itemsKiny: [
          'Jya hafi y\'umwanya wo gutega mu buryo bw\'umubato',
          'Garagaza intego yawe yo gutega',
          'Hinduka mu mwanya iyo intambwe yawe iri na yo iri',
          'Neza umupira kandi uhinduke umberi kugeza mu mutongo',
        ],
      },
      {
        type: 'tip',
        text: "Practice parking in an empty lot before doing it in traffic. Start with perpendicular parking (easiest), then parallel parking (hardest).",
        textKiny: "Jya ukiziriza gutega mu buryo bw\'ubusitani busa mbere yo kugikora mu mutekano. Tangira gutega mu buryo bw\'imfire (oroshe), hanyuma gutega mu buryo bw\'imfire (bikomeye).",
      },
    ],
  },
  {
    courseId: 'practical-driving-skills',
    lessonId: 2,
    type: 'text',
    title: 'Overtaking Safely',
    titleKiny: "Gukwiza Neza",
    content: [
      {
        type: 'paragraph',
        text: "Overtaking is one of the most dangerous maneuvers. In Rwanda, improper overtaking causes a significant number of fatal accidents. Only overtake when it is safe and legal.",
        textKiny: "Gukwiza ni imwe mu mikorere yo mu bushinu cane. Mu Rwanda, gutinda neza birabangamye ibibazo byinshi. Gutinda gusa iyo umutekano n'amategeko bimeze neza.",
      },
      {
        heading: 'When to Overtake',
        headingKiny: 'Igihe yo Gutinda',
        type: 'list',
        items: [
          '✅ The road ahead is clear and straight',
          '✅ You can see far enough to complete the maneuver safely',
          '✅ There is no solid center line (overtaking is prohibited)',
          '✅ No signs prohibit overtaking',
          '✅ You have enough power to pass quickly',
        ],
        itemsKiny: [
          '✅ Umuhanda umberi uracyariho kandi warazubye',
          '✅ Urashobora kubona intera ugikorera neza',
          '✅ Hari imizigororo y\'imfire (gutinda byabujijwe)',
          '✅ Nta menyetso y\'ibikakata yo gutinda',
          '✅ Ufite amashya yo gutinda vuba',
        ],
      },
      {
        heading: 'When NOT to Overtake',
        headingKiny: 'Igihe Ntuvye Gutinda',
        type: 'list',
        items: [
          '❌ Approaching a curve, hill, or intersection',
          '❌ Solid center line or no-overtaking sign',
          '❌ Reduced visibility (rain, fog, night)',
          '❌ Another vehicle is already overtaking',
          '❌ Pedestrians or animals are near the road',
        ],
        itemsKiny: [
          '❌ Urabona imisozi, ikiyaga, cyangwa igereranyo',
          '❌ Imizigororo y\'imfire cyangwa ibimenyetso byo kutatinda',
          '❌ Ubukobwa buke (imvura, icyumba, ijoro)',
          '❌ Imodoka y\'abandi ari gutinda',
          '❌ Abagenzi cyangwa inkunga ziri hafi y\'umuhanda',
        ],
      },
      {
        type: 'warning',
        text: "In Rwanda, overtaking on the left is generally prohibited except on multi-lane roads. Always overtake on the right side of the vehicle ahead.",
        textKiny: "Mu Rwanda, gutinda ibumoso birabujijwe usibye ku muhanda mukuru. Daimo gutinda iburyo bw\'imodoka iri imbere.",
      },
    ],
  },
  {
    courseId: 'practical-driving-skills',
    lessonId: 3,
    type: 'interactive',
    title: 'Lane Discipline',
    titleKiny: "Kuburanga mu Muhanda",
    content: [
      {
        type: 'paragraph',
        text: "Proper lane discipline means staying in the correct lane for your speed and intended direction. It reduces confusion and prevents accidents.",
        textKiny: "Kuburanga neza mu muhanda bisobanura kuguma mu intambwe y\'uburyo bw\'umuvuduko n\'umuyoboro wo guhinduka. Biragabanya ikibazo kandi birinda ibibazo.",
      },
      {
        heading: 'Lane Usage Rules',
        headingKiny: 'Amategeko y\'Intambwe',
        type: 'list',
        items: [
          'Drive in the left lane on single-carriageway roads',
          'Use the right lane for overtaking on multi-lane roads',
          'Return to the left lane after overtaking',
          'Match your lane to your intended turn well in advance',
          'Never straddle two lanes',
        ],
        itemsKiny: [
          'Baga mu intambwe y\'ibumoso ku muhanda w\'intambwe imwe',
          'Koreshe intambwe y\'iburyo yo gutinda ku muhanda mukuru',
          'Subira mu intambwe y\'ibumoso nyuma yo gutinda',
          'Egeranya intambwe yawe n\'umuyoboro wo guhinduka mbere',
          'Daimo ntukagurire intambwe ebyiri',
        ],
      },
      {
        type: 'tip',
        text: "Good lane discipline means planning ahead. Check your GPS or map before the turn so you're in the correct lane early.",
        textKiny: "Kuburanga neza mu muhanda bisobanura gutegura mbere. Reba GPS yawe cyangwa urupapuro mbere yo guhinduka kugira ngo ujye mu intambwe y\'uburyo mbere.",
      },
    ],
  },
  {    courseId: 'practical-driving-skills',
    lessonId: 4,
    type: 'video',
    title: 'Highway Driving',
    titleKiny: "Kubaga ku Muhanda Mukuru",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Highway driving in Rwanda involves higher speeds, merging traffic, and special rules. This video covers everything you need to know for safe highway travel.",
        textKiny: "Kubaga ku muhanda mukuru mu Rwanda bisabisha umuvuduko mwinshi, umutekano uri mu bice, n'amategeko yihariye. Iri video riradukurikirana ibintu byose ukeneye kumenya kugira ngo uruge ruhinde neza.",
      },
      {
        heading: 'Highway Rules',
        headingKiny: 'Amategeko y\'Umuhanda Mukuru',
        type: 'list',
        items: [
          'Use the acceleration lane to match highway speed before merging',
          'Stay in the left lane unless overtaking',
          'Maintain at least 2 seconds of following distance',
          'Use indicators early when changing lanes or exiting',
          'Check mirrors every 5-8 seconds on the highway',
          'Never stop on the highway unless in an emergency',
        ],
        itemsKiny: [
          'Koreshe intambwe y\'umuvuduko kugira ngo ugereranye umuvuduko w\'umuhanda mukuru mbere yo kwinjira',
          'Guma mu intambwe y\'ibumoso usibye gutinda',
          'Kubungabunga amasegonda 2 y\'intero',
          'Koreshe ibibaho vuba igihe uhinduka intambwe cyangwa usohoka',
          'Reba intambwe buri seconde 5-8 ku muhanda mukuru',
          'Daimo ntuhagarika ku muhanda mukuru usibye mu banga',
        ],
      },
      {
        heading: 'Merging Safely',
        headingKiny: 'Kwinjira mu Mutekano',
        type: 'list',
        items: [
          'Match the speed of highway traffic before merging',
          'Use the acceleration lane to get up to speed',
          'Find a gap and merge smoothly',
          'Yield to traffic already on the highway',
        ],
        itemsKiny: [
          'Ugereranye umuvuduko w\'imodoka y\'umuhanda mukuru mbere yo kwinjira',
          'Koreshe intambwe y\'umuvuduko kugira ngo ufite umuvuduko',
          'Rondera umwanya kandi winjire neza',
          'Heba umutekano uri ku muhanda mukuru',
        ],
      },
    ],
  },
  {
    courseId: 'practical-driving-skills',
    lessonId: 5,
    type: 'text',
    title: 'Decision Making Under Pressure',
    titleKiny: "Gukemura mu Bikorwa",
    content: [
      {
        type: 'paragraph',
        text: "Driving often requires split-second decisions. Learning to make safe decisions under pressure is what separates good drivers from great ones.",
        textKiny: "Kubaga bifite ibintu byinshi birabereye mu gihe gito. Kwizera gukemura neza mu gihe birabereye ni icyo gitandukanya abashoferi b'urwego rwo hejuru.",
      },
      {
        heading: 'Decision Making Framework',
        headingKiny: 'Uburyo bwo Gukemura',
        type: 'list',
        items: [
          'SCAN — Look for hazards and potential problems',
          'IDENTIFY — Determine the most dangerous possibility',
          'DECIDE — Choose the safest action',
          'ACT — Execute the decision smoothly and decisively',
        ],
        itemsKiny: [            'KUBONA — Reba ibyago n\'ibibazo bihari',
            'KUMENYA — Menya intambwe yo mu bushinu cane',
            'GUKEMURA — Hitamwo igikorwa c\'umutekano cane',
            'GUKORA — Tegeka neza no mu buryo bw\'uburundu',
        ],
      },
      {
        heading: 'Common Pressure Situations',
        headingKiny: 'Imimerere y\'Igihe',
        type: 'list',
        items: [
          'Sudden obstacle in the road — brake or swerve?',
          'Vehicle approaching head-on — brake or pull over?',
          'Pedestrian in the road — swerve or emergency brake?',
          'Red light about to change — stop or go through?',
        ],
        itemsKiny: [
          'Icintu gihari mu muhanda — guhagarika cyangwa guhinduka?',
          'Imodoka zurasohoka — guhagarika cyangwa kujya ku buryo?',
          'Umugenzi uri mu muhanda — guhinduka cyangwa guhagarika vuba?',
          'Amatara y\'umutuku aza guhinduka — guhagarika cyangwa kujya?',
        ],
      },
      {
        type: 'warning',
        text: "When in doubt, brake. It's almost always safer to slow down than to swerve, especially at high speeds.",
        textKiny: "Igihe ufise ikibazo, guhagarika. Biroroshe cane kugira ngo uhagarare kuruta guhinduka, cyane ku muvuduko mwinshi.",
      },
    ],
  },
  {    courseId: 'practical-driving-skills',
    lessonId: 6,
    type: 'interactive',
    title: 'Real-World Scenarios',
    titleKiny: "Ibiciro by'Umusi wose",
    content: [
      {
        type: 'paragraph',
        text: "Apply everything you've learned in these realistic driving scenarios. Each situation requires quick thinking and safe decision-making.",
        textKiny: "Koresha ibintu byose wize mu ibiciro by\'ubukire by\'ubukorwa. Buri imimerere bisaba ubwumenyi bw\'ubukire n\'ukuboneza neza.",
      },
      {
        heading: 'Scenario: Highway Overtake',
        headingKiny: 'Ibiciro: Gutinda ku Muhanda Mukuru',
        type: 'list',
        items: [
          '🚗 You are on a 2-lane highway at 80 km/h',
          '🚛 A truck ahead is going 50 km/h',
          '🚗 A car is approaching in the opposite direction',
          '❓ When is it safe to overtake?',
        ],
        itemsKiny: [
          '🚗 Urabaga ku muhanda mukuru wa intambwe 2 ku 80 km/h',
          '🚛 Igihe iri imbere irabaga ku 50 km/h',
          '🚗 Imodoka zurasohoka mu bwoko bw\'iburyo',
          '❓ Igihe ki umutekano wo gutinda?',
        ],
      },
      {
        heading: 'Scenario: City Parking',
        headingKiny: 'Ibiciro: Gutega mu Mujyi',
        type: 'list',
        items: [
          '🚗 You need to park in a busy Kigali street',
          '🚗 There is a parallel space between two cars',
          '🚶 Pedestrians are walking nearby',
          '❓ How do you park safely without blocking traffic?',
        ],
        itemsKiny: [
          '🚗 Usabwa gutega ku muhanda w\'Umujyi wa Kigali',
          '🚗 Hari umwanya wo gutega mu buryo bw\'imfire hagati y\'imodoka ebyiri',
          '🚶 Abagenzi barafata intambwe hafi',
          '❓ Nuko uratenga neza utabuza umutekano?',
        ],
      },
    ],
  },
  {
    courseId: 'practical-driving-skills',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your practical driving knowledge!",
        textKiny: "Gerageza ubumenyi bwawe bw\'ubukorwa bw\'ubukorwa!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'How much space should you leave when overtaking a motorcycle?',
          questionKiny: 'Intambwe ki usabwa kureka igihe utinda umamoto?',
          options: ['0.5 meters', '1 meter', '2 meters', '3 meters'],
          correctIndex: 1,
          explanation: 'Give motorcycles at least 1 meter of space when passing to ensure their safety.',
          explanationKiny: 'Heba amamoto meteri 1 y\'umwanya igihe ukagurira kugira ngo umutekano wabo wemeze.',
        },
        {
          id: 2,
          question: 'When parallel parking, the space should be:',
          questionKiny: 'Igihe utenga mu buryo bw\'imfire, umwanya usabwa kuba:',
          options: ['The same length as your car', 'At least 1.5x your car length', 'Twice your car length', 'Any size works'],
          correctIndex: 1,
          explanation: 'The space should be at least 1.5 times the length of your car for safe parallel parking.',
          explanationKiny: 'Umwanya usabwa kuba meteri 1.5 by\'uburebure bw\'imodoka yawe kugira ngo utenge neza mu buryo bw\'imfire.',
        },
        {
          id: 3,
          question: 'On a highway, which lane should you use when not overtaking?',
          questionKiny: 'Ku muhanda mukuru, intambwe ki usabwa gukoresha iyo utinda?',
          options: ['Right lane', 'Left lane', 'Center lane', 'Shoulder'],
          correctIndex: 1,
          explanation: 'In Rwanda, the left lane is the driving lane. Use the right lane only for overtaking.',
          explanationKiny: 'Mu Rwanda, intambwe y\'ibumoso ni intambwe yo kubaga. Koreshe intambwe y\'iburyo gusa yo gutinda.',
        },
        {
          id: 4,
          question: 'When approaching a red light that is about to change, you should:',
          questionKiny: 'Igihe urabona amatara y\'umutuku aza guhinduka, usabwa:',
          options: ['Speed up to get through', 'Slow down and prepare to stop', 'Honk to warn others', 'Swerve around it'],
          correctIndex: 1,
          explanation: 'Slow down and prepare to stop. Never speed up to beat a changing light.',
          explanationKiny: 'Heba umuvuduko kandi utegereze guhagarika. Daimo ntuhane umuvuduko kugira ngo utege amatara.',
        },
        {
          id: 5,
          question: 'What is the correct decision-making framework for driving?',
          questionKiny: 'Uburyo bwo gukemura neza bw\'ubukorwa ni ubu?',
          options: ['Brake first, ask questions later', 'Scan, Identify, Decide, Act', 'Honk, swerve, brake', 'Follow the car ahead'],
          correctIndex: 1,
          explanation: 'The SCAN-IDENTIFY-DECIDE-ACT framework helps you make safe decisions systematically.',
          explanationKiny: 'Uburyo bwo KUBONA-KUMENYA-GUKEMURA-GUKORA bushobora gukugufasha gukemura neza mu buryo bw\'uburundu.',
        },
      ],
    },
  },
  {
    courseId: 'practical-driving-skills',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the practical driving skills assessment. Score 70% or higher to pass.",
        textKiny: "Uzuze isuzuma ryuzuye ry\'ubushobozi bwo kubaga. Ushobora 70% cyangwa hejuru kugira ngo upasse.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'When overtaking on a highway, you should:',
          questionKiny: 'Igihe utinda ku muhanda mukuru, usabwa:',
          options: ['Overtake on the left', 'Overtake on the right', 'Not overtake on highways', 'Overtake on the shoulder'],
          correctIndex: 1,
          explanation: 'On multi-lane highways, overtake on the right (passing lane).',
          explanationKiny: 'Ku muhanda mukuru w\'intambwe zingi, utinda iburyo (intambwe yo gutinda).',
        },
        {
          id: 2,
          question: 'For perpendicular parking, you should approach at:',
          questionKiny: 'Ku gutega mu buryo bw\'imfire, usabwa kubona:',
          options: ['45-degree angle', '90-degree angle', '180-degree angle', 'Any angle'],
          correctIndex: 1,
          explanation: 'Perpendicular parking means approaching at a 90-degree angle to the parking space.',
          explanationKiny: 'Gutega mu buryo bw\'imfire bisobanura kubona mu buryo bw\'imfire bw\'umubato mu mwanya wo gutega.',
        },
        {
          id: 3,
          question: 'When merging onto a highway, you should:',
          questionKiny: 'Igihe winjira mu muhanda mukuru, usabwa:',
          options: ['Enter at low speed', 'Match highway speed before merging', 'Stop at the merge point', ' honk to warn others'],
          correctIndex: 1,
          explanation: 'Use the acceleration lane to match highway speed before merging into traffic.',
          explanationKiny: 'Koreshe intambwe y\'umuvuduko kugira ngo ugereranye umuvuduko w\'umuhanda mukuru mbere yo kwinjira mu mutekano.',
        },
        {
          id: 4,
          question: 'When in doubt while driving, the safest action is usually to:',
          questionKiny: 'Igihe ufise ikibazo mu kubaga, igikorwa c\'umutekano cane ni:',
          options: ['Speed up', 'Brake', 'Swerve', 'Honk'],
          correctIndex: 1,
          explanation: 'When in doubt, brake. Slowing down is almost always safer than swerving.',
          explanationKiny: 'Igihe ufise ikibazo, guhagarika. Guhagarika neza biroroshe cane kuruta guhinduka.',
        },
        {
          id: 5,
          question: 'You should NOT overtake when:',
          questionKiny: 'Ntuvye gutinda igihe:',
          options: ['The road is straight and clear', 'Approaching a curve or hill', 'You have a powerful car', 'It is daytime'],
          correctIndex: 1,
          explanation: 'Never overtake when approaching a curve, hill, or intersection where visibility is limited.',
          explanationKiny: 'Daimo ntutinde igihe urabona imisozi, ikiyaga, cyangwa igereranyo aho ubukobwa buke.',
        },
      ],
    },
  },
];

// ============================================================
// ADVANCED DEFENSIVE DRIVING & EMERGENCY MANEUVERS
// ============================================================

const advancedDefensiveLessons: LessonContent[] = [
  {
    courseId: 'advanced-defensive-driving',
    lessonId: 1,
    type: 'text',
    title: 'Principles of Advanced Defensive Driving',
    titleKiny: "Amategeko y\'Kubaga mu Rwanda mu Buryo Bworoshe",
    content: [
      {
        type: 'paragraph',
        text: "Advanced defensive driving goes beyond basic safety. It requires anticipating danger before it exists, maintaining vehicle control in extreme conditions, and making split-second life-saving decisions.",
        textKiny: "Kubaga neza bw'ikigereranyo birasohoka ku mutungo wa mbere w'umutekano. Bisaba gutegura ibyago mbere yo kubaho, kubungabunga ingabu y'imodoka mu myimerere, no gukemura ibyemezo bifite ubuzima mu gihe gito.",
      },
      {
        heading: 'Core Principles',
        headingKiny: 'Amategeko Y\'ingenzi',
        type: 'list',
        items: [
          'Maintain a 360-degree awareness at all times — check mirrors every 5-8 seconds',
          'Always have an escape route — never box yourself in',
          'Drive to the conditions, not the speed limit',
          'Assume other drivers will make mistakes',
          'Keep your vehicle in peak condition for maximum control',
        ],
        itemsKiny: [
          'Kubungabunga ubusinzi bwa digri 360 daimo — reba intambwe buri seconde 5-8',
          'Daimo ufite uruhya — ntukwiye kwishyira mu ntambwe',
          'Baga ukurikije imimerere, sibo umuvuduko usabirirwa',
          'Wibure ko abandi bashoferi bazakora ubusanzwe',
          'Kubungabunga imodoka yawe mu myimerere yose kugira ngo ufite ingabu yose',
        ],
      },
      {
        heading: 'The SIPDE System',
        headingKiny: 'Uburyo bwa SIPDE',
        type: 'list',
        items: [
          'Scan — constantly look 12-15 seconds ahead',
          'Identify — spot potential hazards early',
          'Predict — anticipate what might happen next',
          'Decide — choose the safest response',
          'Execute — act smoothly and decisively',
        ],
        itemsKiny: [
          'KUBONA — neza neza amasegonda 12-15 imbere',
          'KUMENYA — menya ibyago bihari mbere',
          'GUTEGEKA — utegereze ibyo birashobora gusohokera',            'GUKEMURA — hitamwo icyemezo c\'umutekano cane',
            'GUKORA — korera neza no mu buryo bw\'uburundu',
        ],
      },
      {
        type: 'tip',
        text: "Advanced drivers never stop learning. Every drive is practice for the moment when quick thinking saves a life.",
        textKiny: "Abashoferi b'urwego rwo hejuru ntibahagarara kwiga. Buri kubaga ni amahugurwa y'igihe ubwumenyi bw'ubukire bubuza ubuzima.",
      },
    ],
  },
  {
    courseId: 'advanced-defensive-driving',
    lessonId: 2,
    type: 'interactive',
    title: 'Skid Control & Recovery',
    titleKiny: "Kugenzura Gukubita no Kwiyubuka",
    content: [
      {
        type: 'paragraph',
        text: "A skid happens when your tires lose grip with the road. Knowing how to control and recover from a skid can prevent a serious accident.",
        textKiny: "Gukubita birahera igihe utugiti twawe tubura ubusinzi n'umuhanda. Kwizera uko ukagurira no kugaruka gukubita birashobora kugira ngo ukande ibibazo bikomeye.",
      },
      {
        heading: 'Types of Skids',
        headingKiny: 'Ibiciro by\'Gukubita',
        type: 'list',
        items: [
          'Front-wheel skid — steering feels unresponsive, car plows straight ahead',
          'Rear-wheel skid — back of the car slides out (oversteer)',
          'Hydroplaning — tires ride on water, losing all contact with road',
          'Brake lock-up — wheels stop spinning, car slides during braking',
        ],
        itemsKiny: [            'Gukubita kw\'imbere — umupira w\'ikagurira udakwiye, imodoka irasohoka imbere',
            'Gukubita kw\'inyuma — inyuma y\'imodoka irasohoka (oversteer)',
            'Gukubita mu mazi — utugiti tuba mu mazi, tubura ubusinzi bwose n\'umuhanda',
            'Guhagarika — utugiti tuhagarara, imodoka irasohoka mu gihe cyo guhagarika',
        ],
      },
      {
        heading: 'Recovery Technique',
        headingKiny: 'Uburyo bwo Kugaruka',
        type: 'list',
        items: [
          '1. Stay calm — do not slam the brakes',
          '2. Look where you want to go (not at the obstacle)',
          '3. Steer gently into the skid (turn wheels in the direction the rear is sliding)',
          '4. Ease off the accelerator',
          '5. If ABS activates, maintain firm pressure on the brake',
        ],
        itemsKiny: [
          '1. Guma utacyariho — ntuhakane amaboko',
          '2. Reba aho ushaka kujya (sico icyago)',
          '3. Kagura neza mu gukubita (hindura utugiti mu buryo bw\'inyuma irasohoka)',
          '4. Erekana accelerator',
          '5. Niba ABS yakora, komeza ubusinzi bw\'iboko',
        ],
      },
      {
        type: 'warning',
        text: "Never use cruise control on wet or slippery roads. It can cause loss of control during a skid.",
        textKiny: "Daimo ntukoreshe cruise control ku muhanda ufise amazi cyangwa udakoroha. Birashobora gutuma ubura ingabu mu gihe cyo gukubita.",
      },
    ],
  },
  {    courseId: 'advanced-defensive-driving',
    lessonId: 3,
    type: 'video',
    title: 'Emergency Braking Techniques',
    titleKiny: "Uburyo bwo Guhagarika Vuba",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Emergency braking requires different techniques depending on your vehicle. This video demonstrates ABS and non-ABS braking on various surfaces.",
        textKiny: "Guhagarika vuba bisaba uburyo butandukanye ukurikije imodoka yawe. Iri video rigaragara guhagarika ABS n'ubwo si ABS ku buryo bwinshi.",
      },
      {
        heading: 'With ABS (Anti-lock Braking System)',
        headingKiny: 'Na ABS (Uburyo bwo Guhagarika)',
        type: 'list',
        items: [
          'Press the brake pedal firmly and hold it down',
          'Do NOT pump the brakes — ABS does this automatically',
          'Steer around obstacles while braking',
          'Feel the pulsing — that is normal ABS operation',
        ],
        itemsKiny: [
          'Kanda iboko rya guhagarika neza no guhora riri hasi',
          'NTUHAKANE amaboko — ABS yakora iki mwonyine',
          'Kagura ibice by\'ibyago igihe uguhagarika',
          'Uvuge gukubita — ni uburyo bwa ABS bw\'ubusanzwe',
        ],
      },
      {
        heading: 'Without ABS',
        headingKiny: 'Nta ABS',
        type: 'list',
        items: [
          'Apply brakes firmly but not to lock-up',
          'If wheels lock, slightly release pressure then reapply',
          'Threshold braking: brake at the point just before lock-up',
          'Straighten the wheel before braking hard',
        ],
        itemsKiny: [
          'Koresha amaboko neza aho utakagurira',
          'Niba utugiti tugahagarika, neza neza ubusinzi hanyuma ukongere',
          'Guhagarika: guhagarika aho usabwa guhagarika mbere yo gutera',
          'Neza umupira mbere yo guhagarika neza',
        ],
      },
      {
        type: 'tip',
        text: "Practice emergency braking in a safe, empty area. Knowing how your car responds in an emergency builds muscle memory.",
        textKiny: "Jya ukiziriza guhagarika vuba mu ahantu umutekano, husa. Kwizera uko imodoka yawe yemeze mu banga biragira ubusinzi bw'ibihaha.",
      },
    ],
  },
  {    courseId: 'advanced-defensive-driving',
    lessonId: 4,
    type: 'interactive',
    title: 'Evasive Maneuvers',
    titleKiny: "Uburyo bwo Kwirinda Ibyago",
    content: [
      {
        type: 'paragraph',
        text: "Sometimes you cannot stop in time. Evasive maneuvers help you avoid obstacles while maintaining control of your vehicle.",
        textKiny: "Amaze usibye guhagarika mu gihe. Uburyo bwo kwirinda ibyago bikugufasha gukemura ibyago ukurikize ingabu y'imodoka yawe.",
      },
      {
        heading: 'The Avoidance Sequence',
        headingKiny: 'Intambwe z\'Gukemura',
        type: 'list',
        items: [
          '1. Brake hard in a straight line (before swerving)',
          '2. Release the brake momentarily',
          '3. Steer around the obstacle quickly but smoothly',
          '4. Steer back to your lane',
          '5. Reapply brakes if needed',
        ],
        itemsKiny: [
          '1. Guhagarika neza mu murongo umwe (mbere yo guhinduka)',
          '2. Erekana guhagarika mu gihe gito',
          '3. Kagura ibice by\'ibyago vuba aho utakoroha',
          '4. Subira mu intambwe yawe',
          '5. Kongera guhagarika niba ukeneye',
        ],
      },
      {
        heading: 'Key Rules',
        headingKiny: 'Amategeko Y\'ingenzi',
        type: 'list',
        items: [
          'Always brake first, then steer — never swerve at high speed',
          'Look where you want to go, not at the obstacle',
          'Use smooth, controlled steering inputs',
          'Be aware of vehicles in adjacent lanes before swerving',
          'Practice in a safe environment before needing it on the road',
        ],
        itemsKiny: [
          'Daimo guhagarika mbere, hanyuma kagura — daimo ntuhinduke ku mvuduko mwinshi',
          'Reba aho ushaka kujya, si ibyago',
          'Koreshe uburyo bwo kagura bw\'ubusinzi n\'uburundu',
          'Uzi neza imodoka ziri mu ntambwe z\'ibumoso mbere yo guhinduka',
          'Jya ukiziriza mu ahantu umutekano mbere yo kubikeneye ku muhanda',
        ],
      },
      {
        type: 'warning',
        text: "Swerving at high speed without braking first can cause a rollover. Always brake in a straight line before attempting to steer around an obstacle.",
        textKiny: "Guhinduka ku mvuduko mwinshi utaguhagaritse mbere birashobora gutuma imodoka iringa. Daimo guhagarika mu murongo umwe mbere yo kugira ngo ukagure ibyago.",
      },
    ],
  },
  {
    courseId: 'advanced-defensive-driving',
    lessonId: 5,
    type: 'text',
    title: 'Accident Avoidance Strategies',
    titleKiny: "Ibiciro byo Kwirinda Ibyago",
    content: [
      {
        type: 'paragraph',
        text: "The best accident is the one that never happens. Strategic driving prevents most accidents before they even develop.",
        textKiny: "Ibibazo byiza ni ibyo bidahera. Kubaga mu buryo bw'ubuyobozi birinda ibibazo byinshi mbere yo kubaho.",
      },
      {
        heading: 'Prevention Strategies',
        headingKiny: 'Ibiciro byo Kwirinda',
        type: 'list',
        items: [
          'Maintain space cushions — at least 4 seconds on all sides',
          'Scan intersections before entering, even with a green light',
          'Watch for brake lights 3+ vehicles ahead',
          'Never assume right of way — verify it',
          'Keep headlights on during the day for visibility',
        ],
        itemsKiny: [
          'Kubungabunga umwanya — amasegonda 4 kuri bose',
          'Reba ibigereranyo mbere yo kunjira, nubwo hari amarangamutsegere',
          'Reba amatara y\'iboko ry\'imodoka 3+ imbere',
          'Daimo ntukwire icyubahiro — rizere',
          'Gufungura amatara y\'imodoka mu gitondo kugira ngo ubone',
        ],
      },
      {
        heading: 'High-Risk Situations to Watch',
        headingKiny: 'Imimerere y\'Ibyago Yo Gukurikirana',
        type: 'list',
        items: [
          'Intersections — where 40% of accidents occur',
          'School zones and market areas',
          'Rural roads with animals and pedestrians',
          'Merging zones on highways',
          'Construction zones with sudden lane changes',
        ],
        itemsKiny: [
          'Ibigereranyo — aho ibibazo 40% bihera',
          'Icyumba c\'isomero n\'ahantu h\'ibibanza',
          'Imihanda y\'abanyarajisho n\'inkunga n\'abagenzi',
          'Ibice by\'umutekano ku muhanda mukuru',
          'Ibice by\'ubwoko buhinduka mu buryo bw\'ikigereranyo',
        ],
      },
    ],
  },
  {    courseId: 'advanced-defensive-driving',
    lessonId: 6,
    type: 'interactive',
    title: 'Advanced Scenario Practice',
    titleKiny: "Amahugurwa y\'Imimerere mu Buryo Bworoshe",
    content: [
      {
        type: 'paragraph',
        text: "Test your advanced skills with these emergency scenarios. Each requires quick thinking and precise execution.",
        textKiny: "Gerageza ubushobozi bwawe bw'ikigereranyo n'ibiciro by'ibanga. Buri gice gisaba ubwumenyi bw'ubukire n'ukororwa neza.",
      },
      {
        heading: 'Scenario: Wet Road Skid',
        headingKiny: 'Ibiciro: Gukubita ku Muhanda ufise Amazi',
        type: 'list',
        items: [
          '🌧️ It has been raining for an hour',
          '🚗 You are driving at 60 km/h on a curved road',
          '💥 Your rear tires lose grip — the car starts to oversteer',
          '❓ What is your immediate response?',
        ],
        itemsKiny: [
          '🌧️ Imvura yarimbiriye amasaha ashize',
          '🚗 Urabaga ku 60 km/h ku muhanda w\'imisozi',
          '💥 Utugiti tw\'inyuma tubura ubusinzi — imodoka yatangira oversteer',
          '❓ Igisubizo cy\'ikiringo ni iki?',
        ],
      },
      {
        heading: 'Scenario: Sudden Obstacle',
        headingKiny: 'Ibiciro: Icyago Gihari',
        type: 'list',
        items: [
          '🚗 You are on a 2-lane road at 80 km/h',
          '🐄 A cow steps onto the road from the right',
          '🚗 A car is approaching from the opposite direction',
          '❓ How do you handle this emergency?',
        ],
        itemsKiny: [
          '🚗 Urabaga ku muhanda wa intambwe 2 ku 80 km/h',
          '🐄 Inkunga irabona umuhanda iburyo',
          '🚗 Imodoka zurasohoka mu buryo bw\'iburyo',
          '❓ Ni uko ugenjura iyi banga?',
        ],
      },
    ],
  },
  {
    courseId: 'advanced-defensive-driving',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw\'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your advanced defensive driving knowledge!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'When your car begins to oversteer (rear slides out), you should:',
          questionKiny: 'Igihe imodoka yawe yatangira oversteer (inyuma irasohoka), usabwa:',
          options: ['Brake hard immediately', 'Steer into the skid', 'Accelerate', 'Turn the wheel the opposite way'],
          correctIndex: 1,
          explanation: 'When the rear slides out (oversteer), steer into the skid — turn the wheels in the same direction the rear is sliding.',
          explanationKiny: 'Igihe inyuma irasohoka (oversteer), kagura mu gukubita — hindura utugiti mu buryo bumwe inyuma irasohoka.',
        },
        {
          id: 2,
          question: 'With ABS brakes, when making an emergency stop you should:',
          questionKiny: 'Na ABS, igihe uhagarika vuba usabwa:',
          options: ['Pump the brakes', 'Press and hold the brake firmly', 'Tap the brakes gently', 'Use the handbrake'],
          correctIndex: 1,
          explanation: 'With ABS, press the brake firmly and hold it. The system automatically pumps the brakes for you.',
          explanationKiny: 'Na ABS, kanda iboko rya guhagarika neza kandi uhore riri hasi. Ibisobanuro birakora ibyo mwonyine.',
        },
        {
          id: 3,
          question: 'The SIPDE system stands for:',
          questionKiny: 'Uburyo bwa SIPDE buvuzwe:',
          options: ['Stop, Identify, Predict, Drive, Exit', 'Scan, Identify, Predict, Decide, Execute', 'Signal, Indicate, Proceed, Drive, Exit', 'Slow, Inspect, Prepare, Drive, Escape'],
          correctIndex: 1,
          explanation: 'SIPDE: Scan, Identify, Predict, Decide, Execute — a systematic approach to hazard management.',
          explanationKiny: 'SIPDE: Kubona, Kumenya, Gutegura, Gukemura, Gukora — uburyo bw\'uburundu bwo gutunganya ibyago.',
        },
        {
          id: 4,
          question: 'When performing an evasive maneuver at high speed, you should:',
          questionKiny: 'Igihe ukora uburyo bwo kwirinda ibyago ku mvuduko mwinshi, usabwa:',
          options: ['Swerve first, then brake', 'Brake first in a straight line, then steer', 'Only use the handbrake', 'Close your eyes and hope'],
          correctIndex: 1,
          explanation: 'Always brake in a straight line first, then steer around the obstacle. Swerving at high speed without braking can cause a rollover.',
          explanationKiny: 'Daimo guhagarika mbere mu murongo umwe, hanyuma ukagure ibyago. Guhinduka ku mvuduko mwinshi utaguhagaritse birashobora gutuma imodoka iringa.',
        },
        {
          id: 5,
          question: 'Why should you never use cruise control on wet roads?',
          questionKiny: 'Kubera iki ntukoreshe cruise control ku muhanda ufise amazi?',
          options: ['It wastes fuel', 'It can cause loss of control during a skid', 'It is illegal', 'It is uncomfortable'],
          correctIndex: 1,
          explanation: 'Cruise control can maintain acceleration during a skid, making it harder to regain control on wet or slippery roads.',
          explanationKiny: 'Cruise control irashobora kubungabunga umuvuduko mu gihe cyo gukubita, bigatuma biroroshe kugaruka ingabu ku muhanda ufise amazi cyangwa udakoroha.',
        },
      ],
    },
  },
  {
    courseId: 'advanced-defensive-driving',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry\'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the comprehensive advanced driving assessment. Score 70% or higher to pass.",
        textKiny: "Uzuze isuzuma ryuzuye ry\'ubukorwa bw\'ikigereranyo. Ushobora 70% cyangwa hejuru kugira ngo upasse.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What is a front-wheel skid characterized by?',
          questionKiny: 'Gukubita kw\'imbere birabereye iki?',
          options: ['Rear of car slides out', 'Steering feels unresponsive, car goes straight', 'Car spins in circles', 'Engine stalls'],
          correctIndex: 1,
          explanation: 'In a front-wheel skid, the front tires lose grip and the steering feels unresponsive — the car continues straight ahead.',
          explanationKiny: 'Mu gukubita kw\'imbere, utugiti tw\'imbere tubura ubusinzi kandi umupira w\'ikagurira udakwiye — imodoka yakomeza imbere.',
        },
        {
          id: 2,
          question: 'How often should you check your mirrors while driving?',
          questionKiny: 'Ugenda uraba intambwe yawe buri gice?',
          options: ['Every 30 seconds', 'Every 5-8 seconds', 'Every minute', 'Only when changing lanes'],
          correctIndex: 1,
          explanation: 'Check mirrors every 5-8 seconds to maintain 360-degree awareness of your surroundings.',
          explanationKiny: 'Reba intambwe buri seconde 5-8 kugira ngo ubungabunge ubusinzi bwa digri 360 bw\'ibibaho byawe.',
        },
        {
          id: 3,
          question: 'The safe following distance in advanced defensive driving is:',
          options: ['1 second', '2 seconds', 'At least 4 seconds', 'As close as possible'],
          correctIndex: 2,
          explanation: 'Maintain at least 4 seconds of following distance to give yourself maximum reaction time.',
        },
        {
          id: 4,
          question: 'Hydroplaning occurs when:',
          options: ['Tires are overinflated', 'Tires ride on a layer of water', 'The road is dry', 'You are driving slowly'],
          correctIndex: 1,
          explanation: 'Hydroplaning happens when tires lose contact with the road surface and ride on a layer of water.',
        },
        {
          id: 5,
          question: 'What percentage of accidents occur at intersections?',
          options: ['10%', '20%', '40%', '60%'],
          correctIndex: 2,
          explanation: 'Approximately 40% of all accidents occur at intersections, making them the highest-risk locations.',
        },
      ],
    },
  },
];

// ============================================================
// COMMERCIAL & HEAVY VEHICLE DRIVING
// ============================================================

const commercialLessons: LessonContent[] = [
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 1,
    type: 'text',
    title: 'Introduction to Commercial Driving',
    titleKiny: "Intangiriro y\'Kubaga Imodoka z\'Akazi",
    content: [
      {
        type: 'paragraph',
        text: "Commercial driving in Rwanda requires special skills, knowledge, and permits. This lesson introduces the unique challenges of driving trucks, buses, and other heavy vehicles.",
        textKiny: "Kubaga imodoka z\'akazi mu Rwanda bisaba ubushobozi, ubumenyi, n\'ibyemezo by\'ihariye. Iri somero ridukurikirana ibibazo by\'ihariye by\'kubaga ibinyabiziga, amabisi, n\'imodoka z\'uburemere.",
      },
      {
        heading: 'Differences from Regular Driving',
        headingKiny: 'Intandukanye na Kubaga Bisanzwe',
        type: 'list',
        items: [
          'Larger blind spots — motorcycles and pedestrians can disappear from view',
          'Longer stopping distances — heavier vehicles need more time to stop',
          'Higher center of gravity — more risk of rollover on curves',
          'Wider turning radius — require more space for turns',
          'Different braking characteristics — air brakes work differently than hydraulic',
        ],
        itemsKiny: [
          'Ibice binini by\'ubumirizi — amamoto n\'abagenzi bashobora kubura mu kuva',
          'Intero zunini — imodoka z\'uburemere zisaba igihe kirekire kugira ngo zihagarike',
          'Imbere iri hejuru — ubusinzi bukubye bwo kuringa ku mbabara',
          'Uburangabwake bwo guhinduka — bushobora umwanya mwinshi',
          'Imyimerere itandukanye — amaboko y\'umuyaga akora buryo bw\'ihariye',
        ],
      },
      {
        heading: 'Required Permits in Rwanda',
        headingKiny: 'Ibemezo Bishabirirwa mu Rwanda',
        type: 'list',
        items: [
          'Commercial driving license (Class C for trucks, Class D for buses)',
          'Vehicle fitness certificate',
          'Insurance documentation',
          'Route permits for specific cargo types',
        ],
        itemsKiny: [
          'Iemezo ryo kubaga imodoka z\'akazi (Icicaro C k\'ibinyabiziga, Icicaro D k\'amabisi)',
          'Ibemezo ry\'ubuzima bw\'imodoka',
          'Inyandiko z\'uburinzi',
          'Ibemezo by\'urugendo kubwoko bw\'inguzanyo bw\'ihariye',
        ],
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 2,
    type: 'text',
    title: 'Vehicle Inspections & Maintenance',
    titleKiny: "Kugenzura no Gutunga Imodoka",
    content: [
      {
        type: 'paragraph',
        text: "Pre-trip inspections are legally required and essential for safety. A thorough inspection takes 15-20 minutes but can prevent catastrophic failures.",
        textKiny: "Kugenzura mbere y\'urugendo birabonetse n\'amategeko kandi birakenewe ku mutekano. Kugenzura neza biratoranya amasegonda 15-20 aho birashobora kugira ngo bikande ibibazo bikomeye.",
      },
      {
        heading: 'Pre-Trip Inspection Checklist',
        type: 'list',
        items: [
          '🔵 Tires — check pressure, tread depth, damage, lug nuts',
          '🔵 Brakes — test air pressure, brake lines, pedal feel',
          '🔵 Lights — headlights, taillights, indicators, hazard lights',
          '🔵 Mirrors — clean, properly adjusted, no cracks',
          '🔵 Fluids — oil, coolant, brake fluid, power steering',
          '🔵 Cargo — properly secured, within weight limits',
          '🔵 Emergency equipment — fire extinguisher, warning triangle',
        ],
      },
      {
        type: 'warning',
        text: "Never start a trip without completing the pre-trip inspection. Mechanical failures at highway speed can be fatal.",
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 3,
    type: 'video',
    title: 'Loading & Weight Distribution',
    titleKiny: "Gutera n\'Kugabanya Uburemere",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Improper loading is a major cause of truck accidents. This video covers how to load cargo safely and distribute weight correctly.",
        textKiny: "Gutera neza birabonetse ni icyubahiro c\'ibibazo by\'ibinyabiziga. Iri video rigaragara uko utera inguzanyo neza no kugabanya uburemere neza.",
      },
      {
        heading: 'Loading Principles',
        type: 'list',
        items: [
          'Distribute weight evenly across all axles',
          'Keep the center of gravity as low as possible',
          'Secure cargo with straps, chains, or nets',
          'Place heavy items low and centered',            'Do not exceed the vehicle gross weight rating',
        ],
      },
      {
        heading: 'Weight Distribution Effects',
        type: 'list',
        items: [
          'Too much weight on front axle — poor steering, front tire wear',
          'Too much weight on rear axle — poor braking, rear tire wear',
          'Uneven side-to-side — vehicle pulls to one side',
          'High center of gravity — increased rollover risk',
        ],
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 4,
    type: 'interactive',
    title: 'Braking Distances & Management',
    titleKiny: "Intero y\'Guhagarika n\'Yubwoko",
    content: [
      {
        type: 'paragraph',
        text: "Heavy vehicles require much longer stopping distances. A loaded truck traveling at 60 km/h may need 60+ meters to stop — twice as far as a car.",
        textKiny: "Imodoka z\'uburemere zisaba intero nunini cane. Igihe iri imbere irabaga ku 60 km/h irashobora kubona metersi 60+ kugira ngo ihagare — inshi makabu y\'imodoka.",
      },
      {
        heading: 'Stopping Distance Comparison',
        type: 'list',
        items: [
          '🚗 Car at 50 km/h: ~25 meters',
          '🚛 Truck (loaded) at 50 km/h: ~40 meters',
          '🚗 Car at 80 km/h: ~55 meters',
          '🚛 Truck (loaded) at 80 km/h: ~95 meters',
          'On wet roads: multiply distances by 1.5-2x',
        ],
      },
      {
        heading: 'Braking Tips for Heavy Vehicles',
        type: 'list',
        items: [
          'Begin braking earlier than you think necessary',
          'Use engine braking (downshifting) to reduce brake wear',
          'Avoid sudden braking — use progressive, firm pressure',
          'On downhill grades, use lower gears to control speed',
          'Check brake temperature on long descents',
        ],
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 5,
    type: 'interactive',
    title: 'Maneuvering Large Vehicles',
    titleKiny: "Gukorora Ibinyabiziga Bikubye",
    content: [
      {
        type: 'paragraph',
        text: "Large vehicles require different techniques for turning, reversing, and parking. Understanding the dimensions and limitations of your vehicle is essential.",
        textKiny: "Imodoka nk\'ibinyabiziga zisaba uburyo butandukanye bwo guhinduka, kugaruka, no gutega. Kwizera uburebure n\'ibibazo by\'imodoka yawe ni ingenzi.",
      },
      {
        heading: 'Turning Large Vehicles',
        type: 'list',
        items: [
          'Use the button hook turn technique — swing wide, then cut in',
          'Check for pedestrians and cyclists in your blind spots before turning',
          'Watch the tail swing — the rear of the vehicle swings opposite to the turn',
          'Reduce speed significantly before the turn',
        ],
      },
      {
        heading: 'Reversing Safely',
        type: 'list',
        items: [
          'Use a spotter when available',
          'Check all mirrors before reversing',
          'Go slowly — no faster than walking pace',
          'Use short bursts with frequent stops to check surroundings',
          'Sound the horn before reversing in busy areas',
        ],
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 6,
    type: 'text',
    title: 'Commercial Regulations in Rwanda',
    titleKiny: "Amategeko y\'Akazi mu Rwanda",
    content: [
      {
        type: 'paragraph',
        text: "Understanding Rwanda's commercial driving regulations is essential for legal compliance and safety. Violations can result in fines, license suspension, and criminal charges.",
        textKiny: "Kwizera amategeko y\'ubukorwa bw\'akazi bw\'u Rwanda ni ingenzi yo kwizera amategeko n\'umutekano. Ibikorwa bisobanura amahera, guhagarika uruhya, n\'ibibazo by\'uburundu.",
      },
      {
        heading: 'Key Regulations',
        type: 'list',
        items: [
          'Maximum driving hours — 10 hours with mandatory rest breaks',
          'Speed limits for commercial vehicles — typically 10-20 km/h lower than cars',
          'Load limits — strictly enforced with weigh stations',
          'Insurance requirements — higher minimums for commercial vehicles',
          'Regular vehicle inspections — every 6 months for commercial vehicles',
        ],
      },
      {
        type: 'warning',
        text: "Driving a commercial vehicle without proper documentation can result in immediate vehicle impoundment and heavy fines.",
      },
    ],
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw\'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your commercial driving knowledge!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'How much longer does a loaded truck need to stop compared to a car at the same speed?',
          options: ['Same distance', '50% more', '100% more (twice as far)', '200% more'],
          correctIndex: 2,
          explanation: 'A loaded truck needs approximately twice the stopping distance of a car at the same speed.',
        },
        {
          id: 2,
          question: 'What is the tail swing effect on large vehicles?',
          options: ['Rear follows the same direction as the turn', 'Rear swings in the opposite direction of the turn', 'Vehicle does not swing at all', 'Only affects the front wheels'],
          correctIndex: 1,
          explanation: 'The tail swing causes the rear of the vehicle to swing in the opposite direction of the turn.',
        },
        {
          id: 3,
          question: 'When should you use engine braking (downshifting)?',
          options: ['Only on flat roads', 'On downhill grades to reduce brake wear', 'Never', 'Only when the engine is cold'],
          correctIndex: 1,
          explanation: 'Engine braking helps control speed on downhill grades and reduces wear on the service brakes.',
        },
        {
          id: 4,
          question: 'What is the maximum recommended driving hours for commercial drivers in Rwanda?',
          options: ['8 hours', '10 hours', '12 hours', 'Unlimited'],
          correctIndex: 1,
          explanation: 'Commercial drivers should not drive more than 10 hours without mandatory rest breaks.',
        },
        {
          id: 5,
          question: 'Where should heavy items be placed when loading a truck?',
          options: ['At the top', 'At the front only', 'Low and centered', 'On one side'],
          correctIndex: 2,
          explanation: 'Heavy items should be placed low and centered to keep the center of gravity low and reduce rollover risk.',
        },
      ],
    },
  },
  {
    courseId: 'commercial-heavy-vehicles',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry\'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the commercial driving skills assessment. Score 70% or higher to pass.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What should be checked FIRST in a pre-trip inspection?',
          options: ['Radio', 'Tires and brakes', 'Air conditioning', 'Seat comfort'],
          correctIndex: 1,
          explanation: 'Tires and brakes are the most critical safety components and should be checked first.',
        },
        {
          id: 2,
          question: 'A loaded truck at 80 km/h needs approximately how many meters to stop?',
          options: ['25 meters', '55 meters', '95 meters', '150 meters'],
          correctIndex: 2,
          explanation: 'A loaded truck at 80 km/h needs approximately 95 meters to come to a complete stop.',
        },
        {
          id: 3,
          question: 'When reversing a large vehicle, what speed should you maintain?',
          options: ['Walking pace or slower', '10 km/h', '20 km/h', 'Whatever feels comfortable'],
          correctIndex: 0,
          explanation: 'Large vehicles should be reversed at walking pace or slower with frequent stops to check surroundings.',
        },
        {
          id: 4,
          question: 'What happens if weight is too high in a loaded truck?',
          options: ['Better fuel efficiency', 'Increased rollover risk', 'Faster acceleration', 'Nothing'],
          correctIndex: 1,
          explanation: 'High center of gravity significantly increases the risk of rollover, especially on curves.',
        },
        {
          id: 5,
          question: 'Commercial vehicles in Rwanda must be inspected:',
          options: ['Every year', 'Every 6 months', 'Every month', 'Only when broken'],
          correctIndex: 1,
          explanation: 'Commercial vehicles must undergo mandatory inspections every 6 months.',
        },
      ],
    },
  },
];

// ============================================================
// NIGHT & ADVERSE WEATHER DRIVING
// ============================================================

const nightWeatherLessons: LessonContent[] = [
  {
    courseId: 'night-adverse-weather',
    lessonId: 1,
    type: 'text',
    title: 'Night Driving Fundamentals',
    titleKiny: "Amategeko y\'Kubaga mu Gitondo",
    content: [
      {
        type: 'paragraph',
        text: "Night driving is significantly more dangerous than daytime driving. Visibility is reduced, depth perception is impaired, and hazards are harder to detect. In Rwanda, many roads lack proper lighting.",
        textKiny: "Kubaga mu gitondo birashobora kunonwa cane kuruta kubaga mu gitondo. Ubukobwa buke, ubusinzi bw\'ibere bubura, kandi ibyago birashobora kunonwa. Mu Rwanda, imihanda myinshi nta mayo yayo.",
      },
      {
        heading: 'Why Night Driving is Dangerous',
        type: 'list',
        items: [
          'Reduced visibility — you can only see as far as your headlights reach',
          'Impaired depth perception — distances are harder to judge',
          'Fatigue — your body naturally wants to sleep',
          'Glare — oncoming headlights can temporarily blind you',
          'Hidden hazards — pedestrians in dark clothing are nearly invisible',
        ],
      },
      {
        heading: 'Essential Night Driving Rules',
        type: 'list',
        items: [
          'Always use headlights — low beam in urban areas, high beam on unlit roads',
          'Reduce speed — you need more time to react',
          'Increase following distance to 4-5 seconds',
          'Keep windshield and mirrors clean',
          'Avoid looking directly at oncoming headlights',
        ],
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 2,
    type: 'interactive',
    title: 'Headlight Management & Visibility',
    titleKiny: "Gukoresha Amatara no Kubona",
    content: [
      {
        type: 'paragraph',
        text: "Proper headlight use is crucial for night driving safety. Knowing when to use high beams vs. low beams can prevent accidents and save lives.",
        textKiny: "Kubaga amatara neza ni ingenzi ku mutekano w\'ubusinzi mu gitondo. Kwizera igihe ukoreshe amabyo yo hejuru kuruta ayo hasi birashobora kugira ngo ukande ibibazo kandi ubuze ubuzima.",
      },
      {
        heading: 'High Beams vs. Low Beams',
        type: 'list',
        items: [
          'Low beams — use in urban areas, when following other vehicles, or when meeting traffic',
          'High beams — use on unlit rural roads with no oncoming traffic',
          'Switch to low beams when within 200 meters of oncoming traffic',
          'Switch to low beams when following a vehicle within 100 meters',
        ],
      },
      {
        heading: 'Maximizing Visibility',
        type: 'list',
        items: [
          'Keep headlights clean — dirt reduces light output by up to 50%',
          'Check headlight alignment regularly',
          'Use fog lights only in fog or heavy rain',
          'Keep interior dashboard lights dim to preserve night vision',
        ],
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 3,
    type: 'video',
    title: 'Driving in Heavy Rain',
    titleKiny: "Kubaga mu Rain Nzito",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Heavy rain creates dangerous driving conditions: reduced visibility, hydroplaning risk, and longer stopping distances. This video shows you how to stay safe.",
        textKiny: "Imvura nzito irakora imimerere yo kubaga yo mu bushinu: ubukobwa buke, ubusinzi bwo gukubita mu mazi, n\'intero zunini. Iri video rigaragara uko ukurinda neza.",
      },
      {
        heading: 'Rain Driving Techniques',
        type: 'list',
        items: [
          'Reduce speed by at least 10 km/h below the limit',
          'Increase following distance to 5-6 seconds',
          'Use low beam headlights (not high beams)',
          'Turn on windshield wipers — replace worn blades',
          'Avoid sudden steering or braking movements',
        ],
      },
      {
        heading: 'Hydroplaning Prevention',
        type: 'list',
        items: [
          'Hydroplaning can occur at speeds as low as 50 km/h',
          'Ensure tires have adequate tread depth (minimum 1.6mm)',
          'Avoid puddles and standing water',
          'If hydroplaning occurs: ease off accelerator, do not brake suddenly',
        ],
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 4,
    type: 'interactive',
    title: 'Fog & Low Visibility Conditions',
    titleKiny: "Fog n\'Igihe Gitategerezwa",
    content: [
      {
        type: 'paragraph',
        text: "Fog is one of the most dangerous driving conditions. It dramatically reduces visibility and can appear suddenly, especially in Rwanda's mountainous regions.",
        textKiny: "Icyumba ni imwe mu myimerere yo kubaga yo mu bushinu cane. Irabanza ubukobwa neza kandi irashobora gusohoka vuba, cyane mu buryo bw\'u Rwanda bw\'imisozi.",
      },
      {
        heading: 'Driving in Fog',
        type: 'list',
        items: [
          'Use low beam headlights and fog lights (never high beams)',
          'Reduce speed significantly — drive at a speed where you can stop within your visible distance',
          'Increase following distance to 5+ seconds',
          'Use the right edge line as a guide',
          'Listen for traffic you cannot see',
        ],
      },
      {
        heading: 'When to Stop',
        type: 'list',
        items: [
          'Pull completely off the road to a safe location',
          'Turn on hazard lights',
          'Stay in your vehicle',
          'Do not stop on the road or shoulder if possible',
        ],
      },
      {
        type: 'warning',
        text: "Never use high beam headlights in fog — the light reflects off the water droplets and makes visibility worse.",
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 5,
    type: 'text',
    title: 'Mountain & Hill Driving at Night',
    titleKiny: "Kubaga ku Mikenke mu Gitondo",
    content: [
      {
        type: 'paragraph',
        text: "Rwanda's mountainous terrain presents unique challenges for night driving. Steep grades, sharp curves, and limited visibility make these roads particularly dangerous after dark.",
        textKiny: "Miterero y\'u Rwanda y\'imisozi iratanga ibibazo by\'ihariye kubaga mu gitondo. Ibice bikubye, imisozi, n\'ubukobwa buke biragira imihanda iyi yo mu bushinu cane nyuma y\'ijoro.",
      },
      {
        heading: 'Mountain Driving Tips',
        type: 'list',
          items: [
          'Use lower gears to maintain control on steep descents',
          'Never coast downhill in neutral — you lose engine braking',
          'Watch for oncoming vehicles that may be in your lane on curves',
          'Use horn before blind curves (where permitted)',
          'Watch for rockfalls and landslides, especially after rain',
        ],
      },
      {
        heading: 'Hill Climbing',
        type: 'list',
        items: [
          'Maintain steady speed going up — do not accelerate hard',
          'If the engine starts to overheat, turn on the heater to help cool',
          'Downshift before the grade, not on it',
          'Watch for vehicles coming downhill — give them space',
        ],
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 6,
    type: 'interactive',
    title: 'Hazard Anticipation Scenarios',
    titleKiny: "Amahugurwa y\'Kumenya Ibyago",
    content: [
      {
        type: 'paragraph',
        text: "Practice identifying and responding to hazards in low-visibility conditions. Anticipation is the key to safe night and weather driving.",
      },
      {
        heading: 'Scenario: Night Rain',
        type: 'list',
        items: [
          '🌧️ Heavy rain at night, low visibility',
          '🚗 You are driving at 60 km/h',
          '🚶 A pedestrian in dark clothing is ahead',
          '❓ How do you detect and avoid the pedestrian?',
        ],
      },
      {
        heading: 'Scenario: Mountain Fog',
        type: 'list',
        items: [
          '🌫️ Dense fog on a mountain road',
          '🚗 You cannot see more than 20 meters ahead',
          '🚗 A sharp curve is approaching',
          '❓ What speed should you drive and why?',
        ],
      },
    ],
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw\'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your night and weather driving knowledge!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'At what speed can hydroplaning begin?',
          options: ['20 km/h', '50 km/h', '80 km/h', '120 km/h'],
          correctIndex: 1,
          explanation: 'Hydroplaning can begin at speeds as low as 50 km/h when tires cannot displace water fast enough.',
        },
        {
          id: 2,
          question: 'In fog, you should use:',
          options: ['High beam headlights', 'Low beam headlights and fog lights', 'No headlights', 'Hazard lights only'],
          correctIndex: 1,
          explanation: 'Low beams and fog lights reduce glare and improve visibility in fog. High beams make it worse.',
        },
        {
          id: 3,
          question: 'When following another vehicle at night, you should:',
          options: ['Use high beams to see better', 'Use low beams and maintain 100+ meters', 'Turn off headlights', 'Drive as close as possible'],
          correctIndex: 1,
          explanation: 'Use low beams when following within 100 meters to avoid blinding the driver ahead.',
        },
        {
          id: 4,
          question: 'When driving downhill in mountains, you should:',
          options: ['Coast in neutral', 'Use lower gears for engine braking', 'Brake continuously', 'Accelerate to get down faster'],
          correctIndex: 1,
          explanation: 'Use lower gears to maintain control through engine braking. Never coast downhill in neutral.',
        },
        {
          id: 5,
          question: 'If you must stop in dense fog, you should:',
          options: ['Stop on the road', 'Pull completely off the road to a safe location', 'Stop on the shoulder with hazard lights', 'Turn off all lights'],
          correctIndex: 1,
          explanation: 'Pull completely off the road to a safe location and turn on hazard lights.',
        },
      ],
    },
  },
  {
    courseId: 'night-adverse-weather',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry\'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the adverse weather driving assessment. Score 70% or higher to pass.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'How much should you increase following distance in rain?',
          options: ['No change', 'Double it', 'Triple it', 'Reduce it'],
          correctIndex: 1,
          explanation: 'Double your following distance in rain to account for longer stopping distances.',
        },
        {
          id: 2,
          question: 'When approaching a blind curve at night, you should:',
          options: ['Speed up to get through quickly', 'Use horn and reduce speed', 'Use high beams', 'Close your eyes'],
          correctIndex: 1,
          explanation: 'Sound your horn (where permitted) and reduce speed before entering a blind curve at night.',
        },
        {
          id: 3,
          question: 'What causes most night driving fatalities in Rwanda?',
          options: ['Mechanical failure', 'Pedestrians in dark clothing', 'Rain', 'Speeding only'],
          correctIndex: 1,
          explanation: 'Pedestrians in dark clothing are nearly invisible at night and are a leading cause of night driving fatalities.',
        },
        {
          id: 4,
          question: 'In heavy rain, you should avoid:',
          options: ['Driving slowly', 'Sudden steering and braking', 'Using headlights', 'Increasing following distance'],
          correctIndex: 1,
          explanation: 'Sudden steering and braking in rain can cause loss of control on wet roads.',
        },
        {
          id: 5,
          question: 'Why should you keep dashboard lights dim at night?',
          options: ['To save battery', 'To preserve night vision', 'It looks cool', 'No reason'],
          correctIndex: 1,            explanation: 'Bright dashboard lights reduce your eyes ability to see in the dark.',
        },
      ],
    },
  },
];

// ============================================================
// PROFESSIONAL DRIVER CERTIFICATION
// ============================================================

const professionalCertLessons: LessonContent[] = [
  {
    courseId: 'professional-driver-cert',
    lessonId: 1,
    type: 'text',
    title: 'Professional Driving Standards',
    titleKiny: "Amategeko y\'Kubaga mu Rwanda",
    content: [
      {
        type: 'paragraph',
        text: "Professional drivers represent their company and must meet higher standards than regular drivers. This lesson covers the expectations and responsibilities of professional driving in Rwanda.",
      },
      {
        heading: 'Professional Driver Qualities',
        type: 'list',
        items: [
          'Excellent vehicle control and anticipation skills',
          'Courteous and patient demeanor',
          'Strong knowledge of traffic laws and routes',
          'Commitment to safety over speed',
          'Professional appearance and conduct',
        ],
      },
      {
        heading: 'Standards of Service',
        type: 'list',
        items: [
          'Arrive on time — plan routes to avoid delays',
          'Drive smoothly — avoid sudden acceleration or braking',
          'Maintain a clean, well-maintained vehicle',
          'Follow company policies and procedures',
          'Report any safety concerns immediately',
        ],
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 2,
    type: 'text',
    title: 'Customer Service & Passenger Safety',
    titleKiny: "Serivisi y\'Abakiriya n\'Umutekano w\'Abagenzi",
    content: [
      {
        type: 'paragraph',
        text: "Professional drivers carry passengers who trust them with their safety. Providing excellent service while maintaining safety standards is the hallmark of a professional.",
        textKiny: "Abashoferi b\'akazi bafite abagenzi bemera umutekano wabo. Gutanga serivisi nziza ukurikize amategeko y\'umutekano ni icyangamazwa c\'umuntu w\'akazi.",
      },
      {
        heading: 'Passenger Safety Responsibilities',
        type: 'list',
        items: [
          'Ensure all passengers wear seatbelts',
          'Drive at a speed that feels safe for passengers',
          'Avoid aggressive driving behaviors',
          'Assist elderly or disabled passengers when needed',
          'Keep emergency exits clear and accessible',
        ],
      },
      {
        heading: 'Customer Service Excellence',
        type: 'list',
        items: [
          'Greet passengers politely',
          'Provide clear information about the route and estimated time',
          'Handle complaints calmly and professionally',
          'Maintain a clean and comfortable environment',            'Be punctual — respect your passengers time',
        ],
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 3,
    type: 'text',
    title: 'Legal Compliance & Documentation',
    titleKiny: "Kwizera Amategeko n\'Inyandiko",
    content: [
      {
        type: 'paragraph',
        text: "Professional drivers must maintain proper documentation and comply with all regulations. Non-compliance can result in fines, license suspension, and job loss.",
      },
      {
        heading: 'Required Documents',
        type: 'list',
        items: [
          'Valid driving license (appropriate class)',
          'Vehicle registration and fitness certificate',
          'Insurance documentation',
          'Route permit (for commercial operations)',
          'Passenger manifest (for public transport)',
        ],
      },
      {
        heading: 'Regulations to Know',
        type: 'list',
        items: [
          'Speed limits for professional vehicles',
          'Driving hour restrictions and rest requirements',
          'Alcohol limits — zero tolerance for professional drivers',
          'Phone use — strictly prohibited while driving',
          'Vehicle maintenance schedules and requirements',
        ],
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 4,
    type: 'video',
    title: 'Fuel Efficiency & Eco-Driving',
    titleKiny: "Gukoresha Amavunja n\'Kubaga mu Buryo bw\'Ibbumeri",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: [
      {
        type: 'paragraph',
        text: "Fuel-efficient driving saves money, reduces emissions, and extends vehicle life. This video covers eco-driving techniques for professional drivers.",
      },
      {
        heading: 'Eco-Driving Techniques',
        type: 'list',
        items: [
          'Accelerate smoothly — avoid rapid acceleration',
          'Maintain steady speeds — use cruise control when possible',
          'Anticipate traffic flow — brake gently and early',
          'Remove unnecessary weight from the vehicle',
          'Keep tires properly inflated',
          'Turn off the engine when waiting for extended periods',
        ],
      },
      {
        heading: 'Fuel Savings Tips',
        type: 'list',
        items: [
          'Planning routes to avoid traffic congestion',
          'Maintaining steady speeds instead of frequent stops',
          'Using engine braking instead of service brakes',
          'Keeping the vehicle well-maintained',
          'Using air conditioning sparingly',
        ],
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 5,
    type: 'text',
    title: 'Fatigue Management & Health',
    titleKiny: "Gukemura Ubukene n\'Ubuzima",
    content: [
      {
        type: 'paragraph',
        text: "Driver fatigue is a major cause of accidents. Professional drivers must recognize the signs of fatigue and take steps to stay alert and healthy.",
        textKiny: "Ubukene bw\'umukoresha ni icyubahiro c\'ibibazo. Abashoferi b\'akazi basabwa kumenya ibimenyetso by\'ubukene kandi batange intambwe zo kugaruka neza n\'ubuzima.",
      },
      {
        heading: 'Signs of Fatigue',
        type: 'list',
        items: [
          'Frequent yawning or heavy eyelids',
          'Difficulty focusing or blurred vision',
          'Drifting between lanes',
          'Missing exits or road signs',
          'Irritability or restlessness',
        ],
      },
      {
        heading: 'Fatigue Prevention',
        type: 'list',
        items: [
          'Get 7-8 hours of sleep before driving',
          'Take a 15-minute break every 2 hours',
          'Share driving duties when possible',
          'Avoid heavy meals before driving',
          'Keep the vehicle well-ventilated',
        ],
      },
      {
        type: 'warning',
        text: "If you feel drowsy, pull over immediately and rest. No delivery or appointment is worth risking your life.",
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 6,
    type: 'interactive',
    title: 'Professional Scenario Practice',
    titleKiny: "Amahugurwa y\'Uburambe",
    content: [
      {
        type: 'paragraph',
        text: "Practice professional driving scenarios that test both your driving skills and customer service abilities.",
      },
      {
        heading: 'Scenario: VIP Transport',
        type: 'list',
        items: [
          '👔 You are transporting an important client to a meeting',
          '⏰ You are running 10 minutes late',
          '🚗 Heavy traffic on the main route',
          '❓ How do you balance punctuality with safety?',
        ],
      },
      {
        heading: 'Scenario: Mechanical Issue',
        type: 'list',
        items: [
          '🚛 You notice unusual engine noise during a trip',
          '👥 You have passengers on board',
          '📍 The nearest safe stopping point is 2 km away',
          '❓ What is your course of action?',
        ],
      },
    ],
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 7,
    type: 'quiz',
    title: 'Knowledge Quiz',
    titleKiny: "Ibufasha bw\'Ubumenyi",
    content: [
      {
        type: 'paragraph',
        text: "Test your professional driving knowledge!",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'How often should a professional driver take a break?',
          options: ['Every 4 hours', 'Every 2 hours', 'Every 6 hours', 'Only when tired'],
          correctIndex: 1,
          explanation: 'Professional drivers should take a 15-minute break every 2 hours to prevent fatigue.',
        },
        {
          id: 2,
          question: 'What is the alcohol limit for professional drivers in Rwanda?',
          options: ['0.08%', '0.05%', 'Zero tolerance', '0.02%'],
          correctIndex: 2,
          explanation: 'Professional drivers must have zero tolerance for alcohol while on duty.',
        },
        {
          id: 3,
          question: 'How many hours of sleep should a professional driver get before a shift?',
          options: ['4-5 hours', '7-8 hours', '9-10 hours', 'No minimum required'],
          correctIndex: 1,
          explanation: 'Professional drivers need 7-8 hours of quality sleep before driving.',
        },
        {
          id: 4,
          question: 'What should you do if a passenger complains about your driving?',
          options: ['Ignore them', 'Argue back', 'Listen calmly and adjust if needed', 'Ask them to leave'],
          correctIndex: 2,
          explanation: 'Listen to complaints calmly and make adjustments if their concerns are valid.',
        },
        {
          id: 5,
          question: 'When should you turn off the engine to save fuel?',
          options: ['While driving', 'When waiting for extended periods', 'Never', 'Only at night'],
          correctIndex: 1,
          explanation: 'Turn off the engine when waiting for extended periods to save fuel and reduce emissions.',
        },
      ],
    },
  },
  {
    courseId: 'professional-driver-cert',
    lessonId: 8,
    type: 'assessment',
    title: 'Final Assessment',
    titleKiny: "Isuzuma Ry\'Impera",
    content: [
      {
        type: 'paragraph',
        text: "Complete the professional driver certification assessment. Score 70% or higher to pass.",
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What is the most important quality of a professional driver?',
          options: ['Speed', 'Safety commitment', 'Cheap prices', 'Entertainment'],
          correctIndex: 1,
          explanation: 'Safety is the most important quality — a professional driver prioritizes safety over everything else.',
        },
        {
          id: 2,
          question: 'When you notice signs of fatigue while driving, you should:',
          options: ['Keep driving', 'Turn up the radio', 'Pull over and rest', 'Drink coffee'],
          correctIndex: 2,
          explanation: 'Pull over immediately and rest. No schedule or delivery is worth risking your life.',
        },
        {
          id: 3,
          question: 'What documents must a professional driver carry at all times?',
          options: ['Only a driving license', 'License, registration, insurance, and permits', 'Just the car keys', 'A map'],
          correctIndex: 1,
          explanation: 'Professional drivers must carry all required documentation including license, registration, insurance, and permits.',
        },
        {
          id: 4,
          question: 'Eco-driving techniques include:',
          options: ['Rapid acceleration', 'Steady speeds and gentle braking', 'Driving as fast as possible', 'Ignoring tire pressure'],
          correctIndex: 1,
          explanation: 'Eco-driving means maintaining steady speeds, accelerating smoothly, and braking gently.',
        },
        {
          id: 5,
          question: 'When a passenger complains about your driving, you should:',
          options: ['Ignore them', 'Listen calmly and adjust', 'Ask them to leave', 'Drive faster to finish sooner'],
          correctIndex: 1,
          explanation: 'Listen calmly, acknowledge their concern, and adjust your driving if their feedback is valid.',
        },
      ],
    },
  },
];

// ============================================================
// ALL LESSONS BY COURSE
// ============================================================

export const allLessons: LessonContent[] = [
  ...trafficRulesLessons,
  ...safeDrivingLessons,
  ...roadSignsLessons,
  ...intersectionsLessons,
  ...practicalSkillsLessons,
  ...advancedDefensiveLessons,
  ...commercialLessons,
  ...nightWeatherLessons,
  ...professionalCertLessons,
];

export function getLessonContent(courseId: string, lessonId: number): LessonContent | undefined {
  return allLessons.find(l => l.courseId === courseId && l.lessonId === lessonId);
}
