/* ============================================
   PORTFOLIO - ANDI PRATAMA
   Main JavaScript Module
   ============================================ */

;(function () {
  'use strict';

  /* ------------------------------------------
     CONFIGURATION
  ------------------------------------------ */
  const CONFIG = {
    typing: {
      phrases: [
        'Membangun aplikasi web modern...',
        'Mendesain UI yang intuitif...',
        'Menulis clean & scalable code...',
        'Mengoptimalkan performa...',
        'Menciptakan pengalaman digital terbaik...'
      ],
      typeSpeed: 60,
      deleteSpeed: 30,
      pauseAfterType: 2000,
      pauseAfterDelete: 500
    },
    scroll: {
      revealThreshold: 0.1,
      revealRootMargin: '0px 0px -50px 0px',
      skillThreshold: 0.5,
      navOffset: 120,
      hideThreshold: 100,
      showBackToTop: 500,
      navbarHideSpeed: 300
    },
    tilt: {
      maxRotation: 8
    },
    toast: {
      duration: 4000
    }
  };

  /* ------------------------------------------
     DOM CACHE
     (Semua elemen DOM disimpan di satu tempat
      agar tidak query ulang di setiap fungsi)
  ------------------------------------------ */
  const DOM = {};

  function cacheDOMElements() {
    DOM.typedText       = document.getElementById('typedText');
    DOM.heroCard        = document.getElementById('heroCard');
    DOM.perspectiveWrap = DOM.heroCard?.parentElement;
    DOM.menuToggle      = document.getElementById('menuToggle');
    DOM.mobileMenu      = document.getElementById('mobileMenu');
    DOM.menuIcon        = document.getElementById('menuIcon');
    DOM.navbar          = document.getElementById('navbar');
    DOM.backToTop       = document.getElementById('backToTop');
    DOM.contactForm     = document.getElementById('contactForm');
    DOM.toast           = document.getElementById('toast');
    DOM.revealEls       = document.querySelectorAll('.reveal');
    DOM.skillItems      = document.querySelectorAll('.skill-item');
    DOM.mobileLinks     = document.querySelectorAll('.mobile-link');
    DOM.navLinks        = document.querySelectorAll('.nav-link');
    DOM.sections        = document.querySelectorAll('section[id]');
    DOM.anchorLinks     = document.querySelectorAll('a[href^="#"]');
  }

  /* ------------------------------------------
     1. TYPING EFFECT
     Mengetik dan menghapus teks secara bergantian
  ------------------------------------------ */
  const TypingEffect = {
    phraseIndex: 0,
    charIndex: 0,
    isDeleting: false,

    init() {
      if (!DOM.typedText) return;
      this.tick();
    },

    tick() {
      const { phrases, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete } = CONFIG.typing;
      const currentPhrase = phrases[this.phraseIndex];

      if (this.isDeleting) {
        // Mode menghapus
        this.charIndex--;
        DOM.typedText.textContent = currentPhrase.substring(0, this.charIndex);

        if (this.charIndex < 0) {
          this.isDeleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % phrases.length;
          setTimeout(() => this.tick(), pauseAfterDelete);
          return;
        }

        setTimeout(() => this.tick(), deleteSpeed);
      } else {
        // Mode mengetik
        this.charIndex++;
        DOM.typedText.textContent = currentPhrase.substring(0, this.charIndex);

        if (this.charIndex > currentPhrase.length) {
          this.isDeleting = true;
          setTimeout(() => this.tick(), pauseAfterType);
          return;
        }

        setTimeout(() => this.tick(), typeSpeed);
      }
    }
  };

  /* ------------------------------------------
     2. 3D HERO CARD TILT
     Kartu profil mengikuti posisi mouse
  ------------------------------------------ */
  const CardTilt = {
    init() {
      if (!DOM.perspectiveWrap) return;

      DOM.perspectiveWrap.addEventListener('mousemove', (e) => this.onMove(e));
      DOM.perspectiveWrap.addEventListener('mouseleave', () => this.onLeave());
    },

    onMove(e) {
      const rect = DOM.perspectiveWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxRot = CONFIG.tilt.maxRotation;

      const rotateX = ((y - centerY) / centerY) * -maxRot;
      const rotateY = ((x - centerX) / centerX) * maxRot;

      DOM.heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },

    onLeave() {
      DOM.heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  /* ------------------------------------------
     3. SCROLL REVEAL
     Elemen muncul saat masuk viewport
  ------------------------------------------ */
  const ScrollReveal = {
    observer: null,

    init() {
      if (!DOM.revealEls.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Hitung indeks sibling untuk stagger effect
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            const index = Array.from(siblings).indexOf(entry.target);

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 80);

            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: CONFIG.scroll.revealThreshold,
        rootMargin: CONFIG.scroll.revealRootMargin
      });

      DOM.revealEls.forEach((el) => this.observer.observe(el));
    }
  };

  /* ------------------------------------------
     4. SKILL BAR ANIMATION
     Bar keahlian terisi saat terlihat
  ------------------------------------------ */
  const SkillBars = {
    observer: null,

    init() {
      if (!DOM.skillItems.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const percent = entry.target.dataset.percent;
            const bar = entry.target.querySelector('.skill-bar-fill');

            setTimeout(() => {
              bar.style.width = percent + '%';
            }, 200);

            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: CONFIG.scroll.skillThreshold
      });

      DOM.skillItems.forEach((item) => this.observer.observe(item));
    }
  };

  /* ------------------------------------------
     5. MOBILE MENU
     Buka/tutup menu di layar kecil
  ------------------------------------------ */
  const MobileMenu = {
    isOpen: false,

    init() {
      if (!DOM.menuToggle) return;

      DOM.menuToggle.addEventListener('click', () => this.toggle());

      // Tutup saat link diklik
      DOM.mobileLinks.forEach((link) => {
        link.addEventListener('click', () => this.close());
      });
    },

    toggle() {
      this.isOpen = !this.isOpen;
      DOM.mobileMenu.classList.toggle('open', this.isOpen);
      DOM.menuIcon.setAttribute('icon', this.isOpen ? 'ph:x-bold' : 'ph:list-bold');
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    },

    close() {
      this.isOpen = false;
      DOM.mobileMenu.classList.remove('open');
      DOM.menuIcon.setAttribute('icon', 'ph:list-bold');
      document.body.style.overflow = '';
    }
  };

  /* ------------------------------------------
     6. NAVBAR SCROLL BEHAVIOR
     Sembunyikan saat scroll ke bawah,
     tampilkan saat scroll ke atas
  ------------------------------------------ */
  const NavbarScroll = {
    lastScrollY: 0,

    init() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    },

    onScroll() {
      const currentY = window.scrollY;
      const cfg = CONFIG.scroll;

      // Back to top button
      if (currentY > cfg.showBackToTop) {
        DOM.backToTop.style.opacity = '1';
        DOM.backToTop.style.transform = 'translateY(0)';
        DOM.backToTop.style.pointerEvents = 'auto';
      } else {
        DOM.backToTop.style.opacity = '0';
        DOM.backToTop.style.transform = 'translateY(16px)';
        DOM.backToTop.style.pointerEvents = 'none';
      }

      // Navbar hide/show
      if (currentY > this.lastScrollY && currentY > cfg.hideThreshold) {
        DOM.navbar.style.transform = 'translateY(-100%)';
      } else {
        DOM.navbar.style.transform = 'translateY(0)';
      }

      this.lastScrollY = currentY;
    }
  };

  /* ------------------------------------------
     7. ACTIVE NAV HIGHLIGHT
     Highlight link navigasi sesuai section
  ------------------------------------------ */
  const ActiveNav = {
    init() {
      window.addEventListener('scroll', () => this.update(), { passive: true });
      // Trigger sekali saat load
      this.update();
    },

    update() {
      let currentId = '';

      DOM.sections.forEach((section) => {
        const sectionTop = section.offsetTop - CONFIG.scroll.navOffset;
        if (window.scrollY >= sectionTop) {
          currentId = section.getAttribute('id');
        }
      });

      DOM.navLinks.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('text-mint', isMatch);
        link.classList.toggle('text-sub', !isMatch);
      });
    }
  };

  /* ------------------------------------------
     8. SMOOTH SCROLL
     Scroll halus ke anchor link
  ------------------------------------------ */
  const SmoothScroll = {
    init() {
      DOM.anchorLinks.forEach((anchor) => {
        anchor.addEventListener('click', (e) => this.handleClick(e));
      });
    },

    handleClick(e) {
      e.preventDefault();
      const targetId = this.anchor.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    }
  };

  /* ------------------------------------------
     9. CONTACT FORM
     Handle submit dan tampilkan toast
  ------------------------------------------ */
  const ContactForm = {
    init() {
      if (!DOM.contactForm) return;

      DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Toast.show();
        DOM.contactForm.reset();
      });
    }
  };

  /* ------------------------------------------
     10. TOAST NOTIFICATION
     Notifikasi muncul dari kanan bawah
  ------------------------------------------ */
  const Toast = {
    timer: null,

    show() {
      if (!DOM.toast) return;

      // Clear timer sebelumnya jika ada
      if (this.timer) clearTimeout(this.timer);

      DOM.toast.classList.add('show');
      this.timer = setTimeout(() => this.hide(), CONFIG.toast.duration);
    },

    hide() {
      if (!DOM.toast) return;
      DOM.toast.classList.remove('show');
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  };

  /* ------------------------------------------
     11. BACK TO TOP
     Tombol kembali ke atas
  ------------------------------------------ */
  const BackToTop = {
    init() {
      if (!DOM.backToTop) return;

      DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ------------------------------------------
     12. TOAST CLOSE BUTTON
     (Dipisah agar bisa diakses global
      dari onclick di HTML jika diperlukan)
  ------------------------------------------ */
  // Expose ke global scope untuk inline onclick
  window.hideToast = function () {
    Toast.hide();
  };

  /* ------------------------------------------
     INITIALIZATION
     Jalankan semua modul saat DOM siap
  ------------------------------------------ */
  function init() {
    cacheDOMElements();

    TypingEffect.init();
    CardTilt.init();
    ScrollReveal.init();
    SkillBars.init();
    MobileMenu.init();
    NavbarScroll.init();
    ActiveNav.init();
    SmoothScroll.init();
    ContactForm.init();
    BackToTop.init();
  }

  // Tunggu DOM selesai loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();