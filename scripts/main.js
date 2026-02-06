/* ==========================================================================
   Main JavaScript - Core Interactions and Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
  initHeroAnimation();
});

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll effect for navigation
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when scrolled down
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile navigation toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile nav when clicking a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   Scroll Animations using Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally stop observing after reveal
        // revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#" or empty
      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, href);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Hero Animation
   -------------------------------------------------------------------------- */

// Hero customization maps
const GREETINGS = {
  'hello-world': 'Hello, World.',
  'console-log': "console.log('Hello');",
  'print-py': 'print("Hello")',
  'sysout': 'System.out.println("Hello");',
  'hi-there': 'Hi there.',
  'welcome': 'Welcome.'
};

const STATUSES = {
  'open': 'Open to opportunities',
  'connect': "Let's connect",
  'building': 'Currently building',
  'none': null
};

function initHeroAnimation() {
  const heroElements = document.querySelectorAll('.hero .reveal');

  // Stagger the reveal animations for hero elements
  heroElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.15}s`;
  });

  // Trigger hero animations after a short delay
  setTimeout(() => {
    heroElements.forEach(el => {
      el.classList.add('active');
    });
  }, 100);

  // Apply hero customization from data attributes
  const html = document.documentElement;
  const greeting = html.getAttribute('data-greeting') || 'hello-world';
  const status = html.getAttribute('data-status') || 'open';
  const effect = html.getAttribute('data-effect') || 'scramble';

  applyHeroCustomization(greeting, status, effect);
}

function applyHeroCustomization(greeting, status, effect) {
  const greetingEl = document.querySelector('.hero-greeting');
  const statusEl = document.querySelector('.hero-status');
  const statusText = document.querySelector('.status-text');

  if (!greetingEl) return;

  // Get greeting text
  const greetingText = GREETINGS[greeting] || GREETINGS['hello-world'];

  // Apply text effect
  if (effect === 'scramble' && window.TextScramble) {
    greetingEl.textContent = '';
    const scramble = new TextScramble(greetingEl);
    setTimeout(() => scramble.setText(greetingText), 500);
  } else if (effect === 'typewriter') {
    setTimeout(() => typewriter(greetingEl, greetingText), 500);
  } else {
    greetingEl.textContent = greetingText;
  }

  // Set status
  if (statusEl) {
    if (status === 'none' || !STATUSES[status]) {
      statusEl.classList.add('hidden');
    } else {
      statusEl.classList.remove('hidden');
      if (statusText) statusText.textContent = STATUSES[status];
    }
  }
}

// Typewriter effect
function typewriter(element, text, speed = 50) {
  element.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  element.appendChild(cursor);

  function type() {
    if (i < text.length) {
      element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(() => cursor.remove(), 1500);
    }
  }
  type();
}

// Export for use in playground
window.GREETINGS = GREETINGS;
window.STATUSES = STATUSES;
window.applyHeroCustomization = applyHeroCustomization;
window.typewriter = typewriter;

/* --------------------------------------------------------------------------
   Utility: Debounce function
   -------------------------------------------------------------------------- */
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* --------------------------------------------------------------------------
   Utility: Throttle function
   -------------------------------------------------------------------------- */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* --------------------------------------------------------------------------
   Optional: Cursor Effects (can be enabled for playful vibe)
   -------------------------------------------------------------------------- */
function initCursorEffects() {
  // Only run on devices with hover capability
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth cursor follow
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-tag');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
}

/* --------------------------------------------------------------------------
   Optional: Text Scramble Effect (for hero name)
   -------------------------------------------------------------------------- */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Export for use in other modules if needed
window.TextScramble = TextScramble;
