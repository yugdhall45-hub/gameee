import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Bookmark
} from 'lucide-react';

export default function CommunityAndClubs({ 
  forumPosts = [], 
  clubs = [], 
  onUpvotePost, 
  onAddReply, 
  onOpenCreatePost, 
  onToggleClub 
}) {
  const [activeTab, setActiveTab] = useState('forum'); // 'forum' or 'clubs'
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyText, setReplyText] = useState({});

  const handleSendReply = (postId) => {
    const text = replyText[postId]?.trim();
    if (!text) return;
    onAddReply(postId, text);
    setReplyText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Users className="w-4 h-4" />
            <span>Connect, Collaborate & Grow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display">
            Student Community & Campus Clubs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ask academic doubts to seniors, join student-run technical & cultural clubs, and find project collaborators.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'forum'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Peer Doubts & Forum
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'clubs'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Campus Societies & Clubs
          </button>
        </div>
      </div>

      {/* --- FORUM TAB --- */}
      {activeTab === 'forum' && (
        <div className="mt-8 space-y-6">
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Recent Discussions ({forumPosts.length})
            </p>
            <button
              onClick={onOpenCreatePost}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-navy-950 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ask Doubt / Start Thread</span>
            </button>
          </div>

          <div className="space-y-4">
            {forumPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const repliesCount = post.replies ? post.replies.length : 0;

              return (
                <div 
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-card transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center text-navy-800 text-xs font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-navy-950">{post.author}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({post.department})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400">{post.date}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-navy-950 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onUpvotePost(post.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-semibold transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-brand-500" />
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <button
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{repliesCount} {repliesCount === 1 ? 'Reply' : 'Replies'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Replies Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Replies</p>

                      {repliesCount === 0 ? (
                        <p className="text-xs text-slate-400 italic">No replies yet. Be the first senior or peer to answer!</p>
                      ) : (
                        post.replies.map((reply) => (
                          <div key={reply.id} className="p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between text-xs font-semibold text-navy-900 mb-1">
                              <span>{reply.author}</span>
                              <span className="text-[10px] text-slate-400">{reply.date}</span>
                            </div>
                            <p className="text-xs text-slate-600">{reply.content}</p>
                          </div>
                        ))
                      )}

                      {/* Add reply input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText[post.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post.id)}
                          placeholder="Write a helpful response..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <button
                          onClick={() => handleSendReply(post.id)}
                          className="px-3 py-2 bg-navy-900 hover:bg-brand-500 hover:text-navy-950 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* --- CLUBS TAB --- */}
      {activeTab === 'clubs' && (
        <div className="mt-8">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-6">
            Registered Student Societies ({clubs.length})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <div 
                key={club.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {club.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Lead: <strong className="text-slate-700">{club.lead}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-950 mb-2">
                    {club.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span>{club.membersCount} Members</span>
                  </div>

                  <button
                    onClick={() => onToggleClub(club.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      club.joined
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                        : 'bg-navy-900 hover:bg-brand-500 hover:text-navy-950 text-white shadow-sm'
                    }`}
                  >
                    {club.joined ? 'Member ✓' : 'Join Club'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}

