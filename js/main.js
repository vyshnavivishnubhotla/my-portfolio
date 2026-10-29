/**
 * Vyshnavi Vishnubhotla - Portfolio Main JavaScript
 * 100% compatible across all JavaScript engines:
 * - Google Chrome & modern web browsers (V8)
 * - GitHub Pages production deployments
 * - Windows Script Host (JScript ES3/ES5 compatibility)
 */

// =============================================================
// 1. Windows Script Host (WScript / CScript) Handler
// When double-clicked in Windows Explorer, launch the portfolio in Chrome
// instead of failing or throwing Windows Script Host errors.
// =============================================================
if (typeof WScript !== 'undefined') {
  try {
    var shell = new ActiveXObject('WScript.Shell');
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var scriptPath = WScript.ScriptFullName;
    var jsFolder = fso.GetParentFolderName(scriptPath);
    var rootFolder = fso.GetParentFolderName(jsFolder);
    var indexHtml = fso.BuildPath(rootFolder, 'index.html');

    if (fso.FileExists(indexHtml)) {
      shell.Run('cmd /c start "" "' + indexHtml + '"', 0, false);
      WScript.Echo('Opening Vyshnavi\'s Portfolio Website in your browser...\n\nLocation: ' + indexHtml);
    } else {
      WScript.Echo('This is the portfolio JavaScript file.\nPlease open index.html in Google Chrome.');
    }
  } catch (err) {
    WScript.Echo('This is the portfolio JavaScript file.\nPlease open index.html in Google Chrome.');
  }
  WScript.Quit(0);
}

// =============================================================
// 2. Client-Side Browser Implementation (Google Chrome & GitHub Pages)
// =============================================================
var toastTimeout = null;
var isPortfolioInitialized = false;

function safeExecute(name, fn) {
  try {
    fn();
  } catch (err) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('Error in ' + name + ':', err);
    }
  }
}

function initializePortfolio() {
  if (isPortfolioInitialized) { return; }
  isPortfolioInitialized = true;

  // Execute each feature in an isolated try/catch so one module never blocks another
  safeExecute('typingEffect', initTypingEffect);
  safeExecute('themeToggle', initThemeToggle);
  safeExecute('mobileNav', initMobileNav);
  safeExecute('scrollSpy', initScrollSpy);
  safeExecute('skillsFilter', initSkillsFilter);
  safeExecute('contactActions', initContactActions);
  safeExecute('backToTop', initBackToTop);
}

// Start immediately if DOM elements already exist (since script is at the bottom of the body),
// or listen to DOMContentLoaded and load as fallbacks.
if (typeof document !== 'undefined') {
  if (document.getElementById('typed-text')) {
    initializePortfolio();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
    window.addEventListener('load', initializePortfolio);
  } else {
    initializePortfolio();
  }
}

/* ==========================================================
   Typing Effect for Hero Subtitle (Smooth, Complete & Looping)
   ========================================================== */
function initTypingEffect() {
  var typingTarget = document.getElementById('typed-text');
  if (!typingTarget) { return; }

  var roles = [
    'AWS Cloud Specialist',
    'DevOps Enthusiast',
    'Generative AI Builder',
    'Linux & Networking Practitioner',
    'Solutions Architect Aspirant'
  ];

  var roleIndex = 0;
  var charIndex = roles[0].length;
  var isDeleting = true;

  // Guarantee that initial text is completely filled
  typingTarget.textContent = roles[0];

  function tick() {
    var fullText = roles[roleIndex];
    if (!fullText) {
      roleIndex = 0;
      fullText = roles[0];
    }

    if (isDeleting) {
      charIndex--;
      typingTarget.textContent = fullText.substring(0, charIndex);
      if (charIndex <= 0) {
        charIndex = 0;
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 450); // Pause before typing next word
        return;
      }
      setTimeout(tick, 45); // Deleting speed
    } else {
      charIndex++;
      typingTarget.textContent = fullText.substring(0, charIndex);
      if (charIndex >= fullText.length) {
        typingTarget.textContent = fullText; // Ensure full text is always completely displayed
        charIndex = fullText.length;
        isDeleting = true;
        setTimeout(tick, 2200); // 2.2 second pause on completed word
        return;
      }
      setTimeout(tick, 85); // Typing speed
    }
  }

  // Display initial complete role for 2.2s before beginning smooth rotation
  setTimeout(tick, 2200);
}

/* ==========================================================
   Theme Toggle Functionality (Dark / Light)
   ========================================================== */
function initThemeToggle() {
  var themeToggleBtn = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');

  var savedTheme = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      savedTheme = window.localStorage.getItem('vv-portfolio-theme');
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('LocalStorage access restricted; using default dark theme.');
    }
  }

  var prefersDark = true;
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      prefersDark = true;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      prefersDark = false;
    }
  } catch (e) {
    prefersDark = true;
  }

  var currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      var activeTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = (activeTheme === 'dark') ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('vv-portfolio-theme', newTheme);
        }
      } catch (e) {
        // Safe failover for local file restrictions
      }

      updateThemeIcon(newTheme);
      showToast('Switched to ' + (newTheme === 'dark' ? 'Dark' : 'Light') + ' theme', 'success');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) { return; }

    if (theme === 'dark') {
      themeIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="5"></circle>' +
        '<line x1="12" y1="1" x2="12" y2="3"></line>' +
        '<line x1="12" y1="21" x2="12" y2="23"></line>' +
        '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>' +
        '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
        '<line x1="1" y1="12" x2="3" y2="12"></line>' +
        '<line x1="21" y1="12" x2="23" y2="12"></line>' +
        '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>' +
        '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' +
        '</svg>';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      themeIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
        '</svg>';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }
}

