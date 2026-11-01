"use client";

import React, { useState, useRef, useEffect } from "react";
import ResumePreview from "@/components/ResumePreview";
import MultiStepForm from "@/components/MultiStepForm";
import AISummaryModal from "@/components/AISummaryModal";
import ThemeSelector from "@/components/ThemeSelector";
import StudentIntakeGate from "@/components/StudentIntakeGate";
import { SIET_COLLEGE_NAME } from "@/constants/collegeData";
import { ResumeData } from "@/types/resume";
import { Download, Sparkles, GraduationCap, Loader2, LogOut, ShieldCheck, Lock } from "lucide-react";
import { getStudentDraftKey } from "@/utils/security";

export const emptyResumeData: ResumeData = {
  themeColor: "#000000",
  photoUrl: "",
  fullName: "",
  targetRole: "",
  collegeEmail: "",
  personalEmail: "",
  phone: "",
  linkedin: "",
  github: "",
  summary: "",
  education: [
    {
      degree: "",
      institution: "Sri Shakthi Institute of Engineering and Technology",
      boardOrUniversity: "Autonomous",
      duration: "",
      score: ""
    },
    {
      degree: "HIGHER SECONDARY CERTIFICATE",
      institution: "",
      boardOrUniversity: "",
      duration: "",
      score: ""
    },
    {
      degree: "SECONDARY SCHOOL LEAVING CERTIFICATE",
      institution: "",
      boardOrUniversity: "",
      duration: "",
      score: ""
    }
  ],
  areasOfInterest: [],
  itSkills: [],
  toolsSoftware: [],
  coreSkills: [],
  certifications: [],
  keyStrengths: [],
  internships: [],
  page2Projects: [],
  page3Projects: [],
  languages: [],
  publications: [],
  workshops: [],
  achievements: [],
  volunteerExp: [],
  dob: "",
  gender: "",
  nationality: "Indian",
  hometown: "",
  permanentAddress: "",
  phonePersonal: "",
  mobility: "Willing to relocate anywhere in India",
  references: [
    { id: "ref1", name: "", designation: "", contact: "" },
    { id: "ref2", name: "", designation: "", contact: "" }
  ],
  declarationDate: "",
  declarationPlace: "Coimbatore"
};

