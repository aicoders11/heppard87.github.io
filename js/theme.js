document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    };

    // Check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check for the user's OS preference if no theme is saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine the initial theme
    let currentTheme;
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply the initial theme
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme); // Save the initial theme

    // Toggle theme on button click
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});
