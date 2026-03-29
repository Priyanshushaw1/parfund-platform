const BASE_URL = "https://parfund-backend.onrender.com/api";

/* =========================
   PAGE SWITCH (FIXED)
========================= */
function switchPage(pageId, el) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll(".nav-tab").forEach(t => {
    t.classList.remove("active");
  });

  if (el) el.classList.add("active");
}

/* =========================
   LOGIN
========================= */
function loginUser() {
  const email = prompt("Email:");
  const password = prompt("Password:");

  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.user) {
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.name);
      alert("Login success");
      loadScores();
    } else {
      alert("Login failed");
    }
  });
}

/* =========================
   ADD SCORE
========================= */
async function submitScore() {
  const val = document.getElementById("scoreVal").value;
  const date = document.getElementById("scoreDate").value;
  const userId = localStorage.getItem("userId");

  if (!userId) return alert("Login first");

  await fetch(`${BASE_URL}/score/add`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ userId, value: val, date })
  });

  alert("Score saved");
  loadScores();
}

/* =========================
   LOAD SCORES (FIXED)
========================= */
async function loadScores() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/score/${userId}`);
  const scores = await res.json();

  const container = document.getElementById("scoresContainer");
  if (!container) return;

  container.innerHTML = "";

  scores.forEach(s => {
    container.innerHTML += `
      <div class="score-row">
        <div class="score-bubble">${s.value}</div>
        <div class="score-meta">
          <div>${s.value} pts</div>
          <div>${new Date(s.date).toDateString()}</div>
        </div>
      </div>
    `;
  });
}

/* =========================
   DRAW
========================= */
async function runDrawUI() {
  const res = await fetch(`${BASE_URL}/draw/run`);
  const data = await res.json();

  const container = document.getElementById("drawNumbers");
  container.innerHTML = "";

  data.draw.forEach(n => {
    container.innerHTML += `<div class="draw-ball">${n}</div>`;
  });

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const res2 = await fetch(`${BASE_URL}/draw/check/${userId}`);
  const result = await res2.json();

  document.getElementById("drawResultText").innerHTML =
    `Matches: ${result.matches} | ${result.result}`;
}

/* =========================
   AUTO LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
});