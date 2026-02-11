const quizSection = document.querySelector('.question-box');
const optionList = document.querySelector('.option-list');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.previous');


let userDoubts = [];
let timerInterval;
let questionCount = 0;
let isReviewMode = false;
let questionOrder = questions.map((_, i) => i); 
let userAnswers = new Array(questions.length).fill(null);
const els = {
    grid: document.getElementById('grid'),
    qIndexImg: document.querySelector('.question-image')
};



showQuestions(0, false);
updateProgres();
twohundredMinutes();
initGrid();

const calcToggle = document.querySelector('.calc-button');
const calcArea = document.querySelector('.calc-area');

function toggleCalc() {
    calcArea.classList.toggle('active');
    calcToggle.classList.toggle('active');

    if (calcToggle.classList.contains('active')) {
        
        calcToggle.innerHTML = `<i class="fa-solid fa-calculator" style="margin-right: 5px;"></i> Hide Calculator`;
    } else {
        calcToggle.innerHTML = `<i class="fa-solid fa-calculator" style="margin-right: 5px;"></i> Show Calculator`;
    }
}

calcToggle.addEventListener('click', toggleCalc);


   function initGrid() {
    els.grid.innerHTML = '';
    questions.forEach((_, index) => {
      
        const btn = document.createElement('div'); 
        
        btn.className = 'grid-item'; 
        btn.innerText = index + 1;
        btn.id = `nav-${index}`; 
        
        btn.onclick = () => { 
                questionCount = index; 
                showQuestions(index);
                updateGridStatus(); 
        };
        
        els.grid.appendChild(btn); 
    });
    updateGridStatus();
}

    function updateGridStatus() {
    document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${questionCount}`);
    if(currentNav) currentNav.classList.add('active');

      questions.forEach((_, idx) => {
        const nav = document.getElementById(`nav-${idx}`);
        if(!nav) return;

        nav.classList.remove('answered', 'doubtful', 'correct-nav', 'wrong-nav', 'unanswered-nav');

        if (isReviewMode) {
            const userAns = userAnswers[idx];
            const correctAns = questions[idx].answer;

            if (userAns === null || userAns === undefined) {
                nav.classList.add('unanswered-nav');
            } else if (userAns === correctAns) {
                nav.classList.add('correct-nav');
            } else {
                nav.classList.add('wrong-nav');
            }
        } else {
            if (userDoubts[idx]) {
                nav.classList.add('doubtful');
            } else if (userAnswers[idx] !== null && userAnswers[idx] !== undefined) {
                nav.classList.add('answered');
            }
        }
    });
}

 function updateGridResultStatus() {
    document.querySelectorAll('.grid-item-result').forEach(el => el.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${questionCount}`);
    if(currentNav) currentNav.classList.add('active');

      questions.forEach((_, idx) => {
        const nav = document.getElementById(`nav-${idx}`);
        if(!nav) return;

        nav.classList.remove('answered', 'doubtful', 'correct-nav', 'wrong-nav', 'unanswered-nav');

        if (isReviewMode) {
            const userAns = userAnswers[idx];
            const correctAns = questions[idx].answer;

            if (userAns === null || userAns === undefined) {
                nav.classList.add('unanswered-nav');
            } else if (userAns === correctAns) {
                nav.classList.add('correct-nav');
            } else {
                nav.classList.add('wrong-nav');
            }
        } 
    });
}

const gridResult = document.getElementById('grid-result');

function initGridResult() {
    gridResult.innerHTML = '';
    questions.forEach((_, index) => {
      
        const btn = document.createElement('div'); 
        
        btn.className = 'grid-item-result'; 
        btn.innerText = index + 1;
        btn.id = `nav-${index}`; 
        
        btn.onclick = () => { 
                questionCount = index; 
                showQuestions(index, true);
                updateGridResultStatus(); 
        };
        
        gridResult.appendChild(btn); 
    });
    updateGridResultStatus();
}



