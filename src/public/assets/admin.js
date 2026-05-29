document.addEventListener('DOMContentLoaded', async () => {
  if (!window.crmApp.requireAuth()) return;
  window.crmApp.loadUserProfile();
  document.querySelector('[data-testid="logout"]').addEventListener('click', window.crmApp.logout);

  const defaultStatusSelect = document.querySelector('[data-testid="default-status"]');
  const maintenanceToggle = document.querySelector('[data-testid="maintenance-toggle"]');
  const saveButton = document.querySelector('[data-testid="settings-save"]');
  const message = document.querySelector('[data-testid="settings-message"]');

  async function loadSettings() {
    const response = await window.crmApp.apiFetch('/api/admin/settings');
    if (!response.ok) return;
    const payload = await response.json();
    maintenanceToggle.checked = payload.maintenanceMode;
    defaultStatusSelect.value = payload.defaultCustomerStatus;
  }

  async function saveSettings() {
    message.textContent = '';
    const response = await window.crmApp.apiFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({
        maintenanceMode: maintenanceToggle.checked,
        defaultCustomerStatus: defaultStatusSelect.value,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      message.textContent = payload.error || 'Unable to update settings.';
      return;
    }
    message.textContent = 'Settings saved successfully.';
  }

  saveButton.addEventListener('click', saveSettings);
  await loadSettings();
});
