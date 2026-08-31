const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getSiteSettings() {
  const res = await fetch(`${apiBase}/admin/site-settings`);
  if (!res.ok) throw new Error('Failed to fetch site settings');
  const json = await res.json();
  return json.data;
}

export async function updateSiteSettings(payload) {
  const res = await fetch(`${apiBase}/admin/site-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  const json = await res.json();
  return json.data;
}

export async function getHomeSettings() {
  const res = await fetch(`${apiBase}/admin/home-settings`);
  if (!res.ok) throw new Error('Failed to fetch home settings');
  const json = await res.json();
  return json.data;
}

export async function updateHomeSettings(payload) {
  const res = await fetch(`${apiBase}/admin/home-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update home settings');
  const json = await res.json();
  return json.data;
}

export async function getPortfolios() {
  const res = await fetch(`${apiBase}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolios');
  const json = await res.json();
  return json.data;
}

export async function savePortfolio(payload, id = null) {
  const url = id ? `${apiBase}/portfolio/${id}` : `${apiBase}/portfolio`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to save portfolio');
  const json = await res.json();
  return json.data;
}

export async function deletePortfolio(id) {
  const res = await fetch(`${apiBase}/portfolio/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete portfolio');
  return true;
}

export async function getTestimonials() {
  const res = await fetch(`${apiBase}/testimoni`);
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  const json = await res.json();
  return json.data;
}

export async function saveTestimoni(payload, id = null) {
  const url = id ? `${apiBase}/testimoni/${id}` : `${apiBase}/testimoni`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to save testimonial');
  const json = await res.json();
  return json.data;
}

export async function deleteTestimoni(id) {
  const res = await fetch(`${apiBase}/testimoni/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete testimonial');
  return true;
}

export async function getCategories() {
  const res = await fetch(`${apiBase}/kategori`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const json = await res.json();
  return json.data;
}

export async function getContacts() {
  const res = await fetch(`${apiBase}/contact`);
  if (!res.ok) throw new Error('Failed to fetch contacts');
  const json = await res.json();
  return json.data;
}

export async function deleteContact(id) {
  const res = await fetch(`${apiBase}/contact/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete contact');
  return true;
}

export async function getMediaList() {
  const res = await fetch(`${apiBase}/media`);
  if (!res.ok) throw new Error('Failed to fetch media');
  const json = await res.json();
  return json.data;
}

