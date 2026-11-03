import { Router } from 'express';
import { getDb, saveDb } from '../services/db.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusConnect API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Profile / Current User
router.get('/profile', (req, res) => {
  const db = getDb();
  res.json(db.currentUser || null);
});

// Mock Auth Login
router.post('/auth/login', (req, res) => {
  const { email, name, department, semester } = req.body;
  const db = getDb();
  
  if (email) {
    const updatedUser = {
      ...db.currentUser,
      email,
      name: name || email.split('@')[0],
      department: department || db.currentUser.department,
      semester: semester || db.currentUser.semester
    };
    db.currentUser = updatedUser;
    saveDb(db);
    return res.json({ success: true, user: updatedUser });
  }

  res.status(400).json({ error: 'Valid email is required' });
});

// --- Announcements ---
router.get('/announcements', (req, res) => {
  const db = getDb();
  res.json(db.announcements || []);
});

router.post('/announcements', (req, res) => {
  const { title, category, summary, priority, author } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const db = getDb();
  const newNotice = {
    id: `anc_${Date.now()}`,
    title,
    category,
    priority: priority || 'normal',
    date: new Date().toISOString().split('T')[0],
    author: author || 'Department Notice Board',
    summary: summary || '',
    fileUrl: '#',
    pinned: false
  };

  db.announcements.unshift(newNotice);
  saveDb(db);
  res.status(201).json(newNotice);
});

// --- Study Resources (Notes & PYQs Vault) ---
router.get('/resources', (req, res) => {
  const { search, department, semester, type } = req.query;
  const db = getDb();
  let list = db.resources || [];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.courseCode.toLowerCase().includes(q) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (department && department !== 'All') {
    list = list.filter(r => r.department === department);
  }

  if (semester && semester !== 'All') {
    list = list.filter(r => String(r.semester) === String(semester));
  }

  if (type && type !== 'All') {
    list = list.filter(r => r.type === type);
  }

  res.json(list);
});

router.post('/resources', (req, res) => {
  const { title, courseCode, department, semester, type, tags, size } = req.body;
  if (!title || !courseCode || !department) {
    return res.status(400).json({ error: 'Title, course code and department are required' });
  }

  const db = getDb();
  const newResource = {
    id: `res_${Date.now()}`,
    title,
    courseCode: courseCode.toUpperCase(),
    department,
    semester: Number(semester) || 1,
    type: type || 'Lecture Notes',
    format: 'PDF',
    size: size || '4.2 MB',
    author: db.currentUser?.name || 'Verified Student',
    upvotes: 1,
    downloads: 0,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Study Material']),
    uploadDate: new Date().toISOString().split('T')[0],
    verified: true,
    previewUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
  };

  db.resources.unshift(newResource);
  saveDb(db);
  res.status(201).json(newResource);
});

router.post('/resources/:id/upvote', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const resource = db.resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  resource.upvotes = (resource.upvotes || 0) + 1;
  saveDb(db);
  res.json({ id: resource.id, upvotes: resource.upvotes });
});

// --- Campus Events ---
router.get('/events', (req, res) => {
  const db = getDb();
  res.json(db.events || []);
});

router.post('/events', (req, res) => {
  const { title, category, date, time, venue, organizer, description, capacity } = req.body;
  if (!title || !category || !venue) {
    return res.status(400).json({ error: 'Title, category and venue are required' });
  }

  const db = getDb();
  const newEvent = {
    id: `evt_${Date.now()}`,
    title,
    category: category || 'Campus Activity',
    date: date || 'Upcoming',
    time: time || 'TBD',
    venue,
    organizer: organizer || db.currentUser?.name || 'Student Society',
    description: description || '',
    capacity: Number(capacity) || 100,
    attendeesCount: 1,
    isRegistered: true,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    tags: ['Campus', 'Community']
  };

  db.events.unshift(newEvent);
  saveDb(db);
  res.status(201).json(newEvent);
});

router.post('/events/:id/rsvp', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const event = db.events.find(e => e.id === id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  event.isRegistered = !event.isRegistered;
  if (event.isRegistered) {
    event.attendeesCount = (event.attendeesCount || 0) + 1;
  } else {
    event.attendeesCount = Math.max(0, (event.attendeesCount || 1) - 1);
  }

  saveDb(db);
  res.json({ id: event.id, isRegistered: event.isRegistered, attendeesCount: event.attendeesCount });
});

// --- Student Tasks & Assignments ---
router.get('/tasks', (req, res) => {
  const db = getDb();
  res.json(db.tasks || []);
});

router.post('/tasks', (req, res) => {
  const { title, course, deadline, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const db = getDb();
  const newTask = {
    id: `tsk_${Date.now()}`,
    title,
    course: course || 'General',
    deadline: deadline || 'This Week',
    completed: false,
    priority: priority || 'medium'
  };

  db.tasks.unshift(newTask);
  saveDb(db);
  res.status(201).json(newTask);
});

router.patch('/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const task = db.tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = !task.completed;
  saveDb(db);
  res.json(task);
});

router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.tasks.findIndex(t => t.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const removed = db.tasks.splice(idx, 1);
  saveDb(db);
  res.json({ success: true, removed: removed[0] });
});

// --- Peer Forum / Senior Connect ---
router.get('/forum', (req, res) => {
  const db = getDb();
  res.json(db.forumPosts || []);
});

router.post('/forum', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const db = getDb();
  const newPost = {
    id: `frm_${Date.now()}`,
    author: db.currentUser?.name || 'Anonymous Student',
    department: `${db.currentUser?.department?.split(' ')[0] || 'Eng'}, ${db.currentUser?.semester || 'Sem 6'}`,
    title,
    content,
    category: category || 'Campus Life',
    upvotes: 1,
    date: 'Just now',
    replies: []
  };

  db.forumPosts.unshift(newPost);
  saveDb(db);
  res.status(201).json(newPost);
});

router.post('/forum/:id/upvote', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const post = db.forumPosts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.upvotes = (post.upvotes || 0) + 1;
  saveDb(db);
  res.json({ id: post.id, upvotes: post.upvotes });
});

router.post('/forum/:id/reply', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Reply content is required' });
  }

  const db = getDb();
  const post = db.forumPosts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const reply = {
    id: `rep_${Date.now()}`,
    author: db.currentUser?.name || 'Alex Morgan',
    content,
    date: 'Just now'
  };

  if (!post.replies) post.replies = [];
  post.replies.push(reply);
  saveDb(db);
  res.status(201).json(reply);
});

// --- Campus Clubs ---
router.get('/clubs', (req, res) => {
  const db = getDb();
  res.json(db.clubs || []);
});

router.post('/clubs/:id/toggle', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const club = db.clubs.find(c => c.id === id);

  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }

  club.joined = !club.joined;
  club.membersCount = club.joined ? club.membersCount + 1 : Math.max(0, club.membersCount - 1);
  saveDb(db);
  res.json({ id: club.id, joined: club.joined, membersCount: club.membersCount });
});

export default router;

