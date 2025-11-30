// Robust combined department + product search for WeMart
// - Filters .department-card and .product-card simultaneously
// - Shows/hides departments grid (#departmentsGrid) and products section (#productsSection) based on matches
// - Debounced input search + click/Enter handlers
// - Creates a small "No results" message if needed

document.addEventListener('DOMContentLoaded', () => {
  // Helpers
  const d = sel => document.querySelector(sel);
  const da = sel => Array.from(document.querySelectorAll(sel));
  const normalize = s => (s || '').toString().trim().toLowerCase();

  const searchInput = d('#searchInput');
  const searchBtn = d('#searchBtn');
  const deptGrid = d('#departmentsGrid');
  const deptCards = da('.department-card');
  const productsSection = d('#productsSection');
  const productsGrid = d('#productsGrid');
  const products = da('.product-card');

  if (!searchInput || !searchBtn) {
    console.warn('Search input/button not found. Make sure elements with IDs searchInput and searchBtn exist.');
    return;
  }

  // Create a "no results" element if not present
  let noResultsEl = d('#noResultsMsg');
  if (!noResultsEl) {
    noResultsEl = document.createElement('p');
    noResultsEl.id = 'noResultsMsg';
    noResultsEl.textContent = 'No results found.';
    noResultsEl.style.display = 'none';
    noResultsEl.style.color = '#666';
    noResultsEl.style.margin = '10px 0';
    // insert after deptGrid if present, otherwise after search bar
    if (deptGrid && deptGrid.parentNode) {
      deptGrid.parentNode.insertBefore(noResultsEl, deptGrid.nextSibling);
    } else {
      const headerInner = document.querySelector('.header-inner');
      headerInner?.parentNode.insertBefore(noResultsEl, headerInner.nextSibling);
    }
  }

  // Preserve original hidden state of productsSection if present
  if (productsSection) {
    productsSection.dataset.initiallyHidden = (productsSection.style.display === 'none' || productsSection.getAttribute('aria-hidden') === 'true') ? 'true' : 'false';
  }

  function showElement(el) {
    if (!el) return;
    el.style.display = '';
    el.setAttribute && el.setAttribute('aria-hidden', 'false');
  }
  function hideElement(el) {
    if (!el) return;
    el.style.display = 'none';
    el.setAttribute && el.setAttribute('aria-hidden', 'true');
  }

  function resetAll() {
    // show dept grid and products as they were initially
    if (deptCards.length) deptCards.forEach(c => c.style.display = '');
    if (products.length) products.forEach(p => p.style.display = '');
    // if products were initially hidden, keep them hidden
    if (productsSection && productsSection.dataset.initiallyHidden === 'true') {
      hideElement(productsSection);
    } else {
      showElement(productsSection);
    }
    noResultsEl.style.display = 'none';
  }

  function runSearch() {
    const q = normalize(searchInput.value);
    if (!q) {
      resetAll();
      return;
    }

    let deptMatches = 0;
    let productMatches = 0;

    // Filter departments
    if (deptCards.length) {
      deptCards.forEach(card => {
        const title = normalize(card.querySelector('h3')?.textContent || card.dataset.dept || '');
        const desc = normalize(card.querySelector('.muted')?.textContent || '');
        const id = normalize(card.dataset.dept || '');
        const matches = title.includes(q) || desc.includes(q) || id.includes(q);
        card.style.display = matches ? '' : 'none';
        if (matches) deptMatches++;
      });
    }

    // Filter products
    if (products.length) {
      // ensure products section is visible when searching products
      showElement(productsSection);
      products.forEach(card => {
        const name = normalize(card.dataset.name || card.querySelector('h3')?.textContent || '');
        const desc = normalize(card.querySelector('.muted')?.textContent || '');
        // also allow searching by department class names on the product (e.g., "fruits")
        const classes = (card.className || '').toLowerCase();
        const matches = name.includes(q) || desc.includes(q) || classes.includes(q);
        card.style.display = matches ? '' : 'none';
        if (matches) productMatches++;
      });
    }

    // Decide visibility:
    // - If there are department matches, ensure dept grid is visible; otherwise hide it.
    if (deptMatches > 0) {
      showElement(deptGrid);
    } else {
      // If no departments match, hide the grid to focus on products (if any)
      if (deptGrid) hideElement(deptGrid);
    }

    // - If product matches, show productsSection; otherwise hide it unless it was initially visible
    if (productMatches > 0) {
      showElement(productsSection);
    } else {
      // if no product matches, hide products section unless user originally had it visible
      if (productsSection) {
        if (productsSection.dataset.initiallyHidden === 'true') {
          hideElement(productsSection);
        } else {
          // keep visible but all cards hidden (so "no results" will show)
          showElement(productsSection);
        }
      }
    }

    // No results across both
    if (deptMatches === 0 && productMatches === 0) {
      noResultsEl.style.display = '';
    } else {
      noResultsEl.style.display = 'none';
    }

    // If only departments matched, scroll to deptGrid; if only products matched, scroll to productsSection.
    // If both matched, scroll to departmentsGrid (so user sees categories first).
    if (deptMatches > 0 && productMatches === 0 && deptGrid) {
      deptGrid.scrollIntoView({ behavior: 'smooth' });
    } else if (productMatches > 0 && deptMatches === 0 && productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (deptMatches > 0 && productMatches > 0 && deptGrid) {
      deptGrid.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Debounce helper
  function debounce(fn, wait = 250) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Event handlers
  const debouncedRun = debounce(runSearch, 200);
  searchInput.addEventListener('input', debouncedRun);
  searchBtn.addEventListener('click', (e) => { e.preventDefault(); runSearch(); });
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); runSearch(); } });

  // Expose for debugging
  window.weMartRunSearch = runSearch;

  // If there's an initial value in the search input, run search once on load
  if (normalize(searchInput.value)) runSearch();

  console.info('WeMart combined search initialized (departments + products).');
});