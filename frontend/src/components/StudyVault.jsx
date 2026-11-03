import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  ThumbsUp, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Sparkles,
  Tag,
  ArrowUpDown,
  BookCheck
} from 'lucide-react';

export default function StudyVault({ 
  resources = [], 
  onUpvote, 
  onOpenUpload, 
  onPreview 
}) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);

  const departments = ['All', 'Computer Science', 'Artificial Intelligence', 'Electronics & Comm.', 'Basic Sciences'];
  const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];
  const resourceTypes = ['All', 'Lecture Notes', 'Past Papers (PYQ)', 'Formula Sheet', 'Lab Manual'];

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      (res.tags && res.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    const matchesDept = selectedDept === 'All' || res.department === selectedDept;
    const matchesSem = selectedSem === 'All' || String(res.semester) === String(selectedSem);
    const matchesType = selectedType === 'All' || res.type === selectedType;

    return matchesSearch && matchesDept && matchesSem && matchesType;
  });

  const handleDownload = (res) => {
    setDownloadingId(res.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Trigger a simulated browser download
      const element = document.createElement("a");
      const file = new Blob([
        `CampusConnect Verified Academic Document\n\nTitle: ${res.title}\nCourse: ${res.courseCode}\nDepartment: ${res.department}\nUploaded By: ${res.author}\nDate: ${res.uploadDate}\n\nContents verified by Academic Council.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${res.courseCode}_${res.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <BookCheck className="w-4 h-4" />
            <span>Academic Resource Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display">
            Study Notes & Past Year Questions (PYQs)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Semester-wise verified lecture notes, solved papers, lab manuals, and formula sheets shared by top students & faculty.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-md hover:shadow-navy-900/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-brand-400 stroke-[3]" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Course Code (e.g. CS301, MA201), topic (e.g. Trees, SQL, Deadlocks)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-navy-950 placeholder:text-slate-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Semester
            </label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Semesters' : `Semester ${s}`}</option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {resourceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Results Count & Quick Tags */}
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <p>Showing <strong className="text-navy-950 font-bold">{filteredResources.length}</strong> resources</p>
        <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
          ✓ Verified by Academic Cell
        </span>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">No matching study materials found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter criteria. Be the first to upload material for this course!
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-4 px-4 py-2 bg-brand-500 text-navy-950 font-bold rounded-lg text-xs"
          >
            Upload Notes Now
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const isDownloading = downloadingId === res.id;
            return (
              <div 
                key={res.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-card hover:border-brand-300/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-navy-900 text-brand-300 tracking-wide">
                      {res.courseCode}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      res.type === 'Past Papers (PYQ)' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : res.type === 'Lab Manual'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-brand-50 text-brand-700 border border-brand-200'
                    }`}>
                      {res.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-navy-950 text-sm group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                    {res.title}
                  </h3>

                  {/* Dept & Semester */}
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                    <span>{res.department}</span>
                    <span>•</span>
                    <span>Sem {res.semester}</span>
                    <span>•</span>
                    <span>{res.size}</span>
                  </div>

                  {/* Topic Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {res.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author / Date */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[140px] font-medium">By {res.author}</span>
                    <span className="text-slate-400">{res.uploadDate}</span>
                  </div>

                </div>

                {/* Bottom Interactive Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* Upvote */}
                  <button
                    onClick={() => onUpvote(res.id)}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors text-xs font-semibold"
                    title="Upvote this helpful resource"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-brand-500" />
                    <span>{res.upvotes}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    
                    {/* Preview Modal Trigger */}
                    <button
                      onClick={() => onPreview(res)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(res)}
                      disabled={isDownloading}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-brand-500 hover:text-navy-950 text-white text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}

