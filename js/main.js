document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll-Triggered Animations (Reveal)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Card Flip Logic
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't flip if we click the button inside the card
            if (e.target.classList.contains('read-more-btn')) return;
            this.classList.toggle('is-flipped');
        });
    });

    // 3. Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show/Hide items
            featureItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Small timeout ensures the fade-in transition plays correctly
                    setTimeout(() => item.classList.add('visible'), 10);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible');
                }
            });
        });
    });
});
