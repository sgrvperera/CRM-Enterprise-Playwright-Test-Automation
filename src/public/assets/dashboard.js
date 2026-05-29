document.addEventListener('DOMContentLoaded', async () => {
  if (!window.crmApp.requireAuth()) return;
  window.crmApp.loadUserProfile();
  document.querySelector('[data-testid="logout"]').addEventListener('click', window.crmApp.logout);

  const summaryCards = {
    total: document.querySelector('[data-testid="summary-total"]'),
    active: document.querySelector('[data-testid="summary-active"]'),
    pending: document.querySelector('[data-testid="summary-pending"]'),
    blocked: document.querySelector('[data-testid="summary-blocked"]'),
  };
  const feed = document.querySelector('[data-testid="activity-feed"]');
  const statusLine = document.querySelector('[data-testid="status-line"]');

  async function loadDashboard() {
    const response = await window.crmApp.apiFetch('/api/summary');
    if (!response.ok) return;
    const payload = await response.json();
    summaryCards.total.textContent = payload.total;
    summaryCards.active.textContent = payload.statusCounts.Active ?? 0;
    summaryCards.pending.textContent = payload.statusCounts.Pending ?? 0;
    summaryCards.blocked.textContent = payload.statusCounts.Blocked ?? 0;

    feed.innerHTML = payload.recentAudit.map((event) => `
      <article class="activity-card">
        <span>${new Date(event.timestamp).toLocaleString()}</span>
        <p><strong>${event.action}</strong> — ${event.details}</p>
      </article>
    `).join('');

    const statusOrder = ['Prospect', 'Active', 'Pending', 'Inactive', 'Blocked'];
    statusLine.innerHTML = statusOrder.map((status) => `<span class="${status.toLowerCase()}"></span>`).join('');
  }

  loadDashboard();
});
