const questions = [
  { q: "나는 코드의 한 줄보다 전체 시스템의 구조(Architecture)를 먼저 생각한다.", type: "arch" },
  { q: "GitHub Copilot이나 ChatGPT 없이 코딩하는 것이 이제는 매우 불편하다.", type: "ai" },
  { q: "새로운 기술이 나오면 기술적 호기심보다 '어디에 써먹을지' 비즈니스 가치를 먼저 따진다.", type: "future" },
  { q: "나는 주어진 요구사항대로 '구현'만 할 때 가장 마음이 편하다.", type: "coder" }, 
  { q: "복잡한 에러가 발생했을 때 AI에게 질문하는 요령(Prompt)을 스스로 터득하고 있다.", type: "ai" },
  { q: "나는 특정 언어나 프레임워크에 종속되지 않고 문제 해결 자체에 집중한다.", type: "arch" },
  { q: "AI가 내 일자리를 뺏을까 봐 걱정하기보다, AI를 어떻게 부릴지 고민한다.", type: "future" },
  { q: "코드 리뷰를 할 때 가독성이나 성능보다 '돌아가느냐'가 가장 중요하다.", type: "coder" }, 
  { q: "클라우드 서비스(AWS, Vercel 등)를 활용해 서비스를 직접 배포해본 경험이 즐겁다.", type: "arch" },
  { q: "AI가 생성한 코드의 오류를 잡아내는 것이 직접 처음부터 짜는 것보다 빠르다.", type: "ai" },
  { q: "나는 반복적인 코딩 작업에서 지루함을 크게 느낀다.", type: "future" },
  { q: "문서화보다는 일단 코드를 치기 시작하는 편이다.", type: "coder" }, 
  { q: "API 설계 시 확장성과 재사용성을 최우선으로 고려한다.", type: "arch" },
  { q: "AI 도구 유료 결제 비용을 아깝다고 생각하지 않는다.", type: "ai" },
  { q: "나는 개발자이자 기획자의 마인드를 동시에 갖고 있다.", type: "future" },
  { q: "코딩할 때 AI가 제안하는 솔루션이 마음에 들지 않아도, 일단 받아들이고 고쳐 나가는 편이다.", type: "coder" },
];

const state = {
  mode: "home",
  currentIdx: 0,
  scores: { coder: 0, arch: 0, ai: 0, future: 0 },
};

const el = {
  home: document.getElementById("home"),
  dataReport: document.getElementById("data-report"), 
  test: document.getElementById("test"),
  result: document.getElementById("result"),
  resultContainer: document.querySelector(".result_container"),
  question: document.getElementById("question"),
  answers: document.getElementById("answers"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  score: document.getElementById("score"),
  analysisText: document.getElementById("analysisText"),
};

// 화면 전환 함수
function setMode(mode) {
  state.mode = mode;
  el.home.classList.toggle("hidden", mode !== "home");
  el.dataReport.classList.toggle("hidden", mode !== "home");
  
  if (el.resultContainer) {
    el.resultContainer.classList.toggle("hidden", mode === "home");
  }

  el.test.classList.toggle("hidden", mode !== "test");
  el.result.classList.toggle("hidden", mode !== "result");
}

function startTest() {
  state.currentIdx = 0;
  state.scores = { coder: 0, arch: 0, ai: 0, future: 0 };
  setMode("test");
  renderQuestion();
  window.scrollTo(0, 0);
}

function renderQuestion() {
  const currentQ = questions[state.currentIdx];
  el.question.textContent = currentQ.q;
  
  const progress = state.currentIdx + 1;
  el.progressText.textContent = `QUESTION ${String(progress).padStart(2, "0")} / ${questions.length}`;
  el.progressBar.style.width = `${(progress / questions.length) * 100}%`;

  const answerOptions = [
    { label: "매우 그렇다", p: 5 },
    { label: "그렇다", p: 4 },
    { label: "보통이다", p: 3 },
    { label: "아니다", p: 2 },
    { label: "전혀 아니다", p: 1 },
  ];

  el.answers.innerHTML = "";
  answerOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = opt.label;
    btn.onclick = () => handleNext(opt.p);
    el.answers.appendChild(btn);
  });
}

