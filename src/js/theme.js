(function() {
  'use strict';

  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  }

  // Apply theme to document
  function applyTheme(theme) {
    const html = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    
    if (theme === 'light') {
      html.classList.add('light-mode');
      if (toggle) {
        toggle.querySelector('.light-icon').style.display = 'none';
        toggle.querySelector('.dark-icon').style.display = 'block';
      }
    } else {
      html.classList.remove('light-mode');
      if (toggle) {
        toggle.querySelector('.light-icon').style.display = 'block';
        toggle.querySelector('.dark-icon').style.display = 'none';
      }
    }
    
    localStorage.setItem('theme', theme);
  }

  // Toggle between themes
  function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(newTheme);
  }

  // Set up event listener
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }
  });

  // Initialize theme before DOM is fully loaded to prevent flash
  initTheme();
})();
