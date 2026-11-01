export interface EducationEntry {
  degree: string;
  institution: string;
  boardOrUniversity?: string;
  duration: string;
  score: string;
}

export interface InternshipEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  departmentTag: string;
  description: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  domainTag: string;
  institution: string;
  duration: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface PublicationEntry {
  id: string;
  type: "Patent" | "Publication";
  title: string;
  citationDetails: string;
}

export interface WorkshopEntry {
  id: string;
  title: string;
  organizer: string;
  duration: string;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  designation: string;
  contact: string;
}

export interface ResumeData {
  themeColor: string;
  photoUrl: string; // Base64 data URL from local JPG/JPEG file
  fullName: string;
  targetRole: string;
  collegeEmail: string;
  personalEmail: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;

  // Page 1
  education: EducationEntry[];
  areasOfInterest: string[];
  itSkills: string[];
  toolsSoftware: string[];
  coreSkills: string[];

  // Page 2
  certifications: string[];
  keyStrengths: string[];
  internships: InternshipEntry[];
  page2Projects: ProjectEntry[];

  // Page 3
  page3Projects: ProjectEntry[];
  languages: string[];
  publications: PublicationEntry[];
  workshops: WorkshopEntry[];

  // Page 4
  achievements: string[];
  volunteerExp: Array<{ id: string; role: string; description: string }>;
  dob: string;
  gender: string;
  nationality: string;
  hometown: string;
  permanentAddress: string;
  phonePersonal: string;
  mobility: string;
  references: ReferenceEntry[];
  declarationDate: string;
  declarationPlace: string;
}
