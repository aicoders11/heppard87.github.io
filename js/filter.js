document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const showGames = document.getElementById('show-games');
    const showUtilities = document.getElementById('show-utilities');
    const viewModeToggle = document.getElementById('view-mode-toggle');
    const viewModeLabel = document.getElementById('view-mode-label');
    const appsGrid = document.getElementById('apps-grid');
    const appItems = Array.from(appsGrid.getElementsByClassName('feature-item'));

    function filterAndDisplayApps() {
        const searchTerm = searchBar.value.toLowerCase();
        const gamesVisible = showGames.checked;
        const utilitiesVisible = showUtilities.checked;

        appItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const category = item.getAttribute('data-category');

            const searchMatch = title.includes(searchTerm);
            const categoryMatch = (gamesVisible && category === 'game') || (utilitiesVisible && category === 'utility');

            if (searchMatch && categoryMatch) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function toggleViewMode() {
        if (viewModeToggle.checked) {
            appsGrid.classList.add('list-view');
            viewModeLabel.textContent = 'List';
        } else {
            appsGrid.classList.remove('list-view');
            viewModeLabel.textContent = 'Grid';
        }
    }

    searchBar.addEventListener('input', filterAndDisplayApps);
    showGames.addEventListener('change', filterAndDisplayApps);
    showUtilities.addEventListener('change', filterAndDisplayApps);
    viewModeToggle.addEventListener('change', toggleViewMode);

    // Initial filter and view mode setup
    filterAndDisplayApps();
    toggleViewMode();
});
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons and add to the clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            featureItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block'; // Show matching cards
                    // Optional: Add a small fade-in animation here
                } else {
                    item.style.display = 'none'; // Hide non-matching cards
                }
            });
        });
    });
});
