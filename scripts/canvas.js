// --- SUPABASE SETUP ---
// Utwórz klienta
const supabaseClient = supabase.createClient(
    'https://roupgnrqyixekwxleaxr.supabase.co',
    'sb_publishable_7FwSBf0MA_ECLWyQ0rdSug_wNbQYhO7'
);

// Sprawdź czy klient został poprawnie utworzony
console.log('Supabase client:', supabaseClient);

// --- CANVAS SETUP ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Czyszczenie canvas - czarne tło
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;
let color = document.getElementById('colorPicker').value;

// Funkcja do rysowania kwadratów
function drawSquare(x, y) {
    // Rysujemy 10x10 pikseli zaokrąglone do siatki 10px
    const gridX = Math.floor(x / 10) * 10;
    const gridY = Math.floor(y / 10) * 10;
    
    ctx.fillStyle = color;
    ctx.fillRect(gridX, gridY, 10, 10);
    
    // Dodajemy kontur dla lepszej widoczności
    ctx.strokeStyle = '#333';
    ctx.strokeRect(gridX, gridY, 10, 10);
}

// Eventy myszy
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawSquare(x, y);
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawSquare(x, y);
});

// Zmiana koloru
document.getElementById('colorPicker').addEventListener('input', (e) => {
    color = e.target.value;
});

// --- SAVE TO SUPABASE ---
document.getElementById('saveBtn').addEventListener('click', async () => {
    try {
        // Konwersja canvas do blob
        canvas.toBlob(async (blob) => {
            const fileName = `drawing-${Date.now()}.png`;
            
            // UŻYWAJ supabaseClient ZAMIAST supabase!
            const { data, error } = await supabaseClient.storage
                .from('drawings')
                .upload(fileName, blob, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (error) {
                console.error('Błąd zapisu:', error);
                alert('Błąd zapisu: ' + error.message);
            } else {
                console.log('Zapisano:', data);
                alert('Zapisano rysunek!');
                loadGallery(); // odśwież galerię
            }
        }, 'image/png');
    } catch (error) {
        console.error('Błąd:', error);
        alert('Wystąpił błąd: ' + error.message);
    }
});

// --- LOAD GALLERY ---
async function loadGallery() {
    try {
        // UŻYWAJ supabaseClient ZAMIAST supabase!
        const { data: files, error } = await supabaseClient.storage
            .from('drawings')
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Błąd ładowania galerii:', error);
            // Dodaj tymczasowy komunikat
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '<p>Błąd ładowania galerii. Sprawdź konfigurację Supabase.</p>';
            console.log('Szczegóły błędu:', error);
            return;
        }

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        if (!files || files.length === 0) {
            gallery.innerHTML = '<p>Brak rysunków. Stwórz pierwszy!</p>';
            return;
        }

        console.log('Znaleziono pliki:', files);

        for (const file of files) {
            // UŻYWAJ supabaseClient ZAMIAST supabase!
            const { data: urlData } = supabaseClient.storage
                .from('drawings')
                .getPublicUrl(file.name);

            const imgContainer = document.createElement('div');
            imgContainer.style.display = 'inline-block';
            imgContainer.style.margin = '10px';
            imgContainer.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = urlData.publicUrl + '?t=' + Date.now(); // cache busting
            img.alt = `Rysunek ${file.name}`;
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.objectFit = 'contain';
            img.style.border = '2px solid #444';
            img.style.borderRadius = '4px';
            
            // Dodaj nazwę pliku
            const fileName = document.createElement('p');
            fileName.textContent = file.name.substring(0, 15) + '...';
            fileName.style.fontSize = '10px';
            fileName.style.marginTop = '5px';
            fileName.style.color = '#aaa';

            imgContainer.appendChild(img);
            imgContainer.appendChild(fileName);
            gallery.appendChild(imgContainer);
        }
    } catch (error) {
        console.error('Błąd w loadGallery:', error);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = `<p>Błąd: ${error.message}</p>`;
    }
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM załadowany, inicjalizacja...');
    
    // Najpierw sprawdź czy elementy istnieją
    if (!canvas) {
        console.error('Nie znaleziono elementu canvas!');
        return;
    }
    
    if (!supabaseClient) {
        console.error('Supabase client nie został utworzony!');
        const gallery = document.getElementById('gallery');
        if (gallery) {
            gallery.innerHTML = '<p>Błąd połączenia z bazą danych.</p>';
        }
        return;
    }
    
    // Następnie załaduj galerię
    loadGallery();
    
    // Rysowanie siatki (opcjonalne)
    function drawGrid() {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Pionowe linie
        for (let x = 0; x <= canvas.width; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Poziome linie
        for (let y = 0; y <= canvas.height; y += 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // Odkomentuj poniższą linię jeśli chcesz siatkę
    // drawGrid();
});