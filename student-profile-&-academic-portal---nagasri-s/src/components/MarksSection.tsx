import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { semestersData, academicSummary, studentProfile } from '../data/studentData';
import { Subject } from '../types';
import { CreditCard, FileSpreadsheet } from 'lucide-react';

interface MarksSectionProps {
  onNavigateToResultSheet?: (semNumber?: number) => void;
  onOpenMarksheetCard?: () => void;
}

export const MarksSection: React.FC<MarksSectionProps> = ({ 
  onNavigateToResultSheet,
  onOpenMarksheetCard 
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#38bdf8', '#fbbf24', '#34d399', '#6366f1']
    });
  };

  // Filter subjects
  const filteredSemesters = useMemo(() => {
    return semestersData
      .filter((sem) => selectedSemester === 'all' || sem.semesterNumber === selectedSemester)
      .map((sem) => {
        const filteredSubjects = sem.subjects.filter((sub) => {
          const matchesSearch = 
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.code.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = selectedType === 'all' || sub.type === selectedType;
          return matchesSearch && matchesType;
        });
        return {
          ...sem,
          filteredSubjects
        };
      });
  }, [selectedSemester, searchQuery, selectedType]);

  const allFilteredSubjectsCount = useMemo(() => {
    return filteredSemesters.reduce((acc, sem) => acc + sem.filteredSubjects.length, 0);
  }, [filteredSemesters]);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'O':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
      case 'A+':
      case 'A':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'B+':
      case 'B':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
      case 'C':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-medium';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getCourseTypeBadge = (type: Subject['type']) => {
    switch (type) {
      case 'Practical':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Core':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Allied':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Language':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'NSS/Extension':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 2-Year Consolidated Performance Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/40 text-xs font-semibold text-blue-100 mb-2">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>2) Mark Percentile Analysis (Up to 2nd Year)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif]">
                Academic Evaluation & Mark Percentile
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mt-1 max-w-2xl">
                Comprehensive semester examination records from Nov-2024 to Apr-2026 across 4 completed semesters at Thiagarajar College, Madurai.
              </p>
            </div>

            {/* Distinction Trophy Box & Direct Marksheet Card Launch */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block">Overall Standing</span>
                  <span className="text-xl font-bold text-white block">{academicSummary.classification}</span>
                  <button
                    id="btn-celebrate-gpa"
                    onClick={triggerCelebration}
                    className="mt-1 text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition"
                  >
                    <Sparkles className="w-3 h-3" /> Celebrate CGPA 8.23 🎉
                  </button>
                </div>
              </div>

              {/* Marksheet card launcher */}
              <div className="flex sm:flex-col gap-2">
                <button
                  id="btn-open-official-marksheet"
                  onClick={() => onOpenMarksheetCard && onOpenMarksheetCard()}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Official Marksheet Card</span>
                </button>
                <button
                  id="btn-open-result-sheet"
                  onClick={() => onNavigateToResultSheet && onNavigateToResultSheet()}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Exam Result Sheet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-600/60">
            <div className="bg-blue-900/40 border border-blue-400/30 rounded-xl p-3.5 text-center">
              <span className="text-blue-200 text-xs font-semibold block">Cumulative CGPA</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-['Outfit',sans-serif]">
                {academicSummary.cumulativeGpa}
              </span>
              <span className="text-[11px] text-blue-200 block">Out of 10.0 Scale</span>
            </div>

            <div className="bg-blue-900/40 border border-blue-400/30 rounded-xl p-3.5 text-center">
              <span className="text-blue-200 text-xs font-semibold block">Overall Percentage</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                {academicSummary.overallPercentage}%
              </span>
              <span className="text-[11px] text-blue-200 block">{academicSummary.totalMarksObtained} / {academicSummary.totalMarksMax} Marks</span>
            </div>

            <div className="bg-blue-900/40 border border-blue-400/30 rounded-xl p-3.5 text-center">
              <span className="text-blue-200 text-xs font-semibold block">Estimated Percentile</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-['Outfit',sans-serif]">
                94.2 %ile
              </span>
              <span className="text-[11px] text-emerald-200 block">Top Tier in Cohort</span>
            </div>

            <div className="bg-blue-900/40 border border-blue-400/30 rounded-xl p-3.5 text-center">
              <span className="text-blue-200 text-xs font-semibold block">Credit Completion</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                {academicSummary.totalCreditsCompleted} / {academicSummary.totalCredits}
              </span>
              <span className="text-[11px] text-emerald-300 block font-semibold">100% (29 of 29 Passed)</span>
            </div>
          </div>
        </div>

        {/* Semester Progression Visualizer Bar */}
        <div className="p-6 bg-slate-50/60 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Semester-Wise SGPA Progression Trend
            </h3>
            <button
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showFormulaInfo ? 'Hide Formula' : 'How SGPA / CGPA is Computed'}
            </button>
          </div>

          {showFormulaInfo && (
            <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-blue-900 font-bold block mb-1">Thiagarajar College Autonomous Evaluation Scheme:</strong>
              <p>• <strong>SGPA (Semester Grade Point Average)</strong> = Σ (Course Credit × Grade Point) / Σ (Course Credits for that Semester).</p>
              <p>• <strong>CGPA (Cumulative Grade Point Average)</strong> = Σ (Total Quality Points across 4 Semesters: 732.4) / Σ (Total Credits: 89) = <strong>8.23</strong>.</p>
              <p>• <strong>Marks Percentile Equivalent</strong> = (Total Marks Scored: 2255 / Total Maximum: 2625) × 100 = <strong>85.90%</strong>.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {semestersData.map((sem) => (
              <div 
                key={sem.semesterNumber}
                onClick={() => setSelectedSemester(sem.semesterNumber)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  selectedSemester === sem.semesterNumber 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300' 
                    : 'bg-white text-slate-800 border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className={`font-bold ${selectedSemester === sem.semesterNumber ? 'text-blue-100' : 'text-blue-700'}`}>
                    {sem.semesterName}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    selectedSemester === sem.semesterNumber ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {sem.examSession}
                  </span>
                </div>
                <div className="text-xl font-black font-['Outfit',sans-serif]">
                  {sem.sgpa.toFixed(2)} <span className="text-xs font-normal opacity-80">SGPA</span>
                </div>
                <div className="flex justify-between items-center text-[11px] mt-1.5 opacity-90">
                  <span>{sem.percentage.toFixed(1)}% Marks</span>
                  <span>{sem.creditsCompleted} Credits</span>
                </div>
                {/* Progress bar visual */}
                <div className="w-full bg-black/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${selectedSemester === sem.semesterNumber ? 'bg-amber-300' : 'bg-blue-600'}`}
                    style={{ width: `${(sem.sgpa / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution Summary Pill Strip */}
        <div className="px-6 py-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            2-Year Grade Distribution (29 Courses):
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold">
              Grade O (Outstanding 9.1-10.0): <strong>{academicSummary.gradesCount.O}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-300 text-blue-900 font-bold">
              Grade A (Excellent 8.0-9.0): <strong>{academicSummary.gradesCount.A}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
              Grade B (Very Good 7.0-7.9): <strong>{academicSummary.gradesCount.B}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-900 font-bold">
              Grade C (Good 6.0-6.9): <strong>{academicSummary.gradesCount.C}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 font-medium">
              Backlogs / Arrears: <strong className="text-emerald-600">0 (Zero)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Filter by Semester, Category, and Search Query */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Semester Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <button
            id="filter-sem-all"
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedSemester === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All 4 Semesters (29)
          </button>
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              id={`filter-sem-${num}`}
              onClick={() => setSelectedSemester(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedSemester === num
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Sem {num}
            </button>
          ))}
        </div>

        {/* Search and Category Filter */}
        <div className="flex items-center gap-2 flex-1 md:justify-end">
          {/* Category dropdown */}
          <div className="relative">
            <select
              id="filter-subject-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter courses by type"
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 pl-2.5 pr-7 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Course Types</option>
              <option value="Core">Core Theory</option>
              <option value="Practical">Practical Lab</option>
              <option value="Allied">Allied & Math</option>
              <option value="Language">Languages</option>
              <option value="NSS/Extension">NSS</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              id="input-search-courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code or name..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Detailed Tables per Semester */}
      <div className="space-y-6">
        {filteredSemesters.map((sem) => (
          <div 
            key={sem.semesterNumber} 
            className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
          >
            {/* Semester Header */}
            <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/30 px-6 py-4 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm font-['Outfit',sans-serif]">
                  S{sem.semesterNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {sem.semesterName} — Examination: {sem.examSession}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {sem.academicYear} • Thiagarajar College Examination Board
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-200 font-medium text-slate-700">
                  SGPA: <strong className="text-blue-700 text-sm font-black">{sem.sgpa.toFixed(2)}</strong>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-blue-200 font-medium text-slate-700">
                  Marks: <strong>{sem.totalMarksObtained} / {sem.totalMarksMax}</strong> ({sem.percentage.toFixed(1)}%)
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{sem.creditsCompleted} Credits</span>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            {sem.filteredSubjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No subjects matching "{searchQuery}" in {sem.semesterName}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Course Code</th>
                      <th className="py-3 px-4">Course Name & Category</th>
                      <th className="py-3 px-3 text-center">Internal (CIA)</th>
                      <th className="py-3 px-3 text-center">External (ESE)</th>
                      <th className="py-3 px-3 text-center">Final Mark</th>
                      <th className="py-3 px-3 text-center">Grade Point</th>
                      <th className="py-3 px-3 text-center">Grade</th>
                      <th className="py-3 px-3 text-center">Credit</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sem.filteredSubjects.map((sub, idx) => (
                      <tr 
                        key={sub.code} 
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-blue-800 whitespace-nowrap">
                          {sub.code}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 leading-snug">
                            {sub.name}
                          </div>
                          <div className="mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] border font-medium ${getCourseTypeBadge(sub.type)}`}>
                              {sub.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {sub.internal}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {sub.external}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                          {sub.final}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                          {sub.gradePoint.toFixed(1)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border text-xs ${getGradeBadge(sub.grade)}`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {sub.credit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <FileCheck className="w-3 h-3" /> Pass
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Semester Subtotal Footer */}
                  <tfoot className="bg-slate-50 font-semibold text-slate-700 border-t border-slate-200 text-xs">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-4 text-slate-900 font-bold">
                        {sem.semesterName} Totals ({sem.filteredSubjects.length} courses displayed)
                      </td>
                      <td colSpan={2} className="py-2.5 px-3 text-right text-slate-500 font-normal">
                        Total Marks:
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-800">
                        {sem.totalMarksObtained} / {sem.totalMarksMax}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-normal">
                        SGPA:
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">
                        {sem.sgpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {sem.creditsCompleted}
                      </td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">
                        100% Pass
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
