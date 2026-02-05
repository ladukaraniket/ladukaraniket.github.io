/* ==========================================================================
   Theme Playground - Development Mode Theme Switcher
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemePlayground();
});

function initThemePlayground() {
  const playground = document.querySelector('.theme-playground');
  if (!playground) return;

  const toggle = playground.querySelector('.playground-toggle');
  const panel = playground.querySelector('.playground-panel');
  const themeSelect = document.getElementById('theme-select');
  const accentSelect = document.getElementById('accent-select');
  const vibeSelect = document.getElementById('vibe-select');
  const colorSwatches = playground.querySelectorAll('.color-swatch');

  // Load saved preferences from localStorage
  loadSavedTheme();

  // Toggle panel visibility
  toggle?.addEventListener('click', () => {
    panel?.classList.toggle('active');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!playground.contains(e.target) && panel?.classList.contains('active')) {
      panel.classList.remove('active');
    }
  });

  // Close panel on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel?.classList.contains('active')) {
      panel.classList.remove('active');
    }
  });

  // Theme select handler
  themeSelect?.addEventListener('change', (e) => {
    setTheme(e.target.value);
    saveThemePreference('theme', e.target.value);
  });

  // Accent select handler
  accentSelect?.addEventListener('change', (e) => {
    setAccent(e.target.value);
    saveThemePreference('accent', e.target.value);
    updateSwatchActive(e.target.value);
  });

  // Vibe select handler
  vibeSelect?.addEventListener('change', (e) => {
    setVibe(e.target.value);
    saveThemePreference('vibe', e.target.value);
  });

  // Color swatch click handlers
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const accent = swatch.dataset.accent;
      setAccent(accent);
      saveThemePreference('accent', accent);
      if (accentSelect) accentSelect.value = accent;
      updateSwatchActive(accent);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
  }

  function setVibe(vibe) {
    document.documentElement.setAttribute('data-vibe', vibe);
  }

  function updateSwatchActive(accent) {
    colorSwatches.forEach(swatch => {
      swatch.classList.toggle('active', swatch.dataset.accent === accent);
    });
  }

  function saveThemePreference(key, value) {
    try {
      const prefs = JSON.parse(localStorage.getItem('themePrefs') || '{}');
      prefs[key] = value;
      localStorage.setItem('themePrefs', JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  function loadSavedTheme() {
    try {
      const prefs = JSON.parse(localStorage.getItem('themePrefs') || '{}');

      if (prefs.theme) {
        setTheme(prefs.theme);
        if (themeSelect) themeSelect.value = prefs.theme;
      }

      if (prefs.accent) {
        setAccent(prefs.accent);
        if (accentSelect) accentSelect.value = prefs.accent;
        updateSwatchActive(prefs.accent);
      }

      if (prefs.vibe) {
        setVibe(prefs.vibe);
        if (vibeSelect) vibeSelect.value = prefs.vibe;
      }
    } catch (e) {
      console.warn('Could not load theme preferences:', e);
    }
  }
}

/* --------------------------------------------------------------------------
   Keyboard shortcuts for quick theme switching (development only)
   -------------------------------------------------------------------------- */
document.addEventListener('keydown', (e) => {
  // Only trigger with Alt key held
  if (!e.altKey) return;

  const html = document.documentElement;

  switch (e.key) {
    // Alt + T: Cycle through themes (dark/light/midnight)
    case 't':
    case 'T':
      e.preventDefault();
      const themes = ['dark', 'light', 'midnight'];
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const themeIndex = themes.indexOf(currentTheme);
      const newTheme = themes[(themeIndex + 1) % themes.length];
      html.setAttribute('data-theme', newTheme);
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) themeSelect.value = newTheme;
      console.log(`Theme: ${newTheme}`);
      break;

    // Alt + 1-6: Switch accent colors
    case '1':
      e.preventDefault();
      html.setAttribute('data-accent', 'blue');
      console.log('Accent: Electric Blue');
      break;
    case '2':
      e.preventDefault();
      html.setAttribute('data-accent', 'coral');
      console.log('Accent: Warm Coral');
      break;
    case '3':
      e.preventDefault();
      html.setAttribute('data-accent', 'emerald');
      console.log('Accent: Emerald Green');
      break;
    case '4':
      e.preventDefault();
      html.setAttribute('data-accent', 'gray');
      console.log('Accent: Minimal Gray');
      break;
    case '5':
      e.preventDefault();
      html.setAttribute('data-accent', 'violet');
      console.log('Accent: Violet Purple');
      break;
    case '6':
      e.preventDefault();
      html.setAttribute('data-accent', 'gold');
      console.log('Accent: Sunset Gold');
      break;

    // Alt + V: Cycle through vibes
    case 'v':
    case 'V':
      e.preventDefault();
      const vibes = ['combined', 'bold', 'clean', 'playful', 'brutalist', 'terminal', 'glass', 'editorial'];
      const currentVibe = html.getAttribute('data-vibe') || 'combined';
      const vibeIndex = vibes.indexOf(currentVibe);
      const nextVibe = vibes[(vibeIndex + 1) % vibes.length];
      html.setAttribute('data-vibe', nextVibe);
      const vibeSelect = document.getElementById('vibe-select');
      if (vibeSelect) vibeSelect.value = nextVibe;
      console.log(`Vibe: ${nextVibe}`);
      break;
  }
});
