document.addEventListener('DOMContentLoaded', async () => {
  if (!window.crmApp.requireAuth()) return;
  window.crmApp.loadUserProfile();
  document.querySelector('[data-testid="logout"]').addEventListener('click', window.crmApp.logout);

  const statusOptions = ['Prospect', 'Active', 'Pending', 'Inactive', 'Blocked'];
  const searchInput = document.querySelector('[data-testid="search-input"]');
  const statusFilter = document.querySelector('[data-testid="filter-status"]');
  const sortSelect = document.querySelector('[data-testid="sort-select"]');
  const createButton = document.querySelector('[data-testid="create-btn"]');
  const bulkDeleteButton = document.querySelector('[data-testid="bulk-delete-btn"]');
  const tableBody = document.querySelector('[data-testid="customers-table-body"]');
  const paginationInfo = document.querySelector('[data-testid="pagination-info"]');
  const prevButton = document.querySelector('[data-testid="page-prev"]');
  const nextButton = document.querySelector('[data-testid="page-next"]');
  const modal = document.querySelector('[data-testid="modal"]');
  const modalTitle = document.querySelector('[data-testid="modal-title"]');
  const nameField = document.querySelector('[data-testid="field-name"]');
  const emailField = document.querySelector('[data-testid="field-email"]');
  const statusField = document.querySelector('[data-testid="field-status"]');
  const errorField = document.querySelector('[data-testid="form-error"]');
  const saveButton = document.querySelector('[data-testid="modal-save"]');
  const cancelButton = document.querySelector('[data-testid="modal-cancel"]');

  let selectedCustomerIds = new Set();
  let currentPage = 1;
  const pageSize = 8;
  let activeCustomerId = null;

  function updateBulkState() {
    bulkDeleteButton.disabled = selectedCustomerIds.size === 0;
    bulkDeleteButton.textContent = selectedCustomerIds.size > 0 ? `Delete (${selectedCustomerIds.size})` : 'Bulk delete';
  }

  function resetModal() {
    activeCustomerId = null;
    modalTitle.textContent = 'Create customer';
    nameField.value = '';
    emailField.value = '';
    statusField.value = 'Prospect';
    errorField.textContent = '';
  }

  function toggleModal(show) {
    modal.classList.toggle('active', show);
  }

  async function fetchCustomers() {
    const q = searchInput.value.trim();
    const status = statusFilter.value;
    const sort = sortSelect.value;
    const response = await window.crmApp.apiFetch(
      `/api/customers?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&sort=${encodeURIComponent(sort)}&page=${currentPage}&pageSize=${pageSize}`
    );
    if (!response.ok) return;
    return await response.json();
  }

  function renderStatusBadge(status) {
    const classes = {
      Active: 'badge active',
      Pending: 'badge pending',
      Blocked: 'badge blocked',
      Inactive: 'badge inactive',
      Prospect: 'badge',
    };
    return `<span class="${classes[status] || 'badge'}">${status}</span>`;
  }

  function renderRow(item) {
    return `
      <tr>
        <td class="checkbox-cell">
          <input type="checkbox" data-testid="row-checkbox" data-id="${item.id}" ${selectedCustomerIds.has(item.id) ? 'checked' : ''} />
        </td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${renderStatusBadge(item.status)}</td>
        <td>
          <div class="action-group">
            <a class="action-pill" href="/customer-detail.html?id=${item.id}" data-testid="view-details">View</a>
            <button class="action-pill" data-testid="edit-btn" data-id="${item.id}">Edit</button>
            <button class="action-pill" data-testid="delete-btn" data-id="${item.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }

  async function renderCustomers() {
    const payload = await fetchCustomers();
    if (!payload) return;

    const rows = payload.data || [];
    tableBody.innerHTML = rows.map(renderRow).join('') || '<tr><td colspan="5">No customers match this view.</td></tr>';
    paginationInfo.textContent = `Page ${payload.meta.page} of ${Math.ceil(payload.meta.total / payload.meta.pageSize) || 1}`;
    prevButton.disabled = payload.meta.page <= 1;
    nextButton.disabled = payload.meta.page * payload.meta.pageSize >= payload.meta.total;

    document.querySelectorAll('[data-testid="row-checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        const id = event.target.dataset.id;
        if (event.target.checked) selectedCustomerIds.add(id);
        else selectedCustomerIds.delete(id);
        updateBulkState();
      });
    });

    document.querySelectorAll('[data-testid="edit-btn"]').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = event.currentTarget.dataset.id;
        const response = await window.crmApp.apiFetch(`/api/customers/${id}`);
        if (!response.ok) return;
        const customer = await response.json();
        activeCustomerId = id;
        modalTitle.textContent = 'Edit customer';
        nameField.value = customer.name;
        emailField.value = customer.email;
        statusField.value = customer.status;
        errorField.textContent = '';
        toggleModal(true);
      });
    });

    document.querySelectorAll('[data-testid="delete-btn"]').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = event.currentTarget.dataset.id;
        if (!window.confirm('Delete this customer permanently?')) return;
        const response = await window.crmApp.apiFetch(`/api/customers/${id}`, { method: 'DELETE' });
        if (!response.ok) return;
        await renderCustomers();
      });
    });
  }

  async function saveCustomer() {
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const status = statusField.value;
    if (!name || !email) {
      errorField.textContent = 'Name and email are required.';
      return;
    }
    const payload = { name, email, status };
    const endpoint = activeCustomerId ? `/api/customers/${activeCustomerId}` : '/api/customers';
    const method = activeCustomerId ? 'PUT' : 'POST';
    const response = await window.crmApp.apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      errorField.textContent = body.error || 'Unable to save record.';
      return;
    }
    toggleModal(false);
    await renderCustomers();
  }

  async function deleteSelected() {
    if (selectedCustomerIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedCustomerIds.size} selected customers?`)) return;
    const response = await window.crmApp.apiFetch('/api/customers/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: [...selectedCustomerIds] }),
    });
    if (!response.ok) return;
    selectedCustomerIds.clear();
    await renderCustomers();
  }

  searchInput.addEventListener('input', () => {
    currentPage = 1;
  });
  document.querySelector('[data-testid="search-btn"]').addEventListener('click', async () => {
    currentPage = 1;
    await renderCustomers();
  });
  statusFilter.addEventListener('change', async () => {
    currentPage = 1;
    await renderCustomers();
  });
  sortSelect.addEventListener('change', async () => {
    currentPage = 1;
    await renderCustomers();
  });
  createButton.addEventListener('click', () => {
    resetModal();
    toggleModal(true);
  });
  saveButton.addEventListener('click', saveCustomer);
  cancelButton.addEventListener('click', () => toggleModal(false));
  bulkDeleteButton.addEventListener('click', deleteSelected);
  prevButton.addEventListener('click', async () => {
    currentPage = Math.max(1, currentPage - 1);
    await renderCustomers();
  });
  nextButton.addEventListener('click', async () => {
    currentPage += 1;
    await renderCustomers();
  });

  statusOptions.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusField.appendChild(option);
  });

  window.crmApp.apiFetch('/api/customers');
  await renderCustomers();
  updateBulkState();
});
