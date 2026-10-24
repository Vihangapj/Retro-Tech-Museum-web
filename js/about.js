/**
 * Retro Tech Museum - About Page, Pioneer Hall of Fame & Interactive Pixel Quiz
 */

document.addEventListener('DOMContentLoaded', () => {
  initRetroQuiz();
});

const QUIZ_QUESTIONS = [
  {
    q: 'Who wrote the very first algorithm intended to be executed by a machine (the Analytical Engine) in 1843?',
    options: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Margaret Hamilton'],
    correct: 0,
    fact: 'Ada Lovelace is universally celebrated as the world’s first computer programmer. She realized computers could manipulate symbols beyond mere numbers.'
  },
  {
    q: 'Which pioneer created the first computer compiler (A-0) and popularized the term "debugging" after finding a real moth in a relay?',
    options: ['Radia Perlman', 'Rear Admiral Grace Hopper', 'Katherine Johnson', 'Hedy Lamarr'],
    correct: 1,
    fact: 'Grace Hopper believed code should be readable by humans in English, leading directly to the creation of COBOL!'
  },
  {
    q: 'Margaret Hamilton was Director of Software Engineering for which historic NASA mission project in 1969?',
    options: ['Voyager 1', 'Apollo 11 Moon Landing', 'Hubble Space Telescope', 'Curiosity Rover'],
    correct: 1,
    fact: 'Her asynchronous priority-scheduling software on the Apollo Guidance Computer prevented Apollo 11 from aborting minutes before touchdown on the Moon.'
  },
  {
    q: 'Which legendary 1982 home computer used the MOS 6510 CPU and sold over 17 million units?',
    options: ['Apple Lisa', 'Commodore 64', 'ZX Spectrum', 'Atari 2600'],
    correct: 1,
    fact: 'The Commodore 64 remains the single best-selling desktop computer model of all time.'
  },
  {
    q: 'Gunpei Yokoi created the Game Boy using what famous design philosophy?',
    options: ['Maximum Silicon Power', 'Lateral Thinking with Withered Technology', 'Pure Vector Display', 'Online Always-On'],
    correct: 1,
    fact: 'Yokoi used mature, inexpensive, battery-sipping components so the Game Boy would last 30 hours on 4 AA batteries while remaining affordable.'
  }
];

function initRetroQuiz() {
  const quizContainer = document.getElementById('pixel-quiz-container');
  if (!quizContainer) return;

  let currentIdx = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIdx >= QUIZ_QUESTIONS.length) {
      renderQuizFinished();
      return;
    }

    const item = QUIZ_QUESTIONS[currentIdx];

    quizContainer.innerHTML = `
      <div class="pixel-box" style="border-color: var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span class="pixel-badge pixel-badge-yellow">QUESTION ${currentIdx + 1} OF ${QUIZ_QUESTIONS.length}</span>
          <span style="font-family: var(--font-pixel); font-size: 0.7rem; color: var(--accent);">SCORE: ${score * 100} PTS</span>
        </div>

        <h3 class="glow-text-cyan" style="font-size: 1.05rem; line-height: 1.4; margin-bottom: 22px;">
          ${item.q}
        </h3>

        <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 20px;">
          ${item.options.map((opt, i) => `
            <button class="pixel-btn pixel-btn-outline quiz-opt-btn" data-index="${i}" style="text-align: left; justify-content: flex-start; padding: 12px 18px;">
              <span style="color: var(--secondary); margin-right: 8px;">[${String.fromCharCode(65 + i)}]</span> ${opt}
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback-box" style="display: none; padding: 12px; background: #07050e; border: 2px dashed var(--accent); margin-top: 14px;">
          <p id="quiz-feedback-text" style="font-family: var(--font-tech); font-size: 0.95rem;"></p>
          <button id="btn-next-question" class="pixel-btn pixel-btn-sm pixel-btn-accent" style="margin-top: 12px;">
            NEXT QUESTION ►
          </button>
        </div>
      </div>
    `;

    // Attach click events
    quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        handleAnswer(parseInt(btn.dataset.index, 10), item);
      });
      btn.addEventListener('mouseenter', () => {
        if (window.retroAudio) window.retroAudio.playBlip();
      });
    });
  }

  function handleAnswer(selectedIdx, item) {
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackText = document.getElementById('quiz-feedback-text');
    const nextBtn = document.getElementById('btn-next-question');
    const optButtons = quizContainer.querySelectorAll('.quiz-opt-btn');

    optButtons.forEach(b => b.disabled = true);

    if (selectedIdx === item.correct) {
      score++;
      if (window.retroAudio) window.retroAudio.playCoin();
      feedbackBox.style.borderColor = '#00ffcc';
      feedbackText.innerHTML = `<span class="glow-text-cyan" style="font-family: var(--font-pixel); font-size: 0.75rem;">✔ CORRECT! +100 PTS</span><br><br>${item.fact}`;
    } else {
      if (window.retroAudio) window.retroAudio.playExplosion();
      feedbackBox.style.borderColor = '#ff007f';
      feedbackText.innerHTML = `<span class="glow-text-pink" style="font-family: var(--font-pixel); font-size: 0.75rem;">✖ INCORRECT!</span><br>Correct answer: <strong>${item.options[item.correct]}</strong><br><br>${item.fact}`;
    }

    feedbackBox.style.display = 'block';

    nextBtn.addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }

  function renderQuizFinished() {
    const passed = score >= 3;
    quizContainer.innerHTML = `
      <div class="pixel-box" style="text-align: center; border-color: ${passed ? 'var(--primary)' : 'var(--secondary)'}; padding: 36px;">
        <span class="pixel-badge ${passed ? 'pixel-badge-yellow' : 'pixel-badge-pink'}" style="margin-bottom: 12px;">EXAM EVALUATION COMPLETE</span>
        <h2 class="glow-text-cyan" style="font-size: 1.5rem; margin-top: 8px; margin-bottom: 14px;">
          ${passed ? 'HONORARY RETRO CURATOR CERTIFIED!' : 'TRAINING SESSION COMPLETE'}
        </h2>
        <p style="font-family: var(--font-terminal); font-size: 1.5rem; color: var(--accent); margin-bottom: 20px;">
          TOTAL SCORE: ${score * 100} / ${QUIZ_QUESTIONS.length * 100} PTS (${Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
        </p>
        <p style="font-family: var(--font-tech); max-width: 500px; margin: 0 auto 26px; color: var(--text-muted);">
          ${passed 
            ? 'Outstanding work! You have proven deep knowledge of computing history and the pioneering women who engineered our digital era.' 
            : 'Good effort! Review the pioneer exhibits in Sector 05 and try again to achieve high-score certification!'}
        </p>
        <button id="btn-restart-quiz" class="pixel-btn pixel-btn-accent">
          ↺ RETAKE RETRO QUIZ
        </button>
      </div>
    `;

    document.getElementById('btn-restart-quiz').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
      if (window.retroAudio) window.retroAudio.playCoin();
    });
  }

  renderQuestion();
}
