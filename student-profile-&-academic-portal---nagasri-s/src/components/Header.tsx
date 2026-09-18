import React from 'react';
import { GraduationCap, Award, Bus, User, FileSpreadsheet, CheckCircle2, CreditCard } from 'lucide-react';
import { studentProfile, academicSummary } from '../data/studentData';

interface HeaderProps {
  activeTab: 'profile' | 'marks' | 'transport' | 'results';
  setActiveTab: (tab: 'profile' | 'marks' | 'transport' | 'results') => void;
  onOpenMarksheetCard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenMarksheetCard }) => {
  return (
    <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white shadow-lg sticky top-0 z-40 border-b border-blue-800/60">
      {/* Official College Top Banner: Horizontal strip styled like the official portal in deep blue theme */}
      <div className="bg-[#071b3e] text-white border-b border-blue-800/80 py-1.5 sm:py-2 px-3 sm:px-6 text-xs sm:text-[13px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Round TC Badge as seen in the user's screenshot */}
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs font-['Outfit',sans-serif]">
              TC
            </span>
            <span className="font-bold text-white tracking-tight whitespace-nowrap">
              Thiagarajar College (Autonomous)
            </span>
            <span className="text-blue-400/60">|</span>
            <span className="font-medium text-blue-100 whitespace-nowrap">
              Madurai
            </span>
            <span className="text-blue-400/60">|</span>
            <span className="font-bold text-amber-300 font-serif whitespace-nowrap tracking-wide">
              &quot;அறிவும் அன்பும் சிவம்&quot;
            </span>
            <span className="hidden lg:inline text-blue-400/60">|</span>
            <span className="hidden lg:inline text-blue-200/90 whitespace-nowrap">
              (An Autonomous Institution Affiliated to Madurai Kamaraj University)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-blue-400/60">|</span>
            <span className="text-sky-300 font-medium whitespace-nowrap">
              Re-Accredited with &apos;A++&apos; Grade by NAAC (Cycle 4)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with Student Identity & Quick Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 sm:py-4 gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/90 border border-blue-400/40 flex items-center justify-center shadow-md shadow-blue-950/40 shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Outfit',sans-serif]">
                  {studentProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200">
                  {studentProfile.regNo}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> 2 Years Completed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-0.5 font-medium">
                {studentProfile.program} • Department of Computer Science
              </p>
            </div>
          </div>

          {/* Quick Metrics & Official Marksheet Card Button */}
          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-700/50 rounded-xl px-3 py-1.5 text-xs">
              <div className="text-center px-2 border-r border-blue-800/80">
                <span className="block text-slate-300 text-[10px] uppercase font-medium">CGPA (2 Yrs)</span>
                <span className="font-bold text-amber-300 text-sm sm:text-base">{academicSummary.cumulativeGpa} / 10</span>
              </div>
              <div className="text-center px-2 border-r border-blue-800/80">
                <span className="block text-slate-300 text-[10px] uppercase font-medium">Percentile</span>
                <span className="font-bold text-sky-300 text-sm sm:text-base">{academicSummary.overallPercentage}%</span>
              </div>
              <div className="text-center px-2">
                <span className="block text-slate-300 text-[10px] uppercase font-medium">Daily Travel</span>
                <span className="font-bold text-emerald-300 text-sm sm:text-base">₹80</span>
              </div>
            </div>

            {/* Official Marksheet Card Shortcut Button */}
            <button
              id="btn-header-official-marksheet-card"
              onClick={() => {
                setActiveTab('results');
                if (onOpenMarksheetCard) onOpenMarksheetCard();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm border border-blue-400/40 transition"
              title="View Official Marksheet Card"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Marksheet Card</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-blue-800/40 pt-1 overflow-x-auto no-scrollbar" aria-label="Tabs">
          <button
            id="tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white/10 text-white border-sky-400'
                : 'text-blue-200/80 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <User className="w-4 h-4 text-sky-300" />
            <span>1. Student Profile</span>
          </button>

          <button
            id="tab-marks"
            onClick={() => setActiveTab('marks')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'marks'
                ? 'bg-white/10 text-white border-sky-400'
                : 'text-blue-200/80 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>2. Mark Percentile (2 Years)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-700 text-blue-100 font-mono">
              4 Sems
            </span>
          </button>

          <button
            id="tab-transport"
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'transport'
                ? 'bg-white/10 text-white border-sky-400'
                : 'text-blue-200/80 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <Bus className="w-4 h-4 text-emerald-300" />
            <span>3. Transport Sequence</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600/60 text-white font-mono">
              ₹80/day
            </span>
          </button>

          <button
            id="tab-results"
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-white/10 text-white border-sky-400'
                : 'text-blue-200/80 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Exam Result Sheet</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
