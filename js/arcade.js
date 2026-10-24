/**
 * Retro Tech Museum - Arcade Canvas Game ("Byte Defender 1984") & Vintage DOS Terminal
 * Pure Canvas 2D + Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initByteDefenderGame();
  initDosTerminal();
});

/* ==========================================================================
   BYTE DEFENDER 1984 - CANVAS RETRO SHOOTER
   ========================================================================== */
function initByteDefenderGame() {
  const canvas = document.getElementById('arcadeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Virtual resolution
  canvas.width = 640;
  canvas.height = 400;

  let gameState = 'START'; // START, PLAYING, GAMEOVER
  let score = 0;
  let highScore = parseInt(localStorage.getItem('retro_arcade_hiscore') || '1984', 10);
  let lives = 3;
  let wave = 1;

  // Player ship
  const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height - 40,
    w: 32,
    h: 20,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    shootCooldown: 0
  };

  let lasers = [];
  let enemies = [];
  let particles = [];
  let stars = [];

  // Generate starfield
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1.5,
      size: Math.random() > 0.8 ? 2 : 1
    });
  }

  function spawnEnemies() {
    enemies = [];
    const rows = 3;
    const cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: 80 + c * 60,
          y: 40 + r * 45,
          w: 24,
          h: 18,
          dx: 1.2 + wave * 0.3,
          color: r === 0 ? '#ff007f' : (r === 1 ? '#00ffcc' : '#ffe600'),
          points: (3 - r) * 10
        });
      }
    }
  }

  // Input Listeners
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) player.movingLeft = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) player.movingRight = true;
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState === 'START' || gameState === 'GAMEOVER') {
        startGame();
      } else if (gameState === 'PLAYING') {
        shootLaser();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) player.movingLeft = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) player.movingRight = false;
  });

  // Touch / Mobile Onscreen Buttons
  const btnLeft = document.getElementById('arcade-btn-left');
  const btnRight = document.getElementById('arcade-btn-right');
  const btnFire = document.getElementById('arcade-btn-fire');
  const btnStart = document.getElementById('arcade-btn-start');

  const setupTouchBtn = (btn, onStart, onEnd) => {
    if (!btn) return;
    const startHandler = (e) => {
      e.preventDefault();
      onStart();
    };
    const endHandler = (e) => {
      e.preventDefault();
      onEnd();
    };
    btn.addEventListener('touchstart', startHandler, { passive: false });
    btn.addEventListener('touchend', endHandler, { passive: false });
    btn.addEventListener('touchcancel', endHandler, { passive: false });
    btn.addEventListener('pointerdown', onStart);
    btn.addEventListener('pointerup', onEnd);
    btn.addEventListener('pointerleave', onEnd);
  };

  setupTouchBtn(btnLeft, () => player.movingLeft = true, () => player.movingLeft = false);
  setupTouchBtn(btnRight, () => player.movingRight = true, () => player.movingRight = false);

  if (btnFire) {
    const fireHandler = (e) => {
      e.preventDefault();
      if (gameState === 'PLAYING') shootLaser();
      else startGame();
    };
    btnFire.addEventListener('touchstart', fireHandler, { passive: false });
    btnFire.addEventListener('click', fireHandler);
  }

  if (btnStart) {
    const startHandler = (e) => {
      e.preventDefault();
      startGame();
    };
    btnStart.addEventListener('touchstart', startHandler, { passive: false });
    btnStart.addEventListener('click', startHandler);
  }

  function shootLaser() {
    if (player.shootCooldown <= 0) {
      lasers.push({
        x: player.x + player.w / 2 - 2,
        y: player.y,
        w: 4,
        h: 10,
        speed: 8
      });
      player.shootCooldown = 14;
      if (window.retroAudio) window.retroAudio.playLaser();
    }
  }

  function startGame() {
    gameState = 'PLAYING';
    score = 0;
    lives = 3;
    wave = 1;
    lasers = [];
    particles = [];
    player.x = canvas.width / 2 - 16;
    spawnEnemies();
    updateDashboard();
    if (window.retroAudio) window.retroAudio.playCoin();
  }

  function addExplosion(x, y, color) {
    if (window.retroAudio) window.retroAudio.playExplosion();
    for (let i = 0; i < 16; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 20 + Math.random() * 15,
        color: color
      });
    }
  }

  function updateDashboard() {
    const scoreEl = document.getElementById('arcade-score-val');
    const hiScoreEl = document.getElementById('arcade-hiscore-val');
    const livesEl = document.getElementById('arcade-lives-val');
    const waveEl = document.getElementById('arcade-wave-val');

    if (scoreEl) scoreEl.textContent = String(score).padStart(5, '0');
    if (hiScoreEl) hiScoreEl.textContent = String(highScore).padStart(5, '0');
    if (livesEl) livesEl.textContent = '♥'.repeat(Math.max(0, lives));
    if (waveEl) waveEl.textContent = String(wave);
  }

  // Main Game Loop
  function gameLoop() {
    // Clear Screen
    ctx.fillStyle = '#06040d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Starfield
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    });

    if (gameState === 'START') {
      drawStartScreen();
    } else if (gameState === 'PLAYING') {
      updateAndDrawPlay();
    } else if (gameState === 'GAMEOVER') {
      drawGameOverScreen();
    }

    requestAnimationFrame(gameLoop);
  }

  function drawStartScreen() {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ffcc';
    ctx.font = '22px "Press Start 2P", monospace';
    ctx.fillText('BYTE DEFENDER 1984', canvas.width / 2, 140);

    ctx.fillStyle = '#ff007f';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('RETRO TECH MUSEUM ARCADE EDITION', canvas.width / 2, 180);

    ctx.fillStyle = '#ffe600';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText('PRESS [SPACEBAR] OR [FIRE] TO INSERT COIN', canvas.width / 2, 240);

    ctx.fillStyle = '#9aa8b8';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('USE LEFT / RIGHT ARROWS OR [A/D] TO MOVE', canvas.width / 2, 290);
  }

  function drawGameOverScreen() {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff007f';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillText('GAME OVER', canvas.width / 2, 160);

    ctx.fillStyle = '#ffe600';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, 210);

    ctx.fillStyle = '#00ffcc';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText('PRESS [SPACEBAR] TO TRY AGAIN', canvas.width / 2, 270);
  }

  function updateAndDrawPlay() {
    // Move Player
    if (player.movingLeft && player.x > 10) player.x -= player.speed;
    if (player.movingRight && player.x < canvas.width - player.w - 10) player.x += player.speed;
    if (player.shootCooldown > 0) player.shootCooldown--;

    // Draw Player Ship (Pixel graphic)
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(player.x + 12, player.y, 8, 4); // tip
    ctx.fillRect(player.x + 8, player.y + 4, 16, 6); // mid
    ctx.fillRect(player.x, player.y + 10, 32, 8); // wings
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(player.x + 4, player.y + 18, 6, 4); // thrusters
    ctx.fillRect(player.x + 22, player.y + 18, 6, 4);

    // Update Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.y -= l.speed;
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(l.x, l.y, l.w, l.h);

      // Check laser vs enemy collision
      for (let j = enemies.length - 1; j >= 0; j--) {
        const en = enemies[j];
        if (
          l.x < en.x + en.w &&
          l.x + l.w > en.x &&
          l.y < en.y + en.h &&
          l.y + l.h > en.y
        ) {
          addExplosion(en.x + en.w / 2, en.y + en.h / 2, en.color);
          score += en.points;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('retro_arcade_hiscore', highScore);
          }
          enemies.splice(j, 1);
          lasers.splice(i, 1);
          updateDashboard();
          break;
        }
      }

      if (l && l.y < 0) lasers.splice(i, 1);
    }

    // Enemies update
    let hitEdge = false;
    enemies.forEach(en => {
      en.x += en.dx;
      if (en.x <= 15 || en.x + en.w >= canvas.width - 15) {
        hitEdge = true;
      }

      // Draw Enemy (Retro Alien Pixel shape)
      ctx.fillStyle = en.color;
      ctx.fillRect(en.x + 4, en.y, en.w - 8, 4);
      ctx.fillRect(en.x, en.y + 4, en.w, 6);
      ctx.fillRect(en.x + 4, en.y + 10, en.w - 8, 4);
      ctx.fillRect(en.x, en.y + 14, 4, 4);
      ctx.fillRect(en.x + en.w - 4, en.y + 14, 4, 4);

      // Alien eye dots
      ctx.fillStyle = '#000';
      ctx.fillRect(en.x + 6, en.y + 6, 3, 3);
      ctx.fillRect(en.x + en.w - 9, en.y + 6, 3, 3);

      // Enemy reaches player line
      if (en.y + en.h >= player.y) {
        lives = 0;
        gameState = 'GAMEOVER';
        addExplosion(player.x, player.y, '#00ffcc');
      }
    });

    if (hitEdge) {
      enemies.forEach(en => {
        en.dx = -en.dx * 1.05;
        en.y += 10;
      });
    }

    // All enemies defeated -> Next Wave
    if (enemies.length === 0) {
      wave++;
      score += 200;
      if (window.retroAudio) window.retroAudio.playCoin();
      spawnEnemies();
      updateDashboard();
    }

    // Update Particles
    for (let p = particles.length - 1; p >= 0; p--) {
      const part = particles[p];
      part.x += part.vx;
      part.y += part.vy;
      part.life--;
      ctx.fillStyle = part.color;
      ctx.fillRect(part.x, part.y, 3, 3);
      if (part.life <= 0) particles.splice(p, 1);
    }
  }

  updateDashboard();
  gameLoop();
}

