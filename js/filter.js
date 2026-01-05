document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    // Consolidated function for staggered transitions
    function filterGallery(category) {
        let visibleCount = 0;

        featureItems.forEach(item => {
            // Reset state
            item.classList.remove('show');
            item.style.transitionDelay = '0s';
            
            if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                
                // Set staggered delay: 0s, 0.1s, 0.2s...
                const delay = visibleCount * 0.1; 
                visibleCount++;

                setTimeout(() => {
                    item.style.transitionDelay = `${delay}s`;
                    item.classList.add('show');
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Single event listener loop for buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Manage active class for color changes
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });

    // Initialize with "Web" category
    filterGallery('web');

    // Logic for Apps Page Search & Filtering
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
});        // This removes the active color from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // This adds the active color to the one you just clicked
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        filterGallery(filterValue);
    });
});
    // Initialize with "Web" category
    filterGallery('web');

    // Logic for Apps Page Search (Keeping your existing search logic)
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
function filterGallery(category) {
    let visibleCount = 0;
    featureItems.forEach(item => {
        item.classList.remove('show');
        if (item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            const delay = visibleCount * 0.1; 
            visibleCount++;
            setTimeout(() => {
                item.style.transitionDelay = `${delay}s`;
                item.classList.add('show');
            }, 50);
        } else {
            item.style.display = 'none';
        }
    });
}
function filterGallery(category) {
    const items = document.querySelectorAll('.feature-item');
    
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block'; // Keeps it in the grid flow
            setTimeout(() => item.classList.add('show'), 10);
        } else {
            item.style.display = 'none'; // Removes it from grid flow
            item.classList.remove('show');
        }
    });
}
