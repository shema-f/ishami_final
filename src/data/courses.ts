export interface CourseLesson {
  id: number;
  title: string;
  titleKiny: string;
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'assessment';
  duration: string;
  description: string;
}

export interface CourseCurriculum {
  title: string;
  titleKiny: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  titleKiny: string;
  description: string;
  descriptionKiny: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  levelKiny: string;
  instructor: string;
  instructorTitle: string;
  duration: string;
  totalLessons: number;
  gradient: string;
  icon: string;
  badge: string;
  badgeColor: string;
  curriculum: CourseCurriculum;
}

export const courses: Course[] = [
  {
    id: 'traffic-rules-fundamentals',
    title: 'Rwanda Traffic Rules Fundamentals',
    titleKiny: "Amategeko y'Umuhanda y'u Rwanda: Intangiriro",
    description: 'Build a strong foundation in Rwanda traffic rules. Learn core traffic signs, road markings, right of way, and the basic rules every driver must know.',
    descriptionKiny: "Shira imizi myiza mu mategeko y'umuhanda y'u Rwanda. Menya ibimenyetso by'umuhanda, amabwiriza y'umuhanda, icyubahiro, n'amategeko y'ingenzi buri mushoferi agomba kumenya.",
    level: 'Beginner',
    levelKiny: 'Utangira',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '3 hours',
    totalLessons: 8,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: '🚦',
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Introduction to Rwanda Traffic Rules', titleKiny: "Intangiriro ya Amategeko y'Umuhanda y'u Rwanda", type: 'text', duration: '20 min', description: 'Overview of Rwanda\'s traffic law framework and why road safety matters.' },
        { id: 2, title: 'Understanding Traffic Signs', titleKiny: "Kumenya Ibimenyetso by'Umuhanda", type: 'text', duration: '30 min', description: 'Learn to identify and understand all traffic signs used in Rwanda.' },
        { id: 3, title: 'Road Markings', titleKiny: "Amabwiriza y'Umuhanda", type: 'interactive', duration: '25 min', description: 'Interactive lesson on road markings, lanes, and painted signals.' },
        { id: 4, title: 'Right of Way Rules', titleKiny: "Amategeko y'Icyubahiro", type: 'text', duration: '25 min', description: 'Who goes first? Learn the right of way at intersections and crosswalks.' },
        { id: 5, title: 'Common Dangerous Situations', titleKiny: "Imimerere Mibi bizalizaho", type: 'video', duration: '30 min', description: 'Video walkthrough of the most common dangerous driving situations.' },
        { id: 6, title: 'Interactive Scenario', titleKiny: "Icyiciro Gihuza", type: 'interactive', duration: '20 min', description: 'Practice what you learned in a simulated real-world driving scenario.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your knowledge with a quick quiz on the fundamentals.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '20 min', description: 'Complete the final assessment to earn your course certificate.' },
      ],
    },
  },
  {
    id: 'safe-driving-road-safety',
    title: 'Safe Driving & Road Safety',
    titleKiny: "Kubaga Neza no Kwirinda Ibyago by'Umuhanda",
    description: 'Master defensive driving techniques, learn to identify hazards, and protect pedestrians, cyclists, and yourself on Rwanda\'s roads.',
    descriptionKiny: "Menya uburyo bwo kubaga neza,umenya ibyago by'umuhanda, kandi urinde abagenzi, abakor'i magare, n'ubwawe ku muhanda w'u Rwanda.",
    level: 'Beginner',
    levelKiny: 'Utangira',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '3.5 hours',
    totalLessons: 8,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    icon: '🚗',
    badge: 'Essential',
    badgeColor: 'bg-orange-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Introduction to Defensive Driving', titleKiny: "Intangiriro yo Kubaga Neza", type: 'text', duration: '20 min', description: 'What is defensive driving and why it saves lives.' },
        { id: 2, title: 'Identifying Road Hazards', titleKiny: "Kumenya Ibyago by\'Umuhanda", type: 'text', duration: '25 min', description: 'Learn to spot and react to hazards before they become accidents.' },
        { id: 3, title: 'Pedestrian Safety', titleKiny: "Umutekano w'Abagenzi", type: 'video', duration: '30 min', description: 'Understanding pedestrian behavior and keeping them safe.' },
        { id: 4, title: 'Motorcycle & Cyclist Awareness', titleKiny: "Kumenya Abashoferi b\'Amamoto", type: 'text', duration: '25 min', description: 'How to safely share the road with motorcycles and bicycles.' },
        { id: 5, title: 'Safe Following Distance', titleKiny: "Intero Yemewe", type: 'interactive', duration: '20 min', description: 'Interactive exercise on maintaining proper distance between vehicles.' },
        { id: 6, title: 'Weather & Night Driving', titleKiny: "Kubaga mu Buzima bw\'Umwanda", type: 'video', duration: '30 min', description: 'Special considerations for rain, fog, and nighttime driving.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your understanding of safe driving principles.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '20 min', description: 'Demonstrate your mastery of road safety concepts.' },
      ],
    },
  },
  {
    id: 'road-signs-markings',
    title: 'Road Signs & Markings Masterclass',
    titleKiny: "Ibimenyetso by'Umuhanda n'Amabwiriza: Isomoro Ryuzuye",
    description: 'Become an expert at recognizing and understanding every warning, regulatory, and informative sign on Rwanda\'s roads.',
    descriptionKiny: "Jya ufata uburambe mu kumenya no gusobanura ibimenyetso byose by'umuhanda — ibirikwa, ibitegeko, n'iby'inkuru — ku muhanda w'u Rwanda.",
    level: 'Beginner',
    levelKiny: 'Utangira',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '2.5 hours',
    totalLessons: 8,
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    icon: '🛣️',
    badge: 'Visual',
    badgeColor: 'bg-blue-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Overview of Sign Categories', titleKiny: "Ibiciro by'Ibimenyetso", type: 'text', duration: '15 min', description: 'Introduction to the three main categories of road signs.' },
        { id: 2, title: 'Warning Signs', titleKiny: "Ibimenyetso by'Iremenyo", type: 'interactive', duration: '30 min', description: 'Interactive gallery of all warning signs with meanings.' },
        { id: 3, title: 'Regulatory Signs', titleKiny: "Ibimenyetso by'Amategeko", type: 'interactive', duration: '30 min', description: 'Interactive gallery of all regulatory signs with meanings.' },
        { id: 4, title: 'Informative Signs', titleKiny: "Ibimenyetso by'Amakuru", type: 'interactive', duration: '25 min', description: 'Interactive gallery of all informative signs with meanings.' },
        { id: 5, title: 'Road Markings Deep Dive', titleKiny: "Amabwiriza y'Umuhanda", type: 'video', duration: '25 min', description: 'Video walkthrough of all road markings and their meanings.' },
        { id: 6, title: 'Sign Recognition Practice', titleKiny: "Amahugurwa y'Kumenya Ibimenyetso", type: 'interactive', duration: '15 min', description: 'Speed quiz: can you recognize these signs in 3 seconds?' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your sign and marking knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '20 min', description: 'Complete the comprehensive signs and markings assessment.' },
      ],
    },
  },
  {
    id: 'intersections-roundabouts',
    title: 'Intersections, Roundabouts & Right of Way',
    titleKiny: "Ibigereranyo, Ibipimo n'Icyubahiro cy'Umuhanda",
    description: 'Master the most complex driving situations: T-junctions, crossroads, roundabouts, turning, and priority rules.',
    descriptionKiny: "Menya imimerere y'ubukire y'umuhanda: T-junctions, ibigereranyo, ibipimo, guhinduka, n'amategeko y'icyubahiro.",
    level: 'Intermediate',
    levelKiny: 'Akererewe',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '3 hours',
    totalLessons: 8,
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    icon: '🔄',
    badge: 'Intermediate',
    badgeColor: 'bg-yellow-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Intersection Types Overview', titleKiny: "Ibiciro by'Ibigereranyo", type: 'text', duration: '20 min', description: 'Understanding different types of intersections in Rwanda.' },
        { id: 2, title: 'T-Junctions & Crossroads', titleKiny: "Ibipimo n'Ibigereranyo", type: 'text', duration: '25 min', description: 'Rules for navigating T-junctions and crossroads safely.' },
        { id: 3, title: 'Roundabout Rules', titleKiny: "Amategeko y'Ibipimo", type: 'video', duration: '30 min', description: 'Video guide to navigating roundabouts correctly.' },
        { id: 4, title: 'Turning & Lane Changes', titleKiny: "Gujiangira n'Guhinduka", type: 'interactive', duration: '25 min', description: 'Interactive lesson on safe turning and lane changing.' },
        { id: 5, title: 'Priority at Intersections', titleKiny: "Icyubahiro mu Ibigereranyo", type: 'text', duration: '25 min', description: 'Deep dive into who has priority at complex intersections.' },
        { id: 6, title: 'Complex Scenario Practice', titleKiny: "Amahugurwa y'Imimerere", type: 'interactive', duration: '20 min', description: 'Practice navigating complex intersection scenarios.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your intersection and roundabout knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '20 min', description: 'Complete the comprehensive intersection assessment.' },
      ],
    },
  },
  {
    id: 'practical-driving-skills',
    title: 'Practical Driving Skills & Decision Making',
    titleKiny: "Ubushobozi bwo Kubaga n'Uburyo bwo Gukemura",
    description: 'Learn parking, overtaking, lane discipline, highway driving, and make better decisions behind the wheel.',
    descriptionKiny: "Menya gutega imodoka, gukwiza neza, kuburanga mu muhanda, kubaga ku muhanda mukuru, kandi ukemure neza uri mu modoka.",
    level: 'Intermediate',
    levelKiny: 'Akererewe',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '4 hours',
    totalLessons: 8,
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    icon: '🅿️',
    badge: 'Practical',
    badgeColor: 'bg-purple-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Parking Techniques', titleKiny: "Uburyo bwo Gutega", type: 'video', duration: '30 min', description: 'Parallel, perpendicular, and angle parking techniques.' },
        { id: 2, title: 'Overtaking Safely', titleKiny: "Gukwiza Neza", type: 'text', duration: '25 min', description: 'When and how to overtake other vehicles safely.' },
        { id: 3, title: 'Lane Discipline', titleKiny: "Kuburanga mu Muhanda", type: 'interactive', duration: '25 min', description: 'Interactive lesson on proper lane usage and discipline.' },
        { id: 4, title: 'Highway Driving', titleKiny: "Kubaga ku Muhanda Mukuru", type: 'video', duration: '30 min', description: 'Special rules and considerations for highway driving.' },
        { id: 5, title: 'Decision Making Under Pressure', titleKiny: "Gukemura mu Bikorwa", type: 'text', duration: '25 min', description: 'How to make quick, safe decisions in challenging situations.' },
        { id: 6, title: 'Real-World Scenarios', titleKiny: "Ibiciro by'Umusi wose", type: 'interactive', duration: '30 min', description: 'Practice making decisions in realistic driving scenarios.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your practical driving knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '20 min', description: 'Complete the practical driving skills assessment.' },
      ],
    },
  },
  // =====================
  // ADVANCED COURSES
  // =====================
  {
    id: 'advanced-defensive-driving',
    title: 'Advanced Defensive Driving & Emergency Maneuvers',
    titleKiny: "Kubaga Neza mu Buryo bw'Ikigereranyo n'Ibikorwa vy'Agaciro",
    description: 'Master advanced defensive driving techniques including skid control, emergency braking, evasive maneuvers, and accident avoidance strategies for Rwanda\'s diverse road conditions.',
    descriptionKiny: "Menya uburyo bwo kubaga neza bw'ikigereranyo: gukemura ubusinzi, guhagarika vuba mu buryo bwo kwirinda, n'ibiciro byo kwirinda ibibazo mu buryo bwinshi bw'umuhanda w'u Rwanda.",
    level: 'Advanced',
    levelKiny: 'Irwego ryegeje',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '4.5 hours',
    totalLessons: 8,
    gradient: 'from-red-500 via-rose-500 to-red-600',
    icon: '🚨',
    badge: 'Advanced',
    badgeColor: 'bg-red-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Principles of Advanced Defensive Driving', titleKiny: "Amategeko y\'Kubaga mu Rwanda mu Buryo Bworoshe", type: 'text', duration: '25 min', description: 'Core principles and mindset for advanced defensive driving.' },
        { id: 2, title: 'Skid Control & Recovery', titleKiny: "Kugenzura Gukubita no Kwiyubuka", type: 'interactive', duration: '30 min', description: 'Interactive simulation of skid situations and recovery techniques.' },
        { id: 3, title: 'Emergency Braking Techniques', titleKiny: "Uburyo bwo Guhagarika Vuba", type: 'video', duration: '30 min', description: 'Video walkthrough of emergency braking on different surfaces.' },
        { id: 4, title: 'Evasive Maneuvers', titleKiny: "Uburyo bwo Kwirinda Ibyago", type: 'interactive', duration: '30 min', description: 'Interactive scenarios for evasive steering and obstacle avoidance.' },
        { id: 5, title: 'Accident Avoidance Strategies', titleKiny: "Ibiciro byo Kwirinda Ibyago", type: 'text', duration: '25 min', description: 'Strategies to prevent accidents before they happen.' },
        { id: 6, title: 'Advanced Scenario Practice', titleKiny: "Amahugurwa y\'Imimerere mu Buryo Bworoshe", type: 'interactive', duration: '35 min', description: 'Practice advanced maneuvers in realistic emergency scenarios.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your advanced driving knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '25 min', description: 'Complete the comprehensive advanced driving assessment.' },
      ],
    },
  },
  {
    id: 'commercial-heavy-vehicles',
    title: 'Commercial & Heavy Vehicle Driving',
    titleKiny: "Kubaga Ibinyabiziga n'Imodoka z'Akazi",
    description: 'Learn the specialized skills needed for driving trucks, buses, and commercial vehicles in Rwanda. Covers loading, braking distances, and commercial regulations.',
    descriptionKiny: "Menya ubushobozi bwo kubaga ibinyabiziga, amabisi, n'imodoka z'akazi mu Rwanda. Harimo gutera, intero y'guhagarika, n'amategeko y'akazi.",
    level: 'Advanced',
    levelKiny: 'Irwego ryegeje',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '5 hours',
    totalLessons: 8,
    gradient: 'from-slate-600 via-zinc-600 to-gray-700',
    icon: '🚛',
    badge: 'Professional',
    badgeColor: 'bg-slate-600',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Introduction to Commercial Driving', titleKiny: "Intangiriro y\'Kubaga Imodoka z\'Akazi", type: 'text', duration: '25 min', description: 'Overview of commercial driving requirements in Rwanda.' },
        { id: 2, title: 'Vehicle Inspections & Maintenance', titleKiny: "Kugenzura no Gutunga Imodoka", type: 'text', duration: '30 min', description: 'Pre-trip inspections and maintenance requirements for commercial vehicles.' },
        { id: 3, title: 'Loading & Weight Distribution', titleKiny: "Gutera n\'Kugabanya Uburemere", type: 'video', duration: '30 min', description: 'Proper loading techniques and weight distribution for safety.' },
        { id: 4, title: 'Braking Distances & Management', titleKiny: "Intero y\'Guhagarika n\'Yubwoko", type: 'interactive', duration: '30 min', description: 'Interactive calculator for braking distances based on load and speed.' },
        { id: 5, title: 'Maneuvering Large Vehicles', titleKiny: "Gukorora Ibinyabiziga Bikubye", type: 'interactive', duration: '30 min', description: 'Turning, reversing, and parking with large vehicles.' },
        { id: 6, title: 'Commercial Regulations in Rwanda', titleKiny: "Amategeko y\'Akazi mu Rwanda", type: 'text', duration: '25 min', description: 'Understanding Rwanda\'s commercial driving regulations and permits.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your commercial driving knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '25 min', description: 'Complete the commercial driving skills assessment.' },
      ],
    },
  },
  {
    id: 'night-adverse-weather',
    title: 'Night & Adverse Weather Driving',
    titleKiny: "Kubaga mu Gitondo n'Imvura y'Agaciro",
    description: 'Specialized training for driving at night, in heavy rain, fog, and on Rwanda\'s mountainous terrain. Master visibility management and hazard anticipation.',
    descriptionKiny: "Amahugurwa yo kubaga mu gitondo, mu imvura nzito, mu icyumba, n'ku miterero y'u Rwanda. Menya uburyo bwo kubona neza no kwitegura ibyago.",
    level: 'Advanced',
    levelKiny: 'Irwego ryegeje',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '4 hours',
    totalLessons: 8,
    gradient: 'from-indigo-600 via-purple-700 to-violet-800',
    icon: '🌙',
    badge: 'Specialized',
    badgeColor: 'bg-indigo-600',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Night Driving Fundamentals', titleKiny: "Amategeko y\'Kubaga mu Gitondo", type: 'text', duration: '25 min', description: 'Core principles for safe night driving in Rwanda.' },
        { id: 2, title: 'Headlight Management & Visibility', titleKiny: "Gukoresha Amatara no Kubona", type: 'interactive', duration: '25 min', description: 'Interactive lesson on headlight use and maximizing visibility.' },
        { id: 3, title: 'Driving in Heavy Rain', titleKiny: "Kubaga mu Rain Nzito", type: 'video', duration: '30 min', description: 'Techniques for driving safely in heavy rain and standing water.' },
        { id: 4, title: 'Fog & Low Visibility Conditions', titleKiny: "Fog n\'Igihe Gitategerezwa", type: 'interactive', duration: '25 min', description: 'Strategies for driving in fog and poor visibility conditions.' },
        { id: 5, title: 'Mountain & Hill Driving at Night', titleKiny: "Kubaga ku Mikenke mu Gitondo", type: 'text', duration: '25 min', description: 'Special considerations for Rwanda\'s mountainous terrain after dark.' },
        { id: 6, title: 'Hazard Anticipation Scenarios', titleKiny: "Amahugurwa y\'Kumenya Ibyago", type: 'interactive', duration: '30 min', description: 'Practice anticipating hazards in low-visibility scenarios.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your night and weather driving knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '25 min', description: 'Complete the adverse weather driving assessment.' },
      ],
    },
  },
  {
    id: 'professional-driver-cert',
    title: 'Professional Driver Certification',
    titleKiny: "Icyemezo c'Akazi c'Muyobozi w'Imodoka",
    description: 'Comprehensive certification course for aspiring professional drivers in Rwanda. Covers all aspects of professional driving standards, customer service, and legal compliance.',
    descriptionKiny: "Isomoro ry'icyemezo ryuzuye kuri abifuje kuba abashoferi b'akazi mu Rwanda. Ririnda uburyo bwose bwo kubaga neza, serivisi y'abakiriya, n'kwizera amategeko.",
    level: 'Advanced',
    levelKiny: 'Irwego ryegeje',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '5.5 hours',
    totalLessons: 8,
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    icon: '🏆',
    badge: 'Certification',
    badgeColor: 'bg-amber-500',
    curriculum: {
      title: 'Course Curriculum',
      titleKiny: "Ibikubiyemo by'Isomoro",
      lessons: [
        { id: 1, title: 'Professional Driving Standards', titleKiny: "Amategeko y\'Kubaga mu Rwanda", type: 'text', duration: '25 min', description: 'Overview of professional driving standards and expectations.' },
        { id: 2, title: 'Customer Service & Passenger Safety', titleKiny: "Serivisi y\'Abakiriya n\'Umutekano w\'Abagenzi", type: 'text', duration: '25 min', description: 'Providing excellent service while ensuring passenger safety.' },
        { id: 3, title: 'Legal Compliance & Documentation', titleKiny: "Kwizera Amategeko n\'Inyandiko", type: 'text', duration: '30 min', description: 'Understanding licensing, insurance, and regulatory requirements.' },
        { id: 4, title: 'Fuel Efficiency & Eco-Driving', titleKiny: "Gukoresha Amavunja n\'Kubaga mu Buryo bw\'Ibbumeri", type: 'video', duration: '30 min', description: 'Techniques for fuel-efficient and environmentally-friendly driving.' },
        { id: 5, title: 'Fatigue Management & Health', titleKiny: "Gukemura Ubukene n\'Ubuzima", type: 'text', duration: '25 min', description: 'Managing driver fatigue, health, and wellness for long shifts.' },
        { id: 6, title: 'Professional Scenario Practice', titleKiny: "Amahugurwa y\'Uburambe", type: 'interactive', duration: '35 min', description: 'Practice professional driving scenarios and customer interactions.' },
        { id: 7, title: 'Knowledge Quiz', titleKiny: "Ibufasha bw\'Ubumenyi", type: 'quiz', duration: '15 min', description: 'Test your professional driving knowledge.' },
        { id: 8, title: 'Final Assessment', titleKiny: "Isuzuma Ry\'Impera", type: 'assessment', duration: '25 min', description: 'Complete the professional driver certification assessment.' },
      ],
    },
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getCoursesByLevel(level: 'Beginner' | 'Intermediate' | 'Advanced'): Course[] {
  return courses.filter(c => c.level === level);
}
