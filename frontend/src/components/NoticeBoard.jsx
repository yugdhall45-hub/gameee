import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Pin, 
  Calendar, 
  Plus, 
  ExternalLink, 
  Building,
  Bell
} from 'lucide-react';

export default function NoticeBoard({ 
  announcements = [], 
  onOpenCreateNotice 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  const categories = ['All', 'Examination', 'Placements', 'Academic', 'Research'];

  const filtered = selectedCategory === 'All'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Bell className="w-4 h-4" />
            <span>Official University Notices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display">
            Campus Announcements & Circulars
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated with official notifications from the Examination Controller, Training & Placement Cell, Dean's Office, and Departments.
          </p>
        </div>

        <button
          onClick={onOpenCreateNotice}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-md hover:shadow-navy-900/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-brand-400 stroke-[3]" />
          <span>Publish Notice (CR / Admin)</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="mt-6 space-y-4">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-card transition-all ${
              item.pinned ? 'border-brand-300 ring-1 ring-brand-400/40' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                {item.pinned && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Pin className="w-3 h-3 rotate-45" />
                    <span>Pinned Announcement</span>
                  </span>
                )}
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.priority === 'urgent' 
                    ? 'bg-rose-100 text-rose-700' 
                    : item.priority === 'high'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-brand-100 text-brand-700'
                }`}>
                  {item.category}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-navy-950 mt-1">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {item.summary}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                <Building className="w-3.5 h-3.5 text-brand-600" />
                <span>Issued by: <strong className="text-navy-900">{item.author}</strong></span>
              </div>

              <button
                onClick={() => setActiveNoticeModal(item)}
                className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                <span>Read Full Circular</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full circular preview */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-100 text-brand-800">
                {activeNoticeModal.category}
              </span>
              <span className="text-xs text-slate-400">{activeNoticeModal.date}</span>
            </div>

            <h3 className="text-lg font-bold text-navy-950">{activeNoticeModal.title}</h3>
            
            <p className="text-xs text-slate-500 mt-1">
              Authorized Authority: <strong className="text-slate-700">{activeNoticeModal.author}</strong>
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{activeNoticeModal.summary}</p>
              <p className="text-xs text-slate-500 border-t border-slate-200 pt-2">
                All concerned heads of departments and student representatives are advised to ensure compliance. For clarification, email <strong className="text-navy-900">academic-helpdesk@university.edu</strong>.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

