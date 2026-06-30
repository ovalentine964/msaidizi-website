/* ========================================
   MSAIDIZI — Website Scripts
   Worker-focused, bilingual, simple
   ======================================== */

(function() {
    'use strict';

    let currentLang = 'en';

    // ========== DOM READY ==========
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initLanguageToggle();
        initScrollAnimations();
        initScrollToTop();
        initSmoothScroll();
    });

    // ========== NAVIGATION ==========
    function initNavigation() {
        var nav = document.getElementById('nav');
        var hamburger = document.getElementById('hamburger');
        var mobileMenu = document.getElementById('mobile-menu');

        // Sticky nav
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Mobile menu
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            mobileMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // ========== LANGUAGE TOGGLE ==========
    function initLanguageToggle() {
        var btns = document.querySelectorAll('.lang-toggle__btn');
        if (!btns.length) return;

        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                if (lang === currentLang) return;

                currentLang = lang;
                btns.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                applyTranslations();
            });
        });
    }

    function applyTranslations() {
        var elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var translationKey = 'data-i18n-' + currentLang;
            var translated = el.getAttribute(translationKey);

            if (translated) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translated;
                } else {
                    el.innerHTML = translated;
                }
            } else if (window.SwahiliContent && window.SwahiliContent[key] && currentLang === 'sw') {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = window.SwahiliContent[key];
                } else {
                    el.innerHTML = window.SwahiliContent[key];
                }
            }
        });
    }

    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    var parent = entry.target.parentElement;
                    var siblings = parent ? Array.from(parent.querySelectorAll('.fade-in')) : [];
                    var idx = siblings.indexOf(entry.target);
                    if (idx > 0 && idx <= 6) {
                        entry.target.style.transitionDelay = (idx * 0.08) + 's';
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(function(el) {
            observer.observe(el);
        });
    }

    // ========== SCROLL TO TOP ==========
    function initScrollToTop() {
        var scrollTopBtn = document.querySelector('.scroll-top');
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.className = 'scroll-top';
            scrollTopBtn.innerHTML = '↑';
            scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(scrollTopBtn);
        }

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                var nav = document.getElementById('nav');
                var navHeight = nav ? nav.offsetHeight : 68;
                var targetPosition = target.offsetTop - navHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ========== KEYBOARD ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var mobileMenu = document.getElementById('mobile-menu');
            var hamburger = document.getElementById('hamburger');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

})();
