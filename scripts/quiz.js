// Quiz o Was - pytania personalizowane
const quizData = [
    {
        question: "Gdzie było nasze pierwsze spotkanie/randka?",
        options: ["Na spacerze", "U mnie", "U ciebie", "W maku"],
        correct: 2,
    },
    {
        question: "Jaki jest mój ulubiony kolor?",
        options: ["Navy", "Czarny", "Ciemny czerwony", "Różowy"],
        correct: 2
    },
    {
        question: "Kiedy obchodzimy rocznicę?",
        options: ["5 grudnia", "4 grudnia", "12 grudnia", "7 grudnia"],
        correct: 0
    },
    {
        question: "Jaki był jeden z pierwszym komplementów jaki ci dałam?",
        options: ["Masz fajne włosy", "Ładnie pachniesz", "Dobrze mi się z tobą rozmiawia", "Lubię twoje dłonie"],
        correct: 1
    },
    {
        question: "Moja ulubiona randka z tobą?",
        options: ["Na spacerze w Jastrzębiu", "Na spacerze w Pawłowicach", "W kinie", "W twoim domu"],
        correct: 0
    },
    {
        question: "Kto pierwszy powiedział 'Kocham cię'?",
        options: ["Ty", "Ja"],
        correct: 1
    },
    {
        question: "Moje ulubione żarcie?",
        options: ["Sushi", "Kebab", "Pizza"],
        correct: 1
    },
    {
        question: "Jak do ciebie mówiłam jak zaczęłyśmy gadać?",
        options: ["Misiu", "Słońce", "Słodka", "Emi"],
        correct: 2
    }
];

// Zmienne stanu quizu
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizStarted = false;

// Elementy DOM
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');



// Funkcje
function startQuiz() {
    // Resetuj stan quizu
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    quizStarted = true;
    
    // Przejdź do ekranu pytań
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    
    // Załaduj pierwsze pytanie
    loadQuestion();
}

function loadQuestion() {
    // Resetuj wybór
    selectedAnswer = null;
    nextButton.style.display = 'none';
    
    // Pobierz aktualne pytanie
    const question = quizData[currentQuestion];
    
    // Uaktualnij tekst pytania
    questionText.textContent = question.question;
    
    // Uaktualnij licznik
    questionCounter.textContent = `Pytanie ${currentQuestion + 1}/${quizData.length}`;
    
    // Uaktualnij pasek postępu
    const progress = ((currentQuestion) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Uaktualnij wynik
    scoreDisplay.textContent = `Wynik: ${score}/${currentQuestion}`;
    
    // Wyczyść opcje
    optionsContainer.innerHTML = '';
    
    // Dodaj nowe opcje
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.index = index;
        
        button.addEventListener('click', () => selectAnswer(index, button));
        
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(index, button) {
    if (selectedAnswer !== null) return; // Zapobiegaj wielokrotnemu klikaniu
    
    selectedAnswer = index;
    const question = quizData[currentQuestion];
    
    // Pokaż, która odpowiedź jest poprawna
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach((btn, i) => {
        if (i === question.correct) {
            btn.classList.add('correct');
        }
        if (i === index && i !== question.correct) {
            btn.classList.add('wrong');
        }
        btn.disabled = true;
    });
    
    // Sprawdź odpowiedź
    if (index === question.correct) {
        score++;
        scoreDisplay.textContent = `Wynik: ${score}/${currentQuestion + 1}`;
        // Możesz dodać dźwięk sukcesu tutaj
    } else {
        // Możesz dodać dźwięk błędu tutaj
    }
    
    // Pokaż przycisk "Dalej"
    nextButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    // Przejdź do ekranu wyników
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Ustaw wynik końcowy
    const percentage = Math.round((score / quizData.length) * 100);
    finalScore.textContent = score;
    
    // Ustaw komunikat w zależności od wyniku
    
    // Uzupełnij pasek postępu do 100%
    progressFill.style.width = '100%';
}

function restartQuiz() {
    // Wróć do ekranu startowego
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Dodaj dźwięki (opcjonalnie)
function playSound(type) {
    // Możesz dodać dźwięki sukcesu/błędu
    // np. new Audio('sounds/correct.mp3').play();
}

// Inicjalizacja przy starcie
document.addEventListener('DOMContentLoaded', function() {
    // Możesz dodać animacje startowe
    console.log('Quiz załadowany! ❤️');
});

// Opcjonalnie: dodaj obsługę klawiatury
document.addEventListener('keydown', function(event) {
    if (!quizStarted) return;
    
    if (event.key >= '1' && event.key <= '4') {
        const index = parseInt(event.key) - 1;
        const buttons = document.querySelectorAll('.option-btn');
        if (buttons[index]) {
            selectAnswer(index, buttons[index]);
        }
    }
    
    if (event.key === 'Enter' && nextButton.style.display === 'block') {
        nextQuestion();
    }
});