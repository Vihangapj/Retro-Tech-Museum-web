/**
 * Retro Tech Museum - Common UI Controller & Utilities
 * Handles Themes, CRT Overlay, Audio Sync, Digital Clock, Toast Notifications & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initRetroPreloader();
  initPageTransitions();
  initThemes();
  initCrtToggle();
  initAudioControls();
  initMobileMenu();
  initDigitalClock();
  initVisitorCounter();
  initModals();
  initBackToTop();
  createToastContainer();
});

// Helper: Check if current page is the 1st page (Home / index.html)
function isFirstPage() {
  const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
  const filename = path.substring(path.lastIndexOf('/') + 1);
  return filename === '' || filename === 'index.html';
}

/* --- RETRO SYSTEM BOOT PRELOADER --- */
function initRetroPreloader() {
  // Only display preloader on the 1st page (index.html). Other pages transition smoothly.
  if (!isFirstPage()) return;

  let preloader = document.getElementById('retro-preloader');
  if (!preloader) {
    preloader = document.createElement('div');
    preloader.id = 'retro-preloader';
    preloader.setAttribute('aria-label', 'System Boot Sequence');
    preloader.innerHTML = `
      <div class="preloader-terminal">
        <div class="preloader-header">
          <span>RETRO ARCHIVE BIOS V1.0</span>
          <span>1984-2026</span>
        </div>
        <div class="preloader-content">
          <div class="preloader-line glow-text-yellow">▶ SYSTEM COLD BOOT INITIALIZED...</div>
          <div class="preloader-line">CPU: MOS 6502 @ 1.02 MHz [OK]</div>
          <div class="preloader-line">VDC: VIC-II 16-COLOR GRAPHICS [OK]</div>
          <div class="preloader-line">SID: 6581 3-VOICE SYNTHESIZER [OK]</div>
          <div class="preloader-line">MEMORY COUNT: <span id="preloader-ram" style="color: #00ffcc;">64 KB</span> OK</div>
          <div class="preloader-progress-wrap">
            <div class="preloader-progress-bar">
              <div class="preloader-progress-fill" id="preloader-fill"></div>
            </div>
            <span class="preloader-pct" id="preloader-pct">0%</span>
          </div>
          <div class="preloader-status glow-text-cyan">
            MOUNTING SILICON EXHIBITS... <span class="preloader-blink">█</span>
          </div>
        </div>
        <div class="preloader-footer">
          <span>SYSTEM READY FOR EXECUTION</span>
          <button class="preloader-skip-btn" id="preloader-skip-btn">[SKIP ESC]</button>
        </div>
      </div>
    `;
    document.body.prepend(preloader);
  }

  const fillEl = document.getElementById('preloader-fill');
  const pctEl = document.getElementById('preloader-pct');
  const ramEl = document.getElementById('preloader-ram');
  const skipBtn = document.getElementById('preloader-skip-btn');

  let pct = 0;
  const ramStages = ['64 KB', '128 KB', '256 KB', '512 KB', '640 KB'];
  let dismissed = false;

  const onPreloaderKey = (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      dismissPreloader();
    }
  };

  const dismissPreloader = () => {
    if (dismissed) return;
    dismissed = true;
    document.removeEventListener('keydown', onPreloaderKey);
    preloader.classList.add('loaded');
    if (window.retroAudio) window.retroAudio.playBootChime();
    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 450);
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissPreloader);
  }
  preloader.addEventListener('click', dismissPreloader);
  document.addEventListener('keydown', onPreloaderKey);

  const interval = setInterval(() => {
    pct += Math.floor(Math.random() * 16) + 12;
    if (pct > 100) pct = 100;

    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';

    const stageIdx = Math.min(ramStages.length - 1, Math.floor((pct / 100) * ramStages.length));
    if (ramEl) ramEl.textContent = ramStages[stageIdx];

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(dismissPreloader, 320);
    }
  }, 70);
}

/* --- TOAST NOTIFICATION SYSTEM --- */
function createToastContainer() {
  if (!document.getElementById('retro-toast-container')) {
    const container = document.createElement('div');
    container.id = 'retro-toast-container';
    document.body.appendChild(container);
  }
}

window.showRetroToast = function(msg, icon = '★') {
  createToastContainer();
  const container = document.getElementById('retro-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'retro-toast';
  toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  if (window.retroAudio) {
    window.retroAudio.playBlip();
  }

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
};

/* --- THEME CONTROLLER --- */
const THEMES = ['theme-cyber', 'theme-phosphor', 'theme-amber', 'theme-gameboy'];
const THEME_NAMES = {
  'theme-cyber': 'CYBER 1984',
  'theme-phosphor': 'PHOSPHOR GREEN',
  'theme-amber': 'AMBER CRT',
  'theme-gameboy': 'GAME BOY DMG'
};

function initThemes() {
  const savedTheme = localStorage.getItem('retro_theme') || 'theme-cyber';
  setTheme(savedTheme, false);

  const themeBtn = document.getElementById('btn-toggle-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('retro_theme') || 'theme-cyber';
      const currentIndex = THEMES.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const nextTheme = THEMES[nextIndex];
      setTheme(nextTheme, true);
      if (window.retroAudio) window.retroAudio.playCoin();
    });
  }
}

function setTheme(themeName, showToast = false) {
  THEMES.forEach(t => document.body.classList.remove(t));
  if (themeName !== 'theme-cyber') {
    document.body.classList.add(themeName);
  }
  localStorage.setItem('retro_theme', themeName);

  const themeLabel = document.getElementById('current-theme-label');
  if (themeLabel) {
    themeLabel.textContent = THEME_NAMES[themeName] || 'THEME';
  }

  if (showToast) {
    window.showRetroToast(`THEME: ${THEME_NAMES[themeName]}`, '🎨');
  }
}

