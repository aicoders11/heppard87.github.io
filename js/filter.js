document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. CARD FLIP LOGIC
    // =========================================
    const cards = document.querySelectorAll('.feature-item');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent flip if clicking the "Read More" button
            if (e.target.classList.contains('read-more-btn')) return;
            
            this.classList.toggle('is-flipped');
        });
    });

    // =========================================
    // 2. HOMEPAGE FILTER GALLERY LOGIC
    // =========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    // Only run this if filter buttons actually exist on the page
    if (filterButtons.length > 0) {
        
        // The main filtering function with staggered animation
        function filterGallery(category) {
            let visibleCount = 0;

            featureItems.forEach(item => {
                // Reset state
                item.classList.remove('show');
                item.style.transitionDelay = '0s'; // Reset delay so hiding is instant
                
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block'; // Put it back in the layout
                    
                    // Stagger the animation: 0s, 0.1s, 0.2s...
                    const delay = visibleCount * 0.1; 
                    visibleCount++;

                    // Small timeout ensures the display:block is applied before opacity transition starts
                    setTimeout(() => {
                        item.style.transitionDelay = `${delay}s`;
                        item.classList.add('show');
                    }, 20);
                } else {
                    item.style.display = 'none'; // Remove from layout
                }
            });
        }

        // Add Click Listeners to Buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Remove 'active' class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // 2. Add 'active' class to clicked button
                button.classList.add('active');

                // 3. Run the filter
                const filterValue = button.getAttribute('data-filter');
                filterGallery(filterValue);
            });
        });

        // Initialize with "Web" category (or 'all' if you prefer)
        filterGallery('web');
    }

    // =========================================
    // 3. APPS PAGE SEARCH & FILTER LOGIC
    // =========================================
    const searchBar = document.getElementById('search-bar');
    const appsGrid = document.getElementById('apps-grid');

    // Only run this if we are on the Apps page
    if (searchBar && appsGrid) {
        const showGames = document.getElementById('show-games');
        const showUtilities = document.getElementById('show-utilities');
        // Get items specifically inside the apps grid to avoid conflicting with homepage items
        const appItems = Array.from(appsGrid.getElementsByClassName('feature-item'));

        function filterApps() {
            const searchTerm = searchBar.value.toLowerCase();
            
            appItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const category = item.getAttribute('data-category');
                
                // Check if text matches
                const searchMatch = title.includes(searchTerm);
                
                // Check if checkbox matches
                let categoryMatch = false;
                if (category === 'game' && showGames.checked) categoryMatch = true;
                if (category === 'utility' && showUtilities.checked) categoryMatch = true;
                // If you want items to show when NO boxes are checked, uncomment the line below:
                // if (!showGames.checked && !showUtilities.checked) categoryMatch = true;

                // Show or Hide
                item.style.display = (searchMatch && categoryMatch) ? 'block' : 'none';
                
                // Simple fade in for search results (no stagger needed here usually)
                if (searchMatch && categoryMatch) {
                    setTimeout(() => item.classList.add('show'), 10);
                } else {
                    item.classList.remove('show');
                }
            });
        }

        // Add Listeners
        searchBar.addEventListener('input', filterApps);
        if (showGames) showGames.addEventListener('change', filterApps);
        if (showUtilities) showUtilities.addEventListener('change', filterApps);
    }

});
