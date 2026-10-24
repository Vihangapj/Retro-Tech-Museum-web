/**
 * Retro Tech Museum - Exhibits & Artifact Database Controller
 * Features real museum photographs alongside pixel vector art,
 * category filtering, live search, modal inspection, and hardware sound synthesis.
 */

const RETRO_ARTIFACTS = [
  {
    id: 'c64',
    name: 'Commodore 64',
    category: 'computers',
    year: '1982',
    creator: 'Commodore International',
    realImage: 'images/c64.jpg',
    specs: {
      cpu: 'MOS 6510 @ 1.023 MHz',
      ram: '64 KB RAM',
      sound: 'SID 6581 (3-voice synth)',
      graphics: 'VIC-II (320x200, 16 colors)',
      originalPrice: '$595 USD (approx. $1,800 today)'
    },
    description: 'The highest-selling single computer model in human history, with an estimated 17 million units sold. Introduced the world to accessible home computing, BASIC programming, and iconic chiptune music through its legendary SID chip.',
    significance: 'Democratized computing for teenagers, bedroom game developers, and artists across the globe during the early 1980s.',
    soundType: 'c64'
  },
  {
    id: 'apple2',
    name: 'Apple IIe',
    category: 'computers',
    year: '1977',
    creator: 'Steve Wozniak & Steve Jobs',
    realImage: 'images/apple2.jpg',
    specs: {
      cpu: 'MOS 6502 @ 1.02 MHz',
      ram: '64 KB expandable to 128 KB',
      sound: 'Built-in 1-bit speaker',
      storage: 'Dual 5.25" Floppy Disk Drives',
      originalPrice: '$1,395 USD'
    },
    description: 'A masterpiece of minimalist electrical engineering designed by Steve Wozniak. The Apple II featured color graphics, expansion slots, and launched VisiCalc—the spreadsheet software that convinced business executives to buy computers.',
    significance: 'Turned Apple from a Silicon Valley garage hobby into a fortune 500 company and defined personal business computers.',
    soundType: 'floppy'
  },
  {
    id: 'ibm5150',
    name: 'IBM Personal Computer 5150',
    category: 'computers',
    year: '1981',
    creator: 'IBM Entry Level Systems (Boca Raton)',
    realImage: 'images/ibm5150.jpg',
    specs: {
      cpu: 'Intel 8088 @ 4.77 MHz',
      ram: '16 KB - 256 KB',
      os: 'IBM PC DOS 1.0 (Microsoft)',
      display: 'Monochrome Green or CGA Color',
      originalPrice: '$1,565 USD base'
    },
    description: 'The machine that coined the term "PC". Built in just 12 months using off-the-shelf commercial components and an open architecture, unwittingly birthing the global IBM-compatible clone industry.',
    significance: 'Legitimized desktop computers for mainstream banking, enterprise, and academia.',
    soundType: 'boot'
  },
  {
    id: 'gameboy',
    name: 'Nintendo Game Boy (DMG-01)',
    category: 'gaming',
    year: '1989',
    creator: 'Gunpei Yokoi & Nintendo R&D1',
    realImage: 'images/gameboy.jpg',
    specs: {
      cpu: 'Sharp LR35902 (Z80-hybrid) @ 4.19 MHz',
      ram: '8 KB work RAM + 8 KB VRAM',
      screen: '2.6" Reflective LCD (160x144, 4 shades of olive green)',
      power: '4x AA Batteries (30+ hours life!)',
      originalPrice: '$89.99 USD'
    },
    description: 'Gunpei Yokoi applied his philosophy of "Lateral Thinking with Withered Technology"—prioritizing battery life and rock-solid durability over fancy color screens. Bundled with Tetris, it became an unstoppable global phenomenon.',
    significance: 'Established handheld gaming as a dominant medium and sold over 118 million units worldwide alongside Game Boy Color.',
    soundType: 'gameboy'
  },
  {
    id: 'nes',
    name: 'Nintendo Entertainment System (NES / Famicom)',
    category: 'gaming',
    year: '1983',
    creator: 'Masayuki Uemura & Nintendo',
    realImage: 'images/nes.jpg',
    specs: {
      cpu: 'Ricoh 2A03 (8-bit 6502) @ 1.79 MHz',
      ram: '2 KB RAM + 2 KB VRAM',
      sound: '5-channel PSG (Pulse, Triangle, Noise, DPCM)',
      resolution: '256x240 pixels (54 colors palette)',
      originalPrice: '$179.99 USD'
    },
    description: 'Single-handedly revived the North American video game industry after the disastrous 1983 crash. Introduced iconic gaming franchises: Super Mario Bros, The Legend of Zelda, and Metroid.',
    significance: 'Pioneered strict third-party licensing, strict quality verification, and defined controller standards with the cross-shaped D-Pad.',
    soundType: 'coin'
  },
  {
    id: 'walkman',
    name: 'Sony Walkman TPS-L2',
    category: 'audio',
    year: '1979',
    creator: 'Nobutoshi Kihara & Akio Morita (Sony)',
    realImage: 'images/walkman.jpg',
    specs: {
      format: 'Compact Audio Cassette Tape',
      headphones: 'Dual 3.5mm mini-jacks (stereo)',
      power: '2x AA Batteries',
      features: '"Hot Line" button with built-in mic',
      originalPrice: '33,000 Yen / $150 USD'
    },
    description: 'The world\'s first portable stereo cassette player. It freed music from living rooms and cars, allowing people to carry their personal soundtrack everywhere they walked, jogged, or commuted.',
    significance: 'Fundamentally changed the relationship between humans, privacy, and public space, inspiring modern portable audio players like iPods and smartphones.',
    soundType: 'cassette'
  },
  {
    id: 'dynatac',
    name: 'Motorola DynaTAC 8000X',
    category: 'telecom',
    year: '1983',
    creator: 'Martin Cooper & Rudy Krolopp',
    realImage: 'images/dynatac.jpg',
    specs: {
      weight: '790 grams (1.75 lbs)',
      dimensions: '25 x 3.9 x 8.9 cm ("The Brick")',
      talkTime: '30 minutes talk, 8 hours standby',
      rechargeTime: '10 hours',
      originalPrice: '$3,995 USD (approx. $12,000 today)'
    },
    description: 'The world\'s very first commercially available handheld cellular mobile phone. Martin Cooper made the historic first call in 1973 to his rival Joel Engel at Bell Labs from the streets of Manhattan.',
    significance: 'Freed telecommunication from copper wires tied to buildings, initiating the mobile revolution.',
    soundType: 'dial'
  },
  {
    id: 'modem',
    name: 'Hayes Smartmodem 1200',
    category: 'telecom',
    year: '1982',
    creator: 'Dennis Hayes & Dale Heatherington',
    realImage: 'images/modem.jpg',
    specs: {
      speed: '1200 baud (1.2 kbps)',
      commandSet: 'AT Command Set (industry standard)',
      interface: 'RS-232 Serial Port',
      connection: 'RJ11 Bell Telephone Jack',
      originalPrice: '$699 USD'
    },
    description: 'The pioneer of digital online networking before the World Wide Web existed. Users dialed bulletin board systems (BBS), CompuServe, and early Usenet nodes through screeching acoustic dial-up handshakes.',
    significance: 'Created the "AT" Hayes command protocol still embedded in cellular modems and satellite communicators today.',
    soundType: 'modem'
  },
  {
    id: 'floppy',
    name: '3.5-inch High-Density Floppy Disk',
    category: 'audio',
    year: '1986',
    creator: 'Sony & Industry Consortium',
    realImage: 'images/floppy.jpg',
    specs: {
      capacity: '1.44 MB',
      spinSpeed: '300 RPM',
      trackCount: '80 tracks per side (double-sided)',
      feature: 'Sliding metal protective shutter',
      originalPrice: '$5 per disk'
    },
    description: 'The quintessential icon of digital storage and the eternal "Save" button symbol in modern software. Provided durable, pocket-sized magnetic data transfer across PCs, Macs, and synthesizers.',
    significance: 'The de facto physical transport layer for software distribution, video game installations, and documents throughout the 1980s and 1990s.',
    soundType: 'floppy'
  }
];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderExhibitsGrid(RETRO_ARTIFACTS);
  initCategoryFilters();
  initSearch();
});

