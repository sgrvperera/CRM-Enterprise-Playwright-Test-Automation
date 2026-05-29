document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('login-message');
  const email = document.querySelector('[data-testid="login-email"]');
  const password = document.querySelector('[data-testid="login-password"]');
  const submit = document.querySelector('[data-testid="login-submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    submit.disabled = true;
    const body = {
      email: email.value.trim(),
      password: password.value.trim(),
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) {
        message.textContent = payload.error || 'Login failed';
        return;
      }
      localStorage.setItem('token', payload.token);
      location.href = '/dashboard.html';
    } catch (error) {
      message.textContent = 'Network error. Please try again.';
    } finally {
      submit.disabled = false;
    }
  });
});
