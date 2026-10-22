// UCU Economics Midterm Hub - Chapter & Checker Engine

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initProblemCheckers();
  initPhotoDropzones();
  initAudioSpeed();
});

/* 1. Theme Management */
function initTheme() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("ucu_econ_theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (toggleBtn) {
    toggleBtn.innerText = currentTheme === "dark" ? "☀️ Світла" : "🌙 Темна";
    toggleBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme");
      const next = active === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("ucu_econ_theme", next);
      toggleBtn.innerText = next === "dark" ? "☀️ Світла" : "🌙 Темна";
    });
  }
}

/* 2. Interactive Problem Checkers (Official Midterm Problems) */
const problemAnswers = {
  // Question 1: Mork & Mindy
  "q1_nash": {
    validate: (val) => {
      const clean = val.toLowerCase().replace(/[\s\(\),]/g, "");
      return clean === "cx" || clean === "xc" || clean === "c,x" || clean === "9525";
    },
    hint: "Шукай перетин найкращих відповідей: Морк обирає C проти X (95 > 85), а Мінді байдуже між X, Y, Z (всі дають 25). Отже, рівновага (C, X)!"
  },
  "q1_change": {
    validate: (val) => {
      const clean = val.toLowerCase();
      return clean.includes("не змін") || clean.includes("ніяк") || clean.includes("залишит") || clean.includes("той самий") || clean.includes("c,x");
    },
    hint: "Рівновага НЕ зміниться! Навіть якщо Мінді отримує 300 в (A, X), коли Мінді грає X, Морк обирає між 80, 85 і 95. Морк завжди вибере C (95)!"
  },

  // Question 2: Joint Venture
  "q2_rate": {
    validate: (val) => {
      const clean = val.toLowerCase().replace(/[\s%]/g, "");
      return clean.includes("60") || clean.includes("0.6") || clean.includes("0,6");
    },
    hint: "За умовою R/(1-δ) ≥ T + δP/(1-δ): 25 ≥ 50 - 40δ ⇒ δ ≥ 0.625 ⇒ r ≤ 60%."
  },
  "q2_delay": {
    validate: (val) => {
      const clean = val.toLowerCase();
      return clean.includes("менш") || clean.includes("важч") || clean.includes("падає") || clean.includes("зниж");
    },
    hint: "Співпраця стає МЕНШ імовірною! Порушник збирає 50 двічі без покарання, а розплата відтермінована. Поріг терпіння δ підскакує з 0.625 до 0.791!"
  },

  // Question 3: Restaurant Max & Sally
  "q3_strategic": {
    validate: (val) => {
      const clean = val.toLowerCase().trim();
      return clean === "a" || clean.includes("ресторан a") || clean.includes("варіант a");
    },
    hint: "Макс стратегічно викреслює B! Тоді Саллі змушена обирати між A і C, і вона обирає A. Макс отримує свій топ-1 ресторан A!"
  },

  // Question 4: 3x3 Matrix IESDS
  "q4_nash": {
    validate: (val) => {
      const clean = val.toLowerCase().replace(/[\s\(\),]/g, "");
      return clean.includes("downmiddle") || clean.includes("middledown") || clean.includes("4,3") || clean.includes("43");
    },
    hint: "Послідовно викресли: стовпець Right (домінується Middle), рядок Middle (домінується Up), стовпець Left (домінується Middle). Залишається (Down, Middle)!"
  },

  // Question 5: Carpathian Hotels
  "q5_sym": {
    validate: (val) => {
      const clean = val.toLowerCase();
      return clean.includes("київ") || clean.includes("kyiv") || clean.includes("k,k") || clean.includes("к,к");
    },
    hint: "Київ приносить 150к, що більше ніж Львів і Одеса разом. Реклама в Києві є строго домінатною для обох готелів: рівновага (Київ, Київ)!"
  },

  // Question 6: Construction Bids
  "q6_bid": {
    validate: (val) => {
      const clean = val.toUpperCase().trim();
      return clean.includes("B") || clean.includes("BIG") || clean.includes("(B, B)");
    },
    hint: "Співпраця C домінується. У матриці 2х2 ставка на Big (B) є домінатною, бо дає 12 або 15. Рівновага: обидві фірми подають на B!"
  },

  // Question 7: Price Game & Equity Swap
  "q7_percent": {
    validate: (val) => {
      const clean = val.replace(/[\s%]/g, "");
      return clean === "17" || clean.includes("17") || clean.includes("16.7") || clean.includes("16,7");
    },
    hint: "Умова 60 ≥ 65 - 30x ⇒ 30x ≥ 5 ⇒ x ≥ 1/6 ≈ 16.67%. Округлюємо до мінімального цілого відсотка: x = 17%!"
  },
  "q7_payoff": {
    validate: (val) => {
      const clean = val.replace(/[\s]/g, "");
      return clean === "60" || clean.includes("60");
    },
    hint: "Обидві фірми ставлять високу ціну High, кожна отримує операційний прибуток 60. Виплата СЕО = 0.83*60 + 0.17*60 = 60!"
  },

  // Question 9: Strategy Definition
  "q9_def": {
    validate: (val) => {
      const clean = val.trim();
      return clean === "1" || clean.toLowerCase().includes("план") || clean.toLowerCase().includes("plan");
    },
    hint: "Стратегія — це варіант 1: Повний план дій гравця для кожної можливої ситуації у грі (A player's plan of actions in a game)."
  },

  // Question 10: British Airways vs Lufthansa
  "q10_threat": {
    validate: (val) => {
      const clean = val.toLowerCase();
      return clean.includes("ні") || clean.includes("не") || clean.includes("блеф") || clean.includes("недостовір");
    },
    hint: "Погроза НЕ є достовірною (Incredible Threat). Якщо Lufthansa увійде, BA вигідніше поділити ринок (мир дає виплату більше), ніж воювати у збиток собі!"
  }
};

