import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  FileText, 
  Clock, 
  Users, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  GraduationCap,
  Download
} from 'lucide-react';

export default function HeroBanner({ 
  user, 
  setActiveTab, 
  onOpenUpload, 
  stats = { students: '3,450+', resources: '1,280+', clubs: '42', events: '18+' } 
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
      {/* Decorative background grid and blur glows */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-24 right-10 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-navy-600/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        
        {/* Top University Pill */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span>Spring Semester 2026 Active</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Welcome back, <strong className="text-white">{user?.name || "Student"}</strong> ({user?.department || "Computer Science"})</span>
          </div>
        </div>

        {/* Main Banner Heading & Tagline */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
            Campus<span className="text-brand-400">Connect</span>
          </h1>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-brand-200 tracking-tight">
            Your College, Your Community.
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            The student-developed unified platform to access verified academic notes, past year exam papers (PYQs), track semester deadlines, discover upcoming fests & hackathons, and stay synced with official college announcements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('vault')}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Browse Study Vault & PYQs</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-white font-semibold text-sm border border-navy-700 hover:border-brand-400/50 transition-all transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Discover Events & Fests</span>
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-navy-800/40 hover:bg-navy-800 text-slate-200 font-semibold text-sm border border-navy-700/60 transition-colors"
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Assignments & Schedule</span>
          </button>
        </div>

        {/* Live Campus Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 bg-navy-900/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-navy-800/90 shadow-xl">
          
          <div className="flex items-center space-x-3.5 p-2">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-display">{stats.students}</p>
              <p className="text-xs text-slate-300 font-medium">Active Students</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-display">{stats.resources}</p>
              <p className="text-xs text-slate-300 font-medium">Notes & Past Papers</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-display">{stats.clubs}</p>
              <p className="text-xs text-slate-300 font-medium">Clubs & Societies</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-display">{stats.events}</p>
              <p className="text-xs text-slate-300 font-medium">Events Scheduled</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