const initialData: ResumeData = emptyResumeData;

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Check existing session & restore isolated draft if available
  useEffect(() => {
    setHasMounted(true);
    const verified = localStorage.getItem("siet_student_verified");
    if (verified === "true") {
      setIsGateUnlocked(true);
      const savedName = localStorage.getItem("siet_student_name");
      const savedEmail = localStorage.getItem("siet_student_email");
      const savedDept = localStorage.getItem("siet_student_dept");

      if (savedEmail) {
        const draftKey = getStudentDraftKey(savedEmail);
        const cachedDraft = localStorage.getItem(draftKey);
        if (cachedDraft) {
          try {
            const parsed = JSON.parse(cachedDraft);
            setResumeData(parsed);
            return;
          } catch {
            // fallback to default merge
          }
        }
      }

      setResumeData((prev) => {
        const updatedEdu = [...prev.education];
        if (savedDept && updatedEdu[0]) {
          updatedEdu[0] = { ...updatedEdu[0], degree: savedDept };
        }
        return {
          ...prev,
          fullName: savedName || prev.fullName,
          collegeEmail: savedEmail || prev.collegeEmail,
          education: updatedEdu
        };
      });
    }
  }, []);

  // Isolated auto-save into student-keyed localStorage hash
  useEffect(() => {
    if (!hasMounted || !isGateUnlocked) return;
    const email = resumeData.collegeEmail || localStorage.getItem("siet_student_email");
    if (email) {
      const draftKey = getStudentDraftKey(email);
      try {
        localStorage.setItem(draftKey, JSON.stringify(resumeData));
      } catch (e) {
        console.warn("Storage quota exceeded or private browsing restricted auto-save", e);
      }
    }
  }, [resumeData, hasMounted, isGateUnlocked]);

  const handleGateUnlock = (creds: { student_name: string; college_email: string; department: string }) => {
    setIsGateUnlocked(true);
    const draftKey = getStudentDraftKey(creds.college_email);
    const cachedDraft = localStorage.getItem(draftKey);
    if (cachedDraft) {
      try {
        const parsed = JSON.parse(cachedDraft);
        setResumeData(parsed);
        return;
      } catch {
        // Fallback
      }
    }

    setResumeData((prev) => {
      const updatedEdu = [...prev.education];
      if (updatedEdu[0]) {
        updatedEdu[0] = { ...updatedEdu[0], degree: creds.department };
      }
      return {
        ...prev,
        fullName: creds.student_name,
        collegeEmail: creds.college_email,
        education: updatedEdu
      };
    });
  };

  const handleExitStudent = () => {
    const currentEmail = resumeData.collegeEmail || localStorage.getItem("siet_student_email");
    if (currentEmail) {
      const draftKey = getStudentDraftKey(currentEmail);
      localStorage.removeItem(draftKey);
    }
    localStorage.removeItem("siet_student_verified");
    localStorage.removeItem("siet_student_name");
    localStorage.removeItem("siet_student_email");
    localStorage.removeItem("siet_student_dept");
    setResumeData(emptyResumeData);
    setIsGateUnlocked(false);
  };

  // Direct PDF Download via html2pdf.js without print dialog
  const handleDownloadPDF = async () => {
    if (!previewRef.current || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      // Dynamically import client-side
      const html2pdf = (await import("html2pdf.js")).default;

      const studentNameSanitized = (resumeData.fullName || "Student")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `${studentNameSanitized}_Resume.pdf`;

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
          compress: true
        },
        pagebreak: {
          mode: ["css", "legacy"],
          before: ".a4-page-sheet:not(:first-child)",
          avoid: ".a4-page-sheet"
        }
      };

      await html2pdf().set(opt).from(previewRef.current).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please ensure all details and images are properly loaded.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!hasMounted) {
    return null;
  }

  // Display Landing Intake Gate if not yet verified
  if (!isGateUnlocked) {
    return <StudentIntakeGate onUnlock={handleGateUnlock} />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="no-print bg-white border-b border-neutral-200 px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
                Sri Shakthi Institute of Engineering and Technology
              </h1>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-600">
                Institutional 4-Page Dossier
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">Autonomous Form-to-PDF Generator</p>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-4">
          <ThemeSelector
            currentTheme={resumeData.themeColor}
            onThemeChange={(hex) => setResumeData((prev) => ({ ...prev, themeColor: hex }))}
          />

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-800 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Summary Prompt</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide uppercase bg-neutral-950 hover:bg-black text-white rounded shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download 4-Page PDF</span>
              </>
            )}
          </button>

          {/* Client Isolation Security Badge & Logout Control */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-neutral-50 border border-neutral-200 rounded text-neutral-700">
              <Lock className="w-3 h-3 text-neutral-500" />
              <span>Session Active:</span>
              <strong className="text-neutral-900 font-semibold">{resumeData.collegeEmail || "Student"}</strong>
            </div>

            <button
              onClick={handleExitStudent}
              title="Wipe draft cache, clear memory, and sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Clear Data &amp; Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace: Split Form & Live Canvas */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-57px)]">
        {/* Left Form Editor */}
        <div className="no-print w-1/2 overflow-hidden flex flex-col">
          <MultiStepForm
            data={resumeData}
            onChange={setResumeData}
            onOpenAIModal={() => setIsAIModalOpen(true)}
          />
        </div>

        {/* Right Live Canvas */}
        <div className="flex-1 overflow-y-auto bg-neutral-200/60 p-4 flex justify-center">
          <ResumePreview data={resumeData} containerRef={previewRef} />
        </div>
      </div>

      {/* ChatGPT Assistant Modal */}
      <AISummaryModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        targetRole={resumeData.targetRole}
        selectedSkills={[...resumeData.itSkills, ...resumeData.coreSkills]}
      />
    </div>
  );
}
