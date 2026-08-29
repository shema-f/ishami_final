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
    titleKiny: "Amategeko y'Umuhanda yo Kuva Intangiriro",
    description: 'Build a strong foundation in Rwanda traffic rules. Learn core traffic signs, road markings, right of way, and the basic rules every driver must know.',
    descriptionKiny: "Shira imizi myiza mu mategeko y'umuhanda y'u Rwanda. Menya ibimenyetso by'umuhanda, amabwiriza, icyubahiro, n'amategeko arengewe abakenera kumenya.",
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
    titleKiny: "Kubaga Neza no Kubungabunga Umutekano",
    description: 'Master defensive driving techniques, learn to identify hazards, and protect pedestrians, cyclists, and yourself on Rwanda\'s roads.',
    descriptionKiny: "Jya urinda ikibazo, menya ingaruka, kandi urinde abagenzi n\'abashoferi bo ku muhanda wo mu Rwanda.",
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
    titleKiny: "Urugororano rw'Ibimenyetso n'Amabwiriza y'Umuhanda",
    description: 'Become an expert at recognizing and understanding every warning, regulatory, and informative sign on Rwanda\'s roads.',
    descriptionKiny: "Jya uzi neza kandi ujye umenya ibimenyetso byose by\'umuhanda, ibisangiza, n\'ibirikwa mu Rwanda.",
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
        { id: 2, title: 'Warning Signs', titleKiny: "Ibimenyetso by'Ik提醒", type: 'interactive', duration: '30 min', description: 'Interactive gallery of all warning signs with meanings.' },
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
    titleKiny: "Ibigereranyo, Ibipimo n'Icyubahiro",
    description: 'Master the most complex driving situations: T-junctions, crossroads, roundabouts, turning, and priority rules.',
    descriptionKiny: "Jya urinda imimerere y\'umuhanda: ibipimo, ibigereranyo, amakamyo, n\'icyubahiro.",
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
    titleKiny: "Amaha yo Kubaga n'Gukemura Ibibazo",
    description: 'Learn parking, overtaking, lane discipline, highway driving, and make better decisions behind the wheel.',
    descriptionKiny: "Menya gutega imodoka, gukemura ibibazo, kandi ujye ukemura neza uri mu modoka.",
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
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getCoursesByLevel(level: 'Beginner' | 'Intermediate' | 'Advanced'): Course[] {
  return courses.filter(c => c.level === level);
}
