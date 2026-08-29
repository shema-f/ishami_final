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
        headingKiny: 'Ibimenyetso by\'Ik提醒 (Ubusanzwe bwa Burgundy)',
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
// ALL LESSONS BY COURSE
// ============================================================

export const allLessons: LessonContent[] = [
  ...trafficRulesLessons,
  ...safeDrivingLessons,
];

export function getLessonContent(courseId: string, lessonId: number): LessonContent | undefined {
  return allLessons.find(l => l.courseId === courseId && l.lessonId === lessonId);
}
