import React from 'react';
import { GraduationCap, Heart, Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-navy-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-navy-950 shadow-md">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white font-display">
                Campus<span className="text-brand-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-brand-300 font-semibold tracking-wide">
              Your College, Your Community.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive student-developed digital ecosystem helping college peers collaborate, excel academically, and discover campus opportunities.
            </p>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('vault')} className="hover:text-brand-300 transition-colors">
                  Study Vault & PYQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-brand-300 transition-colors">
                  Campus Fests & Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('academics')} className="hover:text-brand-300 transition-colors">
                  Assignment & Attendance Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notices')} className="hover:text-brand-300 transition-colors">
                  Examination & Notice Board
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-brand-300 transition-colors">
                  Peer Forum & Student Clubs
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Campus Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5">
                <span>Central Library Catalog</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>ERP & Grade Portal</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>Training & Placement Cell</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>Innovation & Incubation Hub</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span>Hostel & Mess Grievances</span>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Emergency & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Campus Control Room: <strong>+1 (800) 555-CAMPUS</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Academic Helpdesk: <strong>support@campusconnect.edu</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Women's Safety & Counseling 24/7</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. Built with modern React & Node.js for university students.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by student developers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

