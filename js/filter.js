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
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    // Function to filter items
    function filterGallery(category) {
        featureItems.forEach(item => {
            if (item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                // Trigger a small delay for fade-in effect if your CSS supports it
                setTimeout(() => item.style.opacity = '1', 10);
            } else {
                item.style.opacity = '0';
                item.style.display = 'none';
            }
        });
    }

    // Add click events to buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            filterGallery(filterValue);
        });
    });

    // Initialize the page with "Web" as the default view
    filterGallery('web');
});
function filterGallery(category) {
    let visibleCount = 0; // Track index for staggered delay

    featureItems.forEach(item => {
        item.classList.remove('show');
        // Reset delay to prevent interference during transitions
        item.style.transitionDelay = '0s';
        
        if (item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            
            // Increment count for staggered timing (e.g., 0.1s, 0.2s, 0.3s...)
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
