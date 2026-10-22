// UCU Economics Midterm Hub - Interactive Engine

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initStudyTracker();
  initAudioPlayer();
  initMatrixSolver();
  initGrimTriggerCalc();
  initProblemAccordions();
  initFilterTabs();
  initBlitzQuiz();
});

/* 1. Theme Toggle */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("ucu_econ_theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeBtnText(toggleBtn, currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme");
      const next = active === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("ucu_econ_theme", next);
      updateThemeBtnText(toggleBtn, next);
    });
  }
}

function updateThemeBtnText(btn, theme) {
  if (!btn) return;
  btn.innerHTML = theme === "dark" ? "☀️ Світла тема" : "🌙 Темна тема";
}

/* 2. 12-Hour Study Tracker */
function initStudyTracker() {
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressCount");
  const hourPills = document.querySelectorAll(".hour-pill");
  const blockCheckboxes = document.querySelectorAll(".block-checkbox");

  let saved = JSON.parse(localStorage.getItem("ucu_econ_tracker") || "{}");

  function renderTracker() {
    let completedHours = 0;
    hourPills.forEach((pill) => {
      const h = pill.getAttribute("data-hour");
      if (saved[h]) {
        pill.classList.add("completed");
        completedHours++;
      } else {
        pill.classList.remove("completed");
      }
    });

    blockCheckboxes.forEach((box) => {
      const blockId = box.getAttribute("data-block");
      const h1 = (blockId * 2) - 1;
      const h2 = blockId * 2;
      box.checked = !!(saved[h1] && saved[h2]);
    });

    const pct = Math.round((completedHours / 12) * 100);
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.innerText = `${completedHours} з 12 годин (${pct}%)`;
  }

  hourPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const h = pill.getAttribute("data-hour");
      saved[h] = !saved[h];
      localStorage.setItem("ucu_econ_tracker", JSON.stringify(saved));
      renderTracker();
    });
  });

  blockCheckboxes.forEach((box) => {
    box.addEventListener("change", () => {
      const blockId = box.getAttribute("data-block");
      const h1 = (blockId * 2) - 1;
      const h2 = blockId * 2;
      saved[h1] = box.checked;
      saved[h2] = box.checked;
      localStorage.setItem("ucu_econ_tracker", JSON.stringify(saved));
      renderTracker();
    });
  });

  renderTracker();
}

/* 3. Audio Player for NotebookLM Podcasts */
const podcasts = [
  {
    id: 2,
    title: "Розділ 2: Зворотне міркування та дерева гри",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch2.m4a",
    duration: "18 хв",
    desc: "Послідовні ігри, Чарлі Браун і Люсі, правило 'Look forward and reason backward', зворотна індукція (rollback), шахи та ігри на виживання."
  },
  {
    id: 3,
    title: "Розділ 3: Дилема в'язня та як її подолати",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch3.m4a",
    duration: "15 хв",
    desc: "Одночасні ходи, цінові війни, домінантні стратегії, чому співпраця руйнується і як нескінченні повторення та покарання (Grim Trigger / Tit-for-Tat) рятують виграш."
  },
  {
    id: 4,
    title: "Розділ 4: Прекрасна рівновага (Рівновага Неша)",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch4.m4a",
    duration: "16 хв",
    desc: "Концепція взаємних найкращих відповідей, координаційні ігри, битва статей (Battle of the Sexes), гра «Яструби та голуби» (Chicken), відсутність стимулу відхилятися."
  },
  {
    id: 5,
    title: "Розділ 5: Вибір та випадковість (Змішані стратегії)",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch5.m4a",
    duration: "21 хв",
    desc: "Навіщо бути непередбачуваним у спорті та бізнесі: пенальті, теніс, блеф у покері. Розрахунок ймовірностей через індиферентність суперника."
  },
  {
    id: 6,
    title: "Розділ 6: Стратегічні ходи (Погрози, Обіцянки, Зобов'язання)",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch6.m4a",
    duration: "18 хв",
    desc: "Як зробити слова реальними діями. 8 способів встановити достовірність (credibility): спалювання мостів, контракти, репутація, автоматичні правила відплати."
  },
  {
    id: 7,
    title: "Розділ 7: Тлумачення та маніпулювання інформацією (Сигнали та Скринінг)",
    book: "Avinash Dixit & Barry Nalebuff — The Art of Strategy",
    src: "audio/ch7.m4a",
    duration: "33 хв",
    desc: "Асиметрична інформація, ринок лимонів, чому слова дешеві (cheap talk), розділяюча рівновага, витратні сигнали (signaling) та меню контрактів (screening)."
  }
];

