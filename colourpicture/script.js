// --- 1. SITE DATA LOADER (JSON) ---
async function loadSiteDetails() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Update the Page Title and Description from JSON
        document.querySelector('h1').innerText = data.siteSettings.title;
        
        // Find the footer and clear it
        const footer = document.querySelector('.social-footer');
        footer.innerHTML = ''; 

        // Build the buttons from the JSON array
        data.socials.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'btn-outline';
            a.target = '_blank';
            a.innerText = link.name;
            footer.appendChild(a);
        });
        
    } catch (error) {
        console.warn("JSON not found or error loading. Using HTML defaults.");
    }
}

// Call the loader immediately
loadSiteDetails();

// --- 2. THEME LOGIC ---
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// --- 3. COLOR PICKER LOGIC ---
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const swatch = document.getElementById('swatch');
const hexVal = document.getElementById('hexVal');
const rgbVal = document.getElementById('rgbVal');

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    swatch.style.backgroundColor = hex;
    hexVal.innerText = hex;
    rgbVal.innerText = `${r}, ${g}, ${b}`;
});

async function copyContent(id) {
    const text = document.getElementById(id).innerText;
    try {
        await navigator.clipboard.writeText(text);
        // We use the event.target inside the HTML onclick for the button feedback
    } catch (err) { console.error(err); }
}