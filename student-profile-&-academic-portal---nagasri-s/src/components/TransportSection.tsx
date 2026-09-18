import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Repeat, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2, 
  HelpCircle,
  Copy,
  Check,
  Calculator,
  Compass,
  Sunrise,
  Sunset,
  School,
  Home,
  CheckCircle
} from 'lucide-react';
import { transportSequenceData, studentProfile } from '../data/studentData';

export const TransportSection: React.FC = () => {
  const [collegeDaysPerMonth, setCollegeDaysPerMonth] = useState<number>(22);
  const [selectedLegId, setSelectedLegId] = useState<string>('leg-1');
  const [scheduleTab, setScheduleTab] = useState<'both' | 'morning' | 'afternoon'>('both');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  const dailyCost = transportSequenceData.dailyTotal; // ₹80
  const weeklyCost = dailyCost * 5; // ₹400 for 5-day week
  const monthlyCost = dailyCost * collegeDaysPerMonth; // e.g. ₹1,760
  const semesterCost = dailyCost * 90; // ~90 working days = ₹7,200
  const twoYearsCost = dailyCost * 360; // 4 semesters = ₹28,800

  const handleCopySummary = () => {
    const text = `Transport Details for ${studentProfile.name} (${studentProfile.regNo}):
- Route: Othakadai to Mattuthavani (Auto: Rs. 20)
- Connecting Route: Mattuthavani to Teppakulam (Auto: Rs. 20)
- Return Route: Teppakulam to Mattuthavani (Auto: Rs. 20)
- Connecting Return: Mattuthavani to Othakadai (Auto: Rs. 20)
- Total Daily Transport Expense: Rs. 80
- Total Monthly Estimate (22 days): Rs. ${22 * 80}
- Address: ${studentProfile.address}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopySchedule = () => {
    const scheduleText = `Transport schedule

Home to college
from home: 7.45 am     to        Mattuthavani: 8.00 am (Auto: Rs.20)
from Mattuthavani: 8.05 am       to       Teppakulam (college): 8.20 am (Auto: Rs.20)
entering class at 8.25 am

College to Home
from class to clg entrance 1.40 pm
from Teppakulam (college): 1.40 pm      to      Mattuthavani: 2.00 pm (Auto: Rs.20)
from Mattuthavani: 2.05 pm           to            home: 2.20 pm (Auto: Rs.20)

Total daily transport expense: Rs. 80`;
    navigator.clipboard.writeText(scheduleText);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Route Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-400/40 text-xs font-semibold text-blue-100 mb-2">
                <Bus className="w-3.5 h-3.5 text-emerald-300" />
                <span>3) Daily Transport Sequence & Commute Schedule</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif]">
                College Commute & Timetable
              </h2>
              <p className="text-blue-100 text-sm sm:text-base mt-1 max-w-2xl">
                Daily round-trip transit itinerary from home at <strong>Othakadai</strong> to <strong>Thiagarajar College (Teppakulam)</strong> via <strong>Mattuthavani</strong>.
              </p>
            </div>

            {/* Daily Total Badge */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center shrink-0 min-w-[200px]">
              <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold block">Total Daily Expense</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-['Outfit',sans-serif] mt-0.5">
                ₹80 <span className="text-xs font-medium text-slate-300">/ day</span>
              </div>
              <span className="text-[11px] text-blue-200 block mt-1">
                4 Auto Rides @ ₹20 each
              </span>
            </div>
          </div>

          {/* Quick Route Visual Sequence Nodes */}
          <div className="mt-8 pt-6 border-t border-blue-700/60">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-400" />
                Sequence Flow: Home ➔ Transit Hub ➔ College Campus ➔ Home
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-schedule"
                  onClick={handleCopySchedule}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold transition border border-emerald-400/30"
                  title="Copy full transport timetable with exact timings"
                >
                  {copiedSchedule ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied Schedule!</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copy Timetable</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-copy-transport"
                  onClick={handleCopySummary}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-200" />
                      <span>Copy Route</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sequence Flowchart Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="bg-blue-950/70 border border-blue-600/50 rounded-xl p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px]">
                    Step 1 • Morning
                  </span>
                  <span className="font-bold text-emerald-300 text-sm">₹20</span>
                </div>
                <div className="font-bold text-white text-sm">Home ➔ Mattuthavani</div>
                <div className="text-xs text-blue-200/80 mt-1">Vehicle: Shared Auto Rickshaw</div>
                <div className="text-[11px] text-amber-300 mt-2 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-amber-300" /> 7:45 AM ➔ 8:00 AM (15 min)
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-blue-950/70 border border-blue-600/50 rounded-xl p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">
                    Step 2 • Morning
                  </span>
                  <span className="font-bold text-emerald-300 text-sm">₹20</span>
                </div>
                <div className="font-bold text-white text-sm">Mattuthavani ➔ Teppakulam</div>
                <div className="text-xs text-blue-200/80 mt-1">Vehicle: Shared Auto Rickshaw</div>
                <div className="text-[11px] text-amber-300 mt-2 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-amber-300" /> 8:05 AM ➔ 8:20 AM (Class at 8:25)
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-blue-950/70 border border-blue-600/50 rounded-xl p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                    Step 3 • Afternoon
                  </span>
                  <span className="font-bold text-emerald-300 text-sm">₹20</span>
                </div>
                <div className="font-bold text-white text-sm">Teppakulam ➔ Mattuthavani</div>
                <div className="text-xs text-blue-200/80 mt-1">Vehicle: Shared Auto Rickshaw</div>
                <div className="text-[11px] text-amber-300 mt-2 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-amber-300" /> 1:40 PM ➔ 2:00 PM (20 min)
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-blue-950/70 border border-blue-600/50 rounded-xl p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                    Step 4 • Afternoon
                  </span>
                  <span className="font-bold text-emerald-300 text-sm">₹20</span>
                </div>
                <div className="font-bold text-white text-sm">Mattuthavani ➔ Home</div>
                <div className="text-xs text-blue-200/80 mt-1">Vehicle: Shared Auto Rickshaw</div>
                <div className="text-[11px] text-amber-300 mt-2 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-amber-300" /> 2:05 PM ➔ 2:20 PM (Arrive Home)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL: Transport Schedule Master Timetable (Directly matching user requirements) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Official Transport Schedule Timetable
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fixed daily transit timestamps for Candidate Nagasri S (24UCS32) — Total Commute: 2 Inbound + 2 Outbound Auto Rides.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium shrink-0 self-start sm:self-center">
            <button
              onClick={() => setScheduleTab('both')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scheduleTab === 'both' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Both Schedules
            </button>
            <button
              onClick={() => setScheduleTab('morning')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scheduleTab === 'morning' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home to College
            </button>
            <button
              onClick={() => setScheduleTab('afternoon')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scheduleTab === 'afternoon' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              College to Home
            </button>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Card 1: Home to College (Morning) */}
          {(scheduleTab === 'both' || scheduleTab === 'morning') && (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 via-white to-white overflow-hidden shadow-sm flex flex-col">
              {/* Header */}
              <div className="bg-sky-600 text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sunrise className="w-5 h-5 text-amber-200" />
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase font-mono">
                      Home to College
                    </h4>
                    <span className="text-[11px] text-sky-100">Morning Route • Starts 7:45 AM</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-mono font-bold">
                  Total Fare: ₹40
                </span>
              </div>

              {/* Timeline Items */}
              <div className="p-5 flex-1 space-y-4">
                {/* Milestone 1 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-sky-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 ring-4 ring-sky-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        7:45 AM
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Departure</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">From Home</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Departing residence at 2/126 Rajiv Nagar 2nd St, Thirumohur Road, Othakadai.
                    </p>
                  </div>
                </div>

                {/* Leg 1 Transit Block */}
                <div className="ml-8 p-3 rounded-xl bg-sky-50/80 border border-sky-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Bus className="w-4 h-4 text-sky-600" />
                    <span>Auto 1: Othakadai ➔ Mattuthavani</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">15 mins</span>
                    <strong className="text-emerald-600 font-bold font-mono">₹20</strong>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-sky-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        8:00 AM
                      </span>
                      <span className="text-[11px] text-amber-700 font-medium">Transit Hub</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">To Mattuthavani</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Arrive at Mattuthavani MGR Bus Stand. 5 mins connection & boarding buffer (8:00 AM - 8:05 AM).
                    </p>
                  </div>
                </div>

                {/* Leg 2 Transit Block */}
                <div className="ml-8 p-3 rounded-xl bg-sky-50/80 border border-sky-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Bus className="w-4 h-4 text-sky-600" />
                    <span>Auto 2: Mattuthavani ➔ Teppakulam</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">15 mins</span>
                    <strong className="text-emerald-600 font-bold font-mono">₹20</strong>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-sky-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        8:05 AM ➔ 8:20 AM
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">College Arrival</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">From Mattuthavani: 8:05 to Teppakulam (college): 8:20 AM</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Arrives directly outside Thiagarajar College campus main entrance gate at 8:20 AM.
                    </p>
                  </div>
                </div>

                {/* Goal Milestone: Entering Class */}
                <div className="flex items-start gap-3 relative ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                        8:25 AM
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">Class In Session</span>
                    </div>
                    <h5 className="text-sm font-extrabold text-emerald-950 mt-1 flex items-center gap-1.5">
                      <School className="w-4 h-4 text-emerald-600" />
                      Entering class at 8.25 AM
                    </h5>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      5-minute walk from college entrance to the Computer Science Department classroom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: College to Home (Afternoon) */}
          {(scheduleTab === 'both' || scheduleTab === 'afternoon') && (
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 via-white to-white overflow-hidden shadow-sm flex flex-col">
              {/* Header */}
              <div className="bg-indigo-700 text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sunset className="w-5 h-5 text-amber-300" />
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase font-mono">
                      College to Home
                    </h4>
                    <span className="text-[11px] text-indigo-100">Afternoon Return • Starts 1:40 PM</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-mono font-bold">
                  Total Fare: ₹40
                </span>
              </div>

              {/* Timeline Items */}
              <div className="p-5 flex-1 space-y-4">
                {/* Milestone 1 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-indigo-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        1:40 PM
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Class Concludes</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">From class to clg entrance 1.40 PM</h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Lectures finish; proceeding immediately to Thiagarajar College main entrance auto stand.
                    </p>
                  </div>
                </div>

                {/* Milestone 2 & Leg 3 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-indigo-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        1:40 PM ➔ 2:00 PM
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Return Leg 1</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">
                      From Teppakulam (college): 1.40 PM to Mattuthavani: 2.00 PM
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Shared auto ride through Kamarajar Salai and bypass towards Mattuthavani transit junction.
                    </p>
                  </div>
                </div>

                {/* Leg 3 Transit Block */}
                <div className="ml-8 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span>Auto 3: Teppakulam ➔ Mattuthavani</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">20 mins</span>
                    <strong className="text-emerald-600 font-bold font-mono">₹20</strong>
                  </div>
                </div>

                {/* Milestone 3 & Leg 4 */}
                <div className="flex items-start gap-3 relative pb-4 border-l-2 border-indigo-300 ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        2:05 PM ➔ 2:20 PM
                      </span>
                      <span className="text-[11px] text-amber-700 font-medium">Return Leg 2</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">
                      From Mattuthavani: 2.05 PM to home: 2.20 PM
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      5-minute transfer buffer at Mattuthavani (2:00 PM - 2:05 PM), boarding final auto to Othakadai.
                    </p>
                  </div>
                </div>

                {/* Leg 4 Transit Block */}
                <div className="ml-8 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span>Auto 4: Mattuthavani ➔ Home (Othakadai)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">15 mins</span>
                    <strong className="text-emerald-600 font-bold font-mono">₹20</strong>
                  </div>
                </div>

                {/* Goal Milestone: Arrive Home */}
                <div className="flex items-start gap-3 relative ml-3 pl-5">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                        2:20 PM
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">Journey Completed</span>
                    </div>
                    <h5 className="text-sm font-extrabold text-emerald-950 mt-1 flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-emerald-600" />
                      Arrived at Home (2:20 PM)
                    </h5>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Back safely at 2/126 Rajiv Nagar 2nd St, Thirumohur Road, Othakadai.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Columns: Detailed Sequence Timeline vs. Interactive Transport Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Step-by-Step Sequence Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-blue-600" />
              Detailed Four-Leg Transit Breakdown
            </h3>

            <div className="space-y-4">
              {transportSequenceData.legs.map((leg) => {
                const isForward = leg.direction === 'forward';
                return (
                  <div
                    key={leg.id}
                    onClick={() => setSelectedLegId(leg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedLegId === leg.id
                        ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-400'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isForward ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                        }`}>
                          #{leg.order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isForward ? 'bg-sky-100 text-sky-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {isForward ? 'Morning Inbound' : 'Afternoon Return'}
                            </span>
                            <span className="text-xs text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              🕒 {leg.departureTime} ➔ {leg.arrivalTime} ({leg.duration})
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {leg.from} <span className="text-blue-600 font-bold mx-1">➔</span> {leg.to}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {leg.notes}
                          </p>
                          {leg.milestone && (
                            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-2">
                              ★ Milestone: {leg.milestone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block font-medium">Fare</span>
                        <span className="text-lg font-black text-emerald-600 font-['Outfit',sans-serif]">
                          ₹{leg.fare}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Auto Rickshaw</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Strip */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-700">
                <span>Forward Subtotal: <strong className="text-blue-700 font-bold">₹{transportSequenceData.forwardTotal}</strong> (2 autos)</span>
                <span>•</span>
                <span>Return Subtotal: <strong className="text-blue-700 font-bold">₹{transportSequenceData.returnTotal}</strong> (2 autos)</span>
              </div>
              <div className="text-slate-900 font-extrabold text-sm">
                Daily Total: <span className="text-emerald-600">₹{transportSequenceData.dailyTotal}</span>
              </div>
            </div>
          </div>

          {/* Key Checkpoints in Madurai */}
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Transit Checkpoints & Address Anchors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Origin / Residence</span>
                <strong className="text-slate-900 text-sm block mt-0.5">Othakadai</strong>
                <p className="text-slate-600 text-[11px] mt-1">
                  2/126 Rajiv nagar 2nd St, Thirumohur Road, Madurai 625 107
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Transit Hub (Junction)</span>
                <strong className="text-slate-900 text-sm block mt-0.5">Mattuthavani</strong>
                <p className="text-slate-600 text-[11px] mt-1">
                  M.G.R. Integrated Bus Stand & Auto Stand Junction, Madurai
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Destination Point</span>
                <strong className="text-slate-900 text-sm block mt-0.5">Teppakulam</strong>
                <p className="text-slate-600 text-[11px] mt-1">
                  Thiagarajar College Campus, Kamarajar Salai, Madurai 625 009
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Budget & Expense Calculator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              Transport Expense Calculator
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Project transport budget for <strong>Nagasri S</strong> based on college working days.
            </p>

            {/* Slider / Counter for Monthly Days */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 mb-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>College Working Days / Month:</span>
                <span className="text-sm font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {collegeDaysPerMonth} Days
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="26"
                id="input-college-days-slider"
                value={collegeDaysPerMonth}
                onChange={(e) => setCollegeDaysPerMonth(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10 Days (Min)</span>
                <span>22 Days (Standard)</span>
                <span>26 Days (Full)</span>
              </div>
            </div>

            {/* Expense Projections Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block">Daily Expense</span>
                  <span className="text-[11px] text-slate-500">4 legs × ₹20</span>
                </div>
                <span className="text-base font-black text-slate-900 font-mono">
                  ₹{dailyCost}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block">Weekly Expense (5 Days)</span>
                  <span className="text-[11px] text-slate-500">5 college days</span>
                </div>
                <span className="text-base font-black text-slate-900 font-mono">
                  ₹{weeklyCost}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">Monthly Expense ({collegeDaysPerMonth} Days)</span>
                  <span className="text-[11px] text-blue-600">Calculated based on active days</span>
                </div>
                <span className="text-lg font-black text-blue-700 font-mono">
                  ₹{monthlyCost.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block">Per Semester (~90 Days)</span>
                  <span className="text-[11px] text-slate-500">1 Academic Term</span>
                </div>
                <span className="text-base font-black text-slate-900 font-mono">
                  ₹{semesterCost.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                <div>
                  <span className="font-bold text-indigo-950 block">Cumulative 2 Years (~360 Days)</span>
                  <span className="text-[11px] text-indigo-700">4 Completed Semesters Total</span>
                </div>
                <span className="text-lg font-black text-indigo-700 font-mono">
                  ₹{twoYearsCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Travel Mode Verification Badge */}
            <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Verified Fare & Route Schedule:</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Consistent flat-rate auto fare of ₹20 per intermediate leg in Madurai city transit corridors. Total daily cost is exactly ₹80.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