function initAudioPlayer() {
  const audio = document.getElementById("mainAudioPlayer");
  const titleEl = document.getElementById("playerTitle");
  const descEl = document.getElementById("playerDesc");
  const playlistContainer = document.getElementById("podcastPlaylist");
  const speedBtn = document.getElementById("speedBtn");

  if (!playlistContainer || !audio) return;

  let currentTrackIdx = 0;
  const speeds = [1, 1.25, 1.5, 1.75, 2];
  let speedIdx = 0;

  function loadTrack(idx, autoPlay = false) {
    currentTrackIdx = idx;
    const t = podcasts[idx];
    audio.src = t.src;
    if (titleEl) titleEl.innerText = t.title;
    if (descEl) descEl.innerText = `${t.book} • ${t.desc}`;

    document.querySelectorAll(".playlist-item").forEach((item, i) => {
      item.classList.toggle("active", i === idx);
    });

    if (autoPlay) {
      audio.play().catch(() => {});
    }
  }

  // Render Playlist
  playlistContainer.innerHTML = "";
  podcasts.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = `playlist-item ${i === 0 ? "active" : ""}`;
    item.innerHTML = `
      <div class="playlist-item-left">
        <span class="playlist-num">CH 0${t.id}</span>
        <div>
          <h4>${t.title}</h4>
          <p>${t.book.split("—")[0]}</p>
        </div>
      </div>
      <span class="playlist-duration">${t.duration}</span>
    `;
    item.addEventListener("click", () => loadTrack(i, true));
    playlistContainer.appendChild(item);
  });

  loadTrack(0, false);

  if (speedBtn) {
    speedBtn.addEventListener("click", () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      const spd = speeds[speedIdx];
      audio.playbackRate = spd;
      speedBtn.innerText = `${spd}x`;
    });
  }
}

