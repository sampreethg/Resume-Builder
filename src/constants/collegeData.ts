export const SIET_COLLEGE_NAME = "Sri Shakthi Institute of Engineering and Technology";

export const SIET_UG_COURSES = [
  "B.E - Computer Science and Engineering",
  "B.Tech - Artificial Intelligence and Data Science",
  "B.Tech - Artificial Intelligence and Machine Learning",
  "B.E - Computer Science and Engineering (Cyber Security)",
  "B.Tech - Information Technology",
  "B.E - Electronics Engineering (VLSI Design & Technology)",
  "B.E - Electronics and Communication Engineering",
  "B.E - Electrical and Electronics Engineering",
  "B.E - Mechanical Engineering",
  "B.Tech - Agricultural Engineering",
  "B.Tech - Biotechnology",
  "B.E - Biomedical Engineering",
  "B.E - Civil Engineering",
  "B.Tech - Food Technology"
];

export const SCHOOL_BOARDS = [
  "CBSE Board",
  "State Board of Tamil Nadu",
  "Matriculation",
  "ICSE / ISC",
  "Other State Board"
];

export const COLLEGE_BOARDS = [
  "Anna University",
  "Autonomous (Sri Shakthi Institute of Engineering and Technology)",
  "Other University"
];

export const TARGET_ROLE_OPTIONS = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Data Scientist / AI Engineer",
  "Machine Learning Engineer",
  "Cloud / DevOps Engineer",
  "Cybersecurity Analyst",
  "Embedded Systems Engineer",
  "VLSI Design Engineer",
  "Quality Assurance (QA) / Automation Engineer",
  "Associate Software Engineer"
];

export const NATIONALITY_OPTIONS = [
  "Indian",
  "NRI"
];

export const HOMETOWN_OPTIONS = [
  "Coimbatore",
  "Tiruppur",
  "Erode",
  "Salem",
  "Chennai",
  "Madurai",
  "Trichy (Tiruchirappalli)",
  "Namakkal",
  "Dindigul",
  "Karur",
  "Pollachi",
  "Ooty (Nilgiris)",
  "Bengaluru",
  "Palakkad",
  "Kochi"
];

export const MOBILITY_OPTIONS = [
  "Willing to relocate anywhere in India",
  "Willing to relocate anywhere in South India",
  "Willing to relocate globally",
  "Prefer Coimbatore / Hybrid",
  "Prefer Chennai / Bengaluru",
  "Open to Remote / Hybrid Work"
];

export const COLLEGE_DURATION_OPTIONS = [
  "2024 - 2028",
  "2023 - 2027",
  "2022 - 2026",
  "2021 - 2025",
  "2020 - 2024",
  "2023 - 2026 (Lateral Entry)",
  "2022 - 2025 (Lateral Entry)"
];

export const HSC_YEAR_OPTIONS = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018"
];

export const SSLC_YEAR_OPTIONS = [
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016"
];

export const PRESET_LANGUAGES = [
  "Tamil",
  "English",
  "Hindi",
  "Malayalam",
  "Telugu",
  "Kannada",
  "French",
  "German",
  "Japanese",
  "Spanish"
];

export const DEFAULT_AREAS_OF_INTEREST = [
  "MERN Stack Development",
  "Software Development AR/VR",
  "Metaverse",
  "Cloud Architecture & DevOps",
  "Embedded Systems & IoT",
  "Deep Learning & NLP",
  "Cybersecurity & Pen Testing",
  "Robotics & Automation"
];

export const DEFAULT_SKILLS = {
  itLanguages: [
    "C",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "PHP",
    "SQL",
    "Go",
    "Rust"
  ],
  tools: [
    "Git & GitHub",
    "VS Code",
    "Postman",
    "Docker",
    "MS Office",
    "Figma",
    "Prisma",
    "Linux",
    "MongoDB Compass"
  ],
  coreNonIT: [
    "CAD-Sketching & Drawing",
    "2D-3D Solid Modeling",
    "HyperMesh",
    "LabVIEW",
    "MATLAB",
    "PLC Automation",
    "ANSYS",
    "Embedded C",
    "CATIA"
  ]
};

export const CERTIFICATION_PROVIDERS = [
  "UDEMY",
  "COURSERA",
  "NPTEL / SWAYAM",
  "GREAT LEARNING",
  "UNSTOP",
  "HACKERRANK",
  "AWS CERTIFIED",
  "GOOGLE CLOUD"
];

export const KEY_STRENGTHS_SUGGESTIONS = [
  "Excellent verbal and written communication",
  "Highly organized and efficient",
  "Humble and Honest",
  "Detail-oriented with strong analytical execution",
  "Adaptable and quick learner",
  "Collaborative team player",
  "Structured root-cause analysis & debugging",
  "Self-motivated and initiative-driven",
  "Strong time management and deadline discipline",
  "Systems thinking & problem-solving",
  "Cross-functional team leadership"
];

export interface FacultyRecord {
  id: string;
  department: string;
  name: string;
  designation: string;
  contact: string;
}

