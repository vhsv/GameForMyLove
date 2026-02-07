// Data początkowa: 5 grudnia 2024, 16:00
const startDate = new Date('December 5, 2024 16:00:00').getTime();

// Elementy DOM
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const monthsElement = document.getElementById('months');
const weeksElement = document.getElementById('weeks');
const nextAnniversaryElement = document.getElementById('next-anniversary');
const heartsContainer = document.getElementById('hearts-container');


// Funkcja formatująca liczby (dodaje zero z przodu)
function formatNumber(num) {
    return num < 10 ? '0' + num : num;
}

// Funkcja obliczająca różnicę czasu
function updateTimeCounter() {
    const now = new Date().getTime();
    const distance = now - startDate;
    
    // Obliczenia czasu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);
    

}




// Dodaj styl dla animacji konfetti
const style = document.createElement('style');
style.textContent = `
    
    .special-day {
        animation: pulse 2s infinite;
        border-color: #ffd166 !important;
    }
    
    .month-anniversary {
        border-color: #ff9ebb !important;
        box-shadow: 0 0 50px rgba(255, 158, 187, 0.7) !important;
    }
    
    .week-anniversary {
        border-color: #84a07d !important;
    }
    
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0 40px rgba(255, 107, 139, 0.4);
        }
        50% {
            box-shadow: 0 0 60px rgba(255, 107, 139, 0.8);
        }
    }
`;
document.head.appendChild(style);

// Funkcja pokazująca powiadomienie
function showNotification(message) {
    // Możesz dodać dźwięk powiadomienia
    // new Audio('notification.mp3').play();
    
    // Pokazuj w konsoli dla uproszczenia
    console.log(`🎉 ${message}`);
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
    updateTimeCounter(); // Natychmiastowe wyświetlenie
    setInterval(updateTimeCounter, 1000); // Aktualizuj co sekundę
    
    console.log('Licznik czasu załadowany! ❤️');
});

// Opcjonalnie: dodaj przycisk kopiowania czasu
function copyTimeToClipboard() {
    const timeString = `${daysElement.textContent}d ${hoursElement.textContent}h ${minutesElement.textContent}m ${secondsElement.textContent}s`;
    navigator.clipboard.writeText(timeString).then(() => {
        alert('Czas skopiowany do schowka! 📋');
    });
}