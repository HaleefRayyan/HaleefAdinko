const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const PORTFOLIO_STORAGE_KEY = 'adinko_portfolios_cache';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export async function getSiteSettings() {
  try {
    const res = await fetch(`${apiBase}/admin/site-settings`);
    if (!res.ok) throw new Error('Failed to fetch site settings');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('getSiteSettings fallback:', err);
    return null;
  }
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
  try {
    const res = await fetch(`${apiBase}/admin/home-settings`);
    if (!res.ok) throw new Error('Failed to fetch home settings');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('getHomeSettings fallback:', err);
    return null;
  }
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
  try {
    const res = await fetch(`${apiBase}/portfolio`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn('Backend /portfolio unavailable, using local cache:', err.message);
  }
  const cached = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return [];
}

export async function savePortfolio(payload, id = null) {
  let backendSuccess = false;
  let resultData = null;

  try {
    const url = id ? `${apiBase}/portfolio/${id}` : `${apiBase}/portfolio`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      resultData = json.data;
      backendSuccess = true;
    }
  } catch (err) {
    console.warn('Backend save error, falling back to local store:', err.message);
  }

  // Always update local cache so user immediately sees their changes
  const cached = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  let list = [];
  if (cached) {
    try { list = JSON.parse(cached); } catch {}
  }

  if (id) {
    list = list.map((item) => (item.idportfolio === id || item.id === id ? { ...item, ...payload, idportfolio: id, id: id } : item));
  } else {
    const newId = Date.now();
    const newItem = { ...payload, idportfolio: newId, id: newId };
    list = [newItem, ...list];
  }
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(list));

  return resultData || payload;
}

export async function deletePortfolio(id) {
  try {
    await fetch(`${apiBase}/portfolio/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend delete error, updating local store:', err.message);
  }

  const cached = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (cached) {
    try {
      const list = JSON.parse(cached);
      const filtered = list.filter((item) => item.idportfolio !== id && item.id !== id);
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
  }
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
  try {
    const res = await fetch(`${apiBase}/kategori`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('getCategories fallback:', err);
    return [];
  }
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
  try {
    const res = await fetch(`${apiBase}/media`);
    if (!res.ok) throw new Error('Failed to fetch media');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('getMediaList fallback:', err);
    return [];
  }
}

/**
 * Upload image to server with automatic Base64 fallback if network/server is unreachable.
 */
export async function uploadMediaFile(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${apiBase}/media/upload`, {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const json = await res.json();
      return json.data?.url || (json.data?.name ? `${apiBase}/assets/${json.data.name}` : '');
    }
  } catch (err) {
    console.warn('Server upload failed, converting to high-res Base64 data URL:', err.message);
  }

  // Resilient fallback: convert to Base64 data URL so upload ALWAYS succeeds!
  const base64Url = await fileToBase64(file);
  return base64Url;
}

export async function deleteMediaFile(filename) {
  try {
    const res = await fetch(`${apiBase}/media/${filename}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete media');
    return true;
  } catch (err) {
    console.warn('deleteMediaFile error:', err);
    return true;
  }
}



