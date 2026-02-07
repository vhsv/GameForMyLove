// --- SUPABASE SETUP ---
const supabaseClient = supabase.createClient(
    'https://roupgnrqyixekwxleaxr.supabase.co',
    'sb_publishable_7FwSBf0MA_ECLWyQ0rdSug_wNbQYhO7'
);

// --- CANVAS SETUP ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ustaw białe tło
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;
let color = document.getElementById('colorPicker').value;
let brushSize = parseInt(document.getElementById('brushSize').value);
let lastX = 0;
let lastY = 0;
let isErasing = false;

// Ustawienia pędzla
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Funkcje do obsługi rysowania
function startDrawing(x, y) {
    drawing = true;
    [lastX, lastY] = [x, y];
    
    // Rysujemy punkt na początku
    ctx.beginPath();
    ctx.arc(x, y, brushSize/2, 0, Math.PI * 2);
    ctx.fillStyle = isErasing ? '#FFFFFF' : color;
    ctx.fill();
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(x, y) {
    if (!drawing) return;
    
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
    ctx.fillStyle = isErasing ? '#FFFFFF' : color;
    
    // Płynne rysowanie linii
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Dodajemy kropkę na końcu dla lepszej płynności
    ctx.beginPath();
    ctx.arc(x, y, brushSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    [lastX, lastY] = [x, y];
}

// Eventy myszy
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    startDrawing(x, y);
});

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    draw(x, y);
});

// Eventy dotykowe dla telefonów
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    startDrawing(x, y);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    draw(x, y);
});

// --- KONTROLS ---
// Zmiana koloru
document.getElementById('colorPicker').addEventListener('input', (e) => {
    color = e.target.value;
    isErasing = false;
    document.getElementById('eraserBtn').classList.remove('active');
    document.getElementById('brushBtn').classList.add('active');
});

// Zmiana rozmiaru pędzla
document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    document.getElementById('brushSizeValue').textContent = `${brushSize}px`;
});



// Przycisk pędzla
document.getElementById('brushBtn').addEventListener('click', () => {
    isErasing = false;
    document.getElementById('eraserBtn').classList.remove('active');
    document.getElementById('brushBtn').classList.add('active');
});

// Przycisk gumki
document.getElementById('eraserBtn').addEventListener('click', () => {
    isErasing = true;
    document.getElementById('brushBtn').classList.remove('active');
    document.getElementById('eraserBtn').classList.add('active');
});

// Przycisk czyszczenia całego canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz wyczyścić cały rysunek?')) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        showNotification('Canvas wyczyszczony!', 'success');
    }
});

// Wybór predefiniowanych rozmiarów pędzla
document.querySelectorAll('.brush-size-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const size = parseInt(e.target.dataset.size);
        brushSize = size;
        document.getElementById('brushSize').value = size;
        document.getElementById('brushSizeValue').textContent = `${size}px`;
    });
});

// --- SAVE TO SUPABASE ---
document.getElementById('saveBtn').addEventListener('click', async () => {
    try {
        const drawingName = document.getElementById('drawingName').value.trim() || `rysunek-${Date.now()}`;
        
        canvas.toBlob(async (blob) => {
            const fileName = `${drawingName}-${Date.now()}.png`;
            
            const { data, error } = await supabaseClient.storage
                .from('drawings')
                .upload(fileName, blob, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (error) {
                console.error('Błąd zapisu:', error);
                showNotification('Błąd zapisu: ' + error.message, 'error');
            } else {
                console.log('Zapisano:', data);
                showNotification('Rysunek zapisany pomyślnie!', 'success');
                document.getElementById('drawingName').value = '';
                loadGallery();
            }
        }, 'image/png', 1.0); // 1.0 = bez kompresji
    } catch (error) {
        console.error('Błąd:', error);
        showNotification('Wystąpił błąd: ' + error.message, 'error');
    }
});

// --- USUWANIE Z BAZY ---
async function deleteDrawing(fileName) {
    if (!confirm('Czy na pewno chcesz usunąć ten rysunek z bazy danych?')) {
        return;
    }
    
    try {
        const { error } = await supabaseClient.storage
            .from('drawings')
            .remove([fileName]);

        if (error) {
            console.error('Błąd usuwania:', error);
            showNotification('Błąd usuwania: ' + error.message, 'error');
        } else {
            showNotification('Rysunek usunięty pomyślnie!', 'success');
            loadGallery();
        }
    } catch (error) {
        console.error('Błąd:', error);
        showNotification('Wystąpił błąd: ' + error.message, 'error');
    }
}

// --- LOAD GALLERY ---
async function loadGallery() {
    try {
        const { data: files, error } = await supabaseClient.storage
            .from('drawings')
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Błąd ładowania galerii:', error);
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '<div class="no-drawings"><p>Błąd ładowania galerii.</p></div>';
            return;
        }

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        if (!files || files.length === 0) {
            gallery.innerHTML = `
                <div class="no-drawings">
                    <i class="fas fa-image"></i>
                    <p style="font-size: 30px;">Brak rysunków. Stwórz pierwszy!</p>
                </div>
            `;
            return;
        }

        for (const file of files) {
            const { data: urlData } = supabaseClient.storage
                .from('drawings')
                .getPublicUrl(file.name);

            const createdAt = file.created_at ? new Date(file.created_at).toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Nieznana data';

            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            
            // Nagłówek z nazwą i datą
            const header = document.createElement('div');
            header.className = 'gallery-header';
            
            const fileNameDisplay = document.createElement('div');
            fileNameDisplay.className = 'gallery-filename';
            fileNameDisplay.textContent = file.name.split('-').slice(0, -1).join('-') || file.name;
            fileNameDisplay.title = file.name;
            
            const dateDisplay = document.createElement('div');
            dateDisplay.className = 'gallery-date';
            dateDisplay.textContent = createdAt;
            
            header.appendChild(fileNameDisplay);
            header.appendChild(dateDisplay);
            
            // Obrazek
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-img-wrapper';
            
            const img = document.createElement('img');
            img.src = urlData.publicUrl + '?t=' + Date.now();
            img.alt = `Rysunek ${file.name}`;
            img.className = 'gallery-image';
            img.loading = 'lazy';
            
            imgWrapper.appendChild(img);
            
            // Przyciski akcji
            const actions = document.createElement('div');
            actions.className = 'gallery-actions';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'action-btn download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Pobierz';
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = urlData.publicUrl;
                link.download = file.name;
                link.click();
            };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Usuń';
            deleteBtn.onclick = () => deleteDrawing(file.name);
            
            actions.appendChild(downloadBtn);
            actions.appendChild(deleteBtn);
            
            imgContainer.appendChild(header);
            imgContainer.appendChild(imgWrapper);
            imgContainer.appendChild(actions);
            gallery.appendChild(imgContainer);
        }
    } catch (error) {
        console.error('Błąd w loadGallery:', error);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '<div class="no-drawings"><p>Wystąpił błąd podczas ładowania galerii.</p></div>';
    }
}

// --- FUNKCJE POMOCNICZE ---
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animacja pojawienia
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Zamknięcie
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Automatyczne zniknięcie
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    // Ustaw domyślny rozmiar pędzla i podgląd
    document.getElementById('brushSizeValue').textContent = `${brushSize}px`;
    
    // Załaduj galerię
    loadGallery();
    
    // Auto-odświeżanie galerii co 30 sekund
    setInterval(loadGallery, 30000);
});

// Responsywność
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(600, container.clientWidth - 40);
    
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = maxWidth + 'px';
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);