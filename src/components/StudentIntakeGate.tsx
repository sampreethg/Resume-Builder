"use client";

import React, { useState } from "react";
import { GraduationCap, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { SIET_UG_COURSES } from "@/constants/collegeData";

interface StudentCredentials {
  student_name: string;
  college_email: string;
  department: string;
}

interface Props {
  onUnlock: (credentials: StudentCredentials) => void;
}

export default function StudentIntakeGate({ onUnlock }: Props) {
  const [studentName, setStudentName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState(SIET_UG_COURSES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = studentName.trim();
    const trimmedEmail = collegeEmail.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMsg("Please enter your full name as registered in college records.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Please provide a valid college or institutional email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct POST to Formspree
      const payload = {
        student_name: trimmedName,
        college_email: trimmedEmail,
        department: department,
        submitted_at: new Date().toISOString()
      };

      const response = await fetch("https://formspree.io/f/mjyyazkk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Submission server responded with status: ${response.status}`);
      }

      // Success: Save in localStorage
      localStorage.setItem("siet_student_verified", "true");
      localStorage.setItem("siet_student_name", trimmedName);
      localStorage.setItem("siet_student_email", trimmedEmail);
      localStorage.setItem("siet_student_dept", department);

      onUnlock({
        student_name: trimmedName,
        college_email: trimmedEmail,
        department: department
      });
    } catch (err: any) {
      // Allow student through even if network/offline issues occur after logging warning
      console.warn("Formspree intake note:", err);
      // Still store session to unblock student in case of strict firewalls
      localStorage.setItem("siet_student_verified", "true");
      localStorage.setItem("siet_student_name", trimmedName);
      localStorage.setItem("siet_student_email", trimmedEmail);
      localStorage.setItem("siet_student_dept", department);

      onUnlock({
        student_name: trimmedName,
        college_email: trimmedEmail,
        department: department
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center px-4 py-8 font-sans">
      <div className="max-w-md w-full bg-white border border-neutral-300 rounded-lg shadow-sm p-8 space-y-6">
        {/* Header Branding */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 p-2 bg-neutral-900 text-white rounded-md">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider">SIET Institutional Portal</span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-neutral-950 tracking-tight leading-snug">
              Sri Shakthi Institute of Engineering and Technology
            </h1>
            <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mt-0.5">
              Autonomous 4-Page Resume Builder
            </p>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed pt-1 border-t border-neutral-200">
            Enter your official student credentials to access the 4-page placement resume generator. Your details will pre-populate the document workspace.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formspree Gate Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. AJITH KUMAR"
              className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-950 focus:outline-hidden bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase mb-1">
              College Email (@srishakthi.ac.in) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              placeholder="yourname@srishakthi.ac.in"
              className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-950 focus:outline-hidden bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 uppercase mb-1">
              Undergraduate Engineering Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:border-neutral-950 focus:outline-hidden bg-white"
            >
              {SIET_UG_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Continue to Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Institutional Assurance Footer */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" /> Formspree Endpoint Secured
          </span>
          <span>siet.ac.in</span>
        </div>
      </div>
    </div>
  );
}
