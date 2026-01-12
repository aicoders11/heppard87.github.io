document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCROLL REVEAL ANIMATION ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 2. CARD FLIP LOGIC ---
    // Selects all cards with the 'feature-item' class
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent flipping if they click the "Read More" button directly
            if (e.target.classList.contains('read-more-btn')) return;
            
            // Toggle the flip class
            this.classList.toggle('is-flipped');
        });
    });

    // --- 3. FILTER BUTTONS LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'blue',
    shape:  'rect',
    label:  'paypal'
  }
}).render('#paypal-button-container');
                // Update active button style
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Show/Hide items based on category
                featureItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        // Small delay to allow the display:block to apply before animating opacity
                        setTimeout(() => item.classList.add('visible'), 10);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('visible');
                    }
                });
            });
        });
    }
});
