/**
 * Msaidizi / Biashara AI — Main Script
 * Language toggle, scroll animations, download counter, share
 */
(function () {
  'use strict';

  // ---- State ----
  let currentLang = localStorage.getItem('msaidizi-lang') || 'en';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNav();
    setupLanguageToggle();
    setupScrollAnimations();
    setupDownloadCounter();
    setupShareButtons();
    applyLanguage(currentLang);
  }

  // ============================================
  // Navigation
  // ============================================
  function setupNav() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');

    // Scroll shadow
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        }
      });

      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          var spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = '';
          spans[1].style.opacity = '';
          spans[2].style.transform = '';
        });
      });
    }
  }

  // ============================================
  // Language Toggle
  // ============================================
  function setupLanguageToggle() {
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        if (lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem('msaidizi-lang', lang);
        applyLanguage(lang);
        updateToggleUI(lang);
      });
    });
    updateToggleUI(currentLang);
  }

  function updateToggleUI(lang) {
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang === 'sw' ? 'sw' : 'en';

    // Apply translations to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text;
      if (lang === 'sw' && SW_CONTENT && SW_CONTENT[key]) {
        text = SW_CONTENT[key];
      } else {
        text = el.getAttribute('data-i18n-en');
      }
      if (text !== undefined) {
        // Support HTML in translations (for <span> in titles etc.)
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update download counter text if count is available
    updateDownloadCounterText();
  }

  // ============================================
  // Scroll Animations (IntersectionObserver)
  // ============================================
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // Download Counter (GitHub API)
  // ============================================
  var downloadCount = 0;

  function setupDownloadCounter() {
    // Try to fetch from GitHub API
    var repo = 'msaidizi/biashara-ai'; // Placeholder — update with real repo
    fetch('https://api.github.com/repos/' + repo + '/releases')
      .then(function (res) {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(function (releases) {
        var total = 0;
        releases.forEach(function (release) {
          (release.assets || []).forEach(function (asset) {
            total += asset.download_count || 0;
          });
        });
        downloadCount = total;
        updateDownloadCounterText();
      })
      .catch(function () {
        // Silently fail — show placeholder
        downloadCount = 0;
        updateDownloadCounterText();
      });
  }

  function updateDownloadCounterText() {
    var el = document.getElementById('download-counter');
    if (!el) return;
    if (downloadCount > 0) {
      var template = currentLang === 'sw'
        ? SW_CONTENT['download.counter']
        : 'Over <strong>{count}</strong> downloads';
      el.innerHTML = template.replace('{count}', downloadCount.toLocaleString());
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }

  // ============================================
  // Share Buttons
  // ============================================
  function setupShareButtons() {
    // WhatsApp share
    document.querySelectorAll('[data-share="whatsapp"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var text = encodeURIComponent(
          'Check out Msaidizi — a free business app that works offline and speaks Swahili! 🇰🇪🇹🇿\n' +
          window.location.href
        );
        window.open('https://wa.me/?text=' + text, '_blank');
      });
    });

    // Generic share (Web Share API)
    document.querySelectorAll('[data-share="native"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (navigator.share) {
          navigator.share({
            title: 'Msaidizi — Your Business Assistant',
            text: 'Check out Msaidizi — a free business app that works offline and speaks Swahili!',
            url: window.location.href
          });
        }
      });
    });
  }

  // Expose for inline handlers if needed
  window.MsaidiziApp = {
    setLanguage: function (lang) {
      currentLang = lang;
      localStorage.setItem('msaidizi-lang', lang);
      applyLanguage(lang);
      updateToggleUI(lang);
    }
  };
})();
