(function() {
  'use strict';

  let searchIndex = null;
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  const categoryIcons = {
    'informational': 'info',
    'successful': 'success',
    'redirection': 'redirect',
    'client-error': 'client-error',
    'server-error': 'server-error'
  };

  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    try {
      const response = await fetch('/search-index.json');
      searchIndex = await response.json();
      return searchIndex;
    } catch (error) {
      console.error('Failed to load search index:', error);
      return [];
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }

  function search(query, data) {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return data.filter(item => {
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.overview.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      // Prioritize exact code matches
      const aCodeMatch = a.code.toLowerCase() === q;
      const bCodeMatch = b.code.toLowerCase() === q;
      if (aCodeMatch && !bCodeMatch) return -1;
      if (bCodeMatch && !aCodeMatch) return 1;

      // Then prioritize code starts with
      const aCodeStarts = a.code.toLowerCase().startsWith(q);
      const bCodeStarts = b.code.toLowerCase().startsWith(q);
      if (aCodeStarts && !bCodeStarts) return -1;
      if (bCodeStarts && !aCodeStarts) return 1;

      // Sort by code number
      return Number(a.code) - Number(b.code);
    });
  }

  function renderResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResults.classList.add('visible');
      return;
    }

    const html = results.slice(0, 10).map(item => {
      const categoryClass = item.category;
      return `
        <a href="${item.url}" class="search-result-item ${categoryClass}">
          <span class="search-result-code">${highlightMatch(item.code, query)}</span>
          <span class="search-result-name">${highlightMatch(item.name, query)}</span>
          <span class="search-result-overview">${highlightMatch(item.overview, query)}</span>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('visible');
  }

  function hideResults() {
    searchResults.innerHTML = '';
    searchResults.classList.remove('visible');
  }

  let debounceTimer;
  searchInput.addEventListener('input', async function(e) {
    clearTimeout(debounceTimer);
    const query = e.target.value;

    if (!query.trim()) {
      hideResults();
      return;
    }

    debounceTimer = setTimeout(async () => {
      const data = await loadSearchIndex();
      const results = search(query, data);
      renderResults(results, query);
    }, 150);
  });

  searchInput.addEventListener('focus', async function() {
    const query = searchInput.value;
    if (query.trim()) {
      const data = await loadSearchIndex();
      const results = search(query, data);
      renderResults(results, query);
    }
  });

  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      hideResults();
    }
  });

  searchInput.addEventListener('keydown', function(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    const activeItem = searchResults.querySelector('.search-result-item.active');
    let currentIndex = Array.from(items).indexOf(activeItem);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        if (activeItem) activeItem.classList.remove('active');
        items[currentIndex + 1].classList.add('active');
        items[currentIndex + 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        if (activeItem) activeItem.classList.remove('active');
        items[currentIndex - 1].classList.add('active');
        items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter' && activeItem) {
      e.preventDefault();
      window.location.href = activeItem.href;
    } else if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });
})();