/* 4. Nash Equilibrium 2x2 Matrix Solver */
function initMatrixSolver() {
  const solveBtn = document.getElementById("matrixSolveBtn");
  if (!solveBtn) return;

  solveBtn.addEventListener("click", () => {
    const u1_TL = parseFloat(document.getElementById("m_u1_TL").value) || 0;
    const u2_TL = parseFloat(document.getElementById("m_u2_TL").value) || 0;

    const u1_TR = parseFloat(document.getElementById("m_u1_TR").value) || 0;
    const u2_TR = parseFloat(document.getElementById("m_u2_TR").value) || 0;

    const u1_BL = parseFloat(document.getElementById("m_u1_BL").value) || 0;
    const u2_BL = parseFloat(document.getElementById("m_u2_BL").value) || 0;

    const u1_BR = parseFloat(document.getElementById("m_u1_BR").value) || 0;
    const u2_BR = parseFloat(document.getElementById("m_u2_BR").value) || 0;

    // Check Player 1 best response:
    // If P2 plays Left: compare u1_TL vs u1_BL
    const p1_best_L = u1_TL > u1_BL ? "T" : (u1_TL < u1_BL ? "B" : "BOTH");
    // If P2 plays Right: compare u1_TR vs u1_BR
    const p1_best_R = u1_TR > u1_BR ? "T" : (u1_TR < u1_BR ? "B" : "BOTH");

    // Check Player 2 best response:
    // If P1 plays Top: compare u2_TL vs u2_TR
    const p2_best_T = u2_TL > u2_TR ? "L" : (u2_TL < u2_TR ? "R" : "BOTH");
    // If P1 plays Bottom: compare u2_BL vs u2_BR
    const p2_best_B = u2_BL > u2_BR ? "L" : (u2_BL < u2_BR ? "R" : "BOTH");

    // Dominance analysis:
    let p1_dom = "Немає строго домінатної стратегії";
    if (u1_TL > u1_BL && u1_TR > u1_BR) p1_dom = "🌟 'Top' (Вгору) є СТРОГО ДОМІНАНТНОЮ стратегією";
    else if (u1_BL > u1_TL && u1_BR > u1_TR) p1_dom = "🌟 'Bottom' (Вниз) є СТРОГО ДОМІНАНТНОЮ стратегією";

    let p2_dom = "Немає строго домінатної стратегії";
    if (u2_TL > u2_TR && u2_BL > u2_BR) p2_dom = "🌟 'Left' (Ліворуч) є СТРОГО ДОМІНАНТНОЮ стратегією";
    else if (u2_TR > u2_TL && u2_BR > u2_BL) p2_dom = "🌟 'Right' (Праворуч) є СТРОГО ДОМІНАНТНОЮ стратегією";

    // Nash equilibria:
    const nashList = [];
    if ((p1_best_L === "T" || p1_best_L === "BOTH") && (p2_best_T === "L" || p2_best_T === "BOTH")) {
      nashList.push({ pos: "Top-Left", payoffs: `(${u1_TL}, ${u2_TL})`, cellId: "cell_TL" });
    }
    if ((p1_best_R === "T" || p1_best_R === "BOTH") && (p2_best_T === "R" || p2_best_T === "BOTH")) {
      nashList.push({ pos: "Top-Right", payoffs: `(${u1_TR}, ${u2_TR})`, cellId: "cell_TR" });
    }
    if ((p1_best_L === "B" || p1_best_L === "BOTH") && (p2_best_B === "L" || p2_best_B === "BOTH")) {
      nashList.push({ pos: "Bottom-Left", payoffs: `(${u1_BL}, ${u2_BL})`, cellId: "cell_BL" });
    }
    if ((p1_best_R === "B" || p1_best_R === "BOTH") && (p2_best_B === "R" || p2_best_B === "BOTH")) {
      nashList.push({ pos: "Bottom-Right", payoffs: `(${u1_BR}, ${u2_BR})`, cellId: "cell_BR" });
    }

    // Highlight cells in output
    ["cell_TL", "cell_TR", "cell_BL", "cell_BR"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("nash");
    });

    nashList.forEach(n => {
      const el = document.getElementById(n.cellId);
      if (el) el.classList.add("nash");
    });

    const resEl = document.getElementById("matrixSolverResult");
    if (resEl) {
      let nashStr = nashList.length > 0 
        ? nashList.map(n => `<b>${n.pos}</b> з виплатами ${n.payoffs}`).join(", ")
        : "Рівноваг Неша в чистих стратегіях немає (існує рівновага в змішаних стратегіях).";

      resEl.innerHTML = `
        <div class="result-badge">Результат аналізу</div>
        <p style="margin-bottom: 0.5rem;"><b>Гравець 1 (Рядки):</b> ${p1_dom}</p>
        <p style="margin-bottom: 0.5rem;"><b>Гравець 2 (Стовпці):</b> ${p2_dom}</p>
        <div style="background: rgba(16, 185, 129, 0.15); border-left: 3px solid #10b981; padding: 0.75rem; border-radius: 6px; margin-top: 0.75rem;">
          <b style="color: #34d399;">Рівновага Неша (Чисті стратегії):</b><br>
          ${nashStr}
        </div>
      `;
    }
  });
}