/* ==========================================================================
   VINTAGE DOS / COMMODORE 64 INTERACTIVE TERMINAL EMULATOR
   ========================================================================== */
function initDosTerminal() {
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalOutput = document.getElementById('terminal-output-log');
  if (!terminalInput || !terminalOutput) return;

  const COMMANDS = {
    help: () => `
COMMANDS AVAILABLE:
  HELP            - Display this manual
  DIR / LS        - List files in current archive directory
  TYPE <filename> - Read the contents of a retro document
  BOOT C64        - Simulate Commodore 64 startup
  BOOT DOS        - Simulate MS-DOS 3.3 cold boot
  MATRIX          - Toggle the falling digital cyber rain
  DATE            - Query hardware RTC clock
  PLAY            - Synthesize 8-bit arpeggio melody
  CLS / CLEAR     - Wipe the CRT console screen
  ABOUT           - Learn about the Retro Tech Museum archive
  SECRET          - Reveal hidden curator's easter egg
`,
    dir: () => `
 Volume in drive C has no label.
 Directory of C:\\RETRO_TECH\\EXHIBITS

 10/24/1984  08:15 PM    <DIR>          .
 10/24/1984  08:15 PM    <DIR>          ..
 08/12/1981  02:30 AM           143,360 IBM_5150_BIOS.ROM
 04/23/1982  11:15 AM            65,536 C64_BASIC_V2.BIN
 09/01/1989  04:45 PM           262,144 TETRIS_DMG.GB
 10/24/2026  11:00 AM             2,048 ARCHIVE_MISSION.TXT
 07/20/1969  08:17 PM           131,072 APOLLO_AGC_GUIDANCE.ASM
               5 File(s)        604,160 bytes
               2 Dir(s)      14,336,000 bytes free
`,
    ls: () => COMMANDS.dir(),
    date: () => `CURRENT RTC TIME: ${new Date().toUTCString()}`,
    cls: () => {
      terminalOutput.innerHTML = '';
      return '';
    },
    clear: () => COMMANDS.cls(),
    about: () => `
=== RETRO TECH MUSEUM ARCHIVE ===
Dedicated to preserving the golden age of personal computing,
8-bit microprocessors, and the pioneering computer scientists
who shaped the global software landscape.
`,
    secret: () => `
*** CURATOR'S EASTER EGG UNLOCKED! ***
Konami Code Sequence: ↑ ↑ ↓ ↓ ← → ← → B A [START]
30 Extra lives granted to your imagination!
Keep hacking, keep innovating, and celebrate the pioneers!
`,
    'boot c64': () => {
      if (window.retroAudio) window.retroAudio.playBootChime();
      return `
    **** COMMODORE 64 BASIC V2 ****
 64K RAM SYSTEM  38911 BASIC BYTES FREE

READY.
10 PRINT "RETRO TECH MUSEUM - ARCHIVE SYSTEM"
20 GOTO 10
RUN
READY. █
`;
    },
    'boot dos': () => {
      if (window.retroAudio) window.retroAudio.playDiskSeek();
      return `
Starting MS-DOS 3.30...
HIMEM: Testing Extended Memory... Done. 640K Base Memory OK.
C:\\> SMARTDRV.SYS LOADED
C:\\> MOUSE.COM INSTALLED
C:\\> PROMPT $P$G
C:\\RETRO_TECH> _
`;
    },
    play: () => {
      if (window.retroAudio) {
        window.retroAudio.playBootChime();
        setTimeout(() => window.retroAudio.playCoin(), 350);
      }
      return 'SYNTHESIZING 8-BIT TONE SEQUENCE [OK]';
    },
    matrix: () => {
      triggerMatrixEffect();
      return 'CYBER MATRIX MODE ENGAGED. ENJOY THE PHOSPHOR CASCADE!';
    }
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputLine = terminalInput.value.trim();
      terminalInput.value = '';
      if (!inputLine) return;

      appendOutput(`C:\\RETRO_TECH> ${inputLine}`);

      const parts = inputLine.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').toLowerCase();

      if (cmd === 'type') {
        handleTypeCommand(arg);
      } else if (COMMANDS[inputLine.toLowerCase()]) {
        const res = COMMANDS[inputLine.toLowerCase()]();
        if (res) appendOutput(res);
      } else if (COMMANDS[cmd]) {
        const res = COMMANDS[cmd]();
        if (res) appendOutput(res);
      } else {
        appendOutput(`'${cmd}' is not recognized as an internal or external command.\nType 'HELP' for a directory of operations.`);
        if (window.retroAudio) window.retroAudio.playBlip();
      }

      // Auto scroll to bottom
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  function appendOutput(text) {
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = '4px 0';
    pre.textContent = text;
    terminalOutput.appendChild(pre);
  }

  function handleTypeCommand(filename) {
    if (!filename) {
      appendOutput('SYNTAX ERROR: Specify a target file. Example: TYPE GIRLS_HIGH_SCHOOL_KANDY.TXT');
      return;
    }

    if (filename.includes('mission') || filename.includes('kandy') || filename.includes('archive')) {
      if (window.retroAudio) window.retroAudio.playDiskSeek();
      appendOutput(`
============================================================
RETRO TECH MUSEUM - DIGITAL PRESERVATION ARCHIVE
============================================================
Preserving computational heritage, vintage silicon architecture,
and honoring the pioneers of software engineering.

Key Chronological Pillars:
- The genesis of algorithmic logic (Ada Lovelace, 1843)
- The first compilers and human-readable code (Grace Hopper, 1952)
- Apollo priority flight-software engineering (Margaret Hamilton, 1969)
- The emergence of the 8-bit home computing revolution (1977-1989)

"Empowering future generations of software architects."
============================================================
`);
    } else {
      appendOutput(`File not found: ${filename}\nRun 'DIR' to inspect valid directory catalog.`);
    }
  }

  function triggerMatrixEffect() {
    terminalOutput.style.color = '#33ff33';
    terminalOutput.style.textShadow = '0 0 10px #33ff33';
    let lines = 0;
    const interval = setInterval(() => {
      const chars = '0101010189ABCDEFØΞΨΩµ§';
      let row = '';
      for (let i = 0; i < 40; i++) {
        row += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      appendOutput(row);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      lines++;
      if (lines > 15) clearInterval(interval);
    }, 80);
  }
}
