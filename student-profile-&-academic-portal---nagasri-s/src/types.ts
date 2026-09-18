export interface Subject {
  code: string;
  name: string;
  internal: string; // e.g. "23/25"
  internalMarks: number;
  internalMax: number;
  external: string; // e.g. "47/75"
  externalMarks: number;
  externalMax: number;
  final: string; // e.g. "70/100"
  finalMarks: number;
  finalMax: number;
  gradePoint: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  credit: number;
  resultStatus: 'Pass' | 'Fail';
  type: 'Theory' | 'Practical' | 'Core' | 'Allied' | 'Language' | 'NSS/Extension';
}

export interface SemesterData {
  semesterNumber: number;
  semesterName: string;
  examSession: string; // e.g. "Nov-2024"
  academicYear: string; // e.g. "Year 1 - 2024-2025"
  creditsRegistered: number;
  creditsCompleted: number;
  subjects: Subject[];
  sgpa: number;
  totalMarksObtained: number;
  totalMarksMax: number;
  percentage: number;
}

export interface StudentProfile {
  name: string;
  regNo: string;
  degree: string;
  program: string;
  gender: string;
  college: string;
  collegeCity: string;
  collegeMotto: string;
  collegeAffiliation: string;
  address: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  email: string;
  academicYearsCompleted: number;
  totalSemesters: number;
  currentStatus: string;
}

export interface TransportLeg {
  id: string;
  order: number;
  from: string;
  to: string;
  vehicle: string;
  fare: number;
  estimatedTime: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  milestone?: string;
  distanceKm: number;
  direction: 'forward' | 'return';
  notes: string;
}

export interface TransportMilestone {
  time: string;
  label: string;
  location: string;
  type: 'departure' | 'transit' | 'arrival' | 'class';
}

export interface ScheduleBlock {
  title: string;
  direction: 'forward' | 'return';
  startTime: string;
  endTime: string;
  classMilestone: string;
  legs: TransportLeg[];
  milestones: TransportMilestone[];
}

export interface TransportSequence {
  dailyTotal: number;
  forwardTotal: number;
  returnTotal: number;
  legs: TransportLeg[];
  homeAddress: string;
  collegeAddress: string;
  transitHub: string;
  morningSchedule: ScheduleBlock;
  afternoonSchedule: ScheduleBlock;
}
