// Game variables
let secret = Math.floor(Math.random() * 100) + 1;
let energy = 7;
const MAX_ENERGY = 7;
let attempts = 0;

// DOM elements
const guessInput = document.getElementById('guessInput');
const hackBtn = document.getElementById('hackBtn');
const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');
const energyCountEl = document.getElementById('energyCount');
const energyFillEl = document.getElementById('energyFill');
const bestScoreEl = document.getElementById('bestScore');

// Load record
function loadBestScore() {
  const saved = localStorage.getItem('neonVaultBestScore');
  return saved ? parseInt(saved) : Infinity;
}

function saveBestScore(score) {
  localStorage.setItem('neonVaultBestScore', score.toString());
}

// Update interface
function updateEnergyBar() {
  energyCountEl.textContent = energy;
  energyFillEl.style.width = `${(energy / MAX_ENERGY) * 100}%`;
}

function addToLog(message) {
  const logEntry = document.createElement('div');
  logEntry.textContent = `→ ${message}`;
  logEl.appendChild(logEntry);
  logEl.scrollTop = logEl.scrollHeight; // auto-scroll to bottom
}

function setBodyClass(className) {
  document.body.className = className;
}

// Initialization
(function init() {
  updateEnergyBar();
  const best = loadBestScore();
  bestScoreEl.textContent = best === Infinity ? '—' : best;
})();

// Main hack logic
hackBtn.addEventListener('click', tryHack);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') tryHack();
});

function tryHack() {
  if (energy <= 0) {
    statusEl.textContent = 'Energy depleted. System locked.';
    statusEl.style.color = '#ff3333';
    return;
  }

  const guessStr = guessInput.value.trim();
  if (!guessStr) {
    statusEl.textContent = 'Please enter a number';
    statusEl.style.color = '#ffaa00';
    return;
  }

  const guess = parseInt(guessStr, 10);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    statusEl.textContent = 'Code must be between 1 and 100';
    statusEl.style.color = '#ffaa00';
    return;
  }

  energy--;
  attempts++;
  updateEnergyBar();

  const distance = Math.abs(secret - guess);
  let message = `Attempt ${attempts}: ${guess} → Distance ~${distance}`;

  if (distance < 5) {
    setBodyClass('pulsing');
    message += ' Hot';
  } else if (distance > 20) {
    setBodyClass('cold');
    message += ' Cold';
  } else {
    setBodyClass('');
    message += ' Warm';
  }

  addToLog(message);

  if (guess === secret) {
    statusEl.textContent = `HACKED! In ${attempts} attempts.`;
    statusEl.style.color = '#00ffaa';

    const best = loadBestScore();
    if (attempts < best) {
      saveBestScore(attempts);
      bestScoreEl.textContent = attempts;
      addToLog(`NEW RECORD!`);
    }

    hackBtn.disabled = true;
    guessInput.disabled = true;
    return;
  }

  // Failure
  if (energy <= 0) {
    statusEl.textContent = `Failure. The code was: ${secret}`;
    statusEl.style.color = '#ff3333';
    hackBtn.disabled = true;
    guessInput.disabled = true;
    return;
  }

  // Clear input field
  guessInput.value = '';
  guessInput.focus();
}