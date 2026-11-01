"use client";

import React, { useRef } from "react";
import { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ResumePreview({ data, containerRef }: Props) {
  const accent = data.themeColor || "#000000";

  return (
    <div
      ref={containerRef}
      id="resume-export-container"
      className="print-canvas font-sans text-neutral-900 leading-normal"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* ================= SHEET 1 ================= */}
      <section className="a4-page-sheet flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-3 mb-3" style={{ borderColor: accent }}>
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold tracking-wider uppercase text-neutral-950 font-sans">
                {data.fullName || "STUDENT NAME"}
              </h1>
              <h2 className="text-xs font-semibold tracking-wide uppercase mt-0.5" style={{ color: accent }}>
                {data.targetRole || "TARGET ROLE / SOFTWARE ENGINEER"}
              </h2>
              <div className="text-[11px] text-neutral-600 mt-2 space-y-0.5 leading-snug">
                <p>
                  <span className="font-medium text-neutral-800">Email:</span> {data.collegeEmail || "student@srishakthi.ac.in"}
                  {data.personalEmail && ` | ${data.personalEmail}`}
                </p>
                <p>
                  <span className="font-medium text-neutral-800">Phone:</span> {data.phone || "+91 98XXXXXXXX"}
                </p>
                <p>
                  {data.linkedin && (
                    <>
                      <span className="font-medium text-neutral-800">LinkedIn:</span> {data.linkedin}
                    </>
                  )}
                  {data.linkedin && data.github && " | "}
                  {data.github && (
                    <>
                      <span className="font-medium text-neutral-800">GitHub:</span> {data.github}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 3:4 Passport Photo Frame */}
            <div
              className="w-24 h-32 border flex items-center justify-center bg-neutral-50 overflow-hidden shrink-0"
              style={{ borderColor: accent }}
            >
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.photoUrl}
                  alt={data.fullName || "Passport Photo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[10px] text-neutral-400 font-medium text-center px-1 select-none">
                  Passport Photo
                  <br />
                  <span className="text-[8px] text-neutral-400 font-normal">(3:4 JPG)</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Objective Statement */}
          <div className="mb-3.5">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              PROFESSIONAL OBJECTIVE
            </h3>
            <p className="text-[11px] text-justify text-neutral-800 leading-relaxed font-serif">
              {data.summary ||
                "A highly motivated and detail-oriented engineer seeking to leverage core technical competencies to engineer reliable software systems, solve complex analytical challenges, and drive innovation."}
            </p>
          </div>

          {/* Education */}
          <div className="mb-3.5">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              EDUCATION
            </h3>
            <div className="space-y-2 text-[11px]">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="mr-2 text-[10px] leading-tight select-none" style={{ color: accent }}>
                    ★
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold uppercase text-neutral-900">
                        {edu.degree || (idx === 0 ? "B.E / B.Tech Degree" : idx === 1 ? "Higher Secondary Certificate (HSC)" : "Secondary School Leaving Certificate (SSLC)")}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-600">
                        {edu.duration || "YYYY - YYYY"}
                      </span>
                    </div>
                    <p className="text-neutral-700">
                      {edu.institution || (idx === 0 ? "Sri Shakthi Institute of Engineering and Technology" : "School / Junior College")} {edu.boardOrUniversity && `(${edu.boardOrUniversity})`}
                    </p>
                    <p className="text-neutral-500 text-[10px] font-medium">
                      Score / CGPA: {edu.score || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas of Interest */}
          <div className="mb-3.5">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              AREAS OF INTEREST
            </h3>
            {data.areasOfInterest.length > 0 ? (
              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-[11px]">
                {data.areasOfInterest.map((interest, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                      ★
                    </span>
                    <span className="text-neutral-800">{interest}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Select your areas of interest (e.g. Full-Stack Development, Cloud Architecture, AI/ML)...
              </p>
            )}
          </div>

          {/* Skills Matrix */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              SKILLS MATRIX
            </h3>
            <div className="text-[11px] space-y-2">
              <div>
                <p className="font-bold text-neutral-900 uppercase text-[10px] tracking-wide mb-0.5">IT Skills</p>
                <p className="text-neutral-700 leading-snug">
                  <span className="font-semibold text-neutral-800">Languages:</span>{" "}
                  {data.itSkills.join(", ") || "—"}
                </p>
                <p className="text-neutral-700 leading-snug">
                  <span className="font-semibold text-neutral-800">Software & Tools:</span>{" "}
                  {data.toolsSoftware.join(", ") || "—"}
                </p>
              </div>
              {data.coreSkills.length > 0 && (
                <div>
                  <p className="font-bold text-neutral-900 uppercase text-[10px] tracking-wide mb-0.5">
                    Core Technical Skills (Engineering)
                  </p>
                  <p className="text-neutral-700 leading-snug">{data.coreSkills.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-right text-neutral-400 border-t border-neutral-100 pt-1">
          Page 1 of 4
        </div>
      </section>

      {/* ================= SHEET 2 ================= */}
      <section className="a4-page-sheet flex flex-col justify-between">
        <div>
          {/* Certifications */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              CERTIFICATIONS
            </h3>
            {data.certifications.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                      ★
                    </span>
                    <span className="text-neutral-800">{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Add certifications from NPTEL, Coursera, Udemy, AWS, Cisco, etc...
              </p>
            )}
          </div>

          {/* Key Strengths */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              KEY STRENGTHS
            </h3>
            {data.keyStrengths.length > 0 ? (
              <div className="space-y-1 text-[11px]">
                {data.keyStrengths.map((str, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                      ★
                    </span>
                    <span className="text-neutral-800">{str}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Select your professional strengths (e.g. Excellent communication, Highly organized, Adaptable)...
              </p>
            )}
          </div>

          {/* Internships */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              INTERNSHIPS & INDUSTRIAL EXPERIENCE
            </h3>
            {data.internships.length > 0 ? (
              <div className="space-y-3 text-[11px]">
                {data.internships.map((intern) => (
                  <div key={intern.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                    <div className="flex justify-between items-baseline font-bold text-neutral-950">
                      <span>
                        {intern.role} — {intern.company}
                      </span>
                      <span className="text-neutral-500 font-normal text-[10px]">{intern.duration}</span>
                    </div>
                    {intern.departmentTag && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        [{intern.departmentTag}]
                      </span>
                    )}
                    <p className="mt-1 text-neutral-700 leading-relaxed text-[11px]">{intern.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic border-l-2 pl-3 border-neutral-200">
                Add industrial internships, apprenticeships, or company training records...
              </p>
            )}
          </div>

          {/* Featured Projects (Part 1) */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              PROJECTS (FLAGSHIP)
            </h3>
            {data.page2Projects.length > 0 ? (
              <div className="space-y-3 text-[11px]">
                {data.page2Projects.map((proj) => (
                  <div key={proj.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                    <div className="flex justify-between items-baseline font-bold uppercase text-neutral-950">
                      <span>
                        {proj.title} <span className="font-normal text-[10px] text-neutral-500">({proj.domainTag})</span>
                      </span>
                      <span className="text-neutral-500 text-[10px] font-normal lowercase">{proj.duration}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">Institution: {proj.institution}</p>
                    <p className="text-neutral-700 mt-1 leading-relaxed text-[11px]">{proj.description}</p>
                    {(proj.githubUrl || proj.liveUrl) && (
                      <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                        {proj.githubUrl && <>GitHub: {proj.githubUrl} </>}
                        {proj.liveUrl && <>| Demo: {proj.liveUrl}</>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic border-l-2 pl-3 border-neutral-200">
                Add flagship capstone or domain projects (auto-fetch from GitHub available)...
              </p>
            )}
          </div>
        </div>

        <div className="text-[10px] text-right text-neutral-400 border-t border-neutral-100 pt-1">
          Page 2 of 4
        </div>
      </section>

      {/* ================= SHEET 3 ================= */}
      <section className="a4-page-sheet flex flex-col justify-between">
        <div>
          {/* Projects (Part 2) */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              ADDITIONAL PROJECTS
            </h3>
            {data.page3Projects.length > 0 ? (
              <div className="space-y-3 text-[11px]">
                {data.page3Projects.map((proj) => (
                  <div key={proj.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                    <div className="flex justify-between items-baseline font-bold uppercase text-neutral-950">
                      <span>
                        {proj.title} <span className="font-normal text-[10px] text-neutral-500">({proj.domainTag})</span>
                      </span>
                      <span className="text-neutral-500 text-[10px] font-normal">{proj.duration}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">Institution: {proj.institution}</p>
                    <p className="text-neutral-700 mt-1 leading-relaxed text-[11px]">{proj.description}</p>
                    {proj.githubUrl && (
                      <p className="text-[10px] text-neutral-500 mt-1 font-mono">GitHub: {proj.githubUrl}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic border-l-2 pl-3 border-neutral-200">
                Add additional technical projects, hackathon prototypes, or mini-projects...
              </p>
            )}
          </div>

          {/* Languages Known */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              LANGUAGES KNOWN
            </h3>
            {data.languages.length > 0 ? (
              <div className="flex flex-wrap gap-4 text-[11px] font-medium">
                {data.languages.map((lang, idx) => (
                  <span key={idx} className="flex items-center text-neutral-800">
                    <span className="mr-1.5 text-[9px] select-none" style={{ color: accent }}>
                      ●
                    </span>
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Select or add languages known (e.g. English, Tamil, Hindi)...
              </p>
            )}
          </div>

          {/* Patents & Publications */}
          <div className="mb-4">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              PATENTS & RESEARCH PUBLICATIONS
            </h3>
            {data.publications.length > 0 ? (
              <div className="space-y-2 text-[11px]">
                {data.publications.map((pub) => (
                  <div key={pub.id} className="text-neutral-800">
                    <div className="flex items-start font-semibold">
                      <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                        ★
                      </span>
                      <span>
                        [{pub.type.toUpperCase()}] {pub.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-600 ml-4 leading-normal">{pub.citationDetails}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Add patents filed/published or research papers with journal citation details...
              </p>
            )}
          </div>

          {/* Workshops & Seminars */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-2"
              style={{ color: accent, borderColor: accent }}
            >
              WORKSHOPS & TECHNICAL SEMINARS
            </h3>
            {data.workshops.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {data.workshops.map((w) => (
                  <div key={w.id} className="flex items-start">
                    <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                      ★
                    </span>
                    <span className="text-neutral-800 leading-snug">
                      <strong className="font-semibold text-neutral-900">{w.title}</strong> — {w.organizer} ({w.duration})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Add workshops, bootcamps, and technical seminars attended...
              </p>
            )}
          </div>
        </div>

        <div className="text-[10px] text-right text-neutral-400 border-t border-neutral-100 pt-1">
          Page 3 of 4
        </div>
      </section>

      {/* ================= SHEET 4 ================= */}
      <section className="a4-page-sheet flex flex-col justify-between">
        <div>
          {/* Achievements */}
          <div className="mb-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              ACHIEVEMENTS (CO-CURRICULAR & EXTRA-CURRICULAR)
            </h3>
            {data.achievements.length > 0 ? (
              <div className="space-y-1 text-[11px]">
                {data.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                      ★
                    </span>
                    <span className="text-neutral-800">{ach}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Add hackathon prizes, academic honors, or co-curricular achievements...
              </p>
            )}
          </div>

          {/* Volunteer & Club Leadership */}
          <div className="mb-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              VOLUNTEER & LEADERSHIP EXPERIENCE
            </h3>
            {data.volunteerExp.length > 0 ? (
              <div className="space-y-1.5 text-[11px]">
                {data.volunteerExp.map((v) => (
                  <div key={v.id}>
                    <div className="flex items-center font-semibold text-neutral-900">
                      <span className="mr-2 text-[10px] select-none" style={{ color: accent }}>
                        ★
                      </span>
                      <span>{v.role}</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 ml-4 leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 italic">
                Add campus club activities, student coordination, or volunteer initiatives...
              </p>
            )}
          </div>

          {/* Personal Verification Dossier */}
          <div className="mb-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              PERSONAL DETAILS
            </h3>
            <table className="text-[11px] w-full border-collapse">
              <tbody>
                <tr>
                  <td className="w-32 py-0.5 text-neutral-600 font-medium">Date Of Birth</td>
                  <td className="py-0.5 text-neutral-800">: {data.dob || "DD-MM-YYYY"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-neutral-600 font-medium">Gender</td>
                  <td className="py-0.5 text-neutral-800">: {data.gender || "—"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-neutral-600 font-medium">Nationality</td>
                  <td className="py-0.5 text-neutral-800">: {data.nationality || "Indian"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-neutral-600 font-medium">Hometown</td>
                  <td className="py-0.5 text-neutral-800">: {data.hometown || "—"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-neutral-600 font-medium align-top">Permanent Address</td>
                  <td className="py-0.5 text-neutral-800 align-top">: {data.permanentAddress || "—"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-neutral-600 font-medium">Mobility Preference</td>
                  <td className="py-0.5 text-neutral-800">: {data.mobility || "Willing to relocate anywhere in India"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* References */}
          <div className="mb-3">
            <h3
              className="text-[11px] font-bold uppercase tracking-widest pb-1 border-b mb-1.5"
              style={{ color: accent, borderColor: accent }}
            >
              REFERENCES
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {data.references.map((ref, idx) => (
                <div key={ref.id} className="border border-neutral-200 p-2 rounded-xs bg-neutral-50/40">
                  <p className="font-semibold text-neutral-900">
                    {idx + 1}. {ref.name || `Reference ${idx + 1} (Select Faculty)`}
                  </p>
                  <p className="text-[10px] text-neutral-600">
                    {ref.designation || "Designation & Department"}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {ref.contact || "Sri Shakthi Institute of Engineering and Technology, Coimbatore"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Declaration with Date & Place */}
          <div className="mt-3 pt-2 border-t border-neutral-200 text-[11px]">
            <h4 className="font-bold uppercase tracking-wider text-[10px] mb-0.5" style={{ color: accent }}>
              DECLARATION
            </h4>
            <p className="italic text-neutral-700 text-[10px] leading-relaxed">
              The information stated above is true to the best of my knowledge and belief.
            </p>
            <div className="flex justify-between items-end mt-4 text-[10px] text-neutral-700">
              <div className="space-y-0.5">
                <p>
                  <span className="font-medium">Date:</span> {data.declarationDate || "DD/MM/YYYY"}
                </p>
                <p>
                  <span className="font-medium">Place:</span> {data.declarationPlace || "Coimbatore"}
                </p>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-neutral-400 mb-1" />
                <p className="font-semibold uppercase text-neutral-900">({data.fullName || "STUDENT NAME"})</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-right text-neutral-400 border-t border-neutral-100 pt-1">
          Page 4 of 4
        </div>
      </section>
    </div>
  );
}
