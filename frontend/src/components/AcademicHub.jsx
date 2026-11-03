import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calculator, 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function AcademicHub({ 
  tasks = [], 
  onToggleTask, 
  onDeleteTask, 
  onAddTask 
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS301');
  const [newDeadline, setNewDeadline] = useState('This Friday, 5 PM');
  const [newPriority, setNewPriority] = useState('medium');

  // Attendance Calculator State
  const [attendedClasses, setAttendedClasses] = useState(42);
  const [totalClasses, setTotalClasses] = useState(48);
  const [requiredPercent, setRequiredPercent] = useState(75);

  // Today's schedule data
  const todayClasses = [
    { time: '09:00 - 10:15 AM', code: 'CS301', subject: 'Data Structures & Algorithms', room: 'Hall 302', faculty: 'Prof. Ramanujan', active: false },
    { time: '10:30 - 11:45 AM', code: 'CS304', subject: 'Database Management Systems', room: 'Lab 2', faculty: 'Dr. Sarah Connor', active: true },
    { time: '01:30 - 03:00 PM', code: 'CS302', subject: 'Operating Systems Lab', room: 'Advanced Computing Lab', faculty: 'Sarah Jenkins (TA)', active: false },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      course: newCourse,
      deadline: newDeadline,
      priority: newPriority,
    });
    setNewTitle('');
  };

  // Calculate attendance bunker status
  const currentPercent = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(1) : 0;
  
  let attendanceMessage = '';
  let canBunk = 0;
  let mustAttend = 0;

  if (currentPercent >= requiredPercent) {
    // How many can bunk: (attended / (total + x)) >= requiredPercent/100 => attended / 0.75 - total >= x
    canBunk = Math.floor((attendedClasses * 100) / requiredPercent - totalClasses);
    attendanceMessage = canBunk > 0 
      ? `🎉 Safe Zone! You can miss ${canBunk} upcoming class${canBunk > 1 ? 'es' : ''} and still maintain ${requiredPercent}% attendance.`
      : `⚠️ Right on the threshold! Attending every upcoming class is recommended.`;
  } else {
    // How many must attend: (attended + x) / (total + x) >= requiredPercent/100
    // (attended + x) >= 0.75 * total + 0.75 * x
    // 0.25 * x >= 0.75 * total - attended
    const needed = (requiredPercent / 100) * totalClasses - attendedClasses;
    const denominator = 1 - (requiredPercent / 100);
    mustAttend = Math.ceil(needed / denominator);
    attendanceMessage = `🚨 Below 75%! You need to attend the next ${mustAttend} class${mustAttend > 1 ? 'es' : ''} continuously to reach ${requiredPercent}%.`;
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <Clock className="w-4 h-4" />
          <span>Student Productivity Suite</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display">
          Academic Activity & Attendance Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Keep track of assignment deadlines, check your daily lectures timetable, and monitor the 75% attendance criteria.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide on desktop): Assignments & Daily Timetable */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Timetable */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-navy-950 text-base">Today's Lecture Schedule</h3>
              </div>
              <span className="text-xs bg-navy-100 text-navy-900 font-bold px-3 py-1 rounded-full">
                Semester 6 - CSE
              </span>
            </div>

            <div className="space-y-3">
              {todayClasses.map((cls, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    cls.active 
                      ? 'bg-brand-50/70 border-brand-300 ring-1 ring-brand-400' 
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="px-2.5 py-1 rounded bg-navy-900 text-brand-300 text-xs font-bold shrink-0 mt-0.5">
                      {cls.code}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-navy-950 text-sm">{cls.subject}</p>
                        {cls.active && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white animate-pulse">
                            <span>Happening Now</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cls.faculty} • <strong className="text-slate-700">{cls.room}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 sm:text-right shrink-0">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    <span>{cls.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments & Deadlines Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-navy-950 text-base">Assignment & Submission Tracker</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {tasks.filter(t => !t.completed).length} Pending
              </span>
            </div>

            {/* Quick Add Assignment Form */}
            <form onSubmit={handleCreateTask} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Add New Assignment</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title (e.g. Lab 4 BST, Math HW)" 
                  className="sm:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
                <input 
                  type="text" 
                  value={newCourse} 
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Course (e.g. CS301)" 
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input 
                    type="text" 
                    value={newDeadline} 
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="Deadline" 
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-44"
                  />
                  <select 
                    value={newPriority} 
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-1.5 bg-navy-900 hover:bg-brand-500 hover:text-navy-950 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  + Add Assignment
                </button>
              </div>
            </form>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">All assignments completed! Enjoy your day 🎉</p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      task.completed 
                        ? 'bg-slate-50 border-slate-200 opacity-60' 
                        : 'bg-white border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => onToggleTask(task.id)}
                        className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {task.course}
                          </span>
                          <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-navy-950'}`}>
                            {task.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Due: {task.deadline}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority}
                      </span>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column (1 Col wide): Attendance Calculator & Student Tools */}
        <div className="space-y-6">
          
          {/* Attendance Calculator Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-brand-600" />
              <h3 className="font-extrabold text-navy-950 text-base">75% Attendance Calculator</h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Find out how many classes you can skip or need to attend to satisfy university exam eligibility criteria.
            </p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Classes Attended</span>
                  <span className="font-bold text-navy-950">{attendedClasses}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={totalClasses} 
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Total Classes Held</span>
                  <span className="font-bold text-navy-950">{totalClasses}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={totalClasses}
                  onChange={(e) => {
                    const newTotal = Number(e.target.value);
                    setTotalClasses(newTotal);
                    if (attendedClasses > newTotal) setAttendedClasses(newTotal);
                  }}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Target Threshold</span>
                  <span className="font-bold text-navy-950">{requiredPercent}%</span>
                </div>
                <div className="flex gap-2">
                  {[75, 80, 85].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setRequiredPercent(pct)}
                      className={`flex-1 py-1 rounded text-xs font-bold ${
                        requiredPercent === pct
                          ? 'bg-navy-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scorecard */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase">Current Attendance</p>
              <p className={`text-3xl font-extrabold mt-1 font-display ${
                Number(currentPercent) >= requiredPercent ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {currentPercent}%
              </p>
              <p className="text-xs mt-2 font-medium leading-relaxed text-slate-700">
                {attendanceMessage}
              </p>
            </div>
          </div>

          {/* Quick Academic Resource Links */}
          <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-2xl p-6 shadow-md border border-navy-800">
            <div className="flex items-center space-x-2 text-brand-300 mb-3">
              <GraduationCap className="w-5 h-5" />
              <h4 className="font-bold text-sm">Exam & Semester Tips</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start space-x-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>Past 5-year solved papers are uploaded in the Study Vault.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>Hall tickets will be verified via QR code this semester.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>Library 3rd floor quiet rooms are now 24/7 open.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}

