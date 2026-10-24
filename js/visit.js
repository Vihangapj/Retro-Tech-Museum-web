/**
 * Retro Tech Museum - Visit Planner, 8-Bit Ticket Generator & Interactive Floor Map
 */

document.addEventListener('DOMContentLoaded', () => {
  initTicketGenerator();
  initFloorMap();
  initGuestbook();
});

/* ==========================================================================
   8-BIT RETRO TICKET GENERATOR (HTML5 CANVAS RENDERING & PNG DOWNLOAD)
   ========================================================================== */
function initTicketGenerator() {
  const canvas = document.getElementById('ticketCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = 620;
  canvas.height = 260;

  const nameInput = document.getElementById('ticket-name');
  const typeSelect = document.getElementById('ticket-type');
  const dateInput = document.getElementById('ticket-date');
  const deviceSelect = document.getElementById('ticket-device');
  const downloadBtn = document.getElementById('btn-download-ticket');
  const generateBtn = document.getElementById('btn-generate-ticket');

  // Default date to tomorrow
  if (dateInput && !dateInput.value) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    dateInput.value = tmrw.toISOString().split('T')[0];
  }

  function drawTicket() {
    const visitorName = (nameInput?.value.trim() || 'RETRO EXPLORER').toUpperCase();
    const ticketTier = (typeSelect?.value || 'STUDENT EXPLORER').toUpperCase();
    const visitDate = dateInput?.value || '2026-10-25';
    const favoriteDevice = (deviceSelect?.value || 'COMMODORE 64').toUpperCase();

    // Background - Vintage Cyber Matrix Ticket Card
    ctx.fillStyle = '#100d24';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Chunky Beveled Pixel Border
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Perforation Tear Line (Right Stub)
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#ff007f';
    ctx.beginPath();
    ctx.moveTo(460, 4);
    ctx.lineTo(460, canvas.height - 4);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Semi-circle perforation notches on stub line
    ctx.fillStyle = '#06040d';
    ctx.beginPath();
    ctx.arc(460, 4, 12, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(460, canvas.height - 4, 12, Math.PI, 0);
    ctx.fill();

    // Header banner
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(8, 8, 448, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('RETRO TECH MUSEUM', 20, 32);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffe600';
    ctx.fillText('SILICON COMPUTING ARCHIVE', 20, 64);

    // Visitor Details Main Body
    ctx.fillStyle = '#9aa8b8';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('VISITOR PASS:', 20, 96);
    ctx.fillStyle = '#00ffcc';
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText(visitorName.slice(0, 22), 20, 118);

    ctx.fillStyle = '#9aa8b8';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('ACCESS TIER:', 20, 150);
    ctx.fillStyle = '#ffe600';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillText(ticketTier, 20, 170);

    ctx.fillStyle = '#9aa8b8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(`DATE: ${visitDate}   |   FAVORITE: ${favoriteDevice}`, 20, 204);

    ctx.fillStyle = '#5c677d';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('PASS CODE: RTM-KDY-84-' + Math.floor(1000 + Math.random() * 8999), 20, 235);

    // Right Stub: Barcode & QR Stamp
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(468, 8, 144, 38);
    ctx.fillStyle = '#000000';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ADMIT ONE', 540, 32);

    // Draw Simulated 8-Bit Barcode
    const barX = 480;
    const barY = 65;
    const barW = 120;
    const barH = 55;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#000000';

    // Randomized lines for barcode
    const barPattern = [3, 2, 5, 2, 1, 4, 2, 6, 2, 3, 4, 1, 3, 5, 2, 4, 2, 3, 5, 2];
    let curX = barX + 6;
    barPattern.forEach((w, i) => {
      if (i % 2 === 0) {
        ctx.fillRect(curX, barY + 4, w, barH - 8);
      }
      curX += w + 2;
    });

    // Holographic Seal
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(495, 140, 90, 85);
    ctx.fillStyle = '#0d0a1a';
    ctx.fillRect(499, 144, 82, 77);

    ctx.fillStyle = '#ffe600';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('OFFICIAL', 540, 168);
    ctx.fillText('SEAL', 540, 184);
    ctx.fillText('1984', 540, 202);
  }

  drawTicket();

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      drawTicket();
      if (window.retroAudio) window.retroAudio.playCoin();
    });
  }

  // Dynamic live re-draw on input changes
  [nameInput, typeSelect, dateInput, deviceSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', () => drawTicket());
    }
  });

    // PNG Ticket Download
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        drawTicket();
        const link = document.createElement('a');
        link.download = `RetroTechMuseum_Ticket_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        if (window.retroAudio) window.retroAudio.playCoin();
        if (window.showRetroToast) window.showRetroToast('TICKET SAVED AS PNG IMAGE!', '🎟');
      });
    }
  }

  window.selectSector = function(zoneId) {
    const data = ZONE_DETAILS[zoneId];
    const infoBox = document.getElementById('map-zone-info');
    const mapZones = document.querySelectorAll('.map-zone');

    mapZones.forEach(z => {
      z.classList.remove('active-zone');
      z.style.borderColor = (z.dataset.zone === zoneId) ? 'var(--secondary)' : 'var(--primary)';
    });

    const targetZone = document.querySelector(`.map-zone[data-zone="${zoneId}"]`);
    if (targetZone) targetZone.classList.add('active-zone');

    if (data && infoBox) {
      infoBox.innerHTML = `
        <div class="pixel-box" style="border-color: var(--secondary);">
          <span class="pixel-badge pixel-badge-yellow" style="margin-bottom: 8px;">SELECTED EXHIBIT SECTOR</span>
          <h3 class="glow-text-cyan" style="font-size: 1.1rem; margin-top: 6px; margin-bottom: 10px;">${data.title}</h3>
          <p style="font-family: var(--font-tech); font-size: 1rem; color: var(--text-main); margin-bottom: 14px;">${data.desc}</p>
          <div>
            <strong style="color: var(--secondary); font-family: var(--font-pixel); font-size: 0.65rem;">KEY HIGHLIGHTS:</strong>
            <ul style="list-style: none; margin-top: 8px; font-family: var(--font-tech);">
              ${data.highlights.map(h => `<li style="margin-bottom: 4px;">► ${h}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      infoBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (window.retroAudio) window.retroAudio.playCoin();
    }
  };

  function initFloorMap() {
    const mapZones = document.querySelectorAll('.map-zone');
    mapZones.forEach(zone => {
      zone.addEventListener('click', () => {
        window.selectSector(zone.dataset.zone);
      });
    });
  }

/* ==========================================================================
   VISITOR GUESTBOOK (LOCAL STORAGE POWERED)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const entriesContainer = document.getElementById('guestbook-entries');
  if (!form || !entriesContainer) return;

  const DEFAULT_ENTRIES = [
    {
      name: 'Archive Curator',
      time: '10 mins ago',
      msg: 'Welcome to all retro enthusiasts! Honoring computing pioneers and celebrating vintage hardware excellence!',
      badge: 'CURATOR'
    },
    {
      name: 'ByteHacker_84',
      time: '2 hours ago',
      msg: 'Hearing the Commodore 64 boot chime and testing the Hayes modem brought back so many golden memories!',
      badge: 'VISITOR'
    },
    {
      name: 'Ada_Fan_99',
      time: 'Yesterday',
      msg: 'The tribute wing to Grace Hopper and Margaret Hamilton is inspirational. Beautiful pixel-art aesthetics!',
      badge: 'STUDENT'
    }
  ];

  function loadGuestbook() {
    const saved = localStorage.getItem('retro_guestbook_entries');
    let entries = saved ? JSON.parse(saved) : DEFAULT_ENTRIES;

    entriesContainer.innerHTML = entries.map(e => `
      <div class="pixel-box" style="margin-bottom: 14px; padding: 14px; background: #0e0b1d;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div>
            <strong class="glow-text-cyan" style="font-family: var(--font-pixel); font-size: 0.72rem;">${escapeHtml(e.name)}</strong>
            <span class="pixel-badge ${e.badge === 'CURATOR' ? 'pixel-badge-pink' : 'pixel-badge-yellow'}" style="margin-left: 6px;">${e.badge}</span>
          </div>
          <span style="font-family: var(--font-terminal); font-size: 1rem; color: var(--text-dim);">${e.time}</span>
        </div>
        <p style="font-family: var(--font-tech); font-size: 0.95rem; color: var(--text-main);">${escapeHtml(e.msg)}</p>
      </div>
    `).join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('guest-name');
    const msgInput = document.getElementById('guest-message');

    if (!nameInput.value.trim() || !msgInput.value.trim()) return;

    const saved = localStorage.getItem('retro_guestbook_entries');
    let entries = saved ? JSON.parse(saved) : DEFAULT_ENTRIES;

    entries.unshift({
      name: nameInput.value.trim(),
      time: 'Just now',
      msg: msgInput.value.trim(),
      badge: 'VISITOR'
    });

    localStorage.setItem('retro_guestbook_entries', JSON.stringify(entries.slice(0, 20)));
    nameInput.value = '';
    msgInput.value = '';

    loadGuestbook();
    if (window.retroAudio) window.retroAudio.playCoin();
    if (window.showRetroToast) window.showRetroToast('LOG TRANSMISSION ARCHIVED!', '💾');
  });

  loadGuestbook();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
