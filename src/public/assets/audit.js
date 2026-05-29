document.addEventListener('DOMContentLoaded', async () => {
  if (!window.crmApp.requireAuth()) return;
  window.crmApp.loadUserProfile();
  document.querySelector('[data-testid="logout"]').addEventListener('click', window.crmApp.logout);

  const activityFeed = document.querySelector('[data-testid="audit-list"]');
  const loadingMessage = document.querySelector('[data-testid="audit-loading"]');

  async function loadAudit() {
    const response = await window.crmApp.apiFetch('/api/audit-logs');
    if (!response.ok) {
      activityFeed.innerHTML = '<li>Unable to load activity logs.</li>';
      return;
    }
    const logs = await response.json();
    if (!logs.length) {
      activityFeed.innerHTML = '<li>No audit events captured yet.</li>';
      return;
    }
    activityFeed.innerHTML = logs
      .map(
        (entry) => `
        <li class="activity-card">
          <div class="activity-meta"><strong>${entry.action}</strong> • ${new Date(entry.timestamp).toLocaleString()}</div>
          <p>${entry.details}</p>
        </li>`
      )
      .join('');
  }

  await loadAudit();
  loadingMessage.style.display = 'none';
});
