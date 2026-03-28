const BASE_URL = "http://localhost:5000/api";

// ── Page switching
function switchPage(id, tabEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (tabEl) tabEl.classList.add('active');
}

// ── Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function showToastError(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = '⚠ ' + msg;
  toast.style.color = 'red';
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.style.color = '';
  }, 2500);
}

// ───────── AUTH ─────────
async function loginUser() {
  const email = prompt("Enter email");
  const password = prompt("Enter password");

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.user) {
      localStorage.setItem("userId", data.user._id);
      showToast("Login successful");
      loadScores();
    } else {
      showToastError("Login failed");
    }

  } catch (err) {
    showToastError("Server error");
  }
}

// ───────── SUBMIT SCORE ─────────
async function submitScore() {
  const val = parseInt(document.getElementById('scoreVal').value);
  const date = document.getElementById('scoreDate').value;

  if (!val || val < 1 || val > 45) {
    showToastError('Invalid score');
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    showToastError("Login first");
    return;
  }

  try {
    await fetch(`${BASE_URL}/score/add`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        userId,
        score: val,   // ✅ FIXED
        date
      })
    });

    showToast("Score saved");

    document.getElementById('scoreVal').value = '';
    document.getElementById('scoreDate').value = '';

    loadScores();

  } catch (err) {
    showToastError("Error saving score");
  }
}

// ───────── LOAD SCORES ─────────
async function loadScores() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const res = await fetch(`${BASE_URL}/score/${userId}`);
    const scores = await res.json();

    const container = document.querySelector(".live-scores-panel");
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Current Scores</div>
        <span class="badge badge-dim">${scores.length} / 5</span>
      </div>
    `;

    scores.forEach(s => {
      container.innerHTML += `
        <div class="score-row">
          <div class="score-bubble">${s.score}</div>
          <div class="score-meta">
            <div class="score-pts">${s.score} points</div>
            <div class="score-date-text">${new Date(s.date).toDateString()}</div>
          </div>
        </div>
      `;
    });

  } catch (err) {
    showToastError("Error loading scores");
  }
}

// ── Draw simulation
function runSimulation() {
  const nums = [];
  while (nums.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  showToast(nums.join(" - "));
}

// ── Default date
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const dateField = document.getElementById('scoreDate');
  if (dateField) dateField.value = today;
});