function showQuestions(index, isResultPage = false) {
    const qIndex = questionOrder[index];
    const currentQuestion = questions[qIndex];
    const currentNumber = document.querySelectorAll('.current-number');
   currentNumber.forEach(el => {
        el.innerText = `Soal ${index + 1}`;
    });

   // FUNGSI TOMBOL RAGU
    const doubtBtn = document.querySelector('.doubt-btn');
        if (userDoubts[index]) {
        doubtBtn.classList.add('active'); 
    } else {
        doubtBtn.classList.remove('active'); 
    }
    
    const textSelector = isResultPage ? '.question-text-result' : '.question-text';
    const listSelector = isResultPage ? '.option-list-result' : '.option-list';
    
    const questionText = document.querySelector(textSelector);
    const optionList = document.querySelector(listSelector);

    const explaText = document.querySelector('.explanation-text');
    const explaImgContainer = document.querySelector('.explanation-img');

    if(!questionText || !optionList) return; 

    let displayContent = `<p>${currentQuestion.question}</p>`;

    if (currentQuestion.img) { 
    displayContent += `
      <div class="question-image-container" style="text-align: center; margin: 15px 0;">
        <img src="assets/${currentQuestion.img}" alt="Ilustrasi" style="max-width: 100%; border-radius: 8px;">
      </div>`;
} 

  questionText.innerHTML = displayContent;


        
    let optionTag = '';
    const correctMark = document.querySelector('.correct-mark');
    if (correctMark) correctMark.style.display ='none';

    currentQuestion.options.forEach((opt) => {
        let statusClass = '';
        
        if (isReviewMode) {
            const isCorrect = (opt === currentQuestion.answer);
            const isUserChoice = (userAnswers[index] === opt);

            if (isCorrect) {
                statusClass = 'correct-opt';

                if (isUserChoice && correctMark) {
                correctMark.style.display = 'flex'; 
            }
                }
            else if (isUserChoice && !isCorrect) {
                statusClass = 'wrong-opt';
                if (correctMark) correctMark.style.display = 'none';
               }
        } else if (userAnswers[index] === opt) {
            statusClass = 'selected';
               }

        optionTag += `
            <div class="option ${statusClass}" onclick="optionSelected(this, ${index})">
                <span class="circle"></span>
                <span>${opt}</span>
            </div>`;
    });
    optionList.innerHTML = optionTag;

    if (isReviewMode) {
        if (explaText) {
            explaText.innerHTML = currentQuestion.explanation || "Tidak ada pembahasan.";
        }
        
        if (explaImgContainer) {
            if (currentQuestion.expImg) {
                explaImgContainer.innerHTML = `<img src="assets/${currentQuestion.expImg}" style="max-width:100%; border-radius:8px;">`;
            } else {
                explaImgContainer.innerHTML = '';
            }
        }
    }
}


function optionSelected(answerElement, questionIndex) {
    if (isReviewMode) return; 

    const allOptions = document.querySelectorAll('.option');
    const selectedText = answerElement.querySelector('span:last-child').innerText.trim();

    allOptions.forEach(opt => opt.classList.remove('selected'));
    answerElement.classList.add('selected');
    
    userAnswers[questionIndex] = selectedText;
    
    updateGridStatus();
    updateProgres();
}


function updateProgres() {
    const totalSoal = questions.length;
    const jumlahTerjawab = userAnswers.filter(answer => answer !== null && answer !== undefined).length;
    const jumlahRagu = userDoubts.filter(val => val === true).length;
    const jumlahSkipped = totalSoal - jumlahTerjawab;

    const element = document.querySelector('.answered');
    const marked = document.querySelector('.marked');
    const skippedElement = document.querySelector('.skipped');
    if (element) {
       element.innerHTML = `Answered: <span class="answered-status">${jumlahTerjawab}</span>`;
    }

    if (marked) {
       marked.innerHTML = `Marked: <span class="marked-status">${jumlahRagu}</span>`;
    }

    if (skippedElement) {
        skippedElement.innerHTML = `Skipped: <span class="skipped-status">${jumlahSkipped}</span>`;
    }


}