/* 5. Grim Trigger Repeated Game Calculator */
function initGrimTriggerCalc() {
  const calcBtn = document.getElementById("grimCalcBtn");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", () => {
    const R = parseFloat(document.getElementById("grim_R").value) || 25; // Reward
    const T = parseFloat(document.getElementById("grim_T").value) || 50; // Temptation
    const P = parseFloat(document.getElementById("grim_P").value) || 10; // Punishment
    const delay = parseInt(document.getElementById("grim_delay").value) || 1; // years delay

    const resEl = document.getElementById("grimCalcResult");
    if (!resEl) return;

    if (T <= R || R <= P) {
      resEl.innerHTML = `<p style="color: #f43f5e;">⚠️ Помилка: для Дилеми в'язня обов'язково має виконуватись умова: T (зрада) > R (співпраця) > P (покарання).</p>`;
      return;
    }

    if (delay === 1) {
      // Standard Grim Trigger:
      // R / (1 - delta) >= T + delta * P / (1 - delta)
      // delta >= (T - R) / (T - P)
      const delta = (T - R) / (T - P);
      const r_pct = ((1 / delta) - 1) * 100;

      resEl.innerHTML = `
        <div class="result-badge">Миттєве виявлення (1 період)</div>
        <p>Мінімальний дисконтний фактор <b>δ ≥ ${delta.toFixed(3)}</b></p>
        <p>Максимальна ставка відсотка <b>r ≤ ${r_pct.toFixed(1)}%</b></p>
        <div class="concept-explanation emerald" style="margin-top: 0.75rem;">
          <h4>Пояснення для екзамену:</h4>
          <p>Співпраця збережеться, якщо вартість майбутнього для партнерів достатньо висока (δ ≥ ${delta.toFixed(3)}). Оскільки реальні процентні ставки в економіці зазвичай становлять 5-20%, умова <b>r ≤ ${r_pct.toFixed(1)}%</b> легко виконується, отже співпраця є <b>дуже ймовірною</b>.</p>
        </div>
      `;
    } else if (delay === 2) {
      // 2-Year Delay (Temptation collected twice):
      // R / (1 - delta) >= T + T*delta + P*delta^2 / (1 - delta)
      // R >= (T + T*delta)(1 - delta) + P*delta^2 = T - T*delta^2 + P*delta^2 = T - (T - P)*delta^2
      // (T - P)*delta^2 >= T - R
      // delta^2 >= (T - R) / (T - P)
      // delta >= sqrt((T - R) / (T - P))
      const delta_sq = (T - R) / (T - P);
      const delta = Math.sqrt(delta_sq);
      const r_pct = ((1 / delta) - 1) * 100;

      resEl.innerHTML = `
        <div class="result-badge" style="background: rgba(244, 63, 94, 0.2); color: #fb7185;">Затримка виявлення 2 роки!</div>
        <p>Мінімальний дисконтний фактор <b>δ ≥ √${delta_sq.toFixed(3)} = ${delta.toFixed(3)}</b></p>
        <p>Максимальна ставка відсотка <b>r ≤ ${r_pct.toFixed(1)}%</b></p>
        <div class="concept-explanation amber" style="margin-top: 0.75rem;">
          <h4>Чому співпраця стає НАБАГАТО менш ймовірною:</h4>
          <p>Через те, що порушник збирає подвійний куш зради (${T} двічі), а покарання відтерміноване аж на третій рік, поріг терплячості зріс до <b>δ = ${delta.toFixed(3)}</b> (порівняно з ${Math.sqrt(delta_sq).toFixed(3)}), а гранична ставка впала до <b>${r_pct.toFixed(1)}%</b>. Це робить спокусу обманути значно сильнішою!</p>
        </div>
      `;
    }
  });
}

/* 6. Problem Accordions (Reveal Solutions) */
function initProblemAccordions() {
  document.querySelectorAll(".solution-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      if (content) {
        const isOpen = content.classList.contains("open");
        content.classList.toggle("open", !isOpen);
        const icon = btn.querySelector(".toggle-icon");
        if (icon) icon.innerText = isOpen ? "Показати розв'язок ▼" : "Сховати розв'язок ▲";
      }
    });
  });
}

/* 7. Filter Tabs for Problems */
function initFilterTabs() {
  const tabs = document.querySelectorAll(".filter-btn");
  const problems = document.querySelectorAll(".problem-card");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");
      problems.forEach((p) => {
        if (filter === "all" || p.getAttribute("data-category") === filter) {
          p.style.display = "block";
        } else {
          p.style.display = "none";
        }
      });
    });
  });
}