// Render cards dynamically
function renderExhibitsGrid(items) {
  const container = document.getElementById('exhibits-grid-container');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="pixel-box" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <p class="glow-text-pink pixel-font" style="font-size: 1rem; margin-bottom: 10px;">[ NO ARTIFACTS FOUND ]</p>
        <p style="color: var(--text-muted);">Try a different query or switch category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="pixel-box pixel-box-interactive exhibit-card" data-category="${item.category}">
      <div class="exhibit-img-frame" id="frame-${item.id}">
        <span class="exhibit-year-pill">${item.year}</span>
        <span class="exhibit-category-tag">${item.category.toUpperCase()}</span>
        <button class="img-view-toggle-btn" onclick="toggleArtifactView('${item.id}', this)" title="Switch Real Photo / Pixel Art">
          📷 REAL PHOTO
        </button>
        <img src="${item.realImage}" alt="${item.name}" class="exhibit-real-img" id="img-${item.id}" loading="lazy">
        <div class="exhibit-pixel-svg" id="svg-${item.id}" style="display: none;">
          ${getArtifactSvg(item.id)}
        </div>
      </div>

      <h3 class="exhibit-title glow-text-cyan">${item.name}</h3>
      <div class="exhibit-meta">
        <span>DEV: ${item.creator}</span>
      </div>
      <p class="exhibit-summary">${item.description.slice(0, 115)}...</p>

      <div class="exhibit-card-actions">
        <button class="pixel-btn pixel-btn-sm" onclick="openArtifactModal('${item.id}')">
          🔍 INSPECT
        </button>
        <button class="pixel-btn pixel-btn-sm pixel-btn-outline" onclick="triggerArtifactSound('${item.soundType}')" title="Test Authentic Audio">
          🔊 AUDIO
        </button>
      </div>
    </article>
  `).join('');

  if (window.retroAudio) {
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mouseenter', () => window.retroAudio.playBlip());
    });
  }
}

// Toggle between Real Photo & Pixel Art on cards
window.toggleArtifactView = function(id, btn) {
  const img = document.getElementById(`img-${id}`);
  const svg = document.getElementById(`svg-${id}`);
  if (!img || !svg) return;

  const isShowingPhoto = img.style.display !== 'none';
  if (isShowingPhoto) {
    img.style.display = 'none';
    svg.style.display = 'flex';
    if (btn) btn.innerHTML = '👾 PIXEL ART';
    if (window.showRetroToast) window.showRetroToast('VIEW: 8-BIT PIXEL ART', '👾');
  } else {
    img.style.display = 'block';
    svg.style.display = 'none';
    if (btn) btn.innerHTML = '📷 REAL PHOTO';
    if (window.showRetroToast) window.showRetroToast('VIEW: REAL ARTIFACT PHOTO', '📷');
  }
  if (window.retroAudio) window.retroAudio.playBlip();
};

// Category filter buttons
function initCategoryFilters() {
  const buttons = document.querySelectorAll('.filter-pill-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      const searchVal = document.getElementById('artifact-search-input')?.value.toLowerCase().trim() || '';

      filterAndRender(cat, searchVal);
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  });
}

// Search box
function initSearch() {
  const searchInput = document.getElementById('artifact-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const activeBtn = document.querySelector('.filter-pill-btn.active');
    const cat = activeBtn ? activeBtn.dataset.filter : 'all';
    filterAndRender(cat, e.target.value.toLowerCase().trim());
  });
}

function filterAndRender(category, query) {
  let filtered = RETRO_ARTIFACTS;

  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (query) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.creator.toLowerCase().includes(query) ||
      item.year.includes(query)
    );
  }

  renderExhibitsGrid(filtered);
}

// Open Detailed Modal
window.openArtifactModal = function(id) {
  const item = RETRO_ARTIFACTS.find(a => a.id === id);
  if (!item) return;

  const modal = document.getElementById('artifact-detail-modal');
  const modalContent = document.getElementById('artifact-modal-body');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <!-- Top Image View with Responsive Toggle -->
    <div class="modal-img-container">
      <img id="modal-real-img" src="${item.realImage}" alt="${item.name}" class="modal-real-img">
      <div id="modal-svg-wrap" class="modal-svg-wrap" style="display: none;">
        <div class="modal-svg-inner">
          ${getArtifactSvg(item.id)}
        </div>
      </div>
      <div class="modal-view-toggle-bar">
        <button id="btn-modal-view-photo" class="pixel-btn pixel-btn-sm" onclick="switchModalView(true)">
          📷 REAL PHOTO
        </button>
        <button id="btn-modal-view-pixel" class="pixel-btn pixel-btn-sm pixel-btn-outline" onclick="switchModalView(false)">
          👾 PIXEL ART
        </button>
      </div>
    </div>

    <div class="modal-header-meta">
      <span class="pixel-badge pixel-badge-yellow">ORIGINAL LAUNCH: ${item.year}</span>
      <h2 class="glow-text-cyan modal-item-title">${item.name}</h2>
      <p class="modal-item-author">Designed by ${item.creator}</p>
    </div>

    <div class="pixel-box modal-specs-box">
      <h4 class="glow-text-pink modal-specs-heading">HARDWARE SPECIFICATIONS:</h4>
      <div class="modal-specs-grid">
        <div class="modal-spec-item"><strong>PROCESSOR:</strong> <span>${item.specs.cpu || 'N/A'}</span></div>
        <div class="modal-spec-item"><strong>MEMORY:</strong> <span>${item.specs.ram || 'N/A'}</span></div>
        <div class="modal-spec-item"><strong>GRAPHICS/DISPLAY:</strong> <span>${item.specs.graphics || item.specs.screen || 'N/A'}</span></div>
        <div class="modal-spec-item"><strong>SOUND CHIP:</strong> <span>${item.specs.sound || 'Mono Output'}</span></div>
        <div class="modal-spec-item modal-spec-full"><strong>ORIGINAL LAUNCH PRICE:</strong> <span>${item.specs.originalPrice}</span></div>
      </div>
    </div>

    <div class="modal-section-block">
      <h4 class="glow-text-cyan modal-section-title">HISTORICAL SIGNIFICANCE:</h4>
      <p class="modal-section-desc">${item.description}</p>
    </div>

    <div class="modal-quote-block">
      <p class="modal-quote-text">
        "${item.significance}"
      </p>
    </div>

    <div class="modal-actions-bar">
      <button class="pixel-btn pixel-btn-accent" onclick="triggerArtifactSound('${item.soundType}')">
        🔊 TEST HARDWARE SOUND
      </button>
      <button class="pixel-btn pixel-btn-outline" onclick="window.closeArtifactModal()">
        CLOSE
      </button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const innerModal = modal.querySelector('.pixel-modal');
  if (innerModal) innerModal.scrollTop = 0;
  if (window.retroAudio) window.retroAudio.playCoin();
};

window.closeArtifactModal = function() {
  const modal = document.getElementById('artifact-detail-modal');
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
  if (window.retroAudio) window.retroAudio.playBlip();
};

window.switchModalView = function(showPhoto) {
  const photoEl = document.getElementById('modal-real-img');
  const svgEl = document.getElementById('modal-svg-wrap');
  const btnPhoto = document.getElementById('btn-modal-view-photo');
  const btnPixel = document.getElementById('btn-modal-view-pixel');

  if (!photoEl || !svgEl) return;

  if (showPhoto) {
    photoEl.style.display = 'block';
    svgEl.style.display = 'none';
    if (btnPhoto) btnPhoto.className = 'pixel-btn pixel-btn-sm';
    if (btnPixel) btnPixel.className = 'pixel-btn pixel-btn-sm pixel-btn-outline';
  } else {
    photoEl.style.display = 'none';
    svgEl.style.display = 'flex';
    if (btnPhoto) btnPhoto.className = 'pixel-btn pixel-btn-sm pixel-btn-outline';
    if (btnPixel) btnPixel.className = 'pixel-btn pixel-btn-sm';
  }
  if (window.retroAudio) window.retroAudio.playBlip();
};

// Hardware Sound Diagnostic Trigger
window.triggerArtifactSound = function(type) {
  if (!window.retroAudio) return;
  switch (type) {
    case 'floppy':
      window.retroAudio.playDiskSeek();
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: 5.25" FLOPPY SEEK', '💾');
      break;
    case 'boot':
      window.retroAudio.playBootChime();
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: IBM POST CHIME', '⚡');
      break;
    case 'coin':
    case 'gameboy':
      window.retroAudio.playCoin();
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: 8-BIT COIN PING', '🕹');
      break;
    case 'dial':
    case 'modem':
      playModemHandshake();
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: 1200 BAUD MODEM SQUEAL', '📞');
      break;
    case 'c64':
      window.retroAudio.playBootChime();
      setTimeout(() => window.retroAudio.playCoin(), 300);
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: C64 SID ARPEGGIO', '🎹');
      break;
    case 'cassette':
      window.retroAudio.playDiskSeek();
      if (window.showRetroToast) window.showRetroToast('AUDIO TEST: CASSETTE MOTOR SEEK', '📼');
      break;
    default:
      window.retroAudio.playBlip();
  }
};

function playModemHandshake() {
  if (!window.retroAudio || !window.retroAudio.soundEnabled) return;
  window.retroAudio.init();
  const ctx = window.retroAudio.ctx;
  if (!ctx) return;

  try {
    const freqs = [1200, 2400, 1800, 980, 2225];
    freqs.forEach((f, idx) => {
      const t = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  } catch(e) {}
}

// Generate Pixel Art Vector Icons for each artifact
function getArtifactSvg(id) {
  switch (id) {
    case 'c64':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="25" width="80" height="40" fill="#a4937d" stroke="#000" stroke-width="2"/>
          <rect x="14" y="30" width="72" height="22" fill="#2d2925" stroke="#000" stroke-width="1.5"/>
          <rect x="18" y="33" width="12" height="6" fill="#151210"/>
          <rect x="33" y="33" width="12" height="6" fill="#151210"/>
          <rect x="48" y="33" width="12" height="6" fill="#151210"/>
          <rect x="63" y="33" width="16" height="6" fill="#151210"/>
          <rect x="18" y="42" width="20" height="6" fill="#151210"/>
          <rect x="42" y="42" width="30" height="6" fill="#151210"/>
          <rect x="14" y="56" width="6" height="3" fill="#ff0000"/>
          <rect x="20" y="56" width="6" height="3" fill="#ffaa00"/>
          <rect x="26" y="56" width="6" height="3" fill="#33ff33"/>
          <rect x="32" y="56" width="6" height="3" fill="#00ffff"/>
          <circle cx="78" cy="58" r="3" fill="#ff3333"/>
        </svg>
      `;
    case 'apple2':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="15,45 25,18 75,18 85,45 85,68 15,68" fill="#d8cbaf" stroke="#000" stroke-width="2"/>
          <polygon points="20,46 26,22 74,22 80,46" fill="#2d2822"/>
          <rect x="20" y="52" width="6" height="6" fill="#33ff33"/>
          <rect x="20" y="58" width="6" height="4" fill="#ffaa00"/>
          <line x1="55" y1="52" x2="78" y2="52" stroke="#4a3e2c" stroke-width="2"/>
          <line x1="55" y1="58" x2="78" y2="58" stroke="#4a3e2c" stroke-width="2"/>
        </svg>
      `;
    case 'ibm5150':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="10" width="56" height="38" fill="#ccc1a7" stroke="#000" stroke-width="2"/>
          <rect x="28" y="15" width="44" height="26" fill="#071b0b" stroke="#000" stroke-width="1.5"/>
          <rect x="33" y="20" width="12" height="4" fill="#33ff33"/>
          <rect x="33" y="28" width="22" height="4" fill="#33ff33"/>
          <rect x="10" y="48" width="80" height="24" fill="#baa98e" stroke="#000" stroke-width="2"/>
          <rect x="58" y="53" width="26" height="6" fill="#111"/>
          <rect x="58" y="61" width="26" height="6" fill="#111"/>
          <circle cx="20" cy="60" r="3" fill="#ff3300"/>
        </svg>
      `;
    case 'gameboy':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="26" y="8" width="48" height="68" rx="4" fill="#c8c7c2" stroke="#000" stroke-width="2"/>
          <polygon points="32,15 68,15 68,40 64,44 32,44" fill="#58595b" stroke="#000" stroke-width="1"/>
          <rect x="38" y="18" width="24" height="20" fill="#8bac0f"/>
          <rect x="33" y="52" width="10" height="4" fill="#1a1a1a"/>
          <rect x="36" y="49" width="4" height="10" fill="#1a1a1a"/>
          <circle cx="61" cy="51" r="3" fill="#990033"/>
          <circle cx="55" cy="55" r="3" fill="#990033"/>
          <rect x="42" y="66" width="6" height="2" fill="#58595b" transform="rotate(-25 42 66)"/>
          <rect x="50" y="66" width="6" height="2" fill="#58595b" transform="rotate(-25 50 66)"/>
        </svg>
      `;
    case 'nes':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="24" width="76" height="42" fill="#cccccc" stroke="#000" stroke-width="2"/>
          <rect x="12" y="44" width="76" height="22" fill="#777777" stroke="#000" stroke-width="1"/>
          <rect x="18" y="28" width="50" height="12" fill="#333333"/>
          <rect x="22" y="52" width="8" height="5" fill="#ff0000"/>
          <rect x="34" y="52" width="8" height="5" fill="#111111"/>
          <rect x="54" y="52" width="12" height="7" fill="#111111"/>
          <rect x="70" y="52" width="12" height="7" fill="#111111"/>
        </svg>
      `;
    case 'walkman':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="12" width="52" height="60" fill="#1c4b82" stroke="#000" stroke-width="2"/>
          <rect x="24" y="12" width="52" height="15" fill="#b0b5b8" stroke="#000" stroke-width="1.5"/>
          <rect x="30" y="32" width="40" height="24" fill="#0d1b2a" stroke="#fff" stroke-width="1"/>
          <circle cx="42" cy="44" r="5" fill="#ffaa00"/>
          <circle cx="58" cy="44" r="5" fill="#ffaa00"/>
          <rect x="62" y="16" width="8" height="6" fill="#ff5500"/>
        </svg>
      `;
    case 'dynatac':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <line x1="38" y1="6" x2="38" y2="22" stroke="#111" stroke-width="3"/>
          <rect x="32" y="22" width="36" height="54" fill="#e8dfd5" stroke="#000" stroke-width="2"/>
          <rect x="38" y="26" width="24" height="7" fill="#800000"/>
          <text x="40" y="32" fill="#ff3333" font-size="5" font-family="monospace">8000X</text>
          <rect x="38" y="37" width="5" height="4" fill="#333"/>
          <rect x="47" y="37" width="5" height="4" fill="#333"/>
          <rect x="56" y="37" width="5" height="4" fill="#333"/>
          <rect x="38" y="44" width="5" height="4" fill="#333"/>
          <rect x="47" y="44" width="5" height="4" fill="#333"/>
          <rect x="56" y="44" width="5" height="4" fill="#333"/>
          <rect x="38" y="51" width="5" height="4" fill="#333"/>
          <rect x="47" y="51" width="5" height="4" fill="#333"/>
          <rect x="56" y="51" width="5" height="4" fill="#333"/>
        </svg>
      `;
    case 'modem':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="28" width="72" height="30" fill="#999999" stroke="#000" stroke-width="2"/>
          <rect x="14" y="44" width="72" height="14" fill="#222222"/>
          <circle cx="24" cy="51" r="2" fill="#ff3333"/>
          <circle cx="34" cy="51" r="2" fill="#33ff33"/>
          <circle cx="44" cy="51" r="2" fill="#ffaa00"/>
          <circle cx="54" cy="51" r="2" fill="#ff3333"/>
          <circle cx="64" cy="51" r="2" fill="#33ff33"/>
          <text x="20" y="38" fill="#111" font-size="5" font-family="monospace" font-weight="bold">SMARTMODEM 1200</text>
        </svg>
      `;
    case 'floppy':
      return `
        <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="24,14 70,14 76,20 76,66 24,66" fill="#1c538c" stroke="#000" stroke-width="2"/>
          <rect x="36" y="14" width="28" height="24" fill="#d1d5db" stroke="#000" stroke-width="1.5"/>
          <rect x="42" y="18" width="6" height="14" fill="#111"/>
          <rect x="30" y="42" width="40" height="20" fill="#fdfdfd" stroke="#000" stroke-width="1"/>
          <line x1="34" y1="48" x2="66" y2="48" stroke="#ff0000" stroke-width="1.5"/>
          <line x1="34" y1="54" x2="64" y2="54" stroke="#333" stroke-width="1"/>
        </svg>
      `;
    default:
      return `<svg viewBox="0 0 100 80"><rect width="100" height="80" fill="#333"/></svg>`;
  }
}