// Next Button
nextBtn.onclick = () => {
  if(questionCount < questions.length - 1) {
    questionCount++;
    showQuestions(questionCount);
    updateGridStatus();
    updateProgres();
  }
}

function toggleDoubt() {
    userDoubts[questionCount] = !userDoubts[questionCount];
    
    const doubtBtn = document.querySelector('.doubt-btn');
    
    if (userDoubts[questionCount]) {
        doubtBtn.classList.add('active'); 
    } else {
        doubtBtn.classList.remove('active');
    }
    
    updateGridStatus();
    updateProgres();
}

prevBtn.onclick = () => {
  if (questionCount > 0) {
    questionCount--;
    showQuestions(questionCount);
    updateGridStatus();
    updateProgres();
  }
};




function startTimer(duration, display) {
    clearInterval(timerInterval);
    
    let timer = duration;

    timerInterval = setInterval(function () {
        let hours   = Math.floor(timer / 3600);
        let minutes = Math.floor((timer % 3600) / 60);
        let seconds = Math.floor(timer % 60);

        hours   = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00:00";
            alert("Waktu Ujian Telah Habis!");
            if(typeof showResults === 'function') showResults();
        }
    }, 1000);
}

function twohundredMinutes() {
    const totalSeconds = 200 * 60; 
    const display = document.querySelector('.countdown');
    
    if (display) {
        startTimer(totalSeconds, display);
    } else {
        console.error("Elemen .countdown tidak ditemukan!");
    }
}

const quizContainer = document.querySelector('.quiz-container');
const boxNavigation = document.querySelector('.quiz-navigation');
const boxResult = document.querySelector('.box-result');
const boxCountdown = document.querySelector('.box-countdown');
const status = document.querySelector('.status');


    const categoryStats = {};
function showResults() {
    closesubmitAllert();
    isReviewMode = true;
    clearInterval(timerInterval);
    boxCountdown.style.display = 'none';
    boxNavigation.classList.add('deactive');
    boxResult.classList.add('active');
    status.style.display = 'none';
    initGridResult();
    updateGridResultStatus();
    showQuestions(0, true);


    let correctCount = 0;

    let reviewHTML = "";
    const answerMap = ["A", "B", "C", "D", "E"];

    questions.forEach((q, i) => {
  
    const userSelectedText = userAnswers[i]; 
    const correctText = q.answer; 
    const category = q.category;

    if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, correct: 0 };
    }
    categoryStats[category].total++;
    
    if (userSelectedText === correctText) {
        correctCount++;
        categoryStats[category].correct++;
    }
}); 


const objekKategori = Object.keys(categoryStats);


const dataScores = objekKategori.map(cat => {
    const stats = categoryStats[cat];
    return ((stats.correct / stats.total) * 100).toFixed(2);
});


const textSummary = objekKategori.map(cat => {
    const stats = categoryStats[cat];
   
    return `<span class="category-name">${cat}</span><br> <span class="category-total">${stats.correct} / ${stats.total}</span>`;
});



const detailContainer = document.getElementById('category-detail');

if (detailContainer) {
    detailContainer.innerHTML = textSummary.join('<br>');
}

createGraph(objekKategori, dataScores);

///Fungsi Score
    let score = (questions.length > 0) ? (correctCount / questions.length) * 100 : 0;
    quizContainer.style.display = 'none';
        setProgress(score.toFixed(1));

    // const dataHasil = {
    //     nama: "User Alfan",
    //     skor: score.toFixed(1),
    //     benar: correctCount,
    //     totalSoal: questions.length,
    //     waktu: new Date().toLocaleString()
    // };

    // const scriptURL = 'https://script.google.com/macros/s/AKfycbwcXVl-SjLDkBgyulUAqFqdcry95YcNpNQZSTplP13yvUzglnORJmw6Lfjv7EhLC6QcqA/exec';

    // fetch(scriptURL, {
    //     method: 'POST',
    //     mode: 'no-cors', // Penting untuk Google Apps Script
    //     body: JSON.stringify(dataHasil),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(() => alert("Skor berhasil disimpan!"))
    // .catch(error => console.error('Error!', error.message));

    const resultContainer = document.querySelector('.box-result');
    if (resultContainer) {
        resultContainer.style.display = 'flex';
        
        document.getElementById('correct-stat').innerText = correctCount;
        document.getElementById('total-stat').innerText = questions.length;
        document.getElementById('review-list').innerHTML = reviewHTML;

    }
}

