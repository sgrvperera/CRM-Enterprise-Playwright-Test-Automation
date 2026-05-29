window.crmApp = (function () {
  const tokenKey = 'token';

  function getToken() {
    return localStorage.getItem(tokenKey);
  }

  function getHeaders({ json = true, extra = {} } = {}) {
    const headers = { ...extra };
    if (json) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  function requireAuth() {
    if (!getToken()) {
      location.href = '/';
      return false;
    }
    return true;
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    location.href = '/';
  }

  async function apiFetch(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: getHeaders({ json: options.body !== undefined, extra: options.headers }),
    });
    if (response.status === 401 || response.status === 403) {
      if (window.location.pathname !== '/unauthorized.html') {
        location.href = '/unauthorized.html';
      }
    }
    return response;
  }

  async function loadUserProfile() {
    try {
      const response = await fetch('/api/me', { headers: getHeaders({ json: false }) });
      if (!response.ok) return;
      const profile = await response.json();
      const label = document.querySelector('[data-testid="current-user"]');
      if (label) {
        label.textContent = `${profile.name} • ${profile.role}`;
      }
    } catch (error) {
      console.warn('Unable to load current user', error);
    }
  }

  return {
    getToken,
    requireAuth,
    logout,
    apiFetch,
    loadUserProfile,
  };
})();
