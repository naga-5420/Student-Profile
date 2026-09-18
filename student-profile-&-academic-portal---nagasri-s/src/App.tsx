import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { MarksSection } from './components/MarksSection';
import { TransportSection } from './components/TransportSection';
import { ExamResultSheet } from './components/ExamResultSheet';
import { OfficialMarksheetCardModal } from './components/OfficialMarksheetCardModal';
import { studentProfile } from './data/studentData';
import { GraduationCap, Bus, Award, User, FileSpreadsheet, CreditCard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'marks' | 'transport' | 'results'>('profile');
  const [isMarksheetCardModalOpen, setIsMarksheetCardModalOpen] = useState(false);
  const [cardModalSemester, setCardModalSemester] = useState<number>(1);

  const handleOpenMarksheetCard = (semNumber?: number) => {
    if (semNumber) {
      setCardModalSemester(semNumber);
    }
    setIsMarksheetCardModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Blue Themed App Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenMarksheetCard={() => handleOpenMarksheetCard(1)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Content Display */}
        {activeTab === 'profile' && (
          <ProfileCard
            onNavigateToMarks={() => setActiveTab('marks')}
            onNavigateToTransport={() => setActiveTab('transport')}
          />
        )}

        {activeTab === 'marks' && (
          <MarksSection 
            onNavigateToResultSheet={(sem) => {
              setActiveTab('results');
            }}
            onOpenMarksheetCard={() => handleOpenMarksheetCard(1)}
          />
        )}

        {activeTab === 'transport' && (
          <TransportSection />
        )}

        {activeTab === 'results' && (
          <ExamResultSheet 
            onOpenMarksheetCard={(sem) => handleOpenMarksheetCard(sem)}
          />
        )}
      </main>

      {/* Official Marksheet Card Modal */}
      <OfficialMarksheetCardModal
        isOpen={isMarksheetCardModalOpen}
        onClose={() => setIsMarksheetCardModalOpen(false)}
        initialSemester={cardModalSemester}
      />

      {/* Global Quick Bottom Bar for Easy Switching */}
      <footer className="bg-white border-t border-blue-100 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-700">
              Assignment 2 • {studentProfile.name} ({studentProfile.regNo})
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-500">
              {studentProfile.college}, {studentProfile.collegeCity} • <strong className="text-amber-700 font-serif">{studentProfile.collegeMotto}</strong> • {studentProfile.collegeAffiliation}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-blue-600 transition ${activeTab === 'profile' ? 'text-blue-700 font-bold' : ''}`}
            >
              1. Profile
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`hover:text-blue-600 transition ${activeTab === 'marks' ? 'text-blue-700 font-bold' : ''}`}
            >
              2. Mark Percentile
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className={`hover:text-blue-600 transition ${activeTab === 'transport' ? 'text-blue-700 font-bold' : ''}`}
            >
              3. Transport Sequence
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`hover:text-blue-600 transition ${activeTab === 'results' ? 'text-blue-700 font-bold' : ''}`}
            >
              Exam Result Sheet
            </button>
            <button
              onClick={() => handleOpenMarksheetCard(1)}
              className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60"
            >
              <CreditCard className="w-3 h-3" />
              Official Marksheet Card
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