export const SIET_FACULTY_DEPARTMENTS = [
  "Institutional / Leadership",
  "Training & Placement (T&P)",
  "Computer Science and Engineering (CSE)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Information Technology (IT)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical and Electronics Engineering (EEE)",
  "Mechanical Engineering (MECH)",
  "Biotechnology & Biomedical Engineering",
  "Agricultural Engineering",
  "Civil Engineering"
];

export const SIET_FACULTY_CATALOG: FacultyRecord[] = [
  // Institutional / Leadership
  {
    id: "fac-inst-1",
    department: "Institutional / Leadership",
    name: "Dr. A. R. Kavitha",
    designation: "Principal & Professor",
    contact: "principal@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-inst-2",
    department: "Institutional / Leadership",
    name: "Dr. R. Manimegalai",
    designation: "Dean of Academic Affairs & Professor",
    contact: "dean@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Training & Placement
  {
    id: "fac-tp-1",
    department: "Training & Placement (T&P)",
    name: "Prof. S. Karthikeyan",
    designation: "Head - Training & Corporate Relations",
    contact: "placement@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-tp-2",
    department: "Training & Placement (T&P)",
    name: "Prof. M. Vijay Anand",
    designation: "Placement Officer & Assistant Professor",
    contact: "placements@siet.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Computer Science and Engineering (CSE)
  {
    id: "fac-cse-1",
    department: "Computer Science and Engineering (CSE)",
    name: "Dr. K. Senthil",
    designation: "Professor & Head of Department, CSE",
    contact: "hodcse@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-cse-2",
    department: "Computer Science and Engineering (CSE)",
    name: "Dr. P. Deepa",
    designation: "Associate Professor, CSE",
    contact: "deepa.cse@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-cse-3",
    department: "Computer Science and Engineering (CSE)",
    name: "Prof. R. Sathish Kumar",
    designation: "Assistant Professor (Senior Grade), CSE",
    contact: "sathishkumar.cse@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // AI & DS / AI & ML
  {
    id: "fac-aids-1",
    department: "Artificial Intelligence & Data Science (AI & DS)",
    name: "Dr. M. Suresh",
    designation: "Professor & Head of Department, AI & DS",
    contact: "hodaids@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-aids-2",
    department: "Artificial Intelligence & Data Science (AI & DS)",
    name: "Dr. S. Gayathri",
    designation: "Associate Professor, AI & DS",
    contact: "gayathri.aids@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Information Technology (IT)
  {
    id: "fac-it-1",
    department: "Information Technology (IT)",
    name: "Dr. V. Natesan",
    designation: "Professor & Head of Department, IT",
    contact: "hodit@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-it-2",
    department: "Information Technology (IT)",
    name: "Prof. K. Arulmani",
    designation: "Assistant Professor, IT",
    contact: "arulmani.it@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Electronics and Communication Engineering (ECE / VLSI)
  {
    id: "fac-ece-1",
    department: "Electronics and Communication Engineering (ECE)",
    name: "Dr. S. Prasanna Devi",
    designation: "Professor & Head of Department, ECE",
    contact: "hodece@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-ece-2",
    department: "Electronics and Communication Engineering (ECE)",
    name: "Dr. C. Saravanan",
    designation: "Professor, VLSI Design & Technology, ECE",
    contact: "saravanan.ece@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Electrical and Electronics Engineering (EEE)
  {
    id: "fac-eee-1",
    department: "Electrical and Electronics Engineering (EEE)",
    name: "Dr. R. Balaji",
    designation: "Professor & Head of Department, EEE",
    contact: "hodeee@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-eee-2",
    department: "Electrical and Electronics Engineering (EEE)",
    name: "Dr. G. Ramesh",
    designation: "Associate Professor, EEE",
    contact: "ramesh.eee@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Mechanical Engineering (MECH)
  {
    id: "fac-mech-1",
    department: "Mechanical Engineering (MECH)",
    name: "Dr. S. Sivasankaran",
    designation: "Professor & Head of Department, Mechanical Engineering",
    contact: "hodmech@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-mech-2",
    department: "Mechanical Engineering (MECH)",
    name: "Dr. P. Manickam",
    designation: "Professor, CAD/CAM & Robotics, Mechanical",
    contact: "manickam.mech@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Biotechnology & Biomedical
  {
    id: "fac-bio-1",
    department: "Biotechnology & Biomedical Engineering",
    name: "Dr. K. Jayanthi",
    designation: "Professor & Head of Department, Biotechnology",
    contact: "hodbiotech@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },
  {
    id: "fac-bio-2",
    department: "Biotechnology & Biomedical Engineering",
    name: "Dr. M. Sangeetha",
    designation: "Associate Professor & Head, Biomedical Engineering",
    contact: "hodbme@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Agricultural Engineering
  {
    id: "fac-agri-1",
    department: "Agricultural Engineering",
    name: "Dr. N. Thangaraj",
    designation: "Professor & Head of Department, Agricultural Engineering",
    contact: "hodagri@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  },

  // Civil Engineering
  {
    id: "fac-civil-1",
    department: "Civil Engineering",
    name: "Dr. T. Sivakumar",
    designation: "Professor & Head of Department, Civil Engineering",
    contact: "hodcivil@srishakthi.ac.in | Sri Shakthi Institute of Engineering and Technology"
  }
];
