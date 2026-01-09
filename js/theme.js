document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const trippyThemeLink = document.createElement('link');
    trippyThemeLink.rel = 'stylesheet';
    
    // Adjust path based on how deep the file is nested
    const pathPrefix = document.body.dataset.pathPrefix || '';
    trippyThemeLink.href = `${pathPrefix}css/trippy.css`;

    // Function to apply theme based on selection
    function applyTheme(theme) {
        if (theme === 'trippy') {
            document.body.classList.add('trippy-theme');
            if (!document.querySelector(`link[href="${pathPrefix}css/trippy.css"]`)) {
                document.head.appendChild(trippyThemeLink);
            }
        } else {
            document.body.classList.remove('trippy-theme');
            const existingLink = document.querySelector(`link[href="${pathPrefix}css/trippy.css"]`);
            if (existingLink) {
                document.head.removeChild(existingLink);
            }
        }
    }
/* =========================================
   MATRIX RAIN EFFECT & THEME LOGIC
   ========================================= */

let matrixInterval; // Holds the timing for the animation

function startMatrixRain() {
    // 1. Check if canvas exists, if not, create it
    let canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        // Style it to sit in the background
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1'; // Sit behind text but (potentially) in front of the grid
        canvas.style.pointerEvents = 'none'; // Click-through
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    // 2. Set dimensions to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 3. Define the characters (Katakana + Latin + Nums)
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize; // Number of columns
    const drops = [];

    // Initialize drops (one per column)
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // 4. The Drawing Loop
    const draw = () => {
        // Translucent black background to create the "trail" effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Matrix Green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Send drop back to top randomly after it crosses screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    };

    // 5. Start the animation (35ms = ~30fps)
    clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 35);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function stopMatrixRain() {
    clearInterval(matrixInterval); // Stop the CPU usage
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        canvas.remove(); // Remove the element from the page
    }
}

// Updated setTheme function to link it all together
function setTheme(themeName) {
    const root = document.documentElement;
    const themePopup = document.querySelector('.theme-popup'); // Get popup to hide it

    if (themeName === 'default') {
        root.style.setProperty('--cyan', '#00f5d4');
        root.style.setProperty('--magenta', '#ff00f5');
        root.style.setProperty('--dark-violet', '#0d0221');
        stopMatrixRain(); // Turn off rain
    } 
    else if (themeName === 'matrix') {
        root.style.setProperty('--cyan', '#00ff00');   // Matrix Green
        root.style.setProperty('--magenta', '#008f11'); // Darker Green
        root.style.setProperty('--dark-violet', '#000000'); // Pure Black
        startMatrixRain(); // Turn on rain
    } 
    else if (themeName === 'vaporwave') {
        root.style.setProperty('--cyan', '#ff71ce');   // Hot Pink
        root.style.setProperty('--magenta', '#01cdfe'); // Bright Blue
        root.style.setProperty('--dark-violet', '#2b1c40'); // Deep Purple
        stopMatrixRain(); // Turn off rain
    }

    // Close the menu automatically
    if (themePopup) {
        themePopup.style.display = 'none';
    }
}
    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Toggle theme on button click
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'trippy') {
                localStorage.removeItem('theme');
                applyTheme('default');
            } else {
                localStorage.setItem('theme', 'trippy');
                applyTheme('trippy');
            }
        });
    }
});