/* --- CRT SCANLINE TOGGLE --- */
function initCrtToggle() {
  const crtOverlay = document.getElementById('crt-overlay');
  const crtBtn = document.getElementById('btn-toggle-crt');
  const savedCrt = localStorage.getItem('retro_crt_enabled');

  if (savedCrt === 'false' && crtOverlay) {
    crtOverlay.classList.add('disabled');
    if (crtBtn) {
      crtBtn.classList.remove('active');
      crtBtn.innerHTML = '📺 <span class="ctrl-label">CRT: OFF</span>';
    }
  } else if (crtBtn) {
    crtBtn.classList.add('active');
    crtBtn.innerHTML = '📺 <span class="ctrl-label">CRT: ON</span>';
  }

  if (crtBtn && crtOverlay) {
    crtBtn.addEventListener('click', () => {
      const isDisabled = crtOverlay.classList.toggle('disabled');
      localStorage.setItem('retro_crt_enabled', !isDisabled);
      crtBtn.classList.toggle('active', !isDisabled);
      crtBtn.innerHTML = !isDisabled ? '📺 <span class="ctrl-label">CRT: ON</span>' : '📺 <span class="ctrl-label">CRT: OFF</span>';

      window.showRetroToast(!isDisabled ? 'CRT SCANLINES: ENABLED' : 'CRT SCANLINES: DISABLED', '📺');
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }
}

/* --- AUDIO CONTROLS (SFX & BGM) --- */
function initAudioControls() {
  const sfxBtn = document.getElementById('btn-toggle-sfx');
  const bgmBtn = document.getElementById('btn-toggle-bgm');
  const cassetteSpool = document.querySelector('.cassette-spool');

  if (sfxBtn) {
    const isEnabled = window.retroAudio.soundEnabled;
    sfxBtn.classList.toggle('active', isEnabled);
    sfxBtn.innerHTML = isEnabled ? '🔊 <span class="ctrl-label">SFX: ON</span>' : '🔈 <span class="ctrl-label">SFX: OFF</span>';

    sfxBtn.addEventListener('click', () => {
      const state = window.retroAudio.toggleSound();
      sfxBtn.classList.toggle('active', state);
      sfxBtn.innerHTML = state ? '🔊 <span class="ctrl-label">SFX: ON</span>' : '🔈 <span class="ctrl-label">SFX: OFF</span>';
      window.showRetroToast(state ? '8-BIT SFX: ENABLED' : '8-BIT SFX: MUTED', state ? '🔊' : '🔈');
    });
  }

  if (bgmBtn) {
    bgmBtn.addEventListener('click', () => {
      const isPlaying = window.retroAudio.toggleBGM();
      bgmBtn.classList.toggle('active', isPlaying);
      bgmBtn.innerHTML = isPlaying ? '⏹ STOP BGM' : '▶ PLAY 8-BIT BGM';

      if (cassetteSpool) {
        cassetteSpool.classList.toggle('playing', isPlaying);
      }

      window.showRetroToast(isPlaying ? 'CHIPTUNE BGM: PLAYING' : 'CHIPTUNE BGM: STOPPED', isPlaying ? '🎵' : '⏹');
    });
  }
}

/* --- MOBILE DRAWER NAVIGATION & ACCESSIBILITY --- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
      toggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (window.retroAudio) window.retroAudio.playBlip();
    });

    // Close on any link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --- BACK TO TOP RETRO BUTTON --- */
function initBackToTop() {
  let btn = document.getElementById('btn-back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-back-to-top';
    btn.className = 'pixel-btn pixel-btn-accent';
    btn.innerHTML = '▲ TOP';
    btn.title = 'Back to top of page';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.retroAudio) window.retroAudio.playBlip();
  });
}

/* --- VINTAGE DIGITAL CLOCK --- */
function initDigitalClock() {
  const clockElement = document.getElementById('retro-live-clock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds} RTC`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --- VISITOR COUNTER SIMULATOR --- */
function initVisitorCounter() {
  const visitorEl = document.getElementById('live-visitor-count');
  if (!visitorEl) return;

  let baseCount = parseInt(localStorage.getItem('retro_visitor_count') || '142857', 10);
  baseCount += 1;
  localStorage.setItem('retro_visitor_count', baseCount);
  visitorEl.textContent = String(baseCount).padStart(7, '0');

  setInterval(() => {
    if (Math.random() > 0.65) {
      baseCount += Math.floor(Math.random() * 2) + 1;
      visitorEl.textContent = String(baseCount).padStart(7, '0');
    }
  }, 12000);
}

/* --- MODAL DIALOGS --- */
function initModals() {
  const backdrops = document.querySelectorAll('.pixel-modal-backdrop');
  
  backdrops.forEach(backdrop => {
    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (window.retroAudio) window.retroAudio.playBlip();
      });
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      backdrops.forEach(b => {
        b.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

/* --- SMOOTH PAGE TRANSITIONS --- */
function initPageTransitions() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, javascript:, mailto:, tel:
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    // Ignore external target or download links
    if (link.target === '_blank' || link.hasAttribute('download')) {
      return;
    }

    // Ignore modifier clicks (open in new tab/window)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    // Check same origin
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // If same page with hash anchor, allow smooth scroll
      if (url.pathname === window.location.pathname && url.hash) return;

      // Smoothly fade page out before navigating
      e.preventDefault();
      document.body.classList.add('page-transitioning');

      setTimeout(() => {
        window.location.href = link.href;
      }, 160);
    } catch (err) {
      // Fallback to normal browser navigation
    }
  });

  // Remove transition class if restored via back/forward cache
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-transitioning');
  });
}
