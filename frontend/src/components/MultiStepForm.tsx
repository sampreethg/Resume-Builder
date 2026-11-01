"use client";

import React, { useState, useRef } from "react";
import {
  ResumeData,
  EducationEntry,
  InternshipEntry,
  ProjectEntry,
  PublicationEntry,
  WorkshopEntry,
  ReferenceEntry
} from "@/types/resume";
import {
  SIET_COLLEGE_NAME,
  SIET_UG_COURSES,
  SCHOOL_BOARDS,
  COLLEGE_BOARDS,
  TARGET_ROLE_OPTIONS,
  NATIONALITY_OPTIONS,
  HOMETOWN_OPTIONS,
  MOBILITY_OPTIONS,
  COLLEGE_DURATION_OPTIONS,
  HSC_YEAR_OPTIONS,
  SSLC_YEAR_OPTIONS,
  PRESET_LANGUAGES,
  DEFAULT_AREAS_OF_INTEREST,
  DEFAULT_SKILLS,
  CERTIFICATION_PROVIDERS,
  KEY_STRENGTHS_SUGGESTIONS,
  SIET_FACULTY_DEPARTMENTS,
  SIET_FACULTY_CATALOG,
  FacultyRecord
} from "@/constants/collegeData";
import { SIET_CSE_FACULTY, FacultyMember } from "@/constants/cseFacultyData";
import {
  Plus,
  Trash2,
  Sparkles,
  Info,
  BookOpen,
  Briefcase,
  FolderGit2,
  Award,
  Upload,
  Image as ImageIcon,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { fetchGitHubRepoDetails } from "@/utils/github";
import { validatePassportPhoto } from "@/utils/security";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenAIModal: () => void;
}