/* 8. Blitz Quiz Engine */
const quizQuestions = [
  {
    q: "1. Що таке стратегія у формальному визначенні курсу теорії ігор?",
    options: [
      "Бажання гравця максимізувати прибуток у будь-який спосіб",
      "Повний план дій гравця, що описує вибір для будь-якої можливої ситуації у грі",
      "Набір найкращих альтернатив, які компанія вже реалізувала в минулому",
      "Фіксоване правило поведінки під час відсутності конкурентів"
    ],
    correct: 1,
    exp: "Визначення стратегії за Діксітом та Нейлбаффом: це вичерпний план дій (complete contingency plan), де гравець наперед знає, як він вчинить у кожній можливій точці прийняття рішень."
  },
  {
    q: "2. Якщо стратегія А строго домінує стратегію Б для Гравця 1, що це означає?",
    options: [
      "Стратегія А завжди приносить позитивний прибуток",
      "За будь-яких дій Гравця 2 стратегія А приносить строго більшу виплату, ніж стратегія Б",
      "Стратегія А є рівновагою Неша",
      "Гравець 2 ніколи не гратиме свою найкращу відповідь"
    ],
    correct: 1,
    exp: "Строге домінування означає: u₁(A, s₂) > u₁(Б, s₂) для КОЖНОЇ стратегії s₂ суперника. Таку доміновану стратегію Б можна безпечно викреслити (IESDS)."
  },
  {
    q: "3. У повторюваній Дилемі в'язня затримка покарання на 2 роки замість 1 року призводить до:",
    options: [
      "Збільшення ймовірності співпраці",
      "Зменшення критичного дисконтного фактора δ",
      "Зменшення ймовірності співпраці, оскільки вигода від зради збирається довше, а покарання відтерміноване",
      "Жодного впливу на рішення гравців"
    ],
    correct: 2,
    exp: "Затримка детекції дозволяє порушнику отримувати високу виплату спокуси T протягом 2 років, тоді як покарання дисконтується далі в часі. Це вимагає значно вищого δ і робить співпрацю менш стійкою."
  },
  {
    q: "4. Згідно з моделлю PARTS (The Right Game), хто такий 'Комплементор' (Complementor)?",
    options: [
      "Компанія, яка продає той самий товар за нижчою ціною",
      "Гравець, наявність якого робить ваш товар БІЛЬШ цінним для клієнта (наприклад, софт для заліза)",
      "Орган державної влади, що встановлює податки",
      "Постачальник, який має ексклюзивні права"
    ],
    correct: 1,
    exp: "Комплементор (у Value Net) робить клієнтів більш схильними купувати ваш продукт (наприклад, ігри для консолей Nintendo або бензин для авто), створюючи спільну додану вартість."
  },
  {
    q: "5. Чому погроза монополіста British Airways почати цінову війну проти Lufthansa є 'недостовірною' (Incredible Threat)?",
    options: [
      "Бо British Airways не має достатньо літаків",
      "Бо коли Lufthansa вже зайшла на ринок, цінова війна завдасть збитків самій British Airways, тому вигідніше змиритися і поділити ринок",
      "Бо цінові війни заборонені законодавством ЄС",
      "Бо Lufthansa завжди грає випадкові стратегії"
    ],
    correct: 1,
    exp: "За зворотною індукцією (Rollback): після фактичного входу Lufthansa для British Airways виплата від миру (акомодації) вища, ніж від війни. Отже, погроза воювати є блефом, якщо немає механізму зобов'язання (commitment)."
  }
];

function initBlitzQuiz() {
  const container = document.getElementById("quizContainer");
  if (!container) return;

  container.innerHTML = "";
  quizQuestions.forEach((item, qIdx) => {
    const box = document.createElement("div");
    box.className = "quiz-question-box";
    box.innerHTML = `
      <div class="quiz-q-title">${item.q}</div>
      <div class="quiz-options" id="quiz_opt_${qIdx}">
        ${item.options.map((opt, oIdx) => `
          <div class="quiz-option" data-q="${qIdx}" data-opt="${oIdx}">
            <span style="font-weight:700; color:var(--text-dim);">${String.fromCharCode(65 + oIdx)}.</span>
            <span>${opt}</span>
          </div>
        `).join("")}
      </div>
      <div class="quiz-explanation" id="quiz_exp_${qIdx}">
        💡 <b>Пояснення:</b> ${item.exp}
      </div>
    `;
    container.appendChild(box);
  });

  container.addEventListener("click", (e) => {
    const optEl = e.target.closest(".quiz-option");
    if (!optEl) return;

    const qIdx = parseInt(optEl.getAttribute("data-q"));
    const oIdx = parseInt(optEl.getAttribute("data-opt"));
    const qData = quizQuestions[qIdx];
    const parent = document.getElementById(`quiz_opt_${qIdx}`);
    const expEl = document.getElementById(`quiz_exp_${qIdx}`);

    // Disable further clicks on this question
    parent.querySelectorAll(".quiz-option").forEach(el => {
      el.style.pointerEvents = "none";
      const curOpt = parseInt(el.getAttribute("data-opt"));
      if (curOpt === qData.correct) {
        el.classList.add("correct");
      } else if (curOpt === oIdx) {
        el.classList.add("wrong");
      }
    });

    if (expEl) expEl.classList.add("show");
  });
}