/* ==========================================================
   Mobile Navigation Menu Toggle
   ========================================================== */
function initMobileNav() {
  var toggleBtn = document.getElementById('mobile-toggle');
  var navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) { return; }

  toggleBtn.addEventListener('click', function() {
    var isOpen = navLinks.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isOpen) {
      toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"></line>' +
        '<line x1="6" y1="6" x2="18" y2="18"></line>' +
        '</svg>';
    } else {
      toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="3" y1="12" x2="21" y2="12"></line>' +
        '<line x1="3" y1="6" x2="21" y2="6"></line>' +
        '<line x1="3" y1="18" x2="21" y2="18"></line>' +
        '</svg>';
    }
  });

  var links = navLinks.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="3" y1="12" x2="21" y2="12"></line>' +
          '<line x1="3" y1="6" x2="21" y2="6"></line>' +
          '<line x1="3" y1="18" x2="21" y2="18"></line>' +
          '</svg>';
      }
    });
  }
}

/* ==========================================================
   ScrollSpy / Active Nav Links & Navbar Header Elevation
   ========================================================== */
function initScrollSpy() {
  var navbar = document.getElementById('navbar');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) { return; }

  function onScroll() {
    var scrollPos = window.scrollY || document.documentElement.scrollTop || 0;

    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var top = section.offsetTop - 140;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        for (var j = 0; j < navLinks.length; j++) {
          navLinks[j].classList.remove('active');
          if (navLinks[j].getAttribute('href') === '#' + id) {
            navLinks[j].classList.add('active');
          }
        }
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================
   Skills Category Filtering
   ========================================================== */
function initSkillsFilter() {
  var filterBtns = document.querySelectorAll('.skill-tab-btn');
  var skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) { return; }

  for (var i = 0; i < filterBtns.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        for (var j = 0; j < filterBtns.length; j++) {
          filterBtns[j].classList.remove('active');
        }
        btn.classList.add('active');

        var filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();

        for (var k = 0; k < skillCards.length; k++) {
          (function(card) {
            var categoryAttr = (card.getAttribute('data-category') || '').toLowerCase();
            var matches = (filter === 'all') || (categoryAttr.indexOf(filter) !== -1);

            if (matches) {
              card.style.display = 'block';
              setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 15);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(10px)';
              setTimeout(function() {
                card.style.display = 'none';
              }, 200);
            }
          })(skillCards[k]);
        }
      });
    })(filterBtns[i]);
  }
}

/* ==========================================================
   Universal Clipboard Copy (Chrome & Local File Safe)
   ========================================================== */
function copyTextToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function(resolve, reject) {
    try {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      var successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        reject(new Error('execCommand copy returned false'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

/* ==========================================================
   Interactive Contact Form & Copy Email
   ========================================================== */
function initContactActions() {
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var nameEl = document.getElementById('name');
      var emailEl = document.getElementById('email');
      var subjectEl = document.getElementById('subject');
      var messageEl = document.getElementById('message');

      var name = nameEl ? nameEl.value.replace(/^\s+|\s+$/g, '') : '';
      var email = emailEl ? emailEl.value.replace(/^\s+|\s+$/g, '') : '';
      var subject = subjectEl ? subjectEl.value.replace(/^\s+|\s+$/g, '') : '';
      var message = messageEl ? messageEl.value.replace(/^\s+|\s+$/g, '') : '';

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      var mailSubject = encodeURIComponent(subject || 'Inquiry from Portfolio Website');
      var mailBody = encodeURIComponent('Hi Vyshnavi,\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
      var mailtoUrl = 'mailto:vyshsharma4@gmail.com?subject=' + mailSubject + '&body=' + mailBody;

      window.location.href = mailtoUrl;
      showToast('Opening default email application...', 'success');
      contactForm.reset();
    });
  }

  var copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function() {
      var email = 'vyshsharma4@gmail.com';
      copyTextToClipboard(email).then(function() {
        showToast('Email copied to clipboard: ' + email, 'success');
      })['catch'](function() {
        showToast('Email: ' + email, 'success');
      });
    });
  }
}

/* ==========================================================
   Back To Top Button
   ========================================================== */
function initBackToTop() {
  var backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) { return; }

  window.addEventListener('scroll', function() {
    var scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollPos > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================
   Toast Notification Utility
   ========================================================== */
function showToast(message, type) {
  if (!type) {
    type = 'success';
  }

  var toast = document.getElementById('toast-notification');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  var iconSvg = (type === 'error')
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';

  toast.innerHTML = '<span class="toast-icon">' + iconSvg + '</span><span class="toast-message">' + message + '</span>';

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toast.classList.add('show');

  toastTimeout = setTimeout(function() {
    toast.classList.remove('show');
  }, 3500);
}
