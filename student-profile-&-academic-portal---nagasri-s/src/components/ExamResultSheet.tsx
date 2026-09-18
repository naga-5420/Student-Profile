import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  CreditCard,
  Building2,
  QrCode,
  ShieldCheck,
  Loader2,
  Check,
  Layers,
  FileDown
} from 'lucide-react';
import { studentProfile, semestersData, academicSummary } from '../data/studentData';
import { 
  printOrSaveAsPdf, 
  downloadElementAsPdf, 
  captureFullElementToPng 
} from '../utils/printAndPdf';

interface ExamResultSheetProps {
  onOpenMarksheetCard?: (semNumber?: number) => void;
}

export const ExamResultSheet: React.FC<ExamResultSheetProps> = ({ onOpenMarksheetCard }) => {
  const [selectedSemNumber, setSelectedSemNumber] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'sheet' | 'card'>('sheet');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const isAllSemesters = selectedSemNumber === 'all';
  const currentSem = isAllSemesters 
    ? semestersData[0] 
    : (semestersData.find(s => s.semesterNumber === selectedSemNumber) || semestersData[0]);

  const displayedSemesters = isAllSemesters ? semestersData : [currentSem];

  // Direct download of the entire unclipped marksheet as a high-quality PDF
  const handleDownloadPdf = async () => {
    const targetElement = viewMode === 'card' ? cardRef.current : sheetRef.current;
    if (!targetElement) return;

    setIsDownloadingPdf(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSemNumber}`;
      const modeLabel = viewMode === 'card' ? 'Official_Marksheet_Card' : 'Exam_Result_Sheet';
      const fileName = `Nagasri_S_${studentProfile.regNo}_${modeLabel}_${semLabel}.pdf`;

      await downloadElementAsPdf(targetElement, {
        fileName,
        title: `${viewMode === 'card' ? 'Official Marksheet Card' : 'Exam Result Sheet'} - ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSem.semesterName} - Nagasri S (${studentProfile.regNo})`,
        orientation: 'portrait',
        minWidth: 1120
      });

      setDownloadSuccess(true);
      setDownloadMessage(`Official PDF for ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSem.semesterName} downloaded!`);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadMessage(null);
      }, 4000);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Direct download of the entire unclipped marksheet as a crystal clear 2x PNG
  const handleDownloadPng = async () => {
    const targetElement = viewMode === 'card' ? cardRef.current : sheetRef.current;
    if (!targetElement) return;

    setIsDownloadingPng(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSemNumber}`;
      const modeLabel = viewMode === 'card' ? 'Official_Marksheet_Card' : 'Exam_Result_Sheet';
      const fileName = `Nagasri_S_${studentProfile.regNo}_${modeLabel}_${semLabel}.png`;

      const dataUrl = await captureFullElementToPng(targetElement, {
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
      setDownloadMessage(`High-Resolution PNG for ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSem.semesterName} downloaded!`);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadMessage(null);
      }, 4000);
    } catch (err) {
      console.error('PNG download failed:', err);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // Opens native browser print dialog for printing or choosing "Save as PDF"
  const handlePrint = async () => {
    const targetElement = viewMode === 'card' ? cardRef.current : sheetRef.current;
    if (!targetElement) return;

    setIsPrinting(true);
    try {
      const semLabel = isAllSemesters ? 'All_Semesters_Consolidated' : `Semester_${selectedSemNumber}`;
      const modeLabel = viewMode === 'card' ? 'Official_Marksheet_Card' : 'Exam_Result_Sheet';
      await printOrSaveAsPdf(targetElement, {
        fileName: `Nagasri_S_${studentProfile.regNo}_${modeLabel}_${semLabel}`,
        title: `${viewMode === 'card' ? 'Official Marksheet Card' : 'Exam Result Sheet'} - ${isAllSemesters ? 'All Semesters (Consolidated)' : currentSem.semesterName} (${studentProfile.regNo})`,
        orientation: 'portrait'
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Semester Switcher & Official Marksheet Card Button */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              MyCamu Portal View
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              End Semester Examination Result Sheet
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official format matching the Thiagarajar College Examination Controller database for Nagasri S (24UCS32).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="btn-view-sheet"
              onClick={() => setViewMode('sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'sheet'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Result Sheet</span>
            </button>
            <button
              id="btn-view-card"
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'card'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Official Card</span>
            </button>
          </div>

          {/* 1. Direct PDF Download Button */}
          <button
            id="btn-download-pdf-direct"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf || isDownloadingPng}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm disabled:opacity-75"
            title="Download full marksheet with all marks as PDF"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-rose-100" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          {/* 2. Direct PNG Image Download Button */}
          <button
            id="btn-download-png-direct"
            onClick={handleDownloadPng}
            disabled={isDownloadingPdf || isDownloadingPng}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-sm disabled:opacity-75"
            title="Download full marksheet with all marks as high-res PNG image"
          >
            {isDownloadingPng ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </>
            )}
          </button>

          {/* 3. Print / Save as PDF Button */}
          <button
            id="btn-print-sheet"
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm disabled:opacity-75"
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
        </div>
      </div>

      {/* Success Notification Bar */}
      {downloadSuccess && downloadMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {downloadMessage}
          </span>
          <span className="text-emerald-700 font-mono text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded">
            All Marks & Details Included
          </span>
        </div>
      )}

      {/* Semester Selector Pills (Includes All Semesters Option) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar print:hidden">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
          Select View:
        </span>
        
        {/* All Semesters Consolidated Button */}
        <button
          id="btn-select-sem-all"
          onClick={() => setSelectedSemNumber('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            isAllSemesters
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Semesters (Consolidated Transcript)</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
            isAllSemesters ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            29 Courses
          </span>
        </button>

        {/* Individual Semester Pills */}
        {semestersData.map((sem) => (
          <button
            key={sem.semesterNumber}
            id={`btn-select-sem-${sem.semesterNumber}`}
            onClick={() => setSelectedSemNumber(sem.semesterNumber)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedSemNumber === sem.semesterNumber
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50/50'
            }`}
          >
            <span>{sem.semesterName}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
              selectedSemNumber === sem.semesterNumber ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {sem.examSession}
            </span>
          </button>
        ))}
      </div>

      {/* View Mode: Official Marksheet Card View */}
      {viewMode === 'card' ? (
        <div 
          ref={cardRef}
          id="marksheet-card-container"
          className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Building2 className="w-96 h-96 text-blue-900" />
          </div>

          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800"></div>

          {/* Card Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-blue-100 pb-6 relative z-10">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white p-2.5 shadow-md flex items-center justify-center shrink-0 border border-blue-400/40">
                <div className="text-center font-['Outfit',sans-serif]">
                  <div className="text-xs font-black tracking-widest text-amber-300">TC</div>
                  <div className="text-[9px] font-semibold text-blue-200 uppercase">1949</div>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-blue-950 font-['Outfit',sans-serif] tracking-tight">
                  THIAGARAJAR COLLEGE
                </h3>
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
                    ? 'CONSOLIDATED STATEMENT OF MARKS • SEMESTERS 1 TO 4 (2024 - 2026)'
                    : `OFFICIAL GRADE CARD • ${currentSem.semesterName.toUpperCase()} (${currentSem.examSession})`}
                </div>
              </div>
            </div>

            {/* Verification QR Mock */}
            <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-200 p-3 rounded-xl shrink-0">
              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-blue-300 flex items-center justify-center shadow-inner">
                <QrCode className="w-12 h-12 text-blue-900" />
              </div>
              <div className="text-left text-[10px] text-slate-600">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Verified
                </span>
                <span>Code: <strong>TC-24UCS32</strong></span>
                <span className="block text-slate-400">Authentic Record</span>
              </div>
            </div>
          </div>

          {/* Student Identification Banner on Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 my-6 text-xs relative z-10">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Student Name</span>
              <strong className="text-slate-900 text-sm font-bold">{studentProfile.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Register Number</span>
              <strong className="text-blue-700 text-sm font-mono font-black">{studentProfile.regNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Course & Branch</span>
              <strong className="text-slate-800 text-xs font-semibold">{studentProfile.program}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Academic Period</span>
              <strong className="text-slate-800 text-xs font-semibold">
                {isAllSemesters ? '2024 - 2026 (Sem 1 - 4)' : `${currentSem.academicYear} (${currentSem.examSession})`}
              </strong>
            </div>
          </div>

          {/* Marksheet Subjects Tables (One per semester if all, or single semester) */}
          <div className="space-y-6 relative z-10 mb-6">
            {displayedSemesters.map((sem) => (
              <div key={sem.semesterNumber} className="border border-blue-200 rounded-xl overflow-hidden shadow-xs">
                {/* Semester Header Strip */}
                <div className="bg-blue-900 text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-blue-950 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {sem.semesterName}
                    </span>
                    <span>Session: {sem.examSession}</span>
                  </div>
                  <div className="text-blue-200 font-mono text-[11px]">
                    SGPA: <span className="text-white font-black">{sem.sgpa.toFixed(2)}</span> • Credits: {sem.creditsCompleted}
                  </div>
                </div>

                {/* Courses Table with Complete Marks Columns */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-blue-50 text-blue-950 font-bold uppercase text-[10px] border-b border-blue-200">
                      <tr>
                        <th className="py-2.5 px-3 min-w-[90px]">Course Code</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Course Title</th>
                        <th className="py-2.5 px-3 text-center min-w-[55px]">CIA</th>
                        <th className="py-2.5 px-3 text-center min-w-[55px]">ESE</th>
                        <th className="py-2.5 px-3 text-center min-w-[55px]">Total</th>
                        <th className="py-2.5 px-3 text-center min-w-[45px]">GP</th>
                        <th className="py-2.5 px-3 text-center min-w-[50px]">Grade</th>
                        <th className="py-2.5 px-3 text-center min-w-[50px]">Credits</th>
                        <th className="py-2.5 px-3 text-center min-w-[65px]">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sem.subjects.map((sub) => (
                        <tr key={sub.code} className="hover:bg-blue-50/40">
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
                        <td colSpan={2} className="py-2.5 px-3 uppercase text-blue-900 font-black">
                          {sem.semesterName} Total
                        </td>
                        <td colSpan={2} className="py-2.5 px-3 text-right text-slate-500 font-normal">
                          Marks Scored:
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-blue-950">
                          {sem.totalMarksObtained} / {sem.totalMarksMax}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-blue-700">
                          {sem.sgpa.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-xs font-bold text-blue-800">
                          SGPA
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-900">
                          {sem.creditsCompleted}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-700 font-black">
                          PASSED
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* 2-Year Cumulative Standing Strip on Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10 mb-6">
            <div>
              <span className="text-blue-200 text-[10px] uppercase font-bold block">2-Year Cumulative Result (Sem 1 - 4)</span>
              <strong className="text-lg font-black font-['Outfit',sans-serif]">
                CGPA: {academicSummary.cumulativeGpa} / 10.0 • Total Marks: {academicSummary.totalMarksObtained} / {academicSummary.totalMarksMax} ({academicSummary.overallPercentage}%)
              </strong>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-blue-200 text-[10px] uppercase font-bold block">Total Credits Cleared</span>
                <span className="text-base font-bold font-mono text-emerald-300">89 / 89</span>
              </div>
              <div className="border-l border-blue-700 pl-4">
                <span className="text-blue-200 text-[10px] uppercase font-bold block">Academic Classification</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded border border-amber-300/30 inline-block">
                  First Class with Distinction
                </span>
              </div>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="flex justify-between items-end text-xs text-slate-600 pt-4 border-t border-slate-200 relative z-10">
            <div>
              <span className="block text-[10px] text-slate-400">Date of Publication: 2026</span>
              <span className="font-semibold text-slate-700">MyCamu Academic Management System</span>
            </div>
            <div className="text-right">
              <span className="block font-serif italic text-slate-700 mb-1">Sd/..</span>
              <strong className="block text-slate-900 text-xs">Controller of Examination</strong>
              <span className="text-[10px] text-slate-500">Thiagarajar College (Autonomous), Madurai</span>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode: Exact MyCamu Exam Result Sheet Layout */
        <div 
          ref={sheetRef}
          id="exam-result-sheet-container"
          className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 font-sans relative text-slate-900"
        >
          {/* Top Date and Platform Info */}
          <div className="flex justify-between items-center text-[11px] text-slate-600 pb-2 border-b border-slate-100 font-mono">
            <span>{new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="font-bold text-slate-800">My Camu</span>
          </div>

          {/* College Emblem & Header (Exact match to official portal marksheets) */}
          <div className="text-center pt-4 pb-4">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-xl border-2 border-blue-900 p-1 flex flex-col items-center justify-center bg-amber-50">
                <div className="w-4 h-4 rounded-full bg-amber-400 shadow-sm mb-0.5"></div>
                <div className="w-8 h-4 border-t-2 border-l-2 border-r-2 border-blue-900 rounded-t-md bg-white flex items-center justify-center text-[7px] font-bold text-blue-900">
                  TC
                </div>
                <div className="w-10 h-1.5 bg-blue-900 rounded-sm mt-0.5"></div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Thiagarajar College
            </h1>
            <p className="text-sm font-bold text-slate-800">
              Madurai
            </p>
            <p className="text-xs sm:text-sm font-bold text-amber-800 font-serif my-0.5 tracking-wide">
              "அறிவும் அன்பும் சிவம்"
            </p>
            <p className="text-xs text-slate-600 font-medium">
              (An Autonomous Institution Affiliated to Madurai Kamaraj University)
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
              End Semester Examination - {isAllSemesters ? 'Consolidated Statement (Semesters 1 - 4)' : currentSem.examSession}
            </p>
          </div>

          <hr className="border-t-2 border-slate-900 my-3" />

          {/* Student Metadata Table Grid (Exact match to marksheets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs sm:text-sm font-medium py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Student Name:</span>
              <strong className="text-slate-900 tracking-wide uppercase">{studentProfile.name}</strong>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="text-slate-600">Reg. No.:</span>
              <strong className="text-slate-900 font-mono tracking-wider">{studentProfile.regNo}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Semester:</span>
              <strong className="text-slate-900">
                {isAllSemesters ? 'Semesters 1 to 4 (Consolidated)' : currentSem.semesterName}
              </strong>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="text-slate-600">Gender:</span>
              <strong className="text-slate-900">{studentProfile.gender}</strong>
            </div>
            <div className="col-span-1 sm:col-span-2 flex items-center gap-2 pt-1">
              <span className="text-slate-600">Program:</span>
              <strong className="text-slate-900">{studentProfile.program}</strong>
            </div>
          </div>

          {/* Courses & Assessment Marks Tables */}
          <div className="space-y-6 mt-4">
            {displayedSemesters.map((sem) => (
              <div key={sem.semesterNumber} className="overflow-x-auto">
                {isAllSemesters && (
                  <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 border-t border-l border-r border-slate-300 flex justify-between items-center">
                    <span>{sem.semesterName} — {sem.examSession}</span>
                    <span className="text-blue-800 font-mono">SGPA: {sem.sgpa.toFixed(2)}</span>
                  </div>
                )}
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-50/80 font-semibold text-slate-800">
                      <th rowSpan={2} className="border-r border-slate-300 py-2.5 px-3 align-middle text-center min-w-[75px]">
                        Semester
                      </th>
                      <th rowSpan={2} className="border-r border-slate-300 py-2.5 px-4 align-middle min-w-[220px]">
                        Course Name
                      </th>
                      <th colSpan={3} className="border-r border-b border-slate-300 py-1.5 px-2 text-center">
                        Assessment Mark
                      </th>
                      <th rowSpan={2} className="border-r border-slate-300 py-2.5 px-2 text-center align-middle min-w-[65px]">
                        Grade point
                      </th>
                      <th rowSpan={2} className="border-r border-slate-300 py-2.5 px-2 text-center align-middle min-w-[55px]">
                        Grade
                      </th>
                      <th rowSpan={2} className="border-r border-slate-300 py-2.5 px-2 text-center align-middle min-w-[55px]">
                        Credit
                      </th>
                      <th rowSpan={2} className="py-2.5 px-3 text-center align-middle min-w-[70px]">
                        Result status
                      </th>
                    </tr>
                    <tr className="border-b border-slate-300 bg-slate-50/80 text-[11px] text-slate-700">
                      <th className="border-r border-slate-300 py-1.5 px-2 text-center font-normal min-w-[55px]">Internal</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-center font-normal min-w-[55px]">External</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-center font-normal min-w-[55px]">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.subjects.map((sub) => (
                      <tr key={sub.code} className="border-b border-slate-300 hover:bg-slate-50/60">
                        <td className="border-r border-slate-300 py-2.5 px-3 text-center text-slate-700 whitespace-nowrap">
                          {sem.semesterName}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-4 font-normal text-slate-800">
                          <div className="font-semibold text-slate-900">{sub.code} - {sub.name}</div>
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-mono text-slate-700">
                          {sub.internal}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-mono text-slate-700">
                          {sub.external}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-mono font-bold text-slate-900">
                          {sub.final}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-mono font-semibold text-slate-800">
                          {sub.gradePoint.toFixed(1)}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-bold text-slate-800">
                          {sub.grade}
                        </td>
                        <td className="border-r border-slate-300 py-2.5 px-2 text-center font-mono font-medium">
                          {sub.credit}
                        </td>
                        <td className="py-2.5 px-3 text-center font-medium text-slate-800">
                          Pass
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-semibold text-xs border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={2} className="py-2 px-3 text-slate-700">
                        {sem.semesterName} Summary: {sem.creditsCompleted} Credits Completed
                      </td>
                      <td colSpan={2} className="py-2 px-2 text-right text-slate-600">
                        Marks:
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-900">
                        {sem.totalMarksObtained} / {sem.totalMarksMax}
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-blue-800">
                        {sem.sgpa.toFixed(2)}
                      </td>
                      <td colSpan={3} className="py-2 px-2 text-right pr-4 text-emerald-700 font-bold">
                        SGPA: {sem.sgpa.toFixed(2)} (PASSED)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>

          {/* Cumulative Summary */}
          <div className="mt-6 pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold text-slate-800 gap-3">
            <div>
              <span>Total Credits Registered : <strong>{isAllSemesters ? 89 : currentSem.creditsRegistered}</strong></span>
              <span className="ml-6">Total Credits Completed : <strong>{isAllSemesters ? 89 : currentSem.creditsCompleted}</strong></span>
            </div>
            <div className="text-right">
              {isAllSemesters ? (
                <span>Cumulative GPA (CGPA) : <strong className="text-blue-800 text-sm font-black">{academicSummary.cumulativeGpa} / 10.0</strong></span>
              ) : (
                <span>SGPA : <strong className="text-blue-800 text-sm font-black">{currentSem.sgpa.toFixed(2)}</strong></span>
              )}
            </div>
          </div>

          {/* Controller of Examination Footer */}
          <div className="mt-10 pt-6 flex justify-between items-end text-xs text-slate-700 border-t border-slate-200">
            <div className="text-[11px] text-slate-500 font-mono">
              <span>https://www.mycamu.co.in/#/home/feed/Final_result</span>
            </div>
            <div className="text-right">
              <span className="block font-serif text-slate-600">Sd/..</span>
              <strong className="block text-slate-800 mt-1">Controller of Examination</strong>
              <span className="text-[10px] text-slate-500">Thiagarajar College (Autonomous), Madurai</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
