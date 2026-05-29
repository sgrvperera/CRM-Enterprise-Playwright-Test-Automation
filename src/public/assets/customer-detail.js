document.addEventListener('DOMContentLoaded', async () => {
  if (!window.crmApp.requireAuth()) return;
  window.crmApp.loadUserProfile();
  document.querySelector('[data-testid="logout"]').addEventListener('click', window.crmApp.logout);

  const customerId = new URLSearchParams(window.location.search).get('id');
  const nameEl = document.querySelector('[data-testid="customer-name"]');
  const emailEl = document.querySelector('[data-testid="customer-email"]');
  const statusEl = document.querySelector('[data-testid="customer-status"]');
  const createdEl = document.querySelector('[data-testid="customer-created"]');
  const notesEl = document.querySelector('[data-testid="customer-notes"]');
  const errorEl = document.querySelector('[data-testid="customer-error"]');

  if (!customerId) {
    errorEl.textContent = 'Customer identifier is missing from the URL.';
    return;
  }

  async function loadCustomer() {
    const response = await window.crmApp.apiFetch(`/api/customers/${customerId}`);
    if (!response.ok) {
      errorEl.textContent = 'Unable to load customer details.';
      return;
    }
    const customer = await response.json();
    nameEl.textContent = customer.name;
    emailEl.textContent = customer.email;
    statusEl.textContent = customer.status;
    createdEl.textContent = customer.createdAt || 'N/A';
    notesEl.textContent = customer.notes || 'No recent notes captured for this customer.';
  }

  await loadCustomer();
});