function handleNext(point) {
  const type = questions[state.currentIdx].type;
  const calculatedPoint = (type === "coder") ? (6 - point) : point;
  state.scores[type] += calculatedPoint;

  if (state.currentIdx < questions.length - 1) {
    state.currentIdx++;
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const maxPossibleScore = questions.length * 5;
  const totalScore = Object.values(state.scores).reduce((a, b) => a + b, 0);
  const survivalRate = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));

  el.score.textContent = `${survivalRate}%`;
  
  let feedback = "";
  if (survivalRate >= 85) {
    feedback = "🚀 <strong>독보적인 생존자</strong>: 당신은 이미 AI를 도구로 부리며 전체를 설계하는 '슈퍼 아키텍트'입니다. 어떤 기술적 격변이 와도 살아남을 확률이 매우 높습니다.";
  } else if (survivalRate >= 65) {
    feedback = "✅ <strong>안정적인 생존권</strong>: AI 활용 능력과 설계 감각이 훌륭합니다. 다만, 비즈니스 가치를 창출하는 기획 역량을 조금 더 보강한다면 대체 불가능한 인재가 될 것입니다.";
  } else if (survivalRate >= 40) {
    feedback = "⚠️ <strong>경고 단계</strong>: 아직은 수동적인 코딩 습관이 남아 있습니다. 단순 구현에 머물지 말고, 시스템 전체의 흐름과 AI 프롬프트 엔지니어링에 더 익숙해져야 합니다.";
  } else {
    feedback = "🚨 <strong>위험 단계</strong>: 현재의 개발 스타일은 AI에 의해 가장 먼저 대체될 위험이 큽니다. '어떻게 짜느냐'보다 '무엇을 왜 만드느냐'로 사고의 중심을 옮기세요.";
  }

  el.analysisText.innerHTML = `<p>${feedback}</p>`;
  setMode("result");
  window.scrollTo(0, 0);
}

function resetTest() {
  setMode("home");
  window.scrollTo(0, 0);
}

window.startTest = startTest;
window.resetTest = resetTest;

function renderAllCharts() {
  const gridColor = 'rgba(229, 231, 235, 0.5)';

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: ['22년', '23년', '24년', '25년', '26년'],
      datasets: [{
        data: [15, 30, 48, 65, 72],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor, drawTicks: false },
          ticks: { stepSize: 20, color: '#94a3b8' }
        }
      }
    }
  });

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['설계 역량', 'AI 활용력', '비즈니스 기획', '창의적 사고', '단순 코딩'],
      datasets: [{
        data: [95, 88, 75, 65, 35],
        backgroundColor: ['#3b82f6', '#1e293b', '#60a5fa', '#94a3b8', '#cbd5e1'],
        borderRadius: 8,
        maxBarThickness: 32, 
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false, 
      layout: {
        padding: { right: 40 , bottom: 100 } 
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { 
          beginAtZero: true, 
          max: 100, 
          grid: { color: 'rgba(229, 231, 235, 0.4)', drawTicks: false },
          ticks: { display: false }
        },
        y: { 
          grid: { display: false },
          ticks: { 
            font: { 
              size: 13, 
              family: "'Pretendard', 'Inter', sans-serif", 
              weight: '600' 
            },
            color: '#334155'
          }
        }
      }
    },
    plugins: [{
      id: 'valueLabel',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.font = "bold 13px 'Inter', sans-serif";
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        chart.getDatasetMeta(0).data.forEach((bar, index) => {
          const value = chart.data.datasets[0].data[index] + '%';
          ctx.fillText(value, bar.x + 12, bar.y);
        });
        ctx.restore();
      }
    }]
  });

  new Chart(document.getElementById('impactChart'), {
    type: 'doughnut',
    data: {
      labels: ['AI 자동화', '인간 창의 영역'],
      datasets: [{
        data: [72, 28],
        backgroundColor: ['#3b82f6', '#0f172a'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '75%',
      animation: { animateScale: true, animateRotate: true },
      plugins: { legend: { display: false } }
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setMode("home");

  const reportSection = document.getElementById("data-report");
  let isChartRendered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isChartRendered) {
        renderAllCharts();
        isChartRendered = true;
      }
    });
  }, { threshold: 0.3 });

  if (reportSection) observer.observe(reportSection);
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; 
  }
}

window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
});

// --- 추가된 이메일 복사 기능 ---
function copyEmail() {
  const email = "codemake0902@gmail.com";
  
  navigator.clipboard.writeText(email).then(() => {
    alert("이메일 주소가 복사되었습니다!\n" + email);
  }).catch(err => {
    console.error("복사 실패:", err);
    alert("복사에 실패했습니다. 직접 드래그해서 복사해주세요.");
  });
}