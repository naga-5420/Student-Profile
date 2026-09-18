import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  Download,
  Loader2,
  FileDown,
  Layers
} from 'lucide-react';
import { studentProfile, semestersData, academicSummary } from '../data/studentData';
import { 
  printOrSaveAsPdf, 
  downloadElementAsPdf, 
  captureFullElementToPng 
} from '../utils/printAndPdf';

interface OfficialMarksheetCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSemester?: number | 'all';
}

export const OfficialMarksheetCardModal: React.FC<OfficialMarksheetCardModalProps> = ({
  isOpen,
  onClose,
  initialSemester = 'all'
}) => {
  const [selectedSem, setSelectedSem] = useState<number | 'all'>(initialSemester);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialSemester !== undefined) {
      setSelectedSem(initialSemester);
    }
  }, [isOpen, initialSemester]);

  if (!isOpen) return null;

  const isAllSemesters = selectedSem === 'all';
  const currentSemester = isAllSemesters 
    ? semestersData[0] 
    : (semestersData.find((s) => s.semesterNumber === selectedSem) || semestersData[0]);

  const semestersToDisplay = isAllSemesters ? semestersData : [currentSemester];

  // Directly downloads the full unclipped card document as a publication-ready PDF
  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSem}`;
      const fileName = `Nagasri_S_${studentProfile.regNo}_Official_Marksheet_Card_${semLabel}.pdf`;

      await downloadElementAsPdf(cardRef.current, {
        fileName,
        title: `Official Marksheet Card - ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSemester.semesterName} (${studentProfile.regNo})`,
        orientation: 'portrait',
        minWidth: 1120
      });

      setDownloadSuccess(true);
      setDownloadMessage(`Official PDF for ${isAllSemesters ? 'All Semesters' : currentSemester.semesterName} downloaded!`);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to download PDF card', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Directly downloads the full unclipped card as high-resolution PNG image
  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsDownloadingPng(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSem}`;
      const fileName = `Nagasri_S_${studentProfile.regNo}_Official_Marksheet_Card_${semLabel}.png`;

      const dataUrl = await captureFullElementToPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        minWidth: 1120
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setDownloadMessage(`High-Resolution PNG for ${isAllSemesters ? 'All Semesters' : currentSemester.semesterName} downloaded!`);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to download marksheet card image', err);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // Opens the browser's native print dialog so the user can print or choose "Save as PDF"
  const handlePrint = async () => {
    if (!cardRef.current) return;
    setIsPrinting(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSem}`;
      await printOrSaveAsPdf(cardRef.current, {
        fileName: `Nagasri_S_${studentProfile.regNo}_Official_Marksheet_Card_${semLabel}`,
        title: `Official Marksheet Card - ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSemester.semesterName} (${studentProfile.regNo})`,
        orientation: 'portrait'
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:bg-white">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-blue-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-150 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Action Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-5 sm:px-6 py-4 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-blue-700/60 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm shrink-0">
              TC
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
                Official Marksheet Card — {studentProfile.college}
              </h3>
              <span className="text-[11px] text-blue-200 block">
                Candidate: <strong>{studentProfile.name}</strong> ({studentProfile.regNo})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            {/* 1. Direct PDF Download Button */}
            <button
              id="btn-modal-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || isDownloadingPng}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm disabled:opacity-75"
              title="Download full marksheet card as PDF"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-rose-100" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* 2. Direct PNG Download Button */}
            <button
              id="btn-modal-download-png"
              onClick={handleDownloadPng}
              disabled={isDownloadingPdf || isDownloadingPng}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm disabled:opacity-75"
              title="Download full marksheet card as high-res PNG"
            >
              {isDownloadingPng ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </>
              )}
            </button>

            {/* 3. Print / Save PDF Button */}
            <button
              id="btn-modal-print-card"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 text-white transition border border-white/20 disabled:opacity-75"
              title="Open browser print dialog to print or Save as PDF"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-200" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5 text-sky-200" />
                  <span>Print</span>
                </>
              )}
            </button>

            <button
              id="btn-close-card-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Semester Selection Bar */}
        <div className="bg-blue-50/70 px-5 sm:px-6 py-2.5 border-b border-blue-100 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
              Select Semester:
            </span>

            {/* All Semesters Consolidated Button */}
            <button
              id="btn-modal-select-all"
              onClick={() => setSelectedSem('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                isAllSemesters
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-100/50'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All Semesters (Consolidated)</span>
            </button>

            {semestersData.map((s) => (
              <button
                key={s.semesterNumber}
                onClick={() => setSelectedSem(s.semesterNumber)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedSem === s.semesterNumber
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-100/50'
                }`}
              >
                {s.semesterName}
              </button>
            ))}
          </div>

          <div className="text-xs text-blue-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
            {isAllSemesters ? (
              <>CGPA: <span className="text-blue-600 font-black">{academicSummary.cumulativeGpa}</span></>
            ) : (
              <>SGPA: <span className="text-blue-600 font-black">{currentSemester.sgpa.toFixed(2)}</span></>
            )}
          </div>
        </div>

        {/* Download Notice Bar */}
        {downloadSuccess && downloadMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in shrink-0">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {downloadMessage}
            </span>
            <span className="text-emerald-700 font-mono text-[10px]">Unclipped with All Marks</span>
          </div>
        )}

        {/* Modal Body / The Actual Official Marksheet Card to Capture */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-900 relative">
          {/* Card Container Target for Download */}
          <div 
            ref={cardRef}
            id="printable-marksheet-card"
            className="border-2 border-blue-600 rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-white shadow-sm"
          >
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Building2 className="w-96 h-96 text-blue-950" />
            </div>

            {/* Top Decorative Blue Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800"></div>

            {/* Institution Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-blue-900 pb-5 relative z-10 text-center sm:text-left mt-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white p-2 flex flex-col items-center justify-center font-['Outfit',sans-serif] border-2 border-blue-400/50 shadow-md shrink-0">
                  <span className="text-sm font-black text-amber-300">TC</span>
                  <span className="text-[9px] font-semibold text-blue-200 uppercase">ESTD 1949</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight font-['Outfit',sans-serif]">
                    THIAGARAJAR COLLEGE
                  </h2>
                  <p className="text-sm font-bold text-blue-900">
                    Madurai
                  </p>
                  <p className="text-xs text-amber-700 font-bold font-serif my-0.5 tracking-wide">
                    "அறிவும் அன்பும் சிவம்"
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    (An Autonomous Institution Affiliated to Madurai Kamaraj University)
                  </p>
                  <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                    {isAllSemesters 
                      ? 'OFFICIAL CONSOLIDATED GRADE CARD • SEMESTERS 1 TO 4 (2024 - 2026)'
                      : `OFFICIAL GRADE SHEET & STATEMENT OF MARKS • ${currentSemester.semesterName.toUpperCase()}`}
                  </div>
                </div>
              </div>

              {/* Digital Verification QR */}
              <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-200 p-2.5 rounded-xl shadow-sm shrink-0">
                <QrCode className="w-12 h-12 text-blue-900" />
                <div className="text-left text-[10px]">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digitally Verified
                  </span>
                  <span className="text-slate-600 block">ID: <strong>24UCS32-{isAllSemesters ? 'ALL' : `S${selectedSem}`}</strong></span>
                  <span className="text-slate-500">Period: {isAllSemesters ? '2024 - 2026' : currentSemester.examSession}</span>
                </div>
              </div>
            </div>

            {/* Student Info Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 my-5 text-xs relative z-10">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Candidate Name</span>
                <strong className="text-slate-900 text-sm font-bold">{studentProfile.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Register Number</span>
                <strong className="text-blue-700 text-sm font-mono font-black">{studentProfile.regNo}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Degree & Branch</span>
                <strong className="text-slate-800 text-xs font-semibold">{studentProfile.program}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Academic Period</span>
                <strong className="text-slate-800 text-xs font-semibold">
                  {isAllSemesters ? '2024 - 2026 (Sem 1 - 4)' : `${currentSemester.semesterName} (${currentSemester.examSession})`}
                </strong>
              </div>
            </div>

            {/* Marksheet Course Breakdown */}
            <div className="space-y-6 relative z-10 mb-5">
              {semestersToDisplay.map((sem) => (
                <div key={sem.semesterNumber} className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  {/* Semester Subheading */}
                  <div className="bg-blue-900 text-white px-3.5 py-1.5 flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-blue-950 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        {sem.semesterName}
                      </span>
                      <span className="text-blue-200 text-[11px]">Session: {sem.examSession}</span>
                    </div>
                    <div className="text-blue-200 font-mono text-[11px]">
                      SGPA: <span className="text-white font-bold">{sem.sgpa.toFixed(2)}</span> • Credits: {sem.creditsCompleted}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-blue-50 text-blue-950 font-bold uppercase text-[10px] border-b border-blue-200">
                        <tr>
                          <th className="py-2.5 px-3 min-w-[85px]">Course Code</th>
                          <th className="py-2.5 px-3 min-w-[200px]">Course Title</th>
                          <th className="py-2.5 px-3 text-center min-w-[55px]">CIA</th>
                          <th className="py-2.5 px-3 text-center min-w-[55px]">ESE</th>
                          <th className="py-2.5 px-3 text-center min-w-[55px]">Total</th>
                          <th className="py-2.5 px-3 text-center min-w-[45px]">GP</th>
                          <th className="py-2.5 px-3 text-center min-w-[50px]">Grade</th>
                          <th className="py-2.5 px-3 text-center min-w-[50px]">Credit</th>
                          <th className="py-2.5 px-3 text-center min-w-[65px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {sem.subjects.map((sub) => (
                          <tr key={sub.code} className="hover:bg-blue-50/30">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-800 whitespace-nowrap">{sub.code}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{sub.name}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-700 font-medium">{sub.internal}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-700 font-medium">{sub.external}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{sub.final}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{sub.gradePoint.toFixed(1)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs border border-blue-300">
                                {sub.grade}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold">{sub.credit}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-emerald-700">Pass</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-blue-200 text-xs">
                        <tr>
                          <td colSpan={2} className="py-2 px-3 uppercase text-blue-900 font-black">
                            {sem.semesterName} Aggregate
                          </td>
                          <td colSpan={2} className="py-2 px-3 text-right text-slate-500 font-normal">
                            Marks:
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-black text-blue-950">
                            {sem.totalMarksObtained} / {sem.totalMarksMax}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-black text-blue-700">
                            {sem.sgpa.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-xs font-bold text-blue-800">
                            SGPA
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-black text-slate-900">
                            {sem.creditsCompleted}
                          </td>
                          <td className="py-2 px-3 text-center text-emerald-700 font-black">
                            PASSED
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* 2-Year Cumulative Snapshot */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10 mb-5">
              <div>
                <span className="text-blue-300 text-[10px] uppercase font-bold block">2-Year Cumulative Academic Performance</span>
                <strong className="text-base sm:text-lg font-black font-['Outfit',sans-serif] text-amber-300">
                  CGPA: {academicSummary.cumulativeGpa} / 10.0 • Total Marks: {academicSummary.totalMarksObtained}/{academicSummary.totalMarksMax} ({academicSummary.overallPercentage}%)
                </strong>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-lg font-bold">
                  89 / 89 Credits Cleared
                </span>
                <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2.5 py-1 rounded-lg font-bold">
                  First Class with Distinction
                </span>
              </div>
            </div>

            {/* Controller Certification */}
            <div className="flex justify-between items-end text-xs text-slate-600 pt-3 border-t border-slate-200 relative z-10">
              <div className="text-[11px] text-slate-500">
                <span>Certified by Office of Controller of Examinations</span>
                <span className="block text-slate-400 mt-0.5">Thiagarajar College, Madurai 625 009</span>
              </div>
              <div className="text-right">
                <span className="block font-serif italic text-slate-700 mb-0.5">Sd/..</span>
                <strong className="block text-slate-900 text-xs">Controller of Examination</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
