document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic for Home Page Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                featureItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Logic for Apps Page (Search & Checkboxes)
    const searchBar = document.getElementById('search-bar');
    const appsGrid = document.getElementById('apps-grid');

    if (searchBar && appsGrid) {
        const showGames = document.getElementById('show-games');
        const showUtilities = document.getElementById('show-utilities');
        const appItems = Array.from(appsGrid.getElementsByClassName('feature-item'));

        function filterApps() {
            const searchTerm = searchBar.value.toLowerCase();
            appItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const category = item.getAttribute('data-category');
                const searchMatch = title.includes(searchTerm);
                const categoryMatch = (showGames.checked && category === 'game') || 
                                    (showUtilities.checked && category === 'utility');

                item.style.display = (searchMatch && categoryMatch) ? '' : 'none';
            });
        }

        searchBar.addEventListener('input', filterApps);
        showGames.addEventListener('change', filterApps);
        showUtilities.addEventListener('change', filterApps);
    }
});
