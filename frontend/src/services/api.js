const BASE_URL = '/api';

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchAnnouncements() {
  const res = await fetch(`${BASE_URL}/announcements`);
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}

export async function createAnnouncement(data) {
  const res = await fetch(`${BASE_URL}/announcements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create announcement');
  return res.json();
}

export async function fetchResources(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.department) query.set('department', params.department);
  if (params.semester) query.set('semester', params.semester);
  if (params.type) query.set('type', params.type);

  const res = await fetch(`${BASE_URL}/resources?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function createResource(data) {
  const res = await fetch(`${BASE_URL}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to upload resource');
  return res.json();
}

export async function upvoteResource(id) {
  const res = await fetch(`${BASE_URL}/resources/${id}/upvote`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to upvote resource');
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function createEvent(data) {
  const res = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function toggleEventRSVP(id) {
  const res = await fetch(`${BASE_URL}/events/${id}/rsvp`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to RSVP');
  return res.json();
}

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function toggleTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function fetchForumPosts() {
  const res = await fetch(`${BASE_URL}/forum`);
  if (!res.ok) throw new Error('Failed to fetch forum posts');
  return res.json();
}

export async function createForumPost(data) {
  const res = await fetch(`${BASE_URL}/forum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function upvoteForumPost(id) {
  const res = await fetch(`${BASE_URL}/forum/${id}/upvote`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to upvote post');
  return res.json();
}

export async function addForumReply(postId, content) {
  const res = await fetch(`${BASE_URL}/forum/${postId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to add reply');
  return res.json();
}

export async function fetchClubs() {
  const res = await fetch(`${BASE_URL}/clubs`);
  if (!res.ok) throw new Error('Failed to fetch clubs');
  return res.json();
}

export async function toggleClubJoin(id) {
  const res = await fetch(`${BASE_URL}/clubs/${id}/toggle`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle club join');
  return res.json();
}