const ctx = document.getElementById('myRadarChart');

function createGraph (objekKategori, dataScores){
const data = {
  labels: objekKategori,
  datasets: [{
    label: '%Benar',
    data: dataScores,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
    
  }]
};

new Chart(ctx, {
 type: 'bar',
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: 0
      }
    }
  },
});
};

function setProgress(score) {
    const circle = document.querySelector('.meter');
    const text = document.getElementById('score-text');
    
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    text.innerText = score;
}



////CALCULATOR
let currentInput = "";
let historyDisplay = document.getElementById('history');
let resultDisplay = document.getElementById('result');

function appendNumber(num) {
  currentInput += num;
  updateDisplay();
}

function appendOperator(op) {
  const lastChar = currentInput.trim().slice(-1);

  if (op === '√') {
    if (currentInput === "" || "+-*/".includes(lastChar)) {
      currentInput += op; 
    } else {
      currentInput += " * √";
    }
  } 
  else if (op === 'x²') {
    if (currentInput !== "" && (!isNaN(lastChar) || lastChar === ")")) {
      currentInput += "²";
    }
  } 
  else {
    if (currentInput === "" && op !== "-") return;
    
    if ("+-*/".includes(lastChar)) {
      currentInput = currentInput.trim().slice(0, -1) + " " + op + " ";
    } else {
      currentInput += " " + op + " ";
    }
  }
  
  updateDisplay();
}

function toggleSign() {
  if (currentInput === "" || currentInput === "0") return;
  let parts = currentInput.split(" ");
  let lastPart = parts[parts.length - 1];

  if (lastPart !== "" && !isNaN(lastPart.replace('√', ''))) {
    if (lastPart.startsWith("-")) {
      parts[parts.length - 1] = lastPart.substring(1);
    } else {
      parts[parts.length - 1] = "-" + lastPart;
    }
    currentInput = parts.join(" ");
    updateDisplay();
  }
}

function clearDisplay() {
  currentInput = "";
  historyDisplay.innerText = "0";
  resultDisplay.innerText = "0";
}

function updateDisplay() {
  resultDisplay.innerText = currentInput || "0";
}

function calculate() {
  let expression = currentInput;

  try {
    expression = expression.replace(/(\d+)\u00B2/g, 'Math.pow($1, 2)');

    expression = expression.replace(/\u221A(\d+)/g, 'Math.sqrt($1)');

    let result = eval(expression);
    
    currentInput = Number(result.toFixed(2)).toString();
    updateDisplay();
  } catch (error) {
    currentInput = "Error";
    updateDisplay();
  }
}
//END CALCULATOR


const bodyElement = document.querySelector('body');
const submitAllert = document.querySelector('.submit-allert');

function submitExam() {
  bodyElement.classList.add('submit-body');
  opensubmitAllert();
}



function opensubmitAllert() {
    submitAllert.classList.add('active');
}

function closesubmitAllert() {
    submitAllert.classList.remove('active');
    bodyElement.classList.remove('submit-body');
}

window.onclick = function(event) {
    if (event.target == submitAllert) {
        closesubmitAllert();
    }
}

const skorFarmakologi = questions.filter(q => q.category === 'Farmakologi' && userAnswers[questions.indexOf(q)] === q.answer).length;
const totalFarmakologi = questions.filter(q => q.category === 'Farmakologi').length;
const persenFarmakologi = (skorFarmakologi / totalFarmakologi) * 100;

