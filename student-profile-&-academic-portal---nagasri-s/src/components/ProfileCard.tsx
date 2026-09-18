import React, { useState, useRef } from 'react';
import { 
  User, 
  MapPin, 
  Hash, 
  BookOpen, 
  School, 
  Mail, 
  CheckCircle, 
  Copy, 
  Check, 
  Compass, 
  Award, 
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Printer,
  Download,
  Loader2
} from 'lucide-react';
import { studentProfile, academicSummary } from '../data/studentData';
import { printOrSaveAsPdf, captureElementToPng } from '../utils/printAndPdf';

interface ProfileCardProps {
  onNavigateToMarks: () => void;
  onNavigateToTransport: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  onNavigateToMarks, 
  onNavigateToTransport 
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Directly downloads the profile card document without opening print dialog
  const handleDownload = async () => {
    if (!profileCardRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await captureElementToPng(profileCardRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Nagasri_S_${studentProfile.regNo}_Student_Profile_Card.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download profile card', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Strictly opens native browser print dialog for printing or "Save as PDF"
  const handlePrint = async () => {
    if (!profileCardRef.current) return;
    setIsPrinting(true);
    try {
      await printOrSaveAsPdf(profileCardRef.current, {
        fileName: `Nagasri_S_${studentProfile.regNo}_Student_Profile`,
        title: `Student Profile - ${studentProfile.name} (${studentProfile.regNo})`,
        orientation: 'portrait'
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Student ID Badge Card */}
      <div 
        ref={profileCardRef}
        className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <School className="w-48 h-48" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white to-blue-100 p-1 shadow-xl flex items-center justify-center text-blue-800 font-black text-2xl sm:text-3xl border-2 border-white/60">
                  <div className="w-full h-full rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-700">
                    <span className="font-['Outfit',sans-serif]">NS</span>
                    <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">CS</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md" title="Active Student">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-400/40 text-xs font-semibold text-blue-100 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Assignment 2 Project • Candidate Profile</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif]">
                  {studentProfile.name}
                </h2>
                <p className="text-blue-100 font-semibold text-sm sm:text-base mt-0.5">
                  {studentProfile.program} • {studentProfile.college}, {studentProfile.collegeCity}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-200 border border-amber-300/30 text-xs font-bold font-serif">
                    {studentProfile.collegeMotto}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    {studentProfile.collegeAffiliation}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-blue-200">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    <strong>Reg No:</strong> {studentProfile.regNo}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <strong>Batch:</strong> 2024 - 2027 (2 Years Completed)
                  </span>
                  <span>•</span>
                  <span className="bg-emerald-500/25 border border-emerald-400/40 px-2 py-0.5 rounded text-emerald-200 font-medium">
                    100% Pass Record (89/89 Credits)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Print / Download Controls */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex gap-2">
                <button
                  id="btn-copy-regno"
                  onClick={() => handleCopy(studentProfile.regNo, 'regNo')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition shadow-sm"
                >
                  {copiedField === 'regNo' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-200" />
                      <span>Copy Reg</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-copy-address"
                  onClick={() => handleCopy(studentProfile.address, 'address')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition shadow-sm"
                >
                  {copiedField === 'address' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-200" />
                      <span>Copy Addr</span>
                    </>
                  )}
                </button>
              </div>

              {/* Document Generation Action Buttons */}
              <div className="flex gap-2 print:hidden">
                {/* Download Button - Directly downloads document without opening print dialog */}
                <button
                  id="btn-profile-download"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm disabled:opacity-75"
                  title="Directly download profile document image"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download'}</span>
                </button>

                {/* Print / Save PDF Button - Strictly opens native print / PDF dialog */}
                <button
                  id="btn-profile-print"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 transition shadow-sm disabled:opacity-75"
                  title="Open browser print dialog to print or Save as PDF"
                >
                  {isPrinting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-200" />
                  ) : (
                    <Printer className="w-3.5 h-3.5 text-sky-200" />
                  )}
                  <span>{isPrinting ? 'Preparing...' : 'Print / Save PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-100 bg-blue-50/40 border-b border-blue-100">
          <div className="p-4 text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Cumulative CGPA</span>
            <div className="text-2xl font-black text-blue-700 font-['Outfit',sans-serif] mt-0.5">
              {academicSummary.cumulativeGpa} <span className="text-xs font-normal text-slate-500">/ 10.0</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-0.5 mt-0.5">
              <CheckCircle className="w-3 h-3" /> Distinction
            </span>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Marks Percentile</span>
            <div className="text-2xl font-black text-blue-700 font-['Outfit',sans-serif] mt-0.5">
              {academicSummary.overallPercentage}%
            </div>
            <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
              {academicSummary.totalMarksObtained} / {academicSummary.totalMarksMax} Marks
            </span>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Credits Cleared</span>
            <div className="text-2xl font-black text-blue-700 font-['Outfit',sans-serif] mt-0.5">
              89 / 89
            </div>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
              4 Semesters (100% Cleared)
            </span>
          </div>

          <div className="p-4 text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Daily Transit</span>
            <div className="text-2xl font-black text-blue-700 font-['Outfit',sans-serif] mt-0.5">
              ₹80 <span className="text-xs font-normal text-slate-500">/ day</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
              4 Auto Legs (Othakadai ⇄ Teppakulam)
            </span>
          </div>
        </div>

        {/* Detailed Profile Info Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Personal & Academic Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b border-blue-100 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              1. Student Identity & Program
            </h3>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70 space-y-3">
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-800">{studentProfile.name}</span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Register Number</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {studentProfile.regNo}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Degree & Branch</span>
                <span className="font-semibold text-slate-800">{studentProfile.program}</span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Gender</span>
                <span className="font-medium text-slate-800">{studentProfile.gender}</span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">College Institution</span>
                <span className="font-bold text-slate-800 text-right">{studentProfile.college}, {studentProfile.collegeCity}</span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">College Motto</span>
                <span className="font-bold text-amber-800 font-serif text-right text-xs bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                  {studentProfile.collegeMotto}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Affiliation & Status</span>
                <span className="text-xs text-right font-medium text-slate-700 max-w-[260px]">
                  {studentProfile.collegeAffiliation}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 font-medium">Email Address</span>
                <span className="font-mono text-xs text-blue-600">{studentProfile.email}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Residential Address & Transit Anchor */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b border-blue-100 pb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Residential Location & Route Anchor
            </h3>

            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/60 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Permanent Residence Address</span>
                  <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                    {studentProfile.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-200/60">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block font-medium">Area / Landmark</span>
                  <span className="font-bold text-slate-800">Othakadai (Thirumohur Rd)</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block font-medium">Postal City</span>
                  <span className="font-bold text-slate-800">Madurai - 625 107</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>College Campus: <strong>Thiagarajar College, Teppakulam</strong></span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ~13.7 km
                </span>
              </div>
            </div>

            {/* Quick Navigation Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="btn-nav-marks-shortcut"
                onClick={onNavigateToMarks}
                className="flex items-center justify-between p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition text-xs font-bold shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>View 2-Year Marks</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-nav-transport-shortcut"
                onClick={onNavigateToTransport}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition text-xs font-bold shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>View Transport Route</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Year Academic Milestone Highlights */}
      <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Academic Track Record Overview (Semesters 1 through 4)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white hover:border-blue-300 transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-800 uppercase">Semester 1</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Nov-2024</span>
            </div>
            <div className="text-2xl font-black text-slate-900">7.94 <span className="text-xs text-slate-500 font-normal">SGPA</span></div>
            <div className="text-xs text-slate-600 mt-1">Marks: <strong>518 / 625</strong> (82.88%)</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-2">23/23 Credits • All Passed</div>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white hover:border-blue-300 transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-800 uppercase">Semester 2</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Apr-2025</span>
            </div>
            <div className="text-2xl font-black text-slate-900">8.15 <span className="text-xs text-slate-500 font-normal">SGPA</span></div>
            <div className="text-xs text-slate-600 mt-1">Marks: <strong>534 / 625</strong> (85.44%)</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-2">21/21 Credits • All Passed</div>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white hover:border-blue-300 transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-800 uppercase">Semester 3</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Nov-2025</span>
            </div>
            <div className="text-2xl font-black text-slate-900">7.99 <span className="text-xs text-slate-500 font-normal">SGPA</span></div>
            <div className="text-xs text-slate-600 mt-1">Marks: <strong>530 / 625</strong> (84.80%)</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-2">22/22 Credits • All Passed</div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-100/40 to-white hover:border-blue-400 transition ring-1 ring-blue-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-900 uppercase">Semester 4</span>
              <span className="text-[10px] font-mono bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Apr-2026</span>
            </div>
            <div className="text-2xl font-black text-blue-700">8.82 <span className="text-xs text-slate-500 font-normal">SGPA</span></div>
            <div className="text-xs text-slate-600 mt-1">Marks: <strong>673 / 750</strong> (89.73%)</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-2">23/23 Credits • Highest SGPA!</div>
          </div>
        </div>
      </div>
    </div>
  );
};
