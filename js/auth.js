/**
 * Retro Tech Museum - Dummy User Authentication & Profile System
 * Supports LocalStorage session, Demo Logins, Clearance Tiers, Profile Dropdowns & Mobile Sync
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'retro_tech_user_session';

  // Predefined Historical & Demo Accounts
  const DEMO_ACCOUNTS = {
    ada: {
      handle: 'ADA_LOVELACE',
      name: 'Ada Lovelace',
      role: 'Lead Software Architect',
      clearance: 'LEVEL 4: FOUNDER',
      avatar: '👑',
      rig: 'Analytical Engine (1843)',
      joined: '1843-10-24'
    },
    grace: {
      handle: 'GRACE_HOPPER',
      name: 'Rear Admiral Grace Hopper',
      role: 'Mother of Compilers',
      clearance: 'LEVEL 4: ARCHITECT',
      avatar: '⚡',
      rig: 'UNIVAC I & A-0 (1952)',
      joined: '1952-05-15'
    },
    margaret: {
      handle: 'MARGARET_HAMILTON',
      name: 'Margaret Hamilton',
      role: 'Apollo 11 Flight Director',
      clearance: 'LEVEL 4: DIRECTOR',
      avatar: '🚀',
      rig: 'Apollo Guidance Computer',
      joined: '1969-07-20'
    },
    arcade: {
      handle: 'BYTE_DEFENDER_84',
      name: 'Retro Arcade Champion',
      role: 'High-Score Operative',
      clearance: 'LEVEL 3: HACKER',
      avatar: '👾',
      rig: 'Commodore 64 & SID Synth',
      joined: '1984-10-24'
    },
    student: {
      handle: 'KANDY_SCHOLAR',
      name: 'Girls High School Scholar',
      role: 'Computing Explorer',
      clearance: 'LEVEL 2: SCHOLAR',
      avatar: '🎓',
      rig: 'Apple IIe Color Rig',
      joined: '2026-10-24'
    }
  };

  const RetroAuth = {
    DEMO_ACCOUNTS,

    // Get currently logged-in user
    getCurrentUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        return null;
      }
    },

    isLoggedIn() {
      return this.getCurrentUser() !== null;
    },

    // Login with credentials or demo user
    login(handle, password, extraMeta = {}) {
      const cleanHandle = (handle || 'ANONYMOUS_HACKER').trim().toUpperCase().replace(/\s+/g, '_');
      
      const user = {
        handle: cleanHandle,
        name: extraMeta.name || cleanHandle,
        role: extraMeta.role || 'Restored Hardware Curator',
        clearance: extraMeta.clearance || 'LEVEL 3: OPERATIVE',
        avatar: extraMeta.avatar || '👤',
        rig: extraMeta.rig || 'Commodore 64 / MOS 6502',
        joined: extraMeta.joined || new Date().toISOString().slice(0, 10),
        lastLogin: new Date().toLocaleTimeString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Storage error', e);
      }

      this.updateAllAuthUIs();

      if (window.showRetroToast) {
        window.showRetroToast(`CLEARANCE GRANTED: ${user.handle}`, '🔑');
      }
      if (window.retroAudio) {
        window.retroAudio.playCoin();
      }

      window.dispatchEvent(new CustomEvent('retro-auth-change', { detail: user }));
      return user;
    },

    // Quick demo login
    quickDemoLogin(key) {
      const account = DEMO_ACCOUNTS[key] || DEMO_ACCOUNTS.ada;
      return this.login(account.handle, '1984', account);
    },

    // Register a new operative account
    register(formData) {
      return this.login(formData.handle, formData.password, {
        name: formData.name || formData.handle,
        role: formData.role || 'Silicon Archivist',
        clearance: formData.clearance || 'LEVEL 2: SCHOLAR',
        avatar: formData.avatar || '👾',
        rig: formData.rig || 'MOS 6502 System'
      });
    },

    // Logout and purge session
    logout() {
      const user = this.getCurrentUser();
      localStorage.removeItem(STORAGE_KEY);
      
      this.updateAllAuthUIs();

      if (window.showRetroToast) {
        window.showRetroToast('TERMINAL DISCONNECTED: LOGGED OUT', '🔒');
      }
      if (window.retroAudio) {
        window.retroAudio.playBlip();
      }

      window.dispatchEvent(new CustomEvent('retro-auth-change', { detail: null }));
    },

    // Render / Update Header Widget
    updateAllAuthUIs() {
      const authContainers = document.querySelectorAll('.header-auth-container, #header-user-auth');
      const currentUser = this.getCurrentUser();

      authContainers.forEach(container => {
        if (!container) return;

        if (!currentUser) {
          // Logged-out state: Clean, retro-futuristic Login Pill
          container.innerHTML = `
            <a href="login.html" class="header-auth-login-btn" id="header-auth-login-link" title="Terminal Authorization Gate">
              <span class="auth-icon-pulse">🔑</span>
              <span class="auth-btn-label">LOGIN</span>
            </a>
          `;
        } else {
          // Logged-in state: Profile Pill with Dropdown
          container.innerHTML = `
            <div class="header-profile-dropdown-wrapper">
              <button class="header-profile-btn" id="header-profile-toggle" aria-expanded="false" title="Click to view Operative Dossier">
                <span class="profile-avatar-icon">${currentUser.avatar || '👤'}</span>
                <span class="profile-handle-text">${currentUser.handle}</span>
                <span class="profile-status-dot" title="System Online"></span>
                <span class="profile-arrow">▼</span>
              </button>
              
              <div class="header-profile-menu" id="header-profile-menu">
                <div class="profile-menu-header">
                  <div class="profile-menu-avatar">${currentUser.avatar || '👤'}</div>
                  <div class="profile-menu-info">
                    <div class="profile-menu-handle glow-text-cyan">${currentUser.handle}</div>
                    <div class="profile-menu-clearance glow-text-yellow">${currentUser.clearance}</div>
                  </div>
                </div>

                <div class="profile-menu-details">
                  <div class="profile-meta-row"><span>ROLE:</span> <strong>${currentUser.role}</strong></div>
                  <div class="profile-meta-row"><span>PRIMARY RIG:</span> <strong>${currentUser.rig}</strong></div>
                  <div class="profile-meta-row"><span>AUTHORIZED:</span> <strong>${currentUser.joined}</strong></div>
                </div>

                <div class="profile-menu-actions">
                  <a href="visit.html#tickets" class="profile-action-link">🎟 MY ADMISSION PASS</a>
                  <a href="arcade.html#terminal" class="profile-action-link">💻 COMMAND PROMPT CLI</a>
                  <a href="about.html#quiz" class="profile-action-link">📜 CURATOR EXAM STATUS</a>
                  <button type="button" class="pixel-btn pixel-btn-sm pixel-btn-secondary profile-logout-btn" id="btn-profile-logout">
                    🔒 DISCONNECT / LOGOUT
                  </button>
                </div>
              </div>
            </div>
          `;

          // Attach dropdown toggle event
          const toggleBtn = container.querySelector('#header-profile-toggle');
          const menu = container.querySelector('#header-profile-menu');
          const logoutBtn = container.querySelector('#btn-profile-logout');

          if (toggleBtn && menu) {
            toggleBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const isOpen = menu.classList.toggle('active');
              toggleBtn.setAttribute('aria-expanded', isOpen);
              if (isOpen && window.retroAudio) {
                window.retroAudio.playBlip();
              }
            });
          }

          if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              RetroAuth.logout();
            });
          }
        }
      });

      // Ensure nav-menu contains strictly navigation links (no intrusive auth cards)
      document.querySelectorAll('.mobile-drawer-auth-card').forEach(el => el.remove());
    },

    // Global click listener to close open profile dropdown
    initGlobalListeners() {
      document.addEventListener('click', (e) => {
        const openMenus = document.querySelectorAll('.header-profile-menu.active');
        openMenus.forEach(menu => {
          if (!menu.closest('.header-profile-dropdown-wrapper')?.contains(e.target)) {
            menu.classList.remove('active');
            const toggle = menu.closest('.header-profile-dropdown-wrapper')?.querySelector('#header-profile-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openMenus = document.querySelectorAll('.header-profile-menu.active');
          openMenus.forEach(menu => menu.classList.remove('active'));
        }
      });
    }
  };

  // Auto-initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    RetroAuth.updateAllAuthUIs();
    RetroAuth.initGlobalListeners();
  });

  window.RetroAuth = RetroAuth;

})(window);
