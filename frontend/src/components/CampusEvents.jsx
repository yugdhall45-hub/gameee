import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Share2, 
  Sparkles, 
  Trophy,
  CalendarCheck
} from 'lucide-react';

export default function CampusEvents({ 
  events = [], 
  onToggleRSVP, 
  onOpenCreateEvent 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Tech & Hackathons', 'Cultural & Fests', 'Workshops', 'Sports'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const handleShare = (event) => {
    setCopiedId(event.id);
    navigator.clipboard?.writeText(`${window.location.origin}/#event-${event.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddToCalendar = (event) => {
    // Generate .ics download
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusConnect//Event//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venue}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Trophy className="w-4 h-4" />
            <span>Campus Life & Engagements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display">
            Upcoming Campus Events & Hackathons
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover student fests, coding hackathons, technical workshops, sports tourneys, and guest lectures across colleges.
          </p>
        </div>

        <button
          onClick={onOpenCreateEvent}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-md hover:shadow-navy-900/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-brand-400 stroke-[3]" />
          <span>Post Campus Event</span>
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

      {/* Events Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const percentFilled = Math.min(100, Math.round((evt.attendeesCount / (evt.capacity || 100)) * 100));
          return (
            <div 
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                
                {/* Event Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-navy-900">
                  <img 
                    src={evt.image} 
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-navy-950/80 text-brand-300 backdrop-blur-md border border-navy-700/60">
                    {evt.category}
                  </span>

                  {/* Registered Badge if user RSVP'd */}
                  {evt.isRegistered && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center space-x-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RSVP Confirmed</span>
                    </span>
                  )}

                  {/* Date Strip at bottom of image */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-semibold text-brand-300">{evt.date}</p>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5">
                  <h3 className="font-extrabold text-navy-950 text-base group-hover:text-brand-600 transition-colors leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Meta details (Venue, Time, Club) */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="truncate font-medium">{evt.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>Organized by: <strong className="text-navy-900">{evt.organizer}</strong></span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>{evt.attendeesCount} Attending</span>
                      <span>{evt.capacity ? `${evt.capacity - evt.attendeesCount} seats left` : 'Open'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentFilled > 80 ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      ></div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddToCalendar(evt)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-navy-950 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1"
                    title="Add to Calendar (.ics)"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span className="hidden sm:inline">Add to Cal</span>
                  </button>

                  <button
                    onClick={() => handleShare(evt)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-navy-950 hover:bg-slate-50 text-xs font-semibold"
                    title="Copy Share Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  {copiedId === evt.id && (
                    <span className="text-[10px] text-emerald-600 font-bold">Link Copied!</span>
                  )}
                </div>

                {/* RSVP Toggle Button */}
                <button
                  onClick={() => onToggleRSVP(evt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    evt.isRegistered
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-brand-500 hover:bg-brand-400 text-navy-950 font-extrabold shadow-sm'
                  }`}
                >
                  {evt.isRegistered ? 'Cancel RSVP' : 'Register / RSVP →'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