function initProblemCheckers() {
  document.querySelectorAll(".checker-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qKey = btn.getAttribute("data-q");
      const inputEl = document.getElementById(`input_${qKey}`);
      const feedbackEl = document.getElementById(`feedback_${qKey}`);
      if (!inputEl || !feedbackEl) return;

      const userVal = inputEl.value.trim();
      if (!userVal) {
        feedbackEl.className = "checker-feedback incorrect";
        feedbackEl.innerHTML = "⚠️ Будь ласка, введіть вашу відповідь перед перевіркою.";
        return;
      }

      const qConf = problemAnswers[qKey];
      if (qConf && qConf.validate(userVal)) {
        feedbackEl.className = "checker-feedback correct";
        feedbackEl.innerHTML = `🎉 <b>Правильно! Чудова робота.</b><br>${qConf.hint}`;
      } else {
        feedbackEl.className = "checker-feedback incorrect";
        feedbackEl.innerHTML = `❌ <b>Поки що не зовсім.</b><br>💡 <b>Підказка:</b> ${qConf ? qConf.hint : "Спробуйте ще раз або перегляньте детальний розв'язок."}`;
      }
    });
  });
}

/* 3. Photo Dropzones for Handwritten Solutions */
function initPhotoDropzones() {
  document.querySelectorAll(".dropzone-box").forEach((dz) => {
    dz.addEventListener("dragover", (e) => {
      e.preventDefault();
      dz.classList.add("dragover");
    });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      dz.classList.remove("dragover");
      handleFileDrop(dz, e.dataTransfer.files);
    });
    dz.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*,.pdf";
      fileInput.onchange = (e) => handleFileDrop(dz, e.target.files);
      fileInput.click();
    });
  });
}

function handleFileDrop(dz, files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const qId = dz.getAttribute("data-q");
  const reviewResult = document.getElementById(`photo_review_${qId}`);

  dz.innerHTML = `
    <div class="dropzone-icon">📄</div>
    <div class="dropzone-text"><b>Файл завантажено:</b> ${file.name} (${Math.round(file.size / 1024)} KB)</div>
  `;

  if (reviewResult) {
    reviewResult.style.display = "block";
    reviewResult.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
        <h5 style="color: #34d399; margin-bottom: 0.5rem;">🔍 Чекліст критеріїв Притули для перевірки твого розв'язку:</h5>
        <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">
          <li><b>Чи вказано суб'єктів гри:</b> Хто Гравець 1 (рядки) і Гравець 2 (стовпці)?</li>
          <li><b>Чи підписано порядок виплат:</b> Перше число — виграш того, хто в рядку, друге — того, хто в стовпчику.</li>
          <li><b>Метод знаходження:</b> Чи показано стрілочки або підкреслення найкращих відповідей?</li>
          <li><b>Логічне обґрунтування:</b> Чому обрано саме цю дію (відсутність стимулу одноосібно відхилитися).</li>
        </ul>
      </div>
    `;
  }
}

/* 4. Audio Playback Speed Control */
function initAudioSpeed() {
  document.querySelectorAll("audio").forEach((player) => {
    // Default sensible audio setup
    player.addEventListener("play", () => {
      document.querySelectorAll("audio").forEach(other => {
        if (other !== player) other.pause();
      });
    });
  });
}
