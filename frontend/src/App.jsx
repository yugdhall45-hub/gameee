import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StudyVault from './components/StudyVault';
import CampusEvents from './components/CampusEvents';
import AcademicHub from './components/AcademicHub';
import NoticeBoard from './components/NoticeBoard';
import CommunityAndClubs from './components/CommunityAndClubs';
import Footer from './components/Footer';
import { 
  UploadModal, 
  CreateEventModal, 
  CreateNoticeModal, 
  CreatePostModal, 
  PreviewDocModal, 
  ProfileModal 
} from './components/Modals';

import { 
  fetchProfile,
  fetchAnnouncements,
  createAnnouncement,
  fetchResources,
  createResource,
  upvoteResource,
  fetchEvents,
  createEvent,
  toggleEventRSVP,
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask,
  fetchForumPosts,
  createForumPost,
  upvoteForumPost,
  addForumReply,
  fetchClubs,
  toggleClubJoin,
  loginUser
} from './services/api';

import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Pin, 
  ArrowRight, 
  CheckCircle2, 
  ThumbsUp, 
  Users, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Status feedback toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load initial backend data
  useEffect(() => {
    async function loadData() {
      try {
        const [userData, ancData, resData, evtData, tskData, frmData, clbData] = await Promise.all([
          fetchProfile().catch(() => ({ name: 'Alex Morgan', department: 'Computer Science & Engineering', gpa: '3.84' })),
          fetchAnnouncements().catch(() => []),
          fetchResources().catch(() => []),
          fetchEvents().catch(() => []),
          fetchTasks().catch(() => []),
          fetchForumPosts().catch(() => []),
          fetchClubs().catch(() => []),
        ]);

        setUser(userData);
        setAnnouncements(ancData);
        setResources(resData);
        setEvents(evtData);
        setTasks(tskData);
        setForumPosts(frmData);
        setClubs(clbData);
      } catch (err) {
        console.error('Data loading error:', err);
      }
    }
    loadData();
  }, []);

  // Handlers for resources
  const handleUpvoteResource = async (id) => {
    try {
      const updated = await upvoteResource(id);
      setResources(prev => prev.map(r => r.id === id ? { ...r, upvotes: updated.upvotes } : r));
      showToast('👍 Upvote recorded!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadResource = async (data) => {
    try {
      const created = await createResource(data);
      setResources(prev => [created, ...prev]);
      showToast('🎉 Study material uploaded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for events
  const handleToggleRSVP = async (id) => {
    try {
      const updated = await toggleEventRSVP(id);
      setEvents(prev => prev.map(e => e.id === id ? { 
        ...e, 
        isRegistered: updated.isRegistered, 
        attendeesCount: updated.attendeesCount 
      } : e));
      showToast(updated.isRegistered ? '🎟️ RSVP Confirmed! Added to your schedule.' : 'RSVP cancelled.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (data) => {
    try {
      const created = await createEvent(data);
      setEvents(prev => [created, ...prev]);
      showToast('🚀 Event published to campus directory!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for announcements
  const handleCreateNotice = async (data) => {
    try {
      const created = await createAnnouncement(data);
      setAnnouncements(prev => [created, ...prev]);
      showToast('📢 Announcement published to Notice Board!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for tasks
  const handleToggleTask = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast('Task removed.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (data) => {
    try {
      const created = await createTask(data);
      setTasks(prev => [created, ...prev]);
      showToast('✅ Assignment added to tracker!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for forum
  const handleCreatePost = async (data) => {
    try {
      const created = await createForumPost(data);
      setForumPosts(prev => [created, ...prev]);
      showToast('💬 Question posted to Peer Community!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvotePost = async (id) => {
    try {
      const updated = await upvoteForumPost(id);
      setForumPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: updated.upvotes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (postId, content) => {
    try {
      const reply = await addForumReply(postId, content);
      setForumPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, replies: [...(p.replies || []), reply] };
        }
        return p;
      }));
      showToast('Response submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for clubs
  const handleToggleClub = async (id) => {
    try {
      const updated = await toggleClubJoin(id);
      setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: updated.joined, membersCount: updated.membersCount } : c));
      showToast(updated.joined ? '🎉 Welcome to the club!' : 'Left club.');
    } catch (err) {
      console.error(err);
    }
  };

  // Save profile
  const handleSaveProfile = async (data) => {
    try {
      const res = await loginUser(data);
      setUser(res.user);
      showToast('Profile updated!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy-950 text-brand-300 font-bold text-xs px-4 py-3 rounded-xl shadow-2xl border border-navy-800 flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        announcements={announcements}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Render Active View */}
        {activeTab === 'overview' && (
          <div>
            <HeroBanner 
              user={user}
              setActiveTab={setActiveTab}
              onOpenUpload={() => setIsUploadOpen(true)}
              stats={{
                students: '3,450+',
                resources: `${resources.length * 120 || 1280}+`,
                clubs: `${clubs.length || 42}`,
                events: `${events.length || 18}+`
              }}
            />

            {/* Pinned Urgent Notice Alert */}
            {announcements.find(a => a.pinned || a.priority === 'urgent') && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-navy-950 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-navy-950/15 rounded-xl">
                      <Pin className="w-5 h-5 text-navy-950 rotate-45" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-navy-950 text-amber-300">
                        Urgent Notice
                      </span>
                      <p className="font-extrabold text-sm sm:text-base mt-0.5">
                        {announcements.find(a => a.pinned || a.priority === 'urgent')?.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="self-start sm:self-auto px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View Circular →
                  </button>
                </div>
              </div>
            )}

            {/* Quick Section Highlights on Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
              
              {/* Highlight 1: Trending in Study Vault */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 font-display">
                      Popular Course Materials & PYQs
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Most upvoted study notes this semester</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('vault')}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>Explore All Notes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {resources.slice(0, 3).map((res) => (
                    <div 
                      key={res.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-card hover:border-brand-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-navy-900 text-brand-300">
                            {res.courseCode}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Sem {res.semester}
                          </span>
                        </div>
                        <h4 className="font-bold text-navy-950 text-sm line-clamp-2 mt-2">{res.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{res.department} • {res.type}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleUpvoteResource(res.id)}
                          className="flex items-center space-x-1 text-xs text-slate-600 hover:text-brand-600 font-semibold"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-brand-500" />
                          <span>{res.upvotes}</span>
                        </button>
                        <button
                          onClick={() => setPreviewResource(res)}
                          className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold hover:bg-brand-500 hover:text-navy-950 transition-colors"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight 2: Upcoming Events & Hackathons */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 font-display">
                      Happening On Campus
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Workshops, competitions, and college fests</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>View Calendar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.slice(0, 2).map((evt) => (
                    <div 
                      key={evt.id} 
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-40 bg-navy-900">
                        <img src={evt.image} alt={evt.title} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent"></div>
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-950/90 text-brand-300">
                          {evt.category}
                        </span>
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-xs font-semibold text-brand-300">{evt.date}</p>
                          <p className="text-sm font-bold text-white line-clamp-1">{evt.title}</p>
                        </div>
                      </div>

                      <div className="p-4 flex items-center justify-between bg-slate-50">
                        <span className="text-xs text-slate-500 font-medium">
                          {evt.attendeesCount} Students Attending
                        </span>
                        <button
                          onClick={() => handleToggleRSVP(evt.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            evt.isRegistered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-brand-500 text-navy-950 hover:bg-brand-400'
                          }`}
                        >
                          {evt.isRegistered ? 'RSVP Confirmed ✓' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <StudyVault 
            resources={resources}
            onUpvote={handleUpvoteResource}
            onOpenUpload={() => setIsUploadOpen(true)}
            onPreview={(res) => setPreviewResource(res)}
          />
        )}

        {activeTab === 'events' && (
          <CampusEvents 
            events={events}
            onToggleRSVP={handleToggleRSVP}
            onOpenCreateEvent={() => setIsCreateEventOpen(true)}
          />
        )}

        {activeTab === 'academics' && (
          <AcademicHub 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoard 
            announcements={announcements}
            onOpenCreateNotice={() => setIsCreateNoticeOpen(true)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityAndClubs 
            forumPosts={forumPosts}
            clubs={clubs}
            onUpvotePost={handleUpvotePost}
            onAddReply={handleAddReply}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onToggleClub={handleToggleClub}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Interactive Modals */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadResource}
      />

      <CreateEventModal 
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <CreateNoticeModal 
        isOpen={isCreateNoticeOpen}
        onClose={() => setIsCreateNoticeOpen(false)}
        onSubmit={handleCreateNotice}
      />

      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleCreatePost}
      />

      <PreviewDocModal 
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
      />

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

    </div>
  );
}