export default function MultiStepForm({ data, onChange, onOpenAIModal }: Props) {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [githubLoadingMap, setGithubLoadingMap] = useState<Record<string, boolean>>({});
  const [githubStatusMap, setGithubStatusMap] = useState<Record<string, { type: "success" | "error"; message: string }>>({});
  const [refDeptFilter, setRefDeptFilter] = useState<Record<string, string>>({
    ref1: "Computer Science and Engineering (CSE)",
    ref2: "Institutional / Leadership"
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  // Local File Upload with HTML5 FileReader & Strict Client Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePassportPhoto(file);
    if (!validation.valid) {
      alert(validation.error || "Invalid photograph file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updateField("photoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Education Helpers
  const handleEduChange = (index: number, field: keyof EducationEntry, val: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: val };
    updateField("education", updated);
  };

  // Array toggler
  const toggleArrayItem = (
    field: "areasOfInterest" | "certifications" | "keyStrengths" | "languages" | "itSkills" | "toolsSoftware" | "coreSkills",
    item: string
  ) => {
    const current = data[field];
    if (current.includes(item)) {
      updateField(
        field,
        current.filter((i) => i !== item)
      );
    } else {
      updateField(field, [...current, item]);
    }
  };

  const addCustomItem = (
    field: "areasOfInterest" | "certifications" | "keyStrengths" | "languages" | "itSkills" | "toolsSoftware" | "coreSkills",
    item: string
  ) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    // Case-insensitive duplicate check
    const exists = data[field].some((val) => val.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;
    updateField(field, [...data[field], trimmed]);
  };

  // Internship Helpers
  const addInternship = () => {
    const newIntern: InternshipEntry = {
      id: Date.now().toString(),
      role: "",
      company: "",
      duration: "",
      departmentTag: "IT Dept",
      description: ""
    };
    updateField("internships", [...data.internships, newIntern]);
  };

  const updateInternship = (id: string, field: keyof InternshipEntry, val: string) => {
    updateField(
      "internships",
      data.internships.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const removeInternship = (id: string) => {
    updateField(
      "internships",
      data.internships.filter((i) => i.id !== id)
    );
  };

  // Project Helpers
  const updateProject = (
    listKey: "page2Projects" | "page3Projects",
    id: string,
    field: keyof ProjectEntry,
    val: string
  ) => {
    updateField(
      listKey,
      data[listKey].map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const addProject = (listKey: "page2Projects" | "page3Projects") => {
    const newProj: ProjectEntry = {
      id: Date.now().toString(),
      title: "",
      domainTag: "FULL STACK",
      institution: SIET_COLLEGE_NAME,
      duration: "1 Month",
      description: "",
      githubUrl: ""
    };
    updateField(listKey, [...data[listKey], newProj]);
  };

  const removeProject = (listKey: "page2Projects" | "page3Projects", id: string) => {
    updateField(
      listKey,
      data[listKey].filter((p) => p.id !== id)
    );
  };

  // GitHub Auto-Fill Handler for both Page 2 and Page 3 projects
  const handleFetchGitHub = async (
    listKey: "page2Projects" | "page3Projects",
    projectId: string,
    githubUrl?: string
  ) => {
    if (!githubUrl || !githubUrl.trim()) {
      setGithubStatusMap((prev) => ({
        ...prev,
        [projectId]: { type: "error", message: "Please enter a valid GitHub repository URL first." }
      }));
      return;
    }

    setGithubLoadingMap((prev) => ({ ...prev, [projectId]: true }));
    setGithubStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
    });

    try {
      const details = await fetchGitHubRepoDetails(githubUrl);

      // Update project entry in either page2Projects or page3Projects
      const updatedProjects = data[listKey].map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            title: details.title || p.title,
            domainTag: details.domainTag || p.domainTag,
            description: details.description || p.description,
            liveUrl: details.homepage || p.liveUrl || "",
            institution: p.institution || SIET_COLLEGE_NAME,
            duration: p.duration || "1 Month"
          };
        }
        return p;
      });

      updateField(listKey, updatedProjects);

      setGithubStatusMap((prev) => ({
        ...prev,
        [projectId]: {
          type: "success",
          message: `Imported "${details.title}" (${details.techStack.slice(0, 3).join(", ") || details.domainTag})!`
        }
      }));

      // Clear toast after 4s
      setTimeout(() => {
        setGithubStatusMap((prev) => {
          const copy = { ...prev };
          delete copy[projectId];
          return copy;
        });
      }, 4000);
    } catch (err: any) {
      setGithubStatusMap((prev) => ({
        ...prev,
        [projectId]: {
          type: "error",
          message: err?.message || "Could not fetch repo. Ensure the repository is public."
        }
      }));
    } finally {
      setGithubLoadingMap((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  // Publications
  const addPublication = () => {
    const newPub: PublicationEntry = {
      id: Date.now().toString(),
      type: "Publication",
      title: "",
      citationDetails: ""
    };
    updateField("publications", [...data.publications, newPub]);
  };

  const updatePublication = (id: string, field: keyof PublicationEntry, val: string) => {
    updateField(
      "publications",
      data.publications.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const removePublication = (id: string) => {
    updateField(
      "publications",
      data.publications.filter((p) => p.id !== id)
    );
  };

  // Workshops
  const addWorkshop = () => {
    const newW: WorkshopEntry = {
      id: Date.now().toString(),
      title: "",
      organizer: "",
      duration: "1 Day"
    };
    updateField("workshops", [...data.workshops, newW]);
  };

  const updateWorkshop = (id: string, field: keyof WorkshopEntry, val: string) => {
    updateField(
      "workshops",
      data.workshops.map((w) => (w.id === id ? { ...w, [field]: val } : w))
    );
  };

  const removeWorkshop = (id: string) => {
    updateField(
      "workshops",
      data.workshops.filter((w) => w.id !== id)
    );
  };

  // References
  const updateRef = (id: string, field: keyof ReferenceEntry, val: string) => {
    updateField(
      "references",
      data.references.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const updateRefAll = (
    id: string,
    updates: Partial<Omit<ReferenceEntry, "id">>
  ) => {
    updateField(
      "references",
      data.references.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-3 gap-1 shrink-0">
        {[
          { tab: 1 as const, label: "Page 1: Profile & Skills", icon: BookOpen },
          { tab: 2 as const, label: "Page 2: Exp & Projects", icon: Briefcase },
          { tab: 3 as const, label: "Page 3: Research & Talks", icon: FolderGit2 },
          { tab: 4 as const, label: "Page 4: Leadership & Bio", icon: Award }
        ].map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-md border-t border-l border-r transition-all ${
              activeTab === tab
                ? "bg-white border-neutral-300 border-b-transparent text-neutral-900 shadow-xs -mb-[1px]"
                : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* ================= TAB 1 ================= */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Page 1 — Profile, Education & Skills Matrix
              </h2>
              <p className="text-xs text-neutral-500">
                Personal contacts, local passport photo upload, official SIET program degrees, and technical skills.
              </p>
            </div>

            {/* Passport Photo Upload Box */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md">
              <label className="block text-xs font-bold text-neutral-800 uppercase mb-1">
                Passport Photograph (JPG / JPEG)
              </label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-20 border border-neutral-300 rounded-xs bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {data.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <p className="text-[11px] text-neutral-600 leading-snug">
                    Upload a local JPG or JPEG image. Parsed into Base64 format for instant rendering in the 3:4 passport frame.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="passport-file-input"
                    />
                    <label
                      htmlFor="passport-file-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded transition shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{data.photoUrl ? "Replace Photo" : "Upload JPG Photo"}</span>
                    </label>

                    {data.photoUrl && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded font-medium transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="e.g. AJITH KUMAR"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Target Role
                </label>
                <select
                  value={TARGET_ROLE_OPTIONS.includes(data.targetRole) ? data.targetRole : "CUSTOM"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "CUSTOM") {
                      updateField("targetRole", "");
                    } else {
                      updateField("targetRole", val);
                    }
                  }}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded bg-white focus:border-neutral-900 focus:outline-hidden"
                >
                  <option value="">Select Target Role</option>
                  {TARGET_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                  <option value="CUSTOM">✍️ Other / Custom Role...</option>
                </select>
                {!TARGET_ROLE_OPTIONS.includes(data.targetRole) && (
                  <input
                    type="text"
                    value={data.targetRole}
                    onChange={(e) => updateField("targetRole", e.target.value)}
                    placeholder="Type custom target role (e.g. DevOps Engineer)"
                    className="mt-2 w-full text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden bg-neutral-50"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  College Email (@srishakthi.ac.in)
                </label>
                <input
                  type="email"
                  value={data.collegeEmail}
                  onChange={(e) => updateField("collegeEmail", e.target.value)}
                  placeholder="ajithkumar@srishakthi.ac.in"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Personal Email
                </label>
                <input
                  type="email"
                  value={data.personalEmail}
                  onChange={(e) => updateField("personalEmail", e.target.value)}
                  placeholder="ajith.dev@gmail.com"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 9847123456"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={data.linkedin}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/ajith-kumar"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  value={data.github}
                  onChange={(e) => updateField("github", e.target.value)}
                  placeholder="github.com/ajithkumar"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Objective with ChatGPT Button */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase">
                  Professional Objective / Summary
                </label>
                <button
                  type="button"
                  onClick={onOpenAIModal}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-2.5 py-1 rounded font-medium transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Summary Prompt</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={data.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder="A concise, high-impact career objective tailored to your core discipline..."
                className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden font-sans"
              />
            </div>

            {/* Education Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                Education Entries (Chronological)
              </h3>
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800 uppercase text-[11px]">
                      Entry #{idx + 1}: {idx === 0 ? "Undergraduate (SIET)" : idx === 1 ? "12th / HSC" : "10th / SSLC"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">
                        Degree / Program Name
                      </label>
                      {idx === 0 ? (
                        <div>
                          <select
                            value={SIET_UG_COURSES.includes(edu.degree) ? edu.degree : "CUSTOM"}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleEduChange(idx, "degree", val === "CUSTOM" ? "" : val);
                            }}
                            className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                          >
                            <option value="">Select Degree / Program</option>
                            {SIET_UG_COURSES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                            <option value="CUSTOM">✍️ Other / Custom Degree...</option>
                          </select>
                          {!SIET_UG_COURSES.includes(edu.degree) && (
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                              placeholder="e.g. B.E - Computer Science and Engineering"
                              className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                          className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                        className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">
                        Board / University
                      </label>
                      {idx === 0 ? (
                        <div>
                          <select
                            value={COLLEGE_BOARDS.includes(edu.boardOrUniversity || "") ? edu.boardOrUniversity : "CUSTOM"}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleEduChange(idx, "boardOrUniversity", val === "CUSTOM" ? "" : val);
                            }}
                            className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                          >
                            {COLLEGE_BOARDS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                            <option value="CUSTOM">✍️ Other University...</option>
                          </select>
                          {!COLLEGE_BOARDS.includes(edu.boardOrUniversity || "") && (
                            <input
                              type="text"
                              value={edu.boardOrUniversity || ""}
                              onChange={(e) => handleEduChange(idx, "boardOrUniversity", e.target.value)}
                              placeholder="Enter custom university name"
                              className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          <select
                            value={SCHOOL_BOARDS.includes(edu.boardOrUniversity || "") ? edu.boardOrUniversity : "CUSTOM"}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleEduChange(idx, "boardOrUniversity", val === "CUSTOM" ? "" : val);
                            }}
                            className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                          >
                            <option value="">Select Board</option>
                            {SCHOOL_BOARDS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                            <option value="CUSTOM">✍️ Other Board...</option>
                          </select>
                          {!SCHOOL_BOARDS.includes(edu.boardOrUniversity || "") && (
                            <input
                              type="text"
                              value={edu.boardOrUniversity || ""}
                              onChange={(e) => handleEduChange(idx, "boardOrUniversity", e.target.value)}
                              placeholder="Enter custom board name"
                              className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">
                          {idx === 0 ? "Academic Batch / Duration" : "Passing Year"}
                        </label>
                        {idx === 0 ? (
                          <div>
                            <select
                              value={COLLEGE_DURATION_OPTIONS.includes(edu.duration) ? edu.duration : "CUSTOM"}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleEduChange(idx, "duration", val === "CUSTOM" ? "" : val);
                              }}
                              className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                            >
                              <option value="">Select Batch Duration</option>
                              {COLLEGE_DURATION_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                {opt}
                                </option>
                              ))}
                              <option value="CUSTOM">✍️ Other / Custom Duration...</option>
                            </select>
                            {!COLLEGE_DURATION_OPTIONS.includes(edu.duration) && (
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => handleEduChange(idx, "duration", e.target.value)}
                                placeholder="e.g. 2022 - 2026 or 2023 - 2027"
                                className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                              />
                            )}
                          </div>
                        ) : idx === 1 ? (
                          <div>
                            <select
                              value={HSC_YEAR_OPTIONS.includes(edu.duration) ? edu.duration : "CUSTOM"}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleEduChange(idx, "duration", val === "CUSTOM" ? "" : val);
                              }}
                              className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                            >
                              <option value="">Select Passing Year</option>
                              {HSC_YEAR_OPTIONS.map((yr) => (
                                <option key={yr} value={yr}>
                                  {yr}
                                </option>
                              ))}
                              <option value="CUSTOM">✍️ Other Year...</option>
                            </select>
                            {!HSC_YEAR_OPTIONS.includes(edu.duration) && (
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => handleEduChange(idx, "duration", e.target.value)}
                                placeholder="e.g. 2022"
                                className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            <select
                              value={SSLC_YEAR_OPTIONS.includes(edu.duration) ? edu.duration : "CUSTOM"}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleEduChange(idx, "duration", val === "CUSTOM" ? "" : val);
                              }}
                              className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                            >
                              <option value="">Select Passing Year</option>
                              {SSLC_YEAR_OPTIONS.map((yr) => (
                                <option key={yr} value={yr}>
                                  {yr}
                                </option>
                              ))}
                              <option value="CUSTOM">✍️ Other Year...</option>
                            </select>
                            {!SSLC_YEAR_OPTIONS.includes(edu.duration) && (
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => handleEduChange(idx, "duration", e.target.value)}
                                placeholder="e.g. 2020"
                                className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-0.5">
                          Score / CGPA
                        </label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) => handleEduChange(idx, "score", e.target.value)}
                          placeholder="8.2 CGPA or 92%"
                          className="w-full text-xs p-2 border border-neutral-300 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Areas of Interest */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Areas of Interest
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {Array.from(new Set([...DEFAULT_AREAS_OF_INTEREST, ...data.areasOfInterest])).map((item) => {
                  const active = data.areasOfInterest.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem("areasOfInterest", item)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                        active
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                          : "border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type custom interest and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomItem("areasOfInterest", (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (input && input.value) {
                      addCustomItem("areasOfInterest", input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>

            {/* Interactive Skills Matrix Configuration */}
            <div className="space-y-4 pt-2 border-t border-neutral-200">
              <label className="block text-xs font-bold uppercase text-neutral-800 tracking-wider">
                Skills Matrix Configuration
              </label>

              {/* 1. IT Languages */}
              <div>
                <span className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  IT Languages
                </span>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(new Set([...DEFAULT_SKILLS.itLanguages, ...data.itSkills])).map((lang) => {
                    const active = data.itSkills.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem("itSkills", lang)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          active
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                            : "border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom programming language and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem("itSkills", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input && input.value) {
                        addCustomItem("itSkills", input.value);
                        input.value = "";
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>

              {/* 2. Tools & Software */}
              <div>
                <span className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Tools & Software
                </span>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(new Set([...DEFAULT_SKILLS.tools, ...data.toolsSoftware])).map((tool) => {
                    const active = data.toolsSoftware.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleArrayItem("toolsSoftware", tool)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          active
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                            : "border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom tool/software and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem("toolsSoftware", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input && input.value) {
                        addCustomItem("toolsSoftware", input.value);
                        input.value = "";
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>

              {/* 3. Core Engineering / Non-IT Skills */}
              <div>
                <span className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Core Engineering / Non-IT Skills
                </span>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(new Set([...DEFAULT_SKILLS.coreNonIT, ...data.coreSkills])).map((skill) => {
                    const active = data.coreSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleArrayItem("coreSkills", skill)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          active
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                            : "border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom core engineering skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomItem("coreSkills", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input && input.value) {
                        addCustomItem("coreSkills", input.value);
                        input.value = "";
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2 ================= */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Page 2 — Certifications, Key Strengths & Flagship Projects
              </h2>
              <p className="text-xs text-neutral-500">
                Industry credentials, behavioral strengths, internships, and primary flagship projects.
              </p>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Certifications
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {CERTIFICATION_PROVIDERS.map((prov) => {
                  const hasProv = data.certifications.some((c) => c.toUpperCase().includes(prov));
                  return (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => addCustomItem("certifications", `${prov} - Domain Certification`)}
                      className={`text-[11px] px-2 py-1 rounded border transition ${
                        hasProv
                          ? "bg-neutral-800 border-neutral-800 text-white"
                          : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      + {prov}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 mb-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => {
                        const copy = [...data.certifications];
                        copy[idx] = e.target.value;
                        updateField("certifications", copy);
                      }}
                      className="flex-1 text-xs p-1.5 border border-neutral-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "certifications",
                          data.certifications.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-neutral-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateField("certifications", [...data.certifications, "New Certificate"])}
                className="text-xs text-neutral-700 font-medium inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Certificate Entry
              </button>
            </div>

            {/* Key Strengths */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Key Strengths
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {Array.from(new Set([...KEY_STRENGTHS_SUGGESTIONS, ...data.keyStrengths])).map((str) => {
                  const active = data.keyStrengths.includes(str);
                  const isCustom = !KEY_STRENGTHS_SUGGESTIONS.includes(str);
                  return (
                    <div
                      key={str}
                      className={`inline-flex items-center text-[11px] rounded-full border transition font-medium ${
                        active
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                          : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleArrayItem("keyStrengths", str)}
                        className="px-2.5 py-1 text-left"
                      >
                        {str}
                      </button>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateField(
                              "keyStrengths",
                              data.keyStrengths.filter((s) => s !== str)
                            );
                          }}
                          className={`pr-2 pl-0.5 py-1 text-xs hover:opacity-75 ${
                            active ? "text-neutral-300 hover:text-white" : "text-neutral-400 hover:text-neutral-800"
                          }`}
                          title="Remove custom strength"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type custom strength and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomItem("keyStrengths", (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (input && input.value) {
                      addCustomItem("keyStrengths", input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>

            {/* Internships */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Internships & Industrial Training
                </label>
                <button
                  type="button"
                  onClick={addInternship}
                  className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Internship
                </button>
              </div>

              {data.internships.length === 0 ? (
                <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No internships added yet. Click &quot;+ Add Internship&quot; to add company experience.
                </div>
              ) : (
                data.internships.map((intern) => (
                <div key={intern.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800">Internship Details</span>
                    <button
                      type="button"
                      onClick={() => removeInternship(intern.id)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Role / Designation</label>
                      <input
                        type="text"
                        value={intern.role}
                        onChange={(e) => updateInternship(intern.id, "role", e.target.value)}
                        placeholder="e.g. Data Analyst Intern"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Company / Firm</label>
                      <input
                        type="text"
                        value={intern.company}
                        onChange={(e) => updateInternship(intern.id, "company", e.target.value)}
                        placeholder="e.g. Cognitive Solutions"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={intern.duration}
                        onChange={(e) => updateInternship(intern.id, "duration", e.target.value)}
                        placeholder="Jan 2024 - Apr 2024"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Department Tag</label>
                      <input
                        type="text"
                        value={intern.departmentTag}
                        onChange={(e) => updateInternship(intern.id, "departmentTag", e.target.value)}
                        placeholder="e.g. IT Dept"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={intern.description}
                      onChange={(e) => updateInternship(intern.id, "description", e.target.value)}
                      placeholder="Extracted and integrated datasets..."
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Flagship Projects (Part 1) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Flagship Projects (Page 2)
                </label>
                <button
                  type="button"
                  onClick={() => addProject("page2Projects")}
                  className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {data.page2Projects.length === 0 ? (
                <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No flagship projects added yet. Click &quot;+ Add Project&quot; to document your capstone projects.
                </div>
              ) : (
                data.page2Projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800">Featured Project Entry</span>
                    <button
                      type="button"
                      onClick={() => removeProject("page2Projects", proj.id)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject("page2Projects", proj.id, "title", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Domain Tag</label>
                      <input
                        type="text"
                        value={proj.domainTag}
                        onChange={(e) => updateProject("page2Projects", proj.id, "domainTag", e.target.value)}
                        placeholder="e.g. FULL STACK"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Institution</label>
                      <input
                        type="text"
                        value={proj.institution}
                        onChange={(e) => updateProject("page2Projects", proj.id, "institution", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={proj.duration}
                        onChange={(e) => updateProject("page2Projects", proj.id, "duration", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject("page2Projects", proj.id, "description", e.target.value)}
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <label className="text-[11px] text-neutral-600 font-medium">GitHub Repository URL</label>
                        </div>
                        <input
                          type="text"
                          value={proj.githubUrl || ""}
                          onChange={(e) => updateProject("page2Projects", proj.id, "githubUrl", e.target.value)}
                          placeholder="https://github.com/owner/repo"
                          className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-600 mb-0.5 font-medium">Live Demo URL (Optional)</label>
                        <input
                          type="text"
                          value={proj.liveUrl || ""}
                          onChange={(e) => updateProject("page2Projects", proj.id, "liveUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Auto-Fetch GitHub Button & Status Toast */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={githubLoadingMap[proj.id] || !proj.githubUrl}
                        onClick={() => handleFetchGitHub("page2Projects", proj.id, proj.githubUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded transition shadow-xs disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {githubLoadingMap[proj.id] ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Fetching Repo Details...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>⚡ Auto-Fill from GitHub</span>
                          </>
                        )}
                      </button>

                      {githubStatusMap[proj.id] && (
                        <div
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded ${
                            githubStatusMap[proj.id].type === "success"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {githubStatusMap[proj.id].type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <span>{githubStatusMap[proj.id].message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3 ================= */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Page 3 — Research, Secondary Projects & Trainings
              </h2>
              <p className="text-xs text-neutral-500">
                Patents, publications, technical seminars, and auxiliary projects.
              </p>
            </div>

            {/* Social Media Reminder Callout */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">
                  Tip: Review your LinkedIn profile posts or college WhatsApp groups to recall workshop names and dates!
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Checking symposium event brochures and certificates saved on your drive helps extract exact dates and official organizer titles.
                </p>
              </div>
            </div>

            {/* Additional Projects (Page 3) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Additional Projects (Page 3)
                </label>
                <button
                  type="button"
                  onClick={() => addProject("page3Projects")}
                  className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {data.page3Projects.length === 0 ? (
                <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No additional projects added yet. Click &quot;+ Add Project&quot; to include mini-projects or prototypes.
                </div>
              ) : (
                data.page3Projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800">Project Entry</span>
                    <button
                      type="button"
                      onClick={() => removeProject("page3Projects", proj.id)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject("page3Projects", proj.id, "title", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Domain Tag</label>
                      <input
                        type="text"
                        value={proj.domainTag}
                        onChange={(e) => updateProject("page3Projects", proj.id, "domainTag", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Institution</label>
                      <input
                        type="text"
                        value={proj.institution}
                        onChange={(e) => updateProject("page3Projects", proj.id, "institution", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={proj.duration}
                        onChange={(e) => updateProject("page3Projects", proj.id, "duration", e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject("page3Projects", proj.id, "description", e.target.value)}
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5 font-medium">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject("page3Projects", proj.id, "githubUrl", e.target.value)}
                        placeholder="https://github.com/owner/repo"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-mono"
                      />
                    </div>

                    {/* Auto-Fetch GitHub Button & Status Toast */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={githubLoadingMap[proj.id] || !proj.githubUrl}
                        onClick={() => handleFetchGitHub("page3Projects", proj.id, proj.githubUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded transition shadow-xs disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {githubLoadingMap[proj.id] ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Fetching Repo Details...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>⚡ Auto-Fill from GitHub</span>
                          </>
                        )}
                      </button>

                      {githubStatusMap[proj.id] && (
                        <div
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded ${
                            githubStatusMap[proj.id].type === "success"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {githubStatusMap[proj.id].type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <span>{githubStatusMap[proj.id].message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Languages Known */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Languages Known
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {Array.from(new Set([...PRESET_LANGUAGES, ...data.languages])).map((lang) => {
                  const active = data.languages.includes(lang);
                  const isCustom = !PRESET_LANGUAGES.includes(lang);
                  return (
                    <div
                      key={lang}
                      className={`inline-flex items-center text-[11px] rounded-full border transition font-medium ${
                        active
                          ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                          : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleArrayItem("languages", lang)}
                        className="px-2.5 py-1 text-left"
                      >
                        {lang}
                      </button>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateField(
                              "languages",
                              data.languages.filter((l) => l.toLowerCase() !== lang.toLowerCase())
                            );
                          }}
                          className={`pr-2 pl-0.5 py-1 text-xs hover:opacity-75 ${
                            active ? "text-neutral-300 hover:text-white" : "text-neutral-400 hover:text-neutral-800"
                          }`}
                          title="Remove custom language"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type language and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomItem("languages", (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="flex-1 text-xs p-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    if (input && input.value) {
                      addCustomItem("languages", input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-black transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Language
                </button>
              </div>
            </div>

            {/* Patents & Publications */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Patents & Research Publications
                </label>
                <button
                  type="button"
                  onClick={addPublication}
                  className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Research Entry
                </button>
              </div>

              {data.publications.length === 0 ? (
                <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No research entries added yet. Click &quot;+ Add Research Entry&quot; to document papers or patents.
                </div>
              ) : (
                data.publications.map((pub) => (
                <div key={pub.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <select
                      value={pub.type}
                      onChange={(e) => updatePublication(pub.id, "type", e.target.value as "Patent" | "Publication")}
                      className="text-xs font-semibold p-1 border border-neutral-300 rounded bg-white"
                    >
                      <option value="Patent">Patent</option>
                      <option value="Publication">Publication</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removePublication(pub.id)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => updatePublication(pub.id, "title", e.target.value)}
                      placeholder="Title of patent or research publication"
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">
                      Citation / DOI / Application Details
                    </label>
                    <input
                      type="text"
                      value={pub.citationDetails}
                      onChange={(e) => updatePublication(pub.id, "citationDetails", e.target.value)}
                      placeholder="e.g. DOI: 10.17485/..., Indian Journal of Science, Application Ref..."
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Workshops */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Workshops & Technical Seminars
                </label>
                <button
                  type="button"
                  onClick={addWorkshop}
                  className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 hover:bg-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Workshop
                </button>
              </div>

              {data.workshops.length === 0 ? (
                <div className="p-3 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No workshops added yet. Click &quot;+ Add Workshop&quot; to list technical seminars.
                </div>
              ) : (
                data.workshops.map((w) => (
                <div key={w.id} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-800">Workshop Entry</span>
                    <button
                      type="button"
                      onClick={() => removeWorkshop(w.id)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Workshop Title</label>
                      <input
                        type="text"
                        value={w.title}
                        onChange={(e) => updateWorkshop(w.id, "title", e.target.value)}
                        placeholder="e.g. Drone Development Workshop"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={w.duration}
                        onChange={(e) => updateWorkshop(w.id, "duration", e.target.value)}
                        placeholder="2 Days"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Organizing Institute / College</label>
                    <input
                      type="text"
                      value={w.organizer}
                      onChange={(e) => updateWorkshop(w.id, "organizer", e.target.value)}
                      placeholder="e.g. MIT Chennai"
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4 ================= */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                Page 4 — Leadership, Dossier, References & Declaration
              </h2>
              <p className="text-xs text-neutral-500">
                Extra-curricular achievements, verification details, references, and institutional declaration.
              </p>
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Achievements & Awards (one per row)
              </label>
              <div className="space-y-1.5 mb-2">
                {data.achievements.length === 0 ? (
                  <div className="p-2.5 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                    No achievements listed yet. Click &quot;+ Add Achievement&quot; below.
                  </div>
                ) : (
                  data.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => {
                        const copy = [...data.achievements];
                        copy[idx] = e.target.value;
                        updateField("achievements", copy);
                      }}
                      className="flex-1 text-xs p-1.5 border border-neutral-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "achievements",
                          data.achievements.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-neutral-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={() => updateField("achievements", [...data.achievements, "New Achievement"])}
                className="text-xs text-neutral-700 font-medium inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Achievement
              </button>
            </div>

            {/* Volunteer Experience */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700 uppercase">
                Volunteer & Club Leadership
              </label>
              {data.volunteerExp.length === 0 ? (
                <div className="p-2.5 bg-neutral-50 rounded border border-dashed border-neutral-300 text-center text-xs text-neutral-500">
                  No volunteer or club leadership records added yet.
                </div>
              ) : (
                data.volunteerExp.map((v, idx) => (
                <div key={v.id} className="p-2.5 bg-neutral-50 rounded border border-neutral-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={v.role}
                      onChange={(e) => {
                        const copy = [...data.volunteerExp];
                        copy[idx].role = e.target.value;
                        updateField("volunteerExp", copy);
                      }}
                      placeholder="Club / Leadership Role"
                      className="flex-1 font-semibold text-xs p-1 border border-neutral-300 rounded mr-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "volunteerExp",
                          data.volunteerExp.filter((item) => item.id !== v.id)
                        )
                      }
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={v.description}
                    onChange={(e) => {
                      const copy = [...data.volunteerExp];
                      copy[idx].description = e.target.value;
                      updateField("volunteerExp", copy);
                    }}
                    placeholder="Brief impact description..."
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  />
                </div>
                ))
              )}
            </div>

            {/* Personal Dossier */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700 uppercase">
                Personal Verification Dossier
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[11px] text-neutral-600 font-medium">Date of Birth</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Format: DD-MM-YYYY</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={data.dob}
                        maxLength={10}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9-]/g, "");
                          // Auto format digits to DD-MM-YYYY
                          const rawDigits = val.replace(/-/g, "");
                          if (rawDigits.length > 2 && rawDigits.length <= 4 && !val.includes("-")) {
                            val = `${rawDigits.slice(0, 2)}-${rawDigits.slice(2)}`;
                          } else if (rawDigits.length > 4) {
                            val = `${rawDigits.slice(0, 2)}-${rawDigits.slice(2, 4)}-${rawDigits.slice(4, 8)}`;
                          }
                          updateField("dob", val);
                        }}
                        placeholder="DD-MM-YYYY (e.g. 05-06-2003)"
                        className="w-full text-xs p-1.5 pr-8 border border-neutral-300 rounded font-mono bg-white focus:border-neutral-900 focus:outline-hidden"
                      />
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2 pointer-events-none" />
                    </div>

                    {/* Native Date Picker Helper */}
                    <div className="relative" title="Pick date using calendar">
                      <input
                        type="date"
                        max="2009-12-31"
                        min="1990-01-01"
                        onChange={(e) => {
                          const dateVal = e.target.value; // YYYY-MM-DD
                          if (dateVal) {
                            const [year, month, day] = dateVal.split("-");
                            updateField("dob", `${day}-${month}-${year}`);
                          }
                        }}
                        className="w-8 h-7 opacity-0 absolute inset-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        className="w-8 h-7 flex items-center justify-center border border-neutral-300 rounded bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Gender</span>
                  <select
                    value={data.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Nationality</span>
                  <select
                    value={NATIONALITY_OPTIONS.includes(data.nationality) ? data.nationality : "CUSTOM"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField("nationality", val === "CUSTOM" ? "" : val);
                    }}
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  >
                    {NATIONALITY_OPTIONS.map((nat) => (
                      <option key={nat} value={nat}>
                        {nat}
                      </option>
                    ))}
                    <option value="CUSTOM">✍️ Other...</option>
                  </select>
                  {!NATIONALITY_OPTIONS.includes(data.nationality) && (
                    <input
                      type="text"
                      value={data.nationality}
                      onChange={(e) => updateField("nationality", e.target.value)}
                      placeholder="Enter nationality"
                      className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                    />
                  )}
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Hometown</span>
                  <select
                    value={HOMETOWN_OPTIONS.includes(data.hometown) ? data.hometown : "CUSTOM"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField("hometown", val === "CUSTOM" ? "" : val);
                    }}
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  >
                    <option value="">Select Hometown</option>
                    {HOMETOWN_OPTIONS.map((town) => (
                      <option key={town} value={town}>
                        {town}
                      </option>
                    ))}
                    <option value="CUSTOM">✍️ Other City...</option>
                  </select>
                  {!HOMETOWN_OPTIONS.includes(data.hometown) && (
                    <input
                      type="text"
                      value={data.hometown}
                      onChange={(e) => updateField("hometown", e.target.value)}
                      placeholder="Type custom city or town"
                      className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Permanent Address</span>
                  <input
                    type="text"
                    value={data.permanentAddress}
                    onChange={(e) => updateField("permanentAddress", e.target.value)}
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Mobility Preference</span>
                  <select
                    value={MOBILITY_OPTIONS.includes(data.mobility) ? data.mobility : "CUSTOM"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField("mobility", val === "CUSTOM" ? "" : val);
                    }}
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                  >
                    {MOBILITY_OPTIONS.map((mob) => (
                      <option key={mob} value={mob}>
                        {mob}
                      </option>
                    ))}
                    <option value="CUSTOM">✍️ Custom Mobility Statement...</option>
                  </select>
                  {!MOBILITY_OPTIONS.includes(data.mobility) && (
                    <input
                      type="text"
                      value={data.mobility}
                      onChange={(e) => updateField("mobility", e.target.value)}
                      placeholder="Type custom mobility preference (e.g. Willing to relocate globally)"
                      className="mt-1.5 w-full text-xs p-1.5 border border-neutral-300 rounded bg-neutral-50"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Academic References with Official SIET CSE & Institutional Faculty Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase text-neutral-800 tracking-wider">
                  Academic / Institutional References
                </label>
                <span className="text-[10px] text-neutral-500">
                  Select from Official SIET Faculty Directory or custom entry
                </span>
              </div>

              <div className="space-y-4">
                {data.references.map((ref, idx) => {
                  const currentDept = refDeptFilter[ref.id] || "Computer Science and Engineering (CSE)";
                  const isCSE = currentDept === "Computer Science and Engineering (CSE)";
                  const isCustom = currentDept === "CUSTOM";

                  // Group CSE faculty by designation
                  const cseProfessors = SIET_CSE_FACULTY.filter((f) => f.designation === "Professor");
                  const cseAssociateProfs = SIET_CSE_FACULTY.filter((f) => f.designation === "Associate Professor");
                  const cseAssistantProfs = SIET_CSE_FACULTY.filter((f) => f.designation === "Assistant Professor");

                  const filteredFaculty = SIET_FACULTY_CATALOG.filter(
                    (f) => f.department === currentDept
                  );

                  return (
                    <div
                      key={ref.id}
                      className="p-3.5 bg-neutral-50 rounded-md border border-neutral-200 space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                        <span className="font-bold text-neutral-900 text-xs">
                          Reference #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-neutral-600 font-medium">Department:</span>
                          <select
                            value={currentDept}
                            onChange={(e) => {
                              const newDept = e.target.value;
                              setRefDeptFilter((prev) => ({ ...prev, [ref.id]: newDept }));
                              if (newDept === "Computer Science and Engineering (CSE)") {
                                const defaultFaculty = SIET_CSE_FACULTY[0];
                                updateRefAll(ref.id, {
                                  name: defaultFaculty.name,
                                  designation: `${defaultFaculty.designation}, Department of Computer Science and Engineering`,
                                  contact: `${defaultFaculty.institution}, Coimbatore`
                                });
                              } else if (newDept !== "CUSTOM") {
                                const defaultInDept = SIET_FACULTY_CATALOG.find(
                                  (f) => f.department === newDept
                                );
                                if (defaultInDept) {
                                  updateRefAll(ref.id, {
                                    name: defaultInDept.name,
                                    designation: defaultInDept.designation,
                                    contact: defaultInDept.contact
                                  });
                                }
                              }
                            }}
                            className="text-xs p-1 border border-neutral-300 rounded bg-white font-medium"
                          >
                            <option value="Computer Science and Engineering (CSE)">
                              Computer Science and Engineering (CSE - 48 Faculty)
                            </option>
                            {SIET_FACULTY_DEPARTMENTS.filter(
                              (d) => d !== "Computer Science and Engineering (CSE)"
                            ).map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                            <option value="CUSTOM">✍️ Custom / Non-CSE Faculty</option>
                          </select>
                        </div>
                      </div>

                      {/* Level 2: Faculty Member Select */}
                      {!isCustom && (
                        <div>
                          <label className="block text-[11px] text-neutral-600 font-medium mb-1">
                            {isCSE ? "Select SIET CSE Faculty Member (Grouped by Rank):" : "Select Faculty Member:"}
                          </label>
                          {isCSE ? (
                            <select
                              value={SIET_CSE_FACULTY.find((f) => f.name === ref.name)?.id || ""}
                              onChange={(e) => {
                                const facId = Number(e.target.value);
                                const selectedFac = SIET_CSE_FACULTY.find((f) => f.id === facId);
                                if (selectedFac) {
                                  updateRefAll(ref.id, {
                                    name: selectedFac.name,
                                    designation: `${selectedFac.designation}, Department of Computer Science and Engineering`,
                                    contact: `${selectedFac.institution}, Coimbatore`
                                  });
                                }
                              }}
                              className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-medium text-neutral-800"
                            >
                              <option value="">-- Choose Faculty Member from SIET CSE --</option>
                              <optgroup label="Professors">
                                {cseProfessors.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name} ({f.qualification}) — {f.designation}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Associate Professors">
                                {cseAssociateProfs.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name} ({f.qualification}) — {f.designation}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Assistant Professors">
                                {cseAssistantProfs.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name} ({f.qualification}) — {f.designation}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          ) : (
                            <select
                              value={filteredFaculty.find((f) => f.name === ref.name)?.id || ""}
                              onChange={(e) => {
                                const facId = e.target.value;
                                const selectedFac = SIET_FACULTY_CATALOG.find((f) => f.id === facId);
                                if (selectedFac) {
                                  updateRefAll(ref.id, {
                                    name: selectedFac.name,
                                    designation: selectedFac.designation,
                                    contact: selectedFac.contact
                                  });
                                }
                              }}
                              className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-medium text-neutral-800"
                            >
                              <option value="">-- Choose faculty member --</option>
                              {filteredFaculty.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.name} — {f.designation}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      {/* Editable Form Controls */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[11px] text-neutral-600 font-medium mb-0.5">
                            Full Name & Title
                          </label>
                          <input
                            type="text"
                            value={ref.name || ""}
                            onChange={(e) => updateRef(ref.id, "name", e.target.value)}
                            placeholder="e.g. Dr. K. E. Kannammal"
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white font-medium"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[11px] text-neutral-600 font-medium mb-0.5">
                            Designation & Department
                          </label>
                          <input
                            type="text"
                            value={ref.designation}
                            onChange={(e) => updateRef(ref.id, "designation", e.target.value)}
                            placeholder="e.g. Professor, Department of Computer Science and Engineering"
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[11px] text-neutral-600 font-medium mb-0.5">
                            Contact Details (Institutional Address / Email / Phone)
                          </label>
                          <input
                            type="text"
                            value={ref.contact}
                            onChange={(e) => updateRef(ref.id, "contact", e.target.value)}
                            placeholder="e.g. Sri Shakthi Institute of Engineering and Technology, Coimbatore"
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Declaration Details */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700 uppercase">
                Declaration Metadata
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Declaration Date</span>
                  <input
                    type="text"
                    value={data.declarationDate}
                    onChange={(e) => updateField("declarationDate", e.target.value)}
                    placeholder="e.g. 01/11/2026"
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-600 mb-0.5">Declaration Place</span>
                  <input
                    type="text"
                    value={data.declarationPlace}
                    onChange={(e) => updateField("declarationPlace", e.target.value)}
                    placeholder="e.g. Coimbatore"
                    className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
